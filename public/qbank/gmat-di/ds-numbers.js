// Data Sufficiency: number properties (divisibility, odd and even, remainders, size). n is a positive integer.
import { judge, explain, dsq, say, aim, DS, int, choose } from './_ds.js';
const E = ['gmat'];
const U = (N) => Array.from({ length: N }, (_, i) => i + 1);
function pool(r) {
  const a = choose(r, [2, 3, 4, 5, 6, 8, 9, 10, 12, 15]), c = int(r, 1, 9), b = int(r, 10, 90), d = choose(r, [3, 4, 5, 6, 7]), rr = int(r, 0, d - 1);
  const k = choose(r, [2, 3, 4]), m = k * choose(r, [2, 3, 4, 5]), q = choose(r, [4, 9, 8, 12, 25]);
  return [
    { t: `n is divisible by ${a}.`, f: (n) => n % a === 0, p: { a } },
    { t: `n + ${c} is odd.`, f: (n) => (n + c) % 2 === 1, p: { c } },
    { t: `n + ${c} is even.`, f: (n) => (n + c) % 2 === 0, p: { c } },
    { t: `${k}n is divisible by ${m}.`, f: (n) => (k * n) % m === 0, p: { k, m } },
    { t: `n² is divisible by ${q}.`, f: (n) => (n * n) % q === 0, p: { q } },
    { t: `n > ${b}.`, f: (n) => n > b, p: { b } },
    { t: `n < ${b}.`, f: (n) => n < b, p: { b } },
    { t: `When n is divided by ${d}, the remainder is ${rr}.`, f: (n) => n % d === rr, p: { d, rr } },
    { t: `n is a multiple of ${2 * d}.`, f: (n) => n % (2 * d) === 0, p: { d } },
  ];
}
function questions(r) {
  const a = choose(r, [2, 3, 4, 6, 8, 9, 12]), d = choose(r, [2, 3, 4, 6]), b = int(r, 20, 80);
  return [
    { t: `Is n divisible by ${a}?`, ask: (n) => n % a === 0, need: `a yes-or-no answer about whether ${a} goes into n.` },
    { t: 'Is n even?', ask: (n) => n % 2 === 0, need: 'a yes-or-no answer about whether n is even.' },
    { t: `What is the remainder when n is divided by ${d}?`, ask: (n) => n % d, need: `one single remainder after dividing by ${d}.` },
    { t: `Is n greater than ${b}?`, ask: (n) => n > b, need: `a yes-or-no answer about whether n is above ${b}.` },
  ];
}
const TIP = 'Test numbers. Pick two values that fit a statement; if they give different answers, the statement is not sufficient.';
const gen = (id, sub, pickQ) => ({ id, type: 'mcq', level: 3, exams: E, format: 'ds', sub,
      make(r) {
        const best = aim(r, 80, () => {
          const Q = pickQ(r, questions(r)), P = pool(r), i = int(r, 0, P.length - 1); let k = int(r, 0, P.length - 2); if (k >= i) k++;
          const s1 = P[i], s2 = P[k], u = U(2520), j = judge(u, Q.ask, s1.f, s2.f);
          return { Q, s1, s2, j, ok: j.v1.size && j.v2.size && j.v12.size };
        });
        const { Q, s1, s2, j } = best;
        const show = (n) => `n = ${n}`;
        return { q: dsq(`n is a positive integer. ${Q.t}`, s1.t, s2.t), options: DS.slice(), answer: j.ans, value: j.ans,
          sol: explain(j, show, say, Q.need, TIP), hint: 'Try small numbers that fit each statement.', _q: Q, _s1: s1, _s2: s2 };
      },
      check: (p) => judge(U(5040), p._q.ask, p._s1.f, p._s2.f).ans });
export default {
  topic: 'ds-numbers',
  gens: [
    gen('dsn-g01', 'number properties', (r, Q) => choose(r, Q)),
    gen('dsn-g02', 'yes-or-no questions', (r, Q) => choose(r, [Q[0], Q[1], Q[3]])),
    gen('dsn-g03', 'value questions', (r, Q) => Q[2]),
  ],
};
