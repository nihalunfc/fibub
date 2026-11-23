// Class 9 Maths, Predicting What Comes Next: Exploring Sequences and Progressions: live problems (original fibub questions).
// Ids start with c9m-seq-.
import { pick, choose, n, steps } from './_util.js';
const ord = (n) => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));

const mn = (v) => String(v).replace('-', '−');
const list = (a, d, k) => Array.from({ length: k }, (_, i) => mn(a + i * d)).join(', ');
export default {
  'c9m-seq-nth': {
    title: 'nth term of an AP',
    make(r) {
      const a = pick(r, -10, 20), d = choose(r, [-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), N = pick(r, 10, 50), answer = a + (N - 1) * d;
      return { a, d, N, q: `<p>Find the <b>${ord(N)} term</b> of the arithmetic progression ${list(a, d, 4)}, ...</p>`, answer, unit: '', tol: 0, abs: 0.5,
        hint: 'The common difference is d = second term − first term. The nth term is a + (n − 1)d.',
        solution: steps(`a = ${mn(a)} and d = ${mn(d)}.`, `${ord(N)} term = a + (${N} − 1)d = ${mn(a)} + ${N - 1} × (${mn(d)}).`, `= <b>${mn(answer)}</b>.`) };
    },
    verify(x) { let t = x.a; for (let i = 1; i < x.N; i++) t += x.d; return t; },
  },
  'c9m-seq-which': {
    title: 'which term of the AP',
    make(r) {
      const a = pick(r, 2, 15), d = pick(r, 2, 9), N = pick(r, 12, 60), T = a + (N - 1) * d;
      return { a, d, T, q: `<p>Which term of the AP ${list(a, d, 4)}, ... is <b>${T}</b>?</p>`, answer: N, unit: '', tol: 0, abs: 0.5,
        hint: 'Put a + (n − 1)d equal to the number and solve for n.',
        solution: steps(`a + (n − 1)d = ${T}, so ${a} + (n − 1) × ${d} = ${T}.`, `(n − 1) × ${d} = ${T - a}, so n − 1 = ${(T - a) / d}.`, `n = <b>${N}</b>, so ${T} is the ${ord(N)} term.`) };
    },
    verify(x) { let t = x.a, k = 1; while (t < x.T) { t += x.d; k++; } return k; },
  },
  'c9m-seq-figurate': {
    title: 'figurate (dot pattern) numbers',
    make(r) {
      const kind = choose(r, ['tri', 'sq', 'obl']), N = pick(r, 6, 40), answer = kind === 'tri' ? (N * (N + 1)) / 2 : kind === 'sq' ? N * N : N * (N + 1);
      const nm = { tri: 'triangular', sq: 'square', obl: 'oblong (n by n + 1)' }[kind];
      return { kind, N, q: `<p>Dots make <b>${nm}</b> patterns: pattern 1 has ${kind === 'obl' ? 2 : 1} dot${kind === 'obl' ? 's' : ''}, and so on. How many dots are in pattern number <b>${N}</b>?</p>`, answer, unit: 'dots', tol: 0, abs: 0.5,
        hint: kind === 'tri' ? 'Pattern n has rows of 1, 2, ..., n dots: n(n + 1) ÷ 2.' : kind === 'sq' ? 'Pattern n is a square n dots by n dots.' : 'Pattern n is a rectangle of n rows with n + 1 dots.',
        solution: steps(kind === 'tri' ? `Triangular: ${N} × ${N + 1} ÷ 2.` : kind === 'sq' ? `Square: ${N} × ${N}.` : `Oblong: ${N} × ${N + 1}.`, `Number of dots = <b>${n(answer, 6)}</b>.`) };
    },
    verify(x) { let s = 0; for (let i = 1; i <= x.N; i++) s += x.kind === 'tri' ? i : x.kind === 'sq' ? 2 * i - 1 : 2 * i; return s; },
  },
  'c9m-seq-sticks': {
    title: 'matchstick pattern',
    make(r) {
      const kind = choose(r, ['tri', 'sq']), N = pick(r, 8, 60), d = kind === 'tri' ? 2 : 3, a = kind === 'tri' ? 3 : 4;
      return { kind, N, q: `<p>A row of <b>${kind === 'tri' ? 'triangles' : 'squares'}</b> is made from matchsticks, joined side by side: ${kind === 'tri' ? '1 triangle uses 3 sticks, 2 triangles use 5, 3 use 7' : '1 square uses 4 sticks, 2 squares use 7, 3 use 10'}. How many sticks are needed for <b>${N}</b> ${kind === 'tri' ? 'triangles' : 'squares'}?</p>`, answer: a + (N - 1) * d, unit: 'sticks', tol: 0, abs: 0.5,
        hint: `Each new shape adds ${d} sticks: the counts form an AP with a = ${a}, d = ${d}.`,
        solution: steps(`a = ${a}, d = ${d}.`, `Sticks = ${a} + (${N} − 1) × ${d} = ${a + (N - 1) * d}.`, `So the rule is ${d}n + ${a - d}, and for n = ${N} the answer is <b>${a + (N - 1) * d}</b>.`) };
    },
    verify(x) { return x.kind === 'tri' ? 2 * x.N + 1 : 3 * x.N + 1; },
  },
  'c9m-seq-gp': {
    title: 'a geometric (multiplying) sequence',
    make(r) {
      const a = pick(r, 1, 6), q = choose(r, [2, 3, 4]), N = pick(r, 4, 9);
      return { a, ratio: q, N, q: `<p>A sequence starts ${a}, ${a * q}, ${a * q * q}, ${a * q ** 3}, ... where each term is <b>${q} times</b> the one before. Find the <b>${ord(N)} term</b>.</p>`, answer: a * q ** (N - 1), unit: '', tol: 0, abs: 0.5,
        hint: 'Multiply by the common ratio again and again: term n is a × r^(n − 1).',
        solution: steps(`First term ${a}, ratio ${q}.`, `${ord(N)} term = ${a} × ${q}^${N - 1} = ${a} × ${q ** (N - 1)}.`, `= <b>${a * q ** (N - 1)}</b>.`) };
    },
    verify(x) { let t = x.a; for (let i = 1; i < x.N; i++) t *= x.ratio; return t; },
  },
  'c9m-seq-race': {
    title: 'adding versus doubling',
    make(r) {
      const p = pick(r, 50, 300, 50);
      let day = 1; while (2 ** (day - 1) <= p * day) day++;
      return { p, q: `<p>Plan A gives ₹${p} on day 1 and ₹${p} more each day (₹${p}, ₹${2 * p}, ₹${3 * p}, ...). Plan B gives ₹1 on day 1 and doubles every day (₹1, ₹2, ₹4, ...). On which day is Plan B first <b>more</b> than Plan A?</p>`, answer: day, unit: '', tol: 0, abs: 0.5,
        hint: 'Compare ₹p × n with ₹2^(n − 1) day by day.',
        solution: steps(`On day ${day - 1}: A = ₹${p * (day - 1)}, B = ₹${2 ** (day - 2)} (B is not ahead yet).`, `On day ${day}: A = ₹${p * day}, B = ₹${2 ** (day - 1)} (B is ahead).`, `Plan B first wins on day <b>${day}</b>.`) };
    },
    verify(x) { let k = 40; while (k > 1 && 2 ** (k - 2) > x.p * (k - 1)) k--; return k; },
  },
  'c9m-seq-sum': {
    title: 'sum of an AP (a look ahead)',
    make(r) {
      const a = pick(r, 1, 12), d = pick(r, 1, 6), N = pick(r, 8, 30), last = a + (N - 1) * d, answer = (N * (a + last)) / 2;
      return { a, d, N, q: `<p>Look ahead to Class 10: Priya puts ₹${a} in her piggy bank on day 1, and each day she adds ₹${d} more than the day before (₹${a}, ₹${a + d}, ₹${a + 2 * d}, ...). How much has she put in altogether after <b>${N} days</b>?</p>`, answer, unit: '₹', tol: 0, abs: 0.5,
        hint: 'Add the first and last day’s amount, multiply by the number of days, and halve it (pair the terms).',
        solution: steps(`Last day: ${a} + ${N - 1} × ${d} = ${last}.`, `Sum = ${N} ÷ 2 × (${a} + ${last}) = ${N / 2} × ${a + last}.`, `= <b>₹${n(answer, 6)}</b>.`) };
    },
    verify(x) { let s = 0; for (let i = 0; i < x.N; i++) s += x.a + i * x.d; return s; },
  },
};
