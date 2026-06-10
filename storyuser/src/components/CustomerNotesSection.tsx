import React from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { storyApi } from '../api';
import { CustomerReview } from '../types';

const DEFAULT_TESTIMONIALS: CustomerReview[] = [
  {
    name: 'Sanjay Gupta',
    tag: 'FAST DELIVERY',
    rating: 5,
    review: 'Liked the delivery speed. Got my order in 4 days. Good product.'
  },
  {
    name: 'Vishal Singh',
    tag: 'PREMIUM QUALITY',
    rating: 5,
    review: "I shopped here for my birthday and couldn't be happier. Loved my Tommy t-shirt."
  },
  {
    name: 'Rahul Mehta',
    tag: 'PERFECT FIT',
    rating: 5,
    review: 'The fit was clean and the quality felt premium. Definitely ordering again.'
  },
  {
    name: 'Ananya Rao',
    tag: 'VERIFIED PURCHASE',
    rating: 5,
    review: 'Packaging was neat, and the product looked exactly like the photos.'
  },
  {
    name: 'Karan Shah',
    tag: 'BEST VALUE',
    rating: 5,
    review: 'Best place for branded fashion at a good price.'
  }
];

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

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="text-[15px] leading-none text-[#111111]" aria-hidden="true">
          {index < rating ? '\u2605' : '\u2606'}
        </span>
      ))}
    </span>
  );
}

function useVisibleTestimonialCount() {
  const [visibleCount, setVisibleCount] = React.useState(1);

  React.useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const tabletQuery = window.matchMedia('(min-width: 640px)');
    const updateCount = () => {
      if (desktopQuery.matches) {
        setVisibleCount(3);
        return;
      }

      if (tabletQuery.matches) {
        setVisibleCount(2);
        return;
      }

      setVisibleCount(1);
    };

    updateCount();
    desktopQuery.addEventListener('change', updateCount);
    tabletQuery.addEventListener('change', updateCount);
    return () => {
      desktopQuery.removeEventListener('change', updateCount);
      tabletQuery.removeEventListener('change', updateCount);
    };
  }, []);

  return visibleCount;
}

export function CustomerNotesSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const visibleCount = useVisibleTestimonialCount();
  const [testimonials, setTestimonials] = React.useState<CustomerReview[]>(DEFAULT_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', rating: '5', category: '', review: '' });

  React.useEffect(() => {
    let mounted = true;

    storyApi.reviews()
      .then((reviews) => {
        if (mounted && reviews.length > 0) setTestimonials(reviews);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, testimonials.length]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const visibleTestimonials = Array.from({ length: Math.min(visibleCount, testimonials.length) }, (_, offset) => {
    const index = (activeIndex + offset) % testimonials.length;
    return { testimonial: testimonials[index], index };
  });

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextReview: CustomerReview = {
      name: form.name.trim() || 'STORY Customer',
      tag: (form.category.trim() || 'VERIFIED PURCHASE').toUpperCase(),
      rating: Number(form.rating) || 5,
      review: form.review.trim()
    };

    if (!nextReview.review) return;

    try {
      await storyApi.createReview(nextReview);
      setSubmitted(true);
      setForm({ name: '', rating: '5', category: '', review: '' });
    } catch {
      setTestimonials([nextReview, ...testimonials]);
      setActiveIndex(0);
      setSubmitted(true);
      setForm({ name: '', rating: '5', category: '', review: '' });
    }
  };

  return (
    <section className="bg-[#EFECE6] px-5 py-14 text-[#111111] sm:px-6 sm:py-16 lg:px-8 lg:py-20" aria-label="Customer notes">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B625A]">Customer Notes</p>
          <h2 className="mt-3 font-display text-3xl font-black text-[#111111] sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[#6B625A]">
            Real words from shoppers who found their perfect STORY piece.
          </p>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-5 transition-opacity duration-500 ease-out sm:gap-6">
            {visibleTestimonials.map(({ testimonial, index }) => (
              <article
                key={`${testimonial.name}-${index}`}
                className="w-full shrink-0 sm:w-[calc((100%_-_1.5rem)_/_2)] lg:w-[calc((100%_-_3rem)_/_3)]"
              >
                <div className="flex h-full flex-col rounded-lg border border-[#DDD8CF] bg-white p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[15px] font-semibold text-[#111111]">
                      {testimonial.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#EFECE6] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#6B625A]">
                      {testimonial.tag}
                    </span>
                  </div>
                  <div className="mt-3">
                    <RatingStars rating={testimonial.rating} />
                  </div>
                  <p className="mt-3 flex-1 text-[14px] leading-[1.65] text-[#6B625A]">
                    &ldquo;{testimonial.review}&rdquo;
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8CF] bg-white text-[#111111] transition hover:border-[#111111] hover:bg-[#111111] hover:text-white"
            >
              <ArrowLeft size={15} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8CF] bg-white text-[#111111] transition hover:border-[#111111] hover:bg-[#111111] hover:text-white"
            >
              <ArrowRight size={15} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setSubmitted(false);
              }}
              className="inline-flex h-10 items-center gap-2 bg-[#111111] px-5 text-[12px] font-semibold text-white transition hover:bg-black"
            >
              Write a Review <ArrowRight size={13} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-label="Write a review">
          <div className="w-full max-w-lg border border-[#111111] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6f6f6f]">Customer Note</p>
                <h3 className="mt-2 font-display text-3xl font-black uppercase leading-none">Write a Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close review modal"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#111111] transition hover:bg-[#111111] hover:text-white"
              >
                <X size={15} strokeWidth={1.6} />
              </button>
            </div>

            {submitted ? (
              <div className="border border-[#d8d8d3] bg-[#fafafa] px-5 py-8 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#111111]">
                  Thank you. Your review has been submitted for approval.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={submitReview}>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full border border-[#cfcfca] bg-white px-4 py-3 text-sm text-[#111111]"
                  placeholder="Name"
                />
                <div>
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#6f6f6f]">Rating</p>
                  <div className="flex gap-2" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setForm({ ...form, rating: String(rating) })}
                        className="text-3xl text-[#111111] transition hover:scale-110"
                        role="radio"
                        aria-checked={Number(form.rating) === rating}
                        aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
                      >
                        {rating <= Number(form.rating) ? '\u2605' : '\u2606'}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className="w-full border border-[#cfcfca] bg-white px-4 py-3 text-sm text-[#111111]"
                  placeholder="Product or category optional"
                />
                <textarea
                  value={form.review}
                  onChange={(event) => setForm({ ...form, review: event.target.value })}
                  className="min-h-32 w-full resize-none border border-[#cfcfca] bg-white px-4 py-3 text-sm text-[#111111]"
                  placeholder="Review message"
                  required
                />
                <button
                  type="submit"
                  className="w-full border border-[#111111] bg-[#111111] px-6 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-[#111111]"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
