// Figures for src/blog/discoveries/fungal-spore-size-q-value-measurement-limits.md, made with the maths of the
// Spore size measurer (src/lib/sci/plantimg.ts: sporeStats, and the real image chain
// luminance -> histogram -> otsu -> threshold -> blobs -> moment ellipse).
// Run: node scripts/blog-figures/fungal-spore-size-q-value-measurement-limits.mjs
import fs from 'node:fs';
import * as P from '../../src/lib/sci/plantimg.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fungal-spore-size-q-value-measurement-limits.md', import.meta.url);

// Spore measurements as printed by the paper: Ma et al. (2024), MycoKeys 107: 327-350, doi:10.3897/mycokeys.107.125571
// (CC BY 4.0). [n spores / basidiomata / collections]; inner range holds at least 90 % of the measured values.
const SPECIES = [
  { name: 'Campanophyllum microsporum', n: 149, Lm: 3.5, Wm: 1.9, Lin: [3.0, 4.2], Win: [1.7, 2.2], Lout: [2.7, 4.5], Wout: [1.5, 2.6], Q: [1.4, 2.5], Qm: 1.8 },
  { name: 'Calocera multiramosa', n: 102, Lm: 14.3, Wm: 6.3, Lin: [10.4, 16.7], Win: [5.2, 7.4], Lout: [6.5, 17.0], Wout: [4.5, 8.8], Q: [1.6, 2.7], Qm: 2.3 },
  { name: 'Dacrymyces naematelioides', n: 95, Lm: 23.9, Wm: 11.0, Lin: [18.5, 28.5], Win: [8.9, 13.8], Lout: [16.5, 29.5], Wout: [8.7, 14.6], Q: [1.8, 2.4], Qm: 2.2 },
];
// A 5th-to-95th-percentile range of a normal distribution is 2 x 1.6449 standard deviations wide.
const Z90 = 2 * 1.6448536269514722;

let seed = 125571;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());

/** A spore population with the paper's mean length and width and its 90 % ranges, with correlation rho between
 * the length and the width of one spore (our assumption; the paper reports no correlation). */
function population(s, rho) {
  const sl = (s.Lin[1] - s.Lin[0]) / Z90, sw = (s.Win[1] - s.Win[0]) / Z90, L = [], W = [];
  for (let i = 0; i < s.n; i++) {
    const a = gauss(), b = gauss();
    L.push(+(s.Lm + sl * a).toFixed(2));
    W.push(+(s.Wm + sw * (rho * a + Math.sqrt(1 - rho * rho) * b)).toFixed(2));
  }
  return { L, W, sl, sw };
}

const RHOS = [0, 0.5, 0.8];
const sim = SPECIES.map((s) => {
  const out = { s, by: {} };
  for (const rho of RHOS) {
    const { L, W, sl, sw } = population(s, rho);
    const st = P.sporeStats(L, W, 'pct');
    out.by[rho] = { L, W, sl, sw, st, qlo: st.Q.lo, qhi: st.Q.hi, qm: st.Q.mean, ratio: st.L.mean / st.W.mean };
  }
  return out;
});
for (const o of sim) {
  console.log(`\n${o.s.name}  n=${o.s.n}  paper Q ${o.s.Q[0]}-${o.s.Q[1]}, Qm ${o.s.Qm}; Lm/Wm = ${(o.s.Lm / o.s.Wm).toFixed(3)}`);
  console.log(`  SD from the 90 % range: length ${o.by[0].sl.toFixed(3)} µm, width ${o.by[0].sw.toFixed(3)} µm`);
  for (const rho of RHOS) { const b = o.by[rho]; console.log(`  rho ${rho}: Q 5-95 % ${b.qlo.toFixed(2)}-${b.qhi.toFixed(2)}, Qm ${b.qm.toFixed(3)} (ratio of means ${b.ratio.toFixed(3)})`); }
  console.log('  tool line (rho 0.5):', o.by[0.5].st.text);
}

