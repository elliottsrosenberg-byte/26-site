// Behavior for the figure patterns in src/styles/figures.css. Loaded on
// every page from Base.astro; each pattern finds its own markup and does
// nothing when a page has none.

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Filmstrip: prev/next buttons and an "n / N" counter for a sideways row.
function initFilmstrip(fig: HTMLElement) {
  const track = fig.querySelector<HTMLElement>('.filmstrip-track');
  if (!track) return;
  const prev = fig.querySelector<HTMLButtonElement>('[data-dir="-1"]');
  const next = fig.querySelector<HTMLButtonElement>('[data-dir="1"]');
  const count = fig.querySelector<HTMLElement>('.filmstrip-count');
  const items = [...track.children].filter((el) => el.tagName !== 'SCRIPT') as HTMLElement[];
  if (items.length === 0) return;
  const pad = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;

  const current = () => {
    const x = track.scrollLeft + pad();
    let best = 0;
    items.forEach((el, i) => {
      if (Math.abs(el.offsetLeft - x) < Math.abs(items[best].offsetLeft - x)) best = i;
    });
    return best;
  };
  const update = () => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    if (count) count.textContent = `${atEnd ? items.length : current() + 1} / ${items.length}`;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = atEnd;
  };
  const go = (dir: number) => {
    const i = Math.min(items.length - 1, Math.max(0, current() + dir));
    track.scrollTo({ left: items[i].offsetLeft - pad(), behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
}

// Scrollshot: pins a browser window (and its caption) mid-viewport and moves
// the tall page inside it with the reader's own scroll. The outer
// .scrollshot is the runway; its height sets how long the pin lasts.
function initScrollshot(runway: HTMLElement) {
  const stage = runway.querySelector<HTMLElement>('.scrollshot-stage');
  const win = runway.querySelector<HTMLElement>('.scrollshot-window');
  const img = win?.querySelector<HTMLImageElement>('img');
  const bar = runway.querySelector<HTMLElement>('.scrollshot-progress span');
  if (!stage || !win || !img) return;

  // Reader scroll per pixel of page travel. Below 1 the page inside moves
  // faster than the reader scrolls, which keeps long pages from dragging.
  const speed = parseFloat(runway.dataset.speed || '0.55');
  let travel = 0;
  let length = 0;
  let stick = 0;

  const tick = () => {
    const top = runway.getBoundingClientRect().top;
    const p = length ? Math.min(1, Math.max(0, (stick - top) / length)) : 0;
    img.style.transform = `translate3d(0, ${(-p * travel).toFixed(1)}px, 0)`;
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };
  const measure = () => {
    runway.classList.add('is-bound');
    win.removeAttribute('tabindex'); // pinned, the window is not scrollable
    const stageH = stage.offsetHeight;
    stick = Math.max(24, (window.innerHeight - stageH) / 2);
    runway.style.setProperty('--stick', `${stick}px`);
    travel = Math.max(0, img.offsetHeight - win.clientHeight);
    length = travel * speed;
    runway.style.height = `${stageH + length}px`;
    tick();
  };

  let raf = 0;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }, { passive: true });
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(stage);
  if (img.complete && img.naturalWidth) measure();
  else img.addEventListener('load', measure, { once: true });
}

// Lightbox: in a figure marked is-zoomable, a click on any grid image grows
// it out of the grid to the middle of the screen, and a click anywhere puts
// it back. One dialog serves every figure on the page.
function initLightbox() {
  const figures = [...document.querySelectorAll<HTMLElement>('figure.is-zoomable')];
  if (figures.length === 0 || !HTMLDialogElement.prototype.showModal) return;

  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.innerHTML = '<img class="lightbox-img" alt="">';
  document.body.appendChild(dlg);
  const view = dlg.querySelector<HTMLImageElement>('.lightbox-img')!;
  // The site's --ease-out. Both directions use it: an exit that starts slow
  // reads as the interface not having heard the click.
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const OPEN_MS = 200;
  const CLOSE_MS = 130;
  let thumb: HTMLImageElement | null = null;
  let closing = false;

  // The transform that maps the open image back onto the thumbnail it came
  // from. Both show the same file, so one uniform scale keeps them aligned.
  const onto = (el: HTMLElement) => {
    const from = el.getBoundingClientRect();
    const to = view.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${(from.width / to.width).toFixed(4)})`;
  };

  const open = (img: HTMLImageElement) => {
    thumb = img;
    closing = false;
    dlg.classList.remove('is-closing');
    view.getAnimations().forEach((a) => a.cancel());
    // Width and height give the dialog image its intrinsic size at once, so
    // it can be measured before the file has finished decoding. A lazy image
    // that has not loaded reports 0, which would lay out as nothing.
    if (img.naturalWidth) {
      view.width = img.naturalWidth;
      view.height = img.naturalHeight;
    } else {
      view.removeAttribute('width');
      view.removeAttribute('height');
    }
    view.src = img.currentSrc || img.src;
    view.alt = img.alt;
    dlg.setAttribute('aria-label', img.alt);
    document.documentElement.classList.add('has-lightbox');
    dlg.showModal();
    if (reducedMotion()) return;
    view.animate([{ transform: onto(img) }, { transform: 'none' }], {
      duration: OPEN_MS,
      easing: EASE,
    });
  };

  // Every close path unlocks the page: the close event alone is not
  // dependable, and a page left scroll-locked is worse than a stray class.
  const unlock = () => document.documentElement.classList.remove('has-lightbox');
  const shut = () => {
    unlock();
    // Nothing to fly back to once the thumbnail has been scrolled past.
    const visible = thumb && thumb.getBoundingClientRect().bottom > 0
      && thumb.getBoundingClientRect().top < window.innerHeight;
    if (!visible || reducedMotion()) {
      dlg.close();
      return;
    }
    if (closing) return;
    closing = true;
    dlg.classList.add('is-closing');
    const back = view.animate([{ transform: 'none' }, { transform: onto(thumb!) }], {
      duration: CLOSE_MS,
      easing: EASE,
      fill: 'forwards',
    });
    // A timer, not the animation's finished promise: the dialog has to close
    // even where that promise never settles.
    setTimeout(() => {
      closing = false;
      dlg.classList.remove('is-closing');
      back.cancel();
      dlg.close();
    }, CLOSE_MS + 10);
  };

  dlg.addEventListener('close', unlock);
  dlg.addEventListener('cancel', unlock); // Esc
  dlg.addEventListener('click', shut);
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') unlock(); // the dialog closes itself
  });

  figures.forEach((fig) => {
    // Grid images and the loose pages of a filmstrip. Pan cards are nested
    // deeper than the child selector reaches, which is why they stay out.
    fig.querySelectorAll<HTMLImageElement>('.media-grid img, .filmstrip-track > img').forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.addEventListener('click', () => open(img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(img);
        }
      });
    });
  });
}

document.querySelectorAll<HTMLElement>('.filmstrip').forEach(initFilmstrip);
initLightbox();

// Panning filmstrips pause while off screen (they run by default, so a
// missed observer callback never leaves them frozen).
const panning = document.querySelectorAll<HTMLElement>('.filmstrip.is-pan');
if (panning.length) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
    { threshold: 0.15 }
  );
  panning.forEach((el) => io.observe(el));
}
if (!reducedMotion()) document.querySelectorAll<HTMLElement>('.scrollshot').forEach(initScrollshot);
