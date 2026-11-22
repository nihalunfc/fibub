// Class 10 Probability (step player): "at least one head" when three coins are tossed. Listing the 8 equally likely outcomes
// and counting the 7 favourable ones works, but the complement is faster: only TTT has no head, so
// P(at least one head) = 1 - P(no head) = 1 - 1/8 = 7/8.
import { canvas, text, title } from '../../kit.js';

const OUT = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT'];
const CAP = ['Toss three coins. The sample space has 2 × 2 × 2 = 8 equally likely outcomes', 'The event “at least one head”: every outcome except one has a head', 'Count the favourable outcomes: 7 of the 8', 'Faster: the complement “no head” is just TTT: 1 outcome', 'P(no head) = 1/8, so P(at least one head) = 1 − 1/8 = 7/8'];
export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 290, label: 'The eight outcomes of tossing three coins with the event at least one head highlighted' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Three coins: at least one head', col), cw = (w - 36) / 4, ch = Math.min(60, (h - top - 100) / 2);
    OUT.forEach((o, i) => {
      const x = 12 + (i % 4) * (cw + 4), y = top + 14 + Math.floor(i / 4) * (ch + 10), none = o === 'TTT';
      let c = col.soft, tc = col.ink;
      if (step === 1 || step === 2) { if (!none) { c = col.s[1]; tc = col.panel; } }
      if (step >= 3) { if (none) { c = col.s[3]; tc = col.panel; } else if (step === 4) { c = col.s[1]; tc = col.panel; } }
      ctx.fillStyle = c; ctx.fillRect(x, y, cw, ch); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, cw, ch);
      text(ctx, o, x + cw / 2, y + ch / 2, { color: tc, size: 15, weight: 700, align: 'center' });
    });
    const by = top + 14 + 2 * (ch + 10) + 8;
    if (step >= 2) text(ctx, step === 2 ? 'favourable = 7' : 'not a head: 1 (TTT)', w / 2, by + 6, { color: step === 2 ? col.s[1] : col.s[3], size: 13, weight: 700, align: 'center' });
    if (step === 4) text(ctx, 'P = 1 − 1/8 = 7/8', w / 2, by + 30, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
