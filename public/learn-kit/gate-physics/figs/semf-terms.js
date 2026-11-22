// 8.2 The semi-empirical mass formula. View 1: binding energy per nucleon along the valley of stability, built up from
// the volume term and the losses to surface, Coulomb and asymmetry terms (av 15.8, as 18.3, ac 0.714, aa 23.2 MeV).
// View 2: the mass parabola for one isobar chain, M(Z) relative to its minimum, with odd-odd and even-even sheets
// split by the pairing term when A is even. The marked Z is the most stable isobar.
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt } from '../../kit.js';

const AV = 15.8, AS = 18.3, AC = 0.714, AA = 23.2, D = 12;
const pair = (Z, A) => (A % 2 ? 0 : Z % 2 ? -D / Math.sqrt(A) : D / Math.sqrt(A));
const BE = (Z, A) => { const c = Math.cbrt(A); return AV * A - AS * c * c - AC * Z * (Z - 1) / c - AA * (A - 2 * Z) ** 2 / A + pair(Z, A); };
const Z0 = (A) => A / (2 + AC / (2 * AA) * A ** (2 / 3));
const MN = 939.565, MH = 938.783; // neutron and hydrogen-atom masses (MeV)

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 470, min: 270, label: 'Semi-empirical mass formula: terms against A, or the mass parabola of an isobar chain' });
  let view = 'terms', A = 125;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'View', [['terms', 'Terms against A'], ['par', 'Mass parabola']], view, (v) => { view = v; re(); });
  slider(ctl, { label: 'Mass number A', min: 10, max: 250, step: 1, value: A, fmt: (v) => String(v), oninput: (v) => { A = v; re(); } });
  const parts = (A) => {
    const Z = Z0(A), c = Math.cbrt(A);
    return { Z, vol: AV, surf: AS / c, coul: AC * Z * (Z - 1) / (c * A), asym: AA * (A - 2 * Z) ** 2 / (A * A) };
  };
  const show = () => {
    if (view === 'terms') {
      const p = parts(A), b = p.vol - p.surf - p.coul - p.asym;
      out.innerHTML = `A = ${A}, Z on the valley ≈ ${fmt(p.Z, 3)}: volume ${fmt(p.vol, 3)} − surface ${fmt(p.surf, 3)} − Coulomb ${fmt(p.coul, 3)} − asymmetry ${fmt(p.asym, 2)} = <b>${fmt(b, 3)} MeV per nucleon</b> (pairing left out).`;
    } else {
      const z = Z0(A), Zs = best(A);
      out.innerHTML = `Smooth minimum at Z₀ = ${fmt(z, 4)}; most stable isobar Z = ${Zs}. ${A % 2 ? 'Odd A: one parabola, so exactly one beta-stable isobar.' : `Even A: two parabolas ${fmt(2 * D / Math.sqrt(A), 3)} MeV apart (2δ); odd-odd nuclei sit on the upper one, so two even-even isobars can both be stable.`}`;
    }
  };
  const mass = (Z, A) => Z * MH + (A - Z) * MN - BE(Z, A);
  const best = (A) => { let b = 1, m = Infinity; for (let Z = 1; Z < A; Z++) { const x = mass(Z, A); if (x < m) { m = x; b = Z; } } return b; };
  cv.draw = (ctx, W, H, col) => {
    if (view === 'terms') {
      const ax = axes(ctx, W, H, col, { x: [0, 250], y: [0, 18], xlabel: 'mass number A', ylabel: 'MeV per nucleon', t: 14 });
      const tr = [[], [], [], []];
      for (let a = 4; a <= 250; a += 1) { const p = parts(a); const v = [p.vol, p.vol - p.surf, p.vol - p.surf - p.coul, p.vol - p.surf - p.coul - p.asym]; v.forEach((y, i) => tr[i].push([ax.X(a), ax.Y(Math.max(0, y))])); }
      const cs = [col.muted, col.s[1], col.s[2], col.s[0]], lab = ['volume', '− surface', '− Coulomb', '− asymmetry = B/A'];
      tr.forEach((t, i) => line(ctx, t, cs[i], i === 3 ? 2.8 : 1.6, i === 3 ? null : [4, 3]));
      lab.forEach((s, i) => text(ctx, s, ax.R - 4, ax.T + 12 + 14 * i, { color: cs[i], size: 11, weight: 700, align: 'right', halo: col.panel }));
      line(ctx, [[ax.X(A), ax.T], [ax.X(A), ax.B]], col.ink, 1, [2, 3]);
      const p = parts(A); dot(ctx, ax.X(A), ax.Y(p.vol - p.surf - p.coul - p.asym), 5, col.ink, col.panel);
    } else {
      const z = Z0(A), lo = Math.max(1, Math.round(z) - 6), hi = Math.min(A - 1, Math.round(z) + 6);
      const ms = []; for (let Z = lo; Z <= hi; Z++) ms.push([Z, mass(Z, A)]);
      const mmin = Math.min(...ms.map((x) => x[1])), top = Math.max(...ms.map((x) => x[1] - mmin)) * 1.08 + 0.5;
      const ax = axes(ctx, W, H, col, { x: [lo - 0.5, hi + 0.5], y: [0, top], xlabel: 'proton number Z (fixed A)', ylabel: 'mass above minimum (MeV)', t: 14 });
      for (const sheet of A % 2 ? [0] : [1, -1]) {
        const pts = []; for (let Z = lo - 0.4; Z <= hi + 0.4; Z += 0.05) { const smooth = Z * MH + (A - Z) * MN - (BE(Z, A) - pair(Math.round(Z), A)) - sheet * D / Math.sqrt(A); pts.push([ax.X(Z), ax.Y(smooth - mmin)]); }
        line(ctx, pts, sheet < 0 ? col.s[2] : col.s[0], 1.6, [4, 3]);
      }
      const Zs = best(A);
      for (const [Z, m] of ms) dot(ctx, ax.X(Z), ax.Y(m - mmin), Z === Zs ? 6 : 4.5, Z === Zs ? col.ink : (A % 2 === 0 && Z % 2 ? col.s[2] : col.s[0]), Z === Zs ? col.panel : null);
      text(ctx, A % 2 ? 'odd A' : 'upper parabola: odd-odd · lower: even-even', ax.L + 8, ax.T + 10, { color: col.muted, size: 11, halo: col.panel });
    }
  };
  re();
}
