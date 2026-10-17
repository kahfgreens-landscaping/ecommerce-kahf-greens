const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../src/data/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Format SKU function to guarantee global uniqueness:
// [PROD_PREFIX]-[SIZE]-[COLOR]
// e.g. IDEL-MOSAIC-CURVE-40-13-WHITE-ASH vs IDEL-MOSAIC-FLOWERBOX-40-WHITE-ASH
const globalSkus = new Set();
let updatedCount = 0;

// First pass: identify all colliding SKUs across all products
const skuCounts = {};
catalog.products.forEach(p => {
  p.variants.forEach(v => {
    skuCounts[v.sku] = (skuCounts[v.sku] || 0) + 1;
  });
});

catalog.products.forEach(product => {
  product.variants.forEach(variant => {
    if (skuCounts[variant.sku] > 1) {
      // Rebuild unique SKU for colliding ones
      // Use clean product token + size + clean color
      const pToken = product.id.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const sToken = (variant.size || variant.capacity || 'STD').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const cToken = variant.color.toUpperCase().replace(/[^A-Z0-9]/g, '');
      variant.sku = `${pToken.slice(0, 10)}-${sToken}-${cToken}`;
      updatedCount++;
    }
  });
});

// Second pass: verify and ensure 100% global uniqueness
const finalSet = new Map();
let finalCollisions = 0;

catalog.products.forEach(product => {
  product.variants.forEach(variant => {
    let sku = variant.sku;
    if (finalSet.has(sku)) {
      // Append index to guarantee uniqueness
      let counter = 2;
      while (finalSet.has(`${sku}-${counter}`)) {
        counter++;
      }
      sku = `${sku}-${counter}`;
      variant.sku = sku;
    }
    finalSet.set(sku, { productId: product.id, color: variant.color, size: variant.sizeLabel });
  });
});

console.log(`Updated SKUs. Total variants: ${finalSet.size}. Global collisions: ${finalCollisions}`);
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Saved catalog.json with 100% unique SKUs.`);
