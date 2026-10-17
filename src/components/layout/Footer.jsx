/**
 * components/layout/Footer.jsx
 */
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const year = CURRENT_YEAR;

  return (
    <footer className="bg-brand-dark text-white mt-16">
      <div className="container py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-10 w-10 bg-white rounded-xl p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img src="/logo.png" alt="Kahf Greens" className="h-full w-full object-contain" />
            </div>
            <span className="font-serif font-bold text-xl text-white">Kahf Greens</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            Premium plant pots, planters & garden containers. Supplying UAE's finest landscapes since 2004.
          </p>
          <div className="flex gap-3">
            <a href="https://instagram.com/kahfgreens" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://facebook.com/kahfgreens" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/></svg>
            </a>
            <a href="https://wa.me/971565096880" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title="WhatsApp">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { to: '/collections/idel', label: 'Idel Collection' },
              { to: '/collections/pottery-pots', label: 'Pottery Pots' },
              { to: '/collections/desch-pots', label: 'Desch Pots' },
              { to: '/products', label: 'All Products' },
              { to: '/wishlist', label: 'My Wishlist' },
            ].map(l => (
              <li key={l.to}><Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Help links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              { to: '/about', label: 'About Kahf Greens' },
              { to: '/contact', label: 'Contact Us' },
              { to: '/blogs', label: 'Blogs & News' },
              { to: '/faq', label: 'FAQ' },
              { to: '/delivery', label: 'Delivery Information' },
              { to: '/b2b', label: 'B2B / Wholesale' },
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms & Conditions' },
            ].map(l => (
              <li key={l.to}><Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-sage-light" />
              Dubai, United Arab Emirates
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-brand-sage-light" />
              <a href="tel:+97142240733" className="hover:text-white">+971 4 224 0733</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 shrink-0 text-green-400" />
              <a href="https://wa.me/971565096880" className="hover:text-white">+971 56 509 6880</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-brand-sage-light" />
              <a href="mailto:shop@kahfgreens.ae" className="hover:text-white">shop@kahfgreens.ae</a>
            </li>
            <li className="text-xs text-white/50 mt-2">
              Sat – Thu: 8:00 AM – 6:00 PM
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {year} Kahf Greens LLC. All Rights Reserved. Licensed & Registered in Dubai, UAE.</p>
          <p>TRN: [Your TRN] · All prices incl. 5% VAT</p>
        </div>
      </div>
    </footer>
  );
}
