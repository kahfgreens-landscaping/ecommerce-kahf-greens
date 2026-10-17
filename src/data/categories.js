/**
 * src/data/categories.js
 * Central taxonomy and filter rules for pot shapes and collections
 */

// 1. Mosaic Collection (strictly 6 Mosaic planters)
export const MOSAIC_IDS = new Set([
  'idel-mosaic-curve-13',
  'idel-mosaic-curve-40',
  'idel-mosaic-curve-55',
  'idel-mosaic-curve-90',
  'idel-mosaic-flowerbox',
  'idel-mosaic-quadro',
]);

// 2. Pottery Pots (strictly 5 Pottery Pots models)
export const POTTERY_POTS_IDS = new Set([
  'pp-beth',
  'pp-block',
  'pp-orb',
  'pp-sunny',
  'pp-yang',
]);

// 3. Round Pots (round cylinders, curves, bowls, and rounds from Idel, Desch, Pottery Pots)
// Includes Idel Marinella; excludes rectangular pots
export const ROUND_IDS = new Set([
  'desch-emma',
  'idel-bio-compost-italia-saucer-4-5l',
  'idel-bio-compost-lipari-s',
  'idel-cilindro-liscio',
  'idel-classic-matte-round',
  'idel-dante',
  'idel-etrusco',
  'idel-grow-with-italia',
  'idel-italia',
  'idel-jenny-3lt',
  'idel-kit-elba',
  'idel-lipari-s',
  'idel-living-high-round-inner',
  'idel-marinella',
  'idel-mosaic-curve-13',
  'idel-mosaic-curve-40',
  'idel-mosaic-curve-55',
  'idel-mosaic-curve-90',
  'idel-round-living',
  'idel-twin-set-classic-pot',
  'idel-twin-set-round-living',
  'pp-beth',
  'pp-orb',
  'pp-sunny',
]);

// 4. Rectangular Pots (flowerboxes, windowboxes, troughs, and rectangular planters)
// Includes: Idel Tirreno Mini, Idel Ducale, Idel Terme, Idel Volterra
export const RECTANGULAR_IDS = new Set([
  'idel-bio-compost-living-flowerbox-s',
  'idel-bio-compost-tirreno-mini-saucer-2-5l',
  'idel-classic-windowbox-sws',
  'idel-cl-matte-pback-box-sws',
  'idel-ducale-lt60',
  'idel-kit-versilia',
  'idel-mosaic-flowerbox',
  'idel-smart-flowerbox-w-sws',
  'idel-terme',
  'idel-versilia',
  'idel-volterra',
  'pb-cassetta-luna',
  'pb-maxiflowerbox-saucer-wheel',
]);

// 5. Balcony Pots (windowboxes, terrace flowerboxes, railing planters)
export const BALCONY_IDS = new Set([
  'idel-bio-compost-living-flowerbox-s',
  'idel-bio-compost-tirreno-mini-saucer-2-5l',
  'idel-classic-windowbox-sws',
  'idel-cl-matte-pback-box-sws',
  'idel-ducale-lt60',
  'idel-kit-versilia',
  'idel-mosaic-flowerbox',
  'idel-smart-flowerbox-w-sws',
  'idel-terme',
  'idel-versilia',
  'idel-volterra',
  'pb-cassetta-luna',
  'pb-maxiflowerbox-saucer-wheel',
]);

// 6. Square Pots (modern cubes, architectural quadros, and tall square columns)
// Includes: PP Yang and Idel Hydrus
export const SQUARE_IDS = new Set([
  'idel-classic-matte-square',
  'idel-classic-square-high-sws',
  'idel-high-square-living',
  'idel-hs-living-sws',
  'idel-hydrus',
  'idel-mosaic-quadro',
  'idel-quadro-lt20',
  'idel-quadro-saucer',
  'idel-square-living',
  'pp-block',
  'pp-yang',
]);

// 7. Hanging Pots (suspended planters with straps/hangers)
// Includes Idel Kit Lipari and Kit Elba
export const HANGING_IDS = new Set([
  'idel-kit-elba',
  'idel-kit-lipari',
]);

