// Class 12 Current Electricity (step player): drift velocity from the sawtooth picture. A conduction electron moves in straight stretches between collisions
// (random directions, so the average velocity is zero without a field). With a field E it accelerates at a = eE/m between collisions: velocity grows linearly,
// then drops to a new random value at each collision. Averaged over the relaxation time tau, the random starting velocities cancel and the average is
// v_d = a tau = eE tau / m. Then I = n A e v_d. Units are arbitrary (tau about 1).
import { canvas, text, title, axes, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Velocity of one electron against time, rising between collisions and jumping at each one' });
  const TITLES = ['No field: random velocities, average zero', 'Switch the field on: constant push', 'Between collisions v = u + a t', 'Average over many collisions', 'Drift velocity v_d = eEτ/m', 'Current: I = n A e v_d'];
  const gaps = [0.9, 1.2, 0.8, 1.1, 1.0, 1.3, 0.9, 1.0, 0.8], u = [0.5, -0.8, 0.3, 0.9, -0.4, -0.9, 0.7, -0.2, 0.6, 0.1];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col);
    const A = axes(ctx, w, h, col, { x: [0, 9], y: [-1.5, 2.5], xt: [], yt: [0], xlabel: 'time (collisions happen at the jumps)', ylabel: 'velocity along the wire', l: 40, t: top + 10, b: 40 });
    const a = step === 0 ? 0 : 0.9; let t = 0, vsum = 0;
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i < gaps.length; i++) { const t1 = t + gaps[i]; pts.push([A.X(t), A.Y(u[i])], [A.X(t1), A.Y(u[i] + a * gaps[i])]); vsum += (u[i] + (u[i] + a * gaps[i])) / 2 * gaps[i]; if (i < gaps.length - 1) pts.push([A.X(t1), A.Y(u[i + 1])]); t = t1; }
    const mean = vsum / t;
    for (let i = 0; i < pts.length - 1; i++) line(ctx, [pts[i], pts[i + 1]], i % 3 === 2 ? col.line : step >= 1 ? col.s[0] : col.s[1], i % 3 === 2 ? 1 : 3, i % 3 === 2 ? [3, 3] : undefined);
    if (step === 2) { const s0 = A.X(gaps[0] + gaps[1]), s1 = A.X(gaps[0] + gaps[1] + gaps[2]); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.2; ctx.fillRect(s0, A.T, s1 - s0, A.B - A.T); ctx.globalAlpha = 1; }
    ctx.restore();
    if (step === 0) text(ctx, 'average = 0', A.R - 6, A.Y(0) - 10, { color: col.muted, size: 12, weight: 700, align: 'right' });
    if (step === 2) { text(ctx, 'start u (random)', A.X(2.1) + 2, A.Y(0.8) - 8, { color: col.s[3], size: 11, weight: 700 }); text(ctx, 'slope = a = eE/m', A.X(4.2), A.Y(-1.2), { color: col.s[3], size: 11, weight: 700 }); }
    if (step >= 3) { line(ctx, [[A.L, A.Y(mean)], [A.R, A.Y(mean)]], col.s[2], 2.5, [6, 4]); text(ctx, 'average velocity (drift)', A.R - 4, A.Y(mean) - 10, { color: col.s[2], size: 12, weight: 700, align: 'right' }); }
    if (step === 3) text(ctx, 'the random u average out (their mean ≈ 0)', (A.L + A.R) / 2, A.Y(-1.25), { color: col.muted, size: 11, align: 'center' });
    if (step >= 4) text(ctx, 'v_d = eEτ/m  (τ = mean time since a collision)', (A.L + A.R) / 2, A.Y(2.2), { color: col.s[2], size: 13, weight: 700, align: 'center' });
    if (step === 5) text(ctx, 'I = n A e v_d  (n carriers per m³)', (A.L + A.R) / 2, A.Y(1.75), { color: col.s[7], size: 12.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
