// Figures for src/blog/discoveries/aav9-vp1-overlapping-peptide-library-matrix-pools-epitope-mapping.md, made with
// the maths of the Peptide library tool (src/lib/sci/peptide-overlap.ts: tile, guaranteedSpan, matrix, deconvolve)
// and the Peptide mass calculator (src/lib/sci/peptide.ts: peptideMass, mz).
// Run: node scripts/blog-figures/aav9-vp1-overlapping-peptide-library-matrix-pools-epitope-mapping.mjs
import fs from 'node:fs';
import { tile, guaranteedSpan, matrix, deconvolve, flags, hydroShare } from '../../src/lib/sci/peptide-overlap.ts';
import { peptideMass, mz } from '../../src/lib/sci/peptide.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/aav9-vp1-overlapping-peptide-library-matrix-pools-epitope-mapping.md', import.meta.url);

// From the paper: Balasubramanian et al. (2025), Front. Immunol. 16: 1641289, doi:10.3389/fimmu.2025.1641289 (CC BY).
// 182 peptides, 15-mers with an 11-residue overlap, covering AAV9 VP1; 41 immunopeptidomics peptides in 13 matrix
// pools of 6-7 peptides; epitope "Peptide 21" is FQFSYEFENV. VP1 length 736 residues: UniProt Q6JC40 (catalogue).
const LEN = 736, PEP = 15, STEP = 4, MAPPS = 41, PEP21 = 'FQFSYEFENV';

const spans = tile(LEN, PEP, STEP, true), spansNoEnd = tile(LEN, PEP, STEP, false);
const guar = guaranteedSpan(LEN, spans);
const m = matrix(MAPPS);
const cov = Array(LEN + 1).fill(0);
for (const s of spans) for (let i = s.start; i <= s.end; i++) cov[i]++;

// How many pools a matrix design needs, against how many peptides are in it.
const ns = Array.from({ length: 200 }, (_, i) => i + 1);
const fig1 = chart({
  title: 'Matrix pools: tests needed for a peptide library', xLabel: 'Peptides in the library', yLabel: 'Tests (pools)',
  series: [
    { name: 'One test per peptide', kind: 'line', x: ns, y: ns, dash: '4 4', colour: 'var(--muted)' },
    { name: 'Matrix pools (rows + columns)', kind: 'line', x: ns, y: ns.map((n) => matrix(n).pools) },
    { name: '', noLegend: true, kind: 'dots', x: [MAPPS, 182], y: [m.pools, matrix(182).pools], size: 4, colour: 'var(--c-blog)' },
  ],
  xDomain: [0, 200], yDomain: [0, 100],
  desc: `Row-and-column pooling needs about twice the square root of the library size. The paper's 41 peptides take ${m.pools} pools, and its 182-peptide overlapping library would take ${matrix(182).pools}.`,
  height: 280,
});

// How ambiguous the deconvolution becomes when more than one peptide in a donor responds.
const peps = [...Array(MAPPS)].map((_, i) => ({ seq: 'X', start: i + 1, end: i + 1 }));
let seed = 1641289; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const trials = 400;
const ks = [1, 2, 3, 4, 5, 6, 7, 8];
const mean = ks.map((k) => {
  let tot = 0;
  for (let t = 0; t < trials; t++) {
    const picked = new Set();
    while (picked.size < k) picked.add(Math.floor(rnd() * MAPPS));
    const ids = [...picked];
    const rows = [...new Set(ids.map((i) => m.cell[i][0]))], cols = [...new Set(ids.map((i) => m.cell[i][1]))];
    tot += deconvolve(peps, m, rows, cols).cand.length;
  }
  return +(tot / trials).toFixed(2);
});
const fig2 = chart({
  title: 'Matrix pooling stays sharp only for few positives', xLabel: 'Peptides that really respond in one donor', yLabel: 'Candidates the pools allow',
  series: [
    { name: 'Candidates (mean of 400 draws)', kind: 'line', x: ks, y: mean },
    { name: 'Peptides that really respond', kind: 'line', x: ks, y: ks, dash: '4 4', colour: 'var(--muted)' },
  ],
  xDomain: [1, 8], yDomain: [0, 32], xTicks: [1, 2, 3, 4, 5, 6, 7, 8],
  desc: `With one responding peptide the 13 pools name it exactly. With two, four peptides fit the pattern; with seven, about ${Math.round(mean[6])} of the 41 do.`,
  height: 270,
});

const p21 = peptideMass(PEP21);
console.log(JSON.stringify({
  peptides: spans.length, withoutEndPeptide: spansNoEnd.length, lastSpan: spans.at(-1), lastSpanNoEnd: spansNoEnd.at(-1),
  guaranteed: guar, coverageMid: cov.slice(361, 369), coverageMax: Math.max(...cov.slice(1)),
  pools: m.pools, rows: m.rows, cols: m.cols, poolSizes: [...new Set([...m.rowPools, ...m.colPools].map((p) => p.length))].sort(),
  pools182: matrix(182).pools, p21: { mono: +p21.mono.toFixed(4), avg: +p21.avg.toFixed(3), mz2: +mz(p21.mono, 2).toFixed(4) },
  p21flags: flags(PEP21).map((f) => f.code), p21hydro: hydroShare(PEP21), candidates: Object.fromEntries(ks.map((k, i) => [k, mean[i]])),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pools', figure(fig1, `Figure 1. How many tests a row-and-column pooling design needs, worked out with the Peptide library tool's maths. The dots are the paper's 41 immunopeptidomics peptides (${m.pools} pools, as published) and what its 182-peptide overlapping library would need (${matrix(182).pools} pools instead of 182 single tests).`));
  md = inject(md, 'ambiguity', figure(fig2, 'Figure 2. Candidates left after reading the positive rows and columns, against how many peptides truly respond in one donor, in a 41-peptide matrix. Mean of 400 random draws made by our script, not the paper’s data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
