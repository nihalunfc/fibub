// Figures for src/blog/discoveries/earth-air-tube-riyadh-effectiveness-ntu-temperature-drop.md, made with the maths
// of the Heat exchanger sizing tool (src/lib/sci/eng-hx.ts: effectiveness-NTU) and the Dimensionless numbers tool
// (src/lib/sci/phdimless.ts: Reynolds and Prandtl for the air in the pipe).
// Run: node scripts/blog-figures/earth-air-tube-riyadh-effectiveness-ntu-temperature-drop.mjs
import fs from 'node:fs';
import { effectiveness, ntuFor, rate } from '../../src/lib/sci/eng-hx.ts';
import { dimensionless } from '../../src/lib/sci/phdimless.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/earth-air-tube-riyadh-effectiveness-ntu-temperature-drop.md', import.meta.url);

// From the paper: Alanazi, Kotbi M. G., Alfadil and Kotbi A. G. (2026), Energies 19(21): 5355,
// doi:10.3390/en19215355 (CC BY). Earth-air tube 19.8 m of horizontal run, 0.30 m bore, buried 6.0 m;
// design point 43.5 L/s per pipe with NTU 0.78 and effectiveness 0.54; 20 L/s giving effectiveness 0.65;
// soil at 6 m between 23.3 and 27.5 C, mean 25.4 C; mean cooling temperature drop 4.8 K over 4623 h,
// maximum 12.6 K; mean heating rise 7.8 K over 360 h; sensible cooling delivered 534 kWh/yr.
const L_PIPE = 19.8, D = 0.30, Q_DESIGN = 43.5, Q_LOW = 20;
const NTU_DESIGN = 0.78, EPS_DESIGN = 0.54, EPS_LOW = 0.65;
const T_SOIL = 25.4, DT_MEAN = 4.8, DT_MAX = 12.6, HOURS_COOL = 4623, HOURS_HEAT = 360, DT_HEAT = 7.8;
const DELIVERED = 534; // kWh per year
const AREA = Math.PI * D * L_PIPE;

// Air properties: the Dimensionless numbers tool's rounded air at 20 C and 1 atm. OUR ASSUMPTION: we use them
// unchanged over the whole flow range rather than at each local temperature.
const AIR = { rho: 1.204, mu: 1.81e-5, cp: 1005, k: 0.0257, c: 343, sigma: NaN, beta: 1 / 293.15 };
const PR = (AIR.mu * AIR.cp) / AIR.k;
const vel = (lps) => (lps / 1000) / (Math.PI * (D / 2) ** 2);
const re = (lps) => dimensionless({ ...AIR, U: vel(lps), L: D, geometry: 'pipe' }).find((n) => n.id === 're').value;
// Dittus-Boelter for a cooled gas in a smooth pipe: Nu = 0.023 Re^0.8 Pr^0.3 (a textbook correlation, not a
// fibub tool). h = Nu k / D.
const hAir = (lps) => (0.023 * re(lps) ** 0.8 * PR ** 0.3 * AIR.k) / D;
const cap = (lps) => ((lps / 1000) * AIR.rho) * AIR.cp; // W/K

// Step 1: the paper's own pair, NTU and effectiveness, with the soil as an infinite capacity (Cr = 0).
const epsFromNtu = (ntu) => effectiveness('counter', ntu, 0);
const step1 = { epsDesign: epsFromNtu(NTU_DESIGN), ntuLow: ntuFor('counter', EPS_LOW, 0), ntuDesignBack: ntuFor('counter', EPS_DESIGN, 0) };

// Step 2: turn each effectiveness into an overall U, then split it into the air film and everything else.
const uFor = (lps, ntu) => (ntu * cap(lps)) / AREA;
const U_DESIGN = uFor(Q_DESIGN, NTU_DESIGN), U_LOW = uFor(Q_LOW, step1.ntuLow);
const H_DESIGN = hAir(Q_DESIGN), H_LOW = hAir(Q_LOW);
const R_REST = 1 / U_DESIGN - 1 / H_DESIGN;          // m2K/W left for the clay wall and the soil
const uModel = (lps) => 1 / (1 / hAir(lps) + R_REST); // our series-resistance model
const step2 = {
  U_DESIGN, U_LOW, H_DESIGN, H_LOW, R_REST,
  uModelAtLow: uModel(Q_LOW), epsModelAtLow: epsFromNtu((uModel(Q_LOW) * AREA) / cap(Q_LOW)),
  impliedExponent: Math.log(U_LOW / U_DESIGN) / Math.log(Q_LOW / Q_DESIGN),
};

