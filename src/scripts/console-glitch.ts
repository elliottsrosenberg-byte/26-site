// Broken pixels around the console button: the site's hint that it can be
// taken apart. Two fields share one engine: a patch in the page's
// bottom-right corner (console shadow root) and a smaller one inside the
// button itself (FAB shadow root), both anchored to their bottom-right
// corner so they read as one pattern. Tiles use backdrop-filter, so they
// blur and invert whatever is beneath, including a redesigned page.
//
// At rest it barely moves and stays mostly grey; hovering the button lets
// it spread and pick up color, and it settles quickly once the pointer
// leaves. First visit of a session, it creeps in a few seconds after load.

const PALETTE = ['#ff2d1f', '#2146ff', '#12d98a', '#ff3dc8', '#ffe033'];
const INK_ALPHAS = [0.05, 0.08, 0.12, 0.18, 0.3, 0.55];
const SOFT_ALPHAS = [0.03, 0.05, 0.07, 0.1, 0.14, 0.2];

const TILE_CSS = `
  .t-blur { backdrop-filter: blur(8px) saturate(1.4); -webkit-backdrop-filter: blur(8px) saturate(1.4); background: rgba(var(--px-ink), 0.04); }
  .t-inv { backdrop-filter: invert(1); -webkit-backdrop-filter: invert(1); }
`;

export const GLITCH_CSS = `
  .glitch { position: absolute; right: 0; bottom: 0; width: 0; height: 0; pointer-events: none; transition: visibility 0s 150ms; }
  :host(.open) .glitch { visibility: hidden; transition: none; }
  .glitch i { position: absolute; right: 0; bottom: 0; }
  .px-bg { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
  .px-bg i, .edge i { position: absolute; }
  ${TILE_CSS}
`;

export const FAB_PX_CSS = `
  .fab { position: relative; overflow: hidden; }
  .fab-px { position: absolute; inset: 0; pointer-events: none; }
  .fab-px i { position: absolute; right: 0; bottom: 0; }
  ${TILE_CSS}
`;

interface Rest {
  n: number;      // live tiles in the corner
  w: number;      // corner field width from the right edge
  h: number;      // corner field height from the bottom edge
  btn: number;    // live tiles in the button
  color: number;  // share of tiles in color
  churn: number;  // share of tiles re-placed per tick
  big: number;    // share of 2-3 unit blocks
  tick: number;   // ms between frames
}

