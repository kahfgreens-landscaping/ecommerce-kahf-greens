/**
 * src/data/categories.js
 * Central taxonomy and filter rules for pot shapes and collections
 */

export const POT_CATEGORIES = [
  {
    slug: 'mosaic',
    label: 'Mosaic Collection',
    navLabel: 'Mosaic Collection',
    badge: 'Curated Collection',
    desc: 'Italian-crafted architectural planters with signature faceted geometric styling',
    filter: (p) => {
      const n = p.name.toLowerCase();
      const c = p.category.toLowerCase();
      return n.includes('mosaic') || c.includes('mosaic');
    },
  },
  {
    slug: 'pottery-pots',
    label: 'Pottery Pots',
    navLabel: 'Pottery Pots',
    badge: 'Luxury Designer',
    desc: 'Handfinished luxury planters featuring Dutch design and premium metallic finishes',
    filter: (p) => p.category.toLowerCase().includes('pottery'),
  },
  {
    slug: 'round',
    label: 'Round Pots',
    navLabel: 'Round',
    badge: 'Shape Category',
    desc: 'Timeless cylindrical, tapered, and rounded planters from Idel, Desch, and Pottery Pots',
    filter: (p) => {
      const n = p.name.toLowerCase();
      const id = p.id.toLowerCase();
      return (
        n.includes('round') ||
        n.includes('curve') ||
        n.includes('cilindro') ||
        n.includes('etrusco') ||
        n.includes('volterra') ||
        n.includes('terme') ||
        n.includes('ducale') ||
        n.includes('dante') ||
        n.includes('italia') ||
        n.includes('jenny') ||
        n.includes('emma') ||
        n.includes('tirreno') ||
        n.includes('lipari') ||
        id.includes('hang-etrusco') ||
        id.includes('hydrus') ||
        id.includes('elba') ||
        id.includes('orb') ||
        id.includes('sunny') ||
        id.includes('yang') ||
        id.includes('beth')
      );
    },
  },
  {
    slug: 'rectangular',
    label: 'Rectangular Pots',
    navLabel: 'Rectangular',
    badge: 'Shape Category',
    desc: 'Sleek rectangular flowerboxes, troughs, and windowbox planters ideal for borders & walls',
    filter: (p) => {
      const n = p.name.toLowerCase();
      return (
        n.includes('flowerbox') ||
        n.includes('windowbox') ||
        n.includes('cassetta') ||
        n.includes('versilia') ||
        n.includes('marinella') ||
        n.includes('pback')
      );
    },
  },
  {
    slug: 'square',
    label: 'Square Pots',
    navLabel: 'Square',
    badge: 'Shape Category',
    desc: 'Modern cube, high square, and modular quadro planters designed for crisp architectural lines',
    filter: (p) => {
      const n = p.name.toLowerCase();
      return n.includes('square') || n.includes('quadro') || n.includes('block');
    },
  },
  {
    slug: 'balcony',
    label: 'Balcony Pots',
    navLabel: 'Balcony',
    badge: 'Shape Category',
    desc: 'Terrace flowerboxes, railing planters, and windowboxes suited for apartments & outdoor spaces',
    filter: (p) => {
      const n = p.name.toLowerCase();
      return (
        n.includes('flowerbox') ||
        n.includes('windowbox') ||
        n.includes('cassetta') ||
        n.includes('marinella') ||
        n.includes('versilia') ||
        n.includes('pback')
      );
    },
  },
  {
    slug: 'hanging',
    label: 'Hanging Pots',
    navLabel: 'Hanging',
    badge: 'Shape Category',
    desc: 'Elevated hanging planters with built-in drainage and water reservoir systems',
    filter: (p) => {
      const n = p.name.toLowerCase();
      return n.includes('hang') || n.includes('hydrus');
    },
  },
  {
    slug: 'kits',
    label: 'Pot Kits & Sets',
    navLabel: 'Kits & Sets',
    badge: 'Coordinated Sets',
    desc: 'Complete all-in-one planter sets paired with saucers, brackets, and matching companions',
    filter: (p) => {
      const n = p.name.toLowerCase();
      return n.includes('kit') || n.includes('twin set');
    },
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
