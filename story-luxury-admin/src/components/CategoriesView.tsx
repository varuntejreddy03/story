/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Image as ImageIcon, Plus, Save, Search, Sparkles, Trash2, X } from 'lucide-react';
import { Category, StoreSettings } from '../types';

interface CategoriesViewProps {
  categories: Category[];
  settings: StoreSettings;
  onOpenAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleCategoryStatus: (categoryId: string) => void;
  onUpdateCategory: (categoryId: string, patch: Partial<Category>) => void;
  onSaveSettings: (updated: StoreSettings) => void;
}

type CategoryDraft = {
  name: string;
  description: string;
  image: string;
  parent: string;
  isDynamic: boolean;
  status: Category['status'];
  sortOrder: string;
  imageFile?: File;
};

const draftFromCategory = (category: Category): CategoryDraft => ({
  name: category.name,
  description: category.description,
  image: category.image || '',
  parent: category.parent || 'None',
  isDynamic: category.isDynamic,
  status: category.status,
  sortOrder: String(category.sortOrder || 0)
});

export default function CategoriesView({
  categories,
  settings,
  onOpenAddCategory,
  onDeleteCategory,
  onToggleCategoryStatus,
  onUpdateCategory,
  onSaveSettings
}: CategoriesViewProps) {
  const [search, setSearch] = useState('');
  const [productsEyebrow, setProductsEyebrow] = useState(settings.productsEyebrow);
  const [productsTitle, setProductsTitle] = useState(settings.productsTitle);
  const [productsBody, setProductsBody] = useState(settings.productsBody);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CategoryDraft | null>(null);

  useEffect(() => {
    setProductsEyebrow(settings.productsEyebrow);
    setProductsTitle(settings.productsTitle);
    setProductsBody(settings.productsBody);
  }, [settings.productsBody, settings.productsEyebrow, settings.productsTitle]);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setDraft(draftFromCategory(category));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveProductsSection = () => {
    setSettingsSaving(true);
    setSettingsSaved(false);
    onSaveSettings({
      ...settings,
      productsEyebrow,
      productsTitle,
      productsBody
    });
    window.setTimeout(() => {
      setSettingsSaving(false);
      setSettingsSaved(true);
      window.setTimeout(() => setSettingsSaved(false), 2200);
    }, 650);
  };

  const saveCategory = (categoryId: string) => {
    if (!draft) return;
    onUpdateCategory(categoryId, {
      name: draft.name,
      description: draft.description,
      image: draft.image,
      imageFile: draft.imageFile,
      parent: draft.parent || 'None',
      isDynamic: draft.isDynamic,
      status: draft.status,
      sortOrder: Number(draft.sortOrder) || 0
    });
    cancelEditing();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-3xl font-bold tracking-tight text-neutral-900">Categories</h2>
          <p className="mt-1 font-sans text-sm text-neutral-500">
            Manage the real categories that power Add Product, homepage cards, and category pages.
          </p>
        </div>
        <button
          onClick={onOpenAddCategory}
          className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-neutral-850"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <section className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-xs">
        <div className="mb-5 flex flex-col gap-4 border-b border-neutral-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">Homepage section</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-neutral-950">Our Products</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-500">
              Edit the heading and intro copy above the customer-facing category cards.
            </p>
          </div>
          <button
            type="button"
            onClick={saveProductsSection}
            disabled={settingsSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-70"
          >
            <Save size={14} />
            {settingsSaving ? 'Saving' : settingsSaved ? 'Saved' : 'Save Section'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-xs font-sans md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-neutral-700">Products Eyebrow</span>
            <input
              value={productsEyebrow}
              onChange={e => setProductsEyebrow(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white p-2.5 outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-neutral-700">Products Title</span>
            <input
              value={productsTitle}
              onChange={e => setProductsTitle(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white p-2.5 outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </label>
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="font-semibold text-neutral-700">Products Intro Copy</span>
            <textarea
              value={productsBody}
              onChange={e => setProductsBody(e.target.value)}
              rows={3}
              className="resize-none rounded-lg border border-neutral-200 bg-white p-2.5 outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </label>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-neutral-150 bg-neutral-50 p-4">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-neutral-900" />
        <div className="font-sans text-xs leading-relaxed text-neutral-600">
          <span className="font-semibold text-neutral-950">Category source:</span> Active categories appear on the customer homepage. Products added to a category appear on that category page.
        </div>
      </div>

      <div className="rounded-xl border border-neutral-205/50 bg-white p-4 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search categories by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50/25 py-2 pl-10 pr-4 font-sans text-sm outline-hidden transition-all focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {filteredCategories.map((cat) => {
            const isEditing = editingId === cat.id && draft;
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border border-neutral-200/70 bg-white p-5 shadow-xs transition-all hover:border-neutral-350"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4 md:items-center">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                      {cat.image ? (
                        <img
                          alt=""
                          aria-hidden="true"
                          className="h-full w-full object-cover grayscale opacity-85"
                          src={cat.image}
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-neutral-300">
                          <ImageIcon size={18} />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-neutral-900">{cat.name}</h3>

                      </div>
                      <p className="mt-1 max-w-xl text-left text-xs leading-relaxed text-neutral-500">{cat.description}</p>
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                        /category/{cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-4 md:justify-end md:border-none md:pt-0">
                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Products</span>
                      <p className="mt-0.5 font-mono text-sm font-bold text-neutral-900">{cat.productCount} SKUs</p>
                    </div>
                    <button
                      onClick={() => onToggleCategoryStatus(cat.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest transition-all ${
                        cat.status === 'Active'
                          ? 'border-neutral-250 bg-neutral-50 text-neutral-900 hover:bg-neutral-100'
                          : 'border-neutral-200 bg-neutral-100 text-neutral-450 hover:bg-neutral-200'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cat.status === 'Active' ? 'bg-neutral-900' : 'bg-neutral-400'}`}></span>
                      {cat.status}
                    </button>
                    <button
                      onClick={() => startEditing(cat)}
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 transition-all hover:border-neutral-900 hover:text-neutral-950"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-400 shadow-2xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-bold uppercase tracking-wide text-neutral-950">Edit Category</h4>
                      <button type="button" onClick={cancelEditing} className="rounded-full p-1 text-neutral-400 hover:bg-white hover:text-neutral-900">
                        <X size={17} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-xs font-sans md:grid-cols-2">
                      <label className="flex flex-col gap-1.5">
                        <span className="font-semibold text-neutral-700">Category Name</span>
                        <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="rounded-lg border border-neutral-200 bg-white p-2.5 outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
                      </label>
                      <label className="flex flex-col gap-1.5">
                        <span className="font-semibold text-neutral-700">Display Order</span>
                        <input type="number" value={draft.sortOrder} onChange={e => setDraft({ ...draft, sortOrder: e.target.value })} className="rounded-lg border border-neutral-200 bg-white p-2.5 outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
                      </label>
                      <label className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="font-semibold text-neutral-700">Description</span>
                        <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={3} className="resize-none rounded-lg border border-neutral-200 bg-white p-2.5 outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" />
                      </label>
                      <label className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="font-semibold text-neutral-700">Image Link</span>
                        <input value={draft.image} onChange={e => setDraft({ ...draft, image: e.target.value, imageFile: undefined })} className="rounded-lg border border-neutral-200 bg-white p-2.5 font-mono text-[11px] outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900" placeholder="https://... or /uploads/..." />
                      </label>
                      <label className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="font-semibold text-neutral-700">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            setDraft({ ...draft, image: URL.createObjectURL(file), imageFile: file });
                          }}
                          className="rounded-lg border border-neutral-200 bg-white p-2.5 text-[11px] outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="font-semibold text-neutral-700">Status</span>
                        <select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as Category['status'] })} className="rounded-lg border border-neutral-200 bg-white p-2.5 outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900">
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </label>

                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <button type="button" onClick={cancelEditing} className="rounded-lg border border-neutral-250 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:bg-white">
                        Cancel
                      </button>
                      <button type="button" onClick={() => saveCategory(cat.id)} className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-850">
                        <Save size={14} />
                        Save Category
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <div className="rounded-xl border border-neutral-150 bg-white p-12 text-center font-sans text-neutral-400">
            No categories match your search term.
          </div>
        )}
      </div>
    </div>
  );
}
