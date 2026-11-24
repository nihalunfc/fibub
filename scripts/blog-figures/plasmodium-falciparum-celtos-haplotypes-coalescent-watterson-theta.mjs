// Figures for src/blog/discoveries/plasmodium-falciparum-celtos-haplotypes-coalescent-watterson-theta.md,
// made with the maths of the Coalescent simulator (src/lib/sci/coalescent.ts: harmonic, expected, replicate).
// Run: node scripts/blog-figures/plasmodium-falciparum-celtos-haplotypes-coalescent-watterson-theta.mjs
import fs from 'node:fs';
import { harmonic, expected, replicate, meanVar } from '../../src/lib/sci/coalescent.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/plasmodium-falciparum-celtos-haplotypes-coalescent-watterson-theta.md', import.meta.url);

// From the paper: Alothaid et al. (2026), Front. Cell. Infect. Microbiol. 15: 1660506 (CC BY 4.0).
const N = 202, L = 726, S = 18, PI = 0.0059;
const NSIM = 200; // the tool's maximum sample size
const REPS = 20000, SEED = 2024;

const a202 = harmonic(N), thW = S / a202, thPi = PI * L;
const e = expected(NSIM, thPi);

// Tajima's D (Tajima 1989) - written out here, not part of the tool.
function tajimaD(n, s, thetaPiLocus) {
  const a1 = harmonic(n), a2 = harmonic(n, 2);
  const b1 = (n + 1) / (3 * (n - 1)), b2 = (2 * (n * n + n + 3)) / (9 * n * (n - 1));
  const c1 = b1 - 1 / a1, c2 = b2 - (n + 2) / (a1 * n) + a2 / (a1 * a1);
  return (thetaPiLocus - s / a1) / Math.sqrt((c1 / a1) * s + (c2 / (a1 * a1 + a2)) * s * (s - 1));
}

const runPi = replicate(NSIM, thPi, REPS, SEED);
const runW = replicate(NSIM, thW, REPS, SEED);
const mvPi = meanVar(runPi.S), mvW = meanVar(runW.thetaW);
let le = 0; for (const s of runPi.S) if (s <= S) le++;
const sorted = [...runW.thetaW].sort((x, y) => x - y);
const q = (p) => sorted[Math.floor(p * sorted.length)] / L;

// Figure 1: the distribution of segregating sites under the two theta values (counts as a step outline).
const histStep = (xs, lo, hi) => {
  const bins = new Array(hi - lo + 1).fill(0);
  for (const v of xs) if (v >= lo && v <= hi) bins[v - lo]++;
  const x = [], y = [];
  bins.forEach((c, i) => { x.push(lo + i - 0.5, lo + i + 0.5); y.push((100 * c) / xs.length, (100 * c) / xs.length); });
  return { x, y };
};
const hPi = histStep(runPi.S, 0, 60), hW = histStep(runW.S, 0, 60);
const fig1 = chart({
  title: 'Segregating sites in 20,000 neutral genealogies', xLabel: 'Segregating sites S in 726 bp', yLabel: 'Runs (%)',
  series: [
    { name: 'θ from π (4.28)', kind: 'line', x: hPi.x, y: hPi.y },
    { name: 'θ from S (3.06)', kind: 'line', x: hW.x, y: hW.y },
  ],
  xDomain: [0, 55], yDomain: [0, 7],
  vlines: [{ x: S, text: `paper S = ${S}`, left: true }],
  desc: `Distribution of the number of segregating sites over 20,000 simulated genealogies of 200 gene copies, for theta 4.28 (from the paper's nucleotide diversity) and theta 3.06 (from its 18 segregating sites). The paper's S of 18 is marked.`,
  height: 270,
});

// Figure 2: how precise Watterson's theta is from one locus.
const wSite = [...runW.thetaW].map((v) => v / L);
const wHist = (() => {
  const lo = 0, hi = 0.012, nb = 48, w = (hi - lo) / nb, bins = new Array(nb).fill(0);
  for (const v of wSite) { const k = Math.floor((v - lo) / w); if (k >= 0 && k < nb) bins[k]++; }
  const x = [], y = [];
  bins.forEach((c, i) => { x.push(lo + i * w, lo + (i + 1) * w); y.push((100 * c) / wSite.length, (100 * c) / wSite.length); });
  return { x, y };
})();
const fig2 = chart({
  title: "Watterson's θ from a single 726 bp locus", xLabel: 'Estimated θ per site', yLabel: 'Runs (%)',
  series: [{ name: '', noLegend: true, kind: 'line', x: wHist.x, y: wHist.y }],
  xDomain: [0, 0.011], yDomain: [0, 12],
  vlines: [{ x: 0.0035, text: 'paper 0.0035', left: true }, { x: +(thW / L).toFixed(5), text: 'from S = 18: 0.0042', dy: 16 }],
  xFmt: (v) => (v === 0 ? '0' : v.toFixed(3)),
  desc: `Distribution of Watterson's theta per site over 20,000 simulated genealogies with the true theta set to 3.06 per locus, showing that the paper's 0.0035 and the 0.0042 implied by 18 segregating sites both fall well inside the sampling spread.`,
  height: 260,
});

console.log(JSON.stringify({
  a202: +a202.toFixed(5), a200: +harmonic(NSIM).toFixed(5), thW: +thW.toFixed(4), thWsite: +(thW / L).toFixed(7), thPi: +thPi.toFixed(4),
  expS: +e.S.toFixed(3), sdS: +Math.sqrt(e.varS).toFixed(4), expTmrca: +e.tmrca.toFixed(3), expTotal: +e.total.toFixed(3),
  simMeanS: +mvPi.mean.toFixed(2), simSdS: +Math.sqrt(mvPi.var).toFixed(2), pLE18: +(le / REPS).toFixed(4),
  thWsd: +Math.sqrt(mvW.var).toFixed(3), q025: +q(0.025).toFixed(5), q50: +q(0.5).toFixed(5), q975: +q(0.975).toFixed(5),
  D18: +tajimaD(N, 18, thPi).toFixed(3), D15: +tajimaD(N, 15, thPi).toFixed(3), theta15site: +(15 / a202 / L).toFixed(5),
  lenFor0035: Math.round(S / (a202 * 0.0035)),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'sdist', figure(fig1, "Figure 1. Segregating sites over 20,000 simulated neutral genealogies of 200 gene copies, at the two theta values the paper's own numbers give. With theta from nucleotide diversity (4.28 per locus) only 18 % of runs have 18 sites or fewer. Simulation, not the paper's data."));
  md = inject(md, 'thdist', figure(fig2, "Figure 2. How precise Watterson's theta is from one 726 bp gene: the estimate from 20,000 simulated samples when the true value is 3.06 per locus. The paper's 0.0035 and the 0.0042 implied by S = 18 are both ordinary outcomes."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
