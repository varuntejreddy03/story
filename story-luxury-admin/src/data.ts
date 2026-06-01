import { Product, Order, Category, Customer, PaymentTransaction, Coupon, StoreSettings } from './types';

export const initialProducts: Product[] = [
  {
    id: 'wide-legged-pants',
    name: 'Wide Leg Pants',
    sku: 'BTM-349-WHT',
    category: 'Bottom',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    price: 3490,
    stock: 34,
    status: 'active',
    location: 'Mumbai Hub'
  },
  {
    id: 'relaxed-linen-shirt',
    name: 'Relaxed Linen Shirt',
    sku: 'TOP-449-LIN',
    category: 'Top',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uhp1lIVLofZ-7q0fuYMS6y1XarcOncWOQQP2IlXAyv0CtWaOjKcrj-Z-B74Td-W4GE4DVL9JiuOSnNzonOYTAPXDd_A_lIKTl-FzUHssl6TUarX98i__1FAAYYS0ivhiF5d4Pnb_BUXgbfoB3tMIslnUyHK90wo0N1u9DO54GSw4Y-05cx7M8TJxRSVl4f_ngK7ZoXnYRGEl8nDi_954jwzOY-cp7rHDfRKIhPD07_KoSMsk9dOnpWOP04',
    price: 4490,
    stock: 41,
    status: 'active',
    location: 'Bengaluru Hub'
  },
  {
    id: 'crew-neck-sweater',
    name: 'Crew Neck Sweater',
    sku: 'KNT-599-OAT',
    category: 'New Arrival',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uj8FLb9bsGlG-6QGa20qiQ81oAa0vcQuHGhzq_f4CIIwrMzW9OkwagBvsJmo4mpW_iicufR8hvZ1KpdMVrO-T-hhPyWy17jJ3LNS9VnMCgVjKqvaY_RuXXOCqg46YXyJmwH7RvA6r68Y37qp10t2ua_M7PK6hQiHt6lC3rmCvExbS80JE3Ro2UStfoe_h2HyGaSe7YylrVkinm7Przl1T0AJ84AgHMAuVQUcGhTM4Zy1dXucqx4Y5MFg2Y',
    price: 5990,
    stock: 18,
    status: 'active',
    location: 'Delhi Hub'
  },
  {
    id: 'classic-mini-dress',
    name: 'Classic Mini Dress',
    sku: 'DRS-699-BLK',
    category: 'Dresses',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uhyN0ftTAWh3Tfh0E5N4fdflr5eATKQ6Jfc7jugTq3U765-hyIgutRYp_02cCEmXLJveugetSTJM01H7dBUw7yplboo_KxK2b9G0QXcMTVXHxB9iWO5dBOX-gfDZZwuL2sTIKKcxzClyAxPnaAg5F7Nk4BEBHeTgMW9ZgPoXdhqFf7vvpv86Ds4CTmSFlQhM8i5QpOghUiu_f9PC3wvvC9XbRG7CchaPTUVmperlJtYFISoe1-g-cgeGnk',
    price: 6990,
    stock: 22,
    status: 'active',
    location: 'Mumbai Hub'
  },
  {
    id: 'canvas-tote-bag',
    name: 'Canvas Tote Bag',
    sku: 'ACC-249-ECR',
    category: 'Accessory',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    price: 2490,
    stock: 56,
    status: 'active',
    location: 'Jaipur Studio'
  },
  {
    id: 'structured-blazer',
    name: 'Structured Blazer',
    sku: 'OUT-899-TPE',
    category: 'Outerwear',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLveJxgRKIHtwz-3sZdDZvaJsSy38nuzmnm1nci4mczoaSZf5MKt1locLHdleI70qmFh-L9WXz4eZGUHWFHTBvvBAIvn7ntErcg7wSW-IXKDHBiHRyem_ajfNRO8zvtuUEyv0DHrUP8jp7vPNOAbBgv6VAQ24oy61g2eF1HBJRSV2Vztnvzwg310u0_0R_WqW22Lz7l67ahFmQQPKa5CZ91TDyasxjhIRuA3lIoeXk-dWLEEY9TTdzqoojo',
    price: 8990,
    originalPrice: 9990,
    stock: 9,
    status: 'active',
    location: 'Mumbai Atelier'
  },
  {
    id: 'oversized-wool-coat',
    name: 'Oversized Wool Coat',
    sku: 'OUT-129-WOL',
    category: 'Outerwear',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7GsO4SZpGyttxO7Ilf7Gv1HBIYDIxwnUpkjovYDaM3r5cs8IBWeIIeg3goVCtcNHA-FMUL52zkbB6uPyaqLzlAqfYGXlENw8MbSaEvVTjzkCnTazi9z7_-4UKeOAPNHlgI_lpNawrnPvs5wuzg614j78QlEWBL3cb6lBxh5zeydhbS5aq2rTmZJJcUfMnJW1b0IcENzpspGlbyzvx7D8NjQwTlMwP-OfE8JDT455Kuv7AkWtV9jF90LPM_FAALAOsW29NnHE2Ans',
    price: 12990,
    stock: 4,
    status: 'active',
    location: 'Delhi Hub'
  },
  {
    id: 'rib-knit-tank-top',
    name: 'Rib-Knit Tank Top',
    sku: 'TOP-199-RIB',
    category: 'Top',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    price: 1990,
    stock: 48,
    status: 'active',
    location: 'Bengaluru Hub'
  }
];

