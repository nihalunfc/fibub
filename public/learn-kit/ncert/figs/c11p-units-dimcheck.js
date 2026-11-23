// Class 11 Units and Measurement (step player): the principle of homogeneity. Only quantities with the same dimensions can be added or equated, so every
// term of a correct equation has the same dimensions. Checks s = ut + (1/2)at^2 (correct) and s = ut + at (wrong) with L = length, T = time.
import { canvas, text, title, line } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Dimensions of each term of an equation compared' });
  const T = ['Write the equation', 'Dimensions of each symbol', 'Dimensions of each term', 'All terms match: homogeneous', 'Try a wrong equation', 'The terms do not match'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const cx = w / 2, k = h / 320, tx = (s, x, y, o) => text(ctx, s, x, y * k, o);
    const eq = step < 4 ? ['s', '=', 'u t', '+', '½ a t²'] : ['s', '=', 'u t', '+', 'a t'];
    const xs = step < 4 ? [0.12, 0.25, 0.4, 0.55, 0.78] : [0.12, 0.25, 0.4, 0.55, 0.74];
    eq.forEach((s, i) => tx(s, w * xs[i], 62, { size: 21, weight: 700, color: i % 2 ? col.ink : col.s[i === 0 ? 2 : i === 2 ? 0 : 3], align: 'center' }));
    if (step === 1) {
      [['s', 'length', 'L'], ['u', 'velocity = length/time', 'L T⁻¹'], ['a', 'acceleration', 'L T⁻²'], ['t', 'time', 'T']].forEach(([a, b, c], i) => { const y = 110 + i * 38; tx(a, 30, y, { size: 17, weight: 700, color: col.s[i] }); tx(b, 60, y, { size: 12, color: col.muted }); tx('[ ' + c + ' ]', w - 24, y, { size: 15, weight: 700, color: col.ink, align: 'right' }); });
    }
    if (step >= 2) {
      const good = step < 4, rows = good ? [['[s]', 'L', 'L'], ['[u t]', 'L T⁻¹ × T', 'L'], ['[½ a t²]', 'L T⁻² × T²', 'L']] : [['[s]', 'L', 'L'], ['[u t]', 'L T⁻¹ × T', 'L'], ['[a t]', 'L T⁻² × T', 'L T⁻¹']];
      rows.forEach(([a, b, c], i) => {
        if (step === 3 || step === 5 || step === 2 || step === 4) { if (step === 4 && i > 0) return; }
        const y = 112 + i * 44, bad = !good && i === 2; tx(a, 14, y, { size: 14, weight: 700, color: col.ink });
        tx('= ' + b, w * 0.4, y, { size: 12.5, color: col.muted });
        ctx.fillStyle = bad && step === 5 ? col.s[3] : col.s[2]; ctx.globalAlpha = 0.22; ctx.fillRect(w - 86, y * k - 15, 74, 30); ctx.globalAlpha = 1;
        tx(c, w - 49, y, { size: 15, weight: 700, color: bad ? col.s[3] : col.s[2], align: 'center' });
      });
    }
    if (step === 3) tx('every term is a length, so s = ut + ½at² can be right', cx, 270, { size: 12.5, weight: 700, color: col.s[2], align: 'center' });
    if (step === 4) tx('someone suggests s = ut + at ...', cx, 140, { size: 13, color: col.muted, align: 'center' });
    if (step === 5) { tx('a t is a velocity, s is a length:', cx, 270, { size: 12.5, weight: 700, color: col.s[3], align: 'center' }); tx('you cannot add them, so it is wrong', cx, 290, { size: 12.5, weight: 700, color: col.s[3], align: 'center' }); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
