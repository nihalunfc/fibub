// Water quality index on the CCME WQI structure (scope F1, frequency F2, amplitude F3), against objectives the user
// sets for each variable (an upper limit, a lower limit, or both). No guideline values are built in. No DOM.

export type Objective = { name: string; min: number; max: number }; // NaN when that side has no limit
export type Test = { v: number; value: number }; // variable index and measured value

/** How far a value is outside its objective, as a ratio excursion (0 when it passes). */
export function excursion(o: Objective, x: number) {
  if (Number.isFinite(o.max) && x > o.max) return o.max > 0 ? x / o.max - 1 : Infinity;
  if (Number.isFinite(o.min) && x < o.min) return x > 0 ? o.min / x - 1 : Infinity;
  return 0;
}
export const fails = (o: Objective, x: number) => (Number.isFinite(o.max) && x > o.max) || (Number.isFinite(o.min) && x < o.min);

export const CATS: [number, string][] = [[95, 'Excellent'], [80, 'Good'], [65, 'Fair'], [45, 'Marginal'], [0, 'Poor']];
export const category = (w: number) => CATS.find(([lo]) => w >= lo - 1e-9)![1];

/** The index from a list of tests. Variables with no tests are left out of the count. */
export function wqi(objs: Objective[], tests: Test[]) {
  const used = [...new Set(tests.map((t) => t.v))];
  const per = objs.map((o, i) => {
    const ts = tests.filter((t) => t.v === i), bad = ts.filter((t) => fails(o, t.value));
    const exc = bad.map((t) => excursion(o, t.value));
    return { name: o.name, tests: ts.length, failed: bad.length, sumExc: exc.reduce((a, b) => a + b, 0), worst: exc.length ? Math.max(...exc) : 0 };
  });
  const nVar = used.length, nTest = tests.length;
  const failedVars = per.filter((p) => p.failed > 0).length, failedTests = per.reduce((s, p) => s + p.failed, 0);
  const F1 = nVar ? (100 * failedVars) / nVar : 0, F2 = nTest ? (100 * failedTests) / nTest : 0;
  const nse = nTest ? per.reduce((s, p) => s + p.sumExc, 0) / nTest : 0;
  const F3 = Number.isFinite(nse) ? nse / (0.01 * nse + 0.01) : 100;
  const index = 100 - Math.sqrt(F1 * F1 + F2 * F2 + F3 * F3) / 1.732;
  return { index: Math.max(0, index), F1, F2, F3, nse, nVar, nTest, failedVars, failedTests, per, category: category(Math.max(0, index)) };
}
