import React from 'react';
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
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

const STUDIOS = [
  ['Mumbai Atelier', '12 Kala Ghoda Lane, Mumbai, Maharashtra 400001'],
  ['Delhi Fitting Room', 'Lodhi Colony, New Delhi 110003'],
  ['Bengaluru Styling Desk', 'Indiranagar, Bengaluru, Karnataka 560038']
];

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
      className="bg-[#fafafa] pb-20 text-[#111111]"
      id="contact-view-container"
    >
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-14 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">Contact STORY India</p>
            <h1 className="font-display text-6xl font-black uppercase leading-none text-[#050505] sm:text-7xl lg:text-8xl">
              Begin The Conversation
            </h1>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#4c4c4c]">
            For styling appointments, order assistance, press requests, or private collection previews, reach the STORY India client care desk.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {CONTACT_METHODS.map(({ icon: Icon, label, value, note }) => (
              <div key={label} className="border border-[#deded9] bg-white p-5">
                <div className="flex items-start gap-4">
                  <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[9px] uppercase text-[#6f6f6f]">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-[#111111]">{value}</p>
                    <p className="mt-2 text-xs leading-5 text-[#5a5a55]">{note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border border-[#111111] bg-white p-6 sm:p-8 lg:p-10" id="contact-request-form">
          <div className="mb-8 flex items-center justify-between border-b border-[#deded9] pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">Client request</p>
              <h2 className="mt-1 font-display text-2xl font-black uppercase text-[#111111]">Write To Us</h2>
            </div>
            <Send size={21} strokeWidth={1.5} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {submitted && (
              <div className="border border-[#111111] bg-[#fafafa] p-4 font-mono text-[10px] uppercase leading-relaxed text-[#111111] sm:col-span-2">
                Your STORY India request has been received. Client care will respond shortly.
              </div>
            )}

            {submitError && (
              <div className="border border-[#111111] bg-white p-4 font-mono text-[10px] uppercase leading-relaxed text-[#111111] sm:col-span-2">
                {submitError}
              </div>
            )}

            <label className="block">
              <span className="font-mono text-[9px] uppercase text-[#6f6f6f]">Name</span>
              <input
                value={formState.name}
                onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))}
                className="mt-2 w-full border-b border-[#111111] bg-transparent py-3 text-sm text-[#111111] placeholder:text-[#9a9a95]"
                placeholder="Your name"
                required
              />
            </label>

            <label className="block">
              <span className="font-mono text-[9px] uppercase text-[#6f6f6f]">Email</span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
                className="mt-2 w-full border-b border-[#111111] bg-transparent py-3 text-sm text-[#111111] placeholder:text-[#9a9a95]"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="font-mono text-[9px] uppercase text-[#6f6f6f]">Phone</span>
              <input
                value={formState.phone}
                onChange={(event) => setFormState((state) => ({ ...state, phone: event.target.value }))}
                className="mt-2 w-full border-b border-[#111111] bg-transparent py-3 text-sm text-[#111111] placeholder:text-[#9a9a95]"
                placeholder="+91"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[9px] uppercase text-[#6f6f6f]">Topic</span>
              <select
                value={formState.topic}
                onChange={(event) => setFormState((state) => ({ ...state, topic: event.target.value }))}
                className="mt-2 w-full border-b border-[#111111] bg-transparent py-3 text-sm text-[#111111]"
              >
                <option>STYLING APPOINTMENT</option>
                <option>ORDER SUPPORT</option>
                <option>RETURNS</option>
                <option>PRESS</option>
                <option>COLLABORATION</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="font-mono text-[9px] uppercase text-[#6f6f6f]">Message</span>
              <textarea
                value={formState.message}
                onChange={(event) => setFormState((state) => ({ ...state, message: event.target.value }))}
                className="mt-2 min-h-36 w-full resize-none border border-[#deded9] bg-[#fafafa] p-4 text-sm leading-6 text-[#111111] placeholder:text-[#9a9a95]"
                placeholder="Tell us what you need."
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-[#111111] px-6 py-4 font-mono text-[10px] font-semibold uppercase text-white transition hover:bg-black sm:w-auto"
          >
            {submitting ? 'Sending...' : 'Send Request'}
            <ArrowRight size={14} strokeWidth={1.6} />
          </button>
        </form>
      </section>

      <section className="border-y border-[#deded9] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="border-b border-[#deded9] pb-10 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-12">
            <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">Studio visits</p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none sm:text-6xl">
              India Client Studios
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#4c4c4c]">
              Private fittings and styling consultations are available by appointment in Mumbai, Delhi, and Bengaluru.
            </p>
          </div>

          <div className="space-y-5 pt-10 lg:pt-0 lg:pl-12">
            {STUDIOS.map(([name, address]) => (
              <div key={name} className="flex gap-4 border-b border-[#eeeeea] pb-5 last:border-b-0">
                <MapPin size={17} strokeWidth={1.5} className="mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold uppercase text-[#111111]">{name}</p>
                  <p className="mt-2 text-xs leading-5 text-[#5a5a55]">{address}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-4 pt-2">
              <Clock size={17} strokeWidth={1.5} className="mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold uppercase text-[#111111]">Hours</p>
                <p className="mt-2 text-xs leading-5 text-[#5a5a55]">Monday to Saturday, 10:00 AM to 7:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 overflow-hidden bg-[#111111] text-white lg:grid-cols-[1fr_0.75fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="font-mono text-[10px] uppercase text-[#9f9f9a]">Private preview</p>
            <h2 className="max-w-3xl font-display text-5xl font-black uppercase leading-none sm:text-6xl">
              Book A Collection Appointment
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#d7d7d2]">
              Work with a STORY stylist to build monochrome looks around occasion, climate, and wardrobe gaps.
            </p>
          </div>
          <div className="flex items-end border-t border-white/20 p-8 sm:p-12 lg:border-l lg:border-t-0">
            <button
              type="button"
              onClick={() => setActiveScreen('discover')}
              className="inline-flex items-center gap-2 border border-white px-6 py-4 font-mono text-[10px] font-semibold uppercase text-white transition hover:bg-white hover:text-[#111111]"
            >
              View Collections
              <ArrowRight size={14} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
