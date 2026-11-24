// Figures for src/blog/discoveries/tuna-immunomodulatory-peptide-mass-and-charge.md, made with the maths of the
// Protein parameter calculator (src/lib/sci/protparam.ts: formula, masses, pI, charge against pH, extinction).
// Run: node scripts/blog-figures/tuna-immunomodulatory-peptide-mass-and-charge.mjs
import fs from 'node:fs';
import * as P from '../../src/lib/sci/protparam.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/tuna-immunomodulatory-peptide-mass-and-charge.md', import.meta.url);

// The five peptide sequences named in the text of Shen et al. (2025), Foods 14(6): 1068 (CC BY).
const SEQS = ['HDCDLLR', 'YGSVELDELGK', 'YGPNDNFFEGK', 'FPPDYLDDALR', 'QYGDLSTPEALK'];
const PH = 7.4;        // phosphate-buffered saline, the paper's solvent
const DOSE_MG_ML = 0.2; // the paper's 200 µg/mL test concentration
const CAM = 57.02146;   // carbamidomethyl, the fixed modification in the paper's search

const rows = SEQS.map((seq) => {
  const a = P.analyse(seq, { pH: PH });
  return { seq, ...a, uM: P.uMFromMgMl(DOSE_MG_ML, a.avg) };
});
for (const r of rows) console.log(r.seq.padEnd(13), 'avg', r.avg.toFixed(3), 'mono', r.mono.toFixed(4), 'pI', r.pI.toFixed(2), 'charge at pH 7.4', r.chargeAt.toFixed(2), 'eps280', r.epsUsed, 'A280 of 1 mg/mL', r.abs01.toFixed(3), 'µM at 200 µg/mL', r.uM.toFixed(1), 'formula', r.formula);

const byMass = [...rows].sort((x, y) => x.mono - y.mono);
for (let i = 1; i < byMass.length; i++) {
  const gap = byMass[i].mono - byMass[i - 1].mono;
  console.log('gap', byMass[i - 1].seq, '->', byMass[i].seq, gap.toFixed(4), 'Da =', ((gap / byMass[i - 1].mono) * 1e6).toFixed(2), 'ppm');
}
console.log('HDCDLLR with a carbamidomethyl Cys:', (rows[0].mono + CAM).toFixed(4), 'Da; free Cys:', rows[0].mono.toFixed(4));
console.log('molar dose ratio HDCDLLR / YGSVELDELGK at the same mass:', (rows[0].uM / rows[1].uM).toFixed(3));

// Figure 1: net charge against pH for three of the peptides.
const PICK = ['HDCDLLR', 'YGSVELDELGK', 'FPPDYLDDALR'];
const curves = PICK.map((s) => ({ s, c: P.chargeCurve(s, P.PKA_DEFAULT, -1, 0.1) }));
const fig1 = chart({
  title: 'Net charge against pH',
  xLabel: 'pH', yLabel: 'Net charge (proton units)',
  series: curves.map(({ s, c }) => ({ name: s, kind: 'line', x: c.x, y: c.y.map((v) => +v.toFixed(3)) })),
  xDomain: [2, 12], yDomain: [-5, 2.2],
  hlines: [{ y: 0, text: '' }],
  vlines: [{ x: PH, text: 'PBS, pH 7.4' }],
  desc: `Net charge against pH for three of the paper's peptides, from the protein parameter calculator. In phosphate-buffered saline at pH 7.4 all three are negatively charged; HDCDLLR, with an isoelectric point of ${rows[0].pI.toFixed(2)}, is nearest to neutral at ${rows[0].chargeAt.toFixed(2)}.`,
  height: 290,
});

// Figure 2: equal mass, unequal moles.
const fig2 = chart({
  title: 'The same 200 µg/mL is a different molar dose',
  xLabel: 'Average mass (Da)', yLabel: 'Concentration at 200 µg/mL (µM)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: Array.from({ length: 101 }, (_, i) => 820 + i * 5.6), y: Array.from({ length: 101 }, (_, i) => P.uMFromMgMl(DOSE_MG_ML, 820 + i * 5.6)), colour: 'var(--muted)', dash: '4 4' },
    ...rows.map((r, i) => ({ name: r.seq, kind: 'dots', x: [r.avg], y: [+r.uM.toFixed(1)], size: 4, colour: i === 0 ? 'var(--c-blog)' : 'var(--c-tools)', noLegend: true, label: { text: r.seq, dx: i === 0 ? 8 : -8, dy: i === 3 ? 16 : 4, anchor: i === 0 ? 'start' : 'end' } })),
  ],
  xDomain: [820, 1400], yDomain: [140, 245],
  desc: `Molar concentration of each peptide at the paper's test concentration of 200 micrograms per millilitre. The smallest peptide, HDCDLLR, is present at ${rows[0].uM.toFixed(0)} micromolar, about ${((rows[0].uM / rows[1].uM - 1) * 100).toFixed(0)} per cent more molecules than YGSVELDELGK at ${rows[1].uM.toFixed(0)} micromolar.`,
  height: 290,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'charge', figure(fig1, `Figure 1. Net charge against pH for three of the paper's peptides, worked out by the Protein parameter calculator from standard side-chain pKa values. The dashed line marks the pH of the phosphate-buffered saline the peptides were dissolved in.`));
md = inject(md, 'dose', figure(fig2, `Figure 2. What a fixed mass concentration means in moles. Each point is one of the five named peptides at 200 µg/mL; the dashed curve is 200 µg/mL for any mass.`));
fs.writeFileSync(ART, md);
console.log('figures written:', fig1.length, fig2.length, 'bytes');
