// Data Sufficiency: word problems (a staff mix, an average of three numbers, a discounted price).
import { judge, explain, dsq, say, aim, DS, int, choose } from './_ds.js';
const E = ['gmat'];
const D = '&#36;';
// Scenario 1: a firm with t staff, w of them women (whole people).
const STAFF = []; for (let t = 1; t <= 250; t++) for (let w = 0; w <= t; w++) STAFF.push([t, w]);
function staff(r) {
  const t0 = choose(r, [40, 60, 80, 120, 150, 200, 240]), pc = choose(r, [25, 30, 40, 45, 60, 75].filter((p) => (t0 * p) % 100 === 0)) ?? 50, w0 = (t0 * pc) / 100, m0 = t0 - w0;
  const g = (x) => x;
  const P = [
    { t: `${pc}% of the staff are women.`, f: ([t, w]) => 100 * w === pc * t },
    { t: `The firm has ${t0} staff.`, f: ([t]) => t === t0 },
    { t: m0 > w0 ? `There are ${m0 - w0} more men than women.` : `There are ${w0 - m0} more women than men.`, f: ([t, w]) => t - 2 * w === m0 - w0 },
    { t: `There are ${w0} women.`, f: ([, w]) => w === w0 },
    { t: `The ratio of women to men is ${w0 / gcd(w0, m0)} to ${m0 / gcd(w0, m0)}.`, f: ([t, w]) => w * (m0 / gcd(w0, m0)) === (t - w) * (w0 / gcd(w0, m0)) },
  ];
  const Q = choose(r, [
    { t: 'How many men work at the firm?', ask: ([t, w]) => t - w, need: 'one number of men.' },
    { t: 'How many women work at the firm?', ask: ([, w]) => w, need: 'one number of women.' },
    { t: 'Do more men than women work at the firm?', ask: ([t, w]) => t - w > w, need: 'only whether men outnumber women; no counts needed.' },
  ]);
  return { P, Q, U: STAFF, show: ([t, w]) => `${t} staff with ${w} women`, tip: 'A percent or a ratio fixes the mix but not the size. You need one actual count as well, unless the question asks only about the mix.' };
}
function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a || 1; }
// Scenario 2: the average of three whole numbers a, b, c from 0 to 40.
const TRI = []; for (let a = 0; a <= 40; a++) for (let b = 0; b <= 40; b++) for (let c = 0; c <= 40; c++) TRI.push([a, b, c]);
function avg(r) {
  const a0 = int(r, 2, 18), b0 = int(r, 2, 18), c0 = int(r, 2, 18);
  const P = [
    { t: `a + b = ${a0 + b0}.`, f: ([a, b]) => a + b === a0 + b0 },
    { t: `c = ${c0}.`, f: ([, , c]) => c === c0 },
    { t: `a + b + c = ${a0 + b0 + c0}.`, f: ([a, b, c]) => a + b + c === a0 + b0 + c0 },
    { t: `The average of a and b is ${(a0 + b0) / 2}.`, f: ([a, b]) => a + b === a0 + b0 },
    { t: `a − c = ${a0 - c0 < 0 ? '−' + (c0 - a0) : a0 - c0}.`, f: ([a, , c]) => a - c === a0 - c0 },
    { t: `b = ${b0}.`, f: ([, b]) => b === b0 },
  ];
  const Q = choose(r, [
    { t: 'What is the average (arithmetic mean) of a, b and c?', ask: ([a, b, c]) => `an average of ${a + b + c} ÷ 3`, need: 'the total a + b + c (the average is the total divided by 3).' },
    { t: 'What is the value of c?', ask: ([, , c]) => c, need: 'one value of c.' },
  ]);
  return { P, Q, U: TRI, show: ([a, b, c]) => `a = ${a}, b = ${b}, c = ${c}`, tip: 'For an average, find the total. You rarely need each number on its own.', pre: 'a, b and c are whole numbers from 0 to 40.' };
}
// Scenario 3: a jacket with list price p dollars (multiple of 5) and a discount of d% (multiple of 5).
const JK = []; for (let p = 5; p <= 600; p += 5) for (let d = 5; d <= 80; d += 5) JK.push([p, d]);
function jacket(r) {
  const p0 = choose(r, [40, 60, 80, 100, 120, 160, 200, 240]), d0 = choose(r, [10, 20, 25, 30, 40, 50]), off = (p0 * d0) / 100, now = p0 - off;
  const P = [
    { t: `The discount was ${d0}%.`, f: ([, d]) => d === d0 },
    { t: `The discount saved ${D}${off}.`, f: ([p, d]) => p * d === 100 * off },
    { t: `After the discount, the jacket cost ${D}${now}.`, f: ([p, d]) => p * (100 - d) === 100 * now },
    { t: `The list price was more than ${D}${p0 - 5}.`, f: ([p]) => p > p0 - 5 },
  ];
  const Q = choose(r, [
    { t: 'What was the list price of the jacket?', ask: ([p]) => p, need: 'one list price.' },
    { t: 'How much did the jacket cost after the discount?', ask: ([p, d]) => p * (100 - d) / 100, need: 'one price after the discount.' },
  ]);
  return { P, Q, U: JK, show: ([p, d]) => `a list price of ${D}${p} with ${d}% off`, tip: 'A percent alone gives no amounts. A percent plus any one amount gives every amount.', pre: 'The list price is a whole number of dollars that is a multiple of 5, and the discount is a multiple of 5 percent.' };
}
const SC = [staff, avg, jacket];
function build(r, ks) {
  const k = choose(r, ks), S = SC[k](r), i = int(r, 0, S.P.length - 1); let m = int(r, 0, S.P.length - 2); if (m >= i) m++;
  return { k, S, i, m, j: judge(S.U, S.Q.ask, S.P[i].f, S.P[m].f) };
}
const gen = (id, sub, ks) => ({ id, type: 'mcq', level: 3, exams: E, format: 'ds', sub,
      make(r) {
        const b = aim(r, 20, () => build(r, ks)), { S, i, m, j } = b;
        return { q: dsq(`${S.pre ? S.pre + ' ' : ''}${S.Q.t}`, S.P[i].t, S.P[m].t), options: DS.slice(), answer: j.ans, value: j.ans,
          sol: explain(j, S.show, say, S.Q.need, S.tip), hint: 'Ask what one number would settle the question, then see whether each statement gives it.', _b: b };
      },
      check(p) { const { S, i, m } = p._b, f1 = S.P[i].f, f2 = S.P[m].f; let a1 = new Set(), a2 = new Set(), a12 = new Set();
        for (const c of S.U) { const a = String(S.Q.ask(c)); if (f1(c)) a1.add(a); if (f2(c)) a2.add(a); if (f1(c) && f2(c)) a12.add(a); }
        const o = (s) => s.size === 1; return o(a1) && o(a2) ? 3 : o(a1) ? 0 : o(a2) ? 1 : o(a12) ? 2 : 4; } });
export default {
  topic: 'ds-word',
  gens: [gen('dsw-g01', 'word problems', [0, 1, 2]), gen('dsw-g02', 'word problems: percents and ratios', [0]), gen('dsw-g03', 'word problems: averages', [1]), gen('dsw-g04', 'word problems: discounts', [2])],
};
