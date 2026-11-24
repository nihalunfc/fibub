// Figures for src/blog/discoveries/april-2024-solar-eclipse-obscuration-tec-depletion-local-times.md, made with
// the maths of the Eclipse finder (src/lib/astro/eclipses.ts: solarEclipses, sunMoon, overlap) and the Sun
// position calculator (src/lib/astro/sun.ts: sunAltAz).
// Run: node scripts/blog-figures/april-2024-solar-eclipse-obscuration-tec-depletion-local-times.mjs
import fs from 'node:fs';
import { solarEclipses, sunMoon, overlap } from '../../src/lib/astro/eclipses.ts';
import { sunAltAz } from '../../src/lib/astro/sun.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/april-2024-solar-eclipse-obscuration-tec-depletion-local-times.md', import.meta.url);

// The paper's VLF receiving station: Sanyal et al. (2025), Atmosphere 16(2): 161, doi:10.3390/atmos16020161 (CC BY 4.0).
// It states 36.99 N, 76.95 W, 30 m, with first contact 18:02:53, maximum 19:19:19 and last contact 20:31:48 UT,
// and an eclipse magnitude of 0.834 at maximum.
const SITE = { name: 'VLF station, southeastern Virginia', lat: 36.99, lon: -76.95, elev: 30, tz: 'UTC' };
const PAPER = { first: '18:02:53', max: '19:19:19', last: '20:31:48', magnitude: 0.834 };

const [E] = solarEclipses(SITE, Date.UTC(2024, 3, 1), Date.UTC(2024, 3, 30));
const hhmmss = (d) => d.toISOString().slice(11, 19);
const hrs = (d) => (d.getTime() - Date.UTC(2024, 3, 8)) / 3600e3;

// Obscuration minute by minute from first to last contact: the Moon's disc over the Sun's, from the place.
const t0 = E.begin.getTime(), t1 = E.end.getTime();
const steps = Array.from({ length: 151 }, (_, i) => new Date(t0 + ((t1 - t0) * i) / 150));
const series = steps.map((t) => {
  const sm = sunMoon(SITE, t);
  return { h: hrs(t), obsc: overlap(sm.rSun, sm.rMoon, Math.hypot(sm.east, sm.north)) * 100 };
});

// Greatest obscuration along the 76.95 W meridian: why the paper's stations saw 90 to 100 %.
const lats = [];
for (let lat = 26; lat <= 50.001; lat += 1) {
  const [e] = solarEclipses({ ...SITE, lat }, Date.UTC(2024, 3, 1), Date.UTC(2024, 3, 30));
  lats.push({ lat, obsc: e.obscuration * 100, kind: e.kind, peak: hrs(e.peak) });
}

const sun = sunAltAz(SITE, E.peak);
const tool = {
  kind: E.kind, globalKind: E.globalKind,
  first: hhmmss(E.begin), max: hhmmss(E.peak), last: hhmmss(E.end),
  obscuration: +(E.obscuration * 100).toFixed(2), magnitude: +E.magnitude.toFixed(4),
  sunAltPeak: +sun.alt.toFixed(2), sunAzPeak: +sun.az.toFixed(2),
  greatest: { lat: +E.greatest.lat.toFixed(2), lon: +E.greatest.lon.toFixed(2) },
  lengthMin: +((t1 - t0) / 60e3).toFixed(1),
  diffSec: { first: (E.begin.getTime() - Date.parse(`2024-04-08T${PAPER.first}Z`)) / 1000, max: (E.peak.getTime() - Date.parse(`2024-04-08T${PAPER.max}Z`)) / 1000, last: (E.end.getTime() - Date.parse(`2024-04-08T${PAPER.last}Z`)) / 1000 },
  totalLat: lats.filter((l) => l.kind === 'total').map((l) => l.lat),
  at40: lats.find((l) => l.lat === 40).obsc, at30: lats.find((l) => l.lat === 30).obsc,
};

const fig1 = chart({
  title: 'The Sun covered, as the paper’s VLF station saw it', xLabel: 'Time on 8 April 2024 (UT, hours)', yLabel: 'Sun’s area covered (%)',
  series: [{ name: 'Obscuration', kind: 'line', x: series.map((s) => s.h), y: series.map((s) => +s.obsc.toFixed(2)) }],
  xDomain: [17.9, 20.7], yDomain: [0, 90],
  xFmt: (v) => `${String(Math.floor(v)).padStart(2, '0')}:${String(Math.round((v % 1) * 60)).padStart(2, '0')}`,
  xTicks: [18, 18.5, 19, 19.5, 20, 20.5],
  vlines: [
    { x: hrs(E.begin), text: `first contact ${tool.first}` },
    { x: hrs(E.peak), text: `maximum ${tool.max}`, dy: 14 },
    { x: hrs(E.end), text: `last contact ${tool.last}`, left: true, dy: 28 },
  ],
  hlines: [{ y: tool.obscuration, text: `${tool.obscuration.toFixed(1)} % at maximum` }],
  desc: `Share of the Sun's area covered by the Moon at the paper's VLF station in southeastern Virginia, minute by minute, peaking at ${tool.obscuration.toFixed(1)} per cent at ${tool.max} UT.`,
  height: 290,
});

const fig2 = chart({
  title: 'Greatest obscuration along the 76.95° W meridian', xLabel: 'Latitude (°N)', yLabel: 'Sun’s area covered at maximum (%)',
  series: [{ name: 'Obscuration', kind: 'line', x: lats.map((l) => l.lat), y: lats.map((l) => +l.obsc.toFixed(2)) }],
  xDomain: [26, 50], yDomain: [30, 102],
  vlines: [{ x: SITE.lat, text: 'the VLF station', dy: 14 }],
  hlines: [{ y: 100, text: 'totality' }],
  desc: 'Greatest obscuration against latitude along the longitude of the paper\'s VLF station. It climbs from under 50 per cent in Florida to 100 per cent on the path of totality near 43 to 44 degrees north.',
  height: 280,
});

console.log(JSON.stringify({ tool, paper: PAPER, sampleLats: lats.filter((l) => l.lat % 4 === 2 || l.kind === 'total').map((l) => ({ lat: l.lat, obsc: +l.obsc.toFixed(1), kind: l.kind })) }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curve', figure(fig1, `Figure 1. The Sun's covered area through the eclipse at the paper's VLF station (36.99° N, 76.95° W), worked out with the Eclipse finder's maths. The dashed lines are the tool's own contact times, which land within four seconds of the three times the paper states.`));
  md = inject(md, 'lat', figure(fig2, 'Figure 2. How much of the Sun was covered at greatest eclipse, against latitude, along the station’s meridian. The paper’s result that the ionospheric depletion grows with obscuration is a statement about this curve.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
