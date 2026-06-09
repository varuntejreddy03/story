import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveScreen, StorefrontContent } from '../types';

interface AboutViewProps {
  content: StorefrontContent;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ content, setActiveScreen }) => {
  const aboutImages = [
    {
      src: content.aboutImage1,
      alt: 'STORY monochrome tailoring campaign'
    },
    {
      src: content.aboutImage2,
      alt: 'STORY knitwear and daily wardrobe styling'
    },
    {
      src: content.aboutImage3,
      alt: 'STORY editorial fashion silhouette'
    }
  ];
  const aboutStats = content.aboutStats.filter(([value, label]) => value || label);
  const aboutValues = content.aboutValues.filter((value) => value.title || value.text);

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
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">{content.aboutEyebrow}</p>
            <h1 className="font-display text-6xl font-black uppercase leading-none text-[#050505] sm:text-7xl lg:text-8xl">
              {content.aboutTitle}
            </h1>
          </div>

          <div className="max-w-xl space-y-5 text-sm leading-7 text-[#4c4c4c]">
            <p>{content.aboutIntroParagraph1}</p>
            <p>{content.aboutIntroParagraph2}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveScreen('shop')}
              className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 font-mono text-[10px] uppercase text-white transition hover:bg-black"
            >
              {content.aboutPrimaryCtaText}
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('discover')}
              className="inline-flex items-center gap-2 border border-[#111111] bg-transparent px-5 py-3 font-mono text-[10px] uppercase text-[#111111] transition hover:bg-white"
            >
              {content.aboutSecondaryCtaText}
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="grid min-h-[520px] grid-cols-6 grid-rows-6 gap-4">
          <div className="col-span-4 row-span-4 overflow-hidden bg-[#eeeeec]">
            <img
              src={aboutImages[0].src}
              alt={aboutImages[0].alt}
              className="h-full w-full object-cover object-top grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-2 row-span-3 overflow-hidden bg-[#e8e8e4]">
            <img
              src={aboutImages[1].src}
              alt={aboutImages[1].alt}
              className="h-full w-full object-cover object-top grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-3 row-span-2 overflow-hidden bg-[#111111]">
            <img
              src={aboutImages[2].src}
              alt={aboutImages[2].alt}
              className="h-full w-full object-cover object-top grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="col-span-3 row-span-3 flex items-end bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.06)]">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">INDIA / EST 2026</p>
              <p className="mt-3 text-xl font-medium leading-tight">
                {content.aboutBadgeText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#deded9] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {aboutStats.map(([value, label]) => (
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
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6f6f]">{content.aboutValuesEyebrow}</p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none sm:text-6xl">
              {content.aboutValuesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {aboutValues.map((value) => (
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
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9f9f9a]">{content.aboutPromiseEyebrow}</p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-black uppercase leading-none sm:text-6xl">
              {content.aboutPromiseTitle}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#d7d7d2]">
              {content.aboutPromiseBody}
            </p>
          </div>
          <div className="min-h-[360px] overflow-hidden bg-[#222222]">
            <img
              src={content.aboutPromiseImage}
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
