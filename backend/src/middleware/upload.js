import multer from 'multer';

// Memory storage — files stay in buffer for processing then written to organized folders
// For VPS: this is fine up to ~50MB concurrent uploads. Beyond that, switch to disk storage.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 12 // max 12 files per request (4 images + secondary + bulk headroom)
  },
  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed'));
    }
  }
});

// Bulk upload config for registering multiple products at once
export const bulkUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 40 // up to 10 products × 4 images in one bulk request
  },
  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
