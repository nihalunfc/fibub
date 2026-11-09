// #1185 limit zoom. One-sided limits of every example and of typed functions checked against sympy 1.14
// (limit(f, x, a, '-') and '+'); the kind of point (continuous, hole, jump, infinite, wobble) against the
// definitions.
import * as LZ from '../../src/lib/sci/school-limits.ts';
import { readFn } from '../../src/lib/sci/school-calculus.ts';
const near = (a, b, t = 1e-6) => (a === b) || (Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b)));
export default async (check) => {
  for (const e of LZ.EXAMPLES) {
    const r = LZ.examine(e.f, e.a);
    check(`limits: ${e.id} left ${e.left}, right ${e.right} (sympy) and kind ${e.kind}`, (Number.isNaN(e.left) ? Number.isNaN(r.left) : near(r.left, e.left)) && (Number.isNaN(e.right) ? Number.isNaN(r.right) : near(r.right, e.right)) && r.kind === e.kind);
    check(`limits: ${e.id} value at a`, Number.isNaN(e.value) ? Number.isNaN(r.value) : r.value === e.value);
  }
  const typed = [['(x^3 - 1)/(x - 1)', 1, 3], ['sin(3x)/x', 0, 3], ['(tan(x) - sin(x))/x^3', 0, 0.5]];
  for (const [s, a, L] of typed) { const r = LZ.examine(readFn(s), a); check(`limits: typed ${s} at ${a} → ${L} (sympy)`, near(r.limit, L, 1e-5) && r.kind === 'removable'); }
  const c = LZ.examine(readFn('x^2 + 1'), 2);
  check('limits: x² + 1 is continuous at 2 with limit 5', c.kind === 'continuous' && near(c.limit, 5, 1e-9) && c.value === 5);
  const t = LZ.table(Math.abs, 0, -1);
  check('limits: table steps 0.1 down to 0.000001 on the left', t.length === 6 && t[0].x === -0.1 && t[5].x === -0.000001);
};
