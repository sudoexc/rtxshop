/**
 * download-images.js
 * Downloads all product images to public/img/products/ and updates catalog.json
 * Run: node scripts/download-images.js
 */

const fs   = require('fs');
const path = require('path');

const CATALOG_FILE = path.join(__dirname, '../data/catalog.json');
const IMG_DIR      = path.join(__dirname, '../public/img/products');

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

async function download(url, dest) {
  if (fs.existsSync(dest)) return true; // already downloaded
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return true;
  } catch (e) {
    console.log(`    ✗ ${path.basename(dest)}: ${e.message}`);
    return false;
  }
}

function urlToFilename(productId, idx, url) {
  // Extract extension from URL (before query string)
  const noQuery = url.split('?')[0];
  const ext = path.extname(noQuery) || '.jpg';
  return `${productId}-${idx + 1}${ext}`;
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
  let totalDownloaded = 0;
  let totalSkipped = 0;

  for (const product of catalog) {
    const urls = product.images?.length
      ? product.images
      : product.image_url ? [product.image_url] : [];

    if (!urls.length) continue;

    // Skip local images (already downloaded)
    const externalUrls = urls.filter(u => u && u.startsWith('http'));
    if (!externalUrls.length) continue;

    console.log(`\n${product.id} (${externalUrls.length} images)`);

    const localImages = [];
    for (let i = 0; i < externalUrls.length; i++) {
      const url = externalUrls[i];
      const filename = urlToFilename(product.id, i, url);
      const dest = path.join(IMG_DIR, filename);
      const localPath = `/img/products/${filename}`;

      process.stdout.write(`  [${i+1}/${externalUrls.length}] ${filename}... `);
      const ok = await download(url, dest);
      if (ok) {
        console.log('✓');
        localImages.push(localPath);
        totalDownloaded++;
      } else {
        totalSkipped++;
      }
      await new Promise(r => setTimeout(r, 150));
    }

    // Update catalog with local paths
    if (localImages.length) {
      product.images = localImages;
      product.image_url = localImages[0];
    }
  }

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));
  console.log(`\n✓ Done: ${totalDownloaded} downloaded, ${totalSkipped} failed`);
  console.log(`  catalog.json updated with local paths`);
}

main().catch(console.error);
