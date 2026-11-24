// Figures for src/blog/discoveries/laboratory-schistosome-effective-population-size-drift.md, made with the maths of
// the Wright-Fisher simulator (src/lib/sci/wrightfisher.ts: binomial sampling of 2N gene copies a generation).
// Run: node scripts/blog-figures/laboratory-schistosome-effective-population-size-drift.mjs
import fs from 'node:fs';
import { simulate } from '../../src/lib/sci/wrightfisher.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/laboratory-schistosome-effective-population-size-drift.md', import.meta.url);

// Inputs from the paper: Jutzeler, K. S. et al. (2025), PLOS Pathogens 21(8): e1013439 (CC BY 4.0).
const GENS = 400;          // generations for the oldest line (SmNMRI, about 80 years at 5 generations a year)
const RETAINED = 0.38;     // laboratory diversity is reported as 62 % lower than field diversity
const CAPTION = 0.62;      // the paper's Figure 6 caption instead says a 38 % reduction
const PAPER_SIM = [{ N: 100, loss: 0.634 }, { N: 200, loss: 0.399 }];   // the paper's BottleSim results at 400 generations
const NE_EST = [2, 258];   // NeEstimator range for the laboratory populations
const LINES = [{ name: 'SmNMRI', gens: 400 }, { name: 'SmLE', gens: 285 }, { name: 'SmOR', gens: 270 }, { name: 'SmBRE', gens: 235 }, { name: 'SmEG', gens: 160 }];

// Expected heterozygosity after t generations of drift at Ne: H_t / H_0 = (1 − 1/2Ne)^t.
const expected = (Ne, t) => (1 - 1 / (2 * Ne)) ** t;
// The Ne that leaves a given share of the diversity after t generations.
const neFor = (share, t) => { let lo = 1.5, hi = 1e6; for (let i = 0; i < 300; i++) { const m = Math.sqrt(lo * hi); expected(m, t) < share ? (lo = m) : (hi = m); } return Math.sqrt(lo * hi); };

// Simulate many independent neutral biallelic sites, each starting at a frequency of 0.5, and follow the mean
// heterozygosity 2p(1 − p) across sites. Seeded, so the numbers are the same every run.
const REPS = 2000;
function run(Ne, gens) {
  const r = simulate({ N: Ne, p0: 0.5, s: 0, h: 0.5, gens, reps: REPS, seed: 7, keep: REPS });
  const H = [];
  for (let g = 0; g <= gens; g++) { let h = 0; for (const line of r.lines) h += 2 * line[g] * (1 - line[g]); H.push(h / REPS / 0.5); }
  return { H, segregating: r.segregating, fixed: r.fixed, lost: r.lost };
}
const NES = [50, 100, 200, 400];
const sims = NES.map((Ne) => ({ Ne, ...run(Ne, GENS) }));

const gens = Array.from({ length: GENS / 8 + 1 }, (_, i) => i * 8);   // every 8th generation keeps the SVG small
const fig1 = chart({
  title: 'Neutral diversity left after generations of drift', xLabel: 'Generations in the laboratory', yLabel: 'Share of the starting heterozygosity',
  series: [
    ...sims.map((s) => ({ name: `Ne = ${s.Ne} (simulated)`, kind: 'line', x: gens, y: gens.map((g) => +s.H[g].toFixed(4)) })),
    { name: '', noLegend: true, kind: 'line', x: gens, y: gens.map((t) => +expected(200, t).toFixed(4)), colour: 'var(--muted)', dash: '4 4' },
  ],
  xDomain: [0, GENS], yDomain: [0, 1],
  hlines: [{ y: RETAINED, text: 'observed: 38 % left' }],
  desc: `Share of the starting heterozygosity left after up to ${GENS} generations of Wright-Fisher drift, simulated at effective sizes of 50, 100, 200 and 400, with the (1 - 1/2Ne) to the power t curve for Ne = 200 dashed on top.`,
  height: 290,
});

const neAxis = Array.from({ length: 121 }, (_, i) => 30 * 10 ** (i / 60));   // 30 to 3000, log spaced
const needed = neFor(RETAINED, GENS), neededCaption = neFor(CAPTION, GENS);
const fig2 = chart({
  title: 'What effective size leaves 38 % of the diversity?', xLabel: 'Effective population size Ne (log scale)', yLabel: 'Share left after 400 generations',
  series: [{ name: '', noLegend: true, kind: 'line', x: neAxis.map((n) => Math.log10(n)), y: neAxis.map((n) => +expected(n, GENS).toFixed(4)) }],
  xDomain: [Math.log10(30), Math.log10(3000)], yDomain: [0, 1], xFmt: (v) => String(Math.round(10 ** v)),
  hlines: [{ y: RETAINED, text: 'observed: 38 % left' }, { y: CAPTION, text: "figure caption: 62 % left" }],
  vlines: [{ x: Math.log10(needed), text: `Ne ${Math.round(needed)}` }, { x: Math.log10(neededCaption), text: `Ne ${Math.round(neededCaption)}`, dy: 16 }],
  bands: [{ x0: Math.log10(30), x1: Math.log10(NE_EST[1]), text: "paper's Ne estimates" }],
  desc: `Share of the starting heterozygosity left after 400 generations against effective population size, on a log axis. Leaving 38 per cent needs an Ne near 207; leaving 62 per cent needs an Ne near 418.`,
  height: 290,
});

const out = {
  neededNe: { forObserved62pcLoss: +needed.toFixed(1), forCaption38pcLoss: +neededCaption.toFixed(1) },
  paperSim: PAPER_SIM.map((p) => ({ bottleSimN: p.N, paperLeft: +(1 - p.loss).toFixed(4), wrightFisherLeft: +expected(p.N, GENS).toFixed(4), wfNeThatMatches: Math.round(neFor(1 - p.loss, GENS)) })),
  simulated: sims.map((s) => ({ Ne: s.Ne, leftAt400: +s.H[GENS].toFixed(4), analytic: +expected(s.Ne, GENS).toFixed(4), stillSegregating: s.segregating, fixed: s.fixed, lost: s.lost })),
  smallNe: { n5left99pc: +(1 - expected(5, 91)).toFixed(6), gensTo99pcAt5: Math.ceil(Math.log(0.01) / Math.log(1 - 1 / 10)) },
  perLine: LINES.map((l) => ({ ...l, leftAtNe100: +expected(100, l.gens).toFixed(4), leftAtNe207: +expected(needed, l.gens).toFixed(4) })),
  halfLife: NES.map((Ne) => ({ Ne, generationsToHalf: Math.round(Math.log(0.5) / Math.log(1 - 1 / (2 * Ne))), yearsAt5PerYear: Math.round(Math.log(0.5) / Math.log(1 - 1 / (2 * Ne)) / 5) })),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'decay', figure(fig1, `Figure 1. Neutral diversity left after up to ${GENS} generations, from ${REPS} independent simulated sites per line in fibub's Wright-Fisher simulator (seed 7), each starting at a frequency of 0.5. The dashed grey curve is the textbook (1 − 1/2Ne)^t for Ne = 200: the simulation follows it closely. The horizontal line is the 38 % the paper's laboratory populations retain.`));
  md = inject(md, 'ne', figure(fig2, `Figure 2. The same calculation read backwards. To still hold 38 % of its diversity after ${GENS} generations, a line needs an effective size near ${Math.round(needed)}; the paper's own Figure 6 caption, which says 38 % was lost rather than kept, would need about ${Math.round(neededCaption)}. The shaded band is the upper part of the paper's NeEstimator range for the laboratory lines.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
