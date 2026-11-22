// Radioactive decay atom by atom. Every nucleus decays at random, never "knowing" its age, yet the counts follow N = N₀e^(−λt)
// (half-life T½ = 0.693/λ). Use "One kind" to see the fluctuations (small samples are ragged, large ones smooth), or
// "Parent → daughter" to watch a chain: the daughter first grows, then follows the parent (equilibrium) or dies away on its own.
import { canvas, axes, line, text, title, row, slider, choice, button, readout, loop, rng } from '../kit.js';

const COLS = 20, ROWS = 12;
export default function (host) {
  let R = rng(21);
  const cv = canvas(host, { aspect: 1.15, max: 520, min: 420, label: 'A grid of nuclei decaying at random with the counts plotted against time' });
  let mode = 'one', T1 = 3, T2 = 1, atoms, t = 0, rec = [], run = true;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Decay', [['one', 'One kind'], ['chain', 'Parent → daughter']], mode, (v) => { mode = v; init(); });
  slider(ctl2, { label: 'Parent half-life', min: 1, max: 8, step: 0.5, value: T1, fmt: (v) => v + ' s', oninput: (v) => { T1 = v; init(); } });
  const s2 = slider(ctl2, { label: 'Daughter half-life', min: 0.3, max: 8, step: 0.1, value: T2, fmt: (v) => v.toFixed(1) + ' s', oninput: (v) => { T2 = v; init(); } });
  button(ctl2, 'Restart', () => init());
  function init() { R = rng(Math.floor(Math.random() * 1e6) + 1); atoms = new Uint8Array(COLS * ROWS); t = 0; rec = []; cv.redraw(); show(); }
  const anim = loop(host, (dt) => {
    const l1 = Math.LN2 / T1, l2 = Math.LN2 / T2, d = dt * 1.0; t += d;
    for (let i = 0; i < atoms.length; i++) { if (atoms[i] === 0 && R() < 1 - Math.exp(-l1 * d)) atoms[i] = 1; else if (atoms[i] === 1 && mode === 'chain' && R() < 1 - Math.exp(-l2 * d)) atoms[i] = 2; }
    if (mode === 'one') for (let i = 0; i < atoms.length; i++) if (atoms[i] === 1) atoms[i] = 2;
    let c0 = 0, c1 = 0; atoms.forEach((a) => { if (a === 0) c0++; else if (a === 1) c1++; });
    rec.push([t, c0, mode === 'chain' ? c1 : 0]); if (t > 6 * T1 * (mode === 'chain' ? 1 : 1)) { atoms = new Uint8Array(atoms.length); t = 0; rec = []; }
    cv.redraw(); show();
  });
  anim.button(ctl2);
  const N0 = COLS * ROWS;
  function show() {
    const l1 = Math.LN2 / T1, l2 = Math.LN2 / T2, last = rec[rec.length - 1] || [0, N0, 0];
    const base = `After <b>${t.toFixed(1)} s</b> there are ${last[1]} parent nuclei left; expected N₀e^(−λt) = <b>${(N0 * Math.exp(-l1 * t)).toFixed(0)}</b> (λ = ${l1.toFixed(3)}/s). Each nucleus has the same ${(100 * (1 - Math.exp(-l1 * 0.1))).toFixed(1)}% chance of decaying in each 0.1 s, however old it is.`;
    out.innerHTML = mode === 'one' ? base : base + ` Daughters: ${last[2]}. ` + (T1 > 8 * T2 ? 'Secular equilibrium: the parent barely changes, so the daughter reaches the same activity as the parent.' : T1 > T2 ? 'Transient equilibrium: after a while the daughter decays at a fixed ratio to the parent, activity ratio T₁/(T₁ − T₂).' : 'No equilibrium: the daughter lives longer than the parent, so it piles up and outlasts it.');
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'one' ? 'Each square is one nucleus' : 'Parent → daughter → stable', col);
    const gh = Math.round(h * 0.4), c = Math.min((w - 20) / COLS, (gh - 30) / ROWS), x0 = (w - c * COLS) / 2, y0 = 36;
    atoms.forEach((a, i) => { const x = x0 + (i % COLS) * c, y = y0 + Math.floor(i / COLS) * c; ctx.fillStyle = a === 0 ? col.s[0] : a === 1 ? col.s[1] : col.line; ctx.fillRect(x + 1, y + 1, c - 2, c - 2); });
    const a = axes(ctx, w, h, col, { x: [0, 6 * T1], y: [0, N0], l: 44, t: y0 + c * ROWS + 22, b: 38, xlabel: 'time (s)', ylabel: 'nuclei', yt: [0, N0 / 2, N0], xt: [0, 2 * T1, 4 * T1, 6 * T1].map((v) => +v.toFixed(1)) });
    const l1 = Math.LN2 / T1, l2 = Math.LN2 / T2;
    line(ctx, Array.from({ length: 61 }, (_, i) => { const tt = (i / 60) * 6 * T1; return [a.X(tt), a.Y(N0 * Math.exp(-l1 * tt))]; }), col.muted, 1.5, [5, 4]);
    if (mode === 'chain') line(ctx, Array.from({ length: 61 }, (_, i) => { const tt = (i / 60) * 6 * T1; const nd = Math.abs(l2 - l1) < 1e-9 ? N0 * l1 * tt * Math.exp(-l1 * tt) : (N0 * l1 / (l2 - l1)) * (Math.exp(-l1 * tt) - Math.exp(-l2 * tt)); return [a.X(tt), a.Y(nd)]; }), col.muted, 1.5, [2, 3]);
    if (rec.length > 1) { line(ctx, rec.map((r) => [a.X(r[0]), a.Y(r[1])]), col.s[0], 2); if (mode === 'chain') line(ctx, rec.map((r) => [a.X(r[0]), a.Y(r[2])]), col.s[1], 2); }
    text(ctx, 'dashed = theory', a.R - 4, a.T + 8, { color: col.muted, size: 10, align: 'right' });
  };
  init();
}
