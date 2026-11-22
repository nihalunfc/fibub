// CUET General Test: simple and compound interest. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};

export default {
  topic: 'interest',
  items: [
    mk('si-001', 1, 'simple', 'What is the simple interest on ₹5,000 at 8% per annum for 3 years?', '₹1,200', ['₹1,000', '₹1,600', '₹120'],
      'SI = P × R × T ÷ 100 = 5,000 × 8 × 3 ÷ 100 = <b>₹1,200</b>. Shortcut: 8% of 5,000 is ₹400 a year, and 3 × 400 = 1,200.'),
    mk('si-002', 2, 'rate', 'A sum of ₹4,000 becomes ₹4,960 in 3 years at simple interest. What is the rate per annum?', '8%', ['6%', '7%', '10%'],
      'Interest = 4,960 − 4,000 = ₹960. R = SI × 100 ÷ (P × T) = 960 × 100 ÷ (4,000 × 3) = <b>8%</b>.',
      'The amount (4,960) is not the interest; subtract the principal first.'),
    mk('si-003', 2, 'time', 'In how many years will ₹5,000 earn ₹1,500 as simple interest at 6% per annum?', '5 years', ['4 years', '6 years', '3 years'],
      'Interest per year = 6% of 5,000 = ₹300. Years = 1,500 ÷ 300 = <b>5</b>.'),
    mk('si-004', 2, 'principal', 'A bank paid ₹720 simple interest in 4 years at 6% a year. What was the principal?', '₹3,000', ['₹2,880', '₹3,600', '₹4,320'],
      'P = SI × 100 ÷ (R × T) = 720 × 100 ÷ (6 × 4) = 72,000 ÷ 24 = <b>₹3,000</b>. Check: 6% of 3,000 = 180 a year and 4 years gives 720.'),
    mk('si-005', 2, 'compound', 'What is the compound interest on ₹10,000 at 10% per annum for 2 years (compounded yearly)?', '₹2,100', ['₹2,000', '₹2,200', '₹1,210'],
      'Year 1: 10,000 → 11,000. Year 2: 11,000 → 12,100. CI = 12,100 − 10,000 = <b>₹2,100</b>. Shortcut: 1.1² = 1.21.',
      '₹2,000 is the simple interest; compounding adds interest on interest.'),
    mk('si-006', 2, 'difference', 'What is the difference between the compound interest and simple interest on ₹5,000 at 10% per annum for 2 years?', '₹50', ['₹100', '₹500', '₹25'],
      'For 2 years the difference is P × (R/100)² = 5,000 × (0.1)² = 5,000 × 0.01 = <b>₹50</b>. (SI = 1,000, CI = 1,050.)'),
    mk('si-007', 2, 'doubling', 'A sum doubles itself in 5 years at simple interest. What is the rate per annum?', '20%', ['10%', '5%', '25%'],
      'Doubling means the interest equals the principal: P = P × R × 5 ÷ 100, so R = 100 ÷ 5 = <b>20%</b>.',
      '25% comes from dividing by 4 (a mix-up with tripling).'),
    mk('si-008', 3, 'doubling', 'At simple interest a sum doubles in 10 years. In how many years will it become three times itself?', '20 years', ['15 years', '30 years', '25 years'],
      'Doubling in 10 years means the interest equals P in 10 years, so P earns P/10 each year. To become 3P the interest must be 2P, which takes 2 × 10 = <b>20 years</b>.',
      '15 years assumes the sum "grows by 1 more P in 5 years", but each P of growth takes 10 years.'),
    mk('si-009', 2, 'compound', 'What is the amount on ₹8,000 at 5% per annum compound interest after 2 years?', '₹8,820', ['₹8,800', '₹8,400', '₹8,810'],
      '8,000 × 1.05 = 8,400. Then 8,400 × 1.05 = <b>₹8,820</b>. (Or 8,000 × 1.1025.)',
      '₹8,800 is the amount at simple interest.'),
    mk('si-010', 2, 'months', 'What is the simple interest on ₹2,500 at 12% per annum for 8 months?', '₹200', ['₹300', '₹240', '₹2,400'],
      'Convert 8 months to years: 8/12 = 2/3. SI = 2,500 × 12 × (2/3) ÷ 100 = 2,500 × 8 ÷ 100 = <b>₹200</b>.',
      'Using 8 as the time in years would give ₹2,400.'),
    mk('si-011', 1, 'amount', 'What is the amount if ₹6,000 is lent at 5% simple interest for 2 years?', '₹6,600', ['₹600', '₹6,500', '₹6,300'],
      'SI = 6,000 × 5 × 2 ÷ 100 = ₹600. Amount = principal + interest = 6,000 + 600 = <b>₹6,600</b>.',
      '₹600 is only the interest.'),
    mk('si-012', 3, 'half-yearly', 'What is the amount on ₹4,000 at 20% per annum for one year, if the interest is compounded half-yearly?', '₹4,840', ['₹4,800', '₹4,400', '₹4,880'],
      'Half-yearly: rate = 10% per half-year and 2 periods. 4,000 × 1.1 × 1.1 = 4,000 × 1.21 = <b>₹4,840</b>.',
      '₹4,800 is the amount at yearly compounding, which is the same as simple interest for one year.'),
    mk('si-013', 3, 'multiple', 'At 8% simple interest per annum, in how many years will a sum become three times itself?', '25 years', ['20 years', '30 years', '12.5 years'],
      'To become 3P the interest must be 2P. Interest per year = 8% of P. Years = 200 ÷ 8 = <b>25</b>.'),
    mk('si-014', 3, 'two rates', 'A man lends ₹9,000 in two parts, one at 6% and the other at 10% simple interest. His total interest in a year is ₹700. How much was lent at 6%?', '₹5,000', ['₹4,000', '₹6,000', '₹3,000'],
      'If all ₹9,000 were at 6%, interest would be ₹540. Actual is ₹700, which is ₹160 more. Each rupee moved to 10% adds 4 paise, so ₹160 ÷ 0.04 = ₹4,000 is at 10%. At 6%: 9,000 − 4,000 = <b>₹5,000</b>. Check: 300 + 400 = 700.',
      '₹4,000 is the part lent at 10%.'),
    mk('si-015', 3, 'difference', 'The simple interest on a sum for 2 years is ₹600 and the compound interest is ₹630. What is the rate of interest?', '10%', ['5%', '15%', '20%'],
      'SI per year = ₹300. The CI − SI for 2 years is interest on the first year\'s interest: 30 = 300 × R ÷ 100, so R = <b>10%</b>. (Principal ₹3,000.)'),
    mk('si-016', 2, 'simple', 'What is the simple interest on ₹12,000 at 7.5% per annum for 2 years?', '₹1,800', ['₹900', '₹1,500', '₹1,860'],
      '7.5% of 12,000 = 900 a year. For 2 years: <b>₹1,800</b>.',
      '₹900 is only one year of interest.'),
    mk('si-017', 3, 'principal', 'A sum amounts to ₹11,800 in 3 years at 6% simple interest per annum. What is the sum?', '₹10,000', ['₹9,500', '₹10,800', '₹11,000'],
      'Interest rate over 3 years = 18%, so amount = 1.18 × P. P = 11,800 ÷ 1.18 = <b>₹10,000</b>. Check: 18% of 10,000 = 1,800.',
      '₹9,500 takes 18% off the amount, which is the wrong base.'),
    mk('si-018', 2, 'compound', 'What is the compound interest on ₹1,000 at 10% per annum for 3 years?', '₹331', ['₹300', '₹330', '₹1,331'],
      '1,000 → 1,100 → 1,210 → 1,331. Interest = 1,331 − 1,000 = <b>₹331</b>.',
      '₹1,331 is the amount, not the interest.'),
    mk('si-019', 1, 'time', 'The simple interest on ₹1,500 at 6% a year is ₹90. For how many months was the money kept?', '12 months', ['6 months', '9 months', '15 months'],
      'Interest per year = 6% of 1,500 = ₹90. So the time is exactly 1 year = <b>12 months</b>.'),
    mk('si-020', 1, 'concept', 'For the first year, compound interest compared with simple interest on the same sum and rate is:', 'the same', ['more', 'less', 'double'],
      'In year 1 both are P × R ÷ 100; the difference appears only from year 2, when interest is earned on interest. So it is <b>the same</b>.'),
    mk('si-021', 2, 'months', 'What is the simple interest on ₹50,000 at 6% per annum for 9 months?', '₹2,250', ['₹3,000', '₹4,500', '₹2,700'],
      '9 months = 3/4 year. SI = 50,000 × 6 × 0.75 ÷ 100 = 3,000 × 0.75 = <b>₹2,250</b>.',
      '₹3,000 is a full year\'s interest.'),
    mk('si-022', 2, 'growth', 'A village has 20,000 people and the population grows 5% each year. What will it be after 2 years?', '22,050', ['22,000', '21,000', '22,500'],
      '20,000 × 1.05 = 21,000, then × 1.05 = <b>22,050</b>. Population grows like compound interest.',
      '22,000 is simple growth (5% of the original twice).'),
    mk('si-023', 2, 'depreciation', 'A machine worth ₹50,000 loses 10% of its value each year. What is its value after 2 years?', '₹40,500', ['₹40,000', '₹45,000', '₹41,000'],
      'Each year the value is × 0.9: 50,000 × 0.9 × 0.9 = 50,000 × 0.81 = <b>₹40,500</b>.',
      '₹40,000 assumes a flat 10% of the original value each year.'),
    mk('si-024', 3, 'rate', '₹10,000 becomes ₹12,100 in 2 years at compound interest (yearly). What is the rate per annum?', '10%', ['11%', '10.5%', '20%'],
      'Growth factor over 2 years = 12,100 ÷ 10,000 = 1.21 = 1.1². So each year × 1.1: <b>10%</b>.',
      '21% over two years is not 10.5% a year; it compounds.'),
    mk('si-025', 3, 'time', 'In how many years will ₹5,000 become ₹7,200 at 20% per annum compound interest?', '2 years', ['1 year', '3 years', '4 years'],
      '7,200 ÷ 5,000 = 1.44 = 1.2 × 1.2, so <b>2 years</b>. (5,000 → 6,000 → 7,200.)'),
    mk('si-026', 2, 'amount', 'What will ₹15,000 amount to in 5 years at 8% per annum simple interest?', '₹21,000', ['₹6,000', '₹20,200', '₹22,000'],
      'SI = 15,000 × 8 × 5 ÷ 100 = ₹6,000. Amount = <b>₹21,000</b>.',
      '₹6,000 is the interest, not the amount.'),
    mk('si-027', 3, 'difference', 'What is the difference between compound and simple interest on ₹8,000 at 5% per annum for 2 years?', '₹20', ['₹40', '₹400', '₹10'],
      'Difference = P × (R/100)² = 8,000 × 0.0025 = <b>₹20</b>. Check: SI = 800, CI = 8,000 × 0.1025 = 820.'),
    mk('si-028', 2, 'amount', 'Anil borrows ₹20,000 at 9% simple interest per annum. How much must he pay back after 2 years?', '₹23,600', ['₹21,800', '₹23,000', '₹23,200'],
      'SI = 20,000 × 9 × 2 ÷ 100 = ₹3,600. Total = 20,000 + 3,600 = <b>₹23,600</b>.'),
    mk('si-029', 3, 'simple', 'What is the simple interest on ₹7,500 at 4% per annum for 2 years 6 months?', '₹750', ['₹600', '₹900', '₹720'],
      '2 years 6 months = 2.5 years. SI = 7,500 × 4 × 2.5 ÷ 100 = <b>₹750</b>.',
      'Writing 2 years 6 months as 2.6 years gives ₹780.'),
    mk('si-030', 3, 'equal interest', 'The simple interest on ₹2,400 at 5% for a certain time equals the interest on a second sum at 4% for the same time. What is the second sum?', '₹3,000', ['₹1,920', '₹2,000', '₹3,600'],
      'With the same time, P × R must be equal: 2,400 × 5 = x × 4, so x = 12,000 ÷ 4 = <b>₹3,000</b>. A lower rate needs a bigger sum.',
      '₹1,920 comes from multiplying by 4 ÷ 5 instead of 5 ÷ 4.'),
    mk('si-031', 3, 'doubling', 'At simple interest a sum becomes 3 times itself in 12 years. What is the rate per annum?', '16⅔%', ['25%', '12.5%', '20%'],
      'Becoming 3P means interest = 2P. So 2P = P × R × 12 ÷ 100, giving R = 200 ÷ 12 = 16.67% = <b>16⅔%</b>.',
      '25% comes from using 100 × 3 ÷ 12 instead of the interest 2P.'),
    mk('si-032', 3, 'compound', '₹3,000 is invested at 10% per annum compound interest. How much interest is earned in the second year alone?', '₹330', ['₹300', '₹310', '₹363'],
      'After year 1 the amount is 3,000 × 1.1 = ₹3,300. Interest in year 2 = 10% of 3,300 = <b>₹330</b>.',
      '₹300 is the first year\'s interest.'),
  ],
  gens: [
    { id: 'si-g01', type: 'mcq', level: 1, sub: 'simple', ...T,
      make(rng) {
        const P = pick(rng, 2000, 20000, 1000), r = choose(rng, [4, 5, 6, 8, 10, 12]), t = int(rng, 2, 6), si = P * r * t / 100;
        const { options, answer } = shuffleOpts(rng, si, [P * r / 100, si + P * r / 100, P + si], (v) => rs(v, 0));
        return { q: `What is the simple interest on ${rs(P, 0)} at ${r}% per annum for ${t} years?`, options, answer,
          sol: steps(`SI = P × R × T ÷ 100.`, `= ${fmt(P, 0)} × ${r} × ${t} ÷ 100 = <b>${rs(si, 0)}</b>.`),
          trap: `${rs(P * r / 100, 0)} is only one year\'s interest.` };
      } },
    { id: 'si-g02', type: 'mcq', level: 2, sub: 'rate', ...T,
      make(rng) {
        const P = pick(rng, 2000, 20000, 1000), r = choose(rng, [4, 5, 6, 8, 10, 12]), t = int(rng, 2, 6), si = P * r * t / 100;
        const { options, answer } = shuffleOpts(rng, r, [r + 2, r - 1, +(((P + si) * 100) / (P * t)).toFixed(2)], (v) => `${fmt(v, 2)}%`);
        return { q: `A sum of ${rs(P, 0)} grows to ${rs(P + si, 0)} in ${t} years at simple interest. What is the rate per annum?`, options, answer,
          sol: steps(`Interest = ${fmt(P + si, 0)} − ${fmt(P, 0)} = ${rs(si, 0)}.`, `R = ${fmt(si, 0)} × 100 ÷ (${fmt(P, 0)} × ${t}) = <b>${r}%</b>.`),
          trap: 'The amount includes the principal; take the principal away first.' };
      } },
    { id: 'si-g03', type: 'mcq', level: 2, sub: 'principal', ...T,
      make(rng) {
        const P = pick(rng, 2000, 25000, 500), r = choose(rng, [4, 5, 6, 8, 10]), t = int(rng, 2, 5), si = P * r * t / 100;
        const { options, answer } = shuffleOpts(rng, P, [si * 10, P + si, P - si / 2], (v) => rs(v, 0));
        return { q: `A bank paid ${rs(si, 0)} as simple interest in ${t} years at ${r}% per annum. What was the principal?`, options, answer,
          sol: steps(`P = SI × 100 ÷ (R × T) = ${fmt(si, 0)} × 100 ÷ (${r} × ${t}).`, `= ${fmt(si * 100, 0)} ÷ ${r * t} = <b>${rs(P, 0)}</b>.`) };
      } },
    { id: 'si-g04', type: 'mcq', level: 2, sub: 'compound', ...T,
      make(rng) {
        const P = int(rng, 1, 10) * 2000, r = choose(rng, [5, 10, 15, 20]), A = P * (1 + r / 100) ** 2, ci = +(A - P).toFixed(2), si = P * r * 2 / 100;
        const { options, answer } = shuffleOpts(rng, ci, [si, A, ci + P * r / 1000], (v) => rs(v, 0));
        return { q: `What is the compound interest on ${rs(P, 0)} at ${r}% per annum for 2 years (compounded yearly)?`, options, answer,
          sol: steps(`Amount = ${fmt(P, 0)} × ${1 + r / 100} × ${1 + r / 100} = ${fmt(A, 0)}.`, `CI = ${fmt(A, 0)} − ${fmt(P, 0)} = <b>${rs(ci, 0)}</b>.`),
          trap: `${rs(si, 0)} is the simple interest; it is smaller because it skips interest on interest.` };
      } },
    { id: 'si-g05', type: 'mcq', level: 3, sub: 'difference', ...T,
      make(rng) {
        const P = int(rng, 1, 10) * 2000, r = choose(rng, [5, 10, 20]), d = +(P * (r / 100) ** 2).toFixed(2);
        const { options, answer } = shuffleOpts(rng, d, [d * 2, d * 10, d / 2], (v) => rs(v, 0));
        return { q: `What is the difference between the compound interest and the simple interest on ${rs(P, 0)} at ${r}% per annum for 2 years?`, options, answer,
          sol: steps(`For 2 years, CI − SI = P × (R ÷ 100)².`, `= ${fmt(P, 0)} × (${r} ÷ 100)² = <b>${rs(d, 0)}</b>.`),
          trap: 'The difference is the interest earned on the first year\'s interest.' };
      } },
    { id: 'si-g06', type: 'mcq', level: 3, sub: 'doubling', ...T,
      make(rng) {
        const n = choose(rng, [4, 5, 8, 10, 20]), k = choose(rng, [3, 4]), yrs = (k - 1) * n;
        const { options, answer } = shuffleOpts(rng, yrs, [k * n, yrs + n, n + (k - 2)], (v) => `${v} years`);
        return { q: `At simple interest a sum doubles in ${n} years. In how many years will it become ${k} times itself?`, options, answer,
          sol: steps(`Doubling needs interest = P, which takes ${n} years.`, `To become ${k} times, the interest must be ${k - 1}P, so the time is ${k - 1} × ${n} = <b>${yrs} years</b>.`),
          trap: `${k * n} years multiplies by ${k} instead of by (${k} − 1).` };
      } },
    { id: 'si-g07', type: 'mcq', level: 2, sub: 'months', ...T,
      make(rng) {
        const P = int(rng, 5, 40) * 1000, r = choose(rng, [6, 8, 10, 12]), m = choose(rng, [3, 6, 9]), si = P * r * m / 1200;
        const { options, answer } = shuffleOpts(rng, si, [P * r / 100, si * 12 / 10, si + P * r / 1200], (v) => rs(v, 0));
        return { q: `What is the simple interest on ${rs(P, 0)} at ${r}% per annum for ${m} months?`, options, answer,
          sol: steps(`${m} months = ${m}/12 of a year.`, `SI = ${fmt(P, 0)} × ${r} × ${m} ÷ 1,200 = <b>${rs(si, 0)}</b>.`),
          trap: `${rs(P * r / 100, 0)} is a full year of interest.` };
      } },
  ],
};
