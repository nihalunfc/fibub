// Figures for src/blog/discoveries/aflatoxin-singapore-total-diet-margin-of-exposure.md, made with the maths of the
// Margin of exposure tool (src/lib/sci/moe.ts: exposure = concentration × intake ÷ body weight, MOE = POD ÷ exposure,
// and the concentration that would just meet a target MOE).
// Run: node scripts/blog-figures/aflatoxin-singapore-total-diet-margin-of-exposure.mjs
import fs from 'node:fs';
import { marginOfExposure } from '../../src/lib/sci/moe.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/aflatoxin-singapore-total-diet-margin-of-exposure.md', import.meta.url);

// Inputs from the paper: Lew et al. (2025), Toxins 17(7): 324, doi:10.3390/toxins17070324 (CC BY).
// BMDL10 0.17 µg/kg bw/day (the paper's point of departure, from JECFA 2018 / EFSA 2007); satay sauce total
// aflatoxins 0.83 µg/kg; consumption of 3.894 g/day for 95th-percentile eaters-only consumers; LOQ 0.05 µg/kg.
const POD = 0.17, CONC = 0.83, INTAKE = 3.894, LOQ = 0.05, LOD = 0.025, TARGET = 10000, BW = 60; // BW: our assumption
const U = { conc: 'µg/kg', intake: 'g/day', dose: 'µg/kg bw/day' };
const run = (conc, intake, bw, target = TARGET) =>
  marginOfExposure(POD, [{ name: 'x', conc, intake, bw }], target, U).rows[0];

// The paper's own numbers, read two ways: intake already per kg of body weight (bw = 1 kg in the tool), or
// intake per person per day for a 60 kg adult.
const perKg = run(CONC, INTAKE, 1), perPerson = run(CONC, INTAKE, BW);

// Figure 1: MOE against concentration, for three consumption rates (per kg bw per day).
const RATES = [
  { name: '3.894 g/kg bw/day (paper)', v: INTAKE },
  { name: '1 g/kg bw/day', v: 1 },
  { name: '0.1 g/kg bw/day', v: 0.1 },
];
const cs = Array.from({ length: 121 }, (_, i) => 10 ** (-3 + (i * 3) / 120)); // 0.001 to 1 µg/kg
const lg = (v) => Math.log10(v);
const p10 = (t) => { const v = 10 ** t; return v >= 1 ? String(Math.round(v)) : String(+v.toPrecision(2)); };
const fig1 = chart({
  title: 'Aflatoxin: margin of exposure against concentration', xLabel: 'Total aflatoxins in the food (µg/kg)', yLabel: 'Margin of exposure',
  series: [
    ...RATES.map((r) => ({ name: r.name, kind: 'line', x: cs.map(lg), y: cs.map((c) => lg(run(c, r.v, 1).moe)) })),
    { name: '', noLegend: true, kind: 'dots', x: [lg(CONC)], y: [lg(perKg.moe)], size: 4, colour: 'var(--c-blog)' },
  ],
  xDomain: [-3, 0], yDomain: [0, 6], xFmt: p10, yFmt: p10,
  hlines: [{ y: 4, text: 'MOE 10 000' }, { y: lg(100), text: 'MOE 100' }],
  vlines: [{ x: lg(CONC), text: '0.83 µg/kg', left: true }, { x: lg(LOQ), text: 'LOQ 0.05' }],
  desc: `Margin of exposure falls as the aflatoxin concentration rises. At the paper's satay sauce value of 0.83 micrograms per kilogram and 3.894 grams per kilogram of body weight per day the MOE is ${perKg.moe.toFixed(0)}.`,
  height: 300,
});

// Figure 2: the concentration that just meets MOE 10 000, against the consumption rate.
const rates = Array.from({ length: 121 }, (_, i) => 10 ** (-2 + (i * 3) / 120)); // 0.01 to 10 g/kg bw/day
const fig2 = chart({
  title: 'What concentration would reach a margin of 10 000?', xLabel: 'Consumption (g per kg of body weight per day)', yLabel: 'Concentration allowed (µg/kg)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: rates.map(lg), y: rates.map((v) => lg(run(CONC, v, 1).maxConc)) },
    { name: '', noLegend: true, kind: 'dots', x: [lg(INTAKE)], y: [lg(perKg.maxConc)], size: 4, colour: 'var(--c-blog)' },
  ],
  xDomain: [-2, 1], yDomain: [-3, 1], xFmt: p10, yFmt: p10,
  hlines: [{ y: lg(LOQ), text: 'LOQ 0.05 µg/kg' }, { y: lg(LOD), text: 'LOD 0.025' }],
  vlines: [{ x: lg(INTAKE), text: 'satay sauce', left: true }],
  desc: `The aflatoxin concentration that would just reach a margin of exposure of 10 000 falls as consumption rises. At 3.894 grams per kilogram of body weight per day it is ${perKg.maxConc.toFixed(4)} micrograms per kilogram, well below the study's limit of quantification of 0.05.`,
  height: 300,
});

// Intake (g/kg bw/day) at 0.83 µg/kg that would just reach the target, and the same for the LOQ.
const intakeFor = (conc, target) => (POD / target / conc) * 1000; // g per kg bw per day
const out = {
  perKg: { exposure: perKg.exposure, moe: perKg.moe, maxConc: perKg.maxConc },
  perPerson: { exposure: perPerson.exposure, moe: perPerson.moe, maxConc: perPerson.maxConc },
  intakeAt083For10k: intakeFor(CONC, TARGET), intakeAtLoqFor10k: intakeFor(LOQ, TARGET),
  moeAtLoq: run(LOQ, INTAKE, 1).moe, moe100: run(CONC, INTAKE, 1, 100).meets,
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'moe', figure(fig1, 'Figure 1. Margin of exposure against the aflatoxin concentration in a food, for three consumption rates, worked out with the Margin of exposure tool’s maths from the paper’s BMDL10 of 0.17 µg/kg bw/day. The dot is the paper’s satay sauce: 0.83 µg/kg eaten at 3.894 g per kg of body weight per day.'));
  md = inject(md, 'frontier', figure(fig2, 'Figure 2. The highest concentration that would still reach a margin of exposure of 10 000, against how much of the food is eaten. Below about 0.34 g per kg of body weight per day the limit sits above the study’s limit of quantification; above it, a result of “not detected” can no longer prove a margin of 10 000.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
