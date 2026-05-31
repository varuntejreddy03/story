import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdmin, requireAuth } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { serializeProduct } from '../../utils/serializers.js';
import { uniqueSlug } from '../../utils/slugify.js';
import { uploadBufferToLocal } from '../../utils/localUpload.js';

export const productsRouter = express.Router();
export const adminProductsRouter = express.Router();

const listSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'discount']).optional(),
    inStockOnly: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20)
  })
});

const productBody = z.object({
  name: z.string().min(1),
  categoryId: z.string().uuid().optional().nullable(),
  categorySlug: z.string().optional(),
  description: z.string().optional().default(''),
  price: z.coerce.number().positive(),
  discountedPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  sku: z.string().optional().nullable(),
  isActive: z.coerce.boolean().optional().default(true),
  location: z.string().optional().default('Mumbai Hub'),
  images: z.union([z.array(z.string().url()), z.string()]).optional(),
  sizes: z.union([z.array(z.string()), z.string()]).optional(),
  colors: z.union([z.array(z.object({ name: z.string(), hex: z.string() })), z.string()]).optional(),
  details: z.union([z.array(z.string()), z.string()]).optional(),
  composition: z.string().optional(),
  care: z.string().optional()
});

const createSchema = z.object({ body: productBody });
const updateSchema = z.object({ params: z.object({ id: z.string().uuid() }), body: productBody.partial() });
const stockSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ stock: z.coerce.number().int().min(0) })
});

const parseMaybeJson = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const resolveCategoryId = async ({ categoryId, categorySlug }) => {
  if (categoryId) return categoryId;
  if (!categorySlug) return undefined;
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  return category?.id;
};

const normalizeProductInput = async (body, files = []) => {
  const uploadedImages = files.length
    ? await Promise.all(files.map((file) => uploadBufferToLocal(file, 'products')))
    : [];
  const hasBodyImages = body.images !== undefined && body.images !== null && body.images !== '';
  const bodyImages = hasBodyImages ? parseMaybeJson(body.images, []) : undefined;
  const images = hasBodyImages || uploadedImages.length
    ? [...(bodyImages || []), ...uploadedImages]
    : undefined;

  return {
    categoryId: await resolveCategoryId(body),
    name: body.name,
    slug: body.name ? uniqueSlug(body.name) : undefined,
    description: body.description,
    images,
    secondaryImage: body.secondaryImage,
    details: parseMaybeJson(body.details, undefined),
    composition: body.composition,
    care: body.care,
    sizes: parseMaybeJson(body.sizes, undefined),
    colors: parseMaybeJson(body.colors, undefined),
    price: body.price,
    discountedPrice: body.discountedPrice,
    stock: body.stock,
    sku: body.sku,
    isActive: body.isActive,
    location: body.location
  };
};

productsRouter.get('/', validate(listSchema), asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, sort, inStockOnly, page, limit } = req.validated.query;
  const where = {
    isActive: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    } : {}),
    ...(inStockOnly ? { stock: { gt: 0 } } : {})
  };

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {})
    };
  }

  const orderBy = sort === 'price_asc' ? { price: 'asc' }
    : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'discount' ? { discountedPrice: 'asc' }
        : { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.product.count({ where })
  ]);

  res.json({
    success: true,
    data: products.map(serializeProduct),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

productsRouter.get('/:slug', asyncHandler(async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, isActive: true },
    include: { category: true }
  });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: serializeProduct(product) });
}));

adminProductsRouter.use(requireAuth, requireAdmin);

adminProductsRouter.get('/', asyncHandler(async (_req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: products.map(serializeProduct) });
}));

adminProductsRouter.post('/', upload.array('images', 8), validate(createSchema), asyncHandler(async (req, res) => {
  const data = await normalizeProductInput(req.validated.body, req.files || []);
  const product = await prisma.product.create({
    data,
    include: { category: true }
  });
  res.status(201).json({ success: true, data: serializeProduct(product) });
}));

adminProductsRouter.put('/:id', upload.array('images', 8), validate(updateSchema), asyncHandler(async (req, res) => {
  const data = await normalizeProductInput(req.validated.body, req.files || []);
  if (!req.validated.body.name) delete data.slug;
  Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

  const product = await prisma.product.update({
    where: { id: req.validated.params.id },
    data,
    include: { category: true }
  });
  res.json({ success: true, data: serializeProduct(product) });
}));

adminProductsRouter.patch('/:id/stock', validate(stockSchema), asyncHandler(async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.validated.params.id },
    data: { stock: req.validated.body.stock },
    include: { category: true }
  });
  res.json({ success: true, data: serializeProduct(product) });
}));

adminProductsRouter.delete('/:id', validate(z.object({ params: z.object({ id: z.string().uuid() }) })), asyncHandler(async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.validated.params.id },
    data: { isActive: false },
    include: { category: true }
  });
  res.json({ success: true, data: serializeProduct(product) });
}));
