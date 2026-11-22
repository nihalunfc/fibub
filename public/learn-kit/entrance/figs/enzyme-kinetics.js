// Biomolecules: enzyme velocity against substrate concentration (Michaelis-Menten, v = Vmax[S]/(Km + [S])). Change
// Km and add a competitive or non-competitive inhibitor: the curve without inhibitor stays for comparison. Competitive
// inhibitors raise the apparent Km and leave Vmax alone; non-competitive inhibitors lower Vmax and leave Km alone.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let Km = 4, inh = 'none', k = 2;
  const Vmax = 100, SMAX = 40;
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Enzyme velocity against substrate concentration with and without an inhibitor' });
  const ctl = row(host);
  slider(ctl, { label: 'Km', min: 1, max: 12, step: 0.5, value: Km, fmt: (v) => `${v} mM`, oninput: (v) => { Km = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Inhibitor effect', min: 1.5, max: 4, step: 0.5, value: k, fmt: (v) => `× ${v}`, oninput: (v) => { k = v; cv.redraw(); show(); } });
  const ctl2 = row(host);
  choice(ctl2, 'Inhibitor', [['none', 'None'], ['comp', 'Competitive'], ['non', 'Non-competitive']], inh, (v) => { inh = v; cv.redraw(); show(); });
  const out = readout(host);
  const app = () => (inh === 'comp' ? { V: Vmax, K: Km * k } : inh === 'non' ? { V: Vmax / k, K: Km } : { V: Vmax, K: Km });
  const show = () => {
    const a = app();
    out.innerHTML = `V<sub>max</sub> = ${fmt(a.V, 3)} units, K<sub>m</sub> = ${fmt(a.K, 3)} mM. At [S] = K<sub>m</sub> the enzyme runs at half its V<sub>max</sub> (${fmt(a.V / 2, 3)}). ` +
      (inh === 'comp' ? 'A competitive inhibitor looks like the substrate and blocks the active site; enough substrate wins it back, so V<sub>max</sub> is unchanged but K<sub>m</sub> rises.' : inh === 'non' ? 'A non-competitive inhibitor binds elsewhere and takes some enzyme out of action, so V<sub>max</sub> falls; K<sub>m</sub> stays the same.' : 'A low K<sub>m</sub> means the enzyme reaches half speed at low [S]: high affinity for its substrate.');
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, SMAX], y: [0, 110], xlabel: 'substrate [S] (mM)', ylabel: 'velocity v' });
    const curve = (V, K) => { const p = []; for (let s = 0; s <= SMAX; s += 0.25) p.push([X(s), Y((V * s) / (K + s))]); return p; };
    ctx.save(); clip();
    line(ctx, [[X(0), Y(Vmax)], [X(SMAX), Y(Vmax)]], col.muted, 1, [4, 4]);
    line(ctx, curve(Vmax, Km), inh === 'none' ? col.s[0] : col.muted, inh === 'none' ? 3 : 2, inh === 'none' ? undefined : [6, 4]);
    const a = app();
    if (inh !== 'none') line(ctx, curve(a.V, a.K), col.s[1], 3);
    line(ctx, [[X(a.K), Y(0)], [X(a.K), Y(a.V / 2)], [X(0), Y(a.V / 2)]], col.s[2], 1.5, [3, 3]);
    ctx.restore();
    text(ctx, 'Vmax', X(SMAX) - 4, Y(Vmax) - 8, { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'Km', X(a.K), Y(0) - 10, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    if (inh !== 'none') text(ctx, 'with inhibitor', X(SMAX * 0.7), Y((a.V * SMAX * 0.7) / (a.K + SMAX * 0.7)) + 14, { color: col.s[1], size: 11, weight: 600, align: 'center' });
  };
  cv.redraw(); show();
}
