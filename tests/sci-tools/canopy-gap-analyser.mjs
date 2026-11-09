// #338 Canopy gap analyser: gap fraction by zenith ring, canopy openness and effective LAI (Miller 1967) from a
// fisheye sky mask, checked against an independent NumPy version on a made-up fisheye picture.
import * as P from '../../src/lib/sci/plantimg.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // Made-up canopy with spherical leaves, LAI 2.5: gap fraction exp(−0.5 × 2.5 / cos θ). 400 px picture.
  const e = P.exampleFisheye(2.5, 400), b = P.channel(e.px, 400 * 400, 2), t = P.otsu(P.histogram(b)), sky = P.threshold(b, t);
  const h = P.hemi(sky, 400, 400, e.cx, e.cy, e.R, 5, 75);
  check(`canopy: 5 rings to 75°: effective LAI 2.518544 (NumPy 2.5185439145) from a canopy drawn with LAI 2.5`, near(h.lai, 2.5185439145016866, 1e-9) && !h.capped);
  check('canopy: gap fraction 0.0915305 and openness 0.1031033 (NumPy)', near(h.gapFraction, 0.09153050740728466, 1e-12) && near(h.openness, 0.10310331753199577, 1e-12));
  check('canopy: ring gap fractions 0.28329, 0.2505, 0.2053, 0.12489, 0.03831 (NumPy)', [0.28329, 0.2505, 0.2053, 0.12489, 0.03831].every((g, i) => near(h.rings[i].gap, g, 6e-6)));
  check('canopy: ring gaps near the drawn exp(−1.25 / cos θ) at ring centres (0.2834, 0.2585, 0.2069, 0.1283, 0.0381)', [0.2834, 0.2585, 0.2069, 0.1283, 0.0381].every((g, i) => near(h.rings[i].gap, g, 0.01)));
  const h9 = P.hemi(sky, 400, 400, e.cx, e.cy, e.R, 9, 90);
  check('canopy: 9 rings to 90° give 2.331738 (NumPy), lower because the horizon rings are coarse', near(h9.lai, 2.3317376520784014, 1e-9));
  // Miller's formula is exact for spherical leaves: with gap exp(−0.5 L / cos θ) in every ring, LAI = L whatever the rings.
  const w = 801, c = 400, R = 400, m = new Uint8Array(w * w), Lt = 3;
  // Fill each ring with its exact gap share in a regular pattern (every pixel gets sky with a stable dither).
  const acc = new Float64Array(10);
  for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) { const r = Math.hypot(x + 0.5 - c, y + 0.5 - c); if (r > R) continue; const z = (r / R) * 90; if (z >= 75) continue; const k = Math.floor(z / 15), zc = ((k + 0.5) * 15 * Math.PI) / 180, T = Math.exp((-0.5 * Lt) / Math.cos(zc)); acc[k] += T; if (acc[k] >= 1) { m[y * w + x] = 1; acc[k] -= 1; } }
  const hx = P.hemi(m, w, w, c, c, R, 5, 75);
  check(`canopy: exact ring gaps for LAI 3 give back 3.00 (got ${hx.lai.toFixed(4)})`, near(hx.lai, 3, 0.01));
  const none = P.hemi(new Uint8Array(w * w), w, w, c, c, R, 5, 75);
  check('canopy: a ring with no sky is capped (finite LAI, flagged)', none.capped && Number.isFinite(none.lai) && none.gapFraction === 0);
  const all = P.hemi(new Uint8Array(w * w).fill(1), w, w, c, c, R, 5, 75);
  check('canopy: open sky gives LAI 0, openness 100 %', near(all.lai, 0, 1e-12) && near(all.openness, 1, 1e-12) && near(all.gapFraction, 1, 1e-12));
};
