// 4.2 One token, one full read: a 7.7 GB model on a 448 GB/s card. Each token is a block on a 0 to 100 ms timeline:
// a long read (about 17 ms) and a thin sliver of maths. The last step doubles the bandwidth (936 GB/s card).
import { text, title, lerp } from '../../kit.js';
import { stepFig, rect } from './b-lib.js';

const G = 7.7;
const STATE = [ // [bandwidth, tokens shown, show maths sliver]
  [448, 1, false], [448, 1, true], [448, 5, true], [448, 5, true], [936, 12, true],
];

export default function (host) {
  return stepFig(host, {
    aspect: 0.55, max: 290, min: 230, label: 'Timeline of tokens: each token waits for the whole model to be read from memory',
    draw(ctx, w, h, col, s) {
      const top = title(ctx, 'Every token reads the whole model', col);
      const [bw, nTok, maths] = STATE[s.step], [bw0] = STATE[s.prev];
      const b = lerp(bw0, bw, s.e), read = (G / b) * 1000, calc = 1.2;
      const L = 40, R = w - 14, X = (ms) => L + (ms / 100) * (R - L);
      // memory to chip strip
      const y0 = top + 18;
      rect(ctx, L - 26, y0, 96, 30, col.s[0], { alpha: 0.2, stroke: col.s[0] });
      text(ctx, `memory ${G} GB`, L + 22, y0 + 15, { color: col.ink, size: 10.5, align: 'center', weight: 600 });
      rect(ctx, R - 60, y0, 60, 30, col.s[3], { alpha: 0.2, stroke: col.s[3] });
      text(ctx, 'chip', R - 30, y0 + 15, { color: col.ink, size: 11, align: 'center', weight: 600 });
      const pipeW = Math.max(4, (b / 1792) * 22);
      rect(ctx, L + 74, y0 + 15 - pipeW / 2, R - 60 - L - 78, pipeW, col.s[0], { alpha: 0.5, r: 2 });
      text(ctx, `${Math.round(b)} GB/s`, (L + R) / 2 + 5, y0 + 15 + pipeW / 2 + 10, { color: col.muted, size: 11, align: 'center' });
      // timeline
      const ty = y0 + 70, th = 30;
      text(ctx, 'time (ms)', L, ty - 10, { color: col.muted, size: 11 });
      ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, ty + th + 2); ctx.lineTo(R, ty + th + 2); ctx.stroke(); ctx.restore();
      for (let m = 0; m <= 100; m += 25) text(ctx, String(m), X(m), ty + th + 12, { color: col.muted, size: 10.5, align: 'center' });
      const shown = Math.min(nTok, Math.floor(100 / (read + calc)));
      for (let i = 0; i < shown; i++) {
        const t0 = i * (read + (maths ? calc : 0));
        rect(ctx, X(t0) + 0.5, ty, X(t0 + read) - X(t0) - 1, th, col.s[0], { alpha: 0.75, r: 3 });
        if (maths) rect(ctx, X(t0 + read), ty, Math.max(2, X(t0 + read + calc) - X(t0 + read)), th, col.s[3], { alpha: 1, r: 1 });
      }
      const tps = b / G;
      const ly = ty + th + 34;
      rect(ctx, L, ly - 6, 12, 12, col.s[0], { alpha: 0.75, r: 2 });
      text(ctx, `reading weights: ${read.toFixed(1)} ms per token`, L + 17, ly, { color: col.ink, size: 11 });
      if (maths) { rect(ctx, L, ly + 13, 12, 12, col.s[3], { alpha: 1, r: 2 }); text(ctx, 'maths (the chip is idle the rest of the time)', L + 17, ly + 19, { color: col.ink, size: 11 }); }
      if (s.step >= 3) text(ctx, `About ${Math.round(tps)} tokens per second at most`, L, Math.min(h - 12, ly + 42), { color: col.s[0], size: 13, weight: 700 });
    },
  });
}
