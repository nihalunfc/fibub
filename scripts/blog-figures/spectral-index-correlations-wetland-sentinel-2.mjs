// Figures for src/blog/discoveries/spectral-index-correlations-wetland-sentinel-2.md, made with the maths of the
// Spectral index calculator (src/lib/sci/spectral.ts: INDICES and computeIndex) and the CSV profiler's
// correlation (src/lib/sci/csvprofile.ts: pearson).
// Run: node scripts/blog-figures/spectral-index-correlations-wetland-sentinel-2.mjs
import fs from 'node:fs';
import { INDICES, computeIndex, stats } from '../../src/lib/sci/spectral.ts';
import { pearson } from '../../src/lib/sci/csvprofile.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/spectral-index-correlations-wetland-sentinel-2.md', import.meta.url);

// ---------------------------------------------------------------------------
// A made-up wetland scene. The class reflectances are OUR ASSUMPTION: plausible Sentinel-2 surface reflectance
// for the covers of a Polissya mire (open water, sphagnum bog, sedge fen, wet meadow, pine forest, bare peat).
// The paper gives no reflectance values at all, only index correlations, so nothing here is its data.
const CLASSES = [
  { name: 'Open water', blue: 0.045, green: 0.055, red: 0.035, nir: 0.015, swir1: 0.008, swir2: 0.005 },
  { name: 'Sphagnum bog', blue: 0.035, green: 0.070, red: 0.050, nir: 0.28, swir1: 0.18, swir2: 0.09 },
  { name: 'Sedge fen', blue: 0.030, green: 0.075, red: 0.040, nir: 0.33, swir1: 0.19, swir2: 0.09 },
  { name: 'Wet meadow', blue: 0.035, green: 0.090, red: 0.055, nir: 0.38, swir1: 0.22, swir2: 0.11 },
  { name: 'Pine forest', blue: 0.025, green: 0.050, red: 0.030, nir: 0.30, swir1: 0.14, swir2: 0.06 },
  { name: 'Bare peat', blue: 0.070, green: 0.100, red: 0.130, nir: 0.20, swir1: 0.28, swir2: 0.24 },
];
const BANDS = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
let seed = 20250411;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

/** n pixels per class, each band multiplied by 1 ± spread (uniform). */
function scene(perClass, spread) {
  const n = perClass * CLASSES.length, out = {};
  for (const b of BANDS) out[b] = new Float32Array(n);
  let i = 0;
  for (const c of CLASSES) for (let k = 0; k < perClass; k++, i++) for (const b of BANDS) out[b][i] = Math.max(0.001, c[b] * (1 + spread * 2 * (rnd() - 0.5)));
  return { bands: out, n };
}

const def = (id) => INDICES.find((d) => d.id === id);
/** Every index through the real tool maths. GNDVI and NDRE are not in the tool's list; GNDVI is the tool's
 * "custom" normalised difference with band a = NIR and band b = Green. */
function allIndices({ bands, n }) {
  return {
    NDVI: computeIndex(def('ndvi'), bands, n),
    SAVI: computeIndex(def('savi'), bands, n, 1, 0, 0.5),
    EVI: computeIndex(def('evi'), bands, n),
    NDWI: computeIndex(def('ndwi'), bands, n),
    GNDVI: computeIndex('custom', { a: bands.nir, b: bands.green }, n),
    MNDWI: computeIndex(def('mndwi'), bands, n),
  };
}

const S = scene(700, 0.15);
const I = allIndices(S);
const arr = (v) => Array.from(v);
const r = (a, b) => pearson(arr(I[a]), arr(I[b]));
const PAIRS = [['NDVI', 'SAVI'], ['NDVI', 'EVI'], ['SAVI', 'EVI'], ['NDVI', 'NDWI'], ['NDVI', 'GNDVI'], ['GNDVI', 'NDWI'], ['SAVI', 'NDWI'], ['NDWI', 'MNDWI']];
const pix = PAIRS.map(([a, b]) => [a, b, +r(a, b).toFixed(4)]);

// The exact identity: GNDVI = -NDWI pixel by pixel.
let worst = 0;
for (let i = 0; i < S.n; i++) worst = Math.max(worst, Math.abs(I.GNDVI[i] + I.NDWI[i]));

