import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeCartItem } from '../../utils/serializers.js';

export const cartRouter = express.Router();
cartRouter.use(requireAuth);

const includeProduct = { product: { include: { category: true } } };

const cartResponse = async (userId) => {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: includeProduct,
    orderBy: { createdAt: 'desc' }
  });
  const serialized = items.map(serializeCartItem);
  return {
    items: serialized,
    subtotal: serialized.reduce((sum, item) => sum + item.itemTotal, 0),
    itemCount: serialized.reduce((sum, item) => sum + item.quantity, 0)
  };
};

cartRouter.get('/', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await cartResponse(req.user.id) });
}));

cartRouter.post('/items', validate(z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.coerce.number().int().positive().default(1),
    selectedSize: z.string().min(1),
    selectedColor: z.object({
      name: z.string().min(1),
      hex: z.string().min(1)
    })
  })
})), asyncHandler(async (req, res) => {
  const { productId, quantity, selectedSize, selectedColor } = req.validated.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.stock <= 0) throw new ApiError(400, 'Product is out of stock');

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId_selectedSize_selectedColorName: {
        userId: req.user.id,
        productId,
        selectedSize,
        selectedColorName: selectedColor.name
      }
    }
  });
  const nextQty = (existing?.quantity || 0) + quantity;
  if (nextQty > product.stock) throw new ApiError(400, 'Requested quantity exceeds available stock');

  await prisma.cartItem.upsert({
    where: {
      userId_productId_selectedSize_selectedColorName: {
        userId: req.user.id,
        productId,
        selectedSize,
        selectedColorName: selectedColor.name
      }
    },
    update: { quantity: nextQty, selectedColorHex: selectedColor.hex },
    create: {
      userId: req.user.id,
      productId,
      selectedSize,
      selectedColorName: selectedColor.name,
      selectedColorHex: selectedColor.hex,
      quantity
    }
  });

  res.status(201).json({ success: true, data: await cartResponse(req.user.id) });
}));

cartRouter.put('/items/:productId', validate(z.object({
  params: z.object({ productId: z.string().uuid() }),
  body: z.object({
    quantity: z.coerce.number().int().positive(),
    selectedSize: z.string().optional(),
    selectedColorName: z.string().optional()
  })
})), asyncHandler(async (req, res) => {
  const where = {
    userId: req.user.id,
    productId: req.validated.params.productId,
    ...(req.validated.body.selectedSize ? { selectedSize: req.validated.body.selectedSize } : {}),
    ...(req.validated.body.selectedColorName ? { selectedColorName: req.validated.body.selectedColorName } : {})
  };
  const item = await prisma.cartItem.findFirst({ where, include: { product: true } });
  if (!item) throw new ApiError(404, 'Cart item not found');
  if (req.validated.body.quantity > item.product.stock) throw new ApiError(400, 'Requested quantity exceeds available stock');

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: req.validated.body.quantity }
  });
  res.json({ success: true, data: await cartResponse(req.user.id) });
}));

cartRouter.delete('/items/:productId', validate(z.object({
  params: z.object({ productId: z.string().uuid() }),
  query: z.object({
    selectedSize: z.string().optional(),
    selectedColorName: z.string().optional()
  })
})), asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: {
      userId: req.user.id,
      productId: req.validated.params.productId,
      ...(req.validated.query.selectedSize ? { selectedSize: req.validated.query.selectedSize } : {}),
      ...(req.validated.query.selectedColorName ? { selectedColorName: req.validated.query.selectedColorName } : {})
    }
  });
  res.json({ success: true, data: await cartResponse(req.user.id) });
}));

cartRouter.delete('/', asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ success: true, data: await cartResponse(req.user.id) });
}));
