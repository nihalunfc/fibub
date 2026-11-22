// 1.7 Damped oscillator x'' + 2γx' + ω0²x = 0 with x(0) = 1, x'(0) = 0. Move the damping and watch the motion change
// from ringing (complex roots) through critical damping (a double root) to a slow creep (two real roots).
import { canvas, axes, line, row, slider, readout, fmt, title } from '../../kit.js';

function motion(g, w0) {
  if (Math.abs(g - w0) < 1e-6) return (t) => (1 + g * t) * Math.exp(-g * t);
  if (g < w0) { const wd = Math.sqrt(w0 * w0 - g * g); return (t) => Math.exp(-g * t) * (Math.cos(wd * t) + (g / wd) * Math.sin(wd * t)); }
  const s = Math.sqrt(g * g - w0 * w0), r1 = -g + s, r2 = -g - s;
  return (t) => (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 240, label: 'Displacement against time for a damped oscillator' });
  let g = 0.3, w0 = 2;
  const near = () => Math.abs(g - w0) < 0.026;
  const ctl = row(host);
  slider(ctl, { label: 'Damping γ', min: 0, max: 4, step: 0.05, value: g, fmt: (v) => fmt(v, 2) + ' /s', oninput: (v) => { g = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Natural ω₀', min: 0.5, max: 3, step: 0.05, value: w0, fmt: (v) => fmt(v, 2) + ' rad/s', oninput: (v) => { w0 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const d = g * g - w0 * w0;
    out.innerHTML = near() ? `<b>Critical damping</b> (γ = ω₀): a double root m = −${fmt(g, 3)}. The fastest return to zero without overshooting.`
      : d < 0 ? `<b>Underdamped</b>: roots m = −${fmt(g, 3)} ± ${fmt(Math.sqrt(-d), 3)}i. It oscillates at ω = √(ω₀² − γ²) = ${fmt(Math.sqrt(-d), 3)} rad/s inside the dashed envelope ±e<sup>−γt</sup>.`
      : `<b>Overdamped</b>: two real roots m = ${fmt(-g + Math.sqrt(d), 3)} and ${fmt(-g - Math.sqrt(d), 3)}. No oscillation; the slow root ${fmt(-g + Math.sqrt(d), 3)} makes it creep back. The dotted curve is critical damping, for comparison.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 10], y: [-1, 1.05], xlabel: 'time t (s)', ylabel: 'x', t: 34 });
    title(ctx, "x'' + 2γx' + ω₀²x = 0, starting at x = 1 from rest", col);
    ctx.save(); ax.clip();
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(10), ax.Y(0)]], col.muted, 1);
    const crit = motion(w0, w0), f = near() ? crit : motion(g, w0), pts = [], cp = [], env = [], env2 = [];
    for (let k = 0; k <= 400; k++) { const t = (k / 400) * 10; pts.push([ax.X(t), ax.Y(f(t))]); cp.push([ax.X(t), ax.Y(crit(t))]); env.push([ax.X(t), ax.Y(Math.exp(-g * t))]); env2.push([ax.X(t), ax.Y(-Math.exp(-g * t))]); }
    line(ctx, cp, col.s[5], 1.2, [2, 4]);
    if (g < w0 && !near()) { line(ctx, env, col.muted, 1.2, [6, 4]); line(ctx, env2, col.muted, 1.2, [6, 4]); }
    line(ctx, pts, col.s[0], 2.5);
    ctx.restore();
  };
  cv.redraw(); show();
}
