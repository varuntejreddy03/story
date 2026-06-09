import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdminAuth, requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { toNumber } from '../../utils/money.js';

export const couponsRouter = express.Router();
export const adminCouponsRouter = express.Router();

const serializeCoupon = (coupon) => ({
  id: coupon.id,
  code: coupon.code,
  type: coupon.type,
  value: toNumber(coupon.value),
  minOrderValue: toNumber(coupon.minOrderValue),
  maxDiscount: coupon.maxDiscount ? toNumber(coupon.maxDiscount) : null,
  usageLimit: coupon.usageLimit,
  usedCount: coupon.usedCount,
  status: coupon.isActive ? 'Active' : 'Expired',
  isActive: coupon.isActive,
  expiresAt: coupon.expiresAt,
  discountText: coupon.type === 'flat'
    ? `Flat INR ${toNumber(coupon.value)} Off`
    : `${toNumber(coupon.value)}% Off`,
  description: `Minimum order INR ${toNumber(coupon.minOrderValue)}.`,
  usageUsed: coupon.usedCount,
  expiryDate: coupon.expiresAt ? coupon.expiresAt.toISOString().slice(0, 10) : 'No Expiry'
});

const validateCouponForSubtotal = (coupon, subtotal) => {
  if (!coupon || !coupon.isActive) return { valid: false, reason: 'Invalid coupon code' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, reason: 'Coupon expired' };
  if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  if (subtotal < toNumber(coupon.minOrderValue)) {
    return { valid: false, reason: `Minimum order INR ${toNumber(coupon.minOrderValue)} required` };
  }

  let discount = coupon.type === 'flat'
    ? Math.min(toNumber(coupon.value), subtotal)
    : subtotal * (toNumber(coupon.value) / 100);
  if (coupon.type === 'percentage' && coupon.maxDiscount) {
    discount = Math.min(discount, toNumber(coupon.maxDiscount));
  }

  return {
    valid: true,
    code: coupon.code,
    type: coupon.type,
    discount,
    finalSubtotal: subtotal - discount
  };
};

couponsRouter.post('/validate', requireAuth, validate(z.object({
  body: z.object({
    code: z.string().min(1),
    subtotal: z.coerce.number().min(0)
  })
})), asyncHandler(async (req, res) => {
  const { code, subtotal } = req.validated.body;
  const coupon = await prisma.coupon.findFirst({
    where: { code: code.trim().toUpperCase() }
  });
  res.json({ success: true, data: validateCouponForSubtotal(coupon, subtotal) });
}));

adminCouponsRouter.use(requireAdminAuth);

adminCouponsRouter.get('/', asyncHandler(async (_req, res) => {
  const coupons = await prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: coupons.map(serializeCoupon) });
}));

adminCouponsRouter.post('/', validate(z.object({
  body: z.object({
    code: z.string().min(1),
    type: z.enum(['percentage', 'flat']).default('percentage'),
    value: z.coerce.number().positive(),
    minOrderValue: z.coerce.number().min(0).default(0),
    maxDiscount: z.coerce.number().positive().optional().nullable(),
    usageLimit: z.coerce.number().int().positive().optional().nullable(),
    isActive: z.coerce.boolean().optional().default(true),
    expiresAt: z.string().datetime().optional().nullable()
  })
})), asyncHandler(async (req, res) => {
  const body = req.validated.body;
  const coupon = await prisma.coupon.create({
    data: {
      ...body,
      code: body.code.trim().toUpperCase(),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
    }
  });
  res.status(201).json({ success: true, data: serializeCoupon(coupon) });
}));

adminCouponsRouter.put('/:id', validate(z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    code: z.string().min(1).optional(),
    type: z.enum(['percentage', 'flat']).optional(),
    value: z.coerce.number().positive().optional(),
    minOrderValue: z.coerce.number().min(0).optional(),
    maxDiscount: z.coerce.number().positive().optional().nullable(),
    usageLimit: z.coerce.number().int().positive().optional().nullable(),
    isActive: z.coerce.boolean().optional(),
    expiresAt: z.string().datetime().optional().nullable()
  })
})), asyncHandler(async (req, res) => {
  const data = { ...req.validated.body };
  if (data.code) data.code = data.code.trim().toUpperCase();
  if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);
  const coupon = await prisma.coupon.update({
    where: { id: req.validated.params.id },
    data
  });
  res.json({ success: true, data: serializeCoupon(coupon) });
}));

adminCouponsRouter.delete('/:id', validate(z.object({ params: z.object({ id: z.string().uuid() }) })), asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.update({
    where: { id: req.validated.params.id },
    data: { isActive: false }
  });
  res.json({ success: true, data: serializeCoupon(coupon) });
}));
