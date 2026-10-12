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
  'idel-dante': 'Pots_with_Plants_1.png',
  'idel-classic-matte-round': 'Matte-Round-2.png',
  'idel-classic-matte-square': 'IDeL_Classic_Matte_Square_28cm_Plant_Pot_Anthracite_1.jpg',
  'idel-classic-windowbox-sws-50cm': 'IDeL_Classic_Windowbox_50cm_Plant_Pot_White_1.jpg',
  'idel-cilindro-liscio': 'Cilindro-Liscio-1.png',
  'idel-ducale': 'Pots_with_Plants_-Ash_Sky_Blue.png',
  'idel-etrusco': 'IDeL_Etrusco_24cm_4L_Plant_Pot_Anthracite_1.png',
  'idel-grow-with-italia': 'Pots_with_Plants-Lilac.png',
  'idel-hang-etrusco': 'Hang-Etrusco-2.png',
  'idel-high-square-living': 'High-Square-Living-2.png',
  'idel-high-square-living-sws': 'High-Square-Living-SWS-2.png',
  'idel-hydrus': 'Hydrus-2.png',
  'idel-italia': 'Pots_with_Plants-Nova_Carbon.png',
  'idel-jenny': 'IDeL_Jenny_22cm_3L_Plant_Pot_Anthracite_1.jpg',
  'idel-kit-campana': 'Kit-Campana-2.png',
  'idel-kit-elba': 'Elba-1.png',
  'idel-kit-lipari': 'IDeL_Kit_Lipari_21.5_3L_Hanging_Plant_Pot_White_1.jpg',
  'idel-kit-tirreno': 'Kit-Tirreno-1.png',
  'idel-kit-versilia': 'IDeL_Kit_Versilia_40cm_Hanging_Plant_Pot_White_1.png',
  'idel-liparis': 'Lipari-1.png',
  'idel-living-high-round-55': 'IDeL_Living_High_Round_55cm_Plant_Pot_Anthracite_1.png',
  'idel-marinella': 'Pots_with_Plants-Nova_Carbon.png',
  'idel-mosaic-curve-13': 'IDeL_Mosaic_Curve_High_13cm_Plant_Pot_White_1.jpg',
  'idel-mosaic-curve-40': 'IDeL_Mosaic_Curve_High_40cm_Plant_Pot_White_1.jpg',
  'idel-mosaic-curve-55': 'IDeL_Mosaic_Curve_55cm_Black-Gold_1.jpg',
  'idel-mosaic-curve-90': 'IDeL_Mosaic_Curve_High_90cm_Plant_Pot_Anthracite_1.jpg',
  'idel-mosaic-flowerbox': 'Flowerbox40-2.png',
  'idel-mosaic-quadro-17cm': 'IDeL_Mosaic_Quadro_17cm_Plant_Pot_Ash_Sky_Blue_1.jpg',
  'idel-pback': 'cassette-PBack-new.png',
  'idel-round-living': 'IDeL_Round_Living_16cm_2L_Plant_Pot_Anthracite_1.jpg',
  'idel-smart-flowerbox': 'IDeL_Smart_Flowerbox_85cm_Plant_Pot_White_1.png',
  'idel-square-high-sws': 'Classic-high-square-SWS-2.png',
  'idel-square-living': 'IDeL_Square_Living_18cm_Plant_Pot_White_1.jpg',
  'idel-twin-set-round-living': 'IDeL_Twin_Classic_14cm_1.7L_Plant_Pot_White_1.jpg',
  'idel-versilia': 'IDeL_Versilia_60cm_Plant_Pot_White_1.png',
  'idel-volterra': 'IDeL_Volterra_45cm_Plant_Pot_White_1.png',
  'teku-hanging-pot': 'Terracotta_-_Set_of_3_-_MAIN.png',
  'coir-pot': '1-Main_Image.png',
  'coir-hanging-basket': 'Coir_Hanging_Basket_25cm_Half_Sphere_Black_and_White_Metal_1.png',
  'coir-hanging-pot': 'Coir_Orchid_Hanging_15cm_Black_Frame_and_White_Chain_1.png',
  'coir-wall-basket': '2set-1.png',
  'quadro-37': 'Quadro_37_Terracotta.png',
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
const bethGold = ppImages.filter(i => i.includes('BETH_Gold'));
const bethSilver = ppImages.filter(i => i.includes('BETH_Silver'));
const blockGold = ppImages.filter(i => i.includes('BLOCK_Gold'));
const blockSilver = ppImages.filter(i => i.includes('BLOCK_Silver'));
const orbBlack = ppImages.filter(i => i.includes('ORB_Black'));
const orbChoc = ppImages.filter(i => i.includes('ORB_Chocolate'));
const sunnyGold = ppImages.filter(i => i.includes('SUNNY_Gold'));
const sunnyRose = ppImages.filter(i => i.includes('SUNNY_Rose'));
const yangGold = ppImages.filter(i => i.includes('YANG_Gold'));
const yangSilver = ppImages.filter(i => i.includes('YANG_Silver'));

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
  '/** Get primary (first/main suitable) image */',
  'export function getProductImage(slug) {',
  '  return getProductImages(slug)[0];',
  '}',
];

fs.writeFileSync(OUT_FILE, lines.join('\n'));
console.log(`✅ imageMap.js generated with ${Object.keys(map).length} product keys.`);
