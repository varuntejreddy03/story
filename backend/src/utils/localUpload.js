import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const uploadsRoot = path.join(backendRoot, 'uploads');
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

const extensionFor = (file) => {
  const originalExt = path.extname(file.originalname || '').toLowerCase();
  if (originalExt) return originalExt;

  const mimeExt = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif'
  };

  return mimeExt[file.mimetype] || '.jpg';
};

const folderSegments = (folder) => String(folder || 'general')
  .replace(/^story-india[\\/ -]*/i, '')
  .split(/[\\/]+/)
  .map((segment) => segment.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))
  .filter(Boolean);

export const uploadBufferToLocal = async (file, folder = 'general') => {
  if (!file?.buffer) throw new ApiError(400, 'Image file is required');
  if (!allowedTypes.has(file.mimetype)) throw new ApiError(400, 'Only image files are allowed');

  const segments = folderSegments(folder);
  const targetDir = path.join(uploadsRoot, ...segments);
  await fs.mkdir(targetDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomUUID()}${extensionFor(file)}`;
  await fs.writeFile(path.join(targetDir, filename), file.buffer);

  const publicPath = ['uploads', ...segments, filename].join('/');
  return `${env.publicApiUrl.replace(/\/$/, '')}/${publicPath}`;
};
