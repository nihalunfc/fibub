// Class 8 Geometric Themes (step player): building the Koch curve. Cut a line in three, replace the middle third by two
// sides of a tent the same length, and repeat on every piece. Each step multiplies the length by 4/3.
import { canvas, text, title } from '../../kit.js';
import { note } from './c8-prop2-lib.js';
import { koch } from './c8-geo-fractal.js';

const N = ['Start with a line of length 1.', 'Cut it in three equal parts. Replace the middle part by two sides of a tent. Now there are 4 pieces of length 1/3, so the length is 4/3.', 'Do the same to each of the 4 pieces: 16 pieces of length 1/9. The length is 16/9.', 'Again: 64 pieces of length 1/27. The length is 64/27, about 2.37.', 'Again: 256 pieces. The length is 256/81, about 3.16. Each step the curve is 4/3 times longer, so it grows without limit.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The Koch curve built in stages' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Koch curve: cut, tent, repeat', col), L = 16, y0 = top + 110 + Math.max(0, (h - top - 220) / 3);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(L, y0); ctx.lineTo(w - L, y0); ctx.stroke(); ctx.setLineDash([]);
    const pts = koch([L, y0], [w - L, y0], s);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = s > 3 ? 1.2 : 2.2; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    text(ctx, 'step ' + s + ': ' + 4 ** s + ' piece' + (s ? 's' : '') + ', length ' + (4 ** s) + '/' + (3 ** s), L, y0 + 28 + (s > 0 ? 6 : 0), { color: col.ink, size: 12, weight: 700 });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
