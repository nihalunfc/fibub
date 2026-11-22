// 5.6 The landed price of an imported card as a waterfall: US$700 at an example rate of £0.80, shipping £40,
// import VAT 20% on card plus shipping, a 2% card fee, then the comparison with a £640 local price with warranty.
import { text, title, axes } from '../../kit.js';
import { stepFig, rect } from './b-lib.js';

const card = 560, ship = 40, vat = (card + ship) * 0.2, fee = card * 0.02;
const BARS = [
  ['Card', 0, card, 0],
  ['Ship', card, ship, 3],
  ['VAT', card + ship, vat, 1],
  ['Fee', card + ship + vat, fee, 4],
  ['Landed', 0, card + ship + vat + fee, 0],
  ['Local', 0, 640, 2],
];
const SHOW = [1, 2, 3, 5, 6];

export default function (host) {
  return stepFig(host, {
    aspect: 0.62, max: 320, min: 250, label: 'Waterfall chart adding shipping, VAT and fees to an imported card price',
    draw(ctx, w, h, col, s) {
      title(ctx, 'Sticker price to landed price (£)', col);
      const A = axes(ctx, w, h, col, { x: [0, 6], y: [0, 1000], xt: [], l: 44, t: 36, b: 40, fy: (v) => '£' + v });
      const n = SHOW[s.step], bw = (A.R - A.L) / 6;
      BARS.slice(0, n).forEach(([lab, base, v, ci], i) => {
        const grow = i === n - 1 && s.step > s.prev ? s.e : 1;
        const x = A.L + i * bw + 5, y1 = A.Y(base + v * grow), y0 = A.Y(base);
        rect(ctx, x, y1, bw - 10, y0 - y1, col.s[ci], { alpha: lab === 'Landed' || lab === 'Local' ? 0.95 : 0.7 });
        text(ctx, (i && i < 4 ? '+' : '') + '£' + Math.round(v), x + (bw - 10) / 2, y1 - 9, { color: col.ink, size: 11, weight: 650, align: 'center', fit: false });
        text(ctx, lab, x + (bw - 10) / 2, A.B + 12, { color: col.muted, size: 10, align: 'center', fit: false });
      });
      if (s.step >= 4) text(ctx, `Import costs £${Math.round(card + ship + vat + fee - 640)} more, no UK warranty`, A.L + 6, A.T + 4, { color: col.bad || col.s[1], size: 12, weight: 700 });
    },
  });
}
