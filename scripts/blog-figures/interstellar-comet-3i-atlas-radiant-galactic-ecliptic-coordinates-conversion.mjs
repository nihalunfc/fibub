// Figures for src/blog/discoveries/interstellar-comet-3i-atlas-radiant-galactic-ecliptic-coordinates-conversion.md, made with
// the maths of the Sky coordinate converter: its frame rotations (astronomy-engine Rotation_EQJ_GAL, Rotation_EQJ_ECL and their
// inverses, exactly as src/tools/sky-coordinates/Tool.astro applies them) and toJNow / constellation / separation from
// src/lib/astro/sky.ts. sky.ts imports its neighbours without a file extension, so a tiny loader hook is registered first.
// Run: node scripts/blog-figures/interstellar-comet-3i-atlas-radiant-galactic-ecliptic-coordinates-conversion.mjs
import fs from 'node:fs';
import { register } from 'node:module';
import * as A from 'astronomy-engine';
import { sexa } from '../../src/lib/astro/place.ts';
import { chart, figure, inject } from './svg.mjs';

const hooks = `export async function resolve(s,c,n){ if(s.endsWith('.json')) return n(s,{...c,importAttributes:{type:'json'}}); try{return await n(s,c);}catch(e){ if(s.startsWith('.')&&!/\\.\\w+$/.test(s)) return n(s+'.ts',c); throw e;} }
export async function load(u,c,n){ if(u.endsWith('.json')) return n(u,{...c,importAttributes:{type:'json'}}); return n(u,c);}`;
register('data:text/javascript,' + encodeURIComponent(hooks), import.meta.url);
const { toJNow, constellation, separation } = await import('../../src/lib/astro/sky.ts');

const ART = new URL('../../src/blog/discoveries/interstellar-comet-3i-atlas-radiant-galactic-ecliptic-coordinates-conversion.md', import.meta.url);

// Inputs from the paper: de la Fuente Marcos et al. (2025), A&A 700: L9, doi:10.1051/0004-6361/202556439 (CC BY 4.0).
// Radiant (the direction the orbit is projected back to): RA 19h 40m 10.2s, Dec -19d 04m 13.4s (J2000); ecliptic lambda 293.603,
// beta +2.340; Galactic l 20.726, b -19.057. Heliocentric Galactic velocity (U, V, W) = (-51.233, -19.456, +18.930) km/s.
const RA = (19 + 40 / 60 + 10.2 / 3600) * 15, DEC = -(19 + 4 / 60 + 13.4 / 3600);
const P = { l: 20.726, b: -19.057, lam: 293.603, beta: 2.340 }, UVW = [-51.233, -19.456, 18.930];
const J2000 = new Date('2000-01-01T12:00:00Z');

const vec = (lon, lat) => A.VectorFromSphere(new A.Spherical(lat, lon, 1), A.MakeTime(J2000));
const sph = (v) => { const s = A.SphereFromVector(v); return { lon: ((s.lon % 360) + 360) % 360, lat: s.lat }; };
const toGal = (ra, dec) => sph(A.RotateVector(A.Rotation_EQJ_GAL(), vec(ra, dec)));
const toEcl = (ra, dec) => sph(A.RotateVector(A.Rotation_EQJ_ECL(), vec(ra, dec)));
const fromGal = (l, b) => sph(A.RotateVector(A.Rotation_GAL_EQJ(), vec(l, b)));
const fromEcl = (l, b) => sph(A.RotateVector(A.Rotation_ECL_EQJ(), vec(l, b)));

const g = toGal(RA, DEC), e = toEcl(RA, DEC);
const back1 = fromGal(P.l, P.b), back2 = fromEcl(P.lam, P.beta);
const speed = Math.hypot(...UVW), lFromV = (((Math.atan2(UVW[1], UVW[0]) * 180) / Math.PI + 180) % 360 + 360) % 360, bFromV = (-Math.asin(UVW[2] / speed) * 180) / Math.PI;
const con = constellation(RA, DEC);
const GC = { ra: 266.40499, dec: -28.93617 }; // Galactic centre J2000 (Sgr A*), our value
const sepGC = separation(RA, DEC, GC.ra, GC.dec);
const j = (iso) => toJNow(RA, DEC, new Date(iso));
const jn = j('2025-07-02T00:00:00Z');
const o = {
  eq: { raDeg: RA, decDeg: DEC, raStr: sexa(RA / 15, 'h'), decStr: sexa(DEC, 'd') },
  gal: g, ecl: e, fromGalToEq: { ra: back1.lon, dec: back1.lat, raStr: sexa(back1.lon / 15, 'h'), decStr: sexa(back1.lat, 'd') },
  fromEclToEq: { ra: back2.lon, dec: back2.lat, raStr: sexa(back2.lon / 15, 'h'), decStr: sexa(back2.lat, 'd') },
  speed, lFromV, bFromV, con: con.name, sepGC, jnow: { ra: jn.ra, dec: jn.dec, raStr: sexa(jn.ra / 15, 'h'), decStr: sexa(jn.dec, 'd'), dRaArcmin: (jn.ra - RA) * 60, dDecArcmin: (jn.dec - DEC) * 60 },
};
console.log(JSON.stringify(o, null, 1));