// EVI worked out from unscaled Sentinel-2 digital numbers (reflectance x 10000), the mistake the tool's
// "Scale (reflectance = DN x scale + offset)" field exists to prevent: the +1 in EVI's denominator is only
// right for reflectance between 0 and 1.
const DN = {}; for (const b of BANDS) DN[b] = Float32Array.from(S.bands[b], (v) => v * 10000);
const eviDN = computeIndex(def('evi'), DN, S.n);
const eviDNr = +pearson(arr(I.NDVI), arr(eviDN)).toFixed(4);
const eviDNs = stats(eviDN);

// The same correlations over the vegetated pixels only (NDVI > 0.2), to show how much the range of cover types
// in the window decides the correlation.
const keep = []; for (let i = 0; i < S.n; i++) if (I.NDVI[i] > 0.2) keep.push(i);
const sub = (a) => keep.map((i) => I[a][i]);
const veg = PAIRS.map(([a, b]) => [a, b, +pearson(sub(a), sub(b)).toFixed(4)]);

// Eight "yearly" scene means, the way a yearly median composite is summarised: does aggregation change the
// correlations? Each year gets its own vigour factor on NIR and red (OUR ASSUMPTION).
const years = [];
for (let y = 0; y < 8; y++) {
  const vig = 0.85 + 0.05 * y;
  const Sy = scene(400, 0.15);
  for (let i = 0; i < Sy.n; i++) { Sy.bands.nir[i] *= vig; Sy.bands.red[i] /= vig; }
  const Iy = allIndices(Sy);
  years.push(Object.fromEntries(Object.entries(Iy).map(([k, v]) => [k, stats(v).mean])));
}
const yr = (a, b) => +pearson(years.map((o) => o[a]), years.map((o) => o[b])).toFixed(4);
const agg = PAIRS.map(([a, b]) => [a, b, yr(a, b)]);

// SAVI as an exact function of NDVI when NIR + Red is held at the scene's mean: SAVI = 1.5·NDVI·s/(s + L)
const sMean = (() => { let s = 0; for (let i = 0; i < S.n; i++) s += S.bands.nir[i] + S.bands.red[i]; return s / S.n; })();
const ndviGrid = Array.from({ length: 101 }, (_, i) => -0.4 + (i * 1.4) / 100);
const saviLine = ndviGrid.map((v) => +((1.5 * v * sMean) / (sMean + 0.5)).toFixed(4));

const every = (v, k) => arr(v).filter((_, i) => i % k === 0);
const fig1 = chart({
  title: 'Three vegetation indices, same pixels', xLabel: 'NDVI', yLabel: 'Index value',
  series: [
    { name: `SAVI (r = ${pix[0][2].toFixed(2)})`, kind: 'dots', x: every(I.NDVI, 110), y: every(I.SAVI, 110), size: 1.8, opacity: 0.75 },
    { name: `EVI (r = ${pix[1][2].toFixed(2)})`, kind: 'dots', x: every(I.NDVI, 110), y: every(I.EVI, 110), size: 1.8, opacity: 0.75 },
    { name: '', noLegend: true, kind: 'line', x: ndviGrid, y: saviLine, colour: 'var(--ink)', dash: '5 4' },
  ],
  xDomain: [-0.5, 1], yDomain: [-0.6, 1.1],
  desc: 'Simulated wetland pixels: SAVI against NDVI falls on a tight line, while EVI against NDVI is a broad cloud.',
  height: 280,
});
const fig2 = chart({
  title: 'GNDVI against NDWI: one line, not a correlation', xLabel: 'NDWI = (Green − NIR) ÷ (Green + NIR)', yLabel: 'Index value',
  series: [
    { name: `GNDVI (r = ${pix[5][2].toFixed(4)})`, kind: 'dots', x: every(I.NDWI, 80), y: every(I.GNDVI, 80), size: 1.8, opacity: 0.75 },
    { name: `NDVI (r = ${pix[3][2].toFixed(2)})`, kind: 'dots', x: every(I.NDWI, 80), y: every(I.NDVI, 80), size: 1.8, opacity: 0.75 },
  ],
  xDomain: [-1, 0.8], yDomain: [-1, 1],
  desc: 'Simulated wetland pixels: GNDVI is exactly minus NDWI, so the points lie on a straight line of slope -1, while NDVI against NDWI is close to but not exactly a line.',
  height: 280,
});

