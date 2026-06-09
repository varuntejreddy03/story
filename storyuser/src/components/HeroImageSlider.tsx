import React from 'react';

interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroImageSliderProps {
  images?: string[];
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    src: '/ChatGPT Image Jun 1, 2026, 07_53_36 PM (1).png',
    alt: 'Female model in monochrome editorial tailoring'
  },
  {
    src: '/ChatGPT Image Jun 1, 2026, 07_53_37 PM (2).png',
    alt: 'Male model in black and white fashion editorial'
  },
  {
    src: '/ChatGPT Image Jun 1, 2026, 07_53_38 PM (3).png',
    alt: 'Female model styled for a premium STORY capsule'
  },
  {
    src: '/ChatGPT Image Jun 1, 2026, 07_53_39 PM (4).png',
    alt: 'Male model in minimal luxury fashion campaign'
  },
  {
    src: '/ChatGPT Image Jun 1, 2026, 07_53_39 PM (5).png',
    alt: 'Female model in grayscale international magazine styling'
  },
  {
    src: '/ChatGPT Image Jun 1, 2026, 07_53_41 PM (6).png',
    alt: 'Male model in monochrome STORY editorial look'
  }
];

export function HeroImageSlider({ images = [] }: HeroImageSliderProps) {
  const slides = React.useMemo(() => {
    const configuredSources = images.map((src) => src.trim());

    return FALLBACK_SLIDES.map((fallback, index) => {
      const src = configuredSources[index] || fallback.src;
      return {
        src,
        alt: configuredSources[index] ? `STORY editorial hero image ${index + 1}` : fallback.alt
      };
    });
  }, [images]);

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveIndex((current) => Math.min(current, slides.length - 1));
  }, [slides.length]);

  React.useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative mx-auto w-full max-w-[680px] overflow-hidden px-2 pb-9 sm:px-4 lg:pb-10">
      <div className="pointer-events-none absolute left-0 top-8 hidden h-[76%] w-[34%] -rotate-3 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.08)] sm:block" />
      <div className="pointer-events-none absolute right-0 top-0 hidden h-[72%] w-[32%] rotate-3 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.08)] sm:block" />

      <div className="relative mx-auto aspect-[4/5] max-h-[560px] w-full max-w-[430px] overflow-hidden bg-[#e8e8e4] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.12)] sm:p-3 lg:max-h-[620px] lg:max-w-[470px]">
        <div className="relative h-full w-full overflow-hidden bg-[#f2f2ef]">
          {slides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={[
                'absolute inset-0 h-full w-full object-cover object-top grayscale transition-all duration-1000 ease-out',
                index === activeIndex
                  ? 'translate-x-0 scale-100 opacity-100'
                  : 'translate-x-5 scale-[1.025] opacity-0'
              ].join(' ')}
              loading={index === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
            />
          ))}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show editorial image ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={[
              'h-1.5 rounded-full transition-all duration-300',
              index === activeIndex ? 'w-7 bg-[#111111]' : 'w-1.5 bg-[#b8b8b3] hover:bg-[#6f6f6f]'
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
