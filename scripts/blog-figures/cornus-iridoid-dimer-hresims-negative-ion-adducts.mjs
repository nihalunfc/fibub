// Figures for src/blog/discoveries/cornus-iridoid-dimer-hresims-negative-ion-adducts.md, made with the maths of the
// Adduct calculator (src/lib/sci/mbadduct.ts: monoisotopic formula masses, adduct m/z, ppm error, formula search).
// Run: node scripts/blog-figures/cornus-iridoid-dimer-hresims-negative-ion-adducts.mjs   (rewrites the charts in the article)
import fs from 'node:fs';
import { ADDUCT_LIST, formulaMass, adductMz, neutralFrom, ppmError } from '../../src/lib/sci/mbadduct.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/cornus-iridoid-dimer-hresims-negative-ion-adducts.md', import.meta.url);
const A = (id) => ADDUCT_LIST.find((a) => a.id === id);

// Inputs from the paper: Shi et al. (2025), Front. Chem. 13: 1558075, doi:10.3389/fchem.2025.1558075 (CC BY 4.0).
// Six new iridoid glycoside dimers, each reported as an [M-H]- ion in negative-mode HRESIMS, with the neutral
// molecular formula given in the text. Only the formulas and the observed m/z values come from the paper.
const COMPOUNDS = [
  { n: 1, name: 'Corndiridoside A', f: 'C34H48O20', obs: 775.2666 },
  { n: 2, name: 'Corndiridoside B', f: 'C40H54O23', obs: 901.29828 },
  { n: 3, name: 'Corndiridoside C', f: 'C40H54O23', obs: 901.29816 },
  { n: 4, name: 'Corndiridoside D', f: 'C33H46O19', obs: 745.25659 },
  { n: 5, name: 'Corndiridoside E', f: 'C33H46O19', obs: 745.25513 },
  { n: 6, name: 'Corndiridoside F', f: 'C33H46O19', obs: 745.25549 },
];

const rows = COMPOUNDS.map((c) => {
  const M = formulaMass(c.f), mz = adductMz(M, A('M-H'));
  return { ...c, M, mz, ppm: ppmError(c.obs, mz), back: neutralFrom(c.obs, A('M-H')) };
});

// The adduct ladder for compound 1: the same molecule seen as other ions.
const LADDER = ['M+H', 'M+Na', 'M+K', 'M+NH4', 'M-H', 'M+Cl', 'M+HCOO', 'M-2H', '2M-H'];
const ladder = LADDER.map((id) => ({ id, label: A(id).label, mz: adductMz(rows[0].M, A(id)), z: A(id).z }));

// Formula search for compound 4's ion: every CcHhNnOo neutral within 25 ppm of the observed [M-H]- m/z whose
// ring-plus-double-bond equivalent (RDBE = C - H/2 + N/2 + 1) is a whole number between 0 and 20 (an even-electron
// neutral molecule). Elements and ranges are OUR choice; the paper states only the winning formula.
const candidates = [];
for (let c = 20; c <= 48; c++) for (let n = 0; n <= 3; n++) for (let o = 6; o <= 32; o++) for (let h = 16; h <= 84; h++) {
  const rdbe = c - h / 2 + n / 2 + 1;
  if (!Number.isInteger(rdbe) || rdbe < 0 || rdbe > 20) continue;
  const f = `C${c}H${h}${n ? 'N' + n : ''}O${o}`;
  const ppm = ppmError(rows[3].obs, adductMz(formulaMass(f), A('M-H')));
  if (Math.abs(ppm) <= 25) candidates.push({ f, ppm, rdbe });
}
candidates.sort((a, b) => Math.abs(a.ppm) - Math.abs(b.ppm));

const fig1 = chart({
  title: 'Six new dimers: observed minus calculated mass',
  xLabel: 'Compound number', yLabel: 'Mass error (ppm)',
  series: [{ name: '', noLegend: true, kind: 'dots', x: rows.map((r) => r.n), y: rows.map((r) => +r.ppm.toFixed(2)), size: 4 }],
  xDomain: [0.5, 6.5], yDomain: [-6, 6], xTicks: [1, 2, 3, 4, 5, 6], yTicks: [-5, -2, 0, 2, 5],
  hlines: [{ y: 0, text: '' }, { y: 5, text: '+5 ppm' }, { y: -5, text: '−5 ppm' }, { y: 2, text: '' }, { y: -2, text: '' }],
  desc: 'Mass error in parts per million for the six new iridoid glycoside dimers, from the adduct calculator\'s [M-H]- masses against the paper\'s observed m/z values. All six sit inside 1.3 ppm, well within the usual 5 ppm band.',
  height: 250,
});

// Candidate formulas: ppm offset against RDBE, with the few that fall inside 25 ppm labelled.
const near = candidates.slice(0, 7);
const fig2 = chart({
  title: 'Which formula fits m/z 745.25659 as [M−H]⁻?',
  xLabel: 'Mass error if this formula is right (ppm)', yLabel: 'Rings plus double bonds (RDBE)',
  series: [
    { name: '', noLegend: true, kind: 'dots', x: near.map((c) => +c.ppm.toFixed(2)), y: near.map((c) => c.rdbe), size: 4 },
    ...near.map((c) => ({ name: '', noLegend: true, kind: 'dots', x: [+c.ppm.toFixed(2)], y: [c.rdbe], size: 0.1, label: { text: c.f, dx: c.ppm > 10 ? -8 : 8, anchor: c.ppm > 10 ? 'end' : 'start' } })),
  ],
  xDomain: [-26, 26], yDomain: [0, 20], xTicks: [-25, -5, 0, 5, 25],
  vlines: [{ x: 5, text: '' }, { x: -5, text: '' }],
  desc: 'Candidate molecular formulas for the ion at m/z 745.25659 in negative mode. Only C33H46O19, the formula the paper gives, lands inside 5 parts per million; the next whole-RDBE candidate is 6 ppm away.',
  height: 270,
});

console.log(JSON.stringify({
  rows: rows.map((r) => ({ n: r.n, f: r.f, M: +r.M.toFixed(5), mz: +r.mz.toFixed(5), obs: r.obs, ppm: +r.ppm.toFixed(2), mDa: +((r.obs - r.mz) * 1000).toFixed(2), back: +r.back.toFixed(5) })),
  ladder: ladder.map((l) => ({ ion: l.label, z: l.z, mz: +l.mz.toFixed(4) })),
  candidates: candidates.slice(0, 8).map((c) => ({ f: c.f, ppm: +c.ppm.toFixed(2), rdbe: c.rdbe })),
  nCandidatesWithin5: candidates.filter((c) => Math.abs(c.ppm) <= 5).length,
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ppm', figure(fig1, 'Figure 1. How far each reported ion sits from the mass the Adduct calculator works out for the paper\'s own formula, as an [M−H]⁻ ion. The dashed lines mark the ±5 ppm band most high-resolution instruments are held to.'));
  md = inject(md, 'formulas', figure(fig2, 'Figure 2. Every carbon-hydrogen-nitrogen-oxygen formula within 25 ppm of the ion at m/z 745.25659, plotted against its rings-plus-double-bonds count. Only the paper\'s formula lands inside 5 ppm. The element set and the ranges searched are our choice.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
