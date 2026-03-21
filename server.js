require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const fetch      = require('node-fetch');
const path       = require('path');
const fs         = require('fs');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// On Vercel the project filesystem is read-only; use /tmp for mutable data
const IS_VERCEL     = !!process.env.VERCEL;
const DATA_DIR      = IS_VERCEL ? '/tmp' : path.join(__dirname, 'data');
const DB_FILE       = path.join(DATA_DIR, 'submissions.json');
const PRODUCTS_BUNDLED = path.join(__dirname, 'data', 'products.json');
const PRODUCTS_FILE = IS_VERCEL ? path.join('/tmp', 'products.json') : PRODUCTS_BUNDLED;
const CATALOG_FILE   = path.join(__dirname, 'data', 'catalog.json');

// ensure data dir & files
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE))  fs.writeFileSync(DB_FILE, '[]');
// On Vercel: copy bundled products to /tmp on first boot so admin edits work in-session
if (IS_VERCEL && !fs.existsSync(PRODUCTS_FILE)) fs.copyFileSync(PRODUCTS_BUNDLED, PRODUCTS_FILE);
if (!IS_VERCEL && !fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, '[]');

app.use(compression());
app.use(cors());
app.use(express.json());

// ─── page routes ───────────────────────────────────────────
app.get('/', (req, res) => res.render('pages/index'));
app.get('/catalog', (req, res) => res.render('pages/catalog'));
app.get('/b2b', (req, res) => res.render('pages/b2b'));
app.get('/b2c', (req, res) => res.render('pages/b2c'));
app.get('/become-partner', (req, res) => res.render('pages/become-partner'));
app.get('/arctic-uzbekistan', (req, res) => res.render('pages/brand-arctic'));
app.get('/gravastar-uzbekistan', (req, res) => res.render('pages/brand-gravastar'));
// Category shortcuts → catalog with prefill
app.get('/cooling',     (req, res) => res.redirect('/catalog?brand=Arctic'));
app.get('/audio',       (req, res) => res.redirect('/catalog?brand=Picun'));
app.get('/accessories', (req, res) => res.redirect('/catalog?brand=GravaStar'));

app.use(express.static(path.join(__dirname, 'public')));

// ─── helpers ───────────────────────────────────────────────
function readJSON(file)        { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; } }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

function readSubmissions() { return readJSON(DB_FILE); }
function readProducts()    { return readJSON(PRODUCTS_FILE); }
function readCatalog()    { return readJSON(CATALOG_FILE); }

// Enrich catalog product with image from brand cache (Shopify or Arctic scraper)
function enrichWithImage(p) {
  if (p.image_url) return p;
  const brand  = (p.brand || '').toLowerCase();
  const cache  = brandCache[brand];
  if (!cache?.data) return p;
  let img = null;
  if (p.shopify_handle && (brand === 'gravastar' || brand === 'atk')) {
    const m = cache.data.find(s => s.handle === p.shopify_handle);
    if (m?.image) img = m.image;
  }
  if (p.arctic_handle && brand === 'arctic') {
    const m = cache.data.find(s => s.handle === p.arctic_handle);
    if (m?.image) img = m.image;
  }
  return img ? { ...p, image_url: img } : p;
}

function saveSubmission(data) {
  const list  = readSubmissions();
  const entry = { id: Date.now(), ...data, date: new Date().toISOString() };
  list.unshift(entry);
  writeJSON(DB_FILE, list);
  return entry;
}

async function sendToTelegram(text) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, reason: 'no token/chatId' };
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
  return res.json();
}

// ─── rate limiters ─────────────────────────────────────────
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30,
  message: { error: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many submissions, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── admin auth ────────────────────────────────────────────
function adminAuth(req, res, next) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return res.status(503).json({ error: 'ADMIN_PASSWORD not configured' });
  const auth = req.headers['x-admin-key'] || req.query.key;
  if (auth === pass) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ─── public: contact form ──────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, company, phone, email, message, interest, city, volume, brands, messenger, type } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  const entry = saveSubmission({ name, company, phone, email, message, interest, city, volume, brands, messenger, type });

  const isPartner = type === 'partner_request';
  const text = isPartner
? `*Заявка на партнёрство — RTXSHOP*

*Имя:* ${name}
*Компания:* ${company || '—'}
*Телефон:* ${phone}
*Город:* ${city || '—'}
*Объём/мес:* ${volume || '—'}
*Бренды:* ${brands || '—'}
*Messenger:* ${messenger || '—'}
*Сообщение:* ${message || '—'}

_${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}_`
:
`*Новая заявка — RTXSHOP*

*Имя:* ${name}
*Компания:* ${company || '—'}
*Телефон:* ${phone}
*Email:* ${email || '—'}
*Сообщение:* ${message || '—'}

_${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}_`;

  try { await sendToTelegram(text); } catch (e) { console.error('TG error:', e.message); }
  res.json({ success: true });
});

