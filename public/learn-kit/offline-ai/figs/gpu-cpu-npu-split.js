// 4.3 A 16 GB model split between a 12 GB-usable graphics card (448 GB/s) and main memory (60 GB/s).
// Bars show the time per token for each part; the slow quarter of the model takes most of the time.
import { text, title } from '../../kit.js';
import { stepFig, rect, inside } from './b-lib.js';

const GPU = 448, CPU = 60;
const ms = (gb, bw) => (gb / bw) * 1000;

export default function (host) {
  return stepFig(host, {
    aspect: 0.55, max: 290, min: 230, label: 'Bars of time per token for a model on the graphics card alone and split with main memory',
    draw(ctx, w, h, col, s) {
      const top = title(ctx, 'Time to write one token', col);
      const L = 14, R = w - 14;
      const XX = (t) => L + (t / 100) * (R - L);
      const rows = [];
      rows.push({ name: 'All 16 GB on a big enough card', parts: [[ms(16, GPU), 0, '16 GB on card']] });
      if (s.step >= 1) rows.push({ name: s.step >= 2 ? 'Split: 12 GB on the card, 4 GB in main memory' : 'Split: 12 GB on the card ...', parts: [[ms(12, GPU), 0, '12 GB card']].concat(s.step >= 2 ? [[ms(4, CPU), 1, '4 GB main memory']] : []) });
      let y = top + 22;
      rows.forEach((r, ri) => {
        text(ctx, r.name, L, y, { color: col.ink, size: 11.5, weight: 600 });
        let t = 0;
        const grow = ri === rows.length - 1 && s.step !== s.prev ? s.e : 1;
        r.parts.forEach(([d, ci, lab], pi) => {
          const last = pi === r.parts.length - 1;
          const dd = last ? d * grow : d;
          rect(ctx, XX(t), y + 10, XX(t + dd) - XX(t) - 1, 26, col.s[ci], { alpha: 0.8 });
          inside(ctx, `${lab}: ${d.toFixed(1)} ms`, XX(t), y + 23, XX(t + dd) - XX(t), col.panel, 10.5) || inside(ctx, `${d.toFixed(0)} ms`, XX(t), y + 23, XX(t + dd) - XX(t), col.panel, 10.5);
          t += dd;
        });
        const tot = r.parts.reduce((a, p) => a + p[0], 0);
        if (ri === 0 || s.step >= 2) text(ctx, `${tot.toFixed(1)} ms per token = ${(1000 / tot).toFixed(1)} tokens per second`, L, y + 48, { color: col.muted, size: 11 });
        y += 72;
      });
      // scale
      for (let m = 0; m <= 100; m += 25) text(ctx, m + ' ms', XX(m), Math.min(h - 10, y + 2), { color: col.muted, size: 10, align: m === 0 ? 'left' : m === 100 ? 'right' : 'center' });
      if (s.step >= 3) {
        const c = ms(4, CPU), tot = ms(12, GPU) + c;
        text(ctx, `A quarter of the model, ${Math.round((c / tot) * 100)}% of the time`, L, Math.min(h - 8, y + 22), { color: col.bad || col.s[1], size: 12.5, weight: 700 });
      }
    },
  });
}
