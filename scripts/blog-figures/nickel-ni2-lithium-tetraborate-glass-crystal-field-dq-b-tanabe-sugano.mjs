// Figures for src/blog/discoveries/nickel-ni2-lithium-tetraborate-glass-crystal-field-dq-b-tanabe-sugano.md, made with the
// maths of the Tanabe–Sugano diagram calculator (src/lib/sci/tanabe.ts: the full d-electron energy matrix and fitTwoBands).
// Run: node scripts/blog-figures/nickel-ni2-lithium-tetraborate-glass-crystal-field-dq-b-tanabe-sugano.mjs
import fs from 'node:fs';
import { levels, diagram, readAt, fitTwoBands } from '../../src/lib/sci/tanabe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/nickel-ni2-lithium-tetraborate-glass-crystal-field-dq-b-tanabe-sugano.md', import.meta.url);

// Inputs from the paper: Kindrat, Padlyak, Drzewiecki and Lisiecki (2026), Materials 19(20): 4303, doi:10.3390/ma19204303 (CC BY).
// Band centres (cm-1) of Ni2+ in Li2B4O7 glass and the paper's fitted Dq, B and C/B.
const NU1 = 7057, NU2 = 12270, NU3 = 23364; // 3A2g -> 3T2g, 3T1g(F), 3T1g(P)
const PAPER = { Dq: 720.3, B: 928.7, CB: 4.25 };
const OTHER = [ // spin-forbidden bands the paper also assigns (cm-1)
  { key: '1E#1', obs: 14620, what: 'red emission, 684 nm' },
  { key: '1T2#1', obs: 21413, what: 'excitation band, 467 nm' },
  { key: '1T1#1', obs: 26247, what: 'excitation band, 381 nm' },
];

