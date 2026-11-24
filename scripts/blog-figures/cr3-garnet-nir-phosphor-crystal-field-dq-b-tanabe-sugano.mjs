// Figures for src/blog/discoveries/cr3-garnet-nir-phosphor-crystal-field-dq-b-tanabe-sugano.md, made with the maths of the
// Tanabe–Sugano diagram calculator (src/lib/sci/tanabe.ts: levels, diagram and fitTwoBands for d3).
// Run: node scripts/blog-figures/cr3-garnet-nir-phosphor-crystal-field-dq-b-tanabe-sugano.mjs
import fs from 'node:fs';
import { levels, diagram, fitTwoBands } from '../../src/lib/sci/tanabe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cr3-garnet-nir-phosphor-crystal-field-dq-b-tanabe-sugano.md', import.meta.url);

// Inputs from the paper: Yang (2024), Molecules 29(17): 4253, doi:10.3390/molecules29174253 (CC BY).
// Excitation peaks 657 nm (4A2 -> 4T2) and 467 nm (4A2 -> 4T1(F)); emission peak 758 nm; stated Dq 1319, B 663, Dq/B 1.99.
const EX1 = 657, EX2 = 467, EM = 758, PAPER = { Dq: 1319, B: 663, DqB: 1.99 };
const CB = 4.5;          // C/B: OUR assumption (the usual textbook value); it moves only the doublets (2E), not the quartet fit
const B_FREE = 918;      // free-ion B of Cr3+ in cm-1 (textbook value, Lever 1984), for the nephelauxetic ratio
const cm = (nm) => 1e7 / nm;
const fit = fitTwoBands(3, cm(EX1), cm(EX2), CB);           // the excitation peaks, as the method intends
const fitEm = fitTwoBands(3, cm(EM), cm(EX2), CB);          // emission peak in place of the first band
const closed = (a, b) => (2 * a * a + b * b - 3 * a * b) / (15 * b - 27 * a); // textbook closed form for B (d3)
// The usual formula in phosphor papers, Dq/B = 15(x - 8)/(x^2 - 10x) with x = (nu2 - nu1)/Dq.
const formula = (n1, n2) => { const Dq = n1 / 10, x = (n2 - n1) / Dq; return (15 * (x - 8)) / (x * x - 10 * x); };
// What nu2 would the paper's own Dq and B need? (bisection on the full matrix)
const nu2For = (Dq, B) => { const L = levels(3, (10 * Dq) / B, CB), e0 = L[0].E; return (L.find((l) => l.mult === 4 && l.irrep === 'T1' && l.k === 1).E - e0) * B; };
const nu2Paper = nu2For(PAPER.Dq, PAPER.B);
// Where 2E crosses 4T2 (the line between narrow-line and broadband emission), at C/B = 4.5.
const gap = (x) => { const L = levels(3, x, CB), e0 = L[0].E; return (L.find((l) => l.mult === 2 && l.irrep === 'E' && l.k === 1).E - e0) - (L.find((l) => l.mult === 4 && l.irrep === 'T2' && l.k === 1).E - e0); };
let lo = 10, hi = 40; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; gap(m) > 0 ? (lo = m) : (hi = m); } const xCross = (lo + hi) / 2;

