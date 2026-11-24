// Figures for src/blog/discoveries/tobrfv-tolerance-tomato-chromosome-8-segregation-chi-square.md, made with the
// maths of the Mendelian chi-square test (src/lib/sci/mendel.ts: the goodness-of-fit test and the exact test).
// Run: node scripts/blog-figures/tobrfv-tolerance-tomato-chromosome-8-segregation-chi-square.mjs
import fs from 'node:fs';
import { chiGof, exactGof } from '../../src/lib/sci/mendel.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/tobrfv-tolerance-tomato-chromosome-8-segregation-chi-square.md', import.meta.url);

// Counts from the paper (Mariani et al. 2026, Plants 15(22): 3632):
// 128 F2 plants scored at 21 days, 94 tolerant and 34 susceptible; 110 of them genotyped,
// 28 susceptible, 56 heterozygous and 26 homozygous for the tolerant parent's allele.
const PHENO = [94, 34], TOL = [26, 56], GENO = [28, 56, 26];

const tests = [
  { name: 'Phenotypes at 21 days, 3 : 1', obs: PHENO, ratio: [3, 1], classes: ['Tolerant', 'Susceptible'] },
  { name: 'Tolerant plants only, 1 : 2', obs: TOL, ratio: [1, 2], classes: ['Homozygous tolerant', 'Heterozygous'] },
  { name: 'All three genotypes, 1 : 2 : 1', obs: GENO, ratio: [1, 2, 1], classes: ['Susceptible', 'Heterozygous', 'Homozygous tolerant'] },
].map((t) => { const g = chiGof(t.obs, t.ratio); return { ...t, ...g, exact: exactGof(t.obs, t.ratio) }; });

// Rival ratios the same 94 : 34 split cannot rule out (or can).
const RIVALS = [[3, 1], [2, 1], [13, 3], [5, 1], [9, 7], [1, 1]];
const rivals = RIVALS.map((r) => { const g = chiGof(PHENO, r); return { ratio: r.join(':'), chi2: g.chi2, p: g.p, expected: g.expected, exact: exactGof(PHENO, r) }; });

// Figure 1: the window of tolerant counts out of 128 that a 3 : 1 test accepts.
const ks = Array.from({ length: 51 }, (_, i) => 74 + i); // 74 to 124 tolerant out of 128
const ps = ks.map((k) => +chiGof([k, 128 - k], [3, 1]).p.toFixed(5));
const exacts = ks.map((k) => +exactGof([k, 128 - k], [3, 1]).toFixed(5));
const inWindow = ks.filter((k, i) => ps[i] >= 0.05);
const fig1 = chart({
  title: 'What 128 plants can and cannot tell apart', xLabel: 'Tolerant plants out of 128', yLabel: 'p-value against 3 : 1',
  series: [
    { name: 'Chi-square', kind: 'line', x: ks, y: ps },
    { name: 'Exact binomial', kind: 'line', x: ks, y: exacts, dash: '5 3' },
  ],
  xDomain: [74, 124], yDomain: [0, 1],
  hlines: [{ y: 0.05, text: 'p = 0.05' }],
  vlines: [{ x: 94, text: 'observed 94' }, { x: 85.33, text: '2 : 1 expects 85', left: true, dy: 16 }, { x: 104, text: '13 : 3 expects 104', dy: 32 }],
  desc: 'The p-value of a 3 to 1 chi-square test against the number of tolerant plants out of 128. Everything between about 85 and 107 tolerant plants is accepted, which covers the 2 to 1 expectation as well.',
  height: 290,
});

// Figure 2: how the 18 plants left out of the genotyping could have changed the 1 : 2 : 1 verdict.
const addSus = Array.from({ length: 19 }, (_, i) => i); // k of the 18 susceptible, the rest heterozygous
const pHet = addSus.map((k) => +chiGof([28 + k, 56 + (18 - k), 26], [1, 2, 1]).p.toFixed(5));
const pHom = addSus.map((k) => +chiGof([28 + k, 56, 26 + (18 - k)], [1, 2, 1]).p.toFixed(5));
const fig2 = chart({
  title: 'If the 18 ungenotyped plants came back', xLabel: 'How many of the 18 were susceptible', yLabel: 'p-value against 1 : 2 : 1',
  series: [
    { name: 'The rest heterozygous', kind: 'line', x: addSus, y: pHet },
    { name: 'The rest homozygous tolerant', kind: 'line', x: addSus, y: pHom, dash: '5 3' },
  ],
  xDomain: [0, 18], yDomain: [0, 1], hlines: [{ y: 0.05, text: 'p = 0.05' }],
  desc: 'The p-value of the 1 to 2 to 1 genotype test if the 18 plants excluded from genotyping are added back, split in every possible way between two classes. Most splits keep the ratio accepted.',
  height: 290,
});

const safeHet = addSus.filter((k, i) => pHet[i] >= 0.05), safeHom = addSus.filter((k, i) => pHom[i] >= 0.05);
console.log(JSON.stringify({
  tests: tests.map((t) => ({ name: t.name, obs: t.obs, expected: t.expected.map((e) => +e.toFixed(2)), chi2: +t.chi2.toFixed(4), df: t.df, p: +t.p.toFixed(4), exact: +t.exact.toFixed(4), smallClasses: t.smallClasses, contrib: t.contrib.map((c) => +c.toFixed(4)) })),
  rivals: rivals.map((r) => ({ ratio: r.ratio, expected: r.expected.map((e) => +e.toFixed(2)), chi2: +r.chi2.toFixed(4), p: +r.p.toFixed(4), exact: +r.exact.toFixed(4) })),
  acceptWindow: [Math.min(...inWindow), Math.max(...inWindow)],
  exactWindow: [Math.min(...ks.filter((k, i) => exacts[i] >= 0.05)), Math.max(...ks.filter((k, i) => exacts[i] >= 0.05))],
  excluded: { restHeterozygous: [Math.min(...safeHet), Math.max(...safeHet)], restHomozygous: [Math.min(...safeHom), Math.max(...safeHom)] },
  worstHet: Math.min(...pHet), worstHom: Math.min(...pHom),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'window', figure(fig1, 'Figure 1. The p-value a 3 : 1 test gives for every possible split of 128 plants, from the Mendelian chi-square tool\'s own code, with the exact binomial test alongside. The accepted window is wide enough to swallow the 2 : 1 expectation of a cross with a lethal class.'));
  md = inject(md, 'excluded', figure(fig2, 'Figure 2. A sensitivity check we ran, not something the paper reports: the 18 F2 plants left out of genotyping are added back to the 110 in every possible split between two genotype classes, and the 1 : 2 : 1 test is repeated.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
