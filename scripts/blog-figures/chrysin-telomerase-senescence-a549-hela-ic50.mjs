// Figures for src/blog/discoveries/chrysin-telomerase-senescence-a549-hela-ic50.md, made with the maths of the
// Dose-response fitter (src/lib/sci/dose.ts) and the Drug-likeness checker (src/lib/sci/druglike.ts).
// Run: node scripts/blog-figures/chrysin-telomerase-senescence-a549-hela-ic50.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fitDose } from '../../src/lib/sci/dose.ts';
import { check } from '../../src/lib/sci/druglike.ts';
import { chart, figure, inject, COLOURS } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/chrysin-telomerase-senescence-a549-hela-ic50.md', import.meta.url);

// Inputs. "Paper": Porika et al. (2026), Int. J. Mol. Sci. 27, 10282 (CC BY 3.0), MTT viability as per cent of
// untreated control, quoted in the results text for 10, 30 and 60 µM. These are the means the text gives; the
// replicate wells are not in the text, so each fit uses one value per concentration.
const DOSES = [10, 30, 60]; // µM, paper
const VIAB = {               // % of control, paper (results text)
  A549: { 24: [80.61, 61.2, 45.82], 48: [67.55, 49.71, 37.3], 72: [53.24, 39.14, 26.38] },
  HeLa: { 24: [76.26, 57.96, 41.13], 48: [60.5, 45.23, 34.53], 72: [48.83, 40.3, 21.7] },
};
// Our assumptions: the untreated control is 100% (that is what "per cent of control" means), and the curve would
// fall to 0% at very high doses, so Top is fixed at 100 and Bottom at 0. Only IC50 and the Hill slope are fitted.
const FIX = { bottom: 0, top: 100 };
const HEMO = { 5: 0.6, 10: 1.3, 30: 2.2, 60: 4.0 };    // % haemolysis after 4 h, paper
const SMILES = 'O=C1C=C(c2ccccc2)Oc2cc(O)cc(O)c12';     // chrysin (5,7-dihydroxyflavone), written by us from its structure
const LOGP = 2.27, TPSA = 70.67;                        // consensus log P and polar surface area, paper (SwissADME values)

const fits = {};
for (const line of Object.keys(VIAB)) for (const h of [24, 48, 72]) {
  const f = fitDose([0, ...DOSES], [100, ...VIAB[line][h]], FIX);
  fits[`${line} ${h}`] = f;
}

// Figure 1: A549 curves at three times, on a log concentration axis (log10 values, labelled as µM).
const lx = Array.from({ length: 61 }, (_, i) => 0.5 + (1.6 * i) / 60); // log10(3 µM) to log10(126 µM)
const fmtLog = (v) => String(+(10 ** v).toPrecision(2));
const series1 = [];
[24, 48, 72].forEach((h, i) => {
  const f = fits[`A549 ${h}`];
  series1.push({ name: `${h} h (IC50 ${f.ec50.toFixed(0)} µM)`, kind: 'line', x: lx.map((v) => +v.toFixed(3)), y: lx.map((v) => +f.f(10 ** v).toFixed(2)), colour: COLOURS[i] });
  series1.push({ name: '', kind: 'dots', x: DOSES.map(Math.log10), y: VIAB.A549[h], colour: COLOURS[i], size: 4 });
});
const fig1 = chart({
  title: 'A549 lung cancer cells: viability falls with dose and time', xLabel: 'Chrysin (µM, log scale)', yLabel: 'Viable cells (% of control)',
  series: series1, yDomain: [0, 100], xDomain: [0.5, 2.1], xTicks: [Math.log10(3), Math.log10(10), Math.log10(30), Math.log10(100)], xFmt: fmtLog,
  hlines: [{ y: 50, text: '50%' }],
  desc: 'Fitted dose-response curves for A549 cells after 24, 48 and 72 hours of chrysin. The curve moves left with time: the half-way dose falls from about 50 to 29 to 13 micromolar.', height: 300,
});

// Figure 2: IC50 against exposure time for both cell lines, log axis.
const hrs = [24, 48, 72];
const fig2 = chart({
  title: 'The half-way dose (IC50) falls with longer exposure', xLabel: 'Exposure time (hours)', yLabel: 'IC50 (µM, log scale)',
  series: ['A549', 'HeLa'].flatMap((line, i) => [
    { name: line, kind: 'line', x: hrs, y: hrs.map((h) => +Math.log10(fits[`${line} ${h}`].ec50).toFixed(4)), colour: COLOURS[i] },
    { name: '', kind: 'dots', x: hrs, y: hrs.map((h) => +Math.log10(fits[`${line} ${h}`].ec50).toFixed(4)), colour: COLOURS[i], size: 4 },
  ]),
  xDomain: [20, 76], xTicks: hrs, yDomain: [0.9, 1.8], yTicks: [1, Math.log10(20), Math.log10(30), Math.log10(50)], yFmt: fmtLog,
  desc: 'IC50 fitted with the Dose-response fitter maths falls for both cell lines as exposure gets longer; HeLa sits a little below A549 at every time.', height: 260,
});

const r = check(SMILES, { logP: LOGP, tpsa: TPSA });
const facts = {
  fits: Object.fromEntries(Object.entries(fits).map(([k, f]) => [k, { ic50: +f.ec50.toFixed(2), ci: f.ci.ec50.map((v) => +v.toFixed(1)), hill: +f.hill.toFixed(2), r2: +f.r2.toFixed(4) }])),
  ratio72to24: { A549: +(fits['A549 24'].ec50 / fits['A549 72'].ec50).toFixed(2), HeLa: +(fits['HeLa 24'].ec50 / fits['HeLa 72'].ec50).toFixed(2) },
  ic80A549_48: +fits['A549 48'].inverse(80).toFixed(2),
  hemoMax: Math.max(...Object.values(HEMO)),
  chrysin: { formula: r.props.formulaText, mw: +r.props.mw.toFixed(2), mono: +r.props.mono.toFixed(4), hbd: r.props.hbd, hba: r.props.hba, rot: r.props.rotatable, rings: r.props.rings, lipinski: r.lip.pass, lipBroken: r.lip.broken, veber: r.veb.pass },
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'a549', figure(fig1, 'Figure 1. Dose-response curves fitted with the Dose-response fitter\'s maths to the A549 viability values given in the paper\'s text (dots). Top fixed at 100% and Bottom at 0% (our assumption); untreated controls not drawn on the log axis.'));
  md = inject(md, 'ic50', figure(fig2, 'Figure 2. IC50 from our fits for each cell line and exposure time. Our estimates from three mean values per curve, not the paper\'s own IC50 table.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
