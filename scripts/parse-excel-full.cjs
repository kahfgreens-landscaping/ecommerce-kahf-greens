/**
 * parse-excel-full.cjs
 * Full parse of ecommerce.xlsx → outputs structured product catalog JSON
 * Handles size options with both dimension + volume/capacity
 * (e.g. "Idel DANTE 0.7L" & "Idel DANTE 2.5L" unified or formatted with capacity)
 */
const XLSX = require('xlsx');
const fs   = require('fs');

const wb   = XLSX.readFile('C:\\Users\\sale2\\Downloads\\WEBSITE\\ecommerce.xlsx', { cellDates: true });
const ws   = wb.Sheets['Sheet1'];
const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

// ── helpers ──────────────────────────────────────────────────────────────────
const slug = (str) =>
  String(str).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sku = (category, name, size, color) =>
  [category, name, size, color]
    .map(s => String(s).trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
    .join('-');

// Detect volume/capacity in pot name: '0.7L', '2.5L', '4.5L', '15L', 'LT60', '3LT', '6L', '8.5L', 'LT14', etc.
function extractCapacity(pname) {
  const m = String(pname).match(/(\d+(?:\.\d+)?\s*(?:L|LT|ltr|litres?)|LT\s*\d+|MD\d+)/i);
  if (m) {
    let cap = m[0].toUpperCase();
    if (cap.startsWith('LT')) {
      cap = cap.replace('LT', '').trim() + 'L';
    } else if (cap.endsWith('LT')) {
      cap = cap.replace('LT', '').trim() + 'L';
    }
    return cap;
  }
  return null;
}

// Format size option label cleanly: e.g. "0.7L (10 cm)" or "2.5L (17 cm)" or "27 cm"
function formatSizeOption(size, unit, capacity) {
  const dim = size ? `${size} ${unit || 'cm'}`.trim() : '';
  if (capacity && dim) {
    return `${capacity} (${dim})`;
  } else if (capacity) {
    return capacity;
  }
  return dim;
}

// ── group rows by Category → Product ─────────────────────────────────────────
// Products like "Idel DANTE 0.7L" and "Idel DANTE 2.5L" are grouped under product "Idel DANTE"
// with size options: "0.7L (10 cm)" and "2.5L (17 cm)"
const categories = {};

rows.forEach((row, idx) => {
  const cat   = String(row['Main Category (Group)']).trim();
  let pname   = String(row['Pot Name']).trim();
  const rawSize = String(row['Size']).trim();
  const unit  = String(row['Size Unit']).trim();
  const color = String(row['Color']).trim();
  const qty   = Number(row['Quantity']) || 0;
  const price = row['Price'] !== '' ? Number(row['Price']) : null;
  const curr  = String(row['Currency']).trim() || 'AED';

  // Check if pot name has capacity embedded
  const capacity = extractCapacity(pname);

  // Group family name:
  // e.g. "Idel DANTE 0.7L" & "Idel DANTE 2.5L" -> Base name "Idel DANTE"
  let baseName = pname;
  if (/^Idel\s+DANTE\s+\d+(\.\d+)?L/i.test(pname)) {
    baseName = 'Idel DANTE';
  } else if (/^Idel\s+LIPARI\+S\s+\d+(\.\d+)?L/i.test(pname)) {
    baseName = 'Idel LIPARI+S';
  } else if (/^Idel\s+VOLTERRA\s+LT\d+/i.test(pname)) {
    baseName = 'Idel VOLTERRA';
  } else if (/^PB\s+MAXIFLOWERBOX.*MD\d+/i.test(pname)) {
    baseName = 'PB MAXIFLOWERBOX + SAUCER + WHEEL';
  } else if (/^Idel\s+ETRUSCO\s+\d+L/i.test(pname)) {
    baseName = 'Idel ETRUSCO';
  }

  const pId = slug(baseName);
  const sizeOptionLabel = formatSizeOption(rawSize, unit, capacity);

  if (!categories[cat]) categories[cat] = { name: cat, slug: slug(cat), products: {} };

  if (!categories[cat].products[baseName]) {
    categories[cat].products[baseName] = {
      id: pId,
      name: baseName,
      slug: pId,
      category: cat,
      categorySlug: slug(cat),
      variants: [],
    };
  }

  const variantSku = sku(cat, baseName, rawSize + (capacity || ''), color);
  categories[cat].products[baseName].variants.push({
    sku: variantSku,
    originalName: pname,
    size: rawSize,
    sizeUnit: unit,
    capacity: capacity,
    sizeLabel: sizeOptionLabel,
    color,
    quantity: qty,
    price,
    currency: curr,
    inStock: qty > 0,
    soldOut: qty === 0,
  });
});

// ── flatten to arrays ─────────────────────────────────────────────────────────
const catalog = {
  categories: Object.values(categories).map(c => ({
    name: c.name,
    slug: c.slug,
    productCount: Object.keys(c.products).length,
  })),
  products: [],
};

Object.values(categories).forEach(cat => {
  Object.values(cat.products).forEach(p => {
    const prices = p.variants.filter(v => v.price !== null).map(v => v.price);
    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;
    const totalQty = p.variants.reduce((s, v) => s + v.quantity, 0);
    const colors   = [...new Set(p.variants.map(v => v.color))].filter(Boolean);
    const sizes    = [...new Set(p.variants.map(v => v.sizeLabel))].filter(Boolean);

    catalog.products.push({
      ...p,
      minPrice,
      maxPrice,
      totalQuantity: totalQty,
      inStock: totalQty > 0,
      colors,
      sizes,
    });
  });
});

// ── write output ──────────────────────────────────────────────────────────────
const outPath = 'src/data/catalog.json';
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));

console.log(`✅ Wrote ${outPath}`);
console.log(`   Categories : ${catalog.categories.length}`);
console.log(`   Products   : ${catalog.products.length}`);
console.log(`   Total variants: ${catalog.products.reduce((s, p) => s + p.variants.length, 0)}`);

// Show sample of grouped products with sizes
const danteProd = catalog.products.find(p => p.name === 'Idel DANTE');
if (danteProd) {
  console.log('\n🔎 DANTE SIZES:', danteProd.sizes);
  console.log('   DANTE VARIANTS COUNT:', danteProd.variants.length);
}
const voltProd = catalog.products.find(p => p.name === 'Idel VOLTERRA');
if (voltProd) {
  console.log('🔎 VOLTERRA SIZES:', voltProd.sizes);
}