export const initialOrders: Order[] = [
  {
    id: '#ST-IN-1027',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@story.in',
    amount: 4267,
    date: 'May 31, 2026',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Processing',
    avatarInitials: 'AS'
  },
  {
    id: '#ST-IN-1026',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@gmail.com',
    amount: 10608,
    date: 'May 30, 2026',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Confirmed',
    avatarInitials: 'RM'
  },
  {
    id: '#ST-IN-1025',
    customerName: 'Priya Reddy',
    customerEmail: 'priya.reddy@outlook.com',
    amount: 8250,
    date: 'May 29, 2026',
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Processing',
    avatarInitials: 'PR'
  },
  {
    id: '#ST-IN-1024',
    customerName: 'Meera Iyer',
    customerEmail: 'meera.iyer@yahoo.com',
    amount: 15328,
    date: 'May 28, 2026',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    avatarInitials: 'MI'
  },
  {
    id: '#ST-IN-1023',
    customerName: 'Kavya Shah',
    customerEmail: 'kavya.shah@icloud.com',
    amount: 2938,
    date: 'May 27, 2026',
    paymentStatus: 'Failed',
    fulfillmentStatus: 'Confirmed',
    avatarInitials: 'KS'
  },
  {
    id: '#ST-IN-1022',
    customerName: 'Arjun Nair',
    customerEmail: 'arjun.nair@gmail.com',
    amount: 12990,
    date: 'May 26, 2026',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    avatarInitials: 'AN'
  },
  {
    id: '#ST-IN-1021',
    customerName: 'Tara Kapoor',
    customerEmail: 'tara.kapoor@story.in',
    amount: 6480,
    date: 'May 25, 2026',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
    avatarInitials: 'TK'
  }
];

