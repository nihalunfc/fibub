// Figures for src/blog/discoveries/ethylene-glycol-osmolar-gap-high-anion-gap-acidosis-check.md, made with the
// maths of the Blood gas interpreter (src/lib/sci/acidbase.ts: interpretAbg, Henderson-Hasselbalch, Winter's
// formula, anion gap, delta ratio and osmolar gap).
// Run: node scripts/blog-figures/ethylene-glycol-osmolar-gap-high-anion-gap-acidosis-check.mjs
import fs from 'node:fs';
import { interpretAbg, NORMALS } from '../../src/lib/sci/acidbase.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ethylene-glycol-osmolar-gap-high-anion-gap-acidosis-check.md', import.meta.url);

// From the paper's abstract: Mavromatidis and Kalogiannidou (2025), Ukr. J. Nephrol. Dial. 3(87): 2025.02,
// doi:10.31450/ukrjnd.3(87).2025.02 (CC BY-SA 4.0). Reported: pH 7.09, HCO3 3.2 mEq/L, anion gap 22.5 mEq/L,
// osmotic gap 83 mOsm/L. Everything else below is OUR reconstruction, labelled in the article:
//  - pCO2 from Henderson-Hasselbalch with the paper's pH and HCO3 (the same equation the tool checks with);
//  - sodium 140 and albumin 4.0 g/dL as plain normal values, with chloride set so the anion gap is the paper's 22.5;
//  - glucose 10 and urea 7 mmol/L (the paper says hyperglycaemia and acute kidney injury but gives no numbers),
//    and the measured osmolality set so that the osmolar gap is the paper's 83.
const PH = 7.09, HCO3 = 3.2, AG = 22.5, OSMGAP = 83;
const pco2From = (ph, hco3) => hco3 / (0.03 * 10 ** (ph - 6.1));
const PCO2 = pco2From(PH, HCO3);
const NA = 140, ALB = 4.0, GLU = 10, UREA = 7;
const CL = NA - HCO3 - AG;
const OSMCALC = 2 * NA + GLU + UREA;
const CASE = { ph: PH, pco2: +PCO2.toFixed(1), hco3: HCO3, na: NA, cl: +CL.toFixed(1), alb: ALB, glucose: GLU, urea: UREA, osm: OSMCALC + OSMGAP };
const R = interpretAbg(CASE);

// Figure 1: the acid-base map. Curves of constant pH come from the tool's own Henderson-Hasselbalch relation
// (pH = 6.1 + log10(HCO3 / (0.03 x pCO2))), rearranged for HCO3. Winter's line is HCO3 = (pCO2 - 8) / 1.5.
const pcs = Array.from({ length: 121 }, (_, i) => 2 + i * 0.5);
const isoPh = [6.9, 7.09, 7.4, 7.6].map((ph) => ({
  name: `pH ${ph.toFixed(2)}`, kind: 'line', x: pcs, y: pcs.map((p) => +(0.03 * p * 10 ** (ph - 6.1)).toFixed(3)),
  dash: ph === PH ? undefined : '4 3',
}));
const fig1 = chart({
  title: 'Where this blood gas sits on the acid-base map',
  xLabel: 'pCO₂ (mmHg)', yLabel: 'HCO₃ (mmol/L)',
  series: [
    ...isoPh,
    { name: "Winter's compensation", kind: 'line', x: pcs, y: pcs.map((p) => +((p - 8) / 1.5).toFixed(3)), colour: 'var(--muted)' },
    { name: '', noLegend: true, kind: 'dots', x: [CASE.pco2], y: [HCO3], size: 5, colour: 'var(--ink)', label: { text: 'the patient', dx: 8, dy: -6 } },
  ],
  xDomain: [0, 62], yDomain: [0, 40],
  desc: `Lines of constant pH from the Henderson-Hasselbalch relation the blood gas interpreter uses, with Winter's expected compensation line. The patient sits at pCO2 ${CASE.pco2} mmHg and HCO3 ${HCO3} mmol/L, on the pH 7.09 line and on Winter's line.`,
  height: 275,
});

// Figure 2: how the delta ratio verdict depends on the reported anion gap, at the paper's HCO3.
const gaps = Array.from({ length: 61 }, (_, i) => 10 + i * 0.5);
const dr = gaps.map((g) => {
  const r = interpretAbg({ ...CASE, cl: +(NA - HCO3 - g).toFixed(2) });
  return r.deltaRatio === null ? null : +r.deltaRatio.toFixed(3);
});
const fig2 = chart({
  title: 'Delta ratio against the anion gap (HCO₃ fixed at 3.2)',
  xLabel: 'Anion gap (mmol/L)', yLabel: 'Delta ratio',
  series: [{ name: '', noLegend: true, kind: 'line', x: gaps, y: dr }],
  xDomain: [10, 40], yDomain: [0, 1.4],
  hlines: [{ y: 0.4, text: '0.4: mostly normal-gap acidosis below' }, { y: 0.8, text: '0.8: pure high-gap acidosis above' }],
  vlines: [{ x: AG, text: `AG ${AG}` }],
  desc: `The blood gas interpreter's delta ratio against the anion gap at HCO3 3.2 mmol/L. At the paper's gap of 22.5 the ratio is ${R.deltaRatio.toFixed(2)}, in the band that means a normal-gap acidosis is present as well as the high-gap one; the gap would have to reach 28.6 for a pure high-gap picture.`,
  height: 275,
});

const brk = (() => { let g = 10; for (; g <= 60; g += 0.01) { const r = interpretAbg({ ...CASE, cl: +(NA - HCO3 - g).toFixed(4) }); if (r.deltaRatio !== null && r.deltaRatio >= 0.8) break; } return +g.toFixed(2); })();
console.log(JSON.stringify({
  input: CASE, normals: NORMALS,
  pco2Derived: +PCO2.toFixed(2), phRecomputed: +R.phCalc.toFixed(3),
  status: R.status, primary: R.primary, disorders: R.disorders, comp: R.comp,
  expected: R.expected && { what: R.expected.what, lo: +R.expected.lo.toFixed(1), hi: +R.expected.hi.toFixed(1), mid: +R.expected.mid.toFixed(1) },
  ag: +R.ag.toFixed(1), agCorr: +R.agCorr.toFixed(1), deltaRatio: +R.deltaRatio.toFixed(3),
  osmCalc: R.osmCalc, osmGap: +R.osmGap.toFixed(1),
  deltaRatioReaches08At: brk,
  // If the patient had breathed less hard, what pH would the paper's bicarbonate give?
  phIfPco2: [15, 20, 25, 40].map((p) => ({ pco2: p, ph: +interpretAbg({ ...CASE, pco2: p }).phCalc.toFixed(2) })),
  pco2IfHco3: [2.7, 3.2, 3.7].map((b) => ({ hco3: b, pco2: +pco2From(PH, b).toFixed(1) })),
  egEstimateMgDl: +(OSMGAP * 62.07 / 10).toFixed(0),
  steps: R.steps.map((s) => `${s.title}: ${s.text}`),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'map', figure(fig1, 'Figure 1. The acid-base map the tool draws, rebuilt here: each dashed curve is one pH, from the Henderson-Hasselbalch relation, and the grey line is the pCO₂ a pure metabolic acidosis should produce (Winter\'s formula). The patient\'s point lies on both, so the breathing response is as big as it should be.'));
  md = inject(md, 'delta', figure(fig2, 'Figure 2. The delta ratio the interpreter reports, as the anion gap is varied with bicarbonate held at the paper\'s 3.2 mmol/L. The paper\'s gap of 22.5 falls in the mixed band, not the pure high-gap band.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
