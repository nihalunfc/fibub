// Figures for src/blog/discoveries/csn2-a2-beta-casein-cattle-hardy-weinberg-exact-test.md, made with the maths of
// the Hardy-Weinberg tester (src/lib/sci/hwefst.ts) and the Cross-tab and chi-square tool (src/lib/sci/crosstab.ts).
// Run: node scripts/blog-figures/csn2-a2-beta-casein-cattle-hardy-weinberg-exact-test.mjs
import fs from 'node:fs';
import { popStats, hweExact, hweExactSides, weirCockerham, neiF, pooled } from '../../src/lib/sci/hwefst.ts';
import { crosstab } from '../../src/lib/sci/crosstab.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/csn2-a2-beta-casein-cattle-hardy-weinberg-exact-test.md', import.meta.url);

// Genotype counts as the paper states them (Radkowska et al. 2026, Genes 17: 1387). A = A1, B = A2.
const POPS = [
  { name: 'Simmental', AA: 101, AB: 299, BB: 168 },
  { name: 'Polish Red', AA: 83, AB: 135, BB: 55 },
  { name: 'Polish Black-and-White', AA: 27, AB: 27, BB: 3 },
];
const f4 = (v) => v.toFixed(4);

console.log('--- one population at a time ---');
const S = POPS.map((c) => {
  const s = popStats(c), e = hweExactSides(c.AA, c.AB, c.BB);
  console.log(`${s.name}: n ${s.n} | A1 ${f4(s.p)} A2 ${f4(s.q)} | Ho ${f4(s.Ho)} He ${f4(s.He)} F ${f4(s.Fis)} | expected ${s.eAA.toFixed(2)}/${s.eAB.toFixed(2)}/${s.eBB.toFixed(2)}` +
    ` | chi2 ${f4(s.chi2)} p ${f4(s.pChi)} | exact p ${f4(e.p)} (deficit ${f4(e.deficit)}, excess ${f4(e.excess)}) | smallest expected ${s.minExpected.toFixed(3)}`);
  return { ...c, ...s, sides: e };
});

console.log('--- the three breeds together ---');
const wc = weirCockerham(POPS), nei = neiF(POPS), pl = pooled(POPS), ps = popStats(pl);
console.log('Weir-Cockerham Fst', f4(wc.Fst), 'Fis', f4(wc.Fis), 'Fit', f4(wc.Fit), '| Nei Fst', f4(nei.Fst), 'HS', f4(nei.HS), 'HT', f4(nei.HT));
console.log('pooled', pl.AA, pl.AB, pl.BB, '| Ho', f4(ps.Ho), 'He', f4(ps.He), 'F', f4(ps.Fis), 'exact p', f4(ps.pExact));

// The paper's pairwise comparisons of the genotype distributions: a 2 x 3 table of counts per breed pair.
console.log('--- pairwise genotype distributions (Pearson chi-square) ---');
const expand = (p) => { const a = [], b = []; for (const [g, n] of [['A1A1', p.AA], ['A1A2', p.AB], ['A2A2', p.BB]]) for (let i = 0; i < n; i++) { a.push(p.name); b.push(g); } return [a, b]; };
for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
  const [a1, b1] = expand(POPS[i]), [a2, b2] = expand(POPS[j]);
  const x = crosstab([...a1, ...a2], [...b1, ...b2]);
  console.log(`${POPS[i].name} vs ${POPS[j].name}: chi2 ${x.chi2.toFixed(3)} df ${x.df} p ${x.p.toExponential(3)} Cramer V ${x.cramerV.toFixed(3)}`);
}

