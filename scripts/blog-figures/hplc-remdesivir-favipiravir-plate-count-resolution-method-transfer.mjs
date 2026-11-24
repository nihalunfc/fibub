// Figures for src/blog/discoveries/hplc-remdesivir-favipiravir-plate-count-resolution-method-transfer.md,
// made with the maths of the Chromatography calculator (src/lib/sci/chrom.ts).
// Run: node scripts/blog-figures/hplc-remdesivir-favipiravir-plate-count-resolution-method-transfer.mjs
import fs from 'node:fs';
import { retentionFactor, plates, resolution, purnell, platesFor, transfer } from '../../src/lib/sci/chrom.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hplc-remdesivir-favipiravir-plate-count-resolution-method-transfer.md', import.meta.url);

// From the paper: Khan et al. (2025), PLOS ONE 20(4): e0321474 (CC BY 4.0).
// Kromasil 100A C18, 250 x 4.6 mm, 5 um; 1.0 mL/min isocratic; tR 11.5 min (favipiravir) and 20.95 min (remdesivir);
// N > 4000 for both peaks; resolution > 2.0; tailing not more than 1.5; injection 10 uL.
const COL = { L: 250, d: 4.6, dp: 5 }, FLOW = 1.0, INJ = 10, N_MIN = 4000;
const tR = { fav: 11.5, rem: 20.95 };
const RUN = 25; // min; OUR assumption for the run length (the paper gives no run time, only tR 20.95)

// Dead time: an empty-column porosity of 0.68 (OUR assumption, the usual value for a packed C18 column).
const POROSITY = 0.68;
const V0 = POROSITY * Math.PI * (COL.d / 20) ** 2 * (COL.L / 10); // mL (d, L in mm -> cm)
const t0 = V0 / FLOW;

const k1 = retentionFactor(tR.fav, t0), k2 = retentionFactor(tR.rem, t0), alpha = k2 / k1;
// Widths implied by the stated minimum plate count: N = 5.545 (tR/W1/2)^2  ->  W1/2 = tR sqrt(5.545/N).
const w = (t) => t * Math.sqrt(5.545 / N_MIN);
const wFav = w(tR.fav), wRem = w(tR.rem);
const rsWidths = resolution(tR.fav, tR.rem, wFav, wRem, 'half');
const rsPurnell = purnell(N_MIN, alpha, k2);
const nFor2 = platesFor(2.0, alpha, k2);
const hetp = (COL.L * 1000) / N_MIN; // um per plate (L in mm x 1000 = um)
const tr = transfer(COL, { L: 100, d: 2.1, dp: 1.8 }, FLOW, INJ);

// Figure 1: resolution against plate number (Purnell) for this pair, and the same from the implied widths.
const Ns = Array.from({ length: 160 }, (_, i) => 20 * 1.045 ** i).filter((N) => N <= 30000);
const fig1 = chart({
  title: 'This peak pair: resolution against column efficiency', xLabel: 'Plate number N', yLabel: 'Resolution Rs',
  series: [
    { name: 'Purnell equation', kind: 'line', x: Ns.map((N) => Math.log10(N)), y: Ns.map((N) => purnell(N, alpha, k2)) },
    { name: 'From the implied peak widths', kind: 'line', dash: '5 4', x: Ns.map((N) => Math.log10(N)), y: Ns.map((N) => resolution(tR.fav, tR.rem, tR.fav * Math.sqrt(5.545 / N), tR.rem * Math.sqrt(5.545 / N), 'half')) },
  ],
  xDomain: [Math.log10(20), Math.log10(30000)], yDomain: [0, 12],
  xTicks: [1, 2, 3, 4].map((e) => e), xFmt: (t) => ['10', '100', '1e+3', '1e+4'][t - 1] ?? '',
  hlines: [{ y: 1.5, text: 'Rs 1.5: baseline' }, { y: 2, text: 'Rs 2: the method target' }],
  vlines: [{ x: Math.log10(nFor2), text: `${Math.round(nFor2)} plates`, dy: 28 }, { x: Math.log10(N_MIN), text: '4,000 plates', left: true, dy: 48 }],
  desc: 'Resolution of the favipiravir and remdesivir peaks against plate number. About 315 plates already give a resolution of 2, and the 4,000 plates the method requires give 7 to 9.',
  height: 290,
});

// Figure 2: plates needed for Rs = 2.0 as the selectivity falls towards 1, at this k2.
const alphas = Array.from({ length: 120 }, (_, i) => 1.02 + i * 0.01).filter((a) => a <= 2.2);
const fig2 = chart({
  title: 'Plates needed for Rs = 2.0, as selectivity falls', xLabel: 'Selectivity α = k₂/k₁', yLabel: 'Plates needed (log scale)',
  series: [{ name: '', noLegend: true, kind: 'line', x: alphas, y: alphas.map((a) => Math.log10(platesFor(2.0, a, k2))) }],
  xDomain: [1, 2.2], yDomain: [2, 6], yTicks: [2, 3, 4, 5, 6], yFmt: (t) => ['100', '1e+3', '1e+4', '1e+5', '1e+6'][t - 2] ?? '',
  vlines: [{ x: alpha, text: `α ${alpha.toFixed(2)} here: ${Math.round(nFor2)} plates`, left: true }],
  desc: 'Plates needed for a resolution of 2 against selectivity. At the selectivity of this pair only about 315 plates are needed; at a selectivity of 1.05 it takes more than 100,000.',
  height: 280,
});

const out = {
  V0: +V0.toFixed(3), t0: +t0.toFixed(3), k1: +k1.toFixed(3), k2: +k2.toFixed(3), alpha: +alpha.toFixed(3),
  wFav: +wFav.toFixed(4), wRem: +wRem.toFixed(4), rsWidths: +rsWidths.toFixed(2), rsPurnell: +rsPurnell.toFixed(2),
  nFor2: +nFor2.toFixed(1), hetp: +hetp.toFixed(1), hReduced: +(hetp / COL.dp).toFixed(1), nFav: +plates(tR.fav, wFav, 'half').toFixed(0),
  transfer: { flow: +tr.flow.toFixed(3), injection: +tr.injection.toFixed(2), timeScale: +tr.timeScale.toFixed(4), run: +(RUN * tr.timeScale).toFixed(2), solventRatio: +tr.solventRatio.toFixed(4), solventOld: +(RUN * FLOW).toFixed(1), solventNew: +(RUN * tr.timeScale * tr.flow).toFixed(2), lOverDp1: tr.lOverDp1, lOverDp2: Math.round(tr.lOverDp2), lOverDpChange: +tr.lOverDpChange.toFixed(1), uspOk: tr.uspOk },
  rsAfterTransfer: +purnell(N_MIN, alpha, k2).toFixed(2),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rs', figure(fig1, `Figure 1. How well the two peaks separate as the column gets better, worked out with the Chromatography calculator's maths for this pair (selectivity ${alpha.toFixed(2)}, k₂ ${k2.toFixed(2)}). The solid line is the Purnell equation; the dashed line uses the widths that the method's own minimum of 4,000 plates implies. Both pass a resolution of 2 before 400 plates.`));
  md = inject(md, 'alpha', figure(fig2, 'Figure 2. The same target resolution of 2.0, but for pairs that are harder to tell apart. Efficiency is a weak lever: the plates needed grow without limit as the selectivity approaches 1, which is why this pair needs so few.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