// ---------------------------------------------------------------------------
// The tool page's own example scene, copied from src/tools/spectral-index-calculator/Tool.astro (demoScene), so the
// numbers in "Check it yourself" are the ones the real page shows for its example.
function demoScene() {
  const W = 200, H = 150, n = W * H;
  let sd = 12345; const rn = () => ((sd = (sd * 1103515245 + 12345) % 2147483648) / 2147483648);
  const C = { water: [0.06, 0.07, 0.04, 0.02, 0.012, 0.006], forest: [0.03, 0.06, 0.03, 0.34, 0.16, 0.07], crop: [0.05, 0.09, 0.06, 0.44, 0.22, 0.1], burn: [0.05, 0.06, 0.08, 0.12, 0.2, 0.25], town: [0.1, 0.12, 0.14, 0.2, 0.28, 0.24], soil: [0.1, 0.14, 0.2, 0.28, 0.35, 0.3] };
  const bands = BANDS.map(() => new Float32Array(n));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x + 5 * Math.sin(y / 9), w = y + 4 * Math.sin(x / 11);
    let t = 'crop';
    if (((u - 55) / 38) ** 2 + ((w - 45) / 26) ** 2 < 1) t = 'water';
    else if ((u - 70) ** 2 + (w - 115) ** 2 < 22 ** 2) t = 'burn';
    else if (u < 90 && w > 80) t = 'forest';
    else if (u > 150 && w < 60) t = 'town';
    else if (u > 100 && ((Math.floor(u / 25) + Math.floor(w / 30)) % 2 === 0)) t = 'soil';
    const i = y * W + x, v = C[t];
    const field = Math.floor(u / 25) * 7 + Math.floor(w / 30), vig = t === 'crop' || t === 'forest' ? 0.75 + 0.5 * ((field * 0.618) % 1) : 1;
    for (let b = 0; b < 6; b++) { const g = b === 3 ? vig : b === 2 ? 1 / vig : 1; bands[b][i] = Math.max(0.001, v[b] * g * (1 + 0.1 * (rn() - 0.5))); }
  }
  return { bands: Object.fromEntries(BANDS.map((b, i) => [b, bands[i]])), n };
}
const D0 = demoScene(), ID = allIndices(D0);
const dstat = Object.fromEntries(Object.entries(ID).map(([k, v]) => [k, stats(v)]));
let dworst = 0; for (let i = 0; i < D0.n; i++) dworst = Math.max(dworst, Math.abs(ID.GNDVI[i] + ID.NDWI[i]));
console.log('example scene:', Object.entries(dstat).map(([k, s]) => `${k} mean ${s.mean.toFixed(3)} (min ${s.min.toFixed(3)}, max ${s.max.toFixed(3)}, sd ${s.sd.toFixed(3)})`).join('; '));
console.log('example scene worst |GNDVI + NDWI| =', dworst, 'r(GNDVI, NDWI) =', +pearson(arr(ID.GNDVI), arr(ID.NDWI)).toFixed(6));

const show = (rows) => rows.map(([a, b, v]) => `${a}-${b} ${v}`).join('  ');
console.log('pixel level  :', show(pix));
console.log('EVI from DN  : r with NDVI', eviDNr, 'mean', eviDNs.mean.toFixed(4), 'min', eviDNs.min.toFixed(3), 'max', eviDNs.max.toFixed(3));
console.log('vegetated    :', show(veg), ' n =', keep.length);
console.log('yearly means :', show(agg));
console.log('worst |GNDVI + NDWI| =', worst, ' NIR+Red mean =', sMean.toFixed(4));
for (const [k, v] of Object.entries(I)) { const s = stats(v); console.log(k.padEnd(6), 'mean', s.mean.toFixed(4), 'min', s.min.toFixed(3), 'max', s.max.toFixed(3), 'sd', s.sd.toFixed(4)); }

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'vi', figure(fig1, 'Figure 1. Our simulated wetland scene (4,200 pixels, six cover types, one pixel in 110 drawn) through the Spectral index calculator\'s own index maths. SAVI tracks NDVI almost exactly (the dashed line is SAVI worked out from NDVI alone, holding NIR + Red at the scene mean); EVI does not, because its blue-band denominator changes from pixel to pixel. Not the paper\'s data.'));
  md = inject(md, 'id', figure(fig2, 'Figure 2. The same scene (one pixel in 80 drawn): GNDVI plotted against NDWI lies on a perfect straight line of slope −1, because the two indices are the same expression with the bands swapped. NDVI against NDWI is tight but genuinely curved.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
