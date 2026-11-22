// 17.2 Where the seconds of one answer go: reading the prompt, thinking, writing. A 400-token answer on a 16 GB card
// with a 12B model. Steps: a short chat; a 40,000-token document pasted in; thinking switched on; the fix (send only
// the 4,000 relevant tokens, thinking off).
import { text, title } from '../../kit.js';
import { stepFig, rect } from './b-lib.js';

const ROWS = [
  { name: 'Short chat', read: 0.1, think: 0, write: 8.9 },
  { name: '+ long document', read: 15, think: 0, write: 13.3 },
  { name: '+ thinking on', read: 15, think: 40, write: 13.3 },
  { name: 'Fixed', read: 1.5, think: 0, write: 10 },
];
const MAX = 70;

export default function (host) {
  return stepFig(host, {
    aspect: 0.66, max: 330, min: 260, label: 'Seconds spent reading, thinking and writing one answer in four situations',
    draw(ctx, w, h, col, s) {
      title(ctx, 'Seconds until the answer is done', col);
      const L = 112, R = w - 16, top = 40, X = (v) => L + (v / MAX) * (R - L);
      for (let i = 0; i <= s.step && i < ROWS.length; i++) {
        const r = ROWS[i], y = top + i * 46, k = i === s.step ? s.e : 1;
        text(ctx, r.name, 12, y + 13, { color: col.ink, size: 11.5, weight: 650 });
        let x = L;
        for (const [v, c] of [[r.read, col.s[0]], [r.think, col.s[2]], [r.write, col.s[1]]]) {
          const ww = (X(v) - L) * k; rect(ctx, x, y, Math.max(ww, v ? 1.5 : 0), 26, c); x += ww;
        }
        const tot = r.read + r.think + r.write;
        text(ctx, tot.toFixed(1) + ' s', Math.min(x + 6, R - 40), y + 13, { color: col.ink, size: 12, weight: 700, halo: col.panel });
      }
      const ly = h - 26;
      [['reading', col.s[0]], ['thinking', col.s[2]], ['writing', col.s[1]]].forEach(([lab, c], i) => {
        rect(ctx, 12 + i * 92, ly - 6, 12, 12, c);
        text(ctx, lab, 30 + i * 92, ly, { color: col.muted, size: 11.5 });
      });
    },
  });
}
