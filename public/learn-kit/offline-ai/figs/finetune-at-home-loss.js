// 14.3 Fine-tuning at home: training and validation loss over a 150-step run. Validation levels off near 1.2
// around step 110 and then creeps up (overfitting); the checkpoint at step 120 is kept. Made-up but typical curves.
import { canvas, axes, line, dot, text, title, loop, calm, ease } from '../../kit.js';

const train = (s) => 0.7 + 1.2 * Math.exp(-s / 45);
const val = (s) => 1.2 + 0.7 * Math.exp(-s / 30) + (s > 110 ? 6e-5 * (s - 110) ** 2 : 0);
const UPTO = [0, 40, 110, 150, 150];
const HEAD = ['150 steps: 600 examples ÷ 8 × 2 epochs', 'Early: both losses fall fast', 'Validation levels off near 1.2', 'Validation creeps up: memorising', 'Keep the checkpoint at step 120'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 230, label: 'Training and validation loss falling over 150 steps, with validation turning up after step 110' });
  let step = 0, k = 1, from = 0;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 1.1); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, HEAD[step], col);
    const ax = axes(ctx, w, h, col, { x: [0, 150], y: [0.6, 2], t: 40, xlabel: 'training step', ylabel: 'loss', xt: [0, 50, 100, 150], yt: [0.8, 1.2, 1.6, 2] });
    const end = from + (UPTO[step] - from) * ease(k);
    if (end > 0) {
      const pts = (f) => { const p = []; for (let s = 0; s <= end; s += 2) p.push([ax.X(s), ax.Y(f(s))]); return p; };
      line(ctx, pts(train), col.s[0], 2.2);
      line(ctx, pts(val), col.s[1], 2.2, [6, 4]);
    }
    text(ctx, '— training', ax.R - 96, ax.T + 4, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, '- - validation', ax.R - 96, ax.T + 20, { color: col.s[1], size: 11, weight: 700 });
    if (step === 4) {
      dot(ctx, ax.X(120), ax.Y(val(120)), 6, col.s[2], col.panel);
      text(ctx, 'keep step 120', ax.X(120), ax.Y(val(120)) - 16, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    }
  };
  cv.redraw();
  return { step(i) { from = i > step ? UPTO[step] : UPTO[i]; step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
