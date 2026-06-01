import React from 'react';
import { ActiveScreen } from '../types';

interface FooterProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

type FooterLink = {
  label: string;
  screen?: ActiveScreen;
  sectionId?: string;
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
      { label: 'Returns & Exchange', screen: 'settings' },
      { label: 'Size Guide', screen: 'contact' },
      { label: 'FAQ', screen: 'contact' },
      { label: 'Track Order', screen: 'settings' }
    ]
  }
];

const CONNECT_LINKS: FooterLink[] = [
  { label: 'Instagram' },
  { label: 'WhatsApp', screen: 'contact' },
  { label: 'Email', screen: 'contact' }
];

// TODO: Connect Privacy Policy and Terms & Conditions when legal routes are added.
const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy' },
  { label: 'Terms & Conditions' }
];

export const Footer: React.FC<FooterProps> = ({ setActiveScreen }) => {
  const handleFooterLink = (link: FooterLink) => {
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
    if (!link.screen && !link.sectionId) {
      return (
        <a
          href="#"
          className="inline-block text-[#696965] transition duration-200 hover:translate-x-1 hover:text-[#111111] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] focus-visible:ring-offset-4"
        >
          {link.label}
        </a>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleFooterLink(link)}
        className="inline-block text-left text-[#696965] transition duration-200 hover:translate-x-1 hover:text-[#111111] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] focus-visible:ring-offset-4"
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
            <p className="mt-6 max-w-sm font-mono text-[0.62rem] uppercase leading-5 tracking-[0.16em] text-[#696965]">
              Verified authentic pieces &bull; 100% original &bull; Best price & quality
            </p>
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
              <ul className="mt-5 space-y-3 font-mono text-[0.68rem] uppercase tracking-[0.08em]">
                {CONNECT_LINKS.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-[0.58rem] uppercase leading-5 tracking-[0.12em] text-[#8a8a84]">
                WhatsApp: Add client number here
                <br />
                Email: Add support email here
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
              <ul className="mt-5 space-y-3 font-mono text-[0.68rem] uppercase tracking-[0.08em]">
                {CONNECT_LINKS.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
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
