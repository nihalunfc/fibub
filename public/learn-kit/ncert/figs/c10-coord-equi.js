// Class 10 Coordinate Geometry: a point equidistant from two given points. A(2, 3) and B(6, -1) are fixed. Slide P along the
// x-axis (or the y-axis) and watch PA and PB. They are equal at exactly one place, where the axis meets the perpendicular
// bisector of AB. Setting PA^2 = PB^2 gives a simple equation (the squares cancel), solved by the readout.
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
  const A = { x: 2, y: 3 }, B = { x: 6, y: -1 }; let V, ax = 'x', v = 0, bis = 'off';
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 320, label: 'A point sliding along an axis with its distances to two fixed points' });
  const ctl = row(host);
  choice(ctl, 'P moves on', [['x', 'x-axis'], ['y', 'y-axis']], ax, (a) => { ax = a; sl.set(0); v = 0; upd(); });
  const sl = slider(ctl, { label: 'Position of P', min: -4, max: 9, step: 0.1, value: v, fmt: (q) => q.toFixed(1), oninput: (q) => { v = q; upd(); } });
  choice(ctl, 'Perpendicular bisector of AB', [['off', 'Hide'], ['on', 'Show']], bis, (b) => { bis = b; upd(); });
  const out = readout(host);
  const P = () => (ax === 'x' ? { x: v, y: 0 } : { x: 0, y: v });
  const dd = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Where is PA = PB?', col);
    V = view(w, h, [-5, 10], [-5, 6], t + 4, 6);
    grid(ctx, V, col, 1);
    const X = (p) => V.X(p.x), Y = (p) => V.Y(p.y), p = P(), da = dd(p, A), db = dd(p, B), eq = Math.abs(da - db) < 0.06;
    if (bis === 'on') { const mx = 4, my = 1; line(ctx, [[V.X(mx - 6), V.Y(my - 6)], [V.X(mx + 6), V.Y(my + 6)]], col.muted, 1.5, [6, 5]); text(ctx, 'bisector', V.X(7.2), V.Y(4.4), { color: col.muted, size: 11, halo: col.panel }); }
    line(ctx, [[X(p), Y(p)], [X(A), Y(A)]], col.s[0], eq ? 3.5 : 2.5); line(ctx, [[X(p), Y(p)], [X(B), Y(B)]], col.s[1], eq ? 3.5 : 2.5);
    dot(ctx, X(A), Y(A), 6, col.s[0], col.ink); dot(ctx, X(B), Y(B), 6, col.s[1], col.ink);
    text(ctx, 'A(2, 3)', X(A) + 8, Y(A) - 9, { color: col.ink, size: 12, weight: 700, halo: col.panel }); text(ctx, 'B(6, −1)', X(B) + 8, Y(B) + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    dot(ctx, X(p), Y(p), 7, eq ? col.good : col.s[3], col.ink); text(ctx, 'P', X(p) + 9, Y(p) + (ax === 'x' ? 14 : -4), { color: col.ink, size: 13, weight: 700, halo: col.panel });
  };
  function upd() {
    const p = P(), da = dd(p, A), db = dd(p, B), eq = Math.abs(da - db) < 0.06, k = ax === 'x' ? 3 : -3;
    out.innerHTML = `P(${ax === 'x' ? fm(v) + ', 0' : '0, ' + fm(v)}): PA = ${da.toFixed(2)}, PB = ${db.toFixed(2)}. ` + (eq ? '<b>Equal!</b> ' : `PA is ${da < db ? 'shorter' : 'longer'}. `) + `Solving PA² = PB² gives ${ax === 'x' ? 'x' : 'y'} = ${k}.`; cv.redraw();
  }
  upd();
}
