// Figures for src/blog/discoveries/wheat-stripe-rust-lesion-expansion-severity.md, made with the maths of the Leaf
// disease severity tool (src/lib/sci/plantimg.ts: leaf threshold, hue-and-saturation lesion rule, severity classes),
// with the grey-Otsu lesion rule of the paper built from the same library.
// Run: node scripts/blog-figures/wheat-stripe-rust-lesion-expansion-severity.mjs
import fs from 'node:fs';
import { severity, severityClass, parseScale, luminance, histogram, otsu, threshold, countOnes, minChannel, noise, rng } from '../../src/lib/sci/plantimg.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/wheat-stripe-rust-lesion-expansion-severity.md', import.meta.url);

// Paper: Qin, F., Wang, H., Jiang, Q. and Wang, H. (2025), Front. Plant Sci. 16: 1510663,
// doi:10.3389/fpls.2025.1510663 (CC BY 4.0). Values used: the GB/T 15795-2011 severity classes 1, 5, 10, 20, 40,
// 60, 80 and 100 %; 400 single wheat leaf images, 50 per class; manual lesion and leaf segmentation in Photoshop
// against automatic segmentation by rgb2gray + Otsu + connected components; lesion expansion coefficients
// Grate 2.74 (one for all classes) and minrate 1.28 to 3.31 / meanrate 3.31 to 4.21 per class; class accuracy
// 89.91 to 93.34 % with no coefficient and 92.57 to 96.16 % with Grate 2.74.
const SCALE = parseScale('1, 5, 10, 20, 40, 60, 80, 100');
const CLASSES = [1, 5, 10, 20, 40]; // above 40 % the disease is no longer the minority of the leaf, so a one-threshold grey rule has nothing to find
const PER_CLASS = 28;

// ---------- our synthetic rust leaves ----------
// A green leaf on pale paper. Each pustule is a dark reddish-brown core inside a pale yellow chlorotic halo of
// fixed width: both count as diseased tissue. OUR drawing; the paper's own images are photographs.
const PAPER = [248, 248, 245], GREEN = [64, 138, 54], CORE = [120, 70, 30], HALO = [205, 192, 76];
const putPx = (px, w, x, y, c) => { const i = 4 * (y * w + x); px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255; };
function ell(px, w, h, cx, cy, a, b, c, mask, onlyIn) {
  let k = 0;
  for (let y = Math.max(0, Math.floor(cy - b)); y <= Math.min(h - 1, Math.ceil(cy + b)); y++) for (let x = Math.max(0, Math.floor(cx - a)); x <= Math.min(w - 1, Math.ceil(cx + a)); x++) {
    if (((x - cx) / a) ** 2 + ((y - cy) / b) ** 2 > 1) continue;
    if (onlyIn && !onlyIn[y * w + x]) continue;
    putPx(px, w, x, y, c); if (mask) mask[y * w + x] = 1; k++;
  }
  return k;
}
function leafWith(target, seed) {
  const w = 380, h = 170, px = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) { px[4 * i] = PAPER[0]; px[4 * i + 1] = PAPER[1]; px[4 * i + 2] = PAPER[2]; px[4 * i + 3] = 255; }
  const leafMask = new Uint8Array(w * h);
  const leafPx = ell(px, w, h, w / 2, h / 2, 170, 60, GREEN, leafMask, null);
  const dis = new Uint8Array(w * h), core = new Uint8Array(w * h);
  const r = rng(seed), HALOW = 4; // halo width in pixels, OUR assumption
  let tries = 0;
  while (countOnes(dis) / leafPx < target / 100 && tries < 4000) {
    tries++;
    const a = 4 + r() * 11, b = a * (0.5 + r() * 0.5);
    const cx = w / 2 + (r() * 2 - 1) * 165, cy = h / 2 + (r() * 2 - 1) * 56;
    if (!leafMask[Math.round(cy) * w + Math.round(cx)]) continue;
    ell(px, w, h, cx, cy, a + HALOW, b + HALOW, HALO, dis, leafMask);
    ell(px, w, h, cx, cy, a, b, CORE, core, leafMask);
  }
  noise({ px, w, h }, 5, seed + 1);
  return { px, w, h, leafPx, truePct: (100 * countOnes(dis)) / leafPx, corePct: (100 * countOnes(core)) / leafPx };
}

// The tool's rule: leaf by Otsu on the smallest channel, then hue 65-170 degrees with at least 15 % colour = healthy.
const OPTS = { bg: 'light', leafT: -1, hueLo: 65, hueHi: 170, sMin: 0.15, fill: true, minSpot: 20 };
// The paper's automatic rule, written with the same library: grey the picture, split it with Otsu's threshold
// inside the leaf, and take the minority side as lesion (a lesion is the smaller part of a leaf that is not all
// diseased). One threshold can only ever catch one side of the healthy green.
function greyRule(L) {
  const n = L.w * L.h, mc = minChannel(L.px, n), leaf = threshold(mc, otsu(histogram(mc)), true);
  const g = luminance(L.px, n), t = otsu(histogram(g, leaf));
  const dark = countOnes(threshold(g, t, true, leaf)), nl = countOnes(leaf);
  const les = Math.min(dark, nl - dark);
  return { pct: (100 * les) / nl, t, leaf: nl, side: dark < nl - dark ? 'darker' : 'brighter' };
}

