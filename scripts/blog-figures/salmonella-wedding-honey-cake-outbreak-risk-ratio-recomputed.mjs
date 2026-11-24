// Figures for src/blog/discoveries/salmonella-wedding-honey-cake-outbreak-risk-ratio-recomputed.md, made with the maths
// of the Odds and risk ratio tool (src/lib/sci/oddsratio.ts: one 2 × 2 table, and Mantel-Haenszel strata).
// Run: node scripts/blog-figures/salmonella-wedding-honey-cake-outbreak-risk-ratio-recomputed.mjs
import fs from 'node:fs';
import { single, stratified } from '../../src/lib/sci/oddsratio.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/salmonella-wedding-honey-cake-outbreak-risk-ratio-recomputed.md', import.meta.url);

// From the paper's text: Gazezova et al. (2024), BMC Infect. Dis. 24: 1464, doi:10.1186/s12879-024-10382-4 (CC BY 4.0).
// 138 people, 66 ill. 89 % of the ill and 13 % of the well ate honey cake; 45 % and 11 % ate leftovers.
// Adjusted RR for honey cake 7.8 (95 % CI 3.5 to 20.1) in the abstract.
const ILL = 66, WELL = 138 - 66;
// Rebuild whole-number counts from rounded percentages: every count whose percentage rounds to the stated one.
const fits = (pct, n) => Array.from({ length: n + 1 }, (_, k) => k).filter((k) => Math.round((100 * k) / n) === pct);
const cake = { ill: fits(89, ILL), well: fits(13, WELL) }, left = { ill: fits(45, ILL), well: fits(11, WELL) };
const tab = (a, b) => ({ a, b, c: ILL - a, d: WELL - b }); // a: ate and ill, b: ate and well
const T1 = tab(cake.ill[0], cake.well[0]), T2 = tab(left.ill[0], left.well[0]);
const r1 = single(T1.a, T1.b, T1.c, T1.d), r2 = single(T2.a, T2.b, T2.c, T2.d);
const pick = (r) => ({ r1: +(100 * r.r1).toFixed(1), r0: +(100 * r.r0).toFixed(1), rr: +r.rr.toFixed(2), rrCI: r.rrCI.map((v) => +v.toFixed(2)), or: +r.or.toFixed(1), orCI: r.orCI.map((v) => +v.toFixed(1)), cmle: +r.cmle.toFixed(1), exactCI: r.exactCI.map((v) => +v.toFixed(1)), rd: +(100 * r.rd).toFixed(1), fisherP: r.fisher.p.toExponential(1) });

// A made-up split of the leftover eaters by whether they also ate cake (OUR ASSUMPTION, chosen to fit the paper's totals:
// 38 leftover eaters, 30 of them ill; 68 cake eaters, 59 ill), to show how a crude risk ratio can vanish within strata.
const S = [{ name: 'Ate honey cake', a: 30, b: 4, c: 29, d: 5 }, { name: 'No honey cake', a: 0, b: 4, c: 7, d: 59 }];
const totalsOk = S[0].a + S[1].a === T2.a && S[0].b + S[1].b === T2.b && S[0].a + S[0].c === T1.a && S[0].b + S[0].d === T1.b && S[1].a + S[1].c === T1.c && S[1].b + S[1].d === T1.d;
const mh = stratified(S);
const mhOut = { rr: +mh.rr.toFixed(2), rrCI: mh.rrCI.map((v) => +v.toFixed(2)), crude: +mh.crude.rr.toFixed(2), bdP: +mh.bdP.toFixed(2), within: S.map((s) => +(100 * s.a / (s.a + s.b)).toFixed(1) + ' vs ' + +(100 * s.c / (s.c + s.d)).toFixed(1)) };

// Sensitivity: the crude cake RR and its interval if between 5 and 15 well guests had eaten cake (b), with a fixed at 59.
const B = Array.from({ length: 11 }, (_, i) => 5 + i);
const sens = B.map((b) => { const t = tab(T1.a, b), r = single(t.a, t.b, t.c, t.d); return { b, rr: r.rr, lo: r.rrCI[0], hi: r.rrCI[1] }; });

