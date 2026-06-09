import React from 'react';
import { Instagram, Mail, MessageCircle, type LucideIcon } from 'lucide-react';
import { ActiveScreen } from '../types';
import { PolicyKey } from './PolicyView';

interface FooterProps {
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenPolicy: (policyKey: PolicyKey) => void;
}

type FooterLink = {
  label: string;
  screen?: ActiveScreen;
  sectionId?: string;
  policyKey?: PolicyKey;
  icon?: LucideIcon;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', screen: 'shop', sectionId: 'our-products-section' },
      { label: 'Uppers', screen: 'shop', sectionId: 'our-products-section' },
      { label: 'Lowers', screen: 'shop', sectionId: 'our-products-section' },
      { label: 'Dresses', screen: 'shop', sectionId: 'our-products-section' },
      { label: 'Co-ords', screen: 'shop', sectionId: 'our-products-section' },
      { label: 'Footwear', screen: 'shop', sectionId: 'our-products-section' },
      { label: 'Accessories', screen: 'shop', sectionId: 'our-products-section' },
      { label: 'Inners', screen: 'shop', sectionId: 'our-products-section' }
    ]
  },
  {
    title: 'Story',
    links: [
      { label: 'Our Story', screen: 'about' },
      { label: 'Curated Drops', screen: 'discover' },
      { label: 'Style Edit', screen: 'discover' },
      { label: 'Lookbook', screen: 'discover' },
      { label: 'Customer Reviews', screen: 'shop' },
      { label: 'Blog', screen: 'contact' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', screen: 'contact' },
      { label: 'Shipping & Delivery', screen: 'contact' },
      { label: 'Returns & Exchange', policyKey: 'returns' },
      { label: 'Size Guide', screen: 'contact' },
      { label: 'FAQ', screen: 'contact' },
      { label: 'Track Order', screen: 'settings' }
    ]
  }
];

const CONNECT_LINKS: FooterLink[] = [
  { label: 'Instagram', icon: Instagram },
  { label: 'WhatsApp', screen: 'contact', icon: MessageCircle },
  { label: 'Email', screen: 'contact', icon: Mail }
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', policyKey: 'privacy' },
  { label: 'Terms & Conditions', policyKey: 'terms' },
  { label: 'Return & Refund Policy', policyKey: 'returns' }
];

const policyHref = (policyKey: PolicyKey) => {
  if (policyKey === 'terms') return '/terms-conditions';
  if (policyKey === 'returns') return '/return-refund-policy';
  return '/privacy-policy';
};

