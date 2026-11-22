import { int, choose, fmt, frac, gcd, textOpts, numOpts, nearFracs, steps } from './_q.js';
const E = ['gmat', 'gre'];
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, k) => (k < 0 || k > n ? 0 : fact(n) / (fact(k) * fact(n - k)));
const wrongFracs = (a, b, alts) => alts.filter(([x, y]) => y > 0 && x >= 0 && x * b !== a * y).map(([x, y]) => frac(x, y));
export default {
  topic: 'probability',
  items: [
    { id: 'pb-001', type: 'mcq', level: 1, exams: E, sub: 'basic',
      q: '<p>Two fair coins are tossed. What is the probability of getting at least one head?</p>', options: ['1/4', '1/3', '1/2', '2/3', '3/4'], answer: 4,
      sol: '<p>The four equally likely outcomes are HH, HT, TH, TT. Only TT has no head, so P(at least one head) = 1 − 1/4 = 3/4.</p>' },
    { id: 'pb-002', type: 'mcq', level: 2, exams: E, sub: 'dice',
      q: '<p>Two fair dice are rolled. What is the probability that the total is 8?</p>', options: ['1/9', '5/36', '1/6', '7/36', '2/9'], answer: 1,
      sol: '<p>36 equally likely outcomes. Totals of 8: (2,6), (3,5), (4,4), (5,3), (6,2): 5 outcomes. P = 5/36.</p>' },
    { id: 'pb-003', type: 'mcq', level: 3, exams: E, sub: 'or',
      q: '<p>P(A) = 0.5, P(B) = 0.4 and P(A and B) = 0.2. What is P(A or B)?</p>', options: ['0.2', '0.5', '0.7', '0.9', '1'], answer: 2,
      sol: '<p>P(A or B) = P(A) + P(B) − P(A and B) = 0.5 + 0.4 − 0.2 = 0.7. Subtracting the overlap stops it being counted twice.</p>' },
  ],
  gens: [
    { id: 'pb-g01', type: 'mcq', level: 2, exams: E, sub: 'without replacement', title: 'draw two without putting back',
      make(r) {
        const red = int(r, 2, 8), blue = int(r, 2, 8), n = red + blue, a = red * (red - 1), b = n * (n - 1), value = a / b;
        return { q: `<p>A bag holds ${red} red and ${blue} blue marbles. Two are drawn at random without replacement. What is the probability that both are red?</p>`, ...textOpts(r, frac(a, b), wrongFracs(a, b, [[red * red, n * n], [red, n], [red * (red - 1), n * n], [C(red, 2) * 2 + 1, b]]).concat(nearFracs(a, b))), value, red, blue,
          hint: 'Multiply: P(first red) × P(second red, given the first was red).',
          sol: steps(`First red: ${red}/${n}.`, `Second red: ${red - 1}/${n - 1} (one red is gone).`, `${red}/${n} × ${red - 1}/${n - 1} = ${a}/${b} = <b>${frac(a, b)}</b>.`), trap: `Using ${red}/${n} twice forgets that the first marble is not put back.` };
      }, check: (p) => (p.red * (p.red - 1)) / ((p.red + p.blue) * (p.red + p.blue - 1)) },
    { id: 'pb-g02', type: 'mcq', level: 2, exams: E, sub: 'at least one', title: 'at least one success',
      make(r) {
        const p = choose(r, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), n = choose(r, [2, 3]), [x, y] = p;
        const fa = (y - x) ** n, fb = y ** n, value = 1 - fa / fb;
        return { q: `<p>Each time a player shoots, the chance of scoring is ${x}/${y}, independent of other shots. If the player shoots ${n} times, what is the probability of scoring at least once?</p>`, ...textOpts(r, frac(fb - fa, fb), wrongFracs(fb - fa, fb, [[x * n, y], [x ** n, y ** n], [fa, fb], [x * n * (y - x), fb]]).concat(nearFracs(fb - fa, fb))), value, x, y, n,
          hint: 'At least once = 1 − (never scoring).',
          sol: steps(`Missing once has chance ${y - x}/${y}.`, `Missing all ${n}: (${y - x}/${y})<sup>${n}</sup> = ${fa}/${fb}.`, `At least once: 1 − ${fa}/${fb} = <b>${frac(fb - fa, fb)}</b>.`), trap: `Adding ${x}/${y} ${n} times can even give more than 1.` };
      }, check: (p) => 1 - ((p.y - p.x) / p.y) ** p.n },
    { id: 'pb-g03', type: 'mcq', level: 3, exams: E, sub: 'combinations', title: 'probability from combinations',
      make(r) {
        const m = int(r, 3, 7), w = int(r, 3, 7), k = 3, want = choose(r, [1, 2]), a = C(m, want) * C(w, k - want), b = C(m + w, k), value = a / b;
        return { q: `<p>Three people are picked at random from ${m} men and ${w} women. What is the probability that exactly ${want} of them ${want === 1 ? 'is a man' : 'are men'}?</p>`, ...textOpts(r, frac(a, b), wrongFracs(a, b, [[want, 3], [C(m, want), b], [m, m + w], [a, b * 2], [a * 2, b * 3]]).concat(nearFracs(a, b))), value, m, w, want,
          hint: 'Favourable groups ÷ all possible groups, both counted with combinations.',
          sol: steps(`All groups of 3: C(${m + w}, 3) = ${b}.`, `Exactly ${want} men: C(${m}, ${want}) × C(${w}, ${k - want}) = ${C(m, want)} × ${C(w, k - want)} = ${a}.`, `P = ${a}/${b} = <b>${frac(a, b)}</b>.`) };
      }, check: (p) => (C(p.m, p.want) * C(p.w, 3 - p.want)) / C(p.m + p.w, 3) },
  ],
};