/* ------------------------------------------------- Figure 1: the exact test's own distribution, two breeds */
// hweExact returns the probability of every possible heterozygote count given the allele counts. Plotted against
// the heterozygote count as a share of the herd, so two samples of different size can sit on one axis.
const dist = (c) => {
  const d = hweExact(c.AA, c.AB, c.BB), n = c.AA + c.AB + c.BB, parity = (2 * Math.min(c.AA, c.BB) + c.AB) & 1;
  const x = [], y = [];
  d.probs.forEach((p, h) => { if ((h & 1) === parity) { x.push((100 * h) / n); y.push(p); } });
  return { x, y, n };
};
const dS = dist(POPS[0]), dP = dist(POPS[2]);
const fig1 = chart({
  title: 'Every heterozygote count Hardy-Weinberg allows',
  xLabel: 'A1A2 heterozygotes (% of the herd sampled)',
  yLabel: 'Probability',
  series: [
    { name: 'Simmental (n = 568)', x: dS.x, y: dS.y },
    { name: 'Polish Black-and-White (n = 57)', x: dP.x, y: dP.y, colour: 'var(--c-tools)' },
  ],
  xDomain: [20, 80], yDomain: [0, Math.max(...dP.y) * 1.08],
  vlines: [{ x: (100 * 299) / 568, text: '52.6 % seen', dy: 0 }, { x: (100 * 27) / 57, text: '47.4 % seen', dy: 18, left: true }],
  height: 270,
  desc: 'Two probability distributions of the heterozygote count under Hardy-Weinberg, one narrow for the 568 Simmental cows and one broad for the 57 Polish Black-and-White cows, with the observed shares marked.',
});

/* ------------------------------------------------- Figure 2: how many animals it takes to prove a deficit */
// For an allele frequency of 0.44 (the Simmental value) and a true heterozygote deficit F, the smallest sample
// whose one-sided exact test reaches p < 0.05. Genotype counts come from Ho = He (1 - F), rounded to whole animals.
const P1 = 0.4410211267605634;
const needed = (F, p = P1) => {
  for (let n = 10; n <= 4000; n += 2) {
    const q = 1 - p, AB = Math.round(n * 2 * p * q * (1 - F)), AA = Math.round(n * (p * p + F * p * q)), BB = n - AA - AB;
    if (AA < 0 || BB < 0 || AB < 0) continue;
    if (hweExactSides(AA, AB, BB).deficit < 0.05) return n;
  }
  return NaN;
};
const Fs = [], Ns = [];
for (let F = 0.02; F <= 0.3001; F += 0.005) { Fs.push(F); Ns.push(needed(F)); }
const fig2 = chart({
  title: 'Animals needed to prove a heterozygote deficit',
  xLabel: 'True inbreeding coefficient F at the locus',
  yLabel: 'Animals to genotype',
  series: [{ name: 'One-sided exact test, p < 0.05', x: Fs, y: Ns }],
  xDomain: [0, 0.31], yDomain: [0, 1600],
  hlines: [{ y: 568, text: '568 Simmental' }, { y: 57, text: '57 Polish Black-and-White' }],
  height: 270,
  desc: 'A falling curve: with F of 0.05 well over a thousand animals are needed, with F of 0.1 about three hundred, and with F of 0.2 under a hundred.',
});
console.log('--- animals needed, one-sided exact test at 5 % (allele frequency 0.441) ---');
for (const F of [0.05, 0.075, 0.1, 0.15, 0.2, 0.3]) console.log('F', F, '->', needed(F), 'animals');

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'dist', figure(fig1, 'Figure 1. The exact test in one picture: given each breed’s allele counts, how likely every possible heterozygote count is under Hardy-Weinberg. Built with the Hardy-Weinberg tester’s own `hweExact`. The dashed lines are the shares the paper reports; both sit inside the bulk of their curve, which is why neither test rejects.'));
md = inject(md, 'power', figure(fig2, 'Figure 2. For a locus with an A1 frequency of 0.441, the smallest sample whose one-sided exact test would show a true heterozygote deficit F at the 5 % level. Computed with the same exact test; the genotype counts behind each point are ours, not the paper’s.'));
fs.writeFileSync(ART, md);
console.log('fig1', fig1.length, 'bytes; fig2', fig2.length, 'bytes');
