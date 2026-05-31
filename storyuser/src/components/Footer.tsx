import React from 'react';
import { ActiveScreen } from '../types';

interface FooterProps {
  setActiveScreen: (screen: ActiveScreen) => void;
}

const FOOTER_COLUMNS = [
  {
    title: 'Information',
    links: ['Outfit', 'Shoes', 'Bag', 'Jewelry']
  },
  {
    title: 'Shopping',
    links: ['Wishlist', 'Cart', 'Checkout']
  },
  {
    title: 'Connect Us',
    links: ['Blog', 'Career', 'FAQ']
  }
];

const BOTTOM_LINKS = ['Instagram', 'Pinterest', 'Contact', 'Share', 'Returns', 'Email'];

export const Footer: React.FC<FooterProps> = ({ setActiveScreen }) => {
  const handleFooterLink = (label: string) => {
    if (['Contact', 'Email', 'Blog', 'Career', 'FAQ'].includes(label)) {
      setActiveScreen('contact');
      return;
    }

    if (['Wishlist', 'Checkout', 'Returns'].includes(label)) {
      setActiveScreen('settings');
      return;
    }

    setActiveScreen('shop');
  };

  return (
    <footer className="border-t border-[#deded9] bg-white text-[#111111]" id="global-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 border-b border-[#deded9] pb-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase text-[#6f6f6f]">STORY INDIA EST 2026</p>
            <h2 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-none sm:text-7xl lg:text-8xl">
              Beyond Boundaries
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="min-w-0">
                <h3 className="font-mono text-[10px] font-semibold uppercase text-[#111111]">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <button
                        type="button"
                        onClick={() => handleFooterLink(link)}
                        className="font-mono text-[10px] uppercase text-[#6f6f6f] transition hover:text-[#111111]"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {BOTTOM_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleFooterLink(link)}
                className="font-mono text-[10px] uppercase text-[#6f6f6f] transition hover:text-[#111111]"
              >
                {link}
              </button>
            ))}
          </div>
          <p className="font-mono text-[9px] uppercase text-[#8a8a85]">
            STORY INDIA 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
