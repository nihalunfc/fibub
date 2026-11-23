// Class 8 Power Play (step player): why a^0 = 1 and a^-n = 1/a^n. Walk down the powers of 2: each step down divides by 2.
// 16, 8, 4, 2, then 1, then 1/2, 1/4, 1/8: the pattern forces zero and negative powers.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-lib.js';

const R = [[4, '16'], [3, '8'], [2, '4'], [1, '2'], [0, '1'], [-1, '1/2'], [-2, '1/4'], [-3, '1/8']];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A ladder of powers of 2 going down, dividing by 2 each step' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Going down the powers of 2', col), rh = Math.min(30, (h - top - 70) / 8), cx = w / 2;
    R.forEach(([e, v], i) => {
      if (i > s) return; const y = top + 18 + i * rh, neg = e < 0, zero = e === 0;
      ctx.fillStyle = zero ? col.s[2] : neg ? col.s[3] : col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(cx - 100, y - rh / 2 + 2, 200, rh - 4); ctx.globalAlpha = 1;
      text(ctx, `2^${e}`, cx - 80, y, { color: col.ink, size: 15, weight: 700 }); text(ctx, '=', cx - 10, y, { color: col.muted, size: 15 }); text(ctx, v, cx + 10, y, { color: zero ? col.s[2] : col.ink, size: 15, weight: 700 });
      if (i > 0) text(ctx, '÷ 2', cx + 85, y - rh / 2, { color: col.s[0], size: 11, align: 'center' });
    });
    note(ctx, ['Start at 2⁴ = 16.', 'Each step down in the power divides the answer by 2: 16 ÷ 2 = 8.', '8 ÷ 2 = 4, so 2² = 4.', '4 ÷ 2 = 2, so 2¹ = 2.', '2 ÷ 2 = 1. The pattern forces 2⁰ = 1. Any non-zero number to the power 0 is 1.', 'Keep dividing: 1 ÷ 2 = 1/2. So 2⁻¹ = 1/2.', '2⁻² = 1/4 = 1/2².', '2⁻³ = 1/8 = 1/2³. So a⁻ⁿ = 1/aⁿ.'][Math.min(s, 7)], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 7); cv.redraw(); } };
}
