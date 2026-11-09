// #972 CT reconstruction. Reference values from an independent numpy implementation (numeric line integrals of
// the phantom, numpy.fft ramp filtering, numpy.interp back-projection), written for these tests; it agreed to
// 1e-13 for every filter.
import * as C from '../../src/lib/sci/phct.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const N = 64, e = C.PHANTOMS.head.e, th = C.angles(90), rows = C.sinogram(e, th, N);
  check('ct: exact projections match numpy numeric line integrals', near(rows[10][30], 17.975666, 1e-5) && near(rows[45][12], 11.338328, 1e-5));
  const r = C.fbp(rows, th, N, 'ramp'), h = C.fbp(rows, th, N, 'hann'), n0 = C.fbp(rows, th, N, 'none');
  check('ct: ramp FBP matches numpy', near(r[32 * N + 32], 0.2481556, 1e-6) && near(r[20 * N + 40], 0.2403170, 1e-6));
  check('ct: Hann FBP matches numpy', near(h[32 * N + 32], 0.2484608, 1e-6) && near(h[20 * N + 40], 0.2215943, 1e-6));
  check('ct: plain back-projection matches numpy', near(n0[32 * N + 32], 45.511555, 1e-5));
  check('ct: disc projection is 2√(r² − t²)', near(C.project(C.PHANTOMS.disc.e, 33, 0.3, 100), 2 * Math.sqrt(0.36 - 0.09) / 0.02, 1e-9));
  { const Nd = 128, t2 = C.angles(180), d = C.fbp(C.sinogram(C.PHANTOMS.disc.e, t2, Nd), t2, Nd, 'ramp'); let s = 0, k = 0;
    for (let j = 0; j < Nd; j++) for (let i = 0; i < Nd; i++) { const x = -1 + (i + 0.5) / 64, y = 1 - (j + 0.5) / 64; if (x * x + y * y < 0.25) { s += d[j * Nd + i]; k++; } }
    check('ct: uniform disc reconstructs to 1 inside', near(s / k, 1, 0.01)); }
  check('ct: ramp filter response is close to |f| (0 at DC, 0.5 at Nyquist)', (() => { const H = C.filterResponse(256, 'ramp'); return near(H[0], 0, 1e-3) && near(H[128], 0.5, 1e-3) && near(H[16], 16 / 256, 2e-3); })());
  check('ct: windows roll off the high frequencies', (() => { const P = 256, R = C.filterResponse(P, 'ramp'), S = C.filterResponse(P, 'shepp'), Co = C.filterResponse(P, 'cosine'), Hn = C.filterResponse(P, 'hann'); return near(S[128], R[128] * 2 / Math.PI, 1e-12) && near(Co[128], 0, 1e-12) && near(Hn[128], 0, 1e-12) && near(Hn[64], R[64] * 0.5, 1e-12); })());
  check('ct: fewer angles and noise give a worse image', (() => { const img = C.rasterise(e, N); const t8 = C.angles(12); const few = C.rmse(C.fbp(C.sinogram(e, t8, N), t8, N, 'ramp'), img, N), full = C.rmse(r, img, N), noisy = C.rmse(C.fbp(C.sinogram(e, th, N, 0.02), th, N, 'ramp'), img, N); return few > full && noisy > full && near(full, 0.0900194, 1e-6); })());
  check('ct: noise is repeatable', C.sinogram(e, th, N, 0.02)[3][20] === C.sinogram(e, th, N, 0.02)[3][20]);
};
