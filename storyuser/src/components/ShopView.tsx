import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, StorefrontContent } from '../types';
import { CATEGORIES, PRODUCTS } from '../data';
import { formatINR } from '../utils/currency';

interface ShopViewProps {
  onSelectProduct: (product: Product) => void;
  setActiveScreen: (screen: any) => void;
  products?: Product[];
  content: StorefrontContent;
}

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85',
    alt: 'Model in a black tailored shirt from the STORY latest collection'
  },
  {
    src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
    alt: 'Model in soft grey knitwear styled for STORY'
  },
  {
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85',
    alt: 'Minimal monochrome fashion detail'
  }
];

const PRODUCT_GRID_IDS = [
  'wide-legged-pants',
  'relaxed-linen-shirt',
  'crew-neck-sweater',
  'classic-mini-dress',
  'canvas-tote-bag',
  'elongated-blazer',
  'oversized-wool-coat',
  'rib-knit-tank-top'
];

const RECOMMENDATION_IDS = [
  'linen-wide-pants',
  'faux-leather-jacket',
  'gray-tube-top',
  'drawstring-linen-pants',
  'convertible-crossbody-bag'
];

const CATEGORY_GROUPS: Record<string, string[]> = {
  'NEW ARRIVAL': ['wide-legged-pants', 'relaxed-linen-shirt', 'crew-neck-sweater'],
  SALE: ['wide-legged-pants', 'classic-mini-dress', 'canvas-tote-bag'],
  FEATURED: ['elongated-blazer', 'oversized-wool-coat', 'rib-knit-tank-top']
};

const STATS = [
  ['700+', 'Collections'],
  ['8', 'Categories'],
  ['5+', 'Collaborations'],
  ['380', 'Brands']
];

function ProductCard({ product, onSelectProduct }: { product: Product; onSelectProduct: (product: Product) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelectProduct(product)}
      className="group min-w-0 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111]"
    >
      <span className="block aspect-[3/4.15] overflow-hidden bg-[#efefed]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.035] group-hover:grayscale-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </span>
      <span className="mt-4 block min-h-12 text-center">
        <span className="block text-[12px] font-medium uppercase leading-tight text-[#111111]">
          {product.name}
        </span>
        <span className="mt-1 block font-mono text-[11px] text-[#111111]">
          {formatINR(product.price)}
        </span>
      </span>
    </button>
  );
}

const productMatchesKey = (product: Product, key: string) => product.id === key || product.slug === key;

