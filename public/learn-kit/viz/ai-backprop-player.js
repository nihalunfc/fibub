// Backpropagation on the smallest network that shows it: ŷ = w₂ · ReLU(w₁ · x), loss = (ŷ − target)². Step through
// the forward pass, then watch the slope of the loss flow backwards one link at a time (chain rule), then the weights
// move. All numbers are real: x = 2, w₁ = 0.5, w₂ = 1.5, target 4, learning rate 0.05.
import { canvas, text, row, button, readout, title, arrow } from '../kit.js';
import { ownSteps, rr } from './_ai.js';

const x = 2, w1 = 0.5, w2 = 1.5, t = 4, lr = 0.05;
const a = w1 * x, h = Math.max(0, a), yh = w2 * h, L = (yh - t) ** 2;
const dy = 2 * (yh - t), dw2 = dy * h, dh = dy * w2, da = a > 0 ? dh : 0, dw1 = da * x;
const nw1 = w1 - lr * dw1, nw2 = w2 - lr * dw2, nyh = nw2 * Math.max(0, nw1 * x), nL = (nyh - t) ** 2;
const MSG = [
  'Start: input x = 2, weights w₁ = 0.5 and w₂ = 1.5, and the answer we want is 4.',
  'Forward, link 1: a = w₁ · x = 0.5 × 2 = 1.0. ReLU keeps positive numbers, so h = 1.0.',
  'Forward, link 2: ŷ = w₂ · h = 1.5 × 1.0 = 1.5. The loss is (1.5 − 4)² = 6.25. Far too small a prediction.',
  'Backward starts at the end: how much does the loss change if ŷ changes? dL/dŷ = 2(ŷ − 4) = −5. Negative: raising ŷ lowers the loss.',
  'One link back: dL/dw₂ = dL/dŷ × h = −5 × 1 = −5, and dL/dh = dL/dŷ × w₂ = −5 × 1.5 = −7.5. Same chain rule at every link.',
  'Back through ReLU (slope 1 because a > 0) to w₁: dL/dw₁ = −7.5 × x = −7.5 × 2 = −15. Every weight now has its own slope.',
  'Update: w = w − 0.05 × slope. w₁ becomes 1.25, w₂ becomes 1.75. Run forward again: ŷ = 4.375 and the loss falls from 6.25 to 0.14.',
];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'The forward and backward pass through a two-weight network' });
  const out = readout(host);
  const draw = (i) => { k = Math.min(i, 6); out.innerHTML = MSG[k]; cv.redraw(); };
  cv.draw = (ctx, w, hh, col) => {
    title(ctx, k < 3 ? 'Forward pass: left to right' : k < 6 ? 'Backward pass: right to left' : 'Update, then forward again', col);
    const names = ['x', 'a = w₁x', 'h = ReLU(a)', 'ŷ = w₂h', 'loss'];
    const vals = [x, a, h, yh, L], show = [0, 1, 1, 2, 2].map((s) => k >= s);
    if (k === 6) { vals[1] = nw1 * x; vals[2] = Math.max(0, nw1 * x); vals[3] = nyh; vals[4] = nL; }
    const bw = Math.min(60, ((w - 20) / 5) * 0.64), step = (w - 20) / 5, y0 = 70, bh = 44;
    const grads = [null, k >= 5 ? da : null, k >= 4 ? dh : null, k >= 3 ? dy : null, k >= 3 ? 1 : null];
    for (let i = 0; i < 5; i++) {
      const cx = 10 + step * i + step / 2, x0 = cx - bw / 2;
      ctx.lineWidth = 1.5; ctx.strokeStyle = show[i] ? col.s[0] : col.line; ctx.fillStyle = col.panel; rr(ctx, x0, y0, bw, bh); ctx.fill(); ctx.stroke();
      text(ctx, names[i], cx, y0 - 10, { color: col.muted, size: 10, align: 'center' });
      if (show[i]) text(ctx, vals[i].toFixed(vals[i] % 1 ? 2 : 1), cx, y0 + bh / 2, { color: col.ink, size: 15, weight: 700, align: 'center' });
      if (i < 4) arrow(ctx, x0 + bw + 2, y0 + bh / 2, x0 + step - 2, y0 + bh / 2, show[i + 1] ? col.s[0] : col.line, 2, 6);
      if (i < 4 && (i === 0 || i === 2)) text(ctx, i === 0 ? '×w₁' : '×w₂', x0 + bw + (step - bw) / 2, y0 + bh / 2 + 14, { color: col.muted, size: 10, align: 'center', fit: false });
      if (grads[i] != null && k < 6) {
        const g = grads[i], yy = y0 + bh + 40;
        rr(ctx, x0, yy, bw, 36); ctx.strokeStyle = col.s[1]; ctx.stroke();
        text(ctx, i === 4 ? '1' : g.toFixed(1), cx, yy + 18, { color: col.s[1], size: 14, weight: 700, align: 'center' });
        text(ctx, i === 4 ? 'dL/dL' : `dL/d${['x', 'a', 'h', 'ŷ'][i]}`, cx, yy + 50, { color: col.s[1], size: 10, align: 'center' });
        if (i > 0) arrow(ctx, x0 - 2, yy + 18, x0 - step + bw + 2, yy + 18, col.s[1], 2, 6);
      }
    }
    const wy = y0 + bh + 112 > hh - 30 ? hh - 34 : y0 + bh + 112;
    const wbox = (cx, nm, v, g, nv) => {
      text(ctx, nm, cx, wy, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, k >= 6 ? `${v.toFixed(2)} → ${nv.toFixed(2)}` : v.toFixed(2), cx, wy + 16, { color: k >= 6 ? col.good : col.ink, size: 13, weight: 700, align: 'center' });
      if (k >= 5 || (k >= 4 && nm === 'w₂')) text(ctx, `slope ${g.toFixed(1)}`, cx, wy + 32, { color: col.s[1], size: 11, align: 'center' });
    };
    wbox(w * 0.3, 'w₁', w1, dw1, nw1); wbox(w * 0.7, 'w₂', w2, dw2, nw2);
  };
  ownSteps(host, 7, draw, row, button);
  draw(0);
  return { step: (i) => draw(i) };
}
