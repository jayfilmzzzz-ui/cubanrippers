/* Cuban Rippers — storefront logic (original DARK design).
   Raw singles + sealed only (NO grading). Full-pack rip-open selectors + card-flip.
   Catalog / DM-to-buy. Stripe-ready stub in checkout(). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const IG = 'https://instagram.com/cubanrippers305';
  const CAT_TOKEN = { pokemon: '--cat-pkmn', sports: '--cat-sports', onepiece: '--cat-onepiece', dbz: '--cat-dbz' };
  // category-specific pack emblems — IP-safe evocative motifs (not official logos), white w/ accent
  const STAR = 'M0 -7 L1.95 -2.1 L7 -2.1 L2.9 1 L4.2 6 L0 2.9 L-4.2 6 L-2.9 1 L-7 -2.1 L-1.95 -2.1 Z';
  // filled white silhouettes + accent (currentColor=--card-c) internals; varied shapes: orb / STAR / skull / orb
  const EMBLEM = {
    // creature-ball orb (Pokémon) — white disc + accent equator band + button
    pokemon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#fff"/><line x1="16" y1="50" x2="84" y2="50" stroke="currentColor" stroke-width="9"/><circle cx="50" cy="50" r="12" fill="currentColor"/><circle cx="50" cy="50" r="5" fill="#fff"/></svg>`,
    // bold 5-point STAR (Sports) — breaks the circle, reads sports-card across all sports
    sports: `<svg viewBox="0 0 100 100"><path fill="#fff" transform="translate(50 50) scale(5.4)" d="${STAR}"/></svg>`,
    // straw-hat jolly-roger skull (One Piece) — filled
    onepiece: `<svg viewBox="0 0 100 100"><g stroke="#fff" stroke-width="8" stroke-linecap="round"><line x1="26" y1="74" x2="74" y2="44"/><line x1="26" y1="44" x2="74" y2="74"/></g><circle cx="50" cy="56" r="17" fill="#fff"/><rect x="44" y="64" width="12" height="10" rx="2" fill="#fff"/><circle cx="43.5" cy="54" r="4" fill="#0b0810"/><circle cx="56.5" cy="54" r="4" fill="#0b0810"/><path d="M27 42 Q50 23 73 42 Z" fill="#fff"/><rect x="22" y="39" width="56" height="7" rx="3.5" fill="#fff"/></svg>`,
    // 4-star orb (Dragon Ball) — white disc + accent stars
    dbz: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#fff"/><g fill="currentColor"><path transform="translate(40 41) scale(1.5)" d="${STAR}"/><path transform="translate(60 41) scale(1.5)" d="${STAR}"/><path transform="translate(40 61) scale(1.5)" d="${STAR}"/><path transform="translate(60 61) scale(1.5)" d="${STAR}"/></g></svg>`,
  };
  const LOGO = '_cubanrippers/logo.png';
  const packSrc = (cat) => `_assets/gen/cubanrippers/pack-${cat}.png`;
  const CATS = window.CR_CATEGORIES || [];
  const PRODUCTS = window.CR_PRODUCTS || [];
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const esc = (s) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // link-per-card buy CTA (pre-wired): when a card has buy_url, render "Buy on <store>" -> store listing
  const STORE = window.CR_STORE || {};
  const buyLabel = (p) => `Buy on ${esc(p.store || STORE.label || 'store')}`;
  const buyLink = (p, cls, style) => `<a class="${cls} buy-btn" href="${esc(p.buy_url)}" target="_blank" rel="noopener"${style ? ` style="${style}"` : ''}>${buyLabel(p)} →</a>`;
  const num = (n) => n.toLocaleString('en-US');
  const priceHTML = (n) => `<span class="cur">$</span>${num(n)}`;
  const catName = (id) => (CATS.find((c) => c.id === id) || {}).name || id;
  const typeLabel = (t) => (t === 'sealed' ? 'Sealed' : 'Single');
  const accentStyle = (cat) => `--card-c:var(${CAT_TOKEN[cat] || '--accent'})`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let filterType = 'all', filterCat = 'all';
  const cart = new Map();
  // a11y: move focus into an opened overlay, restore to the opener on close (skip if it's since been hidden)
  let lastFocus = null;
  function restoreFocus() { const el = lastFocus; lastFocus = null; if (el && el.offsetParent !== null && typeof el.focus === 'function') el.focus(); }

  /* ---------- PACKS (full-size rip-open selectors — whole pack is the button) ---------- */
  function packEl(c) {
    const src = packSrc(c.id);
    const shards = Array.from({ length: 7 }, () => {
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 70;
      return `<i style="--sx:${(Math.cos(a) * d).toFixed(0)}px;--sy:${(Math.sin(a) * d - 40).toFixed(0)}px"></i>`;
    }).join('');
    const spill = [-16, 0, 16].map((r) => `<b style="--sr:${r}deg"></b>`).join('');
    return `<button class="pack" data-cat="${c.id}" style="${accentStyle(c.id)};--pack-src:url('${src}')" aria-label="${esc(c.name)} — rip open">
      <span class="pack-glow"></span>
      <div class="pack-stage">
        <img class="pack-img" src="${src}" alt="${esc(c.name)} pack" loading="lazy" />
        <span class="pack-shine"></span>
        <div class="pack-spill">${spill}</div>
        <span class="pack-burst"></span>
        <div class="pack-half left"><img class="ph-img" src="${src}" alt="" /></div>
        <div class="pack-half right"><img class="ph-img" src="${src}" alt="" /></div>
        <div class="pack-shards">${shards}</div>
      </div>
      <div class="pack-name">${esc(c.name)}</div>
      <div class="pack-cta">Rip open ▸</div>
    </button>`;
  }
  function renderPacks() {
    const wrap = $('#packs'); if (!wrap) return;
    wrap.innerHTML = CATS.map(packEl).join('');
    $$('#packs .pack').forEach((el) => (el.onclick = () => ripPack(el, el.dataset.cat)));
  }
  function ripPack(el, cat) {
    if (el.classList.contains('ripping')) return;
    el.classList.add('ripping');
    const route = () => {
      const wipe = $('#ripWipe');
      wipe.style.setProperty('--wipe-c', `var(${CAT_TOKEN[cat]})`);
      wipe.classList.add('go');
      filterCat = cat; filterType = 'all'; syncFilters(); renderGrid();
      setTab('shop');
      setTimeout(() => { $('#shop')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }, 120);
      setTimeout(() => wipe.classList.remove('go'), 650);
    };
    if (reduced) { route(); setTimeout(() => el.classList.remove('ripping'), 400); return; }
    setTimeout(route, 440);
    setTimeout(() => el.classList.remove('ripping'), 1500);
  }

  /* ---------- product cards (raw — no grading; with card-flip) ---------- */
  function cardArt(p) {
    const tag = esc(p.rarity || 'Card');
    const hot = p.hot ? `<span class="card-hot">Grail</span>` : '';
    const inner = p.img
      ? `<img class="real-card" src="${p.img}" alt="${esc(p.name)}" loading="lazy" />`
      : `<span class="card-art-name">${esc((p.name || '').split(' — ')[0])}</span>`;
    return `<div class="card-art">${inner}<span class="card-tag">${tag}</span>${hot}</div>`;
  }
  function productCard(p) {
    const soldout = p.stock != null && p.stock <= 0; // no stock field = available
    const cls = ['product-card', p.foil ? 'foil' : '', soldout ? 'card-soldout' : ''].filter(Boolean).join(' ');
    const variant = p.foil ? 'foil' : 'base';
    const btn = soldout ? `<button class="dm-btn">Sold</button>`
      : (p.buy_url ? buyLink(p, 'dm-btn') : `<button class="dm-btn" data-add="${p.id}">Add</button>`);
    const front = `<div class="card-face card-front">
        ${cardArt(p)}
        <div class="card-body">
          <div class="card-name">${esc(p.name)}</div>
          <div class="card-set">${esc(p.set)}</div>
          <div class="card-meta"><span>${esc(p.rarity)}</span><span>${typeLabel(p.type)}</span></div>
          <div class="card-foot"><div class="card-price">${priceHTML(p.price)}</div>${btn}</div>
        </div>
      </div>`;
    const back = `<div class="card-face card-back">
        <img class="cb-emblem" src="${LOGO}" alt="Cuban Rippers" />
        <div class="cb-word">Cuban Rippers</div>
        <div class="cb-actions">
          ${soldout ? '' : (p.buy_url ? buyLink(p, 'cb-add') : `<button class="cb-add" data-add="${p.id}">Add to cart</button>`)}
          <button class="cb-details" data-details="${p.id}">Details</button>
        </div>
      </div>`;
    return `<article class="${cls}" data-cat="${p.cat}" data-type="${p.type}" data-variant="${variant}" data-id="${p.id}" style="${accentStyle(p.cat)}">
      <button class="flip-hint" data-flip aria-label="Flip card">⟲</button><div class="card-flip">${front}${back}</div>
    </article>`;
  }
  function renderGrid() {
    const list = PRODUCTS.filter((p) =>
      (filterType === 'all' || p.type === filterType) && (filterCat === 'all' || p.cat === filterCat));
    $('#productGrid').innerHTML = list.length
      ? list.map(productCard).join('')
      : '<p class="grid-empty">No cards match that filter — try another.</p>';
    $$('#productGrid .product-card').forEach(wireCard);
    renderGrail(); // grail tracks the active category's top card
  }
  function wireCard(el) {
    el.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (add) { e.stopPropagation(); addToCart(add.getAttribute('data-add')); return; }
      const det = e.target.closest('[data-details]');
      if (det) { e.stopPropagation(); openModal(det.getAttribute('data-details')); return; }
      if (e.target.closest('[data-flip]') || e.target.closest('.card-art')) { flipCard(el); return; }
      openModal(el.dataset.id);
    });
    wireTilt(el);
  }
  function flipCard(el) {
    const inner = el.querySelector('.card-flip');
    inner.style.transform = '';
    el.classList.add('flipping');
    el.classList.toggle('flipped');
    setTimeout(() => el.classList.remove('flipping'), 600);
  }
  function wireTilt(el) {
    const inner = el.querySelector('.card-flip');
    el.addEventListener('pointermove', (e) => {
      if (el.classList.contains('flipped')) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    el.addEventListener('pointerleave', () => { if (!el.classList.contains('flipped')) inner.style.transform = ''; });
  }

  /* ---------- filters ---------- */
  function setType(t) { filterType = t; syncFilters(); renderGrid(); }
  function setCat(c) { filterCat = c; filterType = 'all'; syncFilters(); renderGrid(); } // tab-like: set, don't toggle
  function syncFilters() {
    $$('#shopToolbar .filter').forEach((b) => {
      const on = b.dataset.filter ? b.dataset.filter === filterType : b.dataset.cat === filterCat;
      b.classList.toggle('is-active', !!on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function wireFilters() {
    $$('#shopToolbar .filter').forEach((b) => (b.onclick = () => (b.dataset.filter ? setType(b.dataset.filter) : setCat(b.dataset.cat))));
  }

  /* ---------- product modal ---------- */
  function openModal(id) {
    const p = byId(id); if (!p) return;
    if ($('#modal').hidden) lastFocus = document.activeElement;
    const art = $('#modalArt');
    art.className = 'modal-art' + (p.foil ? ' foil-on' : '');
    art.style.cssText = accentStyle(p.cat);
    art.innerHTML = cardArt(p);
    $('#modalInfo').innerHTML = `
      <div class="card-set">${esc(catName(p.cat))} · ${esc(p.set)}</div>
      <h3>${esc(p.name)}</h3>
      <div class="card-price">${priceHTML(p.price)}</div>
      <div class="modal-row"><span>Set</span><b>${esc(p.set)}</b></div>
      <div class="modal-row"><span>Rarity</span><b>${esc(p.rarity)}</b></div>
      <div class="modal-row"><span>Category</span><b>${esc(catName(p.cat))}</b></div>
      <div class="modal-actions">
        ${p.buy_url ? buyLink(p, 'dm-btn', 'padding:11px 18px') : `<button class="dm-btn" data-add="${p.id}" style="padding:11px 18px">Add to cart</button>`}
        <a class="btn-ghost" href="${IG}" target="_blank" rel="noopener">DM about this</a>
      </div>`;
    $('#modalInfo [data-add]')?.addEventListener('click', () => { addToCart(p.id); closeModal(); });
    $('#modal').hidden = false;
    $('#modalClose')?.focus();
  }
  function closeModal() { $('#modal').hidden = true; restoreFocus(); }

  /* ---------- cart ---------- */
  function addToCart(id) { cart.set(id, (cart.get(id) || 0) + 1); renderCart(); openCart(); }
  function setQty(id, d) { const q = (cart.get(id) || 0) + d; if (q <= 0) cart.delete(id); else cart.set(id, q); renderCart(); }
  function cartCount() { return [...cart.values()].reduce((a, b) => a + b, 0); }
  function cartTotal() { return [...cart.entries()].reduce((a, [id, q]) => a + (byId(id)?.price || 0) * q, 0); }
  function renderCart() {
    $('#cartCount').textContent = cartCount();
    $('#cartSubtotal').textContent = num(cartTotal());
    const has = cart.size > 0;
    $('#cartEmpty').hidden = has;
    $('#cartItems').innerHTML = !has ? '' : [...cart.entries()].map(([id, q]) => {
      const p = byId(id); if (!p) return '';
      return `<div class="cart-item" style="${accentStyle(p.cat)}">
        <div class="cart-thumb"></div>
        <div class="cart-meta">
          <div class="card-name">${esc(p.name)}</div>
          <div class="card-set">${esc(p.set)}</div>
          <div class="cart-qty"><button data-dec="${id}" aria-label="Decrease">−</button><b>${q}</b><button data-inc="${id}" aria-label="Increase">+</button><button class="cart-rm" data-rm="${id}">remove</button></div>
        </div>
        <div class="card-price">${priceHTML(p.price * q)}</div>
      </div>`;
    }).join('');
    $$('#cartItems [data-inc]').forEach((b) => (b.onclick = () => setQty(b.dataset.inc, 1)));
    $$('#cartItems [data-dec]').forEach((b) => (b.onclick = () => setQty(b.dataset.dec, -1)));
    $$('#cartItems [data-rm]').forEach((b) => (b.onclick = () => { cart.delete(b.dataset.rm); renderCart(); }));
  }
  function openCart() {
    const wasHidden = $('#cartDrawer').hidden;
    if (wasHidden) lastFocus = document.activeElement;
    $('#cartDrawer').hidden = false; $('#cartBackdrop').hidden = false;
    if (wasHidden) $('#cartClose')?.focus();
  }
  function closeCart() { $('#cartDrawer').hidden = true; $('#cartBackdrop').hidden = true; restoreFocus(); }

  /* ---------- checkout (DM stub — Stripe-ready) ---------- */
  function checkout() {
    if (cart.size === 0) { openCart(); return; }
    const lines = [...cart.entries()].map(([id, q]) => { const p = byId(id); return `${q}x ${p.name} ($${num(p.price)})`; });
    const msg = `Hey Cuban Rippers! I'd like to reserve:\n- ${lines.join('\n- ')}\nTotal: $${num(cartTotal())}\nIs this available?`;
    // Stripe-ready: replace with fetch('/api/checkout',{method:'POST',body:JSON.stringify({items:[...cart]})}) -> Stripe Checkout
    navigator.clipboard?.writeText(msg).catch(() => {});
    toast('Cart copied — paste it in our @cubanrippers305 DM');
    window.open(IG, '_blank', 'noopener');
  }
  function toast(text) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = text; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ---------- shell ---------- */
  function wireShell() {
    $('#cartBtn').onclick = openCart;
    $('#cartClose').onclick = closeCart;
    $('#cartBackdrop').onclick = closeCart;
    $('#checkoutBtn').onclick = checkout;
    $('#sendCartBtn').onclick = checkout;
    $('#modalClose').onclick = closeModal;
    $('#modal').onclick = (e) => { if (e.target.id === 'modal') closeModal(); };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeCart(); } });
  }

  /* ---------- side-rail nav + scroll-spy (single-scroll strip) ---------- */
  // section names map to the on-page element ids of each segment
  const SECTION_ID = { home: 'home', shop: 'shop', visit: 'location' };
  const ID_SECTION = { home: 'home', shop: 'shop', location: 'visit' };
  function setActive(name) {
    if (!name) return;
    $$('.rail-link').forEach((b) => {
      const on = b.dataset.section === name;
      b.classList.toggle('is-on', on);
      if (on) b.setAttribute('aria-current', 'location'); else b.removeAttribute('aria-current');
    });
  }
  // back-compat: panels are always visible in the strip — setTab now just sets the active rail dot
  function setTab(name) { setActive(name); }
  function gotoSection(name) {
    setActive(name);
    document.getElementById(SECTION_ID[name] || name)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  function wireNav() {
    // rail links use native anchor scroll (href -> #id) + CSS scroll-behavior; we just flag the active dot
    $$('.rail-link').forEach((a) => a.addEventListener('click', () => setActive(a.dataset.section)));
  }
  function wireScrollSpy() {
    const secs = Object.keys(ID_SECTION).map((id) => document.getElementById(id)).filter(Boolean);
    if (!('IntersectionObserver' in window) || !secs.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(ID_SECTION[e.target.id]); }),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    secs.forEach((s) => io.observe(s));
  }

  /* ---------- grail spotlight (featured) ---------- */
  function renderGrail() {
    const g = $('#grail'); if (!g) return;
    const pool = PRODUCTS.filter((x) => filterCat === 'all' || x.cat === filterCat);
    const p = pool.slice().sort((a, b) => b.price - a.price)[0] || PRODUCTS[0];
    if (!p) { g.style.display = 'none'; return; }
    g.style.display = '';
    const art = p.img ? `<img class="real-card" src="${p.img}" alt="${esc(p.name)}" />` : '';
    g.innerHTML = `
      <div class="grail-art" style="${accentStyle(p.cat)}">${art}</div>
      <div class="grail-info">
        <div class="grail-tag">Grail · ${esc(catName(p.cat))}</div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.set)} · ${esc(p.rarity)} — DM to lock it before it's gone.</p>
        <div class="card-price">${priceHTML(p.price)}</div>
        <div style="display:flex;gap:10px;margin-top:14px">
          ${p.buy_url ? buyLink(p, 'dm-btn', 'padding:11px 18px') : `<button class="dm-btn" data-add="${p.id}" style="padding:11px 18px">Add to cart</button>`}
          <a class="btn-ghost" href="${IG}" target="_blank" rel="noopener">DM about it →</a>
        </div>
      </div>`;
    g.querySelector('[data-add]')?.addEventListener('click', () => addToCart(p.id));
  }

  /* ---------- SUBTLE scroll FX: fine-grained, gentle, staggered reveal-on-scroll ---------- */
  // Tag content (not whole sections) so each piece eases in as it enters — understated, premium.
  function wireScrollFX() {
    const tag = (sel, cls) => $$(sel).forEach((e) => e.classList.add(cls));
    // NB: skip the above-the-fold masthead lockup (tagging visible elements .fx would flash on load;
    // its motion comes from the crest parallax instead). Everything else is below the fold = no flash.
    tag('.hero-inner .b305, .hero-inner h1, .hero-inner p, .hero-inner .hero-cta', 'fx');
    tag('.sec-title, .sec-sub, .grail, .deck-foot, .visit-band .loc-card, .aside-title, .aside-note', 'fx');
    // NB: do NOT fx the deck packs — they carry a fanned transform:rotate(var(--fr)); a .fx-pack
    // reveal would set transform:none and STRAIGHTEN the fan. Packs stay fanned, no reveal.
    tag('.product-grid > *', 'fx');                                  // shop cards stagger in
    const fx = $$('.fx, .fx-pack');
    if (!fx.length) return;
    // reduced-motion / no IO → show everything instantly (no hidden content)
    if (reduced || !('IntersectionObserver' in window)) { fx.forEach((e) => e.classList.add('in')); return; }
    // threshold:0 = fire on FIRST intersection (a ratio threshold is unreachable for elements taller
    // than the viewport → would leave content blank off-fullscreen). Stagger by sibling index.
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('fx') || c.classList.contains('fx-pack'));
        const i = Math.max(0, sibs.indexOf(el));
        setTimeout(() => el.classList.add('in'), Math.min(i, 8) * 65); // light, capped stagger
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    fx.forEach((e) => io.observe(e));
  }

  /* ---------- very subtle hero parallax: ghosted crest/spine drift slower than the foreground ---------- */
  function wireParallax() {
    if (reduced || !('requestAnimationFrame' in window)) return;
    const crest = $('.mast-crest'), spine = $('.hero-spine'), band = $('.deck-band');
    if (!crest && !spine && !band) return;
    let ticking = false;
    function upd() {
      const y = window.scrollY;
      if (crest) crest.style.transform = `translate(-50%,-50%) translateY(${(y * 0.07).toFixed(1)}px)`;
      if (spine) spine.style.transform = `translateY(calc(-50% + ${(y * -0.035).toFixed(1)}px))`;
      if (band) band.style.transform = `translate(-50%,-50%) translateY(${(y * 0.03).toFixed(1)}px)`;
      ticking = false;
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  renderPacks(); wireFilters(); renderGrid(); renderCart(); wireShell(); wireNav(); wireScrollSpy(); wireScrollFX(); wireParallax();

  // fade the opening scroll-cue once the user starts scrolling
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 90);
  }, { passive: true });

  // deep-link: /?rip=pokemon auto-rips that pack on load (marketing links + QA)
  const qp2 = new URLSearchParams(location.search);
  const rl = qp2.get('rip');
  if (rl && CAT_TOKEN[rl]) window.addEventListener('load', () => setTimeout(() => $(`#packs .pack[data-cat="${rl}"]`)?.click(), 160));
  const tl = qp2.get('tab');
  if (tl && SECTION_ID[tl]) window.addEventListener('load', () => setTimeout(() => gotoSection(tl), 120));
})();
