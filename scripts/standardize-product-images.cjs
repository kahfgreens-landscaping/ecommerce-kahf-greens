const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'public', 'images', 'products');
const CATALOG_FILE = path.join(ROOT, 'src', 'data', 'catalog.json');
const IMAGE_MAP_GENERATOR = path.join(__dirname, 'generate-image-map.cjs');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const TRANSPARENT = new Set(['transparent']);
const APPLY = process.argv.includes('--apply');

function words(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function getVariantColors(products) {
  return [...new Set(products.flatMap(product => (product.variants || [])
    .map(variant => variant.color).filter(Boolean)))];
}

function colorsForFolder(folder, products, allColors) {
  const matchedProducts = products.filter(product => {
    const slugs = [product.slug, product.categorySlug].filter(Boolean);
    return slugs.some(slug => folder === slug || folder.startsWith(`${slug}-`) || slug.startsWith(`${folder}-`));
  });
  return matchedProducts.length ? getVariantColors(matchedProducts) : allColors;
}

function matchesColor(filename, color) {
  const actualWords = words(filename);
  const counts = new Map();
  actualWords.forEach(word => counts.set(word, (counts.get(word) || 0) + 1));
  const needed = new Map();

  String(color).split('/').forEach(group => {
    words(group).filter(word => !TRANSPARENT.has(word))
      .forEach(word => needed.set(word, (needed.get(word) || 0) + 1));
  });

  return needed.size > 0 && [...needed].every(([word, count]) => (counts.get(word) || 0) >= count);
}

function colorSlug(color) {
  return String(color).split('/').map(group => words(group).filter(word => !TRANSPARENT.has(word)).join('-'))
    .filter(Boolean).join('-') || 'transparent';
}

function filenameColors(filename, folderColors, colorPalette) {
  const matches = new Set([...folderColors, ...colorPalette]
    .filter(color => matchesColor(filename, color))
    .map(color => ({
      slug: colorSlug(color),
      words: words(color).filter(word => !TRANSPARENT.has(word)).length,
    }))
    .sort((a, b) => b.words - a.words)
    .filter((match, _, all) => match.words === all[0]?.words)
    .map(match => match.slug));
  if (matches.size > 1) return 'multi-color';
  if (matches.size === 1) return [...matches][0];

  const tokens = new Set(words(filename));
  const partialColors = new Set();
  [...folderColors, ...colorPalette].forEach(color => {
    String(color).split('/').forEach(group => {
      words(group).filter(word => !TRANSPARENT.has(word) && tokens.has(word))
        .forEach(word => partialColors.add(word));
    });
  });
  if (partialColors.size === 1) return [...partialColors][0];
  if (partialColors.size > 1 && /(collage|palette|all[-_ ]?colou?rs?|range)/i.test(filename)) return 'multi-color';
  return null;
}

function assetRole(filename) {
  const lower = filename.toLowerCase();
  if (/\blogo\b/.test(lower)) return 'logo';
  if (/(dimension|diagram|instruction|self.?watering|water.?level|water.?meter|indicator|manual|assembly|specification|technical|measurement)/i.test(lower)) return 'technical';
  if (/(collage|palette|all[-_ ]?colou?rs?|colour.?range)/i.test(lower)) return 'multi-color';
  if (/(with.?plants|ambient|lifestyle|garden.?scene|interior|in.?situ|pianta|lookbook)/i.test(lower)) return 'lifestyle';
  if (/(saucer|wheel|stand|support|chain|frame|hook|bracket|divider)/i.test(lower)) return 'accessory';
  return null;
}

async function detectDominantColor(filename) {
  const { data, info } = await sharp(filename).rotate().resize(96, 96, { fit: 'inside' })
    .flatten({ background: '#ffffff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const counts = new Map();
  const left = Math.floor(info.width * 0.15);
  const right = Math.ceil(info.width * 0.85);
  const top = Math.floor(info.height * 0.18);
  const bottom = Math.ceil(info.height * 0.9);

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      const offset = (y * info.width + x) * info.channels;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
      let label;

      if (saturation < 0.18) {
        if (brightness > 238) continue;
        label = brightness < 55 ? 'black' : 'gray';
      } else {
        const delta = max - min;
        let hue;
        if (max === red) hue = 60 * (((green - blue) / delta) % 6);
        else if (max === green) hue = 60 * ((blue - red) / delta + 2);
        else hue = 60 * ((red - green) / delta + 4);
        if (hue < 0) hue += 360;

        if (hue < 15 || hue >= 345) label = brightness < 125 ? 'brown' : 'red';
        else if (hue < 40) label = brightness < 155 ? 'brown' : 'orange';
        else if (hue < 70) label = 'yellow';
        else if (hue < 165) label = 'green';
        else if (hue < 205) label = 'cyan';
        else if (hue < 260) label = 'blue';
        else if (hue < 310) label = 'purple';
        else label = 'pink';
      }
      counts.set(label, (counts.get(label) || 0) + 1);
    }
  }

  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] || 'white';
}

