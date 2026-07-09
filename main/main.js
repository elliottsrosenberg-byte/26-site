/* ============================================================
   Elliott Rosenberg — Shared JS
   cursor · theme toggle · contact popup
   ============================================================ */

(function () {

  /* ── CURSOR ── */
  const cursorEl = document.getElementById('cursor');
  const body = document.body;

  if (cursorEl && window.matchMedia('(pointer: fine)').matches) {
    let mx = -100, my = -100, cx = -100, cy = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursorEl.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => cursorEl.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursorEl.style.opacity = '1');

    // hover: line state
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
    });

    // click: compress
    document.addEventListener('mousedown', () => body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => body.classList.remove('cursor-click'));

    // smooth follow
    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursorEl.style.left = cx + 'px';
      cursorEl.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    })();
  }

  /* ── THEME TOGGLE ── */
  const html      = document.documentElement;
  const themeBtn  = document.getElementById('themeBtn');
  const themeLabel = document.getElementById('themeLabel');

  // persist across pages
  const saved = localStorage.getItem('theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
    if (themeLabel) themeLabel.textContent = saved === 'dark' ? 'Dark' : 'Light';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const dark = html.getAttribute('data-theme') === 'dark';
      const next = dark ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      if (themeLabel) themeLabel.textContent = dark ? 'Light' : 'Dark';
    });
  }

  // apply saved theme immediately on load (prevents flash)
  // (put a small inline script in <head> for true FOUC prevention — see README)

  /* ── CONTACT POPUP ── */
  const overlay  = document.getElementById('overlay');
  const popup    = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopup');

  function openPopup()  {
    overlay?.classList.add('open');
    popup?.classList.add('open');
  }
  function closePopup() {
    overlay?.classList.remove('open');
    popup?.classList.remove('open');
  }

  document.querySelectorAll('.contact-trigger').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); openPopup(); })
  );

  overlay?.addEventListener('click', closePopup);
  closeBtn?.addEventListener('click', closePopup);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  });

  /* ── CONTACT FORM — fetch submit ── */
  const contactForm = popup?.querySelector('form');
  const submitBtn   = contactForm?.querySelector('.btn-submit');

  contactForm?.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error();
      contactForm.reset();
      closePopup();
    } catch {
      submitBtn.textContent = 'Failed — try again';
    } finally {
      submitBtn.disabled = false;
      if (submitBtn.textContent === 'Sending…') submitBtn.textContent = 'Send';
    }
  });

  /* ── PROJECT PAGE VIEWERS ──
     Each ".doc-pages-toggle" expands a horizontal scroll-snap slider of the
     project's PDF pages. Prev/next buttons, a live counter, and keyboard
     ←/→ drive it; native scroll-snap handles touch/trackpad swipe. */
  document.querySelectorAll('.doc-pages-toggle').forEach(toggle => {
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;
    const track  = panel.querySelector('.doc-pages-track');
    const slides = Array.from(panel.querySelectorAll('.doc-page'));
    const label  = toggle.querySelector('.doc-pages-label');
    const count  = panel.querySelector('.doc-pages-count');
    const prev   = panel.querySelector('.doc-pages-prev');
    const next   = panel.querySelector('.doc-pages-next');
    if (!track || !slides.length) return;

    // Slides' offsetLeft is measured from the nearest positioned ancestor
    // (here the page), not the scroll track — so normalize every position
    // against the first slide to get track-content coordinates that line up
    // with track.scrollLeft (0 at the first slide).
    const base = () => slides[0].offsetLeft;

    // Index of the slide nearest the track's horizontal center.
    function current() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let idx = 0, best = Infinity;
      slides.forEach((s, i) => {
        const mid = (s.offsetLeft - base()) + s.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < best) { best = d; idx = i; }
      });
      return idx;
    }

    function update() {
      const i = current();
      if (count) count.textContent = (i + 1) + ' / ' + slides.length;
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= slides.length - 1;
    }

    function go(dir) {
      const target = slides[Math.max(0, Math.min(slides.length - 1, current() + dir))];
      track.scrollTo({ left: target.offsetLeft - base(), behavior: 'smooth' });
    }

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      if (label) label.textContent = open ? 'View pages' : 'Hide pages';
      if (!open) update();
    });

    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    });

    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });

    update();
  });

})();
