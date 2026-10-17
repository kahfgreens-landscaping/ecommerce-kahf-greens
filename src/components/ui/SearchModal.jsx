/**
 * components/ui/SearchModal.jsx
 * Fuzzy product search overlay
 */
import { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import catalogData from '../../data/catalog.json';
import { formatPriceRange } from '../../lib/utils';
import { getProductImageForProduct } from '../../data/imageMap';

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return catalogData.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.colors.some(c => c.toLowerCase().includes(q)) ||
      p.sizes.some(s => String(s).toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search pots, colours, sizes..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-base outline-none bg-transparent placeholder:text-muted-foreground"
            />
            <button onClick={onClose} className="p-1 rounded hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 ? (
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {results.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-light-bg transition-colors group"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={getProductImageForProduct(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <p className="text-sm font-bold text-brand-dark mt-0.5">
                      {formatPriceRange(product.minPrice, product.maxPrice)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-dark transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No products found for "<strong>{query}</strong>"</p>
              <Link to={`/products?q=${encodeURIComponent(query)}`} onClick={onClose} className="text-sm text-brand-dark underline mt-2 block">
                See all results
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {['Classic Matte Round', 'Pottery Pots', 'Terracotta', 'Anthracite', 'Mosaic'].map(t => (
                  <button key={t} onClick={() => setQuery(t)} className="text-sm px-3 py-1.5 bg-muted rounded-full hover:bg-brand-light-bg transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
