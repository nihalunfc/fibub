// Figures for src/blog/discoveries/baltic-reservoir-hypoxia-oxygen-saturation-same-threshold-different-meaning.md,
// made with the maths of the Dissolved oxygen tool (src/lib/sci/oxygen.ts: Garcia and Gordon solubility, the
// density chain between units, percent saturation and AOU).
// Run: node scripts/blog-figures/baltic-reservoir-hypoxia-oxygen-saturation-same-threshold-different-meaning.mjs
import fs from 'node:fs';
import { saturation, satState, convert, density } from '../../src/lib/sci/oxygen.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/baltic-reservoir-hypoxia-oxygen-saturation-same-threshold-different-meaning.md', import.meta.url);

// --- Values from the paper's running text (Wei et al. 2025, Oceans 6(3): 54, CC BY) -------------------------
const P = {
  baltic: { tMin: 3.04, tMax: 21.26, sMin: 6.98, sMax: 23.18, doMin: 0, doMax: 9.9, hypT: [5.37, 10.14], hypDepth: 63, deepDO: [0.0076, 0.2503] },
  reservoir: { tMin: 14.52, tMax: 32.58, s: 0.03, doMin: 0.3, doMax: 8.7, hypT: [25.52, 31.80], hypDepth: 11.5, lowSep: 0.23, nov: 2.33 },
  hypoxia: 2.0, severe: 0.5, lethal: 2.09, surfaceResp: 1.7,
};
// Salinity we use for the Baltic hypoxic layer: the paper gives only the whole-transect range, so we bracket the
// threshold with its two ends. OUR ASSUMPTION: 12 for the single-number examples (below the permanent halocline).
const S_DEEP = 12, S_RES = P.reservoir.s;

const pct = (mgL, t, S) => satState(mgL, 'mgL', t, S).pct;
// Temperature at which a given mg/L is exactly saturation (bisection on the Garcia and Gordon curve).
const tempAtSat = (mgL, S) => { let lo = -1.9, hi = 39.9; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; saturation(m, S).mgL > mgL ? (lo = m) : (hi = m); } return (lo + hi) / 2; };

const r3 = (v) => +v.toFixed(3);
const out = {
  // What 2 mg/L and 0.5 mg/L mean as percent saturation in each site's hypoxic window.
  threshold: {
    balticLowT: { t: P.baltic.hypT[0], s: S_DEEP, sat: r3(saturation(P.baltic.hypT[0], S_DEEP).mgL), pct2: r3(pct(2, P.baltic.hypT[0], S_DEEP)), pct05: r3(pct(0.5, P.baltic.hypT[0], S_DEEP)) },
    balticHighT: { t: P.baltic.hypT[1], s: S_DEEP, sat: r3(saturation(P.baltic.hypT[1], S_DEEP).mgL), pct2: r3(pct(2, P.baltic.hypT[1], S_DEEP)), pct05: r3(pct(0.5, P.baltic.hypT[1], S_DEEP)) },
    balticSaltBracket: [P.baltic.sMin, P.baltic.sMax].map((S) => ({ s: S, pct2: r3(pct(2, 7.75, S)) })),
    resLowT: { t: P.reservoir.hypT[0], s: S_RES, sat: r3(saturation(P.reservoir.hypT[0], S_RES).mgL), pct2: r3(pct(2, P.reservoir.hypT[0], S_RES)), pct05: r3(pct(0.5, P.reservoir.hypT[0], S_RES)) },
    resHighT: { t: P.reservoir.hypT[1], s: S_RES, sat: r3(saturation(P.reservoir.hypT[1], S_RES).mgL), pct2: r3(pct(2, P.reservoir.hypT[1], S_RES)), pct05: r3(pct(0.5, P.reservoir.hypT[1], S_RES)) },
  },
  // The thresholds in oceanographic units.
  units: {
    baltic2: { umolkg: r3(convert(2, 'mgL', 'umolkg', 7.75, S_DEEP)), umolL: r3(convert(2, 'mgL', 'umolL', 7.75, S_DEEP)), mLL: r3(convert(2, 'mgL', 'mLL', 7.75, S_DEEP)), rho: r3(density(7.75, S_DEEP)) },
    res2: { umolkg: r3(convert(2, 'mgL', 'umolkg', 28.66, S_RES)), umolL: r3(convert(2, 'mgL', 'umolL', 28.66, S_RES)), mLL: r3(convert(2, 'mgL', 'mLL', 28.66, S_RES)), rho: r3(density(28.66, S_RES)) },
  },
  // AOU of the lowest measured oxygen at each site.
  aou: {
    balticDeep: [P.baltic.deepDO[0], P.baltic.deepDO[1]].map((d) => ({ mgL: d, ...(({ pct: p, aou }) => ({ pct: r3(p), aouUmolKg: r3(aou) }))(satState(d, 'mgL', 7.75, S_DEEP)) })),
    resSep: { mgL: P.reservoir.lowSep, pct: r3(satState(P.reservoir.lowSep, 'mgL', P.reservoir.hypT[1], S_RES).pct), aouUmolKg: r3(satState(P.reservoir.lowSep, 'mgL', P.reservoir.hypT[1], S_RES).aou) },
    resNov: { mgL: P.reservoir.nov, pct: r3(satState(P.reservoir.nov, 'mgL', 20, S_RES).pct) },
  },
  // How warm can water be and still hold the highest oxygen the paper reports?
  maxima: {
    baltic: { mgL: P.baltic.doMax, tAtSat: r3(tempAtSat(P.baltic.doMax, S_DEEP)), tAtSatFresh: r3(tempAtSat(P.baltic.doMax, P.baltic.sMin)) },
    reservoir: { mgL: P.reservoir.doMax, tAtSat: r3(tempAtSat(P.reservoir.doMax, S_RES)) },
    balticColdest: r3(saturation(P.baltic.tMin, P.baltic.sMin).mgL),
    resColdest: r3(saturation(P.reservoir.tMin, S_RES).mgL),
    balticMaxAtColdest: r3(satState(P.baltic.doMax, 'mgL', P.baltic.tMin, P.baltic.sMin).pct),
    resMaxAtColdest: r3(satState(P.reservoir.doMax, 'mgL', P.reservoir.tMin, S_RES).pct),
  },
  // How much oxygen one degree of warming expels, at each site's own temperature.
  slope: {
    baltic: r3((saturation(8.25, S_DEEP).mgL - saturation(7.25, S_DEEP).mgL)),
    reservoir: r3((saturation(29.16, S_RES).mgL - saturation(28.16, S_RES).mgL)),
    balticSurface: r3((saturation(21.76, S_DEEP).mgL - saturation(20.76, S_DEEP).mgL)),
  },
  // The paper's fastest oxygen change rates as a share of saturation per day.
  rates: {
    baltic: r3((0.005 / saturation(7.75, S_DEEP).mgL) * 100),
    reservoir: r3((0.048 / saturation(P.reservoir.hypT[1], S_RES).mgL) * 100),
  },
};
console.log(JSON.stringify(out, null, 1));

