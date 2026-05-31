import React from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { ActiveScreen } from '../types';

interface NavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  cartCount: number;
  onCartToggle: () => void;
}

const NAV_ITEMS: Array<{ label: string; screen: ActiveScreen; sectionId?: string }> = [
  { label: 'ABOUT', screen: 'about' },
  { label: 'COLLECTIONS', screen: 'discover' },
  { label: 'SHOP', screen: 'shop', sectionId: 'our-products-section' },
  { label: 'LOOKBOOK', screen: 'discover' },
  { label: 'CONTACT', screen: 'contact' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  cartCount,
  onCartToggle
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigate = (screen: ActiveScreen, sectionId?: string) => {
    setActiveScreen(screen);
    setMobileMenuOpen(false);

    if (sectionId) {
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e2e2de] bg-[#fafafa]/95 backdrop-blur-md" id="global-navbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between lg:h-24">
          <div className="hidden flex-1 items-center gap-8 lg:flex">
            {NAV_ITEMS.slice(0, 3).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.screen, item.sectionId)}
                className={`font-mono text-[10px] font-medium uppercase transition hover:text-[#111111] ${
                  activeScreen === item.screen ? 'text-[#111111]' : 'text-[#6f6f6f]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('shop')}
            className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center transition hover:opacity-75"
            id="nav-logo-btn"
          >
            <span className="font-display text-2xl font-black uppercase leading-none text-[#111111] sm:text-3xl">
              STORY
            </span>
            <span className="mt-1 font-mono text-[8px] uppercase text-[#6f6f6f]">
              EST 2026
            </span>
          </button>

          <div className="hidden flex-1 items-center justify-end gap-8 lg:flex">
            {NAV_ITEMS.slice(3).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.screen, item.sectionId)}
                className={`font-mono text-[10px] font-medium uppercase transition hover:text-[#111111] ${
                  activeScreen === item.screen ? 'text-[#111111]' : 'text-[#6f6f6f]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="flex items-center gap-3 border-l border-[#deded9] pl-6">
              <button
                type="button"
                onClick={() => navigate('discover')}
                className="p-1 text-[#6f6f6f] transition hover:text-[#111111]"
                aria-label="Search products"
                id="nav-search-btn"
              >
                <Search size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => navigate('settings')}
                className="p-1 text-[#6f6f6f] transition hover:text-[#111111]"
                aria-label="Account"
                id="nav-user-btn"
              >
                <User size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={onCartToggle}
                className="relative p-1 text-[#111111] transition hover:opacity-70"
                aria-label="Shopping bag"
                id="nav-cart-btn"
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] font-mono text-[9px] text-white" id="cart-counter">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={onCartToggle}
              className="relative p-1 text-[#111111]"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] font-mono text-[8px] text-white">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-1 text-[#111111]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              id="nav-mobile-hamburger"
            >
              {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#e2e2de] bg-[#fafafa] lg:hidden" id="mobile-menu-drawer">
          <div className="space-y-1 px-6 py-5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.screen, item.sectionId)}
                className="block w-full py-3 text-left font-mono text-[11px] uppercase text-[#111111]"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate('settings')}
              className="block w-full py-3 text-left font-mono text-[11px] uppercase text-[#6f6f6f]"
            >
              Account
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
