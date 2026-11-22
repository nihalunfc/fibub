import { int, choose, fmt, frac, gcd, numOpts, textOpts, nearFracs, steps } from './_q.js';
const E = ['gmat', 'gre'];
export default {
  topic: 'fractions',
  items: [
    { id: 'fr-001', type: 'mcq', level: 1, exams: E, sub: 'operations',
      q: '<p>What is 2/3 + 3/4 − 5/6?</p>', options: ['0', '1/12', '7/12', '5/6', '1'], answer: 2,
      sol: '<p>Common denominator 12: 8/12 + 9/12 − 10/12 = 7/12.</p>' },
    { id: 'fr-002', type: 'mcq', level: 2, exams: E, sub: 'decimals',
      q: '<p>Which fraction has a terminating decimal?</p>', options: ['1/3', '5/12', '7/15', '9/40', '4/21'], answer: 3,
      sol: '<p>A fraction in lowest terms terminates only if its denominator has no prime factors other than 2 and 5. 40 = 2<sup>3</sup> × 5, so 9/40 = 0.225 terminates. The others have a 3 or a 7 in the denominator.</p>' },
    { id: 'fr-003', type: 'mcq', level: 3, exams: E, sub: 'complex fractions',
      q: '<p>What is 1 ÷ (1 + 1 ÷ (1 + 1/2))?</p>', options: ['2/5', '3/5', '2/3', '5/3', '5/2'], answer: 1,
      sol: '<p>Work from the inside out: 1 + 1/2 = 3/2; 1 ÷ 3/2 = 2/3; 1 + 2/3 = 5/3; 1 ÷ 5/3 = 3/5.</p>' },
  ],
  gens: [
    { id: 'fr-g01', type: 'mcq', level: 2, exams: E, sub: 'fraction of a whole', title: 'fraction of what is left',
      make(r) {
        const d1 = choose(r, [3, 4, 5]), n1 = int(r, 1, d1 - 1), d2 = choose(r, [2, 3, 4]), n2 = int(r, 1, d2 - 1);
        const total = d1 * d2 * int(r, 3, 12), first = (total * n1) / d1, second = ((total - first) * n2) / d2, value = total - first - second;
        return { q: `<p>Of the ${total} tickets for a concert, ${n1}/${d1} were sold in the first week and ${n2}/${d2} of the remaining tickets were sold in the second week. How many tickets were not sold?</p>`, ...numOpts(r, value, [total - first - (total * n2) / d2, first, second].filter((x) => x > 0)), value, total, n1, d1, n2, d2,
          hint: `"Of the remaining" means take ${n2}/${d2} of what is left after week 1, not of ${total}.`,
          sol: steps(`Week 1: ${n1}/${d1} × ${total} = ${first}. Left: ${total - first}.`, `Week 2: ${n2}/${d2} × ${total - first} = ${second}.`, `Not sold: ${total - first} − ${second} = <b>${value}</b>.`), trap: `Taking ${n2}/${d2} of the whole ${total}.` };
      }, check: (p) => p.total * (1 - p.n1 / p.d1) * (1 - p.n2 / p.d2) },
    { id: 'fr-g02', type: 'mcq', level: 2, exams: E, sub: 'operations', title: 'divide fractions',
      make(r) {
        const a = int(r, 1, 5), b = choose(r, [3, 4, 5, 8, 9].filter((x) => gcd(a, x) === 1 && x > a)), c = int(r, 1, 5), d = choose(r, [2, 3, 6, 7].filter((x) => gcd(c, x) === 1 && x > c));
        const value = (a * d) / (b * c);
        return { q: `<p>What is (${a}/${b}) ÷ (${c}/${d})? Give the answer as a decimal or fraction.</p>`, ...textOpts(r, frac(a * d, b * c), [frac(a * c, b * d), frac(b * c, a * d), frac(a + c, b + d), frac(a * d + 1, b * c), ...nearFracs(a * d, b * c)]), value, a, b, c, d,
          hint: 'Dividing by a fraction is multiplying by its flip.',
          sol: steps(`Flip the second fraction: ${d}/${c}.`, `${a}/${b} × ${d}/${c} = ${a * d}/${b * c}.`, `In lowest terms: <b>${frac(a * d, b * c)}</b> ≈ ${fmt(value, 3)}.`) };
      }, check: (p) => (p.a * p.d) / (p.b * p.c) },
    { id: 'fr-g03', type: 'mcq', level: 2, exams: E, sub: 'estimation', title: 'estimate a product',
      make(r) {
        const x = int(r, 18, 82) + choose(r, [0.1, 0.2, 0.3, -0.2, -0.1]), y = int(r, 11, 49) + choose(r, [0.1, 0.3, -0.2]), z = choose(r, [0.48, 0.52, 0.249, 0.251, 0.198, 0.202]);
        const est = Math.round(x) * Math.round(y) * (Math.round(z * 100) % 25 === 0 ? Math.round(z * 4) / 4 : Math.round(z * 5) / 5);
        const real = x * y * z;
        const nice = [real / 10, real / 3, real, real * 3, real * 10].map((v) => Math.round(v / 10 ** (Math.floor(Math.log10(v)) - 1)) * 10 ** (Math.floor(Math.log10(v)) - 1));
        const value = nice[2];
        return { q: `<p>Which is closest to ${fmt(x, 1)} × ${fmt(y, 1)} × ${z}?</p>`, ...numOpts(r, value, [nice[0], nice[1], nice[3], nice[4]]), value, x, y, z, abs: Math.abs(value) * 0.15,
          hint: 'Round each number to something easy, such as 0.48 ≈ 1/2 or 0.198 ≈ 1/5.',
          sol: steps(`Round: ${Math.round(x)} × ${Math.round(y)} × about ${z < 0.22 ? '1/5' : z < 0.3 ? '1/4' : '1/2'}.`, `That is about ${fmt(est)}.`, `The exact value is ${fmt(real, 2)}, so the closest choice is <b>${fmt(value)}</b>.`) };
      }, check: (p) => { const v = p.x * p.y * p.z, e = Math.floor(Math.log10(v)) - 1; return Math.round(v / 10 ** e) * 10 ** e; } },
  ],
};
