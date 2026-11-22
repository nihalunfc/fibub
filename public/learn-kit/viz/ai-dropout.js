// Dropout: while training, every hidden neuron is switched off at random with probability p on each step (new mask
// every moment you watch), so the network cannot lean on any one neuron. At prediction time nothing is dropped.
// Try: raise p, pause, press "New mask", and flip to Predicting. Surviving neurons are scaled by 1/(1−p) in training.
import { canvas, text, row, slider, choice, button, readout, loop, title, line, dot } from '../kit.js';
import { rng } from '../kit.js';

const LAYERS = [4, 7, 7, 1];
export default function (host) {
  const R = rng(5);
  let mode = 'train', mask = [], steps = 0, nets = new Set();
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 260, label: 'A neural network with some hidden neurons switched off at random' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Network is', [['train', 'Training'], ['predict', 'Predicting']], mode, (v) => { mode = v; show(); cv.redraw(); });
  const ps = slider(ctl, { label: 'Drop chance p', min: 0, max: 0.8, step: 0.05, value: 0.4, fmt: (v) => v.toFixed(2), oninput: () => newMask() });
  const anim = loop(host, (dt, t) => { if (mode === 'train' && t - (anim.l || 0) > 0.8) { anim.l = t; newMask(); } });
  anim.button(ctl2);
  button(ctl2, 'New mask', () => newMask());
  const out = readout(host);
  function newMask() {
    mask = LAYERS.map((n, l) => Array.from({ length: n }, () => (l === 0 || l === LAYERS.length - 1 ? 1 : R() < ps.value ? 0 : 1)));
    steps++; nets.add(mask.map((m) => m.join('')).join('|')); show(); cv.redraw();
  }
  function show() {
    const hid = mask.slice(1, -1).flat(), on = hid.filter(Boolean).length, p = ps.value;
    out.innerHTML = mode === 'train'
      ? `Training step ${steps}: <b>${on}</b> of ${hid.length} hidden neurons are on; survivors are multiplied by 1/(1 − p) = <b>${(1 / (1 - p)).toFixed(2)}</b> so the total signal stays the same. With ${hid.length} hidden neurons there are 2^${hid.length} = ${(2 ** hid.length).toLocaleString()} possible thinned networks, all sharing the same weights.`
      : `Predicting: <b>all ${hid.length}</b> hidden neurons are on and nothing is scaled. It behaves like an average of the many thinned networks it was trained as, which is why dropout cuts overfitting.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'train' ? 'Training: some neurons dropped' : 'Predicting: all neurons on', col);
    const T = 52, H = h - T - 22, xs = LAYERS.map((_, l) => 30 + ((w - 60) * l) / (LAYERS.length - 1));
    const pos = (l, i) => [xs[l], T + (H * (i + 0.5)) / LAYERS[l]];
    const on = (l, i) => mode === 'predict' || !mask[l] || mask[l][i];
    for (let l = 0; l < LAYERS.length - 1; l++) for (let i = 0; i < LAYERS[l]; i++) for (let j = 0; j < LAYERS[l + 1]; j++) {
      const live = on(l, i) && on(l + 1, j);
      if (live) line(ctx, [pos(l, i), pos(l + 1, j)], col.s[0], 1);
      else { ctx.save(); ctx.globalAlpha = 0.1; line(ctx, [pos(l, i), pos(l + 1, j)], col.muted, 1); ctx.restore(); }
    }
    LAYERS.forEach((n, l) => { for (let i = 0; i < n; i++) {
      const [x, y] = pos(l, i), o = on(l, i);
      dot(ctx, x, y, 11, o ? col.s[2] : col.panel, o ? col.ink : col.muted);
      if (!o) { ctx.save(); ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6); ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6); ctx.stroke(); ctx.restore(); }
    } });
    ['input', 'hidden 1', 'hidden 2', 'output'].forEach((s, l) => text(ctx, s, xs[l], h - 8, { color: col.muted, size: 10, align: 'center' }));
  };
  newMask();
}
