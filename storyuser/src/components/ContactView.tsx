import React from 'react';
import { ArrowRight, CalendarCheck, Mail, MessageCircle, Ruler, Send, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveScreen } from '../types';

interface ContactViewProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onSubmitRequest: (payload: {
    name: string;
    email: string;
    phone?: string;
    topic: string;
    message: string;
  }) => Promise<unknown>;
}

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp Support',
    value: '+91 98765 43210',
    note: 'Chat for quick help with orders and sizing',
    cta: 'Chat on WhatsApp'
  },
  {
    icon: Mail,
    label: 'Email Support',
    value: 'care@story.in',
    note: 'Detailed queries, returns, and order issues',
    cta: 'Email Us'
  },
  {
    icon: Truck,
    label: 'Order Help',
    value: 'Track your order',
    note: 'Check delivery status and shipping updates',
    cta: 'Track Order'
  }
];

const SUPPORT_PILLARS = [
  { icon: CalendarCheck, label: 'Styling Appointments' },
  { icon: Truck, label: 'Order And Delivery Help' },
  { icon: Ruler, label: 'Size And Fit Support' }
];

const CONTACT_IMAGE = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85';
const APPOINTMENT_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85';

export const ContactView: React.FC<ContactViewProps> = ({ setActiveScreen, onSubmitRequest }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    phone: '',
    orderId: '',
    topic: 'Size help',
    message: ''
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      await onSubmitRequest(formState);
      setSubmitted(true);
      setFormState({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        topic: 'Size help',
        message: ''
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not send request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-[#F8F6F1] pb-16 text-[#111111]"
      id="contact-view-container"
    >
      <section className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-12">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#6B625A]">Contact STORY India</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-[#111111] sm:text-5xl">
              Contact STORY
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-[#6B625A]">
              Need help with sizing, delivery, returns, or your order? We'll help you quickly.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {CONTACT_METHODS.map(({ icon: Icon, label, value, note, cta }) => (
                <div key={label} className="rounded-lg border border-[#DDD8CF] bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFECE6]">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-[14px] font-semibold text-[#111111]">{label}</h3>
                  <p className="mt-1 text-[14px] font-medium text-[#111111]">{value}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#6B625A]">{note}</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded border border-[#111111] bg-[#111111] px-4 text-[12px] font-semibold text-white transition hover:bg-black"
                  >
                    {cta}
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 grid overflow-hidden rounded-lg border border-[#deded9] bg-white shadow-sm sm:grid-cols-[0.95fr_1.05fr]">
              <div className="aspect-[4/3] min-h-[220px] overflow-hidden sm:aspect-auto">
                <img
                  src={CONTACT_IMAGE}
                  alt="STORY India styling desk"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center gap-3 p-5 sm:p-6">
                {SUPPORT_PILLARS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 border-b border-[#eeeeea] pb-3 last:border-b-0 last:pb-0">
                    <Icon size={17} strokeWidth={1.6} className="shrink-0" />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#333333]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-[#d7d5ce] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28 lg:p-7"
            id="contact-request-form"
          >
            <div className="mb-6 flex items-start justify-between border-b border-[#deded9] pb-5">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f6f6f]">Client Request</p>
                <h2 className="mt-1 font-display text-2xl font-black uppercase leading-tight text-[#111111]">Write To Us</h2>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#deded9] bg-[#fafafa]">
                <Send size={18} strokeWidth={1.6} />
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {submitted && (
                <div className="rounded-lg border border-[#111111] bg-[#fafafa] p-4 font-mono text-[10px] uppercase leading-relaxed text-[#111111] sm:col-span-2">
                  Your STORY India request has been received. Client care will respond shortly.
                </div>
              )}

              {submitError && (
                <div className="rounded-lg border border-[#111111] bg-white p-4 font-mono text-[10px] uppercase leading-relaxed text-[#111111] sm:col-span-2">
                  {submitError}
                </div>
              )}

              <label className="block">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">Name</span>
                <input
                  value={formState.name}
                  onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d7d5ce] bg-[#fafafa] px-3 text-sm text-[#111111] placeholder:text-[#9a9a95] focus:border-[#111111] focus:bg-white"
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="block">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">Email</span>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d7d5ce] bg-[#fafafa] px-3 text-sm text-[#111111] placeholder:text-[#9a9a95] focus:border-[#111111] focus:bg-white"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">Phone</span>
                <input
                  value={formState.phone}
                  onChange={(event) => setFormState((state) => ({ ...state, phone: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d7d5ce] bg-[#fafafa] px-3 text-sm text-[#111111] placeholder:text-[#9a9a95] focus:border-[#111111] focus:bg-white"
                  placeholder="+91"
                />
              </label>

              <label className="block">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">Order ID <span className="text-[#9a9a95]">(optional)</span></span>
                <input
                  value={formState.orderId}
                  onChange={(event) => setFormState((state) => ({ ...state, orderId: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d7d5ce] bg-[#fafafa] px-3 text-sm text-[#111111] placeholder:text-[#9a9a95] focus:border-[#111111] focus:bg-white"
                  placeholder="ST-XXXXXXXX"
                />
              </label>

              <label className="block">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">Topic</span>
                <select
                  value={formState.topic}
                  onChange={(event) => setFormState((state) => ({ ...state, topic: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d7d5ce] bg-[#fafafa] px-3 text-xs font-semibold text-[#111111] focus:border-[#111111] focus:bg-white"
                >
                  <option value="Size help">Size help</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Return/Exchange">Return / Exchange</option>
                  <option value="Product question">Product question</option>
                  <option value="Order support">Order support</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">Message</span>
                <textarea
                  value={formState.message}
                  onChange={(event) => setFormState((state) => ({ ...state, message: event.target.value }))}
                  className="mt-2 min-h-32 w-full resize-none rounded-lg border border-[#d7d5ce] bg-[#fafafa] p-3 text-sm leading-6 text-[#111111] placeholder:text-[#9a9a95] focus:border-[#111111] focus:bg-white"
                  placeholder="Tell us what you need."
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Message'}
              <ArrowRight size={14} strokeWidth={1.7} />
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-lg bg-[#111111] text-white">
          <img
            src={APPOINTMENT_IMAGE}
            alt="Curated STORY India collection appointment"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#111111]/70" />
          <div className="relative grid grid-cols-1 gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-12">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">Private Preview</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
                Book A Collection Appointment
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80">
                Work with a STORY stylist to build branded looks around occasion, climate, and wardrobe gaps.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveScreen('discover')}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white bg-white px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#111111] transition hover:bg-transparent hover:text-white sm:w-auto"
            >
              View Collections
              <ArrowRight size={14} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-screen-xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-2xl font-bold text-[#111111] sm:text-3xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-center text-[14px] text-[#6B625A]">Quick answers to common questions.</p>

          <div className="mt-8 divide-y divide-[#DDD8CF] rounded-lg border border-[#DDD8CF] bg-white">
            {[
              { q: 'How long does delivery take?', a: 'Standard delivery takes 4–7 business days across India. Orders above ₹5,000 get free shipping.' },
              { q: 'Are products verified?', a: 'Yes. Every piece is checked for brand authenticity, condition, and quality before listing on STORY.' },
              { q: 'Can I return or exchange?', a: 'Returns and exchanges are accepted within 7 days of delivery for unused items with original tags and packaging.' },
              { q: 'How do I choose my size?', a: 'Each product page shows available sizes. Use the Size Guide link or contact us on WhatsApp for fit advice.' }
            ].map((faq) => (
              <details key={faq.q} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-[#111111]">
                  {faq.q}
                  <span className="shrink-0 text-lg text-[#6B625A] transition group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-4 text-[14px] leading-relaxed text-[#6B625A]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
