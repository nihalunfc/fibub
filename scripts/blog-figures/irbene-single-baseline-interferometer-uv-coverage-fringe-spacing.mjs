// Figures for src/blog/discoveries/irbene-single-baseline-interferometer-uv-coverage-fringe-spacing.md, made
// with the maths of the Interferometer uv-coverage planner (src/lib/sci/uvcover.ts: baselines, uvTracks,
// elevation, dirtyBeam, beamWidth, scales).
// Run: node scripts/blog-figures/irbene-single-baseline-interferometer-uv-coverage-fringe-spacing.mjs
import fs from 'node:fs';
import { uvTracks, elevation, dirtyBeam, beamWidth, scales, baselines } from '../../src/lib/sci/uvcover.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/irbene-single-baseline-interferometer-uv-coverage-fringe-spacing.md', import.meta.url);

// From the paper: Shmeld et al. (2025), Galaxies 13(6): 126, doi:10.3390/galaxies13060126 (CC BY 4.0).
// RT-32 (32 m) and RT-16 (16 m) on an 800 m baseline; methanol maser line at 6.7 GHz; cryogenic receivers
// 4.5-8.8 GHz; L band 1.45-1.72 GHz; stated angular resolution about 15 arcsec; stated velocity resolution
// about 0.088 km/s at 6.7 GHz from a 0.002 MHz channel.
const B = 800, F_MASER = 6.7e9, DISH32 = 32, DISH16 = 16;
const LAT = 57.55; // Irbene's latitude, rounded: OUR input, not stated in the paper.
const C = 299792458;

// G111.542+0.776, the maser the paper names, from galactic to equatorial (J2000 standard transformation).
function galToEq(l, b) {
  const d2r = Math.PI / 180, lNCP = 122.93192 * d2r, raGP = 192.85948 * d2r, decGP = 27.12825 * d2r;
  const L = l * d2r, Bb = b * d2r;
  const dec = Math.asin(Math.sin(decGP) * Math.sin(Bb) + Math.cos(decGP) * Math.cos(Bb) * Math.cos(lNCP - L));
  const ra = raGP + Math.atan2(Math.cos(Bb) * Math.sin(lNCP - L), Math.cos(decGP) * Math.sin(Bb) - Math.sin(decGP) * Math.cos(Bb) * Math.cos(lNCP - L));
  return { ra: ((ra / d2r) % 360 + 360) % 360, dec: dec / d2r };
}
const SRC = galToEq(111.542, 0.776);
const DEC = +SRC.dec.toFixed(2);

// Two orientation assumptions for the one baseline (the paper does not state it): east-west and north-south.
const ARRAYS = {
  ew: [{ e: 0, n: 0 }, { e: B, n: 0 }],
  ns: [{ e: 0, n: 0 }, { e: 0, n: B }],
};
const track = (ants, freq, steps = 289) => uvTracks(ants, LAT, DEC, freq, -12, 12, steps, 15); // every 5 minutes, above 15 degrees

const out = {};
for (const [k, ants] of Object.entries(ARRAYS)) {
  const tr = track(ants, F_MASER);
  const beam = dirtyBeam(tr.u, tr.v, 256);
  const bw = beamWidth(beam);
  out[k] = {
    points: tr.u.length, hours: +((tr.hours.at(-1) - tr.hours[0])).toFixed(1),
    uMaxKlam: +(Math.max(...tr.u.map(Math.abs)) / 1000).toFixed(2),
    vMaxKlam: +(Math.max(...tr.v.map(Math.abs)) / 1000).toFixed(2),
    beamEw: +bw.ew.toFixed(2), beamNs: +bw.ns.toFixed(2),
    // A thinner sample, drawn as a closed track, keeps the chart small.
    u: track(ants, F_MASER, 49).u, v: track(ants, F_MASER, 49).v,
  };
}

