// Figures for src/blog/discoveries/dome-a-daytime-near-infrared-photometry-telescope-depth.md, made with the
// maths of the Telescope calculator (src/lib/astro/optics.ts) and the Magnitude converter (src/lib/sci/photometry.ts).
// Run: node scripts/blog-figures/dome-a-daytime-near-infrared-photometry-telescope-depth.mjs
import fs from 'node:fs';
import { scope, camera } from '../../src/lib/astro/optics.ts';
import { BANDS, toJy, fromJy } from '../../src/lib/sci/photometry.ts';
import { subLength } from '../../src/lib/sci/subexp.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/dome-a-daytime-near-infrared-photometry-telescope-depth.md', import.meta.url);

// --- Numbers from the paper (Yang et al. 2025, AJ 169: 162, doi:10.3847/1538-3881/adbd0e, CC BY 4.0) ---
const AP = 150;            // telescope aperture, mm
const SCALE = 2.5;         // image scale, arcsec per pixel
const FOV_W = 0.87, FOV_H = 0.69; // field of view, degrees
const SKY_NOON = 5.2, SKY_MID = 5.8; // zenith J-band sky brightness, mag/arcsec^2
const JLIM = 10.06;        // 5-sigma limit in a 175 s effective exposure
const TEXP = 175;          // effective exposure, s
const BIG = 1000;          // the planned 1 m class telescope, mm

// --- Our assumptions, stated in the article ---
const QE = 0.6, THRU = 0.7;   // detector quantum efficiency and optical throughput
const BAND_AA = 1620;         // 2MASS J bandwidth, angstrom
const NPIX = 9;               // pixels in the measuring aperture (3 x 3 at 2.5"/px)

const J = BANDS.find((b) => b.id === 'J2');
const r2 = (v, n = 2) => +v.toFixed(n);

// 1. The detector the field of view and image scale imply.
const pxW = (FOV_W * 3600) / SCALE, pxH = (FOV_H * 3600) / SCALE;
// 2. Focal length for a given pixel pitch: scale = 206.265 * pixel / focal.
const flFor = (pixUm) => (206.265 * pixUm) / SCALE;
const rigs = [10, 15, 20, 25].map((pixUm) => {
  const fl = flFor(pixUm), s = scope(AP, fl);
  const sensorW = (pxW * pixUm) / 1000, sensorH = (pxH * pixUm) / 1000;
  const cam = camera(s, sensorW, sensorH, pixUm, 1.5);
  return { pixUm, fl: r2(fl, 0), f: r2(s.f), sensorW: r2(sensorW, 1), sensorH: r2(sensorH, 1), scale: r2(cam.scale, 3), fovW: r2(cam.fovW / 60, 3), fovH: r2(cam.fovH / 60, 3), verdict: cam.verdict };
});
// 3. Sampling: how many pixels fall across a star of a given width, at 2.5"/px.
const s15 = scope(AP, flFor(15));
const sampling = [0.3, 0.5, 1, 1.5, 2, 3, 4, 5].map((see) => ({ see, ...camera(s15, 18.8, 14.9, 15, see) }))
  .map((c) => ({ see: c.see, ratio: r2(c.ratio ?? c.see / c.scale), verdict: c.verdict }));

// 4. Photon budget for the 5-sigma limit.
const starJy = toJy(JLIM, 'vega', J.lam, J.vegaJy);
const starPhot = fromJy(starJy, J.lam, J.vegaJy).phot;         // photons/s/cm2/A
const areaCm2 = Math.PI * (AP / 20) ** 2;                       // clear aperture, cm2
const eStar = starPhot * areaCm2 * BAND_AA * TEXP * QE * THRU;  // electrons from the star
const skyMagPix = (sqm) => sqm - 2.5 * Math.log10(SCALE * SCALE);
const skyE = (sqm) => fromJy(toJy(skyMagPix(sqm), 'vega', J.lam, J.vegaJy), J.lam, J.vegaJy).phot * areaCm2 * BAND_AA * TEXP * QE * THRU;
const snrFor = (sqm) => eStar / Math.sqrt(eStar + NPIX * skyE(sqm));
// The magnitude at which our photon budget gives SNR = 5 (shot noise only).
const limitFor = (sqm) => {
  let lo = 5, hi = 20;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2, s = eStar * 10 ** (-0.4 * (m - JLIM));
    (s / Math.sqrt(s + NPIX * skyE(sqm)) > 5) ? (lo = m) : (hi = m);
  }
  return (lo + hi) / 2;
};

// 5. Aperture scaling: background-limited depth goes as the diameter.
const depthGain = (d1, d2) => 1.25 * Math.log10(scope(d2, 1000).grasp / scope(d1, 1000).grasp);
const aps = Array.from({ length: 96 }, (_, i) => 100 + i * 20);
const gains = aps.map((d) => r2(depthGain(AP, d), 3));

