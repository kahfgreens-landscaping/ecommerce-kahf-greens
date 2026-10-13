/**
 * scripts/generate-image-map.cjs
 * Auto-generates imageMap.js by scanning public/images/products/
 * Applies curated & visual scoring logic to select the most suitable main photo for every product.
 */
const fs   = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const OUT_FILE     = path.join(__dirname, '..', 'src', 'data', 'imageMap.js');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// Curated best-view main photos (lifestyle, pot with plant, clean full catalog renders)
const CURATED_MAIN_PHOTOS = {
  'idel-dante': 'idel-dante__lifestyle__01.png',
  'idel-classic-matte-round': 'idel-classic-matte-round__yellow__02.png',
  'idel-classic-matte-square': 'idel-classic-matte-square__anthracite__01.jpg',
  'idel-classic-windowbox-sws-50cm': 'idel-classic-windowbox-sws-50cm__white__01.jpg',
  'idel-cilindro-liscio': 'idel-cilindro-liscio__brown__01.png',
  'idel-ducale': 'idel-ducale__lifestyle-ash-sky-blue__01.png',
  'idel-etrusco': 'idel-etrusco__anthracite__01.png',
  'idel-grow-with-italia': 'idel-grow-with-italia__lifestyle-lilac__01.png',
  'idel-hang-etrusco': 'idel-hang-etrusco__gray__01.png',
  'idel-high-square-living': 'idel-high-square-living__gray__01.png',
  'idel-high-square-living-sws': 'idel-high-square-living-sws__pink__01.png',
  'idel-hydrus': 'idel-hydrus__brown__01.png',
  'idel-italia': 'idel-italia__lifestyle-nova-carbon__01.png',
  'idel-jenny': 'idel-jenny__anthracite__01.jpg',
  'idel-kit-campana': 'idel-kit-campana__gray__01.png',
  'idel-kit-elba': 'idel-kit-elba__yellow__01.png',
  'idel-kit-lipari': 'idel-kit-lipari__white__01.jpg',
  'idel-kit-tirreno': 'idel-kit-tirreno__gray__01.png',
  'idel-kit-versilia': 'idel-kit-versilia__white__01.png',
  'idel-liparis': 'idel-liparis__green__01.png',
  'idel-living-high-round-55': 'idel-living-high-round-55__anthracite__01.png',
  'idel-marinella': 'idel-marinella__lifestyle-nova-carbon__01.png',
  'idel-mosaic-curve-13': 'idel-mosaic-curve-13__white__01.jpg',
  'idel-mosaic-curve-40': 'idel-mosaic-curve-40__white__01.jpg',
  'idel-mosaic-curve-55': 'idel-mosaic-curve-55__black-gold__01.jpg',
  'idel-mosaic-curve-90': 'idel-mosaic-curve-90__anthracite__01.jpg',
  'idel-mosaic-flowerbox': 'idel-mosaic-flowerbox__gray__07.png',
  'idel-mosaic-quadro-17cm': 'idel-mosaic-quadro-17cm__ash-sky-blue__01.jpg',
  'idel-pback': 'idel-pback__green__01.png',
  'idel-round-living': 'idel-round-living__anthracite__01.jpg',
  'idel-smart-flowerbox': 'idel-smart-flowerbox__white__02.png',
  'idel-square-high-sws': 'idel-square-high-sws__gray__01.png',
  'idel-square-living': 'idel-square-living__white__01.jpg',
  'idel-twin-set-round-living': 'idel-twin-set-round-living__white__01.jpg',
  'idel-versilia': 'idel-versilia__white__01.png',
  'idel-volterra': 'idel-volterra__white__01.png',
  'teku-hanging-pot': 'teku-hanging-pot__terracotta__01.png',
  'coir-pot': 'coir-pot__green__01.png',
  'coir-hanging-basket': 'coir-hanging-basket__black-white__01.png',
  'coir-hanging-pot': 'coir-hanging-pot__accessory-black-white__01.png',
  'coir-wall-basket': 'coir-wall-basket__brown__04.png',
  'quadro-37': 'quadro-37__terracotta__01.png',
};

