// 11.3 The tilt of the primordial ripples. Strength per range of sizes Δ²(k) = A_s (k/k*)^(n_s − 1), with
// A_s = 2.1 × 10⁻⁹ at k* = 0.05 per Mpc (Planck 2018). n_s = 1 would be exactly scale-invariant (flat line);
// Planck measures n_s = 0.965 ± 0.004, slightly stronger on large scales. Slide n_s to see the line tilt.
// Rough scale marks use wavelength 2π/k: the observable universe, the first acoustic peak of the CMB, a galaxy
// cluster and a galaxy (comoving sizes before collapse).
import { canvas, axes, text, title, line, row, slider, readout } from '../../kit.js';

const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
const AS = 2.1e-9, KS = 0.05;

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 300, label: 'Strength of the primordial ripples against their size, for different tilts' });
  let ns = 0.965;
  const ctl = row(host);
  slider(ctl, { label: 'Tilt, nₛ', min: 0.9, max: 1.05, step: 0.001, value: ns, fmt: (v) => v.toFixed(3), oninput: (v) => { ns = v; cv.redraw(); show(); } });
  const out = readout(host);
  const P = (k, n) => AS * (k / KS) ** (n - 1);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Primordial ripples: strength by size', col);
    const A = axes(ctx, w, h, col, { x: [1e-4, 10], y: [1.2, 3.6], xlog: true, t: top + 26, l: 44,
      xt: [1e-4, 1e-3, 1e-2, 0.1, 1, 10], yt: [1.5, 2, 2.5, 3, 3.5], fx: (v) => (v >= 1 ? String(v) : '10' + sup(Math.round(Math.log10(v)))), fy: (v) => v.toFixed(1),
      xlabel: 'waves per Mpc, k (smaller ripples →)', ylabel: 'strength, Δ² (×10⁻⁹)' });
    const curve = (n) => { const pts = []; for (let e = -4; e <= 1.001; e += 0.05) { const k = 10 ** e; pts.push([A.X(k), A.Y(P(k, n) * 1e9)]); } return pts; };
    ctx.save(); A.clip();
    line(ctx, curve(1), col.muted, 1.5, [5, 4]);
    line(ctx, curve(0.965), col.s[1], 1.5);
    line(ctx, curve(ns), col.s[0], 3);
    ctx.restore();
    text(ctx, 'nₛ = 1 (no tilt)', A.R - 4, A.Y(2.1) - 10, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
    text(ctx, 'Planck: 0.965', A.X(1e-4) + 4, A.Y(P(1e-4, 0.965) * 1e9) + (ns > 0.965 ? 12 : -12), { color: col.s[1], size: 10.5, weight: 700, halo: col.panel });
    const marks = [[4.5e-4, 'visible universe'], [0.02, 'CMB first peak'], [0.6, 'cluster'], [6, 'galaxy']];
    marks.forEach(([k, lab], i) => {
      const x = A.X(k);
      line(ctx, [[x, A.T - 4], [x, A.T + 6]], col.ink, 1.5);
      text(ctx, lab, x, A.T - 10 - [0, 1, 1, 0][i] * 12, { color: col.ink, size: 10, align: i === 0 ? 'left' : i === 3 ? 'right' : 'center', halo: col.panel });
    });
  };
  const show = () => {
    const r = P(1e-4, ns) / P(10, ns);
    out.innerHTML = Math.abs(ns - 1) < 0.0005 ? 'n<sub>s</sub> = 1: every size of ripple is equally strong (the Harrison-Zel\'dovich spectrum). Planck rules this out by about 8 standard deviations.'
      : `With n<sub>s</sub> = <b>${ns.toFixed(3)}</b>, ripples the size of the observable universe are <b>${r.toFixed(2)}</b> times as strong as galaxy-sized ones. ${ns < 1 ? 'A slight red tilt, as slow-roll inflation predicts: the field rolls a little faster as inflation goes on, so later (smaller) ripples come out slightly weaker.' : 'A blue tilt: not what we see.'}`;
  };
  cv.redraw(); show();
}
