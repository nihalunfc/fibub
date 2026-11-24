// Figures for src/blog/discoveries/peer-led-hiv-sti-testing-two-by-two-cramers-v-fisher-exact.md,
// made with the maths of the Cross-tab and chi-square tool (src/lib/sci/crosstab.ts).
// Run: node scripts/blog-figures/peer-led-hiv-sti-testing-two-by-two-cramers-v-fisher-exact.mjs
import fs from 'node:fs';
import { crosstab } from '../../src/lib/sci/crosstab.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/peer-led-hiv-sti-testing-two-by-two-cramers-v-fisher-exact.md', import.meta.url);

// Counts from the paper: Lee et al. (2023), JMIR Formative Research 7: e45871 (CC BY).
// STI testing 19/25 peer group vs 7/19 control; HIV testing 19/25 vs 11/19; motivated to use PrEP 21/23 vs 10/17.
// The tool works from one row per person, so each 2 x 2 table is expanded to cases.
const tab = (M, rows = ['Peer group', 'Control'], cols = ['Yes', 'No']) => {
  const a = [], b = [];
  M.forEach((r, i) => r.forEach((n, j) => { for (let k = 0; k < n; k++) { a.push(rows[i]); b.push(cols[j]); } }));
  return crosstab(a, b, undefined, { rows, cols });
};
const OUT = {
  sti: tab([[19, 6], [7, 12]]),
  hiv: tab([[19, 6], [11, 8]]),
  prep: tab([[21, 2], [10, 7]]),
};

// Figure 1: how the STI result holds up if the people lost from the analysis are put back in.
// 25 of 30 peer-group men and 19 of 20 control men were analysed. x = how many of the 5 unseen
// peer-group men are counted as tested; the 1 unseen control man is always counted as not tested.
const XS = [0, 1, 2, 3, 4, 5];
const itt = XS.map((x) => tab([[19 + x, 11 - x], [7, 13]]));
const lg = (p) => Math.log10(p);
const fig1 = chart({
  title: 'STI testing: does the result survive the missing men?', xLabel: 'Unseen peer-group men counted as tested (of 5)', yLabel: 'p-value',
  series: [
    { name: 'Pearson χ²', kind: 'line', x: XS, y: itt.map((t) => lg(t.p)) },
    { name: "Fisher's exact", kind: 'line', x: XS, y: itt.map((t) => lg(t.fisher.p)) },
    { name: 'Yates-corrected', kind: 'line', x: XS, y: itt.map((t) => lg(t.yates.p)), dash: '4 3' },
  ],
  xDomain: [0, 5], yDomain: [-3.2, -0.6], xTicks: XS, yTicks: [-3, -2.3010, -2, -1.3010, -1], yFmt: (v) => String(+(10 ** v).toPrecision(2)),
  hlines: [{ y: lg(0.05), text: 'p = 0.05' }],
  desc: 'Three p-values for the STI testing table as the five peer-group men missing from the analysis are added back, from none counted as tested to all five. Even the harshest case stays at or below 0.05 for the Pearson test.',
  height: 280,
});

// Figure 2: for the PrEP table's margins (23 and 17 people, 31 motivated and 9 not), the exact and the
// approximate two-sided p-value for every table that could have come out. One expected count is 3.8,
// below the usual 5, so the chi-square approximation is optimistic.
const AS = Array.from({ length: 10 }, (_, i) => 14 + i);
const grid = AS.map((a) => tab([[a, 23 - a], [31 - a, 17 - (31 - a)]]));
const fig2 = chart({
  title: 'The same margins, every possible table', xLabel: 'Peer-group men motivated to use PrEP (of 23)', yLabel: 'Two-sided p-value',
  series: [
    { name: 'Pearson χ²', kind: 'line', x: AS, y: grid.map((t) => lg(t.p)) },
    { name: "Fisher's exact", kind: 'line', x: AS, y: grid.map((t) => lg(t.fisher.p)) },
  ],
  xDomain: [14, 23], yDomain: [-4.4, 0.15], xTicks: AS, yTicks: [-4, -3, -2, -1.3010, -1, 0], yFmt: (v) => String(+(10 ** v).toPrecision(2)),
  hlines: [{ y: lg(0.05), text: 'p = 0.05' }],
  vlines: [{ x: 21, text: 'observed', left: true }],
  desc: 'Pearson and Fisher two-sided p-values for every 2 by 2 table with the PrEP outcome margins. Fisher is always the larger (more cautious) of the two, and the observed table at 21 gives 0.015 against 0.023.',
  height: 280,
});

const r = (t) => ({ chi2: +t.chi2.toFixed(3), p: +t.p.toPrecision(3), g2: +t.g2.toFixed(3), V: +t.cramerV.toFixed(4), yates: +t.yates.chi2.toFixed(3), pYates: +t.yates.p.toPrecision(3), fisher: +t.fisher.p.toPrecision(3), or: +t.fisher.oddsRatio.toFixed(3), minE: +t.minExpected.toFixed(3), small: t.smallCells, adj: +t.adjResid[0][0].toFixed(3), rowPct: t.rowPct.map((x) => +x[0].toFixed(1)) });
console.log(JSON.stringify({ sti: r(OUT.sti), hiv: r(OUT.hiv), prep: r(OUT.prep), itt: itt.map((t, i) => ({ x: XS[i], chi2: +t.chi2.toFixed(3), p: +t.p.toPrecision(3), fisher: +t.fisher.p.toPrecision(3), V: +t.cramerV.toFixed(4) })) }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'itt', figure(fig1, 'Figure 1. The STI testing comparison re-tested as the five peer-group men who dropped out of the analysis are added back, left to right, as men who were tested. Made with the Cross-tab and chi-square tool’s maths from the paper’s counts.'));
  md = inject(md, 'exact', figure(fig2, 'Figure 2. For the PrEP outcome’s row and column totals, the Pearson and Fisher two-sided p-values of every table that those totals allow. The dashed line marks the observed table.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