// ─── public: products ──────────────────────────────────────
app.get('/api/products', (req, res) => {
  const all = readProducts().filter(p => p.active !== false);
  res.json(all);
});

// ─── curated catalog ───────────────────────────────────────
app.get('/api/catalog', (req, res) => {
  res.json(readCatalog());
});

app.get('/api/catalog/:brand', (req, res) => {
  const brand = req.params.brand.toLowerCase();
  res.json(readCatalog().filter(p => p.brand.toLowerCase() === brand));
});

// ─── brand proxy (Shopify + Arctic scraper) ────────────────
const brandCache = {};
const SHOPIFY_TTL = 60 * 60 * 1000;       // 1 hour  — GravaStar, ATK
const ARCTIC_TTL  = 24 * 60 * 60 * 1000;  // 24 hours — Arctic (rarely changes)
const SHOPIFY_URLS = {
  gravastar: 'https://www.gravastar.com/products.json?limit=250',
  atk:       'https://www.atk.store/products.json?limit=250',
};

// Cache files survive server restarts
const CACHE_FILES = {
  gravastar: path.join(DATA_DIR, 'cache_gravastar.json'),
  atk:       path.join(DATA_DIR, 'cache_atk.json'),
  arctic:    path.join(DATA_DIR, 'cache_arctic.json'),
};

// Load caches from disk on startup
(function loadDiskCaches() {
  for (const [brand, file] of Object.entries(CACHE_FILES)) {
    try {
      if (fs.existsSync(file)) {
        brandCache[brand] = JSON.parse(fs.readFileSync(file, 'utf8'));
        console.log(`Cache loaded: ${brand} (${brandCache[brand].data?.length} items)`);
      }
    } catch (e) { /* ignore corrupt cache */ }
  }
})();

function saveDiskCache(brand, data) {
  try { writeJSON(CACHE_FILES[brand], { data, ts: Date.now() }); } catch (e) {}
}

// ── Arctic: curated product list + og:image scraping ──
const ARCTIC_CATALOG = [
  // Liquid Freezers
  { handle:'Liquid-Freezer-III-360',              sku:'ACFRE00136A', name:'Liquid Freezer III 360',           type:'Водяное охлаждение', price:119, badge:'HOT'  },
  { handle:'Liquid-Freezer-III-360-A-RGB',        sku:'ACFRE00143A', name:'Liquid Freezer III 360 A-RGB',     type:'Водяное охлаждение', price:134, badge:null   },
  { handle:'Liquid-Freezer-III-240',              sku:'ACFRE00134A', name:'Liquid Freezer III 240',           type:'Водяное охлаждение', price:104, badge:null   },
  { handle:'Liquid-Freezer-III-240-A-RGB-Black',  sku:'ACFRE00142A', name:'Liquid Freezer III 240 A-RGB',     type:'Водяное охлаждение', price:114, badge:null   },
  { handle:'Liquid-Freezer-III-420-A-RGB',        sku:'ACFRE00145A', name:'Liquid Freezer III 420 A-RGB',     type:'Водяное охлаждение', price:144, badge:null   },
  // Liquid Freezer III Pro
  { handle:'Liquid-Freezer-III-Pro-240',          sku:'ACFRE00178A', name:'Liquid Freezer III Pro 240',       type:'Водяное охлаждение', price:120, badge:'NEW'  },
  { handle:'Liquid-Freezer-III-Pro-280',          sku:'ACFRE00179A', name:'Liquid Freezer III Pro 280',       type:'Водяное охлаждение', price:125, badge:'NEW'  },
  { handle:'Liquid-Freezer-III-Pro-360',          sku:'ACFRE00180A', name:'Liquid Freezer III Pro 360',       type:'Водяное охлаждение', price:130, badge:'NEW'  },
  { handle:'Liquid-Freezer-III-Pro-360-ARGB',     sku:'ACFRE00184A', name:'Liquid Freezer III Pro 360 A-RGB', type:'Водяное охлаждение', price:147, badge:'NEW'  },
  { handle:'Liquid-Freezer-III-Pro-420',          sku:'ACFRE00182A', name:'Liquid Freezer III Pro 420',       type:'Водяное охлаждение', price:145, badge:'NEW'  },
  // Workstation
  { handle:'Liquid-Freezer-WS360-SP6',            sku:'ACFRE00201A', name:'Liquid Freezer WS360 SP6',         type:'Водяное охлаждение', price:170, badge:'NEW'  },
  // Air coolers
  { handle:'Freezer-8A',                          sku:'ACFRE00123A', name:'Freezer 8A',                       type:'Воздушное охлаждение', price:28, badge:null   },
  { handle:'Freezer-36',                          sku:'ACFRE00121A', name:'Freezer 36',                       type:'Воздушное охлаждение', price:38, badge:null   },
  { handle:'Freezer-36-A-RGB-Black',              sku:'ACFRE00124A', name:'Freezer 36 A-RGB',                 type:'Воздушное охлаждение', price:51, badge:null   },
  { handle:'Freezer-36-A-RGB-White',              sku:'ACFRE00125A', name:'Freezer 36 A-RGB (White)',         type:'Воздушное охлаждение', price:52, badge:null   },
  // Fans
  { handle:'P12-Pro',                             sku:'ACFAN00305A', name:'P12 Pro 120mm',                    type:'Вентиляторы',        price:14, badge:null   },
  { handle:'P12-Pro-PST',                         sku:'ACFAN00306A', name:'P12 Pro PST 120mm',                type:'Вентиляторы',        price:12, badge:null   },
  { handle:'P12-Pro-A-RGB',                       sku:'ACFAN00309A', name:'P12 Pro A-RGB 120mm',              type:'Вентиляторы',        price:20, badge:null   },
  { handle:'P14-Pro',                             sku:'ACFAN00313A', name:'P14 Pro 140mm',                    type:'Вентиляторы',        price:16, badge:null   },
  { handle:'P14-Pro-PST',                         sku:'ACFAN00314A', name:'P14 Pro PST 140mm',                type:'Вентиляторы',        price:16, badge:null   },
  // Thermal
  { handle:'MX-4',                                sku:'ACTCP00008B', name:'MX-4 Thermal Compound',            type:'Термопасты',         price:13, badge:null   },
  { handle:'MX-6',                                sku:'ACTCP00081A', name:'MX-6 Thermal Compound',            type:'Термопасты',         price:18, badge:null   },
  { handle:'MX-7',                                sku:'ACTCP00091A', name:'MX-7 Thermal Compound',            type:'Термопасты',         price:21, badge:null   },
];

