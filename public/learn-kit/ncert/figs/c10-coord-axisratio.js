// Class 10 Coordinate Geometry: in what ratio does an axis divide AB? Where AB crosses the x-axis, y = 0. By the section formula
// 0 = (k y2 + y1)/(k + 1), so k = -y1/y2: the ratio is |y1| : |y2| (the heights of A and B above and below the axis).
// If A and B are on the same side the line meets the axis outside the segment, so the axis does not divide AB internally.
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
  const A = { x: 1, y: 3 }, B = { x: 6, y: -2 }; let V, ax = 'x';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A segment crossing an axis, with the ratio found from the distances of its ends to the axis' });
  const ctl = row(host);
  choice(ctl, 'Axis', [['x', 'x-axis'], ['y', 'y-axis']], ax, (a) => { ax = a; upd(); });
  const out = readout(host);
  const val = (p) => (ax === 'x' ? p.y : p.x);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Ratio = distances of A and B from the axis', col);
    V = view(w, h, [-4, 9], [-5, 6], t + 4, 6);
    grid(ctx, V, col, 1);
    const X = (p) => V.X(p.x), Y = (p) => V.Y(p.y), a = val(A), b = val(B);
    line(ctx, [[X(A), Y(A)], [X(B), Y(B)]], col.ink, 2.5);
    const foot = (p, c) => { const q = ax === 'x' ? { x: p.x, y: 0 } : { x: 0, y: p.y }; line(ctx, [[X(p), Y(p)], [X(q), Y(q)]], c, 3, [5, 3]); dot(ctx, X(q), Y(q), 3.5, c); };
    foot(A, col.s[0]); foot(B, col.s[1]);
    if (a !== b) { const k = a / (a - b), P = { x: A.x + (B.x - A.x) * k, y: A.y + (B.y - A.y) * k }; if (k > 0 && k < 1) { dot(ctx, X(P), Y(P), 7, col.s[2], col.ink); text(ctx, `P(${fm(P.x)}, ${fm(P.y)})`, X(P) + 9, Y(P) + (ax === 'x' ? -12 : 14), { color: col.ink, size: 12, weight: 700, halo: col.panel }); } else dot(ctx, X(P), Y(P), 5, col.muted); }
    dot(ctx, X(A), Y(A), 7, col.s[3], col.ink); dot(ctx, X(B), Y(B), 7, col.s[4], col.ink);
    text(ctx, `A(${A.x}, ${A.y})`, X(A) + 9, Y(A) - 11, { color: col.ink, size: 12, weight: 700, halo: col.panel }); text(ctx, `B(${B.x}, ${B.y})`, X(B) + 9, Y(B) - 11, { color: col.ink, size: 12, weight: 700, halo: col.panel });
  };
  function upd() {
    const a = val(A), b = val(B), nm = ax === 'x' ? 'y' : 'x';
    out.innerHTML = a === b ? `A and B are the same distance from the ${ax}-axis, so the line AB never meets it (or lies along it).` : a * b > 0 ? `A and B are on the <b>same side</b> of the ${ax}-axis, so AB meets it only when extended: the axis does not divide the segment AB internally.` : `${nm} of A = ${a}, ${nm} of B = ${b}. The ${ax}-axis divides AB in the ratio |${a}| : |${b}| = <b>${Math.abs(a)} : ${Math.abs(b)}</b>${Math.abs(a) === Math.abs(b) ? ' (the axis passes through the midpoint)' : ''}.`; cv.redraw();
  }
  drag(cv, () => V, [A, B], { onmove: upd }); upd();
}
