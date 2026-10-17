import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const catalogPath = join(__dirname, '../src/data/catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

// Filter helper mirroring ProductsPage.jsx filtering logic
function filterProducts({
  products = catalog.products,
  searchQuery = '',
  selectedCats = [],
  selectedColors = [],
  inStockOnly = false,
  maxPrice = 2000,
  sortBy = 'featured',
}) {
  let list = [...products];

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.colors.some(c => c.toLowerCase().includes(q))
    );
  }

  if (selectedCats.length > 0) {
    list = list.filter(p => selectedCats.includes(p.category));
  }

  if (selectedColors.length > 0) {
    list = list.filter(p => p.colors.some(c => selectedColors.includes(c)));
  }

  if (inStockOnly) {
    list = list.filter(p => p.inStock);
  }

  list = list.filter(p => p.minPrice === null || p.minPrice <= maxPrice);

  switch (sortBy) {
    case 'price-asc':  return list.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    case 'price-desc': return list.sort((a, b) => (b.maxPrice || 0) - (a.maxPrice || 0));
    case 'name-asc':   return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'stock-desc': return list.sort((a, b) => b.totalQuantity - a.totalQuantity);
    default:           return list;
  }
}

test('Search query matches product name, category, and variant colors', () => {
  const mosaicResults = filterProducts({ searchQuery: 'mosaic' });
  assert.ok(mosaicResults.length >= 6, `Expected at least 6 Mosaic products, got ${mosaicResults.length}`);
  for (const p of mosaicResults) {
    assert.ok(
      p.name.toLowerCase().includes('mosaic') || p.category.toLowerCase().includes('mosaic'),
      `Result ${p.name} does not match "mosaic"`
    );
  }

  const orangeResults = filterProducts({ searchQuery: 'orange' });
  assert.ok(orangeResults.length > 0, 'Searching orange should return results');
  for (const p of orangeResults) {
    const matches = p.name.toLowerCase().includes('orange') ||
      p.colors.some(c => c.toLowerCase().includes('orange'));
    assert.ok(matches, `Product ${p.name} should contain orange in name or colors`);
  }
});

test('Category filter isolates products by selected categories', () => {
  const potteryResults = filterProducts({ selectedCats: ['Pottery Pots'] });
  assert.ok(potteryResults.length > 0, 'Pottery Pots category should have items');
  for (const p of potteryResults) {
    assert.equal(p.category, 'Pottery Pots');
  }
});

test('Color filter isolates products containing the selected color', () => {
  const goldResults = filterProducts({ selectedColors: ['Gold', 'Total Gold'] });
  assert.ok(goldResults.length > 0, 'Should find products with Gold');
  for (const p of goldResults) {
    assert.ok(
      p.colors.includes('Gold') || p.colors.includes('Total Gold'),
      `Product ${p.name} should include Gold variant`
    );
  }
});

test('In-stock filter excludes out of stock items', () => {
  const inStockResults = filterProducts({ inStockOnly: true });
  for (const p of inStockResults) {
    assert.equal(p.inStock, true, `Product ${p.name} inStock should be true`);
    assert.ok(p.totalQuantity > 0, `Product ${p.name} totalQuantity should be > 0`);
  }
});

test('Max price filter limits results by minPrice', () => {
  const budgetResults = filterProducts({ maxPrice: 20 });
  assert.ok(budgetResults.length > 0, 'Should have budget items under AED 20');
  for (const p of budgetResults) {
    if (p.minPrice !== null) {
      assert.ok(p.minPrice <= 20, `Product ${p.name} minPrice (${p.minPrice}) exceeds 20`);
    }
  }
});

test('Sorting algorithms correctly reorder products', () => {
  // Price asc
  const priceAsc = filterProducts({ sortBy: 'price-asc' });
  for (let i = 1; i < priceAsc.length; i++) {
    const prev = priceAsc[i - 1].minPrice || 0;
    const curr = priceAsc[i].minPrice || 0;
    assert.ok(prev <= curr, `Price asc failed: ${prev} > ${curr} at index ${i}`);
  }

  // Price desc
  const priceDesc = filterProducts({ sortBy: 'price-desc' });
  for (let i = 1; i < priceDesc.length; i++) {
    const prev = priceDesc[i - 1].maxPrice || 0;
    const curr = priceDesc[i].maxPrice || 0;
    assert.ok(prev >= curr, `Price desc failed: ${prev} < ${curr} at index ${i}`);
  }

  // Name asc
  const nameAsc = filterProducts({ sortBy: 'name-asc' });
  for (let i = 1; i < nameAsc.length; i++) {
    const prev = nameAsc[i - 1].name;
    const curr = nameAsc[i].name;
    assert.ok(prev.localeCompare(curr) <= 0, `Name asc failed: "${prev}" after "${curr}"`);
  }

  // Stock desc
  const stockDesc = filterProducts({ sortBy: 'stock-desc' });
  for (let i = 1; i < stockDesc.length; i++) {
    const prev = stockDesc[i - 1].totalQuantity;
    const curr = stockDesc[i].totalQuantity;
    assert.ok(prev >= curr, `Stock desc failed: ${prev} < ${curr} at index ${i}`);
  }
});
