// Figures and numbers for src/blog/discoveries/published-nmr-peak-lists-residual-solvent-overlap.md, made with the
// maths of the NMR impurities checker (src/lib/sci/nmr.ts: parsePeaks, signals, match).
// Run: node scripts/blog-figures/published-nmr-peak-lists-residual-solvent-overlap.mjs
import fs from 'node:fs';
import { parsePeaks, signals, match } from '../../src/lib/sci/nmr.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/published-nmr-peak-lists-residual-solvent-overlap.md', import.meta.url);

// The two complete 1H lists in the experimental section of Coste et al. (2026), Front. Chem. 14: 1804888
// (doi:10.3389/fchem.2026.1804888, CC BY 4.0), both in DMSO-d6 at 400 MHz. Quoted as facts, not as a table.
const LISTS = {
  'BA-01': '7.78 (d, J = 2.0 Hz, 1H), 7.55–7.42 (m, 3H), 7.28 (dd, J = 8.7, 7.3 Hz, 2H), 7.09–6.98 (m, 1H), 6.93–6.84 (m, 2H), 5.30 (t, J = 5.7 Hz, 1H), 3.12 (q, J = 6.6 Hz, 2H), 2.45 (s, 3H), 1.49–1.33 (m, 2H), 1.21–1.05 (m, 2H), 0.79 (t, J = 7.3 Hz, 3H)',
  'BA-13': '9.38 (s, 1H), 7.72 (d, J = 2.0 Hz, 1H), 7.51–7.41 (m, 3H), 7.28 (dd, J = 8.7, 7.3 Hz, 2H), 7.08–7.00 (m, 1H), 6.94–6.83 (m, 2H), 5.28 (t, J = 5.8 Hz, 1H), 3.12 (q, J = 6.6 Hz, 2H), 1.47–1.36 (m, 2H), 1.20–1.09 (m, 2H), 0.79 (t, J = 7.3 Hz, 3H)',
};
// The same spectrum as it would be before the solvent peaks are left out: BA-01's values plus residual DMSO (2.50),
// water in DMSO-d6 (3.33) and a trace of ethyl acetate (4.03, 1.99, 1.17). OUR OWN example, not the paper's data.
const SIM = '7.78, 7.55, 7.42, 7.28, 7.09, 6.98, 6.93, 6.84, 5.30, 4.03, 3.33, 3.12, 2.50, 2.45, 1.99, 1.49, 1.33, 1.21, 1.17, 1.05, 0.79';
const SOLVENT = 'DMSO', TOL = 0.03;

const table = signals(SOLVENT, 'h');
const headline = (peaks, tol) => {
  const m = match(peaks, SOLVENT, 'h', tol);
  const matched = m.perPeak.filter((p) => p.hits.length).length;
  const strong = m.byImp.filter((x) => !x.solvent && x.found === x.total && x.total > 1).map((x) => x.name);
  const top = m.byImp.filter((x) => !x.solvent).slice(0, 3).map((x) => x.name);
  return { matched, of: peaks.length, strong, top, byImp: m.byImp.map((x) => `${x.name} ${x.found}/${x.total}`), perPeak: m.perPeak.filter((p) => p.hits.length).map((p) => `${p.peak} → ${p.hits.map((h) => `${h.name} ${h.delta}`).join(' | ')}`), clean: m.perPeak.filter((p) => !p.hits.length).map((p) => p.peak) };
};

const parsed = Object.fromEntries(Object.entries(LISTS).map(([k, v]) => [k, parsePeaks(v)]));
const out = { parsed, tableSignals: table.length, lists: {}, sim: {}, tolerance: [] };
for (const [k, p] of Object.entries(parsed)) out.lists[k] = headline(p, TOL);
out.sim = headline(parsePeaks(SIM), TOL);

// How many of a compound's own peaks catch an impurity signal by chance: the fraction of the 0-10 ppm window
// covered by the +-tol bands around the 72 known signals, times the number of peaks.
const coverage = (tol) => {
  const bands = table.map((s) => [Math.max(0, s.delta - tol), Math.min(10, s.delta + tol)]).filter(([a, b]) => b > a).sort((x, y) => x[0] - y[0]);
  let total = 0, [a, b] = bands[0];
  for (const [x, y] of bands.slice(1)) { if (x > b) { total += b - a; [a, b] = [x, y]; } else b = Math.max(b, y); }
  return (total + b - a) / 10;
};
const TOLS = [0.01, 0.02, 0.03, 0.05, 0.08, 0.1, 0.15, 0.2];
for (const t of TOLS) {
  const h = headline(parsed['BA-01'], t);
  out.tolerance.push({ tol: t, matched: h.matched, impurities: h.byImp.length, coverage: +coverage(t).toFixed(3), expected: +(coverage(t) * parsed['BA-01'].length).toFixed(1) });
}

const fig1 = chart({
  title: 'A published peak list against the impurity table', xLabel: 'Chemical shift δ (ppm)', yLabel: '',
  series: [
    { name: 'BA-01, as published', kind: 'dots', x: parsed['BA-01'], y: parsed['BA-01'].map(() => 2), size: 4 },
    { name: 'BA-13, as published', kind: 'dots', x: parsed['BA-13'], y: parsed['BA-13'].map(() => 1.6), size: 4, colour: 'var(--c-tools)' },
    { name: 'Known signals in DMSO-d₆', kind: 'dots', x: table.map((s) => s.delta), y: table.map(() => 1), size: 2.6, colour: 'var(--muted)' },
  ],
  xDomain: [-0.3, 10], yDomain: [0.6, 2.4], yTicks: [],
  vlines: [{ x: 2.5, text: 'DMSO 2.50' }, { x: 3.35, text: 'water 3.35', dy: 16 }],
  desc: 'The two published proton peak lists plotted against the 72 known residual-solvent and impurity positions in DMSO-d6. Neither list reports a peak at the residual solvent or water positions.',
  height: 250,
});
const fig2 = chart({
  title: 'Tolerance decides how many "impurities" you find', xLabel: 'Tolerance ± ppm', yLabel: 'Peaks with at least one match (of 16)',
  series: [
    { name: 'BA-01: matches found', kind: 'line', x: TOLS, y: out.tolerance.map((r) => r.matched) },
    { name: 'Expected by chance', kind: 'line', x: TOLS, y: out.tolerance.map((r) => r.expected), dash: '5 4', colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 0.2], yDomain: [0, 17],
  vlines: [{ x: 0.03, text: "the tool's default" }],
  desc: 'Number of the 16 published values that match some known signal, against the matching tolerance, with the number expected by chance from how much of the 0 to 10 ppm window the impurity table covers.',
  height: 280,
});

console.log(JSON.stringify(out, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'map', figure(fig1, 'Figure 1. The two published proton peak lists (top two rows, limits of each multiplet plotted separately) against all 72 residual-solvent and impurity positions the checker knows for DMSO-d₆ (bottom row). The dashed lines mark the residual solvent and water, which neither list reports.'));
  md = inject(md, 'tolerance', figure(fig2, 'Figure 2. How many of BA-01\'s 16 published values match something in the impurity table, against the tolerance, with the number chance alone would give. Above about ±0.08 ppm a match stops meaning anything.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
