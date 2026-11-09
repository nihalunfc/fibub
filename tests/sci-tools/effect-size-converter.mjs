// #565 effect size converter: every conversion and interval reproduced independently in Python (numpy 2.5,
// scipy 1.18 for the normal distribution and log-gamma) from Borenstein et al. (2009) and Lakens (2013); d and r from
// a t statistic checked against the pooled-SD d and scipy.stats.pointbiserialr on random data (numpy seed 11).
import * as E from '../../src/lib/sci/effsize.ts';
const R = {"d": {"d": [0.5, 0.10192943294733198, 0.8980705670526681], "g": [0.4961620437102799, 0.10114703153075634, 0.8911770558898034], "r": [0.2448510534371959, 0.05141404894589526, 0.4130848046466925], "or": [2.4766322710964235, 1.2030735099777945, 5.098364609781359], "cliff": [0.2763263901682369], "u3": [0.6914624612740131], "overlap": [0.8025873486341526], "eta2": [0.059952038369304565], "f": [0.2525381361380527]}, "tind": {"d": [0.75, 0.1419371648490515, 1.3580628351509485], "r": [0.35623524993954825], "g": [0.7368292176053222], "eta2": [0.12690355329949238]}, "tpaired": {"d": [0.775, 0.21625716320118316, 1.3337428367988169], "g": [0.7354808800355948]}, "r": {"r": [0.3, 0.11006766754074288, 0.468794214523005], "d": [0.628970902033151, 0.22148103257852117, 1.0614520110517942]}, "or": {"d": [0.5051775570894034, 0.09902171326216758, 0.9113334009166392], "or": [2.5, 1.1967451786268706, 5.222498583341834]}, "f": {"eta2": [0.27807486631016043], "omega2": [0.21875000000000003], "f": [0.6206328908341752]}, "f1": {"d": [0.7905694150420949], "r": [0.37582301400141443]}, "chi1": {"w": [0.22360679774997896], "r": [0.22360679774997896, 0.046217850802054525, 0.3873243392714661]}, "chi4": {"w": [0.2449489742783178], "V": [0.1732050807568877]}, "cliff": {"d": [0.7416143171871158], "cl": [0.7]}, "eta2": {"f": [0.33333333333333337]}, "cf": {"eta2": [0.058823529411764705]}, "data": {"x": [10.068, 12.719, 12.449, 8.979, 9.404, 8.945, 11.139, 9.888, 11.494, 6.305, 13.133, 9.807, 11.361, 9.727], "y": [10.29, 12.311, 13.179, 10.714, 10.833, 12.846, 9.111, 7.565, 12.148, 9.591, 6.591, 9.246, 10.078, 8.336, 7.618, 11.288, 13.353, 10.64, 9.415], "t": 0.17294137171479415, "d": 0.06091370994208408, "r": 0.031046214257655143}};
const INPUTS = { d: { from: 'd', value: 0.5, n1: 50, n2: 50 }, tind: { from: 't-ind', value: 2.5, n1: 20, n2: 25 }, tpaired: { from: 't-paired', value: 3.1, n: 16 }, r: { from: 'r', value: 0.3, n: 100 }, or: { from: 'or', value: 2.5, n1: 40, n2: 60 }, f: { from: 'f-stat', value: 5.2, df1: 2, df2: 27 }, f1: { from: 'f-stat', value: 6.25, df1: 1, df2: 38 }, chi1: { from: 'chi2', value: 6, n: 120, chiDf: 1 }, chi4: { from: 'chi2', value: 12, n: 200, chiDf: 4, minDim: 3 }, cliff: { from: 'cliff', value: 0.4 }, eta2: { from: 'eta2', value: 0.1, k: 3 }, cf: { from: 'cohen-f', value: 0.25, k: 3 } };
export default async (check) => {
  const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
  for (const [k, inp] of Object.entries(INPUTS)) {
    const res = E.convert(inp);
    for (const [key, ref] of Object.entries(R[k])) {
      const row = res.rows.find((r) => r.key === key);
      check(`effsize: ${inp.from} ${inp.value} -> ${key}${ref.length > 1 ? ' with interval' : ''} matches Python`, !!row && [row.value, ...(ref.length > 1 ? row.ci : [])].every((v, i) => near(v, ref[i])));
    }
  }
  const D = R.data, res = E.convert({ from: 't-ind', value: D.t, n1: D.x.length, n2: D.y.length });
  check('effsize: d from t equals the pooled-SD d of the data', near(res.rows[0].value, D.d));
  check('effsize: r from t equals scipy pointbiserialr', near(res.rows.find((r) => r.key === 'r').value, D.r));
  check('effsize: round trips d -> r -> d, d -> ln OR -> d, d -> Cliff -> d', [0.1, 0.8, -1.3].every((d) => near(E.rToD(E.dToR(d, 3.7), 3.7), d) && near(E.logOrToD(E.dToLogOr(d)), d) && Math.abs(E.cliffToD(E.dToCliff(d)) - d) < 1e-7));
  check('effsize: chi-square with more than 1 df gives only w and V', E.convert(INPUTS.chi4).rows.map((r) => r.key).join() === 'w,V');
  check('effsize: size labels', E.sizeLabel('d', 0.5) === 'medium' && E.sizeLabel('r', 0.05) === 'negligible' && E.sizeLabel('eta2', 0.2) === 'large' && E.sizeLabel('or', 2.5) === 'medium' && E.sizeLabel('cliff', -0.2) === 'small');
  let threw = 0; for (const i of [{ from: 'r', value: 1.2 }, { from: 'or', value: -1 }, { from: 't-ind', value: 2 }, { from: 'f-stat', value: 3, df1: 1, df2: 10, n1: 5, n2: 5 }, { from: 'eta2', value: 0.1, k: 1 }, { from: 'd', value: 0.5, n1: 10 }]) { try { E.convert(i); } catch { threw++; } }
  check('effsize: impossible inputs give plain errors', threw === 6);
};
