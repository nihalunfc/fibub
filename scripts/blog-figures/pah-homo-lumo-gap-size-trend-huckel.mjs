// Figures and numbers for src/blog/discoveries/pah-homo-lumo-gap-size-trend-huckel.md, made with the maths of the
// Hückel MO calculator (src/lib/sci/huckel.ts: build + solve).
// Run: node scripts/blog-figures/pah-homo-lumo-gap-size-trend-huckel.mjs
import fs from 'node:fs';
import { build, solve, PRESETS } from '../../src/lib/sci/huckel.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pah-homo-lumo-gap-size-trend-huckel.md', import.meta.url);
const S3 = Math.sqrt(3);

/**
 * A benzenoid (only six-membered rings) from the centres of its hexagons: each hexagon has vertices at
 * 0, 60 ... 300 degrees and a bond length of 1, vertices closer than 0.05 are the same atom, and any two atoms
 * within 1.05 are bonded. Nothing here is geometry for the model: Hückel theory sees only the bond list.
 */
function benzenoid(centres) {
  const pts = [];
  for (const [cx, cy] of centres) for (let k = 0; k < 6; k++) {
    const p = [cx + Math.cos((k * Math.PI) / 3), cy + Math.sin((k * Math.PI) / 3)];
    if (!pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.05)) pts.push(p);
  }
  const bonds = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 1.05) bonds.push([i, j]);
  return { n: pts.length, bonds };
}
const acene = (rings) => benzenoid(Array.from({ length: rings }, (_, k) => [0, k * S3]));
// Acenaphthylene: the naphthalene preset plus a -CH=CH- bridge across the two peri carbons (atoms 1 and 8),
// which closes a five-membered ring and makes the system non-alternant.
const naphBonds = PRESETS.find((p) => p.id === 'naphthalene').bonds;

const MOLS = [
  { name: 'Benzene', kind: 'acene', m: acene(1) },
  { name: 'Naphthalene', kind: 'acene', m: acene(2) },
  { name: 'Anthracene', kind: 'acene', m: acene(3) },
  { name: 'Tetracene', kind: 'acene', m: acene(4) },
  { name: 'Pentacene', kind: 'acene', m: acene(5) },
  { name: 'Hexacene', kind: 'acene', m: acene(6) },
  { name: 'Heptacene', kind: 'acene', m: acene(7) },
  { name: 'Phenanthrene', kind: 'other', m: benzenoid([[0, 0], [0, S3], [1.5, S3 * 1.5]]) },
  { name: 'Chrysene', kind: 'other', m: benzenoid([[0, 0], [0, S3], [1.5, S3 * 1.5], [1.5, S3 * 2.5]]) },
  { name: 'Pyrene', kind: 'other', m: benzenoid([[0, 0], [0, S3], [1.5, S3 / 2], [1.5, S3 * 1.5]]) },
  { name: 'Triphenylene', kind: 'other', m: benzenoid([[0, 0], [1.5, S3 / 2], [-1.5, S3 / 2], [0, -S3]]) },
  { name: 'Acenaphthylene', kind: 'five', m: { n: 12, bonds: [...naphBonds, [0, 10], [10, 11], [11, 7]] } },
];

const res = MOLS.map((M) => {
  const h = solve(build(M.m.n, M.m.bonds));
  return { ...M, C: M.m.n, bonds: M.m.bonds.length, homo: h.orbitals[h.homo].x, lumo: h.orbitals[h.lumo].x, gap: h.orbitals[h.homo].x - h.orbitals[h.lumo].x, deloc: h.delocalisation, levels: h.orbitals.map((o) => +o.x.toFixed(4)), occ: h.orbitals.map((o) => o.occ) };
});
const by = Object.fromEntries(res.map((r) => [r.name, r]));

// The paper (Xu et al. 2021) reports, for its "linear" group, gaps of 1.45 to 5.97 eV over 10 to 26 carbon atoms.
// OUR ASSUMPTION: the ends of that range are the plain acenes naphthalene (C10) and hexacene (C26). Each end then
// fixes a value of |beta| from the Hückel gap; we use the mean of the two.
const PAPER_LIN = { lo: 1.45, hi: 5.97, cLo: 26, cHi: 10 };
const betaHi = PAPER_LIN.hi / by.Naphthalene.gap;
const betaLo = PAPER_LIN.lo / by.Hexacene.gap;
const BETA = (betaHi + betaLo) / 2;
const eV = (g) => g * BETA;

