// #971 MRI Bloch simulator. Reference values from an independent numpy steady-state solver (affine fixed point
// of rotation and relaxation matrices, Hargreaves-style) and numpy.fft, written for these tests.
import * as M from '../../src/lib/sci/phmri.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const se = { kind: 'se', TR: 500, TE: 15, flip: 90, TI: 0 }, se2 = { kind: 'se', TR: 4000, TE: 100, flip: 90, TI: 0 };
  const gre = { kind: 'gre', TR: 30, TE: 5, flip: 30, TI: 0 }, ir = { kind: 'ir', TR: 2500, TE: 10, flip: 90, TI: 700 };
  const ref = [[se, 780, 90, 0.39198], [se, 260, 80, 0.700769], [se2, 4000, 2000, 0.592488], [gre, 260, 80, 0.224159], [gre, 920, 100, 0.094332], [ir, 260, 80, 0.763022], [ir, 4000, 2000, -0.142936]];
  check('mri: formulas match numpy steady state', ref.every(([s, a, b, v]) => near(M.signalFormula(s, a, b), v, 2e-6)));
  check('mri: Bloch stepping matches numpy steady state', ref.every(([s, a, b, v]) => near(M.steadyBloch(s, a, b), v, 2e-6)));
  check('mri: Bloch run settles to the formula after one TR (spin echo)', (() => { const r = M.simulate(se, 780, 90, 3); return near(r.echoes[0], 0.84648, 1e-5) && near(r.echoes[2], 0.39198, 1e-5); })());
  check('mri: Ernst angle gives the largest GRE signal', (() => { const ae = M.ernst(30, 780); const f = (a) => M.signalFormula({ ...gre, flip: a }, 780, 90); return near(ae, Math.acos(Math.exp(-30 / 780)) * 180 / Math.PI, 1e-12) && f(ae) > f(ae - 0.5) && f(ae) > f(ae + 0.5); })());
  check('mri: null TI zeroes the IR signal', near(M.signalFormula({ ...ir, TI: M.nullTI(2500, 260) }, 260, 80), 0, 1e-12) && near(M.nullTI(1e9, 1000), 1000 * Math.LN2, 1e-9));
  check('mri: rotations keep length; 90x tips z to y', (() => { const m = M.rotX([0, 0, 1], 90); const r = M.rotY([0.3, 0.4, 0.5], 37); return near(m[1], 1, 1e-15) && near(m[2], 0, 1e-15) && near(Math.hypot(...r), Math.hypot(0.3, 0.4, 0.5), 1e-15); })());
  check('mri: timing problems caught', M.seqProblem({ ...se, TE: 600 }) !== '' && M.seqProblem({ ...ir, TI: 2495 }) !== '' && M.seqProblem({ ...gre, flip: 0 }) !== '' && M.seqProblem(se) === '');
  // FFT against a direct DFT.
  { const N = 8, re = new Float64Array(N * N), im = new Float64Array(N * N); for (let i = 0; i < N * N; i++) re[i] = Math.sin(i * 0.37) + (i % 7) / 3;
    const a = Float64Array.from(re), b = new Float64Array(N * N); M.fft2(a, b, N);
    let err = 0; for (let v = 0; v < N; v++) for (let u = 0; u < N; u++) { let sr = 0, si = 0; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const p = -2 * Math.PI * (u * x + v * y) / N; sr += re[y * N + x] * Math.cos(p); si += re[y * N + x] * Math.sin(p); } err = Math.max(err, Math.abs(sr - a[v * N + u]), Math.abs(si - b[v * N + u])); }
    M.fft2(a, b, N, true); let back = 0; for (let i = 0; i < N * N; i++) back = Math.max(back, Math.abs(a[i] - re[i]), Math.abs(b[i]));
    check('mri: 2D FFT matches a direct DFT and inverts', err < 1e-12 && back < 1e-12); }
  { const N = 32, img = new Float64Array(N * N); M.phantom(N).forEach((l, i) => { img[i] = [0, 0.7, 0.35, 0.39, 0.11][l]; });
    const full = M.kspaceDemo(img, N, 'full', 1), low = M.kspaceDemo(img, N, 'centre', 0.25), skip = M.kspaceDemo(img, N, 'skip', 1);
    check('mri: full k-space gives the image back', full.kept === 1 && full.rec.every((v, i) => near(v, img[i], 1e-12)));
    check('mri: centre and every-other-line masks', low.kept > 0.04 && low.kept < 0.06 && skip.kept === 0.5 && !skip.rec.every((v, i) => near(v, img[i], 1e-3))); }
};
