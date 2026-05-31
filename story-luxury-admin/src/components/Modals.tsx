/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Product, Category, Coupon } from '../types';

// Hotlinked premium placeholder images for intuitive choices in modals
const productPresets = [
  {
    name: "Classic Mini Dress",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDB_OzzCutA5Y-NQOgjbYtux2Agqu3cQ5lnj62HcMVjOCkCNAdLTkUEa_dzb_0USXCvPvXBpseE_iUWEy6svA07LP8f1ednGrvRn8HmiKwy7W-_u0VsIh7rcR4E16XjPg_wDUHSgv6GxouZcvLDPsWW8DVqtpNKrB5UcArNXzkpkWtJ3Yc4gY5Tt9wmyGsFWbcC7YB8U_5GNSy8Jcl37nqBVlUyXx8QzBF1tfSIl5EwyKxqSa8zFOX-j4lBu2i5zTv4lO1va2Jlig"
  },
  {
    name: "Structured Blazer",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE6WRp1a8gc2PiOyGvBJUvrv-atCnqti5QJlILT3knNnLPkR-Yblosw6WPM1hOMmMjxxgexmmeoPi_DcCzprBVGsCzWEXMixlJjzgebbWLCAklQlmSuZ_yBajfKQQGHY-y-cTjcPuVmSZhb-NNyGJ467c8kzL5_HLyL_wbn2wF2YhCqOOwXmm7LwifXRuf681OdQFA6SPvVVJnDC_WGEWWcJ4fsAUNNfW5QWh_clUhxMUDdMEOaJevwhybpVnGUvTPk9yFNB23i0s"
  },
  {
    name: "Relaxed Linen Shirt",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxfbKU-PToFuRRb8aU83cYImJZk-WqQBevO1_c5HouiwGSG9gBXwq6czn6dDasq4wGsoCRKbg6uM4ZZHxNsEApfP9w7zx0HYlgTe5ZflCj2Y0s0SrNGvsRXknsrxf3Q7q0Nlcj1f1zJusA-2sqrZ9K-UOAHUmyzA_yDEtlGVZJ1q7IloKIrtERE8TA2VCgy7NI4_i1qn7JOXFgozdGoUq8xN7kg1LjciBKfraZ7HIgfeo9SRV2tXLQYCGL6NMSTOxH_hNgnXqiaDM"
  },
  {
    name: "Crew Neck Sweater",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-8_dfLFgEN_TrWFvDWES8pMOWX3ExUAnmllwmxWPgqbL7sJ0OAKpK1i1HPY5MKfrhFoFfU2LnSNgVzo2HBJ2qsVWOg3e83bK-DIn9q5Cd1jF9aJHU0E0owP_MvmawNZlBSMFsLOr1XQ0nwU1RDDUZb4TMW4wve_UuIcmPNr7KOokgnppUN9stLCGRPz7DNKGVEuLlTSpl_z6l-9v301DoFN3c6Ksb4gWyT_1ukmqEKQ1Efyg30jjR-H_x1PPbb9-okxXaL2_jOVE"
  }
];

const categoryPresets = [
  {
    name: "New Arrival",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0oHg7piIF57yPlJ-1WFs_HQ7TwCq8ip4B1lUgJYwCifc6nYa1IBjy2TVE2KK9qdDUmkL72XsUrdo8h4ETBVBCGg1lKk5CKkIuY4w9NDF8f3i-Mvy4zLPVRZIPuPnHhTFEFFjAopfsy4LKIHQy7-PJz346l94GkUQcv-QjCICeL87c3nyXVQ7f23Vq50KANuvYEsA_42fmHykLuUEOOZLY_q6xWHpQtev0pjwMC0rM3pT4Sc9yeI67WflBm1iUxcnCBF1tzlDWHms"
  },
  {
    name: "Outerwear",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuASGxGrGiO0yr7u7ACm2aBhzYBRNwvEve1Ys906Z2--JiSicQfYK2xMaL851HFPMc3hGi8CTHioWiGCl1spiq_1EoJz08qvzujpBg9KXbKUmWOHrETexHP-CtfQTSZJVbCnd03Nb1yYpRuK29nVSm4A5S2JQl1R89CeFLXLzHbgSSOHJTWpE8zrlmzoB3_fweHGLH2CyVSlpIfnfhX1n7dcjGq8jMejYKbZFbrSJvHVRwyiVpVywQEjgDEdHiuC_IuVUlfeDp4uRCc"
  },
  {
    name: "Accessory",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxMe2bqXBLwIvmRvK3XECy7YP0JyC8DcbXNPT0wk_IVJIkiRqo_VatpJE5CIz6a21G_OvvYlUfUwzrAg8axSNHuZkjhPAR6NyD0B6iQBMRnm9LO5GwolgWz2WLajqf4qWr-uj5_PLZN5z_cB71zr_YpufImnxyF47HLiJT3ee21-CiUnGhTS0XWlwBy39bNiciKYu3Dre8N5FoeGKrxX097r9TLkwnupIi4RlIOZnjVoiUA1rMu20YGikuKwUCNaVtT8cMfgbkBvw"
  }
];

