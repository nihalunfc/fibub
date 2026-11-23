// Class 11 Maths, Linear Inequalities: live problems (original fibub questions). Ids start with c11m-ineq-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11m-ineq-greatest': {
    title: 'greatest whole number solution',
    make(r) {
      const a = pick(r, 2, 7), b = pick(r, 1, 15), c = pick(r, 20, 60), answer = Math.floor((c - b) / a);
      return { a, b, c, q: `<p>A cricket coach has ₹${c} for balls. One kit costs ₹${b} and each ball costs ₹${a}. Writing the condition as ${a}x + ${b} ≤ ${c}, what is the greatest whole number of balls x that can be bought?</p>`, answer, unit: 'balls', tol: 0, abs: 0.001,
        hint: `Subtract ${b} from both sides, then divide by ${a} (positive, so the sign stays). Take the whole-number part.`,
        solution: steps(`${a}x ≤ ${c} − ${b} = ${c - b}.`, `x ≤ ${(c - b) / a < 100 ? +((c - b) / a).toFixed(3) : ''}.`, `The greatest whole number is <b>${answer}</b>.`) };
    },
    verify(x) { let k = 0; while (x.a * (k + 1) + x.b <= x.c) k++; return k; },
  },
  'c11m-ineq-negative': {
    title: 'dividing by a negative number',
    make(r) {
      const a = pick(r, 2, 6), b = pick(r, 1, 12), c = pick(r, 2, 30), answer = Math.floor((b - c) / a);
      // −a x + b ≥ c  ⇔  x ≤ (b − c) / a ; greatest whole x:
      return { a, b, c, q: `<p>Solve −${a}x + ${b} ≥ ${c}. What is the greatest whole number x that satisfies it?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Move the constant first, then divide by the negative coefficient. Remember to turn ≥ into ≤.',
        solution: steps(`−${a}x ≥ ${c} − ${b} = ${c - b}.`, `Divide by −${a}: the sign flips, so x ≤ ${(c - b) / -a}.`, `Greatest whole number: <b>${answer}</b>.`) };
    },
    verify(x) { let k = 60; while (!(-x.a * k + x.b >= x.c)) k--; return k; },
  },
  'c11m-ineq-count': {
    title: 'counting whole-number solutions of a double inequality',
    make(r) {
      const a = pick(r, 2, 5), lo = pick(r, 1, 9), hi = lo + pick(r, 8, 30), b = pick(r, 0, 6);
      const L = Math.floor((lo - b) / a) + 1, H = Math.floor((hi - b) / a);
      return { a, b, lo, hi, q: `<p>How many integers x satisfy ${lo} &lt; ${a}x + ${b} ≤ ${hi}?</p>`, answer: Math.max(0, H - L + 1), unit: '', tol: 0, abs: 0.001,
        hint: `Subtract ${b} from all three parts, divide by ${a}, then count the integers in the interval (note which end is open).`,
        solution: steps(`${lo - b} < ${a}x ≤ ${hi - b}.`, `${+((lo - b) / a).toFixed(3)} < x ≤ ${+((hi - b) / a).toFixed(3)}.`, `Integers from ${L} to ${H}: <b>${Math.max(0, H - L + 1)}</b>.`) };
    },
    verify(x) { let c = 0; for (let k = -50; k <= 100; k++) if (x.lo < x.a * k + x.b && x.a * k + x.b <= x.hi) c++; return c; },
  },
  'c11m-ineq-lattice': {
    title: 'points in a region',
    make(r) {
      const p = pick(r, 1, 3), qq = pick(r, 1, 3), m = pick(r, 6, 14), answer = (() => { let c = 0; for (let x = 1; x <= m + 2; x++) for (let y = 1; y <= m + 2; y++) if (p * x + qq * y <= m + 2) c++; return c; })();
      return { p, qq, m, q: `<p>How many points (x, y) with x and y both positive whole numbers satisfy ${p === 1 ? '' : p}x + ${qq === 1 ? '' : qq}y ≤ ${m + 2}?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Fix x = 1, 2, 3, ... and count the y values that work each time, then add.',
        solution: steps(`For each x, y ≤ (${m + 2} − ${p}x) / ${qq}.`, `Count the positive whole y for x = 1, 2, 3, ... until none is left.`, `Total <b>${answer}</b> points.`) };
    },
    verify(x) { let c = 0; for (let a = 1; a <= 20; a++) { const rest = x.m + 2 - x.p * a; if (rest >= x.qq) c += Math.floor(rest / x.qq); } return c; },
  },
  'c11m-ineq-average': {
    title: 'the mark needed in the last test',
    make(r) {
      const s = [pick(r, 62, 90), pick(r, 62, 90), pick(r, 62, 90)], need = pick(r, 62, 70), answer = need * 4 - s[0] - s[1] - s[2];
      return { s, need, q: `<p>Meera scored ${s.join(', ')} in three tests. She wants an average of at least ${need} over four tests. What is the least mark she needs in the fourth test?</p>`, answer, unit: 'marks', tol: 0, abs: 0.001,
        hint: 'Write (sum of the three + x) / 4 ≥ the target and solve for x.',
        solution: steps(`(${s.join(' + ')} + x) / 4 ≥ ${need}.`, `${s[0] + s[1] + s[2]} + x ≥ ${need * 4}.`, `x ≥ <b>${answer}</b>.`) };
    },
    verify(x) { let k = 0; while ((x.s[0] + x.s[1] + x.s[2] + k) / 4 < x.need) k++; return k; },
  },
};
