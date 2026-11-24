// Figures for src/blog/discoveries/fucoxanthin-derivative-lipinski-veber-violations.md, made with the maths of the
// Drug-likeness tool (src/lib/sci/druglike.ts: properties, Lipinski and Veber) and src/lib/sci/chem.ts for formulas.
// Run: node scripts/blog-figures/fucoxanthin-derivative-lipinski-veber-violations.mjs
import fs from 'node:fs';
import { check as drugCheck } from '../../src/lib/sci/druglike.ts';
import { parseFormula, molarMass, monoMass } from '../../src/lib/sci/chem.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fucoxanthin-derivative-lipinski-veber-violations.md', import.meta.url);

// Fucoxanthin, written here from its published structure (3'-acetoxy-5,6-epoxy-3,5'-dihydroxy-6',7'-didehydro-
// 5,6,7,8,5',6'-tetrahydro-beta,beta-caroten-8-one) and confirmed by the molecular formula and mass the tool returns.
const MOLS = [
  { name: 'Fucoxanthin', smiles: 'CC(=O)OC1CC(C)(C)C(=C=CC(C)=CC=CC(C)=CC=CC=C(C)C=CC=C(C)C(=O)CC23OC2(C)CC(O)CC3(C)C)C(C)(O)C1' },
  { name: 'Lycopene', smiles: 'CC(C)=CCCC(C)=CC=CC(C)=CC=CC(C)=CC=CC=C(C)C=CC=C(C)C=CC=C(C)CCC=C(C)C' },
  { name: 'Retinol', smiles: 'CC1=C(C=CC(C)=CC=CC(C)=CCO)C(C)(C)CCC1' },
  { name: 'Orlistat', smiles: 'CCCCCCCCCCCC(CC1OC(=O)C1CCCCCC)OC(=O)C(CC(C)C)NC=O' },
  { name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
  { name: 'Metformin', smiles: 'CN(C)C(=N)N=C(N)N' },
];
const rows = MOLS.map((m) => { const r = drugCheck(m.smiles, { name: m.name }); if (r.error) throw new Error(`${m.name}: ${r.error}`); return { name: m.name, f: r.props.formulaText, mw: +r.props.mw.toFixed(2), mono: +r.props.mono.toFixed(4), hbd: r.props.hbd, hba: r.props.hba, rot: r.props.rotatable, rings: r.props.rings, lip: r.lip.broken, veb: r.veb.broken }; });

// The derivative itself: the paper gives only the molecular formula C42H58O7, so we take its mass from the formula.
const DERIV = parseFormula('C42H58O7');
const derivMw = +molarMass(DERIV).toFixed(2), derivMono = +monoMass(DERIV).toFixed(4);

// Polar surface area by Ertl's fragment contributions (Ertl, Rohde and Selzer 2000, J. Med. Chem. 43: 3714-3717):
// aliphatic hydroxyl 20.23, ether oxygen 9.23, carbonyl oxygen 17.07, ether oxygen inside a ring 12.53 Å².
const TPSA = { oh: 20.23, etherO: 9.23, carbonylO: 17.07, ringEtherO: 12.53 };
const tpsaFuco = 2 * TPSA.oh + TPSA.etherO + TPSA.carbonylO + TPSA.carbonylO + TPSA.ringEtherO;  // 2 OH, ester, ketone, epoxide
const tpsaDeriv = tpsaFuco + TPSA.carbonylO;    // the extra oxygen read as one more ketone
const extraOh = Array.from({ length: 7 }, (_, i) => i);

const fig1 = chart({
  title: 'Molecular weight against rotatable bonds', xLabel: 'Molecular weight (g/mol)', yLabel: 'Rotatable bonds',
  series: [
    { name: '', noLegend: true, kind: 'dots', x: rows.map((r) => r.mw), y: rows.map((r) => r.rot), size: 4 },
    ...rows.map((r) => ({ name: '', noLegend: true, kind: 'dots', x: [r.mw], y: [r.rot], size: 0.1, label: { text: r.name, dx: r.name === 'Orlistat' || r.name === 'Lycopene' ? -8 : 8, dy: 4, anchor: r.name === 'Orlistat' || r.name === 'Lycopene' ? 'end' : 'start' } })),
  ],
  xDomain: [0, 760], yDomain: [0, 26],
  hlines: [{ y: 10, text: "Veber's limit: 10 rotatable bonds" }],
  vlines: [{ x: 500, text: "Lipinski 500" }, { x: derivMw, text: `derivative ${derivMw}`, dy: 16 }],
  desc: 'Molecular weight against rotatable bonds for fucoxanthin, three other terpenoids and three oral drugs, with the Lipinski weight limit of 500 and the Veber limit of 10 rotatable bonds marked.',
  height: 290,
});

const fig2 = chart({
  title: 'How far is the polar surface area from 140 Å²?', xLabel: 'Extra hydroxyl groups added', yLabel: 'Polar surface area (Å²)',
  series: [
    { name: 'Fucoxanthin', kind: 'line', x: extraOh, y: extraOh.map((k) => +(tpsaFuco + k * TPSA.oh).toFixed(2)) },
    { name: 'The derivative (one more C=O)', kind: 'line', x: extraOh, y: extraOh.map((k) => +(tpsaDeriv + k * TPSA.oh).toFixed(2)), dash: '5 4' },
  ],
  xDomain: [0, 6], yDomain: [80, 240],
  hlines: [{ y: 140, text: "Veber's limit: 140 Å²" }],
  desc: 'Polar surface area by Ertl fragment contributions for fucoxanthin and for the derivative, and how it would rise if more hydroxyl groups were added. Both start well below the 140 square angstrom Veber limit.',
  height: 270,
});

const out = {
  rows, derivative: { formula: 'C42H58O7', mw: derivMw, mono: derivMono, extraOverFucoxanthin: +(derivMw - rows[0].mw).toFixed(2) },
  tpsa: { fucoxanthin: +tpsaFuco.toFixed(2), derivative: +tpsaDeriv.toFixed(2), extraOhToReach140: extraOh.find((k) => tpsaDeriv + k * TPSA.oh > 140) },
  verdicts: rows.map((r) => `${r.name}: ${r.lip} Lipinski, ${r.veb} Veber`),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'space', figure(fig1, `Figure 1. Where fucoxanthin sits among other molecules, with everything computed by the Drug-likeness tool from a SMILES string. Both limits that matter here are drawn: Lipinski's 500 g/mol and Veber's 10 rotatable bonds. Orlistat, an approved oral drug, is further past the rotatable-bond limit than any carotenoid on the chart.`));
  md = inject(md, 'tpsa', figure(fig2, `Figure 2. Polar surface area by Ertl's fragment contributions (our arithmetic, not the tool's: the tool takes a polar surface area as input). Fucoxanthin comes to ${tpsaFuco.toFixed(1)} Å² and the derivative to ${tpsaDeriv.toFixed(1)} Å², so two more hydroxyl groups would be needed before Veber's 140 Å² limit is broken.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
