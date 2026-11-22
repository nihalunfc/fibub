// Class 12 Biology, Biodiversity and Conservation: David Tilman's long-running field experiments with plots planted with different numbers of grassland species (illustrative curves built to
// show the pattern he found): total plant biomass rises with the number of species (levelling off), and the year-to-year variation in biomass falls, so diverse communities are more productive and more stable.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 8;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Plant biomass and its year-to-year variation against the number of species in a plot' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'species in plot', min: 1, max: 32, step: 1, value: 8, fmt: (v) => v.toFixed(0), oninput: (v) => { n = v; go(); } });
  const bio = (s) => 100 * Math.log(1 + s) / Math.log(33), vr = (s) => 60 / Math.sqrt(s) + 8;
  const go = () => { ro.textContent = `${n} species: biomass index ${bio(n).toFixed(0)}, year-to-year variation ${vr(n).toFixed(0)} %. More species give more biomass (with diminishing returns) and a steadier harvest: a diverse plot copes better with drought or a pest year.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'More species, more and steadier biomass', col);
    const a = axes(ctx, w, h, col, { x: [0, 32], y: [0, 110], xlabel: 'number of species in the plot', ylabel: 'index / percent', l: 46, t: 36, xt: [0, 8, 16, 24, 32] });
    const B = [], V = []; for (let s = 1; s <= 32; s += 0.5) { B.push([a.X(s), a.Y(bio(s))]); V.push([a.X(s), a.Y(vr(s))]); }
    line(ctx, B, col.good, 2.5); line(ctx, V, col.bad, 2.5);
    text(ctx, 'total biomass', a.X(20), a.Y(bio(20)) - 10, { color: col.good, size: 11, weight: 700 }); text(ctx, 'year-to-year variation (%)', a.X(11), a.Y(vr(11)) - 12, { color: col.bad, size: 11, weight: 700 });
    line(ctx, [[a.X(n), a.T], [a.X(n), a.B]], col.line, 1.2); dot(ctx, a.X(n), a.Y(bio(n)), 5, col.good, col.panel); dot(ctx, a.X(n), a.Y(vr(n)), 5, col.bad, col.panel);
  };
  go();
}
