// Class 12 Maths, Matrices (step player): find the inverse of A = [[1, 2], [3, 7]] with elementary row operations. Write [A | I], then apply the same
// row operations to both halves until the left half is I; the right half is then A^-1. Check with A times A^-1 = I.
import { canvas, text, title } from '../../kit.js';

const S = [
  { m: [[1, 2, 1, 0], [3, 7, 0, 1]], op: 'Write A next to the identity I: the augmented matrix [A | I].', note: 'Goal: row-operate until the left half becomes I. Whatever we do to the left, we do to the right.' },
  { m: [[1, 2, 1, 0], [0, 1, -3, 1]], op: 'R₂ → R₂ − 3R₁', note: 'The 3 in the bottom left is now 0: 3 − 3×1 = 0, 7 − 3×2 = 1, 0 − 3×1 = −3, 1 − 3×0 = 1.' },
  { m: [[1, 0, 7, -2], [0, 1, -3, 1]], op: 'R₁ → R₁ − 2R₂', note: 'The 2 above the diagonal is gone: 2 − 2×1 = 0, 1 − 2×(−3) = 7, 0 − 2×1 = −2. The left half is I.' },
  { m: [[1, 0, 7, -2], [0, 1, -3, 1]], op: 'Read the right half: A⁻¹ = [[7, −2], [−3, 1]]', note: 'Check: A·A⁻¹ = [[1×7+2×(−3), 1×(−2)+2×1], [3×7+7×(−3), 3×(−2)+7×1]] = [[1, 0], [0, 1]] = I ✓' },
  { m: [[1, 2, 1, 0], [0, 0, -3, 1]], op: 'If a whole row of the left half becomes 0, stop', note: 'A zero row means A has no inverse (for example A = [[1, 2], [2, 4]]). Such a matrix is called singular.', bad: true },
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Row operations turning the matrix A beside the identity into the identity beside the inverse of A' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Inverse by row operations: [A | I] → [I | A⁻¹]', col), cs = Math.min(40, (w - 50) / 4.6), mw = 4 * cs, x0 = (w - mw) / 2, y0 = top + 36, st = S[Math.min(s, 4)];
    text(ctx, st.op, w / 2, top + 16, { color: col.s[0], size: 12.5, weight: 800, align: 'center' });
    st.m.forEach((r, i) => r.forEach((v, j) => {
      const left = j < 2, bad = st.bad && i === 1 && left, done = s >= 2 && s <= 3;
      if (!left) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = s === 3 ? 0.3 : 0.08; ctx.fillRect(x0 + j * cs, y0 + i * cs, cs, cs); ctx.globalAlpha = 1; } else if (bad) { ctx.fillStyle = col.bad; ctx.globalAlpha = 0.2; ctx.fillRect(x0 + j * cs, y0 + i * cs, cs, cs); ctx.globalAlpha = 1; }
      text(ctx, String(v).replace('-', '−'), x0 + j * cs + cs / 2, y0 + i * cs + cs / 2, { color: left && done && v === (i === j ? 1 : 0) ? col.good : col.ink, size: 16, weight: 700, align: 'center' });
    }));
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 2 * cs, y0 - 4); ctx.lineTo(x0 + 2 * cs, y0 + 2 * cs + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0 + 5, y0 - 4); ctx.lineTo(x0, y0 - 4); ctx.lineTo(x0, y0 + 2 * cs + 4); ctx.lineTo(x0 + 5, y0 + 2 * cs + 4); ctx.moveTo(x0 + mw - 5, y0 - 4); ctx.lineTo(x0 + mw, y0 - 4); ctx.lineTo(x0 + mw, y0 + 2 * cs + 4); ctx.lineTo(x0 + mw - 5, y0 + 2 * cs + 4); ctx.stroke();
    text(ctx, 'left: becomes I', x0 + cs, y0 + 2 * cs + 20, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'right: becomes A⁻¹', x0 + 3 * cs, y0 + 2 * cs + 20, { color: col.s[2], size: 10.5, align: 'center' });
    const max = Math.floor((w - 24) / 6.2), ls = []; let cur = ''; st.note.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur);
    ls.forEach((l, i) => text(ctx, l, 12, y0 + 2 * cs + 52 + i * 16, { color: col.ink, size: 11.5, weight: 600 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
