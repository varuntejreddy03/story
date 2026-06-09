import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeUser } from '../../utils/serializers.js';
import {
  clearAdminAuthCookie,
  clearAuthCookie,
  requireAdminAuth,
  requireAuth,
  setAdminAuthCookie,
  setAuthCookie,
  signToken
} from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { sendEmail } from '../../utils/sendEmail.js';

export const authRouter = express.Router();

const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().optional().default(''),
    email: z.string().email(),
    phone: z.string().min(6),
    password: z.string().min(6)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

const googleSchema = z.object({
  body: z.object({
    idToken: z.string().min(20)
  })
});

const forgotSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});

const resetSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(4),
    newPassword: z.string().min(6)
  })
});

const issueSession = (res, user) => {
  const token = signToken(user);
  setAuthCookie(res, token);
  return token;
};

const issueAdminSession = (res, user) => {
  const token = signToken(user);
  setAdminAuthCookie(res, token);
  return token;
};

authRouter.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.validated.body;
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      passwordHash
    }
  });

  const token = issueSession(res, user);
  res.status(201).json({ success: true, data: { user: serializeUser(user), token } });
}));

authRouter.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.passwordHash) throw new ApiError(401, 'Invalid email or password');
  if (!user.isActive) throw new ApiError(403, 'Account is disabled');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new ApiError(401, 'Invalid email or password');

  const token = issueSession(res, user);
  res.json({ success: true, data: { user: serializeUser(user), token } });
}));

authRouter.post('/admin/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.passwordHash) throw new ApiError(401, 'Invalid email or password');
  if (!user.isActive) throw new ApiError(403, 'Account is disabled');
  if (user.role !== 'admin') throw new ApiError(403, 'This account does not have admin access.');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new ApiError(401, 'Invalid email or password');

  const token = issueAdminSession(res, user);
  res.json({ success: true, data: { user: serializeUser(user), token } });
}));

authRouter.post('/admin/logout', asyncHandler(async (_req, res) => {
  clearAdminAuthCookie(res);
  res.json({ success: true, data: { loggedOut: true } });
}));

authRouter.get('/admin/me', requireAdminAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ success: true, data: { user: serializeUser(user) } });
}));

authRouter.get('/google/config', asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      clientId: env.googleClientId || ''
    }
  });
}));

authRouter.post('/google', validate(googleSchema), asyncHandler(async (req, res) => {
  if (!env.googleClientId) throw new ApiError(500, 'Google OAuth is not configured');

  const client = new OAuth2Client(env.googleClientId);
  const ticket = await client.verifyIdToken({
    idToken: req.validated.body.idToken,
    audience: env.googleClientId
  });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload?.sub) throw new ApiError(401, 'Invalid Google token');

  const email = payload.email.toLowerCase();
  const names = String(payload.name || email.split('@')[0]).split(' ');
  const firstName = names.shift() || 'Story';
  const lastName = names.join(' ');

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleSub: payload.sub },
        { email }
      ]
    }
  });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleSub: user.googleSub || payload.sub }
    });
  } else {
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        googleSub: payload.sub
      }
    });
  }

  if (!user.isActive) throw new ApiError(403, 'Account is disabled');
  const token = issueSession(res, user);
  res.json({ success: true, data: { user: serializeUser(user), token } });
}));

authRouter.post('/logout', requireAuth, asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, data: { loggedOut: true } });
}));

authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ success: true, data: { user: serializeUser(user) } });
}));

authRouter.post('/forgot-password', validate(forgotSchema), asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.validated.body.email.toLowerCase() } });
  if (user) {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const token = await bcrypt.hash(otp, 12);
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });
    await sendEmail({
      to: user.email,
      subject: 'Your STORY India recovery code',
      text: `Your STORY India recovery code is ${otp}. It expires in 15 minutes.`
    });
  }

  res.json({ success: true, data: { message: 'If this email exists, a recovery code has been sent.' } });
}));

authRouter.post('/reset-password', validate(resetSchema), asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.validated.body;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      passwordResetTokens: {
        where: { used: false, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });
  if (!user) throw new ApiError(400, 'Invalid or expired recovery code');

  const token = await user.passwordResetTokens.reduce(async (matchPromise, candidate) => {
    const existing = await matchPromise;
    if (existing) return existing;
    return (await bcrypt.compare(otp, candidate.token)) ? candidate : null;
  }, Promise.resolve(null));
  if (!token) throw new ApiError(400, 'Invalid or expired recovery code');

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(newPassword, 12) }
    }),
    prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { used: true }
    })
  ]);

  res.json({ success: true, data: { reset: true } });
}));
