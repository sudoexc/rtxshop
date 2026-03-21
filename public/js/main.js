/* ======================================
   RTXSHOP OOO — Main JavaScript
   ====================================== */

// ======= CUSTOM CURSOR =======
(function () {
  // only on real pointer devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;

  const B = document.body;
  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let raf;

  // instant dot
  function moveDot(x, y) {
    dot.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  }

  // spring ring
  function tick() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    raf = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    moveDot(mx, my);
    B.classList.remove('c-hidden');
  }, { passive: true });

  document.addEventListener('mouseleave', () => B.classList.add('c-hidden'), { passive: true });
  document.addEventListener('mouseenter', () => B.classList.remove('c-hidden'), { passive: true });

  // hide when window loses focus (fixes "double cursor" on alt-tab)
  document.addEventListener('visibilitychange', () => {
    B.classList.toggle('c-hidden', document.hidden);
  });

  // hover state
  const SEL = 'a,button,[role="button"],input,select,textarea,label,.partner-card,.cat-tab,.faq-q,.catalog-row,.about-feature,.step,.service-row';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(SEL)) B.classList.add('c-hover');
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(SEL)) B.classList.remove('c-hover');
  }, { passive: true });

  document.addEventListener('mousedown', () => { B.classList.add('c-click'); B.classList.remove('c-hover'); }, { passive: true });
  document.addEventListener('mouseup',   () => { B.classList.remove('c-click'); }, { passive: true });

  // start loop
  raf = requestAnimationFrame(tick);
})();

