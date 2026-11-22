// 5.2 The two-level system. Upper-level occupation, energy, entropy and heat capacity (Schottky bump) against kT/ε,
// with a choice of degeneracy for the upper level. The marker follows the temperature slider.
import { canvas, axes, line, row, slider, choice, readout, title, text, dot } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Occupation, entropy and heat capacity of a two-level system against temperature' });
  let g = 1, t = 0.5;
  const ctl = row(host);
  choice(ctl, 'Upper level degeneracy', [[1, 'g = 1'], [2, 'g = 2'], [3, 'g = 3']], g, (v) => { g = +v; cv.redraw(); show(); });
  slider(ctl, { label: 'Temperature kT/ε', min: 0.05, max: 3, step: 0.01, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; cv.redraw(); show(); } });
  const out = readout(host);
  const f = (tt) => { const x = 1 / tt, e = g * Math.exp(-x), Z = 1 + e, P = e / Z; return { P, S: Math.log(Z) + x * P, Cv: x * x * P * (1 - P) }; };
  const show = () => {
    const s = f(t);
    out.innerHTML = `kT = ${t.toFixed(2)} ε: upper-level share <b>${s.P.toFixed(3)}</b> (limit ${(g / (1 + g)).toFixed(3)}), entropy <b>${s.S.toFixed(3)} k</b> (limit ln ${1 + g} = ${Math.log(1 + g).toFixed(3)} k), heat capacity <b>${s.Cv.toFixed(3)} k</b>. The heat capacity peaks where kT is a fraction of ε and dies away on both sides: at low T the gap freezes the system, at high T it is already as disordered as it can be.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 3], y: [0, 1.2], xlabel: 'temperature kT/ε', ylabel: 'value (k for S and C)', t: 34 });
    title(ctx, 'Two-level system: occupation, entropy, heat capacity', col);
    ctx.save(); ax.clip();
    const names = [['P', 'upper-level share', 0], ['S', 'entropy S/k', 2], ['Cv', 'heat capacity C/k', 3]];
    for (const [k, , ci] of names) {
      const pts = []; for (let i = 1; i <= 300; i++) { const tt = (i / 300) * 3; pts.push([ax.X(tt), ax.Y(f(tt)[k])]); }
      line(ctx, pts, col.s[ci], 2.3);
    }
    line(ctx, [[ax.X(t), ax.Y(0)], [ax.X(t), ax.Y(1.2)]], col.muted, 1, [3, 3]);
    const s = f(t); for (const [k, , ci] of names) dot(ctx, ax.X(t), ax.Y(s[k]), 4, col.s[ci]);
    ctx.restore();
    names.forEach(([, lab, ci], i) => text(ctx, lab, ax.R - 6, ax.T + 14 + i * 15, { color: col.s[ci], size: 11, align: 'right', halo: col.panel }));
  };
  cv.redraw(); show();
}
