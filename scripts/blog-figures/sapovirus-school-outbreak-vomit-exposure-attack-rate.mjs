// Figures for src/blog/discoveries/sapovirus-school-outbreak-vomit-exposure-attack-rate.md, made with the maths of the
// Epi curve tool's attack-rate table (src/lib/sci/epicurve.ts), the Odds and risk ratio tool (src/lib/sci/epistat.ts)
// and the Crosstab chi-square tool (src/lib/sci/crosstab.ts).
// Run: node scripts/blog-figures/sapovirus-school-outbreak-vomit-exposure-attack-rate.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { attackRates } from '../../src/lib/sci/epicurve.ts';
import { chi2x2, wilson } from '../../src/lib/sci/epistat.ts';
import { crosstab } from '../../src/lib/sci/crosstab.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sapovirus-school-outbreak-vomit-exposure-attack-rate.md', import.meta.url);

// Inputs from Li et al. (2025), Frontiers in Public Health 13: 1572482, doi:10.3389/fpubh.2025.1572482 (CC BY 4.0):
// exposed ill / exposed total, unexposed ill / unexposed total, from the retrospective cohort on the third floor of building 2.
const EXPOSURES = [
  ['Passed near vomit', 32, 147, 10, 234],
  ['Used 3rd-floor washroom', 40, 332, 2, 49],
  ['Ate school food', 29, 210, 13, 171],
  ['Drank direct-drink water', 20, 158, 22, 223],
  ['Within 1.2 m of vomit*', 16, 50, 16, 97],
  ['Vomit cleaned by the SOP*', 6, 43, 17, 41],
];
// Cases and students by floor of building 2.
const FLOORS = [['1', 2, 100], ['2', 5, 148], ['3', 46, 168], ['4', 2, 49], ['5', 1, 51]];

const ar = attackRates(EXPOSURES.map(([name, a, n1, c, n0]) => ({ name, ateIll: a, ateWell: n1 - a, notIll: c, notWell: n0 - c })));
const chis = EXPOSURES.map(([, a, n1, c, n0]) => chi2x2(a, n1 - a, c, n0 - c).chi2);
const A = [], B = [], W = [];
for (const [f, c, n] of FLOORS) { A.push(f, f); B.push('ill', 'well'); W.push(c, n - c); }
const ft = crosstab(A, B, W); // ordinary Pearson chi-square on the counts (t.chi2), as for one row per student

// Figure 1: attack-rate ratios with 95% intervals, log scale.
const ln = Math.log;
const fig1 = chart({
  title: 'Attack-rate ratio for each exposure (log scale)', xLabel: 'Attack-rate ratio, exposed vs not', yLabel: '',
  series: ar.flatMap((r, i) => {
    const y = ar.length - i, sig = r.rrCI[0] > 1 || r.rrCI[1] < 1, col = sig ? 'var(--c-blog)' : 'var(--ink)';
    return [
      { name: '', kind: 'line', x: r.rrCI.map((v) => +ln(v).toFixed(3)), y: [y, y], colour: col, noLegend: true },
      { name: '', kind: 'dots', x: [+ln(r.rr).toFixed(3)], y: [y], size: 4.5, colour: col, noLegend: true, label: { text: `${r.name}: ${r.rr.toFixed(2)}`, at: [ln(0.1), y], dx: 4, dy: -7 } },
    ];
  }),
  xDomain: [ln(0.1), ln(14)], yDomain: [0.3, ar.length + 0.7], xTicks: [0.1, 0.25, 0.5, 1, 2, 5, 10].map(ln), xFmt: (t) => String(+Math.exp(t).toFixed(2)), yTicks: [],
  vlines: [{ x: 0, text: 'no difference' }],
  desc: `Only being near vomit (ratio ${ar[0].rr.toFixed(2)}, ${ar[0].rrCI[0].toFixed(2)} to ${ar[0].rrCI[1].toFixed(2)}) clearly raised the risk; cleaning vomit by the standard procedure lowered it (${ar[5].rr.toFixed(2)}). Food, water and the washroom intervals cross 1.`, height: 300,
});

// Figure 2: attack rate by floor with Wilson 95% intervals.
const fl = FLOORS.map(([f, c, n]) => ({ f: +f, p: c / n, ci: wilson(c, n) }));
const fig2 = chart({
  title: 'Attack rate by floor of building 2', xLabel: 'Floor', yLabel: 'Students ill (%)',
  series: [
    { name: 'Attack rate', kind: 'dots', x: fl.map((d) => d.f), y: fl.map((d) => +(d.p * 100).toFixed(1)), size: 4.5 },
    ...fl.map((d) => ({ name: '', kind: 'line', x: [d.f, d.f], y: d.ci.map((v) => +(v * 100).toFixed(1)), colour: 'var(--muted)', noLegend: true })),
  ],
  xDomain: [0.5, 5.5], yDomain: [0, 40], xTicks: [1, 2, 3, 4, 5],
  desc: `Third floor ${(fl[2].p * 100).toFixed(1)}% (Wilson interval ${(fl[2].ci[0] * 100).toFixed(1)} to ${(fl[2].ci[1] * 100).toFixed(1)}%); every other floor 2 to 4%. Chi-square ${ft.chi2.toFixed(1)} on ${ft.df} df.`, height: 260,
});

const facts = { rows: ar.map((r, i) => ({ name: r.name, arAte: (r.arAte * 100).toFixed(2), arNot: (r.arNot * 100).toFixed(2), rr: r.rr.toFixed(3), ci: r.rrCI.map((v) => v.toFixed(3)), fisher: r.p.toPrecision(3), chi2: chis[i].toFixed(2) })), floors: { chi2: ft.chi2.toFixed(2), df: ft.df, p: ft.p.toExponential(2) } };
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rr', figure(fig1, 'Figure 1. Attack-rate ratios (dots) and 95% intervals from the Epi curve tool\'s attack-rate maths, recomputed from the paper\'s counts. Coloured: intervals that do not cross 1. *Compared within the students who passed the vomit, or the classes where it was cleaned.'));
  md = inject(md, 'floor', figure(fig2, 'Figure 2. Share of students ill on each floor of the most affected building, with Wilson 95% intervals, from the paper\'s counts.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
