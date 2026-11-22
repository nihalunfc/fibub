// 7.2 A least-squares straight line with its residuals and chi-square. Ten points are drawn from a true line
// y = 1 + 0.5x (optionally with a small curvature) plus Gaussian scatter of the chosen size; the fit uses the
// error bar you claim. The lower panel shows the residuals in units of that error bar. Watch chi-square/nu:
// about 1 when the claimed error matches the real scatter, large when it is too small or the model is wrong,
// small when the error bars are too generous. Curvature shows up as a smile in the residuals.
import { canvas, axes, line, dot, row, slider, choice, button, readout, title, text, fmt, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 460, min: 300, label: 'Data points with a least-squares line, error bars and a residual panel' });
  let scatter = 0.5, claimed = 0.5, curve = 0, seed = 3;
  const ctl = row(host);
  slider(ctl, { label: 'Real scatter σ', min: 0.1, max: 1.5, step: 0.05, value: scatter, fmt: (v) => v.toFixed(2), oninput: (v) => { scatter = v; redo(); } });
  slider(ctl, { label: 'Claimed error bar', min: 0.1, max: 1.5, step: 0.05, value: claimed, fmt: (v) => v.toFixed(2), oninput: (v) => { claimed = v; redo(); } });
  const ctl2 = row(host);
  choice(ctl2, 'True law', [[0, 'straight line'], [1, 'slightly curved']], curve, (v) => { curve = +v; redo(); });
  button(ctl2, 'New data', () => { seed++; redo(); });
  const out = readout(host);
  const X = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let Y = [], fit = {};
  const gauss = (r) => { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const make = () => {
    const r = rng(seed * 7919);
    const z = X.map(() => gauss(r));
    Y = X.map((x, i) => 1 + 0.5 * x + curve * 0.06 * (x - 4.5) ** 2 - curve * 0.5 + scatter * z[i]);
    const N = X.length, Sx = X.reduce((a, b) => a + b, 0), Sy = Y.reduce((a, b) => a + b, 0);
    const Sxx = X.reduce((a, b) => a + b * b, 0), Sxy = X.reduce((a, x, i) => a + x * Y[i], 0), D = N * Sxx - Sx * Sx;
    const b = (N * Sxy - Sx * Sy) / D, a = (Sy - b * Sx) / N;
    const res = X.map((x, i) => Y[i] - a - b * x), chi = res.reduce((s, e) => s + (e / claimed) ** 2, 0);
    fit = { a, b, res, chi, sb: claimed * Math.sqrt(N / D), sa: claimed * Math.sqrt(Sxx / D) };
  };
  const show = () => {
    const nu = X.length - 2, red = fit.chi / nu;
    const verdict = red > 1 + 3 * Math.sqrt(2 / nu) ? 'too big: the claimed errors are too small, or the model is wrong (look at the residual pattern)' : red < 1 - 2 * Math.sqrt(2 / nu) ? 'too small: the claimed error bars are larger than the real scatter' : 'consistent with a good fit';
    out.innerHTML = `Slope <b>${fmt(fit.b, 3)} ± ${fmt(fit.sb, 2)}</b>, intercept <b>${fmt(fit.a, 3)} ± ${fmt(fit.sa, 2)}</b> (true 0.5 and 1). χ² = <b>${fmt(fit.chi, 3)}</b> for ν = ${nu}, so χ²/ν = <b>${fmt(red, 3)}</b>: ${verdict}. Expected range for a good fit: about 1 ± ${fmt(Math.sqrt(2 / nu), 2)}.`;
  };
  const redo = () => { make(); cv.redraw(); show(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Least-squares line and residuals', col);
    const split = Math.round(h * 0.66);
    const a1 = axes(ctx, w, split, col, { x: [-0.5, 9.5], y: [-1, 8], xlabel: '', ylabel: 'y', t: top + 6, b: 18 });
    ctx.save(); a1.clip();
    line(ctx, [[a1.X(-0.5), a1.Y(1 + 0.5 * -0.5)], [a1.X(9.5), a1.Y(1 + 0.5 * 9.5)]], col.muted, 1, [4, 4]);
    line(ctx, [[a1.X(-0.5), a1.Y(fit.a + fit.b * -0.5)], [a1.X(9.5), a1.Y(fit.a + fit.b * 9.5)]], col.s[0], 2.4);
    X.forEach((x, i) => {
      line(ctx, [[a1.X(x), a1.Y(Y[i] - claimed)], [a1.X(x), a1.Y(Y[i] + claimed)]], col.s[1], 1.4);
      line(ctx, [[a1.X(x), a1.Y(Y[i])], [a1.X(x), a1.Y(fit.a + fit.b * x)]], col.s[3], 1, [2, 2]);
      dot(ctx, a1.X(x), a1.Y(Y[i]), 4, col.s[1]);
    });
    ctx.restore();
    text(ctx, 'fit', a1.R - 6, a1.Y(fit.a + fit.b * 9.5) + 14, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'true line (dashed)', a1.L + 6, a1.T + 10, { color: col.muted, size: 11, halo: col.panel });
    // residual panel, in units of the claimed error
    ctx.save(); ctx.translate(0, split);
    const a2 = axes(ctx, w, h - split, col, { x: [-0.5, 9.5], y: [-4, 4], yt: [-3, 0, 3], xlabel: 'x', ylabel: 'resid/σ', t: 8 });
    line(ctx, [[a2.L, a2.Y(0)], [a2.R, a2.Y(0)]], col.muted, 1);
    X.forEach((x, i) => { const z = Math.max(-4, Math.min(4, fit.res[i] / claimed)); line(ctx, [[a2.X(x), a2.Y(0)], [a2.X(x), a2.Y(z)]], col.s[3], 3); });
    ctx.restore();
  };
  redo();
}
