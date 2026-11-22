// Class 12 Biology, Biodiversity and Conservation: the species-area relationship found by Alexander von Humboldt in South American forests.
// Within a region, species richness rises with area along a rectangular hyperbola; on a log-log graph it is a straight line: log S = log C + Z log A, i.e. S = C x A^Z.
// Z (the slope) is about 0.1 to 0.2 for areas of the same size class, whatever the taxon or region; for very large areas (whole continents) the slope is steeper, 0.6 to 1.2.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout, rng } from '../../kit.js';

export default function (host) {
  let Z = 0.2, C = 20, A = 1000, logv = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Number of species against area, on a linear scale or a log-log scale, with a slider for the exponent Z' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'slope Z', min: 0.05, max: 1.2, step: 0.05, value: 0.2, fmt: (v) => v.toFixed(2), oninput: (v) => { Z = v; go(); } });
  slider(ctl, { label: 'area A (km²)', min: 10, max: 100000, value: 1000, log: true, fmt: (v) => Math.round(v).toLocaleString('en-IN'), oninput: (v) => { A = v; go(); } });
  choice(ctl, 'Scale', [[false, 'Linear'], [true, 'Log-log']], false, (v) => { logv = v; go(); });
  const S = (a) => C * Math.pow(a, Z);
  const go = () => { ro.textContent = `S = C × A^Z = ${C} × ${Math.round(A).toLocaleString('en-IN')}^${Z.toFixed(2)} = ${Math.round(S(A)).toLocaleString('en-IN')} species. Ten times more area gives ${Math.pow(10, Z).toFixed(2)} times more species; losing 90 % of the area keeps about ${(Math.pow(0.1, Z) * 100).toFixed(0)} % of the species.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Species-area curve', col);
    const a = logv ? axes(ctx, w, h, col, { x: [10, 100000], y: [10, 100000], xlog: true, ylog: true, xlabel: 'area (km², log)', ylabel: 'species S (log)', l: 52, t: 36, fx: (v) => (v >= 1000 ? v / 1000 + 'k' : v), fy: (v) => (v >= 1000 ? v / 1000 + 'k' : v) }) : axes(ctx, w, h, col, { x: [0, 100000], y: [0, Math.max(300, S(100000) * 1.05)], xlabel: 'area (km²)', ylabel: 'species S', l: 52, t: 36, fx: (v) => (v >= 1000 ? v / 1000 + 'k' : v) });
    const P = []; for (let k = 0; k <= 100; k++) { const x = logv ? Math.pow(10, 1 + k * 0.04) : (k / 100) * 100000 + 1; P.push([a.X(Math.max(10, x)), a.Y(S(Math.max(10, x)))]); }
    ctx.save(); a.clip(); line(ctx, P, col.s[0], 2.5); const r = rng(4); for (let k = 0; k < 14; k++) { const x = Math.pow(10, 1 + r() * 4), y = S(x) * (0.8 + 0.4 * r()); dot(ctx, a.X(x), a.Y(y), 3, col.muted); } ctx.restore();
    line(ctx, [[a.X(A), a.B], [a.X(A), a.Y(S(A))], [a.L, a.Y(S(A))]], col.s[2], 1.5); dot(ctx, a.X(A), a.Y(S(A)), 5, col.s[2], col.panel);
    text(ctx, logv ? 'straight line, slope = Z' : 'curve rises, then flattens', a.R - 4, a.T + 10, { color: col.muted, size: 10.5, weight: 700, align: 'right' });
  };
  go();
}