// Visual quality / suitability score
function scoreFile(f) {
  let score = 0;
  const lower = f.toLowerCase();
  
  if (lower.includes('look') || lower.includes('ambient') || lower.includes('isola') || lower.includes('con_pianta') || lower.includes('with_plants')) score += 80;
  if (lower.includes('main') || lower.includes('intro') || lower.includes('slide')) score += 70;
  if (/^[a-z0-9\-]+-[12]\.png$/i.test(f) || /^[a-z0-9\-]+-solid/i.test(f)) score += 60;
  if (lower.endsWith('_1.jpg') || lower.endsWith('_1.png') || lower.endsWith('_1.jpeg')) score += 50;
  if (lower.includes('white_1') || lower.includes('anthracite_1') || lower.includes('gold_1')) score += 40;
  
  // Demote technical and accessories
  if (lower.includes('dettaglio') || lower.includes('indicator') || lower.includes('water_level') || lower.includes('sizes')) score -= 100;
  if (lower.includes('set_of_2') || lower.includes('divider')) score -= 20;
  if (lower.endsWith('_2.jpg') || lower.endsWith('_3.jpg') || lower.endsWith('_4.jpg')) score -= 15;
  if (/^\d+\.png$/i.test(f) || /^\d+\.jpg$/i.test(f)) score -= 10;
  
  return score;
}

