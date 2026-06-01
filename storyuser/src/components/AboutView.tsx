import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveScreen } from '../types';

interface AboutViewProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

const ABOUT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    alt: 'STORY monochrome tailoring campaign'
  },
  {
    src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
    alt: 'STORY knitwear and daily wardrobe styling'
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
    alt: 'STORY editorial fashion silhouette'
  }
];

const VALUES = [
  {
    title: 'Authentic',
    text: 'Every piece is checked for brand identity, condition, finish, and everyday wearability before it enters the STORY edit.'
  },
  {
    title: 'Curated',
    text: 'We select branded fashion for Indian wardrobes: sharp layers, premium basics, clean footwear, and easy occasion pieces.'
  },
  {
    title: 'Value',
    text: 'The goal is simple: original branded fashion, better prices, and quality that feels worth returning to.'
  }
];

const STATS = [
  ['2026', 'Founded'],
  ['7', 'Core categories'],
  ['100%', 'Original focus'],
  ['INDIA', 'Curated for']
];

export const AboutView: React.FC<AboutViewProps> = ({ setActiveScreen }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-[#fafafa] pb-20 text-[#111111]"
      id="about-view-container"
    >
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-16 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">About STORY India</p>
            <h1 className="font-display text-6xl font-black uppercase leading-none text-[#050505] sm:text-7xl lg:text-8xl">
              Verified Fashion, Curated In India
            </h1>
          </div>

          <div className="max-w-xl space-y-5 text-sm leading-7 text-[#4c4c4c]">
            <p>
              STORY is a premium India-based fashion store built for people who want original branded pieces without the noise of fast, careless shopping.
            </p>
            <p>
              We curate verified branded fashion across uppers, lowers, dresses, co-ords, footwear, accessories, and inners, with a focus on authenticity, condition, price, and everyday Indian style.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveScreen('shop')}
              className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white transition hover:bg-black"
            >
              Shop Verified Picks
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('discover')}
              className="inline-flex items-center gap-2 border border-[#111111] bg-transparent px-5 py-3 font-mono text-[10px] uppercase text-[#111111] transition hover:bg-white"
            >
              View Curated Drops
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="grid min-h-[520px] grid-cols-6 grid-rows-6 gap-4">
          <div className="col-span-4 row-span-4 overflow-hidden bg-[#eeeeec]">
            <img
              src={ABOUT_IMAGES[0].src}
              alt={ABOUT_IMAGES[0].alt}
              className="h-full w-full object-cover object-top grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-2 row-span-3 overflow-hidden bg-[#e8e8e4]">
            <img
              src={ABOUT_IMAGES[1].src}
              alt={ABOUT_IMAGES[1].alt}
              className="h-full w-full object-cover object-top grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-3 row-span-2 overflow-hidden bg-[#111111]">
            <img
              src={ABOUT_IMAGES[2].src}
              alt={ABOUT_IMAGES[2].alt}
              className="h-full w-full object-cover object-top grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-3 row-span-3 flex items-end bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.06)]">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">INDIA / EST 2026</p>
              <p className="mt-3 text-xl font-medium leading-tight">
                Premium branded fashion, checked, styled, and priced for modern Indian wardrobes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#deded9] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map(([value, label]) => (
            <div key={label} className="py-5 text-center">
              <p className="font-display text-4xl font-black uppercase text-[#111111]">{value}</p>
              <p className="mt-2 font-mono text-[9px] uppercase text-[#6f6f6f]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">Our standard</p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none sm:text-6xl">
              Original Pieces, Clear Checks
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.title} className="border border-[#deded9] bg-[#fafafa] p-6">
                <p className="font-display text-2xl font-black uppercase text-[#111111]">{value.title}</p>
                <p className="mt-5 text-sm leading-6 text-[#555555]">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 overflow-hidden bg-[#111111] text-white lg:grid-cols-[1fr_0.8fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9f9f9a]">The STORY promise</p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-black uppercase leading-none sm:text-6xl">
              Verified Authentic. Best Price. Better Quality.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#d7d7d2]">
              From first scroll to final delivery, STORY keeps the edit focused: real branded pieces, clean product presentation, reliable support, and fashion that fits Indian everyday life.
            </p>
          </div>
          <div className="min-h-[360px] overflow-hidden bg-[#222222]">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85"
              alt="STORY monochrome studio fitting"
              className="h-full w-full object-cover object-top grayscale"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
};
