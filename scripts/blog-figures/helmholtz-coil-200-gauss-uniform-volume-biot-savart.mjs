// Figures for src/blog/discoveries/helmholtz-coil-200-gauss-uniform-volume-biot-savart.md, made with the maths of the
// Coil field designer (src/lib/sci/ph-coil.ts: exact Biot-Savart loops, uniform length and uniform sphere).
// Run: node scripts/blog-figures/helmholtz-coil-200-gauss-uniform-volume-biot-savart.mjs
import fs from 'node:fs';
import { loops, fieldAt, uniformSphere, preset, helmholtzCentre, wireLength, MU0 } from '../../src/lib/sci/ph-coil.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/helmholtz-coil-200-gauss-uniform-volume-biot-savart.md', import.meta.url);

// Inputs from the paper: Chen, H. et al. (2025), AgriEngineering 7(11): 385, doi:10.3390/agriengineering7110385 (CC BY).
// Target 200 G over a 20 x 20 x 10 cm sample space; the simulated "ring coil" set is eight 135-turn coils in a stack
// 20 cm high and 15 cm across, at 4.3 A; the built set reaches 142.77 G at 8.4 A (70 % of a 12 A maximum).
const G = 1e4; // tesla to gauss
const RING = { n: 8, R: 0.075, span: 0.20, N: 135, I: 4.3 };
const ring = Array.from({ length: RING.n }, (_, i) => ({ R: RING.R, z: -RING.span / 2 + (i * RING.span) / (RING.n - 1), N: RING.N, I: RING.I, w: 0, d: 0 }));
const LR = loops(ring), b0 = fieldAt(LR, 0, 0).bz * G;

// Bisection: where the field falls to a given number of gauss, along the axis and across it.
const where = (f, lo, hi, t) => { for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; f(m) > t ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const zAt = (t) => where((z) => fieldAt(LR, 0, z).bz * G, 0, 0.5, t);
const rAt = (t) => where((r) => fieldAt(LR, r, 0).b * G, 0, RING.R * 0.98, t);

// The sample space the paper asks for: 20 x 20 x 10 cm, so a sphere of half-diagonal radius must be uniform.
const HALF = Math.hypot(0.10, 0.10, 0.05);
const RS = Array.from({ length: 56 }, (_, i) => 0.05 + i * 0.01); // coil radius 5 to 60 cm
const sphere = (set, R, tol) => uniformSphere(loops(preset(set, R, 1000, 1)), 0, tol, 0.002, 0.7) * 100;
const hz = RS.map((R) => sphere('helmholtz', R, 0.01)), mx = RS.map((R) => sphere('maxwell', R, 0.01));
// Radius that just covers the sample space, and what it costs at 12 A for 200 G.
const needR = (set) => { let lo = 0.1, hi = 0.8; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; sphere(set, m, 0.01) / 100 >= HALF ? (hi = m) : (lo = m); } return (lo + hi) / 2; };
const design = (set, R, I = 12) => {
  const unit = fieldAt(loops(preset(set, R, 1000, 1)), 0, 0).bz; // tesla per 1000 ampere-turns in the centre coil
  const N = Math.round((1000 * 0.02) / unit / I); // turns per coil for 200 G (0.02 T) at this current
  const coils = preset(set, R, N, I);
  return { R: +(R * 100).toFixed(1), N, centreG: +(fieldAt(loops(coils), 0, 0).bz * G).toFixed(1), wire: Math.round(wireLength(coils)), sphere: +sphere(set, R, 0.01).toFixed(1) };
};
const hzR = needR('helmholtz'), mxR = needR('maxwell');
const HZ = design('helmholtz', 0.48), MX = design('maxwell', 0.35);

const ZS = Array.from({ length: 161 }, (_, i) => -0.2 + i * 0.0025);
const fig1 = chart({
  title: 'The simulated eight-coil stack, along its axis', xLabel: 'Distance from the centre along the axis (cm)', yLabel: 'Field Bz (gauss)',
  series: [{ name: '', kind: 'line', x: ZS.map((z) => z * 100), y: ZS.map((z) => +(fieldAt(LR, 0, z).bz * G).toFixed(1)) }],
  xDomain: [-20, 20], yDomain: [0, 240],
  hlines: [{ y: 200, text: 'the 200 G target' }, { y: 50, text: '50 G' }],
  vlines: [{ x: +(zAt(200) * 100).toFixed(1), text: `${(zAt(200) * 100).toFixed(1)} cm` }, { x: +(zAt(50) * 100).toFixed(1), text: `${(zAt(50) * 100).toFixed(1)} cm`, dy: 14 }],
  desc: `Axial field of eight 135-turn coils of 7.5 cm radius spread over 20 cm at 4.3 A: ${b0.toFixed(0)} gauss at the centre, above 200 gauss within ${(zAt(200) * 100).toFixed(1)} cm of it, and down to 50 gauss at ${(zAt(50) * 100).toFixed(1)} cm.`, height: 270,
});

