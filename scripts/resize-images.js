#!/usr/bin/env node
/**
 * Generate responsive image variants for all product images.
 * Outputs -sm.webp (400px) and -md.webp (800px) alongside originals.
 * Run: node scripts/resize-images.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_DIR = path.join(__dirname, '../public/img/products');
const SIZES = [
  { suffix: '-sm', width: 400 },
  { suffix: '-md', width: 800 },
];
const EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg']);

async function processImage(srcPath, basename) {
  for (const { suffix, width } of SIZES) {
    const outName = basename.replace(/\.[^.]+$/, '') + suffix + '.webp';
    const outPath = path.join(SRC_DIR, outName);
    if (fs.existsSync(outPath)) continue; // skip if already generated
    await sharp(srcPath)
      .resize(width, width, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
    console.log(`  ✓ ${outName}`);
  }
}

async function main() {
  const files = fs.readdirSync(SRC_DIR).filter(f => {
    // skip already-generated variants
    if (f.includes('-sm.') || f.includes('-md.')) return false;
    return EXTENSIONS.has(path.extname(f).toLowerCase());
  });

  console.log(`Processing ${files.length} source images...`);
  let done = 0;
  for (const f of files) {
    await processImage(path.join(SRC_DIR, f), f);
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${files.length}`);
  }
  console.log(`Done. Generated ${files.length * 2} variants.`);
}

main().catch(err => { console.error(err); process.exit(1); });
