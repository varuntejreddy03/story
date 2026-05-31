/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight, AlertTriangle, Play, Settings2, Plus, Percent, CreditCard, FolderPlus, FileSpreadsheet } from 'lucide-react';
import { Product, Order } from '../types';
import { formatINR } from '../utils/currency';

interface DashboardViewProps {
  products: Product[];
  orders: Order[];
  onNavigate: (tab: string) => void;
  onOpenAddProduct: () => void;
  onOpenAddCategory: () => void;
  onOpenCreateCoupon: () => void;
}

export default function DashboardView({
  products,
  orders,
  onNavigate,
  onOpenAddProduct,
  onOpenAddCategory,
  onOpenCreateCoupon
}: DashboardViewProps) {
  // Compute some stats
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.fulfillmentStatus === 'Processing' || o.fulfillmentStatus === 'Confirmed').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const bestSellers = products.slice(0, 2); // default best sellers for this demo

  // Simple pure SVG Chart coordinates for luxury line chart (Revenue Overview)
  const chartPoints = [
    { label: 'Jan', val: 70 },
    { label: 'Feb', val: 110 },
    { label: 'Mar', val: 95 },
    { label: 'Apr', val: 145 },
    { label: 'May', val: 130 },
    { label: 'Jun', val: 195 },
    { label: 'Jul', val: 180 },
    { label: 'Aug', val: 248 }
  ];

  const maxVal = 300;
  const svgWidth = 500;
  const svgHeight = 150;
  const pointsString = chartPoints.map((p, i) => {
    const x = (i / (chartPoints.length - 1)) * svgWidth;
    const y = svgHeight - (p.val / maxVal) * svgHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title & Time Filtering */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-neutral-900">Dashboard Overview</h1>
          <p className="font-sans text-sm text-neutral-500 mt-1">Manage orders, products, inventory, and payments from one place.</p>
        </div>
        <div className="flex bg-neutral-100 rounded-lg p-1 border border-neutral-200/50 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-1.5 text-xs font-medium text-neutral-900 bg-white rounded shadow-xs">Today</button>
          <button className="flex-1 md:flex-none px-4 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">7 Days</button>
          <button className="flex-1 md:flex-none px-4 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">30 Days</button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs flex flex-col gap-2 relative overflow-hidden group hover:border-neutral-300 transition-all cursor-pointer"
          onClick={() => onNavigate('Payments')}
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Total Revenue</div>
          <div className="text-2xl font-semibold text-neutral-900">{formatINR(totalRevenue + 248500)}</div>
          <div className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
            <TrendingUp size={14} className="text-neutral-900" />
            <span>+12.5% growth</span>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs flex flex-col gap-2 hover:border-neutral-300 transition-all cursor-pointer"
          onClick={() => onNavigate('Orders')}
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Total Orders</div>
          <div className="text-2xl font-semibold text-neutral-900">{(totalOrdersCount + 1248).toLocaleString()}</div>
          <div className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
            <TrendingUp size={14} className="text-neutral-900" />
            <span>+8.2% growth</span>
          </div>
        </motion.div>

        {/* Pending Orders */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs flex flex-col gap-2 hover:border-neutral-300 transition-all cursor-pointer"
          onClick={() => onNavigate('Orders')}
        >
          <div className="flex justify-between items-start">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Pending Orders</div>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
          </div>
          <div className="text-2xl font-semibold text-neutral-900">{pendingOrdersCount + 36}</div>
          <div className="text-xs text-neutral-500 font-mono">Requires action</div>
        </motion.div>

        {/* Low Stock count */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs flex flex-col gap-2 hover:border-neutral-300 transition-all cursor-pointer"
          onClick={() => onNavigate('Inventory')}
        >
          <div className="flex justify-between items-start">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Low Stock</div>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
          </div>
          <div className="text-2xl font-semibold text-neutral-900">{lowStockCount + 12}</div>
          <div className="text-xs text-neutral-500 font-mono">Items need restock</div>
        </motion.div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Main Column - Charts & Recent Orders */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Revenue Line Chart */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200/60 flex flex-col h-64 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-neutral-900">Revenue Overview</h3>
                <span className="text-xs text-neutral-400 font-mono">{formatINR(248500)} peak</span>
              </div>
              <div className="flex-1 bg-neutral-50/50 rounded-lg p-2 flex flex-col justify-between border border-neutral-100 relative overflow-hidden">
                <div className="w-full h-full absolute inset-0 flex flex-col justify-between pointer-events-none p-4 opacity-35 font-mono text-[10px] text-neutral-400">
                  <div className="border-b border-dashed border-neutral-200 w-full pb-1">{formatINR(300000)}</div>
                  <div className="border-b border-dashed border-neutral-200 w-full pb-1">{formatINR(150000)}</div>
                  <div className="w-full">{formatINR(0)}</div>
                </div>
                {/* SVG Graph */}
                <div className="flex-1 flex items-end pt-6">
                  <svg className="w-full h-24 overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                    {/* Fill Area Gradient */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0,${svgHeight} L ${pointsString} L ${svgWidth},${svgHeight} Z`}
                      fill="url(#chartGradient)"
                    />
                    {/* Core Line */}
                    <polyline
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2.5"
                      points={pointsString}
                      className="transition-all duration-700"
                    />
                    {/* Dots */}
                    {chartPoints.map((p, i) => {
                      const x = (i / (chartPoints.length - 1)) * svgWidth;
                      const y = svgHeight - (p.val / maxVal) * svgHeight;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={i === chartPoints.length - 1 ? "4" : "3"}
                          fill={i === chartPoints.length - 1 ? "#000000" : "#ffffff"}
                          stroke="#000000"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                </div>
                {/* Months labels */}
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 px-1 mt-2">
                  {chartPoints.map((p, i) => (
                    <span key={i}>{p.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Status Donut Chart (Simulated beautifully) */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200/60 flex flex-col h-64 shadow-xs">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Order Status</h3>
              <div className="flex-1 bg-neutral-50/50 rounded-lg p-3 flex items-center justify-between border border-neutral-100">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* Clean SVG Donut */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f1f1" strokeWidth="3" />
                    {/* Delivered Part (65%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#000000" strokeWidth="3" 
                      strokeDasharray="65 100" strokeDashoffset="0" />
                    {/* Shipped Part (25%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7e7576" strokeWidth="3" 
                      strokeDasharray="25 100" strokeDashoffset="-65" />
                    {/* Pending Part (10%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cfc4c5" strokeWidth="3" 
                      strokeDasharray="10 100" strokeDashoffset="-90" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold font-sans text-neutral-900">88%</span>
                    <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">Fulfillment</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-neutral-700">Delivered</span>
                      <span className="text-[10px] text-neutral-400 font-mono">65% of orders</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-neutral-700">Shipped</span>
                      <span className="text-[10px] text-neutral-400 font-mono">25% of orders</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-neutral-700">Processing</span>
                      <span className="text-[10px] text-neutral-400 font-mono">10% of orders</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl border border-neutral-200/60 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-150 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-neutral-900">Recent Orders</h3>
              <button 
                onClick={() => onNavigate('Orders')} 
                className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 uppercase tracking-widest transition-colors"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-50/50 text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-neutral-100">
                  <tr>
                    <th className="py-3 px-5 font-semibold">Order</th>
                    <th className="py-3 px-5 font-semibold">Customer</th>
                    <th className="py-3 px-5 font-semibold">Amount</th>
                    <th className="py-3 px-5 font-semibold">Payment</th>
                    <th className="py-3 px-5 font-semibold">Status</th>
                    <th className="py-3 px-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-neutral-100 font-sans text-neutral-800">
                  {orders.slice(0, 3).map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/40 transition-colors">
                      <td className="py-4 px-5 font-mono text-neutral-900">{order.id}</td>
                      <td className="py-4 px-5 font-medium text-neutral-900">{order.customerName}</td>
                      <td className="py-4 px-5 font-mono">{formatINR(order.amount)}</td>
                      <td className="py-4 px-5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.paymentStatus === 'Paid' ? 'bg-neutral-900' :
                            order.paymentStatus === 'Pending' ? 'bg-orange-400' : 'bg-red-500'
                          }`}></span>
                          {order.paymentStatus}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px]">
                          {order.fulfillmentStatus}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button 
                          onClick={() => onNavigate('Orders')} 
                          className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-900 uppercase tracking-widest"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Side Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-xs">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3.5">
              <button 
                onClick={onOpenAddProduct}
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-100 hover:border-neutral-200 rounded-lg group transition-all"
              >
                <Plus size={18} className="text-neutral-400 group-hover:text-neutral-900 mb-1.5 transition-colors" />
                <span className="text-[11px] font-medium text-neutral-800">Add Product</span>
              </button>
              
              <button 
                onClick={onOpenAddCategory}
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-100 hover:border-neutral-200 rounded-lg group transition-all"
              >
                <FolderPlus size={18} className="text-neutral-400 group-hover:text-neutral-900 mb-1.5 transition-colors" />
                <span className="text-[11px] font-medium text-neutral-800">Add Category</span>
              </button>
              
              <button 
                onClick={onOpenCreateCoupon}
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-100 hover:border-neutral-200 rounded-lg group transition-all"
              >
                <Percent size={18} className="text-neutral-400 group-hover:text-neutral-900 mb-1.5 transition-colors" />
                <span className="text-[11px] font-medium text-neutral-800">Create Coupon</span>
              </button>
              
              <button 
                onClick={() => onNavigate('Settings')}
                className="flex flex-col items-center justify-center p-4 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-100 hover:border-neutral-200 rounded-lg group transition-all"
              >
                <Settings2 size={18} className="text-neutral-400 group-hover:text-neutral-900 mb-1.5 transition-colors" />
                <span className="text-[11px] font-medium text-neutral-800">Manage GST</span>
              </button>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Low Stock Alerts</h3>
              <span className="text-[10px] font-mono uppercase text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                {lowStockProducts.length} Items
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {lowStockProducts.length === 0 ? (
                <div className="text-xs text-neutral-400 text-center py-4">All stock levels pristine.</div>
              ) : (
                lowStockProducts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-none">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-neutral-800 truncate">{p.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">SKU: {p.sku}</div>
                    </div>
                    <div className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-150 px-2 py-1 rounded font-mono">
                      {p.stock} left
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-xs">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Best Selling</h3>
            <div className="flex flex-col gap-3.5">
              {bestSellers.map((val) => (
                <div key={val.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded overflow-hidden relative">
                    <img 
                      alt={val.name} 
                      className="object-cover w-full h-full grayscale opacity-85" 
                      src={val.image} 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-800 truncate">{val.name}</div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{val.category} Category</div>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">{formatINR(val.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Store Settings Preview */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200/60 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Store Config</h3>
              <button 
                onClick={() => onNavigate('Settings')} 
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
                aria-label="Edit settings"
              >
                <Settings2 size={15} />
              </button>
            </div>
            <div className="flex flex-col gap-2.5 text-xs text-neutral-600 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Delivery Fee</span>
                <span className="text-neutral-800 font-semibold">{formatINR(149)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">GST Applied</span>
                <span className="text-neutral-800 font-semibold">18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Payment Gateway</span>
                <span className="text-neutral-800 font-semibold flex items-center gap-1.5">
                  Razorpay <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse inline-block"></span>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
