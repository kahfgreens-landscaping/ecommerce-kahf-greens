/**
 * pages/HomePage.jsx
 * Main storefront landing page
 */
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RotateCcw, Leaf } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import catalogData from '../data/catalog.json';

const HERO_COLLECTIONS = [
  { name: 'Idel Collection', slug: 'idel', desc: 'Italian-crafted premium planters', img: '/images/products/idel-classic-matte-round/Matte-Round-2.png' },
  { name: 'Pottery Pots', slug: 'pottery-pots', desc: 'Handfinished luxury finishes', img: '/images/products/pottery-pots/1._BETH_Gold_1.jpg' },
  { name: 'Desch Pots', slug: 'desch-pots', desc: 'Commercial growing & nursery containers', img: '/images/products/idel-bio-compost/Pots_with_Plants-1.png' },
];

const TRUST_ITEMS = [
  { icon: Truck,     title: 'Free UAE Delivery',    desc: 'On orders over AED 200' },
  { icon: Shield,    title: 'Authentic Products',   desc: 'Direct from brand partners' },
  { icon: Leaf,      title: 'UAE Climate Tested',   desc: 'All pots are heat & UV resistant' },
  { icon: Star,      title: 'Premium Quality',      desc: '20+ years of UAE landscaping excellence' },
];

// Featured: pick highest-qty products from key categories
const FEATURED = catalogData.products
  .filter(p => p.inStock && p.minPrice)
  .sort((a, b) => b.totalQuantity - a.totalQuantity)
  .slice(0, 8);

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand-mid to-brand-light overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/images/hero-pattern.svg)', backgroundSize: '40px' }} />
        <div className="container relative py-20 md:py-28 flex flex-col items-start gap-6">
          <span className="badge-green text-xs font-semibold">🌿 Premier Plant Pots — UAE</span>
          <h1 className="font-serif font-bold text-4xl md:text-6xl text-white leading-tight max-w-2xl">
            Beautiful Pots for<br />
            <span className="text-brand-gold">Every Space</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl leading-relaxed">
            From Italian Idel luxury planters to handcrafted Pottery Pots — shop UAE's most complete collection. All prices in AED including 5% VAT.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link to="/products" className="btn-gold inline-flex items-center gap-2">
              Shop All Pots <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/collections/idel" className="btn-outline border-white text-white hover:bg-white hover:text-brand-dark inline-flex items-center gap-2">
              Idel Collection
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-4 text-white/90 text-sm">
            {[['56+', 'Products'], ['269+', 'Variants'], ['AED 2–1,525', 'Price Range'], ['20+', 'Years in UAE']].map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-1.5">
                <span className="font-bold text-xl text-brand-gold">{n}</span>
                <span className="text-white/70">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="container py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-light-bg rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-brand-dark" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collections ─────────────────────────────────────────── */}
      <section className="container py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-sage text-sm font-semibold uppercase tracking-wide mb-1">Browse by Collection</p>
            <h2 className="section-title">Shop by Range</h2>
          </div>
          <Link to="/products" className="text-sm text-brand-dark font-medium flex items-center gap-1 hover:gap-2 transition-all">
            All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HERO_COLLECTIONS.map(col => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              className="relative group overflow-hidden rounded-2xl aspect-[4/3] bg-muted card-hover"
            >
              <img
                src={col.img}
                alt={col.name}
                className="product-image"
                onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-serif font-bold text-xl">{col.name}</p>
                <p className="text-sm text-white/80">{col.desc}</p>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white text-brand-dark text-xs font-semibold px-3 py-1 rounded-full">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────── */}
      <section className="bg-brand-light-bg py-14">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand-sage text-sm font-semibold uppercase tracking-wide mb-1">Bestsellers</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="text-sm text-brand-dark font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEATURED.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── UAE Banner ───────────────────────────────────────────── */}
      <section className="container py-14">
        <div className="bg-gradient-to-r from-brand-dark to-brand-mid rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-wide mb-2">B2B & Wholesale</p>
            <h2 className="font-serif font-bold text-3xl md:text-4xl mb-3">For Landscapers & Contractors</h2>
            <p className="text-white/80 max-w-xl">
              Serving UAE's landscape industry since 2004. Volume pricing, dedicated account managers, and stock reservation for large projects.
            </p>
            <Link to="/b2b" className="btn-gold mt-5 inline-flex items-center gap-2">
              Request B2B Pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-6 text-center">
            {[['500+', 'Projects Served'], ['20+', 'Years UAE Experience'], ['All Emirates', 'Delivery']].map(([n, l]) => (
              <div key={l}>
                <p className="text-3xl font-bold text-brand-gold">{n}</p>
                <p className="text-white/70 text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Kahf Greens ─────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-brand-sage text-sm font-semibold uppercase tracking-wide mb-1">Why Choose Us</p>
            <h2 className="section-title">UAE's Trusted Pot Supplier</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🌡️', title: 'UAE Climate Ready', desc: 'All pots tested for Dubai heat, UV resistance, and desert dust. No cracking or fading.' },
              { icon: '🏗️', title: 'Project Scale Stock', desc: 'Hundreds of units on hand. We supply landscaping projects, hotels, and residential developments.' },
              { icon: '🌿', title: 'Expert Horticultural Advice', desc: '20+ years serving UAE\'s green sector. We know what works in this climate.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-brand-light-bg">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-semibold text-lg text-brand-dark mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
