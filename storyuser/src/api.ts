import { Address, CartItem, ColorOption, Order, Product, StorefrontContent, UserProfile } from './types';

const API_BASE_URL = (((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || 'http://localhost:5000/api').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthSession {
  user: UserProfile & { id?: string; role?: string };
  token?: string;
}

export interface CheckoutOrderResponse {
  order: Order;
  orderId: string;
  publicId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === 'object') {
    const maybeMessage = (payload as { message?: unknown }).message;
    if (typeof maybeMessage === 'string') return maybeMessage;
  }
  return fallback;
};

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
    throw new Error(getErrorMessage(payload, `Request failed with ${response.status}`));
  }

  return (payload as ApiEnvelope<T>).data;
}

const mapProduct = (product: any): Product => ({
  id: String(product.id),
  slug: product.slug,
  name: product.name,
  price: Number(product.price || 0),
  originalPrice: product.originalPrice === undefined ? undefined : Number(product.originalPrice),
  category: product.category || '',
  image: product.image || product.images?.[0] || '',
  secondaryImage: product.secondaryImage,
  listImages: product.listImages || product.images,
  description: product.description,
  details: Array.isArray(product.details) ? product.details : undefined,
  composition: product.composition,
  care: product.care,
  sizes: Array.isArray(product.sizes) ? product.sizes : undefined,
  colors: Array.isArray(product.colors) ? product.colors : undefined,
  stock: product.stock,
  status: product.status
});

const mapUser = (user: any): UserProfile & { id?: string; role?: string } => ({
  id: user.id,
  role: user.role,
  firstName: user.firstName || 'Story',
  lastName: user.lastName || '',
  email: user.email || '',
  phone: user.phone || '',
  language: user.language || 'ENGLISH',
  newsletter: Boolean(user.newsletter)
});

const listFromSetting = (value: unknown, fallback: string[] = []) => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== 'string') return fallback;
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const mapStorefrontContent = (settings: any): StorefrontContent => ({
  heroEyebrow: settings.home_hero_eyebrow || 'NEW EDITORIAL CAPSULE',
  heroTitle: settings.home_hero_title || 'OUR LATEST STORY',
  heroBody: settings.home_hero_body || 'Discover verified branded fashion, curated in India for everyday premium style.',
  heroPrimaryCta: settings.home_hero_primary_cta || 'SHOP THE DROP',
  heroSecondaryCta: settings.home_hero_secondary_cta || 'EXPLORE STYLE EDIT',
  heroImagePrimary: settings.home_hero_image_primary || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85',
  heroImageSecondary: settings.home_hero_image_secondary || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
  heroImageDetail: settings.home_hero_image_detail || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85',
  heroBadgeEyebrow: settings.home_hero_badge_eyebrow || 'Story India 2026',
  heroBadgeText: settings.home_hero_badge_text || 'Tailored quiet luxury',
  productsEyebrow: settings.home_products_eyebrow || 'Seasonal selection',
  productsTitle: settings.home_products_title || 'Our Products',
  homeProductIds: listFromSetting(settings.home_products_ids, []),
  collectionEyebrow: settings.home_collection_eyebrow || 'Curated combinations',
  collectionTitle: settings.home_collection_title || 'Perfect Match',
  collectionBody: settings.home_collection_body || 'Explore curated collections designed to complement your style with comfort and confidence.',
  collectionImage: settings.home_collection_image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  collectionProductIds: listFromSetting(settings.home_collection_product_ids, []),
  discoverEyebrow: settings.discover_eyebrow || 'OUR COMPLETE CODES',
  discoverTitle: settings.discover_title || 'COLLECTIONS',
  discoverSearchPlaceholder: settings.discover_search_placeholder || 'SEARCH PRODUCTS, STYLING OR RELEASES...',
  discoverTagLabel: settings.discover_tag_label || 'STYLING DIARY:',
  jewelryEyebrow: settings.home_jewelry_eyebrow || 'Accessories edit',
  jewelryTitle: settings.home_jewelry_title || 'Story Jewelry',
  jewelryBody: settings.home_jewelry_body || 'Adorn yourself with timeless accessories that complete every look.',
  recommendationEyebrow: settings.home_recommendation_eyebrow || 'Selected next',
  recommendationTitle: settings.home_recommendation_title || 'Recommendation',
  recommendationProductIds: listFromSetting(settings.home_recommendation_ids, ['linen-wide-pants', 'faux-leather-jacket', 'gray-tube-top', 'drawstring-linen-pants', 'convertible-crossbody-bag'])
});

const mapAddress = (address: any): Address => ({
  id: address.id,
  label: address.label,
  fullName: address.fullName || address.name || 'STORY Client',
  phone: address.phone || '',
  street: address.street || address.line1 || '',
  line1: address.line1,
  line2: address.line2,
  city: address.city || [address.cityName, address.state, address.pincode].filter(Boolean).join(', '),
  cityName: address.cityName,
  state: address.state,
  pincode: address.pincode,
  country: address.country || 'India',
  isDefault: Boolean(address.isDefault)
});

