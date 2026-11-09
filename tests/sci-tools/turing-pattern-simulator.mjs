// #352 Turing pattern simulator: steady states and conservation checks; linear stability checked against NumPy
// (np.linalg.eigvals over a wavenumber grid, and the analytic band edges from det(J − q²D) = 0).
import * as T from '../../src/lib/sci/turing.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const lam = T.decayLength(1, 1e-4);
  check('turing: λ = √(D/k) = 100 µm', near(lam, 100, 1e-12));
  check('turing: open gradient C0 e^(−x/λ), threshold at λ ln(C0/T)', near(T.gradient(100, 100, lam), 100 / Math.E, 1e-12) && near(T.thresholdPosition(50, 100, lam), 100 * Math.log(2), 1e-12));
  check('turing: sealed end: cosh form, flat slope at L', near(T.gradient(0, 100, lam, 300), 100, 1e-12) && near(T.gradient(300, 100, lam, 300), 100 / Math.cosh(3), 1e-12) && near(T.gradient(299.999, 100, lam, 300), T.gradient(300, 100, lam, 300), 1e-6));
  check('turing: sealed-end threshold solved (cosh((L − x)/λ)/cosh(L/λ) = T/C0)', (() => { const x = T.thresholdPosition(20, 100, lam, 300); return near(T.gradient(x, 100, lam, 300), 20, 1e-9); })() && Number.isNaN(T.thresholdPosition(1, 100, lam, 300)));
  { const c = T.relaxGradient(100, 1, 1e-4, 300, 61, 1e5); check('turing: finite-difference relaxation reaches the steady state (within 0.5 %)', [0, 10, 30, 60].every((i) => Math.abs(c[i] / T.gradient(i * 5, 100, lam, 300) - 1) < 0.005)); }
  // Diffusion conserves: the Laplacian sums to zero.
  { const n = 17, f = new Float64Array(n * n).map((_, i) => Math.sin(i * 1.7) * 3 + i % 5); check('turing: wrap-around Laplacian sums to 0', Math.abs(T.laplacianSum(f, n)) < 1e-9); }
  // Gray-Scott: the trivial state u = 1, v = 0 stays put.
  { const s = T.createSim(T.PRESETS['gs-spots'].p, 32, 1); s.u.fill(1); s.v.fill(0); T.step(s, 500); check('turing: Gray-Scott u = 1, v = 0 is steady', s.u.every((x) => x === 1) && s.v.every((x) => x === 0)); }
  // Gierer-Meinhardt: the uniform steady state a = μh/μa, h = ρμh/μa², and it stays without noise.
  const gm = T.PRESETS['gm-spots'].p;
  { const [a, h] = T.steadyState(gm); check('turing: GM steady state a = μh/μa = 2, h = ρμh/μa² = 2', near(a, 2, 1e-12) && near(h, 2, 1e-12)); const s = T.createSim(gm, 32, 1); s.u.fill(a); s.v.fill(h); T.step(s, 2000); check('turing: GM uniform state is steady (no noise)', s.u.every((x) => Math.abs(x - 2) < 1e-4) && s.v.every((x) => Math.abs(x - 2) < 1e-4)); }
  { const [a, h] = T.steadyState(T.PRESETS['gm-stripes'].p), r = T.reaction(T.PRESETS['gm-stripes'].p, a, h); check('turing: GM with saturation steady state solves both equations', Math.abs(r[0]) < 1e-12 && Math.abs(r[1]) < 1e-12); }
  const an = T.turingAnalysis(gm);
  check('turing: GM Jacobian [[0.01, −0.01], [0.04, −0.02]] (analytic)', near(an.J[0][0], 0.01, 1e-6) && near(an.J[0][1], -0.01, 1e-6) && near(an.J[1][0], 0.04, 1e-6) && near(an.J[1][1], -0.02, 1e-6));
  check('turing: GM uniform state stable without diffusion, unstable band q 0.1477–0.6769 (numpy roots)', an.stableUniform && near(an.unstableBand[0], 0.14773543, 0.001) && near(an.unstableBand[1], 0.67688569, 0.001));
  check(`turing: fastest-growing wavelength 18.39 cells (numpy eigvals 18.394; got ${an.fastest.toFixed(3)})`, near(an.fastest, 18.394, 0.02) && near(an.growth, 0.0048399, 1e-6));
  check('turing: equal diffusion gives no Turing band', T.turingAnalysis({ ...gm, Dh: gm.Da }).unstableBand === null);
  // Seeded and reproducible.
  { const a = T.createSim(gm, 24, 5), b = T.createSim(gm, 24, 5), c = T.createSim(gm, 24, 6); check('turing: same seed, same start; another seed differs', a.u.every((x, i) => x === b.u[i]) && a.u.some((x, i) => x !== c.u[i])); }
  // Patterns form: spots cover less of the field than stripes.
  const run = (id, n) => { const pr = T.PRESETS[id], s = T.createSim(pr.p, n, 1); T.step(s, pr.steps); return T.fieldStats(pr.p.model === 'gs' ? s.v : s.u); };
  { const sp = run('gm-spots', 64), st = run('gm-stripes', 64); check(`turing: GM spots (${sp.above.toFixed(2)} above mean) vs stripes (${st.above.toFixed(2)})`, sp.sd > 1 && st.sd > 0.5 && sp.above < 0.35 && st.above > 0.4); }
  { const sp = run('gs-spots', 64), st = run('gs-stripes', 64); check(`turing: Gray-Scott spots (${sp.above.toFixed(2)}) vs stripes (${st.above.toFixed(2)})`, sp.sd > 0.05 && st.sd > 0.05 && sp.above < 0.4 && st.above > 0.45); }
};
