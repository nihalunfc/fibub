// CUET General Test: time and work, pipes and cisterns. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};

export default {
  topic: 'time-work',
  items: [
    mk('tw-001', 1, 'together', 'A can do a job in 10 days and B can do it in 15 days. Working together, how many days will they take?', '6 days', ['5 days', '7 days', '12 days'],
      'Per day A does 1/10 and B does 1/15. Together: 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. So <b>6 days</b>. Shortcut: (10 × 15) ÷ (10 + 15) = 150 ÷ 25 = 6.',
      'Averaging 10 and 15 (12.5) is wrong; two workers always finish faster than the quicker one.'),
    mk('tw-002', 1, 'fraction', 'A can finish a job in 12 days. After working 4 days, what fraction of the job is left?', '2/3', ['1/3', '3/4', '1/4'],
      'In 4 days A does 4/12 = 1/3. Left = 1 − 1/3 = <b>2/3</b>.',
      '1/3 is the part already done.'),
    mk('tw-003', 2, 'together', 'A and B together can do a job in 12 days. A alone can do it in 20 days. How long will B alone take?', '30 days', ['32 days', '8 days', '24 days'],
      'B\'s daily work = 1/12 − 1/20 = 5/60 − 3/60 = 2/60 = 1/30. So B alone takes <b>30 days</b>.',
      'Subtracting the days (20 − 12 = 8) does not work; subtract the daily rates.'),
    mk('tw-004', 1, 'man-days', '10 men can build a wall in 12 days. How many days will 15 men take?', '8 days', ['18 days', '10 days', '9 days'],
      'Total work = 10 × 12 = 120 man-days. With 15 men: 120 ÷ 15 = <b>8 days</b>.'),
    mk('tw-005', 2, 'man-days', '12 men working 6 hours a day finish a job in 10 days. How many days will 8 men working 10 hours a day take?', '9 days', ['10 days', '12 days', '8 days'],
      'Total work = 12 × 6 × 10 = 720 man-hours. Per day: 8 × 10 = 80 man-hours. Days = 720 ÷ 80 = <b>9</b>.'),
    mk('tw-006', 1, 'pipes', 'One pipe can fill a tank in 6 hours and another can fill it in 12 hours. How long will both together take?', '4 hours', ['4.5 hours', '3 hours', '9 hours'],
      '1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4. So <b>4 hours</b>.'),
    mk('tw-007', 2, 'pipes', 'A pipe fills a tank in 8 hours. A leak at the bottom can empty the full tank in 24 hours. If both work, how long will the tank take to fill?', '12 hours', ['16 hours', '6 hours', '10 hours'],
      'Net per hour = 1/8 − 1/24 = 3/24 − 1/24 = 2/24 = 1/12. So <b>12 hours</b>.',
      'A leak works against the pipe, so subtract its rate. Adding gives 6 hours.'),
    mk('tw-008', 2, 'partial', 'A can finish a job in 15 days and B in 10 days. A works alone for 3 days and then leaves. How many more days does B need to finish the job?', '8 days', ['7 days', '9 days', '12 days'],
      'A does 3/15 = 1/5. Left = 4/5. B does 1/10 per day, so he needs (4/5) ÷ (1/10) = <b>8 days</b>.'),
    mk('tw-009', 2, 'efficiency', 'A can do a job in 20 days. B is twice as efficient as A. How many days will they take together?', '6⅔ days', ['7 days', '15 days', '6 days'],
      'B takes 10 days. Together: 1/20 + 1/10 = 3/20 per day, so 20/3 = <b>6⅔ days</b>. In efficiency units: A = 1, B = 2, total work 20, so 20 ÷ 3.'),
    mk('tw-010', 2, 'efficiency', 'A works 3 times as fast as B. Together they finish a job in 12 days. How many days will A alone take?', '16 days', ['36 days', '48 days', '9 days'],
      'Efficiencies are 3 : 1, so together they do 4 units a day and the job is 4 × 12 = 48 units. A alone does 3 units a day: 48 ÷ 3 = <b>16 days</b>. (B alone takes 48 days.)',
      '48 days is how long B (the slower one) would take.'),
    mk('tw-011', 3, 'pipes', 'Pipe A fills a tank in 12 minutes, pipe B in 15 minutes, and pipe C empties it in 20 minutes. If all three are opened together, how long to fill the empty tank?', '10 minutes', ['8 minutes', '12 minutes', '9 minutes'],
      'Use 60 units of work (LCM). A does 5 a minute, B does 4, C removes 3. Net = 5 + 4 − 3 = 6 per minute. 60 ÷ 6 = <b>10 minutes</b>.'),
    mk('tw-012', 2, 'wages', 'A can do a job in 10 days and B in 15 days. They are paid ₹1,500 in all for doing it together. What is A\'s share?', '₹900', ['₹600', '₹750', '₹1,000'],
      'Shares are in the ratio of the work done each day: 1/10 : 1/15 = 3 : 2. A gets 3/5 × 1,500 = <b>₹900</b>.',
      'Splitting equally (₹750) ignores that A is faster and does more work.'),
    mk('tw-013', 2, 'efficiency', 'A is 20% more efficient than B. If B takes 12 days to do a job, how many days does A take?', '10 days', ['14.4 days', '9 days', '8 days'],
      'A\'s rate = 1.2 × B\'s rate, so A\'s time = 12 ÷ 1.2 = <b>10 days</b>.',
      '14.4 days comes from adding 20% to the time instead of the rate.'),
    mk('tw-014', 3, 'man-days', '20 men build 600 m of road in 30 days. How many men are needed to build 900 m in 20 days?', '45 men', ['30 men', '40 men', '60 men'],
      '600 m needs 20 × 30 = 600 man-days, so 1 m needs 1 man-day. 900 m needs 900 man-days. In 20 days: 900 ÷ 20 = <b>45 men</b>.'),
    mk('tw-015', 2, 'partial', 'A can do a job in 6 days and B in 8 days. They work together for 2 days. What fraction of the job is done?', '7/12', ['5/12', '1/2', '3/4'],
      'Per day: 1/6 + 1/8 = 4/24 + 3/24 = 7/24. In 2 days: 14/24 = <b>7/12</b>.',
      '5/12 is the fraction still left.'),
    mk('tw-016', 3, 'alternate', 'A can do a job in 12 days and B in 18 days. They work on alternate days, A starting first. In how many days is the job finished?', '15 days', ['14 days', '16 days', '18 days'],
      'Use 36 units: A does 3 a day, B does 2 a day. Every 2 days they do 5 units. After 14 days (7 pairs): 35 units. On day 15 it is A\'s turn and only 1 unit is left, so the job finishes on day <b>15</b>.',
      'Dividing 36 by 2.5 (an average day) gives 14.4, but the work is done in whole days in turns.'),
    mk('tw-017', 3, 'change in workers', '30 workers can finish a job in 40 days. After 10 days, 10 workers leave. How many days in all will the job take?', '55 days', ['50 days', '60 days', '45 days'],
      'Work is 30 × 40 = 1,200 man-days. First 10 days use 300 man-days; 900 are left. 20 workers do it in 900 ÷ 20 = 45 days. Total = 10 + 45 = <b>55 days</b>.',
      '45 is only the extra time after the first 10 days.'),
    mk('tw-018', 2, 'pipes', 'A tap fills a tank in 4 hours. Because of a leak, it takes 5 hours. How long would the leak alone take to empty the full tank?', '20 hours', ['5 hours', '9 hours', '16 hours'],
      'Leak\'s rate = 1/4 − 1/5 = 5/20 − 4/20 = 1/20. So it empties the tank in <b>20 hours</b>.',
      'The 1 extra hour does not mean the leak takes 1 hour; compare the rates.'),
    mk('tw-019', 3, 'men and women', '8 men or 12 women can finish a job in 15 days. How many days will 4 men and 6 women together take?', '15 days', ['10 days', '20 days', '12 days'],
      '8 men = 12 women, so 1 man = 1.5 women and 4 men = 6 women. Then 4 men and 6 women = 12 women, who need <b>15 days</b>.',
      'Adding "4 men + 6 women = 10 people" and rescaling gives a wrong answer; convert to one kind of worker first.'),
    mk('tw-020', 2, 'together', 'A can do one-third of a job in 4 days and B can do one-fourth of it in 3 days. How many days will they take together?', '6 days', ['12 days', '4 days', '8 days'],
      'A: 1/3 in 4 days means the whole job in 12 days. B: 1/4 in 3 days means 12 days. Together: 12 ÷ 2 = <b>6 days</b>.'),
    mk('tw-021', 3, 'together', 'A and B can finish a job in 6 days, B and C in 10 days, and A and C in 7½ days. How long will A, B and C take together?', '5 days', ['6 days', '4 days', '8 days'],
      'Add the three pair rates: 2(A + B + C) = 1/6 + 1/10 + 2/15 = 5/30 + 3/30 + 4/30 = 12/30 = 2/5. So A + B + C = 1/5 per day, giving <b>5 days</b>.',
      'Forgetting to halve the sum (each worker is counted twice) gives 2.5 days.'),
    mk('tw-022', 1, 'wages', '12 workers are each paid ₹450 a day. The job takes 8 days. What is the total wage bill?', '₹43,200', ['₹5,400', '₹36,000', '₹3,600'],
      'Total = 12 × 450 × 8. 12 × 450 = 5,400, and 5,400 × 8 = <b>₹43,200</b>.'),
    mk('tw-023', 3, 'partial', 'A can paint a house in 9 days and B in 18 days. They work together for 2 days, then A leaves. How many more days does B need to finish?', '12 days', ['9 days', '10 days', '14 days'],
      'Together per day: 1/9 + 1/18 = 3/18 = 1/6. In 2 days: 1/3 done, 2/3 left. B does 1/18 a day, so he needs (2/3) × 18 = <b>12 days</b>.',
      '14 is the total number of days, not the extra days.'),
    mk('tw-024', 1, 'together', 'A types a 60-page report in 3 hours and B in 4 hours. How many pages do they type together in one hour?', '35 pages', ['30 pages', '70 pages', '17.5 pages'],
      'A types 60 ÷ 3 = 20 pages an hour and B types 60 ÷ 4 = 15. Together: 20 + 15 = <b>35 pages</b>.'),
    mk('tw-025', 2, 'man-days', '4 pumps empty a pond in 6 hours. How long will 3 pumps take?', '8 hours', ['4.5 hours', '6 hours', '10 hours'],
      'Work = 4 × 6 = 24 pump-hours. With 3 pumps: 24 ÷ 3 = <b>8 hours</b>. Fewer pumps, more time.',
      '4.5 hours treats it as direct proportion.'),
    mk('tw-026', 2, 'together', 'Three painters take 12, 15 and 20 days respectively to paint a flat. How long will they take working together?', '5 days', ['4 days', '6 days', '8 days'],
      'Take 60 units of work: they do 5, 4 and 3 units a day, which is 12 a day. 60 ÷ 12 = <b>5 days</b>.'),
    mk('tw-027', 3, 'change in workers', '6 labourers can prepare a cricket pitch in 24 days. After 8 days, 2 more labourers join. In how many days in all is the pitch ready?', '20 days', ['18 days', '16 days', '22 days'],
      'Work = 6 × 24 = 144 man-days. In 8 days they use 48, leaving 96. With 8 labourers: 96 ÷ 8 = 12 days. Total = 8 + 12 = <b>20 days</b>.'),
    mk('tw-028', 3, 'partial', 'A can finish a job in 8 days and B in 12 days. They start together, but A leaves after 2 days and B completes the work. How many days did the whole job take?', '9 days', ['7 days', '10 days', '8 days'],
      'Per day together: 1/8 + 1/12 = 5/24. In 2 days: 10/24 = 5/12. Left = 7/12. B does 1/12 a day, so he needs 7 more days. Total = 2 + 7 = <b>9 days</b>.',
      '7 is only the number of days after A left.'),
    mk('tw-029', 1, 'man-days', '10 men can do a job in 6 days. How many days will 2 men take at the same rate?', '30 days', ['3 days', '12 days', '20 days'],
      'Work = 10 × 6 = 60 man-days. 2 men: 60 ÷ 2 = <b>30 days</b>.'),
    mk('tw-030', 3, 'efficiency', 'A is 25% more efficient than B, and together they finish a job in 20 days. How many days will A alone take?', '36 days', ['25 days', '30 days', '45 days'],
      'Efficiency of A : B = 125 : 100 = 5 : 4. Together 9 units a day, so work = 9 × 20 = 180 units. A alone: 180 ÷ 5 = <b>36 days</b> (B would take 45).'),
    mk('tw-031', 2, 'rates', 'Three machines print 1,200 pages in 4 hours. At the same rate, how many pages can 5 machines print in 6 hours?', '3,000 pages', ['2,000 pages', '3,600 pages', '2,400 pages'],
      'One machine in one hour prints 1,200 ÷ (3 × 4) = 100 pages. Five machines for 6 hours: 100 × 5 × 6 = <b>3,000 pages</b>.'),
    mk('tw-032', 3, 'pipes', 'Inlet pipe A fills a tank in 10 hours and inlet pipe B in 15 hours. Outlet pipe C empties it in 30 hours. With all three open, how long to fill the tank?', '7½ hours', ['6 hours', '8 hours', '10 hours'],
      'Use 30 units: A adds 3, B adds 2 and C removes 1 per hour. Net = 3 + 2 − 1 = 4 units an hour. 30 ÷ 4 = <b>7½ hours</b>.',
      '6 hours comes from forgetting the outlet pipe (30 ÷ 5).'),
  ],
  gens: [
    { id: 'tw-g01', type: 'mcq', level: 1, sub: 'together', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[10, 15], [12, 24], [20, 30], [15, 60], [30, 60], [6, 12], [18, 36], [40, 60], [14, 35], [24, 40]]), t = (a * b) / (a + b);
        const { options, answer } = shuffleOpts(rng, t, [(a + b) / 2, Math.min(a, b), t + 2], (v) => `${fmt(v, 2)} days`);
        return { q: `Anil can paint a wall in ${a} days and Bharat can paint it in ${b} days. Working together, how many days will they take?`, options, answer,
          sol: steps(`Per day: 1/${a} + 1/${b} = ${b + a} / ${a * b}.`, `Time together = ${a * b} ÷ ${a + b} = <b>${fmt(t, 2)} days</b>.`),
          trap: 'Together they must be faster than the faster one working alone.' };
      } },
    { id: 'tw-g02', type: 'mcq', level: 2, sub: 'together', ...T,
      make(rng) {
        const [t, a] = choose(rng, [[12, 20], [6, 10], [10, 15], [8, 12], [12, 30], [15, 20], [9, 18]]), b = (t * a) / (a - t);
        const { options, answer } = shuffleOpts(rng, b, [a - t, a + t, b + 6], (v) => `${fmt(v, 2)} days`);
        return { q: `A and B together can do a job in ${t} days. A alone takes ${a} days. How many days will B alone take?`, options, answer,
          sol: steps(`B's rate = 1/${t} − 1/${a} = ${a - t}/${t * a}.`, `B alone = ${t * a} ÷ ${a - t} = <b>${fmt(b, 2)} days</b>.`),
          trap: `Subtracting days (${a} − ${t}) is wrong; subtract the daily rates.` };
      } },
    { id: 'tw-g03', type: 'mcq', level: 1, sub: 'man-days', ...T,
      make(rng) {
        let M, D, N;
        do { M = choose(rng, [6, 8, 10, 12, 15, 20]); D = choose(rng, [9, 10, 12, 15, 18, 24]); N = choose(rng, [4, 5, 9, 12, 18, 20, 24, 30]); } while (M === N || (M * D) % N);
        const ans = (M * D) / N;
        const { options, answer } = shuffleOpts(rng, ans, [(N * D) / M, ans + 3, Math.abs(ans - 3) || 1], (v) => `${fmt(v, 2)} days`);
        return { q: `${M} labourers can lay a road in ${D} days. How many days will ${N} labourers take?`, options, answer,
          sol: steps(`Total work = ${M} × ${D} = ${M * D} man-days.`, `Days = ${M * D} ÷ ${N} = <b>${fmt(ans, 2)}</b>.`),
          trap: 'More workers means fewer days (and the other way round).' };
      } },
    { id: 'tw-g04', type: 'mcq', level: 2, sub: 'pipes', ...T,
      make(rng) {
        const [f, l] = choose(rng, [[6, 12], [8, 24], [10, 15], [12, 36], [4, 12], [9, 18], [15, 30]]), net = (f * l) / (l - f);
        const { options, answer } = shuffleOpts(rng, net, [(f * l) / (l + f), f + l, net + 2], (v) => `${fmt(v, 2)} hours`);
        return { q: `A pipe fills a tank in ${f} hours. A leak can empty the full tank in ${l} hours. If both work together, how long will the tank take to fill?`, options, answer,
          sol: steps(`Net rate = 1/${f} − 1/${l} = ${l - f}/${f * l}.`, `Time = ${f * l} ÷ ${l - f} = <b>${fmt(net, 2)} hours</b>.`),
          trap: 'The leak works against the pipe, so its rate is subtracted.' };
      } },
    { id: 'tw-g05', type: 'mcq', level: 2, sub: 'partial', ...T,
      make(rng) {
        const [a, b, x] = choose(rng, [[12, 18, 4], [15, 10, 3], [10, 20, 2], [16, 24, 4], [30, 15, 6], [20, 8, 5]]), left = (1 - x / a) * b;
        const { options, answer } = shuffleOpts(rng, left, [b - x, x * b / a, left + 2], (v) => `${fmt(v, 2)} days`);
        return { q: `A can finish a job in ${a} days and B in ${b} days. A works alone for ${x} days and leaves. How many more days does B need to finish the job?`, options, answer,
          sol: steps(`A does ${x}/${a} of the job, so ${fmt(1 - x / a, 4)} is left.`, `B takes ${fmt(1 - x / a, 4)} × ${b} = <b>${fmt(left, 2)} days</b>.`),
          trap: 'First work out the fraction left, then use B\'s full-job time.' };
      } },
    { id: 'tw-g06', type: 'mcq', level: 2, sub: 'wages', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[10, 15], [12, 18], [6, 12], [8, 12], [15, 30]]), W = int(rng, 1, 5) * 1500, share = (W * b) / (a + b);
        const { options, answer } = shuffleOpts(rng, share, [W / 2, (W * a) / (a + b), share + 100], (v) => rs(v, 0));
        return { q: `A and B can do a job alone in ${a} and ${b} days. Working together they are paid ${rs(W, 0)}. What is A's share?`, options, answer,
          sol: steps(`Shares follow the daily work: 1/${a} : 1/${b} = ${b} : ${a}.`, `A gets ${b}/${a + b} of ${fmt(W, 0)} = <b>${rs(share, 0)}</b>.`),
          trap: 'The one who takes fewer days is faster and earns the larger share.' };
      } },
    { id: 'tw-g07', type: 'mcq', level: 2, sub: 'together', ...T,
      make(rng) {
        const [a, b, c] = choose(rng, [[12, 15, 20], [10, 15, 30], [6, 12, 12], [20, 30, 60], [8, 16, 16], [12, 24, 24], [18, 36, 36]]), t = 1 / (1 / a + 1 / b + 1 / c);
        const { options, answer } = shuffleOpts(rng, +t.toFixed(2), [(a + b + c) / 3, Math.min(a, b, c) / 2, t + 2], (v) => `${fmt(v, 2)} days`);
        return { q: `Three friends can clean a hall in ${a}, ${b} and ${c} days respectively. How many days will they take together?`, options, answer,
          sol: steps(`Rates per day: 1/${a} + 1/${b} + 1/${c} = ${fmt(1 / t, 4)}.`, `Time = <b>${fmt(t, 2)} days</b>.`),
          trap: 'Averaging the three times is wrong; add the rates, not the days.' };
      } },
  ],
};
