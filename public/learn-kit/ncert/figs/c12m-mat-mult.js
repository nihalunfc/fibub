// Class 12 Maths, Matrices (step player): multiply a 2x3 matrix A by a 3x2 matrix B, row by column. Entry (i, j) of AB is row i of A dotted
// with column j of B: multiply matching entries and add. The inner orders (3 and 3) must match; the outer orders (2 and 2) give the order of AB.
import { canvas, text, title } from '../../kit.js';

const A = [[1, 2, 3], [4, 5, 6]], B = [[7, 8], [9, 10], [11, 12]], C = [[58, 64], [139, 154]];
const STEPS = [[-1, -1], [0, 0], [0, 1], [1, 0], [1, 1], [-1, -1]];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Row by column multiplication of a two by three matrix and a three by two matrix, one entry at a time' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Row × column, one entry at a time', col), cs = Math.min(30, (w - 90) / 7.6), y = top + 30, [ri, cj] = STEPS[Math.min(s, 5)];
    const bw = (M) => M[0].length * cs, xa = 8, xb = xa + bw(A) + 38, xc = xb + bw(B) + 38;
    const M = (Mx, x, hiR, hiC, c, name, cells) => {
      Mx.forEach((r, i) => r.forEach((v, j) => { const on = (hiR >= 0 && i === hiR) || (hiC >= 0 && j === hiC); if (on) { ctx.fillStyle = c; ctx.globalAlpha = 0.25; ctx.fillRect(x + j * cs, y + i * cs, cs, cs); ctx.globalAlpha = 1; } if (cells === undefined || cells(i, j)) text(ctx, String(v), x + j * cs + cs / 2, y + i * cs + cs / 2, { color: col.ink, size: 13, weight: 600, align: 'center' }); }));
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; const hh = Mx.length * cs; ctx.beginPath(); ctx.moveTo(x + 5, y - 3); ctx.lineTo(x, y - 3); ctx.lineTo(x, y + hh + 3); ctx.lineTo(x + 5, y + hh + 3); ctx.moveTo(x + bw(Mx) - 5, y - 3); ctx.lineTo(x + bw(Mx), y - 3); ctx.lineTo(x + bw(Mx), y + hh + 3); ctx.lineTo(x + bw(Mx) - 5, y + hh + 3); ctx.stroke();
      text(ctx, name, x + bw(Mx) / 2, y - 14, { color: c, size: 12, weight: 700, align: 'center' });
    };
    M(A, xa, ri, -1, col.s[0], 'A  2×3'); M(B, xb, -1, cj, col.s[2], 'B  3×2');
    const done = (i, j) => STEPS.slice(1, s + 1).some(([a, b]) => a === i && b === j) || s >= 5;
    M(C, xc, -1, -1, col.s[3], 'AB  2×2', done);
    text(ctx, '×', xa + bw(A) + 19, y + cs, { color: col.ink, size: 16, weight: 700, align: 'center' }); text(ctx, '=', xb + bw(B) + 19, y + cs, { color: col.ink, size: 16, weight: 700, align: 'center' });
    if (ri >= 0 && s <= 4) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.3; ctx.fillRect(xc + cj * cs, y + ri * cs, cs, cs); ctx.globalAlpha = 1; }
    const ly = y + 3 * cs + 30;
    if (s === 0) { ['Order of A: 2 × 3. Order of B: 3 × 2.', 'Inner numbers 3 and 3 match, so AB exists.', 'Outer numbers 2 and 2 give the order of AB: 2 × 2.'].forEach((l, i) => text(ctx, l, 10, ly + i * 20, { color: i === 1 ? col.good : col.ink, size: 12, weight: 600 })); text(ctx, 'Tap Next to compute the first entry.', 10, ly + 74, { color: col.muted, size: 11.5 }); }
    else if (s <= 4) {
      const a = A[ri], b = B.map((r) => r[cj]), ps = a.map((v, i) => v * b[i]);
      text(ctx, `Row ${ri + 1} of A with column ${cj + 1} of B:`, 10, ly, { color: col.ink, size: 12.5, weight: 700 });
      text(ctx, a.map((v, i) => `${v}×${b[i]}`).join(' + '), 10, ly + 24, { color: col.ink, size: 14, weight: 600 }); text(ctx, `= ${ps.join(' + ')}`, 10, ly + 48, { color: col.ink, size: 14, weight: 600 });
      text(ctx, `= ${C[ri][cj]}  → entry (${ri + 1}, ${cj + 1}) of AB`, 10, ly + 74, { color: col.s[3], size: 14, weight: 800 });
    } else { ['AB = [[58, 64], [139, 154]], a 2 × 2 matrix.', 'BA would be 3 × 3: a different size, so AB ≠ BA in general.', 'Even for square matrices AB and BA can differ.'].forEach((l, i) => text(ctx, l, 10, ly + i * 22, { color: col.ink, size: 12, weight: 600 })); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
