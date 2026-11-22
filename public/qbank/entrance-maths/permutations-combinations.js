// Permutations and combinations (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
// Every counting answer was checked by brute-force enumeration (the `calc` fields and the gens' verify() do it in code).
import { pick, int, choose, fmt, shuffleOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (id, level, sub, extra) => ({ id, level, exams: EXS[level], sub, ...extra });
const M = (id, level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (id, level, sub, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const X = (id, level, sub, q, options, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const SOPT = [
  'Both Statement I and Statement II are true',
  'Statement I is true and Statement II is false',
  'Statement I is false and Statement II is true',
  'Both Statement I and Statement II are false',
];
const A = (id, level, sub, a, r, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (id, level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
const MT = (id, level, sub, group, q, correct, wrongs, sol, trap) =>
  base(id, level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const P = (id, level, sub, group, q, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'passage', group, q, ...place(correct, wrongs), sol, trap, ...more });
const PI = (id, level, sub, group, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });

// ---------- brute-force helpers (used by calc and verify) ----------
const F = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const Cn = (n, r) => { if (r < 0 || r > n) return 0; let x = 1; for (let i = 1; i <= r; i++) x = (x * (n - r + i)) / i; return Math.round(x); };
const pascal = (n, r) => { const t = [[1]]; for (let i = 1; i <= n; i++) { t[i] = [1]; for (let j = 1; j <= i; j++) t[i][j] = (t[i - 1][j - 1] || 0) + (t[i - 1][j] || 0); } return t[n][r] || 0; };
/** number of distinct sequences of length len from the multiset `letters` satisfying pred */
function words(letters, len, pred) {
  const cnt = {}; for (const c of letters) cnt[c] = (cnt[c] || 0) + 1;
  let n = 0;
  const rec = (s) => { if (s.length === len) { if (!pred || pred(s)) n++; return; } for (const c in cnt) if (cnt[c] > 0) { cnt[c]--; rec(s + c); cnt[c]++; } };
  rec(''); return n;
}
/** all distinct permutations of a string, sorted */
function allPerms(w) { const out = new Set(); const rec = (a, b) => { if (!b.length) { out.add(a); return; } for (let i = 0; i < b.length; i++) rec(a + b[i], b.slice(0, i) + b.slice(i + 1)); }; rec('', w); return [...out].sort(); }
/** count circular arrangements of people 0..n-1 (rotations equal) satisfying pred(arr) */
function circ(n, pred) {
  let cnt = 0; const arr = [0]; const used = Array(n).fill(false); used[0] = true;
  const rec = () => { if (arr.length === n) { if (pred(arr)) cnt++; return; } for (let i = 1; i < n; i++) if (!used[i]) { used[i] = true; arr.push(i); rec(); arr.pop(); used[i] = false; } };
  rec(); return cnt;
}
const adjC = (arr, a, b) => { const n = arr.length, i = arr.indexOf(a), j = arr.indexOf(b); return (i + 1) % n === j || (j + 1) % n === i; };
/** all permutations of 0..n-1 as arrays, calling f */
function eachPerm(n, f) { const a = [...Array(n).keys()]; const rec = (k) => { if (k === n) { f(a); return; } for (let i = k; i < n; i++) { [a[k], a[i]] = [a[i], a[k]]; rec(k + 1); [a[k], a[i]] = [a[i], a[k]]; } }; rec(0); }
const derange = (n) => { let c = 0; eachPerm(n, (a) => { if (a.every((v, i) => v !== i)) c++; }); return c; };
const numSols = (k, n, min = 0, max = Infinity) => { let c = 0; const rec = (left, parts) => { if (parts === 1) { if (left >= min && left <= max) c++; return; } for (let v = min; v <= Math.min(left, max); v++) rec(left - v, parts - 1); }; rec(n, k); return c; };
const divisors = (N) => { const d = []; for (let i = 1; i <= N; i++) if (N % i === 0) d.push(i); return d; };
const combos = (arr, k) => { const out = []; const rec = (s, cur) => { if (cur.length === k) { out.push([...cur]); return; } for (let i = s; i < arr.length; i++) { cur.push(arr[i]); rec(i + 1, cur); cur.pop(); } }; rec(0, []); return out; };
const digitsCount = (digs, len, pred, rep = false) => { let c = 0; const rec = (s, used) => { if (s.length === len) { if (pred(s)) c++; return; } for (const d of digs) if (rep || !used.has(d)) { used.add(d); rec(s + d, used); used.delete(d); } }; rec('', new Set()); return c; };
const surj = (n, k) => { let c = 0; const tot = k ** n; for (let m = 0; m < tot; m++) { let x = m; const s = new Set(); for (let i = 0; i < n; i++) { s.add(x % k); x = Math.floor(x / k); } if (s.size === k) c++; } return c; };

const groups = {
  m1: {
    title: 'Match the count',
    passage: R`<p>Match each count in List I with its value in List II.</p>`,
    list1: ['A. Arrangements of the letters of BALL', 'B. Ways to choose 2 students from 6', 'C. Derangements of 4 objects', 'D. Diagonals of a regular octagon'],
    list2: ['p. 12', 'q. 15', 'r. 9', 's. 20'],
  },
  m2: {
    title: 'Lines, triangles and diagonals',
    passage: R`<p>Six points are given. Match each count in List I with its value in List II.</p>`,
    list1: ['A. Lines joining the 6 points, no three collinear', 'B. Triangles from the 6 points, no three collinear', 'C. Diagonals of a hexagon', 'D. Distinct lines if 4 of the 6 points are collinear (no other three are)'],
    list2: ['p. 9', 'q. 10', 'r. 15', 's. 20'],
  },
  m3: {
    title: 'Integer solutions',
    passage: R`<p>Match each count of solutions in List I with its value in List II. All unknowns are integers.</p>`,
    list1: ['A. $x+y+z=6$, each $\\ge0$', 'B. $x+y+z=6$, each $\\ge1$', 'C. $x+y=6$, each $\\ge0$', 'D. $x+y+z=4$, each $\\ge0$'],
    list2: ['p. 7', 'q. 10', 'r. 15', 's. 28'],
  },
  p1: {
    title: 'Passage: the word EQUATION',
    passage: R`<p>All 8 letters of the word EQUATION are different. Five of them (E, U, A, I, O) are vowels and three (Q, T, N) are consonants. All words are formed using all 8 letters, with or without meaning.</p>`,
  },
  p2: {
    title: 'Passage: a committee',
    passage: R`<p>A class has 7 boys and 5 girls. A committee of 5 students is to be chosen. Two particular students, one boy $b$ and one girl $g$, do not get along.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  M('pc-001', 1, 'counting principle', R`A shop sells 5 kinds of shirt and 4 kinds of trouser. In how many ways can one shirt and one trouser be chosen together?`, '20', ['9', '1', '54'],
    R`<p>Two choices are made one after the other, so multiply: $5\times4=20$.</p>`, 'And means multiply; or means add.', { calc: () => 5 * 4 }),
  M('pc-002', 1, 'permutations', R`In how many ways can 5 different books be arranged on a shelf?`, '120', ['25', '60', '24'],
    R`<p>This is $5!=5\times4\times3\times2\times1=120$.</p>`, 'All 5 are used, so it is 5!, not $5^2$.', { calc: () => F(5) }),
  M('pc-003', 1, 'combinations', R`The value of $\binom{8}{3}$ is`, '56', ['336', '24', '28'],
    R`<p>$\binom83=\dfrac{8\times7\times6}{3!}=\dfrac{336}{6}=56$. The number 336 is $^8P_3$ (order counted).</p>`, 'Divide $^nP_r$ by $r!$ to remove the order.', { calc: () => Cn(8, 3) }),
  M('pc-004', 1, 'permutations', R`The value of $^{7}P_{2}$ is`, '42', ['21', '49', '14'],
    R`<p>$^7P_2=7\times6=42$ (the number of ordered pairs from 7 objects). The number 21 is $\binom72$.</p>`, 'Permutation is larger than combination by $r!$.', { calc: () => 7 * 6 }),
  I('pc-005', 1, 'identical objects', R`How many different arrangements of the letters of the word MOON are there?`, 12,
    R`<p>4 letters with O repeated twice: $\dfrac{4!}{2!}=12$.</p>`, 'Divide by $2!$ for the two identical O.', { calc: () => words('MOON', 4) }),
  I('pc-006', 1, 'combinations', R`If $\binom{n}{2}=45$, find $n$.`, 10,
    R`<p>$\dfrac{n(n-1)}{2}=45\Rightarrow n^2-n-90=0\Rightarrow(n-10)(n+9)=0$. $n$ must be positive, so $n=10$.</p>`, 'Reject the negative root.', { calc: () => { for (let n = 2; n < 50; n++) if (Cn(n, 2) === 45) return n; } }),
  M('pc-007', 1, 'properties', R`If $\binom{10}{3}=\binom{10}{r}$ and $r\ne3$, then $r$ equals`, '7', ['6', '5', '10'],
    R`<p>$\binom nr=\binom n{n-r}$, so $r=10-3=7$.</p>`, 'Use the symmetry $r\\leftrightarrow n-r$.', { calc: () => 10 - 3 }),
  M('pc-008', 1, 'circular', R`In how many ways can 6 people sit around a round table?`, '120', ['720', '60', '24'],
    R`<p>Rotations of one arrangement are the same. The number is $(6-1)!=5!=120$.</p>`, 'Fix one person; arrange the other 5.', { calc: () => circ(6, () => true) }),
  M('pc-009', 1, 'numbers', R`How many 3-digit numbers can be formed from the digits 1, 2, 3, 4, 5 if no digit is repeated?`, '60', ['125', '10', '120'],
    R`<p>Hundreds: 5 ways, tens: 4, units: 3. $5\times4\times3=60$.</p>`, '125 would allow repetition.', { calc: () => digitsCount([1, 2, 3, 4, 5], 3, () => true) }),
  I('pc-010', 1, 'geometry', R`Find the number of diagonals of a hexagon.`, 9,
    R`<p>Join every pair of the 6 vertices: $\binom62=15$ segments. 6 of them are sides, so the diagonals are $15-6=9$. (Formula $\dfrac{n(n-3)}{2}=\dfrac{6\cdot3}{2}=9$.)</p>`, 'Subtract the sides.', { calc: () => Cn(6, 2) - 6 }),
  M('pc-011', 1, 'factorials', R`The value of $\dfrac{9!}{7!}$ is`, '72', ['2', '36', '81'],
    R`<p>$\dfrac{9!}{7!}=9\times8=72$. The number 36 is $\dfrac{9!}{7!\,2!}$.</p>`, 'Cancel the common factors, do not divide 9 by 7.', { calc: () => F(9) / F(7) }),
  I('pc-012', 1, 'permutations', R`If $^{n}P_{2}=30$, find $n$.`, 6,
    R`<p>$n(n-1)=30$, so $n^2-n-30=0$, $(n-6)(n+5)=0$ and $n=6$.</p>`, 'Check: $6\times5=30$.', { calc: () => { for (let n = 2; n < 50; n++) if (n * (n - 1) === 30) return n; } }),

  // ---------- L2 standard ----------
  I('pc-013', 2, 'identical objects', R`How many different arrangements are there of the letters of the word LEVEL?`, 30,
    R`<p>5 letters, with L twice and E twice. $\dfrac{5!}{2!\,2!}=\dfrac{120}{4}=30$.</p>`, 'Divide by a factorial for every repeated letter.', { calc: () => words('LEVEL', 5) }),
  I('pc-014', 2, 'numbers', R`How many 4-digit numbers can be formed from the digits 0, 1, 2, 3, 4, 5 with no digit repeated?`, 300,
    R`<p>The first digit cannot be 0: 5 ways. Then the remaining 5 digits (including 0) fill the next place in 5 ways, then 4, then 3. $5\times5\times4\times3=300$.</p>`, 'Do not start with 0.', { calc: () => digitsCount([0, 1, 2, 3, 4, 5], 4, (s) => s[0] !== '0') }),
  M('pc-015', 2, 'numbers', R`How many 3-digit even numbers can be formed from the digits 1 to 6 with no repetition?`, '60', ['90', '120', '40'],
    R`<p>Units digit first (it has the restriction): 2, 4 or 6, so 3 ways. Then the tens place has 5 ways and the hundreds place 4 ways. $3\times5\times4=60$.</p>`, 'Fill the restricted place first.', { calc: () => digitsCount([1, 2, 3, 4, 5, 6], 3, (s) => +s % 2 === 0) }),
  I('pc-016', 2, 'combinations', R`A committee has 3 men chosen from 6 men and 2 women chosen from 5 women. In how many ways can it be formed?`, 200,
    R`<p>Choices are made together, so multiply: $\binom63\binom52=20\times10=200$.</p>`, 'Add only when the cases cannot happen together.', { calc: () => Cn(6, 3) * Cn(5, 2) }),
  I('pc-017', 2, 'rank of a word', R`All permutations of the letters of the word MATH are written in dictionary order. Find the position (rank) of MATH.`, 14,
    R`<p>Alphabetical order of letters: A, H, M, T.</p><p>Words starting with A: $3!=6$. Words starting with H: $6$. So 12 words come before any word starting with M.</p><p>Now M, then the second letter: A is the smallest, so we are in the block MA. In it the words are MAHT, MATH. MATH is second.</p><p>Rank $=12+2=14$.</p>`, 'Count all words that come before, then add 1.', { calc: () => allPerms('MATH').indexOf('MATH') + 1 }),
  I('pc-018', 2, 'circular', R`In how many ways can 5 boys and 5 girls sit around a round table so that boys and girls alternate?`, 2880,
    R`<p>Seat the 5 boys first: $(5-1)!=24$ ways. This leaves 5 gaps, one between each pair of boys. The 5 girls fill them in $5!=120$ ways. Total $24\times120=2880$.</p>`, 'Circular for the first group only.', { calc: () => 24 * 120 }),
  M('pc-019', 2, 'necklace', R`How many different necklaces can be made from 6 beads of all different colours?`, '60', ['120', '720', '30'],
    R`<p>In a circle there are $(6-1)!=120$ arrangements. A necklace can be turned over, so an arrangement and its mirror image are the same: $\dfrac{120}{2}=60$.</p>`, 'A necklace (unlike people at a table) can be flipped.', { calc: () => circ(6, () => true) / 2 }),
  M('pc-020', 2, 'geometry', R`Ten points are on a plane and 4 of them are collinear (no other three are). How many triangles have these points as vertices?`, '116', ['120', '124', '112'],
    R`<p>Any 3 points make a triangle except 3 collinear ones. $\binom{10}{3}-\binom43=120-4=116$.</p>`, 'Subtract the collinear triples.', { calc: () => { const pts = [...Array(10).keys()]; return combos(pts, 3).filter((t) => !t.every((v) => v < 4)).length; } }),
  I('pc-021', 2, 'divisors', R`Find the number of positive divisors of 360.`, 24,
    R`<p>$360=2^3\times3^2\times5^1$. Number of divisors $=(3+1)(2+1)(1+1)=24$.</p>`, 'Add 1 to each exponent.', { calc: () => divisors(360).length }),
  I('pc-022', 2, 'divisors', R`Find the sum of all positive divisors of 72.`, 195,
    R`<p>$72=2^3\times3^2$. Sum $=(1+2+4+8)(1+3+9)=15\times13=195$.</p>`, 'The sum includes 1 and 72 itself.', { calc: () => divisors(72).reduce((a, b) => a + b, 0) }),
  I('pc-023', 2, 'stars and bars', R`Find the number of non-negative integer solutions of $x+y+z=10$.`, 66,
    R`<p>10 identical items into 3 boxes: $\binom{10+3-1}{3-1}=\binom{12}2=66$.</p>`, 'Non-negative means zero is allowed.', { calc: () => numSols(3, 10) }),
  I('pc-024', 2, 'stars and bars', R`Find the number of solutions of $x+y+z=10$ in positive integers.`, 36,
    R`<p>Put $x=x'+1$ etc. Then $x'+y'+z'=7$ with non-negative values: $\binom{9}{2}=36$. (Direct formula: $\binom{n-1}{k-1}=\binom92$.)</p>`, 'Use $\\binom{n-1}{k-1}$ for positive solutions.', { calc: () => numSols(3, 10, 1) }),
  M('pc-025', 2, 'geometry', R`A rectangle is made by choosing 2 of 5 horizontal lines and 2 of 5 vertical lines of a grid. The number of rectangles is`, '100', ['25', '50', '200'],
    R`<p>$\binom52\times\binom52=10\times10=100$.</p>`, 'Choose both the pair of horizontals and the pair of verticals.', { calc: () => Cn(5, 2) * Cn(5, 2) }),
  I('pc-026', 2, 'combinations', R`At a meeting everyone shakes hands once with everyone else, and there are 66 handshakes in all. How many people are there?`, 12,
    R`<p>$\binom n2=66\Rightarrow n(n-1)=132\Rightarrow n=12$ (since $12\times11=132$).</p>`, 'Each handshake is a pair, not an ordered pair.', { calc: () => { for (let n = 2; n < 60; n++) if (Cn(n, 2) === 66) return n; } }),
  M('pc-027', 2, 'derangements', R`The number of ways to put 4 letters into 4 addressed envelopes so that no letter goes into its own envelope is`, '9', ['6', '8', '12'],
    R`<p>$D_4=4!\left(1-\dfrac1{1!}+\dfrac1{2!}-\dfrac1{3!}+\dfrac1{4!}\right)=24-24+12-4+1=9$.</p>`, 'D₄ = 9 (the sequence is 0, 1, 2, 9, 44).', { calc: () => derange(4) }),
  I('pc-028', 2, 'selections', R`A basket holds 4 identical apples, 3 identical oranges and 2 identical mangoes. In how many ways can one or more fruits be selected?`, 59,
    R`<p>Apples: 0 to 4 gives 5 choices; oranges 4 choices; mangoes 3 choices. Total $5\times4\times3=60$, which includes selecting nothing. Subtract it: $59$.</p>`, 'Subtract the empty selection.', { calc: () => 5 * 4 * 3 - 1 }),
  M('pc-029', 2, 'restrictions', R`In how many ways can 5 people be arranged in a row so that two particular people A and B are always together?`, '48', ['24', '120', '96'],
    R`<p>Treat AB as one block. Then 4 units arrange in $4!=24$ ways, and A, B can swap inside the block: $24\times2=48$.</p>`, 'Do not forget the internal order of the block.', { calc: () => words('ABCDE', 5, (s) => Math.abs(s.indexOf('A') - s.indexOf('B')) === 1) }),
  I('pc-030', 2, 'identical objects', R`Find the number of arrangements of the letters of BANANA.`, 60,
    R`<p>6 letters: A three times, N twice, B once. $\dfrac{6!}{3!\,2!}=\dfrac{720}{12}=60$.</p>`, 'Divide by every repeated letter.', { calc: () => words('BANANA', 6) }),
  M('pc-031', 2, 'combinations', R`From 9 people, a team of 4 is chosen which must include one particular person. In how many ways can this be done?`, '56', ['126', '70', '84'],
    R`<p>Put the particular person in. Choose the other 3 from the remaining 8: $\binom83=56$. (126 is $\binom94$, with no condition.)</p>`, 'Fix the compulsory person first.', { calc: () => combos([...Array(9).keys()], 4).filter((t) => t.includes(0)).length }),

  // ---------- L3 exam ----------
  I('pc-032', 3, 'rank of a word', R`The letters of the word COMET are arranged in all possible ways and listed in dictionary order. Find the rank of COMET.`, 15,
    R`<p>Alphabetical order: C, E, M, O, T. COMET starts with C, the smallest, so no words with another first letter come before it.</p><p>Second letter O. Letters smaller than O still left: E and M. Words starting CE: $3!=6$; starting CM: $6$. That is 12 words.</p><p>Third letter M. Left: E, M, T. Smaller than M: E. Words COE...: $2!=2$.</p><p>Fourth letter E (smallest left), fifth T: nothing before.</p><p>Words before COMET: $12+2=14$. Rank $=14+1=15$.</p>`, 'The rank is (words before) + 1.', { calc: () => allPerms('COMET').indexOf('COMET') + 1 }),
  I('pc-033', 3, 'gaps method', R`In how many ways can 5 men and 3 women stand in a row so that no two women are next to each other?`, 14400,
    R`<p>First arrange the 5 men: $5!=120$ ways. They leave 6 gaps (4 between, 2 at the ends). Choose 3 gaps for the women and arrange the women there: $\binom63\times3!=20\times6=120$. Total $120\times120=14400$.</p>`, 'Arrange the unrestricted people first, then use the gaps.', { calc: () => { let c = 0; eachPerm(8, (a) => { let ok = true; for (let i = 0; i < 7; i++) if (a[i] < 3 && a[i + 1] < 3) { ok = false; break; } if (ok) c++; }); return c; } }),
  I('pc-034', 3, 'numbers', R`How many 4-digit numbers can be formed from the digits 1, 2, 3, 4, 5, without repetition, that are divisible by 4?`, 24,
    R`<p>A number is divisible by 4 when its last two digits are. Two-digit endings from these digits, no repeat: 12, 24, 32, 52. That is 4 endings (check 14, 34, 54, 13, ... none are multiples of 4).</p><p>The first two places take 2 of the 3 remaining digits in order: $3\times2=6$ ways. Total $4\times6=24$.</p>`, 'Test only the last two digits.', { calc: () => digitsCount([1, 2, 3, 4, 5], 4, (s) => +s % 4 === 0) }),
  I('pc-035', 3, 'stars and bars', R`14 identical sweets are shared among 4 children so that each child gets at least 2. In how many ways can this be done?`, 84,
    R`<p>Give each child 2 first: $8$ sweets used, 6 left. Share 6 sweets freely among 4 children: $\binom{6+3}{3}=\binom93=84$.</p>`, 'Remove the minimum first, then use stars and bars.', { calc: () => numSols(4, 14, 2) }),
  I('pc-036', 3, 'distribution', R`In how many ways can 6 different books be put into 3 identical boxes so that no box is empty?`, 90,
    R`<p>Boxes identical, so we count partitions of the set into 3 non-empty groups. The group sizes can be (4,1,1), (3,2,1) or (2,2,2).</p><p>(4,1,1): $\binom64=15$ ways (the two singles are identical-size groups, nothing more to divide). (3,2,1): $\binom63\binom32=60$. (2,2,2): $\dfrac{6!}{(2!)^3\,3!}=15$.</p><p>Total $15+60+15=90$.</p>`, 'Equal-size groups must be divided by the factorial of their number.', { calc: () => { let c = 0; const tot = 3 ** 6; for (let m = 0; m < tot; m++) { let x = m; const lab = []; for (let i = 0; i < 6; i++) { lab.push(x % 3); x = Math.floor(x / 3); } if (new Set(lab).size === 3) { const seen = {}; let k = 0; const canon = lab.map((l) => (seen[l] ??= k++)); if (canon.join('') === lab.join('')) c++; } } return c; } }),
  I('pc-037', 3, 'distribution', R`In how many ways can 12 different people be divided into 3 groups of 4 each (the groups are not named)?`, 5775,
    R`<p>If the groups were named: $\dfrac{12!}{4!\,4!\,4!}=34650$. The groups are alike, so divide by $3!$: $\dfrac{34650}{6}=5775$.</p>`, 'Divide by 3! because the three equal groups can be listed in any order.', { calc: () => words('AAAABBBBCCCC', 12) / 6 }),
  M('pc-038', 3, 'derangements', R`A teacher returns 5 marked papers at random to 5 students. The number of ways in which no student gets his own paper is`, '44', ['53', '36', '24'],
    R`<p>$D_5=5!\left(\dfrac1{2!}-\dfrac1{3!}+\dfrac1{4!}-\dfrac1{5!}\right)=60-20+5-1=44$. (Also $D_n=(n-1)(D_{n-1}+D_{n-2})=4(9+2)=44$.)</p>`, '53 is 44 + 9, a common slip.', { calc: () => derange(5) }),
  I('pc-039', 3, 'derangements', R`5 letters are put at random into 5 addressed envelopes, one per envelope. In how many ways do exactly 2 letters go to their correct envelopes?`, 20,
    R`<p>Choose the 2 correct ones: $\binom52=10$. The other 3 must all be wrong: $D_3=2$. Total $10\times2=20$.</p>`, 'Exactly two means the rest are a derangement.', { calc: () => { let c = 0; eachPerm(5, (a) => { if (a.filter((v, i) => v === i).length === 2) c++; }); return c; } }),
  I('pc-040', 3, 'identical objects', R`How many 4-letter words (with or without meaning) can be formed from the letters of the word BOOKS?`, 60,
    R`<p>Case 1: all four letters different, chosen from B, O, K, S: $4!=24$ words.</p><p>Case 2: two O's. The other two letters are 2 of B, K, S: $\binom32=3$ ways, and each set of four letters (with O twice) arranges in $\dfrac{4!}{2!}=12$ ways: $36$.</p><p>Total $24+36=60$.</p>`, 'A repeated letter can be used once or twice, so use cases.', { calc: () => words('BOOKS', 4) }),
  I('pc-041', 3, 'numbers', R`How many numbers greater than 3000 can be formed from the digits 0, 1, 2, 3, 4, 5 using 4 different digits?`, 180,
    R`<p>A 4-digit number above 3000 must start with 3, 4 or 5: 3 ways. Then the next three places use the other 5 digits (0 allowed): $5\times4\times3=60$. Total $3\times60=180$.</p>`, 'Any 4-digit number starting with 3 and no repetition is above 3000 (3000 itself repeats 0).', { calc: () => digitsCount([0, 1, 2, 3, 4, 5], 4, (s) => +s > 3000) }),
  I('pc-042', 3, 'restrictions', R`A team of 4 is chosen from 10 people. Two particular people, P and Q, refuse to be on the team together. In how many ways can the team be chosen?`, 182,
    R`<p>Total teams: $\binom{10}4=210$. Teams with both P and Q: choose the other 2 from 8: $\binom82=28$. Allowed: $210-28=182$.</p>`, 'Use "total minus the forbidden" for never together.', { calc: () => combos([...Array(10).keys()], 4).filter((t) => !(t.includes(0) && t.includes(1))).length }),
  I('pc-043', 3, 'identical objects', R`In how many distinct arrangements of the letters of MISSISSIPPI are no two S adjacent?`, 7350,
    R`<p>The 7 letters other than S are M, I, I, I, I, P, P: $\dfrac{7!}{4!\,2!}=105$ arrangements. They leave 8 gaps; choose 4 for the S's (identical): $\binom84=70$. Total $105\times70=7350$.</p>`, 'The four S are identical, so only choose the gaps.', { calc: () => words('MISSISSIPPI', 11, (s) => !s.includes('SS')) }),
  I('pc-044', 3, 'geometry', R`How many squares (of all sizes) are there on a chessboard of $8\times8$ small squares?`, 204,
    R`<p>Squares of side $k$: $(9-k)^2$. Sum for $k=1$ to 8: $64+49+36+25+16+9+4+1=204$.</p>`, 'Count every size, not only the 64 small ones.', { calc: () => { let c = 0; for (let k = 1; k <= 8; k++) c += (9 - k) ** 2; return c; } }),
  I('pc-045', 3, 'geometry', R`A convex polygon has 35 diagonals. Find the number of its sides.`, 10,
    R`<p>$\dfrac{n(n-3)}{2}=35\Rightarrow n^2-3n-70=0\Rightarrow(n-10)(n+7)=0$, so $n=10$.</p>`, 'Reject $n=-7$.', { calc: () => { for (let n = 3; n < 60; n++) if (Cn(n, 2) - n === 35) return n; } }),
  I('pc-046', 3, 'circular', R`5 people sit around a round table. In how many ways can they sit so that two particular people A and B are not next to each other?`, 12,
    R`<p>Total circular arrangements: $4!=24$. A and B together: treat as a block, $3!\times2=12$. Not together: $24-12=12$.</p>`, 'Use total minus together.', { calc: () => circ(5, (a) => !adjC(a, 0, 1)) }),
  I('pc-047', 3, 'stars and bars', R`Find the number of non-negative integer solutions of $x+y+z=12$ in which no variable exceeds 6.`, 28,
    R`<p>All solutions: $\binom{14}2=91$. Solutions with $x\ge7$: put $x=7+x'$, then $x'+y+z=5$: $\binom72=21$. The same for $y$ and for $z$: $3\times21=63$. Two variables $\ge7$ would need a sum of at least 14, impossible. Required $=91-63=28$.</p>`, 'Subtract the cases where a variable is too large (inclusion and exclusion).', { calc: () => numSols(3, 12, 0, 6) }),
  I('pc-048', 3, 'divisors', R`Find the number of odd positive divisors of 360.`, 6,
    R`<p>$360=2^3\times3^2\times5$. An odd divisor takes no factor 2: the power of 2 is 0 (1 choice). Number $=1\times3\times2=6$.</p>`, 'Total divisors is 24; odd ones are the 6 divisors of 45.', { calc: () => divisors(360).filter((d) => d % 2).length }),
  M('pc-049', 3, 'identical objects', R`In how many arrangements of the letters of ARRANGE are the two R's not together?`, '900', ['360', '1260', '720'],
    R`<p>ARRANGE has A twice, R twice, N, G, E: $\dfrac{7!}{2!\,2!}=1260$ arrangements. With the two R's glued as one block: 6 units with A twice: $\dfrac{6!}{2!}=360$. Not together: $1260-360=900$.</p>`, '1260 is all of them, 360 is the "together" ones.', { calc: () => words('ARRANGE', 7, (s) => !s.includes('RR')) }),
  I('pc-050', 3, 'gaps method', R`3 red, 2 blue and 2 green flags are hung in a row. Flags of the same colour look alike. In how many arrangements are the two blue flags not next to each other?`, 150,
    R`<p>First arrange the 5 non-blue flags (3 R, 2 G): $\dfrac{5!}{3!\,2!}=10$ ways. This leaves 6 gaps; choose 2 of them for the blue flags: $\binom62=15$. Total $10\times15=150$.</p>`, 'Total 210; together 60.', { calc: () => words('RRRBBGG', 7, (s) => !s.includes('BB')) }),
  M('pc-051', 3, 'geometry', R`Twelve points lie in a plane. Five of them are collinear and no other three are collinear. The number of distinct lines through at least two of the points is`, '57', ['66', '56', '61'],
    R`<p>Pairs of points: $\binom{12}2=66$. The 5 collinear points give $\binom52=10$ pairs but only one line. So the number is $66-10+1=57$.</p>`, 'Do not forget to add the single line back.', { calc: () => { const L = new Set(); const pts = [...Array(12).keys()]; for (const [a, b] of combos(pts, 2)) L.add(a < 5 && b < 5 ? 'x' : `${a}-${b}`); return L.size; } }),
  I('pc-052', 3, 'numbers', R`How many even 4-digit numbers with all digits different are there?`, 2296,
    R`<p>Case 1: units digit 0. The other three places use 3 of the remaining 9 digits: $9\times8\times7=504$.</p><p>Case 2: units digit 2, 4, 6 or 8 (4 ways). The thousands digit cannot be 0 or the units digit: 8 ways. Hundreds: 8 ways. Tens: 7 ways. $4\times8\times8\times7=1792$.</p><p>Total $504+1792=2296$.</p>`, 'Split on whether the last digit is 0, since 0 cannot lead.', { calc: () => digitsCount([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4, (s) => s[0] !== '0' && +s % 2 === 0) }),
  M('pc-053', 3, 'combinations', R`A team of 5 is chosen from 7 batsmen and 5 bowlers. The number of teams with at least 3 bowlers is`, '246', ['210', '792', '252'],
    R`<p>Exactly 3 bowlers: $\binom53\binom72=10\times21=210$. Exactly 4: $\binom54\binom71=35$. Exactly 5: $\binom55=1$. Total $210+35+1=246$.</p>`, '210 counts only the "exactly 3" case.', { calc: () => combos([...Array(12).keys()], 5).filter((t) => t.filter((v) => v >= 7).length >= 3).length }),

  // ---------- L4 hard ----------
  I('pc-054', 4, 'divisors', R`Find the number of positive divisors of $10!$.`, 270,
    R`<p>$10!=2^8\times3^4\times5^2\times7$. (Powers of 2 in 10!: $5+2+1=8$; of 3: $3+1=4$; of 5: 2; of 7: 1.) Divisors: $9\times5\times3\times2=270$.</p>`, 'Find the prime factorisation by counting multiples, not by multiplying 10! out.', { calc: () => divisors(3628800).length }),
  I('pc-055', 4, 'divisors', R`How many divisors of $10!$ are multiples of 15?`, 144,
    R`<p>$10!=2^8\cdot3^4\cdot5^2\cdot7$. A multiple of 15 must have $3^a$ with $a\ge1$ and $5^b$ with $b\ge1$. Choices: 2: $9$; 3: $a=1..4$, so 4; 5: $b=1,2$, so 2; 7: 2. Total $9\times4\times2\times2=144$.</p>`, 'Start the allowed exponent range at 1 for 3 and 5.', { calc: () => divisors(3628800).filter((d) => d % 15 === 0).length }),
  I('pc-056', 4, 'divisors', R`How many divisors of $10!$ are perfect squares?`, 30,
    R`<p>A divisor is a perfect square when every exponent is even. For $2^8$: exponents 0, 2, 4, 6, 8 (5 choices); for $3^4$: 0, 2, 4 (3); for $5^2$: 0, 2 (2); for $7^1$: only 0 (1). Total $5\times3\times2\times1=30$.</p>`, 'The prime 7 appears only to the first power.', { calc: () => divisors(3628800).filter((d) => Number.isInteger(Math.sqrt(d))).length }),
  I('pc-057', 4, 'divisors', R`Find the number of ordered pairs $(a,b)$ of positive integers whose lcm is $2^3\cdot3^2$.`, 35,
    R`<p>Treat each prime separately. For $2$: exponents $(x,y)$ with $\max(x,y)=3$: $2\times3+1=7$ pairs. For $3$: $\max=2$: $2\times2+1=5$ pairs. Total $7\times5=35$.</p>`, 'For $\\max=k$ there are $2k+1$ pairs.', { calc: () => { let c = 0; const D = divisors(72); for (const a of D) for (const b of D) { let l = a; while (l % b) l += a; if (l === 72) c++; } return c; } }),
  I('pc-058', 4, 'distribution', R`Find the number of onto (surjective) functions from a set of 6 elements to a set of 3 elements.`, 540,
    R`<p>All functions: $3^6=729$. Subtract those missing at least one value: $\binom31\,2^6-\binom32\,1^6+\binom33\cdot0=192-3=189$ (inclusion and exclusion). Onto: $729-189=540$.</p>`, 'Use inclusion and exclusion on the missed values.', { calc: () => surj(6, 3) }),
  I('pc-059', 4, 'selections', R`Find the number of ways of choosing 3 different numbers from $1,2,\dots,20$ that are in arithmetic progression.`, 90,
    R`<p>If the common difference is $d$ (taking the middle number at the centre), the first term $a$ can be $1$ to $20-2d$. So for $d=1,2,\dots,9$ there are $18,16,\dots,2$ choices. Sum $=2(9+8+\dots+1)=90$.</p>`, 'Count each set once: use $d>0$ only.', { calc: () => { let c = 0; for (const [a, b, d] of combos([...Array(20).keys()].map((x) => x + 1), 3)) if (b - a === d - b) c++; return c; } }),
  I('pc-060', 4, 'selections', R`In how many ways can 3 different numbers be chosen from $1,2,\dots,30$ so that their sum is divisible by 3?`, 1360,
    R`<p>Among 1..30 there are 10 numbers each with remainders 0, 1 and 2 on division by 3. The sum is divisible by 3 if the remainders are all equal (0,0,0 or 1,1,1 or 2,2,2) or all different (0,1,2).</p><p>All equal: $3\times\binom{10}3=360$. All different: $10^3=1000$. Total $1360$.</p>`, 'Group the numbers by remainder.', { calc: () => combos([...Array(30).keys()].map((x) => x + 1), 3).filter((t) => (t[0] + t[1] + t[2]) % 3 === 0).length }),
  I('pc-061', 4, 'geometry', R`In how many ways can 3 rooks be placed on a $5\times5$ chessboard so that no two attack each other (no two in the same row or column)?`, 600,
    R`<p>Choose the 3 rows: $\binom53=10$. Choose the 3 columns: $10$. Match rows to columns one to one: $3!=6$ ways. Total $10\times10\times6=600$.</p>`, 'Remember to pair the rows with the columns.', { calc: () => { let c = 0; const cells = []; for (let r = 0; r < 5; r++) for (let k = 0; k < 5; k++) cells.push([r, k]); for (const t of combos(cells, 3)) if (new Set(t.map((x) => x[0])).size === 3 && new Set(t.map((x) => x[1])).size === 3) c++; return c; } }),
  I('pc-062', 4, 'geometry', R`The vertices of a regular 12-sided polygon are used to form triangles. How many of these triangles have no side in common with the polygon?`, 112,
    R`<p>Total triangles: $\binom{12}3=220$. Triangles with exactly 2 sides common: $12$ (three consecutive vertices). Triangles with exactly 1 side common: $12\times(12-4)=96$ (choose a side, then a third vertex not adjacent to either end). So the triangles with no common side: $220-12-96=112$. (Formula $\dfrac{n(n-4)(n-5)}6=\dfrac{12\times8\times7}6=112$.)</p>`, 'The third vertex for a side must avoid the two neighbours of that side.', { calc: () => combos([...Array(12).keys()], 3).filter((t) => { const d = (a, b) => Math.min((b - a + 12) % 12, (a - b + 12) % 12); return d(t[0], t[1]) > 1 && d(t[1], t[2]) > 1 && d(t[0], t[2]) > 1; }).length }),
  I('pc-063', 4, 'lattice paths', R`A path from $(0,0)$ to $(6,4)$ moves one unit right or one unit up at each step. How many such paths pass through $(3,2)$?`, 100,
    R`<p>From $(0,0)$ to $(3,2)$: 5 steps with 3 rights: $\binom53=10$. From $(3,2)$ to $(6,4)$: 5 steps with 3 rights: $\binom53=10$. Together $10\times10=100$.</p>`, 'Multiply the paths of the two halves.', { calc: () => { const w = (a, b) => (a < 0 || b < 0 ? 0 : a === 0 || b === 0 ? 1 : w(a - 1, b) + w(a, b - 1)); return w(3, 2) * w(3, 2); } }),
  I('pc-064', 4, 'stars and bars', R`How many 5-digit numbers (leading digit non-zero) have digit sum 5?`, 70,
    R`<p>Write the digits as $d_1,\dots,d_5$ with $d_1\ge1$. Put $d_1=e_1+1$. Then $e_1+d_2+\dots+d_5=4$ with all non-negative (each is at most 4, so no digit exceeds 9). Number $=\binom{4+4}{4}=\binom84=70$.</p>`, 'The leading-digit condition lowers the sum to 4.', { calc: () => { let c = 0; for (let n = 10000; n < 100000; n++) if (String(n).split('').reduce((a, b) => a + +b, 0) === 5) c++; return c; } }),

  // ---------- L5 top rank ----------
  I('pc-065', 5, 'selections', R`In how many ways can 3 numbers be chosen from $1,2,\dots,20$ so that no two of them are consecutive integers?`, 816,
    R`<p>Pick 3 numbers $a<b<c$ with $b\ge a+2$, $c\ge b+2$. Put $a'=a$, $b'=b-1$, $c'=c-2$. Then $a'<b'<c'$ are any 3 distinct numbers from $1..18$. Number $=\binom{18}3=816$.</p>`, 'Shift the numbers down to remove the gap condition.', { calc: () => combos([...Array(20).keys()].map((x) => x + 1), 3).filter((t) => t[1] - t[0] > 1 && t[2] - t[1] > 1).length }),
  I('pc-066', 5, 'inclusion exclusion', R`How many 5-digit numbers can be formed using only the digits 1, 2, 3 (repetition allowed) so that each of the digits 1, 2, 3 appears at least once?`, 150,
    R`<p>All strings: $3^5=243$. Those missing at least one digit: $3\cdot2^5-3\cdot1^5+0=96-3=93$. Required: $243-93=150$.</p><p>(Check by type: pattern 3,1,1: $\dfrac{5!}{3!}\times3=60$; pattern 2,2,1: $\dfrac{5!}{2!2!}\times3=90$; total 150.)</p>`, 'Two methods agree: use whichever you trust.', { calc: () => digitsCount([1, 2, 3], 5, (s) => new Set(s).size === 3, true) }),
  I('pc-067', 5, 'derangements', R`Find the number of permutations of $\{1,2,3,4,5,6\}$ that have exactly 2 fixed points (numbers staying in their own place).`, 135,
    R`<p>Choose the 2 fixed points: $\binom62=15$. The other 4 must be a derangement: $D_4=9$. Total $15\times9=135$.</p>`, 'The remaining four must have no fixed point.', { calc: () => { let c = 0; eachPerm(6, (a) => { if (a.filter((v, i) => v === i).length === 2) c++; }); return c; } }),
  I('pc-068', 5, 'geometry', R`How many rectangles that are not squares are there on a chessboard of $8\times8$ small squares?`, 1092,
    R`<p>All rectangles: $\binom92\binom92=36\times36=1296$. Squares: $204$. Non-square rectangles: $1296-204=1092$.</p>`, 'A square is a rectangle, so subtract the squares.', { calc: () => { let r = 0, s = 0; for (let a = 0; a <= 8; a++) for (let b = a + 1; b <= 8; b++) for (let c = 0; c <= 8; c++) for (let d = c + 1; d <= 8; d++) { r++; if (b - a === d - c) s++; } return r - s; } }),
  I('pc-069', 5, 'divisors', R`Find the number of ordered triples $(x,y,z)$ of positive integers with $xyz=360$.`, 180,
    R`<p>$360=2^3\cdot3^2\cdot5$. Share the exponent of each prime among $x,y,z$: for $2^3$: $\binom{3+2}{2}=10$; for $3^2$: $\binom{4}{2}=6$; for $5^1$: $\binom32=3$. Total $10\times6\times3=180$.</p>`, 'Each prime is shared independently with stars and bars.', { calc: () => { let c = 0; for (const x of divisors(360)) for (const y of divisors(360)) if (360 % (x * y) === 0) c++; return c; } }),
  I('pc-070', 5, 'circular', R`8 people sit around a round table. In how many ways can they sit so that C and D are next to each other but A and B are not?`, 960,
    R`<p>C and D adjacent: treat CD as a block, 7 units around a table: $6!\times2=1440$. Of these, A and B are also adjacent in: two blocks (AB and CD) and 4 others, 6 units: $5!\times2\times2=480$. Required $1440-480=960$.</p>`, 'Count "C, D together" and subtract "A, B also together".', { calc: () => circ(8, (a) => adjC(a, 2, 3) && !adjC(a, 0, 1)) }),

  // ---------- Assertion-Reason ----------
  A('pc-071', 2, 'circular', R`The number of ways of arranging $n$ different objects around a circle is $(n-1)!$.`, R`In a circular arrangement there is no fixed first place, so $n$ rotations of one arrangement look the same.`, 0,
    R`<p>Both are true. The $n!$ line-up orders fall into groups of $n$ rotations, each group being one circular arrangement, so the count is $n!/n=(n-1)!$. R explains A.</p>`, 'Rotations give the same circle.'),
  A('pc-072', 3, 'permutations', R`The number of ways of arranging 5 people in a row is 120.`, R`The number of ways of seating 5 people around a round table is 24.`, 1,
    R`<p>A: $5!=120$ is true. R: $(5-1)!=24$ is true. But R is about a different arrangement (a circle) and says nothing about why a row gives 120. Both true, R is not the explanation.</p>`, 'Check whether R is about the same situation as A.'),
  A('pc-073', 3, 'derangements', R`The number of derangements of 3 objects is 2.`, R`The number of derangements of $n$ objects is $n!-1$ (every permutation except the identity).`, 2,
    R`<p>A is true: the derangements of (1,2,3) are (2,3,1) and (3,1,2). R is false: for $n=3$, $n!-1=5$, not 2 (only the identity is removed in R, but many other permutations also fix a point). So A true, R false.</p>`, 'Permutations with some fixed point are more than just the identity.'),
  A('pc-074', 3, 'selections', R`The number of ways of selecting 3 objects from 5 identical objects is 10.`, R`When the objects are identical, only the number of objects selected matters, not which ones.`, 3,
    R`<p>A is false: with identical objects, "3 objects" can be chosen in exactly 1 way ($\binom53=10$ applies to different objects). R is true. So A false, R true.</p>`, 'Identical objects: selecting 3 is one way.'),
  A('pc-075', 3, 'stars and bars', R`The number of positive integer solutions of $x+y+z=6$ is 10.`, R`The number of non-negative integer solutions of $x+y+z=6$ is $\binom62$.`, 2,
    R`<p>A is true: $\binom52=10$. R is false: non-negative solutions number $\binom{6+2}{2}=\binom82=28$, not $\binom62=15$. So A true, R false.</p>`, 'Non-negative: add $k-1$ to $n$.'),
  A('pc-076', 4, 'divisors', R`The number of divisors of $2^5\cdot3^4$ that are perfect squares is 12.`, R`A divisor of a number is a perfect square exactly when every prime in it has an even exponent.`, 3,
    R`<p>R is true. For $2^5$ the even exponents 0, 2, 4 (3 choices); for $3^4$: 0, 2, 4 (3 choices). The count is $3\times3=9$, not 12. A is false, R is true.</p>`, 'The exponent 5 only allows 0, 2, 4.'),
  A('pc-077', 2, 'combinations', R`$\binom{n}{r}=\binom{n}{n-r}$.`, R`Choosing $r$ objects to take is the same as choosing the $n-r$ objects to leave behind.`, 0,
    R`<p>Both true, and R is exactly the reason: each selection of $r$ corresponds to one selection of the $n-r$ left out.</p>`, 'Count by what you leave.'),

  // ---------- Statements ----------
  S('pc-078', 2, 'properties', R`$\binom73=\binom74$.`, R`$^{7}P_{3}=^{7}P_{4}$.`, 1,
    R`<p>I is true by symmetry, $\binom73=\binom7{7-3}=35$. II is false: $^7P_3=210$ and $^7P_4=840$. Permutations have no symmetry like this.</p>`, 'Symmetry holds for combinations only.'),
  S('pc-079', 3, 'identical objects', R`The letters of AAAB can be arranged in 4 ways.`, R`The letters of AABB can be arranged in 6 ways.`, 0,
    R`<p>I: $\dfrac{4!}{3!}=4$. II: $\dfrac{4!}{2!2!}=6$. Both true.</p>`, 'Divide by the factorial of each repeated letter.'),
  S('pc-080', 3, 'circular', R`4 people can sit around a round table in $4!=24$ ways.`, R`4 different beads can make $\dfrac{3!}{2}=3$ different necklaces.`, 2,
    R`<p>I is false: round-table seating is $(4-1)!=6$. II is true: $(4-1)!/2=3$.</p>`, 'Round table is $(n-1)!$.'),
  S('pc-081', 3, 'geometry', R`A pentagon has 10 diagonals.`, R`The number of diagonals of an $n$-sided polygon is $\binom n2$.`, 3,
    R`<p>I is false: $5\cdot2/2=5$ (10 is the number of joining segments, sides included). II is false: it is $\binom n2-n$. Both false.</p>`, 'Sides are not diagonals.'),
  S('pc-082', 4, 'divisors', R`The number of divisors of 72 is 12.`, R`The sum of the divisors of 72 is 180.`, 1,
    R`<p>$72=2^3\cdot3^2$. I: $4\times3=12$, true. II: $(1+2+4+8)(1+3+9)=15\times13=195$, so 180 is false.</p>`, 'Multiply the two geometric sums.'),
  S('pc-083', 4, 'properties', R`The largest value of $\binom{20}{r}$ occurs at $r=10$, and $\binom{20}{9}=\binom{20}{11}$.`, R`$0!=0$, which is why $\binom{n}{0}=\dfrac{n!}{0!\,n!}$ would be meaningless.`, 1,
    R`<p>I is true: the coefficients rise to the middle term and are symmetric. II is false: $0!=1$ by definition, which gives $\binom n0=1$.</p>`, 'The empty product is 1, not 0.'),
  S('pc-099', 4, 'mixed counts', R`How many of these are correct: (a) $D_4=9$; (b) $0!=0$; (c) $^nP_n=^nP_{n-1}$; (d) $\binom{20}{r}$ is largest at $r=10$? The answer is 3.`, R`$^nP_{n-1}=\dfrac{n!}{1!}=n!$ and $^nP_n=\dfrac{n!}{0!}=n!$.`, 0,
    R`<p>(a) true. (b) false, $0!=1$. (c) true. (d) true. Exactly 3 are correct, so I is true. II is true and it is the reason (c) holds.</p>`, 'Check each statement separately.'),

  // ---------- Multi ----------
  X('pc-084', 3, 'combinations', R`Which of the following equal 120?`, ['$5!$', '$\\binom{10}{3}$', '$^{10}P_3$', '$\\binom{10}{7}$'], [0, 1, 3],
    R`<p>$5!=120$ ✓. $\binom{10}3=\dfrac{720}{6}=120$ ✓. $^{10}P_3=720$ ✗. $\binom{10}7=\binom{10}3=120$ ✓.</p>`, '$^{10}P_3=3!\\times\\binom{10}3=720$.'),
  X('pc-085', 4, 'restrictions', R`Using all the letters of MATHS (5 different letters), which of the following are correct?`, ['Total arrangements: 120', 'Arrangements with S and T adjacent: 48', 'Arrangements with A first and S last: 6', 'Arrangements with M before T: 120'], [0, 1, 2],
    R`<p>Total $5!=120$ ✓. S, T together: $4!\times2=48$ ✓. A first and S last: the other 3 in the middle: $3!=6$ ✓. M before T: half of all, so $60$, not 120 ✗.</p>`, 'Before/after conditions halve the count.'),
  X('pc-086', 4, 'stars and bars', R`Let $x,y,z$ be integers with $x+y+z=10$. Which of the following are correct?`, ['The number of solutions with $x,y,z\\ge0$ is 66', 'The number of solutions with $x,y,z\\ge1$ is 45', 'The number of solutions with $x\\ge2$ and $y,z\\ge0$ is 45', 'The number of solutions with $x,y,z\\ge0$ and $x=y$ is 6'], [0, 2, 3],
    R`<p>(A) $\binom{12}2=66$ ✓. (B) positive: $\binom92=36$, so 45 ✗. (C) $x=2+x'$: $x'+y+z=8$, $\binom{10}2=45$ ✓. (D) $x=y=a$, $z=10-2a\ge0$: $a=0,1,\dots,5$: 6 ✓.</p>`, 'Positive solutions use $\\binom{n-1}{k-1}$.', { calc: () => numSols(3, 10) }),
  X('pc-087', 4, 'geometry', R`For a regular octagon (8 vertices), which are correct?`, ['The number of diagonals is 28', 'The number of triangles with the vertices at its corners is 56', 'The number of such triangles with no side common with the octagon is 16', 'The number of such triangles with exactly one side common is 32'], [1, 2, 3],
    R`<p>(A) $\binom82-8=20$, so 28 is wrong ✗. (B) $\binom83=56$ ✓. (C) $\dfrac{n(n-4)(n-5)}6=\dfrac{8\cdot4\cdot3}6=16$ ✓. (D) $n(n-4)=32$ ✓. Check: $16+32+8=56$ (the 8 triangles with two sides).</p>`, '28 counts all pairs, sides included.', { calc: () => combos([...Array(8).keys()], 3).filter((t) => { const d = (a, b) => Math.min((b - a + 8) % 8, (a - b + 8) % 8); return d(t[0], t[1]) > 1 && d(t[1], t[2]) > 1 && d(t[0], t[2]) > 1; }).length }),
  X('pc-088', 5, 'derangements', R`Consider the permutations of 5 objects. Which of the following are correct?`, ['The number with no fixed point is 44', 'The number with exactly one fixed point is 45', 'The number with at least one fixed point is 76', 'The number with exactly four fixed points is 5'], [0, 1, 2],
    R`<p>$D_5=44$ ✓. Exactly one: $5\times D_4=45$ ✓. At least one: $120-44=76$ ✓. Exactly four fixed points is impossible: the fifth object must also be in place. So the count is 0, not 5 ✗.</p>`, 'Four fixed points force the fifth.', { calc: () => { let c = 0; eachPerm(5, (a) => { if (a.filter((v, i) => v === i).length === 4) c++; }); return c; } }),
  X('pc-089', 3, 'numbers', R`Four-digit strings are made from the digits 1, 2, 3, 4 with repetition allowed. Which are correct?`, ['The total number is 256', 'The number with all four digits different is 12', 'The number of even strings is 128', 'The number of strings with all digits different is 24'], [0, 2, 3],
    R`<p>$4^4=256$ ✓. All different: $4!=24$, so 12 is wrong ✗ and 24 is right ✓. Even: last digit 2 or 4: $2\times4^3=128$ ✓.</p>`, 'Repetition allowed: $4^4$.', { calc: () => digitsCount([1, 2, 3, 4], 4, (s) => +s % 2 === 0, true) }),

  // ---------- Match ----------
  MT('pc-090', 2, 'mixed counts', 'm1', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-s, D-r', 'A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p'],
    R`<p>A: BALL has L twice: $\dfrac{4!}{2!}=12$ (p). B: $\binom62=15$ (q). C: $D_4=9$ (r). D: $\dfrac{8\cdot5}2=20$ (s).</p>`, 'Compute each separately.'),
  MT('pc-091', 3, 'geometry', 'm2', R`Match List I with List II.`, 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-q, C-r, D-s'],
    R`<p>A: $\binom62=15$ (r). B: $\binom63=20$ (s). C: $15-6=9$ (p). D: $15-\binom42+1=10$ (q).</p>`, 'The four collinear points give one line, not six.'),
  MT('pc-092', 4, 'stars and bars', 'm3', R`Match List I with List II.`, 'A-s, B-q, C-p, D-r', ['A-q, B-s, C-r, D-p', 'A-s, B-r, C-p, D-q', 'A-r, B-p, C-s, D-q'],
    R`<p>A: $\binom82=28$ (s). B: $\binom52=10$ (q). C: $x+y=6$: $x=0..6$, 7 solutions (p). D: $\binom62=15$ (r).</p>`, 'Non-negative: $\\binom{n+k-1}{k-1}$.'),

  // ---------- Passages ----------
  PI('pc-093', 3, 'restrictions', 'p1', R`In how many words are the 5 vowels together?`, 2880,
    R`<p>Treat the 5 vowels as one block: with the 3 consonants that is 4 units, $4!=24$ ways. The vowels arrange inside: $5!=120$. Total $24\times120=2880$.</p>`, 'Block times inside order.', { calc: () => 24 * 120 }),
  PI('pc-094', 4, 'gaps method', 'p1', R`In how many words are no two consonants adjacent?`, 14400,
    R`<p>Arrange the 5 vowels: $5!=120$. They leave 6 gaps; choose 3 for the consonants in order: $^6P_3=120$. Total $120\times120=14400$.</p>`, 'Gaps method.', { calc: () => { let c = 0; eachPerm(8, (a) => { let ok = true; for (let i = 0; i < 7; i++) if (a[i] < 3 && a[i + 1] < 3) { ok = false; break; } if (ok) c++; }); return c; } }),
  P('pc-095', 4, 'restrictions', 'p1', R`In how many words are the first and last letters both consonants?`, '4320', ['720', '2880', '5040'],
    R`<p>Fill the first and last places with consonants: $^3P_2=6$ ways. The 6 remaining letters fill the middle: $6!=720$. Total $6\times720=4320$.</p>`, 'Fill the restricted places first.', { calc: () => { let c = 0; eachPerm(8, (a) => { if (a[0] < 3 && a[7] < 3) c++; }); return c; } }),
  PI('pc-096', 4, 'combinations', 'p2', R`In how many ways can the committee have at least 2 girls?`, 596,
    R`<p>Total $\binom{12}5=792$. No girl: $\binom75=21$. Exactly one girl: $5\times\binom74=175$. At least 2 girls: $792-21-175=596$.</p>`, 'Use the complement.', { calc: () => combos([...Array(12).keys()], 5).filter((t) => t.filter((v) => v >= 7).length >= 2).length }),
  P('pc-097', 4, 'restrictions', 'p2', R`In how many ways can the committee be chosen if $b$ and $g$ must not both be on it?`, '672', ['792', '120', '912'],
    R`<p>Total 792. Committees containing both $b$ and $g$: choose the other 3 from 10: $\binom{10}3=120$. Allowed: $792-120=672$.</p>`, 'Total minus both together.', { calc: () => combos([...Array(12).keys()], 5).filter((t) => !(t.includes(0) && t.includes(7))).length }),
  PI('pc-098', 5, 'combinations', 'p2', R`A committee of 5 is chosen and one of its members, who must be a girl, is named chairperson. How many (committee, chairperson) outcomes are there?`, 1650,
    R`<p>Pick the chairperson: 5 girls. The other 4 members come from the remaining 11 students: $\binom{11}4=330$. Total $5\times330=1650$.</p><p>(This counts each committee once for every girl in it; here the chair is part of the structure: committee plus chairperson.)</p>`, 'The chair is chosen first.', { calc: () => 5 * Cn(11, 4) }),
];

// ---------- number templates ----------
const gens = [
  {
    id: 'pc-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'permutations',
    make(rng) {
      const n = int(rng, 5, 9), r = int(rng, 2, 4);
      let answer = 1; for (let i = 0; i < r; i++) answer *= n - i;
      return { n, r, answer, tol: 0,
        q: `A club has ${n} members and ${r} different posts are to be filled, one person per post. In how many ways can this be done?`,
        sol: R`<p>The posts are different, so order matters: $^{${n}}P_{${r}}=${Array.from({ length: r }, (_, i) => n - i).join('\\times')}=${answer}$.</p>` };
    },
    verify(p) { let c = 0; const rec = (d, used) => { if (d === p.r) { c++; return; } for (let i = 0; i < p.n; i++) if (!used.has(i)) { used.add(i); rec(d + 1, used); used.delete(i); } }; rec(0, new Set()); return c; },
  },
  {
    id: 'pc-g02', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'combinations',
    make(rng) {
      const m = int(rng, 4, 8), w = int(rng, 3, 7), a = int(rng, 2, 3), b = int(rng, 2, 3);
      const answer = Cn(m, a) * Cn(w, b);
      return { m, w, a, b, answer, tol: 0,
        q: `A group has ${m} men and ${w} women. A team of ${a} men and ${b} women is to be chosen. How many different teams are possible?`,
        sol: R`<p>Choose the men and the women independently and multiply: $\binom{${m}}{${a}}\binom{${w}}{${b}}=${Cn(m, a)}\times${Cn(w, b)}=${answer}$.</p>` };
    },
    verify(p) { return pascal(p.m, p.a) * pascal(p.w, p.b); },
  },
  {
    id: 'pc-g03', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'identical objects',
    make(rng) {
      const w = choose(rng, ['LEVEL', 'BANANA', 'PEPPER', 'LETTER', 'ALASKA', 'BALLOON', 'CARRIER', 'TOMATO', 'GARAGE']);
      const cnt = {}; for (const c of w) cnt[c] = (cnt[c] || 0) + 1;
      const reps = Object.values(cnt).filter((v) => v > 1);
      const answer = F(w.length) / reps.reduce((a, v) => a * F(v), 1);
      const den = reps.map((v) => `${v}!`).join('\\,');
      return { w, answer, tol: 0,
        q: `How many different arrangements are there of the letters of the word ${w}?`,
        sol: R`<p>${w.length} letters. Repeated letters: ${Object.entries(cnt).filter(([, v]) => v > 1).map(([k, v]) => `${k} (${v} times)`).join(', ')}. Number $=\dfrac{${w.length}!}{${den}}=${answer}$.</p>` };
    },
    verify(p) { return words(p.w, p.w.length); },
  },
  {
    id: 'pc-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'circular',
    make(rng) {
      const n = int(rng, 5, 8);
      const answer = 2 * F(n - 2);
      return { n, answer, tol: 0,
        q: `${n} people sit around a round table. In how many ways can they sit so that two particular people are next to each other?`,
        sol: R`<p>Treat the two as one block. Then ${n - 1} units sit in a circle: $(${n - 1}-1)!=${F(n - 2)}$. The two can swap places inside the block: $\times2$. Answer $=${answer}$.</p>` };
    },
    verify(p) { return circ(p.n, (a) => adjC(a, 0, 1)); },
  },
  {
    id: 'pc-g05', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'stars and bars',
    make(rng) {
      const k = int(rng, 3, 5), n = int(rng, 6, 12);
      const answer = Cn(n + k - 1, k - 1);
      return { k, n, answer, tol: 0,
        q: `Find the number of non-negative integer solutions of $x_1+x_2+\\cdots+x_{${k}}=${n}$.`,
        sol: R`<p>${n} identical items into ${k} boxes: $\binom{${n}+${k}-1}{${k}-1}=\binom{${n + k - 1}}{${k - 1}}=${answer}$.</p>` };
    },
    verify(p) { return numSols(p.k, p.n); },
  },
  {
    id: 'pc-g06', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'stars and bars',
    make(rng) {
      const k = int(rng, 3, 5), min = int(rng, 1, 3), extra = int(rng, 2, 7);
      const n = k * min + extra;
      const answer = Cn(extra + k - 1, k - 1);
      return { k, n, min, answer, tol: 0,
        q: `Find the number of integer solutions of $x_1+\\cdots+x_{${k}}=${n}$ with every $x_i\\ge${min}$.`,
        sol: R`<p>Put $x_i=${min}+y_i$ with $y_i\ge0$. Then $\sum y_i=${n}-${k}\times${min}=${extra}$, which has $\binom{${extra}+${k - 1}}{${k - 1}}=${answer}$ solutions.</p>` };
    },
    verify(p) { return numSols(p.k, p.n, p.min); },
  },
  {
    id: 'pc-g07', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'divisors',
    make(rng) {
      const a = int(rng, 1, 4), b = int(rng, 1, 3), c = int(rng, 1, 2);
      const N = 2 ** a * 3 ** b * 5 ** c;
      const answer = (a + 1) * (b + 1) * (c + 1);
      return { N, answer, tol: 0,
        q: `Find the number of positive divisors of ${N}.`,
        sol: R`<p>${N}$=2^{${a}}\times3^{${b}}\times5^{${c}}$. Divisors: $(${a}+1)(${b}+1)(${c}+1)=${answer}$.</p>` };
    },
    verify(p) { return divisors(p.N).length; },
  },
  {
    id: 'pc-g08', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'divisors',
    make(rng) {
      const a = int(rng, 1, 4), b = int(rng, 1, 3), c = int(rng, 0, 1);
      const N = 2 ** a * 3 ** b * 5 ** c;
      const s = (p, e) => (p ** (e + 1) - 1) / (p - 1);
      const answer = s(2, a) * s(3, b) * s(5, c);
      return { N, answer, tol: 0,
        q: `Find the sum of all positive divisors of ${N}.`,
        sol: R`<p>${N}$=2^{${a}}\cdot3^{${b}}${c ? '\\cdot5' : ''}$. Sum $=(1+2+\dots+2^{${a}})(1+3+\dots+3^{${b}})${c ? '(1+5)' : ''}=${s(2, a)}\times${s(3, b)}${c ? '\\times6' : ''}=${answer}$.</p>` };
    },
    verify(p) { return divisors(p.N).reduce((x, y) => x + y, 0); },
  },
  {
    id: 'pc-g09', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'geometry',
    make(rng) {
      const n = int(rng, 8, 14), m = int(rng, 4, 6);
      const answer = Cn(n, 3) - Cn(m, 3);
      return { n, m, answer, tol: 0,
        q: `${n} points lie in a plane. ${m} of them are collinear and no other three are collinear. How many triangles can be formed with vertices at these points?`,
        sol: R`<p>Any 3 points give a triangle except 3 collinear ones: $\binom{${n}}3-\binom{${m}}3=${Cn(n, 3)}-${Cn(m, 3)}=${answer}$.</p>` };
    },
    verify(p) { return combos([...Array(p.n).keys()], 3).filter((t) => !t.every((v) => v < p.m)).length; },
  },
  {
    id: 'pc-g10', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'rank of a word',
    make(rng) {
      const letters = ['B', 'D', 'E', 'M', 'R', 'S', 'T', 'U'];
      const pickSet = []; const pool = [...letters];
      for (let i = 0; i < 5; i++) pickSet.push(pool.splice(int(rng, 0, pool.length - 1), 1)[0]);
      const sorted = [...pickSet].sort();
      const arr = [...pickSet]; for (let i = 4; i > 0; i--) { const j = int(rng, 0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      const w = arr.join('');
      let rank = 1; const rem = [...sorted]; const lines = [];
      for (let i = 0; i < 5; i++) {
        const smaller = rem.filter((c) => c < w[i]).length;
        if (smaller) lines.push(`position ${i + 1}: ${smaller} smaller letter${smaller > 1 ? 's' : ''} left, each giving $${4 - i}!=${F(4 - i)}$ words, so ${smaller * F(4 - i)}`);
        rank += smaller * F(4 - i);
        rem.splice(rem.indexOf(w[i]), 1);
      }
      return { w, answer: rank, tol: 0,
        q: `All permutations of the letters ${sorted.join(', ')} (each used once) are listed in dictionary order. Find the rank of the word ${w}.`,
        sol: R`<p>Count the words before ${w} and add 1.</p><p>${lines.join('; ') || 'No smaller letter is ever available'}.</p><p>Rank $=${rank - 1}+1=${rank}$.</p>` };
    },
    verify(p) { return allPerms(p.w).indexOf(p.w) + 1; },
  },
  {
    id: 'pc-g11', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'derangements',
    make(rng) {
      const n = int(rng, 4, 7);
      const D = [1, 0, 1, 2, 9, 44, 265, 1854];
      const answer = D[n];
      const o = shuffleOpts(rng, String(answer), [String(D[n] + D[n - 1]), String(F(n) - 1), String(D[n - 1] * n + 1)]);
      return { n, ...o, correctVal: answer,
        q: `${n} letters are put at random into ${n} addressed envelopes, one in each. In how many ways does no letter go into its own envelope?`,
        sol: R`<p>This is a derangement: $D_${n}=${n}!\sum_{k=0}^{${n}}\dfrac{(-1)^k}{k!}=${answer}$. (Check with $D_n=(n-1)(D_{n-1}+D_{n-2})$ or $D_n=nD_{n-1}+(-1)^n$.)</p>` };
    },
    verify(p) { return p.options.indexOf(String(derange(p.n))); },
  },
  {
    id: 'pc-g12', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'geometry',
    make(rng) {
      const a = int(rng, 3, 8), b = int(rng, 3, 8);
      const answer = Cn(a + 1, 2) * Cn(b + 1, 2);
      const o = shuffleOpts(rng, String(answer), [String(a * b), String(Cn(a, 2) * Cn(b, 2)), String((a + 1) * (b + 1))]);
      return { a, b, ...o,
        q: `A rectangular grid has ${a} rows and ${b} columns of unit squares. How many rectangles (of every size, squares included) can be traced along the grid lines?`,
        sol: R`<p>There are ${a + 1} horizontal and ${b + 1} vertical grid lines. A rectangle needs 2 of each: $\binom{${a + 1}}2\binom{${b + 1}}2=${Cn(a + 1, 2)}\times${Cn(b + 1, 2)}=${answer}$.</p>` };
    },
    verify(p) { let c = 0; for (let x1 = 0; x1 <= p.a; x1++) for (let x2 = x1 + 1; x2 <= p.a; x2++) for (let y1 = 0; y1 <= p.b; y1++) for (let y2 = y1 + 1; y2 <= p.b; y2++) c++; return p.options.indexOf(String(c)); },
  },
  {
    id: 'pc-g13', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'gaps method',
    make(rng) {
      const m = int(rng, 3, 5), w = int(rng, 2, 3);
      const answer = F(m) * (F(m + 1) / F(m + 1 - w));
      return { m, w, answer, tol: 0,
        q: `${m} men and ${w} women stand in a row so that no two women stand together. How many arrangements are there? (All people are different.)`,
        sol: R`<p>Arrange the ${m} men: $${m}!=${F(m)}$. They leave ${m + 1} gaps; place the ${w} women in different gaps (order matters): $^{${m + 1}}P_{${w}}=${F(m + 1) / F(m + 1 - w)}$. Total $${F(m)}\times${F(m + 1) / F(m + 1 - w)}=${answer}$.</p>` };
    },
    verify(p) { let c = 0; eachPerm(p.m + p.w, (a) => { let ok = true; for (let i = 0; i < a.length - 1; i++) if (a[i] < p.w && a[i + 1] < p.w) { ok = false; break; } if (ok) c++; }); return c; },
  },
  {
    id: 'pc-g14', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'numbers',
    make(rng) {
      const d = int(rng, 6, 8);
      const odd = Math.floor((d + 1) / 2), ev = d - odd; // digits 1..d: odd count, even count
      const answer = ev * (d - 1) * (d - 2);
      return { d, answer, tol: 0,
        q: `How many 3-digit even numbers can be formed from the digits 1, 2, ..., ${d} without repeating a digit?`,
        sol: R`<p>Units digit: one of the ${ev} even digits. Then the tens place has ${d - 1} choices and the hundreds place ${d - 2}. Number $=${ev}\times${d - 1}\times${d - 2}=${answer}$.</p>` };
    },
    verify(p) { return digitsCount([...Array(p.d).keys()].map((x) => x + 1), 3, (s) => +s % 2 === 0); },
  },
  {
    id: 'pc-g15', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'restrictions',
    make(rng) {
      const n = int(rng, 8, 12), k = int(rng, 3, 5);
      const answer = Cn(n, k) - Cn(n - 2, k - 2);
      return { n, k, answer, tol: 0,
        q: `A team of ${k} is chosen from ${n} people. Two particular people never play together. In how many ways can the team be chosen?`,
        sol: R`<p>All teams: $\binom{${n}}{${k}}=${Cn(n, k)}$. Teams with both: choose the other ${k - 2} from ${n - 2}: $\binom{${n - 2}}{${k - 2}}=${Cn(n - 2, k - 2)}$. Allowed $=${answer}$.</p>` };
    },
    verify(p) { return combos([...Array(p.n).keys()], p.k).filter((t) => !(t.includes(0) && t.includes(1))).length; },
  },
];

// A single-answer item's calc() gives the count; turn it into the option index it must match, so the bank check
// confirms the keyed option really holds that count.
// Other non-numeric items keep their brute-force check as `fact` (a supporting number, not the key).
for (const it of items) {
  if (it.type === 'nat' || typeof it.calc !== 'function') continue;
  if (it.format !== 'single') { it.fact = it.calc; delete it.calc; continue; }
  const count = it.calc;
  const num = (o) => Number(String(o).replace(/<[^>]*>|\\[a-z]+|[^0-9.\-]/gi, ''));
  it.calc = () => it.options.findIndex((o) => Math.abs(num(o) - count()) < 1e-9);
}

export default { topic: 'permutations-combinations', groups, items, gens };