const rows = [];
for (const target of CLASSES) for (let j = 0; j < PER_CLASS; j++) {
  const L = leafWith(target, 1000 + target * 37 + j * 7);
  const s = severity(L.px, L.w, L.h, OPTS), g = greyRule(L);
  rows.push({ target, truePct: L.truePct, corePct: L.corePct, tool: s.pct, grey: g.pct, ratio: L.truePct / g.pct, leafT: s.leafT, spots: s.spots, leafErr: (100 * (s.leaf - L.leafPx)) / L.leafPx });
}
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const half = (v) => (Math.max(...v) - Math.min(...v)) / 2;
const byClass = CLASSES.map((c) => { const r = rows.filter((x) => x.target === c); return { c, trueP: +mean(r.map((x) => x.truePct)).toFixed(2), trueHalf: +half(r.map((x) => x.truePct)).toFixed(2), tool: +mean(r.map((x) => x.tool)).toFixed(2), toolHalf: +half(r.map((x) => x.tool)).toFixed(2), grey: +mean(r.map((x) => x.grey)).toFixed(2), greyHalf: +half(r.map((x) => x.grey)).toFixed(2), ratio: +mean(r.map((x) => x.ratio)).toFixed(2), ratioHalf: +half(r.map((x) => x.ratio)).toFixed(2) }; });
const G = mean(rows.map((x) => x.ratio)); // our analogue of the paper's single "Grate" coefficient
const toolErr = Math.max(...rows.map((x) => Math.abs(x.tool - x.truePct)));
const acc = (f) => (100 * rows.filter((x) => severityClass(f(x), SCALE) === severityClass(x.truePct, SCALE)).length) / rows.length;
const accTool = acc((x) => x.tool), accGrey = acc((x) => x.grey), accG = acc((x) => x.grey * G);
const accPaperG = acc((x) => x.grey * 2.74);

const fig1 = chart({
  title: 'Two lesion rules on the same drawn leaves', xLabel: 'Severity drawn (% of leaf area)', yLabel: 'Severity measured (%)',
  series: [
    { name: 'Colour rule (the tool)', kind: 'dots', x: byClass.map((b) => b.trueP), y: byClass.map((b) => b.tool), errors: byClass.map((b) => b.toolHalf), size: 4 },
    { name: 'Grey + Otsu, minority side', kind: 'dots', x: byClass.map((b) => b.trueP), y: byClass.map((b) => b.grey), errors: byClass.map((b) => b.greyHalf), size: 4 },
    { name: '', noLegend: true, kind: 'line', x: [0, 48], y: [0, 48], colour: 'var(--muted)', dash: '4 4' },
  ],
  xDomain: [0, 48], yDomain: [0, 48],
  desc: `On 140 drawn leaves (five classes, bars showing the spread) the tool's hue rule follows the drawn severity to within ${toolErr.toFixed(2)} percentage points, while a grey Otsu threshold sees only the dark pustule cores and reads far too low.`, height: 270,
});
const fig2 = chart({
  title: 'Why one expansion coefficient cannot fit every class', xLabel: 'Severity class drawn (%)', yLabel: 'True ÷ grey-threshold lesion area',
  series: [
    { name: 'Our drawn leaves', kind: 'dots', x: byClass.map((b) => b.c), y: byClass.map((b) => b.ratio), errors: byClass.map((b) => b.ratioHalf), size: 4 },
    { name: 'Paper’s class-wise coefficients', kind: 'dots', x: [1, 5, 10, 20, 40, 60, 80], y: [1.28, 3.05, 3.04, 3.17, 2.88, 3.26, 3.31], size: 4 },
  ],
  xDomain: [0, 45], yDomain: [1, 4.6],
  hlines: [{ y: 2.74, text: 'paper’s single coefficient 2.74' }, { y: +G.toFixed(2), text: `ours, ${G.toFixed(2)}` }],
  desc: `The ratio of true to grey-threshold lesion area against severity class, for our drawn leaves and for the paper's own class-wise coefficients. Both move with the class, so a single number is a compromise.`, height: 270,
});

console.log(JSON.stringify({
  n: rows.length, byClass, G: +G.toFixed(3), toolErr: +toolErr.toFixed(3),
  meanToolBias: +mean(rows.map((x) => x.tool - x.truePct)).toFixed(3), meanLeafErr: +mean(rows.map((x) => x.leafErr)).toFixed(4),
  ratioRange: [+Math.min(...byClass.map((b) => b.ratio)).toFixed(2), +Math.max(...byClass.map((b) => b.ratio)).toFixed(2)],
  accuracy: { tool: +accTool.toFixed(1), grey: +accGrey.toFixed(1), greyTimesOurs: +accG.toFixed(1), greyTimes274: +accPaperG.toFixed(1) },
  coreShare: +mean(rows.map((x) => x.corePct / x.truePct)).toFixed(3), sizes: [fig1.length, fig2.length],
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rules', figure(fig1, 'Figure 1. 140 drawn rust leaves (20 in each of seven severity classes), measured two ways with the same library: the tool’s hue-and-saturation rule, and a grey picture with Otsu’s threshold inside the leaf. The dashed line is perfect agreement. Drawn leaves, not the paper’s photographs.'));
  md = inject(md, 'coef', figure(fig2, 'Figure 2. How much a grey threshold has to be expanded to recover the whole diseased area, by severity class: ours from drawn leaves, beside the paper’s own class-wise coefficients. The two sets are not comparable in value, only in shape.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
