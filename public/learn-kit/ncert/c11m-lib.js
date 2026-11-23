// Shared helpers for the Class 11 Maths figures (prefix c11m-): axes through the origin, pixel shading of regions, number formatting.
import { text } from '../kit.js';

export const r2 = (v, d = 2) => (+(+v).toFixed(d)).toString().replace('-', '−');
/** Label for a multiple of pi/12: 0, π/6, π/2, 3π/2 ... */
export function piLabel(v) {
  if (Math.abs(v) < 1e-9) return '0';
  const k = Math.round((v / Math.PI) * 12), g = (a, b) => (b ? g(b, a % b) : a), d = g(Math.abs(k), 12), n = k / d, m = 12 / d;
  const s = Math.abs(n) === 1 ? '' : String(Math.abs(n));
  return (n < 0 ? '−' : '') + s + 'π' + (m > 1 ? '/' + m : '');
}
/** Grid and axes through the origin. o: x:[a,b], y:[c,d], sx, sy (tick steps), fx, fy (label formatters), l, r, t, b (margins). */
export function plot(ctx, w, h, col, o) {
  const L = o.l ?? 30, R = w - (o.r ?? 12), T = o.t ?? 26, B = h - (o.b ?? 22), [x0, x1] = o.x, [y0, y1] = o.y;
  const X = (v) => L + ((v - x0) / (x1 - x0)) * (R - L), Y = (v) => B - ((v - y0) / (y1 - y0)) * (B - T);
  const sx = o.sx ?? 1, sy = o.sy ?? 1, fx = o.fx ?? r2, fy = o.fy ?? r2, ax = Y(Math.min(y1, Math.max(y0, 0))), ay = X(Math.min(x1, Math.max(x0, 0)));
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = col.line;
  if (o.grid !== false) {
    for (let v = Math.ceil(x0 / sx - 1e-9) * sx; v <= x1 + 1e-9; v += sx) { const x = Math.round(X(v)) + 0.5; ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, B); ctx.stroke(); }
    for (let v = Math.ceil(y0 / sy - 1e-9) * sy; v <= y1 + 1e-9; v += sy) { const y = Math.round(Y(v)) + 0.5; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); }
  }
  ctx.strokeStyle = col.muted; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(L, ax); ctx.lineTo(R, ax); ctx.moveTo(ay, T); ctx.lineTo(ay, B); ctx.stroke();
  ctx.restore();
  for (let v = Math.ceil(x0 / sx - 1e-9) * sx; v <= x1 + 1e-9; v += sx) if (Math.abs(v) > 1e-9 && !o.nolabx) text(ctx, fx(v), X(v), Math.min(B + 10, ax + 10), { color: col.muted, size: 10.5, align: 'center' });
  for (let v = Math.ceil(y0 / sy - 1e-9) * sy; v <= y1 + 1e-9; v += sy) if (Math.abs(v) > 1e-9 && !o.nolaby) text(ctx, fy(v), Math.max(L - 4, ay - 4), Y(v), { color: col.muted, size: 10.5, align: 'right' });
  return { X, Y, L, R, T, B, clip: () => { ctx.beginPath(); ctx.rect(L, T, R - L, B - T); ctx.clip(); }, ix: (px) => x0 + ((px - L) / (R - L)) * (x1 - x0), iy: (py) => y0 + ((B - py) / (B - T)) * (y1 - y0) };
}
/** Draw y = f(x) as a curve in a plot; breaks the line at jumps (|dy| > jump px) and non-finite values. */
export function curve(ctx, P, f, color, width = 2.4, jump = 1e9) {
  ctx.save(); P.clip(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.beginPath();
  let pen = false, py = 0;
  for (let px = P.L; px <= P.R; px += 1) {
    const y = f(P.ix(px)), Y = Number.isFinite(y) ? P.Y(y) : NaN;
    if (!Number.isFinite(Y) || (pen && Math.abs(Y - py) > jump)) { pen = false; if (!Number.isFinite(Y)) continue; }
    pen ? ctx.lineTo(px, Y) : ctx.moveTo(px, Y); pen = true; py = Y;
  }
  ctx.stroke(); ctx.restore();
}
/** Fill every pixel block (step px) of the rectangle where test(x, y) is true. */
export function shade(ctx, x0, y0, x1, y1, test, color, alpha = 0.35, step = 3) {
  ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = alpha;
  for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) if (test(x + step / 2, y + step / 2)) ctx.fillRect(x, y, step, step);
  ctx.restore();
}
/** A rounded button-like chip. */
export function chip(ctx, x, y, w, h, label, on, col, size = 12) {
  ctx.save(); ctx.fillStyle = on ? col.s[0] : col.soft; ctx.globalAlpha = on ? 0.9 : 1; ctx.beginPath(); ctx.roundRect(x, y, w, h, 7); ctx.fill(); ctx.restore();
  ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(x, y, w, h, 7); ctx.stroke();
  text(ctx, label, x + w / 2, y + h / 2, { color: on ? col.panel : col.ink, size, weight: 700, align: 'center' });
}
/** Pointer position in canvas pixels. */
export const pos = (cv, e) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };

/** An Argand-style plot with equal scales inside a box {x, y, w, h} of the canvas; r = half-width in units. Labels: real numbers across, multiples of i up. */
export function argandPlot(ctx, w, h, col, box, r, step = 1) {
  const yr = (box.h / box.w) * r;
  return plot(ctx, w, h, col, { x: [-r, r], y: [-yr, yr], l: box.x, r: w - box.x - box.w, t: box.y, b: h - box.y - box.h, sx: step, sy: step, fy: (v) => (Math.abs(v) === 1 ? (v < 0 ? '−i' : 'i') : r2(v) + 'i') });
}
/** A complex number as text: a + bi with tidy signs. */
export function cstr(a, b, d = 1) {
  const A = +a.toFixed(d), B = +b.toFixed(d);
  if (B === 0) return r2(A, d);
  const bs = Math.abs(B) === 1 ? '' : r2(Math.abs(B), d);
  return (A === 0 ? (B < 0 ? '−' : '') : r2(A, d) + (B < 0 ? ' − ' : ' + ')) + bs + 'i';
}