async function fetchArcticImages() {
  const UA = 'Mozilla/5.0 (compatible; RTXShop/1.0)';
  const results = await Promise.allSettled(
    ARCTIC_CATALOG.map(async p => {
      try {
        const url = `https://www.arctic.de/en/${p.handle}/${p.sku}`;
        const r   = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
        const html = await r.text();
        const m = html.match(/property="og:image"\s+content="([^"]+)"/);
        return { ...p, image: m ? m[1] : null };
      } catch { return { ...p, image: null }; }
    })
  );
  return results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { ...ARCTIC_CATALOG[i], image: null }
  );
}

// ── unified brand endpoint ──
app.get('/api/brands/:brand', async (req, res) => {
  const brand  = req.params.brand.toLowerCase();
  const now    = Date.now();
  const cached = brandCache[brand];

  // ── Arctic ──
  if (brand === 'arctic') {
    if (cached && now - cached.ts < ARCTIC_TTL) return res.json(cached.data);
    try {
      const data = await fetchArcticImages();
      brandCache.arctic = { data, ts: now };
      saveDiskCache('arctic', data);
      return res.json(data);
    } catch (e) {
      if (cached) return res.json(cached.data);
      return res.status(502).json({ error: 'Failed to fetch Arctic products' });
    }
  }

  // ── Shopify (GravaStar / ATK) ──
  if (!SHOPIFY_URLS[brand]) return res.status(404).json({ error: 'Unknown brand' });
  if (cached && now - cached.ts < SHOPIFY_TTL) return res.json(cached.data);

  try {
    const r = await fetch(SHOPIFY_URLS[brand], {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RTXShop/1.0)' },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const json = await r.json();

    const data = (json.products || []).map(p => ({
      id:           p.id,
      title:        p.title,
      handle:       p.handle,
      type:         p.product_type || '',
      tags:         p.tags || [],
      price:        parseFloat(p.variants?.[0]?.price || 0),
      comparePrice: parseFloat(p.variants?.[0]?.compare_at_price || 0) || null,
      image:        p.images?.[0]?.src || p.variants?.[0]?.featured_image?.src || null,
    }));

    brandCache[brand] = { data, ts: now };
    saveDiskCache(brand, data);
    res.json(data);
  } catch (e) {
    console.error('Brand fetch error:', brand, e.message);
    if (cached) return res.json(cached.data); // serve stale — never 502 if we have anything
    res.status(502).json({ error: 'Failed to fetch brand products' });
  }
});

// ─── admin: submissions ────────────────────────────────────
app.use('/api/admin', adminLimiter);
app.get('/api/admin/submissions', adminAuth, (req, res) => res.json(readSubmissions()));

app.delete('/api/admin/submissions/:id', adminAuth, (req, res) => {
  const id = Number(req.params.id);
  writeJSON(DB_FILE, readSubmissions().filter(s => s.id !== id));
  res.json({ success: true });
});

// ─── admin: products ───────────────────────────────────────
app.get('/api/admin/products', adminAuth, (req, res) => res.json(readProducts()));

app.put('/api/admin/products/:id', adminAuth, (req, res) => {
  const id   = Number(req.params.id);
  const { price, active, badge } = req.body;
  const list = readProducts().map(p => {
    if (p.id !== id) return p;
    return {
      ...p,
      ...(price  !== undefined ? { price:  Number(price)   } : {}),
      ...(active !== undefined ? { active: Boolean(active) } : {}),
      ...(badge  !== undefined ? { badge:  badge || null   } : {}),
    };
  });
  writeJSON(PRODUCTS_FILE, list);
  res.json({ success: true });
});

app.post('/api/admin/products', adminAuth, (req, res) => {
  const { category, sub, name, price, active, badge } = req.body;
  if (!category || !name || !price) return res.status(400).json({ error: 'category, name, price required' });
  const list   = readProducts();
  const nextId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
  const entry  = { id: nextId, category, sub: sub || category, name, price: Number(price), active: active !== false, badge: badge || null };
  list.push(entry);
  writeJSON(PRODUCTS_FILE, list);
  res.json({ success: true, product: entry });
});

app.delete('/api/admin/products/:id', adminAuth, (req, res) => {
  const id = Number(req.params.id);
  writeJSON(PRODUCTS_FILE, readProducts().filter(p => p.id !== id));
  res.json({ success: true });
});

// ─── admin: telegram helpers ───────────────────────────────
// ─── admin: export CSV ─────────────────────────────────────
app.get('/api/admin/submissions/export', adminAuth, (req, res) => {
  const list = readSubmissions();
  const header = ['ID','Имя','Компания','Телефон','Email','Бренд','Сообщение','Дата'];
  const rows = list.map(s => [
    s.id,
    `"${(s.name    || '').replace(/"/g,'""')}"`,
    `"${(s.company || '').replace(/"/g,'""')}"`,
    `"${(s.phone   || '').replace(/"/g,'""')}"`,
    `"${(s.email   || '').replace(/"/g,'""')}"`,
    `"${(s.interest|| '').replace(/"/g,'""')}"`,
    `"${(s.message || '').replace(/"/g,'""')}"`,
    `"${new Date(s.date).toLocaleString('ru-RU',{timeZone:'Asia/Tashkent'})}"`,
  ].join(','));
  const csv = '\uFEFF' + [header.join(','), ...rows].join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="rtxshop-leads-${Date.now()}.csv"`);
  res.send(csv);
});

app.get('/api/admin/bot-info', adminAuth, async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.json({ ok: false, error: 'No token' });
  try { res.json(await (await fetch(`https://api.telegram.org/bot${token}/getMe`)).json()); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

app.get('/api/admin/get-updates', adminAuth, async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.json({ ok: false, error: 'No token' });
  try { res.json(await (await fetch(`https://api.telegram.org/bot${token}/getUpdates`)).json()); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

app.post('/api/admin/set-chat-id', adminAuth, (req, res) => {
  const { chatId } = req.body;
  if (!chatId) return res.status(400).json({ error: 'chatId required' });
  const envPath = path.join(__dirname, '.env');
  let content = fs.readFileSync(envPath, 'utf8');
  content = content.replace(/TELEGRAM_CHAT_ID=.*/m, `TELEGRAM_CHAT_ID=${chatId}`);
  fs.writeFileSync(envPath, content);
  process.env.TELEGRAM_CHAT_ID = String(chatId);
  res.json({ success: true, chatId });
});

app.post('/api/admin/test-message', adminAuth, async (req, res) => {
  try { res.json(await sendToTelegram('*Тест — RTXSHOP Admin*\n\nПодключение работает корректно.')); }
  catch (e) { res.json({ ok: false, error: e.message }); }
});

// ─── admin UI ──────────────────────────────────────────────
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));

// catch-all
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`RTXSHOP  → http://localhost:${PORT}`);
  console.log(`Admin    → http://localhost:${PORT}/admin`);
});