function scanFolder(dir, urlBase, folderName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = entries
    .filter(e => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
    .map(e => e.name);

  if (files.length === 0) return [];

  // Sort files by suitability so the most suitable main photo is FIRST
  const curated = CURATED_MAIN_PHOTOS[folderName];
  files.sort((a, b) => {
    if (a === curated) return -1;
    if (b === curated) return 1;
    return scoreFile(b) - scoreFile(a);
  });

  return files.map(f => `${urlBase}/${f}`);
}

const map = {};
if (fs.existsSync(PRODUCTS_DIR)) {
  const folders = fs.readdirSync(PRODUCTS_DIR, { withFileTypes: true }).filter(e => e.isDirectory());
  folders.forEach(folder => {
    const folderPath = path.join(PRODUCTS_DIR, folder.name);
    const urlBase    = `/images/products/${folder.name}`;
    const images     = scanFolder(folderPath, urlBase, folder.name);
    if (images.length > 0) map[folder.name] = images;
  });
}

// Custom aliases for Pottery Pots individual items & special slugs
const ppImages = map['pottery-pots'] || [];
const bethGold = ppImages.filter(i => i.includes('__beth-gold__'));
const bethSilver = ppImages.filter(i => i.includes('__beth-silver__'));
const blockGold = ppImages.filter(i => i.includes('__block-gold__'));
const blockSilver = ppImages.filter(i => i.includes('__block-silver__'));
const orbBlack = ppImages.filter(i => i.includes('__orb-black__'));
const orbChoc = ppImages.filter(i => i.includes('__orb-chocolate__'));
const sunnyGold = ppImages.filter(i => i.includes('__sunny-gold__'));
const sunnyRose = ppImages.filter(i => i.includes('__sunny-rose__'));
const yangGold = ppImages.filter(i => i.includes('__yang-gold__'));
const yangSilver = ppImages.filter(i => i.includes('__yang-silver__'));

if (ppImages.length > 0) {
  map['pp-beth'] = [...bethGold, ...bethSilver, ...ppImages];
  map['pp-block'] = [...blockGold, ...blockSilver, ...ppImages];
  map['pp-orb'] = [...orbBlack, ...orbChoc, ...ppImages];
  map['pp-sunny'] = [...sunnyGold, ...sunnyRose, ...ppImages];
  map['pp-yang'] = [...yangGold, ...yangSilver, ...ppImages];
}

// Direct aliases for grouped catalog IDs
if (map['idel-dante']) map['idel-dante'] = map['idel-dante'];
if (map['idel-classic-windowbox-sws-50cm']) map['idel-classic-windowbox-sws'] = map['idel-classic-windowbox-sws-50cm'];
if (map['idel-pback']) map['idel-cl-matte-pback-box-sws'] = map['idel-pback'];
if (map['idel-square-high-sws']) map['idel-classic-square-high-sws'] = map['idel-square-high-sws'];
if (map['idel-high-square-living-sws']) map['idel-hs-living-sws'] = map['idel-high-square-living-sws'];
if (map['idel-living-high-round-55']) map['idel-living-high-round-inner'] = map['idel-living-high-round-55'];
if (map['idel-liparis']) map['idel-lipari-s'] = map['idel-liparis'];
if (map['idel-twin-set-round-living']) map['idel-twin-set-classic-pot'] = map['idel-twin-set-round-living'];
if (map['idel-mosaic-curve-90']) map['idel-mosaic-curve-high'] = map['idel-mosaic-curve-90'];
if (map['quadro-37']) {
  map['idel-quadro-lt20'] = map['quadro-37'];
  map['idel-quadro-saucer'] = map['quadro-37'];
}
if (map['idel-versilia']) {
  map['pb-cassetta-luna'] = map['idel-versilia'];
  map['pb-maxiflowerbox-saucer-wheel'] = map['idel-versilia'];
}

const lines = [
  '// AUTO-GENERATED by scripts/generate-image-map.cjs — do not edit manually',
  '// Run: node scripts/generate-image-map.cjs',
  '',
  "import { resolveProductImageForColor } from './colorImageResolver.js';",
  '',
  'const BASE = \'/images/products\';',
  '',
  'export const productImageMap = {',
  ...Object.entries(map).map(([slug, imgs]) => {
    const imgLines = imgs.map(img => `    '${img}',`).join('\n');
    return `  '${slug}': [\n${imgLines}\n  ],`;
  }),
  '};',
  '',
  '/** Get all images for a product slug */',
  'export function getProductImages(slug) {',
  '  if (!slug) return [\'/images/placeholder-pot.jpg\'];',
  '  const clean = String(slug).toLowerCase().trim();',
  '  if (productImageMap[clean] && productImageMap[clean].length > 0) return productImageMap[clean];',
  '  const key = Object.keys(productImageMap).find(k => clean.includes(k) || k.includes(clean));',
  '  if (key && productImageMap[key].length > 0) return productImageMap[key];',
  '  return [\'/images/placeholder-pot.jpg\'];',
  '}',
  '',
  '/** Get images for a catalog product, preferring its exact category folder. */',
  'export function getProductImagesForProduct(product) {',
  '  if (!product) return [\'/images/placeholder-pot.jpg\'];',
  '  const candidates = [product.categorySlug, product.slug, product.id]',
  '    .filter(Boolean)',
  '    .map(value => String(value).toLowerCase().trim());',
  '  const key = candidates.find(candidate => productImageMap[candidate]?.length > 0);',
  '  return key ? productImageMap[key] : getProductImages(product.slug || product.id);',
  '}',
  '',
  '/** Get primary (first/main suitable) image */',
  'export function getProductImage(slug) {',
  '  return getProductImages(slug)[0];',
  '}',
  '',
  '/** Get the primary image for a catalog product. */',
  'export function getProductImageForProduct(product) {',
  '  return getProductImagesForProduct(product)[0] || \'/images/placeholder-pot.jpg\';',
  '}',
  '',
  '/** Get image matching a specific color for a product */',
  'export function getProductImageForColor(slug, color) {',
  '  if (!slug) return \'/images/placeholder-pot.jpg\';',
  '  return resolveProductImageForColor(getProductImages(slug), color);',
  '}',
  '',
  '/** Get the image for a selected color using the catalog product\'s exact image folder. */',
  'export function getProductImageForProductColor(product, color) {',
  '  return resolveProductImageForColor(getProductImagesForProduct(product), color);',
  '}',
];

fs.writeFileSync(OUT_FILE, lines.join('\n'));
console.log(`✅ imageMap.js generated with ${Object.keys(map).length} product keys.`);
