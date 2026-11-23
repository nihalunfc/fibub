// Class 11 Motion in a Straight Line: average velocity to instantaneous velocity. For a position x(t) = 0.4 t^2 + 0.5 t the chord between t and t + dt has slope
// (x2 - x1)/dt = average velocity. Shrink dt towards zero and the chord turns into the tangent; its slope is the instantaneous velocity v = dx/dt = 0.8 t + 0.5.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let t0 = 3, dt = 3;
  const x = (t) => 0.4 * t * t + 0.5 * t, v = (t) => 0.8 * t + 0.5;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A position-time curve with a chord that shrinks into a tangent' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Start time t (s)', min: 0.5, max: 6, step: 0.1, value: t0, fmt: (q) => q.toFixed(1), oninput: (q) => { t0 = q; go(); } });
  slider(ctl, { label: 'Interval Δt (s)', min: 0.02, max: 3.5, value: dt, log: true, fmt: (q) => q.toFixed(2), oninput: (q) => { dt = q; go(); } });
  const go = () => { const t1 = Math.min(t0 + dt, 9.5), va = (x(t1) - x(t0)) / (t1 - t0); out.innerHTML = `Δx = ${(x(t1) - x(t0)).toFixed(2)} m in Δt = ${(t1 - t0).toFixed(2)} s: average velocity <b>${va.toFixed(3)} m/s</b>. Instantaneous velocity at t = ${t0.toFixed(1)} s: <b>${v(t0).toFixed(3)} m/s</b>. The smaller Δt is, the closer the two numbers get.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Chord → tangent: average → instantaneous', col);
    const A = axes(ctx, w, h, col, { x: [0, 8], y: [0, 32], xlabel: 'time t (s)', ylabel: 'position x (m)', l: 46, t: 30 });
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i <= 80; i++) pts.push([A.X(i / 10), A.Y(x(i / 10))]); line(ctx, pts, col.ink, 2.5);
    const t1 = Math.min(t0 + dt, 9.5), s = (x(t1) - x(t0)) / (t1 - t0), tg = v(t0);
    line(ctx, [[A.X(0), A.Y(x(t0) - tg * t0)], [A.X(8), A.Y(x(t0) + tg * (8 - t0))]], col.s[2], 2, [6, 4]);
    line(ctx, [[A.X(0), A.Y(x(t0) - s * t0)], [A.X(8), A.Y(x(t0) + s * (8 - t0))]], col.s[0], 2.5);
    ctx.restore();
    line(ctx, [[A.X(t0), A.Y(x(t0))], [A.X(t1), A.Y(x(t0))], [A.X(t1), A.Y(x(t1))]], col.s[3], 1.5);
    dot(ctx, A.X(t0), A.Y(x(t0)), 5, col.s[3], col.panel); dot(ctx, A.X(t1), A.Y(x(t1)), 5, col.s[3], col.panel);
    text(ctx, 'chord: average v', A.L + 8, A.T + 12, { size: 11, weight: 700, color: col.s[0] }); text(ctx, 'tangent: v at t', A.L + 8, A.T + 28, { size: 11, weight: 700, color: col.s[2] });
  };
  go();
}
