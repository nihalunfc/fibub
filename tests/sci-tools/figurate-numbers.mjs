// #1280 Growing patterns. Polygonal numbers checked against the OEIS lists (A000217 triangular, A000290 squares,
// A000326 pentagonal, A000384 hexagonal), the dot pictures counted dot by dot, the sums against brute force, and
// the rule finder against hand-made sequences (and Python numpy.polyfit for the quadratic ones).
import { polygonal, polygonalSum, gnomon, polygonDots, differences, findRule, polyText, PATTERNS, sticks } from '../../src/lib/sci/figurate-school.ts';

export default async (check) => {
  const same = (a, b) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
  const first = (f, k = 8) => Array.from({ length: k }, (_, i) => f(i + 1));
  check('triangular 1 3 6 10 15 21 28 36', same(first((n) => polygonal(3, n)), [1, 3, 6, 10, 15, 21, 28, 36]));
  check('square 1 4 9 16 25 36 49 64', same(first((n) => polygonal(4, n)), [1, 4, 9, 16, 25, 36, 49, 64]));
  check('pentagonal 1 5 12 22 35 51 70 92', same(first((n) => polygonal(5, n)), [1, 5, 12, 22, 35, 51, 70, 92]));
  check('hexagonal 1 6 15 28 45 66 91 120', same(first((n) => polygonal(6, n)), [1, 6, 15, 28, 45, 66, 91, 120]));
  let ok = true;
  for (const s of [3, 4, 5, 6]) for (let n = 1; n <= 9; n++) {
    const d = polygonDots(s, n);
    if (d.length !== polygonal(s, n) || d.filter((p) => p.layer === n).length !== (n === 1 ? 1 : gnomon(s, n))) ok = false;
    let sum = 0; for (let k = 1; k <= n; k++) sum += polygonal(s, k);
    if (sum !== polygonalSum(s, n)) ok = false;
  }
  check('dot pictures have the right count and new-layer size; sums match brute force', ok);
  check('pattern sums agree with their own formula text', PATTERNS.every((p) => { let s = 0; for (let n = 1; n <= 10; n++) { s += p.term(n); if (Math.abs(s - p.sum(n)) > 1e-9) return false; } return true; }));
  check('matchsticks 4 7 10 13', same(first(sticks, 4), [4, 7, 10, 13]));
  const df = differences([1, 4, 9, 16, 25]);
  check('differences of squares', same(df.d1, [3, 5, 7, 9]) && same(df.d2, [2, 2, 2]));
  const L = findRule([4, 7, 10, 13]);
  check('linear rule 3n + 1, 20th term 61', L.kind === 'linear' && L.text === '3n + 1' && L.term(20) === 61);
  check('decreasing linear: 20 17 14 → −3n + 23', findRule([20, 17, 14]).text === '−3n + 23');
  const Q = findRule([2, 5, 10, 17]);   // n² + 1 (numpy.polyfit gives [1, 0, 1])
  check('quadratic rule n² + 1', Q.kind === 'quadratic' && Q.text === 'n² + 1' && Q.term(10) === 101);
  check('triangular rule 1/2n² + 1/2n', findRule([1, 3, 6, 10]).text === '1/2n² + 1/2n');
  const G = findRule([3, 6, 12, 24]);
  check('geometric rule 3 × 2ⁿ⁻¹', G.kind === 'geometric' && G.r === 2 && G.term(6) === 96 && G.text === '3 × 2ⁿ⁻¹');
  check('quadratic needs 4 terms', findRule([1, 4, 9]).kind === 'none' && findRule([1, 4, 9]).text.includes('fourth'));
  check('no rule for 1 2 4 7 11 16 29', findRule([1, 2, 4, 7, 11, 16, 29]).kind === 'none');
  check('too few numbers', findRule([1, 2]).kind === 'none');
  check('polyText', polyText(1, -1, 41) === 'n² − n + 41' && polyText(0, 0, 5) === '5' && polyText(-1, 0, 0) === '−n²' && polyText(0, 2, -3) === '2n − 3');
};