const fig1 = chart({
  title: 'What 2.5″ per pixel needs from the optics', xLabel: 'Focal length (mm)', yLabel: 'Image scale (″ per pixel)',
  series: [10, 15, 20, 25].map((p) => ({ name: `${p} µm pixels`, kind: 'line', x: Array.from({ length: 60 }, (_, i) => 300 + i * 40), y: Array.from({ length: 60 }, (_, i) => +((206.265 * p) / (300 + i * 40)).toFixed(3)) })),
  xDomain: [300, 2700], yDomain: [0, 8], hlines: [{ y: SCALE, text: 'the paper: 2.5″/px' }],
  vlines: rigs.slice(1, 3).map((r) => ({ x: r.fl, text: `${r.fl} mm`, dy: rigs.indexOf(r) * 14 })),
  desc: 'Image scale against focal length for four pixel pitches. A 2.5 arcsec per pixel scale needs 825 mm of focal length with 10 micron pixels and 1651 mm with 20 micron pixels.', height: 270,
});
const fig2 = chart({
  title: 'How much deeper a bigger mirror reaches', xLabel: 'Aperture (mm)', yLabel: 'Gain over 150 mm (magnitudes)',
  series: [{ name: 'Sky-limited depth', kind: 'line', x: aps, y: gains }],
  xDomain: [100, 2000], yDomain: [-0.5, 3],
  vlines: [{ x: BIG, text: `1 m: ${depthGain(AP, BIG).toFixed(2)} mag` }], hlines: [{ y: 0, text: '150 mm' }],
  desc: `Sky-limited depth gain over the paper's 150 mm telescope against aperture. A 1 m telescope at the same image scale and exposure gains ${depthGain(AP, BIG).toFixed(2)} magnitudes.`, height: 260,
});

console.log(JSON.stringify({
  detector: { pxW: r2(pxW, 1), pxH: r2(pxH, 1) }, rigs, sampling,
  photons: {
    starJy: +starJy.toPrecision(4), starMJy: r2(starJy * 1000, 1), starPhot: +starPhot.toPrecision(4), areaCm2: r2(areaCm2, 1),
    eStar: +eStar.toPrecision(4), skyMagPixNoon: r2(skyMagPix(SKY_NOON)), skyMagPixMid: r2(skyMagPix(SKY_MID)),
    skyENoon: +skyE(SKY_NOON).toPrecision(4), skyEMid: +skyE(SKY_MID).toPrecision(4),
    snrNoon: r2(snrFor(SKY_NOON)), snrMid: r2(snrFor(SKY_MID)),
    limitNoon: r2(limitFor(SKY_NOON)), limitMid: r2(limitFor(SKY_MID)),
    skyRatio: r2(10 ** (0.4 * (SKY_MID - SKY_NOON)), 3), depthFromSky: r2(1.25 * Math.log10(10 ** (0.4 * (SKY_MID - SKY_NOON)))),
  },
  scope150: { f: r2(scope(AP, flFor(15)).f), limit: r2(scope(AP, flFor(15)).limit), grasp: r2(scope(AP, flFor(15)).grasp), dawes: r2(scope(AP, flFor(15)).dawes) },
  depth: { oneMetre: r2(depthGain(AP, BIG), 3), halfMetre: r2(depthGain(AP, 500), 3), twoMetre: r2(depthGain(AP, 2000), 3) },
  subs: { skyRateMid: +(skyE(SKY_MID) / TEXP).toPrecision(4), sub50: +subLength(50, skyE(SKY_MID) / TEXP).toPrecision(3), sub10: +subLength(10, skyE(SKY_MID) / TEXP).toPrecision(3) },
  pins: {
    sct: (() => { const s = scope(203, 2032); return { f: r2(s.f), grasp: r2(s.grasp, 1), dawes: r2(s.dawes), limit: r2(s.limit) }; })(),
    imx571: (() => { const c = camera(scope(80, 480), 23.5, 15.7, 3.76, 3); return { scale: r2(c.scale, 3), fovW: r2(c.fovW, 1), fovH: r2(c.fovH, 1), degW: r2(c.fovW / 60), degH: r2(c.fovH / 60), v3: c.verdict, v6: camera(scope(80, 480), 23.5, 15.7, 3.76, 6).verdict }; })(),
    big: { grasp: r2(scope(1000, 8250).grasp, 1) },
  },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'scale', figure(fig1, 'Figure 1. The image scale a telescope gives for four detector pixel pitches, worked out with the Telescope calculator\'s own arithmetic. The dashed line is the 2.5 arcseconds per pixel the paper reports; the vertical lines are the focal lengths that 15 and 20 micron pixels would need.'));
  md = inject(md, 'depth', figure(fig2, 'Figure 2. Sky-limited depth against aperture, relative to the paper\'s 150 mm telescope, at the same image scale and exposure. The paper expects about 2 magnitudes from a 1 m class telescope; the arithmetic gives 2.07.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
