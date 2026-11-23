// Class 8 Maths, Algebra Play: live problems (original fibub questions). Ids start with c8m-alg-.
import { pick, n, steps } from './_util.js';

export default {
  'c8m-alg-solve': {
    title: 'solve ax + b = c',
    make(r) {
      const a = pick(r, 2, 9), x = pick(r, 2, 15), b = pick(r, 1, 20), c = a * x + b;
      return { a, b, c, q: `<p>Solve for x: <b>${a}x + ${b} = ${c}</b>.</p>`, answer: x, unit: '', tol: 0.002, abs: 0.001,
        hint: 'Take b away from both sides, then divide both sides by the number in front of x.',
        solution: steps(`${a}x + ${b} = ${c}.`, `Subtract ${b} from both sides: ${a}x = ${c - b}.`, `Divide both sides by ${a}: x = <b>${x}</b>.`) };
    },
    verify(q) { for (let t = 0; t <= 100; t++) if (q.a * t + q.b === q.c) return t; return NaN; },
  },
  'c8m-alg-sides': {
    title: 'x on both sides',
    make(r) {
      const x = pick(r, 3, 12), p = pick(r, 5, 9), t = pick(r, 2, 4), k = pick(r, 1, 6), s = (p - t) * x - k;
      return { p, t, k, s, q: `<p>Solve for x: <b>${p}x − ${k} = ${t}x + ${s}</b>.</p>`, answer: x, unit: '', tol: 0.002, abs: 0.001,
        hint: 'Take tx from both sides so the x terms are on one side, then add the number to both sides and divide.',
        solution: steps(`Subtract ${t}x from both sides: ${p - t}x − ${k} = ${s}.`, `Add ${k} to both sides: ${p - t}x = ${s + k}.`, `Divide by ${p - t}: x = <b>${x}</b>.`) };
    },
    verify(o) { for (let v = 0; v <= 100; v++) if (o.p * v - o.k === o.t * v + o.s) return v; return NaN; },
  },
  'c8m-alg-age': {
    title: 'an equation from a story',
    make(r) {
      const x = pick(r, 6, 15), m = pick(r, 2, 4), S = (m + 1) * x;
      return { m, S, x, q: `<p>Meena’s mother is <b>${m} times</b> as old as Meena. Together their ages add up to <b>${S} years</b>. How old is Meena?</p>`, answer: x, unit: 'years', tol: 0.002,
        hint: 'Let Meena’s age be x. Her mother is m·x. Write x + m·x = total.',
        solution: steps(`Let Meena’s age be x. Mother: ${m}x.`, `x + ${m}x = ${S}, so ${m + 1}x = ${S}.`, `x = ${S} ÷ ${m + 1} = <b>${x} years</b>.`) };
    },
    verify(o) { for (let t = 1; t < 100; t++) if (t + o.m * t === o.S) return t; return NaN; },
  },
  'c8m-alg-match': {
    title: 'matchsticks for a row of triangles',
    make(r) {
      const k = pick(r, 5, 40), answer = 2 * k + 1;
      return { k, q: `<p>Triangles are made in a row from matchsticks: 1 triangle needs 3 sticks, 2 triangles need 5 sticks, 3 triangles need 7 sticks, and so on. How many sticks are needed for <b>${k}</b> triangles?</p>`, answer, unit: 'sticks', tol: 0.002,
        hint: 'Each new triangle adds 2 sticks. The rule is 2n + 1.',
        solution: steps(`The first triangle needs 3 sticks; each of the other ${k - 1} adds 2.`, `Sticks = 3 + 2 × ${k - 1}, which is the same as 2 × ${k} + 1.`, `= <b>${answer} sticks</b>.`) };
    },
    verify(o) { let s = 3; for (let i = 2; i <= o.k; i++) s += 2; return s; },
  },
  'c8m-alg-perim': {
    title: 'perimeter from an expression',
    make(r) {
      const x = pick(r, 2, 12), answer = 2 * ((3 * x + 2) + (x + 4));
      return { x, q: `<p>A rectangle has length <b>(3x + 2) cm</b> and breadth <b>(x + 4) cm</b>. Find its perimeter when <b>x = ${x}</b>.</p>`, answer, unit: 'cm', tol: 0.002,
        hint: 'Perimeter = 2 × (length + breadth). Put in the value of x.',
        solution: steps(`Length = 3 × ${x} + 2 = ${3 * x + 2} cm. Breadth = ${x} + 4 = ${x + 4} cm.`, `Perimeter = 2 × (${3 * x + 2} + ${x + 4}).`, `= <b>${answer} cm</b> (check: 8x + 12 = ${8 * x + 12}).`) };
    },
    verify(o) { return 8 * o.x + 12; },
  },
};
