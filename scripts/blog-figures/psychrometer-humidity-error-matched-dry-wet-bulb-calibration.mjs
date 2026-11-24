// Figures for src/blog/discoveries/psychrometer-humidity-error-matched-dry-wet-bulb-calibration.md, made with the maths
// of Psychrometrics (src/lib/sci/psychro.ts: ASHRAE saturation pressure, thermodynamic wet bulb, moist air from t and tw).
// Run: node scripts/blog-figures/psychrometer-humidity-error-matched-dry-wet-bulb-calibration.mjs   (rewrites the charts)
import fs from 'node:fs';
import { air } from '../../src/lib/sci/psychro.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/psychrometer-humidity-error-matched-dry-wet-bulb-calibration.md', import.meta.url);

// Inputs from the paper (de Araújo et al. 2026, J 9: 7, doi:10.3390/j9010007, CC BY): the worked case 292.15 K (19 °C),
// 66.8 % RH, 101 325 Pa with ±1 K transducers; the experiment's pressure 98 000.88 Pa and range 288.65 to 292.15 K,
// about 62 to 82 % RH; the calibrated range 274.15 to 334.15 K, 10 to 90 % RH. Everything else is our choice.
const P = 101325;
/** Error in RH (percentage points) when the dry bulb reads dt too high and the wet bulb dw too high. */
const eRH = (t, rh, dt, dw, p = P) => { const tw = air(t, p, { rh }).tw; try { return (air(t + dt, p, { tw: tw + dw }).rh - rh) * 100; } catch { return NaN; } };
const r = (v, d = 2) => +v.toFixed(d);

// 1. The paper's worked case.
const base = air(19, P, { rh: 0.668 });
const cases = { tw: r(base.tw, 3), dryLowWetHigh: r(eRH(19, 0.668, -1, 1)), dryHighWetLow: r(eRH(19, 0.668, 1, -1)), bothHigh: r(eRH(19, 0.668, 1, 1), 3), bothLow: r(eRH(19, 0.668, -1, -1), 3), dryOnly: r(eRH(19, 0.668, 1, 0)), wetOnly: r(eRH(19, 0.668, 0, 1)), at98kPa: r(eRH(19, 0.668, -1, 1, 98000.88)) };
// 2. Where would a 30.5-point error at 70 % come from? Scan the temperature.
const scan70 = [3.5, 5, 10, 19, 25, 40, 60].map((t) => ({ t, opp: r(eRH(t, 0.7, -1, 1)), same: r(eRH(t, 0.7, 1, 1), 3) }));
// 3. The experiment: dry bulb S3d reads +0.24 K; what wet-bulb error gives the uncorrected −7.6 points at about 70 % RH, 19 °C, 98 kPa?
const pE = 98000.88; let lo = -2, hi = 0; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; eRH(19, 0.7, 0.24, m, pE) > -7.6 ? (hi = m) : (lo = m); }
const impliedWet = r((lo + hi) / 2, 2);
// 4. Matched pair: if both transducers share the same error e, how big is the RH error, and how much better than the worst case?
const ratioGrid = []; for (const t of [5, 19, 40, 60]) for (const rh of [0.1, 0.3, 0.5, 0.7, 0.9]) { const o = eRH(t, rh, -1, 1), s = Math.abs(eRH(t, rh, 1, 1)); ratioGrid.push({ t, rh, opp: r(o), same: r(s, 3), ratio: r(o / s, 1) }); }

// Figure 1: error in RH against RH at 19 °C for four sign combinations of ±1 K.
const RH = Array.from({ length: 36 }, (_, i) => 0.2 + i * 0.02);
const fig1 = chart({
  title: 'A ±1 K psychrometer at 19 °C: error in relative humidity', xLabel: 'True relative humidity (%)', yLabel: 'Error in RH (points)',
  series: [
    { name: 'Dry −1 K, wet +1 K', kind: 'line', x: RH.map((v) => r(v * 100, 1)), y: RH.map((v) => r(eRH(19, v, -1, 1))) },
    { name: 'Dry +1 K, wet −1 K', kind: 'line', x: RH.map((v) => r(v * 100, 1)), y: RH.map((v) => r(eRH(19, v, 1, -1))) },
    { name: 'Both +1 K (matched)', kind: 'line', x: RH.map((v) => r(v * 100, 1)), y: RH.map((v) => r(eRH(19, v, 1, 1), 3)), colour: 'var(--ink)' },
  ],
  xDomain: [20, 90], yDomain: [-30, 30], hlines: [{ y: 0, text: '' }], height: 280,
  desc: `Error in relative humidity from ±1 K transducer errors at 19 °C and sea-level pressure. Opposite errors give ${cases.dryLowWetHigh} and ${cases.dryHighWetLow} points at 66.8 % RH; matched errors (both +1 K) give only ${cases.bothHigh}.`,
});
// Figure 2: matched-pair improvement (worst case ÷ matched) against RH at three temperatures.
const RH2 = Array.from({ length: 33 }, (_, i) => 0.1 + i * 0.025);
const fig2 = chart({
  title: 'How much matching the two errors helps', xLabel: 'True relative humidity (%)', yLabel: 'Worst-case error ÷ matched error',
  series: [5, 19, 40].map((t) => ({ name: `${t} °C`, kind: 'line', x: RH2.map((v) => r(v * 100, 1)), y: RH2.map((v) => { const o = eRH(t, v, -1, 1), s = Math.abs(eRH(t, v, 1, 1)); return Number.isFinite(o) ? r(o / s, 2) : NaN; }) })),
  xDomain: [10, 90], height: 280,
  desc: 'Ratio of the RH error with opposite ±1 K errors to the error with the same +1 K error in both bulbs, at 5, 19 and 40 °C. The ratio is largest in humid, cool air.',
});

console.log(JSON.stringify({ cases, scan70, impliedWet, ratioGrid }, null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'error', figure(fig1, 'Figure 1. Error in relative humidity caused by ±1 K errors in the dry and wet bulbs of a psychrometer at 19 °C and 101.325 kPa, worked out with the Psychrometrics tool\'s ASHRAE maths. Opposite errors are the worst case; the same error in both bulbs nearly cancels.'));
  md = inject(md, 'ratio', figure(fig2, 'Figure 2. The worst-case error divided by the matched-pair error, for ±1 K transducers. Matching gains most in cool, humid air. Our calculation, not the paper\'s simulation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
