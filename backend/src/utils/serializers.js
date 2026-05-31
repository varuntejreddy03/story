import { toNumber } from './money.js';

export const serializeCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.imageUrl,
  isActive: category.isActive,
  productCount: category._count?.products ?? category.productCount ?? 0,
  sortOrder: category.sortOrder,
  isDynamic: category.isDynamic,
  parent: category.parent || 'None'
});

export const serializeProduct = (product) => {
  const images = product.images || [];
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.category?.name || '',
    categoryId: product.categoryId,
    image: images[0] || '',
    images,
    secondaryImage: product.secondaryImage || images[1],
    listImages: images,
    description: product.description,
    details: product.details || [],
    composition: product.composition,
    care: product.care,
    sizes: product.sizes || ['S', 'M', 'L'],
    colors: product.colors || [{ name: 'Black', hex: '#111111' }],
    price: toNumber(product.discountedPrice || product.price),
    originalPrice: product.discountedPrice ? toNumber(product.price) : undefined,
    stock: product.stock,
    status: product.isActive ? 'active' : 'draft',
    isActive: product.isActive,
    location: product.location
  };
};

export const serializeCartItem = (item) => {
  const product = serializeProduct(item.product);
  const effectivePrice = product.price;
  return {
    id: item.id,
    productId: item.productId,
    product,
    selectedSize: item.selectedSize,
    selectedColor: {
      name: item.selectedColorName,
      hex: item.selectedColorHex
    },
    quantity: item.quantity,
    price: effectivePrice,
    itemTotal: effectivePrice * item.quantity,
    stock: product.stock,
    inStock: product.isActive && product.stock >= item.quantity
  };
};

export const serializeUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName || '',
  name: `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  newsletter: user.newsletter,
  language: user.language,
  isActive: user.isActive,
  createdAt: user.createdAt
});

export const serializeAddress = (address) => ({
  id: address.id,
  label: address.label || 'Home',
  fullName: address.name,
  phone: address.phone,
  street: [address.line1, address.line2].filter(Boolean).join(', '),
  line1: address.line1,
  line2: address.line2,
  city: `${address.city}, ${address.state} ${address.pincode}`,
  cityName: address.city,
  state: address.state,
  pincode: address.pincode,
  country: address.country,
  isDefault: address.isDefault
});

export const serializeOrder = (order) => ({
  id: order.publicId,
  dbId: order.id,
  date: order.createdAt,
  status: order.status,
  paymentStatus: order.paymentStatus,
  subtotal: toNumber(order.subtotal),
  shipping: toNumber(order.deliveryFee),
  tax: toNumber(order.gstAmount),
  total: toNumber(order.total),
  couponCode: order.couponCode,
  couponDiscount: toNumber(order.couponDiscount),
  trackingUrl: order.trackingUrl,
  address: order.addressSnapshot,
  paymentMethod: order.paymentStatus === 'paid' ? 'UPI / RuPay verified' : 'Razorpay pending',
  items: (order.items || []).map((item) => ({
    id: item.id,
    name: item.name,
    image: item.imageUrl,
    price: toNumber(item.price),
    quantity: item.quantity,
    selectedSize: item.selectedSize,
    selectedColor: {
      name: item.selectedColorName,
      hex: item.selectedColorHex
    },
    subtotal: toNumber(item.subtotal)
  }))
});
