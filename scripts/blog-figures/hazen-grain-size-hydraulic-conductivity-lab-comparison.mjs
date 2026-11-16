// Figures for src/blog/discoveries/hazen-grain-size-hydraulic-conductivity-lab-comparison.md, made with the maths of the
// Darcy flow calculator (src/lib/sci/darcy.ts: gradation, hazen, darcy, waterViscosity, G).
// Run: node scripts/blog-figures/hazen-grain-size-hydraulic-conductivity-lab-comparison.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { gradation, hazen, darcy, waterViscosity, waterDensity, G } from '../../src/lib/sci/darcy.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hazen-grain-size-hydraulic-conductivity-lab-comparison.md', import.meta.url);

// "Paper": Goodarzi, Vazirian and Niazkar (2024), Water 16(13), 1854, doi:10.3390/w16131854 (CC BY): lab K of soils A to F
// = 4.02, 5.93, 6.95, 7.73, 8.19, 8.78 mm/s; the coefficient forms of modified Hazen, Breyer and Kozeny-Carman.
// "Ours": the sieve curve below (a made-up coarse sand), porosity 0.35, water at 20 °C, the flow example.
const LAB = [4.02, 5.93, 6.95, 7.73, 8.19, 8.78]; // mm/s
const d10For = (Kmms, C) => 10 * Math.sqrt((100 * Kmms / 1000) / C); // invert hazen(): K (m/s) = C (d10/10)² / 100
const back = LAB.map((k) => ({ k, d40: d10For(k, 40), d100: d10For(k, 100), d150: d10For(k, 150) }));

// Figure 1: Hazen K against d10 for three textbook coefficients, with the range of the paper's lab values.
const d = Array.from({ length: 141 }, (_, i) => +(0.1 + i * 0.01).toFixed(2));
const fig1 = chart({
  title: 'Hazen K for three coefficients, against the lab range', xLabel: 'd10 (mm)', yLabel: 'K (mm/s)',
  series: [150, 100, 40].map((C) => ({ name: `C = ${C}`, kind: 'line', x: d, y: d.map((x) => +(hazen(x, C) * 1000).toFixed(3)) })),
  hlines: [{ y: LAB[0], text: 'lowest lab K, 4.02' }, { y: LAB[5], text: 'highest lab K, 8.78' }],
  yDomain: [0, 15], xDomain: [0.1, 1.5], height: 260,
  desc: `Hazen K rises with the square of d10. To match the lab values of 4.02 to 8.78 mm/s, C = 100 needs d10 of ${back[0].d100.toFixed(2)} to ${back[5].d100.toFixed(2)} mm.`,
});

// Our made-up coarse sand, through the tool's gradation(), Hazen and the paper's other formula forms (script only).
const SIEVE = [[9.5, 100], [4.75, 92], [2.36, 75], [1.18, 48], [0.6, 22], [0.3, 6], [0.15, 1]];
const g = gradation(SIEVE.map((r) => r[0]), SIEVE.map((r) => r[1]));
const n = 0.35, T = 20, gn = G / (waterViscosity(T) / waterDensity(T)), d10m = g.d10 / 1000; // g/ν in 1/(m·s)
const est = {
  'Hazen (C = 100)': hazen(g.d10, 100),
  'Modified Hazen': gn * 6e-4 * (1 + 10 * (n - 0.26)) * d10m ** 2,
  'Breyer': gn * 6e-4 * Math.log10(500 / g.Cu) * d10m ** 2,
  'Kozeny-Carman': gn * 8.3e-3 * (n ** 3 / (1 - n) ** 2) * d10m ** 2,
  'Slichter': gn * 1e-2 * n ** 3.287 * d10m ** 2,
};
const names = Object.keys(est);
const fig2 = chart({
  title: 'One made-up coarse sand, five formulas', xLabel: 'Formula (1 Hazen, 2 mod. Hazen, 3 Breyer, 4 Kozeny-Carman, 5 Slichter)', yLabel: 'K (mm/s)',
  series: [{ name: 'Estimate', kind: 'dots', x: names.map((_, i) => i + 1), y: names.map((k) => +(est[k] * 1000).toFixed(3)), size: 5 },
    ...names.map((k, i) => ({ name: '', noLegend: true, kind: 'dots', x: [i + 1], y: [+(est[k] * 1000).toFixed(3)], size: 0.1, label: { text: (est[k] * 1000).toFixed(1), dx: 8, dy: 4 } }))],
  xDomain: [0.5, 5.5], yDomain: [0, 2], xTicks: [1, 2, 3, 4, 5], height: 240,
  desc: `For a sand with d10 = ${g.d10.toFixed(2)} mm and Cu = ${g.Cu.toFixed(1)}, the five formulas give ${names.map((k) => (est[k] * 1000).toFixed(1)).join(', ')} mm/s.`,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'hazen', figure(fig1, 'Figure 1. Hazen\'s rule from the Darcy flow calculator\'s maths for C = 40, 100 and 150, with the lowest and highest lab conductivities the paper reports (dashed). Our recomputation, not the paper\'s figure.'));
md = inject(md, 'formulas', figure(fig2, 'Figure 2. A made-up coarse sand (our sieve numbers, porosity 0.35, water at 20 °C) run through Hazen as the tool does it, and through the paper\'s coefficient forms of four other formulas in our script. An illustration, not the paper\'s soils.'));
fs.writeFileSync(ART, md);

console.log('back-solved d10 mm (C=40/100/150):', back.map((b) => `${b.k}: ${b.d40.toFixed(3)}/${b.d100.toFixed(3)}/${b.d150.toFixed(3)}`).join('; '));
console.log('sand', g, 'g/nu', gn.toFixed(0));
for (const k of names) console.log(k, (est[k] * 1000).toFixed(3), 'mm/s', (est[k] * 86400).toFixed(1), 'm/day');
const fl = darcy(est['Hazen (C = 100)'], 0.005, 100, 0.3, 100);
console.log('darcy', fl);
console.log('sizes', fig1.length, fig2.length);
