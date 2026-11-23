// Class 12 Maths, Probability (step player): Bayes' theorem as counting 1000 items. Machines M1, M2, M3 make 50%, 30%, 20% of items and 2%, 3%, 5% of their items are defective.
// Out of 1000: 500, 300, 200 items; 10, 9, 10 defective; 29 defective in all, so P(M1 | defective) = 10/29, P(M2 | defective) = 9/29, P(M3 | defective) = 10/29.
import { canvas, text, title } from '../../kit.js';
import { wrap } from '../c12m-view3d.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Bayes theorem worked as a count of 1000 items from three machines' });
  const TT = ['1000 items, three machines', 'How many of each machine are defective?', 'All the defective items: total probability', 'Pick one defective item: which machine?', 'The same thing as Bayes’ formula'];
  const N = [500, 300, 200], D = [10, 9, 10];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[st], col) + 8, bw = (w - 60) / 3, base = top + 150, sc = 130 / 500;
    N.forEach((n, i) => {
      const x = 20 + i * (bw + 10), hh = n * sc;
      ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.3; ctx.fillRect(x, base - hh, bw, hh); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[i]; ctx.lineWidth = 2; ctx.strokeRect(x, base - hh, bw, hh);
      text(ctx, `M${i + 1}: ${n}`, x + bw / 2, base + 14, { color: col.s[i], size: 12, weight: 700, align: 'center' });
      if (st >= 1) { const dh = Math.max(4, D[i] * sc * 5); ctx.fillStyle = col.bad; ctx.globalAlpha = st >= 3 ? 1 : 0.85; ctx.fillRect(x + bw * 0.25, base - dh, bw * 0.5, dh); ctx.globalAlpha = 1; text(ctx, `${D[i]} defective`, x + bw / 2, base - hh - 8, { color: col.bad, size: 11, weight: 700, align: 'center' }); }
      if (st >= 1) text(ctx, ['2%', '3%', '5%'][i] + ' of ' + n, x + bw / 2, base + 30, { color: col.muted, size: 10.5, align: 'center' });
    });
    let y = base + 52;
    const lines = [
      '',
      'Defective = 2% of 500 = 10, 3% of 300 = 9, 5% of 200 = 10. (Bars not to scale: defects drawn 5 times taller.)',
      'Total defective = 10 + 9 + 10 = 29, so P(defective) = 29/1000. This sum over the machines is the law of total probability.',
      'Reach into the 29 defective items. 10 of them came from M1, 9 from M2, 10 from M3: P(M1 | D) = 10/29 ≈ 0.345, P(M2 | D) = 9/29 ≈ 0.310, P(M3 | D) = 10/29 ≈ 0.345.',
      'P(M1 | D) = P(M1)P(D | M1) / [P(M1)P(D | M1) + P(M2)P(D | M2) + P(M3)P(D | M3)] = (0.5×0.02) / (0.01 + 0.009 + 0.01) = 0.01/0.029 = 10/29. Bayes is this count in disguise.',
    ];
    if (lines[st]) wrap(ctx, lines[st], 12, y, w - 24, col.ink, 12.5, 17);
    else text(ctx, 'Each machine makes a fixed share of the items.', 12, y, { color: col.ink, size: 12.5 });
  };
  cv.redraw();
  return { step(i) { st = Math.min(4, i); cv.redraw(); } };
}
