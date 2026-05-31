import { Category, Coupon, Customer, Order, PaymentTransaction, Product, StoreSettings } from './types';

const API_BASE_URL = (((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || 'http://localhost:5000/api').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
}

export interface DashboardStats {
  revenue: {
    today: number;
    month: number;
    allTime: number;
  };
  orders: {
    total: number;
    today: number;
    month: number;
  };
  products: number;
  users: number;
  lowStockProducts: number;
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store'
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error((payload as { message?: string }).message || `Request failed with ${response.status}`);
  }

  return (payload as ApiEnvelope<T>).data;
}

const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
const slugify = (value: string) => value.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const mapProduct = (product: any): Product => ({
  id: String(product.id),
  name: product.name,
  sku: product.sku || 'STORY-SKU',
  category: product.category || 'Uncategorised',
  image: product.image || product.images?.[0] || '',
  price: Number(product.price || 0),
  originalPrice: product.originalPrice === undefined ? undefined : Number(product.originalPrice),
  stock: Number(product.stock || 0),
  status: product.status === 'draft' || product.isActive === false ? 'draft' : 'active',
  location: product.location || 'Mumbai Hub'
});

const mapCategory = (category: any): Category => ({
  id: String(category.id),
  name: category.name,
  productCount: Number(category.productCount || 0),
  status: category.status || (category.isActive === false ? 'Inactive' : 'Active'),
  parent: category.parent || 'None',
  image: category.image || '',
  description: category.description || '',
  isDynamic: Boolean(category.isDynamic)
});

const mapOrder = (order: any): Order => ({
  id: String(order.id),
  customerName: order.customerName || order.address?.fullName || 'STORY Client',
  customerEmail: order.customerEmail || '',
  amount: Number(order.amount || order.total || 0),
  date: order.date ? new Date(order.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
  paymentStatus: titleCase(order.paymentStatus || 'pending') as Order['paymentStatus'],
  fulfillmentStatus: titleCase(order.fulfillmentStatus || order.status || 'processing') as Order['fulfillmentStatus'],
  avatarInitials: String(order.customerName || 'ST').slice(0, 2).toUpperCase()
});

const mapCustomer = (user: any): Customer => ({
  id: String(user.id),
  name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'STORY Client',
  email: user.email || '',
  location: 'India',
  ordersCount: Number(user.ordersCount || 0),
  totalSpend: Number(user.totalSpend || 0),
  lastOrderDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'New'
});

const mapPayment = (payment: any): PaymentTransaction => ({
  id: String(payment.id),
  orderId: String(payment.orderId),
  date: payment.date ? new Date(payment.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
  amount: Number(payment.amount || 0),
  method: payment.method || 'Razorpay',
  status: (payment.status || 'Pending') as PaymentTransaction['status']
});

const mapCoupon = (coupon: any): Coupon => ({
  id: coupon.id,
  code: coupon.code,
  status: coupon.status || (coupon.isActive === false ? 'Expired' : 'Active'),
  discountText: coupon.discountText || `${coupon.value || 0}% Off`,
  description: coupon.description || '',
  usageUsed: Number(coupon.usageUsed || coupon.usedCount || 0),
  usageLimit: coupon.usageLimit,
  expiryDate: coupon.expiryDate || 'No Expiry'
});

const asBoolean = (value: unknown, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
};

const mapSettings = (settings: any): StoreSettings => ({
  storeName: settings.store_name || settings.storeName || 'STORY India',
  currency: settings.razorpay_currency || settings.currency || 'INR',
  contactEmail: settings.store_email || settings.contactEmail || 'orders@story.in',
  baseDeliveryFee: Number(settings.delivery_fee || settings.baseDeliveryFee || 149),
  freeDeliveryThreshold: Number(settings.free_delivery_above || settings.freeDeliveryThreshold || 5000),
  defaultGstRate: Number(settings.gst_percentage || settings.defaultGstRate || 18),
  razorpayActive: asBoolean(settings.razorpay_active ?? settings.razorpayActive, true),
  razorpayKeyId: settings.razorpay_key_id || settings.razorpayKeyId || '',
  razorpayKeySecret: '',
  heroEyebrow: settings.home_hero_eyebrow || settings.heroEyebrow || 'New editorial capsule',
  heroTitle: settings.home_hero_title || settings.heroTitle || 'Our Latest Story',
  heroBody: settings.home_hero_body || settings.heroBody || 'Discover timeless fashion pieces crafted in India for everyday elegance.',
  heroPrimaryCta: settings.home_hero_primary_cta || settings.heroPrimaryCta || 'Shop Edit',
  heroSecondaryCta: settings.home_hero_secondary_cta || settings.heroSecondaryCta || 'View Lookbook',
  heroImagePrimary: settings.home_hero_image_primary || settings.heroImagePrimary || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85',
  heroImageSecondary: settings.home_hero_image_secondary || settings.heroImageSecondary || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  heroImageDetail: settings.home_hero_image_detail || settings.heroImageDetail || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85',
  heroBadgeEyebrow: settings.home_hero_badge_eyebrow || settings.heroBadgeEyebrow || 'Story India 2026',
  heroBadgeText: settings.home_hero_badge_text || settings.heroBadgeText || 'Tailored quiet luxury',
  productsEyebrow: settings.home_products_eyebrow || settings.productsEyebrow || 'Seasonal selection',
  productsTitle: settings.home_products_title || settings.productsTitle || 'Our Products',
  collectionEyebrow: settings.home_collection_eyebrow || settings.collectionEyebrow || 'Curated combinations',
  collectionTitle: settings.home_collection_title || settings.collectionTitle || 'Perfect Match',
  collectionBody: settings.home_collection_body || settings.collectionBody || 'Explore curated collections designed to complement your style with comfort and confidence.',
  collectionImage: settings.home_collection_image || settings.collectionImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  jewelryEyebrow: settings.home_jewelry_eyebrow || settings.jewelryEyebrow || 'Accessories edit',
  jewelryTitle: settings.home_jewelry_title || settings.jewelryTitle || 'Story Jewelry',
  jewelryBody: settings.home_jewelry_body || settings.jewelryBody || 'Adorn yourself with timeless accessories that complete every look.',
  recommendationEyebrow: settings.home_recommendation_eyebrow || settings.recommendationEyebrow || 'Selected next',
  recommendationTitle: settings.home_recommendation_title || settings.recommendationTitle || 'Recommendation'
});

const compactObject = (value: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ''));

const appendFormValue = (formData: FormData, key: string, value: unknown) => {
  if (value !== undefined && value !== null && value !== '') formData.append(key, String(value));
};

const toProductPayload = (product: Omit<Product, 'id'> | Partial<Product>) => {
  const payload = compactObject({
    name: product.name,
    sku: product.sku,
    categorySlug: product.category ? slugify(product.category) : undefined,
    price: product.price,
    stock: product.stock,
    location: product.location,
    isActive: product.status ? product.status === 'active' : undefined,
    images: product.image && !product.image.startsWith('blob:') ? [product.image] : undefined
  });

  if (!product.imageFile) return payload;

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    appendFormValue(formData, key, Array.isArray(value) ? JSON.stringify(value) : value);
  }
  formData.append('images', product.imageFile);
  return formData;
};

