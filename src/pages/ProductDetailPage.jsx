import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Check, ChevronLeft, ChevronRight, MessageCircle, Truck, Shield, Maximize2, X } from 'lucide-react';
import catalogData from '../data/catalog.json';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatPrice, getColorStyle, cn } from '../lib/utils';
import { getProductImagesForProduct, getProductImageForProductColor } from '../data/imageMap';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = catalogData.products.find(p => p.slug === slug)
    || (slug === 'idel-mosaic-curve' ? catalogData.products.find(p => p.slug === 'idel-mosaic-curve-13') : null)
    || (slug === 'idel-mosaic-curve-high' || slug === 'idel-mosaic-curve-high-90' ? catalogData.products.find(p => p.slug === 'idel-mosaic-curve-90') : null);
  const { addItem, openCart } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize]   = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded]   = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Reset state when navigating between products
  useEffect(() => {
    setSelectedColor(null);
    setSelectedSize(null);
    setImgIdx(0);
  }, [slug]);

  const images = getProductImagesForProduct(product);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullScreen) return;
      if (e.key === 'Escape') setIsFullScreen(false);
      if (e.key === 'ArrowLeft') setImgIdx(i => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === 'ArrowRight') setImgIdx(i => (i < images.length - 1 ? i + 1 : 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, images.length]);

  if (!product) return (
    <div className="container py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Product not found</h1>
      <Link to="/products" className="btn-primary">Back to Shop</Link>
    </div>
  );

  const wishlisted = isWishlisted(product.id);

  // When selectedColor changes, find corresponding image in gallery and set as active
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (!color) return;
    const colorImg = getProductImageForProductColor(product, color);
    if (colorImg) {
      const idx = images.indexOf(colorImg);
      if (idx !== -1) {
        setImgIdx(idx);
      } else {
        setImgIdx(0);
      }
    }
  };

  // Derive unique colors and sizes
  const colors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);
  const sizes  = [...new Set(product.variants.map(v => v.sizeLabel || `${v.size} ${v.sizeUnit}`))].filter(Boolean);

  // Selected variant
  const selectedVariant = product.variants.find(v => {
      const vSize = v.sizeLabel || `${v.size} ${v.sizeUnit}`;
      const colorMatch = !selectedColor || v.color === selectedColor;
      const sizeMatch  = !selectedSize  || vSize === selectedSize;
      return colorMatch && sizeMatch;
    }) || product.variants[0];

  const handleAddToCart = () => {
    addItem(product, selectedVariant, 1);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Related products (same category)
  const related = catalogData.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-brand-dark">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-dark">Products</Link>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ── Image Gallery ──────────────────────────────────── */}
        <div>
          {/* Main image with Full View trigger */}
          <div 
            onClick={() => setIsFullScreen(true)}
            className="group relative aspect-square bg-brand-light-bg rounded-2xl overflow-hidden mb-3 cursor-zoom-in border border-border"
            title="Click for full view"
          >
            <img
              src={images[imgIdx] || '/images/placeholder-pot.jpg'}
              alt={`${product.name} - image ${imgIdx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
              onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
            />

            {/* Click for Full View Pill Indicator */}
            <div className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs transition-all pointer-events-none group-hover:scale-105">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full View</span>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i => Math.max(0, i - 1)); }}
                  disabled={imgIdx === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-foreground rounded-full shadow-md disabled:opacity-30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i => Math.min(images.length - 1, i + 1)); }}
                  disabled={imgIdx === images.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-foreground rounded-full shadow-md disabled:opacity-30 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={cn(
                    'shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                    imgIdx === i ? 'border-brand-dark ring-2 ring-brand-dark/20 scale-102' : 'border-transparent hover:border-muted-foreground/40'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Fullscreen Lightbox Modal ────────────────────── */}
        {isFullScreen && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
            onClick={() => setIsFullScreen(false)}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
              <div>
                <p className="font-semibold text-base sm:text-lg">{product.name}</p>
                <p className="text-xs text-white/70">
                  {imgIdx + 1} of {images.length} · {selectedColor ? `Color: ${selectedColor}` : 'Use arrows or keyboard to navigate'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Central Stage Image */}
            <div 
              className="relative flex-1 flex items-center justify-center my-2 max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[imgIdx] || '/images/placeholder-pot.jpg'}
                alt={`${product.name} - full view`}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-200"
                onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
              />

              {/* Prev / Next navigation */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setImgIdx(i => (i > 0 ? i - 1 : images.length - 1))}
                    className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer backdrop-blur-xs"
                    title="Previous (←)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgIdx(i => (i < images.length - 1 ? i + 1 : 0))}
                    className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer backdrop-blur-xs"
                    title="Next (→)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom thumbnail strip */}
            {images.length > 1 && (
              <div 
                className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 hide-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    className={cn(
                      'shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                      imgIdx === i ? 'border-white scale-110 shadow-lg' : 'border-white/30 opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Product Info ──────────────────────────────────── */}
        <div>
          <p className="text-brand-sage text-sm font-semibold uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="font-serif font-bold text-3xl text-brand-dark mb-2">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <p className="text-3xl font-bold text-brand-dark">{formatPrice(selectedVariant?.price || product.minPrice)}</p>
            <span className="text-sm text-muted-foreground">incl. 5% VAT</span>
          </div>

          {/* Stock status */}
          {selectedVariant?.inStock ? (
            <div className="flex items-center gap-2 text-green-700 text-sm mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              In Stock ({selectedVariant.quantity} units available)
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Sold Out
            </div>
          )}

          {/* Color selector */}
          {colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2">
                Color: <span className="font-normal text-muted-foreground">{selectedColor || 'Select a color'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                    className={cn(
                      'w-9 h-9 rounded-full border-2 transition-all cursor-pointer shadow-xs',
                      selectedColor === color 
                        ? 'border-brand-dark scale-110 ring-2 ring-brand-light ring-offset-2 z-10' 
                        : 'border-white ring-1 ring-black/15 hover:scale-105'
                    )}
                    style={getColorStyle(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">
                Size: <span className="font-normal text-muted-foreground">{selectedSize || 'Select a size'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => {
                  const variantForSize = product.variants.find(v => (v.sizeLabel || `${v.size} ${v.sizeUnit}`) === size && (!selectedColor || v.color === selectedColor));
                  const available = variantForSize?.inStock !== false;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!available}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                        selectedSize === size
                          ? 'border-brand-dark bg-brand-dark text-white'
                          : available
                            ? 'border-border hover:border-brand-dark hover:text-brand-dark'
                            : 'border-border text-muted-foreground line-through cursor-not-allowed opacity-50'
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.inStock}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all',
                added
                  ? 'bg-green-600 text-white'
                  : selectedVariant?.inStock
                    ? 'bg-brand-dark text-white hover:bg-brand-mid'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
            </button>
            <button
              onClick={() => toggle(product)}
              className={cn('p-3.5 rounded-xl border-2 transition-all', wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-border hover:border-red-200')}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} />
            </button>
            <button className="p-3.5 rounded-xl border-2 border-border hover:border-muted-foreground transition-all" title="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* WhatsApp order */}
          {(() => {
            const variantColor = selectedVariant?.color || 'Standard';
            const variantSize = selectedVariant?.sizeLabel || (selectedVariant?.size ? `${selectedVariant.size} ${selectedVariant.sizeUnit || 'cm'}` : '');
            const msg = [
              '🌿 *KAHF GREENS* | *PRODUCT INQUIRY*',
              '━━━━━━━━━━━━━━━━━━━━━━━━',
              '📦 *PRODUCT SPECIFICATIONS*',
              '────────────────────────',
              `▫ *Product:* ${product.name}`,
              `▫ *Color:* ${variantColor} color`,
              variantSize ? `▫ *Size / Spec:* ${variantSize}` : null,
              selectedVariant?.sku ? `▫ *SKU:* \`${selectedVariant.sku}\`` : null,
              `▫ *Price:* ${formatPrice(selectedVariant?.price)}`,
              '━━━━━━━━━━━━━━━━━━━━━━━━',
              '💬 *Please confirm item availability and delivery options. Thank you!*',
            ].filter(Boolean).join('\n');

            return (
              <a
                href={`https://wa.me/971565096880?text=${encodeURIComponent(msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 transition-colors mb-6"
              >
                <MessageCircle className="w-4 h-4" /> Order via WhatsApp ({variantColor} color)
              </a>
            );
          })()}

          {/* Delivery info */}
          <div className="space-y-3 border-t border-border pt-5">
            {[
              { icon: Truck,   text: 'Free delivery across UAE on orders over AED 200' },
              { icon: Shield,  text: 'Genuine products · Guaranteed quality · UAE climate tested' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 shrink-0 text-brand-sage" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Variant table */}
          {product.variants.length > 1 && (
            <details className="mt-5 border-t border-border pt-4">
              <summary className="text-sm font-semibold cursor-pointer hover:text-brand-dark">All variants & pricing</summary>
              <div className="mt-3 overflow-x-auto">
                <table className="admin-table w-full text-xs">
                  <thead><tr><th>Color</th><th>Size</th><th>Price</th><th>Stock</th></tr></thead>
                  <tbody>
                    {product.variants.map(v => (
                      <tr key={v.sku}>
                        <td className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 shadow-2xs" style={getColorStyle(v.color)} />
                          {v.color}
                        </td>
                        <td>{v.sizeLabel || `${v.size} ${v.sizeUnit}`}</td>
                        <td className="font-medium">{v.price ? `AED ${v.price}` : '–'}</td>
                        <td>{v.soldOut ? <span className="badge-red">Sold Out</span> : <span className="badge-green">{v.quantity}</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={`${p.id}-${p.categorySlug || p.slug}`} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
