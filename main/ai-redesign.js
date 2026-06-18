/* ============================================================
   Elliott Rosenberg — AI Redesign v4 — DevTools Console UI
   ============================================================ */

(function () {

  /* ── FAB (reopen console when closed) ── */
  const fab = document.createElement('button');
  fab.id = 'redesign-fab';
  fab.className = 'redesign-fab';
  fab.textContent = 'open console';
  fab.style.display = 'none';
  document.body.appendChild(fab);

  /* ── CONSOLE HTML ── */
  document.body.insertAdjacentHTML('beforeend', `
    <div id="redesign-console" class="redesign-console">
      <div class="console-resize-handle" id="console-resize-handle">
        <div class="console-resize-grip"></div>
      </div>
      <div class="console-bar">
        <span class="console-title">Console</span>
        <div class="console-bar-right">
          <button class="console-action-btn" id="console-theme-btn">Dark</button>
          <button class="console-action-btn" id="console-archive-btn">Archive &#x2197;</button>
          <button class="console-action-btn" id="console-reset-btn" style="display:none">&#x21A9; Reset</button>
          <button class="console-action-btn" id="console-share-btn" style="display:none">&#x2197; Share</button>
          <button class="console-action-btn" id="console-close-btn">&#xD7;</button>
        </div>
      </div>

      <div class="console-body" id="console-body">

        <!-- scrollable area: history, status lines, loading content, presets -->
        <div class="console-scroll" id="console-scroll">
          <div style="flex:1"></div><!-- top spacer — pushes content to bottom -->
          <div id="console-history"></div>
          <div id="console-log-lines"></div>
          <div style="color:#c65e1a;margin-bottom:6px;">After redesigning my website five times over the past five months, each time with a new design tool or AI integration, I decided that I&rsquo;d always have a new tool or piece of technology to play with. Also, as a designer that works across multiple disciplines, I find that I&rsquo;m always adjusting my portfolio to cater to different recruiters, thought leaders, or potential investors. As a gesture to the ever-changing nature of the internet, I&rsquo;ll let you design my website for me. If you&rsquo;re looking for a tech site, a fine arts gallery page, or an animation-heavy creative splurge, click the tags below for some examples.</div>
          <div class="console-log" id="console-intro">// this site can be redesigned by AI &mdash; describe a visual vibe below to transform it</div>
          <div class="console-active-vibe" id="console-active-vibe" style="display:none"></div>

          <!-- shown during generation -->
          <div id="console-loading-area" style="display:none">
            <div class="console-loading-vibe" id="console-loading-vibe"></div>
            <div class="redesign-game-wrap" id="redesign-game-wrap"></div>
            <div class="redesign-progress"><div class="redesign-progress-bar" id="redesign-progress-bar"></div></div>
            <div class="console-loading-text" id="console-loading-text">// generating...</div>
          </div>

          <!-- hidden during generation -->
          <div id="console-presets" class="console-presets">
            <div class="console-log" style="margin-bottom:3px;">// quick start:</div>
            <div class="console-preset-row">
              <button class="console-preset-btn" data-vibe="portfolio but B2B SaaS landing page" data-key="b2b-saas">B2B SaaS</button>
              <button class="console-preset-btn" data-vibe="retro ode to nyan cat with flying donuts" data-key="nyan-cat">nyan cat / donuts</button>
              <button class="console-preset-btn" data-vibe="portfolio but y2k" data-key="y2k">y2k</button>
              <button class="console-preset-btn" data-vibe="emo" data-key="emo">emo</button>
            </div>
          </div>
        </div>

        <!-- form always pinned at bottom -->
        <div class="console-form-area" id="console-form-area">
          <div id="console-cancel-row" style="display:none; margin-bottom:6px;">
            <button class="console-action-btn" id="console-cancel-btn">Cancel</button>
          </div>
          <div class="console-form-row">
            <span class="console-prompt">&gt;</span>
            <textarea class="console-input" id="console-input" maxlength="300" rows="1"
              placeholder="describe what you want the site to look like..."></textarea>
            <button class="console-run" id="console-run">Run</button>
          </div>
          <div class="console-char-count" id="console-char-count">// 0 / 300</div>
        </div>

      </div>
    </div>
  `);

  /* ── SHARE PANEL HTML ── */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="redesign-share-panel" id="redesign-share-panel">
      <div class="console-bar">
        <span class="console-title" id="share-panel-title">&#x2197; Share redesign</span>
        <div class="console-bar-right">
          <button class="console-action-btn" id="share-done-btn">&#xD7;</button>
        </div>
      </div>
      <div id="redesign-share-form" style="padding:12px;">
        <div id="share-capture-area">
          <div class="console-log" id="capture-status">// Capturing screenshot&hellip;</div>
          <img id="share-preview" alt="Preview"
            style="display:none;width:100%;margin-top:8px;border:1px solid #444;">
        </div>
        <label id="share-file-label"
          style="display:none;cursor:pointer;border:1px solid #444;padding:6px 10px;margin-top:6px;color:#888;">
          <input type="file" id="redesign-file-input" accept="image/*" style="display:none;">
          <span id="redesign-file-name" style="font-size:11px;">Choose screenshot&hellip;</span>
        </label>
        <input type="text" class="console-input" id="share-author-input"
          placeholder="Your name (optional)" maxlength="60"
          style="width:100%;margin-top:8px;margin-bottom:0;">
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="console-run" id="share-submit-btn">Add to archive</button>
          <button class="console-action-btn" id="share-cancel-btn">Cancel</button>
        </div>
      </div>
      <div id="redesign-share-success" style="display:none;padding:12px;">
        <div class="console-log">// Added to the archive!</div>
        <a class="console-active-vibe" id="redesign-share-link" href="/gallery.html"
          target="_blank" style="display:block;margin-top:6px;">View archive &#x2197;</a>
        <button class="console-action-btn" id="share-close-success-btn"
          style="margin-top:8px;">Close</button>
      </div>
    </div>
  `);

  /* ── REFS ── */
  const consoleEl       = document.getElementById('redesign-console');
  const consoleScroll   = document.getElementById('console-scroll');
  const consoleInput    = document.getElementById('console-input');
  const consoleRun      = document.getElementById('console-run');
  const charCount       = document.getElementById('console-char-count');
  const loadingArea     = document.getElementById('console-loading-area');
  const loadingVibe     = document.getElementById('console-loading-vibe');
  const activeVibe      = document.getElementById('console-active-vibe');
  const progressBar     = document.getElementById('redesign-progress-bar');
  const gameWrap        = document.getElementById('redesign-game-wrap');
  const presetsEl       = document.getElementById('console-presets');
  const cancelRow       = document.getElementById('console-cancel-row');
  const cancelBtnEl     = document.getElementById('console-cancel-btn');
  const themeBtnEl      = document.getElementById('console-theme-btn');
  const resetBtnEl      = document.getElementById('console-reset-btn');
  const shareBtnEl      = document.getElementById('console-share-btn');
  const closeBtnEl      = document.getElementById('console-close-btn');

  const logLinesEl      = document.getElementById('console-log-lines');

  const sharePanel      = document.getElementById('redesign-share-panel');
  const shareFormWrap   = document.getElementById('redesign-share-form');
  const captureStatus   = document.getElementById('capture-status');
  const sharePreview    = document.getElementById('share-preview');
  const fileLabel       = document.getElementById('share-file-label');
  const fileInput       = document.getElementById('redesign-file-input');
  const fileNameEl      = document.getElementById('redesign-file-name');
  const shareSubmitBtn  = document.getElementById('share-submit-btn');
  const shareCancelBtn  = document.getElementById('share-cancel-btn');
  const shareSuccess    = document.getElementById('redesign-share-success');
  const shareLink       = document.getElementById('redesign-share-link');
  const shareDoneBtn    = document.getElementById('share-done-btn');
  const shareCloseSuccessBtn = document.getElementById('share-close-success-btn');

  let capturedDataUrl = null;
  let currentAbortController = null;
  let lastVibe = '';

  /* ═══════════════════════════════════════════
     VERSION HISTORY
  ═══════════════════════════════════════════ */
  function addToHistory(vibeText) {
    const history = JSON.parse(localStorage.getItem('ai-history') || '[]');
    if (history[history.length - 1] !== vibeText) {
      history.push(vibeText);
      if (history.length > 20) history.shift();
      localStorage.setItem('ai-history', JSON.stringify(history));
    }
    renderHistory();
  }

  function renderHistory() {
    const historyEl = document.getElementById('console-history');
    if (!historyEl) return;
    const history = JSON.parse(localStorage.getItem('ai-history') || '[]');
    if (!history.length) { historyEl.innerHTML = ''; return; }
    historyEl.innerHTML = history.map((v, i) => {
      const opacity = (0.3 + (i / history.length) * 0.7).toFixed(2);
      return `<div class="console-log" style="opacity:${opacity};margin-bottom:3px;">// applied: "${v}"</div>`;
    }).join('');
  }

  renderHistory();

  /* ═══════════════════════════════════════════
     MINI GAME — Collect & Avoid (← → keys, SPACE to pause)
  ═══════════════════════════════════════════ */
  function createGame(container) {
    const canvas = document.createElement('canvas');
    // Adapt height to available console space
    const availableH = consoleEl.offsetHeight - 120;
    canvas.height = Math.max(100, Math.min(200, availableH));
    canvas.style.cssText = 'display:block;width:100%;max-width:340px;margin:0 auto;border:1px solid #444;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const keys = {};
    const isTouchDevice = 'ontouchstart' in window;
    let W, px, items, points, timeFrame, alive, started, paused, raf;

    function reset() {
      W = canvas.width = canvas.offsetWidth;
      px = W / 2;
      items = []; points = 0; timeFrame = 0;
      alive = true; started = false; paused = false;
    }

    function drawCross(x, y, size) {
      ctx.strokeStyle = '#ef5350'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - size / 2, y - size / 2); ctx.lineTo(x + size / 2, y + size / 2);
      ctx.moveTo(x + size / 2, y - size / 2); ctx.lineTo(x - size / 2, y + size / 2);
      ctx.stroke();
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      W = canvas.width = canvas.offsetWidth;
      ctx.clearRect(0, 0, W, canvas.height);
      const H = canvas.height;
      const playerY = H - 16;

      if (!started) {
        ctx.fillStyle = '#6a9955'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(isTouchDevice ? 'tap left / right to play' : '\u2190 \u2192 to play \u2022 SPACE to pause', W / 2, H / 2 + 4);
        ctx.fillStyle = '#d4d4d4';
        ctx.fillRect(px - 10, playerY, 20, 8);
        return;
      }

      if (!paused && alive) {
        if (keys.ArrowLeft  || keys._touchLeft)  px = Math.max(10,     px - 3.5);
        if (keys.ArrowRight || keys._touchRight) px = Math.min(W - 10, px + 3.5);

        if (timeFrame % 60 === 0) {
          const bad = Math.random() < 0.35;
          items.push({ x: 12 + Math.random() * (W - 24), y: -12, bad });
        }

        const spd = 1.1 + Math.floor(timeFrame / 300) * 0.15;
        for (const item of items) { item.y += spd; }

        for (const item of items) {
          if (item.y + 8 > playerY && item.y - 8 < playerY + 8) {
            if (Math.abs(item.x - px) < 18) {
              if (item.bad) alive = false;
              else { points++; item.collected = true; }
            }
          }
        }
        items = items.filter(item => !item.collected && item.y < H + 12);
        timeFrame++;
      }

      for (const item of items) {
        if (item.bad) {
          drawCross(item.x, item.y, 10);
        } else {
          ctx.fillStyle = '#4fc3f7';
          ctx.beginPath(); ctx.arc(item.x, item.y, 6, 0, Math.PI * 2); ctx.fill();
        }
      }

      ctx.fillStyle = alive ? '#d4d4d4' : '#ef5350';
      ctx.fillRect(px - 10, playerY, 20, 8);

      ctx.fillStyle = '#6a9955'; ctx.font = '11px monospace'; ctx.textAlign = 'right';
      ctx.fillText(points + ' pts', W - 6, 14);
      ctx.textAlign = 'left';

      if (!alive) {
        ctx.fillStyle = '#9cdcfe'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(isTouchDevice ? 'tap to retry' : 'press \u2190 \u2192 to retry', W / 2, H / 2 + 4);
        ctx.textAlign = 'left';
      }

      if (paused) {
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#9cdcfe'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
        ctx.fillText('paused \u2014 SPACE to resume', W / 2, H / 2 + 4);
        ctx.textAlign = 'left';
      }
    }

    function onKeyDown(e) {
      if (e.key === ' ') {
        e.preventDefault();
        if (started && alive) { paused = !paused; }
        return;
      }
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      if (!alive) { reset(); return; }
      started = true; keys[e.key] = true;
    }
    function onKeyUp(e) { delete keys[e.key]; }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    reset(); loop();

    function onTouchStart(e) {
      e.preventDefault();
      if (!alive) { reset(); return; }
      started = true;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      keys._touchLeft  = (touch.clientX - rect.left) < W / 2;
      keys._touchRight = !keys._touchLeft;
    }
    function onTouchMove(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      keys._touchLeft  = (touch.clientX - rect.left) < W / 2;
      keys._touchRight = !keys._touchLeft;
    }
    function onTouchEnd() { keys._touchLeft = false; keys._touchRight = false; }

    if (isTouchDevice) {
      canvas.addEventListener('touchstart', onTouchStart, { passive: false });
      canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
      canvas.addEventListener('touchend',   onTouchEnd);
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      if (isTouchDevice) {
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchmove',  onTouchMove);
        canvas.removeEventListener('touchend',   onTouchEnd);
      }
    };
  }

  /* ═══════════════════════════════════════════
     PROGRESS BAR — RAF lerp + slow creep
  ═══════════════════════════════════════════ */
  let pValue = 0, pTarget = 0, pRaf = null, pTimer = null, pCreep = null;

  function tickProgress() {
    const diff = pTarget - pValue;
    if (Math.abs(diff) > 0.05) {
      pValue += diff * 0.028;
      progressBar.style.width = pValue.toFixed(2) + '%';
    }
    pRaf = requestAnimationFrame(tickProgress);
  }

  function startProgress() {
    pValue = 0; pTarget = 0; progressBar.style.width = '0%';
    cancelAnimationFrame(pRaf); clearTimeout(pTimer); clearInterval(pCreep);
    pRaf = requestAnimationFrame(tickProgress);
    setTimeout(() => { pTarget = 55; }, 300);
    pTimer = setTimeout(() => {
      pTarget = 75;
      pCreep = setInterval(() => { if (pTarget < 94) pTarget += 1; }, 3000);
    }, 9000);
  }

  function finishProgress(cb) {
    clearTimeout(pTimer); clearInterval(pCreep); pTarget = 100;
    setTimeout(() => { cancelAnimationFrame(pRaf); cb(); }, 700);
  }

  function resetProgress() {
    clearTimeout(pTimer); clearInterval(pCreep); cancelAnimationFrame(pRaf);
    pValue = 0; pTarget = 0; progressBar.style.width = '0%';
  }

  /* ═══════════════════════════════════════════
     OPEN / CLOSE CONSOLE
  ═══════════════════════════════════════════ */
  let gameCleanup = null;

  // Bottom clearance reserved for the floating FAB when the console is closed,
  // so it never overlaps the footer / theme toggle.
  const FAB_CLEARANCE = '72px';

  function openConsole() {
    consoleEl.classList.add('open');
    fab.style.display = 'none';
    document.documentElement.style.setProperty('--console-height', consoleEl.offsetHeight + 'px');
    updateThemeBtn();
  }

  function closeConsole() {
    consoleEl.classList.remove('open');
    fab.style.display = '';
    document.documentElement.style.setProperty('--console-height', FAB_CLEARANCE);
  }

  fab.addEventListener('click', openConsole);
  closeBtnEl.addEventListener('click', closeConsole);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeConsole(); closeSharePanel(); }
  });

  // Start closed — just the floating "open console" button in the corner.
  setTimeout(() => closeConsole(), 0);

  /* ── RESIZE HANDLE ── */
  (function () {
    const handle = document.getElementById('console-resize-handle');
    let startY = 0, startH = 0, dragging = false;

    handle.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      startY = e.clientY;
      startH = consoleEl.offsetHeight;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const delta = startY - e.clientY;
      const newH = Math.min(Math.max(startH + delta, 80), window.innerHeight * 0.9);
      consoleEl.style.height = newH + 'px';
      document.documentElement.style.setProperty('--console-height', newH + 'px');
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = '';
      localStorage.setItem('console-height', consoleEl.offsetHeight);
    });

    handle.addEventListener('touchstart', e => {
      e.preventDefault();
      dragging = true;
      startY = e.touches[0].clientY;
      startH = consoleEl.offsetHeight;
      document.body.style.userSelect = 'none';
    }, { passive: false });

    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      const delta = startY - e.touches[0].clientY;
      const newH = Math.min(Math.max(startH + delta, 80), window.innerHeight * 0.9);
      consoleEl.style.height = newH + 'px';
      document.documentElement.style.setProperty('--console-height', newH + 'px');
    }, { passive: false });

    document.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = '';
      localStorage.setItem('console-height', consoleEl.offsetHeight);
    });

    const savedH = localStorage.getItem('console-height');
    if (savedH) {
      consoleEl.style.height = savedH + 'px';
      document.documentElement.style.setProperty('--console-height', savedH + 'px');
    }
  })();

  /* ── Loading state ── */
  function showLoading(vibeText) {
    loadingVibe.textContent = '// generating: "' + vibeText + '"';
    loadingArea.style.display = '';
    presetsEl.style.display = 'none';
    cancelRow.style.display = '';
    consoleInput.disabled = true;
    consoleRun.disabled = true;
    consoleRun.textContent = '...';
    startProgress();
    gameCleanup = createGame(gameWrap);
    // Scroll loading content into view
    consoleScroll.scrollTop = consoleScroll.scrollHeight;
  }

  function hideLoading() {
    loadingArea.style.display = 'none';
    presetsEl.style.display = '';
    cancelRow.style.display = 'none';
    consoleInput.disabled = false;
    consoleRun.disabled = false;
    consoleRun.textContent = 'Run';
    resetProgress();
    if (gameCleanup) { gameCleanup(); gameCleanup = null; }
    gameWrap.innerHTML = '';
  }

  /* ═══════════════════════════════════════════
     CHAR COUNT
  ═══════════════════════════════════════════ */
  consoleInput.addEventListener('input', () => {
    const len = consoleInput.value.length;
    charCount.textContent = '// ' + len + ' / 300';
    charCount.style.color = len > 280 ? '#f44336' : '';
  });

  /* ═══════════════════════════════════════════
     THEME TOGGLE (console bar)
  ═══════════════════════════════════════════ */
  function updateThemeBtn() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeBtnEl.textContent = isDark ? 'Light' : 'Dark';
    const footerLabel = document.getElementById('themeLabel');
    if (footerLabel) footerLabel.textContent = isDark ? 'Dark' : 'Light';
  }

  updateThemeBtn();

  themeBtnEl.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeBtn();
    if (localStorage.getItem('ai-css')) injectProtectionStyles();
  });

  // Footer theme button also needs to re-inject protection styles after a redesign
  // (main.js handles the actual theme swap; we just re-apply console chrome protection)
  document.getElementById('themeBtn')?.addEventListener('click', () => {
    updateThemeBtn();
    if (localStorage.getItem('ai-css')) injectProtectionStyles();
  });

  /* ═══════════════════════════════════════════
     APPLY / RESET
  ═══════════════════════════════════════════ */
  function clearPreviousDesign() {
    // Stop any running animations/listeners from the previous design's JS
    if (window.__aiCleanup) {
      window.__aiCleanup.forEach(fn => { try { fn(); } catch (e) {} });
      window.__aiCleanup = [];
    }
    // Remove injected script tag
    document.getElementById('ai-script')?.remove();
    // Clear stored JS so it doesn't re-run on next page load if new design has none
    localStorage.removeItem('ai-js');
  }

  function applyCSS(css) {
    let el = document.getElementById('ai-override');
    if (!el) {
      el = document.createElement('style');
      el.id = 'ai-override';
      // Insert BEFORE the first stylesheet so [data-theme] rules in style.css
      // always cascade after us and light/dark mode keeps working.
      const firstLink = document.head.querySelector('link[rel="stylesheet"]');
      if (firstLink) document.head.insertBefore(el, firstLink);
      else document.head.appendChild(el);
    }
    el.textContent = css;
  }

  function applyJS(js) {
    if (!js?.trim()) return;
    const s = document.createElement('script');
    s.id = 'ai-script';
    s.textContent = js;
    document.body.appendChild(s);
  }

  function injectProtectionStyles() {
    const dark  = document.documentElement.getAttribute('data-theme') === 'dark';
    const cBg   = dark ? '#1e1e1e' : '#f5f5f5';
    const cInk  = dark ? '#d4d4d4' : '#1e1e1e';
    const cBar  = dark ? '#252526' : '#ebebeb';
    const cBdr  = dark ? '#444444' : '#d0d0d0';
    const cCmt  = dark ? '#6a9955' : '#4a7c59';
    const cVal  = dark ? '#9cdcfe' : '#0070c1';
    const cStr  = dark ? '#ce9178' : '#a31515';
    const cInpt = dark ? '#2d2d2d' : '#ffffff';
    const cRun  = dark ? '#0e639c' : '#005fb8';
    const cMut  = dark ? '#555555' : '#878787';

    let el = document.getElementById('redesign-protect');
    if (!el) { el = document.createElement('style'); el.id = 'redesign-protect'; document.head.appendChild(el); }

    el.textContent = `
      #redesign-console {
        position: fixed !important; bottom: 0 !important; left: 0 !important;
        right: 0 !important; width: 100% !important; padding: 0 !important; margin: 0 !important;
        background: ${cBg} !important; color: ${cInk} !important;
        font-family: Menlo, Monaco, 'Courier New', monospace !important;
        font-size: 12px !important; z-index: 9999 !important;
        border-top: 1px solid ${cBdr} !important;
        display: flex !important; flex-direction: column !important;
        max-height: 90vh !important; min-height: 80px !important; overflow: hidden !important;
        transition: transform 0.2s ease !important;
      }
      #redesign-console:not(.open) { transform: translateY(100%) !important; }
      #redesign-console.open { transform: translateY(0) !important; }
      #redesign-console .console-resize-handle {
        height: 5px !important; background: ${cBdr} !important;
        cursor: ns-resize !important; flex-shrink: 0 !important; display: flex !important;
        align-items: center !important; justify-content: center !important;
      }
      #redesign-console .console-bar {
        background: ${cBar} !important; color: ${cInk} !important;
        padding: 6px 12px !important; display: flex !important;
        justify-content: space-between !important; align-items: center !important;
        border-bottom: 1px solid ${cBdr} !important; flex-shrink: 0 !important;
      }
      #redesign-console .console-title { color: ${cInk} !important; font-size: 11px !important; font-weight: bold !important; }
      #redesign-console .console-bar-right { display: flex !important; align-items: center !important; gap: 6px !important; }
      #redesign-console .console-body {
        display: flex !important; flex-direction: column !important;
        flex: 1 !important; overflow: hidden !important; background: ${cBg} !important;
      }
      #redesign-console .console-scroll {
        flex: 1 !important; overflow-y: auto !important;
        padding: 8px 12px 4px !important; background: ${cBg} !important;
        display: flex !important; flex-direction: column !important;
      }
      #redesign-console .console-form-area {
        flex-shrink: 0 !important; padding: 6px 12px 10px !important;
        border-top: 1px solid ${cBdr} !important; background: ${cBg} !important;
      }
      #redesign-console .console-log { color: ${cCmt} !important; margin-bottom: 6px !important; display: block !important; }
      #redesign-console .console-active-vibe { color: ${cVal} !important; margin-bottom: 6px !important; display: block !important; }
      #redesign-console .console-loading-vibe { color: ${cStr} !important; margin-bottom: 8px !important; display: block !important; }
      #redesign-console .console-form-row { display: flex !important; align-items: flex-start !important; gap: 8px !important; }
      #redesign-console .console-prompt { color: ${cCmt} !important; line-height: 28px !important; }
      #redesign-console .console-input {
        flex: 1 !important; background: ${cInpt} !important; color: ${cInk} !important;
        border: 1px solid ${cBdr} !important; padding: 4px 8px !important;
        font-family: Menlo, Monaco, monospace !important; font-size: 12px !important; resize: none !important;
      }
      #redesign-console .console-run {
        background: ${cRun} !important; color: #fff !important; border: none !important;
        padding: 4px 12px !important; cursor: pointer !important;
        font-family: Menlo, Monaco, monospace !important; font-size: 12px !important;
      }
      #redesign-console .console-char-count { color: ${cMut} !important; margin-top: 4px !important; font-size: 10px !important; display: block !important; }
      #redesign-console .console-action-btn {
        background: none !important; border: 1px solid ${cBdr} !important;
        color: ${cInk} !important; font-family: Menlo, Monaco, monospace !important;
        font-size: 11px !important; padding: 2px 8px !important; cursor: pointer !important;
      }
      #redesign-console .console-preset-btn {
        background: none !important; border: 1px solid ${cBdr} !important; color: ${cVal} !important;
        font-family: Menlo, Monaco, monospace !important; font-size: 11px !important;
        padding: 1px 7px !important; cursor: pointer !important;
      }
      #redesign-console .console-loading-text { color: ${cCmt} !important; margin-top: 6px !important; font-size: 11px !important; }
      #redesign-console .redesign-progress { height: 2px !important; background: ${cBdr} !important; overflow: hidden !important; margin-top: 6px !important; }
      #redesign-console .redesign-progress-bar { height: 100% !important; background: ${cRun} !important; }
      #redesign-fab {
        position: fixed !important; bottom: 28px !important; right: 28px !important;
        z-index: 9998 !important; background: ${cBg} !important; color: ${cInk} !important;
        border: 1px solid ${cBdr} !important; padding: 6px 12px !important;
        font-family: Menlo, Monaco, monospace !important; font-size: 11px !important; cursor: pointer !important;
      }
      #redesign-share-panel {
        position: fixed !important; bottom: 0 !important; left: 0 !important;
        width: min(400px, 100vw) !important; background: ${cBg} !important; color: ${cInk} !important;
        font-family: Menlo, Monaco, 'Courier New', monospace !important; font-size: 12px !important;
        z-index: 10000 !important; border-top: 1px solid ${cBdr} !important;
        border-right: 1px solid ${cBdr} !important; transition: transform 0.2s ease !important;
      }
      #redesign-share-panel:not(.open) { transform: translateY(100%) !important; }
      #redesign-share-panel.open { transform: translateY(0) !important; }
      @media (max-width: 600px) {
        #redesign-console { height: 220px !important; }
        #redesign-console .console-bar-right { flex-wrap: wrap !important; gap: 3px !important; }
        #redesign-console .console-action-btn { padding: 2px 4px !important; font-size: 10px !important; }
      }
    `;
  }

  function showActiveState(vibeText) {
    activeVibe.textContent = '// current: "' + vibeText + '"';
    activeVibe.style.display = '';
    resetBtnEl.style.display = '';
    shareBtnEl.style.display = '';
  }

  function hideActiveState() {
    activeVibe.style.display = 'none';
    resetBtnEl.style.display = 'none';
    shareBtnEl.style.display = 'none';
  }

  function resetDesign() {
    clearPreviousDesign();
    localStorage.removeItem('ai-css');
    localStorage.removeItem('ai-vibe');
    window.location.reload();
  }

  resetBtnEl.addEventListener('click', resetDesign);

  document.getElementById('console-archive-btn').addEventListener('click', () => {
    window.open('/gallery.html', '_blank');
  });

  /* ── CANCEL GENERATION ── */
  cancelBtnEl.addEventListener('click', () => {
    if (currentAbortController) currentAbortController.abort();
  });

  /* ── SHARED APPLY RESULT ── */
  function applyResult(css, js, vibeText) {
    clearPreviousDesign();
    if (css) { applyCSS(css); localStorage.setItem('ai-css', css); }
    if (js)  { applyJS(js);  localStorage.setItem('ai-js', js); }
    localStorage.setItem('ai-vibe', vibeText);
    addToHistory(vibeText);
    injectProtectionStyles();
    finishProgress(() => {
      hideLoading();
      closeConsole();
      showActiveState(vibeText);
      consoleInput.value = '';
      charCount.textContent = '// 0 / 300';
      charCount.style.color = '';
    });
  }

  /* ── LOG LINES (terminal-style persistent output) ── */
  function logLine(type, text) {
    const div = document.createElement('div');
    div.style.cssText = 'margin-bottom:6px;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;';
    const msg = document.createElement('span');
    if (type === 'error') {
      msg.style.color = 'var(--c-string)';
      msg.textContent = '// error: ' + text;
      const btn = document.createElement('button');
      btn.className = 'console-action-btn';
      btn.textContent = '\u21BA Retry';
      btn.onclick = () => { if (lastVibe) runVibe(lastVibe); };
      div.appendChild(msg);
      div.appendChild(btn);
    } else {
      msg.className = 'console-log';
      msg.textContent = '// ' + text;
      div.appendChild(msg);
    }
    logLinesEl.appendChild(div);
    consoleScroll.scrollTop = consoleScroll.scrollHeight;
  }

  /* ── ERROR STATE ── */
  function showError(message) {
    hideLoading();
    logLine('error', message);
  }

  function friendlyError(message, status) {
    if (status === 504 || (message && message.includes('504'))) {
      return 'Request timed out. Try a shorter or simpler vibe.';
    }
    if (status >= 500 || (message && /502|503|network|reach/i.test(message))) {
      return "Couldn't reach Claude. Check your connection and try again.";
    }
    if (message && message.includes('format')) {
      return 'Claude returned an unexpected response. Try again.';
    }
    return message || 'Something went wrong. Try again.';
  }

  /* ── SUBMIT (custom vibe) ── */
  function submitVibe() {
    const vibeText = consoleInput.value.trim();
    if (!vibeText) return;
    runVibe(vibeText);
  }

  async function runVibe(vibeText) {
    lastVibe = vibeText;
    showLoading(vibeText);

    if (currentAbortController) currentAbortController.abort();
    currentAbortController = new AbortController();
    const { signal } = currentAbortController;

    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      currentAbortController.abort();
    }, 120000);

    let response;
    try {
      response = await fetch('/api/redesign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: vibeText }),
        signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        if (timedOut) showError('Claude is taking too long. Try a shorter vibe, or try again.');
        else hideLoading();
        return;
      }
      showError("Couldn't reach Claude. Check your connection and try again.");
      return;
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      let msg = 'HTTP ' + response.status;
      try { const b = await response.json(); msg = b.error || msg; } catch {}
      showError(friendlyError(msg, response.status));
      return;
    }

    let data;
    try { data = await response.json(); } catch {
      showError('Claude returned an unexpected response. Try again.');
      return;
    }

    if (data.error) {
      showError(friendlyError(data.error, null));
      return;
    }

    applyResult(data.css, data.js, vibeText);
  }

  /* ── PRESET QUICK-LAUNCH (uses backend cache, instant if cached) ── */
  function submitPreset(key, vibeText) {
    showLoading(vibeText);

    if (currentAbortController) currentAbortController.abort();
    currentAbortController = new AbortController();
    const { signal } = currentAbortController;

    fetch('/api/presets?name=' + encodeURIComponent(key), { signal })
      .then(res => {
        if (!res.ok) return res.json().catch(() => ({})).then(b => { throw new Error(b.error || 'HTTP ' + res.status); });
        return res.json();
      })
      .then(({ css, js, error }) => {
        if (error) throw new Error(error);
        applyResult(css, js, vibeText);
      })
      .catch(err => {
        if (err.name === 'AbortError') { hideLoading(); return; }
        showError(friendlyError(err.message, null));
      });
  }

  document.querySelectorAll('.console-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => submitPreset(btn.dataset.key, btn.dataset.vibe));
  });

  consoleRun.addEventListener('click', submitVibe);
  consoleInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitVibe(); }
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
    captureStatus.textContent = '// Capturing screenshot\u2026';
    captureStatus.style.display = '';
    fileLabel.style.display = 'none';

    const toHide = [consoleEl, sharePanel, fab];
    toHide.forEach(el => { el.style.visibility = 'hidden'; });

    try {
      await loadHtml2Canvas();
      const pageEl = document.querySelector('.page') || document.body;
      const cvs = await window.html2canvas(pageEl, {
        scale: 0.4, useCORS: true, allowTaint: true, logging: false,
      });
      capturedDataUrl = cvs.toDataURL('image/jpeg', 0.85);
      sharePreview.src = capturedDataUrl;
      sharePreview.style.display = 'block';
      captureStatus.style.display = 'none';
    } catch (err) {
      console.warn('Auto-capture failed, falling back to manual upload:', err);
      captureStatus.textContent = '// Auto-capture unavailable \u2014 upload a screenshot manually';
      fileLabel.style.display = 'flex';
    } finally {
      toHide.forEach(el => { el.style.visibility = ''; });
    }
  }

  /* ═══════════════════════════════════════════
     SHARE PANEL
  ═══════════════════════════════════════════ */
  function openSharePanel() {
    const vibe = localStorage.getItem('ai-vibe') || '';
    document.getElementById('share-panel-title').textContent = '\u2197 Share \u2014 ' + (vibe ? '"' + vibe + '"' : 'redesign');
    shareSuccess.style.display = 'none';
    shareFormWrap.style.display = '';
    const authorInput = document.getElementById('share-author-input');
    if (authorInput) authorInput.value = localStorage.getItem('gallery-author') || '';
    sharePanel.classList.add('open');
    autoCapture();
  }

  function closeSharePanel() { sharePanel.classList.remove('open'); }

  shareBtnEl.addEventListener('click', openSharePanel);
  shareCancelBtn.addEventListener('click', closeSharePanel);
  shareDoneBtn.addEventListener('click', closeSharePanel);
  shareCloseSuccessBtn.addEventListener('click', closeSharePanel);

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) {
      fileNameEl.textContent = fileInput.files[0].name;
      const reader = new FileReader();
      reader.onload = () => { capturedDataUrl = reader.result; };
      reader.readAsDataURL(fileInput.files[0]);
    }
  });

  shareSubmitBtn.addEventListener('click', async () => {
    if (!capturedDataUrl) {
      captureStatus.textContent = '// Still capturing \u2014 try again in a moment';
      captureStatus.style.display = '';
      return;
    }
    shareSubmitBtn.disabled = true;
    shareSubmitBtn.textContent = 'Uploading\u2026';

    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          screenshot: capturedDataUrl,
          vibe:   localStorage.getItem('ai-vibe') || '',
          css:    localStorage.getItem('ai-css')  || '',
          author: document.getElementById('share-author-input')?.value?.trim() || '',
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || 'Upload failed');
      }
      const { id } = await res.json();
      const author = document.getElementById('share-author-input')?.value?.trim();
      if (author) localStorage.setItem('gallery-author', author);
      shareFormWrap.style.display = 'none';
      shareSuccess.style.display = '';
      shareLink.href = '/gallery.html#' + id;
    } catch (err) {
      shareSubmitBtn.textContent = 'Failed \u2014 try again';
      console.error('Share error:', err);
    } finally {
      shareSubmitBtn.disabled = false;
      if (shareSubmitBtn.textContent === 'Uploading\u2026') shareSubmitBtn.textContent = 'Add to archive';
    }
  });

  /* ═══════════════════════════════════════════
     RESTORE FROM LOCALSTORAGE
  ═══════════════════════════════════════════ */
  const savedCss  = localStorage.getItem('ai-css');
  const savedVibe = localStorage.getItem('ai-vibe');
  const savedJs   = localStorage.getItem('ai-js');

  if (savedCss) {
    applyCSS(savedCss);
    injectProtectionStyles();
    showActiveState(savedVibe || '');
  }
  if (savedJs) applyJS(savedJs);

})();
