// 9.4 Watch it happen: one forward and one backward pass through x → z₁ → h → z₂ → p → L
// (x = 2, w₁ = 0.5, ReLU, w₂ = 1.5, b = −0.5, sigmoid, log-loss with y = 1), then the update.
import { canvas, text, title, dot, arrow, line, ease, loop, calm } from '../../kit.js';

const NODES = ['x', 'z₁', 'h', 'z₂', 'p', 'L'];
const FWD = ['2', '1', '1', '1', '0.731', '0.313'];
const NEW = ['2', '1.807', '1.807', '2.586', '0.930', '0.073'];
const EDGES = ['×w₁', 'ReLU', '×w₂+b', 'σ', 'loss'];
const GRAD = [null, '−0.403', '−0.403', '−0.269', null, null]; // ∂L/∂(node)
const TITLES = ['Forward: x to the hidden neuron', 'Forward: to the prediction and the loss', 'Backward: error at the output',
  'Backward: through w₂', 'Backward: through ReLU to w₁', 'Update the weights and try again'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 300, min: 250, label: 'A tiny network with its forward values and backward gradients' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.7); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    const L = 24, R = w - 24, y = h * 0.44, gap = (R - L) / 5, X = (i) => L + i * gap, r = Math.min(15, gap * 0.28);
    const fwdUpTo = step === 0 ? 2 : 5, e = ease(k);
    for (let i = 0; i < 5; i++) {
      const on = i < fwdUpTo;
      line(ctx, [[X(i) + r, y], [X(i + 1) - r, y]], on ? col.ink : col.line, on ? 2 : 1);
      text(ctx, EDGES[i], (X(i) + X(i + 1)) / 2, y - 12, { color: on ? col.muted : col.line, size: 10, align: 'center', fit: false });
    }
    NODES.forEach((nm, i) => {
      const on = i <= fwdUpTo;
      dot(ctx, X(i), y, r, col.panel, on ? col.ink : col.line);
      text(ctx, nm, X(i), y, { color: on ? col.ink : col.muted, size: 12.5, weight: 700, align: 'center', fit: false });
      if (on && step < 5) text(ctx, FWD[i], X(i), y - r - 22, { color: col.ink, size: 11.5, weight: 600, align: 'center', fit: false });
      if (step === 5) text(ctx, NEW[i], X(i), y - r - 22, { color: col.good || col.s[2], size: 11.5, weight: 700, align: 'center', fit: false });
    });
    // backward gradients (below the nodes)
    const gc = col.s[1];
    const showG = (i) => GRAD[i] && ((i === 3 && step >= 2) || (i === 2 && step >= 3) || (i === 1 && step >= 4));
    for (let i = 1; i <= 3; i++) if (showG(i) && step < 5) {
      const fresh = (i === 3 && step === 2) || (i === 2 && step === 3) || (i === 1 && step === 4);
      if (fresh && i < 5) arrow(ctx, X(i + 1) - r * 0.4, y + r + 10, X(i + 1) - (X(i + 1) - X(i)) * e + r * 0.4, y + r + 10, gc, 2, 6);
      text(ctx, GRAD[i], X(i), y + r + 26, { color: gc, size: 11.5, weight: 700, align: 'center', fit: false });
    }
    const notes = [
      ['z₁ = 0.5 × 2 = 1;  h = ReLU(1) = 1', ''],
      ['z₂ = 1.5 × 1 − 0.5 = 1;  p = σ(1) = 0.731', 'loss = −ln 0.731 = 0.313 (true answer y = 1)'],
      ['error at z₂ = p − y = 0.731 − 1 = −0.269', 'so ∂L/∂w₂ = −0.269 × h = −0.269, ∂L/∂b = −0.269'],
      ['to h: −0.269 × w₂ (1.5) = −0.403', ''],
      ['ReLU slope at 1 is 1, so z₁ gets −0.403', '∂L/∂w₁ = −0.403 × x (2) = −0.807'],
      ['η = 0.5: w₁ = 0.903, w₂ = 1.634, b = −0.366', 'new p = 0.930, loss 0.073: down by over three quarters'],
    ][step];
    text(ctx, notes[0], 10, h - 36, { color: col.ink, size: 11.5, weight: 600 });
    if (notes[1]) text(ctx, notes[1], 10, h - 16, { color: col.muted, size: 11 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
