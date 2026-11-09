// #689 gauge R&R: ANOVA sums of squares, F tests and variance components checked against NumPy + scipy.stats.f;
// the average and range method against a NumPy script; d2, d3 and d2* against SciPy numerical integration of
// the distribution of the range (not against printed tables).
import * as G from '../../src/lib/sci/eng-grr.ts';
import * as S from '../../src/lib/sci/eng-spc.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const py = { 2: [1.1283791670955123, 0.8525024664274221], 3: [1.6925687506432687, 0.8883680040452041], 4: [2.0587507460079277, 0.8798082028249837], 5: [2.3259289472810396, 0.8640819410995011], 10: [3.077505461670345, 0.7970506735194096], 25: [3.9306292195071117, 0.7084407659566023] };
  for (const [n, [a, b]] of Object.entries(py)) check(`spc: d2(${n}) and d3(${n}) match SciPy integration to 1e-8`, Math.abs(S.d2(+n) - a) < 1e-8 && Math.abs(S.d3(+n) - b) < 1e-8);
  check('spc: d2*(2, 1) = √2 and d2*(10, 1) = 3.1790', near(S.d2star(2, 1), Math.SQRT2, 1e-9) && Math.abs(S.d2star(10, 1) - 3.17905) < 1e-4);
  check('spc: c4(2) = √(2/π), c4(5) = 0.939986, c4(25) = 0.989640', near(S.c4(2), Math.sqrt(2 / Math.PI), 1e-14) && Math.abs(S.c4(5) - 0.939986) < 1e-6 && Math.abs(S.c4(25) - 0.98964) < 1e-6);
  check('spc: chi-square quantiles match scipy.stats.chi2.ppf (49 df)', near(S.chi2Inv(0.025, 49), 31.554916462667126, 1e-9) && near(S.chi2Inv(0.975, 49), 70.22241356643451, 1e-9));
  const rows = G.exampleStudy(), s = G.readStudy(rows, Number);
  check('grr: example is 10 parts × 3 operators × 3 trials', s.parts.length === 10 && s.ops.length === 3 && s.y[0][0].length === 3 && G.checkStudy(s) === null);
  const f = G.anovaGRR(s, { alphaRemove: 0 });
  const t = Object.fromEntries(f.table.map((r) => [r.source, r]));
  check('grr: full ANOVA sums of squares match NumPy', near(t.Part.ss, 0.9736385000000081, 1e-10) && near(t.Operator.ss, 0.029217799999999402, 1e-9) && near(t['Part × Operator'].ss, 0.007860199999993996, 1e-8) && near(t.Repeatability.ss, 0.03188000000000001, 1e-10));
  check('grr: full ANOVA F and p values match scipy.stats.f.sf', near(t.Part.f, 247.7388616067662, 1e-9) && near(t.Operator.f, 33.45464492000146, 1e-9) && near(t['Part × Operator'].p, 0.6681101435695401, 1e-7) && near(t.Part.p, 5.353366295268628e-17, 1e-6) && near(t.Operator.p, 8.646805076086161e-7, 1e-6));
  check('grr: variance components with interaction match NumPy', near(f.v.repeat, 0.0005313333333333335) && near(f.v.op, 0.00047240740740740853, 1e-8) && f.v.po === 0 && near(f.v.part, 0.011971708641975444, 1e-9) && Math.abs(f.pctStudy.grr - 27.81311119661778) < 1e-7);
  const r = G.anovaGRR(s, { alphaRemove: 0.05, tol: 1 });
  check('grr: interaction (p = 0.668) is pooled at α = 0.05', r.pooled && r.table.length === 4);
  check('grr: pooled F and p match scipy', near(r.table[0].f, 212.33411843258654, 1e-9) && near(r.table[1].f, 28.67358996683833, 1e-9) && near(r.table[0].p, 4.71559469087512e-51, 1e-6) && near(r.table[1].p, 4.6256233121941073e-10, 1e-6));
  check('grr: pooled %contribution 7.5675, %study var 27.509, %tolerance 18.778, ndc 4', Math.abs(r.pctContribution.grr - 7.567514390303908) < 1e-7 && Math.abs(r.pctStudy.grr - 27.5091155624893) < 1e-7 && Math.abs(r.pctTol.grr - 18.77789207470318) < 1e-7 && r.ndc === 4);
  check('grr: %contribution adds to 100', near(r.pctContribution.grr + r.pctContribution.part, 100, 1e-12) && near(r.pctContribution.repeat + r.pctContribution.reprod, r.pctContribution.grr, 1e-12));
  const x = G.averageRange(s, { tol: 1 });
  check('grr: average-range K1, K2, K3 from computed d2 and d2*', Math.abs(x.K1 - 0.5908179503018387) < 1e-9 && Math.abs(x.K2 - 0.5231383035342977) < 1e-9 && Math.abs(x.K3 - 0.31455983630119244) < 1e-9);
  check('grr: average-range EV, AV, GRR, PV, TV match NumPy', [[x.ev, 0.023593330148720063], [x.av, 0.022451660470311052], [x.grr, 0.0325687317128044], [x.pv, 0.10684549106363932], [x.tv, 0.11169906555567446]].every(([a, b]) => Math.abs(a / b - 1) < 1e-8) && Math.abs(x.pctStudy.grr - 29.157568642838) < 1e-6 && x.ndc === 4);
  // Unbalanced or bad layouts are refused.
  const bad = G.readStudy([['1', 'A', '1', '2'], ['1', 'B', '1', '2'], ['2', 'A', '1', '2']], Number);
  check('grr: a missing part × operator cell is reported', /no measurement by operator B/.test(G.checkStudy(bad)));
  const one = G.readStudy([['1', 'A', '1'], ['1', 'B', '1'], ['2', 'A', '1'], ['2', 'B', '2']], Number);
  check('grr: a single trial is refused', /at least twice/.test(G.checkStudy(one)));
  check('grr: long format (one value per row) gives the same study as wide format', (() => { const long = rows.flatMap((rw) => rw.slice(2).map((v) => [rw[0], rw[1], v])); const s2 = G.readStudy([['part', 'operator', 'mm'], ...long], Number); return G.checkStudy(s2) === null && near(G.anovaGRR(s2).pctStudy.grr, r.pctStudy.grr, 1e-12); })());
};
