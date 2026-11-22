// CUET General Test: number and letter series. Original questions for fibub.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// mc: options[0] is the right one; it is placed at a position that depends on the id number
const mc = (id, level, sub, q, opts, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4; const o = opts.slice(1); o.splice(k, 0, opts[0]);
  return mcq(id, level, sub, q, o, k, sol, trap);
};
const L = (v) => String.fromCharCode(65 + (((v % 26) + 26) % 26));

export default {
  topic: 'series',
  items: [
    mc('se-001', 1, 'arithmetic', 'Find the next number: 3, 7, 11, 15, ?', ['19', '18', '21', '17'], 'Each term is 4 more than the one before (common difference 4). 15 + 4 = <b>19</b>.'),
    mc('se-002', 1, 'geometric', 'Find the next number: 2, 6, 18, 54, ?', ['162', '108', '148', '216'], 'Each term is 3 times the one before. 54 × 3 = <b>162</b>.', 'Adding 36 (the last gap) gives 90, but the gaps are growing, so the rule is multiplication.'),
    mc('se-003', 2, 'differences', 'Find the next number: 5, 8, 13, 20, 29, ?', ['40', '38', '39', '42'], 'Gaps: 3, 5, 7, 9, so the next gap is 11. 29 + 11 = <b>40</b>. When gaps themselves go up by a fixed amount, think "odd numbers" or squares.'),
    mc('se-004', 1, 'squares', 'Find the next number: 1, 4, 9, 16, 25, ?', ['36', '30', '35', '49'], 'These are 1², 2², 3², 4², 5². The next is 6² = <b>36</b>.'),
    mc('se-005', 1, 'primes', 'Find the next number: 2, 3, 5, 7, 11, 13, ?', ['17', '15', '19', '16'], 'These are consecutive primes. After 13 comes <b>17</b> (15 = 3 × 5 and 16 are not prime).'),
    mc('se-006', 1, 'fibonacci', 'Find the next number: 1, 1, 2, 3, 5, 8, ?', ['13', '11', '12', '15'], 'Each term is the sum of the two before it: 5 + 8 = <b>13</b>.'),
    mc('se-007', 1, 'arithmetic', 'Find the next number: 100, 92, 84, 76, ?', ['68', '66', '70', '64'], 'The gap is −8 each time. 76 − 8 = <b>68</b>.'),
    mc('se-008', 2, 'factorial', 'Find the next number: 1, 2, 6, 24, 120, ?', ['720', '240', '600', '840'], 'Multiply by 2, 3, 4, 5, and next by 6: 120 × 6 = <b>720</b> (these are factorials).', 'Doubling 120 gives 240, but the multiplier itself keeps rising by one.'),
    mc('se-009', 2, 'squares', 'Find the next number: 2, 5, 10, 17, 26, ?', ['37', '35', '36', '38'], 'Each term is n² + 1: 1+1, 4+1, 9+1, 16+1, 25+1. Next is 6² + 1 = <b>37</b>. Gaps 3, 5, 7, 9, 11 agree: 26 + 11 = 37.'),
    mc('se-010', 2, 'squares', 'Find the next number: 0, 3, 8, 15, 24, ?', ['35', '32', '34', '36'], 'Each term is n² − 1 (1−1, 4−1, 9−1, 16−1, 25−1). Next is 6² − 1 = <b>35</b>.'),
    mc('se-011', 1, 'cubes', 'Find the next number: 1, 8, 27, 64, ?', ['125', '100', '121', '216'], 'Cubes: 1³, 2³, 3³, 4³. Next is 5³ = <b>125</b>.'),
    mc('se-012', 2, 'mixed rule', 'Find the next number: 4, 9, 19, 39, ?', ['79', '78', '77', '80'], 'Double and add 1: 4×2+1 = 9, 9×2+1 = 19, 19×2+1 = 39. Next: 39×2+1 = <b>79</b>.', 'Only doubling (78) misses the +1 that is added every time.'),
    mc('se-013', 2, 'mixed rule', 'Find the next number: 3, 5, 9, 17, 33, ?', ['65', '64', '66', '63'], 'Double and subtract 1: 3×2−1 = 5, 5×2−1 = 9, 9×2−1 = 17, 17×2−1 = 33. Next: 33×2−1 = <b>65</b>. Gaps 2, 4, 8, 16, 32 also work.'),
    mc('se-014', 2, 'alternating', 'Find the next number: 2, 10, 4, 20, 6, 30, ?', ['8', '9', '40', '12'], 'Two series are mixed. Positions 1, 3, 5: 2, 4, 6, so the next is 8. Positions 2, 4, 6: 10, 20, 30. The 7th term belongs to the first series: <b>8</b>.', 'Reading it as one series misses that every second term follows its own rule.'),
    mc('se-015', 1, 'triangular', 'Find the next number: 1, 3, 6, 10, 15, ?', ['21', '20', '22', '25'], 'Gaps are 2, 3, 4, 5, so the next gap is 6: 15 + 6 = <b>21</b> (triangular numbers).'),
    mc('se-016', 1, 'geometric', 'Find the next number: 7, 14, 28, 56, ?', ['112', '84', '96', '110'], 'Each term is doubled: 56 × 2 = <b>112</b>.'),
    mc('se-017', 3, 'squares', 'Find the next number: 120, 99, 80, 63, 48, ?', ['35', '36', '33', '38'], 'Each term is n² − 1 going down: 11²−1 = 120, 10²−1 = 99, 9²−1 = 80, 8²−1 = 63, 7²−1 = 48. Next 6² − 1 = <b>35</b>. Gaps −21, −19, −17, −15, −13 agree: 48 − 13 = 35.'),
    mc('se-018', 2, 'wrong number', 'One number is wrong in the series 3, 6, 12, 24, 49, 96, 192. Find it.', ['49', '24', '96', '12'], 'Each term should be double the one before: 3, 6, 12, 24, <b>48</b>, 96, 192. The term 49 breaks the rule.', 'After spotting the rule, check every term, not only the one that looks odd.'),
    mc('se-019', 3, 'wrong number', 'One number is wrong in the series 5, 11, 23, 47, 95, 190. Find it.', ['190', '95', '47', '23'], 'Rule: double and add 1. 5→11→23→47→95→<b>191</b>. So 190 is wrong.'),
    mc('se-020', 1, 'letters', 'Find the next letter: A, C, E, G, ?', ['I', 'H', 'J', 'K'], 'Letters jump by 2 (positions 1, 3, 5, 7). Next is position 9 = <b>I</b>.'),
    mc('se-021', 2, 'letters', 'Find the next letter: B, E, H, K, ?', ['N', 'M', 'O', 'L'], 'Positions are 2, 5, 8, 11, so we add 3 each time. The next is position 14 = <b>N</b>.'),
    mc('se-022', 2, 'letters', 'Find the next letter: Z, X, V, T, ?', ['R', 'S', 'Q', 'P'], 'Going backwards by 2: Z(26), X(24), V(22), T(20), next is 18 = <b>R</b>.'),
    mc('se-023', 2, 'letters', 'Find the next pair: AZ, BY, CX, DW, ?', ['EV', 'EU', 'FV', 'EW'], 'First letters go forward (A, B, C, D, E). Second letters go backward (Z, Y, X, W, V). Next is <b>EV</b>.'),
    mc('se-024', 3, 'letters', 'Find the next group: ACE, FHJ, KMO, ?', ['PRT', 'PQR', 'OQS', 'QSU'], 'Inside each group the letters jump by 2. Groups start at A(1), F(6), K(11), so the next starts at P(16): P, R, T = <b>PRT</b>.'),
    mc('se-025', 2, 'letters', 'Find the next letter: A, Z, B, Y, C, X, ?', ['D', 'W', 'E', 'V'], 'Alternating series: A, B, C, so next is D; and Z, Y, X. The 7th term is in the first series: <b>D</b>.'),
    mc('se-026', 3, 'growing multiplier', 'Find the next number: 2, 4, 12, 48, 240, ?', ['1440', '960', '1200', '1000'], 'Multipliers are 2, 3, 4, 5, so the next is 6: 240 × 6 = <b>1440</b>.'),
    mc('se-027', 1, 'primes', 'Find the next number: 11, 13, 17, 19, 23, ?', ['29', '25', '27', '31'], 'Consecutive primes. After 23 the next prime is <b>29</b> (25 and 27 are divisible by 5 and 3).'),
    mc('se-028', 2, 'differences', 'Find the next number: 6, 11, 21, 36, 56, ?', ['81', '76', '80', '86'], 'Gaps: 5, 10, 15, 20, so the next gap is 25. 56 + 25 = <b>81</b>.'),
    mc('se-029', 2, 'differences', 'Find the next number: 1, 2, 4, 7, 11, 16, ?', ['22', '21', '23', '24'], 'Gaps: 1, 2, 3, 4, 5 and next 6. 16 + 6 = <b>22</b>.'),
    mc('se-030', 2, 'geometric', 'Find the next number: 16, 24, 36, 54, ?', ['81', '72', '78', '90'], 'Each term is 1.5 times the one before: 54 × 1.5 = <b>81</b>. (24/16 = 36/24 = 3/2.)', 'Adding the last gap of 18 gives 72, but the gaps 8, 12, 18 are growing, so multiply.'),
    mc('se-031', 3, 'geometric', 'Find the next number: 500, 100, 20, 4, ?', ['0.8', '0.4', '1', '0.2'], 'Each term is divided by 5: 4 ÷ 5 = <b>0.8</b>.'),
    mc('se-032', 2, 'differences', 'Find the next number: 1, 3, 7, 13, 21, ?', ['31', '29', '30', '33'], 'Gaps: 2, 4, 6, 8, so the next gap is 10: 21 + 10 = <b>31</b>.'),
    mc('se-033', 2, 'fibonacci', 'Find the next number: 3, 4, 7, 11, 18, 29, ?', ['47', '45', '46', '48'], 'Each term is the sum of the previous two: 18 + 29 = <b>47</b>.'),
    mc('se-034', 3, 'pattern', 'Find the next number: 2, 12, 36, 80, 150, ?', ['252', '240', '245', '260'], 'Each term is n² × (n+1): 1²×2 = 2, 2²×3 = 12, 3²×4 = 36, 4²×5 = 80, 5²×6 = 150. Next: 6² × 7 = <b>252</b>.', 'Look at the gaps 10, 24, 44, 70: they rise unevenly, so try a product of n-based pieces.'),
    mc('se-035', 2, 'differences', 'Find the next number: 2, 3, 5, 9, 17, ?', ['33', '31', '32', '34'], 'Gaps: 1, 2, 4, 8, so the next gap is 16: 17 + 16 = <b>33</b>.'),
  ],
  gens: [
    { id: 'se-g01', type: 'mcq', level: 1, sub: 'arithmetic', ...T,
      make(rng) {
        const up = rng() < 0.7, a = up ? int(rng, 3, 40) : int(rng, 80, 150), d = up ? int(rng, 2, 13) : -int(rng, 3, 12);
        const terms = [0, 1, 2, 3, 4].map((i) => a + i * d), nxt = a + 5 * d;
        const { options, answer } = shuffleOpts(rng, nxt, [nxt + d, nxt - d, nxt + 1]);
        return { q: `Find the next number: ${terms.join(', ')}, ?`, options, answer, terms, d,
          sol: steps(`Gap between neighbours: ${terms[1]} − ${terms[0]} = ${d}.`, `It is the same each time, so add ${d} again: ${terms[4]} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = <b>${nxt}</b>.`) };
      },
      verify: (p) => p.options.indexOf(String(p.terms[0] + 5 * p.d)) },
    { id: 'se-g02', type: 'mcq', level: 2, sub: 'geometric', ...T,
      make(rng) {
        const a = int(rng, 1, 6), r = choose(rng, [2, 3, 4, 5]);
        const terms = [0, 1, 2, 3].map((i) => a * r ** i), nxt = a * r ** 4, last = terms[3];
        const { options, answer } = shuffleOpts(rng, nxt, [last + (last - terms[2]), last * (r + 1), last * r - a]);
        return { q: `Find the next number: ${terms.join(', ')}, ?`, options, answer, a, r,
          sol: steps(`${terms[1]} ÷ ${terms[0]} = ${r}, ${terms[2]} ÷ ${terms[1]} = ${r}: each term is ${r} times the last.`, `${last} × ${r} = <b>${nxt}</b>.`),
          trap: 'Adding the last gap treats it as an arithmetic series, but the gaps keep growing.' };
      },
      verify: (p) => p.options.indexOf(String(p.a * Math.pow(p.r, 4))) },
    { id: 'se-g03', type: 'mcq', level: 3, sub: 'differences', ...T,
      make(rng) {
        const s = int(rng, 1, 20), d1 = int(rng, 1, 5), e = int(rng, 1, 4);
        const t = [s]; for (let k = 1; k <= 5; k++) t.push(t[k - 1] + d1 + (k - 1) * e);
        const gaps = [1, 2, 3, 4].map((k) => t[k] - t[k - 1]), nxt = t[5];
        const { options, answer } = shuffleOpts(rng, nxt, [t[4] + gaps[3], nxt + e, nxt - e]);
        return { q: `Find the next number: ${t.slice(0, 5).join(', ')}, ?`, options, answer, s, d1, e,
          sol: steps(`Gaps: ${gaps.join(', ')}. They rise by ${e} each time.`, `Next gap = ${gaps[3] + e}.`, `${t[4]} + ${gaps[3] + e} = <b>${nxt}</b>.`),
          trap: 'Repeating the last gap ignores that the gaps are growing.' };
      },
      verify: (p) => p.options.indexOf(String(p.s + 5 * p.d1 + 10 * p.e)) },
    { id: 'se-g04', type: 'mcq', level: 2, sub: 'letters', ...T,
      make(rng) {
        const s = int(rng, 0, 25), k = int(rng, 2, 5);
        const shown = [0, 1, 2, 3].map((i) => L(s + i * k)), c = s + 4 * k;
        const { options, answer } = shuffleOpts(rng, c, [c + 1, c - 1, c + k], L);
        return { q: `Find the next letter: ${shown.join(', ')}, ?`, options, answer, s, k,
          sol: steps(`Letter positions: ${[0, 1, 2, 3].map((i) => ((s + i * k) % 26) + 1).join(', ')} (A = 1, Z = 26).`, `Each step is +${k}; the alphabet wraps round after Z.`, `Next position ${((c % 26) + 26) % 26 + 1} is <b>${L(c)}</b>.`) };
      },
      verify: (p) => p.options.indexOf(String.fromCharCode(65 + ((p.s + 4 * p.k) % 26))) },
    { id: 'se-g05', type: 'mcq', level: 3, sub: 'alternating', ...T,
      make(rng) {
        const a = int(rng, 1, 20), b = int(rng, 30, 60), d1 = int(rng, 2, 6), d2 = int(rng, 3, 9);
        const t = [a, b, a + d1, b + d2, a + 2 * d1, b + 2 * d2], nxt = a + 3 * d1;
        const { options, answer } = shuffleOpts(rng, nxt, [b + 3 * d2, nxt + d2, nxt - d1 + 1]);
        return { q: `Find the next number: ${t.join(', ')}, ?`, options, answer, a, d1,
          sol: steps(`Two series are mixed together. Odd places: ${a}, ${t[2]}, ${t[4]} (add ${d1}). Even places: ${b}, ${t[3]}, ${t[5]} (add ${d2}).`, `The 7th term is an odd place: ${t[4]} + ${d1} = <b>${nxt}</b>.`),
          trap: 'The next term of the other series is a trap: count which place you are at.' };
      },
      verify: (p) => p.options.indexOf(String(p.a + 3 * p.d1)) },
    { id: 'se-g06', type: 'mcq', level: 3, sub: 'mixed rule', ...T,
      make(rng) {
        const x0 = int(rng, 1, 5), m = choose(rng, [2, 3]), c = choose(rng, [-2, -1, 1, 2, 3]);
        const t = [x0]; for (let i = 1; i <= 4; i++) t.push(m * t[i - 1] + c);
        const { options, answer } = shuffleOpts(rng, t[4], [m * t[3], m * t[3] - c, m * t[3] + 2 * c]);
        return { q: `Find the next number: ${t.slice(0, 4).join(', ')}, ?`, options, answer, t, m, c,
          sol: steps(`Test "× ${m} then ${c > 0 ? '+' : '−'} ${Math.abs(c)}": ${t[0]} × ${m} ${c > 0 ? '+' : '−'} ${Math.abs(c)} = ${t[1]}, ${t[1]} × ${m} ${c > 0 ? '+' : '−'} ${Math.abs(c)} = ${t[2]}. It fits.`, `${t[3]} × ${m} ${c > 0 ? '+' : '−'} ${Math.abs(c)} = <b>${t[4]}</b>.`),
          trap: `Using only "× ${m}" leaves out the ${c > 0 ? '+' : '−'}${Math.abs(c)}.` };
      },
      verify: (p) => p.options.indexOf(String(p.m * p.t[3] + p.c)) },
  ],
};