const HOME: Rest = { n: 24, w: 240, h: 124, btn: 5, color: 0.02, churn: 0.08, big: 0.06, tick: 520 };
const QUIET: Rest = { n: 8, w: 120, h: 60, btn: 2, color: 0, churn: 0.05, big: 0, tick: 800 };
const HOVER: Rest = { n: 72, w: 420, h: 210, btn: 20, color: 0.22, churn: 0.32, big: 0.3, tick: 90 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const small = () => innerWidth <= 640;

interface Tile { d: HTMLElement; x: number; y: number; placed: boolean }
interface Region { n: number; w: number; h: number; u: number }
interface Mix { color: number; big: number; inv: number }

const pool = (el: HTMLElement, n: number): Tile[] =>
  Array.from({ length: n }, () => {
    const d = document.createElement('i');
    el.appendChild(d);
    return { d, x: 0, y: 0, placed: false };
  });

// Rejection-sample a cell, densest at the bottom-right corner.
function place(t: Tile, R: Region, M: Mix) {
  const { u } = R;
  let x = 0, y = 0;
  for (let k = 0; k < 12; k++) {
    x = Math.floor(Math.random() * Math.max(1, R.w / u)) * u;
    y = Math.floor(Math.random() * Math.max(1, R.h / u)) * u;
    const p = Math.pow(Math.max(0, 1 - Math.hypot(x / R.w, y / R.h)), 1.4);
    if (Math.random() < p) break;
  }
  t.x = x;
  t.y = y;
  t.placed = true;
  const size = Math.random() < M.big ? pick([2, 2, 3]) : 1;
  const wide = Math.random() < 0.18 ? size * 2 : size;
  const r = Math.random();
  let cls = '';
  let bg = '';
  let op = 1;
  if (r < M.color) { bg = pick(PALETTE); op = rand(0.6, 0.9); }
  else if (r < M.color + 0.38) cls = 't-blur';
  else if (r < M.color + 0.48) { cls = 't-inv'; op = M.inv; }
  else bg = `rgba(var(--px-ink), ${pick(INK_ALPHAS)})`;
  t.d.className = cls;
  t.d.style.cssText = `width:${wide * u}px;height:${size * u}px;transform:translate(${-x}px,${-y}px);background:${bg};opacity:${op}`;
}

function paint(tiles: Tile[], R: Region, M: Mix, churn: number) {
  tiles.forEach((t, i) => {
    const live = i < R.n;
    t.d.style.display = live ? '' : 'none';
    if (!live) return;
    // Tiles stranded outside a shrinking field come home right away.
    if (!t.placed || t.x >= R.w || t.y >= R.h || Math.random() < churn) place(t, R, M);
  });
}

export interface Glitch {
  setHover(on: boolean): void;
}

export function mountGlitch(corner: HTMLElement, button: HTMLElement, opts: { quiet: boolean; intro: boolean }): Glitch {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rest = opts.quiet ? QUIET : HOME;
  const cornerTiles = pool(corner, HOVER.n);
  const buttonTiles = pool(button, HOVER.btn);

  let hover = false;
  let h = 0; // 0 at rest .. 1 hovered
  // Intro: the fields grow from nothing, starting a few seconds in.
  let amount = opts.intro && !still ? 0 : 1;
  const introAt = amount < 1 ? performance.now() + rand(6000, 8500) : 0;
  let timer = 0;

  const frame = (settling = false) => {
    const s = small() ? 0.6 : 1;
    const grow = Math.sqrt(amount);
    const M: Mix = { color: lerp(rest.color, HOVER.color, h), big: lerp(rest.big, HOVER.big, h), inv: lerp(0.35, 0.9, h) };
    // Settling swaps tiles out fast so hover color doesn't linger.
    const churn = settling ? 0.6 : lerp(rest.churn, HOVER.churn, h);
    paint(cornerTiles, {
      n: Math.round(lerp(rest.n, HOVER.n, h) * amount),
      w: lerp(rest.w, HOVER.w, h) * s * grow,
      h: lerp(rest.h, HOVER.h, h) * s * grow,
      u: small() ? 8 : 12,
    }, M, churn);
    // Inside the button: the right half at rest, all of it on hover.
    const bw = button.clientWidth;
    const bh = button.clientHeight;
    paint(buttonTiles, {
      n: Math.round(lerp(rest.btn, HOVER.btn, h) * amount),
      w: lerp(bw * 0.5, bw, h) * grow,
      h: bh * grow,
      u: 6,
    }, { ...M, big: M.big * 0.5 }, churn);
    return lerp(rest.tick, HOVER.tick, h);
  };

  const tick = () => {
    if (introAt && performance.now() > introAt) amount = Math.min(1, amount + 0.035);
    const settling = !hover && h > 0;
    h += ((hover ? 1 : 0) - h) * (hover ? 0.35 : 0.5);
    if (h < 0.02) h = 0;
    if (settling && h === 0) [...cornerTiles, ...buttonTiles].forEach((t) => (t.placed = false));
    const wait = frame(settling);
    // Quick frames while settling so it calms down fast; a steady pace
    // while the intro creeps in.
    timer = window.setTimeout(tick, amount < 1 ? 140 : h > 0 && !hover ? 80 : wait);
  };

  if (still) {
    // No motion: one settled frame; hover shows the grown state.
    frame();
    return {
      setHover(on) {
        h = on ? 1 : 0;
        frame();
      },
    };
  }

  document.addEventListener('visibilitychange', () => {
    clearTimeout(timer);
    if (!document.hidden) tick();
  });
  tick();
  return {
    setHover(on) {
      if (on === hover) return;
      hover = on;
      // Hovering before the intro lands skips the wait.
      if (on) amount = Math.max(amount, 0.6);
      clearTimeout(timer);
      tick();
    },
  };
}

// Inside the open console: a sparse band of small pixels along the top
// edge and a grey mosaic rising out of the bottom-right corner, the same
// corner the page field came from. Soft enough to sit behind the text;
// a couple of pixels shift now and then.
export function consolePixels(bg: HTMLElement, edge: HTMLElement) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const band = pool(edge, 44);
  const mosaic = pool(bg, 46);
  let timer = 0;

  const placeBand = (t: Tile) => {
    const u = 6;
    const W = edge.parentElement?.clientWidth ?? innerWidth;
    const x = Math.floor(Math.pow(Math.random(), 1.6) * (W / u)) * u;
    const y = Math.floor(Math.pow(Math.random(), 2.2) * 3) * u;
    const color = Math.random() < 0.03;
    t.d.style.cssText = `right:${x}px;top:${y}px;width:${Math.random() < 0.2 ? u * 2 : u}px;height:${u}px;background:${color ? pick(PALETTE) : `rgba(var(--px-ink), ${pick(SOFT_ALPHAS)})`};opacity:${color ? 0.45 : 1}`;
  };
  const placeMosaic = (t: Tile) => {
    const u = small() ? 8 : 12;
    const W = Math.min(560, bg.clientWidth * 0.6);
    const H = Math.min(280, bg.clientHeight);
    let x = 0, y = 0;
    for (let k = 0; k < 12; k++) {
      x = Math.floor(Math.random() * (W / u)) * u;
      y = Math.floor(Math.random() * (H / u)) * u;
      if (Math.random() < Math.pow(Math.max(0, 1 - Math.hypot(x / W, y / H)), 1.3)) break;
    }
    const size = Math.random() < 0.12 ? 2 : 1;
    const color = Math.random() < 0.025;
    t.d.style.cssText = `right:${x}px;bottom:${y}px;width:${(Math.random() < 0.15 ? 2 : 1) * size * u}px;height:${size * u}px;background:${color ? pick(PALETTE) : `rgba(var(--px-ink), ${pick(SOFT_ALPHAS)})`};opacity:${color ? 0.3 : 1}`;
  };

  const drift = () => {
    placeBand(pick(band));
    placeMosaic(pick(mosaic));
    placeMosaic(pick(mosaic));
    timer = window.setTimeout(drift, 650);
  };

  return {
    start() {
      band.forEach(placeBand);
      mosaic.forEach(placeMosaic);
      clearTimeout(timer);
      if (!still) timer = window.setTimeout(drift, 650);
    },
    stop() {
      clearTimeout(timer);
    },
  };
}
