// 6.4 Rigid rotor: thermal populations and the rotational spectrum. Top: the fraction of molecules in each level J,
// proportional to (2J+1) exp(-hcBJ(J+1)/kT). Bottom: absorption lines J -> J+1 at 2B(J+1), equally spaced by 2B, drawn
// with heights proportional to the population of the lower level (a simple model). Move B and T.
import { canvas, axes, line, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const C2 = 1.438777;
const MOLS = [['custom', 'custom'], [10.59, 'HCl'], [1.9313, 'CO'], [20.56, 'HF'], [0.2181, 'NaCl']];

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 480, min: 340, label: 'Rotational level populations and the resulting absorption spectrum' });
  let B = 10.59, T = 300;
  const ctl = row(host);
  const out = readout(host);
  const pops = () => {
    const p = []; let q = 0;
    for (let J = 0; J < 400; J++) { const v = (2 * J + 1) * Math.exp(-C2 * B * J * (J + 1) / T); p.push(v); q += v; if (J > 3 && v / q < 1e-4) break; }
    return p.map((v) => v / q);
  };
  const show = () => {
    const p = pops(), jm = p.indexOf(Math.max(...p));
    out.innerHTML = `kT/hc = ${fmt(T / C2, 3)} cm⁻¹. Most populated level <b>J = ${jm}</b> (formula √(kT/2hcB) − ½ = ${fmt(Math.sqrt(T / (2 * C2 * B)) - 0.5, 3)}); strongest line ${jm}→${jm + 1} at <b>${fmt(2 * B * (jm + 1), 4)} cm⁻¹</b>. Line spacing 2B = ${fmt(2 * B, 4)} cm⁻¹; partition function ≈ kT/hcB = ${fmt(T / (C2 * B), 3)}.`;
  };
  const redo = () => { cv.redraw(); show(); };
  let bs;
  choice(ctl, 'Molecule', MOLS.slice(1).map(([b, n]) => [b, n]), B, (v) => { B = v; bs.set(v); redo(); });
  bs = slider(ctl, { label: 'B', min: 0.1, max: 60, value: B, log: true, fmt: (v) => fmt(v, 3) + ' cm⁻¹', oninput: (v) => { B = v; redo(); } });
  slider(ctl, { label: 'Temperature', min: 10, max: 2000, value: T, log: true, fmt: (v) => fmt(v, 3) + ' K', oninput: (v) => { T = v; redo(); } });

  cv.draw = (ctx, w, h, col) => {
    const p = pops(), N = Math.min(p.length, 80), pm = Math.max(...p);
    title(ctx, `Populations of J (B = ${fmt(B, 3)} cm⁻¹, T = ${fmt(T, 3)} K)`, col);
    const a = axes(ctx, w, h, col, { x: [-0.8, N - 0.2], y: [0, pm * 1.15], xlabel: 'J', ylabel: 'fraction', t: 38, b: h * 0.5 + 16, grid: false });
    const bw = Math.max(1.5, (a.R - a.L) / N * 0.7);
    for (let J = 0; J < N; J++) { ctx.fillStyle = col.s[0]; const x = a.X(J), y = a.Y(p[J]); ctx.fillRect(x - bw / 2, y, bw, a.Y(0) - y); }
    const vmax = 2 * B * (N + 1);
    const b = axes(ctx, w, h, col, { x: [0, vmax], y: [0, pm * 1.15], yt: [], xlabel: 'wavenumber (cm⁻¹)', t: h * 0.5 + 40, grid: false });
    text(ctx, 'absorption lines J → J+1', b.L + 6, b.T - 8, { color: col.muted, size: 11, weight: 700 });
    for (let J = 0; J < N; J++) { const x = b.X(2 * B * (J + 1)); line(ctx, [[x, b.Y(0)], [x, b.Y(p[J])]], col.s[1], Math.max(1, Math.min(2.5, bw / 2))); }
  };
  redo();
}
