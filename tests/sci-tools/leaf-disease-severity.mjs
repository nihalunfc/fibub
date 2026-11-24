// #328 Leaf disease severity. Checked against a NumPy / scikit-image (rgb2hsv, threshold_otsu) / SciPy
// (binary_fill_holes, ndimage.label) version of the same rules on the example leaf with heavy added noise.
import * as P from '../../src/lib/sci/plantimg.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const d = P.exampleDisease();
  const o = { bg: 'light', leafT: -1, hueLo: 65, hueHi: 170, sMin: 0.15, fill: true, minSpot: 20 };
  const s = P.severity(d.px, d.w, d.h, o);
  check(`disease: example leaf 150 781 px with 10 246 px of lesion drawn, 6.795 % (got ${s.leaf}, ${s.lesion})`, s.leaf === d.leafPx && s.lesion === d.lesionPx && near(s.pct, 6.79529, 1e-4) && s.spots === 6);
  const n = P.exampleDisease(); P.noise(n, 25, 99);
  const a = P.severity(n.px, n.w, n.h, { ...o, hueLo: 80, hueHi: 150, sMin: 0.3 });
  check(`disease: noisy leaf, light background: Otsu 80, leaf 150 781, lesion 10 437 (NumPy 10 439, two pixels on the hue edge), 6 spots`, a.leafT === 80 && a.leaf === 150781 && Math.abs(a.lesion - 10439) <= 3 && a.spots === 6);
  const b = P.severity(n.px, n.w, n.h, { ...o, hueLo: 80, hueHi: 150, sMin: 0.3, bg: 'dark', leafT: 120, fill: false });
  check('disease: dark-background rule with a typed threshold matches NumPy exactly (273 816 leaf, 163 131 lesion, 9 spots)', b.leaf === 273816 && b.lesion === 163131 && b.spots === 9);
  // Severity classes from a typed scale of upper limits.
  const sc = P.parseScale('0, 5, 10, 25, 50, 100');
  check('disease: scale parsed', Array.isArray(sc) && sc.length === 6);
  check('disease: classes 0 % → 0, 4.9 → 1, 5 → 1, 6.8 → 2, 50.1 → 5, 100 → 5', [0, 4.9, 5, 6.8, 50.1, 100].map((p) => P.severityClass(p, sc)).join() === '0,1,1,2,5,5');
  check('disease: bad scales refused', typeof P.parseScale('0, 10, 5, 100') === 'string' && typeof P.parseScale('0, 5, 90') === 'string' && typeof P.parseScale('x') === 'string');

  // Drawn rust leaves as in the blog article on Qin et al. (2025), Front. Plant Sci. 16: 1510663 (CC BY 4.0,
  // doi:10.3389/fpls.2025.1510663): a green leaf with pustules made of a dark core inside a pale yellow halo, both
  // diseased. The hue-and-saturation rule must read the drawn severity exactly; a grey Otsu split inside the leaf
  // catches only about half of it, which is where "lesion expansion coefficients" come from.
  { const W = 380, H = 170, GREEN = [64, 138, 54], CORE = [120, 70, 30], HALO = [205, 192, 76];
    const put = (px, x, y, c) => { const i = 4 * (y * W + x); px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255; };
    const ell = (px, cx, cy, a, b, c, mask, onlyIn) => { let k = 0;
      for (let y = Math.max(0, Math.floor(cy - b)); y <= Math.min(H - 1, Math.ceil(cy + b)); y++) for (let x = Math.max(0, Math.floor(cx - a)); x <= Math.min(W - 1, Math.ceil(cx + a)); x++) {
        if (((x - cx) / a) ** 2 + ((y - cy) / b) ** 2 > 1) continue; if (onlyIn && !onlyIn[y * W + x]) continue;
        put(px, x, y, c); if (mask) mask[y * W + x] = 1; k++; } return k; };
    const draw = (target, seed) => { const px = new Uint8ClampedArray(W * H * 4);
      for (let i = 0; i < W * H; i++) { px[4 * i] = 248; px[4 * i + 1] = 248; px[4 * i + 2] = 245; px[4 * i + 3] = 255; }
      const lm = new Uint8Array(W * H), leafPx = ell(px, W / 2, H / 2, 170, 60, GREEN, lm, null);
      const dis = new Uint8Array(W * H), r = P.rng(seed);
      let tries = 0;
      while (P.countOnes(dis) / leafPx < target / 100 && tries < 4000) { tries++;
        const a = 4 + r() * 11, b = a * (0.5 + r() * 0.5), cx = W / 2 + (r() * 2 - 1) * 165, cy = H / 2 + (r() * 2 - 1) * 56;
        if (!lm[Math.round(cy) * W + Math.round(cx)]) continue;
        ell(px, cx, cy, a + 4, b + 4, HALO, dis, lm); ell(px, cx, cy, a, b, CORE, null, lm); }
      P.noise({ px, w: W, h: H }, 5, seed + 1);
      return { px, leafPx, truePct: (100 * P.countOnes(dis)) / leafPx }; };
    const grey = (px) => { const n = W * H, mc = P.minChannel(px, n), leaf = P.threshold(mc, P.otsu(P.histogram(mc)), true);
      const g = P.luminance(px, n), t = P.otsu(P.histogram(g, leaf)), dark = P.countOnes(P.threshold(g, t, true, leaf)), nl = P.countOnes(leaf);
      return (100 * Math.min(dark, nl - dark)) / nl; };
    const out = [1, 5, 10, 20, 40].map((c, i) => { const L = draw(c, 1000 + c * 37 + i), s = P.severity(L.px, W, H, { bg: 'light', leafT: -1, hueLo: 65, hueHi: 170, sMin: 0.15, fill: true, minSpot: 20 });
      return { trueP: L.truePct, tool: s.pct, leaf: s.leaf === L.leafPx, ratio: L.truePct / grey(L.px) }; });
    check(`drawn rust leaves: the colour rule reads the drawn severity to 0.01 points at ${out.map((o) => o.trueP.toFixed(1)).join(', ')} %`,
      out.every((o) => Math.abs(o.tool - o.trueP) < 0.01 && o.leaf));
    check(`drawn rust leaves: a grey Otsu split needs an expansion coefficient of ${out.map((o) => o.ratio.toFixed(2)).join(', ')} (1.7 to 2.3 leaf by leaf), because the halo is about half the lesion`,
      out.every((o) => o.ratio > 1.7 && o.ratio < 2.3)); }
};