// Figure 1: Galactic l-b map with the ecliptic, the Galactic centre and the radiant.
const wrap = (l) => (l > 180 ? l - 360 : l);
const lam = Array.from({ length: 721 }, (_, i) => i * 0.5);
const eclGal = lam.map((x) => toGal(fromEcl(x, 0).lon, fromEcl(x, 0).lat));
const ex = [], ey = [];
eclGal.forEach((p) => { const l = wrap(p.lon); if (l > -50 && l < 70) { ex.push(+l.toFixed(2)); ey.push(+p.lat.toFixed(2)); } });
const ord = ex.map((x, i) => [x, ey[i]]).sort((a, b) => a[0] - b[0]);
const fig1 = chart({
  title: 'Where the radiant sits on the Galactic map', xLabel: 'Galactic longitude l (°)', yLabel: 'Galactic latitude b (°)',
  series: [
    { name: 'Ecliptic (planets’ plane)', kind: 'line', x: ord.map((p) => p[0]), y: ord.map((p) => p[1]) },
    { name: 'Galactic centre', kind: 'dots', x: [0], y: [0], size: 5, colour: 'var(--ink)' },
    { name: '3I/ATLAS radiant', kind: 'dots', x: [g.lon], y: [g.lat], size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [-40, 60], yDomain: [-45, 45], hlines: [{ y: 0, text: 'Galactic plane' }],
  desc: `A map in Galactic coordinates. The ecliptic crosses the Galactic plane near l = 6 degrees. The 3I/ATLAS radiant sits at l = ${g.lon.toFixed(2)}, b = ${g.lat.toFixed(2)}, about ${sepGC.toFixed(0)} degrees from the Galactic centre and ${Math.abs(e.lat).toFixed(1)} degrees from the ecliptic.`, height: 290,
});
// Figure 2: precession of the radiant since J2000.
const years = Array.from({ length: 51 }, (_, i) => 2000 + i);
const sh = years.map((y) => toJNow(RA, DEC, new Date(Date.UTC(y, 0, 1))));
const fig2 = chart({
  title: 'Why J2000 and “of date” differ', xLabel: 'Year', yLabel: 'Shift since J2000 (arcminutes)',
  series: [{ name: 'RA shift', kind: 'line', x: years, y: sh.map((s) => +((s.ra - RA) * 60).toFixed(3)) }, { name: 'Dec shift', kind: 'line', x: years, y: sh.map((s) => +((s.dec - DEC) * 60).toFixed(3)) }],
  xDomain: [2000, 2050], hlines: [{ y: 0, text: '' }],
  desc: `How far the same point on the sky moves in the right ascension and declination of date. By 2025 the radiant has moved ${((sh[25].ra - RA) * 60).toFixed(1)} arcminutes in right ascension and ${((sh[25].dec - DEC) * 60).toFixed(1)} in declination.`, height: 260,
});
console.log('shift 2025.0', ((sh[25].ra - RA) * 60).toFixed(2), ((sh[25].dec - DEC) * 60).toFixed(2), 'shift 2050', ((sh[50].ra - RA) * 60).toFixed(2), ((sh[50].dec - DEC) * 60).toFixed(2));
// plane crossing of ecliptic
const crossing = ord.reduce((best, p, i) => (i && Math.abs(p[1]) < Math.abs(best[1]) ? p : best), ord[0]);
console.log('ecliptic crosses b=0 near l', crossing);
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'map', figure(fig1, 'Figure 1. Galactic longitude and latitude of the ecliptic (the line of the planets’ orbits, converted point by point with the converter\'s rotations), the Galactic centre and the radiant of 3I/ATLAS from the paper.'));
  md = inject(md, 'precession', figure(fig2, 'Figure 2. The position of the radiant in right ascension and declination of date, measured from its J2000 value, for 2000 to 2050.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
