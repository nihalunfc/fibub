// Figures for src/blog/discoveries/few-mode-fibre-mode-count-810-nm-v-number-lp-cutoffs.md, made with the maths of
// the Fibre optic calculator (src/lib/sci/phfibre.ts: basics for NA, V and the single-mode cut-off, lpModes for the
// guided LP groups and their degeneracies).
// Run: node scripts/blog-figures/few-mode-fibre-mode-count-810-nm-v-number-lp-cutoffs.mjs
import fs from 'node:fs';
import { basics, lpModes } from '../../src/lib/sci/phfibre.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/few-mode-fibre-mode-count-810-nm-v-number-lp-cutoffs.md', import.meta.url);

// From the paper: Cifuentes, Varga and Molina-Terriza (2025), Photonics 12(7): 716, doi:10.3390/photonics12070716
// (CC BY). Three step-index fibres used at 810 nm, stated by numerical aperture and core diameter, said to carry
// 6, 12 and 16 modes. The core index n1 = 1.4533 (fused silica near 810 nm) is OUR assumption; it changes nothing in
// V or the mode count, because those depend only on the numerical aperture, the core radius and the wavelength.
const N1 = 1.4533;
const FIBRES = [
  { tag: 'I', NA: 0.14, dUm: 6, said: 6 },
  { tag: 'II', NA: 0.13, dUm: 9, said: 12 },
  { tag: 'III', NA: 0.12, dUm: 12, said: 16 },
];
const fibreAt = (f, lamNm) => ({ n1: N1, n2: Math.sqrt(N1 * N1 - f.NA * f.NA), aUm: f.dUm / 2, lamNm });
const modeCount = (V) => lpModes(V).reduce((s, m) => s + m.degeneracy, 0);

const LAM = [];
for (let l = 700; l <= 2100; l += 10) LAM.push(l);

const vSeries = FIBRES.map((f) => ({
  name: `Fibre ${f.tag} (${f.dUm} µm, NA ${f.NA})`,
  x: LAM,
  y: LAM.map((l) => basics(fibreAt(f, l)).V),
  kind: 'line',
}));

const CUTS = [
  { V: 2.4048255576957724, label: 'LP11' },
  { V: 3.8317059702075125, label: 'LP21, LP02' },
  { V: 5.135622301840683, label: 'LP31' },
  { V: 5.520078110286311, label: 'LP12' },
];

const fig1 = figure(
  chart({
    title: 'V-number against wavelength, and the LP cut-offs',
    xLabel: 'Wavelength (nm)',
    yLabel: 'V-number',
    series: vSeries,
    xDomain: [700, 2100],
    yDomain: [1.6, 6.6],
    hlines: CUTS.map((c) => ({ y: c.V, text: `${c.label} starts (V = ${c.V.toFixed(3)})` })),
    vlines: [{ x: 810, text: '810 nm', dy: 2 }],
    desc: 'The V-number of the three fibres falls as the wavelength rises. Dashed lines mark the V at which each LP mode group starts to be guided. At 810 nm fibre I is just above the LP11 line, fibre II above the LP21 and LP02 line, and fibre III just above the LP12 line.',
  }),
  'Figure 1. The V-number of each fibre against wavelength, worked out by the Fibre optic calculator’s maths from the numerical apertures and core diameters the paper gives. A mode group is guided once V passes its dashed line. At 810 nm fibre III sits only 1.2 % above the LP12 line.',
);

const countSeries = FIBRES.map((f) => ({
  name: `Fibre ${f.tag}`,
  x: LAM,
  y: LAM.map((l) => modeCount(basics(fibreAt(f, l)).V)),
  kind: 'step',
}));

const fig2 = figure(
  chart({
    title: 'Modes carried, counting polarisations and orientations',
    xLabel: 'Wavelength (nm)',
    yLabel: 'Number of modes',
    series: countSeries,
    xDomain: [700, 2100],
    yDomain: [0, 26],
    yTicks: [0, 2, 6, 12, 16, 20, 26],
    vlines: [{ x: 810, text: '810 nm', dy: 2 }, { x: 819.5, text: 'LP12 edge', dy: 18 }],
    desc: 'Staircase plots of the number of guided modes against wavelength for the three fibres. At 810 nm fibre I carries 6 modes, fibre II 12 and fibre III 20, dropping to 16 above 819.5 nm.',
  }),
  'Figure 2. The same three fibres as a staircase: each step is one LP group starting to be guided, counted with its two polarisations and, for l ≥ 1, its two orientations. Fibre III drops from 20 modes to 16 at 819.5 nm, only 9.5 nm above the wavelength used.',
);

// Numbers quoted in the text.
console.log('At 810 nm:');
for (const f of FIBRES) {
  const b = basics(fibreAt(f, 810));
  const ms = lpModes(b.V);
  console.log(
    `  Fibre ${f.tag}: NA ${b.NA.toFixed(4)}, delta ${(b.delta * 100).toFixed(4)} %, accept +-${b.accept.toFixed(3)} deg, V ${b.V.toFixed(4)}, cut-off ${b.cutoffNm.toFixed(1)} nm, ` +
      `${ms.length} LP groups, ${modeCount(b.V)} modes (V^2/2 = ${(b.V * b.V / 2).toFixed(2)}), paper says ${f.said}`,
  );
  console.log(`    ${ms.map((m) => `LP${m.l}${m.m} Vc=${m.vc.toFixed(4)} x${m.degeneracy}`).join(', ')}`);
}
const lamLP12 = (2 * Math.PI * 6 * 0.12 * 1000) / 5.520078110286311;
console.log(`Fibre III: LP12 stops being guided above ${lamLP12.toFixed(2)} nm;`);
console.log(`  at 810 nm it needs NA > ${((5.520078110286311 * 0.81) / (2 * Math.PI * 6)).toFixed(5)}`);
console.log(`  or a core wider than ${((2 * 5.520078110286311 * 0.81) / (2 * Math.PI * 0.12)).toFixed(3)} um`);

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'vnumber', fig1);
md = inject(md, 'modes', fig2);
fs.writeFileSync(ART, md);
console.log('Charts written into', ART.pathname);
