// #T23 Sky coordinate converter (the frame rotations in src/tools/sky-coordinates/Tool.astro, astronomy-engine, plus toJNow
// from src/lib/astro/sky.ts). Pinned to the radiant of interstellar comet 3I/ATLAS in de la Fuente Marcos et al. (2025),
// A&A 700: L9, doi:10.1051/0004-6361/202556439 (CC BY 4.0), used in
// /blog/discoveries/interstellar-comet-3i-atlas-radiant-galactic-ecliptic-coordinates-conversion/.
// sky.ts imports its neighbours without a file extension, so a small loader hook is registered before it is imported.
import { register } from 'node:module';
import * as A from 'astronomy-engine';

const hooks = `export async function resolve(s,c,n){ if(s.endsWith('.json')) return n(s,{...c,importAttributes:{type:'json'}}); try{return await n(s,c);}catch(e){ if(s.startsWith('.')&&!/\\.\\w+$/.test(s)) return n(s+'.ts',c); throw e;} }
export async function load(u,c,n){ if(u.endsWith('.json')) return n(u,{...c,importAttributes:{type:'json'}}); return n(u,c);}`;

export default async (check) => {
  register('data:text/javascript,' + encodeURIComponent(hooks), import.meta.url);
  const { toJNow, fromJNow, constellation, separation } = await import('../../src/lib/astro/sky.ts');
  const t0 = A.MakeTime(new Date('2000-01-01T12:00:00Z'));
  const vec = (lon, lat) => A.VectorFromSphere(new A.Spherical(lat, lon, 1), t0);
  const sph = (v) => { const s = A.SphereFromVector(v); return { lon: ((s.lon % 360) + 360) % 360, lat: s.lat }; };
  const toGal = (ra, dec) => sph(A.RotateVector(A.Rotation_EQJ_GAL(), vec(ra, dec))), toEcl = (ra, dec) => sph(A.RotateVector(A.Rotation_EQJ_ECL(), vec(ra, dec)));
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const ra = (19 + 40 / 60 + 10.2 / 3600) * 15, dec = -(19 + 4 / 60 + 13.4 / 3600);
  const g = toGal(ra, dec), e = toEcl(ra, dec);
  check('sky-coordinates: 3I/ATLAS radiant 19h 40m 10.2s, −19° 04′ 13.4″ is Galactic l 20.724°, b −19.057° (paper 20.726, −19.057)', near(g.lon, 20.7237, 1e-3) && near(g.lat, -19.0566, 1e-3) && near(g.lon, 20.726, 0.005));
  check('sky-coordinates: the same point is ecliptic λ 293.603°, β +2.340° (paper 293.603, +2.340)', near(e.lon, 293.6028, 1e-3) && near(e.lat, 2.3404, 1e-3));
  check('sky-coordinates: it lies in Sagittarius, 27.87° from the Galactic centre', constellation(ra, dec).name === 'Sagittarius' && near(separation(ra, dec, 266.40499, -28.93617), 27.868, 0.01));
  const back = A.SphereFromVector(A.RotateVector(A.Rotation_GAL_EQJ(), vec(20.726, -19.057)));
  check('sky-coordinates: Galactic l 20.726°, b −19.057° converts back to within 10″ of the paper’s RA and Dec', near(((back.lon % 360) + 360) % 360, ra, 0.0028) && near(back.lat, dec, 0.0028));
  const U = -51.233, V = -19.456, W = 18.930, sp = Math.hypot(U, V, W);
  check('sky-coordinates: the paper’s (U, V, W) has speed 57.980 km/s and points back to b −19.056° (paper b −19.057°)', near(sp, 57.980, 0.001) && near(-Math.asin(W / sp) * 180 / Math.PI, -19.0559, 1e-3));
  const n = toJNow(ra, dec, new Date('2025-07-02T00:00:00Z'));
  check('sky-coordinates: of date on 2025-07-02 the radiant is 19h 41m 39.5s, −19° 00′ 42.8″ (22.3′ and 3.5′ from J2000)', near(n.ra, 295.4147, 1e-3) && near(n.dec, -19.0119, 1e-3));
  const r = fromJNow(n.ra, n.dec, new Date('2025-07-02T00:00:00Z'));
  check('sky-coordinates: J2000 to of-date and back returns the start to 1e-9°', near(r.ra, ra, 1e-9) && near(r.dec, dec, 1e-9));
};
