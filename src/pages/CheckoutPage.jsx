import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ShoppingCart,
  Clock,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getProductImageForProductColor } from '../data/imageMap';
import {
  formatWhatsAppCartMessage,
  getWhatsAppOrderUrl,
  DEFAULT_WHATSAPP_DISPLAY,
  formatPcs
} from '../lib/whatsapp';
import { formatPrice, getColorStyle } from '../lib/utils';

const EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
  'Al Ain',
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    emirate: 'Dubai',
    address: '',
    notes: '',
  });

  const [method, setMethod] = useState('whatsapp'); // 'whatsapp' | 'cod'
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderCompleted, setOrderCompleted] = useState(null);

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((s, i) => s + (i.variant.price || 0) * i.quantity, 0);
  }, [items]);

  const deliveryFee = subtotal >= 200 || items.length === 0 ? 0 : 20;
  const total = subtotal + deliveryFee;
  const totalPcs = items.reduce((s, i) => s + i.quantity, 0);

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your full name';
    if (!form.phone.trim()) {
      errs.phone = 'Please enter your WhatsApp or phone number';
    } else if (form.phone.replace(/[^0-9]/g, '').length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!form.address.trim()) errs.address = 'Please enter your delivery address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };


  const whatsappMessagePreview = useMemo(() => {
    if (items.length === 0) return '';
    return formatWhatsAppCartMessage({
      items,
      customer: form,
      deliveryFee,
      subtotal,
      total,
      paymentMethod: method === 'whatsapp' ? 'WhatsApp Order / Transfer' : 'Cash on Delivery (COD)',
    });
  }, [items, form, deliveryFee, subtotal, total, method]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    const orderRef = `KG-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      orderRef,
      items: [...items],
      customer: { ...form },
      subtotal,
      deliveryFee,
      total,
      method,
      date: new Date().toLocaleString(),
      url: getWhatsAppOrderUrl({
        items,
        customer: form,
        deliveryFee,
        subtotal,
        total,
        orderRef,
        paymentMethod: method === 'whatsapp' ? 'WhatsApp Order' : 'Cash on Delivery (COD)',
      }),
    };

    // Open WhatsApp
    window.open(orderData.url, '_blank', 'noopener,noreferrer');

    // Show completion screen
    setOrderCompleted(orderData);
    clearCart();
  };

  // If order was just completed
  if (orderCompleted) {
    return (
      <div className="container py-14 max-w-2xl">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#25D366]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-2">
            Order Reference: #{orderCompleted.orderRef}
          </span>
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Order Sent to WhatsApp!
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            We have generated your order details with all items, colors, and quantities. WhatsApp should have opened automatically. If it didn't, click the button below.
          </p>

          <div className="bg-muted/40 rounded-xl p-4 text-left mb-6 space-y-2 text-sm border border-border/60">
            <div className="flex justify-between font-medium">
              <span>Customer:</span>
              <span>{orderCompleted.customer.name}</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Phone / WhatsApp:</span>
              <span>{orderCompleted.customer.phone}</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Delivery Emirate:</span>
              <span>{orderCompleted.customer.emirate}</span>
            </div>
            <div className="border-t border-border/60 pt-2 flex justify-between font-bold text-brand-dark">
              <span>Total Amount:</span>
              <span>{formatPrice(orderCompleted.total)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={orderCompleted.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Re-open WhatsApp Chat
              <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
            </a>
            <Link
              to="/products"
              className="btn-outline w-full block text-center rounded-xl"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="container py-20 text-center max-w-lg">
        <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mx-auto mb-5 text-muted-foreground">
          <ShoppingCart className="w-10 h-10 opacity-40" />
        </div>
        <h1 className="text-2xl font-serif font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Looks like you haven't added any plant pots to your cart yet. Explore our premium collections!
        </p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Explore Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-brand-dark">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-brand-dark">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Column: Form & Checkout Options */}
        <div className="w-full lg:w-7/12 space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              Checkout & Order Confirmation
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Provide your delivery details below to send your cart directly to our WhatsApp.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Step 1: Customer Info */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-bold">1</span>
                <h2 className="font-semibold text-foreground text-base">Contact & Delivery Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-xs font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Al-Ali"
                    value={form.name}
                    onChange={e => {
                      setForm(f => ({ ...f, name: e.target.value }));
                      if (errors.name) setErrors(err => ({ ...err, name: null }));
                    }}
                    className={`admin-input ${errors.name ? 'border-red-500 focus:ring-red-400' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="admin-label text-xs font-semibold">
                    WhatsApp / Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +971 50 123 4567"
                    value={form.phone}
                    onChange={e => {
                      setForm(f => ({ ...f, phone: e.target.value }));
                      if (errors.phone) setErrors(err => ({ ...err, phone: null }));
                    }}
                    className={`admin-input ${errors.phone ? 'border-red-500 focus:ring-red-400' : ''}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label text-xs font-semibold">
                    Emirate <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.emirate}
                    onChange={e => setForm(f => ({ ...f, emirate: e.target.value }))}
                    className="admin-input cursor-pointer"
                  >
                    {EMIRATES.map(em => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-label text-xs font-semibold">
                    Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label text-xs font-semibold">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Villa / Apartment number, building name, street, area"
                  value={form.address}
                  onChange={e => {
                    setForm(f => ({ ...f, address: e.target.value }));
                    if (errors.address) setErrors(err => ({ ...err, address: null }));
                  }}
                  className={`admin-input resize-none ${errors.address ? 'border-red-500 focus:ring-red-400' : ''}`}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="admin-label text-xs font-semibold">
                  Special Delivery Instructions <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave at door, call before delivery, gate code"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="admin-input"
                />
              </div>
            </div>

            {/* Step 2: Choose Order Method */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-bold">2</span>
                <h2 className="font-semibold text-foreground text-base">Select Checkout & Order Method</h2>
              </div>

              <div className="space-y-3">
                {/* Option 1: WhatsApp Checkout */}
                <label
                  onClick={() => setMethod('whatsapp')}
                  className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    method === 'whatsapp'
                      ? 'border-[#25D366] bg-green-50/40 shadow-sm'
                      : 'border-border hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkoutMethod"
                    checked={method === 'whatsapp'}
                    onChange={() => setMethod('whatsapp')}
                    className="mt-1 text-[#25D366] focus:ring-[#25D366]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        Order via WhatsApp
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#25D366] text-white">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Sends your complete cart breakdown directly to our WhatsApp ({DEFAULT_WHATSAPP_DISPLAY}) with all colors, sizes, quantities, and delivery details for instant confirmation.
                    </p>

                    {/* Collapsible WhatsApp Preview */}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPreview(p => !p);
                        }}
                        className="text-xs text-brand-dark font-medium underline hover:text-brand-mid inline-flex items-center gap-1"
                      >
                        {showPreview ? 'Hide Message Preview' : 'Preview WhatsApp Message Details'}
                      </button>

                      {showPreview && (
                        <div className="mt-2.5 p-4 bg-[#f0f9f1] border border-green-200/80 rounded-xl text-xs font-mono whitespace-pre-wrap text-[#111b21] max-h-64 overflow-y-auto shadow-inner leading-relaxed">
                          {whatsappMessagePreview}
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Option 2: Cash on Delivery */}
                <label
                  onClick={() => setMethod('cod')}
                  className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    method === 'cod'
                      ? 'border-brand-dark bg-brand-light-bg shadow-sm'
                      : 'border-border hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkoutMethod"
                    checked={method === 'cod'}
                    onChange={() => setMethod('cod')}
                    className="mt-1 text-brand-dark focus:ring-brand-dark"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-brand-dark" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Pay with cash when your items are delivered to your door in UAE. We will also open WhatsApp to confirm your order details.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl text-base group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Send Order to WhatsApp ({formatPrice(total)})</span>
            </button>

            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-mid" />
                Direct Store Support
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-mid" />
                Fast Confirmation
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-mid" />
                UAE-wide Delivery
              </span>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Cart Details */}
        <div className="w-full lg:w-5/12 sticky top-24">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-semibold text-foreground text-base">
                Order Summary ({totalPcs} {totalPcs === 1 ? 'item' : 'items'})
              </h2>
              <span className="text-xs font-semibold text-brand-dark bg-brand-light-bg px-2.5 py-1 rounded-full">
                Review Items
              </span>
            </div>

            {/* Items list with color, pieces, price */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {items.map(({ product, variant, quantity }) => {
                const colorStyle = getColorStyle(variant.color);
                const pcsText = formatPcs(quantity);
                const lineTotal = (variant.price || 0) * quantity;

                return (
                  <div key={variant.sku} className="flex gap-3 pb-3 border-b border-border/50 last:border-b-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/60">
                      <img
                        src={getProductImageForProductColor(product, variant.color)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = '/images/placeholder-pot.jpg'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs sm:text-sm text-foreground line-clamp-1">{product.name}</h3>

                      {/* Explicit color badge + pieces display matching user requirement */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground">
                          <span className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" style={colorStyle} />
                          {variant.color || 'Standard'} color
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-light-bg text-brand-dark">
                          {pcsText}
                        </span>
                        {variant.sizeLabel && (
                          <span className="text-[11px] text-muted-foreground">
                            {variant.sizeLabel}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="text-muted-foreground">
                          {formatPrice(variant.price)} × {quantity}
                        </span>
                        <span className="font-bold text-brand-dark">
                          {formatPrice(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary calculations */}
            <div className="space-y-2.5 pt-3 border-t border-border text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalPcs} Pcs)</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  Delivery
                  {subtotal >= 200 && <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.2 rounded font-semibold">Free</span>}
                </span>
                <span className="font-medium text-foreground">
                  {deliveryFee === 0 ? 'Complimentary (AED 0.00)' : formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>VAT (5% included)</span>
                <span>{formatPrice(total * 0.05 / 1.05)}</span>
              </div>

              {subtotal < 200 && (
                <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-2.5 text-xs text-amber-800 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Add <strong>{formatPrice(200 - subtotal)}</strong> more to get <strong>Free UAE Delivery</strong>!
                  </span>
                </div>
              )}

              <div className="border-t border-border pt-3 flex justify-between items-center text-base sm:text-lg font-bold text-foreground">
                <span>Total Amount:</span>
                <span className="text-brand-dark">{formatPrice(total)}</span>
              </div>
            </div>

            {/* WhatsApp Note */}
            <div className="bg-green-50/70 border border-green-200 rounded-lg p-3 text-xs text-green-900 flex items-start gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-950">WhatsApp Order Assurance</p>
                <p className="text-[11px] text-green-800/90 mt-0.5">
                  Your order items, exact colors (e.g. {items[0]?.variant?.color || 'Taupe'} color), and quantities will be formatted and messaged directly to our store WhatsApp for fast processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
