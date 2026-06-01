/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  image: string;
  imageFile?: File;
  price: number;
  originalPrice?: number;
  stock: number;
  status: 'active' | 'draft';
  location?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  date: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  fulfillmentStatus: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Pending' | 'Cancelled';
  avatarInitials?: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  status: 'Active' | 'Inactive';
  parent: string | 'None';
  image: string;
  imageFile?: File;
  description: string;
  isDynamic: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  ordersCount: number;
  totalSpend: number;
  lastOrderDate: string;
  avatar?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  method: string;
  status: 'Settled' | 'Pending' | 'Failed';
}

export interface Coupon {
  id?: string;
  code: string;
  status: 'Active' | 'Expired';
  discountText: string;
  description: string;
  usageUsed: number;
  usageLimit?: number;
  expiryDate: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'new' | 'reviewing' | 'closed';
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  contactEmail: string;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  defaultGstRate: number;
  razorpayActive: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
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
  homeProductIds: string[];
  collectionEyebrow: string;
  collectionTitle: string;
  collectionBody: string;
  collectionImage: string;
  collectionProductIds: string[];
  discoverEyebrow: string;
  discoverTitle: string;
  discoverSearchPlaceholder: string;
  discoverTagLabel: string;
  jewelryEyebrow: string;
  jewelryTitle: string;
  jewelryBody: string;
  recommendationEyebrow: string;
  recommendationTitle: string;
  recommendationProductIds: string[];
}
