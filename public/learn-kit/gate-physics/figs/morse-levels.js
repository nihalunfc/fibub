// 6.5 Morse potential and its vibrational levels. V(x) = De (1 - e^{-x})^2 with x = a(r - re), De = we^2/(4 we xe).
// Levels G(v) = we(v+1/2) - we xe (v+1/2)^2 are drawn between their classical turning points; the dashed parabola
// De x^2 and its equally spaced levels show the harmonic approximation. Pick a molecule or change the anharmonicity.
import { canvas, axes, line, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const EV = 1.239842e-4;
const MOLS = { HCl: [2990.9, 52.82], CO: [2169.8, 13.29], H2: [4401.2, 121.34], I2: [214.5, 0.614] };

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Morse potential with anharmonic vibrational levels compared with the harmonic parabola' });
  let mol = 'HCl', we = MOLS.HCl[0], wx = MOLS.HCl[1], harm = 1;
  const ctl = row(host);
  const out = readout(host);
  const De = () => we * we / (4 * wx);
  const G = (v) => we * (v + 0.5) - wx * (v + 0.5) ** 2;
  const vmax = () => Math.floor(we / (2 * wx) - 0.5);
  const show = () => {
    const d = De(), d0 = d - G(0);
    out.innerHTML = `ω̃e = ${fmt(we, 4)}, ω̃e·xe = ${fmt(wx, 3)} cm⁻¹. Well depth De = <b>${fmt(d, 4)} cm⁻¹ = ${fmt(d * EV, 3)} eV</b>; D0 = De − G(0) = ${fmt(d0 * EV, 3)} eV. Fundamental ${fmt(G(1) - G(0), 5)} cm⁻¹, first overtone ${fmt(G(2) - G(0), 5)} cm⁻¹ (not quite twice). Bound levels v = 0 to <b>${vmax()}</b>.`;
  };
  const redo = () => { cv.redraw(); show(); };
  let xs;
  choice(ctl, 'Molecule', Object.keys(MOLS).map((k) => [k, k.replace('2', '₂')]), mol, (v) => { mol = v; [we, wx] = MOLS[v]; xs.set(wx / we); redo(); });
  xs = slider(ctl, { label: 'Anharmonicity xe', min: 0.002, max: 0.06, value: wx / we, log: true, fmt: (v) => fmt(v, 3), oninput: (v) => { wx = v * we; redo(); } });
  choice(ctl, 'Harmonic', [[1, 'show'], [0, 'hide']], harm, (v) => { harm = v; redo(); });

  cv.draw = (ctx, w, h, col) => {
    const d = De();
    title(ctx, 'Morse potential and levels', col);
    const a = axes(ctx, w, h, col, { x: [-1.4, 5.5], y: [0, d * 1.25], xlabel: 'a(r − re)', ylabel: 'energy (cm⁻¹)', t: 34 });
    ctx.save(); a.clip();
    const V = (x) => d * (1 - Math.exp(-x)) ** 2, pts = [], hp = [];
    for (let i = 0; i <= 300; i++) { const x = -1.4 + (6.9 * i) / 300; pts.push([a.X(x), a.Y(V(x))]); hp.push([a.X(x), a.Y(d * x * x)]); }
    if (harm) line(ctx, hp, col.muted, 1.3, [5, 4]);
    line(ctx, pts, col.ink, 2.2);
    line(ctx, [[a.L, a.Y(d)], [a.R, a.Y(d)]], col.muted, 1, [2, 4]);
    const vm = vmax(), step = Math.max(1, Math.ceil((vm + 1) / 40));
    for (let v = 0; v <= vm; v += step) {
      const E = G(v), s = Math.sqrt(Math.min(1, E / d));
      const x1 = -Math.log(1 + s), x2 = s < 1 ? -Math.log(1 - s) : 5.5;
      line(ctx, [[a.X(x1), a.Y(E)], [a.X(x2), a.Y(E)]], col.s[0], 1.6);
    }
    if (harm) for (let v = 0; we * (v + 0.5) < d * 1.25 && v < 60; v += step) {
      const E = we * (v + 0.5), xr = Math.sqrt(E / d);
      line(ctx, [[a.X(-xr), a.Y(E)], [a.X(-xr) + 10, a.Y(E)]], col.s[1], 1.2);
    }
    ctx.restore();
    text(ctx, 'De', a.R - 6, a.Y(d) - 8, { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'Morse levels', a.R - 6, a.T + 30, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    if (harm) text(ctx, 'harmonic (ticks)', a.R - 6, a.T + 44, { color: col.s[1], size: 11, weight: 700, align: 'right' });
  };
  redo();
}
