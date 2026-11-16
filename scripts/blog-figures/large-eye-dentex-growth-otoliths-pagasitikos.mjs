// Figures for src/blog/discoveries/large-eye-dentex-growth-otoliths-pagasitikos.md, made with the maths of the
// von Bertalanffy growth fitter (src/lib/sci/vbgf.ts) and the Fish length-weight tool (src/lib/sci/fishlw.ts).
// Run: node scripts/blog-figures/large-eye-dentex-growth-otoliths-pagasitikos.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { vb, fitVB } from '../../src/lib/sci/vbgf.ts';
import { fitLW } from '../../src/lib/sci/fishlw.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/large-eye-dentex-growth-otoliths-pagasitikos.md', import.meta.url);

// Inputs from the paper: Klaoudatos et al. (2025), Fishes 10(10): 500, doi:10.3390/fishes10100500 (CC BY).
const ALL = [25.97, 0.16, -2.69], FEM = [26.4, 0.15, -2.84], MAL = [30.9, 0.097, -4.16];
const PHI_PAPER = 2.076, M_PAPER = 0.37;
const LW_F = { a: 0.0995, b: 2.337 }, LW_M = { a: 0.0538, b: 2.542 };

// Recomputations straight from the stated parameters.
const phiCalc = Math.log10(ALL[1]) + 2 * Math.log10(ALL[0]);
const kForPhi = 10 ** (PHI_PAPER - 2 * Math.log10(ALL[0]));
const mThen = 4.118 * ALL[1] ** 0.73 * ALL[0] ** -0.33; // Then et al. (2015) Pauly-type formula, L∞ in cm
const atAge = [1, 2, 3, 4, 5, 6, 7, 8].map((t) => ({ t, all: +vb(t, ALL).toFixed(2), f: +vb(t, FEM).toFixed(2), m: +vb(t, MAL).toFixed(2) }));

// Simulation: 305 made-up fish aged 1 to 8 on the combined curve with a 1.5 cm spread (our assumption), refitted.
let seed = 20251006; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const AGEW = [10, 40, 70, 75, 55, 30, 15, 10]; // fish per age (our assumption, most fish 3 to 5 years old)
const age = [], len = [];
AGEW.forEach((n, i) => { for (let j = 0; j < n; j++) { const t = i + 1 + 0.5 * rnd(); age.push(+t.toFixed(2)); len.push(+(vb(t, ALL) + 1.5 * gauss()).toFixed(1)); } });
const fit = fitVB(age, len);
// Weights for the same fish from the female curve with 8 % scatter, refitted with the length-weight maths.
const wt = len.map((l) => +(LW_F.a * l ** LW_F.b * Math.exp(0.08 * gauss())).toFixed(1));
const lw = fitLW(len, wt, true);

const tt = Array.from({ length: 61 }, (_, i) => -3 + i * 0.25).filter((t) => t >= 0);
const idx = age.map((_, i) => i).filter((i) => i % 4 === 0); // every fourth fish, to keep the chart small
const fig1 = chart({
  title: 'Large-eye dentex: length at age', xLabel: 'Age (years)', yLabel: 'Total length (cm)',
  series: [
    { name: 'Simulated fish', kind: 'dots', x: idx.map((i) => age[i]), y: idx.map((i) => len[i]), size: 1.8, opacity: 0.6 },
    { name: 'Paper, both sexes', kind: 'line', x: tt, y: tt.map((t) => +vb(t, ALL).toFixed(2)) },
    { name: 'Refit', kind: 'line', x: tt, y: tt.map((t) => +vb(t, fit.p).toFixed(2)), dash: '5 4' },
  ],
  xDomain: [0, 12], yDomain: [0, 30], hlines: [{ y: ALL[0], text: 'L∞ 25.97 cm' }],
  desc: `Length at age for large-eye dentex. The paper's curve (L∞ 25.97 cm, K 0.16, t0 -2.69) and a refit to 305 simulated fish (L∞ ${fit.p[0].toFixed(1)}, K ${fit.p[1].toFixed(3)}) almost overlap.`, height: 280,
});

const LL = Array.from({ length: 31 }, (_, i) => 10 + i * 0.5);
const fig2 = chart({
  title: 'Weight at length: females and males', xLabel: 'Total length (cm)', yLabel: 'Weight (g)',
  series: [
    { name: 'Females (b 2.337)', kind: 'line', x: LL, y: LL.map((l) => +(LW_F.a * l ** LW_F.b).toFixed(1)) },
    { name: 'Males (b 2.542)', kind: 'line', x: LL, y: LL.map((l) => +(LW_M.a * l ** LW_M.b).toFixed(1)) },
    { name: 'Cube law, same weight at 17 cm', kind: 'line', x: LL, y: LL.map((l) => +(LW_F.a * 17 ** LW_F.b * (l / 17) ** 3).toFixed(1)), dash: '3 3' },
  ],
  xDomain: [10, 25], yDomain: [0, 250],
  desc: 'Weight at length from the paper\'s female and male length-weight equations, with a cube-law curve for comparison. Both sexes gain weight more slowly than the cube of length (negative allometry).', height: 280,
});

const facts = { phiCalc: phiCalc.toFixed(3), kForPhi: kForPhi.toFixed(4), mThen: mThen.toFixed(3), atAge, fit: { p: fit.p.map((v) => +v.toFixed(3)), ci: fit.ci.map((c) => c.map((v) => +v.toFixed(3))), phi: fit.phi.toFixed(3), s: fit.s.toFixed(2), n: age.length },
  lw: { a: lw.a.toFixed(4), b: lw.b.toFixed(3), bLo: lw.bLo.toFixed(3), bHi: lw.bHi.toFixed(3), growth: lw.growth }, w17: { f: (LW_F.a * 17 ** LW_F.b).toFixed(1), m: (LW_M.a * 17 ** LW_M.b).toFixed(1) }, w22: { f: (LW_F.a * 22 ** LW_F.b).toFixed(1), m: (LW_M.a * 22 ** LW_M.b).toFixed(1) }, M_PAPER };
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'growth', figure(fig1, 'Figure 1. The paper\'s von Bertalanffy curve for both sexes (solid) and the curve the growth fitter finds for 305 simulated fish drawn round it (dashed). The dots (every fourth simulated fish) are made up, not the paper\'s otolith readings.'));
  md = inject(md, 'lw', figure(fig2, 'Figure 2. Weight at length from the paper\'s length-weight equations for females and males, worked out with the same W = aL^b maths as the Fish length-weight tool. The dotted curve shows how a fish that kept its shape (b = 3) would gain weight.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
