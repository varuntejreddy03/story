import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, MapPin, Minus, Plus, ShieldCheck } from 'lucide-react';
import { Address, CartItem } from '../types';
import { calculateIndiaOrderTotals, formatINR } from '../utils/currency';

interface BagViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  addresses: Address[];
  isLoggedIn: boolean;
  onLoginRedirect: () => void;
  isCheckingOut?: boolean;
}

export const BagView: React.FC<BagViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  addresses,
  isLoggedIn,
  onLoginRedirect,
  isCheckingOut = false
}) => {
  const subtotal = React.useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const { shipping, tax, total } = calculateIndiaOrderTotals(subtotal);
  const primaryAddress = addresses[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      id="bag-view-container"
      className="mx-auto max-w-7xl px-4 py-12 pt-20 md:px-8 md:py-16"
    >
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase text-[#767676]">Checkout</p>
          <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none text-[#121212] sm:text-6xl lg:text-7xl">
            Your Selections
          </h1>
        </div>
        {cartItems.length > 0 && (
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase text-[#767676]">
            <span className="bg-[#121212] px-2 py-1 text-white">1 Bag</span>
            <span className="bg-[#e9e9e4] px-2 py-1">2 Details</span>
            <span className="bg-[#e9e9e4] px-2 py-1">3 Confirm</span>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="border border-dashed border-[#121212]/30 px-6 py-20 text-center" id="bag-empty-state">
          <p className="font-mono text-xs uppercase text-[#767676]">Your bag is empty.</p>
          <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-[#767676]">
            Add a piece from the STORY India collection before moving to checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 text-left lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="border-y border-[#121212]">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[96px_1fr] gap-5 border-b border-[#121212]/10 py-6 last:border-b-0 sm:grid-cols-[150px_1fr]"
                  id={`bag-item-${item.id}`}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover grayscale transition duration-300 hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col justify-between gap-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-[#121212]">
                          {item.product.name}
                        </h3>
                        <p className="mt-2 font-mono text-[9px] uppercase text-[#767676]">
                          Colour: {item.selectedColor.name}
                        </p>
                        <p className="mt-1 font-mono text-[9px] uppercase text-[#767676]">
                          Size: {item.selectedSize}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-semibold text-[#121212]">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border border-[#121212] bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-3 py-2 text-[#121212] transition hover:bg-[#fafafa]"
                          title="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={1.6} />
                        </button>
                        <span className="border-x border-[#121212] px-4 py-2 font-mono text-xs font-semibold text-[#121212]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-3 py-2 text-[#121212] transition hover:bg-[#fafafa]"
                          title="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={1.6} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="font-mono text-[9px] uppercase tracking-widest text-[#767676] underline underline-offset-4 transition hover:text-[#121212]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4" id="bag-summary-sidebar">
            <div className="sticky top-[100px] space-y-6 border border-[#121212] bg-[#fafafa] p-6">
              <div>
                <p className="font-mono text-[10px] uppercase text-[#767676]">Order review</p>
                <h2 className="mt-1 font-display text-xl font-black uppercase tracking-wider text-[#121212]">
                  Summary
                </h2>
              </div>

              <div className="space-y-3 border-y border-[#dcdcd9] py-5 font-mono text-[10px] uppercase text-[#767676]">
                <div className="flex justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#121212]">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-green-700">Complimentary</span>
                  ) : (
                    <span className="font-semibold text-[#121212]">{formatINR(shipping)}</span>
                  )}
                </div>
                <div className="flex justify-between gap-4">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-[#121212]">{formatINR(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between gap-4 text-sm font-bold uppercase text-[#121212]">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>

              {isLoggedIn && primaryAddress ? (
                <div className="border border-[#e5e5e5] bg-white p-4">
                  <span className="flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-widest text-[#767676]">
                    <MapPin size={10} strokeWidth={1.5} /> Delivery address
                  </span>
                  <p className="mt-3 text-xs leading-5 text-[#5c5c60]">
                    <strong className="text-[#121212]">{primaryAddress.fullName}</strong>
                    <br />
                    {primaryAddress.street}
                    <br />
                    {primaryAddress.city}, {primaryAddress.country}
                  </p>
                </div>
              ) : (
                <div className="border border-[#e8d58f] bg-[#fff9e6] p-4 font-mono text-[9px] uppercase leading-relaxed text-[#7f6000]">
                  Sign in to continue with saved India delivery details and secure payment tracking.
                </div>
              )}

              {isLoggedIn ? (
                <button
                  onClick={onCheckout}
                  disabled={isCheckingOut}
                  className="flex w-full items-center justify-center gap-2 border border-[#121212] bg-[#121212] py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-transparent hover:text-[#121212]"
                  id="checkout-proceed-btn"
                >
                  {isCheckingOut ? 'Opening payment...' : 'Place order securely'}
                  <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  onClick={onLoginRedirect}
                  className="flex w-full items-center justify-center gap-2 border border-[#121212] bg-[#121212] py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-transparent hover:text-[#121212]"
                  id="checkout-signin-btn"
                >
                  Sign in to checkout
                  <ArrowRight size={12} />
                </button>
              )}

              <div className="flex gap-2 border-t border-[#e5e5e5] pt-4 text-left">
                <ShieldCheck size={13} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#767676]" />
                <span className="font-mono text-[8px] uppercase leading-relaxed tracking-wider text-[#767676]">
                  UPI, RuPay and card payments supported. Returns available across India.
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </motion.div>
  );
};