const mapCartItem = (item: any): CartItem => ({
  id: String(item.id),
  product: mapProduct(item.product),
  selectedSize: item.selectedSize || 'O/S',
  selectedColor: item.selectedColor || { name: item.selectedColorName || 'Black', hex: item.selectedColorHex || '#111111' },
  quantity: Number(item.quantity || 1)
});

const mapOrder = (order: any): Order => ({
  id: String(order.id),
  date: String(order.date || order.createdAt || ''),
  status: order.status,
  paymentStatus: order.paymentStatus,
  items: (order.items || []).map((item: any) => ({
    id: String(item.id),
    product: {
      id: String(item.productId || item.id),
      name: item.name,
      price: Number(item.price || 0),
      category: '',
      image: item.image || item.imageUrl || ''
    },
    selectedSize: item.selectedSize || 'O/S',
    selectedColor: item.selectedColor || { name: item.selectedColorName || 'Black', hex: item.selectedColorHex || '#111111' },
    quantity: Number(item.quantity || 1)
  })),
  subtotal: Number(order.subtotal || 0),
  shipping: Number(order.shipping || order.deliveryFee || 0),
  tax: Number(order.tax || order.gstAmount || 0),
  total: Number(order.total || 0),
  address: mapAddress(order.address || order.addressSnapshot || {}),
  paymentMethod: order.paymentMethod || 'Razorpay',
  trackingUrl: order.trackingUrl
});

const cartItemsFromResponse = (cart: any): CartItem[] => (cart.items || []).map(mapCartItem);

const toAddressPayload = (address: Address, profile: UserProfile) => ({
  label: address.label || 'Home',
  name: address.fullName || `${profile.firstName} ${profile.lastName}`.trim() || 'STORY Client',
  phone: address.phone || profile.phone || '+91 98765 43210',
  line1: address.line1 || address.street || '12 Kala Ghoda Lane',
  line2: address.line2 || '',
  city: address.cityName || 'Mumbai',
  state: address.state || 'Maharashtra',
  pincode: address.pincode || '400001',
  country: address.country || 'India',
  isDefault: address.isDefault ?? true
});

export const storyApi = {
  fetchProducts: async () => {
    const data = await apiRequest<any[]>('/products?limit=100');
    return data.map(mapProduct);
  },
  settings: async () => mapStorefrontContent(await apiRequest('/settings')),
  createContactRequest: (payload: {
    name: string;
    email: string;
    phone?: string;
    topic: string;
    message: string;
  }) => apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  googleConfig: async () => apiRequest<{ clientId: string }>('/auth/google/config'),
  login: async (email: string, password: string): Promise<AuthSession> => {
    const data = await apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return { user: mapUser(data.user), token: data.token };
  },
  googleLogin: async (idToken: string): Promise<AuthSession> => {
    const data = await apiRequest<{ user: any; token: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    });
    return { user: mapUser(data.user), token: data.token };
  },
  register: async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<AuthSession> => {
    const data = await apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { user: mapUser(data.user), token: data.token };
  },
  me: async () => {
    const data = await apiRequest<{ user: any }>('/auth/me');
    return mapUser(data.user);
  },
  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' }).catch(() => undefined);
  },
  forgotPassword: (email: string) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  getCart: async () => cartItemsFromResponse(await apiRequest('/cart')),
  addCartItem: async (productId: string, quantity: number, selectedSize: string, selectedColor: ColorOption) =>
    cartItemsFromResponse(await apiRequest('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, selectedSize, selectedColor })
    })),
  updateCartItem: async (productId: string, quantity: number, selectedSize: string, selectedColorName: string) =>
    cartItemsFromResponse(await apiRequest(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, selectedSize, selectedColorName })
    })),
  removeCartItem: async (productId: string, selectedSize: string, selectedColorName: string) =>
    cartItemsFromResponse(await apiRequest(`/cart/items/${productId}?selectedSize=${encodeURIComponent(selectedSize)}&selectedColorName=${encodeURIComponent(selectedColorName)}`, {
      method: 'DELETE'
    })),
  clearCart: async () => cartItemsFromResponse(await apiRequest('/cart', { method: 'DELETE' })),
  getAddresses: async () => {
    const data = await apiRequest<any[]>('/profile/addresses');
    return data.map(mapAddress);
  },
  createAddress: async (address: Address, profile: UserProfile) => {
    const data = await apiRequest('/profile/addresses', {
      method: 'POST',
      body: JSON.stringify(toAddressPayload(address, profile))
    });
    return mapAddress(data);
  },
  updateProfile: async (profile: UserProfile) => {
    const data = await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        language: profile.language,
        newsletter: profile.newsletter
      })
    });
    return mapUser(data);
  },
  getOrders: async () => {
    const data = await apiRequest<any[]>('/orders?limit=50');
    return data.map(mapOrder);
  },
  createOrder: async (addressId: string, couponCode?: string): Promise<CheckoutOrderResponse> => {
    const data = await apiRequest<any>('/orders', {
      method: 'POST',
      body: JSON.stringify({ addressId, couponCode })
    });
    return { ...data, order: mapOrder(data.order) };
  },
  verifyPayment: async (payload: {
    orderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const data = await apiRequest<any>('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return mapOrder(data);
  }
};
