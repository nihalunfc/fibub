// 7.3 Bonding curves. Ionic: the Born-Lande energy per ion pair, -alpha k e^2/r + B/r^n, split into its attractive
// (Madelung) and repulsive parts; change the Madelung constant and the Born exponent n and see the minimum move and the
// binding fall by the factor (1 - 1/n). Van der Waals: the Lennard-Jones energy of an isolated pair beside the energy per
// atom of the fcc crystal with full lattice sums (deeper, 8.6 epsilon, and at a shorter distance, 1.09 sigma).
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt } from '../../kit.js';

const KE = 14.40, A12 = 12.13, A6 = 14.45;

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'Energy against separation for an ionic crystal or a Lennard-Jones solid' });
  let mode = 'ionic', alpha = 1.7476, n = 9, r0 = 2.82;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Bond', [['ionic', 'Ionic (Born-Landé)'], ['lj', 'Van der Waals (Lennard-Jones)']], mode, (v) => { mode = v; re(); });
  choice(ctl, 'Structure (ionic)', [[1.6381, 'ZnS 1.638'], [1.7476, 'NaCl 1.748'], [1.7627, 'CsCl 1.763'], [1.3863, '1D chain 1.386']], alpha, (v) => { alpha = v; re(); });
  slider(ctl, { label: 'Born exponent n', min: 4, max: 14, step: 0.5, value: n, fmt: (v) => fmt(v, 3), oninput: (v) => { n = v; re(); } });
  // B fixed so that the NaCl-like minimum sits at r0 for the current n and alpha
  const ionic = (r) => { const B = alpha * KE * r0 ** (n - 1) / n; return [-alpha * KE / r, B / r ** n]; };
  const show = () => {
    if (mode === 'ionic') {
      const U0 = -alpha * KE / r0 * (1 - 1 / n);
      out.innerHTML = `Minimum at r₀ = ${r0} Å (B chosen to put it there). Madelung energy ${fmt(-alpha * KE / r0, 4)} eV, repulsion +${fmt(alpha * KE / (n * r0), 3)} eV = 1/n of it, so U(r₀) = <b>${fmt(U0, 4)} eV</b> per ion pair. Larger n: a harder wall and a curve that is steeper on the left (larger bulk modulus).`;
    } else {
      out.innerHTML = `Pair: minimum −ε at r = 2^{1/6}σ = 1.122σ. fcc crystal with lattice sums A₁₂ = 12.13, A₆ = 14.45: minimum <b>−8.61ε per atom</b> at R₀ = 1.090σ. Nearest neighbours alone would give −6ε at 1.122σ: the long r⁻⁶ tail adds 43%.`;
    }
  };
  cv.draw = (ctx, W, H, col) => {
    if (mode === 'ionic') {
      const ax = axes(ctx, W, H, col, { x: [1.5, 6], y: [-12, 8], xlabel: 'separation r (Å)', ylabel: 'energy per ion pair (eV)', t: 26 });
      ctx.save(); ax.clip();
      const att = [], rep = [], tot = [];
      for (let r = 1.5; r <= 6; r += 0.01) { const [a, b] = ionic(r); att.push([ax.X(r), ax.Y(a)]); rep.push([ax.X(r), ax.Y(Math.min(b, 40))]); tot.push([ax.X(r), ax.Y(Math.min(a + b, 40))]); }
      line(ctx, [[ax.X(1.5), ax.Y(0)], [ax.X(6), ax.Y(0)]], col.muted, 1);
      line(ctx, att, col.s[2], 1.5, [5, 4]); line(ctx, rep, col.s[3], 1.5, [5, 4]); line(ctx, tot, col.s[0], 2.5);
      const U0 = -alpha * KE / r0 * (1 - 1 / n); dot(ctx, ax.X(r0), ax.Y(U0), 4, col.s[0]);
      ctx.restore();
      text(ctx, 'total', ax.X(4.6), ax.Y(-alpha * KE / 4.6 * 0.98) - 12, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
      text(ctx, 'Madelung −αke²/r', ax.X(3.4), ax.Y(-alpha * KE / 3.4) + 14, { color: col.s[2], size: 11, halo: col.panel });
      text(ctx, 'repulsion B/rⁿ', ax.X(1.75), ax.Y(5.5), { color: col.s[3], size: 11, halo: col.panel });
    } else {
      const ax = axes(ctx, W, H, col, { x: [0.85, 2.2], y: [-10, 4], xlabel: 'separation r / σ', ylabel: 'energy / ε', t: 26 });
      ctx.save(); ax.clip();
      const pair = [], crys = [], nn = [];
      for (let x = 0.85; x <= 2.2; x += 0.004) {
        pair.push([ax.X(x), ax.Y(Math.min(4 * (x ** -12 - x ** -6), 10))]);
        crys.push([ax.X(x), ax.Y(Math.min(2 * (A12 * x ** -12 - A6 * x ** -6), 10))]);
        nn.push([ax.X(x), ax.Y(Math.min(6 * 4 * (x ** -12 - x ** -6), 10))]);
      }
      line(ctx, [[ax.X(0.85), ax.Y(0)], [ax.X(2.2), ax.Y(0)]], col.muted, 1);
      line(ctx, nn, col.s[3], 1.5, [5, 4]); line(ctx, pair, col.s[2], 2); line(ctx, crys, col.s[0], 2.5);
      dot(ctx, ax.X(2 ** (1 / 6)), ax.Y(-1), 4, col.s[2]); dot(ctx, ax.X((2 * A12 / A6) ** (1 / 6)), ax.Y(-A6 * A6 / (2 * A12)), 4, col.s[0]);
      ctx.restore();
      text(ctx, 'isolated pair (min −ε)', ax.X(1.45), ax.Y(-1) - 12, { color: col.s[2], size: 11, halo: col.panel });
      text(ctx, 'fcc crystal, per atom (min −8.61ε)', ax.X(1.2), ax.Y(-8.61) + 4, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
      text(ctx, '12 neighbours only, per atom (min −6ε)', ax.X(1.35), ax.Y(-4.2), { color: col.s[3], size: 11, halo: col.panel });
    }
  };
  re();
}
