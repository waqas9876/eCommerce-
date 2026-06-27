/* ===================================================
   EcomX — Shared JavaScript Utilities
   =================================================== */

/* ── API helper ── */
const api = {
  BASE: window.location.protocol === 'file:' ? 'http://localhost:5000' : '',
  token() { return localStorage.getItem('ecomx_token'); },
  headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this.token()) h['Authorization'] = 'Bearer ' + this.token();
    return h;
  },
  async get(path) {
    const r = await fetch(this.BASE + path, { headers: this.headers() });
    return r.json();
  },
  async post(path, body) {
    const r = await fetch(this.BASE + path, { method: 'POST', headers: this.headers(), body: JSON.stringify(body) });
    return { ok: r.ok, status: r.status, data: await r.json() };
  },
  async put(path, body) {
    const r = await fetch(this.BASE + path, { method: 'PUT', headers: this.headers(), body: JSON.stringify(body) });
    return { ok: r.ok, data: await r.json() };
  },
  async del(path) {
    const r = await fetch(this.BASE + path, { method: 'DELETE', headers: this.headers() });
    return { ok: r.ok, data: await r.json() };
  }
};

/* ── Product Catalog ── */
const PRODUCT_CATALOG = {
  1:  { id:1,  name:'AirPods Pro',           title:'AirPods Pro — Active Noise Cancelling Wireless Earbuds with Charging Case',    category:'Electronics',  subcat:'Headphones',         brand:'Apple',       sku:'APRD-AIRPODSPRO-WHT', seller:'TechZone Official Store', price:199.99, original:249.99, discount:20,  rating:4.5, reviews:248, sold:2100, stock:47,  badgeLabel:'-20%',  badgeCls:'badge-sale', color:'White',    desc:'Experience immersive audio with industry-leading Active Noise Cancellation. Adaptive Transparency lets in outside noise when you need it. Personalized Spatial Audio with dynamic head tracking delivers theater-like sound that surrounds you.',                                                                imgs:['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'] },
  2:  { id:2,  name:'Urban Runner Pro',       title:'Urban Runner Pro — Lightweight Athletic Sneakers',                             category:'Fashion',      subcat:'Footwear',           brand:'UrbanStep',   sku:'URB-RUNNER-PRO-42',  seller:'FashionHub',             price:89.99,  original:null,   discount:0,   rating:5.0, reviews:112, sold:800,  stock:35,  badgeLabel:'New',   badgeCls:'badge-new',  color:'Black',    desc:'Built for speed and comfort, the Urban Runner Pro features a lightweight mesh upper and responsive cushioning sole. Perfect for daily runs, gym sessions, and casual streetwear.',                                                                                                                          imgs:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1584735175315-9d5df23be4b0?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop'] },
  3:  { id:3,  name:'FitPulse Smart Watch',   title:'FitPulse Smart Watch — Health & Fitness Tracker',                             category:'Electronics',  subcat:'Wearables',          brand:'FitPulse',    sku:'FP-WATCH-001',       seller:'GadgetWorld',            price:149.00, original:179.00, discount:17,  rating:4.0, reviews:89,  sold:640,  stock:22,  badgeLabel:'Hot',   badgeCls:'badge-hot',  color:'Black',    desc:'Track your health 24/7 with heart rate monitoring, sleep tracking, SpO2 sensor, and built-in GPS. Bright AMOLED display, 7-day battery life, and 50+ workout modes.',                                                                                                                                      imgs:['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop'] },
  4:  { id:4,  name:'Luxe Bloom Perfume',     title:'Luxe Bloom Perfume — Floral & Citrus Eau de Parfum 100ml',                   category:'Beauty',       subcat:'Fragrances',         brand:'Luxe Bloom',  sku:'LB-PERF-100ML',      seller:'BeautyGlow',             price:59.99,  original:74.99,  discount:20,  rating:4.5, reviews:67,  sold:420,  stock:18,  badgeLabel:'-20%',  badgeCls:'badge-sale', color:'Original', desc:'A sophisticated blend of jasmine, rose, and fresh citrus top notes. Long-lasting Eau de Parfum that evolves beautifully throughout the day with a warm, musky amber base. 100ml.',                                                                                                                          imgs:['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop'] },
  5:  { id:5,  name:'TechCarry Laptop Bag',   title:'TechCarry Pro — 15.6" Laptop Backpack with USB Charging Port',               category:'Fashion',      subcat:'Bags & Backpacks',   brand:'TechCarry',   sku:'TC-BAG-156-GRY',     seller:'TravelGear',             price:45.00,  original:null,   discount:0,   rating:4.2, reviews:45,  sold:280,  stock:60,  badgeLabel:'New',   badgeCls:'badge-new',  color:'Grey',     desc:'Designed for professionals on the go. Features a padded 15.6" laptop compartment, built-in USB charging port, hidden anti-theft pocket, and ergonomic shoulder straps.',                                                                                                                                  imgs:['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=600&h=600&fit=crop'] },
  6:  { id:6,  name:'FlexFit Yoga Mat',       title:'FlexFit Yoga Mat — Extra Thick Non-Slip 6mm',                                category:'Sports',       subcat:'Yoga & Pilates',     brand:'FlexFit',     sku:'FF-YOGA-MAT-6MM',    seller:'SportsPro',              price:29.99,  original:39.99,  discount:25,  rating:4.7, reviews:188, sold:1200, stock:94,  badgeLabel:'-25%',  badgeCls:'badge-sale', color:'Purple',   desc:'Premium 6mm thick non-slip yoga mat made from eco-friendly TPE material. Excellent joint cushioning for yoga, pilates, stretching, and floor exercises. Includes carry strap.',                                                                                                                            imgs:['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'] },
  7:  { id:7,  name:'MechType Pro Keyboard',  title:'MechType Pro — RGB Mechanical Gaming Keyboard',                              category:'Electronics',  subcat:'Keyboards',          brand:'MechType',    sku:'MECH-KB-RGB-001',    seller:'TechZone Official Store', price:79.99,  original:99.99,  discount:20,  rating:4.9, reviews:302, sold:1850, stock:33,  badgeLabel:'-20%',  badgeCls:'badge-sale', color:'Black',    desc:'Full mechanical switches with customizable per-key RGB lighting. Tactile blue switches, anodized aluminum frame, detachable braided USB-C cable, and dedicated macro keys.',                                                                                                                               imgs:['https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1560009320-b91e78a40408?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop'] },
  8:  { id:8,  name:'BrewMaster Coffee Machine', title:'BrewMaster Pro — 15-Bar Espresso & Coffee Machine',                       category:'Home & Garden',subcat:'Kitchen Appliances', brand:'BrewMaster',  sku:'BM-ESPRESSO-15B',    seller:'HomeElite',              price:119.00, original:149.00, discount:20,  rating:4.5, reviews:156, sold:720,  stock:15,  badgeLabel:'Hot',   badgeCls:'badge-hot',  color:'Silver',   desc:'Brew barista-quality espresso at home with 15-bar Italian pump pressure. Steam wand froths milk to perfection, 1.5L removable water tank, and heats up in just 25 seconds.',                                                                                                                               imgs:['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1618160702438-9b02c8571a45?w=600&h=600&fit=crop'] },
  9:  { id:9,  name:'Vista Pro Sunglasses',   title:'Vista Pro — UV400 Polarized Sunglasses',                                    category:'Fashion',      subcat:'Eyewear',            brand:'Vista',       sku:'VISTA-SG-UV400',     seller:'FashionHub',             price:34.99,  original:null,   discount:0,   rating:4.0, reviews:74,  sold:390,  stock:55,  badgeLabel:'New',   badgeCls:'badge-new',  color:'Black',    desc:'Protect your eyes in style with UV400 polarized lenses blocking 100% UVA & UVB rays. Lightweight TR90 frame, scratch-resistant coating, comes with a hard case and cleaning cloth.',                                                                                                                      imgs:['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop'] },
  10: { id:10, name:'GlowUp Skincare Set',    title:'GlowUp Vitamin C Serum & Moisturizer Set',                                  category:'Beauty',       subcat:'Skincare',           brand:'GlowUp',      sku:'GLOWUP-VITC-SET',    seller:'BeautyGlow',             price:42.00,  original:55.00,  discount:24,  rating:5.0, reviews:203, sold:1500, stock:8,   badgeLabel:'-24%',  badgeCls:'badge-sale', color:'Original', desc:'A powerful duo: 20% Vitamin C Brightening Serum and Niacinamide Hydrating Moisturizer. Reduces dark spots, evens skin tone, and delivers a glass-skin glow in 4 weeks.',                                                                                                                                  imgs:['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop'] },
  11: { id:11, name:'SoundWave Pro Speaker',  title:'SoundWave Pro — 30W Portable Bluetooth Speaker',                            category:'Electronics',  subcat:'Speakers',           brand:'SoundWave',   sku:'SW-SPK-30W-BLK',     seller:'TechZone Official Store', price:69.99,  original:99.99,  discount:30,  rating:4.5, reviews:127, sold:860,  stock:28,  badgeLabel:'-30%',  badgeCls:'badge-sale', color:'Black',    desc:'30W dual-driver Bluetooth 5.3 speaker with 360° surround sound, deep bass radiator, and IPX7 waterproof rating. 24-hour battery life, 30m wireless range, built-in speakerphone.',                                                                                                                        imgs:['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'] },
  12: { id:12, name:'PowerLift Dumbbell Set', title:'PowerLift — Adjustable Dumbbell Set 5–25kg',                                category:'Sports',       subcat:'Strength Training',  brand:'PowerLift',   sku:'PL-DUMBBELL-25KG',   seller:'SportsPro',              price:89.00,  original:null,   discount:0,   rating:4.0, reviews:91,  sold:540,  stock:12,  badgeLabel:null,    badgeCls:null,         color:'Black',    desc:'Replace 15 sets of weights with one compact pair. Adjustable 5kg–25kg in 2.5kg increments. Anti-slip ergonomic handle, durable nylon cradle, and compact storage tray.',                                                                                                                                  imgs:['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=600&fit=crop'] },
  13: { id:13, name:'ArmorShield Pro Case',   title:'ArmorShield Pro — Military-Grade Drop Protection Phone Case',               category:'Electronics',  subcat:'Phone Accessories',  brand:'ArmorShield', sku:'AS-CASE-002',        seller:'TechZone Official Store', price:19.99,  original:null,   discount:0,   rating:4.3, reviews:158, sold:2200, stock:145, badgeLabel:null,    badgeCls:null,         color:'Clear',    desc:'Military-grade MIL-STD-810G drop protection with reinforced corners. Compatible with wireless charging, precise cutouts for all ports, and raised bezels to protect screen and camera.',                                                                                                                    imgs:['https://images.unsplash.com/photo-1601593346740-925612772716?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop'] }
};

function _stars(r) {
  const f = Math.floor(r), h = r % 1 >= 0.5, e = 5 - f - (h ? 1 : 0);
  return '<i class="fa-solid fa-star"></i>'.repeat(f) +
    (h ? '<i class="fa-solid fa-star-half-stroke"></i>' : '') +
    '<i class="fa-regular fa-star"></i>'.repeat(e);
}

/* ── Product Detail Page Renderer ── */
async function initProductDetail() {
  if (!document.getElementById('pd-title')) return;
  const rawId = new URLSearchParams(window.location.search).get('id');

  // Try API first, fall back to local catalog
  let p = null;
  try {
    const data = await api.get('/api/products/' + rawId);
    if (data.product) p = normalizeProduct(data.product);
  } catch(e) {}
  if (!p) p = PRODUCT_CATALOG[parseInt(rawId)] || SellerProducts.find(rawId) || PRODUCT_CATALOG[1];

  document.title = p.name + ' — EcomX';

  const bcCat = document.getElementById('pd-bc-cat');
  const bcName = document.getElementById('pd-bc-name');
  if (bcCat) bcCat.textContent = p.category;
  if (bcName) bcName.textContent = p.name;

  // ── Rebuild gallery from real product images only ──
  var _imgs = (p.imgs && p.imgs.length) ? p.imgs : [];
  var _resolveImg = function(u) {
    if (!u) return '';
    if (u.startsWith('http')) return u;
    return (api.BASE || '') + u;
  };
  var _placeholder = 'https://via.placeholder.com/600x600?text=No+Image';

  var mainImg = document.getElementById('gallery-main-img');
  if (mainImg) {
    mainImg.src = _imgs.length ? _resolveImg(_imgs[0]) : _placeholder;
    mainImg.alt = p.name;
  }

  var thumbsContainer = document.querySelector('.gallery-thumbs');
  if (thumbsContainer) {
    if (_imgs.length <= 1) {
      thumbsContainer.style.display = 'none';
    } else {
      thumbsContainer.innerHTML = _imgs.map(function(url, i) {
        return '<div class="gallery-thumb' + (i === 0 ? ' active' : '') + '">'
          + '<img src="' + _resolveImg(url) + '" alt="' + p.name + ' view ' + (i + 1) + '">'
          + '</div>';
      }).join('');
      thumbsContainer.style.display = '';
      initGallery();
    }
  }

  const badges = document.getElementById('pd-badges');
  if (badges) {
    badges.innerHTML =
      '<span class="status-badge badge-delivered">In Stock</span>' +
      '<span class="status-badge badge-processing">Free Shipping</span>' +
      (p.discount ? '<span class="badge text-white" style="background:var(--danger);font-size:.7rem">' + p.discount + '% OFF</span>' : '');
  }

  const titleEl = document.getElementById('pd-title');
  if (titleEl) titleEl.textContent = p.title;

  const ratingRow = document.getElementById('pd-rating-row');
  if (ratingRow) {
    ratingRow.innerHTML =
      '<div class="stars">' + _stars(p.rating) + '</div>' +
      '<span class="fw-600">' + p.rating.toFixed(1) + '</span>' +
      '<span style="color:var(--gray-400);font-size:.85rem">' + p.reviews + ' reviews</span>' +
      '<span class="text-muted">|</span>' +
      '<span style="color:var(--success);font-size:.875rem"><i class="fa-solid fa-circle-check me-1"></i>' + p.sold.toLocaleString() + '+ sold</span>';
  }

  const priceEl = document.querySelector('.product-detail-price');
  if (priceEl) {
    priceEl.innerHTML =
      '$' + p.price.toFixed(2) +
      (p.original ? ' <span class="original">$' + p.original.toFixed(2) + '</span>' : '') +
      (p.original ? ' <span class="badge ms-2" style="background:var(--danger-light);color:var(--danger);font-size:.8rem">You save $' + (p.original - p.price).toFixed(2) + '</span>' : '');
  }

  const descEl = document.getElementById('pd-desc');
  if (descEl) descEl.textContent = p.desc;

  const colorEl = document.getElementById('pd-color-val');
  if (colorEl) colorEl.textContent = p.color;

  const stockEl = document.getElementById('pd-stock');
  if (stockEl) stockEl.innerHTML = '<i class="fa-solid fa-circle-check me-1"></i>' + p.stock + ' units left';

  const addCartBtn = document.getElementById('pd-add-cart');
  const buyNowBtn  = document.getElementById('pd-buy-now');
  function _pdQty() { var q = document.querySelector('.qty-input'); return Math.max(1, parseInt(q ? q.value : 1) || 1); }
  if (addCartBtn) {
    addCartBtn.onclick = function() {
      if (!Auth.get()) { AuthModal.show('signup', window.location.href); return; }
      Cart.add({ id: p.id, name: p.name, price: p.price, qty: _pdQty(), image: (p.imgs && p.imgs[0]) || '' });
    };
  }
  if (buyNowBtn) {
    buyNowBtn.onclick = function() {
      if (!Auth.get()) {
        AuthModal.show('signup', window.location.href);
        return;
      }
      Cart.add({ id: p.id, name: p.name, price: p.price, qty: _pdQty(), image: (p.imgs && p.imgs[0]) || '' });
      window.location.href = 'checkout.html';
    };
  }

  const metaEl = document.querySelector('.product-meta');
  if (metaEl) {
    metaEl.innerHTML =
      '<div class="product-meta-row"><span class="product-meta-label">Category:</span><span class="product-meta-value">' + p.category + ' / ' + (p.subcat||p.category) + '</span></div>' +
      '<div class="product-meta-row"><span class="product-meta-label">Brand:</span><span class="product-meta-value">' + (p.brand||'—') + '</span></div>' +
      '<div class="product-meta-row"><span class="product-meta-label">SKU:</span><span class="product-meta-value">' + (p.sku||'—') + '</span></div>' +
      '<div class="product-meta-row"><span class="product-meta-label">Seller:</span><a class="product-meta-value" href="account.html" style="color:var(--primary)">' + (p.seller||'EcomX Store') + '</a></div>';
  }

  // Seller contact card
  const contactCard = document.getElementById('seller-contact-card');
  if (contactCard && (p.sellerEmail || p.sellerPhone || p.sellerWA)) {
    contactCard.style.display = 'block';
    const ini = (p.seller||'S').split(' ').map(function(w){return w[0];}).slice(0,2).join('').toUpperCase();
    document.getElementById('sc-avatar').textContent = ini;
    document.getElementById('sc-name').textContent   = p.seller || 'Seller';
    document.getElementById('sc-store').textContent  = p.sellerEmail || '';
    const callBtn  = document.getElementById('sc-call');
    const waBtn    = document.getElementById('sc-wa');
    const emailBtn = document.getElementById('sc-email');
    if (p.sellerPhone) { callBtn.href  = 'tel:' + p.sellerPhone; callBtn.style.display = ''; }
    if (p.sellerWA)    { waBtn.href    = 'https://wa.me/' + p.sellerWA.replace(/[^0-9]/g,''); waBtn.style.display = ''; }
    if (p.sellerEmail) { emailBtn.href = 'mailto:' + p.sellerEmail; }
  }

  const descDetail = document.getElementById('pd-desc-detail');
  if (descDetail) descDetail.textContent = p.desc;
}

/* ── Auth (Role-Based Access + Flask API) ── */
const Auth = {
  KEY:       'ecomx_user',
  TOKEN_KEY: 'ecomx_token',

  // Offline demo fallback accounts (used when Flask is not running)
  ACCOUNTS: {
    'customer@ecomx.com': { password: 'pass123', role: 'customer', name: 'Ahmed Siddiqui', initials: 'AS' },
    'seller@ecomx.com':   { password: 'pass123', role: 'seller',   name: 'TechZone Store', initials: 'TZ' },
    'admin@ecomx.com':    { password: 'pass123', role: 'admin',    name: 'Super Admin',    initials: 'AD' }
  },

  // Where each role lands after login
  // Customer & Seller stay on the main website; only Admin goes to a separate dashboard
  DASHBOARDS: {
    customer: 'index.html',
    seller:   'index.html',
    admin:    'admin/dashboard.html'
  },

  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch(e) { return null; }
  },
  token() { return localStorage.getItem(this.TOKEN_KEY); },

  _saveUser(user, token) {
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.KEY, JSON.stringify(user));
  },

  // Try Flask API first; fall back to offline demo accounts
  async apiLogin(email, password) {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.ok) {
        this._saveUser(res.data.user, res.data.token);
        return res.data.user.role;
      }
      return null;
    } catch(e) {
      // Backend not running — use demo fallback
      return this.login(email, password);
    }
  },

  // Offline demo login (no API)
  login(email, password) {
    const acc = this.ACCOUNTS[email.toLowerCase().trim()];
    if (!acc || acc.password !== password) return null;
    this._saveUser({ role: acc.role, name: acc.name, email: email.toLowerCase().trim(), initials: acc.initials }, null);
    return acc.role;
  },

  // One-click demo login buttons
  async quickLogin(role) {
    const emailMap = { customer: 'customer@ecomx.com', seller: 'seller@ecomx.com', admin: 'admin@ecomx.com' };
    const email = emailMap[role];
    try {
      const res = await api.post('/api/auth/login', { email, password: 'pass123' });
      if (res.ok) { this._saveUser(res.data.user, res.data.token); }
      else { this.login(email, 'pass123'); }
    } catch(e) {
      this.login(email, 'pass123');
    }
    const inSub = /\/(customer|seller|admin)\//.test(window.location.pathname);
    const prefix = inSub ? '../' : '';
    window.location.href = prefix + (role === 'admin' ? 'admin/dashboard.html' : 'index.html');
  },

  logout() {
    localStorage.removeItem(this.KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    const inSub = /\/(customer|seller|admin)\//.test(window.location.pathname);
    window.location.href = (inSub ? '../' : '') + 'login.html';
  },

  initUI() {
    const u = this.get();
    const inSub = /\/(customer|seller|admin)\//.test(window.location.pathname);
    const root  = inSub ? '../' : '';

    // ── Dashboard pages: update sidebar ──────────────────────────────
    if (u) {
      const roleLabels = { customer: 'Customer Account', seller: 'Verified Seller', admin: 'System Administrator' };
      document.querySelectorAll('.sidebar-user-name').forEach(el => el.textContent = u.name);
      document.querySelectorAll('.sidebar-user-role').forEach(el => el.textContent = roleLabels[u.role] || u.role);
      document.querySelectorAll('.sidebar-avatar').forEach(el => { el.textContent = u.initials || u.name.slice(0,2).toUpperCase(); });
    }

    // ── Main site navbar: show user menu or login buttons ────────────
    const userMenu    = document.getElementById('nav-user-menu');
    const loginBtn    = document.getElementById('nav-login-btn');
    const registerBtn = document.getElementById('nav-register-btn');

    if (userMenu && loginBtn && registerBtn) {
      if (u) {
        userMenu.style.display = 'flex';
        loginBtn.style.display = registerBtn.style.display = 'none';
        const ini  = userMenu.querySelector('.nav-user-initials');
        const name = userMenu.querySelector('.nav-user-name');
        const drop = userMenu.querySelector('.nav-user-dropdown');
        if (ini)  ini.textContent  = u.initials || u.name.slice(0,2).toUpperCase();
        if (name) name.textContent = u.name.split(' ')[0];

        // Build role-specific dropdown items
        if (drop) {
          const customerItems = `
            <li><a class="dropdown-item" href="${root}account.html"><i class="fa-solid fa-user-circle me-2 text-primary"></i>My Account</a></li>
            <li><a class="dropdown-item" href="${root}cart.html"><i class="fa-solid fa-bag-shopping me-2" style="color:var(--primary)"></i>My Cart</a></li>`;
          const sellerItems = `
            <li><a class="dropdown-item" href="${root}account.html"><i class="fa-solid fa-store me-2" style="color:var(--secondary)"></i>Seller Account</a></li>
            <li><a class="dropdown-item" href="${root}account.html#add"><i class="fa-solid fa-plus-circle me-2" style="color:var(--secondary)"></i>Add Product</a></li>`;
          const adminItems = `
            <li><a class="dropdown-item" href="${root}admin/dashboard.html"><i class="fa-solid fa-shield-halved me-2 text-danger"></i>Admin Panel</a></li>`;

          const roleMap = { customer: customerItems, seller: sellerItems, admin: adminItems + customerItems };
          drop.innerHTML = (roleMap[u.role] || '') +
            '<li><hr class="dropdown-divider"></li>' +
            '<li><a class="dropdown-item text-danger" href="#" id="nav-logout-link"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a></li>';
          const logoutLink = drop.querySelector('#nav-logout-link');
          if (logoutLink) logoutLink.addEventListener('click', e => { e.preventDefault(); Auth.logout(); });
        }
      } else {
        userMenu.style.display = 'none';
        loginBtn.style.display = registerBtn.style.display = 'none';
        if (!document.getElementById('nav-sell-btn')) {
          var _sb = document.createElement('button');
          _sb.id = 'nav-sell-btn';
          _sb.className = 'btn btn-sm fw-semibold';
          _sb.style.cssText = 'background:var(--secondary,#f59e0b);color:#fff;border-radius:50px;padding:.3rem 1rem;border:none;font-family:var(--font,"Poppins",sans-serif)';
          _sb.innerHTML = '<i class="fa-solid fa-store me-1"></i>Sell on EcomX';
          _sb.onclick = function() { AuthModal.show('signup', null, 'seller'); };
          loginBtn.parentNode.insertBefore(_sb, loginBtn);
        }
      }
    }

    // Wire sidebar + dropdown logout links
    document.querySelectorAll('a').forEach(function(a) {
      if (a.textContent.trim().toLowerCase() === 'logout') {
        a.addEventListener('click', function(e) { e.preventDefault(); Auth.logout(); });
      }
    });
  }
};

