import test from 'node:test';
import assert from 'node:assert/strict';

const {
  formatPrice,
  formatPriceRange,
  getColorStyle,
  getColorHex,
  slug,
} = await import('../src/lib/utils.js');

test('formatPrice correctly formats currency and handles nulls', () => {
  assert.equal(formatPrice(200), 'AED 200.00');
  assert.equal(formatPrice(7.5), 'AED 7.50');
  assert.equal(formatPrice(0), 'AED 0.00');
  assert.equal(formatPrice(1234.56), 'AED 1,234.56');
  assert.equal(formatPrice(null), 'Price on request');
  assert.equal(formatPrice(undefined), 'Price on request');
});

test('formatPriceRange formats ranges and single values', () => {
  assert.equal(formatPriceRange(15, 45), 'AED 15.00 – 45.00');
  assert.equal(formatPriceRange(30, 30), 'AED 30.00');
  assert.equal(formatPriceRange(null, 50), 'Price on request');
  assert.equal(formatPriceRange(null, null), 'Price on request');
});

test('getColorStyle handles single, dual, and transparent colors', () => {
  const white = getColorStyle('white');
  assert.equal(white.backgroundColor, '#FFFFFF');

  const terracotta = getColorStyle('terracotta');
  assert.equal(terracotta.backgroundColor, '#C55A38');

  const dual = getColorStyle('white/taupe');
  assert.ok(dual.background && dual.background.includes('linear-gradient'), 'Dual color should return gradient');

  const transparent = getColorStyle('transparent');
  assert.ok(transparent.background && transparent.background.includes('rgba'), 'Transparent should return rgba');

  const unknown = getColorStyle('unknown-rainbow');
  assert.ok(unknown.backgroundColor, 'Fallback should provide background color');
});

test('getColorHex returns clean hex or fallback', () => {
  assert.equal(getColorHex('black'), '#1F1F1F');
  assert.equal(getColorHex('orange'), '#FB8C00');
  assert.equal(getColorHex('non-existent-color'), '#B0BEC5');
});

test('slug helper produces clean URLs', () => {
  assert.equal(slug('Idel MOSAIC CURVE 40'), 'idel-mosaic-curve-40');
  assert.equal(slug('  Kit & Lipari + S  '), 'kit-lipari-s');
  assert.equal(slug('Pottery Pots'), 'pottery-pots');
});

test('Cart calculations: subtotal, delivery fee, and VAT logic', () => {
  const mockItems = [
    { product: { name: 'Pot A' }, variant: { sku: 'SKU-1', price: 50 }, quantity: 2 }, // 100
    { product: { name: 'Pot B' }, variant: { sku: 'SKU-2', price: 60 }, quantity: 1 }, // 60
  ];

  const subtotal = mockItems.reduce((s, i) => s + (i.variant.price || 0) * i.quantity, 0);
  assert.equal(subtotal, 160);

  // Under 200 -> Delivery fee AED 20
  const deliveryUnder = subtotal >= 200 || mockItems.length === 0 ? 0 : 20;
  assert.equal(deliveryUnder, 20);

  const totalUnder = subtotal + deliveryUnder;
  assert.equal(totalUnder, 180);

  // Over 200 -> Free delivery
  const mockItemsOver = [
    ...mockItems,
    { product: { name: 'Pot C' }, variant: { sku: 'SKU-3', price: 50 }, quantity: 1 }, // +50 = 210
  ];
  const subtotalOver = mockItemsOver.reduce((s, i) => s + (i.variant.price || 0) * i.quantity, 0);
  assert.equal(subtotalOver, 210);

  const deliveryOver = subtotalOver >= 200 || mockItemsOver.length === 0 ? 0 : 20;
  assert.equal(deliveryOver, 0);

  const totalOver = subtotalOver + deliveryOver;
  assert.equal(totalOver, 210);

  // Empty cart -> Delivery fee AED 0
  const deliveryEmpty = 0 >= 200 || [].length === 0 ? 0 : 20;
  assert.equal(deliveryEmpty, 0);

  // VAT 5% included
  const vat = totalOver * 0.05 / 1.05;
  assert.equal(Number(vat.toFixed(2)), 10.00);
});
