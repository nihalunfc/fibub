// 15.3 Splitting a model: one token through a 40 GB model on two 24 GB cards at 936 GB/s. Layer split (cards take
// turns), tensor split (both at once plus link swaps) and a layer split over Ethernet (illustrative network wait).
import { canvas, title, text, line, loop, calm, ease } from '../../kit.js';

const T = 20 / 936; // seconds for one card to read 20 GB
const HEAD = ['40 GB will not fit on one 24 GB card', 'Layer split: card 1 reads its half', 'Then card 2: ≈ 23 tokens a second', 'Tensor split: both at once', 'Over Ethernet: each token waits on the network'];
const PLAN = [
  [],
  [[0, 0, T]],
  [[0, 0, T], [1, T, 2 * T]],
  [[0, 0, T], [1, 0, T], [2, T, T + 0.003]],
  [[0, 0, T], [2, T, T + 0.015], [1, T + 0.015, 2 * T + 0.015]],
];
const RATE = ['', '', '1 ÷ 0.043 s ≈ 23 tokens/s', '≈ 1 ÷ 0.024 s ≈ 40 tokens/s', 'slower: ≈ 17 tokens/s (example)'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 230, label: 'Timelines of two graphics cards reading their share of a model for one token' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.9); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, HEAD[step], col);
    if (step === 0) {
      const L = 20, R = w - 20, sc = (R - L) / 48, y = h * 0.4;
      ctx.fillStyle = col.s[3]; ctx.fillRect(L, y, 40 * sc * e, 26);
      text(ctx, 'model 40 GB', L + 6, y + 13, { color: '#fff', size: 12, weight: 700 });
      [0, 24].forEach((g, i) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(L + g * sc + 0.5, y + 40, 24 * sc - 3, 26); text(ctx, `card ${i + 1}: 24 GB`, L + g * sc + 8, y + 53, { color: col.ink, size: 11.5, weight: 600 }); });
      return;
    }
    const L = 62, R = w - 14, top = 52, lh = 30, maxT = 0.06, X = (t) => L + (t / maxT) * (R - L);
    ['Card 1', 'Card 2', 'Link'].forEach((nm, i) => text(ctx, nm, 8, top + i * (lh + 10) + lh / 2, { color: col.ink, size: 11.5, weight: 600 }));
    const base = top + 3 * (lh + 10);
    line(ctx, [[L, base], [R, base]], col.muted, 1);
    [0, 0.02, 0.04, 0.06].forEach((t) => { line(ctx, [[X(t), base], [X(t), base + 4]], col.muted, 1); text(ctx, `${t} s`, X(t), base + 14, { color: col.muted, size: 10.5, align: 'center' }); });
    const end = Math.max(...PLAN[step].map((b) => b[2]));
    const now = end * e;
    PLAN[step].forEach(([lane, a, b]) => {
      if (now <= a) return;
      const y = top + lane * (lh + 10);
      ctx.fillStyle = lane === 2 ? col.warn || col.s[3] : col.s[lane];
      ctx.fillRect(X(a), y, X(Math.min(b, now)) - X(a), lh);
    });
    if (k >= 1) text(ctx, RATE[step], L, h - 12, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
