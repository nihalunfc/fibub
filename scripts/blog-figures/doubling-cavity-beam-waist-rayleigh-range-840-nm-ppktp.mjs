// Figures for src/blog/discoveries/doubling-cavity-beam-waist-rayleigh-range-840-nm-ppktp.md, made with the maths of
// the Gaussian beam calculator (src/lib/sci/phgauss.ts: ABCD matrices, the complex beam parameter q and the
// Rayleigh range).
// Run: node scripts/blog-figures/doubling-cavity-beam-waist-rayleigh-range-840-nm-ppktp.mjs
import fs from 'node:fs';
import { parseElements, systemMatrix, propagate, radiusAt, rayleigh, divergence } from '../../src/lib/sci/phgauss.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/doubling-cavity-beam-waist-rayleigh-range-840-nm-ppktp.md', import.meta.url);

// From the paper: Xu, Jia, Qin, Wang, Zhou and Li (2025), Photonics 12(8): 830, doi:10.3390/photonics12080830
// (CC BY). Bow-tie doubling cavity at 840 nm: two curved mirrors of radius 150 mm, 210 mm apart, total round trip
// 490 mm, a 10 mm PPKTP crystal at the tight waist; the paper states a waist of about 106 um and a Rayleigh length
// of 42 mm (4.2 times the crystal length).
const LAM = 840; // nm
const R = 150; // mm, radius of curvature of M3 and M4
const LTOT = 490; // mm, round trip
const L34 = 210; // mm, spacing of the two curved mirrors

// The resonator eigenmode. Unfold the ring onto a rail that starts at the tight waist (midway between the curved
// mirrors), passes both mirrors and closes at the waist again, then ask for the q that reproduces itself:
// at a plane where A = D, zR = |B| / sqrt(1 - ((A + D)/2)^2).
function eigen(l34, ltot = LTOT, m2 = 1) {
  const els = parseElements(`mirror ${l34 / 2} ${R} M3\nmirror ${ltot - l34 / 2} ${R} M4`);
  const M = systemMatrix(els, ltot);
  const m = (M[0] + M[3]) / 2;
  if (Math.abs(m) >= 1) return null; // outside the stability range
  const zR = Math.abs(M[1]) / Math.sqrt(1 - m * m);
  return { zR, w0: Math.sqrt((zR * LAM * 1e-6 * m2) / Math.PI), m, M };
}

// Figure 1: the waist, and the spot on the curved mirrors, against the mirror spacing.
const SEP = [];
for (let l = 154; l <= 296; l += 2) SEP.push(l);
const rows = SEP.map((l) => {
  const e = eigen(l);
  if (!e) return { l, w0: NaN, wm: NaN };
  const segs = propagate(e.w0, 0, LAM, 1, parseElements(`mirror ${l / 2} ${R}\nmirror ${LTOT - l / 2} ${R}`), LTOT);
  return { l, w0: e.w0 * 1000, wm: radiusAt(segs[0], l / 2) * 1000 };
});

const fig1 = figure(
  chart({
    title: 'Cavity waist and mirror spot against mirror spacing',
    xLabel: 'Spacing of the two curved mirrors (mm)',
    yLabel: 'Beam radius (µm)',
    series: [
      { name: 'Waist in the crystal', x: rows.map((r) => r.l), y: rows.map((r) => r.w0), kind: 'line' },
      { name: 'Spot on a curved mirror', x: rows.map((r) => r.l), y: rows.map((r) => r.wm), kind: 'line' },
    ],
    xDomain: [154, 296],
    yDomain: [0, 420],
    hlines: [{ y: 106, text: "the paper's 106 µm waist" }],
    vlines: [{ x: L34, text: '210 mm', dy: 2 }],
    desc: 'The waist radius in the crystal rises smoothly from about 60 to 180 micrometres as the two curved mirrors are moved from 154 to 296 mm apart, while the spot on the mirrors stays near 290 micrometres over most of that range and grows sharply at both stability edges. At the 210 mm spacing of the paper the waist is 105 micrometres.',
  }),
  'Figure 1. The resonator eigenmode of the bow-tie cavity, worked out with the Gaussian beam calculator’s ABCD maths from the paper’s mirror radius (150 mm) and round trip (490 mm). At the 210 mm spacing the paper used, the waist comes out at 105 µm against the 106 µm the paper states. The cavity becomes unstable outside roughly 150 to 300 mm.',
);

