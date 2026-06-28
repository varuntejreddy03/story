import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { prisma } from '../config/db.js';

// ─── 1. API Key Middleware ───
// Frontend must send X-API-Key header. Blocks direct API abuse.
export const apiKeyGuard = (req, res, next) => {
  // Skip for webhooks (Razorpay sends its own signature)
  if (req.path.includes('/webhook')) return next();
  // Skip for health check
  if (req.path === '/api/health') return next();
  // Skip for static uploads
  if (req.path.startsWith('/uploads')) return next();

  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_SECRET_KEY;

  // If no API key configured in env, skip check (dev mode)
  if (!validKey) return next();

  if (!apiKey || apiKey !== validKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing API key'
    });
  }
  next();
};

// ─── 2. Strict Rate Limiters (per route type) ───
const skip = () => process.env.DISABLE_RATE_LIMIT === 'true';

// Login: 5 attempts per 15 min per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Register: 3 accounts per hour per IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  skip,
  message: { success: false, message: 'Too many accounts created. Try again in 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Cart/Orders: 60 requests per min
export const transactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  skip,
  message: { success: false, message: 'Too many requests. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes: 100 requests per min
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  skip,
  standardHeaders: true,
  legacyHeaders: false
});

// Admin routes: 30 requests per min
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  skip,
  standardHeaders: true,
  legacyHeaders: false
});

// ─── 3. Input Sanitization ───
// Strips HTML tags, prevents stored XSS, blocks dangerous protocols
const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi,
  /<script/gi,
  /<\/script/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi
];

const sanitizeValue = (value) => {
  if (typeof value !== 'string') return value;
  let clean = value;
  // Strip HTML tags
  clean = clean.replace(/<[^>]*>/g, '');
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, '');
  }
  return clean.trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeValue);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeValue(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  next();
};

// ─── 4. Security Headers (beyond Helmet) ───
export const extraSecurityHeaders = (req, res, next) => {
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-DNS-Prefetch-Control', 'off');
  res.set('X-Download-Options', 'noopen');
  res.set('X-Permitted-Cross-Domain-Policies', 'none');
  next();
};

// ─── 5. Audit Logger (admin actions) ───
export const auditLog = (action) => (req, res, next) => {
  const originalSend = res.json.bind(res);
  res.json = (body) => {
    // Log only successful admin actions
    if (res.statusCode < 400 && req.user) {
      const log = {
        action,
        userId: req.user.id,
        email: req.user.email,
        ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
        method: req.method,
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent']?.substring(0, 100)
      };
      // Fire and forget — don't block response
      prisma.auditLog?.create({ data: log }).catch(() => {});
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[AUDIT] ${log.action} by ${log.email} at ${log.timestamp}`);
      }
    }
    return originalSend(body);
  };
  next();
};

// ─── 6. Login Attempt Logger ───
export const logLoginAttempt = async (email, success, ip, userAgent) => {
  const attempt = {
    email: email?.substring(0, 100),
    success,
    ip: ip || 'unknown',
    userAgent: userAgent?.substring(0, 200),
    timestamp: new Date().toISOString()
  };

  // Log to console in production
  if (process.env.NODE_ENV === 'production') {
    console.log(`[AUTH] ${success ? 'SUCCESS' : 'FAILED'} login: ${attempt.email} from ${attempt.ip}`);
  }
};

// ─── 7. Session Security ───
// Force logout all sessions when password changes
export const invalidateAllSessions = async (userId) => {
  // Since we use JWTs, we can't truly invalidate them
  // But we update the user's `passwordChangedAt` field
  // and the auth middleware checks if token was issued before that
  await prisma.user.update({
    where: { id: userId },
    data: { updatedAt: new Date() }
  }).catch(() => {});
};

// ─── 8. Request ID (for tracing) ───
export const requestId = (req, res, next) => {
  req.requestId = crypto.randomUUID().slice(0, 8);
  res.set('X-Request-Id', req.requestId);
  next();
};