const toCategoryPayload = (category: Omit<Category, 'id' | 'productCount'> | Partial<Category>) => {
  const payload = compactObject({
    name: category.name,
    description: category.description,
    imageUrl: category.image && !category.image.startsWith('blob:') ? category.image : undefined,
    parent: category.parent,
    isDynamic: category.isDynamic,
    isActive: category.status ? category.status === 'Active' : undefined
  });

  if (!category.imageFile) return payload;

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) appendFormValue(formData, key, value);
  formData.append('image', category.imageFile);
  return formData;
};

const asRequestBody = (payload: FormData | Record<string, unknown>) =>
  payload instanceof FormData ? payload : JSON.stringify(payload);

const couponPayload = (coupon: Omit<Coupon, 'usageUsed'>) => {
  const percent = coupon.discountText.match(/(\d+(?:\.\d+)?)\s*%/);
  const flat = coupon.discountText.match(/(?:INR|RS\.?)\s*(\d+(?:\.\d+)?)/i);

  return {
    code: coupon.code,
    type: flat ? 'flat' : 'percentage',
    value: Number(flat?.[1] || percent?.[1] || 10),
    minOrderValue: 0,
    usageLimit: coupon.usageLimit,
    isActive: coupon.status === 'Active',
    expiresAt: /^\d{4}-\d{2}-\d{2}/.test(coupon.expiryDate) ? new Date(coupon.expiryDate).toISOString() : null
  };
};

