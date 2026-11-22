// Live problems for the SAT course: the numeric templates of the SAT question bank (public/qbank/sat/), shown
// with the lesson kit's "Try it" box (fresh numbers, check, hint, worked solution). One source for both, so a fix
// in the bank fixes the lesson too. Placed in a lesson as <div class="problem" data-problem="le-g01"></div>
// (the template id without "sat-"). Checked by tests/exams.mjs.
import le from '../../qbank/sat/linear-equations.js';
import lf from '../../qbank/sat/linear-functions.js';
import sy from '../../qbank/sat/systems-of-equations.js';
import li from '../../qbank/sat/linear-inequalities.js';
import lm from '../../qbank/sat/linear-models.js';
import ee from '../../qbank/sat/equivalent-expressions.js';
import qd from '../../qbank/sat/quadratics.js';
import fn from '../../qbank/sat/functions.js';
import ex from '../../qbank/sat/exponential-functions.js';
import pr from '../../qbank/sat/polynomials-rational.js';
import re from '../../qbank/sat/radicals-exponents.js';
import ns from '../../qbank/sat/nonlinear-systems.js';

const HINT = 'Write down what the question gives you and what it asks for, then take one small step at a time. Check your answer by putting it back in.';
const out = {};
for (const t of [le, lf, sy, li, lm, ee, qd, fn, ex, pr, re, ns]) {
  for (const g of t.gens || []) {
    if (g.type !== 'nat') continue;
    out[g.id.replace(/^sat-/, '')] = {
      title: g.sub,
      make(r) {
        const p = g.make(r);
        return { q: p.q, answer: p.answer, unit: p.unit || '', tol: 0, abs: Math.max(p.tol || 0, 1e-6),
          hint: p.hint || g.hint || (p.trap ? `${HINT} Watch out for this trap: ${p.trap}` : HINT), solution: p.sol };
      },
    };
  }
}
export default out;
