/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Check, Layers, PackageCheck, Search, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';

interface InventoryViewProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
}

const lowStockThreshold = 5;

const stockTone = (stock: number) => {
  if (stock === 0) return 'border-red-200 bg-red-50 text-red-700';
  if (stock <= lowStockThreshold) return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-green-100 bg-green-50 text-green-700';
};

const stockLabel = (stock: number) => {
  if (stock === 0) return 'Out of stock';
  if (stock <= lowStockThreshold) return 'Low stock';
  return 'In stock';
};

export default function InventoryView({ products, onUpdateStock }: InventoryViewProps) {
  const [localStocks, setLocalStocks] = useState<Record<string, number>>({});
  const [successId, setSuccessId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= lowStockThreshold).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query
      || product.name.toLowerCase().includes(query)
      || product.sku.toLowerCase().includes(query)
      || product.category.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStock = stockFilter === 'All'
      || (stockFilter === 'In stock' && product.stock > lowStockThreshold)
      || (stockFilter === 'Low stock' && product.stock > 0 && product.stock <= lowStockThreshold)
      || (stockFilter === 'Out of stock' && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const setDraftStock = (productId: string, value: number) => {
    setLocalStocks((current) => ({
      ...current,
      [productId]: Math.max(0, value)
    }));
  };

  const handleStockChange = (productId: string, increment: boolean, currentStock: number) => {
    const existing = localStocks[productId] !== undefined ? localStocks[productId] : currentStock;
    setDraftStock(productId, increment ? existing + 1 : existing - 1);
  };

  const handleCommitStock = (productId: string) => {
    const nextVal = localStocks[productId];
    if (nextVal === undefined) return;

    onUpdateStock(productId, nextVal);
    setSuccessId(productId);
    setTimeout(() => setSuccessId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Inventory</h2>
        <p className="text-sm font-sans text-neutral-500 mt-1">Live product stock control, low-stock alerts, and quick catalog availability updates.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-neutral-800">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Catalog SKUs</p>
              <p className="mt-0.5 font-mono text-xl font-bold text-neutral-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-green-700">
              <PackageCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Available Units</p>
              <p className="mt-0.5 font-mono text-xl font-bold text-neutral-900">{totalUnits}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-amber-700">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Low Stock</p>
              <p className="mt-0.5 font-mono text-xl font-bold text-neutral-900">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-red-700">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Out of Stock</p>
              <p className="mt-0.5 font-mono text-xl font-bold text-neutral-900">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200/60 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, SKU, or category..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50/20 py-2.5 pl-10 pr-4 text-sm outline-hidden transition-all focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
              <SlidersHorizontal size={14} className="text-neutral-400" />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="bg-transparent font-mono text-[11px] uppercase tracking-wider text-neutral-700 outline-hidden"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>Category: {category}</option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
              <SlidersHorizontal size={14} className="text-neutral-400" />
              <select
                value={stockFilter}
                onChange={(event) => setStockFilter(event.target.value)}
                className="bg-transparent font-mono text-[11px] uppercase tracking-wider text-neutral-700 outline-hidden"
              >
                {['All', 'In stock', 'Low stock', 'Out of stock'].map((filter) => (
                  <option key={filter} value={filter}>Stock: {filter}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200/60 bg-white shadow-xs">
        <div className="border-b border-neutral-150 bg-neutral-50/30 p-5">
          <h3 className="text-sm font-semibold text-neutral-900">Product Stock Control</h3>
          <p className="mt-1 text-xs text-neutral-500">Adjust stock counts directly from the live product catalog.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-150 bg-neutral-50/50 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Adjust</th>
                <th className="p-4 text-right font-semibold">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150 text-sm text-neutral-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-400">
                    No inventory items match these filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const currentDraftValue = localStocks[product.id] !== undefined ? localStocks[product.id] : product.stock;
                  const isModified = currentDraftValue !== product.stock;

                  return (
                    <tr key={product.id} className="transition-colors hover:bg-neutral-50/40">
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                            {product.image ? (
                              <img
                                alt={product.name}
                                className="h-full w-full object-cover grayscale"
                                src={product.image}
                                referrerPolicy="no-referrer"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-neutral-950">{product.name}</p>
                            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                          {product.category || 'Uncategorised'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${stockTone(product.stock)}`}>
                          {stockLabel(product.stock)}
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <span className="text-sm font-bold text-neutral-900">{product.stock}</span>
                        <span className="ml-1 text-xs text-neutral-400">units</span>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                          <button
                            type="button"
                            onClick={() => handleStockChange(product.id, false, product.stock)}
                            className="rounded px-2.5 py-1 text-neutral-500 transition-all hover:bg-white hover:text-black"
                            aria-label="Decrease stock"
                          >
                            <ArrowDown size={13} strokeWidth={2.5} />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={currentDraftValue}
                            onChange={(event) => setDraftStock(product.id, Number(event.target.value))}
                            className="h-8 w-16 bg-transparent text-center font-mono text-xs font-semibold text-neutral-900 outline-hidden"
                            aria-label={`Stock for ${product.name}`}
                          />

                          <button
                            type="button"
                            onClick={() => handleStockChange(product.id, true, product.stock)}
                            className="rounded px-2.5 py-1 text-neutral-500 transition-all hover:bg-white hover:text-black"
                            aria-label="Increase stock"
                          >
                            <ArrowUp size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {successId === product.id ? (
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-3 py-1.5 font-mono text-xs font-semibold text-green-700">
                            <Check size={14} strokeWidth={2.5} />
                            Saved
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={!isModified}
                            onClick={() => handleCommitStock(product.id)}
                            className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                              isModified
                                ? 'border-black bg-black text-white hover:bg-neutral-850'
                                : 'cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300'
                            }`}
                          >
                            Update
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
