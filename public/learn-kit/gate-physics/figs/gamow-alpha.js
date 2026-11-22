// 8.4 Alpha decay and the Geiger-Nuttall law. Gamow model: an alpha particle of kinetic energy T inside a nucleus of
// radius R = 1.2 (A_d^(1/3) + 4^(1/3)) fm hits the wall v/2R times a second and tunnels with probability exp(-2G), where
// 2G is the full Coulomb-barrier integral. Lines: log10 of the half-life against Q^(-1/2) for several parent Z; dots:
// measured half-lives of seven well-known emitters (NNDC values). A 1 MeV change in Q changes the half-life by many
// powers of ten.
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt } from '../../kit.js';

const HBARC = 197.327, KE2 = 1.44, MA = 3727.379, YR = 3.156e7;
const twoG = (Z, T, R) => { const x = T * R / (2 * Z * KE2); return 2 * Math.sqrt(2 * MA * T) / HBARC * (2 * Z * KE2 / T) * (Math.acos(Math.sqrt(x)) - Math.sqrt(x * (1 - x))); };
const half = (Z, A, Q) => { const Ad = A - 4, R = 1.2 * (Math.cbrt(Ad) + Math.cbrt(4)), T = Q * Ad / A, v = Math.sqrt(2 * T / MA) * 2.998e23; return Math.LN2 / (v / (2 * R) * Math.exp(-twoG(Z - 2, T, R))); };
const DATA = [['²¹²Po', 84, 212, 8.954, 2.99e-7], ['²¹⁴Po', 84, 214, 7.833, 1.643e-4], ['²²²Rn', 86, 222, 5.590, 3.304e5], ['²¹⁰Po', 84, 210, 5.407, 1.196e7], ['²²⁶Ra', 88, 226, 4.871, 1600 * YR], ['²³⁸U', 92, 238, 4.270, 4.468e9 * YR], ['²³²Th', 90, 232, 4.082, 1.405e10 * YR]];
const PAR = { 84: 212, 88: 224, 92: 236 };

export default function (host) {
  const cv = canvas(host, { aspect: 0.68, max: 470, min: 270, label: 'Geiger-Nuttall plot of alpha-decay half-life against inverse square root of Q' });
  let Z = 88, Q = 5.5;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Parent', [['84', 'Z = 84 (Po)'], ['88', 'Z = 88 (Ra)'], ['92', 'Z = 92 (U)']], String(Z), (v) => { Z = +v; re(); });
  slider(ctl, { label: 'Q value (MeV)', min: 4, max: 9, step: 0.01, value: Q, fmt: (v) => fmt(v, 3), oninput: (v) => { Q = v; re(); } });
  const nice = (t) => (t < 60 ? `${fmt(t, 3)} s` : t < 86400 * 365 ? `${fmt(t / 86400, 3)} days` : `${fmt(t / YR, 3)} years`);
  const show = () => {
    const A = PAR[Z], Ad = A - 4, R = 1.2 * (Math.cbrt(Ad) + Math.cbrt(4)), T = Q * Ad / A, t = half(Z, A, Q);
    out.innerHTML = `A = ${A}: R = ${fmt(R, 3)} fm, barrier height 2(Z−2)e²/R = ${fmt(2 * (Z - 2) * KE2 / R, 3)} MeV, alpha energy T = ${fmt(T, 3)} MeV, 2G = ${fmt(twoG(Z - 2, T, R), 4)}, so t½ ≈ <b>${nice(t)}</b>. Raise Q by 1 MeV: t½ falls to ${nice(half(Z, A, Q + 1))}.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const ax = axes(ctx, W, H, col, { x: [0.33, 0.5], y: [-8, 20], xlabel: 'Q^(−1/2)  (MeV^(−1/2))', ylabel: 'log₁₀ (t½ / s)', t: 14 });
    const cs = { 84: col.s[0], 88: col.s[1], 92: col.s[2] };
    for (const z of [84, 88, 92]) {
      const pts = []; for (let q = 4; q <= 9.2; q += 0.02) { const y = Math.log10(half(z, PAR[z], q)); if (y > -9 && y < 21) pts.push([ax.X(1 / Math.sqrt(q)), ax.Y(y)]); }
      line(ctx, pts, cs[z], z === Z ? 2.8 : 1.4, z === Z ? null : [4, 3]);
      const lq = 4.3, ly = Math.log10(half(z, PAR[z], lq));
      if (ly < 20) text(ctx, `Z = ${z}`, ax.X(1 / Math.sqrt(lq)) - 4, ax.Y(ly) - 10, { color: cs[z], size: 10.5, weight: 700, align: 'right', halo: col.panel });
    }
    for (const [n, , , q, t] of DATA) { dot(ctx, ax.X(1 / Math.sqrt(q)), ax.Y(Math.log10(t)), 4, col.ink); text(ctx, n, ax.X(1 / Math.sqrt(q)) + 6, ax.Y(Math.log10(t)) + 8, { color: col.ink, size: 10, halo: col.panel }); }
    const y = Math.log10(half(Z, PAR[Z], Q));
    dot(ctx, ax.X(1 / Math.sqrt(Q)), ax.Y(Math.max(-8, Math.min(20, y))), 6, cs[Z], col.panel);
    text(ctx, 'dots: measured', ax.L + 8, ax.T + 10, { color: col.muted, size: 10.5, halo: col.panel });
  };
  re();
}
