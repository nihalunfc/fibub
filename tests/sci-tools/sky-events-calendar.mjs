// #T16 Sky events calendar (src/lib/astro/sky.ts monthEvents: Moon quarters, apsides and local solar eclipses from astronomy-engine) and the Sun
// position maths of src/lib/astro/sun.ts. Pinned to the partial eclipse of 29 March 2025 at IRSOL, Locarno, and the pinhole geometry in
// Sigismondi (2025), Histories 5(4): 48, doi:10.3390/histories5040048 (CC BY 4.0), used in
// /blog/discoveries/pinhole-sun-images-partial-eclipse-locarno-2025-sunspot-visibility-geometry/.
// sky.ts imports its neighbours without a file extension, so a small loader hook is registered before it is imported.
import { register } from 'node:module';
import * as A from 'astronomy-engine';
import { sunDay } from '../../src/lib/astro/sun.ts';

const hooks = `export async function resolve(s,c,n){ if(s.endsWith('.json')) return n(s,{...c,importAttributes:{type:'json'}}); try{return await n(s,c);}catch(e){ if(s.startsWith('.')&&!/\\.\\w+$/.test(s)) return n(s+'.ts',c); throw e;} }
export async function load(u,c,n){ if(u.endsWith('.json')) return n(u,{...c,importAttributes:{type:'json'}}); return n(u,c);}`;

export default async (check) => {
  register('data:text/javascript,' + encodeURIComponent(hooks), import.meta.url);
  const { monthEvents } = await import('../../src/lib/astro/sky.ts');
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const LOC = { name: 'IRSOL Locarno', lat: 46.1775, lon: 8.7878, elev: 360, tz: 'Europe/Zurich' };
  const mar = monthEvents(LOC, 2025, 3), may = monthEvents(LOC, 2025, 5);
  const ec = mar.find((e) => e.kind === 'eclipse' && /solar/.test(e.title)), nm = mar.find((e) => e.title === 'New Moon');
  check('sky-events: Locarno sees a partial solar eclipse on 2025-03-29 at 11:05:19 UT, 11 % of the Sun covered, 7 minutes after the New Moon', ec && ec.date.toISOString().slice(0, 19) === '2025-03-29T11:05:19' && /^11%/.test(ec.detail) && near((ec.date - nm.date) / 60e3, 6.9, 0.1));
  const R = { sun: 695700, moon: 1737.4 }, AU = 149597870.7, RAD = Math.PI / 180, obs = new A.Observer(LOC.lat, LOC.lon, LOC.elev);
  const mag = (d) => {
    const t = A.MakeTime(d), s = A.Equator('Sun', t, obs, true, true), m = A.Equator('Moon', t, obs, true, true);
    const rs = Math.asin(R.sun / (s.dist * AU)) / RAD, rm = Math.asin(R.moon / (m.dist * AU)) / RAD;
    const c = Math.sin(s.dec * RAD) * Math.sin(m.dec * RAD) + Math.cos(s.dec * RAD) * Math.cos(m.dec * RAD) * Math.cos((s.ra - m.ra) * 15 * RAD);
    return (rs + rm - Math.acos(Math.min(1, c)) / RAD) / (2 * rs);
  };
  check('sky-events: eclipse magnitude at Locarno is 0.210 at maximum (paper: 21 %) and 0.150 twenty-three minutes later (paper: 15.2 %)', near(mag(ec.date), 0.2097, 5e-4) && near(mag(new Date(ec.date.getTime() + 23 * 60e3)), 0.1497, 1e-3));
  const fq = may.find((e) => e.title === 'First quarter'), pg = may.find((e) => /perigee/.test(e.title));
  check('sky-events: May 2025 first quarter 4 May 13:52 UT and perigee 26 May 01:35 UT at 359,014 km', fq.date.toISOString().slice(0, 16) === '2025-05-04T13:52' && pg.date.toISOString().slice(0, 16) === '2025-05-26T01:34' && /359,014/.test(pg.detail));
  const rome = { name: 'Rome', lat: 41.9035, lon: 12.4955, elev: 20, tz: 'Europe/Rome' }, flo = { name: 'Florence', lat: 43.7731, lon: 11.256, elev: 50, tz: 'Europe/Rome' };
  const sr = sunDay(rome, '2025-05-30'), sf = sunDay(flo, '2025-06-21');
  check('sky-events: the Sun stands 69.9° high at Rome noon on 30 May 2025 and 69.7° at Florence on the June solstice (90° − latitude + declination)', near(sr.noonAlt, 69.95, 0.05) && near(sr.noonAlt, 90 - rome.lat + sr.decl, 0.1) && near(sf.noonAlt, 69.67, 0.05) && near(sf.noonAlt, 90 - flo.lat + sf.decl, 0.1));
  const th = (d) => 2 * Math.asin(R.sun / (A.Equator('Sun', A.MakeTime(new Date(d)), new A.Observer(rome.lat, rome.lon, 20), true, true).dist * AU));
  check('sky-events: the Sun is 31.67′ wide on 9 May 2025, so a 105 cm image at 5.4 m means a telescope magnification of 21.1', near(th('2025-05-09T14:04:00Z') / RAD * 60, 31.67, 0.01) && near(1.05 / (5.4 * th('2025-05-09T14:04:00Z')), 21.1, 0.05));
};
