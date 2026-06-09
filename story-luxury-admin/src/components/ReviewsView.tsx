import { Check, Star, Trash2, X } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsViewProps {
  reviews: CustomerReview[];
  onUpdateStatus: (id: string, status: CustomerReview['status']) => void;
  onDeleteReview: (id: string) => void;
}

const statusClass: Record<CustomerReview['status'], string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200'
};

export default function ReviewsView({ reviews, onUpdateStatus, onDeleteReview }: ReviewsViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Customer Reviews</h2>
        <p className="mt-1 text-sm text-neutral-500">Approve customer notes before they appear on the storefront.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-950">{review.name}</h3>
                  <span className={`rounded border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${statusClass[review.status]}`}>
                    {review.status}
                  </span>
                  <span className="rounded border border-neutral-200 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                    {review.tag}
                  </span>
                </div>
                <div className="mt-3 flex gap-1 text-neutral-950">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} fill={index < review.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-700">{review.review}</p>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => onUpdateStatus(review.id, 'approved')}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Check size={13} />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(review.id, 'rejected')}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-100"
                >
                  <X size={13} />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteReview(review.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}

        {reviews.length === 0 && (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">
            No customer reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}
