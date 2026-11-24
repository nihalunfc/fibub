// Figures for src/blog/discoveries/largemouth-bass-aquaponic-stocking-density-biomass-fcr.md, made with the maths of
// the Stocking density calculator (src/lib/sci/aquastock.ts: volume, biomass, maxFish, sgr, fcr, daysTo, project).
// Run: node scripts/blog-figures/largemouth-bass-aquaponic-stocking-density-biomass-fcr.mjs
import fs from 'node:fs';
import { volume, biomass, maxFish, fcr, sgr, daysTo, project } from '../../src/lib/sci/aquastock.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/largemouth-bass-aquaponic-stocking-density-biomass-fcr.md', import.meta.url);

// Inputs from the paper: Birolo et al. (2025), Fishes 10(11): 552, doi:10.3390/fishes10110552 (CC BY 4.0).
// 500 L fish tanks; 184 bass of 109 +/- 28 g; nominal densities 3.1, 4.1 and 6.2 kg/m3; 176-day trial;
// daily weight gain 0.69, 0.61 and 0.50 g/day; SGR 0.43, 0.39 and 0.34 %/day; feed intake 0.72 and 0.60-0.61 % of
// biomass per day; FCR 1.43-1.46 and 1.76; survival 73.9 % at day 176 (48 fish lost of 184).
const V = volume({ kind: 'volume', V: 0.5 });
const W0 = 109, DAYS = 176, SURV = 0.739;
// Our assumption: losses spread evenly through the trial, as a constant monthly rate.
const LOSS_PCT_MONTH = 100 * (1 - Math.pow(SURV, 30 / DAYS));
const T = [
  { id: 'D3', dens: 3.1, dwg: 0.69, sgrPaper: 0.43, feedPct: 0.72, fcrPaper: 1.445, counted: '15 to 17' },
  { id: 'D4', dens: 4.1, dwg: 0.61, sgrPaper: 0.39, feedPct: 0.605, fcrPaper: 1.445, counted: '16 to 20' },
  { id: 'D6', dens: 6.2, dwg: 0.50, sgrPaper: 0.34, feedPct: 0.605, fcrPaper: 1.76, counted: '24 to 29' },
];

const res = T.map((t) => {
  const w1 = W0 + t.dwg * DAYS;                       // final mean weight implied by the paper's daily gain
  const s = sgr(W0, w1, DAYS);                        // SGR the tool gets from it
  const n0 = maxFish(t.dens, V, W0);                  // fish the nominal density allows at 109 g in 500 L
  const rows = project({ count: n0, w0: W0, sgr: s, lossPct: LOSS_PCT_MONTH, feedPct: t.feedPct, V, days: 400, step: 1 });
  const end = rows[DAYS];
  const deadKg = (n0 - end.n) * ((W0 + end.w) / 2) / 1000;  // our assumption: deaths at the mid-trial mean weight
  return {
    ...t, w1: +w1.toFixed(1), sgr: +s.toFixed(3), n0,
    densFromCount: [3.27, 3.71], // filled below
    start: +(biomass(n0, W0) / V).toFixed(2),
    endKg: +end.kg.toFixed(2), endDens: +end.density.toFixed(2), endN: +end.n.toFixed(1),
    feed: +end.feedCum.toFixed(2),
    fcrLive: +fcr(end.feedCum, biomass(n0, W0), end.kg).toFixed(2),
    fcrAll: +fcr(end.feedCum, biomass(n0, W0), end.kg, deadKg).toFixed(2),
    deadKg: +deadKg.toFixed(2),
    to400: Math.round(daysTo(W0, 400, s)),
    rows,
  };
});
res.forEach((r) => { const lo = r.id === 'D3' ? 15 : r.id === 'D4' ? 16 : 24, hi = r.id === 'D3' ? 17 : r.id === 'D4' ? 20 : 29;
  r.densFromCount = [+(biomass(lo, W0) / V).toFixed(2), +(biomass(hi, W0) / V).toFixed(2)]; });

const DD = Array.from({ length: 45 }, (_, i) => i * 4);
const fig1 = chart({
  title: 'Biomass density through the 176-day trial', xLabel: 'Day of the trial', yLabel: 'Density (kg m⁻³)',
  series: res.map((r) => ({ name: `${r.id} (${r.dens} kg m⁻³ at stocking)`, kind: 'line', x: DD.filter((d) => d <= DAYS), y: DD.filter((d) => d <= DAYS).map((d) => +r.rows[d].density.toFixed(3)) })),
  xDomain: [0, 180], yDomain: [0, 9], hlines: [{ y: 6.2, text: 'D6 at stocking' }],
  desc: 'Biomass density in each 500 L tank through the trial, worked out from the paper’s growth rates and survival. The lowest treatment ends near 4.8 kg per cubic metre, the middle one near 6.1 and the highest near 8.2, so the lightly stocked tanks finish below the density the heavy treatment started at.',
  height: 290,
});
const fig2 = chart({
  title: 'Days to a 400 g market fish at these growth rates', xLabel: 'Days from stocking', yLabel: 'Mean weight (g)',
  series: [
    ...res.map((r) => ({ name: `${r.id}, SGR ${r.sgr} %/day`, kind: 'line', x: DD, y: DD.map((d) => +r.rows[d].w.toFixed(1)) })),
    { name: '', noLegend: true, kind: 'line', dash: '5 4', x: [0, 400], y: [400, 400], colour: 'var(--muted)' },
  ],
  xDomain: [0, 400], yDomain: [100, 460],
  desc: 'Mean weight against time for the three stocking densities, from the specific growth rates the paper reports. The 400 g market size arrives at day 306 for the lightest stocking, 334 for the middle one and 387 for the heaviest.',
  height: 290,
});

console.log('loss rate used (% per month):', LOSS_PCT_MONTH.toFixed(2));
console.log(JSON.stringify(res.map(({ rows, ...r }) => r), null, 1));
console.log('fish for each nominal density at 109 g in 500 L:', T.map((t) => (t.dens * 0.5 * 1000 / W0).toFixed(1)).join(', '));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'dens', figure(fig1, 'Figure 1. Biomass density in each 500 L tank, from the Stocking density calculator’s projection using the paper’s own growth rate, feeding rate and survival. Our assumption: losses spread evenly at 5.02 % a month. Not a figure from the paper.'));
  md = inject(md, 'grow', figure(fig2, 'Figure 2. The same projection run on to 400 days, with the 400 g market size marked. The gap between the treatments is 81 days of extra growing for the most crowded tanks.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
