// Figures for src/blog/discoveries/xianhuaite-ce-new-mineral-simple-key-identification.md, made with the maths of the
// Mineral identification key (src/lib/sci/mineralkey.ts: rank, compare, the table of common minerals).
// Run: node scripts/blog-figures/xianhuaite-ce-new-mineral-simple-key-identification.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import * as K from '../../src/lib/sci/mineralkey.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/xianhuaite-ce-new-mineral-simple-key-identification.md', import.meta.url);

// Inputs from the paper: Yang et al. (2026), European Journal of Mineralogy 38: 449-459, doi:10.5194/ejm-38-449-2026 (CC BY 4.0):
// Mohs hardness 5-6 (we type the middle, 5.5), calculated density 5.23 g/cm3 (no measured value), adamantine lustre, white streak,
// perfect cleavage on {001} (one cleavage), dark brown to black-brown, not magnetic, brittle; unit cell a = 12.5355 A, c = 3.9213 A, Z = 2.
// OUR assumptions: colour typed as brown; "no fizz in cold acid" (the paper does not test it; a niobate does not fizz); the key's
// specific-gravity box is given the calculated density, because that is all the paper has.
const R = (x, n = 2) => +x.toFixed(n);
const obsFull = { H: [5.5, 5.5], SG: 5.23, lustre: 'adamantine', streak: 'white', cleavage: '1', colour: 'brown', tests: { magnetic: 'no', 'fizz-cold': 'no' } };
const obsNoSG = { ...obsFull }; delete obsNoSG.SG;
const obsHS = { H: [5.5, 5.5], SG: 5.23 };
const tolDef = { H: 0.5, SG: 0.2 };
const top = (o, tol, mm, n = 5) => K.rank(o, tol, mm).slice(0, n).map((x) => ({ id: x.mineral.id, score: x.score, of: x.of, misses: x.misses, bad: x.reasons.filter((q) => q.ok !== 'match').map((q) => `${q.what}:${q.ok}`) }));

// Chart: how many minerals of the key have no miss at all, as the specific-gravity tolerance widens.
const tols = [0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 2];
const count = (o, t, hTol = 0.5) => K.rank(o, { H: hTol, SG: t }, 0).length;
const fig1 = chart({
  title: 'Minerals with no mismatch, as the density box widens', xLabel: 'Specific gravity matches within ± (g/cm³)', yLabel: 'Minerals in the key with no miss',
  series: [
    { name: 'Hardness and density only', kind: 'line', x: tols, y: tols.map((t) => count(obsHS, t)), colour: 'var(--c-tools)' },
    { name: 'All eight observations', kind: 'line', x: tols, y: tols.map((t) => count(obsFull, t)), colour: 'var(--c-blog)' },
  ],
  xDomain: [0, 2], yDomain: [0, 30],
  desc: 'Number of the key\'s 51 minerals that match every observation, against how wide the specific-gravity tolerance is. With only hardness and density a handful of oxide and sulfide minerals fit; with all eight observations of the new mineral, none fits at any tolerance up to 2.', height: 280,
});

// Calculated density from the unit cell and the paper's empirical formula, our arithmetic (standard atomic weights).
const AW = { K: 39.0983, Ba: 137.327, Sr: 87.62, Ce: 140.116, La: 138.905, Nd: 144.242, Pr: 140.908, Ca: 40.078, Na: 22.990, Nb: 92.906, Fe: 55.845, Ti: 47.867, Mg: 24.305, O: 15.999 };
const emp = { K: 1.30, Ba: 0.69, Sr: 0.02, Ce: 0.39, La: 0.31, Nd: 0.04, Pr: 0.02, Ca: 0.15, Na: 0.09, Nb: 4.75, Fe: 0.13, Ti: 0.09, Mg: 0.04, O: 15 };
const ideal = { K: 2, Ce: 1, Nb: 5, O: 15 };
const mass = (f) => Object.entries(f).reduce((s, [e, n]) => s + AW[e] * n, 0);
const dens = (M, V, Z = 2) => (Z * M) / (0.602214 * V); // g/cm3 with V in cubic angstroms
const cellV = (a, c) => a * a * c;
const V1 = cellV(12.5355, 3.9213), V2 = cellV(12.5458, 3.9279);
const dens_ = { Mideal: R(mass(ideal), 2), Memp: R(mass(emp), 2), V1: R(V1, 2), V2: R(V2, 2), Dideal: R(dens(mass(ideal), V1), 3), Demp: R(dens(mass(emp), V1), 3), DempPowder: R(dens(mass(emp), V2), 3) };

const res = {
  full: top(obsFull, tolDef, Infinity, 6), full1: top(obsFull, tolDef, 1, 6), full2miss: K.rank(obsFull, tolDef, 2).length, noSG: top(obsNoSG, tolDef, Infinity, 4),
  hs: top(obsHS, tolDef, 0, 6), hs05: K.rank(obsHS, { H: 0.5, SG: 0.5 }, 0).map((x) => x.mineral.id),
  curve: tols.map((t) => [t, count(obsHS, t), count(obsFull, t)]),
  zeroFullAny: K.rank(obsFull, { H: 1, SG: 2 }, 0).length, of: K.MINERALS.length,
  dens: dens_,
  whiteStreakDense: K.MINERALS.filter((m) => m.SG[1] >= 4.5 && m.streak.includes('white')).map((m) => `${m.id} ${m.SG[0]}-${m.SG[1]}`),
};
console.log(JSON.stringify(res));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'match', figure(fig1, 'Figure 1. How many of the key\'s minerals fit every observation as the density tolerance is widened, for the new mineral\'s hardness (5.5) and calculated density (5.23 g/cm³) alone, and with all eight observations. Worked out with the Mineral identification key\'s ranking maths.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
