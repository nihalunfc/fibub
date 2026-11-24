// Figures for src/blog/discoveries/crabapple-leaf-area-montgomery-parameter-images.md, made with the maths of the
// Leaf area tool (src/lib/sci/plantimg.ts: smallest-channel image, Otsu threshold, connected groups, hole filling,
// reference-square scale). Run: node scripts/blog-figures/crabapple-leaf-area-montgomery-parameter-images.mjs
import fs from 'node:fs';
import { minChannel, histogram, otsu, threshold, leafArea, rect, noise } from '../../src/lib/sci/plantimg.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/crabapple-leaf-area-montgomery-parameter-images.md', import.meta.url);

// Paper: Gu, W. et al. (2026), Plants 15(21): 3359, doi:10.3390/plants15213359 (CC BY 4.0 per Crossref).
// Values used: pooled Montgomery parameter k = 0.6641 (95 % CI 0.6632 to 0.6650), per-cultivar k 0.6313 to 0.7005,
// theoretical bounds 1/2 and pi/4, 12 cultivars, 3679 leaves, width-to-length ratio means 0.494 to 0.626 with
// coefficients of variation 7.1 % to 14.9 %, Montgomery r2 >= 0.9703 and RMSE <= 0.0285, square law 0.3332 <= r2
// <= 0.9035 and RMSE 0.0406 to 0.0846, and r = 0.97 between the CV of the ratio and the square law's RMSE.
const PX_CM = 40; // our synthetic scan resolution

// ---------- our synthetic leaves ----------
// A leaf outline is the superellipse |2x/L|^n + |2y/W|^n = 1. n = 1 is a rhombus (area = L*W/2), n = 2 an ellipse
// (area = pi/4 * L*W), so this one family covers exactly the range the paper calls theoretical. OUR shape model.
const kShape = (n) => { let s = 0, M = 200000; for (let i = 0; i < M; i++) { const u = (i + 0.5) / M; s += (1 - u ** n) ** (1 / n); } return s / M; };
const nForK = (k) => { let lo = 1, hi = 2; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; kShape(m) < k ? (lo = m) : (hi = m); } return (lo + hi) / 2; };

// Draw one leaf of length L cm and width W cm, plus a 1 cm reference square, on pale paper. Returns the picture.
function scan(L, W, n, seed) {
  const lp = Math.round(L * PX_CM), wp = Math.round(W * PX_CM);
  const w = lp + 120, h = Math.max(wp + 60, 110);
  const px = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) { px[4 * i] = 250; px[4 * i + 1] = 250; px[4 * i + 2] = 247; px[4 * i + 3] = 255; }
  const im = { px, w, h };
  rect(im, 8, 8, 8 + PX_CM, 8 + PX_CM, [20, 20, 20]); // the 1 cm reference square
  const cx = 100 + lp / 2, cy = h / 2, a = lp / 2, b = wp / 2;
  for (let y = Math.max(0, Math.floor(cy - b - 1)); y <= Math.min(h - 1, Math.ceil(cy + b + 1)); y++) {
    for (let x = Math.max(0, Math.floor(cx - a - 1)); x <= Math.min(w - 1, Math.ceil(cx + a + 1)); x++) {
      const u = Math.abs((x - cx) / a), v = Math.abs((y - cy) / b);
      if (u ** n + v ** n <= 1) { const i = 4 * (y * w + x); px[i] = 52; px[i + 1] = 120; px[i + 2] = 40; }
    }
  }
  noise(im, 6, seed);
  return im;
}
// Measure it exactly as the tool does on a light background.
function measure(im) {
  const nPx = im.w * im.h, v = minChannel(im.px, nPx), t = otsu(histogram(v));
  const mask = threshold(v, t, true);
  const r = leafArea(mask, im.w, im.h, { refAt: [8 + PX_CM / 2, 8 + PX_CM / 2], side: 1, minPx: 50, fill: true });
  if (typeof r === 'string') throw new Error(r);
  const leaf = r.leaves[0], pxSide = Math.sqrt(1 / r.unitPerPx2);
  return { area: r.total, leaves: r.leaves.length, threshold: t, pxSide, boxL: (leaf.x1 - leaf.x0 + 1) / pxSide, boxW: (leaf.y1 - leaf.y0 + 1) / pxSide, ellL: leaf.major / pxSide, ellW: leaf.minor / pxSide };
}

// ---------- 1. the Montgomery parameter against leaf shape ----------
const NS = [1, 1.2, 1.4, 1.5, 1.6, 1.8, 2];
const shapeRows = NS.map((n, i) => {
  const L = 7, W = 3.6, m = measure(scan(L, W, n, 11 + i));
  return { n, kTrue: +kShape(n).toFixed(4), kMeas: +(m.area / (L * W)).toFixed(4), kFromEllipse: +(m.area / (m.ellL * m.ellW)).toFixed(4), area: +m.area.toFixed(3), areaTrue: +(kShape(n) * L * W).toFixed(3), boxL: +m.boxL.toFixed(3), boxW: +m.boxW.toFixed(3), ellL: +m.ellL.toFixed(3), ellW: +m.ellW.toFixed(3) };
});
const nPooled = nForK(0.6641);

