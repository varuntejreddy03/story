import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Grid2X2,
  PackageSearch,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Category, Product } from '../types';
import { PRODUCTS } from '../data';
import { formatINR } from '../utils/currency';

interface CategoryGenderViewProps {
  categorySlug: string;
  categories?: Category[];
  products?: Product[];
  onBack: () => void;
  onOpenCategory?: (categorySlug: string) => void;
  onSelectProduct: (product: Product) => void;
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const fallbackHeroImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85';

const normalize = (value = '') =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const singular = (value = '') => normalize(value).replace(/ies$/, 'y').replace(/s$/, '');

const displayCategoryName = (category?: Category, slug = '') => {
  const name = category?.name || slug.replace(/-/g, ' ');
  if (singular(name) === 'accessorie' || singular(name) === 'accessory') return 'Accessories';
  if (singular(name) === 'lower') return 'Lowers';
  if (singular(name) === 'upper') return 'Uppers';
  return name;
};

const productMatchesCategory = (product: Product, category?: Category, slug?: string) => {
  if (!category && !slug) return false;
  const productCategory = normalize(product.category);
  const productCategorySingular = singular(product.category);
  const categoryName = normalize(category?.name || '');
  const categoryNameSingular = singular(category?.name || '');
  const categorySlug = normalize(category?.slug || slug || '');
  const categorySlugSingular = singular(category?.slug || slug || '');

  return product.categoryId === category?.id
    || productCategory === categoryName
    || productCategory === categorySlug
    || productCategorySingular === categoryNameSingular
    || productCategorySingular === categorySlugSingular;
};

const compactCountLabel = (count: number, singularLabel: string, pluralLabel: string) =>
  `${count} ${count === 1 ? singularLabel : pluralLabel}`;

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-9 shrink-0 rounded-full border px-4 text-xs font-medium uppercase tracking-[0.12em] transition ${
      selected
        ? 'border-black bg-black text-white'
        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
    }`}
  >
    {label}
  </button>
);

const ProductTile: React.FC<{
  product: Product;
  fallbackImage: string;
  onSelectProduct: (product: Product) => void;
}> = ({ product, fallbackImage, onSelectProduct }) => {
  const imageCandidates = React.useMemo(
    () => Array.from(new Set([product.image, product.secondaryImage, ...(product.listImages || []), fallbackImage].filter(Boolean))),
    [fallbackImage, product.image, product.listImages, product.secondaryImage]
  );
  const [imageIndex, setImageIndex] = React.useState(0);
  const [imageUnavailable, setImageUnavailable] = React.useState(false);
  const currentImage = imageCandidates[imageIndex];
  const sizes = product.sizes || [];
  const discounted = typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  const discountPercent = discounted ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  React.useEffect(() => {
    setImageIndex(0);
    setImageUnavailable(false);
  }, [product.id, imageCandidates]);

  const handleImageError = () => {
    if (imageIndex < imageCandidates.length - 1) {
      setImageIndex((index) => index + 1);
      return;
    }
    setImageUnavailable(true);
  };

  return (
    <button
      type="button"
      onClick={() => onSelectProduct(product)}
      className="group w-full overflow-hidden rounded-lg border border-[#d8d3ca] bg-white text-left shadow-sm transition-transform duration-200 hover:-translate-y-1"
    >
      <span className="relative block aspect-[3/4] overflow-hidden bg-[#e9e4da]">
        {!imageUnavailable && currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#eeeae1] px-6 text-center">
            <PackageSearch size={26} strokeWidth={1.4} className="text-[#111111]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#5f5b52]">
              Image preview coming soon
            </span>
          </span>
        )}
        {discounted && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#111111] shadow-sm">
            {discountPercent}% off
          </span>
        )}
      </span>
      <span className="block p-3 sm:p-4">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium uppercase tracking-wide text-gray-900 sm:text-sm">{product.name}</span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-[#6f6b62]">{product.category}</span>
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-sm font-semibold text-gray-900">{formatINR(product.price)}</span>
            {discounted && (
              <span className="mt-1 block font-mono text-[10px] text-[#8b877e] line-through">
                {formatINR(product.originalPrice!)}
              </span>
            )}
          </span>
        </span>
        <span className="mt-4 flex items-center justify-between gap-3 border-t border-[#ece9e1] pt-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 sm:text-xs">
            {sizes.slice(0, 4).join(' / ') || 'One size'}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-[#111111] group-hover:underline sm:text-xs">
            View
            <ArrowRight size={12} />
          </span>
        </span>
      </span>
    </button>
  );
};

const TrustItem: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 border-t border-[#dedbd2] py-4 first:border-t-0">
    <Icon className="mt-0.5 shrink-0 text-[#111111]" size={17} strokeWidth={1.5} />
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest text-[#6f6b62]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  </div>
);

const ServiceCard: React.FC<{ icon: React.ElementType; title: string; body: string }> = ({ icon: Icon, title, body }) => (
  <div className="flex min-w-[200px] shrink-0 items-start gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm sm:min-w-[220px] lg:min-w-0 lg:flex-1">
    <Icon size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#111111]" />
    <div>
      <p className="text-xs font-semibold text-[#111111]">{title}</p>
      <p className="mt-1 text-[11px] leading-4 text-gray-500">{body}</p>
    </div>
  </div>
);

export const CategoryGenderView: React.FC<CategoryGenderViewProps> = ({
  categorySlug,
  categories = [],
  products,
  onBack,
  onOpenCategory,
  onSelectProduct
}) => {
  const category = React.useMemo(
    () => categories.find((item) => normalize(item.slug) === normalize(categorySlug) || singular(item.slug) === singular(categorySlug)),
    [categories, categorySlug]
  );
  const source = products && products.length > 0 ? products : PRODUCTS;
  const categoryProducts = React.useMemo(
    () => source.filter((product) => productMatchesCategory(product, category, categorySlug)),
    [category, categorySlug, source]
  );
  const [activeSize, setActiveSize] = React.useState('');
  const [sortMode, setSortMode] = React.useState<'featured' | 'low' | 'high'>('featured');
  const heroImage = category?.image || fallbackHeroImage;
  const title = displayCategoryName(category, categorySlug);
  const categoryOptions = React.useMemo(
    () => categories
      .filter((item) => item.isActive !== false)
      .slice()
      .sort((a, b) => (a.sortOrder - b.sortOrder) || a.name.localeCompare(b.name)),
    [categories]
  );
  const selectedCategorySlug = category?.slug || categorySlug;

  React.useEffect(() => {
    setActiveSize('');
    setSortMode('featured');
  }, [categorySlug]);

  const sizeOptions = React.useMemo(
    () => Array.from(new Set(categoryProducts.flatMap((product) => product.sizes || []))),
    [categoryProducts]
  );

  const visibleProducts = React.useMemo(() => {
    const filtered = activeSize
      ? categoryProducts.filter((product) => product.sizes?.includes(activeSize))
      : categoryProducts;

    if (sortMode === 'low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sortMode === 'high') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [activeSize, categoryProducts, sortMode]);

  const productGridClass = React.useMemo(() => {
    if (visibleProducts.length === 1) {
      return 'mx-auto grid max-w-xs grid-cols-1 gap-3 px-4 sm:max-w-sm sm:px-0';
    }

    if (visibleProducts.length === 2) {
      return 'grid grid-cols-2 gap-3 px-4 sm:px-0 sm:gap-6';
    }

    return 'grid grid-cols-2 gap-3 px-4 sm:px-0 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4';
  }, [visibleProducts.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#f6f5f1] pb-16 text-[#111111] sm:pb-20"
      id="category-gender-view"
    >
      <section className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d6d2c8] bg-white px-4 font-mono text-[10px] uppercase tracking-widest text-[#5f5b52] shadow-sm transition hover:border-[#111111] hover:text-[#111111]"
          >
            <ArrowLeft size={14} strokeWidth={1.6} />
            Back home
          </button>
          <p className="hidden font-mono text-[10px] uppercase tracking-widest text-[#6f6b62] sm:flex">
            Home / Categories / <span className="text-[#111111]">{title}</span>
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:items-center">
          <div className="border-y border-[#d8d3ca] bg-[#fbfaf7] px-1 py-5 sm:px-0 sm:py-6 lg:py-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] lg:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">Story category</p>
                <h1 className="mt-3 text-4xl font-semibold uppercase leading-none text-[#111111] sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f5b52]">
                  {category?.description || 'Explore STORY pieces selected for this category.'}
                </p>
              </div>

              <div className="divide-y divide-[#dedbd2] border-y border-[#dedbd2] lg:border-y-0">
                <TrustItem icon={PackageSearch} label="Products" value={compactCountLabel(categoryProducts.length, 'piece', 'pieces')} />
                <TrustItem icon={Grid2X2} label="Sizes" value={sizeOptions.length ? compactCountLabel(sizeOptions.length, 'option', 'options') : 'One size'} />
                <TrustItem icon={Truck} label="Delivery" value="Tracked India shipping" />
              </div>
            </div>
          </div>

          <div className="relative order-first h-[min(55vw,220px)] overflow-hidden rounded-xl border border-[#d8d3ca] bg-[#e9e4da] shadow-sm sm:h-64 lg:order-none lg:h-auto lg:max-h-[380px] lg:min-h-[280px]">
            <img
              src={heroImage}
              alt={`${title} category`}
              className="h-full w-full object-cover object-center"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/75">Currently viewing</p>
              <p className="mt-1 text-base font-semibold uppercase text-white">{title}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-[#d8d3ca] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#6f6b62]">
                  <SlidersHorizontal size={14} strokeWidth={1.6} />
                  {visibleProducts.length} of {categoryProducts.length} products
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#111111]">Shop {title}</h2>
              </div>

              <select
                aria-label="Sort products"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as 'featured' | 'low' | 'high')}
                className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-[#111111] outline-none transition focus:border-[#111111] md:hidden"
              >
                <option value="featured">Featured</option>
                <option value="low">Price low to high</option>
                <option value="high">Price high to low</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:justify-end">
              {categoryOptions.length > 1 && (
                <label className="flex w-full flex-col gap-1 sm:w-auto">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#6f6b62]">Switch category</span>
                  <select
                    value={selectedCategorySlug}
                    onChange={(event) => onOpenCategory?.(event.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-[#111111] outline-none transition focus:border-[#111111] sm:min-w-48"
                  >
                    {categoryOptions.map((item) => (
                      <option key={item.id} value={item.slug}>
                        {displayCategoryName(item, item.slug)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="hidden flex-col gap-1 md:flex">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#6f6b62]">Sort</span>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as 'featured' | 'low' | 'high')}
                  className="h-9 min-w-48 rounded-lg border border-gray-300 bg-white px-3 text-sm text-[#111111] outline-none transition focus:border-[#111111]"
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price low to high</option>
                  <option value="high">Price high to low</option>
                </select>
              </label>
            </div>
          </div>

          {sizeOptions.length > 0 && (
            <div className="scrollbar-hide -mx-1 mt-4 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:px-0">
              <FilterChip label="All sizes" selected={!activeSize} onClick={() => setActiveSize('')} />
              {sizeOptions.map((size) => (
                <FilterChip
                  key={size}
                  label={size}
                  selected={activeSize === size}
                  onClick={() => setActiveSize(size)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="scrollbar-hide mt-5 flex flex-nowrap gap-3 overflow-x-auto pb-2 lg:gap-4 lg:overflow-visible lg:pb-0">
          <ServiceCard
            icon={ShieldCheck}
            title="Verified pieces"
            body="Every item is reviewed for authenticity, finish, and condition before it reaches your wardrobe."
          />
          <ServiceCard
            icon={Ruler}
            title="Size support"
            body="Use size filters first, then open a product for available sizes, fit details, and delivery options."
          />
          <ServiceCard
            icon={Truck}
            title="Fast checkout"
            body="Cart, address, payment, and confirmation stay in one clear flow so ordering feels predictable."
          />
        </div>

        {visibleProducts.length > 0 ? (
          <div className={`mt-5 ${productGridClass}`}>
            {visibleProducts.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                fallbackImage={heroImage}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-[#cfcac0] bg-white px-6 py-16 text-center shadow-sm">
            <Sparkles className="mx-auto text-[#111111]" size={26} strokeWidth={1.4} />
            <p className="mt-4 text-lg font-semibold text-[#111111]">No products in this selection</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6a665d]">
              Try another size or switch to a nearby category from the shop toolbar.
            </p>
            {activeSize && (
              <button
                type="button"
                onClick={() => setActiveSize('')}
                className="mt-5 h-10 rounded-full border border-[#111111] px-5 font-mono text-[10px] uppercase tracking-widest transition hover:bg-[#111111] hover:text-white"
              >
                Clear size filter
              </button>
            )}
          </div>
        )}
      </section>
    </motion.div>
  );
};
