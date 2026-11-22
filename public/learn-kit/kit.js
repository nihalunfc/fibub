// Lesson kit: shared helpers for interactive figures in courses (canvas plots, sliders, animation loops).
// Plain ES module, no build step and no outside libraries. Course figures import it:
//   import { canvas, axes, slider, row, loop } from '/learn-kit/kit.js';
// Every canvas gets the "fibub.com" watermark at 50% opacity in a corner, outside the data.

const cssVar = (n) => getComputedStyle(document.body).getPropertyValue(n).trim();

/** Colours from the page (they follow light and dark mode). s[0..7] = series colours in fixed order. */
export function colors() {
  return {
    ink: cssVar('--ink') || '#111', muted: cssVar('--muted') || '#666', line: cssVar('--line') || '#ddd',
    panel: cssVar('--surface') || '#fff', bg: cssVar('--bg') || '#fff', soft: cssVar('--accent-soft') || '#f2f2f2',
    s: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => cssVar('--s' + i)),
    good: cssVar('--good'), bad: cssVar('--bad'), warn: cssVar('--warn'),
  };
}

export const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
export const font = (px, w = 400) => `${w} ${px}px ${FONT}`;

/** Add an element to a figure, before its caption if it has one (the caption stays last). */
export function put(host, el) {
  const cap = host.querySelector(':scope > figcaption');
  cap ? host.insertBefore(el, cap) : host.appendChild(el);
  return el;
}

const redrawers = new Set();
const redrawAll = () => redrawers.forEach((f) => f());
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', redrawAll);
new MutationObserver(redrawAll).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });

/** True when the reader asked for less motion: animations start paused and jump to their end state. */
export const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A crisp, responsive canvas inside `host`. Set `cv.draw = (ctx, w, h, col) => {...}` then call cv.redraw().
 * It redraws itself on resize and on a light/dark switch.
 */
export function canvas(host, { aspect = 0.6, max = 440, min = 230, label = '', mark = 'tr' } = {}) {
  const c = document.createElement('canvas');
  c.setAttribute('role', 'img');
  if (label) c.setAttribute('aria-label', label);
  put(host, c);
  const ctx = c.getContext('2d');
  const st = { c, ctx, w: 0, h: 0, draw: null, mark };
  st.redraw = () => {
    if (!st.draw || !st.w) return;
    const col = colors();
    ctx.save();
    ctx.clearRect(0, 0, st.w, st.h);
    ctx.fillStyle = col.panel;
    ctx.fillRect(0, 0, st.w, st.h);
    st.draw(ctx, st.w, st.h, col);
    ctx.restore();
    watermark(ctx, st.w, st.h, col, st.mark);
  };
  const inner = () => { const cs = getComputedStyle(host); return host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); };
  const size = () => {
    const w = Math.round(inner() || 600);
    const h = Math.round(Math.max(min, Math.min(max, w * aspect)));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    st.w = w; st.h = h;
    st.redraw();
  };
  new ResizeObserver(() => { if (Math.abs((inner() || 0) - st.w) > 1) size(); }).observe(host);
  redrawers.add(st.redraw);
  size();
  return st;
}

/** The site watermark (fibub.com), 50% opacity, in a corner (tr, tl, br or bl). Plots keep that corner free of data. */
export function watermark(ctx, w, h, col = colors(), where = 'tr') {
  if (!where) return;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.font = font(11, 600);
  ctx.fillStyle = col.muted;
  ctx.textAlign = where.includes('r') ? 'right' : 'left';
  ctx.textBaseline = where.includes('t') ? 'top' : 'bottom';
  ctx.fillText('fibub.com', where.includes('r') ? w - 8 : 8, where.includes('t') ? 5 : h - 5);
  ctx.restore();
}

/** Round tick values for a linear axis. */
export function ticks(a, b, n = 5) {
  const span = Math.abs(b - a) || 1, raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => span / s <= n) || 10 * p;
  const lo = Math.ceil(Math.min(a, b) / step - 1e-9) * step, out = [];
  for (let v = lo; v <= Math.max(a, b) + step * 1e-9; v += step) out.push(+v.toFixed(12));
  return out;
}

/** Short number labels: 1,200 · 0.25 · 3×10⁸ style for very big or small numbers. */
export function fmt(v, digits = 3) {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1e6 || a < 1e-3) {
    const e = Math.floor(Math.log10(a)), m = v / Math.pow(10, e);
    const sup = String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
    return (Math.abs(m - 1) < 1e-9 ? '' : +m.toPrecision(digits) + '×') + '10' + sup;
  }
  return (+v.toPrecision(digits)).toLocaleString('en-CA', { maximumFractionDigits: 6 });
}

