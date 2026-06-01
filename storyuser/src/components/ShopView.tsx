import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, StorefrontContent, StoryCategoryKey } from '../types';
import { PRODUCTS } from '../data';
import { STORY_CATEGORIES, StoryCategory, StoryGender, filterProductsForStoryCategory } from '../categoryConfig';
import { HeroSection } from './HeroSection';
import { CustomerNotesSection } from './CustomerNotesSection';

interface ShopViewProps {
  onSelectProduct: (product: Product) => void;
  setActiveScreen: (screen: any) => void;
  onOpenCategory: (category: StoryCategoryKey) => void;
  products?: Product[];
  content: StorefrontContent;
}

const mainCategoryOrder: StoryCategoryKey[] = ['uppers', 'lowers', 'dresses', 'co-ords', 'footwear'];
const secondaryCategoryOrder: StoryCategoryKey[] = ['accessories', 'inners'];

const categoryImagePosition: Partial<Record<StoryCategoryKey, string>> = {
  lowers: 'object-center',
  footwear: 'object-center',
  accessories: 'object-center',
  inners: 'object-top'
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}

function CategoryImageRotator({ category }: { category: StoryCategory }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const imageEntries = React.useMemo(
    () => (Object.entries(category.images) as [StoryGender | 'default', string][])
      .filter((entry): entry is [StoryGender | 'default', string] => Boolean(entry[1])),
    [category.images]
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const updateMobile = () => setIsMobile(mediaQuery.matches);

    updateMobile();
    mediaQuery.addEventListener('change', updateMobile);
    return () => mediaQuery.removeEventListener('change', updateMobile);
  }, []);

  React.useEffect(() => {
    if (imageEntries.length < 2 || prefersReducedMotion || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % imageEntries.length);
    }, isMobile ? 5000 : 4000);

    return () => window.clearInterval(timer);
  }, [imageEntries.length, isMobile, isPaused, prefersReducedMotion]);

  if (imageEntries.length === 0) return null;

  return (
    <span
      className="absolute inset-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={() => setIsPaused(true)}
      onPointerUp={() => setIsPaused(false)}
    >
      {imageEntries.map(([label, src], index) => (
        <img
          key={`${category.key}-${label}`}
          src={src}
          alt={`STORY ${category.label} ${label}`}
          className={`absolute inset-0 h-full w-full object-cover grayscale contrast-[1.03] brightness-[1.08] transition duration-700 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          } ${categoryImagePosition[category.key] || 'object-top'}`}
          loading={index === 0 ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
        />
      ))}
    </span>
  );
}

function CategoryCard({
  category,
  featured = false,
  onOpenCategory,
  className = ''
}: {
  key?: React.Key;
  category: StoryCategory & { count: number };
  featured?: boolean;
  onOpenCategory: (category: StoryCategoryKey) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenCategory(category.key)}
      aria-label={`Open ${category.label} category`}
      className={`group relative min-h-[260px] overflow-hidden bg-[#f1f0ec] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${
        featured ? 'sm:min-h-[360px] lg:min-h-0' : 'sm:min-h-[260px] lg:min-h-0'
      } ${className}`}
    >
      <span className="absolute inset-0 transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]">
        <CategoryImageRotator category={category} />
      </span>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.72)] from-0% to-transparent to-[60%] transition duration-500 group-hover:from-[rgba(0,0,0,0.82)]" />
      <span className="pointer-events-none absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
        <span
          className={`mb-[0.35rem] block font-medium uppercase leading-none tracking-[0.1em] text-white ${
            featured ? 'text-xl' : 'text-sm'
          }`}
        >
          {category.label}
        </span>
        <span className="block translate-y-1.5 font-mono text-[0.625rem] uppercase tracking-[0.15em] text-white/65 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          Shop Category <ArrowRight size={12} strokeWidth={1.5} className="ml-1 inline-block align-[-2px]" />
        </span>
      </span>
    </button>
  );
}

export const ShopView: React.FC<ShopViewProps> = ({ setActiveScreen, onOpenCategory, products, content }) => {
  const productSource = products && products.length > 0 ? products : PRODUCTS;

  const scrollToProducts = () => {
    window.setTimeout(() => {
      document.getElementById('our-products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 20);
  };

  const categoryTiles = React.useMemo(() => STORY_CATEGORIES.map((category) => {
    const categoryProducts = filterProductsForStoryCategory(productSource, category.key);
    return {
      ...category,
      count: categoryProducts.length
    };
  }), [productSource]);
  const categoryTileMap = React.useMemo(
    () => new Map(categoryTiles.map((category) => [category.key, category])),
    [categoryTiles]
  );
  const mainCategoryTiles = mainCategoryOrder
    .map((key) => categoryTileMap.get(key))
    .filter((category): category is StoryCategory & { count: number } => Boolean(category));
  const secondaryCategoryTiles = secondaryCategoryOrder
    .map((key) => categoryTileMap.get(key))
    .filter((category): category is StoryCategory & { count: number } => Boolean(category));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      id="shop-view-container"
      className="bg-[#fafafa] pb-20 text-[#111111]"
    >
      <HeroSection
        content={content}
        onShopEdit={scrollToProducts}
        onViewLookbook={() => setActiveScreen('discover')}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20" id="our-products-section">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f6f6f]">{content.productsEyebrow}</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            {content.productsTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-[400px] text-[0.875rem] leading-6 text-[#555555]">
            Explore curated essentials across clothing, footwear, and everyday luxury.
          </p>
          <div className="mx-auto mt-7 h-px w-10 bg-[#111111]" aria-hidden="true" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-[3px] bg-white sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr] lg:grid-rows-[260px_260px]">
          {mainCategoryTiles.map((category, index) => (
            <CategoryCard
              key={category.key}
              category={category}
              featured={index === 0}
              onOpenCategory={onOpenCategory}
              className={index === 0 ? 'lg:col-start-1 lg:row-span-2 lg:row-start-1' : ''}
            />
          ))}
        </div>

        {secondaryCategoryTiles.length > 0 && (
          <div className="mx-auto mt-[3px] grid max-w-6xl grid-cols-1 gap-[3px] bg-white sm:grid-cols-2 lg:grid-cols-3">
            {secondaryCategoryTiles.map((category) => (
              <CategoryCard
                key={category.key}
                category={category}
                onOpenCategory={onOpenCategory}
                className="min-h-[220px] sm:min-h-[220px] lg:min-h-[200px]"
              />
            ))}
          </div>
        )}

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-center gap-3 border-t border-black/10 pt-6 text-center font-mono text-[0.625rem] uppercase tracking-[0.18em] text-[#6f6f6f] sm:flex-row sm:gap-8">
          <span>Verified authentic pieces</span>
          <span>100% original</span>
          <span>Best price & quality</span>
        </div>
      </section>

      <CustomerNotesSection />

      <section className="border-y border-[#d8d8d3] bg-white" aria-label="Our story">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6f6f]">Our Story</p>
            <h2 className="mt-4 font-display text-3xl font-black uppercase leading-tight text-[#050505] sm:text-4xl lg:text-5xl">
              Designed in studio. Made to outlast trend.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#555555]">
              Constructed by hand with quiet detail and everyday endurance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveScreen('about')}
            className="group inline-flex w-fit items-center gap-3 border border-[#111111] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#111111] transition hover:bg-[#111111] hover:text-white"
          >
            Read the Story
            <ArrowRight size={15} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </motion.div>
  );
};
