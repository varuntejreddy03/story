import React from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { ActiveScreen } from '../types';
import StoryLogo from './StoryLogo';

interface NavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  cartCount: number;
  onCartToggle: () => void;
}

const NAV_ITEMS: Array<{ label: string; screen: ActiveScreen; sectionId?: string }> = [
  { label: 'Shop', screen: 'shop' },
  { label: 'Categories', screen: 'shop', sectionId: 'our-products-section' },
  { label: 'Collections', screen: 'discover' },
  { label: 'Our Story', screen: 'about' },
  { label: 'Contact', screen: 'contact' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  cartCount,
  onCartToggle
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isNavItemActive = (item: { screen: ActiveScreen; sectionId?: string }) => item.screen === activeScreen && !item.sectionId;

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
    <nav className="sticky top-0 z-50 w-full overflow-x-clip border-b border-white/10 bg-[#070707]/95 text-white shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl" id="global-navbar">
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 min-[900px]:px-8 xl:px-12 2xl:px-14">
        <div className="relative flex h-[68px] items-center justify-between min-[900px]:grid min-[900px]:h-[76px] min-[900px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[900px]:gap-6 xl:gap-7 2xl:gap-10">
          <div className="hidden min-w-0 items-center gap-4 min-[900px]:flex xl:gap-5 2xl:gap-8">
            {NAV_ITEMS.slice(0, 3).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.screen, item.sectionId)}
                className={`whitespace-nowrap border-b py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] transition duration-300 xl:text-[10px] xl:tracking-[0.18em] 2xl:tracking-[0.22em] ${
                  isNavItemActive(item)
                    ? 'border-white text-white'
                    : 'border-transparent text-white/58 hover:border-white/35 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('shop')}
            className="absolute left-1/2 top-1/2 flex shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center transition duration-300 hover:opacity-80 min-[900px]:static min-[900px]:translate-x-0 min-[900px]:translate-y-0"
            id="nav-logo-btn"
            aria-label="STORY home"
          >
            <StoryLogo />
          </button>

          <div className="hidden min-w-0 items-center justify-end gap-4 min-[900px]:flex xl:gap-5 2xl:gap-8">
            {NAV_ITEMS.slice(3).map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.screen, item.sectionId)}
                className={`whitespace-nowrap border-b py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] transition duration-300 xl:text-[10px] xl:tracking-[0.18em] 2xl:tracking-[0.22em] ${
                  isNavItemActive(item)
                    ? 'border-white text-white'
                    : 'border-transparent text-white/58 hover:border-white/35 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="flex shrink-0 items-center gap-3 border-l border-white/15 pl-4 min-[1180px]:gap-5 min-[1180px]:pl-6 2xl:gap-6 2xl:pl-8">
              <button
                type="button"
                onClick={() => navigate('discover')}
                className={`inline-flex h-9 w-9 items-center justify-center text-white/58 transition duration-300 hover:text-white min-[1180px]:w-auto min-[1180px]:gap-2 min-[1180px]:px-0 ${
                  activeScreen === 'discover' ? 'text-white' : ''
                }`}
                aria-label="Search products"
                title="Search products"
                id="nav-search-btn"
              >
                <Search size={16} strokeWidth={1.5} />
                <span className="hidden whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.18em] min-[1180px]:inline 2xl:tracking-[0.22em]">Search</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('settings')}
                className={`inline-flex h-9 w-9 items-center justify-center text-white/58 transition duration-300 hover:text-white min-[1180px]:w-auto min-[1180px]:gap-2 min-[1180px]:px-0 ${
                  activeScreen === 'settings' ? 'text-white' : ''
                }`}
                aria-label="Account"
                title="Account"
                id="nav-user-btn"
              >
                <User size={16} strokeWidth={1.5} />
                <span className="hidden whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.18em] min-[1180px]:inline 2xl:tracking-[0.22em]">Account</span>
              </button>
              <button
                type="button"
                onClick={onCartToggle}
                className="relative inline-flex h-9 w-9 items-center justify-center text-white transition duration-300 hover:text-white/78 min-[1180px]:w-auto min-[1180px]:gap-2 min-[1180px]:px-0"
                aria-label="Shopping bag"
                title="Shopping bag"
                id="nav-cart-btn"
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                <span className="hidden whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.18em] min-[1180px]:inline 2xl:tracking-[0.22em]">Bag</span>
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-white font-mono text-[9px] text-[#111111] min-[1180px]:-right-3 min-[1180px]:-top-1.5" id="cart-counter">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 min-[900px]:hidden">
            <button
              type="button"
              onClick={onCartToggle}
              className="relative p-1 text-white"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white font-mono text-[8px] text-[#111111]">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-1 text-white"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              id="nav-mobile-hamburger"
            >
              {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#050505] min-[900px]:hidden" id="mobile-menu-drawer">
          <div className="space-y-1 px-6 py-5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.screen, item.sectionId)}
                className="block w-full border-b border-white/10 py-4 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-white"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate('discover')}
              className="block w-full border-b border-white/10 py-4 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-white/75"
            >
              Search products
            </button>
            <button
              type="button"
              onClick={() => navigate('settings')}
              className="block w-full py-4 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-white/75"
            >
              Account
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
