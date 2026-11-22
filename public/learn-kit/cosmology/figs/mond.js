// 8.7 MOND against Newton. Two views.
// Acceleration: the pull we observe (from rotation speeds, g_obs = v²/r) against the pull the visible stars and gas
// should give by Newton (g_bar). Newton says the two are equal. Galaxies follow one curve that bends away below
// a0: the radial acceleration relation (McGaugh, Lelli and Schombert 2016), g_obs = g_bar / (1 − exp(−√(g_bar/a0))),
// which is also a common MOND formula. The points are made-up galaxies scattered about that curve with a0 = 1.2e-10.
// Rotation curve: one galaxy (5 × 10¹⁰ suns of stars and gas in an exponential disc, treated as a ball) with Newton's
// speed and MOND's. MOND's speed levels off at v = (G M a0)^¼.
import { canvas, axes, text, title, line, dot, row, slider, choice, readout, rng } from '../../kit.js';

const G = 6.674e-11, MSUN = 1.989e30, KPC = 3.0857e19;
const nu = (gb, a0) => gb / (1 - Math.exp(-Math.sqrt(gb / a0)));
const MB = 5e10, RD = 3;
const mIn = (r) => MB * (1 - Math.exp(-r / RD) * (1 + r / RD));
const gN = (r) => (G * mIn(r) * MSUN) / (r * KPC) ** 2; // r in kpc → m/s²
const vOf = (g, r) => Math.sqrt(g * r * KPC) / 1000; // km/s

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 300, label: 'Observed against expected acceleration in galaxies, with the Newton line and the MOND curve' });
  let a0 = 1.2e-10, view = 'acc';
  const R = rng(5), pts = [];
  for (let i = 0; i < 70; i++) { const gb = 10 ** (-12 + R() * 3.4); pts.push([gb, nu(gb, 1.2e-10) * 10 ** ((R() + R() + R() - 1.5) * 0.08)]); }
  const ctl = row(host);
  choice(ctl, 'View', [['acc', 'Acceleration'], ['rot', 'Rotation curve']], view, (v) => { view = v; cv.redraw(); show(); });
  slider(ctl, { label: 'MOND acceleration a₀', min: 0.2e-10, max: 4e-10, step: 0.05e-10, value: a0, fmt: (v) => `${(v / 1e-10).toFixed(2)} × 10⁻¹⁰ m/s²`, oninput: (v) => { a0 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const vf = Math.pow(G * MB * MSUN * a0, 0.25) / 1000, rt = Math.sqrt((G * MB * MSUN) / a0) / KPC;
    out.innerHTML = view === 'acc'
      ? `Where the expected pull is far above a₀ (right), galaxies obey Newton. Below a₀ (left), the observed pull is stronger, by about √(a₀ / g). ${Math.abs(a0 - 1.2e-10) < 0.15e-10 ? 'This a₀ fits the points.' : 'Move a₀ back near 1.2 × 10⁻¹⁰ m/s² to fit the points.'}`
      : `For this galaxy (5 × 10¹⁰ suns of stars and gas), Newton's pull drops below a₀ beyond about <b>${rt.toFixed(0)} kpc</b>. MOND's speed then levels off at (G M a₀)<sup>¼</sup> = <b>${vf.toFixed(0)} km/s</b>; Newton's keeps falling.`;
  };
  cv.draw = (ctx, w, h, col) => {
    if (view === 'acc') {
      const fx = (v) => { const e = Math.round(Math.log10(v)); return `10${String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)])}`; };
      const A = axes(ctx, w, h, col, { x: [1e-12, 1e-8], y: [1e-12, 1e-8], xlog: true, ylog: true, t: 40, l: 50, fx, fy: fx, xlabel: 'Pull expected from stars and gas (m/s²)', ylabel: 'Pull observed (m/s²)' });
      ctx.save(); A.clip();
      for (const [x, y] of pts) dot(ctx, A.X(x), A.Y(y), 2.6, col.muted);
      line(ctx, [[A.X(1e-12), A.Y(1e-12)], [A.X(1e-8), A.Y(1e-8)]], col.s[1], 2, [6, 4]);
      const c = []; for (let i = 0; i <= 200; i++) { const g = 10 ** (-12 + i * 0.02); c.push([A.X(g), A.Y(nu(g, a0))]); }
      line(ctx, c, col.s[0], 3);
      line(ctx, [[A.X(a0), A.T], [A.X(a0), A.B]], col.s[3], 1.5, [3, 3]);
      ctx.restore();
      text(ctx, 'a₀', A.X(a0) + 4, A.B - 12, { color: col.s[3], size: 12, weight: 700, halo: col.panel });
      text(ctx, '- - Newton (observed = expected)', A.L + 6, A.T + 10, { color: col.s[1], size: 10.5, weight: 700, halo: col.panel });
      text(ctx, '— MOND', A.L + 6, A.T + 25, { color: col.s[0], size: 10.5, weight: 700, halo: col.panel });
      title(ctx, 'Galaxies follow one curve', col);
    } else {
      const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 260], t: 40, xlabel: 'Distance from the centre (kpc)', ylabel: 'Orbital speed (km/s)' });
      ctx.save(); A.clip();
      const cN = [], cM = [];
      for (let r = 0.3; r <= 40; r += 0.3) { cN.push([A.X(r), A.Y(vOf(gN(r), r))]); cM.push([A.X(r), A.Y(vOf(nu(gN(r), a0), r))]); }
      line(ctx, cN, col.s[1], 2, [6, 4]); line(ctx, cM, col.s[0], 3);
      ctx.restore();
      text(ctx, '— MOND (same stars and gas)', A.R - 6, A.B - 30, { color: col.s[0], size: 10.5, weight: 700, align: 'right', halo: col.panel });
      text(ctx, '- - Newton', A.R - 6, A.B - 15, { color: col.s[1], size: 10.5, weight: 700, align: 'right', halo: col.panel });
      title(ctx, 'No dark matter, yet a flat curve', col);
    }
  };
  cv.redraw(); show();
}
