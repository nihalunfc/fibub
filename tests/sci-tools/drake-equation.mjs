// #353 Drake equation. References from NumPy: the distribution of log10 N by numerical convolution of the seven
// uniform densities (grid 1e-4) and a 2-million-draw Monte Carlo; exact moments of a sum of uniforms.
import { PRESETS, pointN, logMoments, exactCdf, sampleLogN, quantile, shareBelow } from '../../src/lib/sci/drake.ts';

export default async (check) => {
  const near = (name, got, want, tol) => check(`${name}: got ${got}, want ${want} ± ${tol}`, Math.abs(got - want) <= tol);
  const R = (k) => PRESETS[k].ranges.map(([lo, hi]) => ({ lo, hi }));
  near('drake wide: mean log10 N', logMoments(R('wide')).mean, -2.3494850021680094, 1e-12);
  near('drake wide: var log10 N', logMoments(R('wide')).var, 7.2073799222467905, 1e-12);
  near('drake wide: P(N < 1)', exactCdf(R('wide'), 0), 0.800322759782719, 1.5e-3);
  near('drake wide: P(N < 1000)', exactCdf(R('wide'), 3), 0.9791108063009945, 1.5e-3);
  near('drake hopeful: P(N < 1)', exactCdf(R('hopeful'), 0), 0.0003181772317209748, 3e-5);
  near('drake hopeful: symmetric, P(N < 1000) = 0.5', exactCdf(R('hopeful'), 3), 0.5, 1e-9);
  near('drake hopeful: point estimate', pointN(R('hopeful')), 1000, 1e-9);
  near('drake cautious: point estimate', pointN(R('cautious')), 1.6970562748477144e-09, 1e-20);
  near('drake cautious: mean log10 N', logMoments(R('cautious')).mean, -8.770303756120384, 1e-12);
  check('drake shares of spread add to 1', Math.abs(logMoments(R('wide')).share.reduce((a, b) => a + b, 0) - 1) < 1e-12);
  check('drake fixed factors: exact step', exactCdf([{ lo: 2, hi: 2 }, { lo: 5, hi: 5 }], 1.01) === 1 && exactCdf([{ lo: 2, hi: 2 }, { lo: 5, hi: 5 }], 0.99) === 0);
  near('drake one uniform factor', exactCdf([{ lo: 1, hi: 100 }], 0.5), 0.25, 1e-12);
  const s = sampleLogN(R('wide'), 200000, 1);
  near('drake Monte Carlo P(N < 1)', shareBelow(s, 0), 0.8003, 4 * Math.sqrt(0.16 / 200000));
  near('drake Monte Carlo median', quantile(s, 0.5), -2.358, 0.03);
  near('drake Monte Carlo 5 %', quantile(s, 0.05), -6.784, 0.05);
  near('drake Monte Carlo 95 %', quantile(s, 0.95), 2.084, 0.05);
  const t = sampleLogN(R('wide'), 1000, 9), u = sampleLogN(R('wide'), 1000, 9);
  check('drake same seed, same draws', t.every((v, i) => v === u[i]));
  near('drake quantile like numpy', quantile([1, 2, 3, 4], 0.5), 2.5, 1e-15);
  // Stern and Gerya (2024, Sci. Rep. 14, 8552): Drake's 1961 ranges, then fi = foc·fpt = 0.000034–0.0017 (foc 0.0002–0.01, fpt 0.17).
  const d61 = [[1, 1], [0.2, 0.5], [1, 5], [1, 1], [1, 1], [0.1, 0.2], [1e3, 1e8]].map(([lo, hi]) => ({ lo, hi }));
  const sg = d61.map((r, i) => (i === 4 ? { lo: 0.000034, hi: 0.0017 } : r));
  near('drake 1961: middle estimate is 10^4.5', pointN(d61), 31622.776601683796, 1e-6);
  near('drake 1961: P(N < 1000) = 0.2', exactCdf(d61, 3), 0.2, 1e-9);
  near('drake Stern-Gerya: middle estimate', pointN(sg), 7.602631123499286, 1e-9);
  near('drake Stern-Gerya: P(N < 1) exact (2e5-draw Monte Carlo 0.3247)', exactCdf(sg, 0), 0.32380721615794655, 1e-9);
};