export const initialCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Outerwear',
    productCount: 18,
    status: 'Active',
    parent: 'None',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE9Au3ZwlAaP9if6oUW7HToMqCNekKzAq9rLRfKDKbkmcBE6rr-uqWbsp1-CR_Jo4-K8JKM8y5Eo3obVsS7fHbkayR02oxkIu9o9JDUzVZFTYr4HZV3yjGG04_xFlKotpZ6B2giRQ1dYcHaVIwmq6Ru1kv5tfzR0SHM6296U0XGoNgr4aHqJVzkYPOsMCLpIABkQVbE5vxkQK8iOdx_ui9sbPa1g85mJsaftSdHoR-E50HfLekosuF9Qy4MEJ22BXGP4FaLqs68Yg',
    description: 'Structured coats, blazers, and transitional layers for Indian city wardrobes.',
    isDynamic: false
  },
  {
    id: 'cat2',
    name: 'New Arrival',
    productCount: 24,
    status: 'Active',
    parent: 'None',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0oHg7piIF57yPlJ-1WFs_HQ7TwCq8ip4B1lUgJYwCifc6nYa1IBjy2TVE2KK9qdDUmkL72XsUrdo8h4ETBVBCGg1lKk5CKkIuY4w9NDF8f3i-Mvy4zLPVRZIPuPnHhTFEFFjAopfsy4LKIHQy7-PJz346l94GkUQcv-QjCICeL87c3nyXVQ7f23Vq50KANuvYEsA_42fmHykLuUEOOZLY_q6xWHpQtev0pjwMC0rM3pT4Sc9yeI67WflBm1iUxcnCBF1tzlDWHms',
    description: 'Latest STORY drops released for the India storefront.',
    isDynamic: true
  },
  {
    id: 'cat3',
    name: 'Bottom',
    productCount: 31,
    status: 'Active',
    parent: 'None',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbKOjKH-8-hRWrN8f8ITw4Dk5GDRi3hbE2U6WXHslOWND0jyOcxklL14t_zCVM7QKtr0oD3X7AmauxlRaspabr-iKsrM2u7iQid_Ry052Vs1yFCKR6aDpvg1-RvlFZM2qoyoTW6YYdVVps3V3ysfQP1T5_QVJNeS3ppnZyqvIhfech-JU66kJ6NZknWpP-XGbT5oWAlaNpleXbp_wLABb8ORaS-XZXde4429Jcme3REu3BakAXJycPZ1PF2jPVRWOHo_-eB2Zm2xI',
    description: 'Trousers, linen pants, and relaxed tailoring.',
    isDynamic: false
  },
  {
    id: 'cat4',
    name: 'Dresses',
    productCount: 22,
    status: 'Active',
    parent: 'None',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-MxUPHX_vI6oM5rQHRhk3AeQ5kUzIsceQjigQB_05ReZueoGc8n905_PjEJK2k6k7bOY5--aETnJy_6ruMECPY8r2T4Ko03z3djBD1GwrxAfacHIQIzlceJb6PwXH2Ud7CCcNVHVVlYlpDutHqqrSiZldhn_uWwslpy9aUd4o1wrDKJIQ5KUEgmDfLyfUR9WvC1rE0Jfg5n3YUhDpkhwJbYtk2tYPApah0PShdnW05sjuDXUZ6yk3YUk_gebcxdk5BYBT5Q2qCRg',
    description: 'Minimal dresses designed for everyday elegance and evening wear.',
    isDynamic: false
  },
  {
    id: 'cat5',
    name: 'Accessory',
    productCount: 56,
    status: 'Active',
    parent: 'None',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxMe2bqXBLwIvmRvK3XECy7YP0JyC8DcbXNPT0wk_IVJIkiRqo_VatpJE5CIz6a21G_OvvYlUfUwzrAg8axSNHuZkjhPAR6NyD0B6iQBMRnm9LO5GwolgWz2WLajqf4qWr-uj5_PLZN5z_cB71zr_YpufImnxyF47HLiJT3ee21-CiUnGhTS0XWlwBy39bNiciKYu3Dre8N5FoeGKrxX097r9TLkwnupIi4RlIOZnjVoiUA1rMu20YGikuKwUCNaVtT8cMfgbkBvw',
    description: 'Canvas totes, jewelry, and finishing details.',
    isDynamic: false
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@story.in',
    location: 'Mumbai, Maharashtra',
    ordersCount: 8,
    totalSpend: 48520,
    lastOrderDate: 'May 31, 2026'
  },
  {
    id: 'cust2',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@gmail.com',
    location: 'New Delhi, Delhi',
    ordersCount: 5,
    totalSpend: 31870,
    lastOrderDate: 'May 30, 2026'
  },
  {
    id: 'cust3',
    name: 'Priya Reddy',
    email: 'priya.reddy@outlook.com',
    location: 'Bengaluru, Karnataka',
    ordersCount: 6,
    totalSpend: 37540,
    lastOrderDate: 'May 29, 2026'
  },
  {
    id: 'cust4',
    name: 'Meera Iyer',
    email: 'meera.iyer@yahoo.com',
    location: 'Chennai, Tamil Nadu',
    ordersCount: 4,
    totalSpend: 27490,
    lastOrderDate: 'May 28, 2026'
  },
  {
    id: 'cust5',
    name: 'Kavya Shah',
    email: 'kavya.shah@icloud.com',
    location: 'Ahmedabad, Gujarat',
    ordersCount: 3,
    totalSpend: 16980,
    lastOrderDate: 'May 27, 2026'
  }
];

