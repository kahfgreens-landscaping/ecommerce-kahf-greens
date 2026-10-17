import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { cn, formatPrice, formatPriceRange, getColorStyle, getDiscountPercent, calculateOriginalPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { getProductImageForProduct, getProductImageForProductColor } from '../../data/imageMap';

export default function ProductCard({ product, className }) {
  const [imgError, setImgError] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addItem, openCart } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const discountPct = product.discountPercent || getDiscountPercent(product.id);
  const originalMin = product.originalMinPrice ?? calculateOriginalPrice(product.minPrice, discountPct);
  const originalMax = product.originalMaxPrice ?? calculateOriginalPrice(product.maxPrice, discountPct);

  const sizeLabel = (variant) => variant.sizeLabel || `${variant.size} ${variant.sizeUnit}`;
  const variantsForColor = selectedColor
    ? product.variants?.filter(variant => variant.color === selectedColor)
    : product.variants;
  const availableSizes = [...new Set((variantsForColor || []).map(sizeLabel).filter(Boolean))];
  const currentVariant = variantsForColor?.find(variant => sizeLabel(variant) === selectedSize)
    || variantsForColor?.[0]
    || product.variants?.[0];
  const currentOriginalPrice = currentVariant?.originalPrice ?? calculateOriginalPrice(currentVariant?.price, discountPct);

  // Image updates dynamically when color is clicked
  const imageSrc = imgError 
    ? '/images/placeholder-pot.jpg' 
    : (selectedColor
      ? getProductImageForProductColor(product, selectedColor)
      : getProductImageForProduct(product));

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
    const nextColor = selectedColor === color ? null : color;
    const colorSizes = nextColor
      ? new Set(product.variants?.filter(variant => variant.color === nextColor).map(sizeLabel))
      : new Set(product.variants?.map(sizeLabel));
    if (selectedSize && !colorSizes.has(selectedSize)) setSelectedSize(null);
    setSelectedColor(nextColor);
    setImgError(false);
  };

  const handleSizeClick = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(prev => prev === size ? null : size);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn('group relative bg-transparent overflow-hidden flex flex-col', className)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#f0eee8] overflow-hidden">
        <img
          src={imageSrc}
          alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPct && (
            <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded shadow-xs tracking-wider">
              {discountPct}% OFF
            </span>
          )}
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
      <div className="px-1 pt-4 pb-2 flex flex-col gap-2 flex-1">
        <p className="text-[9px] text-brand-sage font-semibold uppercase tracking-[0.16em]">{product.category}</p>
        <h3 className="font-serif font-semibold text-[17px] text-foreground line-clamp-2 group-hover:text-brand-dark transition-colors">
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

        {/* Select a size to preview its variant price */}
        {availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {availableSizes.map(size => (
                <button
                key={size}
                type="button"
                onClick={(e) => handleSizeClick(e, size)}
                aria-pressed={selectedSize === size}
                className={cn(
                    'text-[10px] px-2.5 py-1 border transition-colors',
                  selectedSize === size
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-muted text-muted-foreground border-transparent hover:border-brand-dark hover:text-brand-dark'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-bold text-brand-dark text-base">
              {selectedSize && currentVariant
                ? formatPrice(currentVariant.price)
                : formatPriceRange(product.minPrice, product.maxPrice)}
            </span>
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/80 font-normal">
              {selectedSize && currentVariant
                ? formatPrice(currentOriginalPrice)
                : formatPriceRange(originalMin, originalMax)}
            </span>
            <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              {discountPct}% OFF
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Incl. VAT · Free delivery on orders over AED 200</p>
        </div>
      </div>
    </Link>
  );
}
