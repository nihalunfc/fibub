// Figures for src/blog/discoveries/candida-glabrata-gpi-mannosyltransferase-cryoem-dose-defocus-rosenthal-henderson.md,
// made with the maths of the Cryo-EM calculator (src/lib/sci/cryoem.ts).
// Run: node scripts/blog-figures/candida-glabrata-gpi-mannosyltransferase-cryoem-dose-defocus-rosenthal-henderson.mjs
import fs from 'node:fs';
import { sampling, dose, wavelength, wavelengthClassical, ctfZeros, ctfCurve, delocalisation, boxAdvice, rhResolution, rhParticles } from '../../src/lib/sci/cryoem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/candida-glabrata-gpi-mannosyltransferase-cryoem-dose-defocus-rosenthal-henderson.md', import.meta.url);

// Stated in the paper (Sun et al. 2025, J. Fungi 11: 819): Titan Krios at 300 kV, K3 in super-resolution mode,
// 81,000x nominal, physical pixel 1.088 A, total dose 56 e-/A2 in 32 frames over 3.2 s, defocus -1.7 to -2.1 um,
// 5,008 movies, 1,141,564 particles extracted, 80,856 in the final map at 3.48 A (FSC 0.143).
const PX = 1.088, TOTAL = 56, FRAMES = 32, SECONDS = 3.2, DEFOCUS = [1.7, 2.1];
const N_FINAL = 80856, N_EXTRACTED = 1141564, D_FINAL = 3.48;
// OUR ASSUMPTIONS: Cs 2.7 mm (the usual value for a Titan Krios, not stated) and amplitude contrast 0.1 (the
// usual starting value in CTF fitting, not stated).
const CS = 2.7, AMP = 0.1;
const g = (x, n = 4) => Number(x.toPrecision(n)).toLocaleString('en', { maximumFractionDigits: 12 });

// Super-resolution records at half the physical pixel; processing was at the stated 1.088 A, so bin 2.
const S = sampling({ calibrated: PX, superRes: true, bin: 2 });
console.log('--- sampling ---');
console.log('pixel processed at', g(S.pixel), 'A | recorded', g(S.recorded), 'A | Nyquist', g(S.nyquist), 'A =', g(S.nyquistK), 'per A | super-res Nyquist', g(2 * S.recorded), 'A');
console.log('the 3.48 A map sits at', (D_FINAL / S.nyquist).toFixed(2), 'x Nyquist');

// Dose: the tool takes a dose rate per camera pixel per second, so we turn the paper's total into one.
const ratePerPx = (TOTAL / SECONDS) * PX * PX;
const D = dose(ratePerPx, PX, SECONDS, FRAMES);
console.log('--- dose ---');
console.log('rate used', g(ratePerPx), 'e-/px/s ->', g(D.ratePerA2), 'e-/A2/s | total', g(D.total), 'e-/A2 | per frame', g(D.perFrame), 'e-/A2 |', g(D.frameTime * 1000), 'ms per frame |', g(D.perPixelFrame, 3), 'e- per camera pixel per frame');

console.log('--- optics ---');
console.log('wavelength at 300 kV', wavelength(300).toFixed(6), 'A (', wavelengthClassical(300).toFixed(6), 'A without the relativistic correction )');
const OPT = DEFOCUS.map((defocusUm) => ({ kV: 300, csMm: CS, amp: AMP, defocusUm }));
for (const o of OPT) {
  const zs = ctfZeros(o, S.nyquistK), before = zs.filter((k) => k < 1 / D_FINAL).length;
  console.log(`defocus ${o.defocusUm} um: first zero ${g(1 / zs[0])} A (${g(zs[0])} per A), ${zs.length} zeros up to Nyquist, ${before} of them before 3.48 A; signal spread at 3.48 A up to ${g(delocalisation(D_FINAL, o))} A`);
}

console.log('--- box size for a particle of 130 A across (OUR assumption) ---');
for (const o of OPT) { const b = boxAdvice(130, S.pixel, D_FINAL, o); console.log(`defocus ${o.defocusUm} um: needs at least ${g(b.minA)} A -> box ${b.boxPx} px (${g(b.boxA)} A); the 1.5 to 2 x rule would give ${b.ruleLo} to ${b.ruleHi} px`); }

console.log('--- Rosenthal-Henderson from the paper’s one point (80,856 particles at 3.48 A) ---');
for (const B of [50, 100, 150]) {
  console.log(`B = ${B} A2: twice the particles -> ${g(rhResolution(2 * N_FINAL, B, N_FINAL, D_FINAL))} A | ten times -> ${g(rhResolution(10 * N_FINAL, B, N_FINAL, D_FINAL))} A | 3.0 A needs ${Math.round(rhParticles(3, B, N_FINAL, D_FINAL)).toLocaleString('en')} | all ${N_EXTRACTED.toLocaleString('en')} extracted -> ${g(rhResolution(N_EXTRACTED, B, N_FINAL, D_FINAL))} A`);
}

