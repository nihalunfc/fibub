// Class 10 Coordinate Geometry (step player): deriving the distance formula for A(1, 2) and B(7, 6).
// Drop a horizontal line from A and a vertical one from B to meet at C: a right angle at C. AC = x2 - x1, BC = y2 - y1,
// then Pythagoras gives AB^2 = 6^2 + 4^2 = 52, so AB = sqrt(52) = 2 sqrt(13).
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

const MSG = ['Two points on the plane: A(1, 2) and B(7, 6). How far apart are they? A ruler on the grid would only give a guess.', 'Go along the grid: draw a horizontal line from A and a vertical line from B. They meet at C(7, 2), and the angle at C is a right angle.', 'AC runs along the x direction. Count the squares: AC = 7 − 1 = 6, which is x₂ − x₁.', 'BC runs along the y direction: BC = 6 − 2 = 4, which is y₂ − y₁.', 'ABC is a right triangle with AB as the hypotenuse. Pythagoras: AB² = AC² + BC² = 6² + 4² = 36 + 16 = 52.', 'AB = √52 = 2√13 ≈ 7.21 units. No ruler needed, only the coordinates.', 'The same steps for any two points give the distance formula: AB = √[(x₂ − x₁)² + (y₂ − y₁)²].'];
export default function (host) {
  let s = 0, V; const A = { x: 1, y: 2 }, B = { x: 7, y: 6 }, C = { x: 7, y: 2 };
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Step by step derivation of the distance between two points using a right triangle' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Distance between A(1, 2) and B(7, 6)', col);
    V = view(w, h, [-1, 9], [0, 8], t + 4, 62);
    grid(ctx, V, col, 1);
    const X = (p) => V.X(p.x), Y = (p) => V.Y(p.y);
    if (s >= 1) { line(ctx, [[X(A), Y(A)], [X(C), Y(C)]], col.s[1], 3, s < 2 ? [6, 4] : undefined); line(ctx, [[X(C), Y(C)], [X(B), Y(B)]], col.s[2], 3, s < 3 ? [6, 4] : undefined); line(ctx, [[X(C) - 9, Y(C)], [X(C) - 9, Y(C) - 9], [X(C), Y(C) - 9]], col.ink, 1.3); text(ctx, 'C(7, 2)', X(C) + 8, Y(C) + 12, { color: col.ink, size: 12, weight: 700, halo: col.panel }); }
    if (s >= 2) text(ctx, '6', (X(A) + X(C)) / 2, Y(C) + 15, { color: col.s[1], size: 14, weight: 700, align: 'center', halo: col.panel });
    if (s >= 3) text(ctx, '4', X(C) + 14, (Y(C) + Y(B)) / 2, { color: col.s[2], size: 14, weight: 700, halo: col.panel });
    if (s >= 4) { line(ctx, [[X(A), Y(A)], [X(B), Y(B)]], col.s[0], 3.5); text(ctx, s >= 5 ? 'AB = √52' : 'AB', (X(A) + X(B)) / 2 - 8, (Y(A) + Y(B)) / 2 - 12, { color: col.s[0], size: 13, weight: 700, align: 'right', halo: col.panel }); }
    dot(ctx, X(A), Y(A), 6, col.s[3], col.ink); dot(ctx, X(B), Y(B), 6, col.s[4], col.ink);
    text(ctx, 'A', X(A) - 10, Y(A) + 12, { color: col.ink, size: 13, weight: 700, halo: col.panel }); text(ctx, 'B', X(B) + 9, Y(B) - 9, { color: col.ink, size: 13, weight: 700, halo: col.panel });
    wrap(ctx, MSG[Math.min(s, 6)], w, h - 8, col, 12);
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