/**
 * Draw axes, grid and labels in a box and return mappers X(v), Y(v) from data to pixels.
 * opts: x:[min,max], y:[min,max], xlog, ylog, xlabel, ylabel, fx, fy (tick formatters), xt, yt (tick lists), grid (default true).
 */
export function axes(ctx, w, h, col, o) {
  const m = { l: o.l ?? 54, r: o.r ?? 14, t: o.t ?? 22, b: o.b ?? 42 };
  const L = m.l, R = w - m.r, T = m.t, B = h - m.b;
  const lx = (v) => (o.xlog ? Math.log10(v) : v), ly = (v) => (o.ylog ? Math.log10(v) : v);
  const [x0, x1] = o.x.map(lx), [y0, y1] = o.y.map(ly);
  const X = (v) => L + ((lx(v) - x0) / (x1 - x0)) * (R - L);
  const Y = (v) => B - ((ly(v) - y0) / (y1 - y0)) * (B - T);
  const logTicks = (a, b) => { const out = []; for (let e = Math.ceil(a - 1e-9); e <= b + 1e-9; e++) out.push(Math.pow(10, e)); return out; };
  const xt = o.xt ?? (o.xlog ? logTicks(x0, x1) : ticks(o.x[0], o.x[1], Math.max(2, Math.floor((R - L) / 70))));
  const yt = o.yt ?? (o.ylog ? logTicks(y0, y1) : ticks(o.y[0], o.y[1], Math.max(2, Math.floor((B - T) / 45))));
  ctx.save();
  ctx.lineWidth = 1;
  ctx.font = font(11);
  ctx.fillStyle = col.muted;
  ctx.strokeStyle = col.line;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (const v of xt) {
    const x = Math.round(X(v)) + 0.5;
    if (o.grid !== false) { ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, B); ctx.stroke(); }
    ctx.fillText((o.fx ?? fmt)(v), x, B + 5);
  }
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (const v of yt) {
    const y = Math.round(Y(v)) + 0.5;
    if (o.grid !== false) { ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); }
    ctx.fillText((o.fy ?? fmt)(v), L - 6, y);
  }
  ctx.strokeStyle = col.muted;
  ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
  ctx.fillStyle = col.ink;
  ctx.font = font(12, 600);
  if (o.xlabel) { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(o.xlabel, (L + R) / 2, h - 4); }
  if (o.ylabel) { ctx.save(); ctx.translate(13, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.ylabel, 0, 0); ctx.restore(); }
  ctx.restore();
  return { X, Y, L, R, T, B, clip: () => { ctx.beginPath(); ctx.rect(L, T, R - L, B - T); ctx.clip(); } };
}

/** A 2 px line through [x, y] pixel points. */
export function line(ctx, pts, color, width = 2, dash) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  ctx.restore();
}

export function dot(ctx, x, y, r, fill, ring) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
  if (ring) { ctx.lineWidth = 2; ctx.strokeStyle = ring; ctx.stroke(); }
}