const acenes = res.filter((r) => r.kind === 'acene');
const others = res.filter((r) => r.kind !== 'acene');
const fig1 = chart({
  title: 'Hückel gaps against size, with the paper\'s range', xLabel: 'Carbon atoms in the π system', yLabel: `Gap (eV, with |β| = ${BETA.toFixed(2)} eV)`,
  series: [
    { name: 'Linear acenes', kind: 'line', x: acenes.map((r) => r.C), y: acenes.map((r) => +eV(r.gap).toFixed(3)) },
    { name: 'Acenes', noLegend: true, kind: 'dots', x: acenes.map((r) => r.C), y: acenes.map((r) => +eV(r.gap).toFixed(3)), size: 3.4, colour: 'var(--c-blog)' },
    { name: 'Six-ring isomers', kind: 'dots', x: others.filter((r) => r.kind === 'other').map((r) => r.C), y: others.filter((r) => r.kind === 'other').map((r) => +eV(r.gap).toFixed(3)), size: 3.4 },
    { name: 'With a five-membered ring', kind: 'dots', x: [by.Acenaphthylene.C], y: [+eV(by.Acenaphthylene.gap).toFixed(3)], size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [4, 32], yDomain: [0, 10],
  hlines: [{ y: PAPER_LIN.hi, text: 'paper, linear group: 5.97 eV' }, { y: PAPER_LIN.lo, text: '1.45 eV' }],
  desc: `Hückel HOMO-LUMO gaps for the acene series and for four six-ring isomers, scaled by a single beta of ${BETA.toFixed(2)} electronvolts. The dashed lines are the gap range the paper reports for its linear group.`,
  height: 300,
});

// Level diagram: every Hückel level of three C12-C14 systems, in units of beta.
const LEV = ['Anthracene', 'Phenanthrene', 'Acenaphthylene'];
const fig2 = chart({
  title: 'Where the levels sit: same size, different gaps', xLabel: 'π system', yLabel: 'Orbital energy (x, in units of β above α)',
  series: LEV.map((n, i) => ({ name: `${n} (C${by[n].C})`, kind: 'dots', x: by[n].levels.map(() => i + 1), y: by[n].levels, size: 3.2, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][i] })),
  xDomain: [0.5, 3.5], xTicks: [1, 2, 3], xFmt: (t) => ['anthracene', 'phenanthrene', 'acenaphthylene'][t - 1] ?? '',
  yDomain: [-2.6, 2.6], hlines: [{ y: 0, text: 'α (non-bonding)' }],
  desc: 'All Hückel orbital energies of anthracene, phenanthrene and acenaphthylene in units of beta. The first two are symmetric about the non-bonding level; acenaphthylene, which has a five-membered ring, is not.',
  height: 300,
});

const show = (r) => ({ C: r.C, bonds: r.bonds, homo: +r.homo.toFixed(4), lumo: +r.lumo.toFixed(4), gap: +r.gap.toFixed(4), eV: +eV(r.gap).toFixed(2), deloc: r.deloc === null ? null : +r.deloc.toFixed(3) });
console.log(JSON.stringify({
  molecules: Object.fromEntries(res.map((r) => [r.name, show(r)])),
  beta: { fromNaphthalene: +betaHi.toFixed(3), fromHexacene: +betaLo.toFixed(3), used: +BETA.toFixed(3), spreadPct: +((betaHi / betaLo - 1) * 100).toFixed(1) },
  ratios: {
    paperLinear: +(PAPER_LIN.hi / PAPER_LIN.lo).toFixed(3),
    huckelNaphToHexacene: +(by.Naphthalene.gap / by.Hexacene.gap).toFixed(3),
    paperAll: +(6.59 / 0.64).toFixed(2),
    huckelBenzeneToHeptacene: +(by.Benzene.gap / by.Heptacene.gap).toFixed(2),
  },
  isomerSplits: {
    C14_phen_minus_anth_beta: +(by.Phenanthrene.gap - by.Anthracene.gap).toFixed(4),
    C14_eV: +(eV(by.Phenanthrene.gap - by.Anthracene.gap)).toFixed(2),
    C18_chry_minus_tetra_beta: +(by.Chrysene.gap - by.Tetracene.gap).toFixed(4),
    C18_eV: +(eV(by.Chrysene.gap - by.Tetracene.gap)).toFixed(2),
  },
  acenaphthylene: { homo: +by.Acenaphthylene.homo.toFixed(4), lumo: +by.Acenaphthylene.lumo.toFixed(4), asym: +(by.Acenaphthylene.homo + by.Acenaphthylene.lumo).toFixed(4) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'size', figure(fig1, `Figure 1. HOMO-LUMO gaps from the Hückel MO calculator's maths, in units of β scaled by a single |β| = ${BETA.toFixed(2)} eV fitted to the two ends of the paper's linear-group range (dashed lines). Six-ring isomers sit well above the acene of the same size; acenaphthylene, with its five-membered ring, sits below.`));
  md = inject(md, 'levels', figure(fig2, 'Figure 2. Every Hückel level of three similar-sized π systems, in units of β. Anthracene and phenanthrene are alternant, so their levels mirror about the non-bonding line and the HOMO and LUMO move together. Acenaphthylene is not: its lowest empty level sinks on its own.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
