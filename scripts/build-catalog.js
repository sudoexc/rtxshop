/**
 * build-catalog.js — one-time script
 * Builds data/catalog.json with hardcoded image URLs
 * Run: node scripts/build-catalog.js
 */

const fs   = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const GS_CACHE  = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/cache_gravastar.json'))).data;
const ATK_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/cache_atk.json'))).data;

function gsImg(handle) {
  const p = GS_CACHE.find(x => x.handle === handle);
  return p?.image || null;
}
function atkImg(handle) {
  const p = ATK_CACHE.find(x => x.handle === handle);
  return p?.image || null;
}

async function arcticImg(handle, sku) {
  try {
    const url = `https://www.arctic.de/en/${handle}/${sku}`;
    const r   = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal:  AbortSignal.timeout(10000),
    });
    const html = await r.text();
    const m = html.match(/property="og:image"\s+content="([^"]+)"/);
    const img = m ? m[1] : null;
    console.log(`  Arctic ${handle}: ${img ? '✓' : '○ not found'}`);
    return img;
  } catch (e) {
    console.log(`  Arctic ${handle}: ✗ error (${e.message})`);
    return null;
  }
}

// ─────────────────────────────────────────────────────
// CATALOG DEFINITION
// ─────────────────────────────────────────────────────

async function buildCatalog() {

  // ── ARCTIC images (scrape all at once) ──────────────
  console.log('\nScraping Arctic images...');
  const arcticProducts = [
    { id:'arctic-lf3pro240',       name:'Liquid Freezer III Pro 240',             handle:'Liquid-Freezer-III-Pro-240',          sku:'ACFRE00178A' },
    { id:'arctic-lf3pro240argb',   name:'Liquid Freezer III Pro 240 A-RGB',       handle:'Liquid-Freezer-III-Pro-240-A-RGB',    sku:'ACFRE00182A' },
    { id:'arctic-lf3pro240argbwht',name:'Liquid Freezer III Pro 240 A-RGB White', handle:'Liquid-Freezer-III-Pro-240-A-RGB-White',sku:'ACFRE00186A' },
    { id:'arctic-lf3pro280',       name:'Liquid Freezer III Pro 280',             handle:'Liquid-Freezer-III-Pro-280',          sku:'ACFRE00179A' },
    { id:'arctic-lf3pro280argb',   name:'Liquid Freezer III Pro 280 A-RGB',       handle:'Liquid-Freezer-III-Pro-280-A-RGB',    sku:'ACFRE00183A' },
    { id:'arctic-lf3pro280argbwht',name:'Liquid Freezer III Pro 280 A-RGB White', handle:'Liquid-Freezer-III-Pro-280-A-RGB-White',sku:'ACFRE00187A' },
    { id:'arctic-lf3pro360',       name:'Liquid Freezer III Pro 360',             handle:'Liquid-Freezer-III-Pro-360',          sku:'ACFRE00180A' },
    { id:'arctic-lf3pro360argb',   name:'Liquid Freezer III Pro 360 A-RGB',       handle:'Liquid-Freezer-III-Pro-360-A-RGB',    sku:'ACFRE00184A' },
    { id:'arctic-lf3pro360argbwht',name:'Liquid Freezer III Pro 360 A-RGB White', handle:'Liquid-Freezer-III-Pro-360-A-RGB-White',sku:'ACFRE00188A' },
    { id:'arctic-lf3pro420',       name:'Liquid Freezer III Pro 420',             handle:'Liquid-Freezer-III-Pro-420',          sku:'ACFRE00181A' },
    { id:'arctic-lf3pro420argb',   name:'Liquid Freezer III Pro 420 A-RGB',       handle:'Liquid-Freezer-III-Pro-420-A-RGB',    sku:'ACFRE00185A' },
    { id:'arctic-lf3pro420argbwht',name:'Liquid Freezer III Pro 420 A-RGB White', handle:'Liquid-Freezer-III-Pro-420-A-RGB-White',sku:'ACFRE00189A' },
    { id:'arctic-freezer8a',       name:'Freezer 8A',                             handle:'Freezer-8A',                          sku:'ACFRE00161A' },
    { id:'arctic-freezer36',       name:'Freezer 36',                             handle:'Freezer-36',                          sku:'ACFRE00123A' },
    { id:'arctic-freezer36argb',   name:'Freezer 36 A-RGB',                       handle:'Freezer-36-A-RGB-Black',              sku:'ACFRE00124A' },
    { id:'arctic-freezer36argbwht',name:'Freezer 36 A-RGB White',                 handle:'Freezer-36-A-RGB-White',              sku:'ACFRE00125A' },
    { id:'arctic-p12argb3',        name:'P12 Pro A-RGB 3-Pack',                   handle:'P12-Pro-A-RGB',                       sku:'ACFAN00310A' },
    { id:'arctic-p12argbwht3',     name:'P12 Pro A-RGB White 3-Pack',             handle:'P12-Pro-A-RGB-White',                 sku:'ACFAN00326A' },
    { id:'arctic-p12pst5',         name:'P12 Pro PST 5-Pack',                     handle:'P12-Pro-PST',                         sku:'ACFAN00307A' },
    { id:'arctic-p14argb3',        name:'P14 Pro A-RGB 3-Pack',                   handle:'P14-Pro-A-RGB',                       sku:'ACFAN00320A' },
    { id:'arctic-p14argbwht3',     name:'P14 Pro A-RGB White 3-Pack',             handle:'P14-Pro-A-RGB-White',                 sku:'ACFAN00321A' },
    { id:'arctic-p14pst5',         name:'P14 Pro PST 5-Pack',                     handle:'P14-Pro-PST',                         sku:'ACFAN00319A' },
    { id:'arctic-p12rev3',         name:'P12 Pro Reverse 3-Pack',                 handle:'P12-Pro-Reverse',                     sku:'ACFAN00332A' },
    { id:'arctic-p12revargb3',     name:'P12 Pro Reverse A-RGB 3-Pack',           handle:'P12-Pro-Reverse-A-RGB',               sku:'ACFAN00333A' },
    { id:'arctic-p12revargbwht3',  name:'P12 Pro Reverse A-RGB White 3-Pack',     handle:'P12-Pro-Reverse-A-RGB-White',         sku:'ACFAN00334A' },
    { id:'arctic-p14rev3',         name:'P14 Pro Reverse 3-Pack',                 handle:'P14-Pro-Reverse',                     sku:'ACFAN00330A' },
    { id:'arctic-p14revargb3',     name:'P14 Pro Reverse A-RGB 3-Pack',           handle:'P14-Pro-Reverse-A-RGB',               sku:'ACFAN00327A' },
    { id:'arctic-p14revargbwht3',  name:'P14 Pro Reverse A-RGB White 3-Pack',     handle:'P14-Pro-Reverse-A-RGB-White',         sku:'ACFAN00328A' },
    { id:'arctic-xtender-blk',     name:'Xtender Black',                          handle:'Xtender',                             sku:'ACPCC00015A' },
    { id:'arctic-xtender-mirror',  name:'Xtender Mirror Black',                   handle:'Xtender',                             sku:'ACPCC00018A' },
  ];

  const arcticResults = await Promise.allSettled(
    arcticProducts.map(p => arcticImg(p.handle, p.sku))
  );
  const arcticImgMap = {};
  arcticProducts.forEach((p, i) => {
    arcticImgMap[p.id] = arcticResults[i].status === 'fulfilled' ? arcticResults[i].value : null;
  });

  // ── BUILD CATALOG ───────────────────────────────────
  const catalog = [

    // ════════════════════════════════════════════
    // GRAVASTAR
    // ════════════════════════════════════════════

    // Мыши
    {
      id:'gs-v60', brand:'GravaStar', category:'Мыши', name:'Mercury V60',
      badge: null,
      image_url: gsImg('mercury-v60-crystal-rose'),
      colors: ['Onyx Crystal','Crystal Rose'],
      specs: { 'Сенсор':'PAW3950', 'Polling rate':'8000Hz', 'Вес':'~55g', 'Подключение':'Проводная USB-C' },
      desc: 'Лёгкая проводная игровая мышь с топовым сенсором PAW3950'
    },
    {
      id:'gs-v60pro', brand:'GravaStar', category:'Мыши', name:'Mercury V60 Pro',
      badge: 'NEW',
      image_url: gsImg('mercury-v60-pro'),
      colors: ['Chrome Silver','GunMetal','Cyber Frost Black'],
      specs: { 'Сенсор':'PAW3950', 'Polling rate':'4000Hz', 'Вес':'71g', 'Подключение':'Беспроводная 2.4GHz / BT 5.0', 'Батарея':'80 ч' },
      desc: 'Флагманская беспроводная мышь с PAW3950 и 4000Hz polling rate'
    },
    {
      id:'gs-m2', brand:'GravaStar', category:'Мыши', name:'Mercury M2',
      badge: null,
      image_url: gsImg('mercury-m2-opaline-white'),
      colors: ['Opaline White'],
      specs: { 'Сенсор':'PAW3395', 'Polling rate':'1000Hz', 'Вес':'~60g', 'Подключение':'Проводная USB-C' },
      desc: 'Универсальная проводная игровая мышь с sci-fi дизайном'
    },
    {
      id:'gs-m1pro', brand:'GravaStar', category:'Мыши', name:'Mercury M1 Pro',
      badge: null,
      image_url: gsImg('mercury-m1-pro-gradient-black'),
      colors: ['Gradient Black','Ice Blue'],
      specs: { 'Сенсор':'PAW3395', 'Polling rate':'1000Hz', 'Вес':'~55g', 'Подключение':'Проводная USB-C', 'RGB':'Да' },
      desc: 'Лёгкая проводная мышь с RGB подсветкой'
    },

    // Клавиатуры
    {
      id:'gs-v75lite', brand:'GravaStar', category:'Клавиатуры', name:'Mercury V75 Lite',
      badge: null,
      image_url: gsImg('mercury-v75-lite-transparent-black'),
      colors: ['Transparent Black'],
      specs: { 'Форм-фактор':'75%', 'Переключатели':'Magnetic Hall Effect', 'Подключение':'USB-C / Беспроводная', 'RGB':'Да' },
      desc: 'Компактная 75% клавиатура с Hall Effect переключателями без дрейфа'
    },
    {
      id:'gs-v75', brand:'GravaStar', category:'Клавиатуры', name:'Mercury V75',
      badge: null,
      image_url: gsImg('mercury-v75-75-hall-effect-magnetic-switch-gaming-keyboard'),
      colors: ['Stealth Black'],
      specs: { 'Форм-фактор':'75%', 'Переключатели':'Magnetic Hall Effect', 'Подключение':'USB-C / 2.4GHz / BT', 'RGB':'Да' },
      desc: '75% игровая клавиатура с магнитными переключателями'
    },
    {
      id:'gs-v75pro', brand:'GravaStar', category:'Клавиатуры', name:'Mercury V75 Pro',
      badge: 'NEW',
      image_url: gsImg('mercury-v75-pro-cyberpunk'),
      colors: ['Neon Graffiti','Iron Purple','Cyberpunk'],
      specs: { 'Форм-фактор':'75%', 'Переключатели':'Magnetic Hall Effect (Pro)', 'Подключение':'USB-C / 2.4GHz / BT 5.2', 'RGB':'Да', 'Аккумулятор':'6000 мАч' },
      desc: 'Топовая 75% клавиатура с Pro Hall Effect переключателями и triple-mode'
    },
    {
      id:'gs-k1lite', brand:'GravaStar', category:'Клавиатуры', name:'Mercury K1 Lite',
      badge: null,
      image_url: gsImg('mercury-k1-lite-transparent-black'),
      colors: ['Transparent Black','Crystal Aurora'],
      specs: { 'Форм-фактор':'65%', 'Переключатели':'Kailh (hot-swap)', 'Подключение':'USB-C / Беспроводная', 'RGB':'Да' },
      desc: 'Компактная 65% клавиатура с прозрачным корпусом'
    },
    {
      id:'gs-k1', brand:'GravaStar', category:'Клавиатуры', name:'Mercury K1',
      badge: null,
      image_url: gsImg('mercury-k1-stealth-black'),
      colors: ['Gradient Black','Gradient White','Stealth Black','Ice Blue'],
      specs: { 'Форм-фактор':'65%', 'Переключатели':'Kailh (hot-swap)', 'Подключение':'USB-C / Беспроводная', 'RGB':'Да', 'Материал':'Алюминий' },
      desc: '65% механическая клавиатура с алюминиевой рамкой'
    },
    {
      id:'gs-k1pro', brand:'GravaStar', category:'Клавиатуры', name:'Mercury K1 Pro',
      badge: null,
      image_url: gsImg('mercury-k1-pro-silver'),
      colors: ['Interstellar Silver','CyberFlare','Cyberpunk','Battle-Worn Yellow'],
      specs: { 'Форм-фактор':'75% TKL', 'Переключатели':'Kailh (hot-swap)', 'Подключение':'USB-C / 2.4GHz / BT 5.0', 'RGB':'Да', 'Крепление':'Gasket mount' },
      desc: 'Беспроводная TKL клавиатура с tri-mode и gasket mount'
    },

    // Контроллеры
    {
      id:'gs-x', brand:'GravaStar', category:'Контроллеры', name:'Mercury X',
      badge: null,
      image_url: gsImg('mercury-x-wireless-gaming-mouse'),
      colors: ['Galaxy Black'],
      specs: { 'Джойстики':'Hall Effect (без дрейфа)', 'Подключение':'2.4GHz / USB-C / BT 5.1', 'Батарея':'~20 ч', 'Совместимость':'PC / Android / Switch / iOS' },
      desc: 'Игровой контроллер с Hall Effect джойстиками и triple-mode подключением'
    },

    // Наушники
    {
      id:'gs-g1pro', brand:'GravaStar', category:'Наушники', name:'G1 Pro',
      badge: null,
      image_url: null,
      colors: ['Matte Black','Battle-Worn Yellow'],
      specs: { 'Тип':'Накладные', 'Звук':'Виртуальный 7.1', 'Подключение':'USB-C / 3.5mm', 'Микрофон':'Шумоподавление', 'Драйверы':'50mm', 'RGB':'Да' },
      desc: 'Игровые наушники с 7.1 объёмным звуком и RGB подсветкой'
    },
    {
      id:'gs-g5', brand:'GravaStar', category:'Наушники', name:'G5',
      badge: null,
      image_url: null,
      colors: ['Black','Battle-Worn Yellow'],
      specs: { 'Тип':'Вкладыши', 'Подключение':'USB-C', 'Микрофон':'Встроенный', 'Частота':'20Гц – 20кГц' },
      desc: 'Игровые вкладыши с кристально чистым звуком'
    },
    {
      id:'gs-a7', brand:'GravaStar', category:'TWS Наушники', name:'A7',
      badge: null,
      image_url: null,
      colors: ['White','Black'],
      specs: { 'Тип':'True Wireless', 'ANC':'Активное шумоподавление', 'Автономность':'до 40 ч (с кейсом)', 'Подключение':'Bluetooth 5.3', 'Gaming Mode':'30ms задержка' },
      desc: 'TWS наушники с ANC и специальным игровым режимом'
    },

    // ════════════════════════════════════════════
    // ATK
    // ════════════════════════════════════════════

    {
      id:'atk-ag9air', brand:'ATK', category:'Мыши', name:'Ag9 Air',
      badge: 'HOT',
      image_url: atkImg('atk-dragonfly-a9-series-lightweight-wireless-mouse'),
      colors: ['White','Black','Shadow White'],
      specs: { 'Сенсор':'PAW3395', 'DPI':'до 12 400', 'Polling rate':'1000Hz', 'Вес':'45g', 'Форм-фактор':'Honeycomb', 'Подключение':'Проводная USB-C' },
      desc: 'Ультралёгкая перфорированная мышь весом 45г для максимальной скорости'
    },
    {
      id:'atk-ag9plus', brand:'ATK', category:'Мыши', name:'Ag9 Plus',
      badge: null,
      image_url: atkImg('atk-dragonfly-a9-pro-max-lightweight-wireless-mouse'),
      colors: ['White','Black'],
      specs: { 'Сенсор':'PAW3395', 'DPI':'до 12 400', 'Polling rate':'1000Hz', 'Вес':'58g', 'Подключение':'Проводная USB-C' },
      desc: 'Улучшенная версия Ag9 с балансом веса и характеристик'
    },
    {
      id:'atk-ag9ult', brand:'ATK', category:'Мыши', name:'Ag9 Ultimate',
      badge: 'NEW',
      image_url: atkImg('atk-dragonfly-a9-ultimate-lightweight-wireless-mouse'),
      colors: ['White','Black'],
      specs: { 'Сенсор':'PAW3950', 'DPI':'до 30 000', 'Polling rate':'8000Hz', 'Вес':'~52g', 'Подключение':'Беспроводная 2.4GHz / BT 5.2' },
      desc: 'Топовая беспроводная мышь с PAW3950 и 8000Hz polling rate'
    },
    {
      id:'atk-ag9ultra', brand:'ATK', category:'Мыши', name:'Ag9 Ultra Max 2.0',
      badge: 'NEW',
      image_url: null,
      colors: ['White','Black'],
      specs: { 'Сенсор':'PAW3950', 'DPI':'до 30 000', 'Polling rate':'8000Hz', 'Подключение':'Беспроводная 2.4GHz / BT 5.2' },
      desc: 'Флагманская беспроводная мышь Ultra Max второго поколения'
    },
    {
      id:'atk-ghost', brand:'ATK', category:'Мыши', name:'Ghost Ultimate',
      badge: null,
      image_url: atkImg('atk-blazing-sky-ghost-hollow-carbon-fiber-wireless-gaming-mouse'),
      colors: ['Black'],
      specs: { 'Сенсор':'PAW3395', 'Polling rate':'1000Hz', 'Корпус':'Полый Carbon Fiber', 'Подключение':'Беспроводная 2.4GHz' },
      desc: 'Беспроводная мышь с полым корпусом из углеродного волокна'
    },
    {
      id:'atk-z1ult', brand:'ATK', category:'Мыши', name:'Z1 Ultimate',
      badge: null,
      image_url: atkImg('atk-blazing-sky-z1-v2-gaming-wireless-mouse'),
      colors: ['White','Black'],
      specs: { 'Сенсор':'PAW3950', 'Polling rate':'8000Hz', 'Подключение':'Беспроводная 2.4GHz / BT 5.2', 'Зарядка':'Магнитный кейс' },
      desc: 'Флагманская беспроводная мышь с магнитным зарядным кейсом'
    },
    {
      id:'atk-zero', brand:'ATK', category:'Мыши', name:'ZERO (ABS)',
      badge: null,
      image_url: atkImg('atk-blazing-sky-zero-ultralight-wireless-gaming-mouse'),
      colors: ['White','Black'],
      specs: { 'Сенсор':'PAW3395', 'Polling rate':'1000Hz', 'Вес':'42g', 'Форм-фактор':'Симметричная' },
      desc: 'Сверхлёгкая симметричная мышь весом 42г'
    },
    {
      id:'atk-ng9pro', brand:'ATK', category:'Наушники', name:'Neptune Ng9 Pro',
      badge: null,
      image_url: atkImg('atk-neptune-n9-esports-gaming-wireless-headset'),
      colors: ['White','Black'],
      specs: { 'Тип':'Накладные', 'Подключение':'Беспроводная 2.4GHz / 3.5mm', 'Микрофон':'Съёмный, шумоподавление', 'Звук':'Виртуальный 7.1' },
      desc: 'Беспроводная игровая гарнитура с виртуальным 7.1 звуком'
    },
    {
      id:'atk-ng9ultra', brand:'ATK', category:'Наушники', name:'Neptune Ng9 Ultra',
      badge: 'NEW',
      image_url: null,
      colors: ['Orange','Pink'],
      specs: { 'Тип':'Накладные', 'Подключение':'Беспроводная 2.4GHz / BT 5.3', 'Микрофон':'Съёмный, AI шумоподавление', 'Звук':'Виртуальный 7.1' },
      desc: 'Флагманская игровая гарнитура Ultra с AI шумоподавлением микрофона'
    },

    // ════════════════════════════════════════════
    // PICUN
    // ════════════════════════════════════════════

    {
      id:'picun-g2-wb', brand:'Picun', category:'Наушники', name:'G2 White-Black',
      badge: null,
      image_url: null,
      colors: ['White','Black'],
      specs: { 'Тип':'Накладные', 'Звук':'Стерео', 'Подключение':'USB + 3.5mm', 'Микрофон':'С шумоподавлением', 'Подсветка':'RGB' },
      desc: 'Игровые наушники с RGB подсветкой — белый корпус, чёрные детали'
    },
    {
      id:'picun-g2-br', brand:'Picun', category:'Наушники', name:'G2 Black-Red',
      badge: null,
      image_url: null,
      colors: ['Black','Red'],
      specs: { 'Тип':'Накладные', 'Звук':'Стерео', 'Подключение':'USB + 3.5mm', 'Микрофон':'С шумоподавлением', 'Подсветка':'RGB' },
      desc: 'Игровые наушники с RGB подсветкой — чёрный корпус, красные детали'
    },
    {
      id:'picun-ug10a-wb', brand:'Picun', category:'TWS Наушники', name:'UG-10A White-Black',
      badge: 'NEW',
      image_url: null,
      colors: ['White','Black'],
      specs: { 'Тип':'True Wireless', 'Задержка':'≤60ms (игровой режим)', 'Подключение':'Bluetooth 5.3', 'Шумоподавление':'ENC', 'Автономность':'до 35 ч' },
      desc: 'TWS наушники с игровым режимом — белый + чёрный'
    },
    {
      id:'picun-ug10a-br', brand:'Picun', category:'TWS Наушники', name:'UG-10A Black-Red',
      badge: 'NEW',
      image_url: null,
      colors: ['Black','Red'],
      specs: { 'Тип':'True Wireless', 'Задержка':'≤60ms (игровой режим)', 'Подключение':'Bluetooth 5.3', 'Шумоподавление':'ENC', 'Автономность':'до 35 ч' },
      desc: 'TWS наушники с игровым режимом — чёрный + красный'
    },

    // ════════════════════════════════════════════
    // ARCTIC
    // ════════════════════════════════════════════

    // LF III Pro 240
    { id:'arctic-lf3pro240',        brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 240',             badge:null, image_url: arcticImgMap['arctic-lf3pro240'],        colors:['Black'],        specs:{'Радиатор':'240mm','Вентиляторы':'2× 120mm P12 Pro','TDP':'до 250W','Совместимость':'AM5/AM4/LGA1851/LGA1700','VRM Fan':'Да'}, desc:'AIO 240mm Pro серии с VRM вентилятором на помпе' },
    { id:'arctic-lf3pro240argb',    brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 240 A-RGB',       badge:'NEW', image_url: arcticImgMap['arctic-lf3pro240argb'],    colors:['Black'],        specs:{'Радиатор':'240mm','Вентиляторы':'2× 120mm P12 Pro A-RGB','TDP':'до 250W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'AIO 240mm Pro с адресуемой RGB подсветкой' },
    { id:'arctic-lf3pro240argbwht', brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 240 A-RGB White', badge:'NEW', image_url: arcticImgMap['arctic-lf3pro240argbwht'], colors:['White'],        specs:{'Радиатор':'240mm','Вентиляторы':'2× 120mm P12 Pro A-RGB','TDP':'до 250W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'AIO 240mm Pro A-RGB в белом исполнении' },

    // LF III Pro 280
    { id:'arctic-lf3pro280',        brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 280',             badge:null, image_url: arcticImgMap['arctic-lf3pro280'],        colors:['Black'],        specs:{'Радиатор':'280mm','Вентиляторы':'2× 140mm P14 Pro','TDP':'до 300W','Совместимость':'AM5/AM4/LGA1851/LGA1700','VRM Fan':'Да'}, desc:'AIO 280mm Pro серии — баланс размера и производительности' },
    { id:'arctic-lf3pro280argb',    brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 280 A-RGB',       badge:'NEW', image_url: arcticImgMap['arctic-lf3pro280argb'],    colors:['Black'],        specs:{'Радиатор':'280mm','Вентиляторы':'2× 140mm P14 Pro A-RGB','TDP':'до 300W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'AIO 280mm Pro с адресуемой RGB подсветкой' },
    { id:'arctic-lf3pro280argbwht', brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 280 A-RGB White', badge:'NEW', image_url: arcticImgMap['arctic-lf3pro280argbwht'], colors:['White'],        specs:{'Радиатор':'280mm','Вентиляторы':'2× 140mm P14 Pro A-RGB','TDP':'до 300W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'AIO 280mm Pro A-RGB в белом исполнении' },

    // LF III Pro 360
    { id:'arctic-lf3pro360',        brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 360',             badge:'HOT', image_url: arcticImgMap['arctic-lf3pro360'],        colors:['Black'],        specs:{'Радиатор':'360mm','Вентиляторы':'3× 120mm P12 Pro','TDP':'до 350W','Совместимость':'AM5/AM4/LGA1851/LGA1700','VRM Fan':'Да'}, desc:'Флагманский 360mm AIO для самых горячих процессоров' },
    { id:'arctic-lf3pro360argb',    brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 360 A-RGB',       badge:'NEW', image_url: arcticImgMap['arctic-lf3pro360argb'],    colors:['Black'],        specs:{'Радиатор':'360mm','Вентиляторы':'3× 120mm P12 Pro A-RGB','TDP':'до 350W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'360mm AIO Pro с адресуемой RGB подсветкой' },
    { id:'arctic-lf3pro360argbwht', brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 360 A-RGB White', badge:'NEW', image_url: arcticImgMap['arctic-lf3pro360argbwht'], colors:['White'],        specs:{'Радиатор':'360mm','Вентиляторы':'3× 120mm P12 Pro A-RGB','TDP':'до 350W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'360mm AIO Pro A-RGB в белом исполнении' },

    // LF III Pro 420
    { id:'arctic-lf3pro420',        brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 420',             badge:'NEW', image_url: arcticImgMap['arctic-lf3pro420'],        colors:['Black'],        specs:{'Радиатор':'420mm','Вентиляторы':'3× 140mm P14 Pro','TDP':'до 420W','Совместимость':'AM5/AM4/LGA1851/LGA1700','VRM Fan':'Да'}, desc:'Максимальная 420mm AIO система — абсолютная победа над температурами' },
    { id:'arctic-lf3pro420argb',    brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 420 A-RGB',       badge:'NEW', image_url: arcticImgMap['arctic-lf3pro420argb'],    colors:['Black'],        specs:{'Радиатор':'420mm','Вентиляторы':'3× 140mm P14 Pro A-RGB','TDP':'до 420W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'420mm AIO Pro с адресуемой RGB подсветкой' },
    { id:'arctic-lf3pro420argbwht', brand:'Arctic', category:'Водяное охлаждение', name:'Liquid Freezer III Pro 420 A-RGB White', badge:'NEW', image_url: arcticImgMap['arctic-lf3pro420argbwht'], colors:['White'],        specs:{'Радиатор':'420mm','Вентиляторы':'3× 140mm P14 Pro A-RGB','TDP':'до 420W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V'}, desc:'420mm AIO Pro A-RGB в белом исполнении' },

    // Воздушное охлаждение
    { id:'arctic-freezer8a',        brand:'Arctic', category:'Воздушное охлаждение', name:'Freezer 8A',             badge:null, image_url: arcticImgMap['arctic-freezer8a'],        colors:['Black'], specs:{'Тип':'Низкопрофильный','Вентилятор':'92mm','TDP':'до 100W','Совместимость':'AM5/AM4','Высота':'72mm'}, desc:'Компактный низкопрофильный кулер для mini-ITX корпусов' },
    { id:'arctic-freezer36',        brand:'Arctic', category:'Воздушное охлаждение', name:'Freezer 36',             badge:null, image_url: arcticImgMap['arctic-freezer36'],        colors:['Black'], specs:{'Тип':'Башенный','Вентилятор':'120mm P12 PWM','TDP':'до 175W','Совместимость':'AM5/AM4/LGA1851/LGA1700','Тепловые трубки':'3 шт'}, desc:'Эффективный башенный кулер с низким уровнем шума' },
    { id:'arctic-freezer36argb',    brand:'Arctic', category:'Воздушное охлаждение', name:'Freezer 36 A-RGB',       badge:null, image_url: arcticImgMap['arctic-freezer36argb'],    colors:['Black'], specs:{'Тип':'Башенный','Вентилятор':'120mm P12 A-RGB','TDP':'до 175W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V (3-pin)'}, desc:'Башенный кулер с адресуемой RGB подсветкой' },
    { id:'arctic-freezer36argbwht', brand:'Arctic', category:'Воздушное охлаждение', name:'Freezer 36 A-RGB White', badge:null, image_url: arcticImgMap['arctic-freezer36argbwht'], colors:['White'], specs:{'Тип':'Башенный','Вентилятор':'120mm P12 A-RGB','TDP':'до 175W','Совместимость':'AM5/AM4/LGA1851/LGA1700','RGB':'A-RGB 5V (3-pin)'}, desc:'Башенный кулер A-RGB в белом исполнении' },

    // Вентиляторы
    { id:'arctic-p12argb3',        brand:'Arctic', category:'Вентиляторы', name:'P12 Pro A-RGB 3-Pack',             badge:null, image_url: arcticImgMap['arctic-p12argb3'],        colors:['Black'], specs:{'Размер':'120mm','Обороты':'200–1800 RPM','Коннектор':'4-pin PWM','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 120mm вентиляторы с A-RGB подсветкой' },
    { id:'arctic-p12argbwht3',     brand:'Arctic', category:'Вентиляторы', name:'P12 Pro A-RGB White 3-Pack',       badge:null, image_url: arcticImgMap['arctic-p12argbwht3'],     colors:['White'], specs:{'Размер':'120mm','Обороты':'200–1800 RPM','Коннектор':'4-pin PWM','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 120mm A-RGB вентиляторы, белые' },
    { id:'arctic-p12pst5',         brand:'Arctic', category:'Вентиляторы', name:'P12 Pro PST 5-Pack',               badge:null, image_url: arcticImgMap['arctic-p12pst5'],         colors:['Black'], specs:{'Размер':'120mm','Обороты':'200–1800 RPM','Коннектор':'4-pin PWM / PST daisy-chain','Уровень шума':'≤22.5 dBA','В упаковке':'5 шт'}, desc:'5 шт — 120mm вентиляторы с PST синхронизацией' },
    { id:'arctic-p14argb3',        brand:'Arctic', category:'Вентиляторы', name:'P14 Pro A-RGB 3-Pack',             badge:null, image_url: arcticImgMap['arctic-p14argb3'],        colors:['Black'], specs:{'Размер':'140mm','Обороты':'200–1700 RPM','Коннектор':'4-pin PWM','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 140mm вентиляторы с A-RGB подсветкой' },
    { id:'arctic-p14argbwht3',     brand:'Arctic', category:'Вентиляторы', name:'P14 Pro A-RGB White 3-Pack',       badge:null, image_url: arcticImgMap['arctic-p14argbwht3'],     colors:['White'], specs:{'Размер':'140mm','Обороты':'200–1700 RPM','Коннектор':'4-pin PWM','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 140mm A-RGB вентиляторы, белые' },
    { id:'arctic-p14pst5',         brand:'Arctic', category:'Вентиляторы', name:'P14 Pro PST 5-Pack',               badge:null, image_url: arcticImgMap['arctic-p14pst5'],         colors:['Black'], specs:{'Размер':'140mm','Обороты':'200–1700 RPM','Коннектор':'4-pin PWM / PST daisy-chain','Уровень шума':'≤23 dBA','В упаковке':'5 шт'}, desc:'5 шт — 140mm вентиляторы с PST синхронизацией' },
    { id:'arctic-p12rev3',         brand:'Arctic', category:'Вентиляторы', name:'P12 Pro Reverse 3-Pack',           badge:null, image_url: arcticImgMap['arctic-p12rev3'],         colors:['Black'], specs:{'Размер':'120mm','Тип':'Reverse (обратное вращение)','Коннектор':'4-pin PWM','В упаковке':'3 шт'}, desc:'3 шт — 120mm с обратным вращением (для exhaust)' },
    { id:'arctic-p12revargb3',     brand:'Arctic', category:'Вентиляторы', name:'P12 Pro Reverse A-RGB 3-Pack',     badge:null, image_url: arcticImgMap['arctic-p12revargb3'],     colors:['Black'], specs:{'Размер':'120mm','Тип':'Reverse','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 120mm Reverse с A-RGB подсветкой' },
    { id:'arctic-p12revargbwht3',  brand:'Arctic', category:'Вентиляторы', name:'P12 Pro Reverse A-RGB White 3-Pack',badge:null, image_url: arcticImgMap['arctic-p12revargbwht3'],  colors:['White'], specs:{'Размер':'120mm','Тип':'Reverse','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 120mm Reverse A-RGB, белые' },
    { id:'arctic-p14rev3',         brand:'Arctic', category:'Вентиляторы', name:'P14 Pro Reverse 3-Pack',           badge:null, image_url: arcticImgMap['arctic-p14rev3'],         colors:['Black'], specs:{'Размер':'140mm','Тип':'Reverse','Коннектор':'4-pin PWM','В упаковке':'3 шт'}, desc:'3 шт — 140mm с обратным вращением' },
    { id:'arctic-p14revargb3',     brand:'Arctic', category:'Вентиляторы', name:'P14 Pro Reverse A-RGB 3-Pack',     badge:null, image_url: arcticImgMap['arctic-p14revargb3'],     colors:['Black'], specs:{'Размер':'140mm','Тип':'Reverse','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 140mm Reverse с A-RGB подсветкой' },
    { id:'arctic-p14revargbwht3',  brand:'Arctic', category:'Вентиляторы', name:'P14 Pro Reverse A-RGB White 3-Pack',badge:null, image_url: arcticImgMap['arctic-p14revargbwht3'],  colors:['White'], specs:{'Размер':'140mm','Тип':'Reverse','RGB':'A-RGB 5V','В упаковке':'3 шт'}, desc:'3 шт — 140mm Reverse A-RGB, белые' },

    // Корпуса
    { id:'arctic-xtender-blk',    brand:'Arctic', category:'Корпуса', name:'Xtender Black',         badge:null, image_url: arcticImgMap['arctic-xtender-blk'],    colors:['Black'], specs:{'Форм-фактор':'Mini-ITX','Боковая панель':'Чёрное стекло','GPU':'без вертикального крепления','Тип':'Компактный игровой'}, desc:'Компактный игровой корпус с чёрной стеклянной панелью' },
    { id:'arctic-xtender-mirror', brand:'Arctic', category:'Корпуса', name:'Xtender Mirror Black',  badge:null, image_url: arcticImgMap['arctic-xtender-mirror'], colors:['Black'], specs:{'Форм-фактор':'Mini-ITX','Боковая панель':'Зеркальное чёрное стекло','GPU':'без вертикального крепления','Тип':'Компактный игровой'}, desc:'Компактный игровой корпус с зеркальной стеклянной панелью' },
  ];

  // Save
  const out = path.join(__dirname,'../data/catalog.json');
  fs.writeFileSync(out, JSON.stringify(catalog, null, 2));

  const withImg = catalog.filter(p=>p.image_url).length;
  console.log(`\n✓ catalog.json written: ${catalog.length} products, ${withImg} with images`);

  const byBrand = {};
  catalog.forEach(p=>{ byBrand[p.brand]=(byBrand[p.brand]||0)+1; });
  Object.entries(byBrand).forEach(([b,n])=>console.log(`  ${b}: ${n} products`));
}

buildCatalog().catch(console.error);