// --- Figure 1: solubility against temperature, with the two sites' hypoxic windows -------------------------
const ts = Array.from({ length: 81 }, (_, i) => i * 0.5);
const fig1 = chart({
  title: 'How much oxygen the water can hold', xLabel: 'Temperature (°C)', yLabel: 'Oxygen at saturation (mg/L)',
  series: [
    { name: 'Fresh water (S 0.03)', kind: 'line', x: ts, y: ts.map((t) => +saturation(t, S_RES).mgL.toFixed(3)) },
    { name: 'Baltic deep (S 12)', kind: 'line', x: ts, y: ts.map((t) => +saturation(t, S_DEEP).mgL.toFixed(3)) },
    { name: 'Sea water (S 35)', kind: 'line', x: ts, y: ts.map((t) => +saturation(t, 35).mgL.toFixed(3)), dash: '4 4' },
  ],
  bands: [{ x0: P.baltic.hypT[0], x1: P.baltic.hypT[1], text: 'Baltic' }, { x0: P.reservoir.hypT[0], x1: P.reservoir.hypT[1], text: 'reservoir' }],
  hlines: [{ y: 2, text: 'hypoxia, 2 mg/L' }],
  xDomain: [0, 40], yDomain: [0, 15],
  desc: 'Oxygen solubility in mg per litre against temperature for fresh water, Baltic deep water and sea water, with the 2 mg per litre hypoxia line and the temperature windows of the two hypoxic layers.',
  height: 290,
});

// --- Figure 2: the same thresholds as percent saturation ---------------------------------------------------
const fig2 = chart({
  title: 'The same 2 mg/L is a different shortfall', xLabel: 'Temperature (°C)', yLabel: 'Threshold as % of saturation',
  series: [
    { name: '2 mg/L, fresh', kind: 'line', x: ts, y: ts.map((t) => +pct(2, t, S_RES).toFixed(2)) },
    { name: '2 mg/L, S 12', kind: 'line', x: ts, y: ts.map((t) => +pct(2, t, S_DEEP).toFixed(2)) },
    { name: '0.5 mg/L, S 12', kind: 'line', x: ts, y: ts.map((t) => +pct(0.5, t, S_DEEP).toFixed(2)), dash: '4 4' },
  ],
  bands: [{ x0: P.baltic.hypT[0], x1: P.baltic.hypT[1], text: 'Baltic' }, { x0: P.reservoir.hypT[0], x1: P.reservoir.hypT[1], text: 'reservoir' }],
  xDomain: [0, 40], yDomain: [0, 32],
  desc: 'The 2 and 0.5 mg per litre thresholds expressed as a percentage of saturation, against temperature. The same concentration is a larger share of saturation in warm fresh water.',
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'solub', figure(fig1, 'Figure 1. Oxygen solubility against temperature from the Garcia and Gordon equation the tool uses, for the reservoir\'s fresh water, Baltic deep water at salinity 12 (our assumption) and open sea water. Shaded: the temperature windows of the two hypoxic layers as the paper reports them.'));
  md = inject(md, 'pct', figure(fig2, 'Figure 2. The paper\'s two oxygen thresholds as a percentage of saturation. A fixed concentration means a milder shortfall in cold, salty water and a deeper one in warm fresh water.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