const L = (v) => +Math.log10(v).toFixed(4);
const rows = [
  { name: 'Cake', est: r1.rr, lo: r1.rrCI[0], hi: r1.rrCI[1] },
  { name: 'Cake adj. (paper)', est: 7.8, lo: 3.5, hi: 20.1 },
  { name: 'Leftovers', est: r2.rr, lo: r2.rrCI[0], hi: r2.rrCI[1] },
  { name: 'Leftovers in strata', est: mh.rr, lo: mh.rrCI[0], hi: mh.rrCI[1] },
];
const C = ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'];
const fig1 = chart({
  title: 'Risk ratios with 95 % intervals (log scale)', xLabel: 'Risk ratio', yLabel: '',
  series: rows.flatMap((r, k) => [
    { name: r.name, kind: 'line', x: [L(r.lo), L(r.hi)], y: [4 - k, 4 - k], colour: C[k] },
    { name: '', noLegend: true, kind: 'dots', x: [L(r.est)], y: [4 - k], size: 5, colour: C[k] },
  ]),
  xDomain: [-0.3, 1.5], yDomain: [0.4, 4.6], yTicks: [], xTicks: [-0.301, 0, 0.301, 0.699, 1, 1.301], xFmt: (t) => String(+(10 ** t).toPrecision(2)),
  vlines: [{ x: 0, text: 'no effect' }],
  desc: `Honey cake: crude risk ratio ${r1.rr.toFixed(2)} (${r1.rrCI.map((v) => v.toFixed(2)).join(' to ')}) from counts rebuilt from the paper's percentages, beside the paper's adjusted 7.8 (3.5 to 20.1). Leftovers: crude ${r2.rr.toFixed(2)}, but ${mh.rr.toFixed(2)} within cake strata in a made-up split that fits the totals.`, height: 250,
});
const fig2 = chart({
  title: 'Honey cake risk ratio if the count of well cake eaters were different', xLabel: 'Well guests who ate honey cake', yLabel: 'Risk ratio',
  series: [
    { name: 'Risk ratio', kind: 'line', x: B, y: sens.map((s) => +s.rr.toFixed(3)) },
    { name: '95 % interval', kind: 'line', x: B, y: sens.map((s) => +s.lo.toFixed(3)), colour: 'var(--c-tools)', dash: '5 3' },
    { name: '', noLegend: true, kind: 'line', x: B, y: sens.map((s) => +s.hi.toFixed(3)), colour: 'var(--c-tools)', dash: '5 3' },
  ],
  xDomain: [5, 15], yDomain: [0, 25], vlines: [{ x: T1.b, text: `${T1.b} (13 %)` }],
  desc: `With 59 ill cake eaters fixed, the crude risk ratio falls from ${sens[0].rr.toFixed(1)} to ${sens[10].rr.toFixed(1)} as the number of well cake eaters goes from 5 to 15; the lower end of its interval stays above ${Math.min(...sens.map((s) => s.lo)).toFixed(1)}.`, height: 260,
});

console.log(JSON.stringify({ cake, left, T1, T2, cakeR: pick(r1), leftR: pick(r2), totalsOk, mhOut, attack: +(100 * ILL / 138).toFixed(1), sens: sens.filter((s) => [5, 9, 10, 15].includes(s.b)).map((s) => ({ b: s.b, rr: +s.rr.toFixed(2), lo: +s.lo.toFixed(2), hi: +s.hi.toFixed(2) })) }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'forest', figure(fig1, 'Figure 1. Risk ratios worked out by the Odds and risk ratio tool\'s maths from counts rebuilt from the paper\'s percentages, beside the paper\'s adjusted honey cake estimate. The last row uses a made-up split of the leftover eaters (our assumption) to show confounding; it is not the paper\'s data.'));
  md = inject(md, 'sens', figure(fig2, 'Figure 2. How the crude honey cake risk ratio and its 95 % interval would move if the number of well guests who ate cake were 5 to 15 instead of the 9 rebuilt from the paper. The effect stays large either way.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
