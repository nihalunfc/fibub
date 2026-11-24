// Figures for src/blog/discoveries/recorded-height-sex-predicted-body-weight-tidal-volume.md, made with the maths
// of the BMI calculator (src/lib/sci/body.ts: the Devine, Robinson and Miller ideal/predicted body weights).
// Run: node scripts/blog-figures/recorded-height-sex-predicted-body-weight-tidal-volume.mjs
import fs from 'node:fs';
import { ibw, bodyMeasures } from '../../src/lib/sci/body.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/recorded-height-sex-predicted-body-weight-tidal-volume.md', import.meta.url);

// Inputs from the paper: Huehn et al. (2026), J. Intensive Care, doi:10.1186/s40560-026-00936-w (CC BY 4.0).
// 798 adults with ARDS, 263 women (33.0 %). Median tidal volume 7.6 mL/kg PBW in women and 6.8 in men.
// Adjusted models: +3.98 mL of tidal volume per cm of recorded height, -30.1 mL for female sex, and
// -0.0342 mL/kg PBW per cm of height. Heights were centred on 174.1 cm. PBW is the Devine formula.
const H0 = 174.1, SLOPE_ML = 3.98, SEX_ML = -30.1, SLOPE_MLKG = -0.0342, FEMALE = 263 / 798;
const VKG = { male: 6.8, female: 7.6 };

// The Devine formula through the tool's own function, and its slope per cm (2.3 kg per inch).
const perCm = ibw(175, 'male') - ibw(174, 'male');
const gap = ibw(H0, 'male') - ibw(H0, 'female');
const pbw0 = (1 - FEMALE) * ibw(H0, 'male') + FEMALE * ibw(H0, 'female');
const vkg0 = (1 - FEMALE) * VKG.male + FEMALE * VKG.female;
const vt0 = vkg0 * pbw0;
// What the paper's two absolute-volume coefficients predict for the mL/kg slope:
// d(VT/PBW)/dh = (dVT/dh)/PBW - VT x (dPBW/dh) / PBW^2.
const predSlope = SLOPE_ML / pbw0 - (vt0 * perCm) / pbw0 ** 2;
const neutralSlope = vkg0 * perCm; // mL per cm that would keep mL/kg constant
const predSexMl = -gap * vkg0; // mL difference a perfectly scaled protocol would give a woman

const hs = Array.from({ length: 61 }, (_, i) => 145 + i);
const fig1 = chart({
  title: 'Predicted body weight against recorded height',
  xLabel: 'Recorded height (cm)', yLabel: 'Predicted body weight (kg)',
  series: [
    { name: 'Men (Devine)', kind: 'line', x: hs, y: hs.map((h) => +ibw(h, 'male').toFixed(2)) },
    { name: 'Women (Devine)', kind: 'line', x: hs, y: hs.map((h) => +ibw(h, 'female').toFixed(2)) },
    { name: 'Men (Robinson)', kind: 'line', dash: '4 3', x: hs, y: hs.map((h) => +ibw(h, 'male', 'robinson').toFixed(2)) },
    { name: 'Women (Robinson)', kind: 'line', dash: '4 3', x: hs, y: hs.map((h) => +ibw(h, 'female', 'robinson').toFixed(2)) },
  ],
  xDomain: [145, 205], yDomain: [35, 100],
  vlines: [{ x: 165, text: '165' }, { x: 175, text: '175' }],
  desc: 'Predicted body weight from the Devine and Robinson formulas against recorded height, for men and women. The two sexes run parallel, 4.5 kg apart on the Devine formula, and each gains 0.906 kg per cm of height.',
  height: 265,
});

// Figure 2: the mL/kg a protocol delivers if absolute volume follows the paper's fitted rule.
const vtOf = (h, sex) => vt0 + SLOPE_ML * (h - H0) + (sex === 'female' ? SEX_ML / 2 : -SEX_ML / 2);
const fig2 = chart({
  title: 'Why shorter patients end up above 8 mL/kg',
  xLabel: 'Recorded height (cm)', yLabel: 'Tidal volume (mL per kg PBW)',
  series: [
    { name: 'Men', kind: 'line', x: hs, y: hs.map((h) => +(vtOf(h, 'male') / ibw(h, 'male')).toFixed(3)) },
    { name: 'Women', kind: 'line', x: hs, y: hs.map((h) => +(vtOf(h, 'female') / ibw(h, 'female')).toFixed(3)) },
  ],
  xDomain: [150, 200], yDomain: [5, 11],
  hlines: [{ y: 8, text: '8 mL/kg: the usual upper limit' }, { y: 6, text: '6 mL/kg: the target' }],
  desc: 'Tidal volume per kilogram of predicted body weight against height, when the absolute volume follows the paper\'s fitted rule of 3.98 mL per cm. Because predicted body weight rises faster than that, the mL/kg figure falls with height and short patients sit above 8 mL/kg.',
  height: 265,
});

const B = bodyMeasures(70, H0, 'female');
console.log(JSON.stringify({
  devinePerCm: +perCm.toFixed(5), sexGapKg: +gap.toFixed(2), heightWorth45kg: +(gap / perCm).toFixed(2),
  pbwAt: [160, 165, 174.1, 175, 185].map((h) => ({ h, male: +ibw(h, 'male').toFixed(2), female: +ibw(h, 'female').toFixed(2) })),
  cohortPbw: +pbw0.toFixed(2), cohortMlKg: +vkg0.toFixed(3), cohortVt: +vt0.toFixed(1),
  paperMlKgSlope: SLOPE_MLKG, predictedMlKgSlope: +predSlope.toFixed(4),
  neutralMlPerCm: +neutralSlope.toFixed(2), paperMlPerCm: SLOPE_ML,
  paperSexMl: SEX_ML, predictedSexMl: +predSexMl.toFixed(1),
  fiveCmError: { kg: +(5 * perCm).toFixed(2), pct: +((5 * perCm) / pbw0 * 100).toFixed(1), mlAt7: +(5 * perCm * vkg0).toFixed(0) },
  mlkgAt: [155, 160, 165, 174.1, 185].map((h) => ({ h, male: +(vtOf(h, 'male') / ibw(h, 'male')).toFixed(2), female: +(vtOf(h, 'female') / ibw(h, 'female')).toFixed(2) })),
  formulasAt174female: { devine: +ibw(H0, 'female').toFixed(2), robinson: +ibw(H0, 'female', 'robinson').toFixed(2), miller: +ibw(H0, 'female', 'miller').toFixed(2) },
  formulasAt174male: { devine: +ibw(H0, 'male').toFixed(2), robinson: +ibw(H0, 'male', 'robinson').toFixed(2), miller: +ibw(H0, 'male', 'miller').toFixed(2) },
  exampleRow: { bmi: +B.bmi.toFixed(2), ibw: +B.ibw.devine.toFixed(2), lean: +B.lbw.toFixed(2), pctIbw: +B.pctIbw.toFixed(1), bsaMosteller: +B.bsa.mosteller.toFixed(3) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pbw', figure(fig1, 'Figure 1. Predicted body weight against recorded height, from the BMI calculator\'s own ideal-weight functions. The Devine lines are the ones ventilator protocols use; Robinson is shown for comparison. The dashed vertical lines are the paper\'s height strata at 165 and 175 cm.'));
  md = inject(md, 'mlkg', figure(fig2, 'Figure 2. Tidal volume per kilogram of predicted body weight against height, if the absolute volume follows the paper\'s fitted rule (3.98 mL per cm, 30.1 mL less for women). Our reconstruction of the cohort\'s average volume anchors the curves.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
