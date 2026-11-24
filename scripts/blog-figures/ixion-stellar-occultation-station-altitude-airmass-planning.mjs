// Figures for src/blog/discoveries/ixion-stellar-occultation-station-altitude-airmass-planning.md.
// The sky positions, airmass and night tracks are worked out with fibub's shared observing maths,
// src/lib/sci/airmass.ts (parseTargets, altAz with annual aberration and refraction, airmass, plan), the same
// astronomy-engine positions that the Target altitude planner (src/lib/astro/sky.ts) draws its charts from.
// Run: node scripts/blog-figures/ixion-stellar-occultation-station-altitude-airmass-planning.mjs
import fs from 'node:fs';
import * as M from '../../src/lib/sci/airmass.ts';
import * as A from 'astronomy-engine';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ixion-stellar-occultation-station-altitude-airmass-planning.md', import.meta.url);

// Inputs from the paper: Kilic, Y., Braga-Ribas, F., Pereira, C. L., et al. (2026), A&A 707, A70,
// doi:10.1051/0004-6361/202557970 (CC BY 4.0). Star positions are its Table 2 (ICRS, propagated to the event),
// event mid-times, geocentric distances and shadow speeds its Table 3, the station regions its text.
const EVENTS = [
  { d: '2020-08-17T01:42:15Z', s: '17 49 53.5830, -29 48 12.589', v: 11.61, dist: 38.37, chords: '3 of 3', where: 'Illinois and New York, USA' },
  { d: '2020-10-13T01:57:46Z', s: '17 50 20.3595, -29 43 33.087', v: 16.12, dist: 39.26, chords: '8 of 10', where: 'ten sites across the USA, Arizona among them' },
  { d: '2021-04-28T07:35:37Z', s: '18 05 34.6814, -30 09 09.703', v: 13.54, dist: 38.15, chords: '6 of 16', where: 'Brazil, Argentina, Uruguay, Chile' },
  { d: '2021-05-20T06:43:23Z', s: '18 04 05.2362, -30 13 44.615', v: 20.66, dist: 37.89, chords: '4 of 5', where: 'USA' },
  { d: '2021-08-17T11:36:12Z', s: '17 56 18.8133, -30 17 43.765', v: 12.11, dist: 38.10, chords: '1 of 1', where: 'New South Wales, Australia' },
  { d: '2022-06-02T18:09:33Z', s: '18 09 36.9353, -30 43 37.051', v: 23.15, dist: 37.54, chords: '1 of 1', where: 'Australia' },
  { d: '2022-06-30T00:22:52Z', s: '18 06 53.6148, -30 46 56.476', v: 24.66, dist: 37.46, chords: '4 of 8', where: 'Brazil' },
  { d: '2023-07-28T06:13:24Z', s: '18 11 03.2654, -31 15 22.477', v: 20.21, dist: 37.34, chords: '3 of 7', where: 'Chile, Argentina, Brazil' },
];
// Site coordinates are standard published observatory and town positions rounded to 0.001°, typed by us as
// stand-ins for the paper's station list (the paper's own coordinates are in its appendix table).
const SITES = [
  { name: 'CTIO, Chile', lat: -30.169, lon: -70.806, elev: 2200 },
  { name: 'Pico dos Dias, Brazil', lat: -22.535, lon: -45.583, elev: 1864 },
  { name: 'Naperville, USA', lat: 41.785, lon: -88.147, elev: 215 },
  { name: 'Yass, Australia', lat: -34.84, lon: 148.91, elev: 520 },
];
const EXTRA = [
  { name: 'CASLEO, Argentina', lat: -31.8, lon: -69.3, elev: 2550 },
  { name: 'Happy Jack, Arizona', lat: 34.744, lon: -111.422, elev: 2360 },
  { name: 'Lake Placid, USA', lat: 44.279, lon: -73.979, elev: 568 },
];
const OPT = { formula: 'ky', refraction: true, limit: 2, stepMin: 30 };

const sunAlt = (t, obs) => { const e = A.Equator(A.Body.Sun, t, obs, true, true); return A.Horizon(t, obs, e.ra, e.dec, 'normal').altitude; };
const moonAlt = (t, obs) => { const e = A.Equator(A.Body.Moon, t, obs, true, true); return A.Horizon(t, obs, e.ra, e.dec, 'normal').altitude; };