// ======= THEME =======
(function () {
  const saved = localStorage.getItem('rtx_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('rtx_theme', next);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
});

// ======= TRANSLATIONS =======
const T = {
  ru: {
    nav_about: 'О нас', nav_partners: 'Партнёры', nav_catalog: 'Каталог',
    nav_services: 'Услуги', nav_faq: 'FAQ', nav_contact: 'Связаться',
    nav_how: 'Как работаем', nav_contact_short: 'Контакты',
    nav_b2c: 'Покупателям', nav_partner: 'Стать партнёром',
    nav_brands_eyebrow: 'Бренды',
    picun_cat: 'Аудио',
    grava_desc_short: 'Sci-fi дизайн · колонки · мыши',
    atk_desc_short: 'Проф. сенсоры · эргономика',
    arctic_desc_short: 'Кулеры · термопаста · вентиляторы',
    picun_desc_short: 'TWS · игровые наушники',
    tg_label: 'Написать в Telegram',
    sticky_text: 'Станьте партнёром RTXSHOP — ответим за 2 часа',
    sticky_btn: 'Оставить заявку',
    hero_eyebrow: 'Официальный дистрибьютор в Узбекистане',
    hero_h1a: 'Прямые поставки', hero_h1b: 'для вашего магазина.',
    hero_sub: 'RTXSHOP OOO — официальный дистрибьютор ATK, GravaStar, Arctic и Picun в Узбекистане. Игровые мыши, периферия, аудио и системы охлаждения оптом для магазинов.',
    hero_cta1: 'Стать партнёром', hero_cta2: 'Смотреть каталог',
    stat_stores: 'Магазинов-партнёров', stat_products: 'Товаров в каталоге',
    stat_brands: 'Официальных бренда', stat_coverage: 'Охват по стране', stat_years: 'Лет на рынке',
    ticker_label: 'Официальные партнёры',
    map_from: 'Мировые бренды', map_to: 'Узбекистан',
    brand_atk: 'Игровые мыши', brand_grava: 'Периферия',
    brand_arctic: 'Охлаждение', brand_b2b: 'Оптовая модель',
    about_eyebrow: 'О компании',
    about_h2a: 'Мост между', about_h2b: 'мировыми', about_h2c: 'брендами', about_h2d: 'и вашим магазином',
    about_sub: 'RTXSHOP OOO — официальный дистрибьютор ATK, GravaStar, Arctic и Picun в Узбекистане. Поставляем игровые мыши, периферию, аудио и системы охлаждения напрямую в розничные магазины по всей стране.',
    feat1_title: 'Официальное партнёрство', feat1_sub: 'Прямые договоры с ATK, GravaStar и Arctic — оригинальная продукция с гарантией',
    feat2_title: 'Оптовые поставки',        feat2_sub: 'Работаем с магазинами по всему Узбекистану — от Ташкента до регионов',
    feat3_title: 'Быстрая логистика',       feat3_sub: 'Выстроенные цепочки поставок для своевременного пополнения вашего склада',
    partners_eyebrow: 'Партнёры',
    partners_h2a: 'Бренды, которые мы', partners_h2b: 'представляем',
    partners_sub: 'Мы сотрудничаем только с проверенными мировыми брендами, чтобы вы могли предложить своим клиентам лучшее',
    atk_cat: 'Игровые мыши', atk_desc: 'Профессиональные игровые мыши с передовыми сенсорами и эргономичным дизайном. Выбор геймеров, которые требуют точности.',
    grava_cat: 'Игровая периферия', grava_desc: 'Уникальный sci-fi дизайн и топовые характеристики. Колонки, наушники, мыши — продукты, которые выделяют вас из толпы.',
    arctic_cat: 'Системы охлаждения', arctic_desc: 'Европейский эксперт в области охлаждения. Кулеры, термопасты, вентиляторы — тишина и эффективность в одном.',
    open_site: 'Открыть сайт',
    bsl_eyebrow: 'Хит продаж', bsl_h2a: 'Самые', bsl_h2b: 'востребованные',
    bsl_sub: 'Топовые позиции из нашего каталога — игровая периферия и системы охлаждения',
    pc_wholesale: 'оптом', pc_view_brand: 'Смотреть каталог',
    view_catalog: 'Смотреть каталог',
    catalog_eyebrow: 'Каталог', catalog_h2a: 'Наш', catalog_h2b: 'каталог',
    catalog_sub: 'Товары, которые мы поставляем напрямую с производства. Для получения прайса — свяжитесь с менеджером.',
    catalog_cta_text: 'Нужен индивидуальный прайс или товар не в списке?',
    catalog_cta_btn: 'Запросить у менеджера',
    services_eyebrow: 'Услуги', services_h2a: 'Всё что нужно', services_h2b: 'вашему бизнесу',
    services_sub: 'Мы берём на себя всё: от переговоров с брендами до доставки товара к вам на склад',
    svc1_title: 'Оптовые заказы',         svc1_sub: 'Гибкие условия минимального заказа и конкурентные оптовые цены для магазинов любого размера',
    svc2_title: 'Логистика и доставка',   svc2_sub: 'Организуем доставку прямо на ваш склад. Отслеживание груза на каждом этапе пути',
    svc3_title: 'Гарантия оригинала',     svc3_sub: 'Вся продукция поставляется напрямую от официальных производителей с сертификатами подлинности',
    svc4_title: 'Маркетинговая поддержка',svc4_sub: 'Предоставляем материалы бренда: фотографии, описания, POS-материалы для вашего магазина',
    svc5_title: 'Персональный менеджер',  svc5_sub: 'Закреплённый менеджер для оперативного решения всех вопросов и помощи с заказами',
    svc6_title: 'Гарантийный сервис',     svc6_sub: 'Помощь с гарантийными случаями и сервисным обслуживанием проданных товаров',
    how_eyebrow: 'Как работаем', how_h2a: 'Четыре шага до', how_h2b: 'первой поставки',
    step1_title: 'Заявка',          step1_sub: 'Оставьте заявку на сайте или напишите нам напрямую — ответим в течение 2 часов',
    step2_title: 'Согласование',    step2_sub: 'Обсудим ассортимент, объёмы и условия сотрудничества, подпишем договор',
    step3_title: 'Оплата и заказ',  step3_sub: 'Оформляем заказ напрямую у бренда под ваши нужды после подтверждения',
    step4_title: 'Доставка',        step4_sub: 'Организуем доставку и передаём товар вам — готово к продаже',
    faq_eyebrow: 'FAQ', faq_h2a: 'Частые', faq_h2b: 'вопросы',
    faq1_q: 'Какой минимальный объём заказа?',
    faq1_a: 'Минимальный заказ обсуждается индивидуально в зависимости от бренда и категории товара. Для большинства позиций — от 3–5 единиц. Напишите нам и мы подберём условия под ваш магазин.',
    faq2_q: 'Как быстро доставляют товар?',
    faq2_a: 'Товар в наличии на складе доставляется по Ташкенту за 1–2 рабочих дня, в регионы Узбекистана — за 3–5 дней. Под заказ сроки зависят от бренда и текущих остатков.',
    faq3_q: 'Какие способы оплаты доступны?',
    faq3_a: 'Работаем по безналичному расчёту (счёт для юридических лиц), наличными и переводом. Возможна постоплата для постоянных партнёров после первых успешных сделок.',
    faq4_q: 'Как оформляется гарантия на товары?',
    faq4_a: 'Вся продукция поставляется с официальной гарантией производителя. Мы берём на себя гарантийные случаи и взаимодействуем с сервисными центрами напрямую.',
    faq5_q: 'В каких городах Узбекистана работаете?',
    faq5_a: 'Работаем по всему Узбекистану: Ташкент, Самарканд, Бухара, Андижан, Фергана, Наманган, Нукус и другие города. Доставка организована через надёжных логистических партнёров.',
    contact_eyebrow: 'Контакты', contact_h2a: 'Начнём', contact_h2b: 'сотрудничество?',
    contact_sub: 'Оставьте заявку и наш менеджер свяжется с вами в ближайшее время для обсуждения условий',
    cd1_label: 'Адрес', cd1_val: 'Ташкент, Узбекистан',
    cd3_label: 'Время работы', cd3_val: 'Пн–Пт: 9:00 — 18:00 (UZT)',
    cd4_label: 'Ответ на заявку', cd4_val: 'В течение 2 рабочих часов',
    form_title: 'Оставить заявку', form_sub: 'Заполните форму — мы свяжемся с вами',
    field_name: 'Ваше имя *', field_company: 'Компания / Магазин',
    field_phone: 'Телефон *', field_interest: 'Интересующий бренд',
    field_interest_placeholder: 'Выберите бренд', field_interest_all: 'Все категории',
    field_message: 'Сообщение', field_message_ph: 'Расскажите о вашем магазине и что вас интересует...',
    form_submit: 'Отправить заявку',
    form_success_title: 'Заявка отправлена', form_success_sub: 'Наш менеджер свяжется с вами в течение 2 рабочих часов',
    footer_desc: 'Официальный дистрибьютор ATK, GravaStar и Arctic в Узбекистане. Поставляем качественную технику для вашего бизнеса.',
    footer_col1: 'Компания', footer_col2: 'Партнёры', footer_col3: 'Связь',
    footer_partner: 'Стать партнёром', footer_rights: 'Все права защищены.',
    footer_privacy: 'Политика конфиденциальности',
    req_btn: 'Запросить',
    pill_warehouse: 'Локальный склад', pill_delivery: 'Доставка 1–2 дня',
    pill_warranty: 'Официальная гарантия', pill_pricing: 'Оптовые цены',
    wu1_title: 'Локальный склад', wu1_sub: 'Запас в Ташкенте. Заказываете сегодня — отгружаем сегодня.',
    wu2_title: 'Быстрая доставка', wu2_sub: '1–2 дня по Ташкенту. 3–5 дней в любой регион Узбекистана.',
    wu3_title: 'Официальная гарантия', wu3_sub: 'Авторизованный дистрибьютор — полная гарантия производителя на каждый товар.',
    wu4_title: 'Оптовые цены', wu4_sub: 'Гибкий MOQ, конкурентные оптовые условия. Отсрочка для постоянных партнёров.',
    b2bp_eyebrow: 'Для бизнеса', b2bp_h2a: 'Мы — инфраструктура', b2bp_h2b: 'рынка',
    b2bp_sub: 'Гибкие цены и условия отсрочки для надёжных партнёров. Присоединяйтесь к 20+ ритейлерам, которые уже работают с RTXSHOP.',
    b2bp_cta1: 'Получить оптовый прайс', b2bp_cta2: 'Подробнее',
    b2bp_stat1: 'Партнёров-ритейлеров по Узбекистану', b2bp_stat2: 'Официальных бренда', b2bp_stat3: 'Минимальный заказ от 3 единиц',
    moq_label: 'MOQ', moq_val: 'от 3 единиц', moq_price: 'Оптовый прайс по запросу',
    modal_cta: 'Запросить у менеджера',
    bp_hero_eyebrow: 'Официальный дистрибьютор', bp_hero_cta1: 'Стать партнёром', bp_hero_cta2: 'Смотреть товары',
    bp_why_title: 'Почему RTXSHOP?',
    bp_feat1: 'Прямые поставки от производителя', bp_feat2: 'Официальная гарантия', bp_feat3: 'Локальный склад в Ташкенте', bp_feat4: 'Персональный менеджер',
    bp_products_eyebrow: 'Каталог', bp_products_title: 'Популярные товары',
    bp_cta_title: 'Стать дилером', bp_cta_sub: 'Оставьте заявку и получите оптовый прайс в течение 2 часов.',
    partner_page_title: 'Стать партнёром — RTXSHOP',
    partner_eyebrow: 'Партнёрская программа', partner_h1a: 'Станьте', partner_h1b: 'дилером RTXSHOP.',
    partner_sub: 'Заполните форму — наш менеджер свяжется с вами и подберёт индивидуальные условия для вашего бизнеса.',
    pf_name: 'Ваше имя *', pf_company: 'Компания / Магазин *', pf_city: 'Город',
    pf_phone: 'Телефон *', pf_volume: 'Ожидаемый объём в месяц', pf_brands: 'Интересующие бренды',
    pf_messenger: 'Telegram / WhatsApp', pf_message: 'Расскажите о вашем магазине',
    pf_submit: 'Отправить заявку',
    pf_success_title: 'Заявка отправлена!', pf_success_sub: 'Наш менеджер свяжется с вами в течение 2 рабочих часов.',
    pf_volume_ph: 'Например: 50–100 единиц', pf_brands_ph: 'ATK, GravaStar, Arctic, Picun',
    pf_messenger_ph: '@username или +998...',
    partner_why_title: 'Что вы получаете', pw1: 'Оптовые цены напрямую', pw2: 'Эксклюзивные акции для партнёров',
    pw3: 'Маркетинговые материалы', pw4: 'Персональный менеджер 24/7', pw5: 'Официальная гарантия на всё', pw6: 'Отсрочка платежа',
    stock_label: 'В наличии', btn_details: 'Подробнее', btn_request_price: 'Запросить цену',
    colors_label: 'Цвета', form_sending: 'Отправляем...', form_error: 'Ошибка. Попробуйте ещё раз.',
    no_products: 'Ничего не найдено', catalog_error: 'Не удалось загрузить каталог',
    product_interest: 'Интересует: ', catalog_items_label: 'товаров',
    catalog_tag_grava: 'Игровая периферия · sci-fi дизайн', catalog_tag_atk: 'Профессиональные игровые мыши',
    catalog_tag_arctic: 'Системы охлаждения · Европейский бренд', catalog_tag_picun: 'Игровая аудио техника',
    b2b_eyebrow: 'Для магазинов и бизнеса',
    b2b_hero_sub: 'Прямые поставки ATK, GravaStar, Arctic и Picun для вашего магазина. Оптовые цены, официальная гарантия, персональный менеджер.',
    b2b_cta2: 'Смотреть каталог',
    b2c_eyebrow: 'Для покупателей', b2c_h1a: 'Найди оригинальный', b2c_h1b: 'товар рядом.',
    b2c_sub: 'ATK, GravaStar, Arctic и Picun продаются в магазинах по всему Узбекистану. Подпишись на наш канал — первым узнавай о новинках и где купить.',
    b2c_cta1: 'Подписаться в Telegram', b2c_cta2: 'Смотреть каталог',
    b2c_tg_title: 'Telegram-канал RTXSHOP',
    b2c_tg_sub: 'Новинки ATK, GravaStar, Arctic и Picun — первыми. Акции партнёрских магазинов. Где купить в твоём городе. Обзоры и распаковки.',
    b2c_tg_btn: 'Подписаться @iBazzaruz',
    b2c_where_eyebrow: 'Где купить', b2c_where_h2a: 'Магазины', b2c_where_h2b: 'партнёры',
    b2c_where_sub: 'Наши товары продаются в проверенных магазинах. Все точки продают только оригинальную продукцию с гарантией.',
    b2c_coming_soon: 'Скоро новые партнёры', b2c_list_updates: 'Список обновляется',
    b2c_become_store: 'Хотите стать точкой продаж?', b2c_contact_link: 'Свяжитесь с нами →',
    b2c_promo_h2: 'Смотри весь каталог',
    b2c_promo_sub: 'Все модели ATK, GravaStar, Arctic и Picun — фото, характеристики, описания',
    b2c_promo_btn: 'Открыть каталог',
    bp_sell_h2a: 'Продавайте', bp_sell_h2b: 'в своём магазине',
    bp_stat_delivery: 'Доставка по всему Узбекистану', bp_view_all: 'Весь каталог',
    bp_feat1_sub: 'Официальный авторизованный дистрибьютор для рынка Узбекистана',
    bp_feat2_sub: 'Полная гарантия производителя на каждый товар',
    bp_feat3_sub: 'Товары в наличии на складе. Отгрузка в тот же день',
    bp_feat4_sub: 'Личный менеджер для каждого партнёра. Помощь с заказами и гарантийными случаями',
    bp_arctic_sub: 'Европейский эксперт в области охлаждения. Кулеры, термопасты и вентиляторы — поставляем напрямую для магазинов Узбекистана.',
    bp_grava_sub: 'Sci-fi дизайн и топовые характеристики. Колонки, мыши, наушники GravaStar — поставляем напрямую для магазинов Узбекистана.',
    bp_atk_sub: 'Профессиональные игровые мыши с передовыми сенсорами. ATK — выбор профессионалов. Поставляем напрямую для магазинов Узбекистана.',
    bp_picun_sub: 'Игровые наушники и TWS гарнитуры Picun. Качественное звучание — поставляем напрямую для магазинов Узбекистана.',
  },
  uz: {
    nav_about: 'Biz haqimizda', nav_partners: 'Hamkorlar', nav_catalog: 'Katalog',
    nav_services: 'Xizmatlar', nav_faq: 'FAQ', nav_contact: 'Bog\'lanish',
    nav_how: 'Qanday ishlaymiz', nav_contact_short: 'Kontaktlar',
    nav_b2c: 'Xaridorlar uchun', nav_partner: 'Hamkor bo\'lish',
    nav_brands_eyebrow: 'Brendlar',
    picun_cat: 'Audio',
    grava_desc_short: 'Sci-fi dizayn · kolonkalar · sichqonlar',
    atk_desc_short: 'Prof. sensorlar · ergonomika',
    arctic_desc_short: 'Kulerlar · termopasta · ventilatorlar',
    picun_desc_short: 'TWS · o\'yin quloqchinlari',
    tg_label: 'Telegramga yozish',
    sticky_text: 'RTXSHOP hamkori bo\'ling — 2 soat ichida javob beramiz',
    sticky_btn: 'Ariza qoldirish',
    hero_eyebrow: 'O\'zbekistondagi rasmiy distribyutor',
    hero_h1a: 'To\'g\'ridan-to\'g\'ri yetkazib berish', hero_h1b: 'do\'koningiz uchun.',
    hero_sub: 'RTXSHOP OOO — ATK, GravaStar, Arctic va Picun rasmiy distribyutori. O\'yin sichqonlari, periferiya, audio va sovutish tizimlari ulgurji yetkazib beriladi.',
    hero_cta1: 'Hamkor bo\'lish', hero_cta2: 'Katalogni ko\'rish',
    stat_stores: 'Ta do\'kon-hamkor', stat_products: 'Ta mahsulot katalogda',
    stat_brands: 'Rasmiy brend', stat_coverage: 'Mamlakat bo\'ylab', stat_years: 'Yil bozorda',
    ticker_label: 'Rasmiy hamkorlar',
    map_from: 'Jahon brendlari', map_to: 'O\'zbekiston',
    brand_atk: 'O\'yin sichqonlari', brand_grava: 'Periferiya',
    brand_arctic: 'Sovutish', brand_b2b: 'Ulgurji model',
    about_eyebrow: 'Kompaniya haqida',
    about_h2a: 'Jahon brendlari', about_h2b: 'va sizning', about_h2c: 'do\'koningiz', about_h2d: 'o\'rtasidagi ko\'prik',
    about_sub: 'RTXSHOP OOO — ATK, GravaStar, Arctic va Picun mahsulotlarini to\'g\'ridan-to\'g\'ri O\'zbekiston chakana do\'konlariga yetkazib beruvchi rasmiy distribyutor.',
    feat1_title: 'Rasmiy hamkorlik',   feat1_sub: 'ATK, GravaStar va Arctic bilan bevosita shartnomalar — kafolatlangan original mahsulot',
    feat2_title: 'Ulgurji yetkazib berish', feat2_sub: 'O\'zbekiston bo\'ylab do\'konlar bilan ishlaymiz — Toshkentdan viloyatlargacha',
    feat3_title: 'Tezkor logistika',   feat3_sub: 'Omboringizni o\'z vaqtida to\'ldirish uchun yetkazib berish zanjirlari qurilgan',
    partners_eyebrow: 'Hamkorlar',
    partners_h2a: 'Biz vakili bo\'lgan', partners_h2b: 'brendlar',
    partners_sub: 'Biz faqat ishonchli jahon brendlari bilan hamkorlik qilamiz, siz mijozlaringizga eng yaxshisini taklif qilishingiz uchun',
    atk_cat: 'O\'yin sichqonlari', atk_desc: 'Ilg\'or sensorli va ergonomik dizaynli professional o\'yin sichqonlari. Aniqlik talab qiladigan geymerlar tanlovi.',
    grava_cat: 'O\'yin periferiyasi', grava_desc: 'Noyob sci-fi dizayn va yuqori xususiyatlar. Kolonkalar, quloqchinlar, sichqonlar — sizi ajratib turuvchi mahsulotlar.',
    arctic_cat: 'Sovutish tizimlari', arctic_desc: 'Kompyuter sovutish sohasidagi Evropa eksperti. Kulerlar, termopastalar, ventilatorlar.',
    open_site: 'Saytni ochish',
    bsl_eyebrow: 'Eng ko\'p sotiladi', bsl_h2a: 'Eng', bsl_h2b: 'mashhur',
    bsl_sub: 'Katalogimizdan eng talabchan pozitsiyalar — o\'yin periferiyasi va sovutish tizimlari',
    pc_wholesale: 'ulgurji', pc_view_brand: 'Katalogni ko\'rish',
    view_catalog: 'Katalogni ko\'rish',
    catalog_eyebrow: 'Katalog', catalog_h2a: 'Bizning', catalog_h2b: 'katalog',
    catalog_sub: 'Ishlab chiqaruvchidan to\'g\'ridan-to\'g\'ri yetkazib beriladigan mahsulotlar. Narx olish uchun — menejer bilan bog\'laning.',
    catalog_cta_text: 'Individual narx yoki ro\'yxatda yo\'q mahsulot kerakmi?',
    catalog_cta_btn: 'Menejerdan so\'rash',
    services_eyebrow: 'Xizmatlar', services_h2a: 'Biznesingizga', services_h2b: 'kerak bo\'lgan hamma narsa',
    services_sub: 'Biz hamma narsani o\'z zimmamizga olamiz: brendlar bilan muzokaralardan tortib tovarni omboringizga yetkazib berishgacha',
    svc1_title: 'Ulgurji buyurtmalar',     svc1_sub: 'Har qanday o\'lchamdagi do\'konlar uchun moslashuvchan minimal buyurtma shartlari va raqobatbardosh narxlar',
    svc2_title: 'Logistika va yetkazib berish', svc2_sub: 'Tovarni to\'g\'ridan-to\'g\'ri omboringizga yetkazib berishni tashkil etamiz',
    svc3_title: 'Original kafolati',       svc3_sub: 'Barcha mahsulotlar rasmiy ishlab chiqaruvchilardan sertifikatlar bilan yetkazib beriladi',
    svc4_title: 'Marketing qo\'llab-quvvatlash', svc4_sub: 'Brend materiallari: fotosuratlar, tavsiflar, POS-materiallar',
    svc5_title: 'Shaxsiy menejer',        svc5_sub: 'Barcha savollarga tezkor javob berish va buyurtmalar bilan yordam uchun biriktirilgan menejer',
    svc6_title: 'Kafolat xizmati',         svc6_sub: 'Kafolat holatlari va sotilgan tovarlarni texnik xizmat ko\'rsatishda yordam',
    how_eyebrow: 'Qanday ishlaymiz', how_h2a: 'Birinchi yetkazib berishgacha', how_h2b: 'to\'rt qadam',
    step1_title: 'Ariza',          step1_sub: 'Saytda ariza qoldiring yoki bizga to\'g\'ridan-to\'g\'ri yozing — 2 soat ichida javob beramiz',
    step2_title: 'Kelishuv',       step2_sub: 'Assortiment, hajmlar va hamkorlik shartlarini muhokama qilamiz, shartnoma imzolaymiz',
    step3_title: 'To\'lov va buyurtma', step3_sub: 'Tasdiqlangandan so\'ng brenddan to\'g\'ridan-to\'g\'ri buyurtma rasmiylashtiramiz',
    step4_title: 'Yetkazib berish', step4_sub: 'Yetkazib berishni tashkil etamiz va tovarni sizga topshiramiz — sotishga tayyor',
    faq_eyebrow: 'FAQ', faq_h2a: 'Ko\'p', faq_h2b: 'so\'raladigan savollar',
    faq1_q: 'Minimal buyurtma hajmi qancha?',
    faq1_a: 'Minimal buyurtma brend va tovar toifasiga qarab individual tarzda muhokama qilinadi. Ko\'p pozitsiyalar uchun — 3–5 dona dan. Bizga yozing va do\'koningiz uchun shartlarni tanlaymiz.',
    faq2_q: 'Tovar qancha vaqtda yetkaziladi?',
    faq2_a: 'Ombordagi tovar Toshkent bo\'ylab 1–2 ish kunida, O\'zbekiston viloyatlariga 3–5 kun ichida yetkaziladi. Buyurtma asosida muddatlar brendga va joriy qoldiqlarga bog\'liq.',
    faq3_q: 'Qanday to\'lov usullari mavjud?',
    faq3_a: 'Naqd pul, bank o\'tkazmasi va yuridik shaxslar uchun hisob-faktura asosida ishlashimiz mumkin. Doimiy hamkorlar uchun birinchi muvaffaqiyatli bitimlardan so\'ng kechiktirilgan to\'lov mumkin.',
    faq4_q: 'Tovarlar uchun kafolat qanday rasmiylashtiriladi?',
    faq4_a: 'Barcha mahsulotlar ishlab chiqaruvchining rasmiy kafolati bilan yetkaziladi. Kafolat holatlari va servis markazlari bilan o\'zaro munosabatlarni to\'g\'ridan-to\'g\'ri o\'z zimmamizga olamiz.',
    faq5_q: 'O\'zbekistonning qaysi shaharlarida ishlaysizlar?',
    faq5_a: 'Butun O\'zbekiston bo\'ylab ishlaymiz: Toshkent, Samarqand, Buxoro, Andijon, Farg\'ona, Namangan, Nukus va boshqa shaharlar. Yetkazib berish ishonchli logistika hamkorlari orqali tashkil etilgan.',
    contact_eyebrow: 'Kontaktlar', contact_h2a: 'Hamkorlikni', contact_h2b: 'boshlaymizmi?',
    contact_sub: 'Ariza qoldiring — menejerimiz shartlarni muhokama qilish uchun yaqin vaqt ichida siz bilan bog\'lanadi',
    cd1_label: 'Manzil', cd1_val: 'Toshkent, O\'zbekiston',
    cd3_label: 'Ish vaqti', cd3_val: 'Du–Ju: 9:00 — 18:00 (UZT)',
    cd4_label: 'Arizaga javob', cd4_val: '2 ish soati ichida',
    form_title: 'Ariza qoldirish', form_sub: 'Formani to\'ldiring — siz bilan bog\'lanamiz',
    field_name: 'Ismingiz *', field_company: 'Kompaniya / Do\'kon',
    field_phone: 'Telefon *', field_interest: 'Qiziqtirgan brend',
    field_interest_placeholder: 'Brendni tanlang', field_interest_all: 'Barcha toifalar',
    field_message: 'Xabar', field_message_ph: 'Do\'koningiz va qiziqishlaringiz haqida aytib bering...',
    form_submit: 'Ariza yuborish',
    form_success_title: 'Ariza yuborildi', form_success_sub: 'Menejerimiz 2 ish soati ichida siz bilan bog\'lanadi',
    footer_desc: 'O\'zbekistonda ATK, GravaStar va Arctic rasmiy distribyutori. Biznesingiz uchun sifatli texnika yetkazib beramiz.',
    footer_col1: 'Kompaniya', footer_col2: 'Hamkorlar', footer_col3: 'Aloqa',
    footer_partner: 'Hamkor bo\'lish', footer_rights: 'Barcha huquqlar himoyalangan.',
    footer_privacy: 'Maxfiylik siyosati',
    req_btn: 'So\'rash',
    pill_warehouse: 'Mahalliy ombor', pill_delivery: 'Yetkazib berish 1–2 kun',
    pill_warranty: 'Rasmiy kafolat', pill_pricing: 'Ulgurji narxlar',
    wu1_title: 'Mahalliy ombor', wu1_sub: 'Toshkentda zaxira. Bugun buyurtma — bugun jo\'natamiz.',
    wu2_title: 'Tez yetkazib berish', wu2_sub: 'Toshkent bo\'ylab 1–2 kun. O\'zbekistonning istalgan viloyatiga 3–5 kun.',
    wu3_title: 'Rasmiy kafolat', wu3_sub: 'Vakolatli distribyutor — har bir mahsulotga ishlab chiqaruvchining to\'liq kafolati.',
    wu4_title: 'Ulgurji narxlar', wu4_sub: 'Moslashuvchan MOQ, raqobatbardosh ulgurji shartlar. Doimiy hamkorlar uchun kechiktirilgan to\'lov.',
    b2bp_eyebrow: 'Biznes uchun', b2bp_h2a: 'Biz bozor', b2bp_h2b: 'infratuzilmasimiz',
    b2bp_sub: 'Ishonchli hamkorlar uchun moslashuvchan narxlar va kechiktirilgan to\'lov shartlari. RTXSHOP bilan allaqachon ishlaydigan 20+ do\'konga qo\'shiling.',
    b2bp_cta1: 'Ulgurji narxlar ro\'yxatini olish', b2bp_cta2: 'Batafsil',
    b2bp_stat1: 'O\'zbekiston bo\'ylab chakana savdo hamkorlari', b2bp_stat2: 'Rasmiy brend', b2bp_stat3: 'Minimal buyurtma 3 ta dan',
    moq_label: 'MOQ', moq_val: '3 ta dan', moq_price: 'Ulgurji narx so\'rov bo\'yicha',
    modal_cta: 'Menejerdan so\'rash',
    bp_hero_eyebrow: 'Rasmiy distribyutor', bp_hero_cta1: 'Hamkor bo\'lish', bp_hero_cta2: 'Mahsulotlarni ko\'rish',
    bp_why_title: 'Nima uchun RTXSHOP?',
    bp_feat1: 'Ishlab chiqaruvchidan to\'g\'ridan-to\'g\'ri yetkazib berish', bp_feat2: 'Rasmiy kafolat', bp_feat3: 'Toshkentda mahalliy ombor', bp_feat4: 'Shaxsiy menejer',
    bp_products_eyebrow: 'Katalog', bp_products_title: 'Mashhur mahsulotlar',
    bp_cta_title: 'Diler bo\'lish', bp_cta_sub: 'Ariza qoldiring — menejerimiz 2 soat ichida ulgurji narxlar ro\'yxatini yuboradi.',
    partner_page_title: 'Hamkor bo\'lish — RTXSHOP',
    partner_eyebrow: 'Hamkorlik dasturi', partner_h1a: 'RTXSHOP', partner_h1b: 'dileri bo\'ling.',
    partner_sub: 'Formani to\'ldiring — menejerimiz siz bilan bog\'lanadi va biznesingiz uchun individual shartlarni tanlaydi.',
    pf_name: 'Ismingiz *', pf_company: 'Kompaniya / Do\'kon *', pf_city: 'Shahar',
    pf_phone: 'Telefon *', pf_volume: 'Oylik kutilayotgan hajm', pf_brands: 'Qiziqtirgan brendlar',
    pf_messenger: 'Telegram / WhatsApp', pf_message: 'Do\'koningiz haqida aytib bering',
    pf_submit: 'Ariza yuborish',
    pf_success_title: 'Ariza yuborildi!', pf_success_sub: 'Menejerimiz 2 ish soati ichida siz bilan bog\'lanadi.',
    pf_volume_ph: 'Masalan: 50–100 ta', pf_brands_ph: 'ATK, GravaStar, Arctic, Picun',
    pf_messenger_ph: '@username yoki +998...',
    partner_why_title: 'Nima olasiz', pw1: 'To\'g\'ridan-to\'g\'ri ulgurji narxlar', pw2: 'Hamkorlar uchun eksklyuziv aksiyalar',
    pw3: 'Marketing materiallari', pw4: 'Shaxsiy menejer 24/7', pw5: 'Hamma narsaga rasmiy kafolat', pw6: 'Kechiktirilgan to\'lov',
    stock_label: 'Mavjud', btn_details: 'Tafsilotlar', btn_request_price: 'Narx so\'rash',
    colors_label: 'Ranglar', form_sending: 'Yuborilmoqda...', form_error: 'Xatolik. Qayta urining.',
    no_products: 'Hech narsa topilmadi', catalog_error: 'Katalogni yuklab bo\'lmadi',
    product_interest: 'Qiziqadi: ', catalog_items_label: 'ta mahsulot',
    catalog_tag_grava: 'O\'yin periferiyasi · sci-fi dizayn', catalog_tag_atk: 'Professional o\'yin sichqonlari',
    catalog_tag_arctic: 'Sovutish tizimlari · Evropa brendi', catalog_tag_picun: 'O\'yin audio texnikasi',
    b2b_eyebrow: 'Do\'konlar va biznes uchun',
    b2b_hero_sub: 'ATK, GravaStar, Arctic va Picun mahsulotlarini to\'g\'ridan-to\'g\'ri do\'koningizga yetkazib beramiz. Ulgurji narxlar, rasmiy kafolat, shaxsiy menejer.',
    b2b_cta2: 'Katalogni ko\'rish',
    b2c_eyebrow: 'Xaridorlar uchun', b2c_h1a: 'Asl tovarni top', b2c_h1b: 'yaqin atrofingizda.',
    b2c_sub: 'ATK, GravaStar, Arctic va Picun butun O\'zbekiston bo\'ylab do\'konlarda sotiladi. Kanalimizga obuna bo\'ling — yangiliklar haqida birinchi bo\'lib bilib oling.',
    b2c_cta1: 'Telegramga obuna bo\'lish', b2c_cta2: 'Katalogni ko\'rish',
    b2c_tg_title: 'RTXSHOP Telegram kanali',
    b2c_tg_sub: 'ATK, GravaStar, Arctic va Picun yangiliklari — birinchi bo\'lib. Hamkor do\'konlar aksiyalari. Shahringizda qayerdan sotib olish. Sharh va qadoqdan chiqarish.',
    b2c_tg_btn: '@iBazzaruz ga obuna bo\'lish',
    b2c_where_eyebrow: 'Qayerdan sotib olish', b2c_where_h2a: 'Hamkor', b2c_where_h2b: 'do\'konlar',
    b2c_where_sub: 'Mahsulotlarimiz ishonchli do\'konlarda sotiladi. Barcha savdo nuqtalari faqat kafolatli original mahsulot sotadi.',
    b2c_coming_soon: 'Tez orada yangi hamkorlar', b2c_list_updates: 'Ro\'yxat yangilanmoqda',
    b2c_become_store: 'Savdo nuqtasiga aylanmoqchimisiz?', b2c_contact_link: 'Biz bilan bog\'laning →',
    b2c_promo_h2: 'Butun katalogni ko\'ring',
    b2c_promo_sub: 'ATK, GravaStar, Arctic va Picunning barcha modellari — foto, xususiyatlar, tavsiflar',
    b2c_promo_btn: 'Katalogni ochish',
    bp_sell_h2a: 'Soting', bp_sell_h2b: 'o\'z do\'koningizda',
    bp_stat_delivery: 'Butun O\'zbekiston bo\'ylab yetkazib berish', bp_view_all: 'Butun katalog',
    bp_feat1_sub: 'O\'zbekiston bozori uchun rasmiy vakolatli distribyutor',
    bp_feat2_sub: 'Har bir mahsulotga ishlab chiqaruvchining to\'liq kafolati',
    bp_feat3_sub: 'Mahsulotlar omborda mavjud. Buyurtma kuni jo\'natiladi',
    bp_feat4_sub: 'Har bir hamkor uchun shaxsiy menejer. Buyurtmalar va kafolat holatlari bilan yordam',
    bp_arctic_sub: 'Sovutish sohasidagi Evropa eksperti. Kulerlar, termopastalar va ventilatorlar — O\'zbekiston do\'konlariga to\'g\'ridan-to\'g\'ri yetkazib beramiz.',
    bp_grava_sub: 'Sci-fi dizayn va yuqori xususiyatlar. GravaStar kolonkalar, sichqonlar, quloqchinlar — O\'zbekiston do\'konlariga to\'g\'ridan-to\'g\'ri yetkazib beramiz.',
    bp_atk_sub: 'Ilg\'or sensorli professional o\'yin sichqonlari. ATK — professionallar tanlovi. O\'zbekiston do\'konlariga to\'g\'ridan-to\'g\'ri yetkazib beramiz.',
    bp_picun_sub: 'Picun o\'yin quloqchinlari va TWS garnituralar. Sifatli ovoz — O\'zbekiston do\'konlariga to\'g\'ridan-to\'g\'ri yetkazib beramiz.',
  },
  en: {
    nav_about: 'About', nav_partners: 'Partners', nav_catalog: 'Catalog',
    nav_services: 'Services', nav_faq: 'FAQ', nav_contact: 'Contact',
    nav_how: 'How it works', nav_contact_short: 'Contacts',
    nav_b2c: 'For buyers', nav_partner: 'Become a partner',
    nav_brands_eyebrow: 'Brands',
    picun_cat: 'Audio',
    grava_desc_short: 'Sci-fi design · speakers · mice',
    atk_desc_short: 'Pro sensors · ergonomics',
    arctic_desc_short: 'Coolers · thermal paste · fans',
    picun_desc_short: 'TWS · gaming headsets',
    tg_label: 'Write on Telegram',
    sticky_text: 'Become an RTXSHOP partner — reply within 2 hours',
    sticky_btn: 'Submit request',
    hero_eyebrow: 'Official distributor in Uzbekistan',
    hero_h1a: 'Direct supply', hero_h1b: 'for your store.',
    hero_sub: 'RTXSHOP LLC — official distributor of ATK, GravaStar, Arctic and Picun in Uzbekistan. Gaming mice, peripherals, audio and cooling systems wholesale for retailers.',
    hero_cta1: 'Become a partner', hero_cta2: 'View catalog',
    stat_stores: 'Partner stores', stat_products: 'Products in catalog',
    stat_brands: 'Official brands', stat_coverage: 'Nationwide coverage', stat_years: 'Years on market',
    ticker_label: 'Official partners',
    map_from: 'Global brands', map_to: 'Uzbekistan',
    brand_atk: 'Gaming mice', brand_grava: 'Peripherals',
    brand_arctic: 'Cooling', brand_b2b: 'Wholesale model',
    about_eyebrow: 'About us',
    about_h2a: 'Bridge between', about_h2b: 'global', about_h2c: 'brands', about_h2d: 'and your store',
    about_sub: 'RTXSHOP LLC — official distributor of ATK, GravaStar, Arctic and Picun in Uzbekistan. We deliver gaming mice, peripherals, audio and cooling systems directly to retail stores across the country.',
    feat1_title: 'Official partnership', feat1_sub: 'Direct agreements with ATK, GravaStar and Arctic — original products with warranty',
    feat2_title: 'Wholesale supply',     feat2_sub: 'We work with stores throughout Uzbekistan — from Tashkent to the regions',
    feat3_title: 'Fast logistics',       feat3_sub: 'Established supply chains for timely restocking of your warehouse',
    partners_eyebrow: 'Partners',
    partners_h2a: 'Brands we', partners_h2b: 'represent',
    partners_sub: 'We work only with proven global brands so you can offer your customers the best',
    atk_cat: 'Gaming mice', atk_desc: 'Professional gaming mice with advanced sensors and ergonomic design. The choice of gamers who demand precision.',
    grava_cat: 'Gaming peripherals', grava_desc: 'Unique sci-fi design and top-tier specs. Speakers, headphones, mice — products that set you apart.',
    arctic_cat: 'Cooling systems', arctic_desc: 'European expert in cooling. Coolers, thermal paste, fans — silence and efficiency in one.',
    open_site: 'Open website',
    bsl_eyebrow: 'Best sellers', bsl_h2a: 'Most', bsl_h2b: 'popular',
    bsl_sub: 'Top positions from our catalog — gaming peripherals and cooling systems',
    pc_wholesale: 'wholesale', pc_view_brand: 'View catalog',
    view_catalog: 'View catalog',
    catalog_eyebrow: 'Catalog', catalog_h2a: 'Our', catalog_h2b: 'catalog',
    catalog_sub: 'Products we supply directly from manufacturers. For pricing — contact our manager.',
    catalog_cta_text: 'Need a custom price or a product not in the list?',
    catalog_cta_btn: 'Ask the manager',
    services_eyebrow: 'Services', services_h2a: 'Everything your', services_h2b: 'business needs',
    services_sub: 'We handle everything: from negotiations with brands to delivery to your warehouse',
    svc1_title: 'Wholesale orders',        svc1_sub: 'Flexible minimum order terms and competitive wholesale prices for stores of any size',
    svc2_title: 'Logistics & delivery',    svc2_sub: 'We organize delivery directly to your warehouse. Shipment tracking at every stage',
    svc3_title: 'Authenticity guarantee',  svc3_sub: 'All products are supplied directly from official manufacturers with certificates of authenticity',
    svc4_title: 'Marketing support',       svc4_sub: 'We provide brand materials: photos, descriptions, POS materials for your store',
    svc5_title: 'Personal manager',        svc5_sub: 'A dedicated manager for prompt resolution of all issues and order assistance',
    svc6_title: 'Warranty service',        svc6_sub: 'Help with warranty cases and maintenance of sold products',
    how_eyebrow: 'How it works', how_h2a: 'Four steps to', how_h2b: 'your first delivery',
    step1_title: 'Request',        step1_sub: 'Submit a request on the site or write to us directly — we reply within 2 hours',
    step2_title: 'Agreement',      step2_sub: 'We discuss the assortment, volumes and cooperation terms, then sign a contract',
    step3_title: 'Payment & order',step3_sub: 'We place the order directly with the brand after confirmation',
    step4_title: 'Delivery',       step4_sub: 'We organize delivery and hand over the goods — ready for sale',
    faq_eyebrow: 'FAQ', faq_h2a: 'Frequently', faq_h2b: 'asked questions',
    faq1_q: 'What is the minimum order quantity?',
    faq1_a: 'The minimum order is discussed individually depending on the brand and product category. For most items — from 3–5 units. Write to us and we will find the right terms for your store.',
    faq2_q: 'How fast is delivery?',
    faq2_a: 'In-stock items are delivered within Tashkent in 1–2 business days, to other regions of Uzbekistan in 3–5 days. Made-to-order timelines depend on the brand and current inventory.',
    faq3_q: 'What payment methods are available?',
    faq3_a: 'We work with bank transfer (invoice for legal entities), cash and wire transfer. Deferred payment is possible for regular partners after the first successful deals.',
    faq4_q: 'How is the product warranty handled?',
    faq4_a: 'All products come with an official manufacturer warranty. We handle warranty cases and work directly with service centers on your behalf.',
    faq5_q: 'Which cities in Uzbekistan do you cover?',
    faq5_a: 'We operate throughout Uzbekistan: Tashkent, Samarkand, Bukhara, Andijan, Fergana, Namangan, Nukus and other cities. Delivery is organized through reliable logistics partners.',
    contact_eyebrow: 'Contacts', contact_h2a: 'Ready to', contact_h2b: 'start?',
    contact_sub: 'Submit a request and our manager will contact you shortly to discuss the terms',
    cd1_label: 'Address', cd1_val: 'Tashkent, Uzbekistan',
    cd3_label: 'Working hours', cd3_val: 'Mon–Fri: 9:00 — 18:00 (UZT)',
    cd4_label: 'Response time', cd4_val: 'Within 2 business hours',
    form_title: 'Submit request', form_sub: 'Fill in the form — we will get in touch',
    field_name: 'Your name *', field_company: 'Company / Store',
    field_phone: 'Phone *', field_interest: 'Brand of interest',
    field_interest_placeholder: 'Select brand', field_interest_all: 'All categories',
    field_message: 'Message', field_message_ph: 'Tell us about your store and what you are interested in...',
    form_submit: 'Submit request',
    form_success_title: 'Request submitted', form_success_sub: 'Our manager will contact you within 2 business hours',
    footer_desc: 'Official distributor of ATK, GravaStar and Arctic in Uzbekistan. Quality tech supply for your business.',
    footer_col1: 'Company', footer_col2: 'Partners', footer_col3: 'Contact',
    footer_partner: 'Become a partner', footer_rights: 'All rights reserved.',
    footer_privacy: 'Privacy policy',
    req_btn: 'Request',
    pill_warehouse: 'Local warehouse', pill_delivery: '1–2 day delivery',
    pill_warranty: 'Official warranty', pill_pricing: 'Bulk pricing',
    wu1_title: 'Local Warehouse', wu1_sub: 'Stock in Tashkent. Order today, ship today.',
    wu2_title: 'Fast Delivery', wu2_sub: '1–2 days in Tashkent. 3–5 days to any region of Uzbekistan.',
    wu3_title: 'Official Warranty', wu3_sub: 'Authorized distributor — full manufacturer warranty on every product.',
    wu4_title: 'Bulk Pricing', wu4_sub: 'Flexible MOQ, competitive wholesale rates. Credit terms for trusted partners.',
    b2bp_eyebrow: 'For business', b2bp_h2a: 'We are the infrastructure', b2bp_h2b: 'of the market',
    b2bp_sub: 'Flexible pricing & credit terms for trusted partners. Join 20+ retailers already working with RTXSHOP.',
    b2bp_cta1: 'Get wholesale price list', b2bp_cta2: 'Learn more',
    b2bp_stat1: 'Retail partners across Uzbekistan', b2bp_stat2: 'Official brand licenses', b2bp_stat3: 'Minimum order from 3 units',
    moq_label: 'MOQ', moq_val: 'from 3 units', moq_price: 'Wholesale price on request',
    modal_cta: 'Request from manager',
    bp_hero_eyebrow: 'Official distributor', bp_hero_cta1: 'Become a partner', bp_hero_cta2: 'View products',
    bp_why_title: 'Why RTXSHOP?',
    bp_feat1: 'Direct supply from manufacturer', bp_feat2: 'Official warranty', bp_feat3: 'Local warehouse in Tashkent', bp_feat4: 'Personal manager',
    bp_products_eyebrow: 'Catalog', bp_products_title: 'Popular products',
    bp_cta_title: 'Become a dealer', bp_cta_sub: 'Submit a request and get a wholesale price list within 2 hours.',
    partner_page_title: 'Become a partner — RTXSHOP',
    partner_eyebrow: 'Partner program', partner_h1a: 'Become an', partner_h1b: 'RTXSHOP dealer.',
    partner_sub: 'Fill in the form — our manager will contact you and offer individual terms for your business.',
    pf_name: 'Your name *', pf_company: 'Company / Store *', pf_city: 'City',
    pf_phone: 'Phone *', pf_volume: 'Expected monthly volume', pf_brands: 'Brands of interest',
    pf_messenger: 'Telegram / WhatsApp', pf_message: 'Tell us about your store',
    pf_submit: 'Submit request',
    pf_success_title: 'Request submitted!', pf_success_sub: 'Our manager will contact you within 2 business hours.',
    pf_volume_ph: 'e.g. 50–100 units', pf_brands_ph: 'ATK, GravaStar, Arctic, Picun',
    pf_messenger_ph: '@username or +998...',
    partner_why_title: 'What you get', pw1: 'Direct wholesale pricing', pw2: 'Exclusive partner promotions',
    pw3: 'Marketing materials', pw4: 'Personal manager 24/7', pw5: 'Official warranty on everything', pw6: 'Deferred payment terms',
    stock_label: 'In stock', btn_details: 'Details', btn_request_price: 'Request price',
    colors_label: 'Colors', form_sending: 'Sending...', form_error: 'Error. Please try again.',
    no_products: 'Nothing found', catalog_error: 'Failed to load catalog',
    product_interest: 'Interested in: ', catalog_items_label: 'items',
    catalog_tag_grava: 'Gaming peripherals · sci-fi design', catalog_tag_atk: 'Professional gaming mice',
    catalog_tag_arctic: 'Cooling systems · European brand', catalog_tag_picun: 'Gaming audio gear',
    b2b_eyebrow: 'For stores and businesses',
    b2b_hero_sub: 'Direct supply of ATK, GravaStar, Arctic and Picun for your store. Wholesale pricing, official warranty, personal manager.',
    b2b_cta2: 'View catalog',
    b2c_eyebrow: 'For buyers', b2c_h1a: 'Find the original', b2c_h1b: 'product nearby.',
    b2c_sub: 'ATK, GravaStar, Arctic and Picun are sold in stores across Uzbekistan. Subscribe to our channel — be the first to know about new arrivals and where to buy.',
    b2c_cta1: 'Subscribe on Telegram', b2c_cta2: 'View catalog',
    b2c_tg_title: 'RTXSHOP Telegram Channel',
    b2c_tg_sub: 'ATK, GravaStar, Arctic and Picun news — first. Partner store deals. Where to buy in your city. Reviews and unboxings.',
    b2c_tg_btn: 'Subscribe @iBazzaruz',
    b2c_where_eyebrow: 'Where to buy', b2c_where_h2a: 'Partner', b2c_where_h2b: 'stores',
    b2c_where_sub: 'Our products are sold at trusted stores. All outlets sell only original products with warranty.',
    b2c_coming_soon: 'New partners coming soon', b2c_list_updates: 'List is updating',
    b2c_become_store: 'Want to become a sales point?', b2c_contact_link: 'Contact us →',
    b2c_promo_h2: 'Browse the full catalog',
    b2c_promo_sub: 'All ATK, GravaStar, Arctic and Picun models — photos, specs, descriptions',
    b2c_promo_btn: 'Open catalog',
    bp_sell_h2a: 'Sell', bp_sell_h2b: 'in your store',
    bp_stat_delivery: 'Nationwide delivery', bp_view_all: 'Full catalog',
    bp_feat1_sub: 'Official authorized distributor for the Uzbekistan market',
    bp_feat2_sub: 'Full manufacturer warranty on every product',
    bp_feat3_sub: 'Items in stock. Same-day dispatch',
    bp_feat4_sub: 'Personal manager for every partner. Help with orders and warranty cases',
    bp_arctic_sub: 'European expert in cooling. Coolers, thermal paste and fans — supplied directly to Uzbekistan stores.',
    bp_grava_sub: 'Sci-fi design and top specs. GravaStar speakers, mice, headphones — supplied directly to Uzbekistan stores.',
    bp_atk_sub: 'Professional gaming mice with advanced sensors. ATK — the professional\'s choice. Supplied directly to Uzbekistan stores.',
    bp_picun_sub: 'Picun gaming headphones and TWS headsets. Quality sound — supplied directly to Uzbekistan stores.',
  },
};

let currentLang = localStorage.getItem('rtx_lang') || 'ru';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('rtx_lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (T[lang][key]) el.textContent = T[lang][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (T[lang][key]) el.placeholder = T[lang][key];
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // re-render catalog labels
  if (window._catalogProducts) renderCatalog(window._catalogProducts, window._activeTab);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// ======= NAVBAR SCROLL =======
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ======= MOBILE MENU =======
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = mobileMenu.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

// ======= REVEAL ON SCROLL =======
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ======= STICKY CTA =======
const stickyCta = document.getElementById('stickyCta');
if (stickyCta) {
  let _stickyRaf = false;
  window.addEventListener('scroll', () => {
    if (_stickyRaf) return;
    _stickyRaf = true;
    requestAnimationFrame(() => {
      if (window.scrollY > window.innerHeight * 0.6) stickyCta.classList.add('visible');
      else stickyCta.classList.remove('visible');
      _stickyRaf = false;
    });
  }, { passive: true });
}

// ======= UTILS =======
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Return a sized variant of a product image URL.
 * size: 'sm' (400px), 'md' (800px), or 'full' (original).
 * Only applies to /img/products/ URLs.
 */
function imgUrl(url, size) {
  if (!url || size === 'full') return url;
  if (!url.includes('/img/products/')) return url;
  return url.replace(/(\.[^./?#]+)(\?.*)?$/, `-${size}.webp`);
}

// ======= CATALOG =======
let _catalogAll  = [];   // curated product list from /api/catalog
let _activeTab   = 'GravaStar';
let _searchQuery = '';

// ── Icons (fallback when no image) ──
const BRAND_ICON = {
  GravaStar: `<svg width="52" height="60" viewBox="0 0 48 56" fill="none"><path d="M24 4C13.5 4 5 12.5 5 23v10c0 10.5 8.5 19 19 19s19-8.5 19-19V23C43 12.5 34.5 4 24 4z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4"/><line x1="24" y1="4" x2="24" y2="28" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25"/><rect x="18" y="32" width="12" height="9" rx="4" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1" stroke-opacity="0.3"/></svg>`,
  ATK: `<svg width="52" height="60" viewBox="0 0 48 56" fill="none"><path d="M24 4C13.5 4 5 12.5 5 23v10c0 10.5 8.5 19 19 19s19-8.5 19-19V23C43 12.5 34.5 4 24 4z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4"/><line x1="24" y1="4" x2="24" y2="28" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25"/><rect x="18" y="32" width="12" height="9" rx="4" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1" stroke-opacity="0.3"/></svg>`,
  Arctic: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="22" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4"/><circle cx="28" cy="28" r="12" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25"/><circle cx="28" cy="28" r="4" fill="currentColor" fill-opacity="0.2"/><path d="M28 6 Q33 15 28 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-opacity="0.45"/><path d="M50 28 Q41 33 36 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-opacity="0.45"/><path d="M28 50 Q23 41 28 36" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-opacity="0.45"/><path d="M6 28 Q15 23 20 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-opacity="0.45"/></svg>`,
  Picun: `<svg width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M8 26c0-9.9 8.1-18 18-18s18 8.1 18 18" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4" stroke-linecap="round"/><rect x="4" y="24" width="8" height="12" rx="4" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4"/><rect x="40" y="24" width="8" height="12" rx="4" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4"/></svg>`,
};

const BRAND_TAG = {
  GravaStar: 'Игровая периферия · sci-fi дизайн',
  ATK:       'Профессиональные игровые мыши',
  Arctic:    'Системы охлаждения · Европейский бренд',
  Picun:     'Игровая аудио техника',
};

const BRAND_CATS = ['GravaStar', 'ATK', 'Picun', 'Arctic'];

// ── Bestsellers carousel ──
const BSL_IDS = [
  'gs-v60pro', 'atk-ag9air', 'atk-ag9ult', 'arctic-lf3pro360',
  'gs-m1pro', 'gs-v75pro', 'atk-z1ult', 'gs-x', 'atk-ng9pro', 'arctic-freezer36'
];

let _bslIdx = 0;

function _bslVisible() {
  if (window.innerWidth >= 1100) return 4;
  if (window.innerWidth >= 480)  return 2;
  return 1;
}

function _bslUpdateState(total) {
  const vis      = _bslVisible();
  const positions = Math.max(1, total - vis + 1);
  document.querySelectorAll('.bsl-dot').forEach((d, i) => d.classList.toggle('active', i === _bslIdx));
}

function _isMobileCarousel() { return window.innerWidth < 480; }

function _bslApply(grid) {
  if (_isMobileCarousel()) {
    // Mobile: native scroll-snap — scrollTo the card position
    const wrap = grid.parentElement;
    const card = grid.querySelector('.bsl-card');
    if (!card) return;
    const step = card.offsetWidth + 20; // card + gap
    wrap.scrollTo({ left: _bslIdx * step, behavior: 'smooth' });
  } else {
    // Desktop: translateX
    const card = grid.querySelector('.bsl-card');
    if (!card) return;
    const step = card.offsetWidth + 20;
    grid.style.transform = `translateX(-${_bslIdx * step}px)`;
  }
}

function bslNav(dir) {
  const grid = document.getElementById('bslGrid');
  if (!grid || !grid.querySelector('.bsl-card')) return;
  const total     = grid.querySelectorAll('.bsl-card').length;
  const vis       = _bslVisible();
  const positions = Math.max(1, total - vis + 1);
  _bslIdx = ((_bslIdx + dir) % positions + positions) % positions;
  _bslApply(grid);
  _bslUpdateState(total);
}

function bslGoTo(idx) {
  const grid = document.getElementById('bslGrid');
  if (!grid || !grid.querySelector('.bsl-card')) return;
  const total     = grid.querySelectorAll('.bsl-card').length;
  const vis       = _bslVisible();
  const positions = Math.max(1, total - vis + 1);
  _bslIdx = ((idx % positions) + positions) % positions;
  _bslApply(grid);
  _bslUpdateState(total);
}

window.addEventListener('resize', () => {
  const grid = document.getElementById('bslGrid');
  if (!grid || !grid.querySelector('.bsl-card')) return;
  const total     = grid.querySelectorAll('.bsl-card').length;
  const vis       = _bslVisible();
  const positions = Math.max(1, total - vis + 1);
  _bslIdx = _bslIdx % positions;
  // On resize from mobile to desktop restore transform
  if (!_isMobileCarousel()) grid.parentElement.scrollLeft = 0;
  _bslApply(grid);
  _bslUpdateState(total);
});

// ── Mobile scroll-snap: sync dots on scroll ──
(function () {
  let _scrollTimer;
  const wrap = document.querySelector('.bsl-track-wrap');
  if (!wrap) return;
  wrap.addEventListener('scroll', () => {
    if (!_isMobileCarousel()) return;
    clearTimeout(_scrollTimer);
    _scrollTimer = setTimeout(() => {
      const card = wrap.querySelector('.bsl-card');
      if (!card) return;
      const step = card.offsetWidth + 20;
      _bslIdx = Math.round(wrap.scrollLeft / step);
      const total = wrap.querySelectorAll('.bsl-card').length;
      _bslUpdateState(total);
    }, 80);
  }, { passive: true });
})();

function renderBestsellers() {
  const grid = document.getElementById('bslGrid');
  if (!grid) return;
  const items = BSL_IDS.map(id => _catalogAll.find(p => p.id === id)).filter(Boolean);
  if (!items.length) { grid.innerHTML = ''; return; }

  _bslIdx = 0;
  grid.style.transform = '';

  grid.innerHTML = items.map((p, i) => {
    const badge = p.badge
      ? `<span class="bpc-badge bpc-badge--${escHtml(p.badge.toLowerCase())}">${escHtml(p.badge)}</span>` : '';
    const imgHtml = p.image_url
      ? `<img src="${escHtml(imgUrl(p.image_url, 'sm'))}" alt="${escHtml(p.name)}" loading="lazy" width="400" height="400" />`
      : `<div class="bpc-img-icon">${BRAND_ICON[p.brand] || BRAND_ICON.GravaStar}</div>`;
    const colorDots = p.colors?.length
      ? `<div class="bpc-colors">${p.colors.map(c =>
          `<span class="bpc-color bpc-color--${escHtml(c.toLowerCase().replace(/\s/g,'-'))}" title="${escHtml(c)}"></span>`
        ).join('')}</div>` : '';
    const specEntries = Object.entries(p.specs || {}).slice(0, 3);
    const specsHtml = specEntries.length
      ? `<div class="bsl-specs">${specEntries.map(([k,v]) =>
          `<div class="bsl-spec"><span class="bsl-spec-v">${escHtml(v)}</span><span class="bsl-spec-k">${escHtml(k)}</span></div>`
        ).join('')}</div>` : '';
    return `<div class="bpc bsl-card" onclick="openProductModal('${escHtml(p.id)}')">
      <div class="bpc-img">${badge}<span class="bpc-stock">${T[currentLang].stock_label}</span>${imgHtml}</div>
      <div class="bpc-body">
        <div class="bpc-type">${escHtml(p.brand)} · ${escHtml(p.category)}</div>
        <div class="bpc-name">${escHtml(p.name)}</div>
        ${specsHtml}
        ${colorDots}
        <div class="bpc-actions" onclick="event.stopPropagation()">
          <button class="bpc-btn bpc-btn--info" onclick="openProductModal('${escHtml(p.id)}')">${T[currentLang].btn_details}</button>
          <a href="/b2b#contact" class="bpc-btn bpc-btn--price">${T[currentLang].btn_request_price}</a>
        </div>
      </div>
    </div>`;
  }).join('');

  // Dots
  const dotsEl = document.getElementById('bslDots');
  if (dotsEl) {
    const positions = Math.max(1, items.length - _bslVisible() + 1);
    dotsEl.innerHTML = Array.from({ length: positions }, (_, i) =>
      `<button class="bsl-dot${i === 0 ? ' active' : ''}" onclick="bslGoTo(${i})" aria-label="Слайд ${i+1}"></button>`
    ).join('');
  }

  _bslUpdateState(items.length);
}

// ── Load curated catalog once ──
async function loadCatalog() {
  const body = document.getElementById('catalogBody');
  if (body) body.innerHTML = '<div class="catalog-loading"><div class="catalog-spinner"></div></div>';
  try {
    const cached = sessionStorage.getItem('rtx_catalog');
    if (cached) {
      _catalogAll = JSON.parse(cached);
    } else {
      const r = await fetch('/api/catalog');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      _catalogAll = await r.json();
      try { sessionStorage.setItem('rtx_catalog', JSON.stringify(_catalogAll)); } catch {}
    }
    // Apply ?brand= from URL if set before main.js loaded
    if (window._initBrand) {
      const tab = document.querySelector(`.cat-tab[data-cat="${window._initBrand}"]`);
      if (tab) { document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); _activeTab = window._initBrand; }
    }
    renderCatalog();
    renderBestsellers();
  } catch {
    body.innerHTML = `<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:14px;">${T[currentLang].catalog_error}</div>`;
  }
}

// ── Render catalog (tab or search) ──
function renderCatalog() {
  const body = document.getElementById('catalogBody');
  if (!body) return;
  const q    = _searchQuery.toLowerCase().trim();

  let products = _catalogAll;
  if (!q) {
    products = products.filter(p => p.brand === _activeTab);
  } else {
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q)
    );
  }

  if (!products.length) {
    body.innerHTML = `<div style="padding:60px;text-align:center;color:var(--text-muted);font-size:14px;">${T[currentLang].no_products}</div>`;
    return;
  }

  // Group by category
  const groups = {};
  products.forEach(p => {
    const key = q ? `${p.brand} · ${p.category}` : p.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  const multiGroup = Object.keys(groups).length > 1;
  const BRAND_TAG_KEY = { GravaStar: 'catalog_tag_grava', ATK: 'catalog_tag_atk', Arctic: 'catalog_tag_arctic', Picun: 'catalog_tag_picun' };
  const tag  = T[currentLang][BRAND_TAG_KEY[_activeTab]] || BRAND_TAG[_activeTab] || '';
  const cnt  = products.length;

  let html = '';
  if (!q) {
    const cntLabel = currentLang === 'ru'
      ? (cnt === 1 ? 'товар' : cnt < 5 ? 'товара' : 'товаров')
      : (T[currentLang].catalog_items_label || 'items');
    html += `<div class="brand-catalog-header">
      <div class="bch-top">
        <div class="brand-catalog-logo">${_activeTab}</div>
        <span class="brand-catalog-count">${cnt} ${cntLabel}</span>
      </div>
      <span class="brand-catalog-tag">${tag}</span>
    </div>`;
  }

  Object.entries(groups).forEach(([group, items]) => {
    if (multiGroup) html += `<div class="catalog-sub-header">${group}</div>`;
    html += '<div class="brand-photo-grid">';
    items.forEach(p => {
      const badge = p.badge
        ? `<span class="bpc-badge bpc-badge--${escHtml(p.badge.toLowerCase())}">${escHtml(p.badge)}</span>` : '';
      const imgHtml = p.image_url
        ? `<img src="${escHtml(imgUrl(p.image_url, 'sm'))}" alt="${escHtml(p.name)}" loading="lazy" width="400" height="400" />`
        : `<div class="bpc-img-icon">${BRAND_ICON[p.brand] || BRAND_ICON.GravaStar}</div>`;
      const colorDots = p.colors?.length
        ? `<div class="bpc-colors">${p.colors.map(c =>
            `<span class="bpc-color bpc-color--${escHtml(c.toLowerCase().replace(/\s/g,'-'))}" title="${escHtml(c)}"></span>`
          ).join('')}</div>` : '';
      const specEntries = Object.entries(p.specs || {}).slice(0, 3);
      const specsHtml = specEntries.length
        ? `<div class="bpc-specs">${specEntries.map(([k,v]) =>
            `<div class="bpc-spec"><span class="bpc-spec-v">${escHtml(v)}</span><span class="bpc-spec-k">${escHtml(k)}</span></div>`
          ).join('')}</div>` : '';
      html += `<div class="bpc" onclick="openProductModal('${escHtml(p.id)}')">
        <div class="bpc-img">${badge}<span class="bpc-stock">${T[currentLang].stock_label}</span>${imgHtml}</div>
        <div class="bpc-body">
          <div class="bpc-type">${escHtml(p.category)}</div>
          <div class="bpc-name">${escHtml(p.name)}</div>
          ${specsHtml}
          ${colorDots}
          <div class="bpc-actions" onclick="event.stopPropagation()">
            <button class="bpc-btn bpc-btn--info" onclick="openProductModal('${escHtml(p.id)}')">${T[currentLang].btn_details}</button>
            <a href="/b2b#contact" class="bpc-btn bpc-btn--price">${T[currentLang].btn_request_price}</a>
          </div>
        </div>
      </div>`;
    });
    html += '</div>';
  });

  body.innerHTML = html;
}

// ── Tab switching ──
function showBrandCatalog(brand) {
  const section = document.getElementById('catalog');
  if (!section) return;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  const tab = document.querySelector(`.cat-tab[data-cat="${brand}"]`);
  if (tab) tab.classList.add('active');
  _activeTab = brand;
  _searchQuery = '';
  const si = document.getElementById('catalogSearch');
  if (si) si.value = '';
  document.getElementById('searchClear')?.classList.remove('visible');
  renderCatalog();
  const top = section.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    _activeTab = tab.dataset.cat;
    _searchQuery = '';
    const si = document.getElementById('catalogSearch');
    if (si) si.value = '';
    document.getElementById('searchClear')?.classList.remove('visible');
    renderCatalog();
  });
});

// ── Search ──
const searchInput = document.getElementById('catalogSearch');
const searchClear = document.getElementById('searchClear');

if (searchInput) {
  let _searchDebounce;
  searchInput.addEventListener('input', () => {
    _searchQuery = searchInput.value;
    searchClear?.classList.toggle('visible', !!_searchQuery);
    clearTimeout(_searchDebounce);
    _searchDebounce = setTimeout(renderCatalog, 200);
  });
}

function clearSearch() {
  _searchQuery = '';
  if (searchInput) searchInput.value = '';
  searchClear?.classList.remove('visible');
  renderCatalog();
}

// ── Product modal ──
let _pmImages = [];
let _pmActive = 0;

function _pmSetActive(idx) {
  _pmActive = idx;
  const main = document.getElementById('pmGalleryMain');
  if (!main) return;
  const url = _pmImages[idx];
  const altName = main.dataset.name || '';
  main.innerHTML = url
    ? `<img src="${imgUrl(url, 'md')}" alt="${altName}" onclick="openLightbox(${idx})" loading="lazy" />
       <button class="pm-zoom-btn" onclick="openLightbox(${idx})" aria-label="Увеличить">
         <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0l.01.01M10 8v6m-3-3h6"/></svg>
       </button>`
    : `<div class="pm-img-placeholder">${BRAND_ICON.GravaStar}</div>`;
  document.querySelectorAll('.pm-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
}

function openProductModal(id) {
  const p = _catalogAll.find(pr => pr.id === id);
  if (!p) return;

  const modal = document.getElementById('productModal');

  // Gallery
  _pmImages = (p.images?.length ? p.images : [p.image_url]).filter(Boolean);
  _pmActive = 0;
  const main = document.getElementById('pmGalleryMain');
  const thumbsEl = document.getElementById('pmGalleryThumbs');
  if (main) main.dataset.name = p.name.replace(/"/g, '&quot;');

  // Thumbnails (only if >1 image)
  if (thumbsEl) {
    if (_pmImages.length > 1) {
      thumbsEl.style.display = '';
      thumbsEl.innerHTML = _pmImages.map((url, i) =>
        `<button class="pm-thumb${i === 0 ? ' active' : ''}" onclick="_pmSetActive(${i})" aria-label="Фото ${i+1}">
          <img src="${imgUrl(url, 'sm')}" alt="Фото ${i+1}" loading="lazy" />
        </button>`
      ).join('');
    } else {
      thumbsEl.style.display = 'none';
      thumbsEl.innerHTML = '';
    }
  }
  _pmSetActive(0);

  // Header info
  modal.querySelector('.pm-badge').innerHTML = p.badge
    ? `<span class="bpc-badge bpc-badge--${p.badge.toLowerCase()}" style="font-size:11px;padding:3px 9px;">${p.badge}</span>` : '';
  modal.querySelector('.pm-brand').textContent = `${p.brand} · ${p.category}`;
  modal.querySelector('.pm-name').textContent  = p.name;

  // Colors
  const colWrap = modal.querySelector('.pm-colors-wrap');
  if (p.colors?.length) {
    colWrap.style.display = '';
    colWrap.innerHTML = `<div class="pm-colors-label">${T[currentLang].colors_label}:</div>
      <div class="pm-colors">${p.colors.map(c =>
        `<span class="pm-color"><span class="pm-color-dot pm-color--${c.toLowerCase().replace(/\s/g,'-')}"></span>${c}</span>`
      ).join('')}</div>`;
  } else {
    colWrap.style.display = 'none';
  }

  // Specs
  const specsEl = modal.querySelector('.pm-specs');
  if (p.specs && Object.keys(p.specs).length) {
    specsEl.style.display = '';
    specsEl.innerHTML = Object.entries(p.specs).map(([k, v]) =>
      `<div class="pm-spec-row"><span class="pm-spec-k">${k}</span><span class="pm-spec-v">${v}</span></div>`
    ).join('');
  } else {
    specsEl.style.display = 'none';
  }

  // Desc
  const descEl = modal.querySelector('.pm-desc');
  if (p.desc) { descEl.textContent = p.desc; descEl.style.display = ''; }
  else descEl.style.display = 'none';

  // CTA
  modal.querySelector('.pm-cta-btn').onclick = () => { closeProductModal(); requestProduct(p.name); };

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Lightbox ──
function openLightbox(idx) {
  if (!_pmImages.length) return;
  _pmActive = idx;
  const lb = document.getElementById('pmLightbox');
  const wrap = document.getElementById('pmLightboxImg');
  if (!lb || !wrap) return;
  wrap.innerHTML = `<img src="${_pmImages[idx]}" alt="Фото ${idx+1}" />`;
  lb.classList.add('open');
  document.getElementById('pmLightbox').querySelector('.pm-lightbox-prev').style.display = _pmImages.length > 1 ? '' : 'none';
  document.getElementById('pmLightbox').querySelector('.pm-lightbox-next').style.display = _pmImages.length > 1 ? '' : 'none';
}

function closeLightbox() {
  document.getElementById('pmLightbox')?.classList.remove('open');
}

function pmLightboxNav(dir) {
  if (!_pmImages.length) return;
  _pmActive = (_pmActive + dir + _pmImages.length) % _pmImages.length;
  const wrap = document.getElementById('pmLightboxImg');
  if (wrap) wrap.innerHTML = `<img src="${_pmImages[_pmActive]}" alt="Фото ${_pmActive+1}" />`;
  _pmSetActive(_pmActive);
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('pmLightbox')?.classList.contains('open')) closeLightbox();
    else closeProductModal();
  }
  if (e.key === 'ArrowLeft') pmLightboxNav(-1);
  if (e.key === 'ArrowRight') pmLightboxNav(1);
});

// ── Contact form prefill ──
function requestProduct(name) {
  const msg      = document.getElementById('message');
  const interest = document.getElementById('interest');
  if (msg) msg.value = `${T[currentLang].product_interest}${name}`;
  if (interest) interest.value = '';
  const contact = document.getElementById('contact');
  if (contact) {
    window.scrollTo({ top: contact.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    setTimeout(() => msg?.focus(), 600);
  }
}

// ======= FAQ =======
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const ans  = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-a').style.maxHeight = '0';
  });
  if (!isOpen) {
    item.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }
}

