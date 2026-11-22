// Class 10 Coordinate Geometry: the distance formula. Drag A and B (whole numbers). The horizontal and vertical gaps are the legs
// of a right triangle, so AB^2 = (x2 - x1)^2 + (y2 - y1)^2 by Pythagoras. The squares toggle draws a square on each side:
// the two small squares together have the same area as the big one.
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
  const A = { x: 1, y: 2 }, B = { x: 5, y: 5 }; let V, sq = 'off';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Two draggable points with the right triangle that gives the distance between them' });
  const ctl = row(host);
  choice(ctl, 'Squares on the sides', [['off', 'Hide'], ['on', 'Show']], sq, (v) => { sq = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Distance by Pythagoras: drag A and B', col);
    V = view(w, h, [-2, 11], [-2, 9], t + 6, 4);
    grid(ctx, V, col, 1);
    const C = { x: B.x, y: A.y }, X = (p) => V.X(p.x), Y = (p) => V.Y(p.y);
    const dx = B.x - A.x, dy = B.y - A.y;
    if (sq === 'on') {
      const sqr = (p, q, side, tone) => { const ex = q.x - p.x, ey = q.y - p.y, nx = -ey * side, ny = ex * side; ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = tone; ctx.beginPath(); ctx.moveTo(X(p), Y(p)); ctx.lineTo(X(q), Y(q)); ctx.lineTo(V.X(q.x + nx), V.Y(q.y + ny)); ctx.lineTo(V.X(p.x + nx), V.Y(p.y + ny)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = tone; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); };
      const sg = (v) => (v < 0 ? -1 : 1);
      sqr(A, C, -sg(dx) * sg(dy), col.s[1]); sqr(C, B, -sg(dx) * sg(dy), col.s[2]); sqr(A, B, sg(dx * dy), col.s[0]);
    }
    line(ctx, [[X(A), Y(A)], [X(C), Y(C)]], col.s[1], 3); line(ctx, [[X(C), Y(C)], [X(B), Y(B)]], col.s[2], 3); line(ctx, [[X(A), Y(A)], [X(B), Y(B)]], col.s[0], 3);
    const k = 9 * Math.sign(dx || 1), j = 9 * Math.sign(dy || 1);
    if (dx && dy) line(ctx, [[X(C) - k, Y(C)], [X(C) - k, Y(C) - j], [X(C), Y(C) - j]], col.ink, 1.2);
    if (dx) text(ctx, `${Math.abs(dx)}`, (X(A) + X(C)) / 2, Y(C) + (dy >= 0 ? 14 : -14), { color: col.s[1], size: 13, weight: 700, align: 'center', halo: col.panel });
    if (dy) text(ctx, `${Math.abs(dy)}`, X(C) + (dx >= 0 ? 14 : -14), (Y(C) + Y(B)) / 2, { color: col.s[2], size: 13, weight: 700, align: 'center', halo: col.panel });
    pt(ctx, V, A, 'A', col, col.s[3]); pt(ctx, V, B, 'B', col, col.s[4]);
  };
  function upd() {
    const dx = B.x - A.x, dy = B.y - A.y, s = dx * dx + dy * dy, d = Math.sqrt(s);
    out.innerHTML = `AB² = (${B.x} − ${A.x})² + (${B.y} − ${A.y})² = ${dx * dx} + ${dy * dy} = <b>${s}</b>, so <b>AB = ${Number.isInteger(d) ? d : '√' + s + ' ≈ ' + d.toFixed(2)}</b>.` + (sq === 'on' ? ` The small squares (${dx * dx} + ${dy * dy}) fill the big one (${s}).` : ''); cv.redraw();
  }
  drag(cv, () => V, [A, B], { onmove: upd }); upd();
}
