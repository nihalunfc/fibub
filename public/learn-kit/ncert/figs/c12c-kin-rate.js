// Class 12 Chemistry, Chemical Kinetics: average and instantaneous rate. For a reactant R the rate is -d[R]/dt. Between two times the AVERAGE rate is the slope of the straight line (secant)
// joining the two points on the concentration-time curve; the INSTANTANEOUS rate is the slope of the tangent at one time. Shrink the time gap and the secant turns into the tangent.
// Curve: first-order decay [R] = 1.0 exp(-0.1 t) mol/L, t in minutes (illustration only).
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let t1 = 6, dt = 12;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 320, label: 'Concentration against time with a chord for the average rate and a tangent for the instantaneous rate' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'start time t (min)', min: 0, max: 25, step: 1, value: t1, fmt: (v) => v.toFixed(0), oninput: (v) => { t1 = v; go(); } });
  slider(ctl, { label: 'time gap Δt (min)', min: 0.5, max: 20, step: 0.5, value: dt, fmt: (v) => v.toFixed(1), oninput: (v) => { dt = v; go(); } });
  const C = (t) => Math.exp(-0.1 * t), kk = 0.1;
  const go = () => { const t2 = t1 + dt, avg = (C(t1) - C(t2)) / dt, ins = kk * C(t1); ro.textContent = `Average rate over ${t1}–${t2} min = −Δ[R]/Δt = (${C(t1).toFixed(3)} − ${C(t2).toFixed(3)}) / ${dt} = ${avg.toFixed(4)} mol L⁻¹ min⁻¹.  Instantaneous rate at ${t1} min (tangent) = ${ins.toFixed(4)} mol L⁻¹ min⁻¹.  Make Δt small: the two agree.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Rate = slope of the [R] against t curve', col), t2 = t1 + dt;
    const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 1.05], xlabel: 'time t (min)', ylabel: 'concentration [R] (mol/L)', l: 46, t: t0 + 6, b: 40, fy: (v) => v.toFixed(1) });
    const pts = Array.from({ length: 81 }, (_, i) => [A.X(i / 2), A.Y(C(i / 2))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3);
    const sl = -kk * C(t1); line(ctx, [[A.X(t1 - 8), A.Y(C(t1) - sl * 8)], [A.X(t1 + 12), A.Y(C(t1) + sl * 12)]], col.s[3], 2, [5, 3]);
    line(ctx, [[A.X(t1 - 6), A.Y(C(t1) + (C(t2) - C(t1)) / dt * -6)], [A.X(t2 + 4), A.Y(C(t2) + (C(t2) - C(t1)) / dt * 4)]], col.s[2], 2.5);
    ctx.restore();
    dot(ctx, A.X(t1), A.Y(C(t1)), 5.5, col.s[3], col.panel); dot(ctx, A.X(t2), A.Y(C(t2)), 5.5, col.s[2], col.panel);
    text(ctx, 'tangent: instantaneous', A.R - 4, A.T + 12, { color: col.s[3], size: 11, weight: 700, align: 'right' }); text(ctx, 'chord: average', A.R - 4, A.T + 28, { color: col.s[2], size: 11, weight: 700, align: 'right' });
  };
  go();
}
