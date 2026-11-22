// Class 10 Coordinate Geometry: reading a point on the Cartesian plane. Drag P (it snaps to whole numbers): x tells how far
// right (+) or left (-) of the y-axis, y how far up (+) or down (-) of the x-axis. The signs of (x, y) decide the quadrant.
import { canvas, text, title, line, dot, arrow, row, slider, button, choice, readout, loop, touchGuard } from '../../kit.js';

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
  let k = -1;
  touchGuard(cv.c, (x, y) => { const V = getV(); return pts.some((p, i) => (!only || only.includes(i)) && (V.X(p.x) - x) ** 2 + (V.Y(p.y) - y) ** 2 < 28 * 28); });
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
  const P = { x: 3, y: -2 }; let V;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Cartesian plane with a draggable point and its distances from the two axes' });
  const out = readout(host);
  const ctl = row(host);
  button(ctl, 'Random point', () => { P.x = Math.round(Math.random() * 10 - 5); P.y = Math.round(Math.random() * 8 - 4); upd(); });
  button(ctl, 'Put it on an axis', () => { if (Math.random() < 0.5) { P.x = Math.round(Math.random() * 10 - 5); P.y = 0; } else { P.x = 0; P.y = Math.round(Math.random() * 8 - 4); } upd(); });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Drag P: right and up are positive', col);
    V = view(w, h, [-6, 6], [-5, 5], t + 8, 6);
    const q = [[1, 1], [-1, 1], [-1, -1], [1, -1]], names = ['I', 'II', 'III', 'IV'], sg = ['(+, +)', '(−, +)', '(−, −)', '(+, −)'];
    ctx.save(); ctx.font = '700 12px system-ui'; ctx.restore();
    const qi = P.x > 0 && P.y > 0 ? 0 : P.x < 0 && P.y > 0 ? 1 : P.x < 0 && P.y < 0 ? 2 : P.x > 0 && P.y < 0 ? 3 : -1;
    if (qi >= 0) { ctx.fillStyle = col.soft; const [a, b] = q[qi]; ctx.fillRect(Math.min(V.X(0), V.X(a * 6)), Math.min(V.Y(0), V.Y(b * 5)), 6 * V.s, 5 * V.s); }
    grid(ctx, V, col, 1);
    q.forEach(([a, b], i) => text(ctx, `${names[i]} ${sg[i]}`, V.X(a * 4.6), V.Y(b * 4.2), { color: i === qi ? col.s[0] : col.muted, size: 11, weight: 700, align: 'center' }));
    line(ctx, [[V.X(P.x), V.Y(0)], [V.X(P.x), V.Y(P.y)]], col.s[1], 2.5, [5, 4]);
    line(ctx, [[V.X(0), V.Y(P.y)], [V.X(P.x), V.Y(P.y)]], col.s[2], 2.5, [5, 4]);
    dot(ctx, V.X(P.x), V.Y(0), 4, col.s[1]); dot(ctx, V.X(0), V.Y(P.y), 4, col.s[2]);
    pt(ctx, V, P, 'P', col, col.s[0]);
    text(ctx, 'x', V.X(6) - 8, V.Y(0) - 10, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'y', V.X(0) + 9, V.Y(5) + 4, { color: col.ink, size: 12, weight: 700 });
  };
  function upd() {
    const x = P.x, y = P.y, ax = (v, p, n) => (v === 0 ? '' : `${Math.abs(v)} ${v > 0 ? p : n}`);
    const where = x === 0 && y === 0 ? 'the origin, where the axes cross' : y === 0 ? `on the x-axis (y = 0), ${ax(x, 'right of', 'left of')} the origin` : x === 0 ? `on the y-axis (x = 0), ${ax(y, 'above', 'below')} the origin` : `${Math.abs(x)} ${x > 0 ? 'right of' : 'left of'} the y-axis and ${Math.abs(y)} ${y > 0 ? 'above' : 'below'} the x-axis, in quadrant ${x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III')}`;
    out.innerHTML = `<b>P(${x}, ${y})</b>: ${where}.`; cv.redraw();
  }
  drag(cv, () => V, [P], { onmove: upd }); upd();
}
