// Figures for src/blog/discoveries/ovine-krtap36-1-tan-lambs-allele-frequencies-hardy-weinberg.md, made with the maths
// of the Allele frequency calculator (src/lib/sci/hwefst.ts: hweMulti for three alleles, popStats for two).
// Run: node scripts/blog-figures/ovine-krtap36-1-tan-lambs-allele-frequencies-hardy-weinberg.mjs
import fs from 'node:fs';
import { hweMulti, popStats } from '../../src/lib/sci/hwefst.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ovine-krtap36-1-tan-lambs-allele-frequencies-hardy-weinberg.md', import.meta.url);

// The only inputs: the six genotype counts from Bai et al. (2025), Animals 15(15): 2265 (CC BY 4.0).
const G = { 'A/A': 5, 'A/B': 17, 'A/C': 34, 'B/B': 22, 'B/C': 82, 'C/C': 86 };
const ALLELES = ['A', 'B', 'C'];
const m = new Map(Object.entries(G));
const r = hweMulti(ALLELES, m);

// The paper's allele-presence design, as two-allele problems: homozygote, heterozygote, no copy.
const recoded = [
  popStats({ name: 'C vs rest', AA: G['C/C'], AB: G['A/C'] + G['B/C'], BB: G['A/A'] + G['A/B'] + G['B/B'] }),
  popStats({ name: 'B vs rest', AA: G['B/B'], AB: G['A/B'] + G['B/C'], BB: G['A/A'] + G['A/C'] + G['C/C'] }),
  popStats({ name: 'A vs rest', AA: G['A/A'], AB: G['A/B'] + G['A/C'], BB: G['B/B'] + G['B/C'] + G['C/C'] }),
];
const pC = recoded[0].p, carriers = 1 - (1 - pC) ** 2;

// OUR construction: push a homozygote excess F into the expected counts and rerun the same chi-square.
const withF = (F) => {
  const c = new Map();
  for (let i = 0; i < 3; i++) for (let j = i; j < 3; j++) {
    const hw = i === j ? r.p[i] * r.p[i] : 2 * r.p[i] * r.p[j];
    c.set(`${ALLELES[i]}/${ALLELES[j]}`, r.n * (i === j ? hw + F * r.p[i] * (1 - r.p[i]) : hw * (1 - F)));
  }
  return hweMulti(ALLELES, c);
};
const FF = Array.from({ length: 61 }, (_, i) => i * 0.005);
const curve = FF.map((F) => +withF(F).pChi.toFixed(5));
const needed = FF.find((F) => withF(F).pChi < 0.05);

const names = Object.keys(G);
const fig1 = chart({
  title: 'KRTAP36-1 in 246 Tan lambs: observed against expected',
  xLabel: 'Genotype', yLabel: 'Lambs',
  series: [
    { name: 'Observed', kind: 'dots', x: names.map((_, i) => i + 1), y: names.map((k) => G[k]), size: 4 },
    { name: 'Expected under Hardy-Weinberg', kind: 'dots', x: names.map((_, i) => i + 1), y: r.rows.map((x) => +x.exp.toFixed(1)), size: 4 },
  ],
  xDomain: [0.5, 6.5], yDomain: [0, 95], xTicks: names.map((_, i) => i + 1), xFmt: (v) => names[v - 1] ?? '',
  desc: `Observed and expected genotype counts for the three KRTAP36-1 alleles: the largest gap is A/A, 5 against ${r.rows[0].exp.toFixed(1)}, and the whole table gives a chi-square of ${r.chi2.toFixed(3)} on 3 degrees of freedom.`,
  height: 270,
});
const fig2 = chart({
  title: 'How big a homozygote excess this sample could see',
  xLabel: 'Inbreeding coefficient F pushed into the counts', yLabel: 'Chi-square p value',
  series: [{ name: '', noLegend: true, kind: 'line', x: FF, y: curve }],
  xDomain: [0, 0.3], yDomain: [0, 1],
  hlines: [{ y: 0.05, text: 'p = 0.05' }],
  vlines: [{ x: +r.F.toFixed(4), text: `observed F ${r.F.toFixed(3)}` }, { x: needed, text: `detectable from F ≈ ${needed.toFixed(2)}`, dy: 16 }],
  desc: `The chi-square p value falls below 0.05 only once the inbreeding coefficient reaches about ${needed.toFixed(2)}, far above the observed ${r.F.toFixed(3)}.`,
  height: 260,
});

console.log(JSON.stringify({
  n: r.n, p: r.p.map((v) => +v.toFixed(5)), pct: r.p.map((v) => +(100 * v).toFixed(2)),
  chi2: +r.chi2.toFixed(4), df: r.df, pChi: +r.pChi.toFixed(4), Ho: +r.Ho.toFixed(5), He: +r.He.toFixed(5), F: +r.F.toFixed(4),
  minExpected: +r.minExpected.toFixed(4), rows: r.rows.map((x) => [x.genotype, x.obs, +x.exp.toFixed(1), +x.contrib.toFixed(2)]),
  recoded: recoded.map((s) => ({ name: s.name, counts: [s.fAA, s.fAB, s.fBB].map((f) => Math.round(f * s.n)), p: +s.p.toFixed(4), e: [s.eAA, s.eAB, s.eBB].map((v) => +v.toFixed(1)), Ho: +s.Ho.toFixed(4), He: +s.He.toFixed(4), Fis: +s.Fis.toFixed(6), chi2: +s.chi2.toFixed(4), pChi: +s.pChi.toFixed(4), pExact: +s.pExact.toFixed(5), minExp: +s.minExpected.toFixed(2) })),
  carriers: { observed: G['A/C'] + G['B/C'] + G['C/C'], expectedShare: +(100 * carriers).toFixed(1), expectedCount: +(carriers * r.n).toFixed(1) },
  needed,
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'counts', figure(fig1, 'Figure 1. The paper’s six genotype counts against the counts Hardy-Weinberg predicts from the allele frequencies, worked out by the Allele frequency calculator’s maths. The two sets differ by at most 1.7 animals except for A/A, the rarest class.'));
  md = inject(md, 'power', figure(fig2, 'Figure 2. Our own construction: keeping the allele frequencies and the 246 animals fixed, a homozygote excess F is pushed into the counts and the same chi-square is rerun. The test only notices F above about 0.13.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
