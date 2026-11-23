// Class 11 Maths, Relations and Functions: a relation as an arrow diagram. It is a FUNCTION from A to B exactly when every element of A has
// exactly one arrow leaving it (no element left out, none with two). Tap an element of A, then elements of B, to add or remove arrows.
import { canvas, text, title, row, button, readout } from '../../kit.js';
import { pos } from '../c11m-lib.js';

const A = [1, 2, 3, 4], B = [1, 2, 3, 4, 5, 6, 7, 8];
const PRE = { one: ['One-one function', [[0, 1], [1, 3], [2, 5], [3, 7]]], many: ['Many-one function', [[0, 1], [1, 1], [2, 3], [3, 3]]], two: ['Two arrows', [[0, 1], [0, 2], [1, 3], [2, 5], [3, 7]]], none: ['An element left out', [[0, 1], [1, 3], [3, 7]]], cst: ['Constant function', [[0, 4], [1, 4], [2, 4], [3, 4]]] };
export default function (host) {
  let E = new Set(PRE.one[1].map((p) => p.join(','))), sel = -1, geo = null;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Arrow diagram from set A to set B with a verdict on whether it is a function' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tap an A number, then B numbers', col), ya = (i) => top + 58 + i * ((h - top - 150) / 3), yb = (j) => top + 40 + j * ((h - top - 120) / 7), xa = w * 0.28, xb = w * 0.72;
    geo = { ya, yb, xa, xb };
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(xa, (ya(0) + ya(3)) / 2, 36, (ya(3) - ya(0)) / 2 + 22, 0, 0, 7); ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(xb, (yb(0) + yb(7)) / 2, 36, (yb(7) - yb(0)) / 2 + 16, 0, 0, 7); ctx.stroke();
    text(ctx, 'A', xa, top + 14, { color: col.s[0], size: 14, weight: 800, align: 'center' }); text(ctx, 'B', xb, top + 14, { color: col.s[2], size: 14, weight: 800, align: 'center' });
    const deg = A.map(() => 0), hitB = B.map(() => false);
    [...E].forEach((k) => { const [i, j] = k.split(',').map(Number); deg[i]++; hitB[j] = true; });
    [...E].forEach((k) => { const [i, j] = k.split(',').map(Number), bad = deg[i] > 1; ctx.strokeStyle = bad ? col.bad : col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xa + 12, ya(i)); ctx.lineTo(xb - 12, yb(j)); ctx.stroke(); const a = Math.atan2(yb(j) - ya(i), xb - xa - 24); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(xb - 12, yb(j)); ctx.lineTo(xb - 12 - 9 * Math.cos(a - 0.4), yb(j) - 9 * Math.sin(a - 0.4)); ctx.lineTo(xb - 12 - 9 * Math.cos(a + 0.4), yb(j) - 9 * Math.sin(a + 0.4)); ctx.fill(); });
    A.forEach((v, i) => { if (i === sel) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(xa, ya(i), 15, 0, 7); ctx.fill(); ctx.globalAlpha = 1; } text(ctx, String(v), xa, ya(i), { color: deg[i] === 0 ? col.bad : col.ink, size: 15, weight: 800, align: 'center' }); });
    B.forEach((v, j) => { if (hitB[j]) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(xb, yb(j), 14, 0, 7); ctx.fill(); ctx.globalAlpha = 1; } text(ctx, String(v), xb, yb(j), { color: col.ink, size: 14, weight: hitB[j] ? 800 : 500, align: 'center' }); });
    const isF = deg.every((d) => d === 1), range = B.filter((_, j) => hitB[j]), oneone = isF && range.length === A.length;
    out.innerHTML = isF ? `<b>A function.</b> Domain = {1, 2, 3, 4}, codomain = {1, …, 8}, range = {${range.join(', ')}} (${range.length} of 8 codomain numbers used). ${oneone ? 'Different inputs give different outputs: <b>one-one</b>.' : 'Some outputs are shared: <b>many-one</b>.'}` : `<b>Not a function:</b> ${deg.some((d) => d > 1) ? 'a number of A has two or more arrows (red).' : ''} ${deg.some((d) => d === 0) ? 'a number of A has no arrow (red).' : ''}`;
  };
  cv.c.addEventListener('pointerdown', (e) => {
    const [x, y] = pos(cv.c, e);
    if (Math.abs(x - geo.xa) < 36) { const i = A.findIndex((_, k) => Math.abs(geo.ya(k) - y) < 20); if (i >= 0) { sel = sel === i ? -1 : i; cv.redraw(); } }
    else if (Math.abs(x - geo.xb) < 36 && sel >= 0) { const j = B.findIndex((_, k) => Math.abs(geo.yb(k) - y) < 14); if (j >= 0) { const k = sel + ',' + j; E.has(k) ? E.delete(k) : E.add(k); cv.redraw(); } }
  });
  const r = row(host);
  Object.entries(PRE).forEach(([k, v]) => button(r, v[0], () => { E = new Set(v[1].map((p) => p.join(','))); sel = -1; cv.redraw(); }));
  button(r, 'Clear', () => { E.clear(); cv.redraw(); });
  cv.redraw();
}