/* ── Auth Modal (inline signup / login popup) ── */
var AuthModal = {
  _returnUrl: null,

  _inject: function() {
    if (document.getElementById('auth-modal')) return;
    var style = document.createElement('style');
    style.textContent = [
      '#auth-modal .am-role-card{border:2px solid var(--border,#e2e8f0)!important;transition:.15s;cursor:pointer}',
      '#auth-modal .am-role-card.am-selected{border-color:var(--primary,#7c3aed)!important;background:var(--primary-light,#f5f3ff)}',
      '#auth-modal .am-tab-btn{border:none;border-bottom:2px solid transparent;border-radius:0;background:none;font-family:var(--font,"Poppins",sans-serif);font-weight:600;color:var(--gray-500,#94a3b8);padding:.5rem 0;margin-bottom:-2px;transition:.15s}',
      '#auth-modal .am-tab-btn.active{color:var(--primary,#7c3aed);border-bottom-color:var(--primary,#7c3aed)}'
    ].join('');
    document.head.appendChild(style);
    var wrap = document.createElement('div');
    wrap.innerHTML = '<div class="modal fade" id="auth-modal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered" style="max-width:420px"><div class="modal-content border-0 shadow-lg" style="border-radius:18px;overflow:hidden"><div class="px-4 pt-4 pb-0 d-flex justify-content-between align-items-start"><div><div style="font-family:var(--font,\'Poppins\',sans-serif);font-size:1.25rem;font-weight:700">Join <span style="color:var(--primary,#7c3aed)">EcomX</span></div><p class="text-muted small mb-0">Buy, sell &amp; discover amazing products</p></div><button type="button" class="btn-close mt-1" data-bs-dismiss="modal"></button></div><div class="px-4 pt-3 pb-0" style="border-bottom:2px solid var(--border,#e2e8f0)"><div class="d-flex gap-3"><button type="button" id="am-tab-signup" class="am-tab-btn active">Sign Up</button><button type="button" id="am-tab-login" class="am-tab-btn">Login</button></div></div><div class="modal-body px-4 py-3"><div id="am-alert" class="alert py-2 small d-none mb-3" role="alert"></div><form id="am-signup-form" novalidate><div class="mb-3"><label class="form-label small fw-semibold mb-1">Full Name</label><input type="text" id="am-s-name" class="form-control" placeholder="Your full name" required autocomplete="name"></div><div class="mb-3"><label class="form-label small fw-semibold mb-1">Email Address</label><input type="email" id="am-s-email" class="form-control" placeholder="your@email.com" required autocomplete="email"></div><div class="mb-3"><label class="form-label small fw-semibold mb-1">Password</label><input type="password" id="am-s-pass" class="form-control" placeholder="Min. 6 characters" required minlength="6" autocomplete="new-password"></div><div class="mb-3"><label class="form-label small fw-semibold mb-1">I want to</label><div class="d-flex gap-2"><label class="am-role-card flex-fill text-center py-3 px-2 rounded am-selected" id="am-lbl-buyer"><input type="radio" name="am-role" value="customer" class="d-none" id="am-r-buyer" checked><i class="fa-solid fa-bag-shopping d-block mb-1" style="font-size:1.4rem;color:var(--primary,#7c3aed)"></i><span class="d-block small fw-bold">Buy</span><span class="d-block" style="font-size:.72rem;color:var(--gray-500,#94a3b8)">Shop products</span></label><label class="am-role-card flex-fill text-center py-3 px-2 rounded" id="am-lbl-seller"><input type="radio" name="am-role" value="seller" class="d-none" id="am-r-seller"><i class="fa-solid fa-store d-block mb-1" style="font-size:1.4rem;color:var(--secondary,#f59e0b)"></i><span class="d-block small fw-bold">Sell</span><span class="d-block" style="font-size:.72rem;color:var(--gray-500,#94a3b8)">List products</span></label></div></div><button type="submit" id="am-s-btn" class="btn btn-primary w-100 fw-semibold" style="border-radius:50px;padding:.65rem">Create Account</button><p class="text-center small text-muted mt-3 mb-0">Already have an account? <a href="#" id="am-to-login" class="fw-semibold text-decoration-none" style="color:var(--primary,#7c3aed)">Login here</a></p></form><form id="am-login-form" style="display:none" novalidate><div class="mb-3"><label class="form-label small fw-semibold mb-1">Email Address</label><input type="email" id="am-l-email" class="form-control" placeholder="your@email.com" required autocomplete="email"></div><div class="mb-3"><label class="form-label small fw-semibold mb-1">Password</label><input type="password" id="am-l-pass" class="form-control" placeholder="Password" required autocomplete="current-password"></div><button type="submit" id="am-l-btn" class="btn btn-primary w-100 fw-semibold" style="border-radius:50px;padding:.65rem">Login</button><p class="text-center small text-muted mt-3 mb-0">Don\'t have an account? <a href="#" id="am-to-signup" class="fw-semibold text-decoration-none" style="color:var(--primary,#7c3aed)">Sign Up</a></p></form></div></div></div></div>';
    document.body.appendChild(wrap.firstElementChild);
    this._bindEvents();
  },

  _switchTo: function(panel) {
    var isSignup = panel === 'signup';
    document.getElementById('am-signup-form').style.display = isSignup ? '' : 'none';
    document.getElementById('am-login-form').style.display  = isSignup ? 'none' : '';
    document.getElementById('am-tab-signup').classList.toggle('active', isSignup);
    document.getElementById('am-tab-login').classList.toggle('active', !isSignup);
    this._clearAlert();
  },

  _showAlert: function(msg, type) {
    var el = document.getElementById('am-alert');
    el.className = 'alert alert-' + type + ' py-2 small mb-3';
    el.textContent = msg;
  },

  _clearAlert: function() {
    var el = document.getElementById('am-alert');
    if (el) { el.className = 'alert py-2 small d-none mb-3'; el.textContent = ''; }
  },

  _updateRoleCards: function() {
    var buyerChecked = document.getElementById('am-r-buyer').checked;
    document.getElementById('am-lbl-buyer').classList.toggle('am-selected', buyerChecked);
    document.getElementById('am-lbl-seller').classList.toggle('am-selected', !buyerChecked);
  },

  _bindEvents: function() {
    var self = this;
    document.getElementById('am-tab-signup').onclick = function() { self._switchTo('signup'); };
    document.getElementById('am-tab-login').onclick  = function() { self._switchTo('login'); };
    document.getElementById('am-to-login').onclick   = function(e) { e.preventDefault(); self._switchTo('login'); };
    document.getElementById('am-to-signup').onclick  = function(e) { e.preventDefault(); self._switchTo('signup'); };

    document.getElementById('am-lbl-buyer').addEventListener('click', function() {
      document.getElementById('am-r-buyer').checked = true;
      self._updateRoleCards();
    });
    document.getElementById('am-lbl-seller').addEventListener('click', function() {
      document.getElementById('am-r-seller').checked = true;
      self._updateRoleCards();
    });

    document.getElementById('am-signup-form').onsubmit = async function(e) {
      e.preventDefault();
      var btn = document.getElementById('am-s-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Creating account...';
      var name     = document.getElementById('am-s-name').value.trim();
      var email    = document.getElementById('am-s-email').value.trim();
      var password = document.getElementById('am-s-pass').value;
      var role     = document.querySelector('input[name="am-role"]:checked').value;
      try {
        var res = await api.post('/api/auth/register', { name: name, email: email, password: password, role: role });
        if (res.ok) {
          document.getElementById('am-l-email').value = email;
          self._switchTo('login');
          self._showAlert('Account created! Please login to continue.', 'success');
        } else {
          self._showAlert(res.data.error || 'Registration failed. Please try again.', 'danger');
        }
      } catch(err) {
        self._showAlert('Unable to connect. Please try again.', 'danger');
      }
      btn.disabled = false;
      btn.textContent = 'Create Account';
    };

    document.getElementById('am-login-form').onsubmit = async function(e) {
      e.preventDefault();
      var btn = document.getElementById('am-l-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Logging in...';
      var email    = document.getElementById('am-l-email').value.trim();
      var password = document.getElementById('am-l-pass').value;
      var role = await Auth.apiLogin(email, password);
      if (role) {
        var ret = self._returnUrl;
        var dest;
        if (ret && ret.indexOf('login.html') === -1 && ret.indexOf('register.html') === -1) {
          dest = ret;
        } else {
          dest = window.location.href.replace(/[^/]*(\?.*)?$/, '') + (Auth.DASHBOARDS[role] || 'index.html');
        }
        window.location.href = dest;
      } else {
        self._showAlert('Invalid email or password. Please try again.', 'danger');
        btn.disabled = false;
        btn.textContent = 'Login';
      }
    };
  },

  show: function(panel, returnUrl, preRole) {
    this._inject();
    this._returnUrl = returnUrl || window.location.href;
    this._switchTo(panel || 'signup');
    if (preRole === 'seller') {
      document.getElementById('am-r-seller').checked = true;
    } else {
      document.getElementById('am-r-buyer').checked = true;
    }
    this._updateRoleCards();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('auth-modal')).show();
  }
};

/* ── Cart State (localStorage) ── */
const Cart = {
  get() {
    return JSON.parse(localStorage.getItem('ecomx_cart') || '[]');
  },
  save(items) {
    localStorage.setItem('ecomx_cart', JSON.stringify(items));
    this.updateBadge();
  },
  add(product) {
    const items = this.get();
    const pid = String(product.id);
    const existing = items.find(i => String(i.id) === pid);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      items.push({ ...product, id: pid, qty: product.qty || 1 });
    }
    this.save(items);
    Toast.show(`${product.name} added to cart!`, 'success');
  },
  remove(id) {
    const items = this.get().filter(i => String(i.id) !== String(id));
    this.save(items);
  },
  count() {
    return this.get().reduce((sum, i) => sum + i.qty, 0);
  },
  total() {
    return this.get().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },
  updateBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
      const count = this.count();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
};

