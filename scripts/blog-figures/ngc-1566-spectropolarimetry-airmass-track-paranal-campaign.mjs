// Figures for src/blog/discoveries/ngc-1566-spectropolarimetry-airmass-track-paranal-campaign.md, made with the
// maths of the Batch airmass planner (src/lib/sci/airmass.ts) and the darkness maths it shares with the
// Dark-sky calendar (src/lib/astro/darkness.ts).
// Run: node scripts/blog-figures/ngc-1566-spectropolarimetry-airmass-track-paranal-campaign.mjs
import fs from 'node:fs';
import { airmass, altitudeFor, plan, parseTargets, moonRaDec, separation, altAz } from '../../src/lib/sci/airmass.ts';
import { darkNight } from '../../src/lib/astro/darkness.ts';
import * as A from 'astronomy-engine';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ngc-1566-spectropolarimetry-airmass-track-paranal-campaign.md', import.meta.url);

// Target position and observing log from Marin et al. (2026), A&A 709: A188, doi:10.1051/0004-6361/202658928
// (CC BY 4.0). The log gives the airmass at the start and end of each sequence but no UT times.
const TARGET_LINE = 'NGC 1566, 04 20 00.394, -54 56 16.60';
const { targets } = parseTargets(TARGET_LINE);
const NGC = targets[0];
// Paranal: public site coordinates, OUR addition (the paper names the observatory, not its coordinates).
const SITE = { name: 'Paranal', lat: -24.6275, lon: -70.4044, elev: 2635, tz: 'America/Santiago' };
const FORMULA = 'ky'; // Kasten and Young (1989), the planner's default
// Date, grism, exposure seconds, logged airmass at start and end.
const LOG = [
  { date: '2025-08-03', grism: '300V', exp: 2 * 1200, X: [1.4, 1.3] },
  { date: '2025-08-21', grism: '300V', exp: 2 * 1200, X: [1.3, 1.2] },
  { date: '2025-08-22', grism: '300I', exp: 2 * 1200, X: [1.3, 1.2] },
  { date: '2025-08-23', grism: '300V', exp: 2 * 1200, X: [1.4, 1.3] },
  { date: '2025-09-18', grism: '300I', exp: 2 * 1200, X: [1.3, 1.2] },
  { date: '2025-09-20', grism: '300V', exp: 2 * 1200, X: [1.4, 1.3] },
  { date: '2025-09-20', grism: '300I', exp: 2 * 1200, X: [1.2, 1.2] },
  { date: '2025-09-21', grism: '300V', exp: 1 * 1200, X: [1.2, 1.2] },
  { date: '2025-09-21', grism: '300I', exp: 3 * 1200, X: [1.2, 1.2] },
];

const obs = new A.Observer(SITE.lat, SITE.lon, SITE.elev);
const X_AT = (ms) => airmass(altAz(NGC.ra, NGC.dec, new Date(ms), obs, true).alt, FORMULA);
const iso = (ms) => new Date(ms).toISOString().slice(11, 16);
const dayMs = (d) => Date.parse(d + 'T00:00:00Z');

/** The night's plan from the planner itself, over astronomical darkness, as the tool's default span does. */
function nightPlan(date) {
  const n = darkNight(SITE, date);
  const from = n.dusk ?? new Date(dayMs(date) + 23 * 3600e3), to = n.dawn ?? new Date(dayMs(date) + 10 * 3600e3);
  const p = plan(NGC, SITE, from, to, { formula: FORMULA, refraction: true, limit: 1.3, stepMin: 60 });
  return { n, from, to, p };
}

