/* ============================================================
   Elliott Rosenberg — AI Redesign v3
   ============================================================ */

(function () {

  /* ── FAB (bottom-right) ── */
  const fab = document.createElement('button');
  fab.className = 'redesign-fab';
  fab.setAttribute('aria-label', 'AI Redesign');
  fab.textContent = 'design it yourself';
  document.body.appendChild(fab);

  /* ── BOTTOM-LEFT CLUSTER ── */
  const leftCluster = document.createElement('div');
  leftCluster.className = 'redesign-left-cluster';
  leftCluster.innerHTML = `
    <button class="redesign-left-btn" id="redesign-reset">↩ Reset</button>
    <button class="redesign-left-btn" id="redesign-share">↗ Share</button>
  `;
  document.body.appendChild(leftCluster);

  /* ── HUD PANEL ── */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="redesign-hud" id="redesign-hud" role="dialog">
      <div class="redesign-active-vibe" id="redesign-active-vibe">
        <span class="redesign-vibe-label">Current vibe —</span>
        <span class="redesign-vibe-text" id="redesign-vibe-text"></span>
      </div>
      <p class="redesign-narrative">
        This site is yours to break. Describe a feeling, a reference, a vibe —
        'brutalist and urgent', 'cozy ceramics studio', 'portfolio got hit by a volcano'.
        Claude rewrites the design in real time. Reset when you're done, or don't.
      </p>
      <div id="redesign-form-wrap">
        <form class="popup-form" id="redesign-form">
          <textarea name="vibe" id="redesign-vibe" placeholder="'brutalist and urgent', 'airy Scandinavian', 'loud 90s web'..." required></textarea>
          <div class="popup-actions">
            <button type="submit" class="btn-submit" id="redesign-submit">Generate</button>
            <button type="button" class="btn-close" id="redesign-close">Close</button>
          </div>
        </form>
      </div>
      <div class="redesign-loading" id="redesign-loading">
        <div class="redesign-game-wrap" id="redesign-game-wrap"></div>
        <div class="redesign-progress">
          <div class="redesign-progress-bar" id="redesign-progress-bar"></div>
        </div>
        <div class="redesign-loading-text">generating — usually takes about 30 seconds</div>
      </div>
    </div>
  `);

  /* ── SHARE PANEL (bottom-left) ── */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="redesign-share-panel" id="redesign-share-panel">
      <div class="redesign-share-header">
        Share — <span class="redesign-vibe-text" id="share-vibe-display"></span>
      </div>
      <div id="redesign-share-form">
        <div class="share-capture-area" id="share-capture-area">
          <div class="redesign-loading-text" id="capture-status">Capturing screenshot…</div>
          <img id="share-preview" alt="Preview" style="display:none">
        </div>
        <label class="redesign-file-label" id="share-file-label" style="display:none">
          <input type="file" id="redesign-file-input" accept="image/*">
          <span id="redesign-file-name">Choose screenshot…</span>
        </label>
        <div class="popup-actions" style="margin-top:14px">
          <button class="btn-submit" id="share-submit-btn">Add to archive</button>
          <button class="btn-close" id="share-cancel-btn">Cancel</button>
        </div>
      </div>
      <div class="redesign-share-success" id="redesign-share-success">
        <div class="redesign-share-success-msg">Added to the archive!</div>
        <a class="redesign-share-link" id="redesign-share-link" href="/gallery.html" target="_blank">View archive ↗</a>
        <button class="btn-close" id="share-done-btn" style="margin-top:10px">Close</button>
      </div>
    </div>
  `);

  /* ── REFS ── */
  const hud            = document.getElementById('redesign-hud');
  const formWrap       = document.getElementById('redesign-form-wrap');
  const form           = document.getElementById('redesign-form');
  const vibeInput      = document.getElementById('redesign-vibe');
  const submitBtn      = document.getElementById('redesign-submit');
  const closeBtn       = document.getElementById('redesign-close');
  const loadingDiv     = document.getElementById('redesign-loading');
  const progressBar    = document.getElementById('redesign-progress-bar');
  const gameWrap       = document.getElementById('redesign-game-wrap');
  const activeVibeEl   = document.getElementById('redesign-active-vibe');
  const vibeTextEl     = document.getElementById('redesign-vibe-text');
  const resetBtn       = document.getElementById('redesign-reset');
  const shareBtn       = document.getElementById('redesign-share');
  const sharePanel     = document.getElementById('redesign-share-panel');
  const shareVibeDisp  = document.getElementById('share-vibe-display');
  const captureStatus  = document.getElementById('capture-status');
  const sharePreview   = document.getElementById('share-preview');
  const fileLabel      = document.getElementById('share-file-label');
  const fileInput      = document.getElementById('redesign-file-input');
  const fileNameEl     = document.getElementById('redesign-file-name');
  const shareSubmitBtn = document.getElementById('share-submit-btn');
  const shareCancelBtn = document.getElementById('share-cancel-btn');
  const shareSuccess   = document.getElementById('redesign-share-success');
  const shareLink      = document.getElementById('redesign-share-link');
  const shareDoneBtn   = document.getElementById('share-done-btn');

  let capturedDataUrl = null;

  /* ═══════════════════════════════════════════
     MINI GAME — Dodge (← → arrow keys)
  ═══════════════════════════════════════════ */
  function createGame(container) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;border:1px solid var(--border)';
    canvas.height = 90;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const cv  = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    const keys = {};
    let W, px, rocks, score, frame, alive, started, raf;

    function reset() {
      W = canvas.width = canvas.offsetWidth;
      px = W / 2; rocks = []; score = 0; frame = 0; alive = true; started = false;
    }

    function loop() {
      W = canvas.width = canvas.offsetWidth;
      ctx.clearRect(0, 0, W, canvas.height);
      const H      = canvas.height;
      const ink    = cv('--ink')    || '#000';
      const accent = cv('--accent') || '#0000cc';
      const mid    = cv('--mid')    || '#555';

      if (!started) {
        ctx.fillStyle = mid;
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('← → to play while you wait', W / 2, H / 2 + 3);
        ctx.fillStyle = ink;
        ctx.fillRect(px - 9, H - 14, 18, 9);
        raf = requestAnimationFrame(loop);
        return;
      }

      // Move player
      if (keys.ArrowLeft)  px = Math.max(9,     px - 3.5);
      if (keys.ArrowRight) px = Math.min(W - 9, px + 3.5);

      // Spawn rocks
      if (frame % 52 === 0) {
        rocks.push({ x: 12 + Math.random() * (W - 24), y: -12, w: 12 + Math.random() * 16 });
      }

      // Speed increases every 2s (120 frames)
      const spd = 1.6 + Math.floor(score / 120) * 0.25;

      for (const r of rocks) {
        r.y += spd;
        ctx.fillStyle = accent;
        ctx.fillRect(r.x - r.w / 2, r.y, r.w, 9);
        if (r.y + 9 > H - 14 && r.y < H - 4 &&
            r.x + r.w / 2 > px - 9 && r.x - r.w / 2 < px + 9) {
          alive = false;
        }
      }
      rocks = rocks.filter(r => r.y < H + 12);

      ctx.fillStyle = alive ? ink : '#c44';
      ctx.fillRect(px - 9, H - 14, 18, 9);

      // Score (seconds)
      ctx.fillStyle = mid;
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.floor(score / 60) + 's', W - 8, 14);
      ctx.textAlign = 'left';

      if (!alive) {
        ctx.fillStyle = mid;
        ctx.textAlign = 'center';
        ctx.fillText('press ← → to retry', W / 2, H / 2 + 3);
        ctx.textAlign = 'left';
      }

      score++; frame++;
      raf = requestAnimationFrame(loop);
    }

    function onKeyDown(e) {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      if (!alive) { reset(); return; }
      started = true;
      keys[e.key] = true;
    }
    function onKeyUp(e) { delete keys[e.key]; }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    reset();
    loop();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }

  /* ═══════════════════════════════════════════
     PROGRESS BAR — RAF lerp
  ═══════════════════════════════════════════ */
  let pValue = 0, pTarget = 0, pRaf = null, pTimer = null;

  function tickProgress() {
    const diff = pTarget - pValue;
    if (Math.abs(diff) > 0.05) { pValue += diff * 0.028; progressBar.style.width = pValue.toFixed(2) + '%'; }
    pRaf = requestAnimationFrame(tickProgress);
  }

  function startProgress() {
    pValue = 0; pTarget = 0; progressBar.style.width = '0%';
    cancelAnimationFrame(pRaf); clearTimeout(pTimer);
    pRaf = requestAnimationFrame(tickProgress);
    setTimeout(() => { pTarget = 55; }, 300);
    pTimer = setTimeout(() => { pTarget = 82; }, 9000);
  }

  function finishProgress(cb) {
    clearTimeout(pTimer); pTarget = 100;
    setTimeout(() => { cancelAnimationFrame(pRaf); cb(); }, 700);
  }

  function resetProgress() {
    clearTimeout(pTimer); cancelAnimationFrame(pRaf);
    pValue = 0; pTarget = 0; progressBar.style.width = '0%';
  }

  /* ═══════════════════════════════════════════
     OPEN / CLOSE HUD
  ═══════════════════════════════════════════ */
  let gameCleanup = null;

  function openHud() {
    hud.classList.add('open');
    setTimeout(() => vibeInput?.focus(), 50);
  }

  function closeHud() { hud.classList.remove('open'); }

  fab.addEventListener('click', () => hud.classList.contains('open') ? closeHud() : openHud());
  closeBtn.addEventListener('click', closeHud);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeHud(); closeSharePanel(); }
  });

  function showLoading() {
    formWrap.style.display = 'none';
    loadingDiv.classList.add('visible');
    startProgress();
    gameCleanup = createGame(gameWrap);
  }

  function hideLoading() {
    loadingDiv.classList.remove('visible');
    formWrap.style.display = '';
    resetProgress();
    if (gameCleanup) { gameCleanup(); gameCleanup = null; }
    gameWrap.innerHTML = '';
  }

  /* ═══════════════════════════════════════════
     APPLY / RESET
  ═══════════════════════════════════════════ */
  function applyCSS(css) {
    let el = document.getElementById('ai-override');
    if (!el) { el = document.createElement('style'); el.id = 'ai-override'; document.head.appendChild(el); }
    el.textContent = css;
  }

  function applyJS(js) {
    if (!js?.trim()) return;
    document.getElementById('ai-script')?.remove();
    const s = document.createElement('script'); s.id = 'ai-script'; s.textContent = js;
    document.body.appendChild(s);
  }

  function showActiveState(vibeText) {
    activeVibeEl.style.display = '';
    vibeTextEl.textContent = vibeText;
    leftCluster.style.display = '';
    fab.classList.add('active');
  }

  function hideActiveState() {
    activeVibeEl.style.display = 'none';
    leftCluster.style.display = 'none';
    fab.classList.remove('active');
  }

  function resetDesign() {
    const styleEl = document.getElementById('ai-override');
    if (styleEl) styleEl.textContent = '';
    document.getElementById('ai-script')?.remove();
    if (Array.isArray(window.__aiCleanup)) {
      window.__aiCleanup.forEach(fn => { try { fn(); } catch (e) {} });
      window.__aiCleanup = [];
    }
    localStorage.removeItem('ai-css');
    localStorage.removeItem('ai-js');
    localStorage.removeItem('ai-vibe');
    hideActiveState();
    closeHud();
  }

  resetBtn.addEventListener('click', resetDesign);

  /* ── SUBMIT ── */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const vibeText = vibeInput.value.trim();
    if (!vibeText) return;
    showLoading();

    try {
      const res = await fetch('/api/redesign', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: vibeText }),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error || `HTTP ${res.status}`); }
      const { css, js, error } = await res.json();
      if (error) throw new Error(error);

      if (css) { applyCSS(css); localStorage.setItem('ai-css', css); }
      if (js)  { applyJS(js);  localStorage.setItem('ai-js', js); }
      localStorage.setItem('ai-vibe', vibeText);

      finishProgress(() => {
        hideLoading(); closeHud(); showActiveState(vibeText); form.reset();
      });
    } catch (err) {
      console.error('Redesign error:', err);
      hideLoading();
      submitBtn.textContent = err.message || 'Error — try again';
      setTimeout(() => { submitBtn.textContent = 'Generate'; }, 2500);
    }
  });

  /* ═══════════════════════════════════════════
     AUTO SCREENSHOT (html2canvas, lazy loaded)
  ═══════════════════════════════════════════ */
  function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
      if (window.html2canvas) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function autoCapture() {
    capturedDataUrl = null;
    sharePreview.style.display = 'none';
    captureStatus.textContent = 'Capturing screenshot…';
    captureStatus.style.display = '';
    fileLabel.style.display = 'none';

    // Temporarily hide our own UI overlays so they don't appear in the capture
    const toHide = [hud, sharePanel, leftCluster, fab];
    toHide.forEach(el => { el.style.visibility = 'hidden'; });

    try {
      await loadHtml2Canvas();
      const pageEl = document.querySelector('.page') || document.body;
      const canvas = await window.html2canvas(pageEl, {
        scale: 0.4, useCORS: true, allowTaint: true, logging: false,
      });
      capturedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      sharePreview.src = capturedDataUrl;
      sharePreview.style.display = 'block';
      captureStatus.style.display = 'none';
    } catch (err) {
      console.warn('Auto-capture failed, falling back to manual upload:', err);
      captureStatus.textContent = 'Auto-capture unavailable — upload a screenshot manually';
      fileLabel.style.display = '';
    } finally {
      toHide.forEach(el => { el.style.visibility = ''; });
    }
  }

  /* ═══════════════════════════════════════════
     SHARE PANEL
  ═══════════════════════════════════════════ */
  function openSharePanel() {
    shareVibeDisp.textContent = localStorage.getItem('ai-vibe') || '';
    shareSuccess.classList.remove('visible');
    document.getElementById('redesign-share-form').style.display = '';
    sharePanel.classList.add('open');
    autoCapture(); // kick off capture immediately
  }

  function closeSharePanel() { sharePanel.classList.remove('open'); }

  shareBtn.addEventListener('click', openSharePanel);
  shareCancelBtn.addEventListener('click', closeSharePanel);
  shareDoneBtn.addEventListener('click', closeSharePanel);

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) {
      fileNameEl.textContent = fileInput.files[0].name;
      // Read the manually chosen file as the captured data
      const reader = new FileReader();
      reader.onload = () => { capturedDataUrl = reader.result; };
      reader.readAsDataURL(fileInput.files[0]);
    }
  });

  shareSubmitBtn.addEventListener('click', async () => {
    if (!capturedDataUrl) { captureStatus.textContent = 'Still capturing — try again in a moment'; return; }
    shareSubmitBtn.disabled = true;
    shareSubmitBtn.textContent = 'Uploading…';

    try {
      const res = await fetch('/api/share', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          screenshot: capturedDataUrl,
          vibe: localStorage.getItem('ai-vibe') || '',
          css:  localStorage.getItem('ai-css')  || '',
        }),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error || 'Upload failed'); }
      const { id } = await res.json();
      document.getElementById('redesign-share-form').style.display = 'none';
      shareSuccess.classList.add('visible');
      shareLink.href = `/gallery.html#${id}`;
    } catch (err) {
      shareSubmitBtn.textContent = 'Failed — try again';
      console.error('Share error:', err);
    } finally {
      shareSubmitBtn.disabled = false;
      if (shareSubmitBtn.textContent === 'Uploading…') shareSubmitBtn.textContent = 'Add to archive';
    }
  });

  /* ═══════════════════════════════════════════
     RESTORE FROM LOCALSTORAGE
  ═══════════════════════════════════════════ */
  leftCluster.style.display = 'none';

  const savedCss  = localStorage.getItem('ai-css');
  const savedVibe = localStorage.getItem('ai-vibe');
  if (savedCss) { applyCSS(savedCss); showActiveState(savedVibe || ''); }
  const savedJs = localStorage.getItem('ai-js');
  if (savedJs) applyJS(savedJs);

})();