/* ── Seller Products (localStorage) ── */
const SellerProducts = {
  KEY:     'ecomx_seller_products',
  CTR_KEY: 'ecomx_sp_nextid',
  get() { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); },
  save(arr) { localStorage.setItem(this.KEY, JSON.stringify(arr)); },
  getByUser(email) { return this.get().filter(function(p){ return p.sellerEmail === email; }); },
  add(data) {
    var arr    = this.get();
    var nextId = parseInt(localStorage.getItem(this.CTR_KEY) || '999') + 1;
    localStorage.setItem(this.CTR_KEY, nextId);
    arr.push(Object.assign({}, data, { id: nextId, createdAt: new Date().toISOString() }));
    this.save(arr);
    return nextId;
  },
  update(id, data) {
    var arr = this.get().map(function(p){
      return String(p.id) === String(id) ? Object.assign({}, p, data) : p;
    });
    this.save(arr);
  },
  remove(id) { this.save(this.get().filter(function(p){ return String(p.id) !== String(id); })); },
  find(id) { return this.get().find(function(p){ return String(p.id) === String(id); }); }
};

/* ── All Products (catalog + localStorage seller) ── */
function getAllProducts() {
  var catalog = Object.values(PRODUCT_CATALOG);
  var seller  = SellerProducts.get().map(function(p){
    return Object.assign({ title: p.name, color: p.color||'N/A', imgs: p.imgs||p.images||[], rating:0, reviews:0, sold:0 }, p);
  });
  return catalog.concat(seller);
}

