import React from 'react';
import { X, Plus, Minus, Trash, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { formatINR } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const subtotal = React.useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden" id="cart-drawer-overlay">
          
          {/* Backdrop screen grey overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs cursor-pointer"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Sliding Drawer Container - Sharp, No rounded borders */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white border-l border-[#E5E5E5] flex flex-col justify-between"
              id="cart-drawer-panel"
            >
              
              {/* Drawer Header Block */}
              <div className="px-6 py-6 border-b border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  <span className="font-mono text-xs font-semibold tracking-widest text-[#121212] uppercase">
                    YOUR ASSEMBLY ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </span>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1 text-[#767676] hover:text-[#121212] cursor-pointer"
                  id="close-cart-drawer-btn"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Drawer Item List */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" id="cart-drawer-scrollable-area">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-[#F5F5F5] pb-6"
                    id={`cart-drawer-item-${item.id}`}
                  >
                    {/* Item Image */}
                    <div className="w-16 h-20 bg-[#FAFAFA] border border-[#E5E5E5] overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item description */}
                    <div className="flex-1 text-left select-none space-y-1 truncate">
                      <h4 className="font-sans font-medium text-xs text-[#121212] uppercase truncate">{item.product.name}</h4>
                      
                      <p className="font-mono text-[9px] text-[#767676] uppercase">
                        MEASURE: {item.selectedSize} - COLOUR: {item.selectedColor.name}
                      </p>
                      
                      <p className="font-mono text-xs font-semibold text-[#121212] pt-1">
                        {formatINR(item.product.price)}
                      </p>

                      {/* Quantity adjusts */}
                      <div className="flex items-center space-x-3 pt-2">
                        <div className="flex items-center border border-[#E5E5E5] bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-neutral-50 text-[#767676] hover:text-black cursor-pointer"
                            title="Decrease"
                          >
                            <Minus size={10} />
                          </button>
                          
                          <span className="font-mono text-[10px] w-6 text-center text-[#121212] font-semibold">{item.quantity}</span>
                          
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-neutral-50 text-[#767676] hover:text-black cursor-pointer"
                            title="Increase"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Remove trash trigger */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#767676] hover:text-red-600 p-1 cursor-pointer"
                          title="Remove article"
                        >
                          <Trash size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <div className="text-center py-24 space-y-4" id="cart-drawer-empty-state">
                    <p className="font-mono text-xs text-[#767676] uppercase">YOUR SECURED ASSEMBLY IS EMPTY.</p>
                    <p className="font-sans text-[11px] text-gray-400 font-light max-w-xs mx-auto">Explore our capsules to secure structural garments designed for Timeless versatile styling.</p>
                    <button
                      onClick={onClose}
                      className="border border-[#121212] py-2.5 px-6 font-mono text-[10px] tracking-widest text-[#121212] hover:bg-[#121212] hover:text-white transition-all cursor-pointer"
                    >
                      CONTINUE CAPSULE BROWSING
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer Calculator */}
              {cartItems.length > 0 && (
                <div className="border-t border-[#E5E5E5] px-6 py-6 bg-[#FAFAFA] space-y-4 text-left">
                  
                  <div className="space-y-1.5 font-mono text-[11px] text-[#767676]">
                    <div className="flex justify-between">
                      <span>SECURED BAG VALUE</span>
                      <span className="text-[#121212] font-medium">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>INSURED INDIA SHIPPING</span>
                      <span className="text-green-700">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between border-t border-[#E5E5E5] pt-3 text-sm text-[#121212] font-semibold">
                      <span>ACCRUED TOTAL PRE-TAX</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onCheckout}
                      className="w-full bg-[#121212] hover:bg-black text-white py-4 text-xs font-mono tracking-widest font-semibold outline-none flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                      id="cart-drawer-checkout-btn"
                    >
                      <span>CHECKOUT SECURELY</span>
                      <ArrowRight size={13} />
                    </button>
                    <p className="text-[9px] font-mono text-center text-[#767676] mt-3 uppercase tracking-wider">
                      ENCRYPTED UPI, RUPAY AND CARD CHECKOUT
                    </p>
                  </div>

                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
};
