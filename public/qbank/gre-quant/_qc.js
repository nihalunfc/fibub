// Quantitative Comparison engine for the GRE bank: compare Quantity A and Quantity B over every allowed case.
import { QC, qc } from '../grad-quant/_q.js';
export { QC, qc };
/** 0: A greater, 1: B greater, 2: equal, 3: cannot be determined; plus a case for each outcome seen. */
export function compare(cases, fa, fb) {
  const seen = new Map();
  for (const c of cases) { const a = fa(c), b = fb(c), k = Math.abs(a - b) < 1e-9 ? 2 : a > b ? 0 : 1; if (!seen.has(k)) seen.set(k, [c, a, b]); }
  return { ans: seen.size === 1 ? [...seen.keys()][0] : 3, seen };
}
const W = ['A is greater', 'B is greater', 'they are equal'];
/** Worked solution. `show(case)` names a case ("x = 2"); pass show = null when there are no unknowns. */
export function explain(res, show, num, tip, work = '') {
  const e = [...res.seen.entries()].map(([k, [c, a, b]]) => `${show ? show(c) + ': ' : ''}A = ${num(a)} and B = ${num(b)}, so ${W[k]}.`);
  let body;
  if (!show) body = `<p>${work}${e[0]}</p>`;
  else if (res.ans === 3) body = `<p>Try more than one allowed value:</p><ul>${e.map((x) => `<li>${x}</li>`).join('')}</ul><p>Different allowed values give different results.</p>`;
  else body = `<p>${work}For example, ${e[0]} Trying the edge cases (0, 1, negatives and fractions, where allowed) always gives the same result.</p>`;
  return body + `<p><b>Answer ${'ABCD'[res.ans]}:</b> ${QC[res.ans]}</p>` + (tip ? `<p><b>Tip:</b> ${tip}</p>` : '');
}
