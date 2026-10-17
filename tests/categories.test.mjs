import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const catalogPath = join(__dirname, '../src/data/catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

const { POT_CATEGORIES, FEATURED_TABS, getCategoryBySlug } = await import('../src/data/categories.js');

test('Mosaic Collection contains strictly Mosaic planters and nothing else', () => {
  const mosaicCat = POT_CATEGORIES.find(c => c.slug === 'mosaic');
  assert.ok(mosaicCat, 'Mosaic category must exist');

  const products = catalog.products.filter(mosaicCat.filter);
  assert.equal(products.length, 6, `Expected 6 Mosaic products, got ${products.length}`);

  for (const p of products) {
    const isMosaic = p.name.toLowerCase().includes('mosaic') || p.category.toLowerCase().includes('mosaic');
    assert.ok(isMosaic, `Product ${p.name} in Mosaic collection does not have Mosaic in name or category`);
  }
});

test('Pottery Pots collection contains strictly Pottery Pots models', () => {
  const ppCat = POT_CATEGORIES.find(c => c.slug === 'pottery-pots');
  assert.ok(ppCat, 'Pottery Pots category must exist');

  const products = catalog.products.filter(ppCat.filter);
  assert.equal(products.length, 5, `Expected 5 Pottery Pots products, got ${products.length}`);

  for (const p of products) {
    assert.equal(p.category, 'Pottery Pots');
  }
});

test('Shape categories (Round, Rectangular, Square, Balcony, Hanging, Kits) match valid products', () => {
  const round = POT_CATEGORIES.find(c => c.slug === 'round');
  const rectangular = POT_CATEGORIES.find(c => c.slug === 'rectangular');
  const square = POT_CATEGORIES.find(c => c.slug === 'square');
  const balcony = POT_CATEGORIES.find(c => c.slug === 'balcony');
  const hanging = POT_CATEGORIES.find(c => c.slug === 'hanging');
  const kits = POT_CATEGORIES.find(c => c.slug === 'kits');

  assert.ok(catalog.products.filter(round.filter).length >= 25, 'Round category should have >= 25 items');
  assert.ok(catalog.products.filter(rectangular.filter).length >= 8, 'Rectangular category should have >= 8 items');
  assert.ok(catalog.products.filter(square.filter).length >= 6, 'Square category should have >= 6 items');
  assert.ok(catalog.products.filter(balcony.filter).length >= 8, 'Balcony category should have >= 8 items');
  assert.ok(catalog.products.filter(hanging.filter).length >= 2, 'Hanging category should have >= 2 items');
  assert.ok(catalog.products.filter(kits.filter).length >= 4, 'Kits category should have >= 4 items');
});

test('Featured tabs (Mosaic, Rectangular, Square, Balcony) match requested categories', () => {
  const tabIds = FEATURED_TABS.map(t => t.id);
  assert.deepEqual(tabIds, ['mosaic', 'rectangular', 'square', 'balcony']);

  for (const tab of FEATURED_TABS) {
    const categoryConfig = getCategoryBySlug(tab.slug);
    assert.ok(categoryConfig, `Tab ${tab.slug} must resolve to a valid category`);
    const matches = catalog.products.filter(categoryConfig.filter);
    assert.ok(matches.length > 0, `Featured tab ${tab.label} must return products`);
  }
});

test('getCategoryBySlug handles aliases gracefully', () => {
  assert.equal(getCategoryBySlug('mosaic').slug, 'mosaic');
  assert.equal(getCategoryBySlug('idel').slug, 'mosaic');
  assert.equal(getCategoryBySlug('kit').slug, 'kits');
  assert.equal(getCategoryBySlug('kits').slug, 'kits');
  assert.equal(getCategoryBySlug('pottery-pots').slug, 'pottery-pots');
  assert.equal(getCategoryBySlug('nonexistent'), undefined);
});
