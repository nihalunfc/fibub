// #765 Effect sizes and learning gain: checked against scipy (stats.nct.cdf; CIs by brentq on nct.cdf; ttest_ind_from_stats,
// ttest_rel; scipy.special.gamma for Hedges' J) on made-up numbers (b2/es_check.py).
import { nctCdf, ncpInterval, hedgesJ, independent, paired, hake, hakeClass, gainBand, dBand } from '../../src/lib/sci/effectsize.ts';

const REF = {"nct": [[2.1, 10, 1.5, 0.6897680934422801], [-1.3, 5, 0.4, 0.06374608647312792], [0.5, 30, -2, 0.9936261645726183], [4, 3, 3, 0.6268078581733412], [10, 50, 8, 0.9171470417861304], [1.96, 100, 0, 0.9736105493168852], [-3, 20, -2.5, 0.33839712650649467], [25, 200, 24, 0.7266936911098363], [3, 8, 6.5, 0.0023457019979166234], [0.1, 2, 0.05, 0.5153837532576792]], "ind": {"d": 0.6150807084867254, "dci": [0.0438137789247224, 1.1802436750480092], "g": 0.605411286875003, "gci": [0.04312500118388211, 1.1616895673656447], "J": 0.9842794262959216, "t": 2.1728982923385067, "p": 0.03475518513824216, "delta": 0.5833333333333344, "ci90": [0.13511053587813396, 1.0888326014480518]}, "pair": {"sd": 9.040730059016251, "dz": 0.8517011291937482, "ci": [0.3293649785582421, 1.3577512159215435], "dav": 0.6390041493775935, "davci": [0.2791141544172449, 0.9988941443379422], "p": 0.001185381623317797}, "raw": {"dz": 2.4053511772118195, "p": 3.304672168659641e-05, "r": 0.9303886100877207}, "hake": {"cls": 0.2654867256637168, "avg": 0.278993228993229}};

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) < t;
  const worst = Math.max(...REF.nct.map(([t, df, d, p]) => Math.abs(nctCdf(t, df, d) - p)));
  check(`effect: noncentral t CDF matches scipy (${worst.toExponential(1)})`, worst < 1e-9);
  check('effect: noncentral t, large ncp (normal approximation)', near(nctCdf(52, 400, 50), 0.8263461959327887, 2e-4) && near(nctCdf(-40, 30, -38), 0.38252474065888425, 0.01) && near(nctCdf(40, 2000, 38), 0.9541844959273954, 1e-4));
  const I = independent({ m1: 78.4, s1: 9.6, n1: 24, m2: 72.1, s2: 10.8, n2: 26 }), R = REF.ind;
  check('effect: Cohen d and t test', near(I.d, R.d, 1e-12) && near(I.t, R.t, 1e-12) && near(I.p, R.p, 1e-10));
  check('effect: d interval (noncentral t)', near(I.dCi[0], R.dci[0], 1e-8) && near(I.dCi[1], R.dci[1], 1e-8));
  check('effect: Hedges g, J and interval', near(I.J, R.J, 1e-12) && near(I.g, R.g, 1e-12) && near(I.gCi[0], R.gci[0], 1e-8) && near(I.gCi[1], R.gci[1], 1e-8) && near(hedgesJ(10), 0.9227456080530869, 1e-12));
  check('effect: Glass delta', near(I.delta, R.delta, 1e-12));
  const I90 = independent({ m1: 78.4, s1: 9.6, n1: 24, m2: 72.1, s2: 10.8, n2: 26 }, 0.9);
  check('effect: 90 % interval', near(I90.dCi[0], R.ci90[0], 1e-8) && near(I90.dCi[1], R.ci90[1], 1e-8));
  const P = paired({ m1: 61.2, s1: 12.4, m2: 68.9, s2: 11.7, n: 20, r: 0.72 }), Q = REF.pair;
  check('effect: paired dz and interval', near(P.sdiff, Q.sd, 1e-12) && near(P.dz, Q.dz, 1e-12) && near(P.dzCi[0], Q.ci[0], 1e-8) && near(P.dzCi[1], Q.ci[1], 1e-8) && near(P.p, Q.p, 1e-10));
  check('effect: paired dav and approximate interval', near(P.dav, Q.dav, 1e-12) && near(P.davCi[0], Q.davci[0], 1e-9) && near(P.davCi[1], Q.davci[1], 1e-9));
  const P2 = paired({ m1: 61.2, s1: 12.4, m2: 68.9, s2: 11.7, n: 20, sdiff: Q.sd });
  check('effect: SD of differences gives the same r', near(P2.r, 0.72, 1e-12) && near(P2.dz, Q.dz, 1e-12));
  const pre = [12, 15, 9, 20, 14, 11, 17, 13, 10, 16], post = [15, 18, 13, 22, 15, 16, 19, 17, 12, 20];
  const m = (a) => a.reduce((s, x) => s + x, 0) / a.length, sd = (a) => Math.sqrt(a.reduce((s, x) => s + (x - m(a)) ** 2, 0) / (a.length - 1));
  const diffs = post.map((x, i) => x - pre[i]);
  const PR = paired({ m1: m(pre), s1: sd(pre), m2: m(post), s2: sd(post), n: 10, sdiff: sd(diffs) });
  check('effect: raw paired data (scipy ttest_rel)', near(PR.dz, REF.raw.dz, 1e-12) && near(PR.p, REF.raw.p, 1e-12) && near(PR.r, REF.raw.r, 1e-12));
  const H = hake(pre, post, 25);
  check('effect: Hake class gain and average of individual gains', near(H.classGain, REF.hake.cls, 1e-12) && near(H.averageGain, REF.hake.avg, 1e-12) && H.excluded === 0);
  check('effect: Hake leaves out students at the maximum', hake([10, 20], [15, 20], 20).excluded === 1 && hake([10, 20], [15, 20], 20).averageGain === 0.5 && near(hakeClass(40, 70, 100), 0.5, 1e-15));
  check('effect: bands', gainBand(0.29) === 'low' && gainBand(0.5) === 'medium' && gainBand(0.71) === 'high' && dBand(-0.6) === 'medium' && dBand(0.1) === 'negligible');
  check('effect: bad input refused', (() => { try { independent({ m1: 1, s1: 0, n1: 5, m2: 1, s2: 1, n2: 5 }); return false; } catch { return true; } })() && (() => { try { hake([5], [30], 25); return false; } catch { return true; } })());
  const [lo, hi] = ncpInterval(0, 10);
  check('effect: interval symmetric at t = 0', near(lo, -hi, 1e-9));
};
