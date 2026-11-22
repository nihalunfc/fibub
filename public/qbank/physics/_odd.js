// Helpers for the m31..m35 extra-variety templates (<topic>.more.gen.js). Not a topic file (leading underscore).
// Kept in its own file so parallel writers appending to _more.js do not collide.
import { int, shuffle } from '../_util.js';

/**
 * MCQ with one odd option out. `odd` = [text, reason] is the answer, `rest` = [[text, reason], ...] are the others;
 * k of them are shown. The solution lists every shown option with its reason. Returns { options, answer, sol }.
 */
export function oddOne(r, odd, rest, { k = 3, lead = '' } = {}) {
  const seen = new Set([odd[0]]);
  const others = shuffle(r, rest).filter((c) => (seen.has(c[0]) ? false : (seen.add(c[0]), true))).slice(0, k);
  const all = shuffle(r, [odd, ...others]);
  const answer = all.indexOf(odd);
  const sol = `${lead}<ul>${all.map((c) => `<li>${c[0]}: ${c === odd ? '<b>this is the answer.</b> ' : ''}${c[1]}</li>`).join('')}</ul>`;
  return { options: all.map((c) => c[0]), answer, sol };
}

/**
 * "Which is true" / "which is NOT true" from one pool of [text, isTrue, reason]: with not = false the answer is one
 * true statement among false ones, with not = true one false statement among true ones. Returns { options, answer, sol }.
 */
export function oneOf(r, cands, not = false) {
  const odd = shuffle(r, cands.filter((c) => c[1] === !not))[0];
  const rest = cands.filter((c) => c[1] === not).map((c) => [c[0], `${c[1] ? 'true' : 'false'}. ${c[2]}`]);
  return oddOne(r, [odd[0], `${odd[1] ? 'true' : 'false'}. ${odd[2]}`], rest);
}

/**
 * Order-of-magnitude MCQ: four consecutive powers of ten around x, with the nearest power (on a log scale) at a
 * random position. unit is TeX added to each option. Returns { options, answer, n }.
 */
export function orderOpts(r, x, unit = '') {
  const n = Math.round(Math.log10(Math.abs(x)));
  const s = int(r, 0, 3);
  const options = [0, 1, 2, 3].map((i) => `$\\sim 10^{${n - s + i}}${unit ? `\\,${unit}` : ''}$`);
  return { options, answer: s, n };
}

/**
 * One case [setup, correctKey, explanation, excludedKeys?] matched against labels {key: text}: MCQ with the right
 * label and up to 3 others. excludedKeys lists labels that would also be true for this case (never shown).
 */
export function matchOne(r, labels, cas) {
  const ex = cas[3] ?? [];
  const keys = Object.keys(labels).filter((k) => k !== cas[1] && !ex.includes(k));
  const shown = shuffle(r, [cas[1], ...shuffle(r, keys).slice(0, 3)]);
  return { options: shown.map((k) => labels[k]), answer: shown.indexOf(cas[1]), sol: cas[2] };
}
