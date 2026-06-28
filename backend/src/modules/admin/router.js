import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { serializeOrder, serializeUser } from '../../utils/serializers.js';
import { toNumber } from '../../utils/money.js';

export const adminRouter = express.Router();
adminRouter.use(requireAdminAuth);

const serializeAdminOrderSummary = (order) => ({
  ...serializeOrder(order),
  customerName: order.user
    ? `${order.user.firstName}${order.user.lastName ? ` ${order.user.lastName}` : ''}`
    : order.addressSnapshot?.fullName || order.addressSnapshot?.name || 'STORY Client',
  customerEmail: order.user?.email || '',
  amount: toNumber(order.total),
  paymentStatus: order.paymentStatus,
  fulfillmentStatus: order.status
});

adminRouter.get('/dashboard/stats', asyncHandler(async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const [
    todayRevenue,
    monthRevenue,
    allTimeRevenue,
    totalOrders,
    todayOrders,
    monthOrders,
    products,
    users,
    lowStockProducts,
    recentOrders
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: 'paid', createdAt: { gte: startOfToday } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'paid', createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'paid' }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.product.count({ where: { stock: { lt: 5 }, isActive: true } }),
    prisma.order.findMany({
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  res.json({
    success: true,
    data: {
      revenue: {
        today: toNumber(todayRevenue._sum.total),
        month: toNumber(monthRevenue._sum.total),
        allTime: toNumber(allTimeRevenue._sum.total)
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        month: monthOrders
      },
      products,
      users,
      lowStockProducts,
      recentOrders: recentOrders.map(serializeAdminOrderSummary)
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
  const where = {
    role: { not: 'admin' },
    ...(search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {})
  };
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