async function getDescriptor(file, folderColors, colorPalette, folder) {
  const filename = path.basename(file, path.extname(file));
  const prefix = `${folder}__`;
  if (filename.startsWith(prefix)) {
    const separator = filename.lastIndexOf('__');
    const descriptor = filename.slice(prefix.length, separator);
    if (/^\d{2}$/.test(filename.slice(separator + 2)) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(descriptor)) {
      return descriptor;
    }
  }

  const color = filenameColors(filename, folderColors, colorPalette);
  const role = assetRole(filename);
  const subproduct = folder === 'pottery-pots'
    ? ['beth', 'block', 'orb', 'puk', 'sunny', 'yang', 'ethan'].find(name => words(filename).includes(name))
    : null;

  let descriptor;
  if (color === 'multi-color' || role === 'multi-color') descriptor = 'multi-color';
  else if (role === 'logo' || role === 'technical') descriptor = role;
  else if (role === 'lifestyle') descriptor = color ? `lifestyle-${color}` : 'lifestyle';
  else if (role === 'accessory') descriptor = color ? `accessory-${color}` : 'accessory';
  else descriptor = color || await detectDominantColor(file);

  return subproduct ? `${subproduct}-${descriptor}` : descriptor;
}

function listImageFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true })
    .filter(entry => entry.isFile() && IMAGE_EXTS.has(path.extname(entry.name).toLowerCase()))
    .map(entry => path.join(folder, entry.name));
}

async function createPlan(products) {
  const allColors = getVariantColors(products);
  const colorPalette = [...new Set([...allColors, ...Object.keys((await import('../src/lib/utils.js')).COLOR_HEX)])];
  const plan = [];

  for (const entry of fs.readdirSync(PRODUCTS_DIR, { withFileTypes: true }).filter(item => item.isDirectory())) {
    const folder = entry.name;
    const folderPath = path.join(PRODUCTS_DIR, folder);
    const files = listImageFiles(folderPath).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    const folderColors = colorsForFolder(folder, products, allColors);
    const entries = [];

    for (const file of files) {
      entries.push({ file, descriptor: await getDescriptor(file, folderColors, colorPalette, folder) });
    }

    const groups = new Map();
    entries.forEach(item => {
      if (!groups.has(item.descriptor)) groups.set(item.descriptor, []);
      groups.get(item.descriptor).push(item);
    });

    for (const [descriptor, items] of groups) {
      items.forEach((item, index) => {
        const extension = path.extname(item.file).toLowerCase();
        const basename = `${folder}__${descriptor}__${String(index + 1).padStart(2, '0')}${extension}`;
        plan.push({
          source: item.file,
          target: path.join(folderPath, basename),
          oldName: path.basename(item.file),
          newName: basename,
          folder,
          descriptor,
        });
      });
    }
  }

  const targets = new Set(plan.map(item => item.target.toLowerCase()));
  if (targets.size !== plan.length) throw new Error('The naming plan contains duplicate target paths.');
  return plan;
}

