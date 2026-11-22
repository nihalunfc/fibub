// 16.2 One month of a summary job on an API: 2,000 jobs × 3,000 tokens in and 800 out, at example prices of
// US$3 in and US$15 out per million. Steps: the tokens, the plain bill, caching the 2,000 repeated tokens, then batch.
import { text, title } from '../../kit.js';
import { stepFig, rect } from './b-lib.js';

const ROWS = [
  { name: 'Plain', inp: 18, out: 24 },
  { name: 'Cached', inp: 7.2, out: 24 },
  { name: 'Cached + batch', inp: 3.6, out: 12 },
];
const money = (v) => 'US$' + v.toFixed(2);

export default function (host) {
  return stepFig(host, {
    aspect: 0.62, max: 320, min: 250, label: 'Tokens in a month and the API bill: plain, with caching, and with caching plus batch',
    draw(ctx, w, h, col, s) {
      title(ctx, s.step === 0 ? 'Tokens in one month' : 'The monthly bill', col);
      const L = 104, R = w - 16, top = 46;
      if (s.step === 0) {
        const max = 6, X = (v) => L + (v / max) * (R - L) * s.e;
        [['Input', 6, col.s[0], '6.0 million'], ['Output', 1.6, col.s[1], '1.6 million']].forEach(([lab, v, c, t], i) => {
          const y = top + 20 + i * 54;
          text(ctx, lab, 12, y + 14, { color: col.ink, size: 12, weight: 650 });
          rect(ctx, L, y, X(v) - L, 28, c);
          text(ctx, t, Math.min(X(v) + 6, R - 70), y + 14, { color: col.ink, size: 12, weight: 600, halo: col.panel });
        });
        text(ctx, '2,000 jobs × 3,000 in and × 800 out', 12, h - 24, { color: col.muted, size: 11.5 });
        return;
      }
      const max = 44, X = (v) => L + (v / max) * (R - L);
      for (let i = 0; i < s.step && i < ROWS.length; i++) {
        const r = ROWS[i], y = top + 12 + i * 52, k = i === s.step - 1 ? s.e : 1;
        text(ctx, r.name, 12, y + 14, { color: col.ink, size: 11.5, weight: 650 });
        rect(ctx, L, y, (X(r.inp) - L) * k, 28, col.s[0]);
        rect(ctx, X(r.inp), y, (X(r.inp + r.out) - X(r.inp)) * k, 28, col.s[1]);
        text(ctx, money(r.inp + r.out), Math.min(X(r.inp + r.out) + 6, R - 52), y + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel });
      }
      rect(ctx, 12, h - 30, 12, 12, col.s[0]);
      text(ctx, 'input', 30, h - 24, { color: col.muted, size: 11.5 });
      rect(ctx, 80, h - 30, 12, 12, col.s[1]);
      text(ctx, 'output (thinking counts here)', 98, h - 24, { color: col.muted, size: 11.5 });
    },
  });
}
