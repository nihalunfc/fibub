// Figures and numbers for src/blog/discoveries/alternanthera-philoxeroides-assam-importance-value-index-recomputed.md,
// made with the maths of the Quadrat transect analyser (src/lib/sci/quadrat.ts) and the Biodiversity indices
// tool (src/lib/sci/diversity.ts).
// Run: node scripts/blog-figures/alternanthera-philoxeroides-assam-importance-value-index-recomputed.mjs
import fs from 'node:fs';
import { quadrats } from '../../src/lib/sci/quadrat.ts';
import { diversity } from '../../src/lib/sci/diversity.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/alternanthera-philoxeroides-assam-importance-value-index-recomputed.md', import.meta.url);

// Values from the text of Sharma and Das (2025), Front. Conserv. Sci. 6: 1615630 (CC BY 4.0): for each of the
// three sites, every species with its published "relative density", "relative frequency" and "relative dominance"
// percentages. The published importance value is their sum; we recompute it, so it is not listed here.
const SITES = {
  'Site 1': [['Alternanthera philoxeroides', 24.2, 56.1, 45.2], ['Ludwigia adscendens', 22.1, 39.2, 33.4], ['Monochoria vaginalis', 20.2, 22.6, 31.7], ['Digitaria ischaemum', 19.5, 34.6, 0.07], ['Lycopersicon esculentum', 18.6, 39.3, 43.3], ['Pontederia crassipes', 17.1, 43.7, 33.5], ['Xanthium orientale', 19.4, 36.7, 32.6], ['Phyla nodiflora', 18.6, 32.4, 43.6], ['Pogostemon cablin', 16.5, 30.1, 33.8], ['Chenopodium ambrosioides', 19.2, 43.5, 43.7], ['Mitragyna speciosa', 15.5, 55, 32.7]],
  'Site 2': [['Alternanthera philoxeroides', 45.6, 33.4, 12.8], ['Alternanthera sessilis', 40.5, 30.4, 9.9], ['Cardiospermum halicacabum', 34.9, 32.8, 6.8], ['Cynodon dactylon', 36, 33.9, 10.6], ['Cyperus rotundus', 34.9, 32.3, 8.9], ['Tradescantia fluminensis', 11.6, 6.5, 7.7], ['Rumex crispus', 37.8, 34.8, 6.9], ['Rottboellia exaltata', 45.5, 33.1, 5.1], ['Digitaria ischaemum', 36.9, 34.5, 6.8]],
  'Site 3': [['Alternanthera philoxeroides', 19.3, 33.9, 54.5], ['Parthenium hysterophorus', 18.9, 23.8, 44.9], ['Pluchea indica', 18.1, 22.6, 41.8], ['Xanthium strumarium', 18, 26.7, 40.5], ['Mercurialis annua', 19.1, 21.8, 43.1], ['Phyla nodiflora', 15.7, 20.7, 8.5], ['Cyperus rotundus', 17.9, 33.3, 19.8], ['Pontederia crassipes', 16.8, 32.9, 23.9], ['Chenopodium ambrosioides', 15.8, 30.7, 25.7], ['Centella asiatica', 13.2, 29.7, 9.5]],
};
const PUB = (r) => r[1] + r[2] + r[3]; // the published importance value: the three columns added up
const N = 15, AREA = 1.5 * 1.5; // 15 quadrats of 1.5 m x 1.5 m per site (paper)
const SCALE = 2; // OUR assumption: individuals = 2 x the published density percentage, so the counts are whole numbers

/** Rebuild a quadrat sheet for one site from the published percentages (our assumption, see the article). */
function rebuild(T) {
  const recs = [], counts = [];
  for (const [sp, d, f, dom] of T) {
    const k = Math.max(1, Math.round((f / 100) * N)), total = Math.round(d * SCALE);
    counts.push(total);
    for (let i = 0; i < k; i++) recs.push({ sample: `Q${i + 1}`, species: sp, a: Math.floor(total / k) + (i < total % k ? 1 : 0), b: dom });
  }
  return { recs, counts, minN: T.reduce((s, [, , f]) => s + Math.max(1, Math.round((f / 100) * N)), 0) };
}

const out = {};
for (const [site, T] of Object.entries(SITES)) {
  const sums = [1, 2, 3].map((c) => T.reduce((s, r) => s + r[c], 0));
  const pubIv = T.map(PUB), { recs, counts, minN } = rebuild(T);
  const q = quadrats(recs, AREA, N), dv = diversity(counts);
  out[site] = { T, sums, pubIvTotal: pubIv.reduce((a, b) => a + b, 0), q, dv, minN, even: 300 / T.length,
    margalefMax: (T.length - 1) / Math.log(minN), nIndiv: counts.reduce((a, b) => a + b, 0),
    maxDiff: Math.max(...T.map((r) => Math.abs(PUB(r) - (r[1] + r[2] + r[3])))) };
}

