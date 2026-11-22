// 5.5 Twelve people share one machine. Step 1: each row is a person over one hour (60 one-minute slots), filled
// where they are using it (5% of the time, seeded so the picture is the same each visit). Step 2: how many are busy in
// each minute. Step 3: the chances of 0, 1 or 2+ at once from the maths. Step 4: the same for heavy users (20%).
import { text, title, rng } from '../../kit.js';
import { stepFig, rect } from './b-lib.js';

const N = 12, SLOTS = 60;
const grid = (p, seed) => { const r = rng(seed); return Array.from({ length: N }, () => Array.from({ length: SLOTS }, () => r() < p)); };
const LIGHT = grid(0.05, 7), HEAVY = grid(0.2, 11);
const binom = (p) => { const p0 = (1 - p) ** N, p1 = N * p * (1 - p) ** (N - 1); return [p0, p1, 1 - p0 - p1]; };

export default function (host) {
  return stepFig(host, {
    aspect: 0.7, max: 340, min: 270, label: 'Twelve people sharing one AI machine over an hour, and how often more than one asks at once',
    draw(ctx, w, h, col, s) {
      const heavy = s.step >= 3, G = heavy ? HEAVY : LIGHT, p = heavy ? 0.2 : 0.05;
      const top = title(ctx, heavy ? '12 heavy users (busy 20% each)' : '12 light users (busy 5% each)', col);
      const L = 60, R = w - 12, cw = (R - L) / SLOTS, rh = 9;
      const y0 = top + 6;
      for (let i = 0; i < N; i++) {
        const y = y0 + i * (rh + 2);
        text(ctx, `person ${i + 1}`, L - 6, y + rh / 2, { color: col.muted, size: 9.5, align: 'right', fit: false });
        rect(ctx, L, y, R - L, rh, col.line, { alpha: 0.35, r: 2 });
        G[i].forEach((b, j) => { if (b) rect(ctx, L + j * cw, y, Math.max(2, cw - 0.5), rh, col.s[0], { alpha: 0.9, r: 1 }); });
      }
      let y = y0 + N * (rh + 2) + 6;
      if (s.step >= 1) {
        text(ctx, 'at once', L - 6, y + 8, { color: col.ink, size: 9.5, align: 'right', fit: false, weight: 600 });
        for (let j = 0; j < SLOTS; j++) {
          const c = G.reduce((a, row) => a + (row[j] ? 1 : 0), 0);
          if (c) rect(ctx, L + j * cw, y + 18 - Math.min(18, c * 6), Math.max(2, cw - 0.5), Math.min(18, c * 6), c >= 2 ? (col.bad || col.s[1]) : col.s[2], { alpha: 0.9, r: 1 });
        }
        y += 28;
      }
      if (s.step >= 2) {
        const pr = binom(p), labs = ['nobody', 'one person', 'two or more'];
        text(ctx, `Average busy at once: ${N} × ${p} = ${(N * p).toFixed(1)}`, 12, y + 4, { color: col.ink, size: 12, weight: 700 });
        y += 18;
        const bw = (w - 24) / 3;
        pr.forEach((v, i) => {
          const x = 12 + i * bw;
          rect(ctx, x + 2, y, (bw - 8) * v * s.e + 1, 16, i === 2 ? (col.bad || col.s[1]) : col.s[2], { alpha: 0.85, r: 2 });
          text(ctx, `${labs[i]}: ${Math.round(v * 100)}%`, x + 2, y + 28, { color: col.ink, size: 11, fit: false });
        });
      }
    },
  });
}
