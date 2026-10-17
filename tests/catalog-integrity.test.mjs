import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const catalogPath = join(__dirname, '../src/data/catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

test('Catalog structure: has products and categories arrays', () => {
  assert.ok(Array.isArray(catalog.products), 'catalog.products should be an array');
  assert.ok(Array.isArray(catalog.categories), 'catalog.categories should be an array');
  assert.ok(catalog.products.length > 0, 'catalog.products should not be empty');
  assert.ok(catalog.categories.length > 0, 'catalog.categories should not be empty');
});

test('Catalog product IDs and slugs must be 100% unique', () => {
  const ids = new Set();
  const slugs = new Set();
  const duplicateIds = [];
  const duplicateSlugs = [];

  for (const product of catalog.products) {
    assert.ok(product.id, `Product missing id: ${JSON.stringify(product)}`);
    assert.ok(product.slug, `Product ${product.id} missing slug`);

    if (ids.has(product.id)) duplicateIds.push(product.id);
    ids.add(product.id);

    if (slugs.has(product.slug)) duplicateSlugs.push(product.slug);
    slugs.add(product.slug);
  }

  assert.deepEqual(duplicateIds, [], `Found duplicate product IDs: ${duplicateIds.join(', ')}`);
  assert.deepEqual(duplicateSlugs, [], `Found duplicate product slugs: ${duplicateSlugs.join(', ')}`);
});

test('Mosaic Curve models have distinct IDs, slugs, and names', () => {
  const mosaic13 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-13');
  const mosaic40 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-40');
  const mosaic55 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-55');
  const mosaic90 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-90' || p.slug === 'idel-mosaic-curve-high-90');

  assert.ok(mosaic13, 'Mosaic Curve 13 must exist in catalog');
  assert.ok(mosaic40, 'Mosaic Curve 40 must exist in catalog');
  assert.ok(mosaic55, 'Mosaic Curve 55 must exist in catalog');
  assert.ok(mosaic90, 'Mosaic Curve 90 must exist in catalog');

  const slugs = [mosaic13.slug, mosaic40.slug, mosaic55.slug, mosaic90.slug];
  assert.equal(new Set(slugs).size, 4, 'All 4 Mosaic Curve variants must have unique slugs');

  const ids = [mosaic13.id, mosaic40.id, mosaic55.id, mosaic90.id];
  assert.equal(new Set(ids).size, 4, 'All 4 Mosaic Curve variants must have unique IDs');
});

test('Variant SKUs are non-empty and unique per product', () => {
  for (const product of catalog.products) {
    assert.ok(Array.isArray(product.variants), `Product ${product.id} must have variants array`);
    assert.ok(product.variants.length > 0, `Product ${product.id} must have at least 1 variant`);

    const skus = new Set();
    for (const v of product.variants) {
      assert.ok(v.sku && typeof v.sku === 'string', `Product ${product.id} variant missing valid SKU`);
      assert.ok(!skus.has(v.sku), `Product ${product.id} has duplicate variant SKU: ${v.sku}`);
      skus.add(v.sku);
      assert.equal(typeof v.inStock, 'boolean', `Variant ${v.sku} inStock must be boolean`);
      assert.ok(Number.isInteger(v.quantity) && v.quantity >= 0, `Variant ${v.sku} quantity must be non-negative integer`);
    }
  }
});

test('Product totalQuantity and inStock status match variant aggregates', () => {
  for (const product of catalog.products) {
    const sumQty = product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    assert.equal(
      product.totalQuantity,
      sumQty,
      `Product ${product.id} totalQuantity (${product.totalQuantity}) does not match sum of variants (${sumQty})`
    );

    const expectedInStock = sumQty > 0;
    assert.equal(
      product.inStock,
      expectedInStock,
      `Product ${product.id} inStock (${product.inStock}) does not match expected (${expectedInStock}) based on totalQuantity ${sumQty}`
    );
  }
});

test('Product minPrice and maxPrice accurately reflect variant prices', () => {
  for (const product of catalog.products) {
    const pricedVariants = product.variants.filter(v => typeof v.price === 'number' && v.price !== null);
    if (pricedVariants.length === 0) {
      assert.equal(product.minPrice, null, `Product ${product.id} with no priced variants should have minPrice null`);
      assert.equal(product.maxPrice, null, `Product ${product.id} with no priced variants should have maxPrice null`);
    } else {
      const prices = pricedVariants.map(v => v.price);
      const expectedMin = Math.min(...prices);
      const expectedMax = Math.max(...prices);
      assert.equal(
        product.minPrice,
        expectedMin,
        `Product ${product.id} minPrice (${product.minPrice}) does not match variant min (${expectedMin})`
      );
      assert.equal(
        product.maxPrice,
        expectedMax,
        `Product ${product.id} maxPrice (${product.maxPrice}) does not match variant max (${expectedMax})`
      );
    }
  }
});

test('All products and variants have original prices with 40-60% discount', () => {
  for (const product of catalog.products) {
    assert.ok(
      typeof product.discountPercent === 'number' && product.discountPercent >= 40 && product.discountPercent <= 60,
      `Product ${product.id} discountPercent (${product.discountPercent}) must be between 40 and 60`
    );

    const pricedVariants = product.variants.filter(v => typeof v.price === 'number' && v.price !== null);
    if (pricedVariants.length > 0) {
      assert.ok(
        product.originalMinPrice >= product.minPrice,
        `Product ${product.id} originalMinPrice (${product.originalMinPrice}) must be >= minPrice (${product.minPrice})`
      );
      assert.ok(
        product.originalMaxPrice >= product.maxPrice,
        `Product ${product.id} originalMaxPrice (${product.originalMaxPrice}) must be >= maxPrice (${product.maxPrice})`
      );

      for (const v of pricedVariants) {
        assert.ok(
          typeof v.originalPrice === 'number' && v.originalPrice > v.price,
          `Variant ${v.sku} originalPrice (${v.originalPrice}) must be greater than sale price (${v.price})`
        );
        const actualDiscount = ((v.originalPrice - v.price) / v.originalPrice) * 100;
        assert.ok(
          actualDiscount >= 38 && actualDiscount <= 62,
          `Variant ${v.sku} actual discount (${actualDiscount.toFixed(1)}%) must be around 40-60%`
        );
      }
    }
  }
});