const fig2 = chart({
  title: 'How big a sphere stays uniform to 1 %', xLabel: 'Coil radius R (cm)', yLabel: 'Radius of the uniform sphere (cm)',
  series: [
    { name: 'Maxwell three-coil', kind: 'line', x: RS.map((R) => R * 100), y: mx },
    { name: 'Helmholtz pair', kind: 'line', x: RS.map((R) => R * 100), y: hz },
  ],
  xDomain: [5, 60], yDomain: [0, 26],
  hlines: [{ y: +(HALF * 100).toFixed(1), text: 'the 20 × 20 × 10 cm sample space' }],
  vlines: [{ x: +(mxR * 100).toFixed(0), text: `${(mxR * 100).toFixed(0)} cm`, left: true }, { x: +(hzR * 100).toFixed(0), text: `${(hzR * 100).toFixed(0)} cm` }],
  desc: `The sphere that stays within 1 % of the centre field grows in proportion to the coil radius: about 0.31 R for a Helmholtz pair and 0.43 R for a Maxwell three-coil set. Covering the paper's sample space needs ${(hzR * 100).toFixed(0)} cm with two coils, ${(mxR * 100).toFixed(0)} cm with three.`, height: 270,
});

const ZN = Array.from({ length: 121 }, (_, i) => -0.18 + i * 0.003);
const prof = (set, R) => { const L = loops(preset(set, R, 1000, 1)), c = fieldAt(L, 0, 0).bz; return ZN.map((z) => +((fieldAt(L, 0, z).bz / c) * 100).toFixed(2)); };
const fig3 = chart({
  title: 'Flatness of the three coil sets, as a percentage of the centre', xLabel: 'Distance from the centre along the axis (cm)', yLabel: 'Field as % of the centre field',
  series: [
    { name: 'Maxwell, R = 35 cm', kind: 'line', x: ZN.map((z) => z * 100), y: prof('maxwell', 0.35) },
    { name: 'Helmholtz, R = 48 cm', kind: 'line', x: ZN.map((z) => z * 100), y: prof('helmholtz', 0.48) },
    { name: 'The eight-coil stack', kind: 'line', x: ZN.map((z) => z * 100), y: ZN.map((z) => +((fieldAt(LR, 0, z).bz / (b0 / G)) * 100).toFixed(2)), colour: 'var(--muted)' },
  ],
  xDomain: [-18, 18], yDomain: [80, 103], hlines: [{ y: 98.68, text: 'the paper\'s ±1.32 %' }],
  desc: 'The eight-coil stack falls away quickly outside a few centimetres, while a Helmholtz pair of 48 cm radius and a Maxwell three-coil set of 35 cm radius hold their centre field to better than 1 % right across the sample space.', height: 280,
});

console.log(JSON.stringify({
  ringCentreG: +b0.toFixed(1), z200cm: +(zAt(200) * 100).toFixed(2), z50cm: +(zAt(50) * 100).toFixed(2), r200cm: +(rAt(200) * 100).toFixed(2),
  halfDiagonalCm: +(HALF * 100).toFixed(1), helmholtzNeedCm: +(hzR * 100).toFixed(1), maxwellNeedCm: +(mxR * 100).toFixed(1),
  HZ, MX, scaled12A: +((142.77 / 8.4) * 12).toFixed(1), currentFor200G: +((200 / 142.77) * 8.4).toFixed(2),
  helmholtzCheck: +(helmholtzCentre(0.48, HZ.N, 12) * G).toFixed(1), mu0: MU0,
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ring', figure(fig1, 'Figure 1. The paper\'s simulated eight-coil stack, recomputed from the Biot-Savart law with the Coil field designer\'s maths: eight 135-turn coils of 7.5 cm radius, evenly spread over 20 cm, each carrying 4.3 A. The field passes 200 gauss at the centre and drops to 50 gauss about ' + (zAt(50) * 100).toFixed(0) + ' cm out, as the paper describes.'));
  md = inject(md, 'spheres', figure(fig2, 'Figure 2. The radius of the sphere that stays within 1 % of the centre field, against the coil radius, for a Helmholtz pair and a Maxwell three-coil set. The dashed line is the half-diagonal of the paper\'s 20 × 20 × 10 cm sample space.'));
  md = inject(md, 'flat', figure(fig3, 'Figure 3. Axial flatness of the three sets, each normalised to its own centre field. The dashed line is the ±1.32 % the paper measured across its workspace.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
