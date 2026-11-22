// Quantisation made visible: 96 made-up weights (grey) squeezed onto a grid of 2^bits levels (blue). One weight is an
// outlier. Lower the bits and the levels get coarse; with ONE scale for everything the outlier stretches the grid so
// the small weights collapse onto 0, while a scale per block of 32 (what Q4 and similar formats do) keeps them apart.
import { canvas, text, row, slider, choice, readout, title, axes, line, dot } from '../kit.js';
import { rng } from '../kit.js';
import { gauss } from './_ai.js';

const R = rng(3), WS = Array.from({ length: 96 }, () => 0.02 * gauss(R)); WS[40] = 0.17;
export default function (host) {
  let bits = 4, mode = 'block';
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 270, label: 'Weights and their quantised values' });
  const ctl = row(host);
  slider(ctl, { label: 'Bits per weight', min: 2, max: 8, step: 1, value: 4, fmt: (v) => Math.round(v) + ' bit', oninput: (v) => { bits = Math.round(v); show(); } });
  choice(ctl, 'Scale', [['block', 'One per block of 32'], ['tensor', 'One for everything']], mode, (v) => { mode = v; show(); });
  const out = readout(host);
  function quant() {
    const qmax = 2 ** (bits - 1) - 1, res = new Array(96);
    for (let b = 0; b < (mode === 'block' ? 3 : 1); b++) {
      const lo = mode === 'block' ? b * 32 : 0, hi = mode === 'block' ? lo + 32 : 96, am = Math.max(...WS.slice(lo, hi).map(Math.abs)), sc = am / qmax;
      for (let i = lo; i < hi; i++) res[i] = Math.max(-qmax, Math.min(qmax, Math.round(WS[i] / sc))) * sc;
    }
    return res;
  }
  function show() {
    const q = quant(), mse = WS.reduce((s, w, i) => s + (w - q[i]) ** 2, 0) / 96, zeros = q.filter((v, i) => v === 0 && Math.abs(WS[i]) > 0.005).length;
    const eff = bits + (mode === 'block' ? 0.5 : 0);
    out.innerHTML = `<b>${bits}-bit</b>: ${2 ** bits} levels per scale. Typical error (RMS) <b>${Math.sqrt(mse).toFixed(4)}</b> against weights of size about 0.02. ${zeros ? `<b>${zeros}</b> small weights were rounded to exactly 0. ` : ''}Storage ≈ <b>${eff.toFixed(1)}</b> bits per weight, so a 7-billion-parameter model is about <b>${(7 * eff / 8).toFixed(1)} GB</b> (16-bit: 14 GB).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Original (grey) and quantised (blue) weights', col);
    const q = quant(), ax = axes(ctx, w, h, col, { x: [0, 96], y: [-0.2, 0.2], xlabel: 'weight number (3 blocks of 32)', ylabel: 'weight value', t: 44, b: 36, l: 50, r: 10, fy: (v) => v.toFixed(2), xt: [0, 32, 64, 96] });
    ax.clip();
    const levels = new Set(); if (bits <= 4) { const qmax = 2 ** (bits - 1) - 1; for (let b = 0; b < (mode === 'block' ? 3 : 1); b++) { const lo = mode === 'block' ? b * 32 : 0, hi = mode === 'block' ? lo + 32 : 96, sc = Math.max(...WS.slice(lo, hi).map(Math.abs)) / qmax;
      for (let k = -qmax; k <= qmax; k++) { const xa = ax.X(lo), xb = ax.X(hi), y = ax.Y(k * sc); line(ctx, [[xa, y], [xb, y]], col.line, 1); } } }
    WS.forEach((v, i) => { line(ctx, [[ax.X(i + 0.5), ax.Y(v)], [ax.X(i + 0.5), ax.Y(q[i])]], col.bad, 1); });
    WS.forEach((v, i) => dot(ctx, ax.X(i + 0.5), ax.Y(v), 2.4, col.muted));
    WS.forEach((v, i) => dot(ctx, ax.X(i + 0.5), ax.Y(q[i]), 2.4, col.s[0]));
    text(ctx, 'outlier', ax.X(41), ax.Y(0.17) + 2, { color: col.ink, size: 10, fit: false });
  };
  show();
}
