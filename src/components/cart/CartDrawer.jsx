/**
 * components/cart/CartDrawer.jsx
 * Slide-in cart panel
 */
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { getProductImage } from '../../data/imageMap';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = items.reduce((s, i) => s + (i.variant.price || 0) * i.quantity, 0);

  if (!isOpen) return null;

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
            <h2 className="font-semibold text-lg">Your Cart ({items.reduce((s,i)=>s+i.quantity,0)})</h2>
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-muted transition-colors">
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
            items.map(({ product, variant, quantity }) => (
              <div key={variant.sku} className="flex gap-3 bg-muted/30 rounded-xl p-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {variant.color} · {variant.sizeLabel || `${variant.size} ${variant.sizeUnit}`}
                  </p>
                  <p className="font-bold text-brand-dark mt-1">{formatPrice(variant.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(variant.sku, quantity - 1)} className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-muted">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                    <button onClick={() => updateQuantity(variant.sku, quantity + 1)} className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-muted">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(variant.sku)} className="ml-auto p-1.5 rounded hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal (excl. shipping)</span>
              <span className="font-medium text-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>VAT (5% included)</span>
              <span>{formatPrice(total * 0.05 / 1.05)}</span>
            </div>
            {total < 200 && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 text-center">
                Add AED {(200 - total).toFixed(2)} more for free delivery!
              </p>
            )}
            <Link to="/checkout" onClick={closeCart} className="btn-primary w-full text-center block text-center">
              Proceed to Checkout
            </Link>
            <button onClick={closeCart} className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
