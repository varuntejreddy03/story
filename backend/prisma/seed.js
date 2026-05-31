import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categorySeeds = [
  { name: 'Outerwear', slug: 'outerwear', sortOrder: 1, description: 'Structured coats, blazers, and transitional layers.', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80' },
  { name: 'New Arrival', slug: 'new-arrival', sortOrder: 2, description: 'Latest STORY India editorial drops.', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', isDynamic: true },
  { name: 'Bottom', slug: 'bottom', sortOrder: 3, description: 'Trousers, linen pants, and relaxed tailoring.', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80' },
  { name: 'Dresses', slug: 'dresses', sortOrder: 4, description: 'Minimal dresses for everyday elegance.', imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80' },
  { name: 'Accessory', slug: 'accessory', sortOrder: 5, description: 'Canvas totes, jewelry, and finishing details.', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80' },
  { name: 'Top', slug: 'top', sortOrder: 6, description: 'Shirts, tanks, and seasonless layers.', imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80' }
];

const productSeeds = [
  {
    name: 'Wide Leg Pants',
    slug: 'wide-leg-pants',
    sku: 'BTM-349-WHT',
    categorySlug: 'bottom',
    price: 3490,
    stock: 34,
    location: 'Mumbai Hub',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80'],
    description: 'Flowing wide-leg trousers constructed from fine fluid cotton twill.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Off-White', hex: '#ECEBE4' }, { name: 'Pristine Black', hex: '#111111' }]
  },
  {
    name: 'Relaxed Linen Shirt',
    slug: 'relaxed-linen-shirt',
    sku: 'TOP-449-LIN',
    categorySlug: 'top',
    price: 4490,
    stock: 41,
    location: 'Bengaluru Hub',
    images: ['https://lh3.googleusercontent.com/aida/ADBb0uhp1lIVLofZ-7q0fuYMS6y1XarcOncWOQQP2IlXAyv0CtWaOjKcrj-Z-B74Td-W4GE4DVL9JiuOSnNzonOYTAPXDd_A_lIKTl-FzUHssl6TUarX98i__1FAAYYS0ivhiF5d4Pnb_BUXgbfoB3tMIslnUyHK90wo0N1u9DO54GSw4Y-05cx7M8TJxRSVl4f_ngK7ZoXnYRGEl8nDi_954jwzOY-cp7rHDfRKIhPD07_KoSMsk9dOnpWOP04'],
    description: 'Breathable pure linen shirt with raw horn-inspired buttons.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Flax Linen', hex: '#ECEBE4' }, { name: 'Chalk Black', hex: '#1D1C1E' }]
  },
  {
    name: 'Crew Neck Sweater',
    slug: 'crew-neck-sweater',
    sku: 'KNT-599-OAT',
    categorySlug: 'new-arrival',
    price: 5990,
    stock: 18,
    location: 'Delhi Hub',
    images: ['https://lh3.googleusercontent.com/aida/ADBb0uj8FLb9bsGlG-6QGa20qiQ81oAa0vcQuHGhzq_f4CIIwrMzW9OkwagBvsJmo4mpW_iicufR8hvZ1KpdMVrO-T-hhPyWy17jJ3LNS9VnMCgVjKqvaY_RuXXOCqg46YXyJmwH7RvA6r68Y37qp10t2ua_M7PK6hQiHt6lC3rmCvExbS80JE3Ro2UStfoe_h2HyGaSe7YylrVkinm7Przl1T0AJ84AgHMAuVQUcGhTM4Zy1dXucqx4Y5MFg2Y'],
    description: 'Medium knit flat rib sweater in supreme alpaca and extra-fine wool.',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Oatmeal Melange', hex: '#E3DFD5' }, { name: 'Anthracite', hex: '#222222' }]
  },
  {
    name: 'Classic Mini Dress',
    slug: 'classic-mini-dress',
    sku: 'DRS-699-BLK',
    categorySlug: 'dresses',
    price: 6990,
    stock: 22,
    location: 'Mumbai Hub',
    images: ['https://lh3.googleusercontent.com/aida/ADBb0uhyN0ftTAWh3Tfh0E5N4fdflr5eATKQ6Jfc7jugTq3U765-hyIgutRYp_02cCEmXLJveugetSTJM01H7dBUw7yplboo_KxK2b9G0QXcMTVXHxB9iWO5dBOX-gfDZZwuL2sTIKKcxzClyAxPnaAg5F7Nk4BEBHeTgMW9ZgPoXdhqFf7vvpv86Ds4CTmSFlQhM8i5QpOghUiu_f9PC3wvvC9XbRG7CchaPTUVmperlJtYFISoe1-g-cgeGnk'],
    description: 'Sleek shift mini dress featuring clean structured seams.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Cream White', hex: '#FAF8F5' }, { name: 'Charcoal Obsidian', hex: '#232325' }]
  },
  {
    name: 'Canvas Tote Bag',
    slug: 'canvas-tote-bag',
    sku: 'ACC-249-ECR',
    categorySlug: 'accessory',
    price: 2490,
    stock: 56,
    location: 'Jaipur Studio',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'],
    description: 'Durable untreated organic cotton canvas tote.',
    sizes: ['O/S'],
    colors: [{ name: 'Natural Ecru', hex: '#EEEDE8' }, { name: 'Raw Charcoal', hex: '#3A3A3C' }]
  },
  {
    name: 'Structured Blazer',
    slug: 'structured-blazer',
    sku: 'OUT-899-TPE',
    categorySlug: 'outerwear',
    price: 8990,
    discountedPrice: 8490,
    stock: 9,
    location: 'Mumbai Atelier',
    images: ['https://lh3.googleusercontent.com/aida/AP1WRLveJxgRKIHtwz-3sZdDZvaJsSy38nuzmnm1nci4mczoaSZf5MKt1locLHdleI70qmFh-L9WXz4eZGUHWFHTBvvBAIvn7ntErcg7wSW-IXKDHBiHRyem_ajfNRO8zvtuUEyv0DHrUP8jp7vPNOAbBgv6VAQ24oy61g2eF1HBJRSV2Vztnvzwg310u0_0R_WqW22Lz7l67ahFmQQPKa5CZ91TDyasxjhIRuA3lIoeXk-dWLEEY9TTdzqoojo'],
    description: 'Single-breasted elongated blazer in lightweight wool blend.',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Taupe Camel', hex: '#A89B8D' }, { name: 'Obsidian', hex: '#121212' }]
  },
  {
    name: 'Oversized Wool Coat',
    slug: 'oversized-wool-coat',
    sku: 'OUT-129-WOL',
    categorySlug: 'outerwear',
    price: 12990,
    stock: 4,
    location: 'Delhi Hub',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC7GsO4SZpGyttxO7Ilf7Gv1HBIYDIxwnUpkjovYDaM3r5cs8IBWeIIeg3goVCtcNHA-FMUL52zkbB6uPyaqLzlAqfYGXlENw8MbSaEvVTjzkCnTazi9z7_-4UKeOAPNHlgI_lpNawrnPvs5wuzg614j78QlEWBL3cb6lBxh5zeydhbS5aq2rTmZJJcUfMnJW1b0IcENzpspGlbyzvx7D8NjQwTlMwP-OfE8JDT455Kuv7AkWtV9jF90LPM_FAALAOsW29NnHE2Ans'],
    description: 'Generously cut double-wool luxury coat with drop shoulders.',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Flax Ecru', hex: '#EAE6DF' }, { name: 'Dark Onyx', hex: '#1C1C1D' }]
  },
  {
    name: 'Rib-Knit Tank Top',
    slug: 'rib-knit-tank-top',
    sku: 'TOP-199-RIB',
    categorySlug: 'top',
    price: 1990,
    stock: 48,
    location: 'Bengaluru Hub',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80'],
    description: 'Fine-gauge rib knit organic cotton tank top.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Chalk White', hex: '#FFFFFF' }, { name: 'Dark Carbon', hex: '#1A1A1C' }]
  }
];

