// Figures for src/blog/discoveries/mars-express-water-ice-diurnal-cycle-mars-year-solar-longitude.md, made with the
// maths of Mars time (src/lib/sci/marstime.ts: the Mars24 algorithm of Allison and McEwen 2000).
// Run: node scripts/blog-figures/mars-express-water-ice-diurnal-cycle-mars-year-solar-longitude.mjs
import fs from 'node:fs';
import { marsTime, lsTime, season } from '../../src/lib/sci/marstime.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mars-express-water-ice-diurnal-cycle-mars-year-solar-longitude.md', import.meta.url);
const day = (ms) => new Date(ms).toISOString().slice(0, 10);
const MY = [27, 28, 29, 30, 31, 32, 33, 34];

// The paper's two end points, and the season windows it works in.
const ends = [[27, 64], [34, 315]].map(([my, ls]) => ({ my, ls, date: day(lsTime(my, ls)) }));
const windows = MY.map((my) => {
  const a = lsTime(my, 45), b = lsTime(my, 150), c = lsTime(my, 30), d = lsTime(my, 180);
  return { my, ls45: day(a), ls150: day(b), days: +((b - a) / 864e5).toFixed(1), sols: +((b - a) / 864e5 / 1.0274912517).toFixed(1), acb: [day(c), day(d)], acbDays: Math.round((d - c) / 864e5) };
});

// One Mars year sampled in solar longitude, from Mars Year 34.
const LS = Array.from({ length: 361 }, (_, i) => i);
const at = LS.map((ls) => { const t = marsTime(lsTime(34, ls === 360 ? 359.999 : ls)); return { ls, r: t.r, decl: t.decl, eot: t.eot * 4 }; });
const peak = (key, sign) => at.reduce((p, c) => (sign * c[key] > sign * p[key] ? c : p));
const ap = peak('r', 1), per = peak('r', -1);
const eotHi = peak('eot', 1), eotLo = peak('eot', -1);

const out = {
  paperEnds: ends, insolationRatio: +((ap.r / per.r) ** 2).toFixed(3),
  aphelion: { ls: ap.ls, r: +ap.r.toFixed(4) }, perihelion: { ls: per.ls, r: +per.r.toFixed(4) },
  eotRange: [+eotLo.eot.toFixed(1), +eotHi.eot.toFixed(1)], eotAt: [45, 90, 150].map((ls) => +(at[ls].eot).toFixed(1)),
  declAt: [45, 90, 150].map((ls) => +at[ls].decl.toFixed(2)),
  season45: season(45), season150: season(150),
  windows,
  aphelionDates: MY.map((my) => ({ my, date: day(lsTime(my, 71)) })),
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: how far Mars is from the Sun through its year, with the cloud-belt season marked.
const fig1 = chart({
  title: 'Mars and the Sun through one Mars year', xLabel: 'Solar longitude Ls (degrees)', yLabel: 'Distance from the Sun (AU)',
  series: [{ name: 'Mars–Sun distance', kind: 'line', x: LS, y: at.map((a) => a.r) }],
  xDomain: [0, 360], yDomain: [1.36, 1.70], xTicks: [0, 60, 120, 180, 240, 300, 360],
  bands: [{ x0: 30, x1: 180, text: 'cloud-belt season' }],
  vlines: [{ x: ap.ls, text: `aphelion Ls ${ap.ls}`, dy: 22 }, { x: per.ls, text: `perihelion Ls ${per.ls}`, left: true, dy: 22 }],
  desc: `The Mars–Sun distance against solar longitude. It peaks at ${ap.r.toFixed(3)} AU at Ls ${ap.ls} and falls to ${per.r.toFixed(3)} AU at Ls ${per.ls}, so sunlight is ${((ap.r / per.r) ** 2).toFixed(2)} times stronger at perihelion. The shaded band is the paper's aphelion cloud-belt season, Ls 30 to 180.`,
  height: 280,
});

// Figure 2: the equation of time on Mars, which is what separates sundial time from clock time.
const fig2 = chart({
  title: 'Sundial time minus clock time on Mars', xLabel: 'Solar longitude Ls (degrees)', yLabel: 'Equation of time (minutes)',
  series: [{ name: 'Equation of time', kind: 'line', x: LS, y: at.map((a) => a.eot) }],
  xDomain: [0, 360], yDomain: [-60, 50], xTicks: [0, 60, 120, 180, 240, 300, 360],
  bands: [{ x0: 45, x1: 150, text: 'diurnal study window' }],
  hlines: [{ y: 0, text: '' }],
  desc: `The equation of time on Mars against solar longitude: local true solar time minus local mean solar time, in minutes. It runs from ${eotLo.eot.toFixed(0)} minutes at Ls ${eotLo.ls} to +${eotHi.eot.toFixed(0)} minutes at Ls ${eotHi.ls}, a swing of ${(eotHi.eot - eotLo.eot).toFixed(0)} minutes.`,
  height: 280,
});

// Figure 3: where the Sun stands overhead, against the cloud belt's own latitudes.
const fig3 = chart({
  title: 'Latitude where the Sun is overhead', xLabel: 'Solar longitude Ls (degrees)', yLabel: 'Subsolar latitude (degrees)',
  series: [{ name: 'Subsolar latitude', kind: 'line', x: LS, y: at.map((a) => a.decl) }],
  xDomain: [0, 360], yDomain: [-30, 30], xTicks: [0, 60, 120, 180, 240, 300, 360],
  bands: [{ x0: 45, x1: 150, text: 'diurnal study window' }],
  hlines: [{ y: 30, text: 'cloud belt, 30° N' }, { y: -10, text: 'cloud belt, 10° S' }],
  desc: 'The latitude at which the Sun stands overhead on Mars, against solar longitude. Through the paper’s Ls 45 to 150 window it stays between about 12 and 25 degrees north, inside the cloud belt’s own band of 10 degrees south to 30 degrees north.',
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'distance', figure(fig1, "Figure 1. Mars's distance from the Sun through one Mars year, from the tool's own orbit model. The cloud belt the paper studies forms in the shaded season, around aphelion, when Mars is coldest and water ice condenses at low latitudes."));
  md = inject(md, 'eot', figure(fig2, 'Figure 2. The equation of time on Mars: how far a sundial runs ahead of or behind a mean clock. The swing is far larger than on Earth, so binning observations by true solar time and by mean solar time are not the same thing.'));
  md = inject(md, 'subsolar', figure(fig3, "Figure 3. The latitude where the Sun stands overhead. Through the paper's diurnal window the subsolar point sits inside the cloud belt's own latitudes, which is why the belt has a strong daily cycle at all."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
