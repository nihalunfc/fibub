// Class 12 Chemistry, Chemical Kinetics (step player): integrated rate equation of a first order reaction R -> P. rate = -d[R]/dt = k[R]. Separate: d[R]/[R] = -k dt.
// Integrate: ln[R] = -kt + I. At t = 0, [R] = [R]0, so I = ln[R]0. Hence ln[R] = -kt + ln[R]0, k = (2.303/t) log([R]0/[R]). At t = t1/2, [R] = [R]0/2: t1/2 = 0.693/k.
// The graph of ln[R] against t is a straight line of slope -k and intercept ln[R]0.
import { canvas, text, title, axes, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Start from the rate law', 'Separate the variables', 'Integrate both sides', 'Fix the constant using t = 0', 'The straight line ln[R] against t', 'Half-life: [R] = [R]₀/2'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Integration of the first order rate law with a straight line graph of ln R against time' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 12, L = 14;
    const EQ = ['−d[R]/dt = k[R]', 'd[R]/[R] = −k dt', '∫ d[R]/[R] = −k ∫ dt   →   ln[R] = −kt + I', 'at t = 0: ln[R]₀ = I', 'ln[R] = −kt + ln[R]₀', 'ln([R]₀/2) = −k t½ + ln[R]₀   →   t½ = 0.693/k'];
    const EX = ['The rate is proportional to the concentration of R.', 'Put all [R] terms on one side and all t terms on the other.', 'I is the constant of integration.', 'So I is the log of the starting concentration.', 'Compare y = mx + c: slope = −k, intercept = ln[R]₀', 'ln 2 = 0.693: half-life does not depend on [R]₀'];
    text(ctx, EQ[step], L, t0, { color: col.ink, size: 12.5, weight: 700 }); text(ctx, EX[step], L, t0 + 20, { color: col.muted, size: 11 });
    if (step === 3 || step === 4 || step === 5) text(ctx, 'k = (2.303/t) log([R]₀/[R])', L, t0 + 42, { color: col.s[3], size: 12, weight: 700 });
    const top = t0 + 64, lnC = (t) => Math.log(1) - 0.1 * t, A = axes(ctx, w, h, col, { x: [0, 20], y: [-2.2, 0.3], xlabel: 'time t (min)', ylabel: 'ln[R]', l: 44, t: top, b: 38, fy: (v) => v.toFixed(1) });
    if (step >= 4) { ctx.save(); A.clip(); line(ctx, [[A.X(0), A.Y(lnC(0))], [A.X(20), A.Y(lnC(20))]], col.s[0], 3); ctx.restore(); dot(ctx, A.X(0), A.Y(0), 5, col.s[2], col.panel); text(ctx, 'intercept ln[R]₀', A.X(1), A.Y(0.17), { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'slope = −k', A.X(10) + 6, A.Y(lnC(10)) - 12, { color: col.s[3], size: 11.5, weight: 700, halo: col.panel }); }
    if (step === 5) { const th = Math.LN2 / 0.1; ctx.strokeStyle = col.s[3]; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(-Math.LN2)); ctx.lineTo(A.X(th), A.Y(-Math.LN2)); ctx.lineTo(A.X(th), A.B); ctx.stroke(); ctx.setLineDash([]); dot(ctx, A.X(th), A.Y(-Math.LN2), 5, col.s[3], col.panel); text(ctx, 't½', A.X(th) + 6, A.B - 10, { color: col.s[3], size: 11, weight: 700 }); }
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
