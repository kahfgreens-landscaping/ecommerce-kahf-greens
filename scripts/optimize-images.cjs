/**
 * scripts/optimize-images.cjs
 * Resizes and optimizes all product images in public/images/products/
 * Reads source file into buffer first to avoid file lock on Windows.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

function walk(dir) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(f));
    else if (/\.(jpg|jpeg|png|webp)$/i.test(e.name) && !e.name.endsWith('.tmp')) files.push(f);
  });
  return files;
}

async function optimize() {
  const files = walk(PRODUCTS_DIR);
  console.log(`Optimizing ${files.length} images...`);

  let count = 0;
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const stat = fs.statSync(file);
    beforeTotal += stat.size;

    try {
      const inputBuffer = fs.readFileSync(file);
      const pipeline = sharp(inputBuffer).resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true });

      let outputBuffer;
      if (ext === '.png') {
        outputBuffer = await pipeline.png({ quality: 80, compressionLevel: 8 }).toBuffer();
      } else if (ext === '.webp') {
        outputBuffer = await pipeline.webp({ quality: 80 }).toBuffer();
      } else {
        outputBuffer = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      }

      fs.writeFileSync(file, outputBuffer);
      afterTotal += outputBuffer.length;
      count++;
      if (count % 100 === 0 || count === files.length) {
        console.log(`Processed ${count}/${files.length} files...`);
      }
    } catch (err) {
      afterTotal += stat.size;
      console.warn(`Skipped ${path.basename(file)}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Optimization Complete!`);
  console.log(`Before: ${(beforeTotal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`After:  ${(afterTotal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Savings: ${((1 - afterTotal / beforeTotal) * 100).toFixed(1)}%`);
}

optimize().catch(console.error);
