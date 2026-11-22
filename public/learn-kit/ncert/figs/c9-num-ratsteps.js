// Class 9 Numbers (step player): rationalising 1/(sqrt3 + sqrt2). Multiply top and bottom by the conjugate (sqrt3 - sqrt2),
// because (a + b)(a - b) = a^2 - b^2 removes the roots from the denominator: the value does not change, only its look.
import { canvas, text, title } from '../../kit.js';

const L = [
  ['1', '√3 + √2', 'Fraction with roots in the denominator', ''],
  ['1 × (√3 − √2)', '(√3 + √2)(√3 − √2)', 'Multiply top and bottom by the conjugate √3 − √2 (we are multiplying by 1)', ''],
  ['√3 − √2', '(√3)² − (√2)²', 'Bottom: (a + b)(a − b) = a² − b²', ''],
  ['√3 − √2', '3 − 2', 'Square the roots', ''],
  ['√3 − √2', '1', 'Bottom is the whole number 1', ''],
  ['= √3 − √2', '', 'Rationalised: 1/(√3 + √2) = √3 − √2', '≈ 0.3178'],
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 260, label: 'Rationalising the denominator of one over root three plus root two step by step' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Rationalising 1/(√3 + √2)', col);
    for (let i = 0; i <= s; i++) {
      const [n, d, note] = L[i], y = t + 40 + i * 36, cur = i === s;
      if (d) { text(ctx, n, 90, y - 7, { color: cur ? col.ink : col.muted, size: 13, weight: cur ? 700 : 400, align: 'center' }); ctx.save(); ctx.strokeStyle = cur ? col.ink : col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(156, y); ctx.stroke(); ctx.restore(); text(ctx, d, 90, y + 8, { color: cur ? col.ink : col.muted, size: 13, weight: cur ? 700 : 400, align: 'center' }); }
      else text(ctx, n, 90, y, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    }
    const words = L[s][2].split(' '); let l1 = '', l2 = ''; for (const wd of words) { if ((l1 + ' ' + wd).length < 44 && !l2) l1 += (l1 ? ' ' : '') + wd; else l2 += (l2 ? ' ' : '') + wd; }
    text(ctx, l1, 12, h - 44, { color: col.s[0], size: 12, weight: 700 }); if (l2) text(ctx, l2, 12, h - 26, { color: col.s[0], size: 12, weight: 700 });
    if (s >= 5) text(ctx, 'Check: 1/(1.732 + 1.414) = 0.3178 = 1.732 − 1.414', 12, h - 8, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
