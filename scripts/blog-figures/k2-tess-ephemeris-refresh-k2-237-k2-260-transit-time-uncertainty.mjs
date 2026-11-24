// Figures for src/blog/discoveries/k2-tess-ephemeris-refresh-k2-237-k2-260-transit-time-uncertainty.md, made with the
// maths of the Transit planner (src/lib/astro/transits.ts: transitWindows, with its timing uncertainty
// σ = √(σT0² + (n·σP)²) for transit number n after T0).
// Run: node scripts/blog-figures/k2-tess-ephemeris-refresh-k2-237-k2-260-transit-time-uncertainty.mjs
import fs from 'node:fs';
import { transitWindows } from '../../src/lib/astro/transits.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/k2-tess-ephemeris-refresh-k2-237-k2-260-transit-time-uncertainty.md', import.meta.url);
// Ephemerides from Thygesen et al. (2023), AJ, doi:10.3847/1538-3881/acaf03 (CC BY 4.0): the discovery ("original") values
// they list, and their updated K2 + TESS values. RA/Dec of K2-237 from the NASA Exoplanet Archive. Durations: K2-237 2.93 h
// (Archive); the others 2 h (OUR assumption: the duration does not change the mid-time or its uncertainty).
const K2_237 = { ra: 253.7688479, dec: -28.7105836, durH: 2.93 };
const PL = [
  { id: 'K2-237 b, original', ...K2_237, t0: 2457684.8101, period: 2.18056, t0Err: 0.0001, pErr: 0.00002, paper3s: '3.2 h' },
  { id: 'K2-237 b, updated', ...K2_237, t0: 2457706.61618, period: 2.18053332, t0Err: 0.00003, pErr: 0.00000054, paper3s: '5 min' },
  { id: 'K2-260 b, original', ra: 78.0, dec: 16.9, durH: 2, t0: 2457820.738135, period: 2.6266657, t0Err: 0.00009, pErr: 0.0000018, paper3s: '14 min' },
  { id: 'K2-182 b, original', ra: 130.0, dec: 15.0, durH: 2, t0: 2457719.11517, period: 4.7369683, t0Err: 0.00028, pErr: 0.0000023, paper3s: '10 min' },
];
// K2-260 and K2-182 positions are rough (OUR assumption): they move the BJD-to-UTC conversion by seconds only and
// do not change the uncertainty at all.
const PLACE = { name: 'Any', lat: -30.2, lon: -70.7, elev: 0, tz: 'UTC' };
// "By 2030" read as the first transit after 2030 January 1 (OUR assumption; the paper does not say which day).
const first = (p, ms) => transitWindows(p, PLACE, ms, ms + (p.period + 0.1) * 864e5, 0, 90, 0)[0];
const J2030 = Date.UTC(2030, 0, 1);
const at2030 = PL.map((p) => { const w = first(p, J2030); return { id: p.id, epoch: w.epoch, mid: w.mid.toISOString(), sigmaMin: +w.sigmaMin.toFixed(2), threeSigma: +(3 * w.sigmaMin).toFixed(1), threeSigmaH: +(3 * w.sigmaMin / 60).toFixed(2), paper: p.paper3s }; });

// Year by year, 2017 to 2035: K2-237 b, original against updated (mid-time difference and each 3σ).
const years = Array.from({ length: 19 }, (_, i) => 2017 + i);
const rows = years.map((y) => {
  const ms = Date.UTC(y, 0, 1), a = first(PL[0], ms), b = transitWindows(PL[1], PLACE, a.mid.getTime() - 0.5 * 864e5, a.mid.getTime() + 0.5 * 864e5, 0, 90, 0)[0];
  return { y, epochOld: a.epoch, diffMin: +((a.mid - b.mid) / 6e4).toFixed(1), s3old: +(3 * a.sigmaMin).toFixed(1), s3new: +(3 * b.sigmaMin).toFixed(2) };
});
// Ages of the measurements: the new ephemeris (2024 TESS sector 12 in 2019) predicts earlier transits too; difference at T0 new.
const atNewT0 = (() => { const p = PL[0]; const n = Math.round((PL[1].t0 - p.t0) / p.period); return { n, diffMin: +(((p.t0 + n * p.period) - PL[1].t0) * 1440).toFixed(2) }; })();

const fig1 = chart({
  title: 'K2-237 b: how far the 3σ timing window spreads', xLabel: 'Year (first transit after 1 January)', yLabel: '3σ uncertainty (minutes)',
  series: [
    { name: 'Discovery ephemeris', kind: 'line', x: years, y: rows.map((r) => r.s3old) },
    { name: 'Updated with TESS', kind: 'line', x: years, y: rows.map((r) => r.s3new) },
  ],
  xDomain: [2017, 2035], yDomain: [0, 260], hlines: [{ y: 60, text: '1 hour' }],
  desc: `The 3-sigma uncertainty on K2-237 b's transit time grows from minutes to ${rows.find((r) => r.y === 2030).s3old} minutes by 2030 with the discovery ephemeris, but stays near ${rows.find((r) => r.y === 2030).s3new} minutes with the updated one.`, height: 260,
});
const fig2 = chart({
  title: 'K2-237 b: discovery prediction minus updated prediction', xLabel: 'Year (first transit after 1 January)', yLabel: 'Minutes',
  series: [
    { name: 'Difference in mid-time', kind: 'line', x: years, y: rows.map((r) => r.diffMin) },
    { name: 'Discovery 3σ window', kind: 'line', x: years, y: rows.map((r) => r.s3old), dash: '5 4', colour: 'var(--muted)' },
    { name: '', noLegend: true, kind: 'line', x: years, y: rows.map((r) => -r.s3old), dash: '5 4', colour: 'var(--muted)' },
  ],
  xDomain: [2017, 2035], yDomain: [-260, 260], hlines: [{ y: 0, text: '' }],
  desc: `With the discovery period the transit is predicted ${rows.find((r) => r.y === 2030).diffMin} minutes away from the updated prediction by 2030: well inside the old 3-sigma window, which is why the window was so wide.`, height: 260,
});

console.log(JSON.stringify({ at2030, rows, atNewT0 }, null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'sigma', figure(fig1, 'Figure 1. The 3σ uncertainty on the mid-time of K2-237 b\'s first transit of each year, from the discovery ephemeris and from the K2 + TESS update in the paper, worked out with the Transit planner\'s maths.'));
  md = inject(md, 'drift', figure(fig2, 'Figure 2. How far apart the two ephemerides put the same transit of K2-237 b (solid), against the discovery ephemeris\'s own 3σ window (dashed). The gap grows by about 2.3 seconds every orbit.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
