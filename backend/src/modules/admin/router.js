import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdmin, requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { serializeUser } from '../../utils/serializers.js';
import { toNumber } from '../../utils/money.js';

export const adminRouter = express.Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/dashboard/stats', asyncHandler(async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const [orders, products, users, lowStockProducts] = await Promise.all([
    prisma.order.findMany({ where: { paymentStatus: 'paid' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } })
  ]);

  const revenue = (since) => orders
    .filter((order) => !since || order.createdAt >= since)
    .reduce((sum, order) => sum + toNumber(order.total), 0);

  res.json({
    success: true,
    data: {
      revenue: {
        today: revenue(startOfToday),
        month: revenue(startOfMonth),
        allTime: revenue()
      },
      orders: {
        total: orders.length,
        today: orders.filter((order) => order.createdAt >= startOfToday).length,
        month: orders.filter((order) => order.createdAt >= startOfMonth).length
      },
      products,
      users,
      lowStockProducts
    }
  });
}));

adminRouter.get('/users', validate(z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20)
  })
})), asyncHandler(async (req, res) => {
  const { search, page, limit } = req.validated.query;
  const where = search ? {
    OR: [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ]
  } : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.user.count({ where })
  ]);
  res.json({
    success: true,
    data: users.map(serializeUser),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}));

adminRouter.patch('/users/:id/status', validate(z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ isActive: z.coerce.boolean() })
})), asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.validated.params.id },
    data: { isActive: req.validated.body.isActive }
  });
  res.json({ success: true, data: serializeUser(user) });
}));

adminRouter.get('/payments', asyncHandler(async (_req, res) => {
  const transactions = await prisma.paymentTransaction.findMany({
    include: { order: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({
    success: true,
    data: transactions.map((txn) => ({
      id: txn.gatewayId || txn.id,
      orderId: txn.order?.publicId || txn.orderId,
      date: txn.createdAt,
      amount: toNumber(txn.amount),
      currency: txn.currency,
      method: txn.method || 'Razorpay',
      status: txn.status
    }))
  });
}));