// The three spin-allowed bands (cm-1) for a given Dq and B at C/B = 4.25, from the full matrix.
const bands = (Dq, B, g = PAPER.CB) => {
  const L = levels(8, (10 * Dq) / B, g), e0 = L[0].E;
  const f = (ir, k) => (L.find((l) => l.mult === 3 && l.irrep === ir && l.k === k).E - e0) * B;
  return [f('T2', 1), f('T1', 1), f('T1', 2)];
};
// 1. Every level at the paper's parameters.
const xP = (10 * PAPER.Dq) / PAPER.B;
const at = readAt(8, xP, PAPER.CB).map((l) => ({ label: l.label, key: `${l.mult}${l.irrep}#${l.k}`, cm: l.E * PAPER.B }));
const calc = bands(PAPER.Dq, PAPER.B);
// 2. The paper's two-band estimates, redone: nu1 with nu3, and nu2 with nu3 (least squares on a fine grid).
const solveB = (Dq, i, target) => { let lo = 300, hi = 3000; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; bands(Dq, m)[i] < target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const p13 = { Dq: NU1 / 10, B: solveB(NU1 / 10, 2, NU3) };
const grid = (use) => { let best = null; for (let Dq = 680; Dq <= 760; Dq += 0.1) for (let B = 880; B <= 980; B += 0.1) { const b = bands(Dq, B); const e = use.reduce((s, i) => s + (b[i] - [NU1, NU2, NU3][i]) ** 2, 0); if (!best || e < best.e) best = { Dq, B, e }; } return best; };
const p23 = grid([1, 2]);
const p123 = grid([0, 1, 2]);
const fitB = bands(p123.Dq, p123.B);
// 3. The tool's own two-band box (nu1 and nu2 only).
const two = fitTwoBands(8, NU1, NU2, PAPER.CB);
// Ratios against Delta/B, for the sensitivity chart.
const XS = Array.from({ length: 81 }, (_, i) => 1 + i * 0.25);
const ratios = XS.map((x) => { const L = levels(8, x, PAPER.CB), e0 = L[0].E; const f = (ir, k) => L.find((l) => l.mult === 3 && l.irrep === ir && l.k === k).E - e0; return [f('T1', 1) / f('T2', 1), f('T1', 2) / f('T2', 1)]; });

// Chart 1: the d8 diagram near the glass, spin-allowed triplets and the three singlets the paper uses.
const D = diagram(8, PAPER.CB, 16, 64);
const keep = new Set(['3T2#1', '3T1#1', '3T1#2', ...OTHER.map((o) => o.key)]);
const curves = D.curves.filter((c) => keep.has(c.key));
const fig1 = chart({
  title: 'Ni²⁺ (d⁸) energy levels, C/B = 4.25', xLabel: 'Ligand field Δ/B', yLabel: 'Energy E/B above the ground state',
  series: [
    ...curves.map((c) => ({ name: '', noLegend: true, kind: 'line', x: c.x.map((v) => +v.toFixed(3)), y: c.y.map((v) => +v.toFixed(3)), colour: c.mult === 3 ? 'var(--c-tools)' : 'var(--muted)', dash: c.mult === 3 ? undefined : '5 4', label: { text: c.label, at: [c.x[c.x.length - 1], c.y[c.y.length - 1]], dx: -4, dy: -5, anchor: 'end' } })),
    { name: 'Measured bands', kind: 'dots', x: [NU1, NU2, NU3, ...OTHER.map((o) => o.obs)].map(() => +xP.toFixed(3)), y: [NU1, NU2, NU3, ...OTHER.map((o) => o.obs)].map((v) => +(v / PAPER.B).toFixed(3)), colour: 'var(--c-blog)', size: 3.5 },
  ],
  xDomain: [0, 16], yDomain: [0, 36], vlines: [{ x: +xP.toFixed(2), text: `Δ/B = ${xP.toFixed(2)}` }],
  desc: `Tanabe–Sugano levels for d8 at C/B 4.25. At the glass's Δ/B of ${xP.toFixed(2)} the six measured bands sit on their curves.`, height: 320,
});
const fig2 = chart({
  title: 'Which band ratio pins down Δ/B?', xLabel: 'Ligand field Δ/B', yLabel: 'Band ratio',
  series: [
    { name: 'ν2/ν1 (³T₁g(F) over ³T₂g)', kind: 'line', x: XS, y: ratios.map((r) => +r[0].toFixed(4)) },
    { name: 'ν3/ν1 (³T₁g(P) over ³T₂g)', kind: 'line', x: XS, y: ratios.map((r) => +r[1].toFixed(4)) },
  ],
  xDomain: [1, 21], yDomain: [1, 7],
  hlines: [{ y: +(NU2 / NU1).toFixed(3), text: `measured ν2/ν1 = ${(NU2 / NU1).toFixed(3)}` }, { y: +(NU3 / NU1).toFixed(3), text: `measured ν3/ν1 = ${(NU3 / NU1).toFixed(3)}` }],
  vlines: [{ x: +two.x.toFixed(2), text: `${two.x.toFixed(2)}`, left: true }, { x: +xP.toFixed(2), text: `${xP.toFixed(2)}` }],
  desc: `The ratio nu2/nu1 barely changes with the ligand field, so a small error in nu2 moves Delta/B from ${xP.toFixed(2)} to ${two.x.toFixed(2)}; nu3/nu1 changes steeply and fixes it.`, height: 280,
});

const r0 = (v) => Math.round(v);
console.log(JSON.stringify({
  xP: +xP.toFixed(3), calc: calc.map(r0), others: OTHER.map((o) => ({ ...o, calc: r0(at.find((a) => a.key === o.key).cm) })),
  lowest: at.slice(0, 10).map((a) => [a.label, r0(a.cm), r0(1e7 / a.cm)]),
  p13: { Dq: +p13.Dq.toFixed(1), B: +p13.B.toFixed(1) }, p23: { Dq: +p23.Dq.toFixed(1), B: +p23.B.toFixed(1) },
  p123: { Dq: +p123.Dq.toFixed(1), B: +p123.B.toFixed(1), DqB: +(p123.Dq / p123.B).toFixed(4), rms: +Math.sqrt(p123.e / 3).toFixed(1), bands: fitB.map(r0) },
  two: { Delta: r0(two.Delta), B: r0(two.B), x: +two.x.toFixed(2), nu3: r0(two.nu3), nm3: r0(1e7 / two.nu3) },
  ratiosObs: [+(NU2 / NU1).toFixed(4), +(NU3 / NU1).toFixed(4)], betaB: [+(PAPER.B / 1030).toFixed(4), +(PAPER.B / 1068).toFixed(4)],
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'diagram', figure(fig1, `Figure 1. Part of the d⁸ Tanabe–Sugano diagram at C/B = 4.25, worked out by the Tanabe–Sugano diagram calculator's maths: solid lines are the spin-allowed triplets, dashed lines the three singlets the paper assigns. Dots are the six band centres stated in the paper, divided by its B of ${PAPER.B} cm⁻¹ and placed at its Δ/B of ${xP.toFixed(2)}.`));
  md = inject(md, 'ratios', figure(fig2, 'Figure 2. The two band ratios a Ni²⁺ spectrum offers, against the ligand field Δ/B (C/B = 4.25). The ν2/ν1 curve is almost flat, so on its own it fixes Δ/B badly; the steep ν3/ν1 curve does the work. Dashed lines: the ratios measured in the glass.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
