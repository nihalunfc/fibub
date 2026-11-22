// 5.4 The three distributions. Mean occupation against (ε − μ)/kT for Fermi-Dirac, Maxwell-Boltzmann and Bose-Einstein,
// on a linear or log scale. Move the marker to compare the three at one energy: they merge once ε − μ is a few kT.
import { canvas, axes, line, row, slider, choice, readout, title, text, dot } from '../../kit.js';

const occ = { FD: (x) => 1 / (Math.exp(x) + 1), MB: (x) => Math.exp(-x), BE: (x) => 1 / (Math.exp(x) - 1) };

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Fermi-Dirac, Maxwell-Boltzmann and Bose-Einstein mean occupations' });
  let x0 = 1, scale = 'lin';
  const ctl = row(host);
  slider(ctl, { label: '(ε − μ)/kT', min: -3, max: 6, step: 0.05, value: x0, fmt: (v) => v.toFixed(2), oninput: (v) => { x0 = v; cv.redraw(); show(); } });
  choice(ctl, 'Scale', [['lin', 'Linear'], ['log', 'Log']], scale, (v) => { scale = v; cv.redraw(); });
  const out = readout(host);
  const show = () => {
    const f = occ.FD(x0), m = occ.MB(x0), b = x0 > 0 ? occ.BE(x0) : null;
    out.innerHTML = `At (ε − μ)/kT = ${x0.toFixed(2)}: Fermi-Dirac <b>${f.toFixed(4)}</b>, Maxwell-Boltzmann <b>${m.toFixed(4)}</b>, Bose-Einstein <b>${b === null ? 'not allowed (needs ε > μ)' : b.toFixed(4)}</b>. ${x0 > 3 ? 'All three nearly agree: this is the classical limit.' : x0 < 0 ? 'Only fermions can have states below μ; their occupation tends to 1 (Pauli).' : 'The ±1 matters here: bosons crowd in, fermions are held back.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const lg = scale === 'log';
    const ax = axes(ctx, w, h, col, { x: [-3, 6], y: lg ? [1e-3, 10] : [0, 2.5], ylog: lg, xlabel: '(ε − μ)/kT', ylabel: 'mean occupation ⟨n⟩', t: 34 });
    title(ctx, 'Mean occupation of a single-particle state', col);
    ctx.save(); ax.clip();
    const curve = (fn, ci, a) => { const pts = []; for (let i = 0; i <= 400; i++) { const x = -3 + (9 * i) / 400; if (x <= a) continue; const y = fn(x); if (!(y > 0)) continue; pts.push([ax.X(x), ax.Y(Math.min(y, lg ? 10 : 2.6))]); } line(ctx, pts, col.s[ci], 2.4); };
    curve(occ.FD, 0, -10); curve(occ.MB, 2, -10); curve(occ.BE, 3, 0.01);
    line(ctx, [[ax.X(x0), ax.T], [ax.X(x0), ax.B]], col.muted, 1, [3, 3]);
    [['FD', 0], ['MB', 2], ['BE', 3]].forEach(([k, ci]) => { if (k === 'BE' && x0 <= 0) return; const y = occ[k](x0); if (y > 0) dot(ctx, ax.X(x0), ax.Y(Math.min(y, lg ? 10 : 2.6)), 4, col.s[ci]); });
    ctx.restore();
    [['Bose-Einstein', 3], ['Maxwell-Boltzmann', 2], ['Fermi-Dirac', 0]].forEach(([lab, ci], i) => text(ctx, lab, ax.R - 6, ax.T + 14 + i * 15, { color: col.s[ci], size: 11, align: 'right', halo: col.panel }));
  };
  cv.redraw(); show();
}
