// Figures for src/blog/discoveries/total-solar-eclipse-totality-sun-position-diurnal-drift.md, made with the maths of
// the Sun position calculator (src/lib/astro/sun.ts: sunAltAz and sunDay) and the Batch airmass planner's
// `separation` (src/lib/sci/airmass.ts). Run:
//   node scripts/blog-figures/total-solar-eclipse-totality-sun-position-diurnal-drift.mjs
import fs from 'node:fs';
import { sunAltAz, sunDay } from '../../src/lib/astro/sun.ts';
import { separation } from '../../src/lib/sci/airmass.ts';
import * as A from 'astronomy-engine';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/total-solar-eclipse-totality-sun-position-diurnal-drift.md', import.meta.url);

// From the paper: Emslie et al. (2026), Front. Astron. Space Sci. 12: 1724714, doi:10.3389/fspas.2025.1724714 (CC BY).
// Its Table 2 gives two SunSketcher observers' own GPS fixes and image times on 8 April 2024. Totality on the
// centreline runs about 4 min 4 s (244 s) in the middle of the US path, about 265 s at its longest near the
// Mexican border and about 200 s in eastern Maine. The paper's own claim we check: the Sun drifts "up to one
// degree (two solar diameters)" along its diurnal path during totality.
const OBS = [
  { id: 1024, t: '2024-04-08T18:42:33.127Z', lat: 32.865406, lon: -96.937767, elev: 23.7, where: 'near Dallas, Texas' },
  { id: 1033, t: '2024-04-08T19:08:10.652Z', lat: 39.657185, lon: -85.960335, elev: 207.7, where: 'near Greenwood, Indiana' },
];
const TOTALITY = { maine: 200, middle: 244, longest: 265 };
const place = (o) => ({ name: `Observer ${o.id}`, lat: o.lat, lon: o.lon, elev: o.elev, tz: 'UTC' });
const SUN_R_KM = 695700, AU_KM = 1.495978707e8;

const res = OBS.map((o) => {
  const p = place(o), t = new Date(o.t), s = sunAltAz(p, t);
  const diam = (2 * Math.atan(SUN_R_KM / (s.dist * AU_KM)) * 180) / Math.PI;
  // Drift along the diurnal path over a totality of `dur` seconds centred on the recorded moment.
  const drift = (dur) => { const a = sunAltAz(p, new Date(t.getTime() - dur * 500)), b = sunAltAz(p, new Date(t.getTime() + dur * 500)); return separation(a.az, a.alt, b.az, b.alt); };
  const day = sunDay(p, '2024-04-08');
  return {
    ...o, alt: s.alt, az: s.az, dec: s.dec, dist: s.dist, diamDeg: diam, diamArcmin: diam * 60,
    shadow2m: 2 / Math.tan((s.alt * Math.PI) / 180),
    drift: Object.fromEntries(Object.entries(TOTALITY).map(([k, d]) => [k, drift(d)])),
    rateDegPerMin: (drift(244) / 244) * 60,
    day: { rise: day.rise, noon: day.noon, noonAlt: day.noonAlt, set: day.set, dayH: day.dayH, eotMin: day.eotMin },
    minutesAfterNoon: (t - day.noon) / 60e3,
  };
});

// The umbra's mean ground speed between the two observers, from their own GPS fixes and timestamps.
const sepDeg = separation(OBS[0].lon, OBS[0].lat, OBS[1].lon, OBS[1].lat);
const groundKm = (sepDeg * Math.PI * 6371) / 180;
const dtS = (Date.parse(OBS[1].t) - Date.parse(OBS[0].t)) / 1000;
const speed = (groundKm * 1000) / dtS;

// How a timing error turns into a distance on the Moon's limb: the Moon's apparent motion against the Sun.
const tMid = new Date(OBS[0].t), obsA = new A.Observer(OBS[0].lat, OBS[0].lon, OBS[0].elev);
const offset = (tt) => { const m = A.Equator(A.Body.Moon, tt, obsA, true, true), s = A.Equator(A.Body.Sun, tt, obsA, true, true); return [(m.ra - s.ra) * 15 * 3600 * Math.cos((s.dec * Math.PI) / 180), (m.dec - s.dec) * 3600]; };
const o1 = offset(tMid), o2 = offset(new Date(tMid.getTime() + 60e3));
const relArcsecPerS = Math.hypot(o2[0] - o1[0], o2[1] - o1[1]) / 60;
const moonKm = A.Equator(A.Body.Moon, tMid, obsA, true, true).dist * AU_KM;
const msFor100m = ((100 / (moonKm * 1000)) * 206264.806) / relArcsecPerS * 1000;
const mFor100ms = (0.1 * relArcsecPerS) / 206264.806 * moonKm * 1000;

