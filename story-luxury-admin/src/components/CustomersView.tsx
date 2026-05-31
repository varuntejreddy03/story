/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Mail, ChevronRight, X, Calendar, IndianRupee, ShoppingBag } from 'lucide-react';
import { Customer } from '../types';
import { formatINR } from '../utils/currency';

interface CustomersViewProps {
  customers: Customer[];
}

export default function CustomersView({ customers }: CustomersViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Customers</h2>
        <p className="text-sm font-sans text-neutral-500 mt-1">Curate your customer relationships, lifecycle value, and spend details.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/60 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text"
            placeholder="Search customers by name, location, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-neutral-200 bg-neutral-50/20 rounded-lg text-sm w-full outline-hidden focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
          />
        </div>
      </div>

      {/* Grid or row list of customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCustomers.map((cust) => (
            <motion.div
              key={cust.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-neutral-200/75 p-5 rounded-xl shadow-xs hover:border-neutral-350 transition-all flex flex-col gap-4 text-left cursor-pointer group"
              onClick={() => setSelectedCust(cust)}
            >
              {/* Member card upper banner */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100 flex items-center justify-center font-bold text-neutral-700">
                  {cust.avatar ? (
                    <img 
                      alt={cust.name} 
                      className="object-cover w-full h-full grayscale opacity-85" 
                      src={cust.avatar} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    cust.name.split(' ').map(n=>n[0]).join('')
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-neutral-900 text-[15px] group-hover:text-black transition-colors">{cust.name}</h3>
                  <p className="text-neutral-450 text-[11px] font-mono truncate mt-0.5">{cust.email}</p>
                </div>
              </div>

              {/* Stats segments */}
              <div className="grid grid-cols-2 gap-3.5 bg-neutral-50 p-3 rounded-lg border border-neutral-100 mt-1 font-mono text-[11px] text-neutral-600">
                <div>
                  <span className="text-neutral-400">Total Spend</span>
                  <p className="font-bold text-neutral-900 text-xs mt-1">{formatINR(cust.totalSpend)}</p>
                </div>
                <div>
                  <span className="text-neutral-400">Total Orders</span>
                  <p className="font-bold text-neutral-900 text-xs mt-1">{cust.ordersCount} sessions</p>
                </div>
              </div>

              {/* Location marker lower */}
              <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-auto pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="text-neutral-300" />
                  <span>{cust.location}</span>
                </div>
                <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Profile <ChevronRight size={11} />
                </span>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCustomers.length === 0 && (
          <div className="col-span-full bg-white border border-neutral-150 rounded-xl p-12 text-center text-neutral-405 font-sans">
            No customers found matching that search criterion.
          </div>
        )}
      </div>

      {/* Customer profile detail Side-Sheet Modal info */}
      <AnimatePresence>
        {selectedCust && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCust(null)}
              className="absolute inset-0 bg-black/35 backdrop-blur-xs"
            />
            {/* Sheet */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white h-screen shadow-xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-neutral-150">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Customer Profile</span>
                <button 
                  onClick={() => setSelectedCust(null)}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-all"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Avatar detailed header info */}
              <div className="py-8 flex flex-col items-center border-b border-neutral-150 text-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-300 bg-neutral-100 flex items-center justify-center font-bold text-2xl text-neutral-800">
                  {selectedCust.avatar ? (
                    <img 
                      alt={selectedCust.name} 
                      className="object-cover w-full h-full grayscale" 
                      src={selectedCust.avatar} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    selectedCust.name.split(' ').map(n=>n[0]).join('')
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 text-lg">{selectedCust.name}</h4>
                  <div className="flex items-center gap-1.5 justify-center text-xs text-neutral-400 font-mono mt-1">
                    <Mail size={12} />
                    <span>{selectedCust.email}</span>
                  </div>
                </div>
              </div>

              {/* Financial metrics segment */}
              <div className="py-6 flex flex-col gap-4 border-b border-neutral-150">
                <h5 className="text-[11px] font-semibold text-neutral-450 uppercase tracking-widest text-left">Lifecycle Value Metrics</h5>
                
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <IndianRupee size={14} className="text-neutral-400" />
                    <span className="text-neutral-500 font-sans">Total Spend Volume</span>
                  </div>
                  <span className="font-mono text-neutral-900 font-bold">{formatINR(selectedCust.totalSpend)}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-neutral-400" />
                    <span className="text-neutral-500 font-sans">Total Complete Sessions</span>
                  </div>
                  <span className="font-mono text-neutral-900 font-bold">{selectedCust.ordersCount} orders</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neutral-400" />
                    <span className="text-neutral-500 font-sans">Last Transaction Date</span>
                  </div>
                  <span className="font-mono text-neutral-900 font-semibold">{selectedCust.lastOrderDate}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-neutral-400" />
                    <span className="text-neutral-500 font-sans">Physical Domain</span>
                  </div>
                  <span className="text-neutral-900 font-semibold font-sans">{selectedCust.location}</span>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="py-6 flex-1 text-left">
                <h5 className="text-[11px] font-semibold text-neutral-450 uppercase tracking-widest mb-3">Concierge Notes</h5>
                <p className="text-xs text-neutral-500 leading-relaxed bg-neutral-50 p-4 border border-neutral-150 rounded-lg">
                  Patient buyer, prefers sustainable organic packaging. Has been order in high-end ready to wear outerwear dresses for various events. Active communication log remains clean.
                </p>
              </div>

              <button 
                onClick={() => setSelectedCust(null)}
                className="w-full bg-black text-white hover:bg-neutral-850 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors mt-auto"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
