// Figures for src/blog/discoveries/steel-stud-wall-thermal-break-clips-u-value-layers.md, made with the maths of
// the Heat conduction solver (src/lib/sci/phconduct.ts: the layered wall in its Wall mode).
// Run: node scripts/blog-figures/steel-stud-wall-thermal-break-clips-u-value-layers.mjs
import fs from 'node:fs';
import { wall } from '../../src/lib/sci/phconduct.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/steel-stud-wall-thermal-break-clips-u-value-layers.md', import.meta.url);

// From the paper: Song and Kim (2024), Buildings 14(9): 3032, doi:10.3390/buildings14093032 (CC BY).
// Glass wool 150 mm at k = 0.034 W/mK, gypsum board k = 0.18 W/mK, studs at 450 mm centres, design U 0.207 W/m2K,
// measured U 0.520 (conventional C-stud) and 0.370 W/m2K (two small studs with separating clips),
// linear thermal transmittance psi 0.117 and 0.061 W/mK, THERM boundaries 25 and -15 C.
const K_WOOL = 0.034, K_GYP = 0.18, WOOL = 150, SPACING = 0.45;
const U_DESIGN = 0.207, U_CONV = 0.520, U_PROP = 0.370, PSI_CONV = 0.117, PSI_PROP = 0.061;
const TI = 25, TO = -15;
// OUR ASSUMPTION: two 12.5 mm gypsum boards on each face, and the ISO 6946 surface resistances for a vertical
// wall (Rsi 0.11, Rse 0.04 m2K/W), given as film coefficients. The paper does not state the board thickness.
const GYP = 25, HI = 1 / 0.11, HO = 1 / 0.04;
const layers = (wool) => [
  { name: 'Gypsum board (inside)', L: GYP / 1000, k: K_GYP },
  { name: 'Glass wool', L: wool / 1000, k: K_WOOL },
  { name: 'Gypsum board (outside)', L: GYP / 1000, k: K_GYP },
];
const oneD = (wool) => wall(layers(wool), TI, TO, HI, HO);

const base = oneD(WOOL);
// The thermal bridge, added the way EN ISO 14683 does: U = U_1D + sum(psi x length / area). One stud per 450 mm of
// wall gives 1/0.45 = 2.2222 m of stud per m2. This sum is OUR arithmetic, not the tool.
const perM2 = 1 / SPACING;
const bridged = (u1d, psi) => u1d + psi * perM2;
const rows = [
  { id: 'conv', name: 'Conventional C-stud', psi: PSI_CONV, measured: U_CONV },
  { id: 'prop', name: 'Two small studs + clips', psi: PSI_PROP, measured: U_PROP },
].map((r) => {
  const pred = bridged(base.U, r.psi);
  return { ...r, pred, diffPct: (pred / r.measured - 1) * 100, share: (r.psi * perM2) / pred };
});

// Figure 1: U against insulation thickness, with and without the bridge.
const WS = Array.from({ length: 51 }, (_, i) => 50 + i * 5);
const u1d = WS.map((w) => oneD(w).U);
const fig1 = chart({
  title: 'U-value against insulation thickness', xLabel: 'Glass wool thickness (mm)', yLabel: 'U-value (W/m²K)',
  series: [
    { name: 'Conventional stud', kind: 'line', x: WS, y: u1d.map((u) => +bridged(u, PSI_CONV).toFixed(4)) },
    { name: 'Small studs + clips', kind: 'line', x: WS, y: u1d.map((u) => +bridged(u, PSI_PROP).toFixed(4)) },
    { name: 'No studs (one-dimensional)', kind: 'line', x: WS, y: u1d.map((u) => +u.toFixed(4)) },
  ],
  xDomain: [50, 300], yDomain: [0, 0.95], height: 290,
  hlines: [{ y: U_CONV, text: `measured 0.520` }, { y: U_PROP, text: `measured 0.370` }],
  vlines: [{ x: 150, text: '150 mm', left: true }],
  desc: 'U-value against glass wool thickness for the plain layered wall and for the same wall with a conventional steel stud or the small studs and clips at 450 mm centres. Both bridged lines flatten out well above the plain one.',
});

// Figure 2: how much of the heat flow the stud line carries, against stud spacing.
const SPACINGS = Array.from({ length: 61 }, (_, i) => 0.3 + i * 0.01);
const shareFor = (psi) => SPACINGS.map((s) => +((psi / s) / (base.U + psi / s) * 100).toFixed(2));
const fig2 = chart({
  title: 'Share of the heat flow that goes through the studs', xLabel: 'Stud spacing (mm)', yLabel: 'Share of total heat flow (%)',
  series: [
    { name: 'Conventional stud', kind: 'line', x: SPACINGS.map((s) => s * 1000), y: shareFor(PSI_CONV) },
    { name: 'Small studs + clips', kind: 'line', x: SPACINGS.map((s) => s * 1000), y: shareFor(PSI_PROP) },
  ],
  xDomain: [300, 900], yDomain: [20, 75], height: 280,
  vlines: [{ x: 450, text: '450 mm centres' }],
  desc: 'The share of the wall total heat flow carried by the stud line, against stud spacing from 300 to 900 mm. At 450 mm the conventional stud carries about 56 per cent and the clipped pair about 40 per cent.',
});

// What insulation thickness would bring the bridged wall back to a wanted U?
const thicknessFor = (psi, target) => {
  let lo = 20, hi = 2000;
  if (bridged(oneD(hi).U, psi) > target) return null;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; bridged(oneD(m).U, psi) > target ? (lo = m) : (hi = m); }
  return (lo + hi) / 2;
};

console.log(JSON.stringify({
  U1D: base.U, R1D: base.Rtot, Rs: base.Rs, q1D: base.q, insideSurface: base.temps[1], outsideSurface: base.temps[base.temps.length - 2],
  perM2, rows: rows.map((r) => ({ ...r, pred: +r.pred.toFixed(4), diffPct: +r.diffPct.toFixed(1), share: +(r.share * 100).toFixed(1) })),
  predictedDrop: +((1 - rows[1].pred / rows[0].pred) * 100).toFixed(1), measuredDrop: +((1 - U_PROP / U_CONV) * 100).toFixed(1),
  psiDrop: +((1 - PSI_PROP / PSI_CONV) * 100).toFixed(1),
  surfaceAtMeasured: [U_CONV, U_PROP, U_DESIGN].map((u) => +(TI - (u * (TI - TO)) / HI).toFixed(2)),
  needFor: { conv: thicknessFor(PSI_CONV, 0.37), prop250: +bridged(oneD(250).U, PSI_PROP).toFixed(4), convInf: +bridged(0, PSI_CONV).toFixed(4), propInf: +bridged(0, PSI_PROP).toFixed(4) },
  heatPerM2: [U_DESIGN, U_CONV, U_PROP].map((u) => +(u * (TI - TO)).toFixed(2)),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'uvalue', figure(fig1, 'Figure 1. The U-value of the paper\'s wall against insulation thickness. The lowest line is the layered wall worked out by the Heat conduction solver\'s maths; the two above it add the paper\'s measured linear thermal transmittance for one stud line per 450 mm. Dashed lines are the paper\'s two measured U-values. The 25 mm of gypsum board each side and the surface resistances are our assumptions.'));
  md = inject(md, 'share', figure(fig2, 'Figure 2. How much of the wall\'s heat flow the stud line carries, against stud spacing, using the paper\'s measured linear thermal transmittances and the one-dimensional U-value from the tool.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