// ---------------------------------------------------------------------------
// How many pixels per micrometre does a spore need? Draw one spore of the paper's mean size as a dark ellipse on a
// pale field with the tool's own drawing helpers, then measure it with the tool's real chain.
function measure(lenUm, widUm, k, noiseAmp = 5, angle = 23, tOff = 0) {
  const w = Math.max(60, Math.ceil(lenUm * k * 3)), h = Math.max(60, Math.ceil(lenUm * k * 3));
  const im = { px: new Uint8ClampedArray(w * h * 4), w, h };
  for (let i = 0; i < w * h; i++) { im.px[i * 4] = 235; im.px[i * 4 + 1] = 232; im.px[i * 4 + 2] = 225; im.px[i * 4 + 3] = 255; }
  P.ellipse(im, w / 2, h / 2, (lenUm * k) / 2, (widUm * k) / 2, angle, [95, 70, 45]);
  P.noise(im, noiseAmp, 4);
  const v = P.luminance(im.px, w * h), auto = P.otsu(P.histogram(v)), t = auto + tOff;
  const b = P.blobs(P.threshold(v, t, true), w, h, 4, w * h);
  if (b.length !== 1) return null;
  return { L: b[0].major / k, W: b[0].minor / k, Q: b[0].major / b[0].minor, area: b[0].area, auto, t };
}

const KS = [2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 26, 32, 40, 50];
const curves = SPECIES.map((s) => {
  const rows = KS.map((k) => {
    const m = measure(s.Lm, s.Wm, k);
    return m ? { k, dL: m.L - s.Lm, dW: m.W - s.Wm, dQ: m.Q - s.Lm / s.Wm, L: m.L, W: m.W, Q: m.Q } : { k, dL: NaN, dW: NaN, dQ: NaN };
  });
  return { s, rows };
});
for (const c of curves) {
  console.log(`\n${c.s.name}: measured from a drawn ellipse of ${c.s.Lm} x ${c.s.Wm} µm (true Q ${(c.s.Lm / c.s.Wm).toFixed(3)})`);
  for (const r of c.rows) console.log(`  ${String(r.k).padStart(3)} px/µm -> L ${r.L?.toFixed(2)} W ${r.W?.toFixed(2)} Q ${r.Q?.toFixed(3)} (dL ${r.dL?.toFixed(3)}, dQ ${r.dQ?.toFixed(3)})`);
}
// Pixels across the width, which is what really decides the error.
for (const c of curves) console.log(`${c.s.name}: width in pixels at 10 px/µm = ${(c.s.Wm * 10).toFixed(0)}; |dQ| at 10 px/µm = ${Math.abs(c.rows.find((r) => r.k === 10).dQ).toFixed(3)}`);

