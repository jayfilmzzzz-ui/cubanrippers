/* Cuban Rippers — COME CHECK US OUT (store showcase) page logic.
   Replaces the old shop app.js: no cart/products/packs — just reveal-on-scroll,
   side-rail scroll-spy, and the store-photo lightbox. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal-on-scroll (matches the existing .fx -> .in pattern) */
  const fx = $$('.fx');
  if (fx.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      fx.forEach((e) => e.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }),
        { rootMargin: '0px 0px -8% 0px', threshold: 0 }
      );
      fx.forEach((e) => io.observe(e));
    }
  }

  /* side-rail active dot + scroll-spy */
  const ID_SECTION = { home: 'home', store: 'store', location: 'visit' };
  const setActive = (name) => $$('.rail-link').forEach((b) => {
    const on = b.dataset.section === name;
    b.classList.toggle('is-on', on);
    if (on) b.setAttribute('aria-current', 'location'); else b.removeAttribute('aria-current');
  });
  $$('.rail-link').forEach((a) => a.addEventListener('click', () => setActive(a.dataset.section)));
  const secs = Object.keys(ID_SECTION).map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window && secs.length) {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(ID_SECTION[e.target.id]); }),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    secs.forEach((s) => io.observe(s));
  }

  /* store-photo lightbox */
  const shots = $$('.store-shot');
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  if (lb && lbImg && shots.length) {
    let idx = 0, lastFocus = null;
    const srcOf = (el) => el.dataset.full || el.querySelector('img')?.src;
    const show = (i) => { idx = (i + shots.length) % shots.length; lbImg.src = srcOf(shots[idx]); };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i); lb.hidden = false; document.body.style.overflow = 'hidden';
      $('#lbClose')?.focus();
    };
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; lastFocus?.focus(); };
    shots.forEach((el, i) => el.addEventListener('click', () => open(i)));
    $('#lbNext')?.addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
    $('#lbPrev')?.addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
    $('#lbClose')?.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }
})();
