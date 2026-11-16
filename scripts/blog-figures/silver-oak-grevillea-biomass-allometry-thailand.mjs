// Figures for src/blog/discoveries/silver-oak-grevillea-biomass-allometry-thailand.md, made with the maths of the
// Allometry calculator (src/lib/sci/allomfit.ts) and the Tree carbon calculator (src/lib/sci/treecarbon.ts).
// Run: node scripts/blog-figures/silver-oak-grevillea-biomass-allometry-thailand.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fitAllometry, predictY } from '../../src/lib/sci/allomfit.ts';
import { forest, stock, agb } from '../../src/lib/sci/treecarbon.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/silver-oak-grevillea-biomass-allometry-thailand.md', import.meta.url);

// Inputs from the paper: Uttaruk et al. (2026), Forests 17: 100, doi:10.3390/f17010100 (CC BY). One harvested tree per age,
// 2 to 9 years: height (m), DBH (cm), above-ground dry biomass (kg), root dry biomass (kg).
const TREES = [
  { age: 2, H: 6.65, D: 6.05, agb: 17.49, root: 7.42 }, { age: 3, H: 7.5, D: 7.16, agb: 13.94, root: 4.06 },
  { age: 4, H: 16.9, D: 13.7, agb: 75.05, root: 26.94 }, { age: 5, H: 19.3, D: 15.2, agb: 93.11, root: 34.75 },
  { age: 6, H: 19.34, D: 22.0, agb: 137.29, root: 39.04 }, { age: 7, H: 18.5, D: 21.0, agb: 198.22, root: 29.62 },
  { age: 8, H: 20.4, D: 35.0, agb: 444.77, root: 122.97 }, { age: 9, H: 19.0, D: 36.8, agb: 860.42, root: 103.9 },
];
const PAPER = { form: 'rdh', a: 0.1609, b: 0.7846, rho: 1 }; // the paper's AGB equation, a (D²H)^b
const CF = 0.47135; // the paper's mean carbon fraction of all parts

const X = TREES.map((t) => t.D * t.D * t.H), Y = TREES.map((t) => t.agb);
const fit = fitAllometry(X, Y);
const duan = X.reduce((s, x, i) => s + Y[i] / (fit.a * x ** fit.b), 0) / X.length; // Duan's smearing factor
const fit7 = fitAllometry(X.slice(0, 7), Y.slice(0, 7));
const rs = TREES.reduce((s, t) => s + t.root, 0) / TREES.reduce((s, t) => s + t.agb, 0); // pooled root-to-shoot ratio
const carbon = forest(TREES.map((t) => ({ id: `${t.age} y`, D: t.D, H: t.H })), PAPER, rs, CF, {});
const measured = TREES.map((t) => stock(t.agb, t.root / t.agb, CF));
const pred9 = predictY(fit, X[7]);
const yPaper = X.map((x) => agb(PAPER, Math.sqrt(x), 1));
const mY = Y.reduce((s, v) => s + v, 0) / Y.length, r2raw = 1 - Y.reduce((s, y, i) => s + (y - yPaper[i]) ** 2, 0) / Y.reduce((s, y) => s + (y - mY) ** 2, 0);

// Figure 1: log-log plot with the paper's line, our refit and the 95 % prediction limits.
const lx = Array.from({ length: 41 }, (_, i) => 2.3 + i * 0.05);
const pw = (t) => (Math.abs(t - Math.round(t)) < 1e-9 ? String(10 ** Math.round(t)) : '');
const fig1 = chart({
  title: 'Silver oak: above-ground biomass against D²H', xLabel: 'D²H (cm² m, log scale)', yLabel: 'Dry biomass (kg, log scale)',
  series: [
    { name: 'Harvested trees', kind: 'dots', x: X.map((x) => +Math.log10(x).toFixed(3)), y: Y.map((y) => +Math.log10(y).toFixed(3)), size: 4 },
    { name: 'Paper equation', kind: 'line', x: lx, y: lx.map((t) => +Math.log10(PAPER.a * (10 ** t) ** PAPER.b).toFixed(3)) },
    { name: '95 % prediction', kind: 'line', x: lx, y: lx.map((t) => +Math.log10(predictY(fit, 10 ** t).piHi).toFixed(3)), dash: '3 3', colour: 'var(--muted)' },
    { name: '', noLegend: true, kind: 'line', x: lx, y: lx.map((t) => +Math.log10(predictY(fit, 10 ** t).piLo).toFixed(3)), dash: '3 3', colour: 'var(--muted)' },
  ],
  xDomain: [2.3, 4.3], yDomain: [0.5, 3.5], xTicks: [3, 4], yTicks: [1, 2, 3], xFmt: pw, yFmt: pw,
  desc: `Eight harvested silver oak trees on log scales with the paper's equation and the 95 % prediction limits of our refit. The 9-year tree (860 kg) sits above the line (${pred9.y.toFixed(0)} kg predicted) but inside the limits.`, height: 280,
});
// Figure 2: CO₂ held per tree, from the paper's equation and from the weighed biomass.
const ages = TREES.map((t) => t.age);
const fig2 = chart({
  title: 'CO₂ held in each tree, by age', xLabel: 'Age (years)', yLabel: 'CO₂ equivalent (kg per tree)',
  series: [
    { name: 'From weighed biomass', kind: 'dots', x: ages, y: measured.map((m) => +m.co2.toFixed(1)), size: 4 },
    { name: 'From the paper equation', kind: 'dots', x: ages, y: carbon.rows.map((r) => +r.co2.toFixed(1)), size: 4 },
  ],
  xDomain: [1.5, 9.5], yDomain: [0, 1800], xTicks: [2, 3, 4, 5, 6, 7, 8, 9],
  desc: `Whole-tree CO2 equivalent for each harvested tree: from the weighed biomass (roots included) and from the paper's AGB equation with a root-to-shoot ratio of ${rs.toFixed(2)}. They agree up to 8 years; at 9 years the equation gives about half.`, height: 260,
});

const facts = { X: X.map((x) => +x.toFixed(1)), fit: { a: fit.a.toFixed(4), b: fit.b.toFixed(4), bLo: fit.bLo.toFixed(3), bHi: fit.bHi.toFixed(3), r2: fit.r2.toFixed(3), s: fit.s.toFixed(3), cf: fit.cf.toFixed(4), duan: duan.toFixed(4), aDuan: (fit.a * duan).toFixed(4), aCf: (fit.a * fit.cf).toFixed(4) }, fit7: { a: fit7.a.toFixed(4), b: fit7.b.toFixed(4) }, rs: rs.toFixed(3), r2raw: r2raw.toFixed(3), pred9: { y: pred9.y.toFixed(1), piLo: pred9.piLo.toFixed(0), piHi: pred9.piHi.toFixed(0) },
  paperPred: yPaper.map((v) => +v.toFixed(1)), co2Eq: carbon.rows.map((r) => +r.co2.toFixed(0)), co2Meas: measured.map((m) => +m.co2.toFixed(0)), c9: carbon.rows[7].c.toFixed(1) };
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'allo', figure(fig1, 'Figure 1. The eight harvested trees (weighed above-ground dry biomass against D²H, both on log scales), the paper\'s equation 0.1609 (D²H)^0.7846, and the 95 % prediction limits for one new tree from our refit with the Allometry calculator\'s maths.'));
  md = inject(md, 'co2', figure(fig2, 'Figure 2. CO₂ held in each harvested tree (above and below ground, carbon fraction 0.471), worked out with the Tree carbon calculator\'s maths: from the weighed biomass, and from the paper\'s equation with the pooled root-to-shoot ratio.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
