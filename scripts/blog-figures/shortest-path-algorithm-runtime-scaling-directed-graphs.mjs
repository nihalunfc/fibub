// Figures for src/blog/discoveries/shortest-path-algorithm-runtime-scaling-directed-graphs.md, made with the maths of
// the Big-O plotter (src/lib/sci/bigo.ts: the CLASSES growth functions, fitClasses, fromLog10 and duration).
// Run: node scripts/blog-figures/shortest-path-algorithm-runtime-scaling-directed-graphs.mjs
import fs from 'node:fs';
import { CLASSES, fitClasses, fromLog10, duration } from '../../src/lib/sci/bigo.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/shortest-path-algorithm-runtime-scaling-directed-graphs.md', import.meta.url);
const C = Object.fromEntries(CLASSES.map((c) => [c.id, c]));

// From the paper (Sapundzhi, Danev, Ivanova, Popstoilov and Georgiev 2025, Engineering Proceedings 100(1): 31, CC BY):
// a 1,000-vertex, 2,800-edge directed graph with visualisation switched off took Dijkstra about 3,298.4 microseconds,
// Bellman-Ford about 10,902 and Floyd-Warshall 4,492,317. Those three numbers are all we use from it.
const PAPER = { V: 1000, E: 2800, dij: 3298.4, bf: 10902, fw: 4492317 };
const DEG = PAPER.E / PAPER.V; // 2.8 edges per vertex: the paper's own sparsity

// Operation counts, written through the Big-O plotter's own growth functions:
// Dijkstra with a binary heap (V + E) log2 V = (1 + DEG) * n log2 n; Bellman-Ford V * E = DEG * n^2; Floyd-Warshall n^3.
const dijOps = (n) => (1 + DEG) * C.nlogn.g(n);
const bfOps = (n) => DEG * C.n2.g(n);
const fwOps = (n) => C.n3.g(n);

const TABLE = [20, 100, 500, 1000, 5000].map((V) => ({ V, E: Math.round(DEG * V), dij: dijOps(V), bf: bfOps(V), fw: fwOps(V) }));
const at1000 = TABLE.find((r) => r.V === 1000);
// Cost per operation implied by the paper's measured microseconds (nanoseconds per operation).
const nsPer = { dij: (PAPER.dij * 1000) / at1000.dij, bf: (PAPER.bf * 1000) / at1000.bf, fw: (PAPER.fw * 1000) / at1000.fw };

// All-pairs crossover: Floyd-Warshall (n^3) against running Dijkstra from every vertex (n * (V + E) log2 V).
// They tie when V^2 = (V + E) log2 V, so E = V^2 / log2 V - V and the density E / V^2 = 1 / log2 V - 1 / V.
const density = (V) => 1 / C.logn.g(V) - 1 / V;

// A deterministic fit: feed the Dijkstra operation counts to the tool's own class fitter.
const FIT_N = [100, 200, 400, 800, 1600, 3200, 6400];
const fit = fitClasses(FIT_N, FIT_N.map(dijOps));

const Vs = Array.from({ length: 60 }, (_, i) => Math.round(10 * 10 ** ((i * 3) / 59))); // 10 to 10,000, log spaced
const fig1 = chart({
  title: 'Steps needed on a sparse graph (2.8 edges per vertex)', xLabel: 'Vertices', yLabel: 'Operations',
  series: [
    { name: 'Dijkstra, (V+E)log₂V', kind: 'line', x: Vs, y: Vs.map((v) => Math.log10(dijOps(v))) },
    { name: 'Bellman–Ford, V·E', kind: 'line', x: Vs, y: Vs.map((v) => Math.log10(bfOps(v))), colour: 'var(--c-tools)' },
    { name: 'Floyd–Warshall, V³', kind: 'line', x: Vs, y: Vs.map((v) => Math.log10(fwOps(v))), colour: 'var(--ink)', dash: '5 4' },
  ],
  xDomain: [10, 10000], xTicks: [10, 2000, 4000, 6000, 8000, 10000],
  yDomain: [2, 13], yTicks: [3, 5, 7, 9, 11, 13], yFmt: (v) => fromLog10(v),
  vlines: [{ x: PAPER.V, text: "the paper's 1,000" }],
  desc: `Operation counts against the number of vertices for Dijkstra, Bellman-Ford and Floyd-Warshall on a directed graph with 2.8 edges per vertex. At 1,000 vertices they are about ${fromLog10(Math.log10(at1000.dij))}, ${fromLog10(Math.log10(at1000.bf))} and ${fromLog10(Math.log10(at1000.fw))}.`,
  height: 280,
});

