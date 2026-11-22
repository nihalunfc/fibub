// Class 10 Coordinate Geometry: three points A, B, C are collinear (on one straight line) exactly when the longest of the three
// distances equals the sum of the other two (AB + BC = AC). Drag the points: the lengths update live, and when the points are
// not collinear the readout names the triangle they form (equilateral, isosceles, right-angled) from the squared sides.
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
  const A = { x: 1, y: 1 }, B = { x: 4, y: 3 }, C = { x: 7, y: 5 }; let V;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 320, label: 'Three draggable points with the three distances and a test for lying on one line' });
  const ctl = row(host);
  button(ctl, 'Example: a line', () => { Object.assign(A, { x: 0, y: 1 }); Object.assign(B, { x: 3, y: 3 }); Object.assign(C, { x: 6, y: 5 }); upd(); });
  button(ctl, 'Example: right triangle', () => { Object.assign(A, { x: 1, y: 1 }); Object.assign(B, { x: 6, y: 1 }); Object.assign(C, { x: 6, y: 5 }); upd(); });
  button(ctl, 'Example: isosceles', () => { Object.assign(A, { x: 1, y: 1 }); Object.assign(B, { x: 7, y: 1 }); Object.assign(C, { x: 4, y: 6 }); upd(); });
  const out = readout(host);
  const d = (p, q) => Math.hypot(p.x - q.x, p.y - q.y), d2 = (p, q) => (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
  const col3 = (a, b, c) => { const L = [d(a, b), d(b, c), d(a, c)].sort((x, y) => x - y); return Math.abs(L[0] + L[1] - L[2]) < 1e-9; };
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Is AB + BC = AC? Drag A, B, C', col);
    V = view(w, h, [-1, 10], [-1, 8], t + 4, 6);
    grid(ctx, V, col, 1);
    const X = (p) => V.X(p.x), Y = (p) => V.Y(p.y), on = col3(A, B, C);
    const seg = (p, q, tone, lab) => { line(ctx, [[X(p), Y(p)], [X(q), Y(q)]], tone, on ? 3.5 : 2.5); const mx = (X(p) + X(q)) / 2, my = (Y(p) + Y(q)) / 2; text(ctx, lab + ' ' + fm(d(p, q)), mx + 6, my + 12, { color: tone, size: 11, weight: 700, halo: col.panel }); };
    seg(A, B, col.s[0], 'AB'); seg(B, C, col.s[1], 'BC'); seg(A, C, col.s[2], 'AC');
    [[A, 'A', col.s[3]], [B, 'B', col.s[4]], [C, 'C', col.s[5]]].forEach(([p, l, c]) => { dot(ctx, X(p), Y(p), 7, c, col.ink); text(ctx, l, X(p) - 12, Y(p) - 11, { color: col.ink, size: 13, weight: 700, halo: col.panel }); });
  };
  function upd() {
    const a = d2(B, C), b = d2(A, C), c = d2(A, B), L = [[d(A, B), 'AB'], [d(B, C), 'BC'], [d(A, C), 'AC']].sort((x, y) => x[0] - y[0]);
    let s = `AB = ${fm(d(A, B))}, BC = ${fm(d(B, C))}, AC = ${fm(d(A, C))}. `;
    if (col3(A, B, C)) s += `Shortest two add up: ${fm(L[0][0])} + ${fm(L[1][0])} = ${fm(L[2][0])} = ${L[2][1]}. <b>Collinear: one straight line.</b>`;
    else { const q = [a, b, c].sort((x, y) => x - y), eq = Math.abs(a - b) < 1e-9 && Math.abs(b - c) < 1e-9, iso = Math.abs(a - b) < 1e-9 || Math.abs(b - c) < 1e-9 || Math.abs(a - c) < 1e-9, rt = Math.abs(q[0] + q[1] - q[2]) < 1e-9;
      s += `${fm(L[0][0])} + ${fm(L[1][0])} = ${fm(L[0][0] + L[1][0])} is more than ${fm(L[2][0])}, so <b>not collinear</b>: they make a triangle` + (eq ? ', <b>equilateral</b>.' : [iso ? ' that is <b>isosceles</b>' : '', rt ? (iso ? ' and ' : ' that is ') + '<b>right-angled</b> (squares: ' + q[0] + ' + ' + q[1] + ' = ' + q[2] + ')' : ''].join('') + (iso || rt ? '.' : '.')); }
    out.innerHTML = s; cv.redraw();
  }
  drag(cv, () => V, [A, B, C], { onmove: upd }); upd();
}
