/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Tag, Calendar, Users, Percent, Trash2, ShieldCheck, Check } from 'lucide-react';
import { Coupon } from '../types';

interface CouponsViewProps {
  coupons: Coupon[];
  onOpenCreateCoupon: () => void;
  onDeleteCoupon: (couponCode: string) => void;
}

export default function CouponsView({
  coupons,
  onOpenCreateCoupon,
  onDeleteCoupon
}: CouponsViewProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Coupons</h2>
          <p className="text-sm font-sans text-neutral-500 mt-1">Configure and manage buyer incentive discount codes.</p>
        </div>
        <button 
          onClick={onOpenCreateCoupon}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-850 transition-colors uppercase tracking-wider"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.code}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-neutral-200/70 rounded-xl overflow-hidden shadow-xs hover:border-neutral-350 transition-all flex flex-col relative"
            >
              {/* Header block themed like a luxury security label */}
              <div className="bg-neutral-50/50 p-4 border-b border-neutral-150 flex justify-between items-center bg-radial from-neutral-50 to-white">
                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-neutral-400" />
                  <span className="font-mono text-sm font-bold text-neutral-900 uppercase tracking-widest">{coupon.code}</span>
                </div>
                
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest font-bold uppercase border bg-white ${
                  coupon.status === 'Active' 
                    ? 'text-neutral-900 border-neutral-300' 
                    : 'text-neutral-450 border-neutral-200 bg-neutral-50'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${coupon.status === 'Active' ? 'bg-neutral-900' : 'bg-neutral-300'}`}></span>
                  {coupon.status}
                </span>
              </div>

              {/* Core Promo value */}
              <div className="p-5 flex flex-col flex-1 gap-4 text-left">
                <div>
                  <h3 className="font-semibold text-neutral-900 text-base">{coupon.discountText}</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{coupon.description}</p>
                </div>

                {/* Progress bar and details */}
                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                      <span>Usage Metrics</span>
                      <span>
                        {coupon.usageUsed} / {coupon.usageLimit ? coupon.usageLimit : 'Unlimited'}
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-black h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${coupon.usageLimit ? (coupon.usageUsed / coupon.usageLimit) * 100 : 35}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Expiry meta details */}
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-100 text-[10px] text-neutral-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>Expires: {coupon.expiryDate}</span>
                    </div>
                    
                    <button 
                      onClick={() => onDeleteCoupon(coupon.code)}
                      className="text-neutral-400 hover:text-red-700 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {coupons.length === 0 && (
          <div className="col-span-full bg-white border border-neutral-150 rounded-xl p-12 text-center text-neutral-400 font-sans">
            No discount coupons generated yet.
          </div>
        )}
      </div>

    </div>
  );
}
