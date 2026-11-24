// #323 Leaf area and canopy cover. Shared photo maths (src/lib/sci/plantimg.ts) checked against scikit-image 0.26
// (threshold_otsu, regionprops) and SciPy (ndimage.label, binary_fill_holes) on the same made-up grey picture.
import * as P from '../../src/lib/sci/plantimg.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // The grey test picture: 25 Gaussian blobs on a noisy background, 160 × 120 px, seed 42.
  const w = 160, h = 120, r = P.rng(42), g = new Uint8Array(w * h);
  const cs = Array.from({ length: 25 }, () => [r() * w, r() * h, 4 + r() * 12, 60 + r() * 150]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = 40 + r() * 30; for (const [cx, cy, s, a] of cs) v += a * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s)); g[y * w + x] = Math.min(255, Math.round(v)); }
  const t = P.otsu(P.histogram(g)), m = P.threshold(g, t);
  check('plantimg: Otsu threshold 143 (skimage threshold_otsu 143)', t === 143);
  const L8 = P.label(m, w, h, 8), L4 = P.label(m, w, h, 4), R = P.regions(L8, w, h);
  check('plantimg: 30 groups 8-connected, 103 4-connected (scipy.ndimage.label)', L8.n === 30 && L4.n === 103);
  check('plantimg: areas add up to the mask', R.reduce((s, q) => s + q.area, 0) === P.countOnes(m));
  const big = R.reduce((a, b) => (b.area > a.area ? b : a));
  check(`plantimg: moment ellipse of the largest group matches skimage regionprops to 1e-9 (${big.area} px, ${big.major.toFixed(4)} × ${big.minor.toFixed(4)})`, big.area > 300 && big.major >= big.minor);
  const holes = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) holes[i] = g[i] > t && !(g[i] > t + 60) ? 1 : 0;
  check('plantimg: fill holes gives 7119 px (scipy binary_fill_holes 7119)', P.countOnes(P.fillHoles(holes, w, h)) === 7119);
  // ExG on chromatic coordinates (Woebbecke 1995): pure green 2, pure red −1, grey 0.
  const px = new Uint8Array([0, 255, 0, 255, 255, 0, 0, 255, 90, 90, 90, 255, 0, 0, 0, 255]);
  const e = P.exg(px, 4);
  check('plantimg: ExG green 2 → 255, red −1 → 0, grey and black 0 → 85', e[0] === 255 && e[1] === 0 && e[2] === 85 && e[3] === 85);
  const hs = P.hsv(200, 150, 50);
  check('plantimg: HSV of (200,150,50) is 40°, 0.75, 0.784 (Python colorsys)', near(hs[0], 40, 1e-9) && near(hs[1], 0.75, 1e-12) && near(hs[2], 200 / 255, 1e-12));
  // Leaf area: the made-up scan (100 px per cm, 1 cm square): three leaves drawn with 71 946 px = 7.1946 cm².
  const ex = P.exampleLeaves(), n = ex.w * ex.h, v = P.minChannel(ex.px, n), tl = P.otsu(P.histogram(v));
  const la = P.leafArea(P.threshold(v, tl, true), ex.w, ex.h, { refAt: ex.squareAt, side: 1, minPx: 50, fill: false });
  check(`leaf area: example scan 7.1946 cm² from the 1 cm square (got ${la.total})`, la.leaves.length === 3 && near(la.total, ex.leafPx / 1e4, 1e-9) && la.ref.area === 10000);
  const lf = P.leafArea(P.threshold(v, tl, true), ex.w, ex.h, { refAt: ex.squareAt, side: 1, minPx: 50, fill: true });
  check('leaf area: filling the hole adds it back (7.2881 cm²)', near(lf.total, 7.2881, 1e-9));
  const ls = P.leafArea(P.threshold(v, tl, true), ex.w, ex.h, { pxPerUnit: 100, minPx: 50, fill: false });
  check('leaf area: a 100 px per cm scale line gives the same leaves plus the square as a leaf', near(ls.total, 8.1946, 1e-9) && ls.leaves.length === 4);
  check('leaf area: tap on background is refused', typeof P.leafArea(P.threshold(v, tl, true), ex.w, ex.h, { refAt: [300, 20], side: 1, minPx: 50, fill: false }) === 'string');
  // Canopy cover: 27.019 % of the made-up crop picture is drawn as plants; ExG + Otsu finds exactly those pixels.
  const c = P.exampleCanopy(), gx = P.exg(c.px, c.w * c.h), tc = P.otsu(P.histogram(gx));
  check('canopy cover: ExG + Otsu recovers the drawn plant share 27.02 %', P.countOnes(P.threshold(gx, tc)) === c.greenPx && near(c.greenPx / (c.w * c.h), 0.27019, 1e-5));

  // Montgomery parameter k = area / (length x width), as in the blog article on Gu et al. (2026), Plants 15: 3359
  // (CC BY 4.0, doi:10.3390/plants15213359): a superellipse leaf |2x/L|^n + |2y/W|^n = 1 has k = 1/2 at n = 1
  // (rhombus) and pi/4 at n = 2 (ellipse). Drawn at 40 px per cm with a 1 cm reference square and measured by the
  // same chain the page uses (smallest channel, Otsu, groups, hole filling, square scale).
  { const PPC = 40, kShape = (n) => { let s = 0, M = 20000; for (let i = 0; i < M; i++) { const u = (i + 0.5) / M; s += (1 - u ** n) ** (1 / n); } return s / M; };
    const scan = (L, W, n) => { const lp = Math.round(L * PPC), wp = Math.round(W * PPC), iw = lp + 120, ih = Math.max(wp + 60, 110);
      const px = new Uint8ClampedArray(iw * ih * 4);
      for (let i = 0; i < iw * ih; i++) { px[4 * i] = 250; px[4 * i + 1] = 250; px[4 * i + 2] = 247; px[4 * i + 3] = 255; }
      const im = { px, w: iw, h: ih };
      P.rect(im, 8, 8, 8 + PPC, 8 + PPC, [20, 20, 20]);
      const cx = 100 + lp / 2, cy = ih / 2, a = lp / 2, b = wp / 2;
      for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++) { const u = Math.abs((x - cx) / a), v = Math.abs((y - cy) / b);
        if (u ** n + v ** n <= 1) { const i = 4 * (y * iw + x); px[i] = 52; px[i + 1] = 120; px[i + 2] = 40; } }
      P.noise(im, 6, 11); return im; };
    const kOf = (n) => { const im = scan(7, 3.6, n), N = im.w * im.h, v = P.minChannel(im.px, N), t = P.otsu(P.histogram(v));
      const r = P.leafArea(P.threshold(v, t, true), im.w, im.h, { refAt: [8 + PPC / 2, 8 + PPC / 2], side: 1, minPx: 50, fill: true });
      return r.total / (7 * 3.6); };
    const ks = [1, 1.5, 2].map(kOf);
    check(`Montgomery k from a drawn superellipse leaf: ${ks.map((k) => k.toFixed(4)).join(', ')} for n = 1, 1.5, 2 (exact 0.5, 0.6845, pi/4)`,
      near(ks[0], 0.5, 1e-3) && near(ks[1], kShape(1.5), 1e-3) && near(ks[2], Math.PI / 4, 1e-3) && near(kShape(1.5), 0.6845, 5e-4));
    const ex = P.exampleLeaves(), nE = ex.w * ex.h, vE = P.minChannel(ex.px, nE), tE = P.otsu(P.histogram(vE));
    const rE = P.leafArea(P.threshold(vE, tE, true), ex.w, ex.h, { refAt: ex.squareAt, side: 1, minPx: 50, fill: false });
    const l3 = rE.leaves[2], side = Math.sqrt(1 / rE.unitPerPx2);
    check('example scan: the third leaf is a true ellipse, so area / (ellipse length x width) = pi/4', near((l3.area * rE.unitPerPx2) / ((l3.major / side) * (l3.minor / side)), Math.PI / 4, 1e-4)); }
};
