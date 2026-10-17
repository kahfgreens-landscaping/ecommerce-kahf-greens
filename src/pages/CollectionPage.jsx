/**
 * pages/CollectionPage.jsx
 * Filtered product view per collection slug
 */
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import catalogData from '../data/catalog.json';

const COLLECTION_MAP = {
  'idel':        { label: 'Idel Collection', filter: p => p.category.toLowerCase().startsWith('idel') },
  'pottery-pots':{ label: 'Pottery Pots',    filter: p => p.category.toLowerCase().includes('pottery') },
  'desch-pots':  { label: 'Desch Pots',      filter: p => p.category.toLowerCase().includes('desch') },
};

export default function CollectionPage() {
  const { slug } = useParams();
  let collection = COLLECTION_MAP[slug];
  if (!collection && slug) {
    const matchedCategory = catalogData.categories.find(c => c.slug === slug);
    if (matchedCategory) {
      collection = {
        label: matchedCategory.name,
        filter: p => p.categorySlug === matchedCategory.slug || p.category === matchedCategory.name,
      };
    }
  }

  if (!collection) return (
    <div className="container py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
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
        <h1 className="section-title">{collection.label}</h1>
        <p className="text-muted-foreground mt-1">{products.length} products</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={`${p.id}-${p.categorySlug || p.slug}`} product={p} />)}
      </div>
      {products.length === 0 && (
        <p className="text-center py-16 text-muted-foreground">No products in this collection yet.</p>
      )}
    </div>
  );
}
