/**
 * components/layout/Header.jsx
 * Main storefront header with nav, cart, search, wishlist
 */
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../ui/SearchModal';

const CATEGORIES = [
  { label: 'Idel Collection', href: '/collections/idel' },
  { label: 'Pottery Pots', href: '/collections/pottery-pots' },
  { label: 'Desch Pots', href: '/collections/desch-pots' },
  { label: 'All Products', href: '/products' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen]= useState(false);
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

          <nav className="hidden md:flex items-center justify-center gap-9 border-t border-[#e8e4db] h-[43px]">
            <NavLink to="/" end className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.15em] uppercase transition-colors', isActive ? 'text-brand-dark' : 'text-muted-foreground hover:text-brand-dark')}>
              Home
            </NavLink>
            {CATEGORIES.map(category => (
              <NavLink key={category.href} to={category.href} className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.15em] uppercase transition-colors', isActive ? 'text-brand-dark' : 'text-muted-foreground hover:text-brand-dark')}>
                {category.label}
              </NavLink>
            ))}
            <NavLink to="/about" className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.15em] uppercase transition-colors', isActive ? 'text-brand-dark' : 'text-muted-foreground hover:text-brand-dark')}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.15em] uppercase transition-colors', isActive ? 'text-brand-dark' : 'text-muted-foreground hover:text-brand-dark')}>
              Contact
            </NavLink>
            <NavLink to="/blogs" className={({ isActive }) => cn('text-[10px] font-medium tracking-[0.15em] uppercase transition-colors', isActive ? 'text-brand-dark' : 'text-muted-foreground hover:text-brand-dark')}>
              Journal
            </NavLink>
          </nav>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-[#e8e4db] py-3 animate-fade-in">
              {[{ to: '/', label: 'Home' }, ...CATEGORIES.map(c => ({ to: c.href, label: c.label })), { to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' }, { to: '/blogs', label: 'Journal & News' }].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-[11px] font-medium tracking-[0.12em] uppercase text-foreground hover:bg-[#f1eee7]">
                {item.label}
                </Link>
              ))}
              <a href="https://wa.me/971565096880" className="flex items-center gap-2 px-3 py-3 text-[11px] font-medium tracking-[0.12em] uppercase text-green-800 hover:bg-green-50 mt-1">
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
