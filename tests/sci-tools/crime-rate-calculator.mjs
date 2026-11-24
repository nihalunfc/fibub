// #767 Crime rate calculator: exact Poisson and Byar intervals, rate ratios, percent change and direct age
// standardisation, checked against SciPy (chi2.ppf for the exact Poisson and Fay–Feuer intervals, beta.ppf,
// binomtest with exact Clopper–Pearson intervals) on made-up counts.
import { gammaP, chi2Inv, betaInv, poissonExact, byar, crudeRate, rateRatio, binomTwoSided, directStd } from '../../src/lib/sci/crimerate.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1e-12, Math.abs(b)) || (a === 0 && b === 0);
  const E = {"0": [0.0, 3.6888794541139354], "1": [0.025317807984289897, 5.571643390938898], "5": [1.623486390118421, 11.66833207932267], "37": [26.051414567106033, 50.999626141930825], "412": [373.1725314350585, 453.7697052130242], "10000": [9804.952467260184, 10197.951624661473]};
  check('crimerate: exact Poisson 95 % intervals for 0, 1, 5, 37, 412 and 10,000 match SciPy chi2', Object.entries(E).every(([k, [lo, hi]]) => { const c = poissonExact(+k); return rel(c[0], lo) && rel(c[1], hi); }));
  check('crimerate: exact Poisson 90 % and 99 % intervals for 37 match SciPy', poissonExact(37, 0.9).every((v, i) => rel(v, [27.59461554097935, 48.67548518951648][i])) && poissonExact(37, 0.99).every((v, i) => rel(v, [23.208480040741406, 55.747691398056475][i])));
  check('crimerate: chi-square quantiles with non-whole df match SciPy', rel(chi2Inv(0.025, 3.7), 0.39457687534151664) && rel(chi2Inv(0.975, 0.42), 3.1087769936165306) && rel(chi2Inv(0.5, 250.3), 249.63364992542063));
  check('crimerate: beta quantiles match SciPy', rel(betaInv(0.025, 3, 9), 0.06021773417290665) && rel(betaInv(0.975, 40.5, 2.2), 0.9925457893290894));
  check('crimerate: gammaP is the chi-square CDF (P(2, 2) = 1 − 3e⁻²)', rel(gammaP(2, 2), 1 - 3 * Math.exp(-2), 1e-13));
  // Byar is close to exact for moderate counts.
  const b = byar(37), e = poissonExact(37);
  check('crimerate: Byar interval for 37 within 0.5 % of exact', Math.abs(b[0] / e[0] - 1) < 0.005 && Math.abs(b[1] / e[1] - 1) < 0.005);
  check('crimerate: Byar lower limit is 0 for a count of 0', byar(0)[0] === 0 && byar(0)[1] > 3.6);
  const r = crudeRate(412, 185000, 100000);
  check('crimerate: rate per 100,000 = 412 / 185,000 × 100,000', rel(r.rate, 222.7027027027027) && rel(r.ci[0], E['412'][0] / 185000 * 1e5) && rel(r.ci[1], E['412'][1] / 185000 * 1e5));
  const R = rateRatio(412, 185000, 356, 181000), W = {"rr": 1.1322805952019437, "log": [0.9825619075438304, 1.3048127923824253], "exact": [0.980167396704296, 1.3085089344790013], "p": 0.08984008002515793};
  check('crimerate: rate ratio and log interval match NumPy/SciPy', rel(R.rr, W.rr) && rel(R.logCi[0], W.log[0]) && rel(R.logCi[1], W.log[1]));
  check('crimerate: exact conditional interval matches SciPy binomtest Clopper–Pearson', rel(R.exactCi[0], W.exact[0], 1e-8) && rel(R.exactCi[1], W.exact[1], 1e-8));
  check('crimerate: exact two-sided p matches SciPy binomtest', rel(R.p, W.p, 1e-8));
  check('crimerate: percent change = 100 (RR − 1)', rel(R.change, 100 * (W.rr - 1)) && rel(R.changeCi[0], 100 * (W.exact[0] - 1), 1e-8));
  const S = rateRatio(3, 1000, 11, 1000), WS = {"p": 0.057373046875, "exact": [0.0488549150424653, 1.0324198486799505]};
  check('crimerate: small counts (3 vs 11): exact p and interval match SciPy', rel(S.p, WS.p, 1e-9) && rel(S.exactCi[0], WS.exact[0], 1e-8) && rel(S.exactCi[1], WS.exact[1], 1e-8));
  check('crimerate: binomial test of the expected count gives p = 1', rel(binomTwoSided(5, 10, 0.5), 1));
  const Z = rateRatio(0, 1000, 5, 1000);
  check('crimerate: zero count in the first area: ratio 0, exact lower limit 0, no log interval', Z.rr === 0 && Z.exactCi[0] === 0 && Z.exactCi[1] > 0 && Number.isNaN(Z.logCi[0]));
  const K = [12, 85, 140, 96, 41], P = [21000, 38000, 52000, 46000, 30000], St = [20000, 25000, 30000, 15000, 10000];
  const A = directStd(K.map((k, i) => ({ k, pop: P[i], std: St[i] })), 100000), WA = {"asr": 193.08986932213477, "se": 10.442013605940168, "normal": [172.62389872841482, 213.5558399158547], "gamma": [173.16388082717515, 215.12444336181392], "crude": 200.0};
  check('crimerate: age-standardised rate and its SE match NumPy', rel(A.asr, WA.asr) && rel(A.se, WA.se) && rel(A.crude, WA.crude));
  check('crimerate: normal interval matches NumPy', rel(A.normalCi[0], WA.normal[0]) && rel(A.normalCi[1], WA.normal[1]));
  check('crimerate: Fay–Feuer gamma interval matches SciPy chi2', rel(A.gammaCi[0], WA.gamma[0], 1e-8) && rel(A.gammaCi[1], WA.gamma[1], 1e-8));
  const same = directStd(K.map((k, i) => ({ k, pop: P[i], std: P[i] })), 100000);
  check('crimerate: standardising to the population itself gives the crude rate', rel(same.asr, same.crude, 1e-12));
  // Blog article india-cruelty-registration-rates-per-100000-women: registered Section 498A cases and the female
  // denominators recovered from the published rates (Frontiers in Sociology 11: 1901370, CC BY). Limits from the same
  // exact Poisson and exact conditional maths as above.
  const IN = [[58319, 535036697], [122877, 599400000], [140019, 669947368], [133676, 678558376]];
  const IR = IN.map(([k, p]) => crudeRate(k, p, 100000));
  check('crimerate: India cruelty rates 10.90, 20.50, 20.90 and 19.70 per 100,000 women', IR.map((r) => r.rate.toFixed(2)).join() === '10.90,20.50,20.90,19.70');
  check('crimerate: 2023 rate interval 19.59 to 19.81 per 100,000', IR[3].ci[0].toFixed(2) === '19.59' && IR[3].ci[1].toFixed(2) === '19.81');
  const I14 = rateRatio(IN[1][0], IN[1][1], IN[0][0], IN[0][1]);
  check('crimerate: 2014 versus 2005 rate ratio 1.88073 with exact interval 1.86227 to 1.89939', rel(I14.rr, 1.8807339440834032, 1e-9) && rel(I14.exactCi[0], 1.862273701823442, 1e-7) && rel(I14.exactCi[1], 1.8993934693174688, 1e-7));
  const I23 = rateRatio(IN[3][0], IN[3][1], IN[2][0], IN[2][1]);
  check('crimerate: 2023 versus 2022 is a 5.7 % fall, p below 1e-50', Math.abs(I23.change + 5.74) < 0.01 && I23.p < 1e-50);
};
