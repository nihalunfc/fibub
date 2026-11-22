// Class 10 Coordinate Geometry (step player): deriving the section formula with similar triangles, for A(2, 1), B(8, 7) and
// P dividing AB in the ratio 1 : 2. Triangles APQ and PBR are similar, so AQ/PR = AP/PB = m/n, which solves to x = (m x2 + n x1)/(m + n).
import { canvas, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const fm = (v) => String(+(+v).toFixed(2));
/** Equal-scale view: data x0..x1, y0..y1 fitted under the title. */
function view(w, h, [x0, x1], [y0, y1], top = 30, bot = 8, side = 12) {
  const s = Math.min((w - 2 * side) / (x1 - x0), (h - top - bot) / (y1 - y0));
  const ox = (w - s * (x1 - x0)) / 2, oy = top + (h - top - bot - s * (y1 - y0)) / 2;
  return { s, x0, x1, y0, y1, X: (v) => ox + (v - x0) * s, Y: (v) => oy + (y1 - v) * s, ix: (p) => x0 + (p - ox) / s, iy: (p) => y1 - (p - oy) / s };
}
/** Grid lines, axes and small tick numbers. */
function grid(ctx, V, col, every = 1) {
  ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = col.line;
  for (let x = Math.ceil(V.x0); x <= V.x1; x++) { const p = Math.round(V.X(x)) + 0.5; ctx.beginPath(); ctx.moveTo(p, V.Y(V.y1)); ctx.lineTo(p, V.Y(V.y0)); ctx.stroke(); }
  for (let y = Math.ceil(V.y0); y <= V.y1; y++) { const p = Math.round(V.Y(y)) + 0.5; ctx.beginPath(); ctx.moveTo(V.X(V.x0), p); ctx.lineTo(V.X(V.x1), p); ctx.stroke(); }
  ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5;
  const ax = V.x0 <= 0 && V.x1 >= 0, ay = V.y0 <= 0 && V.y1 >= 0;
  if (ay) { ctx.beginPath(); ctx.moveTo(V.X(V.x0), V.Y(0)); ctx.lineTo(V.X(V.x1), V.Y(0)); ctx.stroke(); }
  if (ax) { ctx.beginPath(); ctx.moveTo(V.X(0), V.Y(V.y0)); ctx.lineTo(V.X(0), V.Y(V.y1)); ctx.stroke(); }
  ctx.restore();
  const yb = ay ? V.Y(0) + 9 : V.Y(V.y0) + 9, xl = ax ? V.X(0) - 8 : V.X(V.x0) + 8;
  for (let x = Math.ceil(V.x0); x <= V.x1; x += every) if (x !== 0 || !ax) text(ctx, String(x), V.X(x), Math.min(yb, V.Y(V.y0) + 9), { color: col.muted, size: 10, align: 'center', halo: col.panel, fit: false });
  for (let y = Math.ceil(V.y0); y <= V.y1; y += every) if (y !== 0 || !ay) text(ctx, String(y), Math.max(xl, V.X(V.x0) - 8), V.Y(y), { color: col.muted, size: 10, align: 'right', halo: col.panel, fit: false });
}
/** Make points draggable. getV() gives the current view, pts are {x,y} objects, snap rounds to whole numbers. */
function drag(cv, getV, pts, { snap = true, onmove, only } = {}) {
  let k = -1; cv.c.style.touchAction = 'none';
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.c.addEventListener('pointerdown', (e) => {
    const V = getV(), [x, y] = pos(e); let best = 28 * 28; k = -1;
    pts.forEach((p, i) => { if (only && !only.includes(i)) return; const d = (V.X(p.x) - x) ** 2 + (V.Y(p.y) - y) ** 2; if (d < best) { best = d; k = i; } });
    if (k >= 0) { cv.c.setPointerCapture(e.pointerId); e.preventDefault(); }
  });
  cv.c.addEventListener('pointermove', (e) => {
    if (k < 0) return; const V = getV(), [x, y] = pos(e); let a = V.ix(x), b = V.iy(y);
    a = Math.max(V.x0 + 0.3, Math.min(V.x1 - 0.3, a)); b = Math.max(V.y0 + 0.3, Math.min(V.y1 - 0.3, b));
    if (snap) { a = Math.round(a); b = Math.round(b); }
    pts[k].x = a; pts[k].y = b; onmove && onmove(k);
  });
  const end = () => { k = -1; }; cv.c.addEventListener('pointerup', end); cv.c.addEventListener('pointercancel', end);
}
const pt = (ctx, V, p, label, col, tone, r = 7) => { dot(ctx, V.X(p.x), V.Y(p.y), r, tone, col.ink); text(ctx, `${label}(${fm(p.x)}, ${fm(p.y)})`, V.X(p.x) + 9, V.Y(p.y) - 11, { color: col.ink, size: 12, weight: 700, halo: col.panel }); };
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };

const MSG = ['A(2, 1) and B(8, 7). P is on AB with AP : PB = 1 : 2. We want the coordinates (x, y) of P.', 'Draw the horizontal lines through A and P, and the vertical lines through P and B. Two small right triangles appear: APQ and PBR.', 'They are similar (same angles, parallel sides). So AQ / PR = AP / PB = 1 / 2.', 'AQ = x − 2 and PR = 8 − x. So (x − 2) / (8 − x) = 1 / 2. Cross-multiply: 2(x − 2) = 1(8 − x).', 'Solve: 3x = 8 + 4 = 12, so x = 4. In general: x = (m x₂ + n x₁) / (m + n).', 'The same with QP and RB for y: y = (m y₂ + n y₁) / (m + n) = (1·7 + 2·1) / 3 = 3. So P = (4, 3).', 'Check by distance: AP = √(4 + 4) = 2√2 and PB = √(16 + 16) = 4√2. The ratio AP : PB is 1 : 2. It works.'];
export default function (host) {
  let s = 0, V; const A = { x: 2, y: 1 }, B = { x: 8, y: 7 }, P = { x: 4, y: 3 }, Q = { x: 4, y: 1 }, R = { x: 8, y: 3 };
  const cv = canvas(host, { aspect: 1.02, max: 440, min: 340, label: 'Step by step derivation of the section formula using two similar right triangles' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'The section formula from similar triangles', col);
    V = view(w, h, [0, 10], [0, 9], t + 4, 64);
    grid(ctx, V, col, 1);
    const X = (p) => V.X(p.x), Y = (p) => V.Y(p.y), L = (p, q, c, wd = 2.5, dsh) => line(ctx, [[X(p), Y(p)], [X(q), Y(q)]], c, wd, dsh);
    L(A, B, col.ink, 2);
    if (s >= 1) { L(A, Q, col.s[1], 3.5); L(Q, P, col.s[1], 2, [4, 3]); L(P, R, col.s[2], 3.5); L(R, B, col.s[2], 2, [4, 3]);
      text(ctx, 'Q', X(Q) + 4, Y(Q) + 13, { color: col.ink, size: 12, weight: 700, halo: col.panel }); text(ctx, 'R', X(R) + 10, Y(R) + 4, { color: col.ink, size: 12, weight: 700, halo: col.panel }); }
    if (s >= 2) { ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[1]; ctx.beginPath(); [A, Q, P].forEach((p, i) => (i ? ctx.lineTo(X(p), Y(p)) : ctx.moveTo(X(p), Y(p)))); ctx.fill(); ctx.fillStyle = col.s[2]; ctx.beginPath(); [P, R, B].forEach((p, i) => (i ? ctx.lineTo(X(p), Y(p)) : ctx.moveTo(X(p), Y(p)))); ctx.fill(); ctx.restore(); }
    if (s >= 3) { text(ctx, 'x − 2', (X(A) + X(Q)) / 2, Y(A) + 14, { color: col.s[1], size: 12, weight: 700, align: 'center', halo: col.panel }); text(ctx, '8 − x', (X(P) + X(R)) / 2, Y(P) + 14, { color: col.s[2], size: 12, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 5) { text(ctx, 'y − 1', X(Q) - 6, (Y(Q) + Y(P)) / 2, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel }); text(ctx, '7 − y', X(R) + 6, (Y(R) + Y(B)) / 2, { color: col.s[2], size: 11, weight: 700, halo: col.panel }); }
    dot(ctx, X(A), Y(A), 6, col.s[3], col.ink); dot(ctx, X(B), Y(B), 6, col.s[4], col.ink); dot(ctx, X(P), Y(P), 6, col.s[0], col.ink);
    text(ctx, 'A(2, 1)', X(A) - 9, Y(A) + 13, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel }); text(ctx, 'B(8, 7)', X(B) - 8, Y(B) - 3, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
    text(ctx, s >= 5 ? 'P(4, 3)' : s >= 4 ? 'P(4, y)' : 'P(x, y)', X(P) - 9, Y(P) - 9, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
    wrap(ctx, MSG[Math.min(s, 6)], w, h - 8, col, 12);
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