/** Text with a halo in the panel colour so it stays readable over lines. */
export function text(ctx, s, x, y, { color, size = 12, weight = 400, align = 'left', base = 'middle', halo, fit = true } = {}) {
  ctx.save();
  ctx.font = font(size, weight); ctx.textAlign = align; ctx.textBaseline = base;
  if (fit) {
    // keep the whole label on the canvas: shrink it if it is wider than the canvas, then slide it inside
    const W = ctx.canvas.width / (ctx.getTransform().a || 1), tw = ctx.measureText(s).width;
    if (tw > W - 8) { size = size * (W - 8) / tw; ctx.font = font(size, weight); }
    const w2 = ctx.measureText(s).width, left = align === 'center' ? x - w2 / 2 : align === 'right' ? x - w2 : x;
    if (left < 4) x += 4 - left; else if (left + w2 > W - 4) x -= left + w2 - (W - 4);
  }
  if (halo) { ctx.lineWidth = 4; ctx.strokeStyle = halo; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  ctx.fillStyle = color; ctx.fillText(s, x, y);
  ctx.restore();
}

/** A figure title in the top-left corner that never runs into the watermark (wraps to two lines if needed). */
export function title(ctx, s, col, y = 16) {
  const W = ctx.canvas.width / (ctx.getTransform().a || 1), room = W - 96;
  ctx.save(); ctx.font = font(12.5, 700);
  let lines = [s];
  if (ctx.measureText(s).width > room) {
    const words = s.split(' '); let a = '';
    for (let i = 0; i < words.length; i++) { const tryA = a ? a + ' ' + words[i] : words[i]; if (ctx.measureText(tryA).width > room && a) { lines = [a, words.slice(i).join(' ')]; break; } a = tryA; }
  }
  ctx.restore();
  lines.forEach((l, i) => text(ctx, l, 10, y + i * 16, { color: col.ink, size: 12.5, weight: 700 }));
  return y + lines.length * 16;
}

export function arrow(ctx, x0, y0, x1, y1, color, width = 2, head = 8) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(a) * head * 0.6, y1 - Math.sin(a) * head * 0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - head * Math.cos(a - 0.4), y1 - head * Math.sin(a - 0.4));
  ctx.lineTo(x1 - head * Math.cos(a + 0.4), y1 - head * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** A row of controls under a figure. */
export function row(host) {
  const d = document.createElement('div');
  d.className = 'lk-controls';
  put(host, d);
  return d;
}

/** A labelled slider with its value shown. Returns { get value, set(v) }. */
export function slider(parent, { label, min, max, step = 'any', value, fmt: f = (v) => fmt(v), oninput, log = false }) {
  const wrap = document.createElement('label');
  wrap.className = 'lk-slider';
  const name = document.createElement('span'); name.textContent = label;
  const out = document.createElement('output');
  const inp = document.createElement('input');
  inp.type = 'range';
  const toPos = (v) => (log ? Math.log10(v) : v), fromPos = (p) => (log ? Math.pow(10, p) : p);
  inp.min = toPos(min); inp.max = toPos(max); inp.step = log ? 'any' : step; inp.value = toPos(value);
  inp.setAttribute('aria-label', label);
  const api = {
    get value() { return fromPos(+inp.value); },
    set(v) { inp.value = toPos(v); out.textContent = f(api.value); },
  };
  out.textContent = f(value);
  inp.addEventListener('input', () => { out.textContent = f(api.value); oninput && oninput(api.value); });
  wrap.append(name, inp, out);
  parent.appendChild(wrap);
  return api;
}

/** A button in a controls row. */
export function button(parent, label, onclick, cls = '') {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'lk-btn ' + cls; b.textContent = label;
  b.addEventListener('click', onclick);
  parent.appendChild(b);
  return b;
}

/** A set of choice buttons; returns { get value }. */
export function choice(parent, label, options, value, onchange) {
  const g = document.createElement('div');
  g.className = 'lk-choice'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', label);
  const lab = document.createElement('span'); lab.textContent = label; g.appendChild(lab);
  let cur = value;
  const bs = options.map(([v, t]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = t; b.setAttribute('aria-pressed', String(v === cur));
    b.addEventListener('click', () => { cur = v; bs.forEach((x, i) => x.setAttribute('aria-pressed', String(options[i][0] === cur))); onchange && onchange(v); });
    g.appendChild(b);
    return b;
  });
  parent.appendChild(g);
  return { get value() { return cur; } };
}

/** A small line of live text under a figure (numbers that change as you move a slider). */
export function readout(parent) {
  const p = document.createElement('p');
  p.className = 'lk-readout'; p.setAttribute('aria-live', 'polite');
  put(parent, p);
  return p;
}

/**
 * An animation loop that runs only while the figure is on screen. tick(dt seconds, t total).
 * Returns { play, pause, toggle, playing, button(parent) }.
 */
export function loop(host, tick, { autoplay = true } = {}) {
  let raf = 0, last = 0, t = 0, want = autoplay && !calm(), seen = false, btn;
  const frame = (now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now; t += dt;
    tick(dt, t);
    raf = requestAnimationFrame(frame);
  };
  const run = () => { if (!raf && want && seen) { last = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; seen ? run() : stop(); }).observe(host);
  const label = () => btn && (btn.textContent = want ? '❚❚ Pause' : '▶ Play');
  const api = {
    play() { want = true; run(); label(); },
    pause() { want = false; stop(); label(); },
    toggle() { want ? api.pause() : api.play(); },
    get playing() { return want; },
    reset() { t = 0; },
    button(parent) { btn = button(parent, '', () => api.toggle()); label(); return btn; },
  };
  return api;
}

/** Clamp, lerp and ease helpers for animations. */
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Seeded random numbers (same picture on every visit). */
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
