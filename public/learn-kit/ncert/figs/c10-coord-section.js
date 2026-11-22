// Class 10 Coordinate Geometry: the section formula. P divides AB internally in the ratio m : n, so AP : PB = m : n.
// AB is cut into m + n equal parts and P sits after m of them: P = ((m x2 + n x1)/(m + n), (m y2 + n y1)/(m + n)).
// Drag A and B, change m and n. With m : n = 1 : 2 and the second point at 2 : 1 you get the two points of trisection.
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
  const A = { x: 1, y: 1 }, B = { x: 9, y: 6 }; let V, m = 2, n = 3, two = 'off';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A segment divided by a point in the ratio m to n with the point coordinates' });
  const ctl = row(host);
  slider(ctl, { label: 'm', min: 1, max: 6, step: 1, value: m, fmt: String, oninput: (v) => { m = v; upd(); } });
  slider(ctl, { label: 'n', min: 1, max: 6, step: 1, value: n, fmt: String, oninput: (v) => { n = v; upd(); } });
  choice(ctl, 'Also mark the point at n : m', [['off', 'No'], ['on', 'Yes']], two, (v) => { two = v; upd(); });
  const out = readout(host);
  const split = (a, b, p, q) => ({ x: (p * b.x + q * a.x) / (p + q), y: (p * b.y + q * a.y) / (p + q) });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'P divides AB in the ratio m : n', col);
    V = view(w, h, [-1, 11], [-1, 8], t + 4, 6);
    grid(ctx, V, col, 1);
    const X = (p) => V.X(p.x), Y = (p) => V.Y(p.y), P = split(A, B, m, n), N = m + n;
    line(ctx, [[X(A), Y(A)], [X(P), Y(P)]], col.s[0], 4.5); line(ctx, [[X(P), Y(P)], [X(B), Y(B)]], col.s[1], 4.5);
    for (let i = 1; i < N; i++) { const q = { x: A.x + (B.x - A.x) * i / N, y: A.y + (B.y - A.y) * i / N }; dot(ctx, X(q), Y(q), 3, col.ink); }
    text(ctx, `${m} part${m > 1 ? "s" : ""}`, (X(A) + X(P)) / 2 - 8, (Y(A) + Y(P)) / 2 + 14, { color: col.s[0], size: 12, weight: 700, align: 'right', halo: col.panel });
    text(ctx, `${n} part${n > 1 ? "s" : ""}`, (X(P) + X(B)) / 2 + 8, (Y(P) + Y(B)) / 2 - 12, { color: col.s[1], size: 12, weight: 700, halo: col.panel });
    if (two === 'on') { const R = split(A, B, n, m); dot(ctx, X(R), Y(R), 6, col.s[5], col.ink); text(ctx, `Q(${fm(R.x)}, ${fm(R.y)})`, X(R) + 8, Y(R) + 14, { color: col.ink, size: 11, weight: 700, halo: col.panel }); }
    dot(ctx, X(A), Y(A), 7, col.s[3], col.ink); dot(ctx, X(B), Y(B), 7, col.s[4], col.ink);
    text(ctx, `A(${A.x}, ${A.y})`, X(A) + 9, Y(A) + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel }); text(ctx, `B(${B.x}, ${B.y})`, X(B) - 9, Y(B) - 11, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
    dot(ctx, X(P), Y(P), 7, col.s[2], col.ink); text(ctx, `P(${fm(P.x)}, ${fm(P.y)})`, X(P) + 9, Y(P) - 12, { color: col.ink, size: 12, weight: 700, halo: col.panel });
  };
  function upd() {
    const P = split(A, B, m, n), N = m + n;
    out.innerHTML = `AP : PB = ${m} : ${n}. x = (${m}·${B.x} + ${n}·${A.x}) / ${N} = <b>${fm(P.x)}</b>, y = (${m}·${B.y} + ${n}·${A.y}) / ${N} = <b>${fm(P.y)}</b>. Check: AP = ${fm(Math.hypot(P.x - A.x, P.y - A.y))}, PB = ${fm(Math.hypot(B.x - P.x, B.y - P.y))}.`; cv.redraw();
  }
  drag(cv, () => V, [A, B], { onmove: upd }); upd();
}
