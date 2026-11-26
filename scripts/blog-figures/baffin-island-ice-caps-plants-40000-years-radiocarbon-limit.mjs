// Figures for src/blog/discoveries/baffin-island-ice-caps-plants-40000-years-radiocarbon-limit.md, made with the maths of
// the Half-life (decay) calculator (src/lib/sci/decay.ts) and the Radiocarbon calibration tool (src/lib/sci/radiocarbon.ts,
// IntCal20 curve in src/data/intcal20.txt).
// Run: node scripts/blog-figures/baffin-island-ice-caps-plants-40000-years-radiocarbon-limit.mjs
import fs from 'node:fs';
import { halfLifeSolve } from '../../src/lib/sci/decay.ts';
import { readCurve, calibrate } from '../../src/lib/sci/radiocarbon.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/baffin-island-ice-caps-plants-40000-years-radiocarbon-limit.md', import.meta.url);
const curve = readCurve(fs.readFileSync(new URL('../../src/data/intcal20.txt', import.meta.url), 'utf8'));

// From the paper (Pendleton et al. 2019, Nat. Commun. 10: 445, doi:10.1038/s41467-019-08307-w, CC BY 4.0):
// 48 plants from 30 ice caps, radiocarbon ages of 40 to more than 50 ka; in situ 14C half-life 5700 ± 30 years;
// margins retreating about 10 m per year; dead plants survive up to 200 m beyond the ice.
// Conventional radiocarbon ages use the Libby half-life of 5568 years (Stuiver and Polach 1977).
const LIBBY = 5568, TRUE_HALF = 5700;
const left = (t, T = LIBBY) => halfLifeSolve({ n0: 100, nt: null, t, T }).value; // percent of the starting 14C
// OUR ASSUMPTIONS: a laboratory background of about 0.2 % of modern carbon (a typical AMS limit for well-cleaned
// plant material), and 1σ errors of ±500 years at 40,000 BP and ±800 years at 45,000 BP for the calibration example.
const BG = 0.2;
const limitAge = halfLifeSolve({ n0: 100, nt: BG, t: null, T: LIBBY }).value;

const cal40 = calibrate(curve, 40000, 500), cal45 = calibrate(curve, 45000, 800);
const r = (x) => Math.round(x);
const out = {
  pct_left: { 10000: +left(10000).toFixed(2), 20000: +left(20000).toFixed(2), 40000: +left(40000).toFixed(3), 45000: +left(45000).toFixed(3), 50000: +left(50000).toFixed(3), 55000: +left(55000).toFixed(3) },
  halves_40k: +(40000 / LIBBY).toFixed(2), halves_50k: +(50000 / LIBBY).toFixed(2),
  limitAge_at_0_2pct: r(limitAge), limitAge_at_0_1pct: r(halfLifeSolve({ n0: 100, nt: 0.1, t: null, T: LIBBY }).value),
  // In situ 14C buried under ice keeps decaying with the true half-life the paper uses.
  insitu_left_after: { 4500: +left(4500, TRUE_HALF).toFixed(1), 12000: +left(12000, TRUE_HALF).toFixed(1), 40000: +left(40000, TRUE_HALF).toFixed(2), 115000: +left(115000, TRUE_HALF).toExponential(2) },
  cal40: { median: r(cal40.median), hpd95: cal40.hpd[1].ranges.map((x) => [x[0], x[1], +(x[2] * 100).toFixed(1)]), hpd68: cal40.hpd[0].ranges.map((x) => [x[0], x[1], +(x[2] * 100).toFixed(1)]) },
  cal45: { median: r(cal45.median), hpd95: cal45.hpd[1].ranges.map((x) => [x[0], x[1], +(x[2] * 100).toFixed(1)]), hpd68: cal45.hpd[0].ranges.map((x) => [x[0], x[1], +(x[2] * 100).toFixed(1)]) },
  exposure_years_at_10m_per_yr: 200 / 10,
};
console.log(JSON.stringify(out, null, 1));

const ages = Array.from({ length: 121 }, (_, i) => i * 500);
const fig1 = chart({
  title: 'How much radiocarbon is left in a plant', xLabel: 'Radiocarbon age (thousand years BP)', yLabel: 'Carbon-14 left (% of modern)',
  series: [{ name: 'Carbon-14 left', kind: 'line', x: ages.map((a) => a / 1000), y: ages.map((a) => Math.log10(left(a))) }],
  xDomain: [0, 60], yDomain: [-1.5, 2.1], yTicks: [-1, 0, 1, 2], yFmt: (v) => (v === -1 ? '0.1' : v === 0 ? '1' : v === 1 ? '10' : '100'),
  bands: [{ x0: 40, x1: 50, text: 'Baffin plants' }],
  hlines: [{ y: Math.log10(BG), text: 'typical lab background 0.2 %' }],
  desc: 'Percentage of carbon-14 left against radiocarbon age, on a log scale. At 40,000 years about 0.7 percent is left and at 50,000 years about 0.2 percent, close to a typical laboratory background.',
  height: 270,
});

const grid = (c, lo, hi) => { const xs = [], ys = []; for (let i = 0; i < c.t.length; i += 50) if (c.t[i] >= lo && c.t[i] <= hi) { xs.push(c.t[i] / 1000); ys.push(c.p[i] * 1000); } return { xs, ys }; };
const g40 = grid(cal40, 41000, 51000), g45 = grid(cal45, 41000, 51000);
const fig2 = chart({
  title: 'Calendar ages are older than radiocarbon ages', xLabel: 'Calendar age (thousand years cal BP)', yLabel: 'Probability (per 1000 yr)',
  series: [
    { name: '40,000 ± 500 ¹⁴C BP', kind: 'line', x: g40.xs, y: g40.ys },
    { name: '45,000 ± 800 ¹⁴C BP', kind: 'line', x: g45.xs, y: g45.ys },
  ],
  xDomain: [41, 51], xTicks: [42, 44, 46, 48, 50],
  desc: 'IntCal20 calibrated probability for radiocarbon ages of 40,000 plus or minus 500 and 45,000 plus or minus 800 years BP. The calendar ages peak near 43,300 and 47,300 years before 1950.',
  height: 260,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'left', figure(fig1, 'Figure 1. The share of carbon-14 a dead plant keeps, worked out with the Half-life calculator\'s maths at the Libby half-life used for radiocarbon ages. The shaded band is the paper\'s 40 to more than 50 thousand years; the dashed line is our assumed laboratory background.'));
  md = inject(md, 'cal', figure(fig2, 'Figure 2. Two example radiocarbon ages calibrated with IntCal20 in the Radiocarbon calibration tool\'s maths. The errors (±500 and ±800 years) are our assumptions for illustration, not the paper\'s measurements. The calendar medians come out about 3,300 and 2,300 years older than the radiocarbon ages.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