const rows = EVENTS.map((ev) => {
  const t = new Date(ev.d), star = M.parseTargets('star, ' + ev.s).targets[0];
  const gst = A.SiderealTime(t);
  const zenithLon = ((((star.ra / 15 - gst) * 15 + 540) % 360) + 360) % 360 - 180;
  const at = [...SITES, ...EXTRA].map((s) => {
    const obs = new A.Observer(s.lat, s.lon, s.elev), h = M.altAz(star.ra, star.dec, t, obs, true);
    return { site: s.name, alt: +h.alt.toFixed(1), X: h.alt > 0 ? +M.airmass(h.alt, 'ky').toFixed(2) : null, sun: +sunAlt(t, obs).toFixed(1), moon: +moonAlt(t, obs).toFixed(0) };
  });
  return {
    date: ev.d.slice(0, 10), where: ev.where, chords: ev.chords, v: ev.v, dist: ev.dist,
    ra: +star.ra.toFixed(4), dec: +star.dec.toFixed(4), zenithLat: +star.dec.toFixed(1), zenithLon: +zenithLon.toFixed(1),
    moonIllum: +A.Illumination(A.Body.Moon, t).phase_fraction.toFixed(3), at,
  };
});

// Figure 1: the star's altitude through the night of 28 April 2021, the sixteen-station event.
const EV3 = EVENTS[2], star3 = M.parseTargets('star, ' + EV3.s).targets[0];
const from = new Date('2021-04-27T22:00:00Z'), to = new Date('2021-04-28T11:00:00Z');
const hoursOf = (d) => (d.getTime() - from.getTime()) / 3600e3;
const tracks = [SITES[0], SITES[1], SITES[2]].map((s) => {
  const p = M.plan(star3, s, from, to, { ...OPT, stepMin: 10 });
  return { s, p, x: p.samples.map((q) => hoursOf(q.time)), y: p.samples.map((q) => +q.alt.toFixed(2)) };
});
const fig1 = chart({
  title: 'The 28 April 2021 star, through one night', xLabel: 'Hours UT on 28 April 2021', yLabel: 'Altitude above the horizon (°)',
  series: tracks.map((t) => ({ name: t.s.name, kind: 'line', x: t.x, y: t.y })),
  xDomain: [hoursOf(from), hoursOf(to)], yDomain: [0, 90],
  xTicks: [0, 2, 4, 6, 8, 10, 12], xFmt: (h) => `${String(Math.round((22 + h) % 24)).padStart(2, '0')}:00`,
  yTicks: [0, 30, 60, 90],
  hlines: [{ y: 30, text: 'airmass 2' }],
  vlines: [{ x: hoursOf(new Date(EV3.d)), text: 'occultation 07:35 UT' , left: true }],
  desc: 'Altitude of the occulted star through the night of 28 April 2021 from CTIO in Chile, Pico dos Dias in Brazil and Naperville in the USA. At the occultation the star was near the zenith from South America and about 13 degrees up from Illinois.',
  height: 280,
});

// Figure 2: altitude at the moment of each event, from one site per continent.
const fig2 = chart({
  title: 'How high the star stood at each of the eight events', xLabel: 'Occultation', yLabel: 'Altitude at mid-event (°)',
  series: SITES.map((s) => ({ name: s.name.split(',')[1].trim(), kind: 'dots', size: 4, x: rows.map((_, i) => i + 1), y: rows.map((r) => { const a = r.at.find((q) => q.site === s.name).alt; return a > 0 ? a : null; }) })),
  xDomain: [0.5, 8.5], yDomain: [0, 90],
  xTicks: rows.map((_, i) => i + 1), xFmt: (i) => rows[i - 1].date.slice(2).replace(/-/g, '/').slice(0, 5),
  yTicks: [0, 30, 60, 90],
  hlines: [{ y: 30, text: 'airmass 2' }],
  desc: 'Altitude of the occulted star at the mid-time of each of the eight Ixion occultations, from Chile, Brazil, the USA and Australia. Points below the horizon are left out, which leaves exactly the continents the paper reports chords from.',
  height: 290,
});

console.log(JSON.stringify(rows, null, 1));
console.log(JSON.stringify(tracks.map((t) => ({ site: t.s.name, transit: t.p.transit.toISOString(), transitAlt: +t.p.transitAlt.toFixed(2), bestX: +t.p.bestX.toFixed(3), hoursBelowX2: +t.p.hoursBelow.toFixed(2), moonAtBest: +t.p.moonAtBest.toFixed(1) }))));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'night', figure(fig1, 'Figure 1. The occulted star through the night of 28 April 2021, worked out with the same positions the Target altitude planner uses. From Chile and Brazil the star passed almost overhead; from Illinois it never cleared 14°, which is airmass 4.'));
  md = inject(md, 'events', figure(fig2, 'Figure 2. The star\'s altitude at the mid-time of each of the eight occultations, from one site per continent. Where a point is missing the star was below the horizon. The pattern matches the regions the paper reports chords from.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
