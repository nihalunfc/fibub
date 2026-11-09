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
};
