export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  secondaryImage?: string;
  listImages?: string[];
  description?: string;
  details?: string[];
  composition?: string;
  care?: string;
  sizes?: string[]; // e.g. ["S", "M", "L", "XL"]
  colors?: ColorOption[];
  stock?: number;
  status?: string;
}

export interface CartItem {
  id: string; // unique id combining productId + size + color
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
}

export interface Address {
  id?: string;
  label?: string;
  fullName: string;
  phone?: string;
  street: string;
  line1?: string;
  line2?: string;
  city: string;
  cityName?: string;
  state?: string;
  pincode?: string;
  country: string;
  isDefault?: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  newsletter: boolean;
}

export interface Order {
  id: string;
  date: string;
  status?: string;
  paymentStatus?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address: Address;
  paymentMethod: string;
  trackingUrl?: string;
}

export interface StorefrontContent {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImagePrimary: string;
  heroImageSecondary: string;
  heroImageDetail: string;
  heroBadgeEyebrow: string;
  heroBadgeText: string;
  productsEyebrow: string;
  productsTitle: string;
  collectionEyebrow: string;
  collectionTitle: string;
  collectionBody: string;
  collectionImage: string;
  jewelryEyebrow: string;
  jewelryTitle: string;
  jewelryBody: string;
  recommendationEyebrow: string;
  recommendationTitle: string;
}

export type ActiveScreen = 'shop' | 'about' | 'contact' | 'discover' | 'detail' | 'settings' | 'confirmation' | 'login' | 'bag';
