// Figures for src/blog/discoveries/olive-pomace-nir-drying-effective-diffusivity-arrhenius.md, made with the maths of
// the Diffusion calculator (src/lib/sci/diffusion.ts: the Arrhenius law and the erfc solution of Fick's second law).
// Run: node scripts/blog-figures/olive-pomace-nir-drying-effective-diffusivity-arrhenius.mjs
import fs from 'node:fs';
import { arrhenius, R_GAS, conc, timeFor, depthFor, finiteDiff } from '../../src/lib/sci/diffusion.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/olive-pomace-nir-drying-effective-diffusivity-arrhenius.md', import.meta.url);

// Inputs from the paper: Pyrka I. and Nenadis N. (2025), Foods 14(12): 2042, doi:10.3390/foods14122042 (CC BY 4.0).
// Near-infrared thin-layer drying of two-phase olive pomace at 70 to 140 C; effective moisture diffusivity
// 1.417e-9 to 5.807e-9 m2/s; activation energy 23.732 kJ/mol; 140 C cut the drying time by 68 % against 70 C.
// OUR ASSUMPTION: the smallest diffusivity belongs to the lowest temperature (70 C) and the largest to 140 C,
// as diffusivity always rises with temperature; the paper's abstract gives the range without pairing them.
const T1 = 70 + 273.15, T2 = 140 + 273.15, D1 = 1.417e-9, D2 = 5.807e-9;
const PAPER_Q = 23.732; // kJ/mol, the paper's own fit over all its temperatures

// Two points fix an Arrhenius line: Q = R ln(D2/D1) / (1/T1 - 1/T2), then D0 from either point.
const Q = (R_GAS * Math.log(D2 / D1)) / (1 / T1 - 1 / T2);
const D0 = D1 / Math.exp(-Q / (R_GAS * T1));
const D = (tC) => arrhenius(D0, Q, tC + 273.15);

// Drying as Fick's second law with the surface held at the dry end: moisture 1 inside, 0 at the surface.
const CASE = { kind: 'surface', C0: 1, Cs: 0 };
const DEPTH = 3e-3; // 3 mm below the surface (our choice, a plausible thin layer)
const tHalf = (tC) => timeFor(CASE, D(tC), DEPTH, 0.5); // seconds for the moisture there to halve
const halfDepth = (tC, t) => depthFor(CASE, D(tC), t, 0.5);

const temps = Array.from({ length: 71 }, (_, i) => 70 + i); // 70 to 140 C
const fig1 = chart({
  title: 'Arrhenius line through the paper\'s two ends', xLabel: '1000 / T (K⁻¹)', yLabel: 'Effective diffusivity (10⁻⁹ m² s⁻¹)',
  series: [
    { name: 'Tool\'s Arrhenius law', kind: 'line', x: temps.map((t) => 1000 / (t + 273.15)), y: temps.map((t) => Math.log10(D(t) * 1e9)) },
    { name: 'Paper\'s two ends', kind: 'dots', size: 4, x: [1000 / T1, 1000 / T2], y: [Math.log10(D1 * 1e9), Math.log10(D2 * 1e9)] },
  ],
  xDomain: [2.4, 2.95], yDomain: [0.1, 0.79], yTicks: [0.1761, 0.301, 0.4771, 0.6021, 0.6990, 0.7782].slice(0, 5),
  yFmt: (v) => String(+(10 ** v).toPrecision(2)),
  desc: 'Effective moisture diffusivity against reciprocal temperature on a log scale. The straight line is the Diffusion calculator\'s Arrhenius law with Q 23.75 kJ per mole, and the two dots are the ends of the paper\'s stated range.',
  height: 280,
});

const xs = Array.from({ length: 61 }, (_, i) => i * 0.1e-3); // 0 to 6 mm
const fig2 = chart({
  title: 'Moisture left after 30 minutes', xLabel: 'Depth below the surface (mm)', yLabel: 'Moisture (fraction of the start)',
  series: [
    { name: '70 °C', kind: 'line', x: xs.map((x) => x * 1e3), y: xs.map((x) => +conc(CASE, D(70), x, 1800).toFixed(4)) },
    { name: '140 °C', kind: 'line', x: xs.map((x) => x * 1e3), y: xs.map((x) => +conc(CASE, D(140), x, 1800).toFixed(4)) },
  ],
  xDomain: [0, 6], yDomain: [0, 1],
  hlines: [{ y: 0.5, text: 'half dried' }],
  vlines: [{ x: +(halfDepth(70, 1800) * 1e3).toFixed(2), text: `${(halfDepth(70, 1800) * 1e3).toFixed(2)} mm`, left: true }, { x: +(halfDepth(140, 1800) * 1e3).toFixed(2), text: `${(halfDepth(140, 1800) * 1e3).toFixed(2)} mm`, dy: 14 }],
  desc: 'Moisture profiles from the error-function solution of Fick\'s second law after 30 minutes, at the two ends of the paper\'s temperature range. The half-dried front is 1.52 mm deep at 70 C and 3.08 mm at 140 C.',
  height: 280,
});

// A finite-difference run as an independent check of the erfc profile at 140 C.
const fd = finiteDiff(CASE, D(140), 1800, 8e-3);
const fdAt = (x) => { let k = 0; for (let i = 0; i < fd.x.length; i++) if (Math.abs(fd.x[i] - x) < Math.abs(fd.x[k] - x)) k = i; return fd.c[k]; };

console.log(JSON.stringify({
  Q_kJ: +(Q / 1000).toFixed(3), paperQ: PAPER_Q, diffPct: +((100 * (Q / 1000 - PAPER_Q)) / PAPER_Q).toFixed(2), D0: +D0.toPrecision(4), Q_eV: +(Q / 96485).toFixed(4),
  D: Object.fromEntries([70, 85, 100, 120, 140].map((t) => [t, +D(t).toPrecision(4)])),
  ratio: +(D2 / D1).toFixed(2), timeCutPct: +(100 * (1 - D1 / D2)).toFixed(1),
  halfTimeMin: Object.fromEntries([70, 100, 140].map((t) => [t, +(tHalf(t) / 60).toFixed(1)])),
  halfDepth30minMm: Object.fromEntries([70, 100, 140].map((t) => [t, +(halfDepth(t, 1800) * 1e3).toFixed(2)])),
  erfcAt3mm140: +conc(CASE, D(140), 3e-3, 1800).toFixed(4), fdAt3mm140: +fdAt(3e-3).toFixed(4),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'arrhenius', figure(fig1, 'Figure 1. The Arrhenius law of the Diffusion calculator fitted to the two ends of the paper\'s diffusivity range (dots). The slope gives an activation energy of 23.75 kJ/mol, against the 23.732 kJ/mol the paper reports from its own fit over every temperature.'));
  md = inject(md, 'profiles', figure(fig2, 'Figure 2. Moisture profiles after 30 minutes from the same tool, treating drying as Fick\'s second law with the surface held dry. Our own normalised moisture scale and 30-minute time, not the paper\'s measurements.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
