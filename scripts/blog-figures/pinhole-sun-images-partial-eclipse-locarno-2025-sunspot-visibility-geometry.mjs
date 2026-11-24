// Figures for src/blog/discoveries/pinhole-sun-images-partial-eclipse-locarno-2025-sunspot-visibility-geometry.md, made with
// the maths of the Sky events calendar (src/lib/astro/sky.ts: monthEvents, whose local-eclipse and Moon-quarter events come from
// astronomy-engine) and of the Sun position calculator (src/lib/astro/sun.ts: sunDay, sunAltAz with the Sun's distance).
// sky.ts imports its neighbours without a file extension, so a tiny loader hook is registered first.
// Run: node scripts/blog-figures/pinhole-sun-images-partial-eclipse-locarno-2025-sunspot-visibility-geometry.mjs
import fs from 'node:fs';
import { register } from 'node:module';
import * as A from 'astronomy-engine';
import { sunDay, sunAltAz } from '../../src/lib/astro/sun.ts';
import { chart, figure, inject } from './svg.mjs';

const hooks = `export async function resolve(s,c,n){ if(s.endsWith('.json')) return n(s,{...c,importAttributes:{type:'json'}}); try{return await n(s,c);}catch(e){ if(s.startsWith('.')&&!/\\.\\w+$/.test(s)) return n(s+'.ts',c); throw e;} }
export async function load(u,c,n){ if(u.endsWith('.json')) return n(u,{...c,importAttributes:{type:'json'}}); return n(u,c);}`;
register('data:text/javascript,' + encodeURIComponent(hooks), import.meta.url);
const { monthEvents } = await import('../../src/lib/astro/sky.ts');

const ART = new URL('../../src/blog/discoveries/pinhole-sun-images-partial-eclipse-locarno-2025-sunspot-visibility-geometry.md', import.meta.url);

// Inputs from the paper: Sigismondi (2025), Histories 5(4): 48, doi:10.3390/histories5040048 (CC BY 4.0 per Crossref): partial eclipse of
// 29 March 2025 at IRSOL, Locarno, "21 % of magnitude 23 min before this photo", naked-eye "15.2 % of eclipse through that cloud";
// 9 May 2025 projection 105 cm at 5.4 m with a 20 x 60 telescope; plane-tree pinhole about 58 mm, image about 300 mm at about 30 m;
// Clementine Gnomon (Rome) pinhole 25 mm, image 220 mm on 30 May 2025; Florence pinhole at 90 m height, image about 1 m; AR 4079
// 1250 MH, about 150 x 50 arcsec with penumbra; sunspot visibility limit about 100 MH; eye resolution about 0.5 arcmin.
// OUR assumptions: IRSOL position 46.1775 N, 8.7878 E, 360 m; the Clementine pinhole height 20.3 m (public value, not in the paper); Rome
// 41.9035 N, 12.4955 E; Florence 43.7731 N, 11.2560 E; Sun radius 695,700 km and Moon radius 1737.4 km.
const LOC = { name: 'IRSOL Locarno', lat: 46.1775, lon: 8.7878, elev: 360, tz: 'Europe/Zurich' };
const ROME = { name: 'Rome', lat: 41.9035, lon: 12.4955, elev: 20, tz: 'Europe/Rome' }, FLO = { name: 'Florence', lat: 43.7731, lon: 11.256, elev: 50, tz: 'Europe/Rome' };
const R = { sun: 695700, moon: 1737.4 }, AU = 149597870.7, RAD = Math.PI / 180;

