import { ArrowRight } from 'lucide-react';
import { StorefrontContent } from '../types';
import { BrandLogoMarquee } from './BrandLogoMarquee';
import { HeroImageSlider } from './HeroImageSlider';

interface HeroSectionProps {
  content: StorefrontContent;
  onShopEdit: () => void;
  onViewLookbook: () => void;
}

export function HeroSection({ content, onShopEdit, onViewLookbook }: HeroSectionProps) {
  return (
    <>
      <section
        className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden px-4 pb-10 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:px-8"
        id="editorial-hero"
      >
        <div className="max-w-3xl space-y-7">
          <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">
            {content.heroEyebrow || 'NEW EDITORIAL CAPSULE'}
          </p>
          <h1 className="font-display text-[clamp(3.4rem,18vw,5.25rem)] font-black uppercase leading-none text-[#050505] sm:text-7xl lg:text-8xl">
            {content.heroTitle || 'OUR LATEST STORY'}
          </h1>
          <p className="max-w-sm text-sm leading-6 text-[#4c4c4c]">
            {content.heroBody || 'Discover verified branded fashion, curated in India for everyday premium style.'}
          </p>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={onShopEdit}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white transition hover:bg-black sm:w-auto"
            >
              {content.heroPrimaryCta || 'SHOP THE DROP'}
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={onViewLookbook}
              className="inline-flex w-full items-center justify-center gap-2 border border-[#111111] bg-transparent px-5 py-3 font-mono text-[10px] uppercase text-[#111111] transition hover:bg-white sm:w-auto"
            >
              {content.heroSecondaryCta || 'EXPLORE STYLE EDIT'}
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="min-w-0" aria-label="STORY editorial image slider">
          <HeroImageSlider />
        </div>
      </section>

      <BrandLogoMarquee />
    </>
  );
}
