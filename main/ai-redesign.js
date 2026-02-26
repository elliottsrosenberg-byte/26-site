/* ============================================================
   Elliott Rosenberg — AI Redesign
   Injects a "Redesign this site" trigger into the footer,
   opens a popup, POSTs to /api/redesign, applies CSS + JS.
   ============================================================ */

(function () {

  /* ── INJECT TRIGGER INTO FOOTER ── */
  const footerNav = document.querySelector('.footer-nav');
  if (footerNav) {
    const li = document.createElement('li');
    li.innerHTML = '<a class="redesign-trigger" href="#">Redesign this site ↗</a>';
    footerNav.appendChild(li);
  }

  /* ── INJECT RESET BUTTON (hidden initially) ── */
  const footer = document.querySelector('footer');
  const resetBtn = document.createElement('button');
  resetBtn.id = 'redesign-reset';
  resetBtn.className = 'theme-toggle';
  resetBtn.style.display = 'none';
  resetBtn.innerHTML = '<span class="toggle-pip" style="background:var(--accent)"></span>Reset design';
  if (footer) footer.appendChild(resetBtn);

  /* ── INJECT REDESIGN POPUP ── */
  const popupHtml = `
    <div class="popup-overlay" id="redesign-overlay"></div>
    <div class="popup-card" id="redesign-popup">
      <div class="popup-title">Redesign this site.</div>
      <div class="popup-sub">Describe a vibe. AI will reinterpret the design in real time.</div>
      <form class="popup-form" id="redesign-form">
        <textarea name="vibe" id="redesign-vibe" placeholder="'brutalist and urgent', 'airy Scandinavian', 'loud 90s web'..." required></textarea>
        <div class="popup-actions">
          <button type="submit" class="btn-submit" id="redesign-submit">Generate</button>
          <button type="button" class="btn-close" id="redesign-close">Close</button>
        </div>
      </form>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHtml);

  /* ── REFS ── */
  const redesignOverlay = document.getElementById('redesign-overlay');
  const redesignPopup   = document.getElementById('redesign-popup');
  const redesignForm    = document.getElementById('redesign-form');
  const redesignVibe    = document.getElementById('redesign-vibe');
  const redesignSubmit  = document.getElementById('redesign-submit');
  const redesignClose   = document.getElementById('redesign-close');

  /* ── OPEN / CLOSE ── */
  function openRedesign() {
    redesignOverlay?.classList.add('open');
    redesignPopup?.classList.add('open');
    setTimeout(() => redesignVibe?.focus(), 50);
  }

  function closeRedesign() {
    redesignOverlay?.classList.remove('open');
    redesignPopup?.classList.remove('open');
  }

  document.querySelectorAll('.redesign-trigger').forEach(el =>
    el.addEventListener('click', e => { e.preventDefault(); openRedesign(); })
  );

  redesignOverlay?.addEventListener('click', closeRedesign);
  redesignClose?.addEventListener('click', closeRedesign);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && redesignPopup?.classList.contains('open')) closeRedesign();
  });

  /* ── APPLY / RESET HELPERS ── */
  function applyCSS(css) {
    let styleEl = document.getElementById('ai-override');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'ai-override';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }

  function applyJS(js) {
    if (!js?.trim()) return;
    // Remove previous AI script
    document.getElementById('ai-script')?.remove();
    const scriptEl = document.createElement('script');
    scriptEl.id = 'ai-script';
    scriptEl.textContent = js;
    document.body.appendChild(scriptEl);
  }

  function resetDesign() {
    // Clear CSS override
    const styleEl = document.getElementById('ai-override');
    if (styleEl) styleEl.textContent = '';

    // Remove AI script
    document.getElementById('ai-script')?.remove();

    // Run cleanup functions if any
    if (Array.isArray(window.__aiCleanup)) {
      window.__aiCleanup.forEach(fn => { try { fn(); } catch (e) {} });
      window.__aiCleanup = [];
    }

    resetBtn.style.display = 'none';
  }

  resetBtn.addEventListener('click', resetDesign);

  /* ── SUBMIT ── */
  redesignForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const vibe = redesignVibe.value.trim();
    if (!vibe) return;

    redesignSubmit.disabled = true;
    redesignSubmit.textContent = 'Generating…';
    redesignVibe.disabled = true;

    try {
      const res = await fetch('/api/redesign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: vibe }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { css, js } = await res.json();

      if (css) applyCSS(css);
      if (js)  applyJS(js);

      closeRedesign();
      resetBtn.style.display = '';

    } catch (err) {
      console.error('Redesign error:', err);
      redesignSubmit.textContent = 'Error — try again';
      setTimeout(() => {
        redesignSubmit.textContent = 'Generate';
        redesignSubmit.disabled = false;
        redesignVibe.disabled = false;
      }, 2000);
      return;
    }

    // Reset form for next use
    redesignForm.reset();
    redesignSubmit.textContent = 'Generate';
    redesignSubmit.disabled = false;
    redesignVibe.disabled = false;
  });

})();