/* -------------------------------------------
   AddProductModal
------------------------------------------- */
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

export function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Dresses');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [location, setLocation] = useState('Mumbai Hub');
  const [imageUrl, setImageUrl] = useState(productPresets[0].url);
  const [imageFile, setImageFile] = useState<File | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      sku: sku || `DR-${Math.floor(100 + Math.random() * 900)}-XYZ`,
      category,
      price: Number(price) || 3490,
      stock: Number(stock) || 10,
      location,
      image: imageUrl,
      imageFile,
      status: 'active'
    });
    // Reset states
    setName('');
    setSku('');
    setPrice('');
    setStock('');
    setImageFile(undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative bg-white rounded-xl shadow-2xl border border-neutral-200/60 w-full max-w-lg overflow-hidden text-left flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-neutral-150 flex justify-between items-center bg-neutral-50/20">
              <h3 className="font-bold font-sans text-neutral-900 text-base">Register New Product</h3>
              <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto flex flex-col gap-5 text-xs font-sans">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-neutral-700">Product Title</label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if(!sku) {
                      const prefix = e.target.value.substring(0, 3).toUpperCase();
                      setSku(`${prefix}-${Math.floor(100 + Math.random() * 900)}-XYZ`);
                    }
                  }}
                  placeholder="e.g. Relaxed Linen Shirt"
                  className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">SKU Code</label>
                  <input 
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="e.g. BL-204-SLK"
                    className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">Category Tag</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="p-2.5 bg-white border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Accessory">Accessory</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Top">Top</option>
                    <option value="Sale">Sale</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">Price (INR)</label>
                  <input 
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="3490"
                    className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">Initial Stock</label>
                  <input 
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="15"
                    className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">Warehouse Region</label>
                  <select 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="p-2.5 bg-white border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="Mumbai Hub">Mumbai Hub</option>
                    <option value="Delhi Hub">Delhi Hub</option>
                    <option value="Bengaluru Hub">Bengaluru Hub</option>
                    <option value="Jaipur Studio">Jaipur Studio</option>
                  </select>
                </div>
              </div>

              {/* Presets and manual input URL option */}
              <div className="flex flex-col gap-3.5 border-t border-neutral-100 pt-4">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-neutral-700">Design Visual Preset Source</label>
                  <span className="text-[10px] text-neutral-400">Select curated luxury preview</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {productPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setImageFile(undefined);
                        setImageUrl(preset.url);
                      }}
                      className={`h-14 rounded-lg overflow-hidden border relative flex items-center justify-center bg-neutral-100 ${
                        imageUrl === preset.url ? 'border-black ring-1 ring-black' : 'border-neutral-200 hover:border-neutral-350'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="object-cover w-full h-full grayscale" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="font-semibold text-neutral-500">Upload to backend folder</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setImageFile(file);
                      setImageUrl(URL.createObjectURL(file));
                    }}
                    className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-[11px]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="font-semibold text-neutral-500">Or Manual Image HTTP/HTTPS Link URL</label>
                  <input 
                    type="url"
                    value={imageUrl}
                    onChange={e => {
                      setImageFile(undefined);
                      setImageUrl(e.target.value);
                    }}
                    className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono text-[11px]"
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-150 mt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 border border-neutral-250 py-3 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors uppercase tracking-wider text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-black text-white hover:bg-neutral-850 py-3 rounded-lg text-xs font-semibold transition-colors uppercase tracking-wider text-center"
                >
                  Register Item
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------
   AddCategoryModal
------------------------------------------- */
interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<Category, 'id' | 'productCount'>) => void;
}

export function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('None');
  const [isDynamic, setIsDynamic] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(categoryPresets[0].url);
  const [imageFile, setImageFile] = useState<File | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      parent,
      isDynamic,
      description: description || 'No summary description.',
      image: imageUrl,
      imageFile,
      status: 'Active'
    });
    setName('');
    setDescription('');
    setImageFile(undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative bg-white rounded-xl shadow-2xl border border-neutral-200/60 w-full max-w-md overflow-hidden text-left flex flex-col"
          >
            <div className="p-5 border-b border-neutral-150 flex justify-between items-center bg-neutral-50/20">
              <h3 className="font-bold font-sans text-neutral-900 text-base">Add New Category</h3>
              <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 text-xs font-sans">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-neutral-700">Category Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
              placeholder="e.g. Story Jewelry"
                  className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">Hierarchy Parent Group</label>
                  <select 
                    value={parent}
                    onChange={e => setParent(e.target.value)}
                    className="p-2.5 bg-white border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="None">None (Root)</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>

                {/* Toggle dynamic switch */}
                <div className="flex flex-col gap-1.5 justify-center">
                  <span className="font-semibold text-neutral-700">Dynamic collection model</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setIsDynamic(!isDynamic)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isDynamic ? 'bg-black' : 'bg-neutral-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                          isDynamic ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-[10px] text-neutral-500 font-mono">Auto Ingestion</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-neutral-700">Brief catalog description</label>
                <textarea 
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Premium accessories designed to finish monochrome looks."
                  className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 leading-relaxed font-sans"
                />
              </div>

              <div className="flex flex-col gap-3.5 border-t border-neutral-100 pt-4">
                <label className="font-semibold text-neutral-700">Cover Image Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {categoryPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setImageFile(undefined);
                        setImageUrl(preset.url);
                      }}
                      className={`h-12 rounded overflow-hidden border relative flex items-center justify-center bg-neutral-100 ${
                        imageUrl === preset.url ? 'border-black ring-1 ring-black' : 'border-neutral-205'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="object-cover w-full h-full grayscale" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setImageFile(file);
                    setImageUrl(URL.createObjectURL(file));
                  }}
                  className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-[11px]"
                />
              </div>

              <div className="pt-4 border-t border-neutral-150 mt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 border border-neutral-250 py-3 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors uppercase tracking-wider text-center"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-black text-white hover:bg-neutral-850 py-3 rounded-lg text-xs font-semibold transition-colors uppercase tracking-wider text-center"
                >
                  Register Category
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------
   CreateCouponModal