export const initialTransactions: PaymentTransaction[] = [
  {
    id: 'pay_STIN1027',
    orderId: '#ST-IN-1027',
    date: 'May 31, 2026',
    amount: 4267,
    method: 'UPI via Razorpay',
    status: 'Settled'
  },
  {
    id: 'pay_STIN1026',
    orderId: '#ST-IN-1026',
    date: 'May 30, 2026',
    amount: 10608,
    method: 'RuPay Card',
    status: 'Settled'
  },
  {
    id: 'pay_STIN1025',
    orderId: '#ST-IN-1025',
    date: 'May 29, 2026',
    amount: 8250,
    method: 'NetBanking',
    status: 'Pending'
  },
  {
    id: 'pay_STIN1024',
    orderId: '#ST-IN-1024',
    date: 'May 28, 2026',
    amount: 15328,
    method: 'UPI via Razorpay',
    status: 'Settled'
  }
];

export const initialCoupons: Coupon[] = [
  {
    code: 'INDIA10',
    status: 'Active',
    discountText: '10% Off for India Launch',
    description: 'Launch incentive for first-time Indian storefront customers.',
    usageUsed: 186,
    usageLimit: 500,
    expiryDate: 'Jun 30, 2026'
  },
  {
    code: 'STORY15',
    status: 'Active',
    discountText: '15% Off on New Arrival',
    description: 'Editorial drop incentive for new season pieces.',
    usageUsed: 96,
    usageLimit: 300,
    expiryDate: 'Jul 31, 2026'
  },
  {
    code: 'FESTIVE20',
    status: 'Active',
    discountText: '20% Off Festive Preview',
    description: 'Private preview campaign for festive capsule styling.',
    usageUsed: 42,
    usageLimit: 200,
    expiryDate: 'Oct 31, 2026'
  }
];

export const defaultSettings: StoreSettings = {
  storeName: 'STORY India',
  currency: 'INR',
  contactEmail: 'care@story.in',
  baseDeliveryFee: 149,
  freeDeliveryThreshold: 5000,
  defaultGstRate: 18,
  razorpayActive: true,
  razorpayKeyId: 'rzp_live_story_india',
  razorpayKeySecret: 'stored-in-backend-env',
  heroEyebrow: 'New editorial capsule',
  heroTitle: 'Our Latest Story',
  heroBody: 'Discover timeless fashion pieces crafted in India for everyday elegance.',
  heroPrimaryCta: 'Shop Edit',
  heroSecondaryCta: 'View Lookbook',
  heroImagePrimary: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85',
  heroImageSecondary: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  heroImageDetail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85',
  heroBadgeEyebrow: 'Story India 2026',
  heroBadgeText: 'Tailored quiet luxury',
  productsEyebrow: 'Seasonal selection',
  productsTitle: 'Our Products',
  homeProductIds: ['wide-legged-pants', 'relaxed-linen-shirt', 'crew-neck-sweater', 'classic-mini-dress', 'canvas-tote-bag', 'elongated-blazer', 'oversized-wool-coat', 'rib-knit-tank-top'],
  collectionEyebrow: 'Curated combinations',
  collectionTitle: 'Perfect Match',
  collectionBody: 'Explore curated collections designed to complement your style with comfort and confidence.',
  collectionImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  collectionProductIds: [],
  discoverEyebrow: 'OUR COMPLETE CODES',
  discoverTitle: 'COLLECTIONS',
  discoverSearchPlaceholder: 'SEARCH PRODUCTS, STYLING OR RELEASES...',
  discoverTagLabel: 'STYLING DIARY:',
  jewelryEyebrow: 'Accessories edit',
  jewelryTitle: 'Story Jewelry',
  jewelryBody: 'Adorn yourself with timeless accessories that complete every look.',
  recommendationEyebrow: 'Selected next',
  recommendationTitle: 'Recommendation',
  recommendationProductIds: ['linen-wide-pants', 'faux-leather-jacket', 'gray-tube-top', 'drawstring-linen-pants', 'convertible-crossbody-bag']
};