// A. The partial eclipse.
const ev = monthEvents(LOC, 2025, 3).find((e) => e.kind === 'eclipse' && /solar/.test(e.title));
const nm = monthEvents(LOC, 2025, 3).find((e) => e.title === 'New Moon');
const obs = new A.Observer(LOC.lat, LOC.lon, LOC.elev);
const peak = ev.date;
function state(d) {
  const t = A.MakeTime(d), s = A.Equator('Sun', t, obs, true, true), m = A.Equator('Moon', t, obs, true, true);
  const rs = Math.asin(R.sun / (s.dist * AU)) / RAD, rm = Math.asin(R.moon / (m.dist * AU)) / RAD;
  const c = Math.sin(s.dec * RAD) * Math.sin(m.dec * RAD) + Math.cos(s.dec * RAD) * Math.cos(m.dec * RAD) * Math.cos((s.ra - m.ra) * 15 * RAD);
  const sep = Math.acos(Math.min(1, c)) / RAD, mag = (rs + rm - sep) / (2 * rs);
  // Overlap area of two discs (radii rs, rm; centre separation sep) over the Sun's disc area.
  let ob = 0;
  if (sep < rs + rm) {
    if (sep <= Math.abs(rs - rm)) ob = Math.min(1, (rm / rs) ** 2);
    else {
      const a1 = Math.acos((sep * sep + rs * rs - rm * rm) / (2 * sep * rs)), a2 = Math.acos((sep * sep + rm * rm - rs * rs) / (2 * sep * rm));
      const area = rs * rs * a1 + rm * rm * a2 - 0.5 * Math.sqrt((-sep + rs + rm) * (sep + rs - rm) * (sep - rs + rm) * (sep + rs + rm));
      ob = area / (Math.PI * rs * rs);
    }
  }
  return { mag, ob, rs, rm, sep };
}
const at = (min) => state(new Date(peak.getTime() + min * 60e3));
const p0 = at(0);
// minute after maximum at which the magnitude has fallen to 0.152
let lo = 0, hi = 60; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; at(mid).mag > 0.152 ? (lo = mid) : (hi = mid); }
const t152 = (lo + hi) / 2;
const mins = Array.from({ length: 101 }, (_, i) => -50 + i);
const MAG = mins.map((m) => Math.max(0, at(m).mag)), OB = mins.map((m) => at(m).ob);

// B. Sun's angular size and the pinhole geometry.
const theta = (d, place) => { const s = sunAltAz(place, d); return 2 * Math.asin(R.sun / (s.dist * AU)); }; // radians
const th9May = theta(new Date('2025-05-09T14:04:00Z'), ROME), th30May = theta(new Date('2025-05-30T10:30:00Z'), ROME), thTree = theta(new Date('2025-06-21T10:00:00Z'), ROME);
const M20 = 1.05 / (5.4 * th9May); // telescope magnification implied by a 105 cm image at 5.4 m
const rome = sunDay(ROME, '2025-05-30'), flo = sunDay(FLO, '2025-06-21');
const H_CLEM = 20.3, Lc = H_CLEM / Math.sin(rome.noonAlt * RAD), Hf = 90, Lf = Hf / Math.sin(flo.noonAlt * RAD);
const clemPerp = Lc * th30May, florPerp = Lf * th9May * 0 + Lf * theta(new Date('2025-06-21T10:00:00Z'), FLO);
const tree = { inner: 30 * thTree * 1000, outer: 30 * thTree * 1000 + 58 };
// Sunspot area to angular size (a spot of area A millionths of the visible hemisphere, seen face-on).
const spotArcsec = (mh) => 2 * Math.sqrt(2 * mh * 1e-6) * (th9May / 2) * (180 / Math.PI) * 3600;
const hemMH = (axA, axB) => ((Math.PI / 4) * axA * axB) / (2 * Math.PI * (th9May / 2 * 180 / Math.PI * 3600) ** 2) * 1e6;
// C. The Moon on 5 and 8 May 2025, 22 UT.
const lit = (iso) => A.Illumination('Moon', new Date(iso)).phase_fraction;
const may = monthEvents(LOC, 2025, 5);
const fq = may.find((e) => e.title === 'First quarter'), perig = may.find((e) => /perigee/.test(e.title));
const out = {
  eclipseEvent: ev.detail, peak: peak.toISOString(), newMoon: nm.date.toISOString(), magPeak: p0.mag, obPeak: p0.ob, obTool: ev.detail, t152, magAt23: at(23).mag, obAt23: at(23).ob, magAtM23: at(-23).mag,
  sunAlt: sunAltAz(LOC, peak).alt, rsMoon: [p0.rs * 3600, p0.rm * 3600],
  thetaArcmin: { may9: th9May / RAD * 60, may30: th30May / RAD * 60, june21: thTree / RAD * 60 }, M20,
  telescope: { image_m: 5.4 * th9May * M20 },
  rome: { noonAlt: rome.noonAlt, L: Lc, perpMm: clemPerp * 1000, pairMm: [clemPerp * 1000, clemPerp * 1000 + 25], alongMm: clemPerp * 1000 / Math.sin(rome.noonAlt * RAD) },
  flor: { noonAlt: flo.noonAlt, L: Lf, perpMm: florPerp * 1000, alongMm: florPerp * 1000 / Math.sin(flo.noonAlt * RAD) },
  tree, spot100: spotArcsec(100), spot1250: spotArcsec(1250), ellipseMH: hemMH(150, 50),
  moon: { lit5: lit('2025-05-05T22:00:00Z'), lit8: lit('2025-05-08T22:00:00Z'), fq: fq.date.toISOString(), perigee: perig.date.toISOString(), perigeeDetail: perig.detail },
};
console.log(JSON.stringify(out, null, 1));