// ---------- 2. twelve synthetic cultivars: does the square law fail where the ratio varies? ----------
let seed = 20261124; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const NLEAF = 24;
const CULT = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  ratio: 0.494 + (i % 6) * ((0.626 - 0.494) / 5), // mean width-to-length ratio, paper's range
  cv: 0.071 + (i / 11) * (0.149 - 0.071), // CV of that ratio, paper's range
  n: 1.3 + (i / 11) * 0.5, // shape exponent, OUR choice, to span the paper's k range
  meanL: 4.9 + (i % 4) * 0.85,
}));
const fitLog = (y, x) => { const n = y.length, c = y.map((v, i) => Math.log(v) - Math.log(x[i])), k = Math.exp(c.reduce((s, v) => s + v, 0) / n); const res = c.map((v) => v - Math.log(k)); const ss = res.reduce((s, v) => s + v * v, 0); const my = y.reduce((s, v) => s + Math.log(v), 0) / n; const tot = y.reduce((s, v) => s + (Math.log(v) - my) ** 2, 0); return { k, rmse: Math.sqrt(ss / n), r2: 1 - ss / tot }; };
const corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n; let sa = 0, sb = 0, sab = 0; for (let i = 0; i < n; i++) { sa += (a[i] - ma) ** 2; sb += (b[i] - mb) ** 2; sab += (a[i] - ma) * (b[i] - mb); } return sab / Math.sqrt(sa * sb); };
const cv = (v) => { const m = v.reduce((s, x) => s + x, 0) / v.length; return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1)) / m; };

const cults = CULT.map((c, ci) => {
  const L = [], W = [], A = [];
  for (let j = 0; j < NLEAF; j++) {
    const len = Math.max(3, c.meanL * (1 + 0.15 * gauss()));
    const ratio = Math.max(0.3, c.ratio * (1 + c.cv * gauss()));
    const m = measure(scan(len, len * ratio, c.n, 100 + ci * 50 + j));
    L.push(len); W.push(len * ratio); A.push(m.area);
  }
  const lw = L.map((l, j) => l * W[j]), ll = L.map((l) => l * l);
  const me = fitLog(A, lw), sle = fitLog(A, ll);
  return { id: c.id, n: +c.n.toFixed(2), cvRatio: +(100 * cv(W.map((w, j) => w / L[j]))).toFixed(1), k: +me.k.toFixed(4), meRmse: +me.rmse.toFixed(4), meR2: +me.r2.toFixed(4), sleRmse: +sle.rmse.toFixed(4), sleR2: +sle.r2.toFixed(4), meanA: +(A.reduce((s, v) => s + v, 0) / A.length).toFixed(2), meanL: +(L.reduce((s, v) => s + v, 0) / L.length).toFixed(2) };
});
const rCv = corr(cults.map((c) => c.cvRatio), cults.map((c) => c.sleRmse));

// ---------- charts ----------
const nn = Array.from({ length: 51 }, (_, i) => 1 + i * 0.02);
const fig1 = chart({
  title: 'Montgomery parameter against leaf shape', xLabel: 'Shape exponent n (1 = rhombus, 2 = ellipse)', yLabel: 'k = area ÷ (length × width)',
  series: [
    { name: 'Exact for the shape', kind: 'line', x: nn, y: nn.map((n) => +kShape(n).toFixed(4)) },
    { name: 'Leaf area tool, from the picture', kind: 'dots', x: shapeRows.map((r) => r.n), y: shapeRows.map((r) => r.kMeas), size: 4 },
  ],
  xDomain: [1, 2], yDomain: [0.48, 0.81],
  hlines: [{ y: 0.5, text: 'rhombus, 1/2' }, { y: Math.PI / 4, text: 'ellipse, π/4' }, { y: 0.6641, text: 'paper’s pooled 0.6641' }],
  desc: 'The Montgomery parameter k of a superellipse leaf against its shape exponent, exact and as measured from a synthetic scan by the Leaf area tool. It runs from 0.5 at a rhombus to 0.785 at an ellipse.', height: 270,
});
const fig2 = chart({
  title: 'Where the square law fails', xLabel: 'Variation in width-to-length ratio (CV, %)', yLabel: 'RMSE of ln(area), square law',
  series: [
    { name: 'Square law (area ∝ length²)', kind: 'dots', x: cults.map((c) => c.cvRatio), y: cults.map((c) => c.sleRmse), size: 4 },
    { name: 'Montgomery (area ∝ length × width)', kind: 'dots', x: cults.map((c) => c.cvRatio), y: cults.map((c) => c.meRmse), size: 4 },
  ],
  xDomain: [5, 20], yDomain: [0, 0.3],
  desc: `Twelve synthetic cultivars of 24 leaves each, measured with the Leaf area tool. The square law's error grows with how much the width-to-length ratio varies (r = ${rCv.toFixed(2)}); the Montgomery equation's does not.`, height: 265,
});

console.log(JSON.stringify({ shapeRows, nPooled: +nPooled.toFixed(3), kAtPooled: +kShape(nPooled).toFixed(4), cults, rCv: +rCv.toFixed(3), rMe: +corr(cults.map((c) => c.cvRatio), cults.map((c) => c.meRmse)).toFixed(3), kRange: [Math.min(...cults.map((c) => c.k)), Math.max(...cults.map((c) => c.k))], sleR2: [Math.min(...cults.map((c) => c.sleR2)), Math.max(...cults.map((c) => c.sleR2))], meR2: [Math.min(...cults.map((c) => c.meR2)), Math.max(...cults.map((c) => c.meR2))], sizes: [fig1.length, fig2.length] }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'k', figure(fig1, 'Figure 1. The Montgomery parameter k for one family of leaf shapes: exact (line) and measured by the Leaf area tool’s maths from a synthetic 40 px per cm scan with a 1 cm reference square (dots). The paper’s pooled 0.6641 sits between a rhombus and an ellipse.'));
  md = inject(md, 'sle', figure(fig2, 'Figure 2. Twelve made-up cultivars, 24 leaves each, drawn and then measured by the tool. The square law’s error rises with the spread of the width-to-length ratio; the Montgomery equation’s stays flat. Not the paper’s leaves.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
