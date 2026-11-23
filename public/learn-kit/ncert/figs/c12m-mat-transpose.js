// Class 12 Maths, Matrices: the transpose swaps rows and columns, so entry (i, j) moves to (j, i): the matrix flips over its main diagonal.
// Slide "Flip" to watch the entries move. A square matrix equal to its transpose is symmetric; equal to minus its transpose it is skew-symmetric.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const D = { gen: ['2×3 matrix', [[2, 5, 1], [0, 3, 4]]], sym: ['Symmetric', [[1, 2, 3], [2, 4, 5], [3, 5, 6]]], skw: ['Skew-symmetric', [[0, 2, -3], [-2, 0, 4], [3, -4, 0]]], sq: ['Ordinary 3×3', [[1, 2, 3], [4, 5, 6], [7, 8, 9]]] };
export default function (host) {
  let k = 'gen', t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 270, label: 'A matrix whose entries flip over the main diagonal to form its transpose' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const M = D[k][1], m = M.length, n = M[0].length, top = title(ctx, `Transpose of a ${m} × ${n} matrix: rows become columns`, col), cs = Math.min(46, (w - 40) / 3), ox = (w - 3 * cs) / 2, oy = top + 22;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(ox, oy, 3 * cs, 3 * cs);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + 3 * cs, oy + 3 * cs); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'main diagonal', ox + 3 * cs, oy + 3 * cs + 14, { color: col.s[2], size: 10.5, weight: 600, align: 'right' });
    M.forEach((r, i) => r.forEach((v, j) => {
      const e = t * t * (3 - 2 * t), x = ox + (j + (i - j) * e) * cs + cs / 2, y = oy + (i + (j - i) * e) * cs + cs / 2, onD = i === j;
      ctx.fillStyle = onD ? col.s[2] : col.s[0]; ctx.globalAlpha = 0.2; ctx.fillRect(x - cs / 2 + 3, y - cs / 2 + 3, cs - 6, cs - 6); ctx.globalAlpha = 1;
      text(ctx, String(v).replace('-', '−'), x, y, { color: col.ink, size: 15, weight: 700, align: 'center' });
    }));
    const T = M[0].map((_, j) => M.map((r) => r[j])), sq = m === n, symm = sq && M.every((r, i) => r.every((v, j) => v === T[i][j])), skew = sq && M.every((r, i) => r.every((v, j) => v === -T[i][j]));
    out.innerHTML = `A has order ${m} × ${n}; Aᵀ has order <b>${n} × ${m}</b>. ${!sq ? 'Not square, so it cannot be symmetric or skew.' : symm ? '<b>Aᵀ = A: symmetric.</b> The entries mirror across the diagonal.' : skew ? '<b>Aᵀ = −A: skew-symmetric.</b> Mirrored entries have opposite signs, and the diagonal must be 0.' : 'Aᵀ is different from both A and −A.'} Rule check: (Aᵀ)ᵀ = A.`;
  };
  const r = row(host);
  slider(r, { label: 'Flip', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v > 0.98 ? 'Aᵀ' : v < 0.02 ? 'A' : Math.round(v * 100) + '%'), oninput: (v) => { t = v; cv.redraw(); } });
  choice(r, 'Matrix', Object.entries(D).map(([a, v]) => [a, v[0]]), k, (v) => { k = v; cv.redraw(); });
  cv.redraw();
}
