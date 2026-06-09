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
        className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 overflow-hidden px-4 pb-8 pt-4 sm:px-6 sm:pt-5 md:pt-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8 lg:pt-8"
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
              className="group inline-flex w-full items-center justify-center gap-3 bg-[#111111] px-7 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition hover:bg-black hover:shadow-[0_6px_28px_rgba(0,0,0,0.25)] sm:w-auto"
            >
              {content.heroPrimaryCta || 'EXPLORE COLLECTION'}
              <ArrowRight size={14} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={onViewLookbook}
              className="group inline-flex w-full items-center justify-center gap-3 border border-[#111111] bg-transparent px-7 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#111111] transition hover:bg-[#111111] hover:text-white sm:w-auto"
            >
              {content.heroSecondaryCta || 'VIEW STYLE DIARY'}
              <ArrowRight size={14} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="min-w-0" aria-label="STORY editorial image slider">
          <HeroImageSlider
            images={[
              content.heroImagePrimary,
              content.heroImageSecondary,
              content.heroImageDetail,
              content.heroImageFourth,
              content.heroImageFifth,
              content.heroImageSixth
            ]}
          />
        </div>
      </section>

      <BrandLogoMarquee />
    </>
  );
}
