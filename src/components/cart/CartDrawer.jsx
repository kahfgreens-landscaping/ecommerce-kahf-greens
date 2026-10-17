/**
 * components/cart/CartDrawer.jsx
 * Slide-in cart panel with direct WhatsApp order & checkout navigation
 */
import { X, ShoppingCart, Trash2, Plus, Minus, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { getProductImageForProductColor } from '../../data/imageMap';
import { getWhatsAppOrderUrl, formatPcs } from '../../lib/whatsapp';
import { formatPrice, getColorStyle } from '../../lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce((s, i) => s + (i.variant.price || 0) * i.quantity, 0);
  const deliveryFee = total >= 200 || items.length === 0 ? 0 : 20;

  if (!isOpen) return null;

  const quickWhatsAppUrl = getWhatsAppOrderUrl({
    items,
    subtotal: total,
    deliveryFee,
    total: total + deliveryFee,
    paymentMethod: 'WhatsApp Order (Direct from Cart)',
  });

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={closeCart} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-dark" />
            <h2 className="font-semibold text-lg">Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add some pots to get started!</p>
              <button onClick={closeCart} className="btn-outline mt-4 text-sm px-4 py-2">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(({ product, variant, quantity }) => {
              const colorStyle = getColorStyle(variant.color);
              return (
                <div key={variant.sku} className="flex gap-3 bg-muted/30 rounded-xl p-3 border border-border/40">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/50">
                    <img
                      src={getProductImageForProductColor(product, variant.color)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                    
                    {/* Clear display of color & pieces */}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium text-foreground bg-white px-1.5 py-0.5 rounded border border-border/60">
                        <span className="w-2 h-2 rounded-full border border-black/20" style={colorStyle} />
                        {variant.color || 'Standard'} color
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-brand-dark">{formatPcs(quantity)}</span>
                      {variant.sizeLabel && (
                        <>
                          <span>·</span>
                          <span>{variant.sizeLabel}</span>
                        </>
                      )}
                    </div>

                    <p className="font-bold text-brand-dark mt-1 text-sm">{formatPrice(variant.price)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(variant.sku, quantity - 1)} className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-muted" aria-label="Decrease quantity">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(variant.sku, quantity + 1)} className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-muted" aria-label="Increase quantity">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(variant.sku)} className="ml-auto p-1.5 rounded hover:bg-red-50 hover:text-red-500 transition-colors" aria-label="Remove item">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-3 bg-white">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>VAT (5% included)</span>
              <span>{formatPrice(total * 0.05 / 1.05)}</span>
            </div>
            {total < 200 ? (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 text-center border border-amber-200/50">
                Add <strong>AED {(200 - total).toFixed(2)}</strong> more for free delivery!
              </p>
            ) : (
              <p className="text-xs text-green-700 bg-green-50 rounded-lg p-2 text-center border border-green-200/50">
                🎉 You qualify for Free UAE Delivery!
              </p>
            )}

            {/* Direct WhatsApp Order Button */}
            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm group"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Order via WhatsApp ({formatPrice(total + deliveryFee)})</span>
            </a>

            {/* Standard Checkout Link */}
            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center flex items-center justify-center gap-2 rounded-xl text-sm py-3"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button onClick={closeCart} className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
