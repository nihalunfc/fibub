// 2.2 Parameters: a 12B model's weights at 16, 8 and 4 bits against a 16 GB laptop.
import { canvas, title, text, line, loop, calm, ease } from '../../kit.js';

const ROWS = [['16-bit', 24], ['8-bit', 12], ['4-bit', 6]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.58, max: 340, min: 220, label: 'Weights of a 12B model at 16, 8 and 4 bits compared with 16 GB of memory' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.7); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, '12 billion parameters: how many GB?', col);
    const L = 62, R = w - 50, sc = (R - L) / 26, top = 56, gap = (h - top - 30) / 3;
    const x16 = L + 16 * sc;
    line(ctx, [[x16, top - 10], [x16, h - 22]], col.ink, 1.5, [5, 4]);
    text(ctx, '16 GB laptop', x16, h - 12, { color: col.ink, size: 11, weight: 600, align: 'center' });
    if (step === 0) {
      text(ctx, '12,000,000,000 numbers', L, top + gap, { color: col.ink, size: 15, weight: 700 });
      text(ctx, 'each one learned in training', L, top + gap + 22, { color: col.muted, size: 12 });
      return;
    }
    ROWS.slice(0, step).forEach(([name, gb], i) => {
      const y = top + i * gap, grow = i === step - 1 ? ease(k) : 1;
      text(ctx, name, 8, y + 13, { color: col.ink, size: 12, weight: 600 });
      ctx.fillStyle = gb > 16 ? col.bad || col.s[3] : col.s[i];
      ctx.fillRect(L, y, gb * sc * grow, 26);
      text(ctx, `${gb} GB`, L + gb * sc * grow + 6, y + 13, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