/* ── Normalize API product → frontend shape ── */
function normalizeProduct(p) {
  // images may come as a JSON array, a plain string, or already an array
  var _raw = p.images || p.imgs || [];
  var imgs;
  if (Array.isArray(_raw)) {
    imgs = _raw;
  } else if (typeof _raw === 'string' && _raw.trim().startsWith('[')) {
    try { imgs = JSON.parse(_raw); } catch(e) { imgs = [_raw]; }
  } else if (typeof _raw === 'string' && _raw.length > 0) {
    imgs = [_raw];
  } else {
    imgs = [];
  }
  return {
    id:          p.id,
    name:        p.name        || '',
    title:       p.title       || p.name || '',
    category:    p.category    || '',
    subcat:      p.subcategory || p.subcat || p.category || '',
    brand:       p.brand       || '',
    sku:         p.sku         || '',
    color:       p.color       || 'N/A',
    price:       parseFloat(p.price)          || 0,
    original:    p.original_price || p.original || null,
    discount:    parseInt(p.discount)          || 0,
    rating:      parseFloat(p.rating)          || 0,
    reviews:     parseInt(p.review_count || p.reviews) || 0,
    sold:        parseInt(p.sold)              || 0,
    stock:       parseInt(p.stock)             || 0,
    imgs:        imgs,
    images:      imgs,
    badgeLabel:  p.badge_label || p.badgeLabel || null,
    badgeCls:    p.badge_cls   || p.badgeCls   || null,
    desc:        p.description || p.desc || '',
    seller:      p.seller_name || p.seller || 'EcomX Store',
    sellerEmail: p.seller_email || p.sellerEmail || '',
    sellerPhone: p.seller_phone || p.sellerPhone || '',
    sellerWA:    p.seller_wa   || p.sellerWA    || '',
    is_active:   p.is_active !== undefined ? p.is_active : true,
  };
}

