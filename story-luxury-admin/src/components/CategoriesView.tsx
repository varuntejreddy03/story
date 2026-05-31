/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, HelpCircle, Folder, Settings, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import { Category } from '../types';

interface CategoriesViewProps {
  categories: Category[];
  onOpenAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleCategoryStatus: (categoryId: string) => void;
}

export default function CategoriesView({
  categories,
  onOpenAddCategory,
  onDeleteCategory,
  onToggleCategoryStatus
}: CategoriesViewProps) {
  const [search, setSearch] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">Categories</h2>
          <p className="text-sm font-sans text-neutral-500 mt-1">Hierarchically structure ready-to-wear items, accessories and collections.</p>
        </div>
        <button 
          onClick={onOpenAddCategory}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-neutral-850 transition-colors uppercase tracking-wider"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Info Tip about dynamic collections */}
      <div className="bg-neutral-50 border border-neutral-150 p-4 rounded-xl flex items-start gap-3">
        <Sparkles size={18} className="text-neutral-900 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 leading-relaxed font-sans">
          <span className="font-semibold text-neutral-950">Pro tip:</span> Dynamic collections (marked with a <span className="font-mono bg-neutral-200 px-1 py-0.2 rounded text-[10px]">Dynamic</span> tag) automatically ingest products based on tags, seasons, or release dates. Traditional structural collections require manual assignment.
        </div>
      </div>

      {/* Search Header Container */}
      <div className="bg-white p-4 rounded-xl border border-neutral-205/50 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text"
            placeholder="Search categories by title, tags or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-neutral-200 bg-neutral-50/25 rounded-lg text-sm w-full outline-hidden focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900 transition-all font-sans"
          />
        </div>
      </div>

      {/* Categories Row/List Layout with Custom Details */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {filteredCategories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-neutral-200/70 p-5 rounded-xl shadow-xs hover:border-neutral-350 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Image, Info */}
              <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                  <img 
                    alt={cat.name} 
                    className="object-cover w-full h-full grayscale opacity-85" 
                    src={cat.image} 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-neutral-900 text-[15px]">{cat.name}</h3>
                    {cat.isDynamic && (
                      <span className="inline-flex items-center text-[9px] font-mono font-bold uppercase py-0.5 px-2 bg-neutral-900 text-white rounded">
                        Dynamic
                      </span>
                    )}
                    {cat.parent !== 'None' && (
                      <span className="inline-flex items-center text-[9px] font-mono py-0.5 px-2 bg-neutral-100 text-neutral-500 rounded border border-neutral-200">
                        Sub of: {cat.parent}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-500 text-xs mt-1 leading-relaxed max-w-xl text-left">{cat.description}</p>
                </div>
              </div>

              {/* Right Column: Stats & Status Actions */}
              <div className="flex flex-wrap items-center gap-6 justify-between md:justify-end border-t md:border-none pt-4 md:pt-0 border-neutral-100">
                
                {/* Product Count pill */}
                <div className="flex flex-col text-left md:text-right">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Products</span>
                  <p className="text-sm font-bold text-neutral-900 font-mono mt-0.5">{cat.productCount} SKUs</p>
                </div>

                {/* Status Toggle trigger button */}
                <button 
                  onClick={() => onToggleCategoryStatus(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-mono tracking-widest uppercase font-semibold transition-all ${
                    cat.status === 'Active' 
                      ? 'bg-neutral-50 text-neutral-900 border-neutral-250 hover:bg-neutral-100' 
                      : 'bg-neutral-100 text-neutral-450 border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'Active' ? 'bg-neutral-900' : 'bg-neutral-400'}`}></span>
                  {cat.status}
                </button>

                {/* Trash trigger button */}
                <button 
                  onClick={() => onDeleteCategory(cat.id)}
                  className="p-2 border border-neutral-200 hover:border-red-200 rounded-lg text-neutral-400 hover:text-red-700 hover:bg-red-50 transition-all shadow-2xs"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <div className="bg-white border border-neutral-150 rounded-xl p-12 text-center text-neutral-400 font-sans">
            No categories match your search term.
          </div>
        )}
      </div>

    </div>
  );
}