function updateTextReferences(plan) {
  const replacements = new Map(plan.map(item => [
    `/images/products/${item.folder}/${item.oldName}`,
    `/images/products/${item.folder}/${item.newName}`,
  ]));
  const sourceFiles = [];

  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (/\.(cjs|css|html|js|jsx|json|md|mjs|ts|tsx)$/i.test(entry.name)) sourceFiles.push(fullPath);
    }
  }
  for (const directory of ['src', 'scripts']) walk(path.join(ROOT, directory));
  for (const file of ['index.html', 'README.md']) {
    const fullPath = path.join(ROOT, file);
    if (fs.existsSync(fullPath)) sourceFiles.push(fullPath);
  }

  for (const file of sourceFiles) {
    if (path.resolve(file) === path.resolve(path.join(ROOT, 'src', 'data', 'imageMap.js'))) continue;
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    for (const [oldPath, newPath] of replacements) content = content.split(oldPath).join(newPath);

    if (path.resolve(file) === path.resolve(IMAGE_MAP_GENERATOR)) {
      for (const item of plan) {
        const oldEntry = `'${item.folder}': '${item.oldName}'`;
        const newEntry = `'${item.folder}': '${item.newName}'`;
        content = content.replace(oldEntry, newEntry);
      }
    }

    if (content !== original) fs.writeFileSync(file, content);
  }
}

function renameFiles(plan) {
  const uuid = `${process.pid}-${Date.now()}`;
  const moves = plan.filter(item => item.source !== item.target)
    .map((item, index) => ({ ...item, temp: `${item.source}.rename-${uuid}-${index}` }));

  for (const item of moves) {
    if (fs.existsSync(item.target) && !plan.some(source => source.source === item.target)) {
      throw new Error(`Refusing to overwrite existing file: ${item.target}`);
    }
  }

  const staged = [];
  try {
    for (const item of moves) {
      fs.renameSync(item.source, item.temp);
      staged.push(item);
    }
    for (const item of staged) fs.renameSync(item.temp, item.target);
  } catch (error) {
    for (const item of staged) {
      if (fs.existsSync(item.target)) fs.renameSync(item.target, item.temp);
    }
    for (const item of staged.reverse()) {
      if (fs.existsSync(item.temp)) fs.renameSync(item.temp, item.source);
    }
    throw error;
  }
}

async function main() {
  const products = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')).products;
  const plan = await createPlan(products);
  const changed = plan.filter(item => item.source !== item.target);
  const summary = new Map();
  plan.forEach(item => summary.set(item.descriptor, (summary.get(item.descriptor) || 0) + 1));

  console.log(`Planned product image renames: ${changed.length} of ${plan.length}`);
  console.log('Descriptor totals:');
  [...summary].sort((a, b) => a[0].localeCompare(b[0])).forEach(([label, count]) => console.log(`  ${label}: ${count}`));
  console.log('Sample names:');
  plan.slice(0, 30).forEach(item => console.log(`  ${item.oldName} -> ${item.newName}`));
  console.log('MOSAIC color samples:');
  plan.filter(item => item.folder.startsWith('idel-mosaic-') && /purple|white/i.test(item.oldName))
    .slice(0, 20)
    .forEach(item => console.log(`  ${item.folder}/${item.oldName} -> ${item.newName}`));

  if (!APPLY) {
    console.log('Dry run only. Pass --apply to rename files and regenerate the image map.');
    return;
  }

  renameFiles(plan);
  updateTextReferences(plan);
  const result = spawnSync(process.execPath, [IMAGE_MAP_GENERATOR], { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) throw new Error('Image-map regeneration failed after asset renames.');
  console.log(`Renamed ${changed.length} product image files and updated their references.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