/** When the airmass passes `X` on the falling (before transit) or rising (after transit) branch, to the minute. */
function timeAtX(transitMs, X, rising) {
  let lo = rising ? transitMs : transitMs - 8 * 3600e3, hi = rising ? transitMs + 8 * 3600e3 : transitMs;
  if ((X_AT(lo) - X) * (X_AT(hi) - X) > 0) return null;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((X_AT(m) - X) * (X_AT(lo) - X) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

const nights = LOG.map((L) => {
  const { n, from, to, p } = nightPlan(L.date);
  const tr = p.transit.getTime();
  // The logged pair fixes the window: 1.4 -> 1.3 means before transit; an unchanged 1.2 straddles it.
  const falling = L.X[0] > L.X[1];
  const t0 = falling ? timeAtX(tr, L.X[0], false) : timeAtX(tr, L.X[0] + 0.05, false);
  const t1 = falling ? timeAtX(tr, L.X[1], false) : timeAtX(tr, L.X[1] + 0.05, true);
  const moon = moonRaDec(p.best, obs);
  return {
    date: L.date, grism: L.grism, expMin: L.exp / 60, loggedX: L.X,
    transitUT: iso(tr), transitAlt: +p.transitAlt.toFixed(2), minX: +airmass(p.transitAlt, FORMULA).toFixed(3),
    transitInDark: tr > from.getTime() && tr < to.getTime(), bestUT: iso(p.best.getTime()), bestX: +p.bestX.toFixed(3),
    windowUT: t0 && t1 ? [iso(t0), iso(t1)] : null, windowMin: t0 && t1 ? +((t1 - t0) / 60e3).toFixed(0) : null,
    hoursBelow13: +p.hoursBelow.toFixed(2), darkH: +n.darkH.toFixed(2), moonIllum: +(n.illum * 100).toFixed(0),
    moonSep: +separation(NGC.ra, NGC.dec, moon.ra, moon.dec).toFixed(1), moonMin: +p.moonMin.toFixed(1),
    duskUT: iso(from.getTime()), dawnUT: iso(to.getTime()),
  };
});

// The airmass limits the planner reports, for the table and the text.
const limits = [1.2, 1.3, 1.4, 1.5, 2].map((X) => ({ X, alt: +altitudeFor(X, FORMULA).toFixed(2) }));
const zenithDist = +(90 - nights[0].transitAlt).toFixed(2);

// ---- Figure 1: the airmass track on two of the campaign's nights ----
const trackFor = (date) => {
  const { from, to } = nightPlan(date);
  const t0 = from.getTime() - 60 * 60e3, t1 = to.getTime() + 60 * 60e3, out = { x: [], y: [] };
  for (let ms = t0; ms <= t1; ms += 4 * 60e3) { const X = X_AT(ms); if (X < 3.2) { out.x.push((ms - dayMs(date)) / 3600e3); out.y.push(+X.toFixed(4)); } }
  return out;
};
const augT = trackFor('2025-08-03'), sepT = trackFor('2025-09-21');
const fig1 = chart({
  title: 'NGC 1566 from Paranal: airmass through the night',
  xLabel: 'Hours UT after 00:00 on the evening date', yLabel: 'Airmass (Kasten and Young)',
  series: [
    { name: '3 August 2025', kind: 'line', x: augT.x, y: augT.y },
    { name: '21 September 2025', kind: 'line', x: sepT.x, y: sepT.y },
  ],
  xDomain: [22, 34], yDomain: [1.1, 2.6],
  xTicks: [22, 24, 26, 28, 30, 32, 34], xFmt: (v) => `${String(Math.round(v) % 24).padStart(2, '0')}:00`,
  hlines: [{ y: 1.2, text: 'logged 1.2' }, { y: 1.3, text: 'logged 1.3' }, { y: 1.4, text: 'logged 1.4' }],
  desc: `The airmass of NGC 1566 seen from Paranal on the first and last nights of the campaign, worked out by the batch airmass planner. The curve bottoms out at ${nights[0].minX} at transit, which is why no sequence in the log is below 1.2.`,
  height: 300,
});

// ---- Figure 2: how long the target stays below airmass 1.3 through the season ----
const season = [];
for (let d = Date.parse('2025-06-15T00:00:00Z'); d <= Date.parse('2025-11-30T00:00:00Z'); d += 5 * 86400e3) {
  const date = new Date(d).toISOString().slice(0, 10);
  const { n, from, to } = nightPlan(date);
  const p = plan(NGC, SITE, from, to, { formula: FORMULA, refraction: true, limit: 1.3, stepMin: 120 });
  const p4 = plan(NGC, SITE, from, to, { formula: FORMULA, refraction: true, limit: 1.4, stepMin: 120 });
  season.push({ date, doy: (d - Date.parse('2025-06-15T00:00:00Z')) / 86400e3, h13: +p.hoursBelow.toFixed(3), h14: +p4.hoursBelow.toFixed(3), darkH: +n.darkH.toFixed(2) });
}
const epochDoy = [...new Set(LOG.map((L) => L.date))].map((date) => (dayMs(date) - Date.parse('2025-06-15T00:00:00Z')) / 86400e3);
const fig2 = chart({
  title: 'Hours below airmass 1.3 and 1.4, through 2025',
  xLabel: 'Night of (2025)', yLabel: 'Hours of darkness below the limit',
  series: [
    { name: 'Airmass ≤ 1.3', kind: 'line', x: season.map((s) => s.doy), y: season.map((s) => s.h13) },
    { name: 'Airmass ≤ 1.4', kind: 'line', x: season.map((s) => s.doy), y: season.map((s) => s.h14) },
    { name: 'Observed nights', kind: 'dots', x: epochDoy, y: epochDoy.map(() => 0.12), size: 3.4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 168], yDomain: [0, 5],
  xTicks: [0, 16, 47, 77, 108, 138, 168],
  xFmt: (v) => new Date(Date.parse('2025-06-15T00:00:00Z') + v * 86400e3).toISOString().slice(5, 10),
  desc: 'Hours of astronomical darkness in which NGC 1566 is at airmass 1.3 or better, and 1.4 or better, for every fifth night of 2025 from Paranal. The nine observed sequences fall where the low-airmass window is widest.',
  height: 300,
});

// The paper's abstract says the campaign started on 2 August and its Section 2.1 says 3 August. Does either date
// fit the logged 1.4 -> 1.3 better? Work out both windows and how close each ends to astronomical dawn.
const firstNight = ['2025-08-02', '2025-08-03'].map((date) => {
  const { n, from, to, p } = nightPlan(date);
  const tr = p.transit.getTime(), t0 = timeAtX(tr, 1.4, false), t1 = timeAtX(tr, 1.3, false);
  return { date, windowUT: [iso(t0), iso(t1)], windowMin: +((t1 - t0) / 60e3).toFixed(0), dawnUT: iso(to.getTime()),
    minutesToDawn: +((to.getTime() - t1) / 60e3).toFixed(0), moonIllum: +(n.illum * 100).toFixed(0), hoursBelow13: +p.hoursBelow.toFixed(2) };
});

console.log(JSON.stringify({ ra: NGC.ra, dec: NGC.dec, zenithDist, limits, firstNight, nights, seasonPeak: season.reduce((a, b) => (b.h13 > a.h13 ? b : a)), seasonSample: season.filter((_, i) => i % 6 === 0) }, (k, v) => (typeof v === 'number' ? +v.toPrecision(8) : v), 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'track', figure(fig1, 'Figure 1. The airmass of NGC 1566 from Paranal on the campaign’s first and last nights, from the batch airmass planner. The dashed lines are the three values the published log uses. The floor at transit, 1.158, is set by the target’s declination and the site’s latitude and nothing else.'));
  md = inject(md, 'season', figure(fig2, 'Figure 2. How many hours of astronomical darkness put NGC 1566 below airmass 1.3 and 1.4, night by night through 2025 at Paranal. The marks along the bottom are the seven nights the paper observed.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
