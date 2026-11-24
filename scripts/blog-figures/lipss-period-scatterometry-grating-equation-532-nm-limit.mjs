// Figures for src/blog/discoveries/lipss-period-scatterometry-grating-equation-532-nm-limit.md, made with the maths
// of the Diffraction pattern generator (src/lib/sci/phdiff.ts: the Fraunhofer irradiance of a grating and the
// Fresnel number that says the far field applies).
// Run: node scripts/blog-figures/lipss-period-scatterometry-grating-equation-532-nm-limit.mjs
import fs from 'node:fs';
import { fraunhofer, fresnelNumber } from '../../src/lib/sci/phdiff.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/lipss-period-scatterometry-grating-equation-532-nm-limit.md', import.meta.url);

// From the paper: Goette, Sallese, Raenke, Voisiat, Lasagni and Soldera (2025), Sensors 25(16): 5031,
// doi:10.3390/s25165031 (CC BY). A 532 nm probe beam of 1 mm diameter hits laser-induced periodic surface
// structures at normal incidence; the period is read from the diffracted orders with sin(theta_m) = m lambda / Lambda
// and the calibration Lambda = (175.46 +- 0.64) um px / dx. Stated structure periods: LSFL about 1130 nm, bulges
// about 983 nm, shallow HSFL about 415 nm, and an average period falling from about 1000 nm to 800 nm with more scans.
const LAM = 532e-9; // m
const PROBE = 1e-3; // m, the paper's probe spot
const DRAW = 20e-6; // m, the patch we illuminate for Figure 2 only, so the orders are wide enough to see (our choice)
const DUTY = 0.4; // groove width / period; OUR assumption, it changes order strengths but no angle
const Z = 1; // m, screen distance for the tool call (angles do not depend on it)

const deg = (s) => (Math.asin(s) * 180) / Math.PI;
const xOf = (s) => Z * Math.tan(Math.asin(s));

// Figure 1: the angle of each order against the surface period.
const PER = []; // nm
for (let p = 500; p <= 1400; p += 5) PER.push(p);
const orderAngle = (p, m) => { const s = (m * LAM) / (p * 1e-9); return s <= 1 ? deg(s) : NaN; };

const fig1 = figure(
  chart({
    title: 'Where a 532 nm probe sends each order',
    xLabel: 'Surface period Λ (nm)',
    yLabel: 'Diffraction angle (degrees)',
    series: [
      { name: 'First order', x: PER, y: PER.map((p) => orderAngle(p, 1)), kind: 'line' },
      { name: 'Second order', x: PER, y: PER.map((p) => orderAngle(p, 2)), kind: 'line' },
    ],
    xDomain: [500, 1400],
    yDomain: [0, 92],
    bands: [{ x0: 500, x1: 532, text: '' }],
    vlines: [
      { x: 580, text: '580 nm', dy: 2 },
      { x: 983, text: 'bulges 983 nm', dy: 20, left: true },
      { x: 1130, text: 'LSFL 1130 nm', dy: 2 },
    ],
    hlines: [{ y: 90, text: 'grazing: the order leaves the surface' }],
    desc: 'The first-order diffraction angle falls from 90 degrees at a period of 532 nm to 22 degrees at 1400 nm. The second order only appears above 1064 nm. Below 532 nm, shaded at the left, no order propagates at all.',
  }),
  'Figure 1. The grating equation at normal incidence, drawn from the Diffraction pattern generator’s own peak condition. Below Λ = 532 nm (the shaded strip) there is no diffracted order to measure: the probe wavelength is a hard floor on the method. A second order needs Λ ≥ 1064 nm, so only the coarsest structures show two rings.',
);

// Figure 2: the far-field profile the tool computes for three periods.
const TH = [];
for (let t = 0; t <= 84; t += 0.4) TH.push(t);
// Put the exact order angles on the grid too, so each peak is drawn at its true height.
for (const p of [1130, 580]) for (let m = 1; m <= 2; m++) { const s = (m * LAM) / (p * 1e-9); if (s <= 1) TH.push(deg(s)); }
TH.sort((a, b) => a - b);
const profile = (perNm) => {
  const d = perNm * 1e-9;
  const ap = { kind: 'grating', a: DUTY * d, d, N: Math.max(1, Math.round(DRAW / d)) };
  const peak = fraunhofer(ap, LAM, Z, 0);
  return { ap, y: TH.map((t) => fraunhofer(ap, LAM, Z, xOf(Math.sin((t * Math.PI) / 180))) / peak) };
};
const p1130 = profile(1130), p580 = profile(580), p415 = profile(415);

