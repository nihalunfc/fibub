// Class 12 Nuclei: potential energy of two nucleons against their separation. Strongly attractive over a short range (minimum about -40 MeV near 0.8 fm), repulsive closer than that,
// and essentially zero beyond about 2.5 fm. The Coulomb repulsion of two protons (1.44 MeV fm / r) is small by comparison but reaches much further. Force is minus the slope.
// A Yukawa-style well (illustrative, not a fit) is used for the nuclear part.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout, arrow } from '../../kit.js';

export default function (host) {
  let r = 1.6, pp = true;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Potential energy of two nucleons against separation, with a short-range attractive well' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'separation r (fm)', min: 0.4, max: 6, step: 0.05, value: r, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; go(); } });
  choice(ctl, 'Show', [[true, 'Nuclear + Coulomb (p-p)'], [false, 'Nuclear only']], pp, (v) => { pp = v; go(); });
  const Vn = (x) => (x < 0.8 ? -40 + 900 * (0.8 - x) ** 2 : -40 * (0.8 / x) * Math.exp(-(x - 0.8) / 0.9));
  const Vc = (x) => 1.44 / x;
  const V = (x) => Vn(x) + (pp ? Vc(x) : 0);
  const F = (x) => -(V(x + 0.01) - V(x - 0.01)) / 0.02;
  const go = () => { const f = F(r); ro.textContent = `r = ${r.toFixed(2)} fm: V = ${V(r).toFixed(1)} MeV.  ${r < 0.75 ? 'Closer than about 0.8 fm the force is repulsive (the nucleons will not squash together).' : r < 3 ? 'Attractive: the force pulls them together with about ' + Math.abs(f).toFixed(0) + ' MeV/fm.' : 'Beyond ~3 fm the nuclear force is almost zero: a short-range force.'}  Range is a few fm.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Two nucleons: potential energy', col);
    const A = axes(ctx, w, h, col, { x: [0, 6], y: [-50, 20], xlabel: 'separation r (fm)', ylabel: 'V(r) (MeV)', l: 44, t: top + 8, b: 38 });
    const pts = []; for (let x = 0.4; x <= 6; x += 0.04) pts.push([A.X(x), A.Y(Math.max(-50, Math.min(20, V(x))))]);
    ctx.save(); A.clip(); line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1); line(ctx, pts, col.s[0], 3); ctx.restore();
    dot(ctx, A.X(r), A.Y(Math.max(-50, Math.min(20, V(r)))), 6, col.s[3], col.panel);
    const f = F(r), cy = A.Y(11); arrow(ctx, A.X(r), cy, A.X(r) + Math.max(-40, Math.min(40, f * 1.2)), cy, col.s[2], 3, 8);
    text(ctx, f > 0 ? 'force: pushes apart' : 'force: pulls together', A.X(r), cy + 16, { color: col.s[2], size: 10.5, align: 'center' });
    text(ctx, 'strong, short range', A.X(3.4), A.Y(-18), { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'repulsive core', A.X(1.0), A.Y(17), { color: col.muted, size: 10.5 });
  };
  go();
}
