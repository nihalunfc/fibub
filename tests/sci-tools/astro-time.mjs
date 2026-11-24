// #T22 Astronomy time converter (src/tools/astro-time/Tool.astro: Julian Date and MJD from astronomy-engine's MakeTime, sidereal time,
// and the barycentric / heliocentric light-time correction from BaryState and HelioVector). Pinned to the follow-up times of the
// fast X-ray transient EP250905a in Quirola-Vasquez et al. (2026), A&A 714: A294, doi:10.1051/0004-6361/202660911 (CC BY 4.0), used in
// /blog/discoveries/ep250905a-transient-follow-up-delay-times-julian-date-sidereal-time-la-palma/.
// sky.ts imports its neighbours without a file extension, so a small loader hook is registered before it is imported.
import { register } from 'node:module';
import * as A from 'astronomy-engine';

const hooks = `export async function resolve(s,c,n){ if(s.endsWith('.json')) return n(s,{...c,importAttributes:{type:'json'}}); try{return await n(s,c);}catch(e){ if(s.startsWith('.')&&!/\\.\\w+$/.test(s)) return n(s+'.ts',c); throw e;} }
export async function load(u,c,n){ if(u.endsWith('.json')) return n(u,{...c,importAttributes:{type:'json'}}); return n(u,c);}`;

export default async (check) => {
  register('data:text/javascript,' + encodeURIComponent(hooks), import.meta.url);
  const { lst, altAzJ2000, observer, airmass } = await import('../../src/lib/astro/sky.ts');
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const jdUT = (iso) => A.MakeTime(new Date(iso)).ut + 2451545;
  const T0 = '2025-09-05T11:07:08Z';
  check('astro-time: T0 of EP250905a is JD 2460923.96329 and MJD 60923.46329 (unix time ÷ 86400 + 2440587.5)', near(jdUT(T0), 2460923.96329, 1e-5) && near(jdUT(T0), Date.parse(T0) / 864e5 + 2440587.5, 1e-9));
  const delays = [['2025-09-06T10:22:38Z', 0.97], ['2025-09-06T02:01:39Z', 0.62], ['2025-09-25T03:40:03Z', 19.7], ['2025-09-26T22:13:34Z', 21.5], ['2026-02-04T20:35:03Z', 152.4], ['2025-09-25T04:18:56Z', 19.72], ['2025-09-26T02:42:46Z', 20.65], ['2025-10-01T01:44:18Z', 25.61], ['2025-09-30T03:52:47Z', 24.7], ['2025-11-27T12:09:41Z', 83]];
  check('astro-time: ten follow-up delays recomputed from Julian Dates agree with the days the paper prints (to its rounding)', delays.every(([iso, d]) => near(jdUT(iso) - jdUT(T0), d, 0.05)));
  check('astro-time: the first X-ray look is 405 s (0.0047 d) after T0', near((jdUT('2025-09-05T11:13:53Z') - jdUT(T0)) * 86400, 405, 1e-3));
  const lon = -17.892, d1 = '2025-09-05T02:01:39Z', d2 = '2025-09-06T02:01:39Z';
  const gain = (((lst(new Date(d2), lon) - lst(new Date(d1), lon)) + 12) % 24 + 24) % 24 - 12;
  check('astro-time: local sidereal time gains 3 m 56.56 s of sidereal time per solar day', near(gain * 3600, 236.555, 0.02));
  check('astro-time: Greenwich sidereal time at 2025-09-06 02:01:39 UT is 01h 03m 21s', near(A.SiderealTime(new Date(d2)), 1 + 3 / 60 + 21 / 3600, 2 / 3600));
  const obs = observer({ lat: 28.7567, lon, elev: 2267, name: '', tz: 'UTC' });
  const alt = altAzJ2000((17 / 60 + 48 / 3600) * 15, 37 + 28 / 60 + 19.6 / 3600, new Date(d2), obs).alt;
  check('astro-time: the EP250905a counterpart stood 79.5° high (airmass 1.02) from La Palma at the first GTC imaging epoch', near(alt, 79.5, 0.1) && near(airmass(alt), 1.02, 0.01));
  const ra = (17 / 60 + 48 / 3600) * 15, dec = 37 + 28 / 60 + 19.6 / 3600, r = Math.PI / 180, n = { x: Math.cos(dec * r) * Math.cos(ra * r), y: Math.cos(dec * r) * Math.sin(ra * r), z: Math.sin(dec * r) };
  const t = A.MakeTime(new Date(T0)), b = A.BaryState(A.Body.Earth, t), h = A.HelioVector(A.Body.Earth, t);
  const db = (b.x * n.x + b.y * n.y + b.z * n.z) * 499.004783836, dh = (h.x * n.x + h.y * n.y + h.z * n.z) * 499.004783836;
  check('astro-time: light-time to the Solar System barycentre for the counterpart on 2025-09-05 is +333.5 s (heliocentre +335.8 s), under 499 s × cos β = 422 s', near(db, 333.5, 0.1) && near(dh, 335.8, 0.1) && Math.abs(db) < 422.1);

  // Terrestrial Time comes from the leap-second table, not a predicted-dT polynomial: writing the article
  // showed the polynomial reading 74.9 s for September 2025 where TT - UTC is exactly 69.184 s.
  const TT = await import('../../src/lib/sci/ttscale.ts');
  check('astro-time: TT - UTC is exactly 69.184 s for the trigger date, not the 74.9 s a predicted-dT model gives',
    TT.ttMinusUtc(new Date('2025-09-05T18:26:07Z')) === 69.184 && TT.taiMinusUtc(new Date('2025-09-05T18:26:07Z')) === 37);
  check('astro-time: the leap-second table steps at the right dates (36 s in 2016, 37 s from 2017, 32 s in 2000)',
    TT.taiMinusUtc(Date.UTC(2016, 5, 1)) === 36 && TT.taiMinusUtc(Date.UTC(2017, 0, 1)) === 37 && TT.taiMinusUtc(Date.UTC(2000, 0, 1)) === 32);
};