const fig2 = figure(
  chart({
    title: 'Far-field profile of three LIPSS periods',
    xLabel: 'Angle from the surface normal (degrees)',
    yLabel: 'Irradiance ÷ zero-order peak',
    series: [
      { name: 'Λ 1130 nm (LSFL)', x: TH, y: p1130.y, kind: 'line' },
      { name: 'Λ 580 nm', x: TH, y: p580.y, kind: 'line' },
      { name: 'Λ 415 nm (HSFL)', x: TH, y: p415.y, kind: 'line' },
    ],
    xDomain: [0, 84],
    yDomain: [0, 0.72],
    desc: 'Three irradiance profiles. The 1130 nm period gives a strong order at 28 degrees and a weak one at 70 degrees. The 580 nm period gives one order at 66.5 degrees. The 415 nm period gives no order at any angle, only the zero-order light near the normal.',
  }),
  'Figure 2. The Fraunhofer irradiance the tool computes for the three periods, each relative to its own zero-order peak. The illuminated patch here is 20 µm wide (our choice, so the orders are broad enough to draw); the paper’s 1 mm spot makes every order about fifty times narrower. The 415 nm structure is simply absent from the far field.',
);

// Numbers quoted in the article.
console.log('Order angles at 532 nm:');
for (const p of [415, 532, 580, 600, 800, 983, 1000, 1064, 1130]) {
  const o = [];
  for (let m = 1; m <= 3; m++) { const s = (m * LAM) / (p * 1e-9); if (s <= 1) o.push(`m${m} sin ${s.toFixed(4)} = ${deg(s).toFixed(2)} deg`); }
  console.log(`  ${String(p).padStart(5)} nm: ${o.join(' | ') || 'no propagating order'}`);
}
console.log(`Second order needs 1064 nm, third 1596 nm.`);
console.log('Order sharpness with the paper’s 1 mm probe spot:');
for (const p of [580, 800, 1130]) {
  const d = p * 1e-9, N = Math.round(PROBE / d), s1 = LAM / d;
  const half = LAM / PROBE / Math.sqrt(1 - s1 * s1);
  console.log(`  ${p} nm: ${N} grooves lit, first order half-width ${(half * 1e3).toFixed(3)} mrad (${((half * 180) / Math.PI).toFixed(4)} deg), period resolution ${((d / PROBE) * 100).toFixed(4)} % = ${((p * p) / 1e6).toFixed(3)} nm`);
}
for (const [nm, p] of [['LSFL 1130', p1130], ['580', p580], ['HSFL 415', p415]]) {
  const d = p.ap.d, out = [];
  for (let m = 1; m <= 2; m++) { const s = (m * LAM) / d; if (s > 1) continue; out.push(`m${m} ${(fraunhofer(p.ap, LAM, Z, xOf(s)) / fraunhofer(p.ap, LAM, Z, 0)).toFixed(4)}`); }
  console.log(`  ${nm}: ${p.ap.N} grooves in the drawn patch, Fresnel number ${fresnelNumber(p.ap, LAM, Z).toExponential(2)}, relative order peaks ${out.join(', ') || 'none'}`);
}
{ const d = 1130e-9, ap = { kind: 'grating', a: 0.5 * d, d, N: 17 };
  console.log(`  a 50:50 duty cycle wipes out the second order: relative peak ${(fraunhofer(ap, LAM, Z, xOf((2 * LAM) / d)) / fraunhofer(ap, LAM, Z, 0)).toExponential(2)}`); }
console.log(`Calibration: 175.46 um px / 0.532 um = ${(175.46 / 0.532).toFixed(1)} px is the furthest an order can land, so the smallest readable period is ${((175.46 / (175.46 / 0.532)) * 1000).toFixed(1)} nm.`);

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'angles', fig1);
md = inject(md, 'profiles', fig2);
fs.writeFileSync(ART, md);
console.log('Charts written into', ART.pathname);
