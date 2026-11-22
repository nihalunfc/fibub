// 11.1 The flatness problem: |Ω − 1| = |Ω_k| / (a² E(a)²) grows with time, ∝ t in the radiation era and
// ∝ t^(2/3) in the matter era (it only turns down once dark energy takes over). Slide the value it had at one second
// after the start and see what it would be today. The measured value today is below about 0.002 (Planck 2018 with
// BAO: Ω_k = 0.001 ± 0.002). Planck 2018 densities; time from t = ∫ da/(aH); changes in the number of particle
// types are ignored, which is fine for a picture. Where |Ω − 1| would reach 1 the curve stops: from then on
// curvature rules, and the universe recollapses (Ω > 1) or empties out (Ω < 1) long before stars form.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { PLANCK18 as P, MPC, YEAR } from '../phys.js';

const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
const p10 = (v) => '10' + sup(Math.round(Math.log10(v)));

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 430, min: 320, label: 'How far the universe is from flat, against time, from the Planck time to today' });
  const H0 = (P.H0 * 1000) / MPC;
  const E2 = (a) => P.Or / a ** 4 + P.Om / a ** 3 + P.OL;
  // table of (t, shape) where shape(a) = 1/(a² E²); |Ω − 1|(a) = |Ω_k0| × shape(a)
  const pts = [];
  let la = -33, a = 10 ** la, t = (a * a) / (2 * H0 * Math.sqrt(P.Or));
  const dla = 0.01;
  while (la <= 0) {
    pts.push([t, 1 / (a * a * E2(a))]);
    for (let k = 0; k < 10; k++) { const am = 10 ** (la + dla / 20); t += (Math.LN10 * dla / 10) / (H0 * Math.sqrt(E2(am))); la += dla / 10; }
    a = 10 ** la;
  }
  const shapeAt = (tt) => { let i = pts.findIndex((q) => q[0] >= tt); if (i < 1) i = 1; const [t0, s0] = pts[i - 1], [t1, s1] = pts[i]; const f = Math.log(tt / t0) / Math.log(t1 / t0); return s0 * (s1 / s0) ** f; };
  const T0 = pts[pts.length - 1][0], S1 = shapeAt(1), S0 = pts[pts.length - 1][1];
  let v1 = 5e-19;
  const ctl = row(host);
  slider(ctl, { label: '|Ω − 1| at one second', min: 1e-22, max: 1e-12, value: v1, log: true, fmt: (v) => (v / 10 ** Math.floor(Math.log10(v) + 1e-9)).toFixed(1) + '×' + p10(10 ** Math.floor(Math.log10(v) + 1e-9)), oninput: (v) => { v1 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const marks = [[5.39e-44, 'Planck time'], [1, '1 s'], [380000 * YEAR, 'CMB'], [T0, 'today']];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'How far from flat? |Ω − 1| over time', col);
    const A = axes(ctx, w, h, col, { x: [1e-44, 1e18], y: [1e-62, 10], xlog: true, ylog: true, t: top + 12, l: 50,
      xt: w > 520 ? [1e-40, 1e-30, 1e-20, 1e-10, 1, 1e10] : [1e-40, 1e-20, 1], yt: [1e-60, 1e-45, 1e-30, 1e-15, 1],
      fx: p10, fy: (v) => (v === 1 ? '1' : p10(v)), xlabel: 'Time since the start (seconds)', ylabel: '|Ω − 1|' });
    ctx.save(); A.clip();
    // the measured band today
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.18; ctx.fillRect(A.X(1e14), A.Y(2e-3), A.R - A.X(1e14), A.B - A.Y(2e-3)); ctx.globalAlpha = 1;
    line(ctx, [[A.X(1e14), A.Y(2e-3)], [A.R, A.Y(2e-3)]], col.s[1], 2);
    line(ctx, [[A.L, A.Y(1)], [A.R, A.Y(1)]], col.muted, 1, [4, 4]);
    const k0 = v1 / S1, curve = [];
    let end = null;
    for (const [tt, s] of pts) { if (tt < 5e-44) continue; const v = k0 * s; if (v >= 1) { end = tt; curve.push([A.X(tt), A.Y(1)]); break; } curve.push([A.X(tt), A.Y(v)]); }
    line(ctx, curve, col.s[0], 2.5);
    ctx.restore();
    text(ctx, 'measured today: below 0.002 →', A.X(1e14) - 4, A.Y(2e-3), { color: col.s[1], size: 10.5, weight: 700, align: 'right', halo: col.panel });
    for (const [tt, lab] of marks) {
      const v = Math.min(1, (v1 / S1) * shapeAt(tt));
      if (end && tt > end) continue;
      dot(ctx, A.X(tt), A.Y(v), 4, col.s[0], col.panel);
      text(ctx, lab, A.X(tt) + (tt > 1e15 ? -6 : 6), A.Y(v) + (tt > 1e15 ? -12 : tt < 1e-40 ? -12 : 10), { color: col.ink, size: 10.5, align: tt > 1e15 ? 'right' : 'left', halo: col.panel });
    }
    if (end) { dot(ctx, A.X(end), A.Y(1), 6, col.s[3], col.panel); text(ctx, 'curvature takes over', A.X(end), A.Y(1) - 11, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); }
  };
  const show = () => {
    const today = (v1 / S1) * S0, k0 = v1 / S1;
    const tEnd = pts.find(([, s]) => k0 * s >= 1)?.[0];
    const when = (s) => s < 3.15e7 ? `${s.toPrecision(2)} s` : s < 3.15e13 ? `${(s / YEAR).toPrecision(2)} years` : `${(s / YEAR / 1e6).toPrecision(2)} million years`;
    out.innerHTML = tEnd
      ? `Too far from flat. |Ω − 1| would reach 1 about <b>${when(tEnd)}</b> after the start: the universe would have ${'recollapsed or thinned out to nothing'} long before galaxies formed. Make the starting value smaller.`
      : today > 2e-3 ? `Today |Ω − 1| would be <b>${today.toPrecision(2)}</b>: a universe, but more curved than we measure (below 0.002).`
      : `Today |Ω − 1| would be <b>${today.toPrecision(2)}</b>, as flat as we measure. At the Planck time it was ${p10((v1 / S1) * shapeAt(5.39e-44))}: tuned to about ${-Math.round(Math.log10((v1 / S1) * shapeAt(5.39e-44)))} decimal places.`;
  };
  cv.redraw(); show();
}