/* ------------------------------------------------ Figure 1: the CTF at both ends of the defocus range */
const KMAX = 0.13; // up to about 7.7 A, where the first Thon rings live
const c17 = ctfCurve(OPT[0], KMAX, 240), c21 = ctfCurve(OPT[1], KMAX, 240);
const fig1 = chart({
  title: 'The contrast transfer function at both defoci',
  xLabel: 'Spatial frequency (1/Å)',
  yLabel: 'CTF',
  series: [
    { name: '1.7 µm underfocus', x: c17.k, y: c17.ctf },
    { name: '2.1 µm underfocus', x: c21.k, y: c21.ctf, colour: 'var(--c-tools)' },
  ],
  xDomain: [0, KMAX], yDomain: [-1.05, 1.05],
  hlines: [{ y: 0, text: '' }],
  vlines: [{ x: 1 / 18.58, text: '18.6 Å' }, { x: 1 / 20.66, text: '20.7 Å', dy: 18, left: true }],
  height: 260,
  desc: 'Two oscillating curves from zero to 0.13 per Angstrom. The 2.1 micron curve crosses zero first, at 20.7 Angstrom, the 1.7 micron curve at 18.6 Angstrom, and both then oscillate faster as frequency rises.',
});

/* ------------------------------------------------ Figure 2: first zero against defocus */
const dfs = [], firsts = [], counts = [];
for (let df = 0.3; df <= 3.51; df += 0.02) {
  const o = { kV: 300, csMm: CS, amp: AMP, defocusUm: df }, zs = ctfZeros(o, S.nyquistK);
  dfs.push(df); firsts.push(1 / zs[0]); counts.push(zs.filter((k) => k < 1 / D_FINAL).length);
}
const fig2 = chart({
  title: 'What the defocus choice buys',
  xLabel: 'Defocus (µm underfocus)',
  yLabel: 'First CTF zero (Å)',
  series: [{ name: 'First zero', x: dfs, y: firsts }],
  xDomain: [0, 3.6], yDomain: [0, 30],
  bands: [{ x0: 1.7, x1: 2.1, text: 'the paper' }],
  height: 250,
  desc: 'A curve rising steadily: the first CTF zero sits near 8 Angstrom at 0.3 micron defocus and near 27 Angstrom at 3.5 micron, with the 1.7 to 2.1 micron range used by the paper shaded.',
});
console.log('--- first zero against defocus ---');
for (const df of [0.5, 1.0, 1.7, 2.1, 3.0]) { const i = dfs.findIndex((x) => Math.abs(x - df) < 1e-9); console.log('defocus', df, 'um -> first zero', g(firsts[i]), 'A,', counts[i], 'zeros before 3.48 A'); }

/* ------------------------------------------------ Figure 3: Rosenthal-Henderson lines through their point */
const xs = [];
for (let i = 0; i <= 90; i++) xs.push(10000 * 10 ** ((2.3 * i) / 90));
const line = (B) => xs.map((n) => rhResolution(n, B, N_FINAL, D_FINAL));
const fig3 = chart({
  title: 'Particles against resolution through the published map',
  xLabel: 'Particles in the reconstruction (log scale)',
  yLabel: 'Resolution (Å)',
  series: [
    { name: 'B = 50 Å²', x: xs.map(Math.log10), y: line(50) },
    { name: 'B = 100 Å²', x: xs.map(Math.log10), y: line(100), colour: 'var(--c-tools)' },
    { name: 'B = 150 Å²', x: xs.map(Math.log10), y: line(150), colour: 'var(--ink)', dash: '4 3' },
    { name: 'The published map', x: [Math.log10(N_FINAL)], y: [D_FINAL], kind: 'dots', size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [4, 6.3], yDomain: [2, 6],
  xFmt: (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? '10' + ['⁴', '⁵', '⁶'][Math.round(v) - 4] : ''),
  xTicks: [4, 4.5, 5, 5.5, 6],
  vlines: [{ x: Math.log10(N_EXTRACTED), text: 'all extracted', left: true }],
  height: 280,
  desc: 'Three falling curves of resolution against particle count on a logarithmic axis, all passing through the published point of 80,856 particles at 3.48 Angstrom, with a dashed line at the 1.14 million particles originally extracted.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'ctf', figure(fig1, 'Figure 1. The contrast transfer function at the two ends of the paper’s defocus range, from the Cryo-EM calculator’s own `ctfCurve`, at 300 kV with Cs 2.7 mm and 0.1 amplitude contrast (both our assumptions). The first zero moves from 18.6 to 20.7 Å across the range.'));
md = inject(md, 'defocus', figure(fig2, 'Figure 2. The first CTF zero against defocus at 300 kV, with the paper’s 1.7 to 2.1 µm range shaded. More defocus pulls the first zero to lower resolution and packs more rings in before 3.48 Å; less defocus gives weaker low-resolution contrast but easier CTF fitting.'));
md = inject(md, 'rh', figure(fig3, 'Figure 3. Rosenthal-Henderson lines drawn through the published map (80,856 particles at 3.48 Å) for three B-factors, with the 1,141,564 particles originally extracted marked. Only the point is the paper’s; the B-factors are ours.'));
fs.writeFileSync(ART, md);
console.log('fig1', fig1.length, 'fig2', fig2.length, 'fig3', fig3.length, 'bytes');