export const ShopView: React.FC<ShopViewProps> = ({ onSelectProduct, setActiveScreen, products, content }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const productSource = products && products.length > 0 ? products : PRODUCTS;

  const productItems = React.useMemo(
    () => {
      const curated = PRODUCT_GRID_IDS
        .map((id) => productSource.find((product) => productMatchesKey(product, id)))
        .filter((product): product is Product => Boolean(product));

      return curated.length >= 4 ? curated : productSource.slice(0, 8);
    },
    [productSource]
  );

  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === 'ALL') {
      return productItems;
    }

    const groupedIds = CATEGORY_GROUPS[selectedCategory];
    if (groupedIds) {
      return productItems.filter((product) => groupedIds.some((id) => productMatchesKey(product, id)));
    }

    return productItems.filter((product) => product.category.toUpperCase() === selectedCategory);
  }, [productItems, selectedCategory]);

  const recommendationItems = React.useMemo(
    () => {
      const curated = RECOMMENDATION_IDS
        .map((id) => productSource.find((product) => productMatchesKey(product, id)))
        .filter((product): product is Product => Boolean(product));

      return curated.length >= 3 ? curated : productSource.slice(0, 5);
    },
    [productSource]
  );

  const scrollToProducts = (category = 'ALL') => {
    setSelectedCategory(category);
    window.setTimeout(() => {
      document.getElementById('our-products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 20);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      id="shop-view-container"
      className="bg-[#fafafa] pb-20 text-[#111111]"
    >
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:px-8" id="editorial-hero">
        <div className="max-w-3xl space-y-7">
          <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">{content.heroEyebrow}</p>
          <h1 className="font-display text-6xl font-black uppercase leading-none text-[#050505] sm:text-7xl lg:text-8xl">
            {content.heroTitle}
          </h1>
          <p className="max-w-sm text-sm leading-6 text-[#4c4c4c]">
            {content.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToProducts()}
              className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white transition hover:bg-black"
            >
              {content.heroPrimaryCta}
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('discover')}
              className="inline-flex items-center gap-2 border border-[#111111] bg-transparent px-5 py-3 font-mono text-[10px] uppercase text-[#111111] transition hover:bg-white"
            >
              {content.heroSecondaryCta}
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="relative min-h-[390px] sm:min-h-[520px] lg:min-h-[610px]" aria-label="STORY editorial image composition">
          <div className="absolute left-0 top-8 h-[72%] w-[58%] overflow-hidden bg-[#e7e7e4] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <img
              src={content.heroImagePrimary || HERO_IMAGES[0].src}
              alt={HERO_IMAGES[0].alt}
              className="h-full w-full object-cover object-top grayscale"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute right-0 top-0 h-[64%] w-[54%] rotate-2 overflow-hidden bg-[#eeeeec] shadow-[0_18px_50px_rgba(0,0,0,0.09)]">
            <img
              src={content.heroImageSecondary || HERO_IMAGES[1].src}
              alt={HERO_IMAGES[1].alt}
              className="h-full w-full object-cover object-top grayscale"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 right-[12%] h-[34%] w-[42%] -rotate-3 overflow-hidden bg-[#f4f4f2] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <img
              src={content.heroImageDetail || HERO_IMAGES[2].src}
              alt={HERO_IMAGES[2].alt}
              className="h-full w-full object-cover object-center grayscale"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-8 left-3 bg-white px-5 py-4 shadow-[0_10px_36px_rgba(0,0,0,0.08)] sm:left-8">
            <p className="font-mono text-[9px] uppercase text-[#6f6f6f]">{content.heroBadgeEyebrow}</p>
            <p className="mt-1 text-xs uppercase text-[#111111]">{content.heroBadgeText}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="our-products-section">
        <div className="mb-9 text-center">
          <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">{content.productsEyebrow}</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            {content.productsTitle}
          </h2>
        </div>

        <div className="mx-auto mb-12 flex max-w-5xl flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`border px-4 py-2 font-mono text-[9px] uppercase transition ${
                selectedCategory === category
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#cfcfcb] bg-white text-[#555555] hover:border-[#111111] hover:text-[#111111]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {filteredProducts.map((product) => (
              <React.Fragment key={product.id}>
                <ProductCard product={product} onSelectProduct={onSelectProduct} />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md border border-dashed border-[#bdbdb9] bg-white px-6 py-12 text-center">
            <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">
              This category is being prepared for the next STORY release.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className="mt-5 bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white"
            >
              View All
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8" id="perfect-match-section">
        <div className="aspect-[5/4] overflow-hidden bg-[#e9e9e6]">
          <img
            src={content.collectionImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'}
            alt="STORY styled knitwear campaign"
            className="h-full w-full object-cover object-top grayscale"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-8 lg:pl-8">
          <div>
            <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">{content.collectionEyebrow}</p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none sm:text-6xl lg:text-7xl">
              {content.collectionTitle}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-[#4c4c4c]">
              {content.collectionBody}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-[#d8d8d3] pt-8 sm:grid-cols-4">
            {STATS.map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-3xl font-black text-[#111111]">{value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase text-[#6f6f6f]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="story-jewelry">
        <div className="mb-9 text-center">
          <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">{content.jewelryEyebrow}</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            {content.jewelryTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid min-h-[520px] grid-cols-5 grid-rows-6 gap-5">
            <div className="col-span-5 row-span-4 overflow-hidden bg-[#eeeeec] sm:col-span-3 sm:row-span-6">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85"
                alt="Model wearing minimal STORY earrings"
                className="h-full w-full object-cover object-center grayscale"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-5 row-span-2 overflow-hidden bg-[#111111] sm:col-span-2 sm:row-span-3">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85"
                alt="Close up of minimal rings and accessories"
                className="h-full w-full object-cover object-center grayscale"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-5 row-span-2 hidden overflow-hidden bg-[#eeeeec] sm:col-span-2 sm:row-span-3 sm:block">
              <img
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85"
                alt="Minimal necklace detail from STORY jewelry"
                className="h-full w-full object-cover object-center grayscale"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex items-end bg-white p-7 shadow-[0_14px_42px_rgba(0,0,0,0.06)] sm:p-10">
            <div className="space-y-6">
              <ShoppingBag size={22} strokeWidth={1.4} />
              <p className="max-w-sm text-2xl font-medium leading-tight text-[#111111]">
                {content.jewelryBody}
              </p>
              <button
                type="button"
                onClick={() => scrollToProducts('ACCESSORY')}
                className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white transition hover:bg-black"
              >
                Shop Now
                <ArrowRight size={14} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="shop-recommendations">
        <div className="mb-9 text-center">
          <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">{content.recommendationEyebrow}</p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
            {content.recommendationTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
          {recommendationItems.map((product) => (
            <React.Fragment key={product.id}>
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </React.Fragment>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