export const Footer: React.FC<FooterProps> = ({ setActiveScreen, onOpenPolicy }) => {
  const handleFooterLink = (link: FooterLink) => {
    if (link.policyKey) {
      onOpenPolicy(link.policyKey);
      return;
    }

    if (link.screen) {
      setActiveScreen(link.screen);
    }

    if (link.sectionId) {
      window.setTimeout(() => {
        document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  };

  const renderLink = (link: FooterLink) => {
    const linkClassName = "inline-block text-left text-[#696965] transition duration-200 hover:translate-x-1 hover:text-[#111111] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] focus-visible:ring-offset-4";

    if (link.policyKey) {
      return (
        <a
          href={policyHref(link.policyKey)}
          onClick={(event) => {
            event.preventDefault();
            handleFooterLink(link);
          }}
          className={linkClassName}
        >
          {link.label}
        </a>
      );
    }

    if (!link.screen && !link.sectionId) {
      return (
        <a
          href="#"
          className={linkClassName}
        >
          {link.label}
        </a>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleFooterLink(link)}
        className={linkClassName}
      >
        {link.label}
      </button>
    );
  };

  const renderColumn = (column: FooterColumn) => (
    <nav key={column.title} aria-label={`${column.title} footer links`}>
      <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#111111]">
        {column.title}
      </h3>
      <ul className="mt-5 space-y-3 font-mono text-[0.68rem] uppercase tracking-[0.08em]">
        {column.links.map((link) => (
          <li key={link.label}>{renderLink(link)}</li>
        ))}
      </ul>
    </nav>
  );

  const renderConnectIcon = (link: FooterLink) => {
    const Icon = link.icon;
    if (!Icon) return null;

    const iconClassName = "inline-flex h-10 w-10 items-center justify-center border border-[#111111]/20 bg-white text-[#111111] transition duration-200 hover:-translate-y-0.5 hover:border-[#111111] hover:bg-[#111111] hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] focus-visible:ring-offset-4";
    const iconContent = (
      <>
        <Icon size={18} strokeWidth={1.7} />
        <span className="sr-only">{link.label}</span>
      </>
    );

    if (!link.screen && !link.sectionId) {
      return (
        <a key={link.label} href="#" className={iconClassName} aria-label={link.label} title={link.label}>
          {iconContent}
        </a>
      );
    }

    return (
      <button
        key={link.label}
        type="button"
        onClick={() => handleFooterLink(link)}
        className={iconClassName}
        aria-label={link.label}
        title={link.label}
      >
        {iconContent}
      </button>
    );
  };

  return (
    <footer className="border-t border-black/10 bg-[#f6f6f3] text-[#111111]" id="global-footer">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 border-b border-black/10 pb-10 lg:grid-cols-[1.1fr_1.9fr] lg:gap-14 lg:pb-14">
          <div className="max-w-md">
            <button
              type="button"
              onClick={() => setActiveScreen('shop')}
              className="font-display text-4xl font-black uppercase leading-none tracking-[0.08em] text-[#050505] transition hover:opacity-70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] focus-visible:ring-offset-4 sm:text-5xl"
              aria-label="STORY home"
            >
              STORY
            </button>
            <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#696965]">
              STORY INDIA EST. 2026
            </p>
            <p className="mt-6 text-sm leading-6 text-[#4f4f4b]">
              Verified branded fashion, curated in India for everyday premium style.
            </p>
            <div className="mt-8 flex items-start">
              <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                <svg className="absolute inset-0 h-full w-full animate-[spin_20s_linear_infinite]" viewBox="0 0 200 200">
                  <defs>
                    <path id="footerCirclePath" d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0" fill="none" />
                  </defs>
                  <text className="fill-[#4f4f4b]" style={{ fontSize: '11.2px', fontFamily: 'monospace', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    <textPath href="#footerCirclePath" startOffset="0%">
                      Verified authentic • 100% original • Best price &amp; quality •&nbsp;
                    </textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#111111]/20 sm:h-14 sm:w-14">
                    <span className="font-display text-[0.55rem] font-black uppercase tracking-[0.06em] text-[#111111] sm:text-[0.6rem]">STORY</span>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-4 gap-8 lg:grid">
            {FOOTER_COLUMNS.map(renderColumn)}

            <nav aria-label="Connect footer links">
              <h3 className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#111111]">
                Connect
              </h3>
              <p className="mt-5 max-w-[220px] text-sm leading-6 text-[#4f4f4b]">
                Need help finding your fit? Our team can help with size, styling, delivery, and product questions.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {CONNECT_LINKS.map(renderConnectIcon)}
              </div>
              <p className="mt-5 font-mono text-[0.58rem] uppercase leading-5 tracking-[0.12em] text-[#8a8a84]">
                WhatsApp: +91 98765 43210
                <br />
                Email: care@story.in
              </p>
            </nav>
          </div>

          <div className="space-y-3 lg:hidden">
            {FOOTER_COLUMNS.map((column) => (
              <details key={column.title} className="group border-t border-black/10 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#111111]">
                  {column.title}
                  <span className="text-base leading-none transition group-open:rotate-45">+</span>
                </summary>
                <ul className="mt-5 space-y-3 font-mono text-[0.68rem] uppercase tracking-[0.08em]">
                  {column.links.map((link) => (
                    <li key={link.label}>{renderLink(link)}</li>
                  ))}
                </ul>
              </details>
            ))}

            <details className="group border-t border-black/10 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#111111]">
                Connect
                <span className="text-base leading-none transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-5 text-sm leading-6 text-[#4f4f4b]">
                Need help finding your fit? Our team can help with size, styling, delivery, and product questions.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {CONNECT_LINKS.map(renderConnectIcon)}
              </div>
            </details>
          </div>
        </div>

        <div className="grid gap-5 pt-7 font-mono text-[0.62rem] uppercase leading-5 tracking-[0.14em] text-[#696965] lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <p>&copy; STORY India 2026. All rights reserved.</p>
          <p className="lg:text-center">Verified authentic pieces &bull; Curated in India</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end" aria-label="Legal footer links">
            {LEGAL_LINKS.map((link) => (
              <React.Fragment key={link.label}>{renderLink(link)}</React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
