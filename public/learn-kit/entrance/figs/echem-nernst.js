// The Nernst equation at 298 K: E = E° − (0.0591/n) log Q. Pick a cell and set the ion concentrations; the point
// moves along the line. Where the line crosses E = 0 the cell is "dead": Q has reached K, so log K = nE°/0.0591.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const CELLS = {
  dan: { name: 'Zn | Cu', E0: 1.10, n: 2, an: 'Zn²⁺', ca: 'Cu²⁺', Q: (a, c) => a / c, eq: 'Zn + Cu²⁺ → Zn²⁺ + Cu' },
  cuag: { name: 'Cu | Ag', E0: 0.46, n: 2, an: 'Cu²⁺', ca: 'Ag⁺', Q: (a, c) => a / (c * c), eq: 'Cu + 2Ag⁺ → Cu²⁺ + 2Ag' },
  znh: { name: 'Zn | H₂', E0: 0.76, n: 2, an: 'Zn²⁺', ca: 'H⁺', Q: (a, c) => a / (c * c), eq: 'Zn + 2H⁺ → Zn²⁺ + H₂ (1 bar)' },
  conc: { name: 'Ag | Ag conc.', E0: 0, n: 1, an: 'Ag⁺ (anode)', ca: 'Ag⁺ (cathode)', Q: (a, c) => a / c, eq: 'Ag⁺(cathode side) → Ag⁺(anode side)' },
};
export default function (host) {
  let key = 'dan', la = -1, lc = 0; // log10 of the two concentrations (mol/L)
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'Cell emf against log Q from the Nernst equation' });
  const ctl = row(host);
  choice(ctl, 'Cell', Object.entries(CELLS).map(([k, c]) => [k, c.name]), key, (v) => { key = v; upd(); });
  const sa = slider(ctl, { label: 'Anode ion', min: -4, max: 1, step: 0.1, value: la, fmt: (v) => `${fmt(10 ** v, 2)} M`, oninput: (v) => { la = v; upd(); } });
  const sc = slider(ctl, { label: 'Cathode ion', min: -4, max: 1, step: 0.1, value: lc, fmt: (v) => `${fmt(10 ** v, 2)} M`, oninput: (v) => { lc = v; upd(); } });
  const out = readout(host);
  const state = () => {
    const c = CELLS[key], logQ = Math.log10(c.Q(10 ** la, 10 ** lc)), E = c.E0 - (0.0591 / c.n) * logQ;
    return { c, logQ, E, dG: -c.n * 96.485 * E, logK: (c.n * c.E0) / 0.0591 };
  };
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const { c, logQ, E, dG, logK } = state();
    out.innerHTML = `${c.eq}. E° = ${c.E0.toFixed(2)} V, n = ${c.n}, log Q = ${logQ.toFixed(2)}: E = ${c.E0.toFixed(2)} − (0.0591/${c.n})(${logQ.toFixed(2)}) = <b>${E.toFixed(3)} V</b>. ΔG = −nFE = ${fmt(dG)} kJ/mol (${E > 0 ? 'spontaneous as written' : E < 0 ? 'runs backwards' : 'at equilibrium'}). ${c.E0 ? `At equilibrium E = 0 and log K = nE°/0.0591 = ${logK.toFixed(1)}.` : 'A concentration cell has E° = 0: it runs only while the concentrations differ.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { c, logQ, E } = state();
    const x0 = -8, x1 = 8;
    const Ef = (q) => c.E0 - (0.0591 / c.n) * q;
    const ys = [Ef(x0), Ef(x1), 0];
    const lo = Math.min(...ys) - 0.08, hi = Math.max(...ys) + 0.08;
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [x0, x1], y: [lo, hi], xlabel: 'log Q', ylabel: 'E cell (V)', t: 28 });
    ctx.save(); clip();
    line(ctx, [[X(x0), Y(0)], [X(x1), Y(0)]], col.muted, 1, [4, 4]);
    line(ctx, [[X(x0), Y(Ef(x0))], [X(x1), Y(Ef(x1))]], col.s[0], 2.5);
    line(ctx, [[X(0), Y(lo)], [X(0), Y(hi)]], col.line, 1, [2, 3]);
    ctx.restore();
    dot(ctx, X(0), Y(c.E0), 4, col.panel, col.s[1]);
    text(ctx, `E° = ${c.E0.toFixed(2)} V (Q = 1)`, X(0) + 8, Y(c.E0) - 10, { color: col.s[1], size: 11 });
    const lq = Math.max(x0, Math.min(x1, logQ));
    dot(ctx, X(lq), Y(Ef(lq)), 6, col.s[2]);
    text(ctx, `E = ${E.toFixed(3)} V`, X(lq), Y(Ef(lq)) + 16, { color: col.s[2], size: 12, weight: 600, align: 'center', halo: col.panel });
    text(ctx, `slope = −0.0591/${c.n} V per unit log Q`, 10, 14, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
