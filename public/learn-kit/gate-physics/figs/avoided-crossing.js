// 4.8 Time-independent perturbation theory. Two levels E1 = +δ/2 and E2 = −δ/2 coupled by V: the exact
// eigenvalues ±√(δ²/4 + V²) (solid) never cross; the uncoupled (diabatic) levels are dashed; second-order
// perturbation theory ±(δ/2 + V²/δ) (dotted) is excellent far from the crossing and blows up near δ = 0, where
// degenerate perturbation theory (±V) takes over. The marker shows the chosen detuning.
import { canvas, axes, line, dot, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Two coupled levels against detuning: avoided crossing and second-order perturbation theory' });
  let V = 0.5, d0 = 2;
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'coupling V', min: 0, max: 1.5, step: 0.05, value: V, fmt: (v) => fmt(v, 2), oninput: (v) => { V = v; show(); } });
  slider(ctl, { label: 'detuning δ', min: -4, max: 4, step: 0.1, value: d0, fmt: (v) => fmt(v, 2), oninput: (v) => { d0 = v; show(); } });
  const show = () => {
    const ex = Math.sqrt(d0 * d0 / 4 + V * V), pt = Math.abs(d0) / 2 + (d0 ? V * V / Math.abs(d0) : Infinity);
    const mix = V ? 0.5 * (1 - Math.abs(d0 / 2) / ex) : 0;
    out.innerHTML = `δ = ${fmt(d0, 2)}: exact levels ±${fmt(ex, 3)}, gap ${fmt(2 * ex, 3)}; second order ±${Number.isFinite(pt) ? fmt(pt, 3) : '∞'}` +
      ` (error ${Number.isFinite(pt) ? fmt(Math.abs(pt - ex), 2) : '∞'}). Each eigenstate is ${fmt(100 * mix, 3)}% the other diabatic state. Minimum gap 2V = ${fmt(2 * V, 3)}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [-4, 4], y: [-3, 3], xlabel: 'detuning δ = E₁ − E₂ (units of energy)', ylabel: 'energy' });
    ctx.save(); ax.clip();
    const xs = []; for (let i = 0; i <= 400; i++) xs.push(-4 + 8 * i / 400);
    line(ctx, xs.map((x) => [ax.X(x), ax.Y(x / 2)]), col.muted, 1.2, [6, 5]);
    line(ctx, xs.map((x) => [ax.X(x), ax.Y(-x / 2)]), col.muted, 1.2, [6, 5]);
    for (const s of [1, -1]) {
      line(ctx, xs.map((x) => [ax.X(x), ax.Y(s * Math.sqrt(x * x / 4 + V * V))]), col.s[s > 0 ? 0 : 1], 2.6);
      for (const side of [1, -1]) {
        const seg = xs.filter((x) => side * x > 0.05).map((x) => [ax.X(x), ax.Y(s * (Math.abs(x) / 2 + V * V / Math.abs(x)))]);
        line(ctx, seg, col.s[2], 1.6, [2, 3]);
      }
    }
    const ex = Math.sqrt(d0 * d0 / 4 + V * V);
    dot(ctx, ax.X(d0), ax.Y(ex), 4, col.ink); dot(ctx, ax.X(d0), ax.Y(-ex), 4, col.ink);
    ctx.restore();
    ctx.font = '11px system-ui'; ctx.fillStyle = col.muted;
    ctx.fillText('solid: exact · dashed: V = 0 · dotted: 2nd order', ax.L + 6, ax.B - 8);
  };
  show();
}
