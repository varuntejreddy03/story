import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const reviewsRouter = express.Router();
export const adminReviewsRouter = express.Router();

const serializeReview = (review) => ({
  id: review.id,
  name: review.name,
  tag: review.tag,
  rating: review.rating,
  review: review.review,
  status: review.status,
  createdAt: review.createdAt
});

const reviewBody = z.object({
  name: z.string().trim().min(1).max(80).default('STORY Customer'),
  tag: z.string().trim().max(80).optional().default('VERIFIED PURCHASE'),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  review: z.string().trim().min(3).max(800)
});

reviewsRouter.get('/', asyncHandler(async (_req, res) => {
  const reviews = await prisma.customerReview.findMany({
    where: { status: 'approved' },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  res.json({ success: true, data: reviews.map(serializeReview) });
}));

reviewsRouter.post('/', validate(z.object({ body: reviewBody })), asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const review = await prisma.customerReview.create({
    data: {
      ...payload,
      tag: (payload.tag || 'VERIFIED PURCHASE').toUpperCase(),
      status: 'pending'
    }
  });
  res.status(201).json({ success: true, data: serializeReview(review) });
}));

adminReviewsRouter.use(requireAdminAuth);

adminReviewsRouter.get('/', asyncHandler(async (_req, res) => {
  const reviews = await prisma.customerReview.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  res.json({ success: true, data: reviews.map(serializeReview) });
}));

adminReviewsRouter.patch('/:id/status', validate(z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ status: z.enum(['pending', 'approved', 'rejected']) })
})), asyncHandler(async (req, res) => {
  const review = await prisma.customerReview.update({
    where: { id: req.validated.params.id },
    data: { status: req.validated.body.status }
  });
  res.json({ success: true, data: serializeReview(review) });
}));

adminReviewsRouter.delete('/:id', validate(z.object({
  params: z.object({ id: z.string().uuid() })
})), asyncHandler(async (req, res) => {
  const review = await prisma.customerReview.delete({
    where: { id: req.validated.params.id }
  });
  res.json({ success: true, data: serializeReview(review) });
}));
