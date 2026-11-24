// #723 Questionnaire scorer: checked against pandas/numpy/scipy on the page's made-up example (b2/q_check.py).
import { scoreScales, parseItems, reverseScore } from '../../src/lib/sci/questionnaire.ts';
import { cronbach } from '../../src/lib/sci/reliability.ts';

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  const T = `P01	3	3	4	3	3	3	2	3
P02	3	2	5	1	4	3	4	3
P03	2	4	4	1	1	1	4	2
P04	2		4	2	3	3	2	3
P05	2	3	4	3	3	3	2	4
P06	1	2	5	1	1	1	5	1
P07	4	4	3	4	3	3	2	4
P08	2	2	3	2	3			1
P09	1	2	4	2	3	4	3	5
P10	5	3	1	5	3	2	1	3
P11			1	4	2	2	3	5
P12	5	5	1	5	4	5	2	4
P13	2	2	3	3	5	5	2	4
P14	4	3	3	3	4	3	2	3`;
  const X = T.split('\n').map((l) => l.split('\t').slice(1).map((c) => (c === '' ? NaN : Number(c))));
  while (X.some((r) => r.length < 8)) X.forEach((r) => { while (r.length < 8) r.push(NaN); });
  const names = ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8'];
  const scales = [{ name: 'Calm', items: parseItems('I1-I4', names) }, { name: 'Focus', items: parseItems('5, 6, 7 8', names) }];
  check('questionnaire: item lists by name range and number', JSON.stringify(scales.map((s) => s.items)) === '[[0,1,2,3],[4,5,6,7]]');
  check('questionnaire: unknown item refused', (() => { try { parseItems('I1, Q9', names); return false; } catch (e) { return /Q9/.test(e.message); } })());
  check('questionnaire: reverse score', reverseScore(2, 1, 5) === 4 && reverseScore(0, 0, 6) === 6);
  const o = { min: 1, max: 5, reverse: [2, 6], method: 'sum', minAnswered: 0.75 };
  const [calm, focus] = scoreScales(X, scales, o);
  const wantCalm = [11, 7, 9, 8, 10, 5, 15, 9, 7, 18, NaN, 20, 10, 13], wantFocus = [13, 12, 6, 13, 14, 4, 14, NaN, 15, 13, 12, 17, 18, 14];
  const same = (a, b) => a.length === b.length && a.every((x, i) => (Number.isNaN(b[i]) ? Number.isNaN(x) : near(x, b[i])));
  check('questionnaire: sums with prorating and the 75 % rule (pandas)', same(calm.scores, wantCalm) && same(focus.scores, wantFocus) && calm.prorated === 1 && focus.prorated === 0 && calm.scored === 13);
  check('questionnaire: alpha per subscale (numpy + Feldt with scipy F)', near(calm.alpha, 0.9028794533918985, 1e-9) && near(calm.alphaCi[0], 0.7657195139883954, 1e-6) && near(calm.alphaCi[1], 0.9686436367702211, 1e-6) && calm.alphaN === 12 && near(focus.alpha, 0.8479632816982214, 1e-9) && near(focus.alphaCi[0], 0.6459235671783479, 1e-6) && focus.alphaN === 13);
  check('questionnaire: summary', near(calm.mean, 10.923076923076923) && near(calm.sd, 4.443375939934606) && near(focus.mean, 12.692307692307692) && near(focus.sd, 3.8597196656539574) && calm.lo === 5 && calm.hi === 20);
  const [cm] = scoreScales(X, scales, { ...o, method: 'mean' });
  check('questionnaire: means', near(cm.scores[3], 2) && near(cm.scores[11], 5) && Number.isNaN(cm.scores[10]) && cm.prorated === 0);
  const [strict] = scoreScales(X, scales, { ...o, minAnswered: 1 });
  check('questionnaire: 100 % rule drops incomplete people', Number.isNaN(strict.scores[3]) && strict.scored === 12);
  const [loose] = scoreScales(X, scales, { ...o, minAnswered: 0.5 });
  check('questionnaire: 50 % rule keeps two of four (prorated)', near(loose.scores[10], 18) && loose.prorated === 2);
  // Standardised alpha = k·rbar / (1 + (k − 1)·rbar), pinned on item sets built from orthogonal Hadamard
  // columns, whose pairwise correlations are exactly rbar (blog: transdiagnostic-inventory-alpha-inter-item-correlation).
  const had = (n) => { let H = [[1]]; while (H.length < n) H = [...H.map((r) => [...r, ...r]), ...H.map((r) => [...r, ...r.map((v) => -v)])]; return H; };
  const H32 = had(32);
  const exact = (k, r) => H32.map((row) => Array.from({ length: k }, (_, j) => Math.sqrt(r) * row[1] + Math.sqrt(1 - r) * row[j + 2]));
  const std = (k, r) => cronbach(exact(k, r));
  check('questionnaire: standardised alpha 0.896203 for 6 items correlating 0.59', near(std(6, 0.59).std, 0.8962026, 1e-6) && near(std(6, 0.59).rbar, 0.59, 1e-12));
  check('questionnaire: standardised alpha 0.963934 for 21 items at 0.56, 0.870205 at 0.242', near(std(21, 0.56).std, 0.9639344, 1e-6) && near(std(21, 0.242).std, 0.8702046, 1e-6));
  check('questionnaire: equal item variances make alpha and its standardised form the same', near(std(4, 0.42).alpha, 0.7433628, 1e-6) && near(std(4, 0.42).alpha, std(4, 0.42).std, 1e-12));
  check('questionnaire: out of range answer refused', (() => { try { scoreScales([[1, 7]], [{ name: 'A', items: [0, 1] }], o); return false; } catch (e) { return /outside/.test(e.message); } })());
};