------------------------------------------- */
interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (coupon: Omit<Coupon, 'usageUsed'>) => void;
}

export function CreateCouponModal({ isOpen, onClose, onCreate }: CreateCouponModalProps) {
  const [code, setCode] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      code: code.toUpperCase() || 'STORYDISC',
      discountText: discountText || 'Discount Incentive',
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      expiryDate: expiryDate || 'No Expiry',
      description: description || 'Promotional Coupon.',
      status: 'Active'
    });
    setCode('');
    setDiscountText('');
    setUsageLimit('');
    setExpiryDate('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative bg-white rounded-xl shadow-2xl border border-neutral-200/60 w-full max-w-md overflow-hidden text-left flex flex-col"
          >
            <div className="p-5 border-b border-neutral-150 flex justify-between items-center bg-neutral-50/20">
              <h3 className="font-bold font-sans text-neutral-900 text-base">Generate Promo Code</h3>
              <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 text-xs font-sans">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-neutral-700">Promo Code String (Caps)</label>
                <input 
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME15"
                  className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono text-sm tracking-widest font-bold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-neutral-700">Discount Description Tagline</label>
                <input 
                  type="text"
                  value={discountText}
                  onChange={e => setDiscountText(e.target.value)}
                  placeholder="e.g. 15% Off on New Arrival"
                  className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">Global Usage limit (Optional)</label>
                  <input 
                    type="number"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    placeholder="Unlimited"
                    className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-neutral-700">Expiry Date Description</label>
                  <input 
                    type="text"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    placeholder="e.g. Jul 31, 2026 or No Expiry"
                    className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 font-sans">
                <label className="font-semibold text-neutral-700">Incentive Campaign Goal context</label>
                <textarea 
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain internal motivation or terms..."
                  className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-neutral-150 mt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 border border-neutral-250 py-3 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-colors uppercase tracking-wider text-center"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-black text-white hover:bg-neutral-850 py-3 rounded-lg text-xs font-semibold transition-colors uppercase tracking-wider text-center"
                >
                  Save Code
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
