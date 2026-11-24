// Figures for src/blog/discoveries/c-band-sar-constellation-sun-synchronous-orbit-revisit-canada.md, made with
// the maths of the Satellite tracker (src/lib/sci/satorbit.ts: fromHeights, orbitInfo, ssoInclination,
// groundTrack, subpoint, footprint).
// Run: node scripts/blog-figures/c-band-sar-constellation-sun-synchronous-orbit-revisit-canada.mjs
import fs from 'node:fs';
import { fromHeights, orbitInfo, ssoInclination, groundTrack, footprint } from '../../src/lib/sci/satorbit.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/c-band-sar-constellation-sun-synchronous-orbit-revisit-canada.md', import.meta.url);

// From the paper: Zakharov et al. (2025), Remote Sensing 17(22): 3761, doi:10.3390/rs17223761 (CC BY 4.0).
// The coverage and revisit simulations use the Sentinel-1 reference orbit: near-circular dawn-dusk
// sun-synchronous, 693 km, 98.18°, period 98.6 min, 12-day ground-track repeat; a second satellite 180° away
// in the same plane, "separated by 49.3 min"; a 500 km imaging swath and a 600 km accessible swath.
const H = 693, INC = 98.18, PAPER = { periodMin: 98.6, inc: 98.18, repeatDays: 12, phaseMin: 49.3, swath: 500, access: 600 };
const EPOCH = Date.UTC(2026, 0, 1, 0, 0, 0);

const el = fromHeights('Reference SSO', H, H, INC, 0, 0, 0, EPOCH);
const info = orbitInfo(el);
const sso = ssoInclination(H, H);

// Ground-track repeat: how many revolutions fit in 12 mean solar days, and the period 175 of them would need.
const revsIn12 = (12 * 1440) / info.periodMin;
const periodFor175 = (12 * 1440) / 175;
// The height that gives exactly 175 revolutions in 12 days, by bisection on the mean period.
let lo = 650, hi = 750;
for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; orbitInfo(fromHeights('x', m, m, INC, 0, 0, 0, EPOCH)).periodMin < periodFor175 ? (lo = m) : (hi = m); }
const h175 = (lo + hi) / 2;

// Revisit: how often the ground track comes within half the accessible swath of a target latitude.
const R_E = 6371, D2R = Math.PI / 180;
const gcDist = (lat1, lon1, lat2, lon2) => {
  const dLat = (lat2 - lat1) * D2R, dLon = (lon2 - lon1) * D2R;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.sin(dLon / 2) ** 2;
  return 2 * R_E * Math.asin(Math.sqrt(a));
};
// One day of track, sampled every 10 s, then count separate approaches closer than `reach` km.
const DAY = 864e5, pts = groundTrack(el, EPOCH, EPOCH + DAY, 8640);
function accesses(lat, lon, reach) {
  let n = 0, inside = false;
  for (const p of pts) {
    const near = gcDist(lat, lon, p.lat, p.lon) <= reach;
    if (near && !inside) n++;
    inside = near;
  }
  return n;
}
const LATS = [45, 50, 55, 60, 65, 70, 75, 80];
const LON = -95; // a longitude through central Canada; the result is averaged over longitude below.
const reach = PAPER.access / 2;
const rows = LATS.map((lat) => {
  // Average over 12 longitudes, because a single point can sit between two tracks.
  const ns = Array.from({ length: 12 }, (_, k) => accesses(lat, LON + k * 30, reach));
  const mean = ns.reduce((a, b) => a + b, 0) / ns.length;
  const wide = Array.from({ length: 12 }, (_, k) => accesses(lat, LON + k * 30, PAPER.access)).reduce((a, b) => a + b, 0) / 12;
  return { lat, perDay: +mean.toFixed(2), revisitOne: +(24 / mean).toFixed(1), revisitThree: +(24 / (3 * mean)).toFixed(1), revisitFour: +(24 / (4 * mean)).toFixed(1), revisitThreeWide: +(24 / (3 * wide)).toFixed(1) };
});

const facts = {
  periodMin: +info.periodMin.toFixed(2),
  halfPeriodMin: +(info.periodMin / 2).toFixed(2),
  ssoInc: +sso.toFixed(2),
  raanRate: +info.raanRate.toFixed(4),
  speed: +info.vPerigee.toFixed(3),
  ecc: info.ecc ?? el.ecc,
  revsPerDay: +(1440 / info.periodMin).toFixed(3),
  revsIn12: +revsIn12.toFixed(2),
  periodFor175: +periodFor175.toFixed(2),
  h175: +h175.toFixed(1),
  footprint10: Math.round(footprint(H, 10) * D2R * R_E),
  footprint0: Math.round(footprint(H, 0) * D2R * R_E),
  trackSpacingEq: Math.round((40075 * info.periodMin) / 1440),
  trackSpacing60: Math.round(((40075 * Math.cos(60 * D2R)) * info.periodMin) / 1440),
};

const fig1 = chart({
  title: 'Revisit from one 693 km orbit, 600 km reach', xLabel: 'Latitude (°N)', yLabel: 'Mean hours between looks',
  series: [
    { name: 'One satellite', kind: 'line', x: rows.map((r) => r.lat), y: rows.map((r) => r.revisitOne) },
    { name: 'Three satellites', kind: 'line', x: rows.map((r) => r.lat), y: rows.map((r) => r.revisitThree) },
    { name: 'Four satellites', kind: 'line', x: rows.map((r) => r.lat), y: rows.map((r) => r.revisitFour) },
  ],
  xDomain: [45, 80], yDomain: [0, 14],
  hlines: [{ y: 6, text: 'the paper’s 4 to 6 h goal' }],
  desc: 'Mean hours between looks against latitude for the reference 693 km sun-synchronous orbit, counting every approach within 300 km of a target, averaged over 12 longitudes, and divided by the number of satellites.',
  height: 290,
});

const hs = Array.from({ length: 61 }, (_, i) => 500 + i * 10);
const fig2 = chart({
  title: 'Sun-synchronous inclination and period against height', xLabel: 'Circular orbit height (km)', yLabel: 'Inclination (°) / period (min)',
  series: [
    { name: 'Sun-synchronous inclination', kind: 'line', x: hs, y: hs.map((h) => +ssoInclination(h, h).toFixed(3)) },
    { name: 'Orbital period (min)', kind: 'line', x: hs, y: hs.map((h) => +orbitInfo(fromHeights('x', h, h, 98, 0, 0, 0, EPOCH)).periodMin.toFixed(3)) },
  ],
  xDomain: [500, 1100], yDomain: [94, 103],
  vlines: [{ x: H, text: '693 km', dy: 14 }],
  hlines: [{ y: PAPER.inc, text: 'the paper’s 98.18°' }],
  desc: `Sun-synchronous inclination and orbital period against height for a circular orbit. At 693 km the tool gives ${facts.ssoInc} degrees and ${facts.periodMin} minutes, against the paper's 98.18 degrees and 98.6 minutes.`,
  height: 290,
});

console.log(JSON.stringify({ facts, rows, paper: PAPER }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'revisit', figure(fig1, 'Figure 1. How often one, three or four satellites in the paper’s reference orbit can look at a target, against latitude, worked out from the Satellite tracker’s ground track. A look counts when the track passes within 300 km, half the paper’s 600 km accessible swath (our model of a side-looking radar’s reach).'));
  md = inject(md, 'sso', figure(fig2, 'Figure 2. The sun-synchronous inclination and the orbital period against height, from the same maths. The paper’s 98.18° and 693 km meet on the curve; its stated 98.6-minute period is 0.14 minutes short of the height’s own value.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
