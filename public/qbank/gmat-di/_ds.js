// Data Sufficiency engine for the GMAT Data Insights bank. A question is a set of possible cases (u), the thing
// asked (ask), and two statements (s1, s2) that are true or false for each case. A statement is sufficient when
// every case it allows gives the same answer. The worked solution names real cases, so the reader sees why.
import { DS, int, choose } from '../grad-quant/_q.js';
export { DS };
export const L = ['A', 'B', 'C', 'D', 'E'];
const vals = (u, ask, f) => { const m = new Map(); for (const c of u) if (f(c)) { const a = String(ask(c)); if (!m.has(a)) m.set(a, c); } return m; };
/** Index of the right DS choice (0 to 4) and the cases behind it. */
export function judge(u, ask, s1, s2) {
  const v1 = vals(u, ask, s1), v2 = vals(u, ask, s2), v12 = vals(u, ask, (c) => s1(c) && s2(c));
  const one = (m) => m.size === 1;
  const ans = one(v1) && one(v2) ? 3 : one(v1) ? 0 : one(v2) ? 1 : one(v12) ? 2 : 4;
  return { ans, v1, v2, v12 };
}
/** One line on a statement (or both together): sufficient, with the single answer, or not, with two cases that disagree. */
function line(m, show, say, label) {
  const e = [...m.entries()];
  if (e.length === 1) return `<b>${label}:</b> every case that fits gives ${say(e[0][0])} (for example ${show(e[0][1])}). <b>Sufficient.</b>`;
  return `<b>${label}:</b> ${show(e[0][1])} fits and gives ${say(e[0][0])}, but ${show(e[1][1])} also fits and gives ${say(e[1][0])}. <b>Not sufficient.</b>`;
}
/** Full worked solution from a judged question. */
export function explain(j, show, say, need, tip) {
  const ls = [`<p><b>What the question needs:</b> ${need}</p>`, `<p>${line(j.v1, show, say, 'Statement (1) alone')}</p>`, `<p>${line(j.v2, show, say, 'Statement (2) alone')}</p>`];
  if (j.ans === 2 || j.ans === 4) ls.push(`<p>${line(j.v12, show, say, 'Both together')}</p>`);
  ls.push(`<p><b>Answer ${L[j.ans]}:</b> ${DS[j.ans]}</p>`);
  if (tip) ls.push(`<p><b>Tip:</b> ${tip}</p>`);
  return ls.join('');
}
export const dsq = (stem, a, b) => `<p>${stem}</p><p>(1) ${a}<br>(2) ${b}</p>`;
export const say = (a) => (a === 'true' ? '<b>yes</b>' : a === 'false' ? '<b>no</b>' : `<b>${String(a).replace(/^-/, '−')}</b>`);
/** Try random statement pairs until the answer is the target letter (so all five letters come up evenly). */
export function aim(r, tries, build) {
  const target = int(r, 0, 4); let last;
  for (let i = 0; i < tries || !last; i++) { const b = build(); if (b.ok === false || !b.j.v1.size || !b.j.v2.size || !b.j.v12.size) continue; last = b; if (b.j.ans === target) return b; }
  return last;
}
export { int, choose };
