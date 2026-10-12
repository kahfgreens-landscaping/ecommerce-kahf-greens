import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { cn, formatPriceRange, getColorStyle } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { getProductImage, getProductImageForColor } from '../../data/imageMap';

export default function ProductCard({ product, className }) {
  const [imgError, setImgError] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const { addItem, openCart } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  // Variant matching selected color or first variant
  const currentVariant = (selectedColor && product.variants?.find(v => v.color === selectedColor)) || product.variants?.[0];

  // Image updates dynamically when color is clicked
  const imageSrc = imgError 
    ? '/images/placeholder-pot.jpg' 
    : (selectedColor ? getProductImageForColor(product.slug, selectedColor) : getProductImage(product.slug));

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (currentVariant) {
      addItem(product, currentVariant, 1);
      openCart();
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
  };

  const handleColorClick = (e, color) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(prev => prev === color ? null : color);
    setImgError(false);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn('group relative bg-white rounded-xl overflow-hidden border border-border card-hover flex flex-col', className)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-brand-light-bg overflow-hidden">
        <img
          src={imageSrc}
          alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''}`}
          onError={() => setImgError(true)}
          className="product-image transition-all duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!product.inStock && (
            <span className="badge-red">Sold Out</span>
          )}
          {product.inStock && product.totalQuantity <= 5 && (
            <span className="badge-gold">Only {product.totalQuantity} left</span>
          )}
          {selectedColor && (
            <span className="text-[10px] bg-brand-dark/85 text-white px-2 py-0.5 rounded-full font-medium">
              {selectedColor}
            </span>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            title="Add to cart"
            className="p-2.5 bg-white rounded-full shadow-md hover:bg-brand-dark hover:text-white transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={handleWishlist}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'p-2.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors',
              wishlisted && 'text-red-500'
            )}
          >
            <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
          </button>
          <span className="p-2.5 bg-white rounded-full shadow-md hover:bg-brand-dark hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs text-brand-sage font-medium uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-brand-dark transition-colors">
          {product.name}
        </h3>

        {/* Color swatches with click-to-change picture */}
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap my-1">
            {product.colors.slice(0, 8).map(color => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={(e) => handleColorClick(e, color)}
                  title={`${color} (click to preview)`}
                  className={cn(
                    'w-4 h-4 rounded-full border transition-all duration-200 shadow-xs cursor-pointer',
                    isSelected 
                      ? 'scale-125 ring-2 ring-brand-dark ring-offset-1 border-white z-10' 
                      : 'border-white/80 ring-1 ring-black/10 hover:scale-115'
                  )}
                  style={getColorStyle(color)}
                />
              );
            })}
            {product.colors.length > 8 && (
              <span className="text-[11px] text-muted-foreground font-medium">+{product.colors.length - 8}</span>
            )}
          </div>
        )}

        {/* Sizes pill list */}
        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 3).map(s => (
              <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-xs text-muted-foreground">+{product.sizes.length - 3} sizes</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-2">
          <p className="font-bold text-brand-dark text-lg">
            {formatPriceRange(product.minPrice, product.maxPrice)}
          </p>
          <p className="text-xs text-muted-foreground">Incl. VAT · Free delivery on orders over AED 200</p>
        </div>
      </div>
    </Link>
  );
}
