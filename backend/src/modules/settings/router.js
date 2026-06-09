import express from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const settingsRouter = express.Router();
export const adminSettingsRouter = express.Router();

const toObject = (settings) => Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
const defaultStoryCategories = [
  { key: 'uppers', label: 'Uppers', eyebrow: 'Sharp layers', description: 'Shirts, jackets, tees and layers built for polished everyday dressing.', cta: 'Shop Uppers', categories: ['TOP', 'SHIRTS', 'KNITWEAR', 'OUTERWEAR'], imageFallback: '/category/women/uppers.png', images: { men: '/category/men/uppers.png', women: '/category/women/uppers.png' } },
  { key: 'lowers', label: 'Lowers', eyebrow: 'Tailored ease', description: 'Trousers, denim and relaxed fits with clean lines and wearable structure.', cta: 'Shop Lowers', categories: ['BOTTOM'], imageFallback: '/category/women/lowers.png', images: { men: '/category/men/lowers.png', women: '/category/women/lowers.png' } },
  { key: 'dresses', label: 'Dresses', eyebrow: 'Evening lines', description: 'Statement silhouettes for women, edited for dinners, events and city days.', cta: 'Shop Dresses', categories: ['DRESSES'], imageFallback: '/category/women/dresses.png', images: { women: '/category/women/dresses.png' } },
  { key: 'co-ords', label: 'Co-ords', eyebrow: 'Matched sets', description: 'Coordinated sets that make complete styling feel intentional and effortless.', cta: 'Shop Co-ords', categories: ['CO-ORDS', 'COORDS', 'SETS'], imageFallback: '/category/women/co-ords.png', images: { men: '/category/men/co-ords.png', women: '/category/women/co-ords.png' } },
  { key: 'footwear', label: 'Footwear', eyebrow: 'Grounded polish', description: 'Sneakers, shoes and premium pairs selected to anchor the full look.', cta: 'Shop Footwear', categories: ['SHOES', 'FOOTWEAR'], imageFallback: '/category/women/footwear.png', images: { men: '/category/men/footwear.png', women: '/category/women/footwear.png' } },
  { key: 'accessories', label: 'Accessories', eyebrow: 'Finishing codes', description: 'Socks, bags and finishing details that complete the STORY wardrobe.', cta: 'Shop Accessories', categories: ['ACCESSORY', 'ACCESSORIES', 'SOCKS'], imageFallback: '/category/accessories.png', images: { default: '/category/accessories.png' }, subcategories: ['Socks'] },
  { key: 'inners', label: 'Inners', eyebrow: 'Daily foundation', description: 'Everyday comfort essentials made to sit quietly under every outfit.', cta: 'Shop Inners', categories: ['INNER', 'INNERS', 'UNDERWEAR'], imageFallback: '/category/women/inners.png', images: { men: '/category/men/inners.png', women: '/category/women/inners.png' } }
];
const defaultSettings = {
  announcement_ticker_items: 'FREE SHIPPING ON ORDERS ABOVE INR 999,SALE 20% OFF,100% AUTHENTIC BRANDED FASHION,NEW ARRIVALS EVERY WEEK,EASY RETURNS & EXCHANGES,CURATED IN INDIA FOR YOU',
  home_hero_eyebrow: 'New editorial capsule',
  home_hero_title: 'Our Latest Story',
  home_hero_body: 'Discover timeless fashion pieces crafted in India for everyday elegance.',
  home_hero_primary_cta: 'Shop Edit',
  home_hero_secondary_cta: 'View Lookbook',
  home_hero_image_primary: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85',
  home_hero_image_secondary: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  home_hero_image_detail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85',
  home_hero_image_fourth: '',
  home_hero_image_fifth: '',
  home_hero_image_sixth: '',
  home_hero_badge_eyebrow: 'Story India 2026',
  home_hero_badge_text: 'Tailored quiet luxury',
  home_products_eyebrow: 'Seasonal selection',
  home_products_title: 'Our Products',
  home_products_body: 'Explore curated essentials across clothing, footwear, and everyday luxury.',
  home_products_ids: 'wide-leg-pants,relaxed-linen-shirt,crew-neck-sweater,classic-mini-dress,canvas-tote-bag',
  home_collection_eyebrow: 'Curated combinations',
  home_collection_title: 'Perfect Match',
  home_collection_body: 'Explore curated collections designed to complement your style with comfort and confidence.',
  home_collection_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  home_collection_product_ids: '',
  discover_eyebrow: 'Our complete codes',
  discover_title: 'Collections',
  discover_search_placeholder: 'Search products, styling or releases...',
  discover_tag_label: 'Styling diary:',
  home_jewelry_eyebrow: 'Accessories edit',
  home_jewelry_title: 'Story Jewelry',
  home_jewelry_body: 'Adorn yourself with timeless accessories that complete every look.',
  home_recommendation_eyebrow: 'Selected next',
  home_recommendation_title: 'Recommendation',
  home_recommendation_ids: 'wide-leg-pants,structured-blazer,rib-knit-tank-top',
  about_eyebrow: 'About STORY India',
  about_title: 'Verified Fashion, Curated In India',
  about_intro_paragraph_1: 'STORY is a premium India-based fashion store built for people who want original branded pieces without the noise of fast, careless shopping.',
  about_intro_paragraph_2: 'We curate verified branded fashion across uppers, lowers, dresses, co-ords, footwear, accessories, and inners, with a focus on authenticity, condition, price, and everyday Indian style.',
  about_primary_cta_text: 'Shop Verified Picks',
  about_secondary_cta_text: 'View Curated Drops',
  about_image_1: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
  about_image_2: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  about_image_3: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
  about_badge_text: 'Premium branded fashion, checked, styled, and priced for modern Indian wardrobes.',
  about_stats: JSON.stringify([['2026', 'Founded'], ['7', 'Core categories'], ['100%', 'Original focus'], ['INDIA', 'Curated for']]),
  about_values_eyebrow: 'Our standard',
  about_values_title: 'Original Pieces, Clear Checks',
  about_values: JSON.stringify([
    { title: 'Authentic', text: 'Every piece is checked for brand identity, condition, finish, and everyday wearability before it enters the STORY edit.' },
    { title: 'Curated', text: 'We select branded fashion for Indian wardrobes: sharp layers, premium basics, clean footwear, and easy occasion pieces.' },
    { title: 'Value', text: 'The goal is simple: original branded fashion, better prices, and quality that feels worth returning to.' }
  ]),
  about_promise_eyebrow: 'The STORY promise',
  about_promise_title: 'Verified Authentic. Best Price. Better Quality.',
  about_promise_body: 'From first scroll to final delivery, STORY keeps the edit focused: real branded pieces, clean product presentation, reliable support, and fashion that fits Indian everyday life.',
  about_promise_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
  story_categories: JSON.stringify(defaultStoryCategories),
  privacy_policy: 'We respect your privacy and use customer information only to process orders, provide support, improve the shopping experience, and meet legal or payment requirements. We do not sell customer data. Payment information is processed securely by our payment partners.',
  terms_conditions: 'By using STORY India, you agree to provide accurate account, delivery, and payment information. Product availability, pricing, promotions, and delivery timelines may change without prior notice. Orders are confirmed only after successful payment and verification.',
  return_refund_policy: 'Returns or exchanges may be requested for eligible unused products within the return window shown at purchase. Items must be returned with tags, packaging, and invoice. Refunds are processed to the original payment method after quality check approval.',
  store_name: 'STORY India',
  store_email: 'care@story.in',
  razorpay_currency: 'INR',
  delivery_fee: '149',
  free_delivery_above: '5000',
  gst_percentage: '18',
  razorpay_active: 'true',
  online_payment_enabled: 'true',
  cod_enabled: 'false',
  razorpay_key_id: ''
};

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
    'razorpay_active',
    'online_payment_enabled',
    'razorpay_key_id',
    'cod_enabled',
    'announcement_ticker_items',
    'home_hero_eyebrow',
    'home_hero_title',
    'home_hero_body',
    'home_hero_primary_cta',
    'home_hero_secondary_cta',
    'home_hero_image_primary',
    'home_hero_image_secondary',
    'home_hero_image_detail',
    'home_hero_image_fourth',
    'home_hero_image_fifth',
    'home_hero_image_sixth',
    'home_hero_badge_eyebrow',
    'home_hero_badge_text',
    'home_products_eyebrow',
    'home_products_title',
    'home_products_body',
    'home_products_ids',
    'story_categories',
    'home_collection_eyebrow',
    'home_collection_title',
    'home_collection_body',
    'home_collection_image',
    'home_collection_product_ids',
    'discover_eyebrow',
    'discover_title',
    'discover_search_placeholder',
    'discover_tag_label',
    'home_jewelry_eyebrow',
    'home_jewelry_title',
    'home_jewelry_body',
    'home_recommendation_eyebrow',
    'home_recommendation_title',
    'home_recommendation_ids',
    'about_eyebrow',
    'about_title',
    'about_intro_paragraph_1',
    'about_intro_paragraph_2',
    'about_primary_cta_text',
    'about_secondary_cta_text',
    'about_image_1',
    'about_image_2',
    'about_image_3',
    'about_badge_text',
    'about_stats',
    'about_values_eyebrow',
    'about_values_title',
    'about_values',
    'about_promise_eyebrow',
    'about_promise_title',
    'about_promise_body',
    'about_promise_image',
    'privacy_policy',
    'terms_conditions',
    'return_refund_policy'
  ];
  const settings = await prisma.setting.findMany({ where: { key: { in: safeKeys } } });
  res.json({ success: true, data: { ...defaultSettings, ...toObject(settings) } });
}));

adminSettingsRouter.use(requireAdminAuth);

adminSettingsRouter.get('/', asyncHandler(async (_req, res) => {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  res.json({ success: true, data: { ...defaultSettings, ...toObject(settings) } });
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
