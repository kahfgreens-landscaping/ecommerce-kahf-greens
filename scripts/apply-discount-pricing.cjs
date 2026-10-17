/**
 * scripts/apply-discount-pricing.cjs
 * Adds deterministic 40-60% discount pricing to catalog.json:
 * - variant.originalPrice
 * - variant.discountPercent
 * - product.originalMinPrice
 * - product.originalMaxPrice
 * - product.discountPercent
 */
const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function getDiscountPercent(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  // Deterministic integer between 40 and 60
  return 40 + (Math.abs(hash) % 21);
}

function calcOriginalPrice(salePrice, discountPct) {
  if (typeof salePrice !== 'number' || salePrice === null) return null;
  const raw = salePrice / (1 - discountPct / 100);
  if (raw >= 10) {
    return Math.round(raw);
  } else {
    // Round to nearest 0.50 for clean small denominations
    return Math.round(raw * 2) / 2;
  }
}

let totalProducts = 0;
let totalVariants = 0;

for (const product of catalog.products) {
  totalProducts++;
  const discountPct = getDiscountPercent(product.id);
  product.discountPercent = discountPct;

  const originalPrices = [];

  for (const variant of product.variants) {
    totalVariants++;
    variant.discountPercent = discountPct;
    if (typeof variant.price === 'number' && variant.price !== null) {
      const orig = calcOriginalPrice(variant.price, discountPct);
      variant.originalPrice = orig;
      originalPrices.push(orig);
    } else {
      variant.originalPrice = null;
    }
  }

  if (originalPrices.length > 0) {
    product.originalMinPrice = Math.min(...originalPrices);
    product.originalMaxPrice = Math.max(...originalPrices);
  } else {
    product.originalMinPrice = null;
    product.originalMaxPrice = null;
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');

console.log(`Updated ${totalProducts} products and ${totalVariants} variants with 40-60% discount pricing.`);
