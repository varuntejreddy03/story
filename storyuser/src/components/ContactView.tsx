import React from 'react';
import { ArrowRight, CalendarCheck, Mail, MessageCircle, Phone, Ruler, Send, Truck } from 'lucide-react';
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
    icon: Mail,
    label: 'Email',
    value: 'care@story.in',
    note: 'Client care and order support'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    note: 'Monday to Saturday, 10 AM to 7 PM IST'
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+91 98765 43210',
    note: 'Styling appointments and delivery updates'
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
    topic: 'STYLING APPOINTMENT',
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
        topic: 'STYLING APPOINTMENT',
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
      className="bg-[#f5f4f0] pb-16 text-[#111111]"
      id="contact-view-container"
    >
      <section className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-12">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f6f6f]">Contact STORY India</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] text-[#050505] sm:text-6xl lg:text-7xl">
              Begin The Conversation
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#4c4c4c] sm:text-base">
              For styling appointments, order assistance, returns, press requests, or private collection previews, reach the STORY India client care desk.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {CONTACT_METHODS.map(({ icon: Icon, label, value, note }) => (
                <div key={label} className="rounded-lg border border-[#deded9] bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#deded9] bg-[#fafafa]">
                      <Icon size={17} strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-[#111111]">{value}</p>
                      <p className="mt-2 text-xs leading-5 text-[#5a5a55]">{note}</p>
                    </div>
                  </div>
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
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6f6f6f]">Topic</span>
                <select
                  value={formState.topic}
                  onChange={(event) => setFormState((state) => ({ ...state, topic: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-[#d7d5ce] bg-[#fafafa] px-3 text-xs font-semibold text-[#111111] focus:border-[#111111] focus:bg-white"
                >
                  <option>STYLING APPOINTMENT</option>
                  <option>ORDER SUPPORT</option>
                  <option>RETURNS</option>
                  <option>PRESS</option>
                  <option>COLLABORATION</option>
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
              {submitting ? 'Sending...' : 'Send Request'}
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
    </motion.div>
  );
};
