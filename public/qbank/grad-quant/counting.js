import { int, choose, fmt, numOpts, steps } from './_q.js';
const E = ['gmat', 'gre'];
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, k) => fact(n) / (fact(k) * fact(n - k));
const P = (n, k) => fact(n) / fact(n - k);
export default {
  topic: 'counting',
  items: [
    { id: 'co-001', type: 'mcq', level: 1, exams: E, sub: 'multiply',
      q: '<p>A café offers 4 sandwiches, 3 drinks and 2 desserts. How many different meals of one sandwich, one drink and one dessert are possible?</p>', options: ['9', '12', '18', '24', '36'], answer: 3,
      sol: '<p>Each choice multiplies the options: 4 × 3 × 2 = 24.</p>', trap: 'Adding (4 + 3 + 2 = 9) counts single items, not meals.' },
    { id: 'co-002', type: 'mcq', level: 2, exams: E, sub: 'repeated letters',
      q: '<p>How many different arrangements are there of the letters in the word LEVEL?</p>', options: ['20', '30', '60', '120', '240'], answer: 1,
      sol: '<p>5 letters give 5! = 120 orders, but the two Ls can swap and the two Es can swap without making a new word: 120 ÷ (2! × 2!) = 30.</p>' },
    { id: 'co-003', type: 'mcq', level: 3, exams: E, sub: 'restrictions',
      q: '<p>In how many ways can 5 people sit in a row if two of them, Ali and Bea, must sit next to each other?</p>', options: ['24', '36', '48', '96', '120'], answer: 2,
      sol: '<p>Glue Ali and Bea into one block: 4 units to arrange in 4! = 24 ways. Inside the block they can sit in 2 orders. 24 × 2 = 48.</p>', trap: 'Forgetting that Ali-Bea and Bea-Ali are different gives 24.' },
  ],
  gens: [
    { id: 'co-g01', type: 'mcq', level: 2, exams: E, sub: 'combinations', title: 'choose a committee',
      make(r) {
        const n = int(r, 6, 12), k = int(r, 2, 4), value = C(n, k);
        return { q: `<p>A team of ${k} is to be chosen from ${n} volunteers. How many different teams are possible? (The order of choosing does not matter.)</p>`, ...numOpts(r, value, [P(n, k), n * k, C(n, k - 1)]), value, n, k,
          hint: 'Order does not matter, so use combinations: n! ÷ (k!(n − k)!).',
          sol: steps(`Ordered choices: ${Array.from({ length: k }, (_, i) => n - i).join(' × ')} = ${P(n, k)}.`, `Each team is counted ${k}! = ${fact(k)} times (once per order).`, `${P(n, k)} ÷ ${fact(k)} = <b>${value}</b>.`), trap: `Not dividing by ${k}! counts the same team many times (${P(n, k)}).` };
      }, check: (p) => C(p.n, p.k) },
    { id: 'co-g02', type: 'mcq', level: 2, exams: E, sub: 'permutations', title: 'award prizes in order',
      make(r) {
        const n = int(r, 5, 12), k = choose(r, [2, 3]), value = P(n, k);
        return { q: `<p>${n} runners finish a race. In how many different ways can the ${k === 2 ? 'gold and silver' : 'gold, silver and bronze'} medals be awarded? (No ties.)</p>`, ...numOpts(r, value, [C(n, k), n ** k, n * k]), value, n, k,
          hint: 'Order matters: count choices for gold, then silver, then bronze.',
          sol: steps(`Gold: ${n} choices; silver: ${n - 1}${k === 3 ? `; bronze: ${n - 2}` : ''}.`, `Multiply: ${Array.from({ length: k }, (_, i) => n - i).join(' × ')}.`, `= <b>${value}</b>.`) };
      }, check: (p) => P(p.n, p.k) },
    { id: 'co-g03', type: 'mcq', level: 3, exams: E, sub: 'groups', title: 'choose from two groups',
      make(r) {
        const m = int(r, 4, 8), w = int(r, 4, 8), km = choose(r, [1, 2, 3]), kw = choose(r, [1, 2]), value = C(m, km) * C(w, kw);
        return { q: `<p>A panel needs ${km} manager${km > 1 ? 's' : ''} chosen from ${m} and ${kw} engineer${kw > 1 ? 's' : ''} chosen from ${w}. How many different panels are possible?</p>`, ...numOpts(r, value, [C(m, km) + C(w, kw), C(m + w, km + kw), P(m, km) * P(w, kw)]), value, m, w, km, kw,
          hint: 'Count each group separately, then multiply (choose managers AND engineers).',
          sol: steps(`Managers: C(${m}, ${km}) = ${C(m, km)}.`, `Engineers: C(${w}, ${kw}) = ${C(w, kw)}.`, `Panels: ${C(m, km)} × ${C(w, kw)} = <b>${value}</b>.`), trap: 'Adding the two counts, or choosing from everyone at once.' };
      }, check: (p) => C(p.m, p.km) * C(p.w, p.kw) },
    { id: 'co-g04', type: 'mcq', level: 3, exams: E, sub: 'restrictions', title: 'codes with a rule',
      make(r) {
        const L = choose(r, [3, 4]), digits = 10, noRepeat = r() < 0.5, firstNonZero = r() < 0.5;
        const value = noRepeat ? (firstNonZero ? 9 * P(9, L - 1) : P(10, L)) : (firstNonZero ? 9 * 10 ** (L - 1) : 10 ** L);
        return { q: `<p>How many ${L}-digit codes can be made from the digits 0 to 9 if ${noRepeat ? 'no digit may be used twice' : 'digits may repeat'}${firstNonZero ? ' and the first digit cannot be 0' : ''}?</p>`, ...numOpts(r, value, [noRepeat ? 10 ** L : P(10, L), firstNonZero ? (noRepeat ? P(10, L) : 10 ** L) : 9 * 10 ** (L - 1), C(10, L)].filter((x) => x !== value)), value, L, noRepeat, firstNonZero,
          hint: 'Fill the places one at a time and multiply the number of choices for each.',
          sol: steps(`First place: ${firstNonZero ? 9 : 10} choices${firstNonZero ? ' (1 to 9)' : ''}.`, `Then ${noRepeat ? `${firstNonZero ? 9 : 9}, ${firstNonZero ? 8 : 8}${L === 4 ? ', 7' : ''}` : Array(L - 1).fill(10).join(', ')} choices for the other places${noRepeat ? ' (one fewer each time)' : ''}.`, `Total: <b>${fmt(value)}</b>.`) };
      }, check: (p) => { let c = 0; for (let x = 0; x < 10 ** p.L; x++) { const s = String(x).padStart(p.L, '0'); if (p.firstNonZero && s[0] === '0') continue; if (p.noRepeat && new Set(s).size < p.L) continue; c++; } return c; } },
  ],
};
