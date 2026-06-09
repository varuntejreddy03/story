import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const contactRouter = express.Router();
export const adminContactRouter = express.Router();

const serializeContactRequest = (request) => ({
  id: request.id,
  name: request.name,
  email: request.email,
  phone: request.phone || '',
  topic: request.topic,
  message: request.message,
  status: request.status,
  createdAt: request.createdAt
});

contactRouter.post('/', validate(z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180),
    phone: z.string().trim().max(40).optional().or(z.literal('')),
    topic: z.string().trim().min(2).max(80),
    message: z.string().trim().min(5).max(2000)
  })
})), asyncHandler(async (req, res) => {
  const request = await prisma.contactRequest.create({
    data: {
      name: req.validated.body.name,
      email: req.validated.body.email,
      phone: req.validated.body.phone || null,
      topic: req.validated.body.topic,
      message: req.validated.body.message
    }
  });

  res.status(201).json({ success: true, data: serializeContactRequest(request) });
}));

adminContactRouter.use(requireAdminAuth);

adminContactRouter.get('/', asyncHandler(async (_req, res) => {
  const requests = await prisma.contactRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  res.json({ success: true, data: requests.map(serializeContactRequest) });
}));

adminContactRouter.patch('/:id/status', validate(z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ status: z.enum(['new', 'reviewing', 'closed']) })
})), asyncHandler(async (req, res) => {
  const request = await prisma.contactRequest.update({
    where: { id: req.validated.params.id },
    data: { status: req.validated.body.status }
  });
  res.json({ success: true, data: serializeContactRequest(request) });
}));
