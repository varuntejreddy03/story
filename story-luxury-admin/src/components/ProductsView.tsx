/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Edit, Trash2, ArrowUpRight, Check, EyeOff } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';

interface ProductsViewProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onToggleStatus: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function ProductsView({
  products,
  onOpenAddProduct,
  onEditProduct,
  onToggleStatus,
  onDeleteProduct
}: ProductsViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Gather categories dynamically from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
    
    if (categoryFilter === 'All') return matchesSearch;
    return matchesSearch && p.category === categoryFilter;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Products</h2>
          <p className="text-sm font-sans text-neutral-500 mt-1">Manage, update, and curate your product collections.</p>
        </div>
        <button 
          onClick={onOpenAddProduct}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-850 transition-colors uppercase tracking-wider"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200/60 shadow-xs">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-neutral-50/20 border border-neutral-200 rounded-lg text-sm w-full outline-hidden focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-neutral-50/20 border border-neutral-250 text-neutral-800 text-xs rounded-lg px-4 py-2 focus:ring-1 focus:ring-black focus:border-black outline-hidden w-full md:w-auto font-mono text-[11px] uppercase tracking-wider"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid listing of products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-neutral-200/70 rounded-xl overflow-hidden hover:border-neutral-350 shadow-xs transition-all flex flex-col group relative"
            >
              {/* Product Status (Active/Draft Pill overlays) */}
              <button 
                onClick={() => onToggleStatus(product.id)}
                className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase shadow-sm border font-bold transition-all ${
                  product.status === 'active' 
                    ? 'bg-neutral-900/90 text-white border-black hover:bg-neutral-800' 
                    : 'bg-neutral-100/90 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                }`}
                title="Click to toggle status"
              >
                {product.status === 'active' ? (
                  <>
                    <Check size={10} strokeWidth={3} className="text-white" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={10} className="text-neutral-500" />
                    <span>Draft</span>
                  </>
                )}
              </button>

              {/* Trash shortcut overlay */}
              <button 
                onClick={() => onDeleteProduct(product.id)}
                className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-red-50 text-neutral-400 hover:text-red-700 p-2 rounded-full border border-neutral-200/50 shadow-sm transition-all"
                title="Delete product"
              >
                <Trash2 size={13} />
              </button>

              <button
                onClick={() => onEditProduct(product)}
                className="absolute top-3 right-14 z-10 bg-white/90 hover:bg-neutral-950 text-neutral-500 hover:text-white p-2 rounded-full border border-neutral-200/50 shadow-sm transition-all"
                title="Edit product"
              >
                <Edit size={13} />
              </button>

              {/* Image box */}
              <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden group border-b border-neutral-150">
                <img 
                  alt={product.name} 
                  className="object-cover w-full h-full grayscale opacity-85 hover:grayscale-0 hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  src={product.image} 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product details */}
              <div className="p-4 flex flex-col flex-1 gap-2 bg-white">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">{product.category}</span>
                  <span className="text-[10px] font-mono text-neutral-400">SKU: {product.sku}</span>
                </div>

                <div className="flex flex-col gap-0.5 mt-1">
                  <h3 className="font-semibold text-neutral-900 text-sm tracking-tight text-left">{product.name}</h3>
                </div>

                {/* Price and Stock details */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100 font-mono">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold text-neutral-900">{formatINR(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-neutral-400 line-through">{formatINR(product.originalPrice)}</span>
                    )}
                  </div>
                  <div>
                    {product.stock === 0 ? (
                      <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-150">Out of Stock</span>
                    ) : product.stock <= 5 ? (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{product.stock} left</span>
                    ) : (
                      <span className="text-[10px] text-neutral-500">{product.stock} in stock</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full bg-white border border-neutral-150 rounded-xl p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
            <span className="text-sm font-sans">No products found for your criteria.</span>
            <button 
              onClick={() => { setSearch(''); setCategoryFilter('All'); }}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
