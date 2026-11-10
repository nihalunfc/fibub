// #1280 Growing patterns. Rules checked against sympy.interpolate (4, 7, 10, 13 → 3n + 1; 1, 3, 6, 10, 15 →
// n²/2 + n/2, shown as (1/2)n² + (1/2)n; 2, 5, 10, 17, 26 → n² + 1) and the dot counts against each pattern's formula.
import { PATTERNS, terms, diffs, findRule, dots } from '../../src/lib/sci/sequence-school.ts';
export default async (check) => {
  const r1 = findRule([4, 7, 10, 13]);
  check('seq: 4, 7, 10, 13 is 3n + 1, next 16', r1.kind === 'linear' && r1.text.endsWith('3n + 1') && r1.next === 16);
  const r2 = findRule([1, 3, 6, 10, 15]);
  check('seq: triangular is n²/2 + n/2 (sympy), next 21', r2.kind === 'quadratic' && r2.text.endsWith('(1/2)n² + (1/2)n') && r2.next === 21);
  const r3 = findRule([2, 5, 10, 17, 26]);
  check('seq: 2, 5, 10, 17, 26 is n² + 1, next 37', r3.kind === 'quadratic' && r3.text.endsWith('n² + 1') && r3.next === 37);
  const r4 = findRule([3, 6, 12, 24]);
  check('seq: 3, 6, 12, 24 is geometric, ratio 2, next 48', r4.kind === 'geometric' && r4.next === 48 && r4.text.includes('(2)'));
  const r5 = findRule([10, 7, 4]);
  check('seq: 10, 7, 4 is −3n + 13, next 1', r5.kind === 'linear' && r5.text.endsWith('−3n + 13') && r5.next === 1);
  check('seq: 1, 2, 4, 7, 12 has no simple rule; two terms are too few', findRule([1, 2, 4, 7, 12]).kind === 'none' && findRule([1, 2]).kind === 'none');
  check('seq: 0.5, 1, 1.5 is n/2', findRule([0.5, 1, 1.5]).text.endsWith('(1/2)n'));
  check('seq: differences of squares are odd numbers', diffs(terms((n) => n * n, 6)).join() === '3,5,7,9,11');
  let ok = true;
  for (const p of PATTERNS) for (let n = 1; n <= 7; n++) { const d = dots(p.id, n); if (d.length && d.length !== p.nth(n)) ok = false; }
  check('seq: dot pictures have exactly the nth term of dots for every pattern', ok);
  check('seq: pentagonal 1, 5, 12, 22; hexagonal 1, 6, 15, 28', terms(PATTERNS.find((p) => p.id === 'pentagon').nth, 4).join() === '1,5,12,22' && terms(PATTERNS.find((p) => p.id === 'hexagon').nth, 4).join() === '1,6,15,28');
  let ok2 = true;
  for (let i = 0; i < 200; i++) { const a = Math.floor(Math.random() * 9) - 4, b = Math.floor(Math.random() * 21) - 10, c = Math.floor(Math.random() * 21) - 10; const f = (k) => a * k * k + b * k + c; const r = findRule(terms(f, 5)); if (r.kind === 'none' || Math.abs(r.next - f(6)) > 1e-9) ok2 = false; }
  check('seq: 200 random quadratics: the next term is predicted', ok2);
};
