// Biodiversity: Alexander von Humboldt's species-area relationship, S = C·A^Z, which is a straight line of slope Z
// on log-log axes (log S = log C + Z log A). Change Z and C, switch between ordinary and log axes, and read the
// number of species for an area. Z is about 0.1 to 0.2 for regions within a continent and 0.6 to 1.2 for whole
// continents.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let Z = 0.15, C = 20, A = 1000, log = 'log';
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 250, mark: 'tl', label: 'Species richness against area, on ordinary or log axes' });
  const ctl = row(host);
  slider(ctl, { label: 'Z (slope)', min: 0.05, max: 1.2, step: 0.05, value: Z, fmt: (v) => v.toFixed(2), oninput: (v) => { Z = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'C', min: 2, max: 60, step: 1, value: C, fmt: (v) => `${v}`, oninput: (v) => { C = v; cv.redraw(); show(); } });
  const ctl2 = row(host);
  slider(ctl2, { label: 'Area', min: 1, max: 1e6, value: A, log: true, fmt: (v) => `${fmt(v, 2)} km²`, oninput: (v) => { A = v; cv.redraw(); show(); } });
  choice(ctl2, 'Axes', [['log', 'log-log'], ['lin', 'ordinary']], log, (v) => { log = v; cv.redraw(); });
  const out = readout(host);
  const S = (a) => C * Math.pow(a, Z);
  const show = () => {
    out.innerHTML = `S = ${C} × (${fmt(A, 3)})<sup>${Z.toFixed(2)}</sup> ≈ <b>${fmt(S(A), 3)} species</b>. Doubling the area multiplies species by 2<sup>${Z.toFixed(2)}</sup> = ${fmt(Math.pow(2, Z), 3)}. ${Z <= 0.25 ? 'This Z is typical of areas within one continent.' : Z >= 0.6 ? 'This Z is typical of very large areas such as whole continents.' : 'Between the usual ranges.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const L = log === 'log', smax = S(1e6) * 1.1;
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [1, 1e6], y: L ? [1, Math.max(10, 10 ** Math.ceil(Math.log10(smax)))] : [0, smax], xlog: L, ylog: L, xt: L ? undefined : [0, 250000, 500000, 750000, 1e6], xlabel: L ? 'Area, A (km², log scale)' : 'Area, A (km²)', ylabel: L ? 'Species, S (log)' : 'Species, S', l: 52, t: 30, fx: (v) => fmt(v, 2) });
    ctx.save(); clip();
    const pts = []; for (let e = 0; e <= 6.0001; e += 0.02) { const a = L ? 10 ** e : (e / 6) * 1e6 || 1; pts.push([X(a), Y(S(a))]); }
    line(ctx, pts, col.s[0], 2.5);
    dot(ctx, X(A), Y(S(A)), 6, col.s[0], col.panel);
    ctx.restore();
    text(ctx, L ? `log S = log ${C} + ${Z.toFixed(2)} log A` : `S = ${C}·A^${Z.toFixed(2)}`, w - 12, h - 56, { color: col.s[0], size: 12, weight: 600, align: 'right' });
  };
  cv.redraw(); show();
}
