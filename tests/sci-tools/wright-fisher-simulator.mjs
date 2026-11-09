// #310 Wright-Fisher simulator. Reference values from SciPy: Kimura's integral by scipy.integrate.quad, and the
// exact Wright-Fisher fixation probability by solving the absorbing Markov chain (scipy.stats.binom + linalg.solve).
import { kimuraFix, binomial, wfRng, simulate, afterSelection, neutralTimes, wilson } from '../../src/lib/sci/wrightfisher.ts';
import { logGamma } from '../../src/lib/sci/stats.ts';

export default async (check) => {
  const near = (name, got, want, tol) => check(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= tol);
  near('WF Kimura h=0.5 p=0.1', kimuraFix(0.1, 50, 0.02, 0.5), 0.20964108215325952, 1e-7);
  near('WF Kimura h=0.5 p=0.01', kimuraFix(0.01, 50, 0.02, 0.5), 0.022900583670587393, 1e-8);
  near('WF Kimura recessive h=0', kimuraFix(0.005, 100, 0.01, 0), 0.008359051686942386, 1e-8);
  near('WF Kimura dominant h=1', kimuraFix(0.005, 100, 0.01, 1), 0.015470331290720321, 1e-8);
  near('WF Kimura deleterious', kimuraFix(0.2, 100, -0.01, 0.5), 0.07697924232087869, 1e-8);
  near('WF Kimura h=0.2', kimuraFix(0.3, 50, 0.05, 0.2), 0.7101883160426157, 1e-7);
  near('WF Kimura neutral = p', kimuraFix(0.37, 100, 0, 0.5), 0.37, 1e-12);
  check('WF Kimura strongly deleterious stays finite', kimuraFix(0.5, 1000, -0.5, 0.5) >= 0 && kimuraFix(0.5, 1000, -0.5, 0.5) < 1e-100);
  near('WF selection step', afterSelection(0.5, 0.1, 0.5), (0.25 * 1.1 + 0.25 * 1.05) / (0.25 * 1.1 + 0.5 * 1.05 + 0.25), 1e-15);
  near('WF neutral time to fixation p=0.5 N=100', neutralTimes(0.5, 100).fix, 4 * 100 * Math.log(2), 1e-9);
  // Binomial sampler against the exact pmf (chi-square goodness of fit) in both branches.
  for (const [n, p] of [[40, 0.05], [1000, 0.3], [200, 0.5], [500, 0.97]]) {
    const u = wfRng(7), R = 100000, cnt = new Float64Array(n + 1);
    for (let i = 0; i < R; i++) cnt[binomial(n, p, u)]++;
    const pmf = (k) => Math.exp(logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
    let chi = 0, df = -1, e = 0, o = 0;
    for (let k = 0; k <= n; k++) { e += R * pmf(k); o += cnt[k]; if (e >= 20) { chi += (o - e) ** 2 / e; df++; e = 0; o = 0; } }
    // 99.9 % point of chi-square is under df + 4.5 sqrt(2 df) + 6 for these df.
    check(`WF binomial(${n}, ${p}) matches pmf (chi2 ${chi.toFixed(1)} on ${df} df)`, chi < df + 4.5 * Math.sqrt(2 * df) + 6);
  }
  // Simulated fixation against the exact Markov chain result 0.32775674680606753 (N 20, p0 0.1, s 0.1, h 0.5).
  const r = simulate({ N: 20, p0: 0.1, s: 0.1, h: 0.5, gens: 10, reps: 20000, seed: 1, untilDone: true, maxGens: 100000 });
  const f = r.fixed / r.reps;
  check(`WF simulated fixation ${f} within 4 SE of exact 0.32776`, Math.abs(f - 0.32775674680606753) < 4 * Math.sqrt(0.3278 * 0.6722 / 20000) && r.segregating === 0);
  const r2 = simulate({ N: 25, p0: 0.2, s: 0, h: 0.5, gens: 10, reps: 20000, seed: 3, untilDone: true, maxGens: 100000 });
  check(`WF neutral fixation ${r2.fixed / r2.reps} ≈ 0.2`, Math.abs(r2.fixed / r2.reps - 0.2) < 4 * Math.sqrt(0.16 / 20000));
  const mt = r2.fixTimes.reduce((a, b) => a + b, 0) / r2.fixTimes.length, want = neutralTimes(0.2, 25).fix;
  check(`WF neutral mean fixation time ${mt.toFixed(1)} near diffusion ${want.toFixed(1)} (within 8 %)`, Math.abs(mt / want - 1) < 0.08);
  const a = simulate({ N: 100, p0: 0.3, s: 0.01, h: 0.5, gens: 50, reps: 30, seed: 42 }), b = simulate({ N: 100, p0: 0.3, s: 0.01, h: 0.5, gens: 50, reps: 30, seed: 42 });
  check('WF same seed, same run', a.lines.every((l, i) => l.every((v, j) => v === b.lines[i][j])) && a.lines[0].length === 51);
  const c = simulate({ N: 100, p0: 0.3, s: 0.01, h: 0.5, gens: 50, reps: 30, seed: 43 });
  check('WF other seed, other run', c.lines.some((l, i) => l.some((v, j) => v !== a.lines[i][j])));
  const w = wilson(50, 100); near('WF Wilson interval low', w[0], 0.4038, 1e-4);
};
