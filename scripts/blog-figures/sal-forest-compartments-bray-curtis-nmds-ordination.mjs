// Figures for src/blog/discoveries/sal-forest-compartments-bray-curtis-nmds-ordination.md, made with the maths of
// the Community ordination tool (src/lib/sci/ordination.ts: transform, distances, pca, nmds, cluster, cophenetic).
// Run: node scripts/blog-figures/sal-forest-compartments-bray-curtis-nmds-ordination.mjs
import fs from 'node:fs';
import { transform, distances, pca, nmds, cluster, cophenetic, cutTree } from '../../src/lib/sci/ordination.ts';
import { diversity, compare } from '../../src/lib/sci/diversity.ts';
import { chart, figure, inject, watermark } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sal-forest-compartments-bray-curtis-nmds-ordination.md', import.meta.url);

// Inputs: the tree-layer importance value index (IVI) per species per compartment, as printed in the running text of
// Sharma, Bhardwaj, Thakur, Katoch and Sharma (2025), Front. For. Glob. Change 8: 1524808, doi:10.3389/ffgc.2025.1524808
// (CC BY 4.0). A species not recorded in a compartment is 0. IVI, not abundance: see the article.
const SITES = ['Rajban C6', 'Rajban C7', 'Kukron C14', 'Rajban C10', 'Kukron C15', 'Gorakhpur C7', 'Lai C28'];
const SPECIES = ['Syzygium cuminii', 'Cordia dichotoma', 'Mallotus philippensis', 'Cassia fistula', 'Terminalia tomentosa', 'Shorea robusta', 'Callicarpa japonica', 'Ficus palmata', 'Acacia catechu', 'Eucalyptus sp.'];
const IVI = [
  [28.55, 27.61, 26.90, 26.91, 29.69, 51.88, 23.98],
  [35.75, 43.29, 28.83, 29.19, 33.77, 26.16, 22.55],
  [30.55, 33.86, 32.89, 32.25, 17.27, 33.54, 29.41],
  [15.01, 15.23, 19.32, 0, 0, 14.59, 0],
  [37.64, 42.09, 38.72, 30.58, 38.69, 47.12, 16.45],
  [152.50, 137.91, 153.35, 156.59, 151.94, 126.72, 135.96],
  [0, 0, 0, 7.49, 13.85, 0, 16.19],
  [0, 0, 0, 16.99, 14.80, 0, 13.50],
  [0, 0, 0, 0, 0, 0, 17.18],
  [0, 0, 0, 0, 0, 0, 24.77],
];
// Rows are sites, columns species (what the tool expects after it reads a species-in-the-first-column table).
const X = SITES.map((_, j) => IVI.map((row) => row[j]));
const rowSums = X.map((r) => +r.reduce((a, b) => a + b, 0).toFixed(2));
const richness = X.map((r) => r.filter((v) => v > 0).length);

const D = distances(X, 'bray');
const P = pca(transform(X, 'hellinger'), 4);
const Praw = pca(X, 4);
const nm = nmds(D, 2, 20, 1);
const Z = cluster(D, 'average');
const coph = cophenetic(Z, D);
const groups = cutTree(Z, SITES.length, 3);

// Which pairs are closest and furthest apart.
const pairs = [];
for (let i = 0; i < SITES.length; i++) for (let j = i + 1; j < SITES.length; j++) pairs.push({ a: SITES[i], b: SITES[j], d: D[i][j] });
pairs.sort((p, q) => p.d - q.d);

// Figure 1: Hellinger PCA of the seven compartments, each point labelled.
const span = (k) => { const v = P.scores.map((s) => s[k]); const lo = Math.min(...v), hi = Math.max(...v), pad = 0.18 * (hi - lo || 1); return [lo - pad, hi + pad]; };
const fig1 = chart({
  title: 'Sal compartments: PCA of the tree layer', xLabel: `PC1 (${(100 * P.explained[0]).toFixed(1)} % of the variation)`, yLabel: `PC2 (${(100 * P.explained[1]).toFixed(1)} %)`,
  series: SITES.map((s, i) => ({
    name: s, noLegend: true, kind: 'dots', size: 4, colour: ['var(--c-blog)', 'var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--ink)', 'var(--c-tools)', 'var(--c-blog)'][i],
    x: [+P.scores[i][0].toFixed(4)], y: [+P.scores[i][1].toFixed(4)],
    // The four compartments with the same six species sit almost on top of each other on the right, so their labels
    // go to the left of the points and are staggered; Lai C28 and the two Rajban C10 / Kukron C15 points are clear.
    label: { text: s, dx: [-9, -9, -9, 7, 7, -9, 7][i], dy: [4, 18, -9, 4, 17, 32, 4][i], anchor: [0, 1, 2, 5].includes(i) ? 'end' : 'start' },
  })),
  xDomain: span(0), yDomain: span(1), xFmt: (v) => v.toFixed(2), yFmt: (v) => v.toFixed(2),
  hlines: [{ y: 0, text: '' }], vlines: [{ x: 0, text: '' }],
  desc: `Principal component analysis of Hellinger-transformed tree importance values for seven Sal forest compartments. PC1 explains ${(100 * P.explained[0]).toFixed(1)} per cent and PC2 ${(100 * P.explained[1]).toFixed(1)} per cent.`,
  height: 330,
});

