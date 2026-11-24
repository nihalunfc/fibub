// Figures for src/blog/discoveries/jiugong-mountain-gravimetric-calibration-line-326-mgal-vertical-gradient.md, made
// with the maths of the Gravity survey corrections tool (src/lib/sci/gravity.ts: free-air gradient, drift, meter factor).
// Run: node scripts/blog-figures/jiugong-mountain-gravimetric-calibration-line-326-mgal-vertical-gradient.mjs
import fs from 'node:fs';
import { freeAir, reduce, parseHours } from '../../src/lib/sci/gravity.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/jiugong-mountain-gravimetric-calibration-line-326-mgal-vertical-gradient.md', import.meta.url);

// Inputs from the paper: Liu, Gou, Li, Hu and Zhang (2025), Frontiers in Earth Science 13: 1429119,
// doi:10.3389/feart.2025.1429119 (CC BY). Line difference 326.9338 mGal ± 0.0064 mGal; scale factor uncertainty better
// than 2.0e-5; earlier Lushan line 229 mGal; measured vertical gradients at the four absolute stations (µGal/cm, centre):
// JZ01 −2.528, JZ04 −2.366, JZ07 −3.647, JZ12 −3.890; global average 3.09 µGal/cm; gradients measured between 72 and
// 120 cm; round trip about two and a half hours.
const DG = 326.9338, U = 0.0064, SCALE_U = 2.0e-5, LUSHAN = 229;
const GRAD = [['JZ01', 2.528], ['JZ04', 2.366], ['JZ07', 3.647], ['JZ12', 3.890]];

// 1. What the line's uncertainty means for a meter factor, and what a meter-factor error does over the line.
const scale = { lineFromScale: DG * SCALE_U * 1000, scaleFromLine: U / DG, scaleLushan: U / LUSHAN, err1e4: DG * 1e-4 * 1000 };

// 2. Transferring g over 1.20 m (our assumption: a typical absolute-meter height) with the normal free-air gradient
//    (the tool's 0.3086 mGal/m) against each measured gradient.
const HT = 1.2, normal = freeAir(HT, 29.5) * 1000; // µGal
const transfer = GRAD.map(([s, g]) => ({ s, g, measured: g * HT * 100, err: normal - g * HT * 100 }));

// 3. A simulated relative-gravimeter loop over the line (OUR numbers): the meter reads 3e-4 low, drifts +0.012 mGal/h,
//    readings rounded to 0.001; base value and latitude made up; elevations set to 0 (anomalies not used).
const E = 3e-4, DRIFT = 0.012, GB = 979500.0, LAT = 29.5;
const times = ['08:00', '09:15', '10:30', '11:45', '13:00'], names = ['FOOT', 'TOP', 'FOOT', 'TOP', 'FOOT'];
const rows = times.map((t, i) => { const h = parseHours(t) - 8, g = names[i] === 'TOP' ? -DG : 0; return { name: names[i], t: parseHours(t), reading: +(1000 + g / (1 + E) + DRIFT * h).toFixed(3), lat: LAT, h: 0 }; });
const diffFor = (cal) => { const R = reduce(rows, { base: 'FOOT', gBase: GB, cal, rho: 2670, ell: 'grs80', fa: 'simple' }); const tops = R.rows.filter((r) => r.name === 'TOP'); return { tops: tops.map((r) => r.gObs), diff: tops.reduce((s, r) => s + r.gObs, 0) / tops.length - GB, rate: R.rate }; };
const raw = diffFor(1), cal = DG / -raw.diff, fixed = diffFor(cal);
console.log(JSON.stringify({ scale, normal, transfer, rows: rows.map((r) => [r.name, times[rows.indexOf(r)], r.reading]), raw, cal, fixed }, null, 0));

// Figure 1: gravity change over the first 1.5 m above a mark, normal gradient against the four measured ones.
const Z = Array.from({ length: 16 }, (_, i) => i * 0.1);
const fig1 = chart({
  title: 'Gravity falls with height: normal vs measured', xLabel: 'Height above the mark (m)', yLabel: 'Fall in gravity (µGal)',
  series: [
    { name: 'Normal 0.3086 mGal/m', kind: 'line', x: Z, y: Z.map((z) => +(freeAir(z, LAT) * 1000).toFixed(2)), colour: 'var(--ink)', dash: '5 4' },
    { name: 'JZ12 (3.890 µGal/cm)', kind: 'line', x: Z, y: Z.map((z) => +(3.890 * z * 100).toFixed(2)) },
    { name: 'JZ04 (2.366 µGal/cm)', kind: 'line', x: Z, y: Z.map((z) => +(2.366 * z * 100).toFixed(2)) },
  ],
  xDomain: [0, 1.5], yDomain: [0, 600], vlines: [{ x: HT, text: '1.2 m' }], height: 270,
  desc: `Over 1.2 m the normal gradient predicts a fall of ${normal.toFixed(1)} µGal; the steepest and gentlest measured gradients on the line give ${transfer[3].measured.toFixed(1)} and ${transfer[1].measured.toFixed(1)} µGal.`,
});
// Figure 2: error in the line difference against the meter-factor error, from the simulated loop run through reduce().
const EE = Array.from({ length: 21 }, (_, i) => -2e-4 + i * 2e-5);
const fig2 = chart({
  title: 'A meter-factor error across a 327 mGal line', xLabel: 'Meter factor error (parts per 100,000)', yLabel: 'Error in difference (µGal)',
  series: [{ name: 'Simulated loop, reduced with the tool', kind: 'line', x: EE.map((e) => +(e * 1e5).toFixed(1)), y: EE.map((e) => +((-diffFor(cal * (1 + e)).diff - DG) * 1000).toFixed(2)) }],
  xDomain: [-20, 20], hlines: [{ y: 6.4, text: '+6.4 µGal' }, { y: -6.4, text: '−6.4' }], vlines: [{ x: 2, text: '' }, { x: -2, text: '' }], height: 260,
  desc: 'The error in the 327 mGal difference grows by about 3.3 µGal for every part per 100,000 of meter-factor error; the line\'s own 6.4 µGal uncertainty corresponds to about 2 parts per 100,000.',
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'gradient', figure(fig1, 'Figure 1. How much gravity falls in the first 1.5 m above a station mark: the normal free-air gradient the Gravity survey corrections tool uses (dashed) against the steepest (JZ12) and gentlest (JZ04) gradients the paper measured on the line. The 1.2 m mark is our assumed instrument height.'));
  md = inject(md, 'scale', figure(fig2, 'Figure 2. A simulated relative-gravimeter loop over a 326.9338 mGal line (our numbers), reduced with the tool\'s drift and meter-factor maths for a range of meter-factor errors. The dashed lines mark the line\'s stated uncertainty of 6.4 µGal and a meter-factor error of 2 parts per 100,000. Not the paper\'s measurements.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
