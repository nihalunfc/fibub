// Class 10 Coordinate Geometry: naming a quadrilateral from its vertices using only the distance formula. Compute the four
// sides and two diagonals. Diagonals that bisect each other (same midpoint) -> parallelogram; then equal sides -> rhombus,
// equal diagonals -> rectangle, both -> square. Two pairs of equal adjacent sides (not a parallelogram) -> kite.
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

const SHAPES = { square: [[1, 1], [5, 1], [5, 5], [1, 5]], rectangle: [[1, 1], [8, 1], [8, 4], [1, 4]], rhombus: [[0, 3], [4, 0], [8, 3], [4, 6]], parallelogram: [[1, 1], [6, 1], [8, 4], [3, 4]], kite: [[1, 3], [4, 6], [9, 3], [4, 0]], other: [[1, 1], [7, 0], [8, 5], [2, 7]] };
export default function (host) {
  const Q = [0, 1, 2, 3].map(() => ({ x: 0, y: 0 })); let V, name = 'square';
  const set = (k) => { SHAPES[k].forEach(([x, y], i) => { Q[i].x = x; Q[i].y = y; }); name = k; upd(); };
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'A quadrilateral with draggable corners, its sides and diagonals measured and named' });
  const ctl = row(host);
  choice(ctl, 'Start from', [['square', 'Square'], ['rectangle', 'Rectangle'], ['rhombus', 'Rhombus'], ['parallelogram', 'Parallelogram'], ['kite', 'Kite'], ['other', 'Any']], name, set);
  const out = readout(host);
  const d = (p, q) => Math.hypot(p.x - q.x, p.y - q.y), same = (a, b) => Math.abs(a - b) < 1e-9, L = 'ABCD';
  function verdict() {
    const [A, B, C, D] = Q, s = [d(A, B), d(B, C), d(C, D), d(D, A)], dg = [d(A, C), d(B, D)];
    const mid = same((A.x + C.x) / 2, (B.x + D.x) / 2) && same((A.y + C.y) / 2, (B.y + D.y) / 2), allEq = s.every((v) => same(v, s[0])), dEq = same(dg[0], dg[1]);
    if (mid) return allEq ? (dEq ? 'square' : 'rhombus') : dEq ? 'rectangle' : 'parallelogram';
    if ((same(s[0], s[3]) && same(s[1], s[2])) || (same(s[0], s[1]) && same(s[2], s[3]))) return 'kite';
    return 'general quadrilateral';
  }
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Name the shape from its distances', col);
    V = view(w, h, [-1, 10], [-1, 8], t + 4, 6);
    grid(ctx, V, col, 1);
    const X = (p) => V.X(p.x), Y = (p) => V.Y(p.y), [A, B, C, D] = Q;
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); Q.forEach((p, i) => (i ? ctx.lineTo(X(p), Y(p)) : ctx.moveTo(X(p), Y(p)))); ctx.closePath(); ctx.fill(); ctx.restore();
    line(ctx, [...Q, A].map((p) => [X(p), Y(p)]), col.s[0], 3);
    line(ctx, [[X(A), Y(A)], [X(C), Y(C)]], col.s[1], 1.8, [6, 4]); line(ctx, [[X(B), Y(B)], [X(D), Y(D)]], col.s[2], 1.8, [6, 4]);
    for (let i = 0; i < 4; i++) { const p = Q[i], q = Q[(i + 1) % 4]; text(ctx, fm(d(p, q)), (X(p) + X(q)) / 2, (Y(p) + Y(q)) / 2, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); }
    dot(ctx, V.X((A.x + C.x) / 2), V.Y((A.y + C.y) / 2), 4, col.s[1]); dot(ctx, V.X((B.x + D.x) / 2), V.Y((B.y + D.y) / 2), 4, col.s[2]);
    Q.forEach((p, i) => { dot(ctx, X(p), Y(p), 7, col.s[3 + i % 3], col.ink); const cx = Q.reduce((a, q) => a + q.x, 0) / 4, cy = Q.reduce((a, q) => a + q.y, 0) / 4; text(ctx, L[i], X(p) + (p.x >= cx ? 12 : -12), Y(p) + (p.y >= cy ? -12 : 12), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); });
  };
  function upd() {
    const [A, B, C, D] = Q, s = [d(A, B), d(B, C), d(C, D), d(D, A)];
    out.innerHTML = `Sides AB, BC, CD, DA = ${s.map(fm).join(', ')}. Diagonals AC = ${fm(d(A, C))} (orange), BD = ${fm(d(B, D))} (green). Midpoints of the diagonals: ${(A.x + C.x) / 2 === (B.x + D.x) / 2 && (A.y + C.y) / 2 === (B.y + D.y) / 2 ? 'the <b>same point</b>' : 'different points'}. It is a <b>${verdict()}</b>.`; cv.redraw();
  }
  drag(cv, () => V, Q, { onmove: upd }); set('square');
}
