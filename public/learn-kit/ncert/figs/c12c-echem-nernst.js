// Class 12 Chemistry, Electrochemistry: the Nernst equation E = E0 - (0.0592 / n) log Q at 298 K, for the cell reaction aA + bB -> products with Q = [products]/[reactants].
// For the Daniell cell Zn + Cu2+ -> Zn2+ + Cu, Q = [Zn2+]/[Cu2+]. E falls in a straight line as log Q grows and reaches 0 at equilibrium, where Q = K and log K = n E0 / 0.0592.
// A dead cell is at equilibrium (E = 0, dG = 0). dG = -nFE in joules per mole of reaction.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

const CELLS = { dan: ['Zn + Cu²⁺ → Zn²⁺ + Cu', 2, 1.10, '[Zn²⁺]', '[Cu²⁺]'], ag: ['Cu + 2Ag⁺ → Cu²⁺ + 2Ag', 2, 0.46, '[Cu²⁺]', '[Ag⁺]²'], al: ['2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu', 6, 2.00, '[Al³⁺]²', '[Cu²⁺]³'] };
export default function (host) {
  let k = 'dan', lp = -1, lr = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Cell voltage against the logarithm of the reaction quotient with a line that falls to zero at equilibrium' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'cell', [['dan', 'Zn–Cu (Daniell)'], ['ag', 'Cu–Ag'], ['al', 'Al–Cu']], k, (v) => { k = v; go(); });
  slider(ctl, { label: 'log₁₀ of the product side', min: -4, max: 1, step: 0.1, value: lp, fmt: (v) => v.toFixed(1), oninput: (v) => { lp = v; go(); } });
  slider(ctl, { label: 'log₁₀ of the reactant side', min: -4, max: 1, step: 0.1, value: lr, fmt: (v) => v.toFixed(1), oninput: (v) => { lr = v; go(); } });
  const E = (lq) => CELLS[k][2] - 0.0592 / CELLS[k][1] * lq;
  const go = () => { const [rx, n, e0] = CELLS[k], lq = lp - lr, e = E(lq), dG = -n * 96485 * e / 1000; ro.textContent = `${rx}. log Q = ${lq.toFixed(1)}, E = ${e0.toFixed(2)} − (0.0592/${n}) × (${lq.toFixed(1)}) = ${e.toFixed(3)} V, ΔG = ${dG.toFixed(0)} kJ/mol.  At E = 0, log K = nE°/0.0592 = ${(n * e0 / 0.0592).toFixed(1)}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const [rx, n, e0] = CELLS[k], t0 = title(ctx, 'E against log Q (Nernst line)', col), lk = n * e0 / 0.0592, xr = Math.max(8, Math.min(lk * 1.1, 80));
    const A = axes(ctx, w, h, col, { x: [-8, xr], y: [Math.min(-0.1, E(xr) - 0.05), e0 + 0.15], xlabel: 'log Q  (log of products ÷ reactants)', ylabel: 'cell voltage E (V)', l: 48, t: t0 + 8, b: 40, fx: (v) => (+v.toFixed(0)).toString(), fy: (v) => v.toFixed(2) });
    ctx.save(); A.clip(); line(ctx, [[A.X(-8), A.Y(E(-8))], [A.X(xr), A.Y(E(xr))]], col.s[0], 3); ctx.restore();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(0)); ctx.lineTo(A.R, A.Y(0)); ctx.moveTo(A.X(0), A.T); ctx.lineTo(A.X(0), A.B); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, A.X(0), A.Y(e0), 4.5, col.s[2], col.panel); text(ctx, 'Q = 1: E = E°', A.X(0) + 8, A.Y(e0) + 2, { color: col.s[2], size: 10.5, weight: 700, halo: col.panel });
    if (lk <= xr) { dot(ctx, A.X(lk), A.Y(0), 5, col.s[3], col.panel); text(ctx, 'dead cell: Q = K', A.X(lk) - 8, A.Y(0) - 12, { color: col.s[3], size: 10.5, weight: 700, align: 'right', halo: col.panel }); }
    const lq = Math.max(-8, Math.min(xr, lp - lr)); dot(ctx, A.X(lq), A.Y(E(lq)), 6.5, col.s[4], col.panel);
  };
  go();
}