// Step 3: the energy the paper says the tube delivers, from the same capacity rate.
const step3 = {
  powerMean: cap(Q_LOW) * DT_MEAN, kwhCool: (cap(Q_LOW) * DT_MEAN * HOURS_COOL) / 1000,
  kwhHeat: (cap(Q_LOW) * DT_HEAT * HOURS_HEAT) / 1000,
  impliedMeanAmbient: T_SOIL + DT_MEAN / EPS_LOW, impliedPeakAmbient: T_SOIL + DT_MAX / EPS_LOW,
  deliveredRatio: (cap(Q_LOW) * DT_MEAN * HOURS_COOL) / 1000 / DELIVERED,
};

// Figure 1: effectiveness and temperature drop against airflow, from the series-resistance model.
const QS = Array.from({ length: 96 }, (_, i) => 5 + i);
const epsQ = QS.map((q) => epsFromNtu((uModel(q) * AREA) / cap(q)));
const fig1 = chart({
  title: 'Earth-tube effectiveness against airflow', xLabel: 'Airflow through one pipe (L/s)', yLabel: 'Effectiveness ε',
  series: [
    { name: 'Series-resistance model', kind: 'line', x: QS, y: epsQ.map((e) => +e.toFixed(4)) },
    { name: 'The paper\'s two points', kind: 'dots', x: [Q_LOW, Q_DESIGN], y: [EPS_LOW, EPS_DESIGN], size: 4 },
  ],
  xDomain: [5, 100], yDomain: [0.2, 1], height: 285,
  desc: 'Effectiveness of the 19.8 m earth tube against airflow from 5 to 100 litres per second, from a series resistance model pinned to the paper design point, with the paper two published effectiveness values marked.',
});

// Figure 2: how long the pipe would have to be, at 20 L/s, for a wanted effectiveness.
const LS = Array.from({ length: 116 }, (_, i) => 5 + i);
const epsL = LS.map((l) => epsFromNtu((uModel(Q_LOW) * Math.PI * D * l) / cap(Q_LOW)));
const fig2 = chart({
  title: 'Effectiveness against pipe length at 20 L/s', xLabel: 'Horizontal pipe run (m)', yLabel: 'Effectiveness ε',
  series: [
    { name: '', kind: 'line', x: LS, y: epsL.map((e) => +e.toFixed(4)) },
    { name: '', noLegend: true, kind: 'dots', x: [L_PIPE], y: [EPS_LOW], size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [5, 120], yDomain: [0.2, 1], height: 275,
  vlines: [{ x: L_PIPE, text: `the paper's 19.8 m`, left: false }],
  hlines: [{ y: 0.9, text: 'ε = 0.90' }],
  desc: 'Effectiveness against the length of the buried run at 20 litres per second. The curve rises steeply to about 20 m and then flattens, so doubling the pipe buys far less than the first half did.',
});
const lenFor = (eps) => { const ntu = ntuFor('counter', eps, 0); return (ntu * cap(Q_LOW)) / (uModel(Q_LOW) * Math.PI * D); };

// A rating run exactly as the tool does it, with the soil given a huge capacity rate so that Cr is about zero.
const ratingRun = rate('counter', uModel(Q_LOW) * AREA, { Thi: 42.3, Tci: T_SOIL, Ch: cap(Q_LOW), Cc: 1e7 });

console.log(JSON.stringify({
  area: AREA, pr: PR, velDesign: vel(Q_DESIGN), velLow: vel(Q_LOW), reDesign: re(Q_DESIGN), reLow: re(Q_LOW),
  capDesign: cap(Q_DESIGN), capLow: cap(Q_LOW), step1, step2, step3,
  lenFor: { e80: lenFor(0.8), e90: lenFor(0.9) },
  rating: { NTU: ratingRun.NTU, eps: ratingRun.eps, Q: ratingRun.Q, Tho: ratingRun.Tho, drop: 42.3 - ratingRun.Tho },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'eps', figure(fig1, 'Figure 1. Effectiveness of the paper\'s buried pipe against airflow. The line is our series-resistance model: a Dittus-Boelter air film plus a fixed resistance for the clay wall and the soil, pinned to the paper\'s design point and then turned into effectiveness by the Heat exchanger sizing tool\'s maths. The two dots are the paper\'s own published values.'));
  md = inject(md, 'length', figure(fig2, 'Figure 2. The same model at 20 L/s, with the buried run stretched from 5 to 120 m. The dot is the paper\'s 19.8 m pipe.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
