import test from 'node:test';
import assert from 'node:assert/strict';

const {
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_DISPLAY,
  formatPcs,
  generateOrderRef,
  formatWhatsAppCartMessage,
  getWhatsAppOrderUrl,
} = await import('../src/lib/whatsapp.js');

test('WhatsApp constants: phone number and display', () => {
  assert.equal(DEFAULT_WHATSAPP_NUMBER, '971565096880');
  assert.equal(DEFAULT_WHATSAPP_DISPLAY, '+971 56 509 6880');
});

test('formatPcs formats single vs plural pieces correctly', () => {
  assert.equal(formatPcs(1), '1 Pc');
  assert.equal(formatPcs(2), '2 Pcs');
  assert.equal(formatPcs(10), '10 Pcs');
  assert.equal(formatPcs(0), '0 Pcs');
  assert.equal(formatPcs(null), '0 Pcs');
});

test('generateOrderRef creates valid reference numbers', () => {
  const ref1 = generateOrderRef();
  const ref2 = generateOrderRef();
  assert.match(ref1, /^KG-\d{6}$/);
  assert.match(ref2, /^KG-\d{6}$/);
  assert.notEqual(ref1, ref2);
});

test('formatWhatsAppCartMessage formats complete order with colors and quantities', () => {
  const mockItems = [
    {
      product: { name: 'Idel Mosaic Curve 40' },
      variant: { sku: 'IDELMO-40-ANTHRACITE', color: 'Anthracite', sizeLabel: '40 cm', price: 95 },
      quantity: 2,
    },
    {
      product: { name: 'Pottery Pots Beth' },
      variant: { sku: 'PPBETH-GOLD-01', color: 'Gold', sizeLabel: 'Medium', price: 150 },
      quantity: 1,
    },
  ];

  const customer = {
    name: 'Ahmed Al Mansoori',
    phone: '+971 50 123 4567',
    email: 'ahmed@example.com',
    emirate: 'Dubai',
    address: 'Villa 12, Palm Jumeirah, Dubai',
    notes: 'Please ring bell',
  };

  const message = formatWhatsAppCartMessage({
    items: mockItems,
    customer,
    deliveryFee: 0,
    subtotal: 340,
    total: 340,
    orderRef: 'KG-789012',
    paymentMethod: 'WhatsApp Order',
  });

  // Verify structure
  assert.ok(message.includes('Order Reference:* #KG-789012'));
  assert.ok(message.includes('[1] *Idel Mosaic Curve 40*'));
  assert.ok(message.includes('▫ *Color:* Anthracite'));
  assert.ok(message.includes('▫ *Quantity:* 2 Pcs'));
  assert.ok(message.includes('▫ *Size / Spec:* 40 cm'));
  assert.ok(message.includes('▫ *SKU:* `IDELMO-40-ANTHRACITE`'));
  assert.ok(message.includes('▫ *Unit Price:* AED 95.00'));
  assert.ok(message.includes('▫ *Line Total:* AED 190.00'));

  // Color breakdown
  assert.ok(message.includes('▪ *Anthracite color:* 2 Pcs'));
  assert.ok(message.includes('▪ *Gold color:* 1 Pc'));

  // Customer section
  assert.ok(message.includes('▫ *Customer Name:* Ahmed Al Mansoori'));
  assert.ok(message.includes('▫ *Phone / WhatsApp:* +971 50 123 4567'));
  assert.ok(message.includes('▫ *Delivery Address:* Villa 12, Palm Jumeirah, Dubai'));

  // Financial section
  assert.ok(message.includes('▫ *Subtotal:* AED 340.00'));
  assert.ok(message.includes('Complimentary (Free UAE Delivery)'));
  assert.ok(message.includes('▫ *TOTAL PAYABLE:* *AED 340.00*'));

  // Delivery charges & location note
  assert.ok(message.toLowerCase().includes('for delivery charges, please ask and share your location'));
});

test('formatWhatsAppCartMessage includes delivery charges and location note when customer is empty', () => {
  const message = formatWhatsAppCartMessage({
    items: [{ product: { name: 'Idel Mosaic Curve 13' }, variant: { color: 'White', price: 45 }, quantity: 1 }],
    customer: null,
    subtotal: 45,
    deliveryFee: 20,
    total: 65,
  });
  assert.ok(message.toLowerCase().includes('for delivery charges, please ask and share your location'));
});

test('getWhatsAppOrderUrl generates valid URL with encoded message', () => {
  const url = getWhatsAppOrderUrl({
    items: [
      {
        product: { name: 'Test Pot' },
        variant: { sku: 'TEST-SKU', color: 'White', price: 100 },
        quantity: 1,
      },
    ],
    subtotal: 100,
    deliveryFee: 20,
    total: 120,
    orderRef: 'KG-111222',
  });

  assert.ok(url.startsWith('https://wa.me/971565096880?text='));
  const textParam = url.replace('https://wa.me/971565096880?text=', '');
  const decoded = decodeURIComponent(textParam);

  assert.ok(decoded.includes('Test Pot'));
  assert.ok(decoded.includes('KG-111222'));
  assert.ok(decoded.includes('AED 120.00'));
});
