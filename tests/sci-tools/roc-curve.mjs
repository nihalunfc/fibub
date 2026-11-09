// #468 ROC curve: checked against scikit-learn 1.9 (roc_curve with drop_intermediate=False, roc_auc_score) and a
// direct O(mn) numpy DeLong (1988) implementation, on the tool's example and 8 random data sets.
import { roc, compareRoc, rocPoints, parseRoc } from '../../src/lib/sci/roc.ts';

const EX = 'Disease\tMarker A\tMarker B\n' + '1 53 8.6|0 43 3.3|0 30 6.3|0 40 5.1|1 36 3.9|0 24 4.9|0 8 5.9|0 44 9.8|0 44 4|0 22 5.7|0 28 6.3|0 25 6.3|0 57 5.4|1 44 8.5|1 67 5.2|0 40 5.3|0 26 6.4|1 78 5.1|1 66 6.1|1 52 8.4|0 29 5.7|1 63 1.1|1 58 7.3|0 35 3.3|0 25 3|0 41 3.6|0 17 3.9|0 24 4.7|1 60 6.5|1 56 8.1|0 26 5.3|1 51 4|0 44 8.5|1 56 7|1 44 5|1 42 5|1 57 7.7|1 53 5.1|0 24 3|1 45 7.7|0 42 4.2|0 36 0.8|0 38 4.6|0 45 7.8|0 36 5.9|0 23 4.3|0 37 2.9|1 26 6.1|1 45 7.1|0 37 5.2|0 15 5.7|0 38 2.7|0 27 4.7|0 28 6|1 51 6.1|0 31 4.3|1 45 7.6|1 56 3.1|1 27 4.2|1 44 6.1'.split('|').map((r) => r.split(' ').join('\t')).join('\n');

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const d = parseRoc(EX);
  check('roc: example parsed (60 rows, labels 0/1, two markers)', d.rows.length === 60 && d.labels.join() === '0,1' && d.markers.join() === 'Marker A,Marker B' && d.skipped === 0);
  const P = d.rows.filter((r) => r.y === '1'), N = d.rows.filter((r) => r.y === '0');
  const a = roc(P.map((r) => r.v[0]), N.map((r) => r.v[0])), b = roc(P.map((r) => r.v[1]), N.map((r) => r.v[1]));
  check(`roc: AUC A 0.895429 = sklearn roc_auc_score (got ${a.auc})`, near(a.auc, 0.8954285714285714, 1e-12));
  check('roc: AUC B 0.676 = sklearn', near(b.auc, 0.676, 1e-12));
  check('roc: DeLong SE A 0.0445421, B 0.0732687 (numpy DeLong)', near(a.se, 0.0445420789671911, 1e-12) && near(b.se, 0.0732687008279006, 1e-10));
  check('roc: 95 % CI A 0.808128 to 0.982729', near(a.lo, 0.8081277008563376, 1e-9) && near(a.hi, 0.9827294420008047, 1e-9));
  check('roc: 35 thresholds as sklearn roc_curve(drop_intermediate=False), from (0,0) to (1,1)', a.points.length === 35 && a.points[0].threshold === Infinity && a.points[0].sens === 0 && a.points[34].sens === 1 && a.points[34].fpr === 1);
  check('roc: Youden cut-off 44 (J 0.697143, sensitivity 0.84, specificity 0.857143)', a.best.threshold === 44 && near(a.best.j, 0.6971428571428571, 1e-12) && near(a.best.sens, 0.84, 1e-12) && near(a.best.spec, 0.8571428571428571, 1e-12));
  check('roc: counts, PPV, NPV, LR+ and LR− at the cut-off', a.best.tp === 21 && a.best.fp === 5 && a.best.tn === 30 && a.best.fn === 4 && near(a.best.ppv, 21 / 26, 1e-12) && near(a.best.npv, 30 / 34, 1e-12) && near(a.best.lrPos, 5.88, 1e-9) && near(a.best.lrNeg, 0.16 / (30 / 35), 1e-9));
  const c = compareRoc(P.map((r) => r.v[0]), N.map((r) => r.v[0]), P.map((r) => r.v[1]), N.map((r) => r.v[1]));
  check(`roc: DeLong paired test z 2.891576, p 0.00383315 (numpy DeLong) got ${c.z}`, near(c.z, 2.891575652600003, 1e-9) && near(c.p, 0.0038331529346217297, 1e-9));
  check('roc: difference 0.219429, CI 0.070696 to 0.368161', near(c.diff, 0.21942857142857, 1e-9) && near(c.lo, 0.07069578735205229, 1e-9) && near(c.hi, 0.36816135550508944, 1e-9));
  const low = roc(P.map((r) => r.v[0]), N.map((r) => r.v[0]), false);
  check('roc: lower-is-positive direction gives 1 − AUC and the same SE', near(low.auc, 1 - a.auc, 1e-12) && near(low.se, a.se, 1e-12) && low.points[1].threshold === Math.min(...d.rows.map((r) => r.v[0])));
  const tie = roc([1, 2, 2, 3], [0, 1, 2, 2]);
  check('roc: ties count half (AUC 11.5/16 by hand)', near(tie.auc, 11.5 / 16, 1e-12));
  const pts = rocPoints([3, 2], [1]);
  check('roc: rocPoints counts', pts.length === 4 && pts[2].tp === 2 && pts[2].fp === 0 && pts[3].fp === 1);
  let msg = ''; try { parseRoc('y\tx\n1\t2\n1\t3'); } catch (e) { msg = e.message; }
  check('roc: one outcome value message', msg.includes('two different values'));
  msg = ''; try { parseRoc('y\tx\n1\t2\n0\t3\n2\t4'); } catch (e) { msg = e.message; }
  check('roc: three outcome values message', msg.includes('exactly two'));
  msg = ''; try { roc([1], [0, 1]); } catch (e) { msg = e.message; }
  check('roc: too few subjects message', msg.includes('at least 2 positive'));
  const lab = parseRoc('Status,Score\nsick,5\nwell,1\nsick,4\nwell,x\nwell,2');
  check('roc: text labels, comma data and a bad row skipped', lab.labels.join() === 'sick,well' && lab.rows.length === 4 && lab.skipped === 1);
};
