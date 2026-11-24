// Figures for src/blog/discoveries/swir-spectrometer-wavelength-calibration-recheck.md, made with the maths of the
// Spectrometer calibration tool (src/lib/sci/phspec.ts: sub-pixel peak finding and the pixel-to-wavelength fit) and
// the Uncertainty propagation calculator (src/lib/sci/uncertainty.ts).
// Run: node scripts/blog-figures/swir-spectrometer-wavelength-calibration-recheck.mjs   (rewrites the charts)
import fs from 'node:fs';
import { findPeaks, calibrate, polyval, plainCoeffs } from '../../src/lib/sci/phspec.ts';
import { propagate } from '../../src/lib/sci/uncertainty.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/swir-spectrometer-wavelength-calibration-recheck.md', import.meta.url);

// From the paper: Li, H. et al. (2025), Remote Sensing 17(5): 851, doi:10.3390/rs17050851 (CC BY).
// Linear wavelength calibration lambda = 1677.63199 - 0.13341 x (x = pixel), R^2 = 0.99999; spectral response FWHM
// 0.1867 nm from a Gaussian fit; range 1592.4 to 1677.6 nm; a 1653 nm laser gave a maximum deviation of 0.022 nm
// against a requirement of 0.05 nm; uncertainty components 0.005 nm (lamp instability), 0.012 nm (Gaussian fit and
// peak identification) and 0.016 nm (regression), with no combined total given.
const A0 = 1677.63199, A1 = -0.13341, FWHM_NM = 0.1867, LASER = 1653, DEV = 0.022, REQ = 0.05;
const U = [{ name: 'lamp instability', u: 0.005 }, { name: 'Gaussian fit and peak identification', u: 0.012 }, { name: 'least-squares regression', u: 0.016 }];

// --- 1. Does the stated line really describe the stated range? How many pixels does the array have?
const pixOf = (nm) => (nm - A0) / A1;
console.log('pixel of each stated wavelength, from the paper\'s own line:');
for (const nm of [1677.63199, 1677.6, 1677.2, 1653, 1605.328, 1592.4]) console.log(`  ${nm} nm -> pixel ${pixOf(nm).toFixed(2)}`);
for (const n of [512, 640, 1024]) console.log(`  a ${n}-pixel array would span ${A0.toFixed(2)} down to ${(A0 + A1 * (n - 1)).toFixed(2)} nm`);

// --- 2. The tool's own fit, from pairs built with the paper's line.
const PX = [20, 120, 220, 320, 420, 520, 620];
const NM = PX.map((x) => +(A0 + A1 * x).toFixed(4));
const cal = calibrate(PX, NM, 1);
const coef = plainCoeffs(cal.fit);
console.log(`\ntool fit from 7 pairs on the paper's line: lambda = ${coef[0].toFixed(5)} + (${coef[1].toFixed(5)}) x, dispersion ${cal.dispersion.toFixed(5)} nm/pixel, rms residual ${cal.rms.toExponential(2)} nm`);
console.log(`  the 1653 nm laser sits at pixel ${pixOf(LASER).toFixed(3)}; the tool's line gives ${polyval(cal.fit, pixOf(LASER)).toFixed(5)} nm there`);
console.log(`  a ${DEV} nm deviation is ${(DEV / Math.abs(A1)).toFixed(3)} pixel; the ${REQ} nm requirement is ${(REQ / Math.abs(A1)).toFixed(3)} pixel`);

// --- 3. Sampling: how many pixels per resolution element?
const SAMP = FWHM_NM / Math.abs(A1);
console.log(`\nspectral response FWHM ${FWHM_NM} nm = ${SAMP.toFixed(3)} pixels; Nyquist asks for 2 or more`);

// --- 4. Combine the paper's three uncertainty components with the uncertainty tool's maths.
const res = propagate((v) => v[0] + v[1] + v[2], U.map((c) => ({ name: c.name, value: 0, spread: c.u, dist: 'normal' })), 0.9545);
console.log(`\ncombined standard uncertainty ${res.uc.toFixed(4)} nm; expanded (95 %, k = ${res.k.toFixed(2)}) ${res.U.toFixed(4)} nm against the ${REQ} nm requirement`);
for (const r of res.rows) console.log(`  ${r.name}: u ${r.u}, ${(100 * r.share).toFixed(0)} % of the variance`);

