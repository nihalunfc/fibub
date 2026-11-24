// Figures for src/blog/discoveries/vo2max-field-tests-university-students-leger-age-range.md, made with the maths of
// the VO2max estimator (src/lib/sci/vo2max.ts: the Léger shuttle-run and Rockport walk equations).
// Run: node scripts/blog-figures/vo2max-field-tests-university-students-leger-age-range.mjs
import fs from 'node:fs';
import { legerChild, legerAdult, shuttleSpeed, rockport, mets } from '../../src/lib/sci/vo2max.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/vo2max-field-tests-university-students-leger-age-range.md', import.meta.url);

// Inputs from the paper: Martín-Ruiz, J. (2026), Physiologia 6(2): 28, doi:10.3390/physiologia6020028 (CC BY).
const AGE_SH = 20.63, AGE_RK = 21.46;            // mean age of the shuttle-run and walk-test samples
const SH_MEAN = 39.80, SH_SD = 14.58;            // reported shuttle-run estimate, mL/kg/min
const RK_MEAN = 48.85, RK_SD = 5.34;             // reported Rockport walk estimate
const SD_AGE = 2.31;                             // age SD of the shuttle sample
const BMI = 21.80;                               // shuttle sample BMI; the paper gives no height or mass

// What shuttle speed does the paper's mean estimate imply, read through the children's equation at its mean age?
const speedFor = (target, age) => { let lo = 8.5, hi = 24; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; legerChild(m, age) < target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const SP = speedFor(SH_MEAN, AGE_SH);
const stageOf = (s) => (s - 8) / 0.5;

// The paper prints the children's equation with 0.1538 where Léger (1988) has 0.1536.
const legerTypo = (s, age) => 31.025 + 3.238 * s - 3.248 * age + 0.1538 * s * age;

const speeds = Array.from({ length: 81 }, (_, i) => 8.5 + i * 0.1);   // stages 1 to 17
const ages = Array.from({ length: 61 }, (_, i) => 6 + i * 0.5);        // 6 to 36 years

const fig1 = chart({
  title: 'Two Léger equations, same 20 m shuttle run', xLabel: 'Shuttle speed (km/h)', yLabel: 'VO2max (mL/kg/min)',
  series: [
    { name: 'Adults (18+)', kind: 'line', x: speeds, y: speeds.map((s) => +legerAdult(s).toFixed(3)) },
    { name: `Children's, age ${AGE_SH}`, kind: 'line', x: speeds, y: speeds.map((s) => +legerChild(s, AGE_SH).toFixed(3)) },
    { name: "Children's, age 14", kind: 'line', x: speeds, y: speeds.map((s) => +legerChild(s, 14).toFixed(3)), dash: '5 4' },
  ],
  xDomain: [8.5, 16.5], yDomain: [20, 80],
  hlines: [{ y: RK_MEAN, text: `walk test: ${RK_MEAN}` }, { y: SH_MEAN, text: `paper's shuttle mean: ${SH_MEAN}` }],
  vlines: [{ x: +SP.toFixed(2), text: `${SP.toFixed(1)} km/h` }],
  desc: `VO2max against 20 m shuttle run speed from Leger's adult equation and from his children's equation at ages ${AGE_SH} and 14. The adult equation sits about 7 mL/kg/min higher at the speed the paper's mean implies.`,
  height: 280,
});

const fig2 = chart({
  title: "Age in the children's equation, past where it was fitted", xLabel: 'Age (years)', yLabel: 'VO2max (mL/kg/min)',
  series: [
    { name: `Children's equation at ${SP.toFixed(1)} km/h`, kind: 'line', x: ages, y: ages.map((a) => +legerChild(SP, a).toFixed(3)) },
    { name: 'Adult equation (no age term)', kind: 'line', x: ages, y: ages.map(() => +legerAdult(SP).toFixed(3)), dash: '5 4' },
  ],
  xDomain: [6, 36], yDomain: [25, 65],
  bands: [{ x0: 6, x1: 18, text: 'fitted range' }],
  vlines: [{ x: AGE_SH, text: `sample mean ${AGE_SH}` }],
  desc: `VO2max from the children's Leger equation against age at a fixed shuttle speed, with the 6 to 18 year range it was fitted over shaded, and the flat adult equation for comparison.`,
  height: 270,
});

// A plausible walk test that reproduces the paper's Rockport mean (our assumption: 1.75 m tall man at BMI 21.8,
// finishing at 140 beats/min). We solve for the walk time.
const KG = +(BMI * 1.75 ** 2).toFixed(1), HR = 140;
const timeFor = (target) => { let lo = 5, hi = 30; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; rockport(KG, AGE_RK, true, m, HR) > target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const T = timeFor(RK_MEAN);

const out = {
  impliedSpeed: +SP.toFixed(3), impliedStage: +stageOf(SP).toFixed(2), stage8Speed: shuttleSpeed(8),
  atImplied: { child: +legerChild(SP, AGE_SH).toFixed(2), adult: +legerAdult(SP).toFixed(2), gap: +(legerAdult(SP) - legerChild(SP, AGE_SH)).toFixed(2), typo: +legerTypo(SP, AGE_SH).toFixed(3), typoGap: +(legerTypo(SP, AGE_SH) - legerChild(SP, AGE_SH)).toFixed(3) },
  boundary18: { child: +legerChild(SP, 18).toFixed(2), adult: +legerAdult(SP).toFixed(2), jump: +(legerAdult(SP) - legerChild(SP, 18)).toFixed(2) },
  ageSlope: { perYear: +(-3.248 + 0.1536 * SP).toFixed(3), fromAgeSd: +(Math.abs(-3.248 + 0.1536 * SP) * SD_AGE).toFixed(2), zeroAtSpeed: +(3.248 / 0.1536).toFixed(1) },
  speedSlope: { child: +(3.238 + 0.1536 * AGE_SH).toFixed(3), adult: 6 },
  sdImplied: { shuttleSpeedSd: +(SH_SD / (3.238 + 0.1536 * AGE_SH)).toFixed(2), stagesSd: +(SH_SD / (3.238 + 0.1536 * AGE_SH) / 0.5).toFixed(2) },
  walk: { kg: KG, hr: HR, minutes: +T.toFixed(2), vo2: +rockport(KG, AGE_RK, true, T, HR).toFixed(2), mets: +mets(rockport(KG, AGE_RK, true, T, HR)).toFixed(2) },
  adultFromSameRun: +legerAdult(SP).toFixed(2), reportedGap: +(RK_MEAN - SH_MEAN).toFixed(2), gapWithAdult: +(RK_MEAN - legerAdult(SP)).toFixed(2),
  stages: [6, 7, 8, 9, 10].map((st) => ({ stage: st, speed: shuttleSpeed(st), child: +legerChild(shuttleSpeed(st), AGE_SH).toFixed(1), adult: +legerAdult(shuttleSpeed(st)).toFixed(1) })),
  sd: { shuttle: SH_SD, rockport: RK_SD },
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'equations', figure(fig1, `Figure 1. The same 20 m shuttle run, read two ways. Léger's adult equation (solid) and his children's equation at the paper's mean age of ${AGE_SH} years (middle line) differ by about ${(legerAdult(SP) - legerChild(SP, AGE_SH)).toFixed(1)} mL/kg/min at the speed the paper's mean implies, which is most of the gap it reports between the shuttle run and the walk test.`));
  md = inject(md, 'age', figure(fig2, `Figure 2. The children's equation keeps subtracting for age well past the 6 to 18 year range it was fitted over (shaded). At ${SP.toFixed(1)} km/h it loses ${Math.abs(-3.248 + 0.1536 * SP).toFixed(2)} mL/kg/min for every extra year of age, while the adult equation has no age term at all.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
