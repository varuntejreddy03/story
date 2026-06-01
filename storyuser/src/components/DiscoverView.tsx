import React from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Product, StorefrontContent, StoryCategoryKey } from '../types';
import { PRODUCTS } from '../data';
import {
  STORY_CATEGORIES,
  StoryCategory,
  StoryGender,
  filterProductsForStoryCategory,
  getCategoryImage,
  getStoryCategory
} from '../categoryConfig';
import { formatINR } from '../utils/currency';

interface DiscoverViewProps {
  onSelectProduct: (product: Product) => void;
  products?: Product[];
  content: StorefrontContent;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular' | 'best-match';
type FilterMenu = 'category' | 'gender' | 'size' | 'brand' | 'sort' | null;
type GenderFilter = 'all' | StoryGender;

const CATEGORY_OPTIONS = ['all', ...STORY_CATEGORIES.map((category) => category.key)] as Array<'all' | StoryCategoryKey>;
const BRAND_OPTIONS = [
  'All',
  'Versace',
  'Karl Lagerfeld',
  'Lacoste',
  'Superdry',
  'Tommy Hilfiger',
  'Burberry',
  'True Religion',
  'Rare Rabbit',
  'Blackberrys',
  'Zara',
  'Calvin Klein',
  'Michael Kors',
  'Hugo Boss',
  'Ralph Lauren'
];

const FALLBACK_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38', '40', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  'price-low': 'Price Low to High',
  'price-high': 'Price High to Low',
  popular: 'Most Popular',
  'best-match': 'Best Match'
};

const getAvailableGenders = (category: StoryCategory | null): GenderFilter[] => {
  if (!category?.genders) return ['all'];
  return Object.keys(category.genders) as StoryGender[];
};

const getAvailableSizes = (category: StoryCategory | null, gender: GenderFilter) => {
  if (!category?.genders) return FALLBACK_SIZES;
  if (gender !== 'all') return category.genders[gender] || [];

  return Array.from(new Set(Object.values(category.genders).flat()));
};

const categoryLabel = (key: 'all' | StoryCategoryKey) => key === 'all' ? 'All' : getStoryCategory(key).label;

const productMatchesKey = (product: Product, key: string) => product.id === key || product.slug === key;

const productBrandText = (product: Product) => `${product.name} ${product.description || ''} ${product.composition || ''}`.toLowerCase();

