export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

export const calculateIndiaOrderTotals = (subtotal: number) => {
  const shipping = subtotal >= 5000 ? 0 : 149;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return { shipping, tax, total };
};
