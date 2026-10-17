/**
 * scripts/compress-images.cjs
 * High-performance image compression for all images in public/images/
 * - Uses sharp to resize excessively large images to 1000x1000 max (retaining high retina sharpness)
 * - Compresses PNG with palette quantization & max compression
 * - Compresses JPEG with mozjpeg quality 80
 * - Compresses WebP with quality 80
 * - Only replaces files when compression yields smaller file size
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name) && !entry.name.endsWith('.tmp')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function compressAll() {
  const files = walk(IMAGES_DIR);
  console.log(`Found ${files.length} images in ${IMAGES_DIR}`);

  let totalBefore = 0;
  let totalAfter = 0;
  let compressedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = path.extname(file).toLowerCase();
    const stat = fs.statSync(file);
    const beforeSize = stat.size;
    totalBefore += beforeSize;

    try {
      const inputBuffer = fs.readFileSync(file);
      const pipeline = sharp(inputBuffer).resize({
        width: 1000,
        height: 1000,
        fit: 'inside',
        withoutEnlargement: true,
      });

      let outputBuffer;
      if (ext === '.png') {
        outputBuffer = await pipeline
          .png({ quality: 80, compressionLevel: 9, effort: 7, palette: true })
          .toBuffer();
      } else if (ext === '.webp') {
        outputBuffer = await pipeline
          .webp({ quality: 80, effort: 5 })
          .toBuffer();
      } else {
        // .jpg / .jpeg
        outputBuffer = await pipeline
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
      }

      if (outputBuffer.length < beforeSize) {
        fs.writeFileSync(file, outputBuffer);
        totalAfter += outputBuffer.length;
        compressedCount++;
      } else {
        totalAfter += beforeSize;
        skippedCount++;
      }
    } catch (err) {
      totalAfter += beforeSize;
      errorCount++;
      console.warn(`[WARN] Could not compress ${path.relative(IMAGES_DIR, file)}: ${err.message}`);
    }

    if ((i + 1) % 100 === 0 || i === files.length - 1) {
      const pct = (((i + 1) / files.length) * 100).toFixed(0);
      console.log(`[${pct}%] Processed ${i + 1}/${files.length} images...`);
    }
  }

  const savedBytes = totalBefore - totalAfter;
  const savedMb = (savedBytes / (1024 * 1024)).toFixed(2);
  const beforeMb = (totalBefore / (1024 * 1024)).toFixed(2);
  const afterMb = (totalAfter / (1024 * 1024)).toFixed(2);
  const percentSaved = ((savedBytes / totalBefore) * 100).toFixed(1);

  console.log('\n========================================');
  console.log('🎉 IMAGE COMPRESSION SUMMARY');
  console.log('========================================');
  console.log(`Total images processed: ${files.length}`);
  console.log(`Files compressed:       ${compressedCount}`);
  console.log(`Files already optimal:  ${skippedCount}`);
  console.log(`Errors:                 ${errorCount}`);
  console.log(`Before total size:      ${beforeMb} MB`);
  console.log(`After total size:       ${afterMb} MB`);
  console.log(`Net savings:            ${savedMb} MB (${percentSaved}%)`);
  console.log('========================================\n');
}

compressAll().catch(err => {
  console.error('Fatal error in image compression:', err);
  process.exit(1);
});
