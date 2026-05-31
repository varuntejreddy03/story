/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, X, Sparkles, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { formatINR } from '../utils/currency';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, paymentStatus: Order['paymentStatus'], fulfillmentStatus: Order['fulfillmentStatus']) => void;
}

export default function OrdersView({ orders, onUpdateOrderStatus }: OrdersViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // States for editing selected order
  const [editPaymentStatus, setEditPaymentStatus] = useState<Order['paymentStatus']>('Paid');
  const [editFulfillmentStatus, setEditFulfillmentStatus] = useState<Order['fulfillmentStatus']>('Processing');

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          order.id.toLowerCase().includes(search.toLowerCase()) ||
                          order.customerEmail.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && order.paymentStatus === statusFilter;
  });
  const paidRevenue = orders.reduce((sum, order) => sum + (order.paymentStatus === 'Paid' ? order.amount : 0), 0);
  const selectedOrderSubtotal = selectedOrder ? Math.round(selectedOrder.amount / 1.18) : 0;
  const selectedOrderGst = selectedOrder ? selectedOrder.amount - selectedOrderSubtotal : 0;
  const selectedOrderPrimaryItem = selectedOrderSubtotal > 8000
    ? { name: 'Structured Blazer', sku: 'OUT-899-TPE', ratio: 0.64 }
    : { name: 'Wide Leg Pants', sku: 'BTM-349-WHT', ratio: 0.58 };
  const selectedOrderSecondaryItem = selectedOrderSubtotal > 8000
    ? { name: 'Relaxed Linen Shirt', sku: 'TOP-449-LIN' }
    : { name: 'Canvas Tote Bag', sku: 'ACC-249-ECR' };
  const selectedOrderPrimaryAmount = Math.round(selectedOrderSubtotal * selectedOrderPrimaryItem.ratio);
  const selectedOrderItems = [
    { name: selectedOrderPrimaryItem.name, sku: selectedOrderPrimaryItem.sku, amount: selectedOrderPrimaryAmount },
    { name: selectedOrderSecondaryItem.name, sku: selectedOrderSecondaryItem.sku, amount: selectedOrderSubtotal - selectedOrderPrimaryAmount }
  ];

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditPaymentStatus(order.paymentStatus);
    setEditFulfillmentStatus(order.fulfillmentStatus);
  };

  const handleSaveOrderChanges = () => {
    if (selectedOrder) {
      onUpdateOrderStatus(selectedOrder.id, editPaymentStatus, editFulfillmentStatus);
      setSelectedOrder({
        ...selectedOrder,
        paymentStatus: editPaymentStatus,
        fulfillmentStatus: editFulfillmentStatus
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Orders</h2>
          <p className="text-sm font-sans text-neutral-500 mt-1">Manage and track customer fulfillment statuses.</p>
        </div>
        {/* Filters Container */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status select dropdown */}
          <div className="relative flex-1 md:flex-none">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-neutral-200 text-neutral-800 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-black focus:border-black outline-none w-full md:w-auto"
            >
              <option value="All">Status: All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <button className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg px-4 py-2.5 hover:bg-neutral-50 transition-colors flex-1 md:flex-none justify-center">
            <Calendar size={15} />
            <span>Last 30 Days</span>
          </button>
          
          <button className="flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg px-4 py-2.5 hover:bg-neutral-50 transition-colors flex-1 md:flex-none justify-center">
            <Filter size={15} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs hover:shadow-xs transition-shadow duration-300">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Total Orders</p>
          <p className="text-2xl font-bold text-neutral-900">{(orders.length + 1240).toLocaleString()}</p>
          <p className="text-[11px] font-mono text-neutral-500 mt-1 flex items-center gap-1">
            <span className="text-green-600 font-bold">+12%</span> this week
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs hover:shadow-xs transition-shadow duration-300">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Pending Fulfillment</p>
          <p className="text-2xl font-bold text-neutral-900">{orders.filter(o => o.fulfillmentStatus !== 'Delivered').length + 38}</p>
          <p className="text-[11px] font-mono text-neutral-500 mt-1">Requires attention</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs hover:shadow-xs transition-shadow duration-300">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Returns</p>
          <p className="text-2xl font-bold text-neutral-900">18</p>
          <p className="text-[11px] font-mono text-neutral-500 mt-1 flex items-center gap-1">
            <span className="text-red-600 font-bold">-2%</span> this week
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs hover:shadow-xs transition-shadow duration-300">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1.5">Revenue Today</p>
          <p className="text-2xl font-bold text-neutral-900">{formatINR(paidRevenue + 14290)}</p>
          <p className="text-[11px] font-mono text-neutral-500 mt-1">On track</p>
        </div>
      </div>

      {/* Orders Table Area */}
      <div className="bg-white rounded-xl border border-neutral-200/60 shadow-xs overflow-hidden">
        {/* Search Bar inside Card */}
        <div className="p-4 border-b border-neutral-150 flex items-center bg-neutral-50/20">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search by order ID, name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-200 bg-white rounded-lg text-sm w-full outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all placeholder-neutral-400 font-sans"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-neutral-150">
                <th className="p-4 font-semibold whitespace-nowrap">Order ID</th>
                <th className="p-4 font-semibold whitespace-nowrap">Customer</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                <th className="p-4 font-semibold whitespace-nowrap">Amount</th>
                <th className="p-4 font-semibold whitespace-nowrap">Payment</th>
                <th className="p-4 font-semibold whitespace-nowrap">Fulfillment</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-sans text-neutral-800 divide-y divide-neutral-150">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-neutral-400">
                    No matching orders found. Try a different search term or status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 font-mono font-medium text-neutral-900">{order.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 text-xs font-semibold">
                          {order.avatarInitials || order.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{order.customerName}</p>
                          <p className="text-neutral-400 text-[11px] font-mono mt-0.5">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-500 font-mono text-[13px]">{order.date}</td>
                    <td className="p-4 font-mono text-neutral-900 font-medium">{formatINR(order.amount)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                        order.paymentStatus === 'Paid' ? 'bg-neutral-900 text-white border-neutral-900' :
                        order.paymentStatus === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.paymentStatus === 'Paid' ? 'bg-white' :
                          order.paymentStatus === 'Pending' ? 'bg-amber-600' : 'bg-red-600'
                        }`}></span>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                        order.fulfillmentStatus === 'Delivered' ? 'bg-green-50 text-green-800 border-green-200' :
                        order.fulfillmentStatus === 'Shipped' ? 'bg-neutral-800 text-white border-neutral-800' :
                        order.fulfillmentStatus === 'Confirmed' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                        'bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}>
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleOpenOrder(order)}
                        className="text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors text-xs font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="bg-neutral-50/50 border-t border-neutral-150 px-5 py-4 flex items-center justify-between">
          <p className="text-xs text-neutral-500 font-mono">Showing 1 to {filteredOrders.length} of {orders.length} results</p>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 border border-neutral-200 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-white transition-all disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 bg-black text-white rounded-md text-xs font-semibold">1</button>
            <button className="px-3 py-1 border border-neutral-250 hover:bg-white rounded-md text-xs text-neutral-700 font-semibold transition-all">2</button>
            <button className="p-1.5 border border-neutral-200 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-white transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Drawer / Dialog for details and editing state */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/35 backdrop-blur-xs"
            />
            {/* Sheet */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-screen shadow-xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-neutral-150">
                <div className="flex flex-col">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-450">Order Information</span>
                  <span className="text-lg font-bold font-mono text-neutral-900 mt-0.5">{selectedOrder.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-all"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Status Badge & Customer segment */}
              <div className="py-6 flex flex-col gap-5 border-b border-neutral-150">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center font-bold text-lg font-mono">
                    {selectedOrder.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base">{selectedOrder.customerName}</h4>
                    <span className="text-xs text-neutral-400 font-mono">{selectedOrder.customerEmail}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono text-xs bg-neutral-50 p-3.5 rounded-lg border border-neutral-100">
                  <div>
                    <span className="text-neutral-400">Date Ordered</span>
                    <p className="text-neutral-900 font-semibold mt-1">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Transaction Value</span>
                    <p className="text-neutral-900 font-semibold mt-1">{formatINR(selectedOrder.amount)}</p>
                  </div>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="py-6 flex flex-col gap-5 border-b border-neutral-150">
                <h5 className="text-[11px] font-semibold text-neutral-450 uppercase tracking-widest">Update Fulfillment State</h5>
                
                {/* Edit Payment Status */}
                <div>
                  <label className="block text-xs text-neutral-500 font-mono mb-2">Payment Status</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['Paid', 'Pending', 'Failed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setEditPaymentStatus(status)}
                        className={`py-2 px-3 rounded-lg border font-mono font-medium text-center transition-all ${
                          editPaymentStatus === status 
                            ? 'bg-black text-white border-black ring-1 ring-black' 
                            : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-55'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edit Fulfillment Status */}
                <div className="mt-2">
                  <label className="block text-xs text-neutral-500 font-mono mb-2">Fulfillment Status</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['Processing', 'Confirmed', 'Shipped', 'Delivered'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setEditFulfillmentStatus(status)}
                        className={`py-2 px-3 rounded-lg border font-mono font-medium text-center transition-all ${
                          editFulfillmentStatus === status 
                            ? 'bg-black text-white border-black ring-1 ring-black' 
                            : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-55'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Items Mock Segment */}
              <div className="py-6 flex flex-col gap-4 flex-1">
                <h5 className="text-[11px] font-semibold text-neutral-450 uppercase tracking-widest">Order Summary</h5>
                {selectedOrderItems.map((item) => (
                  <div key={item.sku} className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-neutral-100">
                    <div className="flex flex-col">
                      <span className="font-semibold text-neutral-800">{item.name}</span>
                      <span className="text-neutral-400 font-mono mt-0.5">SKU: {item.sku} x 1</span>
                    </div>
                    <span className="font-mono text-neutral-800">{formatINR(item.amount)}</span>
                  </div>
                ))}

                <div className="flex flex-col gap-1.5 mt-auto bg-neutral-50/50 p-4 rounded-lg border border-neutral-100 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-neutral-400">Subtotal</span>
                    <span className="text-neutral-800 font-semibold">{formatINR(selectedOrderSubtotal)}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-neutral-400">GST (18%)</span>
                    <span className="text-neutral-800 font-semibold">{formatINR(selectedOrderGst)}</span>
                  </div>
                  <div className="flex justify-between font-sans pt-2 border-t border-neutral-200/50 text-sm font-bold text-neutral-900 mt-2">
                    <span>Total Charged</span>
                    <span className="font-mono">{formatINR(selectedOrder.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Keep changes CTA */}
              <div className="pt-4 border-t border-neutral-200 mt-4 flex gap-3">
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="flex-1 border border-neutral-250 py-3 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors uppercase tracking-wider"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveOrderChanges} 
                  className="flex-1 bg-black text-white hover:bg-neutral-850 py-3 rounded-lg text-xs font-semibold transition-colors uppercase tracking-wider"
                >
                  Save Status
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
