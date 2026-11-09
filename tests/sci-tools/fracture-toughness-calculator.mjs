// #848 fracture toughness calculator: checked against SciPy (brentq for the critical crack, integrate.quad for the
// Paris-law life) for every geometry, and against the closed-form Paris life for constant Y.
import { GEOMETRY, geometryFactor, stressIntensity, criticalStress, criticalCrack, maxCrack, planeStrainSize, plasticZone, parisLife, parisClosed } from '../../src/lib/sci/fracture.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a / b - 1) <= rel;
  const W = 0.1, s = 200, K = 60, a0 = 0.005;
  // SciPy: [Y(a0), critical stress at a0, critical crack, Paris life a0 → critical crack] with Δσ 180, C 5e-12, m 3.
  const want = {
    'centre-inf': [1, 478.73073648171925, 0.028647889756541155, 101420.60928831754],
    'centre-secant': [1.0062132605904193, 475.7746247558025, 0.02204674048911509, 82779.61931667772],
    'centre-tada': [1.0059677445548352, 475.89074209687413, 0.022119501195205508, 83111.73545306142],
    'edge-inf': [1.1215, 426.8664614192771, 0.022776871985576895, 65631.61547487293],
    'edge-finite': [1.1322999375000002, 422.7949862283898, 0.016895681602969816, 48792.303070814494],
    'double-edge': [1.121872812757509, 426.7246082067202, 0.021406720133473816, 62937.38761245706],
    penny: [0.6366197723675814, 751.9884823893002, 0.07068583470577036, 495576.9779207831],
    custom: [1.5, 319.15382432114615, 0.012732395447351622, 19269.33915461434],
  };
  for (const [g, [Y, sc, ac, N]] of Object.entries(want)) {
    const a = criticalCrack(g, K, s, W, 1.5), L = parisLife(g, { a0, af: a, dSigma: 180, C: 5e-12, m: 3, W, custom: 1.5 });
    check(`fracture: ${g} Y, critical stress, critical crack and Paris life match scipy`, near(geometryFactor(g, a0, W, 1.5), Y, 1e-12) && near(criticalStress(g, K, a0, W, 1.5), sc, 1e-12) && near(a, ac, 1e-9) && near(L.N, N, 1e-8));
  }
  check('fracture: K = Yσ√(πa) for a centre crack', near(stressIntensity('centre-inf', 200, 0.005), 25.066282746310005, 1e-14));
  check('fracture: finite-width factors start at the wide-plate values', near(geometryFactor('centre-secant', 1e-9, W), 1, 1e-9) && near(geometryFactor('edge-finite', 0, W), 1.12, 1e-12) && near(geometryFactor('double-edge', 0, W), 1.122, 1e-12));
  check('fracture: secant and Tada centre-crack factors agree within 1 % to a/W = 0.35', [0.05, 0.15, 0.25, 0.35].every((r) => near(geometryFactor('centre-secant', r * W, W), geometryFactor('centre-tada', r * W, W), 0.01)));
  check('fracture: no critical crack inside a finite plate when the stress is tiny', criticalCrack('edge-finite', 60, 1, W) === null && maxCrack('edge-finite', W) === 0.06 && maxCrack('centre-inf', W) === Infinity);
  check('fracture: E399 size 2.5 (K/σy)²', near(planeStrainSize(60, 600), 0.025, 1e-12));
  check('fracture: Irwin plastic zone', near(plasticZone(60, 600, false), 0.01 / (2 * Math.PI), 1e-12) && near(plasticZone(60, 600, true), 0.01 / (6 * Math.PI), 1e-12));
  check('fracture: Simpson Paris life equals the closed form for constant Y', near(parisLife('edge-inf', { a0: 0.001, af: 0.02, dSigma: 100, C: 1e-11, m: 3.5 }).N, parisClosed(1.1215, { a0: 0.001, af: 0.02, dSigma: 100, C: 1e-11, m: 3.5 }), 1e-9));
  check('fracture: Paris closed form for m = 2', near(parisClosed(1, { a0: 0.001, af: 0.01, dSigma: 100, C: 1e-10, m: 2 }), Math.log(10) / (1e-10 * 1e4 * Math.PI), 1e-12));
  { const L = parisLife('centre-inf', { a0: 0.005, af: 0.02, dSigma: 180, C: 5e-12, m: 3 }); check('fracture: a-N curve runs from a0 to af', L.curve.a[0] === 0.005 && near(L.curve.a[L.curve.a.length - 1], 0.02, 1e-12) && L.curve.N[L.curve.N.length - 1] === L.N); }
  check('fracture: every geometry has a name and a formula', Object.values(GEOMETRY).every((x) => x.name && x.formula));
};
