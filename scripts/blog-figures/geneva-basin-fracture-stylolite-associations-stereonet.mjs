// Figures for src/blog/discoveries/geneva-basin-fracture-stylolite-associations-stereonet.md, made with the maths of
// the Stereonet (src/lib/sci/stereonet.ts: poles, great circles, equal-area projection and Fisher statistics).
// Run: node scripts/blog-figures/geneva-basin-fracture-stylolite-associations-stereonet.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { pole, planeFromPole, project, greatCircle, fisher, vec, line } from '../../src/lib/sci/stereonet.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/geneva-basin-fracture-stylolite-associations-stereonet.md', import.meta.url);

// Inputs. "Paper": Hupkes, Bruna, Bertotti, Doesburg and Moscariello (2026), Solid Earth 17, 113-134,
// doi:10.5194/se-17-113-2026 (CC BY 4.0). Strikes are the paper's approximate values (degrees).
const PAIRS = [ // [association, sinistral strike, dextral strike, sigma1 of its event (paper)]
  ['PA2 (Parmelan)', 150, 120, 135],
  ['PA3 (Parmelan)', 120, 80, 97],
  ['JA2 (Jura)', 170, 110, 135],
  ['JA4 (Jura)', 140, 75, 97],
];
const E1 = 135, E2 = 97;          // trend of sigma1 in events E1 and E2, paper
const FAULT_DIP = 30;             // dip of the small reverse faults in E1, paper's inferred value (relative to bedding)
const VEIN = 15;                  // vein arrays sit 15° from sigma1, paper's assumption
const TOL = 30;                   // paper's tolerance for assigning a fracture to a set (degrees)
const FIT_GEO1 = 350 / 820;       // GEo-01: 350 of 820 natural fractures fit E1/E2, paper
// Bedding is taken as horizontal: our simplification (the paper works relative to bedding).

const n360 = (a) => ((a % 360) + 360) % 360;
// 1. Conjugate pairs of vertical vein arrays: the mean of their poles is the plane bisecting them; its strike is sigma1.
const bis = PAIRS.map(([name, s, d, sig]) => {
  const f = fisher([pole({ strike: s, dip: 90 }), pole({ strike: d, dip: 90 })]);
  const st = planeFromPole(f.mean).strike, b = n360(st) > 180 ? st - 180 : st;
  return { name, s, d, sig, bis: b, half: Math.abs(((s - d + 540) % 180) - 0) / 2 };
});

// 2. Conjugate reverse faults striking 045, dipping 30° to the SE and to the NW (E1): intersection and mean pole.
const fA = { strike: 45, dip: FAULT_DIP }, fB = { strike: 225, dip: FAULT_DIP };
const pA = vec(pole(fA)), pB = vec(pole(fB));
const inter = line([pA[1] * pB[2] - pA[2] * pB[1], pA[2] * pB[0] - pA[0] * pB[2], pA[0] * pB[1] - pA[1] * pB[0]]);
const mp = fisher([pole(fA), pole(fB)]).mean;

// 3. The predicted planes of one event: two reverse faults, a vertical stylolite plane (perpendicular to sigma1)
// and two vertical vein arrays at ±15° (our simplified set of five).
const predicted = (s1) => [
  { strike: n360(s1 - 90), dip: FAULT_DIP }, { strike: n360(s1 + 90), dip: FAULT_DIP },
  { strike: n360(s1 + 90), dip: 90 }, { strike: n360(s1 + VEIN), dip: 90 }, { strike: n360(s1 - VEIN), dip: 90 },
];
const PRED = [...predicted(E1), ...predicted(E2)];
const angle = (a, b) => { const u = vec(a), v = vec(b); return (Math.acos(Math.min(1, Math.abs(u[0] * v[0] + u[1] * v[1] + u[2] * v[2]))) * 180) / Math.PI; };
const fitsPole = (pl, tol) => PRED.some((p) => angle(pole(pl), pole(p)) < tol);
// Closer to the paper's rule: the dip-direction difference plus the dip difference under the tolerance. A plane can
// also be written as (dip direction + 180, 180 − dip), which matters for steep planes; the smaller sum counts.
const dsum = (a, b) => { const dda = n360(a.strike + 90), ddb = n360(b.strike + 90); const d1 = Math.abs(((dda - ddb + 540) % 360) - 180); return Math.min(d1 + Math.abs(a.dip - b.dip), (180 - d1) + Math.abs(180 - a.dip - b.dip)); };
const fits = (pl, tol) => PRED.some((p) => dsum(pl, p) < tol);

// 4. Simulated fracture log (not the paper's data): 45% from the E1 set with 8° scatter, 55% random orientations.
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const randomPlane = () => { const z = rnd(), az = 360 * rnd(); return planeFromPole({ trend: az, plunge: (Math.asin(z) * 180) / Math.PI }); };
const N = 400, sim = [];
for (let i = 0; i < N; i++) {
  if (i < 0.45 * N) { const p = predicted(E1)[i % 5]; const l = pole(p); const v = vec({ trend: l.trend + 8 * gauss() / Math.max(0.2, Math.cos((l.plunge * Math.PI) / 180)), plunge: Math.max(0, Math.min(90, l.plunge + 8 * gauss())) }); sim.push({ pl: planeFromPole(line(v)), set: true }); }
  else sim.push({ pl: randomPlane(), set: false });
}
const simFit = sim.filter((s) => fits(s.pl, TOL)).length / N;
const randFitSim = sim.filter((s) => !s.set && fits(s.pl, TOL)).length / sim.filter((s) => !s.set).length;
// Chance that a random orientation fits within each tolerance (100,000 random planes).
const tols = [5, 10, 15, 20, 25, 30, 35, 40];
seed = 99; const R = Array.from({ length: 100000 }, randomPlane);
const chance = tols.map((t) => R.filter((p) => fits(p, t)).length / R.length);
const chanceP = tols.map((t) => R.filter((p) => fitsPole(p, t)).length / R.length);
// Fisher statistics of the simulated faults dipping SE (first predicted plane of E1).
const seFaults = sim.filter((s, i) => s.set && i % 5 === 1).map((s) => pole(s.pl));
const fSE = fisher(seFaults);

