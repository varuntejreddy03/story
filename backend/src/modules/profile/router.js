import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeAddress, serializeUser } from '../../utils/serializers.js';

export const profileRouter = express.Router();
profileRouter.use(requireAuth);

const addressBody = z.object({
  label: z.string().optional().default('Home'),
  name: z.string().min(1),
  phone: z.string().min(6),
  line1: z.string().min(1),
  line2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4),
  country: z.string().optional().default('India'),
  isDefault: z.coerce.boolean().optional().default(false)
});

profileRouter.get('/', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ success: true, data: serializeUser(user) });
}));

profileRouter.put('/', validate(z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    newsletter: z.coerce.boolean().optional(),
    language: z.string().optional()
  })
})), asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: req.validated.body
  });
  res.json({ success: true, data: serializeUser(user) });
}));

profileRouter.put('/password', validate(z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6)
  })
})), asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user?.passwordHash) throw new ApiError(400, 'Password login is not enabled for this account');
  const ok = await bcrypt.compare(req.validated.body.currentPassword, user.passwordHash);
  if (!ok) throw new ApiError(400, 'Current password is incorrect');
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(req.validated.body.newPassword, 12) }
  });
  res.json({ success: true, data: { changed: true } });
}));

profileRouter.get('/addresses', asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
  });
  res.json({ success: true, data: addresses.map(serializeAddress) });
}));

profileRouter.post('/addresses', validate(z.object({ body: addressBody })), asyncHandler(async (req, res) => {
  const data = req.validated.body;
  const address = await prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    return tx.address.create({ data: { ...data, userId: req.user.id } });
  });
  res.status(201).json({ success: true, data: serializeAddress(address) });
}));

profileRouter.put('/addresses/:id', validate(z.object({
  params: z.object({ id: z.string().uuid() }),
  body: addressBody.partial()
})), asyncHandler(async (req, res) => {
  const existing = await prisma.address.findFirst({ where: { id: req.validated.params.id, userId: req.user.id } });
  if (!existing) throw new ApiError(404, 'Address not found');
  const address = await prisma.$transaction(async (tx) => {
    if (req.validated.body.isDefault) {
      await tx.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    return tx.address.update({
      where: { id: existing.id },
      data: req.validated.body
    });
  });
  res.json({ success: true, data: serializeAddress(address) });
}));

profileRouter.delete('/addresses/:id', validate(z.object({ params: z.object({ id: z.string().uuid() }) })), asyncHandler(async (req, res) => {
  await prisma.address.deleteMany({ where: { id: req.validated.params.id, userId: req.user.id } });
  res.json({ success: true, data: { deleted: true } });
}));

profileRouter.patch('/addresses/:id/default', validate(z.object({ params: z.object({ id: z.string().uuid() }) })), asyncHandler(async (req, res) => {
  const existing = await prisma.address.findFirst({ where: { id: req.validated.params.id, userId: req.user.id } });
  if (!existing) throw new ApiError(404, 'Address not found');
  const address = await prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    return tx.address.update({ where: { id: existing.id }, data: { isDefault: true } });
  });
  res.json({ success: true, data: serializeAddress(address) });
}));