const sc = scales(F_MASER, B, B, DISH32);
const scL = scales(1.65e9, B, B, DISH32);
const facts = {
  lamCm: +(sc.lam * 100).toFixed(3),
  resolution: +sc.resolution.toFixed(2),
  resolution122: +(1.22 * sc.resolution).toFixed(2),
  largest: +sc.largest.toFixed(2),
  primary32: +sc.primaryBeam.toFixed(1), primary32min: +(sc.primaryBeam / 60).toFixed(2),
  primary16min: +(scales(F_MASER, B, B, DISH16).primaryBeam / 60).toFixed(2),
  resolutionL: +scL.resolution.toFixed(1), primaryL32min: +(scL.primaryBeam / 60).toFixed(1),
  baselineLam: +(B / sc.lam / 1000).toFixed(2),
  elevMin: +elevation(LAT, DEC, 12).toFixed(1), elevMax: +elevation(LAT, DEC, 0).toFixed(1),
  velPerChan: +((C / 1000) * 0.002e6 / F_MASER).toFixed(4),
  velPerCorrChan: +((C / 1000) * 0.01e6 / F_MASER).toFixed(3),
  srcRa: +SRC.ra.toFixed(3), srcDec: DEC,
};

// Figure 1: the uv track of one 800 m baseline over a full day, for both orientation assumptions.
const fig1 = chart({
  title: 'One 800 m baseline, a full day on the maser', xLabel: 'u (kλ)', yLabel: 'v (kλ)',
  series: [
    { name: 'East–west baseline', kind: 'dots', x: out.ew.u.map((x) => x / 1000), y: out.ew.v.map((x) => x / 1000), size: 1.8 },
    { name: 'North–south baseline', kind: 'dots', x: out.ns.u.map((x) => x / 1000), y: out.ns.v.map((x) => x / 1000), size: 1.8 },
  ],
  xDomain: [-20, 20], yDomain: [-20, 20],
  desc: `uv points swept out by a single 800 metre baseline at latitude 57.55 degrees on a source at declination ${DEC}, over 24 hours, for an east-west and a north-south orientation. Each is one thin ellipse: nothing fills the plane.`,
  height: 300,
});

// Figure 2: fringe spacing across the receiver's band, with the paper's stated 15 arcsec.
const fs2 = Array.from({ length: 87 }, (_, i) => 4.5 + i * 0.05);
const fig2 = chart({
  title: 'Fringe spacing of an 800 m baseline', xLabel: 'Frequency (GHz)', yLabel: 'Angular scale (arcsec)',
  series: [
    { name: 'λ / B', kind: 'line', x: fs2, y: fs2.map((f) => +scales(f * 1e9, B, B, DISH32).resolution.toFixed(3)) },
    { name: '1.22 λ / B', kind: 'line', x: fs2, y: fs2.map((f) => +(1.22 * scales(f * 1e9, B, B, DISH32).resolution).toFixed(3)) },
  ],
  xDomain: [4.5, 8.8], yDomain: [7, 19],
  hlines: [{ y: 15, text: 'the paper’s “about 15″”' }],
  vlines: [{ x: 6.7, text: '6.7 GHz methanol', left: true, dy: 14 }],
  desc: `Angular scale against frequency for an 800 metre baseline. At 6.7 GHz, lambda over B is ${facts.resolution} arcsec and 1.22 lambda over B is ${facts.resolution122} arcsec, which brackets the paper's stated 15 arcsec.`,
  height: 290,
});

console.log(JSON.stringify({ facts, ew: { ...out.ew, u: undefined, v: undefined }, ns: { ...out.ns, u: undefined, v: undefined }, nBaselines: baselines(ARRAYS.ew).length }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'uv', figure(fig1, `Figure 1. All the uv coverage one 800 m baseline gets in 24 hours on the maser source, at Irbene's latitude, worked out with the uv-coverage planner's maths and drawn as a continuous track. Both curves are the same baseline: east-west and north-south are our two guesses at its orientation, which the paper does not state.`));
  md = inject(md, 'res', figure(fig2, `Figure 2. The angular scale an 800 m baseline is sensitive to, across the Irbene receivers' 4.5 to 8.8 GHz range. The two conventions, λ/B and 1.22 λ/B, bracket the paper's stated 15 arcsec at the 6.7 GHz maser line.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