// Figure 2: the UPGMA dendrogram the tool draws from the Bray-Curtis dissimilarities (hand-drawn SVG, so it carries
// watermark() itself; a strip is left at the bottom right for the mark).
function dendrogram(Zrows, labels) {
  const n = labels.length, W = 560, H = 300, L = 112, R = 30, T = 34, B = 54;
  const maxH = Math.max(...Zrows.map((z) => z[2])) * 1.04;
  const Xp = (v) => L + (v / maxH) * (W - L - R);
  const order = [];
  const leavesOf = (id) => (id < n ? [id] : [...leavesOf(Zrows[id - n][0]), ...leavesOf(Zrows[id - n][1])]);
  leavesOf(2 * n - 2).forEach((l) => order.push(l));
  const yOf = new Map(order.map((l, k) => [l, T + ((k + 0.5) * (H - T - B)) / n]));
  const out = [`<svg class="blog-fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dendrogram of the seven Sal compartments from Bray-Curtis dissimilarity with average linkage. Rajban C6, Rajban C7, Kukron C14 and Gorakhpur C7 join at low dissimilarity; Lai C28 joins last." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif">`];
  out.push('<title>Compartments clustered on Bray-Curtis dissimilarity (UPGMA)</title>');
  out.push(`<text x="12" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Compartments clustered on Bray-Curtis dissimilarity</text>`);
  for (const t of [0, 0.05, 0.1, 0.15, 0.2]) {
    if (t > maxH) continue;
    out.push(`<line x1="${Xp(t).toFixed(1)}" x2="${Xp(t).toFixed(1)}" y1="${T - 6}" y2="${H - B}" style="stroke:var(--line)"/>`);
    out.push(`<text x="${Xp(t).toFixed(1)}" y="${H - B + 17}" text-anchor="middle" style="fill:var(--muted)">${t}</text>`);
  }
  out.push(`<text x="${((L + W - R) / 2).toFixed(1)}" y="${H - B + 36}" text-anchor="middle" style="fill:var(--ink)">Bray-Curtis dissimilarity at which they join</text>`);
  const pos = new Map();
  Zrows.forEach((z, k) => {
    const [a, b, h] = z;
    const ya = a < n ? yOf.get(a) : pos.get(a), yb = b < n ? yOf.get(b) : pos.get(b);
    const xa = a < n ? Xp(0) : Xp(Zrows[a - n][2]), xb = b < n ? Xp(0) : Xp(Zrows[b - n][2]);
    const x = Xp(h);
    out.push(`<path d="M${xa.toFixed(1)} ${ya.toFixed(1)}H${x.toFixed(1)}V${yb.toFixed(1)}H${xb.toFixed(1)}" style="fill:none;stroke:var(--c-tools);stroke-width:2"/>`);
    pos.set(n + k, (ya + yb) / 2);
  });
  for (const l of order) out.push(`<text x="${(Xp(0) - 6).toFixed(1)}" y="${(yOf.get(l) + 4).toFixed(1)}" text-anchor="end" style="fill:var(--ink)">${labels[l]}</text>`);
  out.push(watermark(W, H));
  out.push('</svg>');
  return out.join('');
}
const fig2 = dendrogram(Z, SITES);

// Diversity per compartment from the IVI shares (the Biodiversity indices tool's maths), and the presence/absence
// similarity between compartments: Jaccard from the tool, Sorensen = 2J / (1 + J).
const div = SITES.map((s, i) => { const d = diversity(X[i]); return [s, d.S, +d.H.toFixed(3), +(1 - d.simpson).toFixed(3), +d.pielou.toFixed(3), +d.margalef.toFixed(3)]; });
const sim = [];
for (let i = 0; i < SITES.length; i++) for (let j = i + 1; j < SITES.length; j++) {
  const c = compare(X[i], X[j]);
  sim.push([SITES[i], SITES[j], +c.jaccard.toFixed(3), +((2 * c.jaccard) / (1 + c.jaccard)).toFixed(3), +c.brayCurtis.toFixed(4)]);
}
const sorensenValues = [...new Set(sim.map((s) => s[3]))].sort((a, b) => a - b);

const out = {
  rowSums, richness, div, sim, sorensenValues,
  pc1: +(100 * P.explained[0]).toFixed(2), pc2: +(100 * P.explained[1]).toFixed(2), pcTotal: +P.total.toFixed(5),
  rawPc1: +(100 * Praw.explained[0]).toFixed(2), rawPc2: +(100 * Praw.explained[1]).toFixed(2),
  scores: P.scores.map((s) => [+s[0].toFixed(4), +s[1].toFixed(4)]),
  loadings: SPECIES.map((s, j) => [s, +P.loadings[j][0].toFixed(4), +P.loadings[j][1].toFixed(4)]),
  bray: D.map((r) => r.map((v) => +v.toFixed(4))),
  closest: pairs.slice(0, 3).map((p) => [p.a, p.b, +p.d.toFixed(4)]),
  furthest: pairs.slice(-3).map((p) => [p.a, p.b, +p.d.toFixed(4)]),
  stress: +nm.stress.toFixed(5), starts: nm.starts, sameBest: nm.sameBest,
  heights: Z.map((z) => [z[0], z[1], +z[2].toFixed(4)]), coph: +coph.r.toFixed(4), groups: groups.join(''),
  shoreaShare: X.map((r) => +(100 * r[5] / 300).toFixed(1)),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pca', figure(fig1, 'Figure 1. Principal component analysis of the seven compartments, run on the Hellinger-transformed tree importance values with the Community ordination tool’s own maths. Each point is one compartment. Figures worked out by fibub from values in the paper’s text, not the paper’s own plot.'));
  md = inject(md, 'tree', figure(fig2, 'Figure 2. The same seven compartments clustered with average linkage (UPGMA) on Bray-Curtis dissimilarity. The scale shows the dissimilarity at which each pair or group joins; Lai C28 joins last.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