// A real microscope image is blurred. We blur the drawn ellipse with a Gaussian of sigma in µm (OUR ASSUMPTION;
// an oil-immersion objective of NA 1.25 has a resolution limit of about 0.22 µm at 550 nm) before the tool's
// automatic threshold sees it, which is where the size bias of an automatically found spore really comes from.
function blur(im, sigPx) {
  if (sigPx <= 0) return im;
  const r = Math.max(1, Math.ceil(3 * sigPx)), k = [];
  for (let i = -r; i <= r; i++) k.push(Math.exp(-(i * i) / (2 * sigPx * sigPx)));
  const sum = k.reduce((a, b) => a + b, 0), { w, h } = im, out = new Uint8ClampedArray(im.px.length);
  const tmp = new Float64Array(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) {
    let v = 0; for (let i = -r; i <= r; i++) { const xx = Math.min(w - 1, Math.max(0, x + i)); v += k[i + r] * im.px[(y * w + xx) * 4 + c]; }
    tmp[(y * w + x) * 3 + c] = v / sum;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { for (let c = 0; c < 3; c++) {
    let v = 0; for (let i = -r; i <= r; i++) { const yy = Math.min(h - 1, Math.max(0, y + i)); v += k[i + r] * tmp[(yy * w + x) * 3 + c]; }
    out[(y * w + x) * 4 + c] = v / sum;
  } out[(y * w + x) * 4 + 3] = 255; }
  return { px: out, w, h };
}
function measureBlurred(lenUm, widUm, k, sigUm) {
  const w = Math.max(60, Math.ceil(lenUm * k * 3)), h = w;
  const im = { px: new Uint8ClampedArray(w * h * 4), w, h };
  for (let i = 0; i < w * h; i++) { im.px[i * 4] = 235; im.px[i * 4 + 1] = 232; im.px[i * 4 + 2] = 225; im.px[i * 4 + 3] = 255; }
  P.ellipse(im, w / 2, h / 2, (lenUm * k) / 2, (widUm * k) / 2, 23, [95, 70, 45]);
  const bl = blur(im, sigUm * k);
  P.noise(bl, 5, 4);
  const v = P.luminance(bl.px, w * h), t = P.otsu(P.histogram(v));
  const b = P.blobs(P.threshold(v, t, true), w, h, 4, w * h);
  if (b.length !== 1) return null;
  return { L: b[0].major / k, W: b[0].minor / k, Q: b[0].major / b[0].minor, t };
}
const SIG = [0, 0.1, 0.2, 0.3, 0.4, 0.6];
const blurs = SPECIES.map((s) => ({ s, rows: SIG.map((sg) => {
  const m = measureBlurred(s.Lm, s.Wm, 20, sg);
  return m ? { sg, L: m.L, W: m.W, Q: m.Q, dL: m.L - s.Lm, dW: m.W - s.Wm, dQ: m.Q - s.Lm / s.Wm } : { sg, dL: NaN, dW: NaN, dQ: NaN };
}) }));
for (const c of blurs) {
  console.log(`\n${c.s.name}: blurred image at 20 px/µm, automatic threshold`);
  for (const r of c.rows) console.log(`  sigma ${r.sg} µm -> L ${r.L?.toFixed(2)} W ${r.W?.toFixed(2)} Q ${r.Q?.toFixed(3)} (dL ${r.dL?.toFixed(3)}, dW ${r.dW?.toFixed(3)}, dQ ${r.dQ?.toFixed(3)})`);
}

// How many spores does a Qm need? Standard error of the mean Q and of the 5th and 95th percentiles, by sample size.
const bigPop = (() => { const s = SPECIES[0], sl = (s.Lin[1] - s.Lin[0]) / Z90, sw = (s.Win[1] - s.Win[0]) / Z90, L = [], W = [];
  for (let i = 0; i < 200000; i++) { const a = gauss(), b = gauss(); L.push(s.Lm + sl * a); W.push(s.Wm + sw * (0.5 * a + Math.sqrt(0.75) * b)); } return { L, W }; })();
const draw = (n) => { const L = [], W = []; for (let i = 0; i < n; i++) { const j = Math.floor(rnd() * bigPop.L.length); L.push(+bigPop.L[j].toFixed(2)); W.push(+bigPop.W[j].toFixed(2)); } return P.sporeStats(L, W, 'pct'); };
const sdOf = (v) => { const m = v.reduce((a, b) => a + b, 0) / v.length; return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1)); };
const NS = [10, 20, 30, 50, 100, 149, 300];
const spread = NS.map((n) => {
  const reps = Array.from({ length: 400 }, () => draw(n));
  return { n, seQm: sdOf(reps.map((r) => r.Q.mean)), seLo: sdOf(reps.map((r) => r.Q.lo)), seHi: sdOf(reps.map((r) => r.Q.hi)), seLm: sdOf(reps.map((r) => r.L.mean)) };
});
console.log('\nspores needed (Campanophyllum population, 400 repeats each):');
for (const r of spread) console.log(`  n ${String(r.n).padStart(3)}: SD of Qm ${r.seQm.toFixed(4)}, of the 5th percentile of Q ${r.seLo.toFixed(3)}, of the 95th ${r.seHi.toFixed(3)}, of mean length ${r.seLm.toFixed(3)} µm`);

