// #T72 Star FWHM checker: the Moffat identity, the plate scale and measuring a synthetic star.
// Pinned by the article on daytime seeing at the Huairou Solar Observing Station
// (Shikhovtsev 2026, Universe 12(1): 11, doi:10.3390/universe12010011), whose median Fried parameter of
// 3.13 cm is 3.23" of seeing, which is 6.46 pixels at 0.5" per pixel.
import { moffatFwhm, measureStar, plateScale, background } from '../../src/lib/sci/starfwhm.ts';

// A noiseless Moffat star in the middle of a square patch, optionally stretched along x.
function star(fwhmPx, beta = 3.5, stretch = 1, n = 61, sky = 100, amp = 5000) {
  const d = new Float32Array(n * n).fill(sky), c = (n - 1) / 2;
  const alpha = fwhmPx / (2 * Math.sqrt(2 ** (1 / beta) - 1));
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const r = Math.hypot((x - c) / stretch, y - c);
    d[y * n + x] += amp * (1 + (r / alpha) ** 2) ** -beta;
  }
  return { d, n, c };
}

export default async (check) => {
  const near = (got, want, tol) => Number.isFinite(got) && Math.abs(got - want) <= tol;
  // Moffat FWHM = 2 alpha sqrt(2^(1/beta) - 1).
  check('starfwhm: moffatFwhm(3, 2.5) is 3.392 px', near(moffatFwhm(3, 2.5), 3.3915, 0.001));
  check('starfwhm: moffatFwhm(3.45, 3.5) is 3.229 px, the Huairou median seeing at 0.5"/px scale', near(moffatFwhm(3.45, 3.5), 3.2291, 0.001));
  // Plate scale = 206.265 * pixel (um) / focal length (mm).
  check('starfwhm: 3.76 um pixels at 480 mm are 1.616" per pixel', near(plateScale(3.76, 480), 1.6157, 0.001));
  check('starfwhm: 9 um pixels at 3712 mm are 0.500" per pixel', near(plateScale(9, 3712), 0.5001, 0.001));
  // Measuring a synthetic star: FWHM, roundness and half-flux radius come back.
  const a = star(6.46);
  const sa = measureStar(a.d, a.n, a.n, a.c, a.c, background(a.d).level, 20);
  check('starfwhm: a 6.46 px Moffat star measures back as 6.46 px', near(sa?.fwhm, 6.46, 0.05));
  check('starfwhm: it is round and its Moffat beta is 3.5', near(sa?.ecc, 0, 0.05) && near(sa?.beta, 3.5, 0.15));
  check('starfwhm: its half-flux radius is 3.86 px', near(sa?.hfr, 3.86, 0.1));
  // A star stretched 20 % along x: eccentricity sqrt(1 - (1/1.2)^2) = 0.553.
  const b = star(6.46, 3.5, 1.2);
  const sb = measureStar(b.d, b.n, b.n, b.c, b.c, background(b.d).level, 20);
  check('starfwhm: a 20 % stretched star gives eccentricity 0.55', near(sb?.ecc, 0.553, 0.05));
  check('starfwhm: and its major axis is 1.2 times its minor axis', near(sb?.fwhmMaj / sb?.fwhmMin, 1.2, 0.05));
};
