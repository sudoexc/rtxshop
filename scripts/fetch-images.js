/**
 * fetch-images.js
 * Fetches multiple images for each product from Shopify APIs
 * and updates data/catalog.json with images[] arrays.
 * Run: node scripts/fetch-images.js
 */

const fs   = require('fs');
const path = require('path');

const CATALOG_FILE = path.join(__dirname, '../data/catalog.json');

// Map catalog ID → { store, handle }
const PRODUCT_MAP = {
  // ── GravaStar ──
  'gs-v60':        { store: 'https://www.gravastar.com', handle: 'mercury-v60-crystal-rose' },
  'gs-v60pro':     { store: 'https://www.gravastar.com', handle: 'mercury-v60-pro' },
  'gs-m2':         { store: 'https://www.gravastar.com', handle: 'mercury-m2-opaline-white' },
  'gs-m1pro':      { store: 'https://www.gravastar.com', handle: 'mercury-m1-pro-gradient-black' },
  'gs-v75lite':    { store: 'https://www.gravastar.com', handle: 'mercury-v75-lite-transparent-black' },
  'gs-v75':        { store: 'https://www.gravastar.com', handle: 'mercury-v75-75-hall-effect-magnetic-switch-gaming-keyboard' },
  'gs-v75pro':     { store: 'https://www.gravastar.com', handle: 'mercury-v75-pro-cyberpunk' },
  'gs-k1lite':     { store: 'https://www.gravastar.com', handle: 'mercury-k1-lite-transparent-black' },
  'gs-k1':         { store: 'https://www.gravastar.com', handle: 'mercury-k1-stealth-black' },
  'gs-k1pro':      { store: 'https://www.gravastar.com', handle: 'mercury-k1-pro-silver' },
  'gs-x':          { store: 'https://www.gravastar.com', handle: 'mercury-x-wireless-gaming-mouse' },
  // ── ATK ──
  'atk-ag9air':    { store: 'https://www.atk.store', handle: 'atk-dragonfly-a9-series-lightweight-wireless-mouse' },
  'atk-ag9plus':   { store: 'https://www.atk.store', handle: 'atk-dragonfly-a9-pro-max-lightweight-wireless-mouse' },
  'atk-ag9ult':    { store: 'https://www.atk.store', handle: 'atk-dragonfly-a9-ultimate-lightweight-wireless-mouse' },
  'atk-ghost':     { store: 'https://www.atk.store', handle: 'atk-blazing-sky-ghost-hollow-carbon-fiber-wireless-gaming-mouse' },
  'atk-z1ult':     { store: 'https://www.atk.store', handle: 'atk-blazing-sky-z1-v2-gaming-wireless-mouse' },
  'atk-zero':      { store: 'https://www.atk.store', handle: 'atk-blazing-sky-zero-ultralight-wireless-gaming-mouse' },
  'atk-ng9pro':    { store: 'https://www.atk.store', handle: 'atk-neptune-n9-esports-gaming-wireless-headset' },
};

async function fetchImages(store, handle, maxImages = 6) {
  try {
    const url = `${store}/products/${handle}.json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const imgs = data.product?.images || [];
    // Clean URLs (remove query params if v= is just cache-bust, keep them)
    return imgs.slice(0, maxImages).map(img => img.src);
  } catch (e) {
    console.log(`  ✗ ${handle}: ${e.message}`);
    return null;
  }
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
  const ids = Object.keys(PRODUCT_MAP);

  console.log(`\nFetching images for ${ids.length} products...\n`);

  for (const id of ids) {
    const { store, handle } = PRODUCT_MAP[id];
    const product = catalog.find(p => p.id === id);
    if (!product) { console.log(`  ⚠ ${id}: not found in catalog`); continue; }

    process.stdout.write(`  ${id} (${handle})... `);
    const imgs = await fetchImages(store, handle);
    if (imgs && imgs.length) {
      product.images = imgs;
      if (!product.image_url && imgs[0]) product.image_url = imgs[0];
      console.log(`✓ ${imgs.length} images`);
    } else {
      console.log(`○ kept existing`);
    }

    // Polite delay
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));
  console.log('\n✓ catalog.json updated\n');
}

main().catch(console.error);
