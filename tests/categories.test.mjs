import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const catalogPath = join(__dirname, '../src/data/catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

const {
  POT_CATEGORIES,
  FEATURED_TABS,
  ROUND_IDS,
  RECTANGULAR_IDS,
  SQUARE_IDS,
  HANGING_IDS,
  KITS_IDS,
  getCategoryBySlug,
} = await import('../src/data/categories.js');

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

test('Idel MARINELLA is in Round and NOT in Rectangular', () => {
  assert.ok(ROUND_IDS.has('idel-marinella'), 'Idel MARINELLA must be in Round');
  assert.ok(!RECTANGULAR_IDS.has('idel-marinella'), 'Idel MARINELLA must NOT be in Rectangular');
});

test('Tirreno, Ducale, Terme, and Volterra are in Rectangular and NOT in Round', () => {
  const rectangularCheck = [
    'idel-bio-compost-tirreno-mini-saucer-2-5l',
    'idel-ducale-lt60',
    'idel-terme',
    'idel-volterra',
  ];

  for (const id of rectangularCheck) {
    assert.ok(RECTANGULAR_IDS.has(id), `Product ${id} must be in Rectangular`);
    assert.ok(!ROUND_IDS.has(id), `Product ${id} must NOT be in Round`);
  }
});

test('PP YANG and Idel HYDRUS are in Square', () => {
  assert.ok(SQUARE_IDS.has('pp-yang'), 'PP YANG must be in Square');
  assert.ok(SQUARE_IDS.has('idel-hydrus'), 'Idel HYDRUS must be in Square');
  assert.ok(!ROUND_IDS.has('pp-yang'), 'PP YANG must NOT be in Round');
  assert.ok(!HANGING_IDS.has('idel-hydrus'), 'Idel HYDRUS must NOT be in Hanging');
});

test('Idel Kit Lipari and Kit Elba are in Hanging', () => {
  assert.ok(HANGING_IDS.has('idel-kit-lipari'), 'idel-kit-lipari must be in Hanging');
  assert.ok(HANGING_IDS.has('idel-kit-elba'), 'idel-kit-elba must be in Hanging');
});

test('Idel HANG ETRUSCO is in Pot Kits and sets and NOT in Hanging', () => {
  assert.ok(KITS_IDS.has('idel-hang-etrusco-3-2l'), 'idel-hang-etrusco-3-2l must be in Kits');
  assert.ok(!HANGING_IDS.has('idel-hang-etrusco-3-2l'), 'idel-hang-etrusco-3-2l must NOT be in Hanging');
});

test('Idel TWIN SET CLASSIC POT is removed from Kits & Sets, Kit Elba remains in Kits', () => {
  assert.ok(!KITS_IDS.has('idel-twin-set-classic-pot'), 'idel-twin-set-classic-pot must NOT be in Kits & Sets');
  assert.ok(KITS_IDS.has('idel-kit-elba'), 'idel-kit-elba must be in Kits & Sets');
  assert.ok(ROUND_IDS.has('idel-twin-set-classic-pot'), 'idel-twin-set-classic-pot must remain in Round');
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