// Chart 1: the d3 diagram near the crossover.
const D = diagram(3, CB, 40, 80);
const keep = new Set(['4T2#1', '4T1#1', '2E#1', '2T1#1']);
const curves = D.curves.filter((c) => keep.has(c.key));
const fig1 = chart({
  title: 'Cr³⁺ (d³) levels near the 2E / 4T2 crossover', xLabel: 'Ligand field Δ/B (= 10 Dq/B)', yLabel: 'Energy E/B above ⁴A₂g',
  series: [
    ...curves.map((c) => ({ name: '', noLegend: true, kind: 'line', x: c.x.map((v) => +v.toFixed(2)), y: c.y.map((v) => +v.toFixed(3)), colour: c.mult === 4 ? 'var(--c-tools)' : 'var(--muted)', dash: c.mult === 4 ? undefined : '5 4', label: { text: c.label, at: [c.x[c.x.length - 1], c.y[c.y.length - 1]], dx: -4, dy: c.key === '2T1#1' ? 14 : -5, anchor: 'end' } })),
    { name: 'Excitation peaks / B', kind: 'dots', x: [fit.x, fit.x].map((v) => +v.toFixed(2)), y: [cm(EX1) / fit.B, cm(EX2) / fit.B].map((v) => +v.toFixed(3)), colour: 'var(--c-blog)', size: 3.5 },
  ],
  xDomain: [10, 40], yDomain: [0, 60],
  vlines: [{ x: +(10 * PAPER.DqB).toFixed(2), text: `paper ${(10 * PAPER.DqB).toFixed(1)}`, left: true }, { x: +fit.x.toFixed(2), text: `tool ${fit.x.toFixed(1)}`, dy: 14 }],
  desc: `d3 Tanabe–Sugano levels at C/B 4.5. 2E crosses 4T2 at Delta/B ${xCross.toFixed(1)}; the excitation peaks give ${fit.x.toFixed(1)}, the paper states ${(10 * PAPER.DqB).toFixed(1)}.`, height: 300,
});
// Chart 2: Dq/B against the wavelength taken as the 4T2 band, with nu2 at 467 nm.
const NM = Array.from({ length: 61 }, (_, i) => 630 + i * 2.5);
const fig2 = chart({
  title: 'Dq/B depends on which peak you call ν1', xLabel: 'Wavelength used for ⁴A₂ → ⁴T₂ (nm), with ν2 at 467 nm', yLabel: 'Dq/B',
  series: [
    { name: 'Tool (full matrix)', kind: 'line', x: NM, y: NM.map((l) => +(fitTwoBands(3, cm(l), cm(EX2), CB).x / 10).toFixed(4)) },
    { name: 'Excitation 657 / emission 758 nm', kind: 'dots', x: [EX1, EM], y: [fit.x / 10, fitEm.x / 10].map((v) => +v.toFixed(3)), size: 3.5 },
  ],
  xDomain: [630, 780], yDomain: [0.8, 3],
  hlines: [{ y: +(xCross / 10).toFixed(3), text: `²E = ⁴T₂ at ${(xCross / 10).toFixed(2)}` }, { y: PAPER.DqB, text: `paper ${PAPER.DqB}` }],
  desc: `Dq/B from the tool for a first band between 630 and 780 nm. The 657 nm excitation peak gives ${(fit.x / 10).toFixed(2)}; the 758 nm emission peak gives ${(fitEm.x / 10).toFixed(2)}.`, height: 270,
});

console.log(JSON.stringify({
  nu1: +cm(EX1).toFixed(0), nu2: +cm(EX2).toFixed(0), nuEm: +cm(EM).toFixed(0),
  fit: { Dq: +(fit.Delta / 10).toFixed(1), B: +fit.B.toFixed(1), DqB: +(fit.x / 10).toFixed(3), x: +fit.x.toFixed(2), nu3: Math.round(fit.nu3), nm3: Math.round(1e7 / fit.nu3), beta: +(fit.B / B_FREE).toFixed(3) },
  closedB: +closed(cm(EX1), cm(EX2)).toFixed(1), formulaDqB: +formula(cm(EX1), cm(EX2)).toFixed(3),
  fitEm: { Dq: +(fitEm.Delta / 10).toFixed(1), B: +fitEm.B.toFixed(1), DqB: +(fitEm.x / 10).toFixed(3), beta: +(fitEm.B / B_FREE).toFixed(3) },
  paperDqOverB: +(PAPER.Dq / PAPER.B).toFixed(3), dqFromEm: +(cm(EM) / 10).toFixed(1),
  nu2Paper: Math.round(nu2Paper), nm2Paper: Math.round(1e7 / nu2Paper), xCross: +xCross.toFixed(2), DqBcross: +(xCross / 10).toFixed(3),
  stokes: Math.round(cm(EX1) - cm(EM)), paperDqWithNu1: +(cm(EX1) / 10 / PAPER.B).toFixed(3),
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'diagram', figure(fig1, `Figure 1. Part of the d³ Tanabe–Sugano diagram at C/B = 4.5 (our assumption), worked out by the Tanabe–Sugano diagram calculator's maths. Solid lines: quartets; dashed: doublets. Dots: the paper's two excitation peaks divided by the B the tool fits to them. The dashed verticals mark the paper's stated Δ/B and the tool's.`));
  md = inject(md, 'sensitivity', figure(fig2, 'Figure 2. The Dq/B the tool returns when the second band is held at 467 nm and the first band is read anywhere from 630 to 780 nm. The paper\'s 657 nm excitation peak gives 2.44; its 758 nm emission peak, the source of its Dq, gives 1.13. Neither gives the stated 1.99.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
