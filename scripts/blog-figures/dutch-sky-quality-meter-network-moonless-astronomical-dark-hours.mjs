// Figures for src/blog/discoveries/dutch-sky-quality-meter-network-moonless-astronomical-dark-hours.md, made with
// the maths of the Dark-sky calendar (src/lib/astro/darkness.ts: darkNight and yearDates, 10-minute slots from
// local solar noon to the next, Sun depth for the twilight bands and the Moon's altitude for the Moon-free share).
// Run: node scripts/blog-figures/dutch-sky-quality-meter-network-moonless-astronomical-dark-hours.mjs
import fs from 'node:fs';
import * as A from 'astronomy-engine';
import { darkNight, yearDates, STEP_MIN, SLOTS } from '../../src/lib/astro/darkness.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/dutch-sky-quality-meter-network-moonless-astronomical-dark-hours.md', import.meta.url);

// Inputs from the paper: Shah, F. R., Peletier, R. F., Noel-Storr, J., et al. (2025), MNRAS 541(4),
// doi:10.1093/mnras/staf1200 (CC BY 4.0). Site coordinates are its Table 1; the hour budget (72.4 % of hours lost
// to sunlight, 53.8 % of the rest to moonlight, 93.9 % of what is left to cloud, 8207 hours surviving out of
// 1,051,920) and the seasonal split (4697 usable hours in February-April, 88 in May-July) are from its text.
const SITES = [
  { name: 'Lauwersoog', lat: 53.385, lon: 6.235, elev: 0, tz: 'UTC' },
  { name: 'Oostkapelle', lat: 51.572, lon: 3.537, elev: 0, tz: 'UTC' },
  { name: 'Borkum', lat: 53.587, lon: 6.663, elev: 0, tz: 'UTC' },
];
const YEARS = [2020, 2021, 2022, 2023];

// The tool's own budget: astronomical darkness and Moon-free darkness, night by night.
const budget = SITES.map((s) => {
  let dark = 0, free = 0, hours = 0, nights = 0, noDark = 0;
  const month = Array.from({ length: 12 }, () => ({ dark: 0, free: 0 }));
  for (const y of YEARS) for (const iso of yearDates(y)) {
    const r = darkNight(s, iso);
    dark += r.darkH; free += r.moonFreeH; hours += 24; nights++; if (r.darkH <= 0) noDark++;
    const m = +iso.slice(5, 7) - 1; month[m].dark += r.darkH; month[m].free += r.moonFreeH;
  }
  return { site: s.name, lat: s.lat, hours, nights, noDark, dark: +dark.toFixed(0), free: +free.toFixed(0), pctDark: +((100 * dark) / hours).toFixed(1), pctFreeOfDark: +((100 * free) / dark).toFixed(1), pctFreeOfAll: +((100 * free) / hours).toFixed(1), month };
});

// The paper's stricter Moon rule (excluded whenever the Moon is above 3° BELOW the horizon), on the same
// 10-minute grid the Dark-sky calendar uses, for a like-for-like comparison with its 53.8 % figure.
const s0 = SITES[0], obs = new A.Observer(s0.lat, s0.lon, 0);
const altOf = (b, t) => { const e = A.Equator(b, t, obs, true, true); return A.Horizon(t, obs, e.ra, e.dec).altitude; };
let slots = 0, darkSlots = 0, free3 = 0, free0 = 0;
for (const y of YEARS) for (const iso of yearDates(y)) {
  const [Y, M, D] = iso.split('-').map(Number), start = new Date(Date.UTC(Y, M - 1, D, 12) - (s0.lon / 15) * 3600e3);
  for (let i = 0; i < SLOTS; i++) {
    const t = new Date(start.getTime() + (i + 0.5) * STEP_MIN * 60e3); slots++;
    if (altOf(A.Body.Sun, t) <= -18) { darkSlots++; const m = altOf(A.Body.Moon, t); if (m <= -3) free3++; if (m <= 0) free0++; }
  }
}
const strict = { slots, pctDark: +((100 * darkSlots) / slots).toFixed(1), pctFree3OfDark: +((100 * free3) / darkSlots).toFixed(1), pctFree3OfAll: +((100 * free3) / slots).toFixed(1), pctFree0OfDark: +((100 * free0) / darkSlots).toFixed(1) };

// Figure 1: one year of nights at Lauwersoog.
const nights2021 = yearDates(2021).filter((_, i) => i % 2 === 0).map((iso) => darkNight(s0, iso));
const doy = nights2021.map((n) => Math.round((Date.parse(n.date) - Date.UTC(2021, 0, 1)) / 864e5) + 1);
const fig1 = chart({
  title: 'A year of nights at Lauwersoog (53.4° N), 2021', xLabel: 'Night of the year', yLabel: 'Hours',
  series: [
    { name: 'Astronomically dark', kind: 'line', x: doy, y: nights2021.map((n) => +n.darkH.toFixed(2)) },
    { name: 'Dark with no Moon', kind: 'line', x: doy, y: nights2021.map((n) => +n.moonFreeH.toFixed(2)) },
  ],
  xDomain: [1, 365], yDomain: [0, 12],
  xTicks: [1, 60, 121, 182, 244, 305, 365], xFmt: (d) => ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Jan'][[1, 60, 121, 182, 244, 305, 365].indexOf(d)] ?? '',
  yTicks: [0, 3, 6, 9, 12],
  desc: 'Hours of astronomical darkness and of Moon-free darkness for every second night of 2021 at 53.4 degrees north. The dark hours fall to zero from mid-May to late July, and the Moon-free hours swing up and down with the lunar month.',
  height: 290,
});

// Figure 2: monthly totals over the four years, dark and Moon-free.
const mid = [15, 45, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349];
const fig2 = chart({
  title: 'Where the usable hours are: monthly totals, 2020-2023', xLabel: 'Month', yLabel: 'Hours in four years',
  series: [
    { name: 'Astronomically dark', kind: 'step', x: mid, y: budget[0].month.map((m) => Math.round(m.dark)) },
    { name: 'Dark with no Moon', kind: 'step', x: mid, y: budget[0].month.map((m) => Math.round(m.free)) },
  ],
  xDomain: [1, 365], yDomain: [0, 1600],
  xTicks: mid, xFmt: (d) => 'JFMAMJJASOND'[mid.indexOf(d)] ?? '',
  bands: [{ x0: 32, x1: 120, text: 'Feb-Apr' }, { x0: 121, x1: 212, text: 'May-Jul' }],
  desc: 'Monthly totals of astronomical darkness and Moon-free darkness at Lauwersoog over four years. February to April holds about 2800 dark hours, May to July about 120, which is why the paper kept 4697 usable hours in spring and only 88 in summer.',
  height: 290,
});

console.log(JSON.stringify({ budget, strict }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'year', figure(fig1, 'Figure 1. Every second night of 2021 at Lauwersoog, worked out with the Dark-sky calendar\'s own maths: hours of astronomical darkness, and how many of them have no Moon above the horizon. Between mid-May and late July the Sun never gets 18° down, so the night has no dark hours at all.'));
  md = inject(md, 'months', figure(fig2, 'Figure 2. The same four years added up month by month. The shaded blocks are the paper\'s two seasons: February to April, which gave it 4697 usable hours, and May to July, which gave 88.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
