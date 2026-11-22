// Round 4 extras for part-a-aptitude (CSIR NET Part A): original questions, written 2026-11-22. Single-answer MCQs,
// as in the real Part A.
import { int, choose, mcqOptions } from '../_util.js';
const R = String.raw;

// A time of day, from minutes after noon, as "h:mm pm".
const clock = (m) => { const t = Math.round(m), h = Math.floor(t / 60), mm = t % 60; return `${h === 0 ? 12 : h}:${String(mm).padStart(2, '0')} pm`; };

export default {
  items: [
    { id: 'apt-r4-01', type: 'mcq', level: 1, exams: ['net'], sub: 'number series', format: 'single',
      q: 'Find the next term: 4, 8, 6, 12, 10, 20, ?',
      options: ['18', '40', '22', '16'], answer: 0,
      sol: R`Two operations take turns: double, then subtract 2. $4\times2 = 8$, $8 - 2 = 6$, $6\times2 = 12$, $12 - 2 = 10$, $10\times2 = 20$, so next $20 - 2 = 18$.`,
      trap: '40 doubles again; check whether the steps alternate before assuming one rule.' },
    { id: 'apt-r4-02', type: 'mcq', level: 1, exams: ['net'], sub: 'data interpretation', format: 'single',
      q: "A country's exports over three successive years were 40, 50 and 60 (billion rupees), and its imports were 50, 55 and 48. In which year were its exports the largest percentage of its imports?",
      options: ['the first year', 'the second year', 'the third year', 'the same in all three years'], answer: 2,
      sol: R`Exports as a percentage of imports: $40/50 = 80\%$, $50/55 \approx 90.9\%$, $60/48 = 125\%$. The third year is largest (it is also the only year with a trade surplus).`,
      trap: 'Compare the ratio each year, not the change in exports alone.' },
    { id: 'apt-r4-03', type: 'mcq', level: 2, exams: ['net'], sub: 'rates', format: 'single',
      q: 'A train 150 m long running at 54 km/h meets a train 100 m long running at 36 km/h on a parallel track, in the opposite direction. How long do they take to pass each other completely?',
      options: ['50 s', '5 s', '6 s', '10 s'], answer: 3,
      sol: R`Moving towards each other, the relative speed is $54 + 36 = 90$ km/h $= 25$ m/s. To pass completely, the fronts must separate by both lengths: $150 + 100 = 250$ m. Time $= 250/25 = 10$ s.`,
      trap: '50 s uses the difference of the speeds, which is right only for trains going the same way.' },
    { id: 'apt-r4-04', type: 'mcq', level: 2, exams: ['net'], sub: 'counting', format: 'single',
      q: 'A knockout tennis tournament starts with 64 players; each match has one loser, who leaves. How many matches are played to find the champion?',
      options: ['32', '63', '64', '126'], answer: 1,
      sol: R`Every match removes exactly one player, and all players but the champion must be removed: $64 - 1 = 63$ matches. (Round by round: $32 + 16 + 8 + 4 + 2 + 1 = 63$.)`,
      trap: '32 counts only the first round.' },
    { id: 'apt-r4-05', type: 'mcq', level: 2, exams: ['net'], sub: 'percentages', format: 'single',
      q: 'A sum of 20 000 rupees is lent for 2 years at 5% per year. By how much does the compound interest (compounded yearly) exceed the simple interest?',
      options: ['50 rupees', '100 rupees', 'nothing', '25 rupees'], answer: 0,
      sol: R`Simple interest: $2\times1000 = 2000$. Compound: $20000(1.05^2 - 1) = 20000\times0.1025 = 2050$. The difference, 50, is the interest earned in the second year on the first year's interest: $1000\times5\% = 50$ (in general $Pr^2$ for two years).`,
      trap: 'Over one year the two are equal; the gap only starts in the second year.' },
    { id: 'apt-r4-06', type: 'mcq', level: 3, exams: ['net'], sub: 'logical reasoning', format: 'single',
      q: "Six friends A, B, C, D, E and F sit round a circular table, facing the centre, equally spaced. A sits opposite D. B sits immediately to A's left. E sits immediately to D's right. C does not sit next to D. Who sits opposite B?",
      options: ['C', 'E', 'F', 'A'], answer: 2,
      sol: R`Number the seats 1 to 6 going round to the left (for people facing the centre, a person's left neighbour is the next seat in that direction). A = 1, so D = 4 (opposite). B is to A's left: B = 2. E is to D's right: E = 3. C and F take seats 5 and 6; C must not be next to D (seats 3 and 5), so C = 6 and F = 5. Opposite B (seat 2) is seat 5: F.`,
      trap: "For people facing the centre, left and right are reversed compared with looking down at the table from one side; fix the direction once and stick to it." },
    { id: 'apt-r4-07', type: 'mcq', level: 3, exams: ['net'], sub: 'probability', format: 'single',
      q: 'A bag holds 3 red and 5 blue balls. Two balls are taken out together at random. The probability that they are of different colours is',
      options: ['15/32', '15/56', '1/2', '15/28'], answer: 3,
      sol: R`Number of pairs: $\binom82 = 28$. Pairs with one of each: $3\times5 = 15$. Probability $= 15/28$. (Equivalently, $2\times\tfrac38\times\tfrac57$: red then blue, or blue then red.)`,
      trap: '15/32 is the answer with replacement; 15/56 counts only red-then-blue.' },
    { id: 'apt-r4-08', type: 'mcq', level: 3, exams: ['net'], sub: 'numbers', format: 'single',
      q: R`What is the remainder when $7^{100}$ is divided by 5?`,
      options: ['2', '4', '1', '3'], answer: 2,
      sol: R`$7 \equiv 2 \pmod 5$, and the powers of 2 leave remainders 2, 4, 3, 1, then repeat every 4. Since $100 = 4\times25$, $7^{100} \equiv (2^4)^{25} \equiv 1^{25} = 1$. (Equivalently, the last digits of $7^n$ cycle 7, 9, 3, 1, so $7^{100}$ ends in 1.)`,
      trap: 'Find the cycle of remainders first; never try to compute the power.' },
    { id: 'apt-r4-09', type: 'mcq', level: 4, exams: ['net'], sub: 'clocks', format: 'single',
      q: 'A clock gains 5 minutes every hour. It is set to the right time at 12 noon. When it shows 6:00 pm the same day, the correct time is about',
      options: ['5:30 pm', '5:32 pm', '5:35 pm', '6:30 pm'], answer: 1,
      sol: R`The clock moves 65 minutes for every 60 real minutes. It has moved 360 minutes, so the real time passed is $360\times\tfrac{60}{65} = 332.3$ minutes $= 5$ h $32$ min. The correct time is about 5:32 pm.`,
      trap: '5:30 pm takes off 5 minutes for each of the 6 hours on the clock face, but the clock\'s hours are shorter than real hours.' },
    { id: 'apt-r4-10', type: 'mcq', level: 4, exams: ['net'], sub: 'counting', format: 'single',
      q: 'How many three-digit numbers have digits that add up to 5?',
      options: ['21', '15', '10', '12'], answer: 1,
      sol: R`Write the number as $abc$ with $a \ge 1$. Put $a' = a - 1 \ge 0$: then $a' + b + c = 4$ with all three at least 0 (and none can exceed 9 here). The number of solutions is $\binom{4 + 2}{2} = 15$. (They run from 104, 113, ... up to 500.)`,
      trap: '21 also counts "numbers" starting with 0, such as 050, which are not three-digit numbers.' },
  ],
  gens: [
    { id: 'apt-r4g1', type: 'mcq', level: 2, exams: ['net'], sub: 'number series', format: 'single',
      make(rng) {
        const s = int(rng, 2, 9), a = choose(rng, [2, 3]), b = int(rng, 1, Math.min(5, s * a - 1)), add = rng() < 0.5;
        const t = [s];
        for (let i = 1; i < 7; i++) t.push(i % 2 ? t[i - 1] * a : add ? t[i - 1] + b : t[i - 1] - b);
        const ans = t[6], shown = t.slice(0, 6).join(', ');
        const o = mcqOptions(rng, ans, [t[5] * a, add ? t[5] - b : t[5] + b, ans + 2 * b, ans - 1]);
        return { q: `Find the next term: ${shown}, ?`, ...o, s, a, b, ans,
          sol: `The steps take turns: multiply by ${a}, then ${add ? 'add' : 'subtract'} ${b}. The last step was a multiplication, so next ${add ? 'add' : 'subtract'} ${b}: $${t[5]} ${add ? '+' : '-'} ${b} = ${ans}$.`,
          trap: 'Check whether two rules alternate before assuming a single pattern.' };
      },
      verify: (p) => p.ans },
    { id: 'apt-r4g2', type: 'mcq', level: 2, exams: ['net'], sub: 'counting', format: 'single',
      make(rng) {
        const n = int(rng, 6, 40), ko = rng() < 0.5;
        const ans = ko ? n - 1 : (n * (n - 1)) / 2;
        const o = mcqOptions(rng, ans, ko ? [n, n / 2 | 0, n * (n - 1) / 2] : [n * (n - 1), n - 1, n * n / 2 | 0]);
        return { q: ko ? `A knockout tournament starts with ${n} players (byes are allowed where needed); each match has one loser, who leaves. How many matches are played to find the champion?` : `In a league, each of ${n} teams plays every other team exactly once. How many matches are played in all?`,
          ...o, n, ko: ko ? 1 : 0, ans,
          sol: ko ? `Each match removes exactly one player, and all but the champion must go: $${n} - 1 = ${ans}$ matches.` : `Each match is a pair of teams: $\\binom{${n}}{2} = \\dfrac{${n}\\times${n - 1}}{2} = ${ans}$.`,
          trap: ko ? 'Byes do not change the count: every player but one must lose once.' : 'Counting each team\'s games and adding counts every match twice.' };
      },
      verify: (p) => (p.ko ? p.n - 1 : (p.n * (p.n - 1)) / 2) },
    { id: 'apt-r4g3', type: 'mcq', level: 4, exams: ['net'], sub: 'clocks', format: 'single',
      make(rng) {
        const gain = choose(rng, [2, 3, 4, 5, 6, 10, 12]), fast = rng() < 0.6, h = int(rng, 2, 9);
        const shown = h * 60, real = fast ? (shown * 60) / (60 + gain) : (shown * 60) / (60 - gain);
        const ans = clock(real);
        const o = mcqOptions(rng, ans, [clock(fast ? shown - gain * h : shown + gain * h), clock(fast ? shown + gain * h : shown - gain * h), clock(fast ? (shown * (60 - gain)) / 60 : (shown * (60 + gain)) / 60), clock(real + 3)]);
        return { q: `A clock ${fast ? 'gains' : 'loses'} ${gain} minutes every hour. It is set to the right time at 12 noon. When it shows ${clock(shown)} the same day, the correct time is about`,
          ...o, gain, fast: fast ? 1 : 0, h,
          sol: `The clock moves ${fast ? 60 + gain : 60 - gain} minutes for every 60 real minutes. It has moved ${shown} minutes, so the real time passed is $${shown}\\times\\tfrac{60}{${fast ? 60 + gain : 60 - gain}} = ${Math.round(real * 10) / 10}$ minutes: about ${ans}.`,
          trap: `Taking ${gain} minutes off (or on) for each hour on the clock face uses the clock's hours, not real hours.` };
      },
      verify: (p) => (p.h * 60 * 60) / (p.fast ? 60 + p.gain : 60 - p.gain) },
  ],
};
