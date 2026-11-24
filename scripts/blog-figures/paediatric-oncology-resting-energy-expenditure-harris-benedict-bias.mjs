// Figures for src/blog/discoveries/paediatric-oncology-resting-energy-expenditure-harris-benedict-bias.md, made with
// the maths of the Energy needs calculator (src/lib/sci/energy.ts: Mifflin-St Jeor, Harris-Benedict, Roza-Shizgal).
// Run: node scripts/blog-figures/paediatric-oncology-resting-energy-expenditure-harris-benedict-bias.mjs
import fs from 'node:fs';
import { mifflin, harrisBenedict, rozaShizgal } from '../../src/lib/sci/energy.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/paediatric-oncology-resting-energy-expenditure-harris-benedict-bias.md', import.meta.url);

// Cohort means from the paper: García-Guzmán et al. (2025), Front. Nutr. 12: 1656975 (CC BY 4.0).
const KG = 45.7, CM = 147.6, AGE = 12.2, BOYS = 0.576, GIRLS = 0.424, MEASURED = 1200;
const MIX = { solid: 0.685, leukaemia: 0.202, brain: 0.113 };
const OD = { solid: 195, leukaemia: 219, brain: 95 };               // INP-simple offsets, the paper's Table 3
const odMean = MIX.solid * OD.solid + MIX.leukaemia * OD.leukaemia + MIX.brain * OD.brain;
// The paper's own INP-simple equation, from its printed coefficients (not part of the tool).
const inpSimple = (sex, kg, cm, age, od) => 11 * kg + 22 * age - 3 * cm + od + (sex === 'male' ? 520 : 640);

const person = (sex, kg = KG) => ({ sex, kg, cm: CM, age: AGE });
const mixed = (f, kg = KG) => BOYS * f(person('male', kg)) + GIRLS * f(person('female', kg));
const EQ = [
  { name: 'Mifflin-St Jeor (1990)', short: 'Mifflin-St Jeor', f: mifflin },
  { name: 'Harris-Benedict (1919)', short: 'Harris-Benedict', f: harrisBenedict },
  { name: 'Roza-Shizgal (1984)', short: 'Roza-Shizgal', f: rozaShizgal },
];
const WW = Array.from({ length: 51 }, (_, i) => 25 + i);
const fig1 = chart({
  title: 'Three resting-energy equations at this cohort’s height and age',
  xLabel: 'Body weight (kg)', yLabel: 'Resting energy (kcal/day)',
  series: EQ.map((e) => ({ name: e.short, kind: 'line', x: WW, y: WW.map((kg) => +mixed(e.f, kg).toFixed(1)) })),
  xDomain: [25, 75], yDomain: [800, 1700],
  hlines: [{ y: MEASURED, text: `measured mean ${MEASURED} kcal/day` }],
  vlines: [{ x: KG, text: `mean weight ${KG} kg` }],
  desc: `At the cohort's mean height of ${CM} cm and age of ${AGE} years, Harris-Benedict gives ${mixed(harrisBenedict).toFixed(0)} kcal/day at the mean weight, Mifflin-St Jeor ${mixed(mifflin).toFixed(0)}, against a measured ${MEASURED}.`,
  height: 280,
});
const fig2 = chart({
  title: 'Boys against girls: the 1919 equation hardly separates them',
  xLabel: 'Body weight (kg)', yLabel: 'Resting energy (kcal/day)',
  series: [
    { name: 'HB 1919, boy', kind: 'line', x: WW, y: WW.map((kg) => +harrisBenedict(person('male', kg)).toFixed(1)), colour: 'var(--c-blog)' },
    { name: 'HB 1919, girl', kind: 'line', dash: '5 4', x: WW, y: WW.map((kg) => +harrisBenedict(person('female', kg)).toFixed(1)), colour: 'var(--c-blog)' },
    { name: 'Mifflin, boy', kind: 'line', x: WW, y: WW.map((kg) => +mifflin(person('male', kg)).toFixed(1)), colour: 'var(--c-tools)' },
    { name: 'Mifflin, girl', kind: 'line', dash: '5 4', x: WW, y: WW.map((kg) => +mifflin(person('female', kg)).toFixed(1)), colour: 'var(--c-tools)' },
  ],
  xDomain: [25, 75], yDomain: [800, 1700],
  vlines: [{ x: KG, text: `${KG} kg` }],
  desc: `At ${KG} kg the two Harris-Benedict curves are ${(harrisBenedict(person('male')) - harrisBenedict(person('female'))).toFixed(0)} kcal/day apart, while the two Mifflin-St Jeor curves are ${(mifflin(person('male')) - mifflin(person('female'))).toFixed(0)} apart.`,
  height: 280,
});

const inp = BOYS * inpSimple('male', KG, CM, AGE, odMean) + GIRLS * inpSimple('female', KG, CM, AGE, odMean);
const odZero = MIX.solid * OD.solid + MIX.brain * OD.brain;
console.log(JSON.stringify({
  perSex: EQ.map((e) => ({ name: e.name, boy: +e.f(person('male')).toFixed(4), girl: +e.f(person('female')).toFixed(4), mixed: +mixed(e.f).toFixed(2), bias: +(MEASURED - mixed(e.f)).toFixed(1) })),
  sexGap: { hb: +(harrisBenedict(person('male')) - harrisBenedict(person('female'))).toFixed(1), mifflin: +(mifflin(person('male')) - mifflin(person('female'))).toFixed(1) },
  inpSimple: { odMean: +odMean.toFixed(1), mixed: +inp.toFixed(1), bias: +(MEASURED - inp).toFixed(1), ifLeukaemiaZero: +(BOYS * inpSimple('male', KG, CM, AGE, odZero) + GIRLS * inpSimple('female', KG, CM, AGE, odZero)).toFixed(1) },
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. The three equations in the Energy needs calculator, each averaged over the cohort’s 57.6 % boys and 42.4 % girls, at its mean height and age. The dashed horizontal line is the measured mean; the vertical line is the mean weight.'));
  md = inject(md, 'sex', figure(fig2, 'Figure 2. The same two equations split by sex. The 1919 Harris-Benedict pair nearly touch at this body size, which is why it reads high for girls; Mifflin-St Jeor keeps them far apart.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
