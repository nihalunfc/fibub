// Figures for src/blog/discoveries/fick-principle-check-bariatric-surgery-cardiac-output.md, made with the maths of
// the Fick cardiac output calculator (src/lib/sci/fickco.ts: blood O2 content and the Fick principle).
// Run: node scripts/blog-figures/fick-principle-check-bariatric-surgery-cardiac-output.mjs
import fs from 'node:fs';
import { o2Content, fick, O2_SOL } from '../../src/lib/sci/fickco.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fick-principle-check-bariatric-surgery-cardiac-output.md', import.meta.url);

// Medians reported by the paper (Chwiedz et al. 2025, Appl. Sci. 15(21): 11502) at baseline, 3 months and 6 months
// after bariatric surgery. VO2 in L/min, cardiac output in L/min, a-v O2 difference in mL O2 per dL.
const V = [
  { t: 0, label: 'Before surgery', kg: 144.0, vo2Rest: 0.26, vo2Peak: 2.24, coRest: 7.2, coPeak: 18.2, avRest: 19.0, avPeak: 50.5, perKgPeak: 16.0 },
  { t: 3, label: '3 months', kg: 121.95, vo2Rest: 0.25, vo2Peak: 1.29, coRest: 6.3, coPeak: 15.5, avRest: 26.0, avPeak: 46.0, perKgPeak: 10.15 },
  { t: 6, label: '6 months', kg: 112.3, vo2Rest: 0.24, vo2Peak: 1.44, coRest: 6.0, coPeak: 14.1, avRest: 25.5, avPeak: 52.0, perKgPeak: 14.3 },
];
// OUR assumptions (the paper reports no blood values): haemoglobin 14 g/dL, arterial saturation 98 % at PO2 95 mmHg,
// mixed venous PO2 40 mmHg at rest and 20 mmHg at peak exercise, Hüfner factor 1.34.
const HB = 14, SAO2 = 0.98, PAO2 = 95, PVO2_REST = 40, PVO2_PEAK = 20;
const CaO2 = o2Content(HB, SAO2, PAO2).total;

/** The a-v O2 difference (mL/dL) that a V̇O2 (L/min) and a cardiac output (L/min) imply, straight from Fick. */
const avFrom = (vo2L, coL) => (vo2L * 1000) / (coL * 10);
/** The mixed venous saturation that would be needed, given that a-v difference. */
const svFrom = (av, pvO2) => (CaO2 - av - O2_SOL * pvO2) / (1.34 * HB);

const rows = V.map((v) => {
  const avRestCalc = avFrom(v.vo2Rest, v.coRest), avPeakCalc = avFrom(v.vo2Peak, v.coPeak);
  // The other way round: the cardiac output the tool gives for the reported V̇O2 with textbook blood values.
  const coRestTool = fick(v.vo2Rest * 1000, CaO2, o2Content(HB, 0.75, PVO2_REST).total).co;
  const coPeakTool = fick(v.vo2Peak * 1000, CaO2, o2Content(HB, 0.30, PVO2_PEAK).total).co;
  return {
    ...v, avRestCalc, avPeakCalc,
    svRest: svFrom(avRestCalc, PVO2_REST) * 100, svPeak: svFrom(avPeakCalc, PVO2_PEAK) * 100,
    extrRest: (avRestCalc / CaO2) * 100, extrPeak: (avPeakCalc / CaO2) * 100,
    ratioRest: v.avRest / avRestCalc, ratioPeak: v.avPeak / avPeakCalc,
    coRestTool, coPeakTool,
    perKgCalc: (v.vo2Peak * 1000) / v.kg,
  };
});

const x = rows.map((r) => r.t);
const fig1 = chart({
  title: 'Reported a–v O₂ difference against what Fick allows', xLabel: 'Months after surgery', yLabel: 'a–v O₂ difference (mL O₂/dL)',
  series: [
    { name: 'Reported, peak', kind: 'dots', x, y: rows.map((r) => r.avPeak), size: 5 },
    { name: 'Reported, rest', kind: 'dots', x, y: rows.map((r) => r.avRest), size: 5, colour: 'var(--c-tools)' },
    { name: 'V̇O₂ ÷ output, peak', kind: 'dots', x, y: rows.map((r) => +r.avPeakCalc.toFixed(2)), size: 5, colour: 'var(--ink)' },
    { name: 'V̇O₂ ÷ output, rest', kind: 'dots', x, y: rows.map((r) => +r.avRestCalc.toFixed(2)), size: 5, colour: 'var(--muted)' },
  ],
  xDomain: [-0.6, 6.6], yDomain: [0, 56], xTicks: [0, 3, 6],
  hlines: [{ y: +CaO2.toFixed(2), text: `arterial content ${CaO2.toFixed(1)} mL/dL (Hb 14)` }],
  desc: 'The arteriovenous oxygen differences the paper reports, against the values that follow from its own oxygen uptake and cardiac output. The reported peak values sit well above the total oxygen content of arterial blood.',
  height: 290,
});

const fig2 = chart({
  title: 'Mixed venous saturation the numbers imply', xLabel: 'Months after surgery', yLabel: 'Implied S̄vO₂ (%)',
  series: [
    { name: 'At rest', kind: 'dots', x, y: rows.map((r) => +r.svRest.toFixed(1)), size: 5 },
    { name: 'At peak exercise', kind: 'dots', x, y: rows.map((r) => +r.svPeak.toFixed(1)), size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [-0.6, 6.6], yDomain: [0, 100], xTicks: [0, 3, 6],
  hlines: [{ y: 75, text: 'usual resting value, 75 %' }, { y: 30, text: 'usual peak-exercise value, 30 %' }],
  desc: 'The mixed venous oxygen saturation implied by the reported oxygen uptake and cardiac output, at rest and at peak exercise, with haemoglobin assumed at 14 g per dL.',
  height: 290,
});

console.log('CaO2 (Hb 14, 98 %, 95 mmHg) =', CaO2.toFixed(4), 'mL/dL; at Hb 16 =', o2Content(16, 1, 100).total.toFixed(4));
console.log(JSON.stringify(rows.map((r) => ({
  label: r.label, avRest: r.avRest, avRestCalc: +r.avRestCalc.toFixed(2), ratioRest: +r.ratioRest.toFixed(2),
  avPeak: r.avPeak, avPeakCalc: +r.avPeakCalc.toFixed(2), ratioPeak: +r.ratioPeak.toFixed(2),
  svRest: +r.svRest.toFixed(1), svPeak: +r.svPeak.toFixed(1), extrRest: +r.extrRest.toFixed(1), extrPeak: +r.extrPeak.toFixed(1),
  coRestTool: +r.coRestTool.toFixed(2), coPeakTool: +r.coPeakTool.toFixed(2),
  perKgReported: r.perKgPeak, perKgCalc: +r.perKgCalc.toFixed(2),
})), null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'avdiff', figure(fig1, 'Figure 1. For each visit, the arteriovenous oxygen difference the paper reports (coloured) and the value that follows from dividing its own oxygen uptake by its own cardiac output (grey and black). The dashed line is the total oxygen carried by arterial blood at a haemoglobin of 14 g/dL, worked out by the Fick cardiac output calculator: no a-v difference can be larger.'));
  md = inject(md, 'svo2', figure(fig2, 'Figure 2. The mixed venous saturation that the reported oxygen uptake and cardiac output imply, with haemoglobin assumed at 14 g/dL. Both sit in a believable range, which is why the oxygen uptake and output columns look mutually consistent.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
