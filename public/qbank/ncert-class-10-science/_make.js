// Helpers for the NCERT Class 10 Science question files: build items with the correct option placed in a spread
// of positions (A to D used evenly), plus assertion-reason options. Used by every chapter file in this bank.
export const AR = [
  'Both A and R are true, and R is the correct explanation of A.',
  'Both A and R are true, but R is not the correct explanation of A.',
  'A is true, but R is false.',
  'A is false, but R is true.',
];
/** A builder for one chapter: prefix for ids, e.g. 'el'. */
export function maker(prefix) {
  let k = 0, c = 0;
  const id = () => `${prefix}-${String(++k).padStart(3, '0')}`;
  const base = (level, sub, o) => ({ id: id(), level, exams: ['board'], sub, ...o });
  return {
    /** Single-answer MCQ: the correct option goes to a rotating position. */
    mcq(level, sub, q, correct, wrongs, sol, o = {}) {
      const pos = (c++ * 3 + 1) % 4, options = [...wrongs]; options.splice(pos, 0, correct);
      return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
    },
    /** Assertion (A) and reason (R): ans is 0-3 in the AR order. */
    ar(level, sub, a, r, ans, sol, o = {}) {
      return base(level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AR, answer: ans, sol, ...o });
    },
    /** Numerical answer worked out in code. */
    nat(level, sub, q, fn, tol, sol, o = {}) {
      const answer = +fn().toPrecision(6);
      return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
    },
    /** Several correct options. */
    msq(level, sub, q, options, answer, sol, o = {}) {
      return base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
    },
  };
}