// Figure 2: beam radius around one round trip at the paper's geometry.
const e0 = eigen(L34);
const ELS = parseElements(`mirror ${L34 / 2} ${R} M3\nmirror ${LTOT - L34 / 2} ${R} M4`);
const segs = propagate(e0.w0, 0, LAM, 1, ELS, LTOT);
const beamAtZ = (z) => {
  for (const s of segs) if (z <= s.to) return radiusAt(s, z) * 1000;
  return radiusAt(segs[segs.length - 1], z) * 1000;
};
const ZS = [];
for (let z = 0; z <= LTOT; z += 2) ZS.push(z);

const fig2 = figure(
  chart({
    title: 'Beam radius around one round trip of the cavity',
    xLabel: 'Distance around the ring from the crystal waist (mm)',
    yLabel: 'Beam radius (µm)',
    series: [{ name: 'Beam radius', x: ZS, y: ZS.map(beamAtZ), kind: 'line' }],
    xDomain: [0, LTOT],
    yDomain: [0, 320],
    bands: [{ x0: 0, x1: 5, text: '' }, { x0: 485, x1: 490, text: '' }],
    vlines: [
      { x: 105, text: 'M3', dy: 2 },
      { x: 385, text: 'M4', dy: 2 },
      { x: 245, text: 'long-arm waist 154 µm', dy: 18, left: true },
    ],
    desc: 'The beam radius starts at 105 micrometres at the crystal waist, grows to 287 micrometres at each curved mirror, and passes through a second, looser waist of 154 micrometres halfway round the long arm.',
  }),
  'Figure 2. One round trip, unfolded onto a straight rail. The shaded strips at each end are the two halves of the 10 mm PPKTP crystal: across it the beam radius changes by under 1 %, which is what a Rayleigh range four times the crystal length buys you.',
);

// Numbers quoted in the article.
console.log(`Empty cavity, L34 = ${L34} mm: w0 = ${(e0.w0 * 1000).toFixed(2)} um, zR = ${e0.zR.toFixed(2)} mm, (A+D)/2 = ${e0.m.toFixed(4)}`);
console.log(`  ABCD over the round trip: A ${e0.M[0].toFixed(5)}, B ${e0.M[1].toFixed(3)} mm, C ${e0.M[2].toFixed(5)} /mm, D ${e0.M[3].toFixed(5)}`);
console.log(`Paper's 106 um waist at 840 nm: zR = ${rayleigh(0.106, LAM).toFixed(3)} mm, divergence ${(divergence(0.106, LAM) * 1e3).toFixed(3)} mrad half-angle`);
for (const n of [1.8, 1.8396]) {
  const le = L34 - 10 + 10 / n, e = eigen(le, LTOT - 10 + 10 / n);
  console.log(`  with the crystal as glass of index ${n}: effective spacing ${le.toFixed(2)} mm, w0 ${(e.w0 * 1000).toFixed(2)} um, zR ${e.zR.toFixed(2)} mm`);
}
const eM2 = eigen(L34, LTOT, 1.017);
console.log(`  with M2 = 1.017: w0 ${(eM2.w0 * 1000).toFixed(2)} um (zR unchanged at ${eM2.zR.toFixed(2)} mm)`);
console.log(`Spot on a curved mirror: ${beamAtZ(105).toFixed(2)} um; long-arm waist ${(segs[1].w0 * 1000).toFixed(2)} um at ${segs[1].zw.toFixed(1)} mm, zR ${segs[1].zR.toFixed(1)} mm`);
console.log(`Across the crystal (106 um waist, +-5 mm): ${(0.106 * Math.sqrt(1 + (5 / rayleigh(0.106, LAM)) ** 2) * 1000).toFixed(3)} um, a rise of ${((Math.sqrt(1 + (5 / rayleigh(0.106, LAM)) ** 2) - 1) * 100).toFixed(2)} %`);
console.log(`Harmonic at 420 nm, waist w0/sqrt(2) = ${(106 / Math.SQRT2).toFixed(2)} um, zR ${rayleigh(0.106 / Math.SQRT2, 420).toFixed(2)} mm`);
const stab = rows.filter((r) => Number.isFinite(r.w0));
console.log(`Smallest mirror spot in the scan: ${Math.min(...stab.map((r) => r.wm)).toFixed(1)} um at ${stab.reduce((a, b) => (b.wm < a.wm ? b : a)).l} mm`);

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'scan', fig1);
md = inject(md, 'roundtrip', fig2);
fs.writeFileSync(ART, md);
console.log('Charts written into', ART.pathname);