const fig1 = chart({
  title: 'The eclipse at Locarno, 29 March 2025', xLabel: 'Minutes from maximum (11:05 UT)', yLabel: 'Fraction',
  series: [{ name: 'Magnitude (share of the diameter)', kind: 'line', x: mins, y: MAG.map((v) => +v.toFixed(4)) }, { name: 'Obscuration (share of the area)', kind: 'line', x: mins, y: OB.map((v) => +v.toFixed(4)) }],
  xDomain: [-45, 45], yDomain: [0, 0.25], hlines: [{ y: 0.152, text: '0.152' }], vlines: [{ x: 23, text: '+23 min', left: true }],
  desc: `The Moon covers up to ${(p0.mag * 100).toFixed(1)} per cent of the Sun's diameter (${(p0.ob * 100).toFixed(1)} per cent of its area) at maximum. Twenty-three minutes later the magnitude is ${(at(23).mag * 100).toFixed(1)} per cent.`, height: 280,
});
const dist = Array.from({ length: 81 }, (_, i) => i * 0.5);
const fig2 = chart({
  title: 'A pinhole image of the Sun, by distance', xLabel: 'Distance from the hole (m)', yLabel: 'Image width (mm)',
  series: [
    { name: 'Distance × Sun’s angle', kind: 'line', x: dist, y: dist.map((L) => +(L * thTree * 1000).toFixed(2)) },
    { name: '… plus a 58 mm hole', kind: 'line', x: dist, y: dist.map((L) => +(L * thTree * 1000 + 58).toFixed(2)) },
    { name: 'Paper: tree, about 300 mm', kind: 'dots', x: [30], y: [300], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [0, 40], yDomain: [0, 450],
  desc: `Width of the Sun's image against distance from a pinhole. At 30 m the image is ${tree.inner.toFixed(0)} mm for a point hole and ${tree.outer.toFixed(0)} mm including a 58 mm hole; the paper measured about 300 mm.`, height: 280,
});
const areas = Array.from({ length: 61 }, (_, i) => i * 25);
const fig3 = chart({
  title: 'How wide is a sunspot of a given area?', xLabel: 'Spot area (millionths of the hemisphere)', yLabel: 'Width as an equal-area circle (arcsec)',
  series: [{ name: 'Sunspot, seen face-on', kind: 'line', x: areas, y: areas.map((a) => +spotArcsec(a).toFixed(1)) }],
  xDomain: [0, 1500], yDomain: [0, 110], hlines: [{ y: 30, text: 'eye: about 30″' }], vlines: [{ x: 100, text: '100 MH' }, { x: 1250, text: '1250 MH', left: true }],
  desc: `A spot of 100 millionths of the hemisphere is ${spotArcsec(100).toFixed(0)} arcseconds wide; 1250 millionths is ${spotArcsec(1250).toFixed(0)} arcseconds. The eye resolves about 30 arcseconds.`, height: 270,
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'eclipse', figure(fig1, 'Figure 1. Eclipse magnitude and obscuration at Locarno through the maximum, worked out from the Sun and Moon positions behind the Sky events calendar. The dashed lines mark the paper\'s 15.2 % and the 23 minutes after maximum.'));
  md = inject(md, 'pinhole', figure(fig2, 'Figure 2. How wide the Sun\'s image is, by distance from the hole, on 21 June 2025, for a point hole and a 58 mm hole. The black dot is the paper\'s plane-tree image.'));
  md = inject(md, 'spots', figure(fig3, 'Figure 3. The width of a face-on sunspot against its area in millionths of the solar hemisphere (MH), using the Sun\'s angular size on 9 May 2025, with the eye\'s resolving power.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