const Vs2 = Array.from({ length: 50 }, (_, i) => Math.round(20 * 10 ** ((i * 2.4) / 49))); // 20 to about 5,000
const fig2 = chart({
  title: 'How dense a graph must be before Floyd–Warshall wins', xLabel: 'Vertices', yLabel: 'Share of all possible edges (%)',
  series: [{ name: '', kind: 'line', x: Vs2, y: Vs2.map((v) => 100 * density(v)) }],
  xDomain: [20, 5000], yDomain: [0, 20], xTicks: [20, 1000, 2000, 3000, 4000, 5000],
  desc: `The edge density at which Floyd-Warshall needs the same number of operations as running Dijkstra from every vertex. It falls from about ${(100 * density(20)).toFixed(0)} % at 20 vertices to ${(100 * density(5000)).toFixed(1)} % at 5,000.`,
  height: 260,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'ops', figure(fig1, `Figure 1. Operation counts from the Big-O plotter's own growth functions, for a directed graph with the paper's sparsity of 2.8 edges per vertex. The scale is logarithmic: at 1,000 vertices Floyd–Warshall needs about ${Math.round(at1000.fw / at1000.dij).toLocaleString('en')} times as many steps as one Dijkstra run, while the paper measured a factor of ${Math.round(PAPER.fw / PAPER.dij).toLocaleString('en')}.`));
md = inject(md, 'density', figure(fig2, `Figure 2. Where Floyd–Warshall becomes the better choice for all-pairs distances: the edge density at which its V³ steps equal V runs of Dijkstra. Above the line Floyd–Warshall wins, below it Dijkstra does. At 1,000 vertices the turning point is about ${(100 * density(1000)).toFixed(1)} % of all possible edges, roughly ${Math.round(density(1000) * 1e6 / 1000).toLocaleString('en')} edges per vertex.`));
fs.writeFileSync(ART, md);

console.log('operation counts (sparse, 2.8 edges per vertex):');
for (const r of TABLE) console.log(`  V=${r.V} E=${r.E}: Dijkstra ${r.dij.toFixed(0)}, Bellman-Ford ${r.bf.toExponential(3)}, Floyd-Warshall ${r.fw.toExponential(3)} | BF/Dij ${(r.bf / r.dij).toFixed(1)}x, FW/Dij ${(r.fw / r.dij).toFixed(0)}x`);
console.log(`paper measured at V=1000: Dijkstra ${PAPER.dij} us, Bellman-Ford ${PAPER.bf} us, Floyd-Warshall ${PAPER.fw} us`);
console.log(`  measured ratios: BF/Dij ${(PAPER.bf / PAPER.dij).toFixed(2)}x, FW/Dij ${(PAPER.fw / PAPER.dij).toFixed(0)}x`);
console.log(`  nanoseconds per operation implied: Dijkstra ${nsPer.dij.toFixed(1)}, Bellman-Ford ${nsPer.bf.toFixed(2)}, Floyd-Warshall ${nsPer.fw.toFixed(2)}`);
console.log('all-pairs crossover density:', [20, 100, 500, 1000, 5000].map((v) => `${v}:${(100 * density(v)).toFixed(2)}%`).join(' '));
console.log(`fit of the Dijkstra counts: best ${fit.best.name}, R2 ${fit.best.r2.toPrecision(6)}, b ${fit.best.b.toFixed(4)}, log-log slope ${fit.slope.toFixed(3)}`);
console.log('  rss by class:', fit.fits.filter((f) => f.ok).map((f) => `${f.name}:${f.rss.toPrecision(3)}`).join(' '));
console.log('at n = 1000, 1 ns per step:', CLASSES.filter((c) => ['n', 'nlogn', 'n2', 'n3'].includes(c.id)).map((c) => `${c.name} ${fromLog10(c.log10(1000))} steps = ${duration(c.log10(1000) - 9)}`).join(' | '));
