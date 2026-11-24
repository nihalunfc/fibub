// Figures for src/blog/discoveries/wadden-sky-quality-meter-network-light-pollution-trend-percent-per-year.md, made with
// the maths of the Light pollution calculator (src/lib/sci/skyglow.ts: sqmToMcd, skyglow, NATURAL_MCD).
// Run: node scripts/blog-figures/wadden-sky-quality-meter-network-light-pollution-trend-percent-per-year.mjs
import fs from 'node:fs';
import { sqmToMcd, skyglow, NATURAL_MCD } from '../../src/lib/sci/skyglow.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/wadden-sky-quality-meter-network-light-pollution-trend-percent-per-year.md', import.meta.url);
// From Shah et al. (2025), MNRAS 542, 272, doi:10.1093/mnras/staf1200 (CC BY): for nine of the 27 sites, the January 2020
// sky brightness (mag/arcsec²), the fitted change per year (mag/arcsec²; negative = brighter) and the paper's own
// "% per year" (negative = brighter). The seven darkest sites (start above 21.4) plus Lochem and De Held.
const SITES = [
  ['Hornhuizen', 21.770, -0.070, 0.029, -6.68], ['Vlieland-Oost', 21.627, -0.041, 0.035, -3.89], ['Sellingen', 21.611, -0.015, 0.028, -1.41],
  ['Moddergat', 21.518, -0.073, 0.045, -6.94], ['Ostland', 21.513, -0.029, 0.035, -2.67], ['Lauwersoog', 21.483, -0.027, 0.017, -2.48],
  ['Nes', 21.433, 0.081, 0.036, 7.20], ['Lochem', 20.662, -0.040, 0.017, -3.78], ['De Held', 19.695, -0.223, 0.030, -22.83],
].map(([name, m0, dm, se, pct]) => ({ name, m0, dm, se, pct }));
// Luminance change in one year: L(m0 + dm) / L(m0) − 1, reported with the paper's sign (negative = brighter).
const toolPct = (s) => -100 * (sqmToMcd(s.m0 + s.dm) / sqmToMcd(s.m0) - 1);
const rows = SITES.map((s) => {
  const g = skyglow(s.m0), r = sqmToMcd(s.m0 + s.dm) / sqmToMcd(s.m0) - 1;
  // Growth of the artificial part alone, if the natural sky stays at NATURAL_MCD (OUR assumption): ΔL / (L − L_nat).
  const artGrowth = g.mcd > NATURAL_MCD ? (100 * r * g.mcd) / (g.mcd - NATURAL_MCD) : NaN;
  return { name: s.name, m0: s.m0, dm: s.dm, paper: s.pct, tool: +toolPct(s).toFixed(2), diff: +(toolPct(s) - s.pct).toFixed(2),
    mcd: +g.mcd.toFixed(4), nsu: +g.nsu.toFixed(3), artPct: Math.round(100 * g.artificial), bortle: g.bortle.n, artGrowth: +artGrowth.toFixed(1),
    after3: +(s.m0 + 3 * s.dm).toFixed(3), art3: Math.round(100 * skyglow(s.m0 + 3 * s.dm).artificial) };
});
// Averages over the seven darkest sites, to compare with the abstract's 2.78 to 6.68 %.
const dark = SITES.slice(0, 7), wsum = dark.reduce((a, s) => a + 1 / s.se ** 2, 0);
const wmean = dark.reduce((a, s) => a + s.dm / s.se ** 2, 0) / wsum, mean = dark.reduce((a, s) => a + s.dm, 0) / 7;
const pctOf = (dm) => +(100 * (sqmToMcd(dm) / sqmToMcd(0) - 1)).toFixed(2); // brightening, % per year
const out = { need196: 0, rows, maxAbsDiff: Math.max(...rows.map((r) => Math.abs(r.diff))), wmeanDm: +wmean.toFixed(4), wmeanPct: pctOf(wmean), meanDm: +mean.toFixed(4), meanPct: pctOf(mean),
  hornhuizen: { mcd0: +sqmToMcd(21.77).toFixed(4), ratio1y: +(sqmToMcd(21.70) / sqmToMcd(21.77)).toFixed(4), art0: Math.round(100 * skyglow(21.77).artificial), art3: Math.round(100 * skyglow(21.56).artificial) } };

// Figure 1: the paper's % per year against the tool's luminance change, with the one-to-one line.
const fig1 = chart({
  title: 'Paper\'s % per year against the luminance change', xLabel: 'Tool: change in luminance per year (%; negative = brighter)', yLabel: 'Paper (% per year)',
  series: [
    { name: 'One to one', kind: 'line', x: [-25, 10], y: [-25, 10], colour: 'var(--muted)', dash: '4 4' },
    { name: 'Sites', kind: 'dots', x: rows.map((r) => r.tool), y: rows.map((r) => r.paper), size: 4 },
  ],
  xDomain: [-25, 10], yDomain: [-25, 10],
  desc: `For nine sites, the paper's percent per year matches the change in luminance worked out from its magnitude slope, within ${out.maxAbsDiff.toFixed(2)} percentage points.`, height: 270,
});
// Figure 2: how fast the artificial light alone must grow to give a 5 % per year brightening of the whole sky.
const need = (m) => { const L = sqmToMcd(m); return (5 * L) / (L - NATURAL_MCD); };
const ms = Array.from({ length: 61 }, (_, i) => 19.6 + i * 0.035);
const fig2 = chart({
  title: 'Artificial light growth behind a 5 % yearly brightening', xLabel: 'Sky brightness at the start (mag/arcsec²)', yLabel: 'Artificial light growth (% per year)',
  series: [
    { name: 'Needed growth of the artificial part', kind: 'line', x: ms, y: ms.map((m) => { const L = sqmToMcd(m); return +(5 * L / (L - NATURAL_MCD)).toFixed(2); }) },
    { name: 'Dark sites (start)', kind: 'dots', x: rows.slice(0, 7).map((r) => r.m0), y: rows.slice(0, 7).map((r) => +(5 * r.mcd / (r.mcd - NATURAL_MCD)).toFixed(2)), size: 3.5 },
  ],
  xDomain: [19.6, 21.7], yDomain: [0, 30], hlines: [{ y: 5, text: '5 %: the total' }],
  desc: `If the natural sky stays at 0.174 mcd/m2, a 5 percent yearly rise of the whole sky needs the artificial part to grow by about ${need(19.6).toFixed(1)} percent a year at 19.6 mag/arcsec2 but by ${need(21.7).toFixed(1)} percent a year at 21.7.`, height: 260,
});
out.need196 = +need(19.6).toFixed(2); out.need217 = +need(21.7).toFixed(2);
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pct', figure(fig1, 'Figure 1. For nine of the network\'s sites, the paper\'s "% per year" against the yearly change in luminance that the Light pollution calculator\'s conversion gives from the paper\'s own magnitude slope. The dashed line is perfect agreement.'));
  md = inject(md, 'art', figure(fig2, 'Figure 2. How fast the artificial light alone must grow for the whole sky to brighten by 5 % a year, if the natural sky stays at 0.174 mcd/m² (our assumption). Dots: the seven darkest sites\' January 2020 readings.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