// ======= CONTACT FORM =======
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      name:     form.name.value.trim(),
      company:  form.company.value.trim(),
      phone:    form.phone.value.trim(),
      email:    form.email.value.trim(),
      message:  form.message.value.trim(),
    };
    if (!data.name || !data.phone) return;
    submitBtn.disabled = true;
    submitText.textContent = T[currentLang].form_sending;
    try {
      const res    = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (result.success) {
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      } else throw new Error(result.error);
    } catch {
      submitBtn.disabled = false;
      submitText.textContent = T[currentLang].form_submit;
      showNotification(T[currentLang].form_error, 'error');
    }
  });
}

// ======= NOTIFICATION =======
function showNotification(msg, type = 'info') {
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);z-index:9999;background:${type === 'error' ? '#ff3b30' : '#0071e3'};color:white;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:500;font-family:Inter,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,0.4);transition:transform 0.3s cubic-bezier(.4,0,.2,1);white-space:nowrap;`;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => { el.style.transform = 'translateX(-50%) translateY(100px)'; setTimeout(() => el.remove(), 400); }, 3500);
}

// ======= SMOOTH SCROLL =======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' }); }
  });
});

// ======= PHONE MASK =======
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', e => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('998')) val = '+998 ' + val.slice(3,5) + ' ' + val.slice(5,8) + ' ' + val.slice(8,10) + ' ' + val.slice(10,12);
    e.target.value = val.trim();
  });
}

// ======= HERO COUNTERS =======
function animateCounter(el, target, suffix = '', duration = 1600) {
  const start = performance.now();
  const isPlus = suffix.includes('+');
  const cleanSuffix = suffix.replace('+', '');
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease out expo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value = Math.round(ease * target);
    el.textContent = value + (isPlus && value >= target ? '+' : '') + cleanSuffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = [
    { selector: '.hero-stat:nth-child(1) .hero-stat-number', target: 20, suffix: '+' },
    { selector: '.hero-stat:nth-child(3) .hero-stat-number', target: 4, suffix: '' },
    { selector: '.hero-stat:nth-child(5) .hero-stat-number', target: 5, suffix: '+' },
  ];
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      counters.forEach(({ selector, target, suffix }) => {
        const el = document.querySelector(selector);
        if (el) animateCounter(el, target, suffix);
      });
    }
  }, { threshold: 0.5 });
  obs.observe(heroStats);
}

// ======= INIT =======
applyLang(currentLang);
// defer guarantees DOM is ready — call directly
loadCatalog();
initCounters();
