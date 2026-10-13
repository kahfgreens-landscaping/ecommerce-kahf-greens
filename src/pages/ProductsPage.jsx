/**
 * pages/ProductsPage.jsx
 * Full product listing with filters, sort, search
 */
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import catalogData from '../data/catalog.json';
import { getColorHex } from '../lib/utils';

const ALL_COLORS = [...new Set(catalogData.products.flatMap(p => p.colors))].filter(Boolean).sort();
const ALL_CATEGORIES = catalogData.categories.map(c => c.name);

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'stock-desc', label: 'Most in Stock' },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(2000);
  const searchQuery = searchParams.get('q') || '';

  const filtered = useMemo(() => {
    let products = [...catalogData.products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colors.some(c => c.toLowerCase().includes(q))
      );
    }
    if (selectedCats.length > 0) {
      products = products.filter(p => selectedCats.includes(p.category));
    }
    if (selectedColors.length > 0) {
      products = products.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }
    if (inStockOnly) {
      products = products.filter(p => p.inStock);
    }
    products = products.filter(p => p.minPrice === null || p.minPrice <= maxPrice);

    switch (sortBy) {
      case 'price-asc':  return products.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
      case 'price-desc': return products.sort((a, b) => (b.maxPrice || 0) - (a.maxPrice || 0));
      case 'name-asc':   return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'stock-desc': return products.sort((a, b) => b.totalQuantity - a.totalQuantity);
      default:           return products;
    }
  }, [selectedCats, selectedColors, inStockOnly, sortBy, maxPrice, searchQuery]);

  const toggleCat   = (c) => setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleColor = (c) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const clearAll    = () => { setSelectedCats([]); setSelectedColors([]); setInStockOnly(false); setMaxPrice(2000); };
  const hasFilters  = selectedCats.length > 0 || selectedColors.length > 0 || inStockOnly || maxPrice < 2000;

  return (
    <div className="container py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="section-title">{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} products</p>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar — desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel {...{ selectedCats, selectedColors, inStockOnly, maxPrice, toggleCat, toggleColor, setInStockOnly, setMaxPrice, clearAll, hasFilters }} />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sort + filter toggle */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters {hasFilters && `(${selectedCats.length + selectedColors.length})`}
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="admin-input w-auto py-2 pr-8 cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCats.map(c => (
                <span key={c} className="badge badge-green flex items-center gap-1 cursor-pointer" onClick={() => toggleCat(c)}>
                  {c} <X className="w-3 h-3" />
                </span>
              ))}
              {selectedColors.map(c => (
                <span key={c} className="badge badge-green flex items-center gap-1 cursor-pointer" onClick={() => toggleColor(c)}>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(c) }} /> {c} <X className="w-3 h-3" />
                </span>
              ))}
              {inStockOnly && <span className="badge badge-green flex items-center gap-1 cursor-pointer" onClick={() => setInStockOnly(false)}>In Stock <X className="w-3 h-3" /></span>}
              <button onClick={clearAll} className="text-xs text-red-600 hover:underline">Clear all</button>
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium">No products found</p>
              <button onClick={clearAll} className="btn-outline mt-4 text-sm px-4 py-2">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => <ProductCard key={`${p.id}-${p.categorySlug || p.slug}`} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowFilters(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto p-5 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterPanel {...{ selectedCats, selectedColors, inStockOnly, maxPrice, toggleCat, toggleColor, setInStockOnly, setMaxPrice, clearAll, hasFilters }} />
            <button onClick={() => setShowFilters(false)} className="btn-primary w-full mt-4">
              Show {filtered.length} Products
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FilterPanel({ selectedCats, selectedColors, inStockOnly, maxPrice, toggleCat, toggleColor, setInStockOnly, setMaxPrice, clearAll, hasFilters }) {
  return (
    <div className="space-y-6">
      {hasFilters && (
        <button onClick={clearAll} className="text-sm text-red-600 hover:underline flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-brand-dark" />
          <span className="text-sm font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Max Price: AED {maxPrice}</h4>
        <input type="range" min={2} max={2000} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-brand-dark" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>AED 2</span><span>AED 2,000</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Category</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto">
          {ALL_CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={selectedCats.includes(cat)} onChange={() => toggleCat(cat)} className="w-4 h-4 accent-brand-dark" />
              <span className="text-sm group-hover:text-brand-dark">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.slice(0, 20).map(color => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              title={color}
              className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColors.includes(color) ? 'border-brand-dark scale-110' : 'border-white ring-1 ring-border'}`}
              style={{ backgroundColor: getColorHex(color) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