// Figure 1: equal-area net with E1's predicted great circles and the simulated poles.
const prim = Array.from({ length: 73 }, (_, i) => [Math.sin((i / 72) * 2 * Math.PI), Math.cos((i / 72) * 2 * Math.PI)]);
const series = [{ name: '', kind: 'line', x: prim.map((p) => +p[0].toFixed(3)), y: prim.map((p) => +p[1].toFixed(3)), colour: 'var(--muted)' }];
predicted(E1).forEach((p, i) => { const g = greatCircle(p, 'equal-area', 24); series.push({ name: i ? '' : 'E1 predicted planes', kind: 'line', x: g.map((q) => +q[0].toFixed(3)), y: g.map((q) => +q[1].toFixed(3)), colour: 'var(--c-blog)' }); });
const ps = sim.filter((_, i) => i % 4 === 0).map((s) => project(pole(s.pl), 'equal-area')); // every fourth pole, to keep the chart small
series.push({ name: 'Poles of simulated fractures', kind: 'dots', size: 2, colour: 'var(--c-tools)', x: ps.map((p) => +p[0].toFixed(2)), y: ps.map((p) => +p[1].toFixed(2)) });
const s1xy = project({ trend: E1, plunge: 0 }, 'equal-area');
series.push({ name: '', kind: 'dots', size: 5, colour: 'var(--ink)', x: [+s1xy[0].toFixed(3), -s1xy[0].toFixed(3)], y: [+s1xy[1].toFixed(3), -s1xy[1].toFixed(3)], label: { text: 'σ1', at: [s1xy[0], s1xy[1]], dx: -22, dy: 4 } });
const fig1 = chart({
  title: 'Event E1 on a stereonet (lower hemisphere, equal area)', xLabel: 'West – East', yLabel: 'South – North',
  series, xDomain: [-1.05, 1.05], yDomain: [-1.05, 1.05], xTicks: [], yTicks: [], width: 420, height: 400,
  desc: 'Great circles of the five planes predicted for event E1 (two low-angle reverse faults, a stylolite plane and two vein arrays around sigma 1 trending 135) with the poles of 400 simulated fractures.',
});
const fig2 = chart({
  title: 'How often a random fracture "fits" by chance', xLabel: 'Tolerance (degrees between poles)', yLabel: '% of random orientations that fit',
  series: [
    { name: 'Dip direction + dip difference', kind: 'line', x: tols, y: chance.map((c) => +(100 * c).toFixed(1)) },
    { name: 'Angle between poles', kind: 'line', x: tols, y: chanceP.map((c) => +(100 * c).toFixed(1)), dash: '5 4' },
  ],
  xDomain: [5, 40], yDomain: [0, 100], vlines: [{ x: TOL, text: 'paper\'s 30°', left: true }],
  hlines: [{ y: 100 * FIT_GEO1, text: `GEo-01: ${(100 * FIT_GEO1).toFixed(0)}% fit` }],
  desc: `With ten predicted planes, ${(100 * chance[5]).toFixed(0)}% of completely random orientations pass a 30 degree dip-direction-plus-dip test, and ${(100 * chanceP[5]).toFixed(0)}% lie within 30 degrees by the angle between poles.`, height: 300,
});

const facts = {
  bis: bis.map((b) => `${b.name}: bisector ${b.bis.toFixed(1)} vs sigma1 ${b.sig}; half-angle ${b.half}`),
  inter: `${inter.plunge.toFixed(2)} -> ${inter.trend.toFixed(1)}`, meanPole: `${mp.plunge.toFixed(2)} -> ${mp.trend.toFixed(1)}`,
  dihedral: (180 - 2 * FAULT_DIP), PRED: PRED.map((p) => `${p.strike}/${p.dip}`),
  simFit: (100 * simFit).toFixed(1), randFitSim: (100 * randFitSim).toFixed(1), chance: tols.map((t, i) => `${t}:${(100 * chance[i]).toFixed(1)}/${(100 * chanceP[i]).toFixed(1)}`),
  fSE: fSE && `n ${fSE.n} mean ${fSE.mean.plunge.toFixed(1)} -> ${fSE.mean.trend.toFixed(1)} plane ${JSON.stringify(planeFromPole(fSE.mean))} k ${fSE.k.toFixed(1)} a95 ${fSE.a95.toFixed(2)}`,
  geo1: (100 * FIT_GEO1).toFixed(1), geo2: (100 * 104 / 211).toFixed(1),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'net', figure(fig1, 'Figure 1. The five planes we predict for event E1 (σ1 trending 135°), drawn with the Stereonet\'s equal-area maths, and the poles of every fourth of 400 simulated fractures: 45% drawn from those planes with scatter, the rest random. Simulated, not the borehole data.'));
  md = inject(md, 'chance', figure(fig2, 'Figure 2. The share of completely random fracture orientations that land within a given angle of one of our ten predicted planes (events E1 and E2), from 100,000 random planes. Our simplified test, not the paper\'s exact matching rule.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
