// Figures for src/blog/discoveries/misting-fan-wbgt-allowance-ppe-outdoor-workers.md, made with the maths of the
// Heat stress tool (src/lib/sci/wbgt.ts: ISO 7243 WBGT weights, the Bureau of Meteorology estimate, Stull wet bulb,
// and the US Army heat flags).
// Run: node scripts/blog-figures/misting-fan-wbgt-allowance-ppe-outdoor-workers.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { wbgtOutdoor, wbgtIndoor, wbgtEstimate, vapourPressure, stullWetBulb, flagFor, FLAGS } from '../../src/lib/sci/wbgt.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/misting-fan-wbgt-allowance-ppe-outdoor-workers.md', import.meta.url);

// Inputs from the paper: Farnham, Yuan and Emura (2025), Clean Technologies 7(1): 9, doi:10.3390/cleantechnol7010009 (CC BY).
// Sample day (13 Sept 2022, 4 m from the fan): air 32.4 C, relative humidity 48 %, natural wet bulb 24.3 C.
// Across all trials the globe temperature averaged 0.3 C BELOW air temperature, so Tg = Ta - 0.3 here.
// Hypothetical Osaka summer day in the paper: air 35 C, humidity 45 %, natural wet bulb about 25 C.
// Extra cooling with the fan under PPE: 0.31 met = 18.3 W/m2 (wet work clothes), 0.35 met = 20.3 W/m2 (dry).
// The paper's rule of thumb: about 30 W/m2 of metabolic rate costs 1 C of acceptable WBGT (ISO 7243).
const DAY = { ta: 32.4, rh: 48, tnw: 24.3, dTg: -0.3 };
const OSAKA = { ta: 35, rh: 45, tnw: 25, dTg: -0.3 };
const MET = 58.15; // W/m2 per met (ISO 8996)
const COOL = [{ clothes: 'wet work clothes', met: 0.31, wm2: 18.3 }, { clothes: 'dry work clothes', met: 0.35, wm2: 20.3 }];
const PER_C = 30; // W/m2 per degree C of acceptable WBGT

const r = (v, n = 2) => +v.toFixed(n);
const caseOf = (c) => {
  const tg = c.ta + c.dTg;
  const sun = wbgtOutdoor(c.tnw, tg, c.ta), shade = wbgtIndoor(c.tnw, tg), est = wbgtEstimate(c.ta, c.rh);
  return { ...c, tg: r(tg, 1), e: r(vapourPressure(c.ta, c.rh)), sun: r(sun), sunFlag: flagFor(sun).name, shade: r(shade), shadeFlag: flagFor(shade).name, est: r(est), estFlag: flagFor(est).name, stull: r(stullWetBulb(c.ta, c.rh)), gap: r(est - sun) };
};
const day = caseOf(DAY), osaka = caseOf(OSAKA);
const allow = COOL.map((c) => ({ ...c, metWm2: r(c.met * MET, 1), degC: r(c.wm2 / PER_C) }));

// Chart 1: the Bureau of Meteorology estimate against air temperature at four humidities, with the flag bands.
const TA = Array.from({ length: 121 }, (_, i) => 20 + i * 0.25);
const RHS = [30, 48, 70, 90];
const fig1 = chart({
  title: 'Estimated WBGT against air temperature', xLabel: 'Air temperature (°C)', yLabel: 'Estimated WBGT (°C)',
  series: RHS.map((rh) => ({ name: `${rh} % humidity`, kind: 'line', x: TA, y: TA.map((t) => r(wbgtEstimate(t, rh), 2)) })),
  xDomain: [20, 44], yDomain: [20, 42],
  hlines: FLAGS.filter((f) => Number.isFinite(f.min)).map((f) => ({ y: f.min, text: `${f.name} flag` })),
  desc: `The Heat stress tool's estimate from air temperature and humidity, drawn at ${RHS.join(', ')} % relative humidity, with the US Army heat-flag thresholds. At 48 % humidity the red-flag line is crossed near 32 °C.`,
  height: 290,
});

// Chart 2: how much extra air temperature the fan's cooling buys, at each humidity.
// dWBGT/dTa at fixed humidity, from the tool's own estimate; the fan's allowance is 18.3/30 to 20.3/30 degC of WBGT.
const RH = Array.from({ length: 76 }, (_, i) => 20 + i);
const headroom = (rh, dW) => { let lo = 0, hi = 10; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; wbgtEstimate(DAY.ta + m, rh) - wbgtEstimate(DAY.ta, rh) < dW ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const fig2 = chart({
  title: 'Air-temperature headroom the fan buys', xLabel: 'Relative humidity (%)', yLabel: 'Extra air temperature (°C)',
  series: allow.map((a) => ({ name: `${a.wm2} W m⁻² (${a.clothes})`, kind: 'line', x: RH, y: RH.map((rh) => r(headroom(rh, a.degC), 3)) })),
  xDomain: [20, 95], yDomain: [0, 1.2],
  desc: `The extra air temperature that ${allow[0].degC} to ${allow[1].degC} °C of WBGT allowance is worth, against relative humidity, starting from ${DAY.ta} °C. The gain shrinks as the air gets more humid.`,
  height: 270,
});

const headAt48 = allow.map((a) => r(headroom(48, a.degC), 2));
const headAt85 = allow.map((a) => r(headroom(85, a.degC), 2));
console.log(JSON.stringify({ day, osaka, allow, headAt48, headAt85, metCheck: allow.map((a) => a.metWm2), flagAt: FLAGS.map((f) => [f.name, f.min]) }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'est', figure(fig1, `Figure 1. The Heat stress tool's estimate of WBGT from air temperature and humidity alone, with the US Army heat-flag lines. The paper's sample day sits at 32.4 °C and 48 % humidity, where the estimate reads ${day.est} °C, well above the ${day.sun} °C the paper's own three readings give.`));
  md = inject(md, 'headroom', figure(fig2, `Figure 2. How much hotter the air may be for the same WBGT once the misting fan has done its work, worked out from the tool's estimate. Humid air blunts the gain: at 48 % humidity the fan is worth about ${headAt48[0]} to ${headAt48[1]} °C of air temperature, at 85 % only about ${headAt85[0]} to ${headAt85[1]} °C.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
