// 4.1 Filling a 16 GB graphics card: screen share, weights of a 12B model at 4-bit (7.7 GB file), conversation
// memory for 8K tokens (about 1.5 GB) and working room (1 GB). The last step swaps in a 27B model (about 16.2 GB of
// weights), which spills past the card into slow main memory.
import { text, title, lerp } from '../../kit.js';
import { stepFig, rect, inside } from './b-lib.js';

const CAP = 16;
// [label, GB, colour index] per step (cumulative)
const PARTS = [
  [['Screen and system', 1, 7]],
  [['Screen and system', 1, 7], ['Weights 12B, 4-bit', 7.7, 0]],
  [['Screen and system', 1, 7], ['Weights 12B, 4-bit', 7.7, 0], ['Conversation (KV)', 1.5, 2]],
  [['Screen and system', 1, 7], ['Weights 12B, 4-bit', 7.7, 0], ['Conversation (KV)', 1.5, 2], ['Working room', 1, 3]],
  [['Screen and system', 1, 7], ['Weights 27B, 4-bit', 16.2, 1], ['Conversation (KV)', 1.5, 2], ['Working room', 1, 3]],
];
const sum = (ps) => ps.reduce((s, p) => s + p[1], 0);

export default function (host) {
  return stepFig(host, {
    aspect: 0.55, max: 290, min: 230, label: 'A 16 GB graphics card filling up with a model, its conversation memory and working room',
    draw(ctx, w, h, col, s) {
      const top = title(ctx, 'What fills a 16 GB graphics card', col);
      const L = 14, R = w - 14, scale = (R - L) / 21.5, X = (gb) => L + gb * scale;
      const y = top + 34, bh = 44;
      // the card's memory box
      rect(ctx, X(0), y - 6, CAP * scale, bh + 12, col.soft, { alpha: 1, stroke: col.ink, r: 6 });
      text(ctx, '16 GB on the card (fast)', X(0) + 4, y - 16, { color: col.ink, size: 11.5, weight: 650 });
      text(ctx, 'main memory (slow)', X(CAP) + 6, y - 16, { color: col.muted, size: 11 });
      const parts = PARTS[s.step], before = PARTS[s.prev] || parts;
      let x = 0;
      parts.forEach(([lab, gb, ci], i) => {
        const old = before[i] && before[i][0] === lab ? before[i][1] : (s.step > s.prev ? 0 : gb);
        const g = lerp(old, gb, s.e);
        const x0 = X(x), x1 = X(x + g);
        // part inside the card
        const inEnd = Math.min(x1, X(CAP));
        rect(ctx, x0 + 1, y, Math.max(0, inEnd - x0 - 2), bh, col.s[ci], { alpha: 0.85 });
        if (x1 > X(CAP)) rect(ctx, Math.max(x0, X(CAP)) + 1, y, x1 - Math.max(x0, X(CAP)) - 2, bh, col.s[ci], { alpha: 0.35, stroke: col.bad || col.s[1], dash: [4, 3] });
        inside(ctx, String(+gb.toFixed(1)), x0, y + bh / 2, x1 - x0, col.panel, 11.5);
        x += g;
      });
      // the line at 16 GB
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(CAP), y - 10); ctx.lineTo(X(CAP), y + bh + 10); ctx.stroke(); ctx.restore();
      // legend
      let ly = y + bh + 30;
      parts.forEach(([lab, gb, ci], i) => {
        const lx = i % 2 ? w / 2 + 4 : L;
        rect(ctx, lx, ly - 6, 12, 12, col.s[ci], { alpha: 0.85, r: 2 });
        text(ctx, `${lab}: ${gb} GB`, lx + 17, ly, { color: col.ink, size: 11 });
        if (i % 2) ly += 19;
      });
      if (parts.length % 2) ly += 19;
      const tot = sum(parts), fits = tot <= CAP;
      text(ctx, `Total ${tot.toFixed(1)} GB: ${fits ? 'fits, with ' + (CAP - tot).toFixed(1) + ' GB to spare' : (tot - CAP).toFixed(1) + ' GB spills into slow main memory'}`, L, Math.min(h - 14, ly + 8),
        { color: fits ? (col.good || col.s[2]) : (col.bad || col.s[1]), size: 12.5, weight: 700 });
    },
  });
}
