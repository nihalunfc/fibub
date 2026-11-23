// Class 11 Maths, Sets: live problems (original fibub questions). Ids start with c11m-sets-.
import { pick, choose, n, steps } from './_util.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export default {
  'c11m-sets-contain': {
    title: 'subsets that contain one element',
    make(r) {
      const k = pick(r, 3, 9), answer = 2 ** (k - 1);
      return { k, q: `<p>A set has <b>${k}</b> elements. How many of its subsets contain one particular chosen element?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'That element is fixed as "in". Every other element is either in or out.',
        solution: steps(`The chosen element is always in the subset, so it has only 1 choice.`, `Each of the other ${k - 1} elements is in or out: 2 choices each.`, `Number of subsets = 2<sup>${k - 1}</sup> = <b>${answer}</b>.`) };
    },
    verify(x) { let c = 0; for (let m = 0; m < 1 << x.k; m++) if (m & 1) c++; return c; },
  },
  'c11m-sets-neither': {
    title: 'students who like neither (two sets)',
    make(r) {
      const both = pick(r, 5, 20), a = pick(r, 10, 40), b = pick(r, 10, 40), nA = a + both, nB = b + both, none = pick(r, 3, 15), N = a + b + both + none, answer = N - (nA + nB - both);
      return { N, nA, nB, both, q: `<p>In a group of <b>${N}</b> people, <b>${nA}</b> like cricket, <b>${nB}</b> like football and <b>${both}</b> like both. How many like neither game?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'First find n(A ∪ B) = n(A) + n(B) − n(A ∩ B), then subtract from the whole group.',
        solution: steps(`n(A ∪ B) = ${nA} + ${nB} − ${both} = ${nA + nB - both}.`, `Neither = ${N} − ${nA + nB - both} = <b>${answer}</b>.`) };
    },
    verify(x) { const onlyA = x.nA - x.both, onlyB = x.nB - x.both; return x.N - onlyA - onlyB - x.both; },
  },
  'c11m-sets-three': {
    title: 'union of three sets',
    make(r) {
      const abc = pick(r, 1, 5), ab = abc + pick(r, 1, 6), bc = abc + pick(r, 1, 6), ca = abc + pick(r, 1, 6), A = ab + ca - abc + pick(r, 3, 15), B = ab + bc - abc + pick(r, 3, 15), C = bc + ca - abc + pick(r, 3, 15), answer = A + B + C - ab - bc - ca + abc;
      return { A, B, C, ab, bc, ca, abc, q: `<p>n(A) = ${A}, n(B) = ${B}, n(C) = ${C}, n(A ∩ B) = ${ab}, n(B ∩ C) = ${bc}, n(C ∩ A) = ${ca} and n(A ∩ B ∩ C) = ${abc}. Find n(A ∪ B ∪ C).</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Add the three sets, subtract the three overlaps of two, add back the overlap of all three.',
        solution: steps(`n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A∩B) − n(B∩C) − n(C∩A) + n(A∩B∩C).`, `= ${A} + ${B} + ${C} − ${ab} − ${bc} − ${ca} + ${abc} = <b>${answer}</b>.`) };
    },
    verify(x) { const o = { abc: x.abc, ab: x.ab - x.abc, bc: x.bc - x.abc, ca: x.ca - x.abc }, a = x.A - o.ab - o.ca - o.abc, b = x.B - o.ab - o.bc - o.abc, c = x.C - o.bc - o.ca - o.abc; return a + b + c + o.ab + o.bc + o.ca + o.abc; },
  },
  'c11m-sets-interval': {
    title: 'length of an overlap of two intervals',
    make(r) {
      const a = pick(r, -8, 0), b = a + pick(r, 4, 10), c = pick(r, -6, 4), d = c + pick(r, 3, 10), answer = Math.max(0, Math.min(b, d) - Math.max(a, c));
      return { a, b, c, d, q: `<p>A = [${a}, ${b}] and B = [${c}, ${d}]. Find the <b>length</b> of the interval A ∩ B (0 if they do not meet).</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'The overlap starts at the larger left end and stops at the smaller right end.',
        solution: steps(`Left end = max(${a}, ${c}) = ${Math.max(a, c)}; right end = min(${b}, ${d}) = ${Math.min(b, d)}.`, `Length = ${Math.min(b, d)} − ${Math.max(a, c)}, or 0 if that is negative: <b>${answer}</b>.`) };
    },
    verify(x) { let c = 0; for (let k = x.a * 10; k <= x.b * 10; k++) if (k >= x.c * 10 && k <= x.d * 10) c++; return c ? (c - 1) / 10 : 0; },
  },
  'c11m-sets-multiples': {
    title: 'numbers divisible by a or b',
    make(r) {
      const a = choose(r, [3, 4, 5, 6]), b = choose(r, [7, 8, 9, 10]), N = pick(r, 60, 200); let answer = 0;
      for (let x = 1; x <= N; x++) if (x % a === 0 || x % b === 0) answer++;
      return { a, b, N, q: `<p>How many numbers from 1 to <b>${N}</b> are divisible by ${a} or by ${b} (or both)?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Let A = multiples of one, B = multiples of the other. Use n(A ∪ B) = n(A) + n(B) − n(A ∩ B); the overlap is multiples of the LCM.',
        solution: steps(`n(A) = ⌊${N}/${a}⌋ = ${Math.floor(N / a)}, n(B) = ⌊${N}/${b}⌋ = ${Math.floor(N / b)}.`, `LCM(${a}, ${b}) = ${(a * b) / gcd(a, b)}, so n(A ∩ B) = ${Math.floor(N / ((a * b) / gcd(a, b)))}.`, `Total = <b>${answer}</b>.`) };
    },
    verify(x) { const l = (x.a * x.b) / gcd(x.a, x.b); return Math.floor(x.N / x.a) + Math.floor(x.N / x.b) - Math.floor(x.N / l); },
  },
  'c11m-sets-symdiff': {
    title: 'elements in exactly one of two sets',
    make(r) {
      const both = pick(r, 3, 12), a = pick(r, 4, 20), b = pick(r, 4, 20), nA = a + both, nB = b + both, answer = nA + nB - 2 * both;
      return { nA, nB, both, q: `<p>n(A) = ${nA}, n(B) = ${nB} and n(A ∩ B) = ${both}. How many elements belong to <b>exactly one</b> of the two sets (the symmetric difference A △ B)?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'A △ B = (A − B) ∪ (B − A). Take the overlap away from each set first.',
        solution: steps(`n(A − B) = ${nA} − ${both} = ${nA - both}; n(B − A) = ${nB} − ${both} = ${nB - both}.`, `Exactly one: ${nA - both} + ${nB - both} = <b>${answer}</b>.`) };
    },
    verify(x) { return x.nA + x.nB - x.both - x.both; },
  },
};
