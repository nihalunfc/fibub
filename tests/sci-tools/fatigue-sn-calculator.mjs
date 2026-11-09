// #847 fatigue S-N calculator: checked against SciPy (linregress on log-log data; brentq for where the load line
// meets each Goodman, Gerber, Soderberg and Morrow line; Miner's sum) on the page's made-up data set.
import { exampleSN, fitBasquin, stressAt, lifeAt, steelEndurance, equivalent, safety, yieldSafety, haighLine, miner } from '../../src/lib/sci/fatigue.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a / b - 1) <= rel;
  const e = exampleSN();
  check('fatigue: example has 14 failures and 2 run-outs', e.S.length === 16 && e.runout.filter(Boolean).length === 2 && e.N[0] === 263);
  const f = fitBasquin(e.S, e.N, e.runout);
  check('fatigue: Basquin (log N on log S) matches scipy linregress', near(f.A, 832.92870914, 1e-9) && near(f.b, -0.083664716925, 1e-9) && near(f.r2, 0.97660252754, 1e-9) && near(f.sLog, 0.198406386676, 1e-9));
  check('fatigue: σf\' = A·2^−b', near(f.sf, 882.65994915824, 1e-9));
  const g = fitBasquin(e.S, e.N, e.runout, 'logS');
  check('fatigue: Basquin (log S on log N) matches scipy', near(g.A, 815.54896764738, 1e-9) && near(g.b, -0.081707174014424, 1e-9));
  const Se = stressAt(f, 1e7), p = { Su: 600, Sy: 450, sf: f.sf };
  check('fatigue: strength at 10⁷ cycles', near(Se, 216.249351127514, 1e-9) && near(lifeAt(f, Se), 1e7, 1e-9));
  const want = { goodman: [180, 1.16237120805893], gerber: [154.285714285714, 1.36684541589175], soderberg: [192.857142857143, 1.09186287635747], morrow: [169.165411512538, 1.23925317570194] };
  for (const [m, [sar, n]] of Object.entries(want)) check(`fatigue: ${m} equivalent stress and load-line safety factor match scipy brentq`, near(equivalent(m, 150, 100, p), sar, 1e-9) && near(safety(m, 150, 100, Se, p), n, 1e-9));
  check('fatigue: zero mean stress gives σa back', ['goodman', 'gerber', 'soderberg', 'morrow'].every((m) => equivalent(m, 150, 0, p) === 150 && near(safety(m, 150, 0, Se, p), Se / 150, 1e-12)));
  check('fatigue: mean stress at the limit is infinite', equivalent('goodman', 100, 600, p) === Infinity && equivalent('soderberg', 100, 500, p) === Infinity);
  check('fatigue: Shigley steel endurance rule', steelEndurance(600) === 300 && steelEndurance(2000) === 700);
  check('fatigue: Langer yield line', near(yieldSafety(150, 100, 450), 1.8, 1e-12));
  { const h = haighLine('gerber', 200, p, 4); check('fatigue: Gerber parabola on the Haigh diagram', h.x[2] === 300 && near(h.y[2], 150, 1e-12) && h.y[4] === 0); }
  const M = miner([{ sa: 300, sm: 0, n: 1e5 }, { sa: 250, sm: 50, n: 2e5 }, { sa: 200, sm: 100, n: 3e5 }, { sa: 120, sm: 0, n: 1e7 }], f, { method: 'goodman', ...p, Se });
  check('fatigue: Miner damage matches scipy', near(M.D, 0.924830808511279, 1e-9) && near(M.rows[1].N, 624460.138414258, 1e-9) && M.rows[3].N === Infinity && near(M.repeats, 1.08127885749148, 1e-9));
  const M2 = miner([{ sa: 120, sm: 0, n: 1e7 }], f, { method: 'none', ...p });
  check('fatigue: without an endurance limit the line is extended', near(M2.rows[0].N, (120 / f.A) ** (1 / f.b), 1e-12) && M2.D > 0);
  let threw = false; try { fitBasquin([1, 2], [3, 4]); } catch { threw = true; }
  check('fatigue: too few points is an error', threw);
};
