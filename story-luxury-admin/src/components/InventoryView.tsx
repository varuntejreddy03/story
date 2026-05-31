/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ArrowUp, ArrowDown, Check, RefreshCw, Layers } from 'lucide-react';
import { Product } from '../types';

interface InventoryViewProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
}

export default function InventoryView({ products, onUpdateStock }: InventoryViewProps) {
  // Local state for stock inputs before committing
  const [localStocks, setLocalStocks] = useState<Record<string, number>>({});
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleStockChange = (productId: string, increment: boolean, currentStock: number) => {
    const existing = localStocks[productId] !== undefined ? localStocks[productId] : currentStock;
    const nextVal = increment ? existing + 1 : Math.max(0, existing - 1);
    
    setLocalStocks({
      ...localStocks,
      [productId]: nextVal
    });
  };

  const handleCommitStock = (productId: string) => {
    const nextVal = localStocks[productId];
    if (nextVal !== undefined) {
      onUpdateStock(productId, nextVal);
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 1500);
    }
  };

  const lowStockThreshold = 5;
  const criticalItems = products.filter(p => p.stock <= lowStockThreshold);

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Inventory</h2>
        <p className="text-sm font-sans text-neutral-500 mt-1">Real-time stock audits, location logs, and ledger items.</p>
      </div>

      {/* Critical stock header block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Critical Alerts</p>
            <p className="text-xl font-bold text-neutral-900 font-mono mt-0.5">{criticalItems.length} SKUs low</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-neutral-50 text-neutral-700 rounded-lg border border-neutral-100">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Total Item SKUs</p>
            <p className="text-xl font-bold text-neutral-900 font-mono mt-0.5">{products.length} Products</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-neutral-55 text-neutral-800 rounded-lg border border-neutral-100">
            <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">Sync State</p>
            <p className="text-xl font-bold text-neutral-900 font-mono mt-0.5">Online Live</p>
          </div>
        </div>
      </div>

      {/* Inventory Adjustments table card */}
      <div className="bg-white rounded-xl border border-neutral-200/60 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-150 bg-neutral-50/20">
          <h3 className="text-sm font-semibold text-neutral-900">Stock Audits & Ledger Items</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-neutral-150">
                <th className="p-4 font-semibold">SKU / Item</th>
                <th className="p-4 font-semibold">Warehouse Region</th>
                <th className="p-4 font-semibold">Current Stock</th>
                <th className="p-4 font-semibold">Quick Adjustment</th>
                <th className="p-4 font-semibold text-right">Commit Changes</th>
              </tr>
            </thead>
            <tbody className="text-sm font-sans divide-y divide-neutral-150 text-neutral-800">
              {products.map((p) => {
                const currentDraftValue = localStocks[p.id] !== undefined ? localStocks[p.id] : p.stock;
                const isModified = currentDraftValue !== p.stock;

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded overflow-hidden flex-shrink-0">
                          <img 
                            alt={p.name} 
                            className="object-cover w-full h-full grayscale opacity-80" 
                            src={p.image} 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-950">{p.name}</p>
                          <span className="text-[10px] font-mono text-neutral-400">SKU: {p.sku} / {p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-neutral-500">
                      {p.location || 'Mumbai Hub'}
                    </td>
                    <td className="p-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          p.stock === 0 ? 'text-red-650' : p.stock <= lowStockThreshold ? 'text-amber-700' : 'text-neutral-800'
                        }`}>
                          {p.stock} units
                        </span>
                        {p.stock <= lowStockThreshold && (
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                        )}
                      </div>
                    </td>
                    {/* Inc / Dec counters */}
                    <td className="p-4">
                      <div className="inline-flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 p-0.5">
                        <button
                          onClick={() => handleStockChange(p.id, false, p.stock)}
                          className="p-1 px-2.5 text-neutral-500 hover:text-black hover:bg-white rounded transition-all"
                          aria-label="Decrease stock"
                        >
                          <ArrowDown size={13} strokeWidth={2.5} />
                        </button>
                        
                        <span className="px-3 font-mono text-xs font-semibold text-neutral-900 min-w-[28px] text-center">
                          {currentDraftValue}
                        </span>
                        
                        <button
                          onClick={() => handleStockChange(p.id, true, p.stock)}
                          className="p-1 px-2.5 text-neutral-500 hover:text-black hover:bg-white rounded transition-all"
                          aria-label="Increase stock"
                        >
                          <ArrowUp size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                    {/* Save or Success status indicators */}
                    <td className="p-4 text-right">
                      {successId === p.id ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-green-600 font-semibold bg-green-50 border border-green-150 rounded-lg px-3 py-1.5 animate-fade-in">
                          <Check size={14} strokeWidth={2.5} />
                          <span>Saved</span>
                        </div>
                      ) : (
                        <button
                          disabled={!isModified}
                          onClick={() => handleCommitStock(p.id)}
                          className={`text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-all border ${
                            isModified 
                              ? 'bg-black text-white hover:bg-neutral-850 cursor-pointer border-black' 
                              : 'bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed'
                          }`}
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
