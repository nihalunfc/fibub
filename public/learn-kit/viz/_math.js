// Small helpers for the mathematics figures: draggable handles on a canvas and curve plotting that breaks at jumps.
import { line } from '../kit.js';

/** Make handles draggable. hits() -> [[px, py], ...] in canvas pixels; move(i, px, py) is called while dragging. */
export function drag(cv, hits, move, r = 18) {
  const c = cv.c; let id = null, k = -1;
  c.style.cursor = 'crosshair';
  const pos = (e) => { const b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  // On phones a finger that lands on a handle drags it; anywhere else the page scrolls as usual.
  c.addEventListener('touchstart', (e) => {
    const t = e.touches[0], b = c.getBoundingClientRect(), x = t.clientX - b.left, y = t.clientY - b.top;
    if (hits().some(([hx, hy]) => (hx - x) ** 2 + (hy - y) ** 2 < r * r)) e.preventDefault();
  }, { passive: false });
  c.addEventListener('pointerdown', (e) => {
    const [x, y] = pos(e); let best = r * r;
    hits().forEach(([hx, hy], i) => { const d = (hx - x) ** 2 + (hy - y) ** 2; if (d < best) { best = d; k = i; } });
    if (k >= 0 && best < r * r + 1) { id = e.pointerId; c.setPointerCapture?.(id); e.preventDefault(); }
  });
  c.addEventListener('pointermove', (e) => { if (id !== e.pointerId || k < 0) return; const [x, y] = pos(e); move(k, x, y); });
  const end = () => { id = null; k = -1; };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
}

/** Plot y = f(x) for x in [a, b] with mappers X, Y; gaps where f is not finite or jumps more than `jump` pixels. */
export function curve(ctx, A, f, a, b, color, width = 2, { n = 240, dash, jump = 1e9 } = {}) {
  ctx.save(); A.clip();
  let seg = [], last = null;
  const flush = () => { if (seg.length > 1) line(ctx, seg, color, width, dash); seg = []; };
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n, y = f(x);
    if (!Number.isFinite(y)) { flush(); last = null; continue; }
    const p = [A.X(x), A.Y(y)];
    if (last !== null && Math.abs(p[1] - last) > jump) flush();
    seg.push(p); last = p[1];
  }
  flush(); ctx.restore();
}

export const f2 = (v, d = 2) => (Math.abs(v) < 1e-9 ? 0 : +v.toFixed(d)).toString().replace('-', '−');
