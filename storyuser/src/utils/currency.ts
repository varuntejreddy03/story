export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

export const calculateIndiaOrderTotals = (subtotal: number, couponDiscount: number = 0) => {
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const shipping = discountedSubtotal >= 5000 ? 0 : 149;
  const tax = discountedSubtotal * 0.18;
  const total = discountedSubtotal + shipping + tax;

  return { shipping, tax, total };
};
