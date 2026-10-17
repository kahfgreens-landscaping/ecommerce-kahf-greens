/**
 * pages/HomePage.jsx
 * Main storefront landing page
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Leaf, Sparkles } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import catalogData from '../data/catalog.json';
import { FEATURED_TABS, getCategoryBySlug } from '../data/categories';
import { cn } from '../lib/utils';

const HERO_COLLECTIONS = [
  {
    name: 'Mosaic Collection',
    slug: 'mosaic',
    desc: 'Italian-crafted architectural planters with faceted geometric lines',
    img: '/images/products/idel-mosaic-curve-55/idel-mosaic-curve-55__gray__01.jpg',
  },
  {
    name: 'Pottery Pots',
    slug: 'pottery-pots',
    desc: 'Handfinished luxury planters featuring Dutch design & metallic finishes',
    img: '/images/products/pottery-pots/pottery-pots__beth-gold__04.png',
  },
  {
    name: 'Balcony & Windowbox',
    slug: 'balcony',
    desc: 'Railing flowerboxes & compact planters made for UAE terraces & villas',
    img: '/images/products/idel-mosaic-flowerbox/idel-mosaic-flowerbox__white__01.jpg',
  },
];

const TRUST_ITEMS = [
  { icon: Truck,     title: 'Free UAE Delivery',    desc: 'On orders over AED 200' },
  { icon: Shield,    title: 'Authentic Products',   desc: 'Direct from brand partners' },
  { icon: Leaf,      title: 'UAE Climate Tested',   desc: 'All pots are heat & UV resistant' },
  { icon: Star,      title: 'Premium Quality',      desc: '20+ years of UAE landscaping excellence' },
];

export default function HomePage() {
  const [activeTabId, setActiveTabId] = useState('mosaic');

  const currentTab = useMemo(() => {
    return FEATURED_TABS.find(t => t.id === activeTabId) || FEATURED_TABS[0];
  }, [activeTabId]);

  const featuredProducts = useMemo(() => {
    const categoryConfig = getCategoryBySlug(activeTabId);
    if (!categoryConfig) return catalogData.products.slice(0, 8);

    const matches = catalogData.products.filter(categoryConfig.filter);
    // Sort by quantity or featured status
    return matches.sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, 8);
  }, [activeTabId]);

  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="bg-[#f3f0e8] overflow-hidden">
        <div className="container py-8 md:py-12">
          <div className="grid min-h-[490px] md:min-h-[570px] md:grid-cols-[0.92fr_1.08fr] bg-[#faf9f5]">
            <div className="relative z-10 flex flex-col items-start justify-center px-7 py-12 sm:px-12 md:px-14 lg:px-20">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-sage mb-5">
                Thoughtful design · Made for the UAE
              </span>
              <h1 className="font-serif font-medium text-[42px] sm:text-5xl lg:text-[62px] text-[#29382e] leading-[1.08] max-w-xl">
                Let your space<br className="hidden sm:block" /> grow beautifully.
              </h1>
              <p className="text-[#6e7169] text-sm sm:text-base max-w-md leading-7 mt-6">
                Planters with presence, chosen to bring a little more nature into the way you live.
              </p>
              <div className="flex flex-wrap items-center gap-5 mt-8">
                <Link to="/products" className="inline-flex items-center gap-3 bg-[#29382e] text-white px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] hover:bg-brand-mid transition-colors">
                  Explore the collection <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/collections/mosaic" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#29382e] border-b border-[#87907e] pb-1 hover:border-brand-dark">
                  Discover Mosaic
                </Link>
              </div>
              <div className="flex items-center gap-6 sm:gap-9 mt-12 pt-6 border-t border-[#e7e3d9] w-full max-w-md">
                {[['20+', 'Years in the UAE'], ['269', 'Ways to grow']].map(([number, label]) => (
                  <div key={label}>
                    <p className="font-serif text-2xl text-[#29382e]">{number}</p>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[300px] md:min-h-full overflow-hidden bg-[#ebe6da]">
              <img
                src="/images/products/idel-mosaic-curve-55/idel-mosaic-curve-55__yellow__01.jpg"
                alt="A sculptural planter with evergreen foliage"
                className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply"
                onError={e => { e.currentTarget.src = '/images/placeholder-pot.jpg'; }}
              />
              <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 bg-[#faf9f5]/90 backdrop-blur px-4 py-3">
                <p className="text-[9px] uppercase tracking-[0.16em] text-brand-sage">Rooted in quality</p>
                <p className="font-serif text-sm text-[#29382e] mt-1">Considered for every corner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ───────────────────────────────────────────── */}
      <section className="bg-[#fcfbf8] border-b border-[#e8e4db]">
        <div className="container py-6 md:py-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#f0eee6] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-brand-dark" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Section with Mosaic, Rectangular, Square, Balcony Tabs ── */}
      <section className="bg-[#f3f0e8] py-16 md:py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-brand-sage text-[10px] font-semibold uppercase tracking-[0.18em] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                Featured Categories
              </span>
              <h2 className="section-title">Explore by Style & Shape</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                Discover our signature Italian-made Mosaic pots, rectangular flowerboxes, modern cubes, and railing planters.
              </p>
            </div>

            <Link
              to={`/collections/${currentTab.slug}`}
              className="text-xs sm:text-sm text-brand-dark font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all w-fit"
            >
              <span>Explore all {currentTab.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Category Tabs: Mosaic, Rectangular, Square, Balcony, More styles */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {FEATURED_TABS.map(tab => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  type="button"
                  className={cn(
                    'px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer shrink-0 border',
                    isActive
                      ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                      : 'bg-white/80 text-muted-foreground border-[#e4dfd3] hover:bg-white hover:text-foreground'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer shrink-0 border bg-white/80 text-brand-dark border-[#e4dfd3] hover:bg-brand-dark hover:text-white hover:border-brand-dark flex items-center gap-1.5"
            >
              <span>More styles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tab products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {featuredProducts.map(product => (
              <ProductCard key={`${product.id}-${product.categorySlug || product.slug}`} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to={`/collections/${currentTab.slug}`}
              className="btn-outline inline-flex items-center gap-2 text-xs uppercase tracking-wider py-3 px-6"
            >
              <span>View Full {currentTab.label} Collection ({featuredProducts.length}+ pots)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Collections ─────────────────────────────────────────── */}
      <section className="container py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-sage text-[10px] font-semibold uppercase tracking-[0.18em] mb-2">Browse by Collection</p>
            <h2 className="section-title">Shop by Range</h2>
          </div>
          <Link to="/products" className="text-sm text-brand-dark font-medium flex items-center gap-1 hover:gap-2 transition-all">
            All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
          {HERO_COLLECTIONS.map(col => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              className="relative group overflow-hidden aspect-[4/3] bg-[#f0eee6]"
            >
              <img
                src={col.img}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
              <div className="absolute bottom-5 left-5 md:bottom-7 md:left-7 text-white">
                <p className="font-serif text-2xl">{col.name}</p>
                <p className="text-xs text-white/80 mt-1">{col.desc}</p>
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
