import { roundMoney, toNumber } from './money.js';

export const settingsMap = (settings) =>
  Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));

export const calculateOrderTotals = ({ items, coupon, settings }) => {
  const map = Array.isArray(settings) ? settingsMap(settings) : settings;
  const subtotal = roundMoney(items.reduce((sum, item) => {
    const productPrice = toNumber(item.product.discountedPrice || item.product.price);
    return sum + productPrice * item.quantity;
  }, 0));

  let couponDiscount = 0;
  if (coupon) {
    const value = toNumber(coupon.value);
    if (coupon.type === 'flat') {
      couponDiscount = Math.min(value, subtotal);
    } else {
      couponDiscount = subtotal * (value / 100);
      if (coupon.maxDiscount) {
        couponDiscount = Math.min(couponDiscount, toNumber(coupon.maxDiscount));
      }
    }
  }

  couponDiscount = roundMoney(couponDiscount);
  const deliveryFeeSetting = toNumber(map.delivery_fee ?? 149);
  const freeAbove = toNumber(map.free_delivery_above ?? 5000);
  const gstPercentage = toNumber(map.gst_percentage ?? 18);
  const gstIncluded = String(map.gst_included_in_price || 'false') === 'true';
  const deliveryFee = subtotal >= freeAbove ? 0 : deliveryFeeSetting;
  const taxableBase = gstIncluded ? 0 : Math.max(0, subtotal - couponDiscount);
  const gstAmount = roundMoney(taxableBase * (gstPercentage / 100));
  const total = roundMoney(subtotal - couponDiscount + deliveryFee + gstAmount);

  return {
    subtotal,
    couponDiscount,
    deliveryFee,
    gstPercentage,
    gstAmount,
    total
  };
};
