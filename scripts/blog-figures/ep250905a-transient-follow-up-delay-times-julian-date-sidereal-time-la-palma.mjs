// Figures for src/blog/discoveries/ep250905a-transient-follow-up-delay-times-julian-date-sidereal-time-la-palma.md, made with
// the maths of the Astronomy time converter (src/tools/astro-time/Tool.astro: Julian Date from astronomy-engine's MakeTime,
// Greenwich and local sidereal time, and the barycentric light-time correction from BaryState) with lst, altAzJ2000, observer
// and airmass from src/lib/astro/sky.ts. sky.ts imports its neighbours without a file extension, so a loader hook is registered first.
// Run: node scripts/blog-figures/ep250905a-transient-follow-up-delay-times-julian-date-sidereal-time-la-palma.mjs
import fs from 'node:fs';
import { register } from 'node:module';
import * as A from 'astronomy-engine';
import { chart, figure, inject } from './svg.mjs';

const hooks = `export async function resolve(s,c,n){ if(s.endsWith('.json')) return n(s,{...c,importAttributes:{type:'json'}}); try{return await n(s,c);}catch(e){ if(s.startsWith('.')&&!/\\.\\w+$/.test(s)) return n(s+'.ts',c); throw e;} }
export async function load(u,c,n){ if(u.endsWith('.json')) return n(u,{...c,importAttributes:{type:'json'}}); return n(u,c);}`;
register('data:text/javascript,' + encodeURIComponent(hooks), import.meta.url);
const { lst, altAzJ2000, observer, airmass, toJNow } = await import('../../src/lib/astro/sky.ts');

const ART = new URL('../../src/blog/discoveries/ep250905a-transient-follow-up-delay-times-julian-date-sidereal-time-la-palma.md', import.meta.url);

// Inputs from the paper: Quirola-Vasquez et al. (2026), A&A 714: A294, doi:10.1051/0004-6361/202660911 (CC BY 4.0).
// T0 = 2025-09-05 11:07:08 UTC; optical counterpart 00h 17m 48.00s, +37d 28m 19.6s (J2000); the follow-up start times and the delays
// the paper prints (days) are listed below. Observatory position (La Palma, Roque de los Muchachos) is OUR assumption: 28.7567 N, 17.8920 W, 2267 m.
const T0 = new Date('2025-09-05T11:07:08Z');
const RA = (0 + 17 / 60 + 48.0 / 3600) * 15, DEC = 37 + 28 / 60 + 19.6 / 3600;
const SITE = { lat: 28.7567, lon: -17.892, elev: 2267, name: 'La Palma', tz: 'UTC' };
const OBS = [
  ['EP-FXT first look', '2025-09-05T11:13:53Z', 405 / 86400, 's'],
  ['EP-FXT second', '2025-09-06T10:22:38Z', 0.97],
  ['EP-FXT third', '2025-11-11T09:10:26Z', 67],
  ['EP-FXT fourth', '2025-11-27T12:09:41Z', 83],
  ['Swift-XRT', '2025-09-05T12:58:37Z', 1.86 / 24, 'h'],
  ['TRT', '2025-09-05T11:56:27.3Z', 0.04],
  ['LCO 1-m (r)', '2025-09-05T22:34:45.9Z', 0.49],
  ['GTC imaging E1', '2025-09-06T02:01:39Z', 0.62],
  ['GTC imaging E2', '2025-09-25T03:40:03Z', 19.7],
  ['GTC imaging E3', '2025-09-26T22:13:34Z', 21.5],
  ['GTC imaging E4', '2026-02-04T20:35:03Z', 152.4],
  ['GTC spectrum A', '2025-09-25T04:18:56Z', 19.72],
  ['GTC spectrum B', '2025-09-26T02:42:46Z', 20.65],
  ['GTC spectrum C', '2025-10-01T01:44:18Z', 25.61],
  ['NOT ALFOSC', '2025-10-01T01:54:46.8Z', 25.6],
  ['VLT X-shooter', '2025-09-30T03:52:47Z', 24.7],
].map(([name, iso, paper]) => ({ name, d: new Date(iso), paper }));

const jdUT = (d) => { const t = A.MakeTime(d); return t.ut + 2451545; };
const jdTT = (d) => { const t = A.MakeTime(d); return t.tt + 2451545; };
const LT = 499.004783836; // light seconds per au (the converter's constant)
const nvec = (ra, dec) => { const r = Math.PI / 180; return { x: Math.cos(dec * r) * Math.cos(ra * r), y: Math.cos(dec * r) * Math.sin(ra * r), z: Math.sin(dec * r) }; };
const n = nvec(RA, DEC);
const bary = (d) => { const t = A.MakeTime(d), b = A.BaryState(A.Body.Earth, t), h = A.HelioVector(A.Body.Earth, t); return { db: (b.x * n.x + b.y * n.y + b.z * n.z) * LT, dh: (h.x * n.x + h.y * n.y + h.z * n.z) * LT }; };
const obs = observer(SITE);
const altAt = (d) => altAzJ2000(RA, DEC, d, obs).alt;

