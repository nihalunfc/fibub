// #329 Spore size measurer: summary statistics checked against NumPy (mean, std ddof=1, percentile linear), and
// the moment-ellipse fit (checked against scikit-image regionprops in the leaf area tests) on made-up spores.
import * as P from '../../src/lib/sci/plantimg.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const L = [9.1, 10.2, 11.0, 9.8, 10.5, 12.1, 8.7, 10.0, 10.9, 9.5], W = [5.6, 6.1, 6.3, 5.9, 6.0, 6.8, 5.2, 5.8, 6.4, 5.7];
  const s = P.sporeStats(L, W, 'sd'), p = P.sporeStats(L, W, 'pct');
  check('spores: length mean 10.18, SD 0.998666 (NumPy)', near(s.L.mean, 10.18, 1e-12) && near(s.L.sd, 0.9986657765906136, 1e-12));
  check('spores: width SD 0.451664, Q mean 1.700060, Q SD 0.0486197 (NumPy)', near(s.W.sd, 0.45166359162544856, 1e-12) && near(s.Q.mean, 1.7000598128209226, 1e-12) && near(s.Q.sd, 0.048619650751977606, 1e-12));
  check('spores: 5th and 95th percentiles of length 8.88 and 11.605 (numpy.percentile)', near(p.L.lo, 8.88, 1e-9) && near(p.L.hi, 11.605, 1e-9) && near(p.Q.lo, 1.641207627118644, 1e-12));
  check('spores: mean ± SD format', s.text === '(8.7–)9.2–11.2(–12.1) × (5.2–)5.5–6.4(–6.8) µm; mean 10.2 ± 1.0 × 6.0 ± 0.5 µm; Q = (1.63–)1.65–1.75(–1.78), Qm = 1.70 ± 0.05; n = 10');
  check('spores: percentile format', p.text.startsWith('(8.7–)8.9–11.6(–12.1) × (5.2–)5.4–6.6(–6.8) µm'));
  check('spores: one spore has SD 0 and no outer brackets', P.sporeStats([10], [5], 'sd').text.startsWith('10.0–10.0 × 5.0–5.0 µm'));
  // Made-up spores at 10 px per µm: the moment ellipse gives each spore's length and width within 0.03 µm.
  const e = P.exampleSpores(), v = P.luminance(e.px, e.w * e.h), t = P.otsu(P.histogram(v));
  const b = P.blobs(P.threshold(v, t, true), e.w, e.h, 1, 1e9).filter((r) => r.major / 10 <= 100 && r.major / r.minor <= 4);
  const err = Math.max(...b.map((r) => Math.min(...e.L.map((l, i) => Math.abs(l - r.major / 10) + Math.abs(e.W[i] - r.minor / 10)))));
  check(`spores: 24 spores found, each within 0.03 µm of its drawn size (worst ${err.toFixed(3)}), scale bar left out by Q`, b.length === 24 && err < 0.03);
  check('spores: fitted summary equals the drawn one', P.sporeStats(b.map((r) => r.major / 10), b.map((r) => r.minor / 10), 'sd').text === P.sporeStats(e.L, e.W, 'sd').text);
};
