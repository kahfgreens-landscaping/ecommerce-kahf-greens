/**
 * components/layout/Header.jsx
 * Main storefront header with nav, cart, search, wishlist
 */
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown, Phone } from 'lucide-react';
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
      <div className="bg-brand-dark text-white text-center text-xs py-2 px-4">
        🌿 Free delivery across UAE on orders over <strong>AED 200</strong> &nbsp;|&nbsp;
        WhatsApp: <a href="https://wa.me/971565096880" className="underline hover:text-brand-gold">+971 56 509 6880</a>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-brand-dark rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">KG</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-brand-dark text-lg leading-none block">Kahf Greens</span>
                <span className="text-xs text-brand-sage">Premium Plant Pots · UAE</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={({ isActive }) => cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors', isActive ? 'text-brand-dark bg-brand-light-bg' : 'text-muted-foreground hover:text-brand-dark hover:bg-brand-light-bg')}>
                Home
              </NavLink>

              {/* Shop dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-brand-dark hover:bg-brand-light-bg transition-colors">
                  Shop <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {CATEGORIES.map(c => (
                    <Link key={c.href} to={c.href} className="block px-4 py-2 text-sm text-foreground hover:bg-brand-light-bg hover:text-brand-dark">
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              <NavLink to="/about" className={({ isActive }) => cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors', isActive ? 'text-brand-dark bg-brand-light-bg' : 'text-muted-foreground hover:text-brand-dark hover:bg-brand-light-bg')}>
                About
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors', isActive ? 'text-brand-dark bg-brand-light-bg' : 'text-muted-foreground hover:text-brand-dark hover:bg-brand-light-bg')}>
                Contact
              </NavLink>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-brand-light-bg transition-colors" title="Search">
                <Search className="w-5 h-5 text-foreground" />
              </button>

              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-brand-light-bg transition-colors" title="Wishlist">
                <Heart className="w-5 h-5 text-foreground" />
                {wishItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishItems.length}
                  </span>
                )}
              </Link>

              <button onClick={toggleCart} className="relative p-2 rounded-lg hover:bg-brand-light-bg transition-colors" title="Cart">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-dark text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-brand-light-bg md:hidden transition-colors">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border py-3 animate-fade-in">
              {[{ to: '/', label: 'Home' }, { to: '/products', label: 'All Products' }, ...CATEGORIES.slice(0, 4).map(c => ({ to: c.href, label: c.label })), { to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' }].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-brand-light-bg rounded-lg">
                  {item.label}
                </Link>
              ))}
              <a href="https://wa.me/971565096880" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg mt-1">
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
