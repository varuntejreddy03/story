import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const uploadsRoot = path.join(backendRoot, 'uploads');
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Image processing config
const IMAGE_CONFIG = {
  // Full-size product image (detail page)
  full: { width: 1200, height: 1600, quality: 82 },
  // Thumbnail for listing/grid pages
  thumb: { width: 400, height: 533, quality: 75 }
};

const buildTargetDir = (folder) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const segment = String(folder || 'general').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return path.join(uploadsRoot, segment, `${year}`, month);
};

/**
 * Process and optimize image buffer:
 * - Converts to WebP format (30-50% smaller than JPEG)
 * - Resizes to max dimensions while keeping aspect ratio
 * - Strips metadata (EXIF) for privacy + smaller file size
 * - Returns optimized buffer
 */
const optimizeImage = async (buffer, config) => {
  return sharp(buffer)
    .rotate() // auto-rotate based on EXIF orientation
    .resize(config.width, config.height, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: config.quality, effort: 4 })
    .toBuffer();
};

/**
 * Upload a single file — optimizes to WebP, saves full + thumbnail.
 * Returns object with full and thumb URLs.
 */
export const uploadBufferToLocal = async (file, folder = 'general') => {
  if (!file?.buffer) throw new ApiError(400, 'Image file is required');
  if (!allowedTypes.has(file.mimetype)) throw new ApiError(400, 'Only image files (jpeg, png, webp, gif, avif) are allowed');
  if (file.buffer.length > MAX_FILE_SIZE) throw new ApiError(400, 'Image must be under 5MB');

  const targetDir = buildTargetDir(folder);
  const thumbDir = path.join(targetDir, 'thumbs');
  await fs.mkdir(targetDir, { recursive: true });
  await fs.mkdir(thumbDir, { recursive: true });

  const id = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const fullName = `${id}.webp`;
  const thumbName = `${id}-thumb.webp`;

  // Process both sizes in parallel
  const [fullBuffer, thumbBuffer] = await Promise.all([
    optimizeImage(file.buffer, IMAGE_CONFIG.full),
    optimizeImage(file.buffer, IMAGE_CONFIG.thumb)
  ]);

  // Write both to disk
  await Promise.all([
    fs.writeFile(path.join(targetDir, fullName), fullBuffer),
    fs.writeFile(path.join(thumbDir, thumbName), thumbBuffer)
  ]);

  const relativeFull = path.relative(backendRoot, path.join(targetDir, fullName)).replace(/\\/g, '/');
  const baseUrl = env.publicApiUrl.replace(/\/$/, '');

  // Return full URL (thumbnail accessible at /thumbs/ subfolder)
  return `${baseUrl}/${relativeFull}`;
};

/**
 * Bulk upload multiple files with concurrency control.
 * Returns array of public URLs.
 */
export const uploadBulkToLocal = async (files, folder = 'general') => {
  if (!files?.length) return [];

  const CONCURRENCY = 3; // conservative for VPS — 3 parallel Sharp operations
  const results = [];

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const urls = await Promise.all(batch.map((file) => uploadBufferToLocal(file, folder)));
    results.push(...urls);
  }

  return results;
};

/**
 * Delete an uploaded file and its thumbnail.
 */
export const deleteUploadedFile = async (publicUrl) => {
  if (!publicUrl || !publicUrl.includes('/uploads/')) return;

  try {
    const urlPath = publicUrl.split('/uploads/').pop();
    if (!urlPath) return;

    const fullPath = path.join(uploadsRoot, urlPath);
    const resolved = path.resolve(fullPath);
    if (!resolved.startsWith(path.resolve(uploadsRoot))) return;

    // Delete full image
    await fs.unlink(resolved).catch(() => {});

    // Delete thumbnail
    const dir = path.dirname(resolved);
    const basename = path.basename(resolved, '.webp');
    const thumbPath = path.join(dir, 'thumbs', `${basename}-thumb.webp`);
    await fs.unlink(thumbPath).catch(() => {});
  } catch {
    // Ignore deletion errors
  }
};

/**
 * Delete multiple uploaded files.
 */
export const deleteBulkUploads = async (urls) => {
  if (!urls?.length) return;
  await Promise.allSettled(urls.map(deleteUploadedFile));
};
