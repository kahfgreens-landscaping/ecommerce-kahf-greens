import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const catalogPath = join(__dirname, '../src/data/catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

// Dynamic import of imageMap module
const {
  productImageMap,
  getProductImages,
  getProductImage,
  getProductImageForProduct,
  getProductImagesForProduct,
  getProductImageForProductColor,
} = await import('../src/data/imageMap.js');

test('Fallback placeholder image exists on disk', () => {
  const placeholderPath = join(publicDir, 'images/placeholder-pot.jpg');
  assert.ok(existsSync(placeholderPath), 'public/images/placeholder-pot.jpg must physically exist on disk');
  const stats = readFileSync(placeholderPath);
  assert.ok(stats.length > 1000, 'Placeholder image must be non-empty file');
});

test('All mapped images in productImageMap physically exist on disk', () => {
  const missing = [];
  let checkedCount = 0;

  for (const [key, paths] of Object.entries(productImageMap)) {
    for (const p of paths) {
      checkedCount++;
      const fullPath = join(publicDir, p.replace(/^\//, ''));
      if (!existsSync(fullPath)) {
        missing.push({ key, path: p });
      }
    }
  }

  assert.ok(checkedCount > 1000, `Expected > 1000 checked images, found ${checkedCount}`);
  assert.equal(missing.length, 0, `Found ${missing.length} missing files on disk: ${JSON.stringify(missing.slice(0, 5))}`);
});

test('Every product in catalog resolves to an existing primary image (no placeholder fallback)', () => {
  for (const product of catalog.products) {
    const primaryImg = getProductImageForProduct(product);
    assert.ok(primaryImg, `Product ${product.id} returned null/empty primary image`);
    assert.notEqual(
      primaryImg,
      '/images/placeholder-pot.jpg',
      `Product ${product.id} (${product.name}) fell back to placeholder image`
    );

    const fullPath = join(publicDir, primaryImg.replace(/^\//, ''));
    assert.ok(existsSync(fullPath), `Primary image for ${product.id} does not exist on disk: ${primaryImg}`);
  }
});

test('Every product variant color resolves to an existing image on disk', () => {
  for (const product of catalog.products) {
    for (const color of product.colors) {
      const colorImg = getProductImageForProductColor(product, color);
      assert.ok(colorImg, `Product ${product.id} color ${color} returned empty image`);
      const fullPath = join(publicDir, colorImg.replace(/^\//, ''));
      assert.ok(
        existsSync(fullPath),
        `Color image for ${product.id} [${color}] does not exist on disk: ${colorImg}`
      );
    }
  }
});

test('Pottery Pots models do NOT leak Beth images to other models', () => {
  const ppModels = [
    { slug: 'pp-block', forbidden: ['beth', 'sunny', 'orb', 'yang', 'puk', 'ethan'] },
    { slug: 'pp-sunny', forbidden: ['beth', 'block', 'orb', 'yang', 'puk', 'ethan'] },
    { slug: 'pp-orb', forbidden: ['beth', 'block', 'sunny', 'yang', 'puk', 'ethan'] },
    { slug: 'pp-yang', forbidden: ['beth', 'block', 'sunny', 'orb', 'puk', 'ethan'] },
    { slug: 'pp-puk', forbidden: ['beth', 'block', 'sunny', 'orb', 'yang', 'ethan'] },
    { slug: 'pp-ethan', forbidden: ['beth', 'block', 'sunny', 'orb', 'yang', 'puk'] },
  ];

  for (const { slug, forbidden } of ppModels) {
    const product = catalog.products.find(p => p.slug === slug || p.id === slug);
    if (!product) continue;

    const images = getProductImagesForProduct(product);
    assert.ok(images.length > 0, `Product ${slug} must have images`);

    for (const img of images) {
      const lower = img.toLowerCase();
      for (const f of forbidden) {
        assert.ok(
          !lower.includes(`__${f}`) && !lower.includes(`-${f}-`) && !lower.includes(`/${f}/`),
          `Image ${img} for product ${slug} leaks forbidden model "${f}"`
        );
      }
    }
  }
});

test('Idel Kit Lipari primary thumbnail is Orange', () => {
  const product = catalog.products.find(p => p.slug === 'idel-kit-lipari');
  assert.ok(product, 'Idel Kit Lipari must exist in catalog');
  const primaryImg = getProductImageForProduct(product);
  assert.ok(
    primaryImg.toLowerCase().includes('orange'),
    `Kit Lipari primary thumbnail should be orange, got: ${primaryImg}`
  );
});

test('Idel Bio Compost Tirreno Mini Saucer primary image is lifestyle 02', () => {
  const product = catalog.products.find(p => p.slug === 'idel-bio-compost-tirreno-mini-saucer-2-5l');
  assert.ok(product, 'Tirreno Mini Saucer must exist in catalog');
  const primaryImg = getProductImageForProduct(product);
  assert.equal(
    primaryImg,
    '/images/products/idel-bio-compost-tirreno-mini--saucer/idel-bio-compost-tirreno-mini--saucer__lifestyle__02.png',
    `Tirreno primary image should be lifestyle 02, got: ${primaryImg}`
  );
});

test('Bio Compost products do NOT leak Italia images to Lipari, Flowerbox, or Tirreno', () => {
  const compostSlugs = [
    'idel-bio-compost-lipari-s',
    'idel-bio-compost-living-flowerbox-s',
    'idel-bio-compost-tirreno-mini-saucer-2-5l',
  ];

  for (const slug of compostSlugs) {
    const product = catalog.products.find(p => p.slug === slug);
    assert.ok(product, `Compost product ${slug} must exist in catalog`);
    const images = getProductImagesForProduct(product);
    assert.ok(images.length > 0, `${slug} must have images`);

    for (const img of images) {
      assert.ok(
        !img.includes('idel-bio-compost-italia/'),
        `Compost product ${slug} leaks Italia image: ${img}`
      );
    }
  }
});

test('Desch Emma product resolves to dedicated terracotta image', () => {
  const product = catalog.products.find(p => p.slug === 'desch-emma');
  assert.ok(product, 'Desch Emma must exist in catalog');
  const primaryImg = getProductImageForProduct(product);
  assert.equal(
    primaryImg,
    '/images/products/desch-emma/desch-emma__terracotta__01.jpg',
    `Desch Emma primary image mismatch: ${primaryImg}`
  );
});

test('Mosaic Curve 13, 40, 55, and 90 resolve to their dedicated folders', () => {
  const m13 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-13');
  const m40 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-40');
  const m55 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-55');
  const m90 = catalog.products.find(p => p.slug === 'idel-mosaic-curve-90');

  assert.ok(getProductImageForProduct(m13).includes('idel-mosaic-curve-13/'));
  assert.ok(getProductImageForProduct(m40).includes('idel-mosaic-curve-40/'));
  assert.ok(getProductImageForProduct(m55).includes('idel-mosaic-curve-55/'));
  assert.ok(getProductImageForProduct(m90).includes('idel-mosaic-curve-90/'));
});
