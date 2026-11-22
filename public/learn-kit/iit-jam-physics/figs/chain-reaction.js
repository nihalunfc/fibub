// 6.6 Fission chain reaction. Set the multiplication factor k and the generation time (prompt neutrons only, or
// with delayed neutrons). The plot shows the neutron population over time on a log scale: it dies away for k < 1,
// holds steady for k = 1 and grows for k > 1, and the readout gives the doubling (or halving) time.
import { canvas, axes, line, row, slider, choice, readout, fmt, title, text } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.58, max: 380, min: 250, label: 'Neutron population against time on a log scale for a chosen multiplication factor' });
  let k = 1.002, gen = 0.1;
  const ctl = row(host);
  slider(ctl, { label: 'Multiplication factor k', min: 0.990, max: 1.010, step: 0.0005, value: k, fmt: (v) => v.toFixed(4), oninput: (v) => { k = v; cv.redraw(); show(); } });
  choice(ctl, 'Generation time', [[0.1, 'With delayed neutrons (0.1 s)'], [1e-4, 'Prompt only (0.1 ms)']], gen, (v) => { gen = v; cv.redraw(); show(); });
  const out = readout(host);
  const span = () => 60 * gen / 0.1;   // seconds shown: 60 s with delayed neutrons, 60 ms prompt only
  const show = () => {
    const per = Math.log(k) / gen;   // growth rate per second
    let s = `k = <b>${k.toFixed(4)}</b>, ${gen === 0.1 ? 'generation time 0.1 s (delayed neutrons included)' : 'generation time 0.1 ms (prompt neutrons only)'}. `;
    if (Math.abs(k - 1) < 1e-6) s += '<b>Critical</b>: every generation is the same size, so the power is steady.';
    else s += `<b>${k > 1 ? 'Supercritical' : 'Subcritical'}</b>: the population ${k > 1 ? 'doubles' : 'halves'} every <b>${fmt(Math.abs(Math.log(2) / per), 3)} s</b> (that is ln 2 / ln k = ${fmt(Math.abs(Math.log(2) / Math.log(k)), 4)} generations).`;
    if (gen < 0.01 && k > 1) s += ' Far too fast for any control rod: this is why reactors are run so that only the delayed neutrons can tip them over k = 1.';
    out.innerHTML = s;
  };
  cv.draw = (ctx, w, h, col) => {
    const tmax = span(), per = Math.log(k) / gen;
    const ax = axes(ctx, w, h, col, { x: [0, tmax], y: [0.01, 100], ylog: true, xlabel: gen === 0.1 ? 'time (s)' : 'time (ms)', ylabel: 'neutrons (start = 1)', t: 34, fx: (v) => fmt(gen === 0.1 ? v : v * 1000, 3) });
    title(ctx, 'Neutron population in a chain reaction', col);
    ctx.save(); ax.clip();
    line(ctx, [[ax.X(0), ax.Y(1)], [ax.X(tmax), ax.Y(1)]], col.muted, 1, [4, 4]);
    const pts = []; for (let i = 0; i <= 300; i++) { const t = tmax * i / 300; pts.push([ax.X(t), ax.Y(Math.min(1e3, Math.max(1e-3, Math.exp(per * t))))]); }
    line(ctx, pts, k > 1 ? col.s[5] || col.s[0] : k < 1 ? col.s[2] : col.s[0], 2.8);
    text(ctx, 'k = 1: steady', ax.R - 6, ax.Y(1) - 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    ctx.restore();
  };
  cv.redraw(); show();
}
