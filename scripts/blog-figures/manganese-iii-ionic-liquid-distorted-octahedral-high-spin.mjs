// Figures for src/blog/discoveries/manganese-iii-ionic-liquid-distorted-octahedral-high-spin.md, made with the
// maths of the Crystal field calculator (src/lib/sci/crystalfield.ts: spinStates, spinOnly, jahnTeller, deltaFromNm).
// Run: node scripts/blog-figures/manganese-iii-ionic-liquid-distorted-octahedral-high-spin.mjs
import fs from 'node:fs';
import { dCount, GEOMETRIES, spinStates, spinOnly, configLabel, jahnTeller, CM_TO_KJ, deltaFromNm, seenColour } from '../../src/lib/sci/crystalfield.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/manganese-iii-ionic-liquid-distorted-octahedral-high-spin.md', import.meta.url);

// Inputs from the paper: Sharmin, Islam and Islam (2025), Next Materials 8: 100682 (CC BY 4.0).
// Mn(III) in a distorted octahedral field; UV-Vis bands at 434 nm and 1381 nm; magnetic moment 4.6 B.M.
const OH = GEOMETRIES.find((g) => g.id === 'oh'), TD = GEOMETRIES.find((g) => g.id === 'td');
const d = dCount('Mn', 3);                 // 4
const BANDS = [1381, 434];
const DELTA = BANDS.map((nm) => deltaFromNm(nm));   // 7241 and 23041 cm-1
const MU_OBS = 4.6;
const P = 28000;                           // pairing energy for Mn(III), cm-1 (textbook range 23,000-28,000): OUR input

const ground = (D, p = P) => spinStates(OH.levels, d, D, p)[0];
const g0 = ground(DELTA[0]);
const states = spinStates(OH.levels, d, DELTA[0], P);

// Crossover Δ for a given pairing energy: where the ground state stops being high spin.
const crossover = (p) => { let lo = 0, hi = 80000; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; ground(m, p).unpaired === 4 ? (lo = m) : (hi = m); } return (lo + hi) / 2; };

// Figure 1: the two spin states' energies against Δo.
const Ds = Array.from({ length: 141 }, (_, i) => i * 250);
const line = (unpaired) => Ds.map((D) => { const s = spinStates(OH.levels, d, D, P).find((x) => x.unpaired === unpaired); return s ? +(s.energy / 1000).toFixed(4) : NaN; });
const fig1 = chart({
  title: 'Mn(III), d⁴ octahedral: which spin state wins', xLabel: 'Splitting Δo (cm⁻¹)', yLabel: 'Energy (10³ cm⁻¹)',
  series: [
    { name: 'High spin, t2g³eg¹ (4 unpaired)', kind: 'line', x: Ds, y: line(4) },
    { name: 'Low spin, t2g⁴ (2 unpaired)', kind: 'line', x: Ds, y: line(2) },
  ],
  xDomain: [0, 35000], yDomain: [-22, 30],
  hlines: [{ y: 0, text: '' }],
  vlines: [{ x: DELTA[0], text: `1381 nm band: ${Math.round(DELTA[0])}` }, { x: DELTA[1], text: `434 nm: ${Math.round(DELTA[1])}`, left: true, dy: 16 }],
  desc: `Energy of the high-spin and low-spin arrangements of four d electrons in an octahedral field against the splitting, with a pairing energy of ${P} cm-1. They cross at the pairing energy.`,
  height: 290,
});

// Figure 2: the moment the tool predicts against Δo, for three pairing energies.
const muLine = (p) => Ds.map((D) => +spinOnly(ground(D, p).unpaired).toFixed(4));
const fig2 = chart({
  title: 'Predicted magnetic moment against the field', xLabel: 'Splitting Δo (cm⁻¹)', yLabel: 'Spin-only moment (B.M.)',
  series: [
    { name: 'P = 23,000 cm⁻¹', kind: 'line', x: Ds, y: muLine(23000) },
    { name: 'P = 28,000 cm⁻¹', kind: 'line', x: Ds, y: muLine(28000) },
  ],
  xDomain: [0, 35000], yDomain: [2, 5.6],
  hlines: [{ y: MU_OBS, text: `measured ${MU_OBS} B.M.` }, { y: spinOnly(4), text: 'spin-only for 4 unpaired: 4.90' }],
  vlines: [{ x: DELTA[0], text: `${Math.round(DELTA[0])}` }, { x: DELTA[1], text: `${Math.round(DELTA[1])}`, left: true, dy: 16 }],
  desc: 'The spin-only moment the crystal field calculator predicts, against the splitting, for two pairing energies. The measured 4.6 B.M. sits just under the high-spin value of 4.90.',
  height: 285,
});

console.log(JSON.stringify({
  d, bands: BANDS, delta: DELTA.map((x) => Math.round(x)), deltaKJ: DELTA.map((x) => +(x * CM_TO_KJ).toFixed(1)),
  ground: { label: configLabel(OH, g0.occ), unpaired: g0.unpaired, cfse: Math.round(g0.cfse * DELTA[0]), cfseKJ: +(g0.cfse * DELTA[0] * CM_TO_KJ).toFixed(1), jt: jahnTeller(g0.occ), mu: +spinOnly(g0.unpaired).toFixed(3) },
  states: states.map((s) => ({ label: configLabel(OH, s.occ), unpaired: s.unpaired, energy: Math.round(s.energy), mu: +spinOnly(s.unpaired).toFixed(3), jt: jahnTeller(s.occ) })),
  ratio: +(MU_OBS / spinOnly(4)).toFixed(3),
  crossover: [23000, 25000, 28000].map((p) => ({ P: p, delta: Math.round(crossover(p)), nm: Math.round(1e7 / crossover(p)) })),
  tetrahedral: (() => { const s = spinStates(TD.levels, d, (DELTA[0] * 4) / 9, P)[0]; return { label: configLabel(TD, s.occ), unpaired: s.unpaired, mu: +spinOnly(s.unpaired).toFixed(3), deltaT: Math.round((DELTA[0] * 4) / 9) }; })(),
  colours: BANDS.map((nm) => ({ nm, ...seenColour(nm) })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'spin', figure(fig1, 'Figure 1. The two spin states of four d electrons in an octahedral field, as the Crystal field calculator works them out, against the splitting Δo, with a pairing energy of 28,000 cm⁻¹ (our input). High spin wins everywhere left of the crossing; the splitting read from the paper\'s 1381 nm band is far to the left of it.'));
  md = inject(md, 'mu', figure(fig2, 'Figure 2. The spin-only moment the tool predicts, against Δo, for pairing energies of 23,000 and 28,000 cm⁻¹. The measured 4.6 B.M. sits just below the high-spin value. Reading the 434 nm band as Δo instead would land on the cliff, where the prediction is 2.83 B.M.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
