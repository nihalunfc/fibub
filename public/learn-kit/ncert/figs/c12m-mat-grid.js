// Class 12 Maths, Matrices: a matrix is a rectangular table. Its order is rows x columns and a(i,j) means row i, column j. Choose a type
// to see it; the figure names every type the matrix belongs to. Tap an entry to read its position.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const T = {
  gen: ['General', [[2, 5, 1], [0, 3, 4]]], rowm: ['Row', [[3, 1, 4]]], colm: ['Column', [[2], [7], [5]]], sq: ['Square', [[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
  dia: ['Diagonal', [[4, 0, 0], [0, 2, 0], [0, 0, 7]]], sca: ['Scalar', [[3, 0, 0], [0, 3, 0], [0, 0, 3]]], idn: ['Identity', [[1, 0, 0], [0, 1, 0], [0, 0, 1]]],
  zer: ['Zero', [[0, 0, 0], [0, 0, 0]]], up: ['Upper triangular', [[1, 2, 3], [0, 4, 5], [0, 0, 6]]], sym: ['Symmetric', [[1, 2, 3], [2, 4, 5], [3, 5, 6]]], skw: ['Skew-symmetric', [[0, 2, -3], [-2, 0, 4], [3, -4, 0]]],
};
const tags = (M) => {
  const m = M.length, n = M[0].length, sq = m === n, t = [];
  if (m === 1) t.push('row matrix'); if (n === 1) t.push('column matrix'); if (sq) t.push('square matrix');
  if (M.flat().every((v) => v === 0)) t.push('zero matrix');
  if (sq) {
    const off = (f) => M.every((r, i) => r.every((v, j) => (i === j ? true : f(i, j) ? v === 0 : true)));
    if (off(() => true)) t.push('diagonal'); if (off(() => true) && M.every((r, i) => r[i] === M[0][0])) t.push('scalar'); if (off(() => true) && M.every((r, i) => r[i] === 1)) t.push('identity');
    if (off((i, j) => i > j)) t.push('upper triangular'); if (off((i, j) => i < j)) t.push('lower triangular');
    if (M.every((r, i) => r.every((v, j) => v === M[j][i]))) t.push('symmetric'); if (M.every((r, i) => r.every((v, j) => v === -M[j][i]))) t.push('skew-symmetric');
  }
  return t;
};
export default function (host) {
  let k = 'gen', sel = [0, 0], geo = {};
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A matrix with its order, its entries and the names of the types it belongs to' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const M = T[k][1], m = M.length, n = M[0].length, top = title(ctx, `${T[k][0]} matrix: order ${m} × ${n}`, col), cs = Math.min(44, (w - 60) / n), cx = (w - n * cs) / 2, cy = top + 14;
    geo = { cx, cy, cs, m, n };
    if (sel[0] < m && sel[1] < n) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.12; ctx.fillRect(cx, cy + sel[0] * cs, n * cs, cs); ctx.fillRect(cx + sel[1] * cs, cy, cs, m * cs); ctx.globalAlpha = 0.35; ctx.fillRect(cx + sel[1] * cs, cy + sel[0] * cs, cs, cs); ctx.globalAlpha = 1; }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - 3 + 8, cy - 4); ctx.lineTo(cx - 3, cy - 4); ctx.lineTo(cx - 3, cy + m * cs + 4); ctx.lineTo(cx - 3 + 8, cy + m * cs + 4); ctx.moveTo(cx + n * cs + 3 - 8, cy - 4); ctx.lineTo(cx + n * cs + 3, cy - 4); ctx.lineTo(cx + n * cs + 3, cy + m * cs + 4); ctx.lineTo(cx + n * cs + 3 - 8, cy + m * cs + 4); ctx.stroke();
    M.forEach((r, i) => r.forEach((v, j) => text(ctx, String(v).replace('-', '−'), cx + j * cs + cs / 2, cy + i * cs + cs / 2, { color: col.ink, size: 15, weight: 600, align: 'center' })));
    const tg = tags(M), by = cy + m * cs + 26;
    text(ctx, 'Types it belongs to:', 12, by, { color: col.muted, size: 11 });
    text(ctx, tg.length ? tg.join(' · ') : 'a plain rectangular matrix', 12, by + 18, { color: col.s[0], size: 12, weight: 700 });
    out.innerHTML = sel[0] < m && sel[1] < n ? `Entry a<sub>${sel[0] + 1}${sel[1] + 1}</sub> (row ${sel[0] + 1}, column ${sel[1] + 1}) = <b>${M[sel[0]][sel[1]]}</b>. The matrix has ${m} × ${n} = ${m * n} entries.` : '';
  };
  cv.c.addEventListener('pointerdown', (e) => { const b = cv.c.getBoundingClientRect(), j = Math.floor((e.clientX - b.left - geo.cx) / geo.cs), i = Math.floor((e.clientY - b.top - geo.cy) / geo.cs); if (i >= 0 && j >= 0 && i < geo.m && j < geo.n) { sel = [i, j]; cv.redraw(); } });
  choice(row(host), 'Type', Object.entries(T).map(([a, v]) => [a, v[0]]), k, (v) => { k = v; sel = [0, 0]; cv.redraw(); });
  cv.redraw();
}
