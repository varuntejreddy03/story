import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdmin, requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const settingsRouter = express.Router();
export const adminSettingsRouter = express.Router();

const toObject = (settings) => Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));

settingsRouter.get('/', asyncHandler(async (_req, res) => {
  const safeKeys = [
    'delivery_fee',
    'free_delivery_above',
    'gst_percentage',
    'gst_included_in_price',
    'store_name',
    'store_phone',
    'store_email',
    'razorpay_currency',
    'cod_enabled',
    'home_hero_eyebrow',
    'home_hero_title',
    'home_hero_body',
    'home_hero_primary_cta',
    'home_hero_secondary_cta',
    'home_hero_image_primary',
    'home_hero_image_secondary',
    'home_hero_image_detail',
    'home_hero_badge_eyebrow',
    'home_hero_badge_text',
    'home_products_eyebrow',
    'home_products_title',
    'home_collection_eyebrow',
    'home_collection_title',
    'home_collection_body',
    'home_collection_image',
    'home_jewelry_eyebrow',
    'home_jewelry_title',
    'home_jewelry_body',
    'home_recommendation_eyebrow',
    'home_recommendation_title'
  ];
  const settings = await prisma.setting.findMany({ where: { key: { in: safeKeys } } });
  res.json({ success: true, data: toObject(settings) });
}));

adminSettingsRouter.use(requireAuth, requireAdmin);

adminSettingsRouter.get('/', asyncHandler(async (_req, res) => {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  res.json({ success: true, data: toObject(settings) });
}));

adminSettingsRouter.put('/', validate(z.object({
  body: z.record(z.union([z.string(), z.number(), z.boolean()]))
})), asyncHandler(async (req, res) => {
  await prisma.$transaction(
    Object.entries(req.validated.body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )
  );
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  res.json({ success: true, data: toObject(settings) });
}));