// 8. Pot Kits & Sets (complete coordinated sets with saucers and brackets)
// Includes Idel Hang Etrusco, Kit Elba, Kit Lipari, Kit Versilia, Twin Set Round Living
export const KITS_IDS = new Set([
  'idel-hang-etrusco-3-2l',
  'idel-kit-elba',
  'idel-kit-lipari',
  'idel-kit-versilia',
  'idel-twin-set-round-living',
]);

export const POT_CATEGORIES = [
  {
    slug: 'mosaic',
    label: 'Mosaic Collection',
    navLabel: 'Mosaic Collection',
    badge: 'Curated Collection',
    desc: 'Italian-crafted architectural planters with signature faceted geometric styling',
    filter: (p) => MOSAIC_IDS.has(p.id) || p.name.toLowerCase().includes('mosaic'),
  },
  {
    slug: 'pottery-pots',
    label: 'Pottery Pots',
    navLabel: 'Pottery Pots',
    badge: 'Luxury Designer',
    desc: 'Handfinished luxury planters featuring Dutch design and premium metallic finishes',
    filter: (p) => POTTERY_POTS_IDS.has(p.id) || p.category.toLowerCase().includes('pottery'),
  },
  {
    slug: 'round',
    label: 'Round Pots',
    navLabel: 'Round',
    badge: 'Shape Category',
    desc: 'Timeless cylindrical, tapered, and rounded planters from Idel, Desch, and Pottery Pots',
    filter: (p) => ROUND_IDS.has(p.id),
  },
  {
    slug: 'rectangular',
    label: 'Rectangular Pots',
    navLabel: 'Rectangular',
    badge: 'Shape Category',
    desc: 'Sleek rectangular flowerboxes, troughs, and windowbox planters ideal for borders & walls',
    filter: (p) => RECTANGULAR_IDS.has(p.id),
  },
  {
    slug: 'square',
    label: 'Square Pots',
    navLabel: 'Square',
    badge: 'Shape Category',
    desc: 'Modern cube, high square, and modular quadro planters designed for crisp architectural lines',
    filter: (p) => SQUARE_IDS.has(p.id),
  },
  {
    slug: 'balcony',
    label: 'Balcony Pots',
    navLabel: 'Balcony',
    badge: 'Shape Category',
    desc: 'Terrace flowerboxes, railing planters, and windowboxes suited for apartments & outdoor spaces',
    filter: (p) => BALCONY_IDS.has(p.id),
  },
  {
    slug: 'hanging',
    label: 'Hanging Pots',
    navLabel: 'Hanging',
    badge: 'Shape Category',
    desc: 'Suspended planters designed for balconies, pergolas, and vertical garden accents',
    filter: (p) => HANGING_IDS.has(p.id),
  },
  {
    slug: 'kits',
    label: 'Pot Kits & Sets',
    navLabel: 'Kits & Sets',
    badge: 'Coordinated Sets',
    desc: 'Complete all-in-one planter sets paired with saucers, hanging brackets, and matching companions',
    filter: (p) => KITS_IDS.has(p.id),
  },
];

export const FEATURED_TABS = [
  { id: 'mosaic', label: 'Mosaic', slug: 'mosaic', desc: 'Signature faceted geometric planters' },
  { id: 'rectangular', label: 'Rectangular', slug: 'rectangular', desc: 'Elongated flowerboxes & troughs' },
  { id: 'square', label: 'Square', slug: 'square', desc: 'Modern cubes & architectural quadros' },
  { id: 'balcony', label: 'Balcony', slug: 'balcony', desc: 'Railing planters & compact terrace boxes' },
];

export function getCategoryBySlug(slug) {
  if (!slug) return null;
  const s = String(slug).toLowerCase().trim();
  if (s === 'kit') return POT_CATEGORIES.find(c => c.slug === 'kits');
  if (s === 'idel') return POT_CATEGORIES.find(c => c.slug === 'mosaic');
  return POT_CATEGORIES.find(c => c.slug === s);
}
