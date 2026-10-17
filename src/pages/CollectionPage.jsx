/**
 * pages/CollectionPage.jsx
 * Filtered product view per collection / category slug
 */
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import catalogData from '../data/catalog.json';
import { getCategoryBySlug } from '../data/categories';

export default function CollectionPage() {
  const { slug } = useParams();
  
  // 1. Check primary taxonomy first (Mosaic, Pottery Pots, Round, Rectangular, Square, Balcony, Hanging, Kits)
  const categoryConfig = getCategoryBySlug(slug);

  let collection = null;
  if (categoryConfig) {
    collection = {
      label: categoryConfig.label,
      badge: categoryConfig.badge,
      desc: categoryConfig.desc,
      filter: categoryConfig.filter,
    };
  } else if (slug) {
    // 2. Fallback to raw catalog category slug
    const matchedCategory = catalogData.categories.find(c => c.slug === slug);
    if (matchedCategory) {
      collection = {
        label: matchedCategory.name,
        badge: 'Category',
        desc: `Explore our premium ${matchedCategory.name} collection.`,
        filter: p => p.categorySlug === matchedCategory.slug || p.category === matchedCategory.name,
      };
    }
  }

  if (!collection) return (
    <div className="container py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
      <p className="text-muted-foreground mb-6">We couldn't find the requested collection. Browse all planters below.</p>
      <Link to="/products" className="btn-primary">All Products</Link>
    </div>
  );

  const products = catalogData.products.filter(collection.filter);

  return (
    <div className="container py-8">
      <Link to="/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-dark mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" /> All Products
      </Link>
      
      <div className="mb-8">
        {collection.badge && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-sage bg-brand-light-bg px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3 text-brand-gold" />
            {collection.badge}
          </span>
        )}
        <h1 className="section-title">{collection.label}</h1>
        {collection.desc && (
          <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed">{collection.desc}</p>
        )}
        <p className="text-xs font-semibold text-brand-dark mt-2">{products.length} products available</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={`${p.id}-${p.categorySlug || p.slug}`} product={p} />)}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No products currently found in this category.</p>
          <Link to="/products" className="btn-outline mt-4 inline-block text-sm px-4 py-2">
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
