// #564 Bayesian A/B test and conjugate updater, checked against scipy 1.18.1: P(B > A) and the expected loss by
// scipy.integrate.quad over scipy.stats.beta (the loss also by dblquad for the smaller cases), the difference and
// lift intervals by brentq on quad-integrated CDFs, posterior quantiles by scipy.stats beta/gamma/norm .ppf, and
// a 2,000,000-draw Monte Carlo of P(B > A) as a sanity check.
import * as Y from '../../src/lib/sci/bayes.ts';
const CASES = [[120, 1000, 145, 1000, 1, 1], [12, 40, 20, 45, 0.5, 0.5], [3, 10, 4, 9, 2.5, 7.3], [5000, 100000, 5200, 100000, 1, 1], [48000, 1000000, 48500, 1000000, 1, 1]];
const R = {"ab": [{"pB": 0.9501969076157732, "lossB": 0.0003158389269429782, "ciA": [0.10132341964422845, 0.1416269997488508], "ciB": [0.12455601040524399, 0.16820043646646218], "diffCi": [-0.004751726123584426, 0.05471516867050357], "lift": [-0.03511073211859473, 0.20713832567355162, 0.5133773707785088], "mc": 0.9503005}, {"pB": 0.9153240742092288, "lossB": 0.004037965517476057, "ciA": [0.17561980574181782, 0.45215830798924034], "ciB": [0.3064876616692315, 0.5892963658431044], "diffCi": [-0.06100202038582133, 0.3362104666773357], "lift": [-0.14955031866640728, 0.4712242480536339, 1.7084501979997175], "mc": 0.915366}, {"pB": 0.6802041911230461, "lossB": 0.030286904694154022, "ciA": [0.10948072689186515, 0.4884437325173816], "ciB": [0.154749618781782, 0.5677849421869892], "diffCi": [-0.2174843891252862, 0.3511937088852202], "lift": [-0.5290868455319025, 0.2553306892094836, 2.5442963448298963], "mc": 0.680623}, {"pB": 0.9789617174795322, "lossB": 7.649001035657534e-06, "ciA": [0.048666639945278665, 0.051368407566739105], "ciB": [0.050641264553850124, 0.0533936272008051], "diffCi": [7.162563195795441e-05, 0.0039285720487804154], "lift": [0.0014052955773245436, 0.03999459569453108, 0.0800821473537608], "mc": 0.9789785}, {"pB": 0.950512755776896, "lossB": 6.256570697084903e-06, "ciA": [0.047582783740655644, 0.04842073669929319], "ciB": [0.048080715926295675, 0.048922800619387516], "diffCi": [-9.398416824746747e-05, 0.0010939896392695707], "lift": [-0.0019459397411904678, 0.010416520159007544, 0.02293240403142842], "mc": 0.950364}], "conj": {"beta": [0.36, 0.09413574486632834, 0.18799292819600225, 0.5532196156596481, 0.35621114331783676], "gamma": [3.12, 0.4995998398718719, 2.218624999154918, 4.172637513540769, 3.0933742326220695], "normal": [110.02061855670102, 6.092076990801714, 98.0803670636845, 121.96087004971753], "pdfb": 3.665440495328541, "pdfg": 0.8045159255939458}};
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(1e-300, Math.abs(b));
  CASES.forEach(([sA, nA, sB, nB, a, b], i) => {
    const r = Y.abTest(sA, nA, sB, nB, { a, b }), x = R.ab[i], tag = `${sB}/${nB} vs ${sA}/${nA}, Beta(${a}, ${b})`;
    check(`bayes: P(B > A) ${tag} matches scipy quad (${r.method})`, near(r.pB, x.pB, 1e-8));
    check(`bayes: P(B > A) ${tag} within Monte Carlo error`, Math.abs(r.pB - x.mc) < 4 * Math.sqrt((x.mc * (1 - x.mc)) / 2e6) + 1e-9);
    if (r.method === 'exact') { const qd = Y.probBBeatsA(r.A, { a: r.B.a + 1e-9, b: r.B.b }); check(`bayes: quadrature agrees with the exact sum ${tag}`, qd.method === 'quadrature' && near(qd.p, r.pB, 1e-6)); }
    check(`bayes: expected loss ${tag}`, near(r.lossB, x.lossB, 1e-6));
    check(`bayes: credible intervals of A and B ${tag}`, near(r.ciA[0], x.ciA[0], 1e-9) && near(r.ciA[1], x.ciA[1], 1e-9) && near(r.ciB[0], x.ciB[0], 1e-9) && near(r.ciB[1], x.ciB[1], 1e-9));
    check(`bayes: difference interval ${tag}`, Math.abs(r.diffCi[0] - x.diffCi[0]) < 1e-5 * Math.abs(x.diffCi[1] - x.diffCi[0]) && Math.abs(r.diffCi[1] - x.diffCi[1]) < 1e-5 * Math.abs(x.diffCi[1] - x.diffCi[0]));
    check(`bayes: lift median and interval ${tag}`, [r.liftCi[0], r.liftMedian, r.liftCi[1]].every((v, j) => Math.abs(v - x.lift[j]) < 1e-5 * Math.abs(x.lift[2] - x.lift[0])));
  });
  const sym = Y.abTest(50, 500, 50, 500);
  check('bayes: identical arms give P = 0.5 and equal losses', near(sym.pB, 0.5, 1e-10) && near(sym.lossA, sym.lossB, 1e-8));
  const C = R.conj, b = Y.summarize(Y.updateBeta(2, 3, 7, 20)), g = Y.summarize(Y.updateGamma(2, 0.5, 37, 12)), n = Y.summarize(Y.updateNormal(100, 15, 9, 112, 20));
  check('bayes: beta-binomial update Beta(2,3) + 7/20 = Beta(9,16) summary', [b.mean, b.sd, b.ci[0], b.ci[1], b.median].every((v, i) => near(v, C.beta[i], 1e-9)) && near(b.mode, 8 / 23, 1e-12));
  check('bayes: gamma-Poisson update summary', [g.mean, g.sd, g.ci[0], g.ci[1], g.median].every((v, i) => near(v, C.gamma[i], 1e-9)));
  check('bayes: normal-normal update summary', [n.mean, n.sd, n.ci[0], n.ci[1]].every((v, i) => near(v, C.normal[i], 1e-9)));
  check('bayes: densities match scipy', near(Y.pdf({ kind: 'beta', p1: 9, p2: 16 }, 0.3), C.pdfb, 1e-10) && near(Y.pdf({ kind: 'gamma', p1: 39, p2: 12.5 }, 3), C.pdfg, 1e-10));
  check('bayes: n = 0 leaves the prior unchanged', (() => { const d = Y.updateNormal(5, 2, 0, NaN, 1); return d.p1 === 5 && d.p2 === 2; })());
  let threw = 0; for (const f of [() => Y.abTest(5, 4, 1, 10), () => Y.abTest(1, 0, 1, 10), () => Y.abTest(1, 10, 1, 2e6), () => Y.updateBeta(0, 1, 1, 2), () => Y.updateGamma(1, 1, 2.5, 3), () => Y.updateNormal(0, -1, 3, 1, 1)]) { try { f(); } catch { threw++; } }
  check('bayes: bad input throws plain errors', threw === 6);
};