// Figure 1: the Sun's height through the day at both places, with the two recorded moments marked.
const hours = Array.from({ length: 97 }, (_, i) => 10 + i * 0.125); // 10:00 to 22:00 UT
const altAt = (o, h) => sunAltAz(place(o), new Date(Date.UTC(2024, 3, 8, 0, 0, 0) + h * 3600e3)).alt;
const fig1 = chart({
  title: 'The Sun on 8 April 2024 at the two observers’ own GPS fixes', xLabel: 'Time (UT, hours)', yLabel: 'Sun’s altitude (°)',
  series: OBS.map((o) => ({ name: `Observer ${o.id}, ${o.where}`, kind: 'line', x: hours, y: hours.map((h) => altAt(o, h)) })),
  xDomain: [10, 22], yDomain: [0, 70],
  vlines: res.map((r, i) => ({ x: (Date.parse(r.t) - Date.UTC(2024, 3, 8)) / 3600e3, text: `${r.alt.toFixed(1)}°`, dy: i * 14 })),
  desc: `The Sun's altitude through 8 April 2024 at both sites. At the recorded moments it was ${res[0].alt.toFixed(1)} degrees high near Dallas and ${res[1].alt.toFixed(1)} degrees high in Indiana.`,
  height: 290,
});

// Figure 2: how far the Sun slides along its path during totality.
const DUR = Array.from({ length: 56 }, (_, i) => i * 5); // 0 to 275 s
const driftOf = (o, dur) => { const p = place(o), t = new Date(o.t); const a = sunAltAz(p, new Date(t.getTime() - dur * 500)), b = sunAltAz(p, new Date(t.getTime() + dur * 500)); return separation(a.az, a.alt, b.az, b.alt); };
const fig2 = chart({
  title: 'How far the Sun slides along its path during totality', xLabel: 'Length of totality (seconds)', yLabel: 'Drift along the diurnal path (°)',
  series: [
    { name: 'Observer 1024 (Texas)', kind: 'line', x: DUR, y: DUR.map((d) => driftOf(OBS[0], d)) },
    { name: 'Observer 1033 (Indiana)', kind: 'line', x: DUR, y: DUR.map((d) => driftOf(OBS[1], d)), dash: '5 4' },
  ],
  xDomain: [0, 275], yDomain: [0, 1.2],
  hlines: [{ y: 2 * res[0].diamDeg, text: 'two solar diameters, 1.064°' }],
  vlines: [{ x: 200, text: 'Maine, 200 s' }, { x: 265, text: 'longest, 265 s', left: true }],
  desc: 'Two overlapping straight lines: the Sun drifts 1.01 degrees in the 244 seconds of mid-path totality and 1.09 degrees in the longest 265 seconds, against a solar diameter of 0.532 degrees.',
  height: 290,
});

console.log(JSON.stringify({
  observers: res.map((r) => ({
    id: r.id, alt: +r.alt.toFixed(3), az: +r.az.toFixed(2), dec: +r.dec.toFixed(4), distAU: +r.dist.toFixed(5),
    diamArcmin: +r.diamArcmin.toFixed(2), shadowOf2m: +r.shadow2m.toFixed(3),
    drift: Object.fromEntries(Object.entries(r.drift).map(([k, v]) => [k, +v.toFixed(4)])),
    driftInDiameters: +(r.drift.middle / r.diamDeg).toFixed(2), longestInDiameters: +(r.drift.longest / r.diamDeg).toFixed(2),
    rateDegPerMin: +r.rateDegPerMin.toFixed(4),
    rise: r.day.rise.toISOString(), noon: r.day.noon.toISOString(), noonAlt: +r.day.noonAlt.toFixed(2),
    set: r.day.set.toISOString(), dayH: +r.day.dayH.toFixed(4), eotMin: +r.day.eotMin.toFixed(2),
    minutesAfterNoon: +r.minutesAfterNoon.toFixed(1), belowMaxDeg: +(r.day.noonAlt - r.alt).toFixed(3),
  })),
  shadow: { sepDeg: +sepDeg.toFixed(4), groundKm: +groundKm.toFixed(1), dtS, speedMs: +speed.toFixed(1) },
  moon: { distKm: Math.round(moonKm), relArcsecPerS: +relArcsecPerS.toFixed(4), msFor100m: +msFor100m.toFixed(1), mFor100ms: +mFor100ms.toFixed(0) },
  cosDecCheck: +(15 * Math.cos((res[0].dec * Math.PI) / 180)).toFixed(4),
}, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'day', figure(fig1, 'Figure 1. The Sun’s altitude through 8 April 2024 worked out from each SunSketcher observer’s own latitude, longitude and elevation. The dashed lines mark the moments their phones recorded, and the labels the Sun’s altitude then.'));
  md = inject(md, 'drift', figure(fig2, 'Figure 2. The angular distance the Sun travels along its diurnal path during a totality of a given length, from the Sun position calculator’s own altitude and azimuth. The two sites give the same line, because the rate depends only on the Sun’s declination.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
