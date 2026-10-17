/**
 * App.jsx — Main router
 */
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppFloat from './components/ui/WhatsAppFloat';

// Scroll restoration to top on any route navigation
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search, hash]);

  return null;
}

// Lazy load pages
const HomePage         = lazy(() => import('./pages/HomePage'));
const ProductsPage     = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage= lazy(() => import('./pages/ProductDetailPage'));
const CollectionPage   = lazy(() => import('./pages/CollectionPage'));
const WishlistPage     = lazy(() => import('./pages/WishlistPage'));
const ContactPage      = lazy(() => import('./pages/ContactPage'));
const BlogsPage        = lazy(() => import('./pages/BlogsPage'));
const AdminPage        = lazy(() => import('./pages/admin/AdminPage'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-brand-dark animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

// Layout wrapper (storefront)
function StoreLayout({ children }) {
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Admin — no store header */}
      <Route path="/admin/*" element={
        <Suspense fallback={<PageLoader />}><AdminPage /></Suspense>
      } />

      {/* Storefront */}
      <Route path="/" element={<StoreLayout><HomePage /></StoreLayout>} />
      <Route path="/products" element={<StoreLayout><ProductsPage /></StoreLayout>} />
      <Route path="/products/:slug" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
      <Route path="/collections/:slug" element={<StoreLayout><CollectionPage /></StoreLayout>} />
      <Route path="/wishlist" element={<StoreLayout><WishlistPage /></StoreLayout>} />
      <Route path="/contact" element={<StoreLayout><ContactPage /></StoreLayout>} />
      <Route path="/blogs" element={<StoreLayout><BlogsPage /></StoreLayout>} />

      {/* Placeholder pages */}
      <Route path="/about" element={<StoreLayout><PlaceholderPage title="About Kahf Greens" /></StoreLayout>} />
      <Route path="/faq" element={<StoreLayout><PlaceholderPage title="FAQ" /></StoreLayout>} />
      <Route path="/delivery" element={<StoreLayout><PlaceholderPage title="Delivery & Returns" /></StoreLayout>} />
      <Route path="/b2b" element={<StoreLayout><PlaceholderPage title="B2B & Wholesale" /></StoreLayout>} />
      <Route path="/privacy" element={<StoreLayout><PlaceholderPage title="Privacy Policy" /></StoreLayout>} />
      <Route path="/terms" element={<StoreLayout><PlaceholderPage title="Terms & Conditions" /></StoreLayout>} />
      <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />

      {/* 404 */}
      <Route path="*" element={<StoreLayout><PlaceholderPage title="Page Not Found" /></StoreLayout>} />
    </Routes>
    </>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="container py-20 text-center">
      <h1 className="section-title mb-4">{title}</h1>
      <p className="text-muted-foreground">This page is coming soon. Contact us for help.</p>
    </div>
  );
}
