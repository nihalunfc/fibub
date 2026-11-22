// Class 12 Chemistry, Chemical Kinetics: zero, first and second order reactions of the type R -> products. Zero order: rate = k, [R] = [R]0 - kt, t1/2 = [R]0/2k (each half-life is shorter).
// First order: rate = k[R], [R] = [R]0 e^(-kt), ln[R] against t is a straight line of slope -k, t1/2 = 0.693/k (constant). Second order: rate = k[R]^2, 1/[R] = 1/[R]0 + kt, t1/2 = 1/(k[R]0) (each longer).
// Views: concentration-time (with half-life marks), the LINEAR plot that identifies the order, and rate against [R].
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let ord = 1, view = 'conc', c0 = 1, ks = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Concentration against time for zero first and second order reactions with half lives marked' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'order', [[0, 'zero'], [1, 'first'], [2, 'second']], ord, (v) => { ord = v; go(); });
  choice(ctl, 'graph', [['conc', '[R] against t'], ['lin', 'straight-line plot'], ['rate', 'rate against [R]']], view, (v) => { view = v; go(); });
  slider(ctl, { label: 'initial concentration [R]₀ (mol/L)', min: 0.5, max: 2, step: 0.1, value: c0, fmt: (v) => v.toFixed(1), oninput: (v) => { c0 = v; go(); } });
  slider(ctl, { label: 'rate constant k (× normal)', min: 0.5, max: 2, step: 0.1, value: ks, fmt: (v) => v.toFixed(1), oninput: (v) => { ks = v; go(); } });
  const K = () => [0.04, 0.08, 0.1][ord] * ks, UN = ['mol L⁻¹ min⁻¹', 'min⁻¹', 'L mol⁻¹ min⁻¹'];
  const C = (t) => (ord === 0 ? Math.max(0, c0 - K() * t) : ord === 1 ? c0 * Math.exp(-K() * t) : c0 / (1 + K() * c0 * t));
  const half = () => (ord === 0 ? c0 / (2 * K()) : ord === 1 ? Math.LN2 / K() : 1 / (K() * c0));
  const go = () => { ro.textContent = `${['Zero', 'First', 'Second'][ord]} order, k = ${K().toFixed(3)} ${UN[ord]}: t½ = ${half().toFixed(1)} min${ord === 1 ? ' (the same for every half)' : ord === 0 ? ' (and it gets shorter as [R] falls)' : ' (and it gets longer as [R] falls)'}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const T = 40, t0 = title(ctx, ['Zero order', 'First order', 'Second order'][ord] + ': ' + { conc: 'concentration against time', lin: ['[R] against t is a straight line', 'ln[R] against t is a straight line', '1/[R] against t is a straight line'][ord], rate: ['rate is constant', 'rate ∝ [R]', 'rate ∝ [R]²'][ord] }[view], col);
    if (view === 'conc') {
      const A = axes(ctx, w, h, col, { x: [0, T], y: [0, 2.1], xlabel: 'time t (min)', ylabel: '[R] (mol/L)', l: 44, t: t0 + 6, b: 40, fy: (v) => v.toFixed(1) });
      ctx.save(); A.clip(); line(ctx, Array.from({ length: 121 }, (_, i) => [A.X(i / 3), A.Y(C(i / 3))]), col.s[0], 3); ctx.restore();
      let c = c0, tm = 0;
      for (let i = 0; i < 3; i++) { const target = c / 2; let lo = tm, hi = 400; for (let j = 0; j < 40; j++) { const m = (lo + hi) / 2; (C(m) > target ? (lo = m) : (hi = m)); } const tt = lo; if (tt > T) break;
        ctx.strokeStyle = col.s[3]; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(target)); ctx.lineTo(A.X(tt), A.Y(target)); ctx.lineTo(A.X(tt), A.B); ctx.stroke(); ctx.setLineDash([]); dot(ctx, A.X(tt), A.Y(target), 4.5, col.s[3], col.panel);
        text(ctx, `t½ = ${(tt - tm).toFixed(1)}`, A.X(tt) + 6, A.Y(target) - 9, { color: col.s[3], size: 10.5, weight: 700, halo: col.panel }); c = target; tm = tt; }
    } else if (view === 'lin') {
      const f = [(c) => c, (c) => Math.log(c), (c) => 1 / c][ord], lab = ['[R] (mol/L)', 'ln [R]', '1/[R]  (L/mol)'][ord], ys = Array.from({ length: 41 }, (_, i) => f(Math.max(C(i), 1e-3)));
      const A = axes(ctx, w, h, col, { x: [0, T], y: [Math.min(...ys) - 0.1, Math.max(...ys) + 0.1], xlabel: 'time t (min)', ylabel: lab, l: 46, t: t0 + 6, b: 40, fy: (v) => v.toFixed(1) });
      ctx.save(); A.clip(); line(ctx, ys.map((y, i) => [A.X(i), A.Y(y)]), col.s[0], 3); ctx.restore();
      text(ctx, ['slope = −k', 'slope = −k', 'slope = +k'][ord], A.R - 6, A.T + 12, { color: col.s[3], size: 12, weight: 700, align: 'right' });
    } else {
      const r = (c) => K() * c ** ord, A = axes(ctx, w, h, col, { x: [0, 2.1], y: [0, Math.max(0.1, r(2.1)) * 1.05], xlabel: '[R] (mol/L)', ylabel: 'rate (mol L⁻¹ min⁻¹)', l: 50, t: t0 + 6, b: 40, fy: (v) => v.toFixed(2), fx: (v) => v.toFixed(1) });
      ctx.save(); A.clip(); line(ctx, Array.from({ length: 43 }, (_, i) => [A.X(i * 0.05), A.Y(r(i * 0.05))]), col.s[0], 3); ctx.restore(); dot(ctx, A.X(c0), A.Y(r(c0)), 5.5, col.s[3], col.panel);
    }
  };
  go();
}
