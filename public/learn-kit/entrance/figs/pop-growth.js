// Organisms and populations: exponential (J-shaped) and logistic (S-shaped) growth. Set r, K and the starting
// number N₀; the exponential curve follows N = N₀e^(rt), the logistic curve slows as N nears the carrying capacity
// K: dN/dt = rN(K − N)/K. The readout gives N and dN/dt for both at the chosen time.
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let r = 0.3, K = 1000, N0 = 20, t = 12;
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 250, mark: 'bl', label: 'Exponential and logistic population growth with carrying capacity K' });
  const ctl = row(host);
  slider(ctl, { label: 'r (per year)', min: 0.05, max: 1, step: 0.05, value: r, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'K', min: 200, max: 2000, step: 100, value: K, fmt: (v) => `${v}`, oninput: (v) => { K = v; cv.redraw(); show(); } });
  const ctl2 = row(host);
  slider(ctl2, { label: 'N₀', min: 5, max: 100, step: 5, value: N0, fmt: (v) => `${v}`, oninput: (v) => { N0 = v; cv.redraw(); show(); } });
  slider(ctl2, { label: 'Time t', min: 0, max: 40, step: 1, value: t, fmt: (v) => `${v} y`, oninput: (v) => { t = v; cv.redraw(); show(); } });
  const out = readout(host);
  const ex = (x) => N0 * Math.exp(r * x);
  const lg = (x) => K / (1 + ((K - N0) / N0) * Math.exp(-r * x));
  const show = () => {
    const e = ex(t), l = lg(t);
    out.innerHTML = `At t = ${t} years: exponential N = <b>${fmt(e, 3)}</b> (dN/dt = rN = ${fmt(r * e, 3)} per year); logistic N = <b>${fmt(l, 3)}</b> (dN/dt = rN(K − N)/K = ${fmt((r * l * (K - l)) / K, 3)} per year). Logistic growth is fastest at N = K/2 = ${K / 2}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ymax = 2200;
    const { X, Y, T, R, clip } = axes(ctx, w, h, col, { x: [0, 40], y: [0, ymax], xlabel: 'Time (years)', ylabel: 'Population size N', l: 52 });
    ctx.save(); clip();
    const pe = [], pl = []; for (let x = 0; x <= 40; x += 0.2) { pe.push([X(x), Y(Math.min(ex(x), ymax * 2))]); pl.push([X(x), Y(lg(x))]); }
    line(ctx, pe, col.s[1], 2.5); line(ctx, pl, col.s[0], 2.5);
    ctx.strokeStyle = col.muted; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(0), Y(K)); ctx.lineTo(R, Y(K)); ctx.stroke(); ctx.setLineDash([]);
    if (ex(t) < ymax) dot(ctx, X(t), Y(ex(t)), 5, col.s[1], col.panel);
    dot(ctx, X(t), Y(lg(t)), 5, col.s[0], col.panel);
    ctx.restore();
    text(ctx, `K = ${K}`, R - 4, Y(K) - 9, { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'exponential (J)', X(1) + 2, T + 8, { color: col.s[1], size: 11, weight: 600 });
    text(ctx, 'logistic (S)', X(1) + 2, T + 24, { color: col.s[0], size: 11, weight: 600 });
  };
  cv.redraw(); show();
}
