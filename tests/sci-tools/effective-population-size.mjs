// #313 Effective population size. References from an independent numpy/scipy calculation (scipy.stats.hmean,
// numpy.var, scipy.stats.chi2.ppf for the Waples interval), and a simulation sanity check of the temporal method.
import { neSexRatio, neHarmonic, neFamily, offspringStats, chiSqInv, fcLocus, neTemporal, lociFromRows } from '../../src/lib/sci/nesize.ts';

export default async (check) => {
  const rel = (name, got, want, tol = 1e-9) => check(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= tol * Math.abs(want));
  rel('Ne sex ratio 10 males 90 females', neSexRatio(10, 90), 36);
  rel('Ne sex ratio equal', neSexRatio(50, 50), 100);
  rel('Ne harmonic mean', neHarmonic([500, 40, 600, 800, 1000]).Ne, 161.72506738544473);
  rel('Ne arithmetic mean', neHarmonic([500, 40, 600, 800, 1000]).arithmetic, 588);
  rel('Ne family size Vk 6', neFamily(100, 6), 49.75);
  rel('Ne family Poisson ≈ N', neFamily(100, 2), 99.5);
  const o = offspringStats([0, 1, 1, 2, 2, 2, 3, 3, 4, 6, 0, 2]);
  rel('offspring Vk (divisor N)', o.Vk, 2.638888888888889); rel('offspring mean', o.mean, 2.1666666666666665);
  rel('Ne from offspring list', neFamily(o.N, o.Vk), 9.916167664670658);
  rel('chi2 quantile 0.975, 12 df', chiSqInv(0.975, 12), 23.33666415864534, 1e-8);
  rel('chi2 quantile 0.025, 12 df', chiSqInv(0.025, 12), 4.4037885069817015, 1e-8);
  rel('chi2 quantile 0.025, 1 df', chiSqInv(0.025, 1), 0.0009820691171752555, 1e-6);
  rel('chi2 quantile 0.975, 300 df', chiSqInv(0.975, 300), 349.87446882991526, 1e-8);
  const rows = [['L1', 0.42, 0.35], ['L2', 0.18, 0.27], ['L3', 0.55, 0.61], ['L4', 0.30, 0.22], ['L5', 0.71, 0.80], ['L6', 0.12, 0.05], ['L7', 0.48, 0.40], ['L8', 0.36, 0.44], ['L9', 0.65, 0.58], ['L10', 0.24, 0.31], ['L11', 0.5, 0.42], ['L11', 0.3, 0.38], ['L11', 0.2, 0.2]].map(([locus, x, y]) => ({ locus, x, y }));
  const loci = lociFromRows(rows);
  check('temporal: 11 loci, last has 3 alleles', loci.length === 11 && loci[10].x.length === 3 && loci[0].x[1] === 1 - 0.42);
  check('Fc same for both alleles of a two-allele locus', Math.abs(fcLocus([0.42], [0.35]) - fcLocus([0.58], [0.65])) < 1e-15);
  const r = neTemporal(loci, 100, 100, 5);
  rel('temporal Fc (weighted by K − 1)', r.Fc, 0.02940151999222416); check('temporal n′ = 12', r.nprime === 12);
  rel('temporal Ne', r.Ne, 128.85588350819742, 1e-8);
  rel('temporal Ne lower 95 %', r.lo, 35.6547011330125, 1e-7);
  rel('temporal Ne upper 95 %', r.hi, 488.41255552065377, 1e-7);
  rel('temporal plan II, N 500', neTemporal(loci, 100, 100, 5, 2, 500).Ne, 116.81413287039088, 1e-8);
  check('temporal: too little change gives infinite Ne', neTemporal(loci, 20, 20, 5).Ne === Infinity);
  // Missing third allele is filled in: 0.5 + 0.3 → adds 0.2.
  check('temporal: remainder allele', lociFromRows([{ locus: 'X', x: 0.5, y: 0.4 }, { locus: 'X', x: 0.3, y: 0.3 }])[0].x.length === 3);
};
