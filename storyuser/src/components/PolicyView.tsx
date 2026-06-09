import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { StorefrontContent } from '../types';

export type PolicyKey = 'privacy' | 'terms' | 'returns';

const policyMeta: Record<PolicyKey, { title: string; eyebrow: string; field: keyof Pick<StorefrontContent, 'privacyPolicy' | 'termsConditions' | 'returnRefundPolicy'> }> = {
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Customer data',
    field: 'privacyPolicy'
  },
  terms: {
    title: 'Terms & Conditions',
    eyebrow: 'Store terms',
    field: 'termsConditions'
  },
  returns: {
    title: 'Return & Refund Policy',
    eyebrow: 'Order support',
    field: 'returnRefundPolicy'
  }
};

const fallbackPolicy = 'This policy is being updated. Please contact STORY support for the latest details.';

const splitPolicy = (content: string) =>
  content
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);

export const PolicyView: React.FC<{
  policyKey: PolicyKey;
  content: StorefrontContent;
  onBack: () => void;
}> = ({ policyKey, content, onBack }) => {
  const meta = policyMeta[policyKey];
  const sections = splitPolicy(String(content[meta.field] || fallbackPolicy));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#f7f7f4] px-4 py-8 text-[#111111] sm:px-6 lg:px-8 lg:py-12"
    >
      <article className="mx-auto max-w-4xl rounded-xl border border-[#d8d3ca] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d6d2c8] bg-white px-4 font-mono text-[10px] uppercase tracking-widest text-[#5f5b52] shadow-sm transition hover:border-[#111111] hover:text-[#111111]"
        >
          <ArrowLeft size={14} strokeWidth={1.6} />
          Back to shop
        </button>

        <div className="mt-8 border-y border-[#d8d3ca] py-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ed]">
              <FileText size={18} strokeWidth={1.5} />
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">{meta.eyebrow}</p>
          </div>
          <h1 className="mt-5 text-4xl font-semibold uppercase leading-none text-[#111111] sm:text-5xl">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5f5b52]">
            This page is managed from the STORY admin settings and reflects the current customer-facing policy copy.
          </p>
        </div>

        <div className="mt-8 space-y-5 text-sm leading-7 text-[#3f3b34] sm:text-base sm:leading-8">
          {sections.map((section, index) => (
            <p key={`${policyKey}-${index}`} className="whitespace-pre-line">
              {section}
            </p>
          ))}
        </div>
      </article>
    </motion.div>
  );
};
