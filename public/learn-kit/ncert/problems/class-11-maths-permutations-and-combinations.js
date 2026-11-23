// Class 11 Maths, Permutations and Combinations: live problems (original fibub questions). Ids start with c11m-pnc-.
import { pick, choose, n, steps } from './_util.js';

const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
const perms = (s) => { const out = new Set(); const rec = (cur, rest) => { if (!rest.length) { out.add(cur); return; } for (let i = 0; i < rest.length; i++) rec(cur + rest[i], rest.slice(0, i) + rest.slice(i + 1)); }; rec('', s); return out.size; };
export default {
  'c11m-pnc-outfits': {
    title: 'the multiplication rule',
    make(r) {
      const a = pick(r, 2, 6), b = pick(r, 2, 6), c = pick(r, 2, 5), answer = a * b * c;
      return { a, b, c, q: `<p>A canteen offers ${a} kinds of sandwich, ${b} kinds of juice and ${c} kinds of dessert. A meal is one of each. How many different meals are possible?</p>`, answer, unit: 'meals', tol: 0, abs: 0.001,
        hint: 'Each choice of sandwich can be followed by every juice, and then every dessert: multiply.',
        solution: steps(`Three jobs in a row: ${a} ways, then ${b} ways, then ${c} ways.`, `${a} × ${b} × ${c} = <b>${answer}</b>.`) };
    },
    verify(x) { let k = 0; for (let i = 0; i < x.a; i++) for (let j = 0; j < x.b; j++) for (let l = 0; l < x.c; l++) k++; return k; },
  },
  'c11m-pnc-digits': {
    title: 'numbers from digits without repeating',
    make(r) {
      const d = pick(r, 5, 9), k = pick(r, 3, 4), answer = (() => { let p = 1; for (let i = 0; i < k; i++) p *= d - i; return p; })();
      return { d, k, q: `<p>How many ${k}-digit numbers can be formed from the digits 1 to ${d} if no digit is repeated?</p>`, answer, unit: 'numbers', tol: 0, abs: 0.001,
        hint: `Fill the places one at a time: ${d} digits for the first place, then one fewer each time.`,
        solution: steps(`${d}P${k} = ${Array.from({ length: k }, (_, i) => d - i).join(' × ')}.`, `= <b>${answer}</b>.`) };
    },
    verify(x) { let c = 0; const rec = (used, len) => { if (len === x.k) { c++; return; } for (let i = 1; i <= x.d; i++) if (!(used >> i & 1)) rec(used | (1 << i), len + 1); }; rec(0, 0); return c; },
  },
  'c11m-pnc-word': {
    title: 'arrangements of a word with repeated letters',
    make(r) {
      const w = choose(r, ['LEVEL', 'BANANA', 'PAPAYA', 'GOOGLE', 'BALLOON', 'MUMMY']), c = {}; for (const ch of w) c[ch] = (c[ch] || 0) + 1;
      const answer = Object.values(c).reduce((t, k) => t / fact(k), fact(w.length));
      return { w, q: `<p>How many different arrangements can be made from all the letters of the word <b>${w}</b>?</p>`, answer, unit: 'arrangements', tol: 0, abs: 0.001,
        hint: 'Use n! and divide by the factorial of how many times each letter repeats.',
        solution: steps(`${w} has ${w.length} letters: ${Object.entries(c).map(([ch, k]) => `${ch} × ${k}`).join(', ')}.`, `${w.length}! ÷ (${Object.values(c).filter((k) => k > 1).map((k) => k + '!').join(' × ')}) = <b>${answer}</b>.`) };
    },
    verify(x) { return perms(x.w); },
  },
  'c11m-pnc-committee': {
    title: 'choosing a committee',
    make(r) {
      const N = pick(r, 6, 12), k = pick(r, 2, 4), answer = (() => { let v = 1; for (let i = 1; i <= k; i++) v = v * (N - k + i) / i; return Math.round(v); })();
      return { N, k, q: `<p>A class has ${N} students. In how many ways can a team of ${k} be chosen if the order inside the team does not matter?</p>`, answer, unit: 'teams', tol: 0, abs: 0.001,
        hint: `This is a combination: ${N}C${k} = ${N}! / (${k}! × ${N - k}!).`,
        solution: steps(`${N}C${k} = ${Array.from({ length: k }, (_, i) => N - i).join(' × ')} ÷ ${k}!`, `= <b>${answer}</b>.`) };
    },
    verify(x) { const T = []; for (let a = 0; a <= x.N; a++) { T[a] = [1]; for (let b = 1; b <= a; b++) T[a][b] = (T[a - 1][b - 1] || 0) + (T[a - 1][b] || 0); } return T[x.N][x.k]; },
  },
  'c11m-pnc-together': {
    title: 'two people must stand together',
    make(r) {
      const N = pick(r, 4, 7), answer = fact(N - 1) * 2;
      return { N, q: `<p>${N} friends stand in a row for a photo. In how many ways can they stand if two particular friends, Asha and Bilal, must be next to each other?</p>`, answer, unit: 'ways', tol: 0, abs: 0.001,
        hint: 'Glue the two into one block, arrange the blocks, then arrange the two inside the block.',
        solution: steps(`Block Asha-Bilal + ${N - 2} others = ${N - 1} units: ${N - 1}! ways.`, `Inside the block: 2! = 2.`, `${fact(N - 1)} × 2 = <b>${answer}</b>.`) };
    },
    verify(x) { let c = 0; const people = [...Array(x.N).keys()]; const rec = (cur, rest) => { if (!rest.length) { if (Math.abs(cur.indexOf(0) - cur.indexOf(1)) === 1) c++; return; } for (let i = 0; i < rest.length; i++) rec([...cur, rest[i]], rest.filter((_, j) => j !== i)); }; rec([], people); return c; },
  },
  'c11m-pnc-handshake': {
    title: 'handshakes at a party',
    make(r) {
      const N = pick(r, 5, 20), answer = N * (N - 1) / 2;
      return { N, q: `<p>At a wedding, ${N} guests meet and every two guests shake hands exactly once. How many handshakes are there?</p>`, answer, unit: 'handshakes', tol: 0, abs: 0.001,
        hint: 'A handshake is a pair of guests, and A-B is the same as B-A: it is a combination, not a permutation.',
        solution: steps(`${N}C2 = ${N} × ${N - 1} ÷ 2.`, `= <b>${answer}</b>.`) };
    },
    verify(x) { let c = 0; for (let i = 0; i < x.N; i++) for (let j = i + 1; j < x.N; j++) c++; return c; },
  },
};