/* ── Wishlist State ── */
const Wishlist = {
  get() { return JSON.parse(localStorage.getItem('ecomx_wishlist') || '[]'); },
  toggle(id) {
    const list = this.get();
    const idx = list.indexOf(id);
    if (idx > -1) { list.splice(idx, 1); Toast.show('Removed from wishlist', 'info'); }
    else { list.push(id); Toast.show('Added to wishlist!', 'success'); }
    localStorage.setItem('ecomx_wishlist', JSON.stringify(list));
  },
  has(id) { return this.get().includes(id); }
};

/* ── Toast Notifications ── */
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(msg, type = 'info', duration = 3000) {
    this.init();
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast-custom ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${msg}</span>`;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'none';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all .3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

/* ── Quantity Selector ── */
function initQtySelectors() {
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      let val = parseInt(input.value) || 1;
      if (btn.dataset.action === 'plus') val = Math.min(val + 1, 99);
      if (btn.dataset.action === 'minus') val = Math.max(val - 1, 1);
      input.value = val;
    });
  });
}

/* ── Mobile Sidebar Toggle ── */
function initSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/* ── Active Nav Link ── */
function highlightActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current || href.endsWith('/' + current)) {
      link.classList.add('active');
    }
  });
}

/* ── Role Selector (Register) ── */
function initRoleSelector() {
  document.querySelectorAll('.role-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const roleInput = document.getElementById('role-input');
      if (roleInput) roleInput.value = opt.dataset.role;
    });
  });
}

/* ── Gallery Thumbnails ── */
function initGallery() {
  const mainImg = document.getElementById('gallery-main-img');
  if (!mainImg) return;
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.src = thumb.querySelector('img').src;
    });
  });
}

/* ── Price Range Filter ── */
function initPriceRange() {
  const range = document.getElementById('price-range');
  const display = document.getElementById('price-display');
  if (range && display) {
    range.addEventListener('input', () => { display.textContent = '$' + range.value; });
  }
}

/* ── Size Selector ── */
function initSizeSelector() {
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.size-selector').querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ── View Toggle (Grid/List) ── */
function initViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('products-grid');
      if (!grid) return;
      if (btn.dataset.view === 'list') {
        grid.classList.remove('row-cols-2', 'row-cols-md-3', 'row-cols-lg-4');
        grid.classList.add('row-cols-1');
      } else {
        grid.classList.remove('row-cols-1');
        grid.classList.add('row-cols-2', 'row-cols-md-3', 'row-cols-lg-4');
      }
    });
  });
}

/* ── Checkout Steps ── */
function initCheckout() {
  const steps = document.querySelectorAll('.checkout-step-panel');
  const nextBtns = document.querySelectorAll('[data-next-step]');
  const prevBtns = document.querySelectorAll('[data-prev-step]');

  function showStep(n) {
    steps.forEach((s, i) => s.classList.toggle('d-none', i !== n));
    document.querySelectorAll('.step-item').forEach((s, i) => {
      s.classList.toggle('active', i === n);
      s.classList.toggle('done', i < n);
    });
    document.querySelectorAll('.step-line').forEach((l, i) => {
      l.classList.toggle('done', i < n);
      l.classList.toggle('active', i === n - 1);
    });
  }

  nextBtns.forEach(btn => btn.addEventListener('click', () => showStep(parseInt(btn.dataset.nextStep))));
  prevBtns.forEach(btn => btn.addEventListener('click', () => showStep(parseInt(btn.dataset.prevStep))));
}

/* ── Product Card Click → Detail Page ── */
function initProductCardClick() {
  // Wire eye-icon buttons to the correct product ID
  document.querySelectorAll('.action-btn').forEach(function(ab) {
    if (ab.querySelector('.fa-eye')) {
      const card = ab.closest('.product-card');
      const btn = card && card.querySelector('.btn-add-cart');
      const id = btn ? btn.dataset.id : '1';
      ab.setAttribute('onclick', "window.location.href='product-detail.html?id=" + id + "'");
    }
  });

  // Clicking anywhere on a card (except buttons) opens the right product
  document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-add-cart') || e.target.closest('.action-btn')) return;
    const card = e.target.closest('.product-card');
    if (!card) return;
    const btn = card.querySelector('.btn-add-cart');
    const id = btn ? btn.dataset.id : '1';
    window.location.href = 'product-detail.html?id=' + id;
  });
}

/* ── Add to Cart Buttons ── */
function initAddToCart() {
  document.querySelectorAll('.btn-add-cart, [data-add-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id || Math.random();
      const name = btn.dataset.name || 'Product';
      const price = parseFloat(btn.dataset.price) || 0;
      const image = btn.dataset.img || '';
      Cart.add({ id, name, price, image });
    });
  });
}

/* ── Cart Page: Dynamic Render ── */
function initCartPage() {
  var tbody = document.getElementById('cart-items-body');
  if (!tbody) return;

  function renderCart() {
    var items = Cart.get();

    if (items.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5">' +
        '<div class="text-center py-5">' +
        '<div style="font-size:3.5rem">🛒</div>' +
        '<h5 class="fw-600 mt-3">Your cart is empty</h5>' +
        '<p class="text-muted">Looks like you haven\'t added anything yet.</p>' +
        '<a href="products.html" class="btn btn-primary mt-2">Browse Products</a>' +
        '</div></td></tr>';
      updateSummary([]);
      return;
    }

    tbody.innerHTML = items.map(function(item) {
      var p = PRODUCT_CATALOG[parseInt(item.id)];
      var img = p ? p.imgs[0].replace('w=600&h=600', 'w=70&h=70') : '';
      var name = item.name || (p ? p.name : 'Product');
      var line = (parseFloat(item.price) * item.qty).toFixed(2);
      return (
        '<tr data-id="' + item.id + '">' +
        '<td><div class="d-flex align-items-center gap-3">' +
        (img ? '<img src="' + img + '" class="cart-product-img" alt="' + name + '">' : '') +
        '<div><a href="product-detail.html?id=' + item.id + '" style="font-weight:600;font-size:.9rem;color:var(--dark)">' + name + '</a></div>' +
        '</div></td>' +
        '<td class="d-none d-md-table-cell fw-500">$' + parseFloat(item.price).toFixed(2) + '</td>' +
        '<td><div class="quantity-selector" style="transform:scale(0.9)">' +
        '<button class="qty-btn cart-qty" data-action="minus" data-id="' + item.id + '">−</button>' +
        '<input type="text" class="qty-input" value="' + item.qty + '" readonly>' +
        '<button class="qty-btn cart-qty" data-action="plus" data-id="' + item.id + '">+</button>' +
        '</div></td>' +
        '<td class="fw-700" style="color:var(--primary)">$' + line + '</td>' +
        '<td><button class="cart-remove btn-icon" data-id="' + item.id + '" ' +
        'style="background:var(--danger-light);color:var(--danger);border:none;border-radius:var(--radius-sm);width:32px;height:32px;cursor:pointer">' +
        '<i class="fa-solid fa-trash-can" style="font-size:.8rem"></i></button></td>' +
        '</tr>'
      );
    }).join('');

    tbody.querySelectorAll('.cart-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        Cart.remove(btn.dataset.id);
        renderCart();
      });
    });

    tbody.querySelectorAll('.cart-qty').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var all = Cart.get();
        var item = all.find(function(i) { return String(i.id) === String(btn.dataset.id); });
        if (!item) return;
        if (btn.dataset.action === 'plus') {
          item.qty = Math.min(item.qty + 1, 99);
          Cart.save(all);
        } else {
          if (item.qty <= 1) { Cart.remove(item.id); }
          else { item.qty -= 1; Cart.save(all); }
        }
        renderCart();
      });
    });

    updateSummary(items);
  }

  function updateSummary(items) {
    var subtotal = items.reduce(function(s, i) { return s + parseFloat(i.price) * i.qty; }, 0);
    var count    = items.reduce(function(s, i) { return s + i.qty; }, 0);
    var tax      = subtotal * 0.1;
    var total    = subtotal + tax;

    var lbl = document.getElementById('summary-subtotal-label');
    var sub = document.getElementById('summary-subtotal');
    var txEl = document.getElementById('summary-tax');
    var tot = document.getElementById('summary-total');

    if (lbl) lbl.textContent = 'Subtotal (' + count + ' item' + (count !== 1 ? 's' : '') + ')';
    if (sub) sub.textContent = '$' + subtotal.toFixed(2);
    if (txEl) txEl.textContent = '$' + tax.toFixed(2);
    if (tot) tot.textContent = '$' + total.toFixed(2);
  }

  renderCart();
}

/* ── Products Page: Dynamic Render & Filters ── */
function initProductsPage() {
  var grid = document.getElementById('products-grid');
  if (!grid) return;

  var CAT_MAP = {
    'cat-elec':    'Electronics',
    'cat-fashion': 'Fashion',
    'cat-home':    'Home & Garden',
    'cat-beauty':  'Beauty',
    'cat-sports':  'Sports',
    'cat-toys':    'Toys & Kids'
  };
  var URL_CAT = {
    electronics: 'cat-elec',
    fashion:     'cat-fashion',
    home:        'cat-home',
    beauty:      'cat-beauty',
    sports:      'cat-sports',
    toys:        'cat-toys'
  };

  // Pre-select category / search from URL params
  var _urlParams = new URLSearchParams(window.location.search);
  var urlCat = _urlParams.get('cat');
  if (urlCat) {
    var catId = URL_CAT[urlCat.toLowerCase()];
    if (catId && document.getElementById(catId)) {
      document.getElementById('cat-all').checked = false;
      document.getElementById(catId).checked = true;
    }
  }
  var urlSearch = _urlParams.get('search');
  if (urlSearch) {
    var _fs = document.getElementById('filter-search');
    if (_fs) _fs.value = urlSearch;
  }

  function getFilters() {
    var catAll = document.getElementById('cat-all').checked;
    var selectedCats = [];
    if (!catAll) {
      Object.keys(CAT_MAP).forEach(function(id) {
        var el = document.getElementById(id);
        if (el && el.checked) selectedCats.push(CAT_MAP[id]);
      });
    }

    var minEl = document.getElementById('price-min');
    var minPrice = (minEl && minEl.value !== '') ? parseFloat(minEl.value) : 0;
    var _priceEl = document.getElementById('price-range');
    var maxPrice = parseFloat(_priceEl ? _priceEl.value : 5000) || 5000;

    var minRating = 0;
    if (document.getElementById('r5').checked) minRating = 5;
    else if (document.getElementById('r4').checked) minRating = 4;
    else if (document.getElementById('r3').checked) minRating = 3;
    else if (document.getElementById('r2').checked) minRating = 2;

    var onSale  = document.getElementById('on-sale').checked;
    var inStock = document.getElementById('in-stock').checked;
    var freeShip = document.getElementById('free-ship').checked;

    var searchEl = document.getElementById('filter-search');
    var search = searchEl ? searchEl.value.toLowerCase().trim() : '';

    var sortEl = document.querySelector('.sort-select');
    var sort = sortEl ? sortEl.value : 'Best Match';

    return { catAll: catAll, selectedCats: selectedCats, minPrice: minPrice, maxPrice: maxPrice,
             minRating: minRating, onSale: onSale, inStock: inStock, freeShip: freeShip,
             search: search, sort: sort };
  }

  var _products = getAllProducts(); // replaced by API data once loaded

  function applyFilters() {
    var f = getFilters();
    var products = _products.slice();

    if (!f.catAll && f.selectedCats.length > 0) {
      products = products.filter(function(p) { return f.selectedCats.includes(p.category); });
    }
    products = products.filter(function(p) { return p.price >= f.minPrice && p.price <= f.maxPrice; });
    if (f.minRating > 0) products = products.filter(function(p) { return p.rating >= f.minRating; });
    if (f.inStock)   products = products.filter(function(p) { return p.stock > 0; });
    if (f.onSale)    products = products.filter(function(p) { return p.discount > 0; });
    if (f.freeShip)  products = products.filter(function(p) { return p.price >= 50; });
    if (f.search) {
      products = products.filter(function(p) {
        return (p.name||'').toLowerCase().includes(f.search) ||
               (p.category||'').toLowerCase().includes(f.search) ||
               (p.brand||'').toLowerCase().includes(f.search) ||
               (p.subcat||'').toLowerCase().includes(f.search);
      });
    }

    switch (f.sort) {
      case 'Price: Low to High': products.sort(function(a,b){return a.price-b.price;}); break;
      case 'Price: High to Low': products.sort(function(a,b){return b.price-a.price;}); break;
      case 'Best Rated':         products.sort(function(a,b){return b.rating-a.rating;}); break;
      case 'Most Popular':       products.sort(function(a,b){return b.sold-a.sold;}); break;
    }

    renderProducts(products);
    updateFilterTags(f);
    updateResultsCount(products.length);
  }

  function renderProducts(products) {
    if (products.length === 0) {
      grid.innerHTML =
        '<div class="col-12 text-center py-5">' +
        '<div style="font-size:3rem">🔍</div>' +
        '<h5 class="fw-600 mt-3">No products found</h5>' +
        '<p class="text-muted">Try adjusting your filters or ' +
        '<a href="#" id="no-results-clear" style="color:var(--primary)">clear all filters</a></p></div>';
      var clr = document.getElementById('no-results-clear');
      if (clr) clr.addEventListener('click', function(e) {
        e.preventDefault(); document.getElementById('btn-clear').click();
      });
      return;
    }
    var _BASE = api.BASE || 'http://localhost:5000';
    function _resolveImg(u) { if (!u) return ''; return u.startsWith('http') ? u : _BASE + u; }
    grid.innerHTML = products.map(function(p) {
      var rawImg = (p.imgs && p.imgs[0]) || '';
      var img    = _resolveImg(rawImg).replace('w=600&h=600', 'w=400&h=400');
      var badge = p.badgeLabel ? '<span class="product-card-badge ' + p.badgeCls + '">' + p.badgeLabel + '</span>' : '';
      var stars = _stars(p.rating);
      var orig  = p.original ? '<span class="price-original">$' + p.original.toFixed(2) + '</span>' : '';
      var disc  = p.discount ? '<span class="price-discount">-' + p.discount + '%</span>' : '';
      return (
        '<div class="col"><div class="product-card">' +
        '<div class="product-card-img"><img src="' + img + '" alt="' + p.name + '" loading="lazy">' + badge +
        '<div class="product-card-actions">' +
        '<button class="action-btn"><i class="fa-regular fa-heart"></i></button>' +
        '<button class="action-btn" onclick="window.location.href=\'product-detail.html?id=' + p.id + '\'"><i class="fa-regular fa-eye"></i></button>' +
        '</div></div>' +
        '<div class="product-card-body">' +
        '<div class="product-category-tag">' + p.category + '</div>' +
        '<div class="product-title">' + p.name + '</div>' +
        '<div class="product-rating"><span class="stars">' + stars + '</span>' +
        '<span class="text-dark fw-500 ms-1">' + p.rating.toFixed(1) + '</span>' +
        '<span class="rating-count ms-1">(' + p.reviews + ')</span></div>' +
        '<div class="product-price-row"><span class="price-current">$' + p.price.toFixed(2) + '</span>' + orig + disc + '</div>' +
        '<button class="btn-add-cart" data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-img="' + rawImg + '">' +
        '<i class="fa-solid fa-bag-shopping"></i> Add to Cart</button>' +
        '</div></div></div>'
      );
    }).join('');
    initAddToCart();
  }

  function updateFilterTags(f) {
    var container = document.getElementById('active-filters');
    if (!container) return;
    var tags = [];
    if (!f.catAll && f.selectedCats.length > 0) f.selectedCats.forEach(function(c) { tags.push(c); });
    if (f.minRating > 0) tags.push(f.minRating + '.0+ Stars');
    if (f.onSale)   tags.push('On Sale');
    if (f.inStock)  tags.push('In Stock');
    if (f.freeShip) tags.push('Free Shipping');
    if (f.search)   tags.push('Search: "' + f.search + '"');
    if (f.maxPrice < 5000) tags.push('Under $' + f.maxPrice);
    container.innerHTML = tags.map(function(tag) {
      return '<span class="badge rounded-pill d-flex align-items-center gap-1" ' +
        'style="background:var(--primary-light);color:var(--primary);font-size:.75rem;padding:.35rem .75rem;font-weight:500">' +
        tag + ' <button onclick="this.parentElement.remove()" ' +
        'style="background:none;border:none;color:inherit;cursor:pointer;font-size:.8rem;padding:0;margin:0;line-height:1">✕</button></span>';
    }).join('');
  }

  function updateResultsCount(count) {
    var el = document.querySelector('.results-text');
    if (el) el.innerHTML = 'Showing <span>' + count + '</span> result' + (count !== 1 ? 's' : '');
    var footer = document.querySelector('.text-muted.small.mb-0');
    if (footer) footer.textContent = 'Showing ' + count + ' product' + (count !== 1 ? 's' : '');
  }

  // Category checkboxes: mutual exclusion between "All" and specific categories
  Object.keys(CAT_MAP).concat(['cat-all']).forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', function() {
      if (id === 'cat-all' && el.checked) {
        Object.keys(CAT_MAP).forEach(function(cid) {
          var cel = document.getElementById(cid); if (cel) cel.checked = false;
        });
      } else if (id !== 'cat-all' && el.checked) {
        document.getElementById('cat-all').checked = false;
      }
      applyFilters();
    });
  });

  var rangeEl = document.getElementById('price-range');
  if (rangeEl) rangeEl.addEventListener('input', applyFilters);
  var minInp = document.getElementById('price-min');
  if (minInp) minInp.addEventListener('input', applyFilters);

  document.querySelectorAll('[name="rating"]').forEach(function(r) { r.addEventListener('change', applyFilters); });
  ['in-stock','on-sale','free-ship'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.addEventListener('change', applyFilters);
  });

  var sortEl = document.querySelector('.sort-select');
  if (sortEl) sortEl.addEventListener('change', applyFilters);

  var applyBtn = document.getElementById('btn-apply');
  if (applyBtn) applyBtn.addEventListener('click', applyFilters);

  var clearBtn = document.getElementById('btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      document.getElementById('cat-all').checked = true;
      Object.keys(CAT_MAP).forEach(function(id) { var el=document.getElementById(id); if(el) el.checked=false; });
      var rng = document.getElementById('price-range');
      if (rng) { rng.value = rng.max || 5000; document.getElementById('price-display').textContent = '$' + (rng.max || 5000); }
      var minI = document.getElementById('price-min'); if (minI) minI.value = '';
      ['r5','r4','r3','r2'].forEach(function(id){var e=document.getElementById(id);if(e)e.checked=false;});
      ['in-stock','on-sale','free-ship'].forEach(function(id){var e=document.getElementById(id);if(e)e.checked=false;});
      var sch = document.getElementById('filter-search'); if (sch) sch.value = '';
      var nsch = document.getElementById('nav-search'); if (nsch) nsch.value = '';
      applyFilters();
    });
  }

  var searchEl = document.getElementById('filter-search');
  if (searchEl) searchEl.addEventListener('input', applyFilters);

  // Navbar search on products page: push into sidebar filter and re-run
  var navSearchEl = document.getElementById('nav-search');
  if (navSearchEl) {
    navSearchEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var term = this.value.trim();
        if (searchEl) {
          searchEl.value = term;
          searchEl.dispatchEvent(new Event('input'));
          searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        this.blur();
      }
    });
  }

  // Load products from API, fall back to local catalog
  async function loadProducts() {
    grid.innerHTML = '<div class="col-12 text-center py-5"><i class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--primary)"></i><p class="mt-2 text-muted small">Loading products…</p></div>';
    try {
      var res  = await fetch(api.BASE + '/api/products/');
      var data = await res.json();
      if (data.products && data.products.length) {
        _products = data.products.map(normalizeProduct);
      } else {
        _products = getAllProducts();
      }
    } catch(e) {
      _products = getAllProducts();
    }
    applyFilters();
  }

  loadProducts();
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  highlightActiveNav();
  initQtySelectors();
  initSidebar();
  initRoleSelector();
  initGallery();
  initPriceRange();
  initSizeSelector();
  initViewToggle();
  initCheckout();
  Auth.initUI();
  initAddToCart();
  initProductCardClick();
  initProductDetail();
  initProductsPage();
  initCartPage();
});