const rows = OBS.map((o) => ({ ...o, days: (o.d - T0) / 86400e3, jd: jdUT(o.d), mjd: jdUT(o.d) - 2400000.5, lst: lst(o.d, SITE.lon), alt: altAt(o.d) }));
const t0 = { jdUT: jdUT(T0), mjd: jdUT(T0) - 2400000.5, jdTT: jdTT(T0), dT: (jdTT(T0) - jdUT(T0)) * 86400, gmst: A.SiderealTime(T0), ...bary(T0) };
t0.bjd = t0.jdTT + t0.db / 86400; t0.hjd = t0.jdUT + t0.dh / 86400;
const ecl = A.RotateVector(A.Rotation_EQJ_ECL(), A.VectorFromSphere(new A.Spherical(DEC, RA, 1), A.MakeTime(T0)));
const eclLat = A.SphereFromVector(ecl).lat;
console.log(JSON.stringify({ t0, eclLat, amp: LT * Math.cos(eclLat * Math.PI / 180) }, null, 1));
for (const r of rows) console.log(r.name.padEnd(20), r.days.toFixed(4), 'paper', r.paper, 'JD', r.jd.toFixed(5), 'LST', r.lst.toFixed(2), 'alt', r.alt.toFixed(1), 'X', airmass(r.alt).toFixed(2));

// Figure 1: the delays: computed against the paper's printed delays.
const lg = (v) => Math.log10(v);
const calc = rows.map((r) => lg(r.days)), pap = rows.map((r) => lg(r.paper));
const fig1 = chart({
  title: 'Delay after the trigger: paper against clock arithmetic', xLabel: 'Delay printed in the paper, log₁₀(days)', yLabel: 'Delay from the times, log₁₀(days)',
  series: [{ name: 'identity', kind: 'line', x: [-3, 2.5], y: [-3, 2.5], colour: 'var(--muted)', dash: '4 4', noLegend: true }, { name: '16 follow-up epochs', kind: 'dots', x: pap, y: calc, size: 3.5 }],
  xDomain: [-3, 2.5], yDomain: [-3, 2.5],
  desc: 'Each follow-up delay computed from the printed UTC start times plotted against the delay the paper prints. Every point lies on the identity line.', height: 280,
});
// Figure 2: the altitude of the counterpart from La Palma on the night of 5-6 Sep 2025 with GTC E1 marked; also 25 Sep.
const night = (day0) => Array.from({ length: 73 }, (_, i) => new Date(Date.UTC(2025, 8, day0, 18) + i * 600e3));
const hr = (d, base) => (d - base) / 3600e3;
const base5 = Date.UTC(2025, 8, 5, 18), base25 = Date.UTC(2025, 8, 24, 18);
const n5 = night(5), n24 = night(24);
const fig2 = chart({
  title: 'How high the counterpart stands from La Palma', xLabel: 'Hours after 18:00 UT on the evening', yLabel: 'Altitude (°)',
  series: [
    { name: 'night of 5-6 Sep 2025', kind: 'line', x: n5.map((d) => hr(d, base5)), y: n5.map((d) => +altAt(d).toFixed(2)) },
    { name: 'night of 24-25 Sep 2025', kind: 'line', x: n24.map((d) => hr(d, base25)), y: n24.map((d) => +altAt(d).toFixed(2)) },
  ],
  xDomain: [0, 12], yDomain: [0, 90],
  vlines: [{ x: hr(new Date('2025-09-06T02:01:39Z'), base5), text: 'GTC E1', left: true }, { x: hr(new Date('2025-09-25T03:40:03Z'), base25), text: 'E2' }],
  desc: 'Altitude of the transient position over two nights at La Palma, with the start times of the first two GTC imaging epochs marked.', height: 280,
});
// Figure 3: BJD correction through the year.
const days = Array.from({ length: 53 }, (_, i) => new Date(Date.UTC(2025, 0, 1) + i * 7 * 86400e3));
const fig3 = chart({
  title: 'The barycentric correction through the year', xLabel: 'Day of 2025', yLabel: 'BJD (TDB) − JD (TT), seconds',
  series: [{ name: 'light-time correction', kind: 'line', x: days.map((d, i) => i * 7), y: days.map((d) => +bary(d).db.toFixed(1)) }],
  xDomain: [0, 360], hlines: [{ y: 0, text: '' }], vlines: [{ x: (T0 - Date.UTC(2025, 0, 1)) / 86400e3, text: 'T0', left: true }],
  desc: `For a target at ecliptic latitude ${eclLat.toFixed(1)} degrees the correction swings between about plus and minus ${(LT * Math.cos(eclLat * Math.PI / 180)).toFixed(0)} seconds in a year; at the trigger date it is ${t0.db.toFixed(1)} seconds.`, height: 260,
});
// Sidereal day: the same sky returns 3 m 56 s earlier each day
const dLST = lst(new Date('2025-09-06T02:01:39Z'), SITE.lon) - lst(new Date('2025-09-05T02:01:39Z'), SITE.lon);
console.log('LST change per UT day (s):', (((dLST + 12) % 24) - 12) * 3600);
console.log('JNow shift on T0', toJNow(RA, DEC, T0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'delays', figure(fig1, 'Figure 1. The delay after T0 recomputed from each printed UTC start time (vertical) against the delay printed in the paper (horizontal), on logarithmic axes. The dashed line is perfect agreement.'));
  md = inject(md, 'altitude', figure(fig2, 'Figure 2. Altitude of the optical counterpart from La Palma (our assumed site position) on two nights, from the converter\'s sidereal time and the sky helper\'s altitude. The vertical lines mark the start times of the paper\'s first two GTC imaging epochs.'));
  md = inject(md, 'bjd', figure(fig3, 'Figure 3. The barycentric light-time correction for the counterpart over 2025, worked out as the converter does. T0 falls near the autumn end of the swing.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