function SelectDropdown({
  label,
  value,
  options,
  active,
  onToggle,
  onSelect
}: {
  label: string;
  value: string;
  options: string[];
  active: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] transition hover:text-[#111111] ${value !== 'All' && value !== 'Newest' ? 'text-[#111111]' : 'text-[#6f6f6f]'}`}
        aria-label={`${label} filter`}
      >
        {label}: <span className="font-semibold text-[#111111]">{value}</span>
        <ChevronDown size={12} strokeWidth={1.6} className={`transition ${active ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-0 top-7 z-40 max-h-72 w-56 overflow-auto border border-[#111111] bg-white shadow-sm"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className={`block w-full px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.16em] transition hover:bg-[#f4f4f1] ${value === option ? 'bg-[#111111] text-white' : 'text-[#555555]'}`}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onSelectProduct, products, content }) => {
  const rawProductSource = products && products.length > 0 ? products : PRODUCTS;
  const productSource = React.useMemo(() => {
    if (content.collectionProductIds.length === 0) return rawProductSource;
    const selected = content.collectionProductIds
      .map((id) => rawProductSource.find((product) => productMatchesKey(product, id)))
      .filter((product): product is Product => Boolean(product));
    return selected.length > 0 ? selected : rawProductSource;
  }, [rawProductSource, content.collectionProductIds]);

  const params = React.useMemo(() => new URLSearchParams(window.location.search), []);
  const initialCategory = params.get('category') as StoryCategoryKey | null;
  const [searchQuery, setSearchQuery] = React.useState(params.get('q') || '');
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | StoryCategoryKey>(
    initialCategory && STORY_CATEGORIES.some((category) => category.key === initialCategory) ? initialCategory : 'all'
  );
  const [selectedGender, setSelectedGender] = React.useState<GenderFilter>((params.get('gender') as GenderFilter) || 'all');
  const [selectedSize, setSelectedSize] = React.useState(params.get('size') || 'All');
  const [selectedBrand, setSelectedBrand] = React.useState(params.get('brand') || 'All');
  const [sortBy, setSortBy] = React.useState<SortOption>((params.get('sort') as SortOption) || 'newest');
  const [activeDropdown, setActiveDropdown] = React.useState<FilterMenu>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const activeCategory = selectedCategory === 'all' ? null : getStoryCategory(selectedCategory);
  const genderOptions = getAvailableGenders(activeCategory);
  const sizeOptions = getAvailableSizes(activeCategory, selectedGender);

  React.useEffect(() => {
    if (selectedCategory === 'all') return;
    const category = getStoryCategory(selectedCategory);
    const availableGenders = getAvailableGenders(category);

    if (!availableGenders.includes(selectedGender)) {
      setSelectedGender(availableGenders[0] || 'all');
      setSelectedSize('All');
    }
  }, [selectedCategory, selectedGender]);

  React.useEffect(() => {
    const nextParams = new URLSearchParams();
    if (searchQuery) nextParams.set('q', searchQuery);
    if (selectedCategory !== 'all') nextParams.set('category', selectedCategory);
    if (selectedGender !== 'all') nextParams.set('gender', selectedGender);
    if (selectedSize !== 'All') nextParams.set('size', selectedSize);
    if (selectedBrand !== 'All') nextParams.set('brand', selectedBrand);
    if (sortBy !== 'newest') nextParams.set('sort', sortBy);

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `/collections?${nextQuery}` : '/collections';
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState({}, '', nextUrl);
    }
  }, [searchQuery, selectedBrand, selectedCategory, selectedGender, selectedSize, sortBy]);

  const setCategoryFilter = (category: 'all' | StoryCategoryKey) => {
    setSelectedCategory(category);
    setSelectedSize('All');
    setActiveDropdown(null);

    if (category === 'all') {
      setSelectedGender('all');
      return;
    }

    const availableGenders = getAvailableGenders(getStoryCategory(category));
    setSelectedGender(availableGenders.includes('women') ? 'women' : availableGenders[0] || 'all');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedSize('All');
    setSelectedBrand('All');
    setSortBy('newest');
    setActiveDropdown(null);
    setMobileFiltersOpen(false);
  };

  const filteredProducts = React.useMemo(() => {
    let result = [...productSource];

    if (selectedCategory !== 'all') {
      const categoryProductIds = new Set(filterProductsForStoryCategory(result, selectedCategory).map((product) => product.id));
      result = result.filter((product) => categoryProductIds.has(product.id));
    }

    if (selectedSize !== 'All') {
      result = result.filter((product) => product.sizes?.includes(selectedSize));
    }

    if (selectedBrand !== 'All') {
      const brand = selectedBrand.toLowerCase();
      result = result.filter((product) => productBrandText(product).includes(brand));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) => (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sizes?.some((size) => size.toLowerCase().includes(query)) ||
        productBrandText(product).includes(query)
      ));
    }

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [productSource, searchQuery, selectedBrand, selectedCategory, selectedSize, sortBy]);

  const categoryDropdownOptions = CATEGORY_OPTIONS.map(categoryLabel);
  const categoryValue = categoryLabel(selectedCategory);
  const genderDropdownOptions = genderOptions.map((gender) => gender === 'all' ? 'All' : gender[0].toUpperCase() + gender.slice(1));
  const genderValue = selectedGender === 'all' ? 'All' : selectedGender[0].toUpperCase() + selectedGender.slice(1);
  const sizeDropdownOptions = ['All', ...sizeOptions];
  const sortOptions = Object.values(SORT_LABELS);
  const sortValue = SORT_LABELS[sortBy];

  const selectCategoryByLabel = (label: string) => {
    const category = CATEGORY_OPTIONS.find((option) => categoryLabel(option) === label) || 'all';
    setCategoryFilter(category);
  };

  const selectGenderByLabel = (label: string) => {
    setSelectedGender(label === 'All' ? 'all' : label.toLowerCase() as StoryGender);
    setSelectedSize('All');
    setActiveDropdown(null);
  };

  const selectSortByLabel = (label: string) => {
    const nextSort = (Object.entries(SORT_LABELS).find(([, value]) => value === label)?.[0] || 'newest') as SortOption;
    setSortBy(nextSort);
    setActiveDropdown(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      id="discover-view-container"
      className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
    >
      <header className="mx-auto max-w-4xl text-center" id="categories-header-title">
        <span className="mb-3 block font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#767676]">
          CURATED DROPS
        </span>
        <h1 className="font-display text-[clamp(2.7rem,10vw,5.75rem)] font-black uppercase leading-none text-[#121212]">
          Shop the Story Edit
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#555555]">
          Verified branded fashion, curated in India across clothing, footwear, and everyday essentials.
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-5" id="search-bar-block">
        <div className="relative flex items-center border border-[#111111] bg-white">
          <Search size={18} strokeWidth={1.5} className="ml-4 text-[#111111]" />
          <input
            type="text"
            placeholder="SEARCH UPPERS, FOOTWEAR, BRANDS OR SIZES..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full border-0 bg-transparent px-4 py-3.5 font-mono text-[11px] tracking-widest text-[#111111] placeholder:text-[#9a9a94] focus:outline-none"
            id="discover-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="px-4 py-2 text-[#767676] transition hover:text-[#121212]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-2 font-mono text-[8px] font-semibold uppercase tracking-widest text-[#767676]">
            SHOP BY CATEGORY:
          </span>
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setCategoryFilter(category)}
              className={`border px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest transition ${
                selectedCategory === category
                  ? 'border-[#121212] bg-[#121212] text-white'
                  : 'border-[#e0e0dc] bg-white text-[#555555] hover:border-[#121212] hover:text-[#121212]'
              }`}
            >
              {categoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      <section aria-label="Category strip" className="overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STORY_CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setCategoryFilter(category.key)}
              className={`group relative h-36 w-36 shrink-0 overflow-hidden border text-left transition sm:h-40 sm:w-44 ${
                selectedCategory === category.key ? 'border-[#111111]' : 'border-[#d8d8d3]'
              }`}
            >
              <img
                src={getCategoryImage(category, selectedGender)}
                alt={category.label}
                className="absolute inset-0 h-full w-full object-cover object-top grayscale brightness-105 transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-white">
                <span className="block font-display text-xl font-black uppercase leading-none">{category.label}</span>
                <span className="mt-2 inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.18em]">
                  Shop <ChevronDown size={10} className="-rotate-90" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="hidden items-center justify-between border-y border-[#121212] bg-[#fafafa] px-4 py-4 lg:flex">
        <div className="flex flex-wrap items-center gap-8">
          <SelectDropdown label="Category" value={categoryValue} options={categoryDropdownOptions} active={activeDropdown === 'category'} onToggle={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')} onSelect={selectCategoryByLabel} />
          <SelectDropdown label="Gender" value={genderValue} options={genderDropdownOptions} active={activeDropdown === 'gender'} onToggle={() => setActiveDropdown(activeDropdown === 'gender' ? null : 'gender')} onSelect={selectGenderByLabel} />
          <SelectDropdown label="Size" value={selectedSize} options={sizeDropdownOptions} active={activeDropdown === 'size'} onToggle={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')} onSelect={(value) => { setSelectedSize(value); setActiveDropdown(null); }} />
          <SelectDropdown label="Brand" value={selectedBrand} options={BRAND_OPTIONS} active={activeDropdown === 'brand'} onToggle={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')} onSelect={(value) => { setSelectedBrand(value); setActiveDropdown(null); }} />
        </div>
        <SelectDropdown label="Sort By" value={sortValue} options={sortOptions} active={activeDropdown === 'sort'} onToggle={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')} onSelect={selectSortByLabel} />
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex w-full items-center justify-center gap-2 border border-[#111111] bg-white px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#111111]"
        >
          <SlidersHorizontal size={14} strokeWidth={1.6} />
          Filter & Sort
        </button>
      </div>

      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[#767676]">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={11} />
          <span>SHOWING {filteredProducts.length} CURATED PIECES</span>
        </div>
        <button type="button" onClick={clearFilters} className="text-[#111111] hover:underline">
          Clear All
        </button>
      </div>

      <div
        className="grid grid-cols-1 overflow-hidden border-l border-t border-[#121212] sm:grid-cols-2 lg:grid-cols-4"
        id="categories-grid-collection-view"
      >
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelectProduct(product)}
            className="group flex cursor-pointer flex-col justify-between border-r border-b border-[#121212] bg-white text-left"
            id={`discover-card-${product.id}`}
          >
            <div className="relative flex aspect-[3/4.1] w-full items-center justify-center overflow-hidden bg-[#f6f5f2]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover grayscale brightness-95 transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-start justify-between border-t border-[#121212] bg-white p-4">
              <div className="min-w-0 space-y-0.5 pr-2">
                <h2 className="truncate text-xs font-medium uppercase tracking-wider text-[#121212] group-hover:underline">
                  {product.name}
                </h2>
                <div className="flex items-center gap-1.5 text-[#767676]">
                  <span className="font-mono text-[8px] uppercase tracking-wider">
                    {product.sizes ? product.sizes.join(' / ') : 'O/S'}
                  </span>
                  <span className="text-[7.5px]">/</span>
                  <span className="max-w-[80px] truncate font-mono text-[8px] uppercase tracking-wider">
                    {product.colors && product.colors.length > 0 ? product.colors[0].name : 'ECRU'}
                  </span>
                </div>
              </div>
              <span className="shrink-0 pt-0.5 font-mono text-xs font-semibold text-[#121212]">
                {formatINR(product.price)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="space-y-3 border border-dashed border-[#121212]/30 py-20 text-center" id="discover-empty-state">
          <p className="font-mono text-xs uppercase text-[#767676]">NO PIECES FOUND</p>
          <p className="text-sm text-[#555555]">Try changing category, size, brand, or gender filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="bg-[#121212] px-6 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-black"
          >
            Reset Filters
          </button>
        </div>
      )}

      <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
        Verified authentic pieces &bull; 100% original &bull; Best price & quality
      </p>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-50 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28 }}
              className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-auto border-t border-[#111111] bg-white p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#111111]">Filter & Sort</p>
                <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={18} strokeWidth={1.6} />
                </button>
              </div>
              <div className="space-y-5">
                <SelectDropdown label="Category" value={categoryValue} options={categoryDropdownOptions} active={activeDropdown === 'category'} onToggle={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')} onSelect={selectCategoryByLabel} />
                <SelectDropdown label="Gender" value={genderValue} options={genderDropdownOptions} active={activeDropdown === 'gender'} onToggle={() => setActiveDropdown(activeDropdown === 'gender' ? null : 'gender')} onSelect={selectGenderByLabel} />
                <SelectDropdown label="Size" value={selectedSize} options={sizeDropdownOptions} active={activeDropdown === 'size'} onToggle={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')} onSelect={(value) => { setSelectedSize(value); setActiveDropdown(null); }} />
                <SelectDropdown label="Brand" value={selectedBrand} options={BRAND_OPTIONS} active={activeDropdown === 'brand'} onToggle={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')} onSelect={(value) => { setSelectedBrand(value); setActiveDropdown(null); }} />
                <SelectDropdown label="Sort By" value={sortValue} options={sortOptions} active={activeDropdown === 'sort'} onToggle={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')} onSelect={selectSortByLabel} />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button type="button" onClick={clearFilters} className="border border-[#111111] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                  Clear All
                </button>
                <button type="button" onClick={() => setMobileFiltersOpen(false)} className="border border-[#111111] bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
