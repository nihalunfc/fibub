// 7.10 Superconductivity. View 1: the phase diagram B against T. Type I: one parabola B_c(T) = B_c(0)[1 - (T/T_c)²]
// separating the Meissner state from the normal state. Type II: B_c1(T) and B_c2(T) (same shape, B_c2 = 40 B_c1 here,
// illustrative), with the vortex state between. A dot marks the chosen (T, B) and the readout names the state.
// View 2: the field profile B(x) inside a thick sample, B_0 exp(-x/lambda(T)), with the two-fluid
// lambda(T) = lambda(0) / sqrt(1 - (T/T_c)^4), compared with the field frozen in a perfect conductor.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.68, max: 450, min: 300, label: 'Superconductor phase diagram with critical fields, or the field profile inside showing the penetration depth' });
  let mode = 'phase', type = 'I', t = 0.5, b = 0.5, l0 = 50;
  const ctl = row(host);
  const ctl2 = row(host);
  const out = readout(host);
  const Bc = (t) => Math.max(0, 1 - t * t);
  const state = () => {
    if (t >= 1) return 'normal (above T<sub>c</sub>)';
    if (type === 'I') return b < Bc(t) ? 'superconducting: Meissner state, B = 0 inside' : 'normal: field fully inside';
    const b1 = 0.1 * Bc(t), b2 = 4 * Bc(t);
    return b < b1 ? 'Meissner state (below B<sub>c1</sub>)' : b < b2 ? `vortex (mixed) state: ${fmt(b * 0.1 / 2.07e-15 * 1e-12, 3)} vortices per μm² if B<sub>c</sub>(0) = 0.1 T` : 'normal (above B<sub>c2</sub>)';
  };
  const show = () => {
    if (mode === 'phase') {
      out.innerHTML = `T = ${fmt(t, 3)} T<sub>c</sub>, B = ${fmt(b, 3)} B<sub>c</sub>(0): <b>${state()}</b>. ` + (type === 'I' ? `Here B<sub>c</sub>(T) = ${fmt(Bc(t), 3)} B<sub>c</sub>(0).` : `Here B<sub>c1</sub> = ${fmt(0.1 * Bc(t), 3)} and B<sub>c2</sub> = ${fmt(4 * Bc(t), 3)}.`);
    } else {
      const lam = t < 1 ? l0 / Math.sqrt(1 - t ** 4) : Infinity;
      out.innerHTML = t < 1 ? `λ(T) = λ(0)/√(1 − t⁴) = <b>${fmt(lam, 3)} nm</b>; the field falls to 1/e at x = λ and to 5% at 3λ = ${fmt(3 * lam, 3)} nm. A perfect conductor cooled in the field would keep B = B₀ throughout (dashed).` : 'Above T<sub>c</sub> the field fills the sample.';
    }
  };
  choice(ctl, 'View', [['phase', 'phase diagram'], ['depth', 'field inside']], mode, (v) => { mode = v; cv.redraw(); show(); });
  choice(ctl, 'Type', [['I', 'type I'], ['II', 'type II']], type, (v) => { type = v; cv.redraw(); show(); });
  slider(ctl2, { label: 'T / T_c', min: 0, max: 1.2, step: 0.01, value: t, fmt: (v) => fmt(v, 3), oninput: (v) => { t = v; cv.redraw(); show(); } });
  slider(ctl2, { label: 'B (units of B_c(0))', min: 0, max: 4.5, step: 0.01, value: b, fmt: (v) => fmt(v, 3), oninput: (v) => { b = v; cv.redraw(); show(); } });
  slider(ctl2, { label: 'λ(0) (nm)', min: 20, max: 200, step: 5, value: l0, fmt: (v) => String(Math.round(v)), oninput: (v) => { l0 = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    if (mode === 'phase') {
      const top = type === 'I' ? 1.3 : 4.5;
      const a = axes(ctx, w, h, col, { x: [0, 1.2], y: [0, top], xlabel: 'temperature T / T_c', ylabel: 'field B / B_c(0)', t: 24 });
      const ts = Array.from({ length: 201 }, (_, i) => i / 200);
      ctx.save(); a.clip();
      const curve = (k, c, wd, dash) => line(ctx, ts.map((x) => [a.X(x), a.Y(k * Bc(x))]), c, wd, dash);
      ctx.fillStyle = col.soft;
      ctx.beginPath(); ctx.moveTo(a.X(0), a.Y(0));
      ts.forEach((x) => ctx.lineTo(a.X(x), a.Y((type === 'I' ? 1 : 0.1) * Bc(x))));
      ctx.lineTo(a.X(1), a.Y(0)); ctx.closePath(); ctx.fill();
      if (type === 'I') curve(1, col.s[0], 2.6);
      else { curve(0.1, col.s[0], 2.4); curve(4, col.s[2], 2.4); curve(1, col.muted, 1.2, [5, 4]); }
      dot(ctx, a.X(Math.min(t, 1.2)), a.Y(Math.min(b, top)), 6, col.ink, col.panel);
      ctx.restore();
      if (type === 'I') {
        text(ctx, 'Meissner (shaded)', a.X(0.05), a.Y(0.35), { color: col.ink, size: 12, weight: 700 });
        text(ctx, 'normal', a.X(0.75), a.Y(1.0), { color: col.ink, size: 12, weight: 700 });
        text(ctx, 'B_c(T)', a.X(0.62), a.Y(Bc(0.62)) - 12, { color: col.s[0], size: 12, weight: 700 });
      } else {
        text(ctx, 'B_c2(T)', a.X(0.45), a.Y(4 * Bc(0.45)) - 12, { color: col.s[2], size: 12, weight: 700 });
        text(ctx, 'vortex state', a.X(0.15), a.Y(1.8), { color: col.ink, size: 12, weight: 700 });
        text(ctx, 'B_c1(T), Meissner below', a.X(0.08), a.Y(0.1) - 12, { color: col.s[0], size: 12, weight: 700 });
        text(ctx, 'dashed: thermodynamic B_c', a.L + 8, a.T + 10, { color: col.muted, size: 11 });
      }
      return;
    }
    const lam = t < 1 ? l0 / Math.sqrt(1 - t ** 4) : 1e9, X1 = 400;
    const a = axes(ctx, w, h, col, { x: [-60, X1], y: [0, 1.15], xlabel: 'depth x below the surface (nm)', ylabel: 'B / B₀', t: 24 });
    ctx.save(); a.clip();
    ctx.fillStyle = col.soft; ctx.fillRect(a.X(0), a.T, a.R - a.X(0), a.B - a.T);
    line(ctx, [[a.X(-60), a.Y(1)], [a.X(0), a.Y(1)]], col.ink, 2);
    const xs = Array.from({ length: 401 }, (_, i) => X1 * i / 400);
    line(ctx, xs.map((x) => [a.X(x), a.Y(Math.exp(-x / lam))]), col.s[0], 2.6);
    line(ctx, [[a.X(0), a.Y(1)], [a.X(X1), a.Y(1)]], col.muted, 1.4, [6, 4]);
    if (t < 1) { line(ctx, [[a.X(lam), a.B], [a.X(lam), a.Y(Math.exp(-1))]], col.s[2], 1.2, [2, 3]); }
    ctx.restore();
    text(ctx, 'vacuum', a.X(-55), a.T + 10, { color: col.muted, size: 11 });
    text(ctx, 'superconductor (shaded)', a.X(10), a.T + 10, { color: col.ink, size: 12, weight: 700 });
    if (t < 1 && lam < X1) text(ctx, 'λ', a.X(lam) + 4, a.B - 12, { color: col.s[2], size: 13, weight: 700 });
  };
  cv.redraw(); show();
}
