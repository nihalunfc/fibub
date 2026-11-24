// Figures for src/blog/discoveries/jos-plateau-younger-granite-dyke-depth-magnetic-anomaly.md, made with the maths of
// the Magnetic anomaly modeller (src/lib/sci/magnetic.ts: closed-form total-field anomalies of a thin dyke and a prism).
// Run: node scripts/blog-figures/jos-plateau-younger-granite-dyke-depth-magnetic-anomaly.mjs
import fs from 'node:fs';
import { profile, magnetisation, koenigsberger } from '../../src/lib/sci/magnetic.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/jos-plateau-younger-granite-dyke-depth-magnetic-anomaly.md', import.meta.url);

// Inputs from the paper: Usman, Nomeh, Abraham and Azuoko (2025), Front. Earth Sci. 13: 1568232 (CC BY 4.0).
// From the paper: flight-line spacing 500 m, tie lines 5000 m, sensor 80 m nominal (120 m average); Euler
// deconvolution with structural index 0 clusters at 100-300 m (read as dykes); source-parameter-imaging depths
// 83.4-110 m and 92-167 m (shallow) and 174-450 m (deep); anomalies +7 to +66 nT and -1 to -22 nT; the 3D
// inversion keeps susceptibilities below 0.004 SI.
// OUR ASSUMPTIONS: main field F = 33,500 nT with inclination 0 deg and declination 0 deg (the Jos Plateau sits within
// a degree or two of the magnetic dip equator, and the paper works with an idealised reduction to the magnetic
// equator); dyke 30 m thick, vertical, 2000 m down dip; plug 400 x 400 m from its top to 2000 m; chi = 0.02 SI.
const F = { F: 33500, inc: 0, dec: 0, az: 0 };
const CHI = 0.02, H = 120, THICK = 30, EXTENT = 2000;
const dyke = (z, thick = THICK) => ({ kind: 'dyke', s0: 0, z, thick, dip: 90, extent: EXTENT });
const plug = (z) => ({ kind: 'prism', s0: 0, t0: 0, width: 400, length: 400, z1: z, z2: 2000 });

const XS = Array.from({ length: 2001 }, (_, i) => -1000 + i); // 1 m stations, for widths read off the curve
const amp = (v) => { const lo = Math.min(...v), hi = Math.max(...v); return { lo, hi, ptp: hi - lo }; };
// Width of the central low at half its depth, in metres (1 m stations).
const halfWidth = (v) => { const lo = Math.min(...v); return v.filter((x) => x <= lo / 2).length; };

const DEPTHS = [100, 150, 200, 300, 450];
const rows = DEPTHS.map((z) => {
  const d = profile(dyke(z), F, { chi: CHI }, XS, H), p = profile(plug(z), F, { chi: CHI }, XS, H);
  const d0 = profile(dyke(z), F, { chi: CHI }, XS, 80);
  return {
    z, dykeLo: +amp(d).lo.toFixed(2), dykeW: halfWidth(d), dykeLo80: +amp(d0).lo.toFixed(2),
    plugLo: +amp(p).lo.toFixed(2), plugPtp: +amp(p).ptp.toFixed(1), plugW: halfWidth(p),
    ratio: +(halfWidth(d) / (z + H)).toFixed(3),
  };
});

// What a 30 m dyke at 150 m depth needs to reach the paper's anomaly sizes (the anomaly is linear in chi and in thickness).
const base = Math.abs(amp(profile(dyke(150), F, { chi: CHI }, XS, H)).lo); // nT at chi = 0.02, 30 m thick
const chiFor = (nT) => +(CHI * (nT / base)).toFixed(4);
const thickFor = (nT) => Math.round(THICK * (nT / base));
// Remanence: the same dyke with a frozen-in magnetisation of 2 A/m at inclination 60 deg (OUR assumption).
const rem = { chi: CHI, mr: 2, rinc: 60, rdec: 0 };
const remV = profile(dyke(150), F, rem, XS, H), remA = amp(remV);
const Q = +koenigsberger(F, rem).toFixed(2), Mind = +Math.hypot(...magnetisation(F, { chi: CHI })).toFixed(3);

// The numbers the tool itself shows for the "Check it yourself" inputs: it samples 301 stations from -800 to 800 m.
const S301 = Array.from({ length: 301 }, (_, i) => -800 + (1600 * i) / 300);
const check = (b, m) => { const v = profile(b, F, m, S301, H); const a = amp(v); return { lo: +a.lo.toFixed(1), hi: +a.hi.toFixed(1), ptp: +a.ptp.toFixed(1), atLo: +S301[v.indexOf(a.lo)].toFixed(1) }; };
const chk = { dyke150: check(dyke(150), { chi: CHI }), dyke150thick: check(dyke(150, 63), { chi: CHI }), plug150: check(plug(150), { chi: CHI }), rem150: check(dyke(150), rem) };

const fig1 = chart({
  title: 'A vertical dyke near the magnetic equator', xLabel: 'Distance across the dyke (m)', yLabel: 'Total-field anomaly ΔT (nT)',
  series: [100, 200, 300].map((z) => ({ name: `Top at ${z} m`, kind: 'line', x: XS.filter((_, i) => i % 20 === 0), y: profile(dyke(z), F, { chi: CHI }, XS, H).filter((_, i) => i % 20 === 0).map((v) => +v.toFixed(2)) })),
  xDomain: [-1000, 1000], hlines: [{ y: 0, text: '' }],
  desc: 'Modelled total-field anomaly across a 30 m thick vertical dyke whose top is 100, 200 or 300 m below the ground, with the sensor 120 m up. The low deepens and narrows as the body comes closer to the surface.', height: 280,
});

const zz = Array.from({ length: 46 }, (_, i) => 50 + i * 10);
const fig2 = chart({
  title: 'How wide the anomaly is, and how far apart the flight lines are', xLabel: 'Depth to the top of the dyke (m)', yLabel: 'Width of the low at half its depth (m)',
  series: [{ name: 'Modelled width', kind: 'line', x: zz, y: zz.map((z) => halfWidth(profile(dyke(z), F, { chi: CHI }, XS, H))) }],
  xDomain: [50, 500], yDomain: [0, 1100],
  hlines: [{ y: 500, text: 'flight lines 500 m apart' }, { y: 1000, text: 'two lines across the anomaly' }],
  desc: 'The width of the modelled low at half its depth, against the depth to the top of the dyke. The dashed lines mark one and two flight-line spacings of 500 m.', height: 280,
});

console.log(JSON.stringify({ rows, base: +base.toFixed(2), chi22: chiFor(22), chi66: chiFor(66), thick22: thickFor(22), thick66: thickFor(66), remLo: +remA.lo.toFixed(1), remHi: +remA.hi.toFixed(1), Q, Mind, chk }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'profiles', figure(fig1, 'Figure 1. The modelled total-field anomaly across a 30 m thick vertical dyke with 0.02 SI susceptibility, for tops 100, 200 and 300 m below the ground and the sensor 120 m above it. Our model, not the paper\'s data.'));
  md = inject(md, 'width', figure(fig2, 'Figure 2. The width of the modelled low at half its depth, against the depth to the top of the dyke. The paper\'s flight lines are 500 m apart, so a body shallower than about 200 m makes an anomaly no wider than one line spacing.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