const settings = {
  delivery_fee: '149',
  free_delivery_above: '5000',
  gst_percentage: '18',
  gst_included_in_price: 'false',
  store_name: 'STORY India',
  store_phone: '+91 98765 43210',
  store_email: 'care@story.in',
  razorpay_currency: 'INR',
  cod_enabled: 'false'
};

async function main() {
  const categoryBySlug = new Map();

  for (const category of categorySeeds) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
    categoryBySlug.set(saved.slug, saved);
  }

  for (const product of productSeeds) {
    const { categorySlug, ...data } = product;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {
        ...data,
        categoryId: categoryBySlug.get(categorySlug)?.id
      },
      create: {
        ...data,
        categoryId: categoryBySlug.get(categorySlug)?.id
      }
    });
  }

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'INDIA10' },
    update: {},
    create: {
      code: 'INDIA10',
      type: 'percentage',
      value: 10,
      minOrderValue: 2000,
      maxDiscount: 1000,
      usageLimit: 500,
      expiresAt: new Date('2026-06-30T23:59:59.000Z')
    }
  });

  await prisma.coupon.upsert({
    where: { code: 'STORY15' },
    update: {},
    create: {
      code: 'STORY15',
      type: 'percentage',
      value: 15,
      minOrderValue: 5000,
      maxDiscount: 1500,
      usageLimit: 300,
      expiresAt: new Date('2026-07-31T23:59:59.000Z')
    }
  });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@story.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'StoryAdmin@2026';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'admin', isActive: true },
    create: {
      firstName: 'STORY',
      lastName: 'Admin',
      email: adminEmail,
      phone: '+91 98765 43210',
      passwordHash,
      role: 'admin'
    }
  });

  console.log(`Seeded STORY India data. Admin email: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
