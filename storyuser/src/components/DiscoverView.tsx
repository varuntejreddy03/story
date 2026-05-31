import React from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { PRODUCTS, TRENDING_TAGS } from '../data';
import { formatINR } from '../utils/currency';

interface DiscoverViewProps {
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

const ALL_CATEGORIES = ["ALL", "OUTERWEAR", "BOTTOM", "DRESSES", "ACCESSORY", "TOP", "KNITWEAR", "SHIRTS"];
const ALL_SIZES = ["ALL", "XS", "S", "M", "L", "XL"];
const ALL_COLORS = ["ALL", "Black", "White", "Grey", "Beige", "Slate", "Ecru"];

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onSelectProduct, products }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<'default' | 'price-low' | 'price-high'>('default');
  
  // Luxury Filter states with simple elegant click dropdown toggles
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [selectedSize, setSelectedSize] = React.useState('ALL');
  const [selectedColor, setSelectedColor] = React.useState('ALL');

  const [activeDropdown, setActiveDropdown] = React.useState<'category' | 'size' | 'color' | 'sort' | null>(null);
  const productSource = products && products.length > 0 ? products : PRODUCTS;

  const filteredProducts = React.useMemo(() => {
    let result = [...productSource];

    // Filter by query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filter by Category dropdown
    if (selectedCategory !== 'ALL') {
      result = result.filter(p => p.category.toUpperCase() === selectedCategory.toUpperCase());
    }

    // Filter by Size dropdown
    if (selectedSize !== 'ALL') {
      result = result.filter(p => p.sizes && p.sizes.includes(selectedSize));
    }

    // Filter by Color dropdown
    if (selectedColor !== 'ALL') {
      result = result.filter(p => 
        p.colors && p.colors.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      );
    }

    // Filter by trending tags
    if (selectedTag) {
      const tag = selectedTag.toLowerCase();
      if (tag === 'wool blazers') {
        result = result.filter(p => p.name.toLowerCase().includes('blazer'));
      } else if (tag === 'monochrome') {
        result = result.filter(p => !p.name.toLowerCase().includes('stripe') && !p.name.toLowerCase().includes('blue'));
      } else if (tag === 'minimalist utility') {
        result = result.filter(p => p.category === 'BOTTOM' || p.category === 'OUTERWEAR');
      } else if (tag === 'architectural drape') {
        result = result.filter(p => p.name.toLowerCase().includes('coat') || p.name.toLowerCase().includes('blazer') || p.name.toLowerCase().includes('pants') || p.name.toLowerCase().includes('trousers') || p.name.toLowerCase().includes('dress'));
      } else if (tag === 'raw seams') {
        result = result.filter(p => p.name.toLowerCase().includes('knit') || p.name.toLowerCase().includes('sweater'));
      } else if (tag === 'sustainable chic') {
        result = result.filter(p => p.composition && p.composition.toLowerCase().includes('organic'));
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [productSource, searchQuery, selectedCategory, selectedSize, selectedColor, selectedTag, sortBy]);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // toggle off
    } else {
      setSelectedTag(tag);
      setSearchQuery(''); // clear query when selecting tag
      setSelectedCategory('ALL');
      setSelectedSize('ALL');
      setSelectedColor('ALL');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setSelectedCategory('ALL');
    setSelectedSize('ALL');
    setSelectedColor('ALL');
    setSortBy('default');
  };

  const toggleDropdown = (menu: 'category' | 'size' | 'color' | 'sort') => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      id="discover-view-container"
      className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12"
    >
      
      {/* Massive Editorial Header centered to match exact STORY looks */}
      <header className="text-center mb-10" id="categories-header-title">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#767676] uppercase block mb-3 font-semibold">
          OUR COMPLETE CODES
        </span>
        <h1 className="font-display font-light text-5xl sm:text-7xl lg:text-8xl tracking-[0.05em] text-[#121212] uppercase select-none leading-none">
          COLLECTIONS
        </h1>
      </header>

      {/* Styled Minimalist Search Bar */}
      <div className="space-y-4 max-w-3xl mx-auto" id="search-bar-block">
        <div className="relative border border-[#111111] bg-white flex items-center">
          <div className="pl-4 text-[#111111]">
            <Search size={18} strokeWidth={1.5} />
          </div>

          <input
            type="text"
            placeholder="SEARCH PRODUCTS, STYLING OR RELEASES..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTag(null); // clear tag when typing
            }}
            className="w-full bg-transparent px-4 py-3.5 text-[11px] font-mono tracking-widest focus:outline-none placeholder-gray-400 text-[#111111] border-0"
            id="discover-search-input"
          />

          {(searchQuery || selectedTag || selectedCategory !== 'ALL' || selectedSize !== 'ALL' || selectedColor !== 'ALL') && (
            <button
              onClick={clearSearch}
              className="pr-4 text-[#767676] hover:text-[#121212] py-2 cursor-pointer transition-colors"
              id="clear-search-btn"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Trending filter tags row */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="font-mono text-[8px] tracking-widest text-[#767676] font-semibold uppercase mr-2">
            STYLING DIARY:
          </span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 font-mono text-[8px] tracking-widest border transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#121212] text-white border-[#121212]'
                  : 'bg-[#FAFAFA] text-[#767676] border-[#E5E5E5] hover:text-[#121212] hover:border-[#121212]'
              }`}
              id={`trending-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Sort/Filter Bar layout matching STORY reference with border-y styling */}
      <div 
        className="border-y border-[#121212] py-4 flex flex-col sm:flex-row justify-between items-center px-4 font-mono text-[10px] tracking-widest select-none bg-[#FAFAFA]" 
        id="categories-interactive-sort"
      >
        {/* Left Side: interactive cascading dropdown select trigger blocks */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-[#767676] mb-4 sm:mb-0">
          
          {/* CATEGORY DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('category')}
              className={`flex items-center space-x-1 hover:text-[#121212] transition-colors cursor-pointer uppercase font-medium ${selectedCategory !== 'ALL' ? 'text-[#121212] font-semibold' : ''}`}
            >
              <span>Category: <span className="text-[#121212] font-bold">{selectedCategory}</span></span>
              <ChevronDown size={11} className={`transform transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'category' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 mt-2.5 w-44 bg-white border border-[#121212] z-40 shadow-sm divide-y divide-[#E5E5E5]"
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setActiveDropdown(null); }}
                      className={`block w-full text-left px-4 py-2 hover:bg-[#FAFAFA] text-[10px] tracking-widest font-mono uppercase transition-colors ${selectedCategory === cat ? 'bg-neutral-100 font-bold text-[#121212]' : 'text-[#767676]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SIZE DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('size')}
              className={`flex items-center space-x-1 hover:text-[#121212] transition-colors cursor-pointer uppercase font-medium ${selectedSize !== 'ALL' ? 'text-[#121212] font-semibold' : ''}`}
            >
              <span>Size: <span className="text-[#121212] font-bold">{selectedSize}</span></span>
              <ChevronDown size={11} className={`transform transition-transform ${activeDropdown === 'size' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'size' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 mt-2.5 w-32 bg-white border border-[#121212] z-40 shadow-sm divide-y divide-[#E5E5E5]"
                >
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => { setSelectedSize(sz); setActiveDropdown(null); }}
                      className={`block w-full text-left px-4 py-2 hover:bg-[#FAFAFA] text-[10px] tracking-widest font-mono uppercase transition-colors ${selectedSize === sz ? 'bg-neutral-100 font-bold text-[#121212]' : 'text-[#767676]'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COLOR DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('color')}
              className={`flex items-center space-x-1 hover:text-[#121212] transition-colors cursor-pointer uppercase font-medium ${selectedColor !== 'ALL' ? 'text-[#121212] font-bold text-black border-b border-[#121212]' : ''}`}
            >
              <span>Color: <span className="text-[#121212] font-bold">{selectedColor}</span></span>
              <ChevronDown size={11} className={`transform transition-transform ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'color' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 mt-2.5 w-40 bg-white border border-[#121212] z-40 shadow-sm divide-y divide-[#E5E5E5]"
                >
                  {ALL_COLORS.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => { setSelectedColor(clr); setActiveDropdown(null); }}
                      className={`block w-full text-left px-4 py-2 hover:bg-[#FAFAFA] text-[10px] tracking-widest font-mono uppercase transition-colors ${selectedColor === clr ? 'bg-neutral-100 font-bold text-[#121212]' : 'text-[#767676]'}`}
                    >
                      {clr}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Side: SORT BY dropdown button */}
        <div className="relative text-[#767676]">
          <button 
            onClick={() => toggleDropdown('sort')}
            className="flex items-center space-x-1 hover:text-[#121212] transition-colors cursor-pointer uppercase font-medium"
          >
            <span>Sort By: <span className="text-[#121212] font-bold">{sortBy === 'price-low' ? 'PRICE LOW-HIGH' : sortBy === 'price-high' ? 'PRICE HIGH-LOW' : 'DEFAULT INDEX'}</span></span>
            <ChevronDown size={11} className={`transform transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'sort' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 mt-2.5 w-48 bg-white border border-[#121212] z-40 shadow-sm divide-y divide-[#E5E5E5]"
              >
                <button
                  onClick={() => { setSortBy('default'); setActiveDropdown(null); }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#FAFAFA] text-[10px] tracking-widest font-mono uppercase text-[#767676]"
                >
                  DEFAULT INDEX
                </button>
                <button
                  onClick={() => { setSortBy('price-low'); setActiveDropdown(null); }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#FAFAFA] text-[10px] tracking-widest font-mono uppercase text-[#767676]"
                >
                  PRICE: LOW TO HIGH
                </button>
                <button
                  onClick={() => { setSortBy('price-high'); setActiveDropdown(null); }}
                  className="block w-full text-left px-4 py-2 hover:bg-[#FAFAFA] text-[10px] tracking-widest font-mono uppercase text-[#767676]"
                >
                  PRICE: HIGH TO LOW
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Grid metrics summary */}
      <div className="flex justify-between items-center text-[#767676] font-mono text-[9px] -mt-6">
        <div className="flex items-center space-x-1.5">
          <SlidersHorizontal size={11} />
          <span>SHOWING {filteredProducts.length} DISTINCT MATCHING CODES</span>
        </div>
      </div>

      {/* STORY Elegant Grid layout featuring solid grid separators (border-t border-l, then border-b border-r on elements) */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-[#121212] overflow-hidden" 
        id="categories-grid-collection-view"
      >
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProduct(p)}
            className="group cursor-pointer bg-white border-r border-b border-[#121212] flex flex-col justify-between"
            id={`discover-card-${p.id}`}
          >
            {/* Image Box - height scaled based on standard 0.73 aspect */}
            <div className="aspect-[3/4.1] w-full overflow-hidden flex items-center justify-center bg-[#F6F5F2] relative">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-103 group-hover:grayscale-0 transition-all duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              
              {/* Coming soon marker block logic on Silk Blouse or Leather Belt if desired, but we keep them clickable for detail */}
              {(p.id === 'dolman-sleeve-blouse' || p.id === 'canvas-tote-bag') && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-[#121212]/95 border border-white/20 text-white font-mono text-[8.5px] px-3.5 py-2 tracking-[0.2em] uppercase">
                    ACCOMPANYING PIECE
                  </span>
                </div>
              )}
            </div>

            {/* Bottom details card metadata bar with solid borders */}
            <div className="p-4 flex justify-between items-start bg-white border-t border-[#121212]">
              <div className="space-y-0.5 text-left truncate pr-2">
                <h2 className="font-sans font-medium text-xs tracking-wider text-[#121212] uppercase truncate group-hover:underline">
                  {p.name}
                </h2>
                <div className="flex items-center space-x-1.5 text-[#767676]">
                  <span className="font-mono text-[8px] uppercase tracking-wider">
                    {p.sizes ? p.sizes.join(' / ') : 'O/S'}
                  </span>
                  <span className="text-[7.5px]">/</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider truncate max-w-[80px]">
                    {p.colors && p.colors.length > 0 ? p.colors[0].name : "ECRU"}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold text-[#121212] shrink-0 pt-0.5">
                {formatINR(p.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* If search list is empty */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[#121212]/30 space-y-3" id="discover-empty-state">
          <p className="font-mono text-xs text-[#767676] uppercase">
            NO DESIGN COMPLIES WITH CURRENT CAPSULE CRITERIA.
          </p>
          <button 
            onClick={clearSearch} 
            className="bg-[#121212] text-white text-[9px] font-mono tracking-widest py-3 px-6 cursor-pointer hover:bg-black transition-colors uppercase font-bold"
          >
            RESET CATALOG CODES
          </button>
        </div>
      )}

    </motion.div>
  );
};
