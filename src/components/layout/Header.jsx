/**
 * components/layout/Header.jsx
 * Main storefront header with nav, cart, search, wishlist
 */
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../ui/SearchModal';

const PRIMARY_NAV = [
  { label: 'Mosaic Collection', href: '/collections/mosaic' },
  { label: 'Pottery Pots', href: '/collections/pottery-pots' },
  { label: 'Round', href: '/collections/round' },
  { label: 'Rectangular', href: '/collections/rectangular' },
  { label: 'Square', href: '/collections/square' },
  { label: 'Balcony', href: '/collections/balcony' },
];

const MORE_CATEGORIES = [
  { label: 'Hanging Pots', href: '/collections/hanging', desc: 'Elevated hanging planters' },
  { label: 'Pot Kits & Sets', href: '/collections/kits', desc: 'Coordinated sets with saucers' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const { items, toggleCart } = useCartStore();
  const { items: wishItems } = useWishlistStore();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#29382e] text-white/90 text-center text-[10px] sm:text-xs tracking-[0.12em] py-2.5 px-4 uppercase">
        Complimentary UAE delivery on orders over <strong className="text-white">AED 200</strong>
      </div>

      <header className="sticky top-0 z-50 bg-[#fcfbf8]/95 backdrop-blur-md border-b border-[#e8e4db]">
        <div className="container">
          <div className="relative grid grid-cols-3 items-center h-[76px] md:h-[82px]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="p-2 -ml-2 rounded-full hover:bg-[#f1eee7] md:hidden transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="p-2 rounded-full hover:bg-[#f1eee7] transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>
              <a
                href="https://wa.me/971565096880"
                className="hidden lg:inline text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:text-brand-dark ml-3"
              >
                Need help?
              </a>
            </div>

            <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 shrink-0 group">
              <img
                src="/logo.png"
                alt="Kahf Greens"
                className="h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-103"
              />
              <div className="hidden sm:block text-center">
                <span className="font-serif font-semibold text-[#29382e] text-[17px] leading-none block tracking-wide">Kahf Greens</span>
                <span className="text-[9px] text-brand-sage font-medium tracking-[0.18em] uppercase mt-1 block">Planters · UAE</span>
              </div>
            </Link>

            <div className="flex items-center justify-end gap-1">
              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-brand-light-bg transition-colors" title="Wishlist">
                <Heart className="w-5 h-5 text-foreground" />
                {wishItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-brand-dark text-white text-[10px] rounded-full flex items-center justify-center">
                    {wishItems.length}
                  </span>
                )}
              </Link>

              <button onClick={toggleCart} className="relative p-2 rounded-lg hover:bg-brand-light-bg transition-colors" title="Cart">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-brand-dark text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-6 border-t border-[#e8e4db] h-[44px]">
            <NavLink
              to="/"
              end
              className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.13em] uppercase transition-colors shrink-0', isActive ? 'text-brand-dark font-semibold' : 'text-muted-foreground hover:text-brand-dark')}
            >
              Home
            </NavLink>

            {PRIMARY_NAV.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.13em] uppercase transition-colors shrink-0', isActive ? 'text-brand-dark font-semibold' : 'text-muted-foreground hover:text-brand-dark')}
              >
                {item.label}
              </NavLink>
            ))}

            {/* More Categories Dropdown */}
            <div
              className="relative shrink-0 flex items-center"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                type="button"
                className="text-[10px] font-medium tracking-[0.13em] uppercase text-muted-foreground hover:text-brand-dark flex items-center gap-1 cursor-pointer py-2"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              >
                More <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 pt-1 z-50 animate-fade-in">
                  <div className="bg-white border border-[#e8e4db] rounded-xl shadow-xl py-2 min-w-[200px]">
                    {MORE_CATEGORIES.map(sub => (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-brand-light-bg transition-colors"
                      >
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{sub.label}</p>
                        <p className="text-[10px] text-muted-foreground">{sub.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/products"
              className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.13em] uppercase transition-colors shrink-0', isActive ? 'text-brand-dark font-semibold' : 'text-muted-foreground hover:text-brand-dark')}
            >
              All Products
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.13em] uppercase transition-colors shrink-0', isActive ? 'text-brand-dark font-semibold' : 'text-muted-foreground hover:text-brand-dark')}
            >
              Journal
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.13em] uppercase transition-colors shrink-0', isActive ? 'text-brand-dark font-semibold' : 'text-muted-foreground hover:text-brand-dark')}
            >
              Contact
            </NavLink>
          </nav>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-[#e8e4db] py-3 animate-fade-in space-y-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Home
              </Link>
              
              <div className="pt-2 pb-1 px-3 text-[9px] font-bold tracking-[0.2em] uppercase text-brand-sage">
                Collections
              </div>
              <Link to="/collections/mosaic" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Mosaic Collection
              </Link>
              <Link to="/collections/pottery-pots" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Pottery Pots
              </Link>

              <div className="pt-3 pb-1 px-3 text-[9px] font-bold tracking-[0.2em] uppercase text-brand-sage">
                Shop By Shape & Category
              </div>
              <Link to="/collections/round" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Round Pots
              </Link>
              <Link to="/collections/rectangular" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Rectangular Pots
              </Link>
              <Link to="/collections/square" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Square Pots
              </Link>
              <Link to="/collections/balcony" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Balcony & Windowbox Pots
              </Link>
              <Link to="/collections/hanging" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Hanging Pots
              </Link>
              <Link to="/collections/kits" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Pot Kits & Sets
              </Link>

              <div className="pt-3 pb-1 px-3 text-[9px] font-bold tracking-[0.2em] uppercase text-brand-sage">
                Information
              </div>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                All Products
              </Link>
              <Link to="/blogs" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Journal & News
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                Contact
              </Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                About Kahf Greens
              </Link>

              <a href="https://wa.me/971565096880" className="flex items-center gap-2 px-3 py-3 text-[11px] font-medium tracking-[0.12em] uppercase text-green-800 hover:bg-green-50 mt-2">
                <Phone className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
          )}
        </div>
      </header>

      <CartDrawer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
