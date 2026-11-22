// Class 10 Coordinate Geometry: finding the fourth vertex of a parallelogram. The diagonals of a parallelogram bisect each other,
// so the midpoint of AC equals the midpoint of BD. Drag A, B, C: D = A + C - B appears, and both midpoints land on the same dot.
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

export default function (host) {
  const A = { x: 1, y: 1 }, B = { x: 6, y: 2 }, C = { x: 8, y: 6 }; let V;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A parallelogram built from three draggable corners with its diagonals crossing at their midpoint' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Diagonals bisect each other: find D', col);
    V = view(w, h, [-1, 11], [-1, 9], t + 4, 6);
    grid(ctx, V, col, 1);
    const D = { x: A.x + C.x - B.x, y: A.y + C.y - B.y }, M = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 }, X = (p) => V.X(p.x), Y = (p) => V.Y(p.y), P = [A, B, C, D];
    ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0]; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(X(p), Y(p)) : ctx.moveTo(X(p), Y(p)))); ctx.fill(); ctx.restore();
    line(ctx, [...P, A].map((p) => [X(p), Y(p)]), col.s[0], 3);
    line(ctx, [[X(A), Y(A)], [X(C), Y(C)]], col.s[1], 1.8, [6, 4]); line(ctx, [[X(B), Y(B)], [X(D), Y(D)]], col.s[2], 1.8, [6, 4]);
    dot(ctx, X(M), Y(M), 6, col.s[5], col.ink); text(ctx, 'same midpoint', X(M) + 9, Y(M) + 14, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p, l], i) => { dot(ctx, X(p), Y(p), 7, col.s[3 + i], col.ink); text(ctx, `${l}(${p.x}, ${p.y})`, X(p) + 9, Y(p) - 11, { color: col.ink, size: 12, weight: 700, halo: col.panel }); });
    dot(ctx, X(D), Y(D), 7, col.bg, col.s[6] || col.ink); text(ctx, `D(${fm(D.x)}, ${fm(D.y)})`, X(D) + 9, Y(D) - 11, { color: col.ink, size: 12, weight: 700, halo: col.panel });
  };
  function upd() { const D = { x: A.x + C.x - B.x, y: A.y + C.y - B.y }; out.innerHTML = `Midpoint of AC = (${fm((A.x + C.x) / 2)}, ${fm((A.y + C.y) / 2)}). Midpoint of BD must be the same: D = (${A.x} + ${C.x} − ${B.x}, ${A.y} + ${C.y} − ${B.y}) = <b>(${fm(D.x)}, ${fm(D.y)})</b>.`; cv.redraw(); }
  drag(cv, () => V, [A, B, C], { onmove: upd }); upd();
}