// The example photo built into the tool page (24 drawn spores at 10 px per µm), measured by the same chain.
const ex = P.exampleSpores(), ev = P.luminance(ex.px, ex.w * ex.h), et = P.otsu(P.histogram(ev));
const eb = P.blobs(P.threshold(ev, et, true), ex.w, ex.h, 1, 1e9).filter((r) => r.major / 10 <= 100 && r.major / r.minor <= 4);
const efit = P.sporeStats(eb.map((r) => r.major / 10), eb.map((r) => r.minor / 10), 'pct');
console.log('\nexample photo:', eb.length, 'spores;', efit.text);
console.log('example photo, mean ± SD form:', P.sporeStats(eb.map((r) => r.major / 10), eb.map((r) => r.minor / 10), 'sd').text);

// --------------------------------------------------------------------------- charts
const nm = (c) => c.s.name.split(' ')[0] + ` (${c.s.Lm} × ${c.s.Wm} µm)`;
const fig1 = chart({
  title: 'Blur bends Q downwards, and small spores most', xLabel: 'Blur of the image, sigma (µm)', yLabel: 'Error in Q (measured − true)',
  series: blurs.map((c) => ({ name: nm(c), kind: 'line', x: c.rows.map((r) => r.sg), y: c.rows.map((r) => +r.dQ.toFixed(4)) })),
  xDomain: [0, 0.6], yDomain: [-0.42, 0.06], hlines: [{ y: 0, text: '' }],
  desc: 'Error in the length-to-width ratio Q of one drawn spore measured through the tool chain, against the blur of the image. The 3.5 by 1.9 micrometre spore loses 0.13 of its Q at a blur of 0.3 micrometres; the 23.9 by 11 micrometre spore loses 0.004.',
  height: 285,
});
const fig2 = chart({
  title: 'Pixels per µm: enough is enough', xLabel: 'Pixels per µm in a sharp photo', yLabel: 'Error in Q (measured − true)',
  series: curves.map((c) => ({ name: c.s.name.split(' ')[0], kind: 'line', x: c.rows.map((r) => r.k), y: c.rows.map((r) => +r.dQ.toFixed(4)) })),
  xDomain: [2, 20], yDomain: [-0.25, 0.08], hlines: [{ y: 0, text: '' }],
  desc: 'The same measurement on sharp images of different pixel sizes: beyond about five pixels per micrometre the error in Q is under 0.02 for all three species.',
  height: 270,
});
const qgrid = Array.from({ length: 121 }, (_, i) => 1 + i * 0.015);
const cdf = (v) => qgrid.map((q) => (100 * v.filter((x) => x <= q).length) / v.length);
const fig3 = chart({
  title: 'Spread of Q within one species', xLabel: 'Q = length ÷ width of one spore', yLabel: 'Share of spores at or below (%)',
  series: SPECIES.map((s, i) => {
    const b = sim[i].by[0.5];
    return { name: s.name.split(' ')[0], kind: 'line', x: qgrid, y: cdf(b.L.map((l, j) => l / b.W[j])) };
  }),
  xDomain: [1, 2.8], yDomain: [0, 100], hlines: [{ y: 5, text: '5 %' }, { y: 95, text: '95 %' }],
  desc: 'Simulated spore populations with the published mean sizes and 90 per cent ranges: the share of spores at or below each Q value, for the three species.',
  height: 285,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'blur', figure(fig1, 'Figure 1. One spore of each species\' published mean size, drawn as an ellipse, blurred with a Gaussian of the sigma on the x axis (our assumption of a microscope\'s point spread), then measured by the Spore size measurer\'s real chain: automatic (Otsu) threshold, then the ellipse with the same second moments. Blur adds width without adding length, so Q falls, and it falls hardest for the smallest spore.'));
  md = inject(md, 'px', figure(fig2, 'Figure 2. The same three spores on sharp images of different pixel sizes. Past about five pixels per micrometre the pixel grid is not what limits Q.'));
  md = inject(md, 'spread', figure(fig3, 'Figure 3. Simulated populations (n as in the paper) with each species\' published mean length, mean width and 90 % ranges, and a length-width correlation of 0.5 (our assumption). Q varies a lot inside one species, which is why a published Q range is wider than the ratio of the two size ranges.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
