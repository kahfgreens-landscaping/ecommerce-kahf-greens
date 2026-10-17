/**
 * lib/whatsapp.js
 * Professional WhatsApp order formatting, click-to-chat URL generation, and store config
 */

export const DEFAULT_WHATSAPP_NUMBER = '971565096880';
export const DEFAULT_WHATSAPP_DISPLAY = '+971 56 509 6880';

/**
 * Get active store WhatsApp number (from localStorage if overridden, otherwise default)
 */
export function getStoreWhatsAppNumber() {
  if (typeof window === 'undefined') return DEFAULT_WHATSAPP_NUMBER;
  return localStorage.getItem('kahf_store_whatsapp') || DEFAULT_WHATSAPP_NUMBER;
}

/**
 * Set custom store WhatsApp number
 */
export function setStoreWhatsAppNumber(phoneNumber) {
  if (typeof window === 'undefined') return;
  const cleaned = String(phoneNumber).replace(/[^0-9]/g, '');
  if (cleaned) {
    localStorage.setItem('kahf_store_whatsapp', cleaned);
  } else {
    localStorage.removeItem('kahf_store_whatsapp');
  }
}

/**
 * Format quantity with Pc / Pcs
 */
export function formatPcs(qty) {
  const count = Number(qty) || 0;
  return `${count} ${count === 1 ? 'Pc' : 'Pcs'}`;
}

/**
 * Generate a clean order reference number
 */
export function generateOrderRef() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `KG-${rand}`;
}

/**
 * Format date & time nicely for WhatsApp
 */
function getFormattedDateTime() {
  try {
    return new Intl.DateTimeFormat('en-AE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
  } catch {
    return new Date().toLocaleString();
  }
}

/**
 * Format currency amount nicely
 */
function formatAED(amount) {
  return `AED ${(Number(amount) || 0).toFixed(2)}`;
}

/**
 * Build an executive, professional WhatsApp order inquiry message.
 * Emphasizes exact color and quantity specifications (e.g. "Taupe color: 2 Pcs", "Blue color: 1 Pc")
 * with elegant typography, structured sections, and clear billing.
 */
export function formatWhatsAppCartMessage({
  items = [],
  customer = null,
  deliveryFee = 0,
  subtotal = 0,
  total = 0,
  orderRef = null,
  paymentMethod = 'WhatsApp Order',
}) {
  const ref = orderRef || generateOrderRef();
  const dateStr = getFormattedDateTime();
  const totalItemsCount = items.length;
  const totalPcsCount = items.reduce((s, i) => s + (i.quantity || 0), 0);

  // 1. Detailed itemized specifications
  const itemsText = items.map((item, idx) => {
    const { product, variant, quantity } = item;
    const color = variant.color || 'Standard';
    const size = variant.sizeLabel || (variant.size ? `${variant.size} ${variant.sizeUnit || 'cm'}` : null);
    const unitPrice = variant.price || 0;
    const lineTotal = unitPrice * quantity;
    const pcsText = formatPcs(quantity);

    const lines = [
      `[${idx + 1}] *${product.name}*`,
      `    ▫ *Color:* ${color}`,
      `    ▫ *Quantity:* ${pcsText}`,
    ];

    if (size) {
      lines.push(`    ▫ *Size / Spec:* ${size}`);
    }
    if (variant.sku) {
      lines.push(`    ▫ *SKU:* \`${variant.sku}\``);
    }
    lines.push(`    ▫ *Unit Price:* ${formatAED(unitPrice)}`);
    lines.push(`    ▫ *Line Total:* ${formatAED(lineTotal)}`);

    return lines.join('\n');
  }).join('\n\n');

  // 2. Color & Quantity breakdown (e.g., "Taupe color: 2 Pcs", "Blue color: 1 Pc")
  const colorBreakdown = {};
  items.forEach(i => {
    const c = i.variant?.color || 'Standard';
    colorBreakdown[c] = (colorBreakdown[c] || 0) + i.quantity;
  });

  const colorSummaryLines = Object.entries(colorBreakdown)
    .map(([color, qty]) => `▪ *${color} color:* ${formatPcs(qty)}`)
    .join('\n');

  // 3. Customer Details
  const hasCustomerInfo = customer && (customer.name || customer.phone || customer.address);
  let customerSection = '';

  if (hasCustomerInfo) {
    const custLines = [
      '📍 *DELIVERY & CONTACT DETAILS*',
      '────────────────────────',
    ];
    if (customer.name) custLines.push(`▫ *Customer Name:* ${customer.name}`);
    if (customer.phone) custLines.push(`▫ *Phone / WhatsApp:* ${customer.phone}`);
    if (customer.email) custLines.push(`▫ *Email:* ${customer.email}`);
    if (customer.emirate) custLines.push(`▫ *Emirate:* ${customer.emirate}`);
    if (customer.address) custLines.push(`▫ *Delivery Address:* ${customer.address}`);
    if (customer.notes) custLines.push(`▫ *Special Instructions:* ${customer.notes}`);
    custLines.push('▫ *Delivery Note:* For delivery charges, please ask and share your location.');
    customerSection = custLines.join('\n');
  } else {
    customerSection = [
      '📍 *CUSTOMER STATUS*',
      '────────────────────────',
      '▫ Direct cart inquiry submitted via website.',
      '▫ Awaiting confirmation of delivery location.',
      '▫ *For delivery charges, please ask and share your location.*',
    ].join('\n');
  }

  // 4. Financial breakdown
  const vatAmount = (total * 0.05 / 1.05);
  const deliveryText = deliveryFee === 0 ? 'Complimentary (Free UAE Delivery)' : formatAED(deliveryFee);

  // Assemble the executive message
  return [
    '🌿 *KAHF GREENS* | *ORDER INQUIRY*',
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    `🏷 *Order Reference:* #${ref}`,
    `🗓 *Date & Time:* ${dateStr}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '📦 *ORDER SPECIFICATIONS*',
    '────────────────────────',
    itemsText || '▫ No items selected',
    '',
    '🎨 *SUMMARY BY COLOR & QUANTITY*',
    '────────────────────────',
    colorSummaryLines || '▪ None',
    `_(Total: ${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'} · ${formatPcs(totalPcsCount)})_`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    '💳 *BILLING & SUMMARY*',
    '────────────────────────',
    `▫ *Subtotal:* ${formatAED(subtotal)}`,
    `▫ *Delivery:* ${deliveryText}`,
    `▫ *VAT (5% Included):* ${formatAED(vatAmount)}`,
    `▫ *TOTAL PAYABLE:* *${formatAED(total)}*`,
    `▫ *Payment Mode:* ${paymentMethod}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    customerSection,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    '🌿 *Kahf Greens* — Premium Planters & Containers · UAE',
    '🌐 www.kahfgreens.ae | 📞 +971 4 224 0733',
    '📍 *For Delivery Charges, please ask and share your location.*',
    '💬 *Please confirm item availability and delivery schedule.*',
  ].join('\n');
}

/**
 * Generate the WhatsApp click-to-chat URL
 */
export function getWhatsAppOrderUrl({
  items = [],
  customer = null,
  deliveryFee = 0,
  subtotal = 0,
  total = 0,
  orderRef = null,
  paymentMethod = 'WhatsApp Order',
  targetPhone = null,
}) {
  const phone = targetPhone || getStoreWhatsAppNumber();
  const message = formatWhatsAppCartMessage({
    items,
    customer,
    deliveryFee,
    subtotal,
    total,
    orderRef,
    paymentMethod,
  });

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