// --- 5. Where a sub-pixel peak finder goes wrong at this sampling.
// A Gaussian line of the instrument's width, sampled at pixel centres, with its centre moved across one pixel.
const sigmaPx = (s) => s / 2.3548200450309493;
const sample = (centre, s, n = 9) => Array.from({ length: n }, (_, i) => Math.exp(-0.5 * ((i - 4 - centre) / sigmaPx(s)) ** 2));
const bias = (s) => {
  const off = [], err = [];
  for (let d = -0.5; d <= 0.5001; d += 0.02) {
    const y = sample(d, s), p = findPeaks(y, 0.05, 3);
    off.push(+d.toFixed(2));
    err.push(p.length ? +((p[0].x - (4 + d)) * Math.abs(A1)).toFixed(5) : NaN);
  }
  return { off, err, worst: Math.max(...err.map((e) => Math.abs(e))) };
};
const b14 = bias(SAMP), b30 = bias(3), b20 = bias(2);
console.log(`\nworst systematic error of the 3-point parabolic peak finder, noise-free:`);
console.log(`  at ${SAMP.toFixed(2)} pixels per FWHM (this instrument): ${(b14.worst * 1000).toFixed(1)} pm = ${b14.worst.toFixed(4)} nm`);
console.log(`  at 2.00 pixels per FWHM (Nyquist): ${(b20.worst * 1000).toFixed(1)} pm`);
console.log(`  at 3.00 pixels per FWHM: ${(b30.worst * 1000).toFixed(1)} pm`);
console.log(`  the paper's peak-identification uncertainty is ${U[1].u} nm = ${(U[1].u * 1000).toFixed(0)} pm`);

// --- Chart 1: the line as the detector sees it, at three samplings.
const fine = Array.from({ length: 161 }, (_, i) => -4 + i * 0.05);
const curve = (s) => fine.map((x) => +Math.exp(-0.5 * (x / sigmaPx(s)) ** 2).toFixed(4));
const px = Array.from({ length: 9 }, (_, i) => i - 4);
const fig1 = chart({
  title: 'One emission line, as the pixels see it', xLabel: 'Pixel, relative to the line centre', yLabel: 'Signal (peak = 1)',
  series: [
    { name: `${SAMP.toFixed(2)} px per FWHM (this instrument)`, kind: 'line', x: fine, y: curve(SAMP), colour: 'var(--c-blog)' },
    { name: '3.00 px per FWHM', kind: 'line', x: fine, y: curve(3), colour: 'var(--c-tools)' },
    { name: 'what the pixels record', kind: 'dots', x: px, y: px.map((x) => +Math.exp(-0.5 * (x / sigmaPx(SAMP)) ** 2).toFixed(4)), size: 3.2, colour: 'var(--ink)' },
  ],
  xDomain: [-4, 4], yDomain: [0, 1.08],
  desc: 'A Gaussian spectral line at 1.40 pixels per FWHM, the sampling of this spectrometer, against a comfortably sampled 3.00 pixels per FWHM. The dots show the nine pixel readings: only three carry useful signal.',
  height: 290,
});

// --- Chart 2: the parabolic peak finder's systematic error against the line's position in the pixel.
const fig2 = chart({
  title: 'Where a 3-point peak finder puts the line', xLabel: 'True line centre within the pixel (pixels)', yLabel: 'Error in the found centre (nm)',
  series: [
    { name: `${SAMP.toFixed(2)} px per FWHM`, kind: 'line', x: b14.off, y: b14.err, colour: 'var(--c-blog)' },
    { name: '2.00 px per FWHM', kind: 'line', x: b20.off, y: b20.err, colour: 'var(--ink)' },
    { name: '3.00 px per FWHM', kind: 'line', x: b30.off, y: b30.err, colour: 'var(--c-tools)' },
  ],
  xDomain: [-0.5, 0.5], yDomain: [-0.024, 0.024],
  hlines: [{ y: U[1].u, text: `paper: ±${U[1].u} nm` }, { y: -U[1].u, text: '' }],
  desc: 'Systematic error of a parabola through the three highest pixels, as the true line centre moves across one pixel, at three samplings. At this instrument’s 1.40 pixels per FWHM the error reaches about 0.04 nm, three times the paper’s stated peak-identification uncertainty.',
  height: 290,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'sampling', figure(fig1, 'Figure 1. The spectrometer’s own spectral response (0.1867 nm wide) laid over its pixel spacing (0.13341 nm): 1.40 pixels per resolution element. The dots are the nine pixel readings a line produces. A comfortably sampled instrument (3 pixels per FWHM) is drawn for comparison.'));
md = inject(md, 'bias', figure(fig2, 'Figure 2. Noise-free systematic error of the Spectrometer calibration tool’s own peak finder (a parabola through the three highest pixels) as a line is walked across one pixel, at three samplings. Dashed lines mark the paper’s 0.012 nm peak-identification uncertainty.'));
fs.writeFileSync(ART, md);
console.log('\ncharts written; fig1', fig1.length, 'bytes, fig2', fig2.length, 'bytes');
