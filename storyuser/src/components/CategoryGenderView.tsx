import React from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, StoryCategoryKey } from '../types';
import { PRODUCTS } from '../data';
import { StoryGender, filterProductsForStoryCategory, getCategoryImage, getStoryCategory } from '../categoryConfig';
import { formatINR } from '../utils/currency';

interface CategoryGenderViewProps {
  categoryKey: StoryCategoryKey;
  products?: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

type FilterGender = StoryGender | 'all';

const splitByGender = (items: Product[]) => ({
  women: items.filter((_, index) => index % 2 === 0),
  men: items.filter((_, index) => index % 2 !== 0)
});

const ProductTile = ({ product, onSelectProduct }: { product: Product; onSelectProduct: (product: Product) => void }) => (
  <button
    type="button"
    onClick={() => onSelectProduct(product)}
    className="group border-r border-b border-[#111111] bg-white text-left"
  >
    <span className="block aspect-[3/4.1] overflow-hidden bg-[#f0f0ec]">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.035] group-hover:grayscale-0"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </span>
    <span className="flex items-start justify-between gap-3 border-t border-[#111111] p-4">
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold uppercase tracking-wide text-[#111111]">{product.name}</span>
        <span className="mt-1 block font-mono text-[9px] uppercase text-[#6f6f6f]">{product.category}</span>
      </span>
      <span className="shrink-0 font-mono text-xs text-[#111111]">{formatINR(product.price)}</span>
    </span>
  </button>
);

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
      selected
        ? 'border-[#111111] bg-[#111111] text-white'
        : 'border-[#cfcfca] bg-white text-[#111111] hover:border-[#111111]'
    }`}
  >
    {label}
  </button>
);

export const CategoryGenderView: React.FC<CategoryGenderViewProps> = ({ categoryKey, products, onBack, onSelectProduct }) => {
  const category = getStoryCategory(categoryKey);
  const source = products && products.length > 0 ? products : PRODUCTS;
  const categoryProducts = filterProductsForStoryCategory(source, categoryKey);
  const genderKeys = Object.keys(category.genders || {}) as StoryGender[];
  const initialGender = (genderKeys.includes('women') ? 'women' : genderKeys[0] || 'all') as FilterGender;
  const [activeGender, setActiveGender] = React.useState<FilterGender>(initialGender);
  const [activeSize, setActiveSize] = React.useState('');
  const [activeSubcategory, setActiveSubcategory] = React.useState(category.subcategories?.[0] || '');
  const heroImage = getCategoryImage(category, activeGender);

  React.useEffect(() => {
    const nextGenderKeys = Object.keys(category.genders || {}) as StoryGender[];
    setActiveGender((nextGenderKeys.includes('women') ? 'women' : nextGenderKeys[0] || 'all') as FilterGender);
    setActiveSize('');
    setActiveSubcategory(category.subcategories?.[0] || '');
  }, [categoryKey, category.genders, category.subcategories]);

  const genderProducts = React.useMemo(() => {
    if (activeGender === 'all' || genderKeys.length <= 1) return categoryProducts;
    return splitByGender(categoryProducts)[activeGender];
  }, [activeGender, categoryProducts, genderKeys.length]);

  const visibleProducts = React.useMemo(() => {
    if (!activeSize) return genderProducts;
    return genderProducts.filter((product) => product.sizes?.includes(activeSize));
  }, [activeSize, genderProducts]);

  const sizeOptions = activeGender !== 'all' ? category.genders?.[activeGender] || [] : [];
  const hasGenderFilter = genderKeys.length > 0;
  const hasSubcategoryFilter = Boolean(category.subcategories?.length);
  const selectionLabel = activeGender === 'all' ? category.label : `${activeGender} selection`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#fafafa] pb-20 text-[#111111]"
      id="category-gender-view"
    >
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
        <div className="flex flex-col justify-between border-y border-[#111111] py-8 lg:min-h-[560px]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#555555] transition hover:text-[#111111]"
          >
            <ArrowLeft size={14} strokeWidth={1.6} />
            Back to STORY
          </button>

          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6f6f]">{category.eyebrow}</p>
            <h1 className="mt-3 font-display text-[clamp(3.5rem,18vw,5.5rem)] font-black uppercase leading-none sm:text-7xl lg:text-8xl">
              {category.label}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#4c4c4c]">{category.description}</p>
          </div>

          <div className="mt-10 space-y-5">
            {hasGenderFilter && (
              <div>
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6f6f6f]">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {genderKeys.map((gender) => (
                    <FilterChip
                      key={gender}
                      label={gender}
                      selected={activeGender === gender}
                      onClick={() => {
                        setActiveGender(gender);
                        setActiveSize('');
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {hasSubcategoryFilter && (
              <div>
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6f6f6f]">Subcategory</p>
                <div className="flex flex-wrap gap-2">
                  {category.subcategories?.map((subcategory) => (
                    <FilterChip
                      key={subcategory}
                      label={subcategory}
                      selected={activeSubcategory === subcategory}
                      onClick={() => setActiveSubcategory(subcategory)}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizeOptions.length > 0 && (
              <div>
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6f6f6f]">Size</p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="All" selected={!activeSize} onClick={() => setActiveSize('')} />
                  {sizeOptions.map((size) => (
                    <FilterChip
                      key={size}
                      label={size}
                      selected={activeSize === size}
                      onClick={() => setActiveSize(size)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden bg-[#e9e9e5] sm:min-h-[420px] lg:min-h-[560px]">
          <img
            src={heroImage}
            alt={`STORY ${category.label} ${activeGender}`}
            className="h-full w-full object-cover object-top grayscale"
          />
          <div className="absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] bg-white px-5 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6f6f6f]">Story category</p>
            <p className="mt-1 text-xs font-semibold uppercase text-[#111111]">{selectionLabel}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 border-y border-[#111111] py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
            <SlidersHorizontal size={14} strokeWidth={1.6} />
            {visibleProducts.length} pieces
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#111111]">
            {activeSize ? `Size ${activeSize}` : 'All sizes'}
          </p>
        </div>

        <div className="overflow-hidden border-l border-t border-[#111111] bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <ProductTile product={product} onSelectProduct={onSelectProduct} />
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-full border-r border-b border-[#111111] bg-[#fafafa] px-6 py-16 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">
                  Products coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
