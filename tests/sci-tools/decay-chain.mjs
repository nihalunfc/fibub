// #945 decay chain (Bateman). Reference values from a 60-digit matrix exponential (mpmath expm) of the chain's
// rate matrix, written for these tests.
import { activities, divDiffExp, eqRatios, eqKind, peakTime, peakTime2, eqTime, lambdaOf, CHAINS } from '../../src/lib/sci/phchain.ts';
export default async (check) => {
  const H = 3600, D = 86400, Y = 365.25 * D, MIN = 60;
  const close = (a, b, r = 1e-9) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) <= r * Math.abs(b[i]) + 1e-12);
  const run = (halves, b, A0, t) => activities(halves.map(lambdaOf), b, A0, t);
  check('chain: Mo-99 → Tc-99m after 24 h matches a 60-digit matrix exponential', close(run([66 * H, 6 * H], [0.88], [1000, 0], 24 * H), [777.2031408854597, 691.8326403771249]));
  const ra = [1600 * Y, 3.82 * D, 3.1 * MIN, 27 * MIN, 20 * MIN, 164e-6];
  check('chain: six-member Ra-226 chain at 30 d (stiff: 1600 y to 164 µs)', close(run(ra, [1, 1, 1, 1, 1], [1e6, 0, 0, 0, 0, 0], 30 * D), [999964.4181289143, 995646.8824734906, 995644.4479332372, 995623.1391238208, 995607.2971352901, 995607.297133125]));
  check('chain: six-member Ra-226 chain at 2 h', close(run(ra, [1, 1, 1, 1, 1], [1e6, 0, 0, 0, 0, 0], 2 * H), [999999.9011597156, 15007.262602227547, 14451.85266881159, 9846.485016376422, 6770.833909843139, 6770.833489504161], 1e-8));
  check('chain: three equal half-lives (the textbook t e^(−λt) case)', close(run([5 * H, 5 * H, 5 * H], [1, 1], [100, 0, 0], 7 * H), [37.89291416275995, 36.77151326116391, 17.841649519328886]));
  check('chain: nearly equal half-lives, branching 0.5 and a daughter present at the start', close(run([5 * H, 5.0000001 * H, 4.999999 * H], [1, 0.5], [100, 30, 0], 3 * H), [65.97539553864472, 47.231014033932226, 6.968587444564155], 1e-8));
  check('chain: every member present at the start', close(run([10 * H, 2 * H, 1 * H], [1, 1], [100, 50, 20], 4 * H), [75.7858283255199, 75.98228540689988, 69.70253934099986]));
  const l = 0.3, m = 0.9, t = 2;
  check('chain: two-point divided difference equals (e^(−mt) − e^(−lt))/(m − l)', Math.abs(divDiffExp([l, m], t) - (Math.exp(-m * t) - Math.exp(-l * t)) / (m - l)) < 1e-15);
  check('chain: repeated point gives the derivative −t e^(−λt)', Math.abs(divDiffExp([l, l], t) + t * Math.exp(-l * t)) < 1e-15 && Math.abs(divDiffExp([l, l, l], t) - t * t * Math.exp(-l * t) / 2) < 1e-15);
  check('chain: at t = 0 the starting activities come back', close(run([10 * H, 2 * H], [1], [100, 7], 0), [100, 7]));
  const l1 = lambdaOf(66 * H), l2 = lambdaOf(6 * H);
  check('chain: Tc-99m peaks at 22.83 h (formula and search agree with SciPy)', Math.abs(peakTime2(l1, l2) / H - 22.832248683006164) < 1e-9 && Math.abs(peakTime([l1, l2], [0.88], [1000, 0], 1, 1000 * H) / H - 22.83224868) < 1e-6);
  check('chain: equilibrium ratio Tc/Mo = 0.968 and 99 % reached at 43.85 h', Math.abs(eqRatios([l1, l2], [0.88])[1] - 0.968) < 1e-12 && Math.abs(eqTime([l1, l2], [0.88], [1000, 0], 1, 0.01, 1000 * H) / H - 43.84945085251319) < 1e-6);
  check('chain: equilibrium kinds', eqKind(28.8 * Y, 64 * H) === 'secular' && eqKind(66 * H, 6 * H) === 'transient' && eqKind(1 * H, 10 * H) === 'none');
  check('chain: no equilibrium when the daughter lives longer', eqRatios([lambdaOf(1 * H), lambdaOf(10 * H)], [1])[1] === null && eqTime([lambdaOf(1 * H), lambdaOf(10 * H)], [1], [1, 0], 1, 0.01, 1e6) === null);
  check('chain: example chains present', Object.keys(CHAINS).length === 7 && CHAINS.ra226.members.length === 6);
};
