// Class 12 Maths, Matrices (step player): every square matrix is the sum of a symmetric matrix P = (A + A^T)/2 and a skew-symmetric matrix Q = (A - A^T)/2.
// Worked on a 3 x 3 example; adding P and Q gives A back.
import { canvas, text, title } from '../../kit.js';

const A = [[2, 6, 4], [0, 1, -2], [2, 8, 3]], At = A[0].map((_, j) => A.map((r) => r[j])), P = [[2, 3, 3], [3, 1, 3], [3, 3, 3]], Q = [[0, 3, 1], [-3, 0, -5], [-1, 5, 0]];
const N = ['Start with any square matrix A. Nothing special about it.', 'Flip it over the diagonal to get Aᵀ (rows become columns).', 'P = ½(A + Aᵀ). Add A and Aᵀ and halve: the result mirrors across the diagonal, so P is symmetric.', 'Q = ½(A − Aᵀ). Subtract and halve: mirrored entries have opposite signs and the diagonal is 0, so Q is skew-symmetric.', 'Add them: P + Q = A. Every square matrix splits this way, and only one way.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A three by three matrix split into a symmetric part and a skew-symmetric part' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A = symmetric part + skew-symmetric part', col), cs = Math.min(24, (w - 90) / 9.5), mw = 3 * cs, y = top + 30;
    const M = (X, x, c, name) => { text(ctx, name, x + mw / 2, y - 14, { color: c, size: 12, weight: 700, align: 'center' }); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 5, y - 3); ctx.lineTo(x, y - 3); ctx.lineTo(x, y + 3 * cs + 3); ctx.lineTo(x + 5, y + 3 * cs + 3); ctx.moveTo(x + mw - 5, y - 3); ctx.lineTo(x + mw, y - 3); ctx.lineTo(x + mw, y + 3 * cs + 3); ctx.lineTo(x + mw - 5, y + 3 * cs + 3); ctx.stroke();
      X.forEach((r, i) => r.forEach((v, j) => { if (i === j && c === col.s[3]) { ctx.fillStyle = c; ctx.globalAlpha = 0.18; ctx.fillRect(x + j * cs, y + i * cs, cs, cs); ctx.globalAlpha = 1; } text(ctx, String(v).replace('-', '−'), x + j * cs + cs / 2, y + i * cs + cs / 2, { color: col.ink, size: 13, weight: 600, align: 'center' }); })); };
    const op = (t, x) => text(ctx, t, x, y + 1.5 * cs, { color: col.ink, size: 16, weight: 700, align: 'center' });
    const half = (w - 2 * mw) / 3;
    if (s === 0) M(A, (w - mw) / 2, col.s[0], 'A');
    else if (s === 1) { M(A, half, col.s[0], 'A'); M(At, 2 * half + mw, col.s[1], 'Aᵀ'); op('→', w / 2); }
    else if (s === 2) { M(P, (w - mw) / 2, col.s[2], 'P = ½(A + Aᵀ)'); text(ctx, 'Pᵀ = P ✓ symmetric', w / 2, y + 3 * cs + 24, { color: col.good, size: 12.5, weight: 700, align: 'center' }); }
    else if (s === 3) { M(Q, (w - mw) / 2, col.s[3], 'Q = ½(A − Aᵀ)'); text(ctx, 'Qᵀ = −Q ✓ skew-symmetric (diagonal 0)', w / 2, y + 3 * cs + 24, { color: col.good, size: 12.5, weight: 700, align: 'center' }); }
    else { const g = (w - 3 * mw) / 4; M(P, g, col.s[2], 'P'); op('+', g + mw + g / 2); M(Q, 2 * g + mw, col.s[3], 'Q'); op('=', 2 * g + 2 * mw + g / 2); M(A, 3 * g + 2 * mw, col.s[0], 'A'); }
    const max = Math.floor((w - 24) / 6.2), ls = []; let cur = ''; N[s].split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur);
    ls.forEach((l, i) => text(ctx, l, 12, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
