// Figures for src/blog/discoveries/sadia-watershed-land-use-peak-discharge-lag-unit-hydrograph.md, made with the
// maths of the Unit hydrograph builder (src/lib/sci/uh.ts: the gamma/SCS unit hydrograph and convolution).
// Run: node scripts/blog-figures/sadia-watershed-land-use-peak-discharge-lag-unit-hydrograph.mjs
import fs from 'node:fs';
import { gammaUH, gammaShapeArea, shapeFor, convolve, impliedArea } from '../../src/lib/sci/uh.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sadia-watershed-land-use-peak-discharge-lag-unit-hydrograph.md', import.meta.url);

// Inputs from the paper: Hartawan et al. (2025), TEKNIK 46(3), doi:10.14710/teknik.v46i3.75074 (CC BY-SA 4.0).
// Downstream Sadia watershed, Bima City, Indonesia; HEC-HMS with SCS curve number and an SCS synthetic unit
// hydrograph; 25-year return period; land cover of 2015, 2019 and 2022.
const YEARS = [2015, 2019, 2022];
const QP = [156.20, 164.80, 167.00];      // modelled peak discharge, m3/s
const LAG_MIN = [445.15, 431.84, 429.88]; // modelled time lag, minutes
// OUR assumptions: a 1-hour rain step D, the standard peak rate factor 484, and a catchment area of 120 km2 used
// only to turn the fixed product (area x runoff depth) into a drawable unit hydrograph. The paper gives neither.
const D = 1, PRF = 484, AREA = 120;

const m = shapeFor(PRF), GA = gammaShapeArea(m);
const r = (v, n = 2) => +v.toFixed(n);
const lagH = LAG_MIN.map((v) => v / 60);
const TP = lagH.map((L) => D / 2 + L);          // SCS: Tp = D/2 + lag, and lag = 0.6 tc
const TC = lagH.map((L) => L / 0.6);            // the tool asks for tc
// A gamma unit hydrograph's peak is qp = 1000 A / (3600 Tp Garea), so the paper's peak fixes the product
// area x runoff depth: AQ (km2 mm) = Qp x 3600 x Tp x Garea / 1000.
const AQ = QP.map((q, i) => (q * 3600 * TP[i] * GA) / 1000);
const EXCESS = AQ.map((v) => v / AREA);          // mm of excess rain, given OUR assumed area
const UH = TP.map((tp) => gammaUH(AREA, tp, m, 0.25));
const STORM = UH.map((u, i) => convolve([r(EXCESS[i], 2)], u.q));

// What the lag change alone would have done, with the 2015 runoff volume held fixed.
const lagOnly = [1, 2].map((i) => ({ year: YEARS[i], peak: r((QP[0] * TP[0]) / TP[i]), share: Math.round((100 * ((QP[0] * TP[0]) / TP[i] - QP[0])) / (QP[i] - QP[0])), volRatio: r((QP[i] / QP[0]) * (TP[i] / TP[0]), 4) }));
// Is the volume rise robust to the rain step we assumed?
const dScan = [0.25, 0.5, 1, 2].map((d) => {
  const v = lagH.map((L, i) => (QP[i] * 3600 * (d / 2 + L) * GA) / 1000);
  return { D: d, r19: r(v[1] / v[0], 4), r22: r(v[2] / v[0], 4) };
});

// Chart 1: the three unit hydrographs.
const fig1 = chart({
  title: 'Sadia unit hydrographs, 2015 to 2022 land cover', xLabel: 'Hours since the rain began', yLabel: 'Flow per mm of runoff (m³/s)',
  series: UH.map((u, i) => ({ name: `${YEARS[i]} (lag ${LAG_MIN[i]} min)`, kind: 'line', x: u.q.map((_, j) => j * 0.25), y: u.q.map((v) => r(v, 4)) })),
  xDomain: [0, 30], yDomain: [0, 3.6],
  desc: `Gamma (SCS-type) unit hydrographs for the paper's three modelled time lags, drawn for a 120 km2 catchment. The peak rises from ${r(UH[0].peak, 3)} to ${r(UH[2].peak, 3)} m3/s per mm as the lag shortens.`,
  height: 280,
});

// Chart 2: peak against lag at a fixed runoff volume, with the paper's three points.
const LG = Array.from({ length: 121 }, (_, i) => 400 + i); // minutes
const curve = LG.map((L) => (1000 * AQ[0]) / (3600 * (D / 2 + L / 60) * GA));
const fig2 = chart({
  title: 'Peak discharge against time lag', xLabel: 'Time lag (minutes)', yLabel: 'Peak discharge (m³/s)',
  series: [
    { name: 'Same runoff volume as 2015', kind: 'line', x: LG, y: curve.map((v) => r(v, 2)) },
    { name: "The paper's three model runs", kind: 'dots', x: LAG_MIN, y: QP, size: 4 },
  ],
  xDomain: [420, 460], yDomain: [150, 175],
  desc: `Peak discharge falls as the lag lengthens, as 1/(D/2 + lag), if the runoff volume stays the same. The paper's 2015 run sits on that curve by construction; its 2019 and 2022 runs sit above it, and the gap is extra runoff volume rather than a faster catchment.`,
  height: 280,
});

console.log(JSON.stringify({
  m: r(m, 4), gammaArea: r(GA, 6), lagH: lagH.map((v) => r(v, 4)), TP: TP.map((v) => r(v, 4)), TC: TC.map((v) => r(v, 2)),
  AQ: AQ.map((v) => r(v, 1)), volumeMm3: AQ.map((v) => r(v / 1000, 3)), excessMm: EXCESS.map((v) => r(v, 2)),
  uhPeak: UH.map((u) => r(u.peak, 4)), uhTpeak: UH.map((u) => u.tPeak), impliedArea: UH.map((u) => r(impliedArea(u.q, 0.25), 2)),
  stormPeak: STORM.map((s) => r(Math.max(...s), 2)), lagOnly, dScan,
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'uh', figure(fig1, `Figure 1. The gamma (SCS-type) unit hydrograph the tool builds for each of the paper's three modelled time lags, with a peak rate factor of 484 and a one-hour rain step. The area of 120 km² is our assumption and only sets the vertical scale; the shape change is the paper's. Each curve holds exactly one millimetre of runoff.`));
  md = inject(md, 'peaklag', figure(fig2, `Figure 2. If nothing but the lag changed, the peak would follow the curve, as 1/(D/2 + lag). The paper's 2019 and 2022 runs sit above it, so about half of their higher peaks comes from extra runoff volume, not from a quicker catchment.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
