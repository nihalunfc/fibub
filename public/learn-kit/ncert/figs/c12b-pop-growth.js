// Class 12 Biology, Organisms and Populations: exponential and logistic (Verhulst-Pearl) population growth.
// Exponential: dN/dt = rN, N = N0 e^(rt), a J-shaped curve when resources are unlimited. Logistic: dN/dt = rN (K - N)/K, an S-shaped curve that levels at the
// carrying capacity K. The growth rate is largest at N = K/2.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let r = 0.25, K = 500, N0 = 10, t = 15;
  const cv = canvas(host, { aspect: 0.78, max: 460, min: 290, label: 'Population size against time: a J-shaped exponential curve and an S-shaped logistic curve levelling at the carrying capacity K' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'r (growth rate)', min: 0.05, max: 0.6, step: 0.01, value: 0.25, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; go(); } });
  slider(ctl, { label: 'K (carrying capacity)', min: 100, max: 1000, step: 50, value: 500, fmt: (v) => v.toFixed(0), oninput: (v) => { K = v; go(); } });
  slider(ctl, { label: 'start N₀', min: 1, max: 100, step: 1, value: 10, fmt: (v) => v.toFixed(0), oninput: (v) => { N0 = Math.min(v, K - 1); go(); } });
  slider(ctl, { label: 'time t', min: 0, max: 40, step: 0.5, value: 15, fmt: (v) => v.toFixed(1), oninput: (v) => { t = v; go(); } });
  const ex = (x) => N0 * Math.exp(r * x), lg = (x) => K / (1 + ((K - N0) / N0) * Math.exp(-r * x));
  const go = () => { const n = lg(t), rate = r * n * (K - n) / K; ro.textContent = `At t = ${t}: exponential N = ${Math.round(ex(t)).toLocaleString('en-IN')}; logistic N = ${Math.round(n)}, growing by ${rate.toFixed(1)} per unit time (dN/dt = rN(K−N)/K). The most rapid growth, ${(r * K / 4).toFixed(1)}, is at N = K/2 = ${K / 2}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Exponential (J) and logistic (S) growth', col);
    const ymax = K * 1.25, a = axes(ctx, w, h, col, { x: [0, 40], y: [0, ymax], xlabel: 'time', ylabel: 'population size N', l: 50, t: 36, xt: [0, 10, 20, 30, 40] });
    ctx.save(); a.clip();
    const E = [], L = []; for (let x = 0; x <= 40; x += 0.5) { E.push([a.X(x), a.Y(Math.min(ex(x), ymax * 2))]); L.push([a.X(x), a.Y(lg(x))]); }
    ctx.setLineDash([5, 4]); line(ctx, [[a.L, a.Y(K)], [a.R, a.Y(K)]], col.muted, 1.2); ctx.setLineDash([]);
    line(ctx, E, col.s[2], 2.5); line(ctx, L, col.s[0], 2.5); ctx.restore();
    text(ctx, 'K', a.L + 6, a.Y(K) - 8, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'exponential', a.X(26), a.T + 12, { color: col.s[2], size: 11, weight: 700 }); text(ctx, 'logistic', a.R - 4, a.Y(K) + 14, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    line(ctx, [[a.X(t), a.T], [a.X(t), a.B]], col.line, 1.2); if (ex(t) < ymax) dot(ctx, a.X(t), a.Y(ex(t)), 5, col.s[2], col.panel); dot(ctx, a.X(t), a.Y(lg(t)), 5, col.s[0], col.panel);
  };
  go();
}