const settingsPayload = (settings: StoreSettings) => ({
  store_name: settings.storeName,
  razorpay_currency: settings.currency,
  store_email: settings.contactEmail,
  delivery_fee: settings.baseDeliveryFee,
  free_delivery_above: settings.freeDeliveryThreshold,
  gst_percentage: settings.defaultGstRate,
  razorpay_active: settings.razorpayActive,
  razorpay_key_id: settings.razorpayKeyId,
  home_hero_eyebrow: settings.heroEyebrow,
  home_hero_title: settings.heroTitle,
  home_hero_body: settings.heroBody,
  home_hero_primary_cta: settings.heroPrimaryCta,
  home_hero_secondary_cta: settings.heroSecondaryCta,
  home_hero_image_primary: settings.heroImagePrimary,
  home_hero_image_secondary: settings.heroImageSecondary,
  home_hero_image_detail: settings.heroImageDetail,
  home_hero_badge_eyebrow: settings.heroBadgeEyebrow,
  home_hero_badge_text: settings.heroBadgeText,
  home_products_eyebrow: settings.productsEyebrow,
  home_products_title: settings.productsTitle,
  home_collection_eyebrow: settings.collectionEyebrow,
  home_collection_title: settings.collectionTitle,
  home_collection_body: settings.collectionBody,
  home_collection_image: settings.collectionImage,
  home_jewelry_eyebrow: settings.jewelryEyebrow,
  home_jewelry_title: settings.jewelryTitle,
  home_jewelry_body: settings.jewelryBody,
  home_recommendation_eyebrow: settings.recommendationEyebrow,
  home_recommendation_title: settings.recommendationTitle
});

export const adminApi = {
  login: async (email: string, password: string) => {
    const data = await apiRequest<{ user: AdminUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.user.role !== 'admin') throw new Error('This account does not have admin access.');
    return data.user;
  },
  me: async () => {
    const data = await apiRequest<{ user: AdminUser }>('/auth/me');
    if (data.user.role !== 'admin') throw new Error('This account does not have admin access.');
    return data.user;
  },
  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' }).catch(() => undefined);
  },
  dashboardStats: () => apiRequest<DashboardStats>('/admin/dashboard/stats'),
  products: async () => (await apiRequest<any[]>('/admin/products')).map(mapProduct),
  createProduct: async (product: Omit<Product, 'id'>) =>
    mapProduct(await apiRequest('/admin/products', {
      method: 'POST',
      body: asRequestBody(toProductPayload(product))
    })),
  updateProduct: async (id: string, product: Partial<Product>) =>
    mapProduct(await apiRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: asRequestBody(toProductPayload(product))
    })),
  updateStock: async (id: string, stock: number) =>
    mapProduct(await apiRequest(`/admin/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock })
    })),
  deleteProduct: async (id: string) =>
    mapProduct(await apiRequest(`/admin/products/${id}`, { method: 'DELETE' })),
  categories: async () => (await apiRequest<any[]>('/admin/categories')).map(mapCategory),
  createCategory: async (category: Omit<Category, 'id' | 'productCount'>) =>
    mapCategory(await apiRequest('/admin/categories', {
      method: 'POST',
      body: asRequestBody(toCategoryPayload(category))
    })),
  updateCategory: async (id: string, category: Partial<Category>) =>
    mapCategory(await apiRequest(`/admin/categories/${id}`, {
      method: 'PUT',
      body: asRequestBody(toCategoryPayload(category))
    })),
  deleteCategory: async (id: string) =>
    mapCategory(await apiRequest(`/admin/categories/${id}`, { method: 'DELETE' })),
  coupons: async () => (await apiRequest<any[]>('/admin/coupons')).map(mapCoupon),
  createCoupon: async (coupon: Omit<Coupon, 'usageUsed'>) =>
    mapCoupon(await apiRequest('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponPayload(coupon))
    })),
  deleteCoupon: async (id: string) =>
    mapCoupon(await apiRequest(`/admin/coupons/${id}`, { method: 'DELETE' })),
  orders: async () => (await apiRequest<any[]>('/admin/orders')).map(mapOrder),
  updateOrderStatus: async (id: string, paymentStatus: Order['paymentStatus'], fulfillmentStatus: Order['fulfillmentStatus']) =>
    mapOrder(await apiRequest(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        paymentStatus: paymentStatus.toLowerCase(),
        status: fulfillmentStatus.toLowerCase()
      })
    })),
  customers: async () => (await apiRequest<any[]>('/admin/users?limit=100')).map(mapCustomer),
  payments: async () => (await apiRequest<any[]>('/admin/payments')).map(mapPayment),
  settings: async () => mapSettings(await apiRequest('/admin/settings')),
  saveSettings: async (settings: StoreSettings) =>
    mapSettings(await apiRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsPayload(settings))
    }))
};