// ---- Report every number the article quotes.
for (const [site, o] of Object.entries(out)) {
  console.log(`\n== ${site}: ${o.T.length} species`);
  console.log(`   published column sums: density ${o.sums[0].toFixed(1)} %, frequency ${o.sums[1].toFixed(1)} %, dominance ${o.sums[2].toFixed(2)} %; importance values add to ${o.pubIvTotal.toFixed(1)}`);
  console.log(`   rebuilt sheet: ${o.nIndiv} plants, total density ${o.q.totalDensity.toFixed(2)} /m², total cover ${o.q.totalCover.toFixed(1)} %`);
  o.q.rows.forEach((r, i) => console.log(`   ${String(i + 1).padStart(2)} ${r.species.padEnd(28)} dens ${r.density.toFixed(2)}  freq ${(100 * r.frequency).toFixed(0)}%  cover ${r.cover.toFixed(1)}%  RD ${r.relDensity.toFixed(2)} RF ${r.relFrequency.toFixed(2)} RC ${r.relCover.toFixed(2)} IV ${r.iv.toFixed(1)}`));
  console.log(`   even share of the importance value: ${o.even.toFixed(1)} of 300; alligator weed ${o.q.rows[0].iv.toFixed(1)} (${(o.q.rows[0].iv / o.even).toFixed(2)}x)`);
  console.log(`   diversity on the rebuilt counts: H ${o.dv.H.toFixed(3)}, Simpson 1-D ${o.dv.simpson.toFixed(3)}, Pielou ${o.dv.pielou.toFixed(3)}, Margalef ${o.dv.margalef.toFixed(2)}`);
  console.log(`   at least ${o.minN} plants are needed for the published frequencies, so Margalef cannot exceed ${o.margalefMax.toFixed(2)}`);
  console.log(`   largest gap between the published importance value and the sum of its three columns: ${o.maxDiff.toFixed(3)}`);
}

// The worked example of "Check it yourself": four species of Site 3, 5 quadrats listed, 15 declared.
const PICK = ['Alternanthera philoxeroides', 'Parthenium hysterophorus', 'Cyperus rotundus', 'Phyla nodiflora'];
const sub = rebuild(SITES['Site 3'].filter((r) => PICK.includes(r[0])));
const qs = quadrats(sub.recs, AREA, N);
console.log('\n== Check it yourself: four species of Site 3 (rows as pasted)');
for (const r of sub.recs) console.log(`   ${r.sample}\t${r.species}\t${r.a}\t${r.b}`);
qs.rows.forEach((r) => console.log(`   ${r.species.padEnd(28)} dens ${r.density.toFixed(2)} /m²  freq ${(100 * r.frequency).toFixed(1)}%  cover ${r.cover.toFixed(2)}%  RD ${r.relDensity.toFixed(1)} RF ${r.relFrequency.toFixed(1)} RC ${r.relCover.toFixed(1)} IV ${r.iv.toFixed(1)}`));
console.log(`   totals: ${qs.totalDensity.toFixed(2)} /m², ${qs.totalCover.toFixed(2)} % cover, ${qs.samples} quadrats`);

// ---- Figure 1: the published importance value against the one the tool gives.
const fig1 = chart({
  title: 'Published importance value against a proper one', xLabel: 'Importance value as published', yLabel: 'Importance value out of 300 (tool)',
  series: Object.entries(out).map(([site, o]) => ({
    name: site, kind: 'dots', size: 3.4,
    x: o.q.rows.map((r) => PUB(o.T.find((t) => t[0] === r.species))), y: o.q.rows.map((r) => +r.iv.toFixed(1)),
  })),
  xDomain: [20, 130], yDomain: [0, 50], height: 290,
  desc: 'For every species at the three sites, the importance value printed in the paper against the one the Quadrat transect analyser gives out of 300 for the rebuilt quadrat sheet. The clouds are wide, so the two orders are not the same.',
});

// ---- Figure 2: how far each species sits above or below an even share of the importance value.
const fig2 = chart({
  title: 'Importance value as a multiple of an even share', xLabel: 'Rank at the site (1 = highest)', yLabel: 'Importance value ÷ even share',
  series: Object.entries(out).map(([site, o]) => ({
    name: site, kind: 'line', x: o.q.rows.map((_, i) => i + 1), y: o.q.rows.map((r) => +(r.iv / o.even).toFixed(3)),
  })),
  xDomain: [1, 11], yDomain: [0, 1.7], hlines: [{ y: 1, text: 'an even share' }], xTicks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], height: 290,
  desc: 'Each species importance value divided by an even share of 300 among the species at its site. Alligator weed reaches only about 1.3 to 1.5 times an even share, so its lead is real but small.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'ivi', figure(fig1, 'Figure 1. For every species at the three sites: the importance value printed in the paper (horizontal) against the importance value out of 300 that the Quadrat transect analyser gives for our rebuilt quadrat sheet (vertical). A species high in one is not always high in the other.'));
md = inject(md, 'even', figure(fig2, 'Figure 2. The same importance values divided by an even share of 300 (300 ÷ number of species at the site). Alligator weed, at rank 1 everywhere, reaches 1.3 to 1.5 times an even share: a clear lead, but far from a monoculture.'));
fs.writeFileSync(ART, md);
console.log('\nFigure 1', fig1.length, 'bytes; Figure 2', fig2.length, 'bytes');
