// Live problems for CUET (UG) preparation. Each make(rand) returns { q, answer, unit, tol (relative), abs?, hint,
// solution } as small HTML; `verify` recomputes the answer another way for tests/cuet.mjs. Placed in a lesson as
// <div class="problem" data-problem="id"></div>. Pattern: 50 questions, +5 right, −1 wrong (NTA bulletin, checked 2026-11-22).
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {

  // ---------- Module 10: accountancy ----------
  'interest-drawings': {
    title: 'interest on equal monthly drawings',
    make(r) {
      const m = pick(r, 2, 10) * 1000, rate = [6, 8, 9, 10, 12][pick(r, 0, 4)], when = ['beginning', 'middle', 'end'][pick(r, 0, 2)];
      const months = { beginning: 6.5, middle: 6, end: 5.5 }[when], answer = (m * 12 * rate * months) / (100 * 12);
      return {
        q: `<p>A partner draws ₹${m.toLocaleString('en-IN')} at the <b>${when}</b> of every month for a year. Interest on drawings is ${rate}% a year. How much interest is charged (₹)?</p>`,
        answer, unit: '₹', tol: 0, abs: 0.01,
        hint: 'Total drawings × rate × average period ÷ 12. Average period: beginning 6.5, middle 6, end 5.5 months.',
        solution: steps(`Total drawings = ${m} × 12 = ₹${(m * 12).toLocaleString('en-IN')}.`, `Average period for drawings at the ${when} of each month = ${months} months.`, `Interest = ${m * 12} × ${rate}/100 × ${months}/12 = <b>₹${answer.toLocaleString('en-IN')}</b>.`), m, rate, months,
      };
    },
    verify: (p) => p.m * p.rate * p.months / 100,
  },
  'super-profit': {
    title: 'goodwill by the super profit method',
    make(r) {
      const cap = pick(r, 2, 10) * 100000, nr = [8, 10, 12, 15][pick(r, 0, 3)], extra = pick(r, 1, 6) * 10000, avg = (cap * nr) / 100 + extra, yrs = pick(r, 2, 4);
      const answer = extra * yrs;
      return {
        q: `<p>A firm's capital employed is ₹${cap.toLocaleString('en-IN')}, the normal rate of return is ${nr}%, and its average profit is ₹${avg.toLocaleString('en-IN')}. Find goodwill at ${yrs} years' purchase of super profit (₹).</p>`,
        answer, unit: '₹', tol: 0, abs: 0.01,
        hint: 'Normal profit = capital × normal rate. Super profit = average profit − normal profit. Goodwill = super profit × years.',
        solution: steps(`Normal profit = ${cap} × ${nr}% = ₹${((cap * nr) / 100).toLocaleString('en-IN')}.`, `Super profit = ${avg} − ${(cap * nr) / 100} = ₹${extra.toLocaleString('en-IN')}.`, `Goodwill = ${extra} × ${yrs} = <b>₹${answer.toLocaleString('en-IN')}</b>.`), cap, nr, avg, yrs,
      };
    },
    verify: (p) => (p.avg - (p.cap * p.nr) / 100) * p.yrs,
  },
  'sacrifice-share': {
    title: 'a new partner\'s share and the sacrifice',
    make(r) {
      const [a, b] = [[3, 2], [2, 1], [1, 1], [5, 3], [3, 1]][pick(r, 0, 4)], newShare = [5, 4, 6, 8][pick(r, 0, 3)];
      // C gets 1/newShare, taken from A and B in their old ratio. A's new share as a fraction: a/(a+b) × (1 − 1/newShare)
      const answer = (a / (a + b)) * (1 - 1 / newShare);
      return {
        q: `<p>A and B share profits ${a} : ${b}. C is admitted for a 1/${newShare} share, which A and B give up in their old ratio. What is A's new share, as a decimal?</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'What is left for A and B is 1 − 1/' + newShare + '; A keeps ' + a + '/' + (a + b) + ' of it.',
        solution: steps(`Left for A and B: 1 − 1/${newShare} = ${newShare - 1}/${newShare}.`, `A's new share = ${a}/${a + b} × ${newShare - 1}/${newShare} = ${a * (newShare - 1)}/${(a + b) * newShare}.`, `= <b>${+answer.toFixed(4)}</b>. When the sacrifice is in the old ratio, the old partners' new ratio stays ${a} : ${b}.`), a, b, newShare,
      };
    },
    verify: (p) => (p.a * (p.newShare - 1)) / ((p.a + p.b) * p.newShare),
  },
  'current-ratio': {
    title: 'current ratio after a transaction',
    make(r) {
      const ca = pick(r, 4, 12) * 10000, cl = pick(r, 2, 6) * 10000, pay = pick(r, 1, 3) * 5000;
      const answer = (ca - pay) / (cl - pay);
      return {
        q: `<p>Current assets are ₹${ca.toLocaleString('en-IN')} and current liabilities ₹${cl.toLocaleString('en-IN')}. The firm then pays a creditor ₹${pay.toLocaleString('en-IN')} in cash. What is the new current ratio?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Paying a creditor in cash lowers both current assets (cash) and current liabilities (creditors) by the same amount.',
        solution: steps(`New current assets = ${ca} − ${pay} = ${ca - pay}.`, `New current liabilities = ${cl} − ${pay} = ${cl - pay}.`, `Current ratio = ${ca - pay} ÷ ${cl - pay} = <b>${answer.toFixed(2)} : 1</b>.`), ca, cl, pay,
      };
    },
    verify: (p) => (p.ca - p.pay) / (p.cl - p.pay),
  },
  // ---------- Module 11: economics ----------
  'multiplier': {
    title: 'change in income from the multiplier',
    make(r) {
      const mpc = [0.5, 0.6, 0.75, 0.8, 0.9][pick(r, 0, 4)], dI = pick(r, 1, 20) * 100, answer = dI / (1 - mpc);
      return {
        q: `<p>The marginal propensity to consume is ${mpc}. Investment rises by ₹${dI} crore. By how much does national income rise (₹ crore)?</p>`,
        answer, unit: '₹ crore', tol: 0, abs: 0.01,
        hint: 'Multiplier k = 1 ÷ (1 − MPC) = 1 ÷ MPS. Change in income = k × change in investment.',
        solution: steps(`k = 1 ÷ (1 − ${mpc}) = ${+(1 / (1 - mpc)).toFixed(2)}.`, `ΔY = ${+(1 / (1 - mpc)).toFixed(2)} × ${dI} = <b>₹${+answer.toFixed(2)} crore</b>.`), mpc, dI,
      };
    },
    verify: (p) => p.dI / (1 - p.mpc),
  },
  'money-multiplier': {
    title: 'how much money can banks create?',
    make(r) {
      const lrr = [5, 10, 20, 25][pick(r, 0, 3)], dep = pick(r, 1, 10) * 1000, answer = dep * (100 / lrr);
      return {
        q: `<p>The legal reserve ratio is ${lrr}%. New deposits of ₹${dep.toLocaleString('en-IN')} crore come into the banking system. What is the most total deposits (credit) it can support (₹ crore)?</p>`,
        answer, unit: '₹ crore', tol: 0, abs: 0.01,
        hint: 'Money multiplier = 1 ÷ LRR (as a fraction). Total deposits = initial deposit × multiplier.',
        solution: steps(`Multiplier = 1 ÷ ${lrr / 100} = ${100 / lrr}.`, `Total = ${dep} × ${100 / lrr} = <b>₹${answer.toLocaleString('en-IN')} crore</b>.`), lrr, dep,
      };
    },
    verify: (p) => (p.dep * 100) / p.lrr,
  },
  'gdp-fc': {
    title: 'from GDP at market price to NNP at factor cost',
    make(r) {
      const gdp = pick(r, 50, 200) * 100, dep = pick(r, 2, 10) * 100, nit = pick(r, 3, 12) * 100, nfia = pick(r, -5, 5) * 50;
      const answer = gdp - dep - nit + nfia;
      return {
        q: `<p>GDP at market price = ₹${gdp} crore, depreciation = ₹${dep} crore, net indirect taxes = ₹${nit} crore, net factor income from abroad = ₹${nfia} crore. Find NNP at factor cost (national income), in ₹ crore.</p>`,
        answer, unit: '₹ crore', tol: 0, abs: 0.01,
        hint: 'NNP at FC = GDP at MP − depreciation − net indirect taxes + net factor income from abroad.',
        solution: steps(`GDP<sub>MP</sub> − depreciation = NDP<sub>MP</sub> = ${gdp - dep}.`, `− net indirect taxes = NDP<sub>FC</sub> = ${gdp - dep - nit}.`, `+ NFIA (${nfia}) = NNP<sub>FC</sub> = <b>₹${answer} crore</b>.`), gdp, dep, nit, nfia,
      };
    },
    verify: (p) => p.gdp + p.nfia - p.dep - p.nit,
  },
  'fiscal-deficit': {
    title: 'fiscal and primary deficit',
    make(r) {
      const exp = pick(r, 30, 60) * 1000, rr = pick(r, 15, 25) * 1000, ncr = pick(r, 1, 4) * 500, intr = pick(r, 2, 8) * 500;
      const fd = exp - rr - ncr, answer = fd - intr;
      return {
        q: `<p>Total government expenditure is ₹${exp.toLocaleString('en-IN')} crore, revenue receipts ₹${rr.toLocaleString('en-IN')} crore, non-debt capital receipts ₹${ncr.toLocaleString('en-IN')} crore, and interest payments ₹${intr.toLocaleString('en-IN')} crore. What is the primary deficit (₹ crore)?</p>`,
        answer, unit: '₹ crore', tol: 0, abs: 0.01,
        hint: 'Fiscal deficit = total expenditure − revenue receipts − non-debt capital receipts. Primary deficit = fiscal deficit − interest payments.',
        solution: steps(`Fiscal deficit = ${exp} − ${rr} − ${ncr} = ${fd.toLocaleString('en-IN')}.`, `Primary deficit = ${fd} − ${intr} = <b>₹${answer.toLocaleString('en-IN')} crore</b>.`), exp, rr, ncr, intr,
      };
    },
    verify: (p) => p.exp - p.rr - p.ncr - p.intr,
  },

  // ---------- Module 4: reasoning ----------
  'clock-hands': {
    title: 'angle between the clock hands',
    make(r) {
      const h = pick(r, 1, 12), m = pick(r, 0, 55, 5), raw = Math.abs(30 * (h % 12) - 5.5 * m), answer = Math.min(raw, 360 - raw);
      return {
        q: `<p>What is the smaller angle between the hour and minute hands at ${h}:${String(m).padStart(2, '0')}, in degrees?</p>`,
        answer, unit: '°', tol: 0, abs: 0.01,
        hint: 'Angle = |30H − 5.5M|; if it is over 180°, take 360° minus it.',
        solution: steps(`30 × ${h % 12} = ${30 * (h % 12)}; 5.5 × ${m} = ${5.5 * m}.`, `|${30 * (h % 12)} − ${5.5 * m}| = ${raw}°.`, `Smaller angle: <b>${answer}°</b>.`), h, m,
      };
    },
    verify: (p) => { const hand = ((p.h % 12) * 30 + p.m * 0.5) % 360, min = p.m * 6, d = Math.abs(hand - min); return Math.min(d, 360 - d); },
  },
  'series-next': {
    title: 'next number in a series',
    make(r) {
      const a = pick(r, 2, 9), d = pick(r, 2, 5), e = pick(r, 1, 3), terms = [a];
      for (let i = 1; i < 6; i++) terms.push(terms[i - 1] + d + e * (i - 1));
      const answer = terms[5];
      return {
        q: `<p>Find the next number: ${terms.slice(0, 5).join(', ')}, ?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Write the gaps between terms. Do the gaps themselves change by a fixed amount?',
        solution: steps(`Gaps: ${terms.slice(1, 5).map((t, i) => t - terms[i]).join(', ')}, growing by ${e} each time.`, `Next gap: ${d + e * 4}.`, `${terms[4]} + ${d + e * 4} = <b>${answer}</b>.`), a, d, e,
      };
    },
    verify: (p) => p.a + 5 * p.d + p.e * 10,
  },
  'walk-distance': {
    title: 'how far from the start?',
    make(r) {
      const trip = [[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [12, 16], [7, 24]][pick(r, 0, 6)], extra = pick(r, 2, 6);
      const north = trip[0] + extra, answer = Math.hypot(trip[0], trip[1]);
      return {
        q: `<p>Neha walks ${north} km north, turns right and walks ${trip[1]} km, then turns right again and walks ${extra} km. How far is she from where she started, in km?</p>`,
        answer, unit: 'km', tol: 0, abs: 0.01,
        hint: 'Work out how far north and how far east she ends up, then use Pythagoras.',
        solution: steps(`Right from north is east, right again is south.`, `Net north: ${north} − ${extra} = ${trip[0]} km; east: ${trip[1]} km.`, `Distance = √(${trip[0]}² + ${trip[1]}²) = <b>${answer} km</b>.`), north, extra, e: trip[1],
      };
    },
    verify: (p) => Math.hypot(p.north - p.extra, p.e),
  },

  // ---------- Module 3: numerical ability ----------

  'average-new': {
    title: 'a new member changes the average',
    make(r) {
      const n = pick(r, 8, 30), avg = pick(r, 40, 70), rise = pick(r, 1, 3, 0.5), answer = avg + rise * (n + 1);
      return {
        q: `<p>The average weight of ${n} students is ${avg} kg. When the teacher joins, the average rises by ${rise} kg. What is the teacher's weight in kg?</p>`,
        answer, unit: 'kg', tol: 0, abs: 0.01,
        hint: 'The teacher brings the new average and also lifts each of the old members by the rise.',
        solution: steps(`New average = ${avg + rise} kg for ${n + 1} people.`, `Teacher = new average + rise × (old number) = ${avg + rise} + ${rise} × ${n}.`, `= <b>${answer} kg</b>.`), n, avg, rise,
      };
    },
    verify: (p) => (p.avg + p.rise) * (p.n + 1) - p.avg * p.n,
  },
  'work-together': {
    title: 'two people working together',
    make(r) {
      const pairs = [[10, 15], [12, 24], [20, 30], [6, 12], [18, 9], [8, 24], [15, 10], [21, 42]];
      const [a, b] = pairs[pick(r, 0, pairs.length - 1)], answer = (a * b) / (a + b);
      return {
        q: `<p>Ravi can finish a job in ${a} days and Sunita in ${b} days. Working together, how many days do they take?</p>`,
        answer, unit: 'days', tol: 0, abs: 0.01,
        hint: 'Add what each does in one day: 1/a + 1/b of the job. Time = 1 ÷ that.',
        solution: steps(`One day: 1/${a} + 1/${b} = ${a + b}/${a * b} of the job.`, `Time = ${a * b}/${a + b} = <b>${+answer.toFixed(2)} days</b>.`, 'Shortcut for two workers: ab ÷ (a + b).'), a, b,
      };
    },
    verify: (p) => 1 / (1 / p.a + 1 / p.b),
  },
  'train-platform': {
    title: 'how long to cross a platform?',
    make(r) {
      const kmh = pick(r, 36, 108, 18), L = pick(r, 100, 300, 10), P = pick(r, 100, 500, 10), answer = (L + P) / ((kmh * 5) / 18);
      return {
        q: `<p>A ${L} m train runs at ${kmh} km/h. How many seconds does it take to cross a ${P} m platform?</p>`,
        answer, unit: 's', tol: 0, abs: 0.01,
        hint: 'Convert km/h to m/s (× 5/18). The train covers its own length plus the platform.',
        solution: steps(`${kmh} × 5/18 = ${(kmh * 5) / 18} m/s.`, `Distance = ${L} + ${P} = ${L + P} m.`, `Time = ${L + P} ÷ ${(kmh * 5) / 18} = <b>${+answer.toFixed(2)} s</b>.`), kmh, L, P,
      };
    },
    verify: (p) => ((p.L + p.P) * 3.6) / p.kmh,
  },
  'cylinder-volume': {
    title: 'volume of a cylinder',
    make(r) {
      const rad = pick(r, 1, 4) * 7, h = pick(r, 5, 30, 5), answer = (22 / 7) * rad * rad * h;
      return {
        q: `<p>A cylindrical tank has radius ${rad} cm and height ${h} cm. Using π = 22/7, what is its volume in cm³?</p>`,
        answer, unit: 'cm³', tol: 0, abs: 0.01,
        hint: 'V = πr²h. Cancel the 7 in 22/7 against r first.',
        solution: steps(`r² = ${rad * rad}.`, `22/7 × ${rad * rad} × ${h} = 22 × ${(rad * rad) / 7} × ${h}.`, `= <b>${answer.toLocaleString('en-IN')} cm³</b>.`), rad, h,
      };
    },
    verify: (p) => (22 * p.rad * p.rad * p.h) / 7,
  },
  'lcm-bells': {
    title: 'when do the bells ring together again?',
    make(r) {
      const a = [4, 6, 8, 9, 10, 12, 15][pick(r, 0, 6)], b = [6, 8, 10, 12, 14, 16, 18][pick(r, 0, 6)], c = [5, 9, 20, 24, 30][pick(r, 0, 4)];
      const g = (x, y) => (y ? g(y, x % y) : x), l = (x, y) => (x * y) / g(x, y), answer = l(l(a, b), c);
      return {
        q: `<p>Three bells ring every ${a}, ${b} and ${c} minutes. They ring together at 8:00. After how many minutes do they next ring together?</p>`,
        answer, unit: 'minutes', tol: 0, abs: 0.01,
        hint: 'They ring together again after a time every interval divides into: the LCM.',
        solution: steps(`Find the LCM of ${a}, ${b} and ${c} from prime factors (take each prime at its highest power).`, `LCM = <b>${answer}</b> minutes.`), a, b, c,
      };
    },
    verify: (p) => { let t = 1; while (t % p.a || t % p.b || t % p.c) t++; return t; },
  },
  'ratio-share': {
    title: 'share money in a ratio',
    make(r) {
      const a = pick(r, 1, 6), b = pick(r, 1, 6), c = pick(r, 1, 6), one = pick(r, 50, 900, 50), total = (a + b + c) * one;
      return {
        q: `<p>₹${total.toLocaleString('en-IN')} is shared among Asha, Bilal and Chitra in the ratio ${a} : ${b} : ${c}. How much does Chitra get (₹)?</p>`,
        answer: c * one, unit: '₹', tol: 0, abs: 0.01,
        hint: 'Add the parts, find the value of one part, then multiply by Chitra\'s parts.',
        solution: steps(`Parts: ${a} + ${b} + ${c} = ${a + b + c}.`, `One part = ${total} ÷ ${a + b + c} = ₹${one}.`, `Chitra: ${c} × ${one} = <b>₹${(c * one).toLocaleString('en-IN')}</b>.`), a, b, c, total,
      };
    },
    verify: (p) => (p.total * p.c) / (p.a + p.b + p.c),
  },
  'markup-discount': {
    title: 'profit after a mark-up and a discount',
    make(r) {
      const up = pick(r, 20, 60, 5), off = pick(r, 5, 30, 5), answer = ((1 + up / 100) * (1 - off / 100) - 1) * 100;
      return {
        q: `<p>A shopkeeper marks goods ${up}% above cost and then gives a ${off}% discount. What is the profit (or loss, as a negative number) in percent?</p>`,
        answer, unit: '%', tol: 0, abs: 0.01,
        hint: 'Multiply the two multipliers: (1 + mark-up) × (1 − discount).',
        solution: steps(`${(1 + up / 100).toFixed(2)} × ${(1 - off / 100).toFixed(2)} = ${(1 + answer / 100).toFixed(4)}.`, `Profit = <b>${+answer.toFixed(2)}%</b>.`), up, off,
      };
    },
    verify: (p) => p.up - p.off - (p.up * p.off) / 100,
  },
  'ci-minus-si': {
    title: 'difference between compound and simple interest',
    make(r) {
      const P = pick(r, 5, 50) * 1000, rate = pick(r, 4, 20, 2), answer = (P * rate * rate) / 10000;
      return {
        q: `<p>What is the difference between compound interest (compounded yearly) and simple interest on ₹${P.toLocaleString('en-IN')} for 2 years at ${rate}% a year (₹)?</p>`,
        answer, unit: '₹', tol: 0, abs: 0.01,
        hint: 'For 2 years, CI − SI = P × (r/100)²: the interest earned in year 2 on year 1\'s interest.',
        solution: steps(`Year 1 interest = ${P} × ${rate}/100 = ₹${(P * rate) / 100}.`, `In year 2, compound interest also earns ${rate}% on that: ${(P * rate) / 100} × ${rate}/100.`, `Difference = <b>₹${+answer.toFixed(2)}</b>.`), P, rate,
      };
    },
    verify: (p) => p.P * (1 + p.rate / 100) ** 2 - p.P - (2 * p.P * p.rate) / 100,
  },
  'cuet-score': {
    title: 'work out a CUET score',
    make(r) {
      const right = pick(r, 20, 45), wrong = pick(r, 0, Math.min(15, 50 - right));
      const answer = 5 * right - wrong;
      return {
        q: `<p>In one 50-question CUET test you answer ${right} questions correctly, ${wrong} wrongly and leave ${50 - right - wrong} blank. What is your score out of 250?</p>`,
        answer, unit: 'marks', tol: 0, abs: 0.01,
        hint: 'Right answers earn +5, wrong answers cost −1, blanks earn 0.',
        solution: steps(`${right} × 5 = ${5 * right}.`, `${wrong} × (−1) = −${wrong}.`, `Score = ${5 * right} − ${wrong} = <b>${answer}</b> out of 250.`),
        right, wrong,
      };
    },
    verify: (p) => 5 * p.right - p.wrong,
  },
  'cuet-target': {
    title: 'how many right answers do you need?',
    make(r) {
      const target = pick(r, 150, 230, 5), wrong = pick(r, 2, 10);
      const answer = Math.ceil((target + wrong) / 5);
      return {
        q: `<p>You want at least ${target} out of 250 in a test. Expecting about ${wrong} wrong answers, what is the smallest number of right answers you need?</p>`,
        answer, unit: 'right answers', tol: 0, abs: 0.01,
        hint: 'Score = 5 × right − wrong. Set it at least equal to the target and round up.',
        solution: steps(`5 × right − ${wrong} ≥ ${target}.`, `5 × right ≥ ${target + wrong}, so right ≥ ${(target + wrong) / 5}.`, `Round up: <b>${answer}</b> right answers.`),
        target, wrong,
      };
    },
    verify: (p) => Math.ceil((p.target + p.wrong) / 5),
  },
  'guess-value': {
    title: 'is a guess worth it?',
    make(r) {
      const out = pick(r, 0, 2);
      const p = 1 / (4 - out), answer = 5 * p - (1 - p);
      return {
        q: `<p>On a 4-option question you can rule out ${out === 0 ? 'none of the options' : out === 1 ? 'one wrong option' : 'two wrong options'} and then pick at random among the rest. How many marks is the answer worth on average (+5 right, −1 wrong)?</p>`,
        answer, unit: 'marks', tol: 0.01,
        hint: 'Average = 5 × (chance right) − 1 × (chance wrong).',
        solution: steps(`Options left: ${4 - out}, so the chance of being right is 1/${4 - out}.`, `Average = 5 × 1/${4 - out} − 1 × ${3 - out}/${4 - out} = ${(5 - (3 - out))}/${4 - out}.`, `= <b>${answer.toFixed(2)}</b> marks: ${answer > 0 ? 'positive, so on average answering pays' : 'not worth it'}.`),
        out,
      };
    },
    verify: (p) => { const q = 1 / (4 - p.out); return 6 * q - 1; },
  },
  // ---------- Module 6: physics ----------
  'capacitor-energy': {
    title: 'energy stored in a capacitor',
    make(r) {
      const C = [2, 4, 5, 10, 20, 50][pick(r, 0, 5)], V = pick(r, 2, 20) * 10, answer = 0.5 * C * 1e-6 * V * V * 1000;
      return {
        q: `<p>A ${C} µF capacitor is charged to ${V} V. How much energy does it store (mJ)?</p>`,
        answer, unit: 'mJ', tol: 0.01,
        hint: 'U = ½CV². Change µF to F (× 10⁻⁶), then joules to millijoules (× 1000).',
        solution: steps(`C = ${C} × 10⁻⁶ F.`, `U = ½ × ${C} × 10⁻⁶ × ${V}² = ${+(answer / 1000).toPrecision(4)} J.`, `= <b>${+answer.toPrecision(4)} mJ</b>.`), C, V,
      };
    },
    verify: (p) => (p.C * p.V * p.V) / 2000,
  },
  'parallel-resistors': {
    title: 'current from a battery with resistors in parallel and series',
    make(r) {
      const R1 = [2, 3, 4, 6, 12][pick(r, 0, 4)], R2 = [3, 4, 6, 12][pick(r, 0, 3)], R3 = pick(r, 1, 8), V = pick(r, 2, 12) * 2;
      const Rp = (R1 * R2) / (R1 + R2), answer = V / (Rp + R3);
      return {
        q: `<p>${R1} Ω and ${R2} Ω resistors are in parallel, and this pair is in series with ${R3} Ω across a ${V} V battery of negligible resistance. What current flows from the battery (A)?</p>`,
        answer, unit: 'A', tol: 0.01,
        hint: 'Parallel: R = R₁R₂ ÷ (R₁ + R₂). Then add the series resistor and use I = V ÷ R.',
        solution: steps(`Parallel pair = ${R1} × ${R2} ÷ ${R1 + R2} = ${+Rp.toFixed(3)} Ω.`, `Total = ${+Rp.toFixed(3)} + ${R3} = ${+(Rp + R3).toFixed(3)} Ω.`, `I = ${V} ÷ ${+(Rp + R3).toFixed(3)} = <b>${+answer.toFixed(3)} A</b>.`), R1, R2, R3, V,
      };
    },
    verify: (p) => p.V / (1 / (1 / p.R1 + 1 / p.R2) + p.R3),
  },
  'force-on-wire': {
    title: 'force on a current-carrying wire',
    make(r) {
      const B = pick(r, 1, 9) / 10, I = pick(r, 1, 10), L = pick(r, 1, 10) / 10, th = [30, 45, 60, 90][pick(r, 0, 3)];
      const answer = B * I * L * Math.sin((th * Math.PI) / 180);
      return {
        q: `<p>A wire ${L} m long carries ${I} A in a uniform magnetic field of ${B} T. The wire makes ${th}° with the field. What force acts on it (N)?</p>`,
        answer, unit: 'N', tol: 0.01,
        hint: 'F = BIL sin θ, where θ is the angle between the wire and the field.',
        solution: steps(`sin ${th}° = ${+Math.sin((th * Math.PI) / 180).toFixed(3)}.`, `F = ${B} × ${I} × ${L} × ${+Math.sin((th * Math.PI) / 180).toFixed(3)} = <b>${+answer.toFixed(3)} N</b>.`), B, I, L, th,
      };
    },
    verify: (p) => p.B * p.I * p.L * Math.cos(((90 - p.th) * Math.PI) / 180),
  },
  'transformer': {
    title: 'output of an ideal transformer',
    make(r) {
      const Np = pick(r, 2, 20) * 100, Ns = pick(r, 1, 40) * 50, Vp = [110, 220, 230, 240][pick(r, 0, 3)], answer = (Vp * Ns) / Np;
      return {
        q: `<p>An ideal transformer has ${Np} turns on the primary and ${Ns} on the secondary. The primary is connected to ${Vp} V AC. What is the secondary voltage (V)?</p>`,
        answer, unit: 'V', tol: 0.01,
        hint: 'Vs ÷ Vp = Ns ÷ Np. More secondary turns steps the voltage up.',
        solution: steps(`Turns ratio Ns/Np = ${Ns}/${Np} = ${+(Ns / Np).toFixed(3)}.`, `Vs = ${Vp} × ${+(Ns / Np).toFixed(3)} = <b>${+answer.toFixed(2)} V</b> (${Ns > Np ? 'step-up' : Ns < Np ? 'step-down' : 'no change'}).`), Np, Ns, Vp,
      };
    },
    verify: (p) => p.Vp / (p.Np / p.Ns),
  },
  'em-wavelength': {
    title: 'wavelength of a radio station',
    make(r) {
      const f = pick(r, 880, 1080) / 10, answer = 3e8 / (f * 1e6);
      return {
        q: `<p>An FM station broadcasts at ${f} MHz. What is the wavelength of its waves (m)? Take c = 3 × 10⁸ m/s.</p>`,
        answer, unit: 'm', tol: 0.01,
        hint: 'c = fλ, so λ = c ÷ f. 1 MHz = 10⁶ Hz.',
        solution: steps(`f = ${f} × 10⁶ Hz.`, `λ = 3 × 10⁸ ÷ (${f} × 10⁶) = <b>${+answer.toFixed(3)} m</b>, about the length of a car.`), f,
      };
    },
    verify: (p) => 300 / p.f,
  },
  'lens-image': {
    title: 'where does a convex lens form the image?',
    make(r) {
      const f = pick(r, 2, 6) * 5, u = f + pick(r, 1, 6) * 5, v = (u * f) / (u - f);
      return {
        q: `<p>An object is ${u} cm in front of a convex lens of focal length ${f} cm. How far behind the lens is the image (cm)?</p>`,
        answer: v, unit: 'cm', tol: 0.01,
        hint: 'Lens formula 1/v − 1/u = 1/f, with u negative (object on the left), f positive for a convex lens.',
        solution: steps(`u = −${u} cm, f = +${f} cm.`, `1/v = 1/f + 1/u = 1/${f} − 1/${u} = ${u - f}/${u * f}.`, `v = <b>${+v.toFixed(2)} cm</b> (positive, so a real image behind the lens). Magnification m = v/u = −${+(v / u).toFixed(2)}: inverted.`), f, u,
      };
    },
    verify: (p) => 1 / (1 / p.f - 1 / p.u),
  },
  'photoelectric': {
    title: 'fastest photoelectrons',
    make(r) {
      const phi = [2.0, 2.1, 2.3, 2.5, 3.0][pick(r, 0, 4)], lam = pick(r, 20, 40) * 10, E = 1240 / lam;
      const answer = E - phi > 0.05 ? E - phi : 1240 / 200 - phi;
      const L = E - phi > 0.05 ? lam : 200;
      return {
        q: `<p>Light of wavelength ${L} nm falls on a metal with work function ${phi} eV. What is the maximum kinetic energy of the emitted electrons (eV)? Use hc ≈ 1240 eV nm.</p>`,
        answer, unit: 'eV', tol: 0.01,
        hint: 'Photon energy E = 1240 ÷ λ(nm) eV. Then K_max = E − φ.',
        solution: steps(`E = 1240 ÷ ${L} = ${+(1240 / L).toFixed(3)} eV.`, `K_max = ${+(1240 / L).toFixed(3)} − ${phi} = <b>${+answer.toFixed(3)} eV</b>. The stopping potential is ${+answer.toFixed(2)} V.`), phi, L,
      };
    },
    verify: (p) => 1240 / p.L - p.phi,
  },
  'half-life': {
    title: 'how much is left after a few half-lives?',
    make(r) {
      const N0 = [800, 1600, 3200, 6400][pick(r, 0, 3)], T = pick(r, 2, 12), k = pick(r, 1, 5), answer = N0 / 2 ** k;
      return {
        q: `<p>A sample has ${N0} undecayed nuclei. The half-life is ${T} days. How many are left after ${k * T} days?</p>`,
        answer, unit: 'nuclei', tol: 0, abs: 0.01,
        hint: 'Count half-lives: n = t ÷ T. Then N = N₀ ÷ 2ⁿ.',
        solution: steps(`n = ${k * T} ÷ ${T} = ${k} half-lives.`, `N = ${N0} ÷ 2<sup>${k}</sup> = ${N0} ÷ ${2 ** k} = <b>${answer}</b>.`), N0, T, k,
      };
    },
    verify: (p) => p.N0 * Math.exp((-Math.LN2 * p.k * p.T) / p.T),
  },
  'transistor-gain': {
    title: 'collector current from the current gain',
    make(r) {
      const beta = pick(r, 5, 30) * 10, IB = pick(r, 1, 10) * 5, answer = (beta * IB) / 1000;
      return {
        q: `<p>A transistor in common-emitter mode has current gain β = ${beta}. The base current is ${IB} µA. What is the collector current (mA)?</p>`,
        answer, unit: 'mA', tol: 0.01,
        hint: 'β = I_C ÷ I_B, so I_C = β × I_B. 1000 µA = 1 mA.',
        solution: steps(`I_C = ${beta} × ${IB} µA = ${beta * IB} µA.`, `= <b>${+answer.toFixed(3)} mA</b>. The emitter current is I_E = I_B + I_C = ${+((beta * IB + IB) / 1000).toFixed(3)} mA.`), beta, IB,
      };
    },
    verify: (p) => p.beta * p.IB * 1e-3,
  },

  // ---------- Module 7: chemistry ----------
  'boiling-elevation': {
    title: 'boiling point rise of a urea solution',
    make(r) {
      const w = pick(r, 3, 30), W = [250, 500, 1000][pick(r, 0, 2)], m = w / 60 / (W / 1000), answer = 0.52 * m;
      return {
        q: `<p>${w} g of urea (M = 60 g/mol) is dissolved in ${W} g of water. By how much does the boiling point rise (K)? K<sub>b</sub> for water = 0.52 K kg/mol.</p>`,
        answer, unit: 'K', tol: 0.01,
        hint: 'Molality m = moles of solute ÷ kg of solvent. ΔT_b = K_b × m (urea does not dissociate, i = 1).',
        solution: steps(`Moles of urea = ${w} ÷ 60 = ${+(w / 60).toFixed(4)}.`, `m = ${+(w / 60).toFixed(4)} ÷ ${W / 1000} = ${+m.toFixed(4)} mol/kg.`, `ΔT_b = 0.52 × ${+m.toFixed(4)} = <b>${+answer.toFixed(3)} K</b>.`), w, W,
      };
    },
    verify: (p) => (0.52 * p.w * 1000) / (60 * p.W),
  },
  'cell-emf': {
    title: 'standard emf of a cell',
    make(r) {
      const E = { Mg: -2.37, Zn: -0.76, Fe: -0.44, Ni: -0.25, Cu: 0.34, Ag: 0.8 }, k = Object.keys(E);
      let a = k[pick(r, 0, 5)], b = k[pick(r, 0, 5)]; if (a === b) b = a === 'Cu' ? 'Zn' : 'Cu';
      const [an, ca] = E[a] < E[b] ? [a, b] : [b, a], answer = E[ca] - E[an];
      return {
        q: `<p>A cell is made from ${a} | ${a}ⁿ⁺ and ${b} | ${b}ⁿ⁺ half-cells (1 M, 298 K). E° values: ${a} ${E[a]} V, ${b} ${E[b]} V. What is E°<sub>cell</sub> (V)?</p>`,
        answer, unit: 'V', tol: 0, abs: 0.005,
        hint: 'The half-cell with the higher (more positive) E° is the cathode. E°cell = E°cathode − E°anode.',
        solution: steps(`Cathode (reduction): ${ca}, E° = ${E[ca]} V. Anode (oxidation): ${an}, E° = ${E[an]} V.`, `E°cell = ${E[ca]} − (${E[an]}) = <b>${+answer.toFixed(2)} V</b>. Positive, so the cell reaction is spontaneous.`), ea: E[a], eb: E[b],
      };
    },
    verify: (p) => Math.abs(p.ea - p.eb),
  },
  'first-order': {
    title: 'half-life of a first-order reaction',
    make(r) {
      const k = pick(r, 1, 50) / 1000, answer = Math.LN2 / k;
      return {
        q: `<p>A first-order reaction has rate constant k = ${k} min⁻¹. What is its half-life (min)?</p>`,
        answer, unit: 'min', tol: 0.01,
        hint: 'For first order, t½ = 0.693 ÷ k, the same whatever the starting concentration.',
        solution: steps(`t½ = 0.693 ÷ ${k} = <b>${+answer.toFixed(1)} min</b>.`, `After 2 half-lives (${+(2 * answer).toFixed(1)} min) a quarter is left; after 3, an eighth.`), k,
      };
    },
    verify: (p) => (2.303 * Math.log10(2)) / p.k,
  },
  'spin-only': {
    title: 'spin-only magnetic moment of an ion',
    make(r) {
      const ions = [['Ti³⁺', 22, 3], ['V³⁺', 23, 3], ['Cr³⁺', 24, 3], ['Mn²⁺', 25, 2], ['Fe³⁺', 26, 3], ['Fe²⁺', 26, 2], ['Co²⁺', 27, 2], ['Ni²⁺', 28, 2], ['Cu²⁺', 29, 2], ['Zn²⁺', 30, 2]];
      const [name, Z, ch] = ions[pick(r, 0, 9)], d = Z - 18 - ch, n = d <= 5 ? d : 10 - d, answer = Math.sqrt(n * (n + 2));
      return {
        q: `<p>What is the spin-only magnetic moment of a free ${name} ion (atomic number of the metal ${Z}) in BM?</p>`,
        answer, unit: 'BM', tol: 0, abs: 0.02,
        hint: 'Find the d-electron count (Z − 18 − charge, the 4s electrons leave first), then unpaired electrons n by Hund\'s rule. μ = √(n(n + 2)).',
        solution: steps(`${name}: 3d<sup>${d}</sup>.`, `Unpaired electrons n = ${n}.`, `μ = √(${n} × ${n + 2}) = <b>${+answer.toFixed(2)} BM</b>${n === 0 ? ' (diamagnetic)' : ''}.`), d,
      };
    },
    verify: (p) => { const n = Math.min(p.d, 10 - p.d); return Math.sqrt(n * n + 2 * n); },
  },
  'complex-ox': {
    title: 'oxidation state of the metal in a complex',
    make(r) {
      // [formula, complex-ion charge, total ligand charge]
      const list = [['[Co(NH₃)₆]Cl₃', 3, 0], ['K₄[Fe(CN)₆]', -4, -6], ['K₃[Fe(CN)₆]', -3, -6], ['[Ni(CO)₄]', 0, 0], ['[Cu(NH₃)₄]SO₄', 2, 0], ['K₂[PtCl₆]', -2, -6], ['[Cr(H₂O)₆]Cl₃', 3, 0], ['Na₂[Zn(OH)₄]', -2, -4], ['[Co(NH₃)₅Cl]Cl₂', 2, -1], ['K₃[Al(C₂O₄)₃]', -3, -6]];
      const [f, ion, lig] = list[pick(r, 0, list.length - 1)], answer = ion - lig;
      return {
        q: `<p>What is the oxidation state of the central metal in ${f}?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'First find the charge on the complex ion from the counter-ions. Then subtract the ligand charges: NH₃, H₂O, CO are 0; Cl⁻, CN⁻, OH⁻ are −1; C₂O₄²⁻ is −2.',
        solution: steps(`Charge on the complex ion = ${ion}.`, `Total ligand charge = ${lig}.`, `Metal: x + (${lig}) = ${ion}, so x = <b>${answer >= 0 ? '+' : ''}${answer}</b>.`), ion, lig,
      };
    },
    verify: (p) => p.ion + -p.lig,
  },
  'carius-bromine': {
    title: 'percentage of bromine by the Carius method',
    make(r) {
      const w = pick(r, 10, 40) / 100, agbr = +(w * pick(r, 50, 150) / 100).toFixed(3), answer = (80 / 188) * (agbr / w) * 100;
      return {
        q: `<p>In a Carius estimation, ${w} g of an organic compound gave ${agbr} g of AgBr. What is the percentage of bromine in the compound? (Ag 108, Br 80)</p>`,
        answer, unit: '%', tol: 0.01,
        hint: '188 g AgBr contains 80 g Br. % Br = (80/188) × (mass of AgBr ÷ mass of compound) × 100.',
        solution: steps(`Bromine in ${agbr} g AgBr = ${agbr} × 80/188 = ${+(agbr * 80 / 188).toFixed(4)} g.`, `% Br = ${+(agbr * 80 / 188).toFixed(4)} ÷ ${w} × 100 = <b>${+answer.toFixed(2)}%</b>.`), w, agbr,
      };
    },
    verify: (p) => (p.agbr * 8000) / (188 * p.w),
  },
  'alcohol-combustion': {
    title: 'oxygen needed to burn an alcohol',
    make(r) {
      const n = pick(r, 1, 6), mol = pick(r, 1, 5), answer = 1.5 * n * mol;
      const names = ['methanol', 'ethanol', 'propan-1-ol', 'butan-1-ol', 'pentan-1-ol', 'hexan-1-ol'];
      return {
        q: `<p>How many moles of O₂ are needed to burn ${mol} mol of ${names[n - 1]} (C<sub>${n}</sub>H<sub>${2 * n + 1}</sub>OH) completely to CO₂ and water?</p>`,
        answer, unit: 'mol', tol: 0, abs: 0.01,
        hint: 'CₙH₂ₙ₊₁OH + (3n/2) O₂ → n CO₂ + (n + 1) H₂O. Check by counting O atoms on each side.',
        solution: steps(`Products: ${n} CO₂ and ${n + 1} H₂O hold ${2 * n + n + 1} O atoms; the alcohol brings 1, so O₂ supplies ${3 * n} atoms = ${1.5 * n} mol O₂ per mol.`, `For ${mol} mol: ${1.5 * n} × ${mol} = <b>${answer} mol O₂</b>.`), n, mol,
      };
    },
    verify: (p) => ((2 * p.n + p.n + 1 - 1) / 2) * p.mol,
  },
  'weak-acid-ph': {
    title: 'pH of a carboxylic acid solution',
    make(r) {
      const acids = [['methanoic', 3.75], ['ethanoic', 4.76], ['benzoic', 4.2], ['chloroethanoic', 2.86]];
      const [name, pKa] = acids[pick(r, 0, 3)], C = [0.1, 0.01, 0.05, 0.2][pick(r, 0, 3)], answer = 0.5 * (pKa - Math.log10(C));
      return {
        q: `<p>Find the pH of a ${C} M solution of ${name} acid (pK<sub>a</sub> = ${pKa}), assuming it ionises only slightly.</p>`,
        answer, unit: '', tol: 0, abs: 0.02,
        hint: 'For a weak acid, [H⁺] = √(Ka × C), so pH = ½(pKa − log C).',
        solution: steps(`log ${C} = ${+Math.log10(C).toFixed(3)}.`, `pH = ½(${pKa} − (${+Math.log10(C).toFixed(3)})) = <b>${+answer.toFixed(2)}</b>.`), pKa, C,
      };
    },
    verify: (p) => -Math.log10(Math.sqrt(10 ** -p.pKa * p.C)),
  },
  'amine-nitrogen': {
    title: 'percentage of nitrogen in an amine',
    make(r) {
      const n = pick(r, 1, 6), M = 14 * n + 17, answer = (14 / M) * 100;
      return {
        q: `<p>What is the percentage by mass of nitrogen in the primary amine C<sub>${n}</sub>H<sub>${2 * n + 1}</sub>NH₂? (C 12, H 1, N 14)</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Molar mass of CₙH₂ₙ₊₁NH₂ = 12n + (2n + 3) + 14 = 14n + 17.',
        solution: steps(`M = 12 × ${n} + ${2 * n + 3} × 1 + 14 = ${M} g/mol.`, `% N = 14 ÷ ${M} × 100 = <b>${+answer.toFixed(2)}%</b>.`), n,
      };
    },
    verify: (p) => 1400 / (12 * p.n + 2 * p.n + 3 + 14),
  },
  'peptide-mass': {
    title: 'mass of a peptide chain',
    make(r) {
      const n = pick(r, 2, 10), M = [['glycine', 75], ['alanine', 89]][pick(r, 0, 1)], answer = M[1] * n - 18 * (n - 1);
      return {
        q: `<p>${n} molecules of ${M[0]} (M = ${M[1]} g/mol) join into one straight peptide chain. What is the molar mass of the peptide (g/mol)?</p>`,
        answer, unit: 'g/mol', tol: 0, abs: 0.01,
        hint: 'Each peptide bond releases one water molecule (18 g/mol). n amino acids form n − 1 peptide bonds.',
        solution: steps(`Total of the amino acids = ${n} × ${M[1]} = ${n * M[1]}.`, `Water lost = ${n - 1} × 18 = ${18 * (n - 1)}.`, `Peptide = <b>${answer} g/mol</b>.`), n, m: M[1],
      };
    },
    verify: (p) => p.n * (p.m - 18) + 18,
  },

  // ---------- Module 8: maths ----------
  'count-relations': {
    title: 'how many relations or functions?',
    make(r) {
      const m = pick(r, 2, 4), n = pick(r, 2, 4), kind = ['relations from A to B', 'functions from A to B', 'one-one functions from A to A'][pick(r, 0, 2)];
      const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
      const answer = kind.startsWith('rel') ? 2 ** (m * n) : kind.startsWith('func') ? n ** m : fact(m);
      return {
        q: `<p>A has ${m} elements and B has ${n} elements. How many ${kind} are there?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Relations: any subset of A × B, so 2^(mn). Functions A → B: each of the m elements picks one of n images, nᵐ. One-one A → A: m!.',
        solution: steps(kind.startsWith('rel') ? `A × B has ${m} × ${n} = ${m * n} pairs; each pair is in or out: 2<sup>${m * n}</sup> = <b>${answer}</b>.` : kind.startsWith('func') ? `Each of the ${m} elements has ${n} choices: ${n}<sup>${m}</sup> = <b>${answer}</b>.` : `First element ${m} choices, next ${m - 1}, ...: ${m}! = <b>${answer}</b>.`), m, n, kind,
      };
    },
    verify: (p) => (p.kind.startsWith('rel') ? Math.pow(2, p.m * p.n) : p.kind.startsWith('func') ? Math.pow(p.n, p.m) : [1, 1, 2, 6, 24][p.m]),
  },
  'inverse-trig-value': {
    title: 'principal value of sin⁻¹(sin x) or cos⁻¹(cos x)',
    make(r) {
      const fn = pick(r, 0, 1) ? 'sin' : 'cos';
      const x = fn === 'sin' ? pick(r, 10, 26) * 10 : pick(r, 19, 35) * 10, answer = fn === 'sin' ? (x <= 90 ? x : 180 - x) : 360 - x;
      return {
        q: `<p>Find ${fn}⁻¹(${fn} ${x}°) in degrees (principal value).</p>`,
        answer, unit: '°', tol: 0, abs: 0.01,
        hint: fn === 'sin' ? 'The principal range of sin⁻¹ is −90° to 90°. Find the angle in that range with the same sine: sin(180° − x) = sin x.' : 'The principal range of cos⁻¹ is 0° to 180°. cos(360° − x) = cos x.',
        solution: steps(fn === 'sin' ? `${x}° is outside −90° to 90°, but sin ${x}° = sin(180° − ${x}°) = sin(${180 - x}°).` : `${x}° is outside 0° to 180°, but cos ${x}° = cos(360° − ${x}°) = cos(${360 - x}°).`, `${answer}° is inside the principal range, so the answer is <b>${answer}°</b>.`), fn, x,
      };
    },
    verify: (p) => { const t = (p.x * Math.PI) / 180; return Math.round(((p.fn === 'sin' ? Math.asin(Math.sin(t)) : Math.acos(Math.cos(t))) * 180) / Math.PI); },
  },
  'det-3x3': {
    title: 'determinant of a 3 × 3 matrix',
    make(r) {
      const a = Array.from({ length: 9 }, () => pick(r, -4, 5));
      const [p, q, s, t, u, v, w, x, y] = a, answer = p * (u * y - v * x) - q * (t * y - v * w) + s * (t * x - u * w);
      const M = `<table class="mat"><tr><td>${p}</td><td>${q}</td><td>${s}</td></tr><tr><td>${t}</td><td>${u}</td><td>${v}</td></tr><tr><td>${w}</td><td>${x}</td><td>${y}</td></tr></table>`;
      return {
        q: `<p>Find the determinant of the matrix with rows (${p}, ${q}, ${s}), (${t}, ${u}, ${v}), (${w}, ${x}, ${y}).</p>${M}`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Expand along the first row: a(ei − fh) − b(di − fg) + c(dh − eg). Watch the minus sign in the middle.',
        solution: steps(`${p} × (${u}·${y} − ${v}·${x}) = ${p * (u * y - v * x)}.`, `− ${q} × (${t}·${y} − ${v}·${w}) = ${-q * (t * y - v * w)}.`, `+ ${s} × (${t}·${x} − ${u}·${w}) = ${s * (t * x - u * w)}.`, `Determinant = <b>${answer}</b>.`), a,
      };
    },
    verify: (p) => { const [a, b, c, d, e, f, g, h, i] = p.a; return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h; },
  },
  'piecewise-k': {
    title: 'make a piecewise function continuous',
    make(r) {
      const a = pick(r, 1, 4), b = pick(r, -5, 5), k = pick(r, -3, 6), c = k * a + b - a * a;
      return {
        q: `<p>f(x) = kx ${b < 0 ? '−' : '+'} ${Math.abs(b)} for x &lt; ${a}, and f(x) = x² ${c < 0 ? '−' : '+'} ${Math.abs(c)} for x ≥ ${a}. For what value of k is f continuous at x = ${a}?</p>`,
        answer: k, unit: '', tol: 0, abs: 0.01,
        hint: 'Continuous means the left-hand limit equals f(a): ka + b = a² + c.',
        solution: steps(`Left limit = ${a}k ${b < 0 ? '−' : '+'} ${Math.abs(b)}. Value f(${a}) = ${a * a} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${a * a + c}.`, `${a}k = ${a * a + c} − (${b}) = ${a * a + c - b}, so k = <b>${k}</b>.`), a, b, c,
      };
    },
    verify: (p) => (p.a * p.a + p.c - p.b) / p.a,
  },
  'max-fence': {
    title: 'largest field along a river',
    make(r) {
      const L = pick(r, 4, 40) * 10, answer = (L * L) / 8;
      return {
        q: `<p>A farmer has ${L} m of fencing to fence a rectangular field on three sides; a straight river forms the fourth side. What is the largest possible area (m²)?</p>`,
        answer, unit: 'm²', tol: 0.001,
        hint: 'Let the side across the river be x. The side parallel is L − 2x. Area A = x(L − 2x). Set dA/dx = 0.',
        solution: steps(`A = x(${L} − 2x) = ${L}x − 2x².`, `dA/dx = ${L} − 4x = 0 gives x = ${L / 4} m; d²A/dx² = −4 &lt; 0, so this is a maximum.`, `Sides ${L / 4} m and ${L / 2} m; area = <b>${answer} m²</b>.`), L,
      };
    },
    verify: (p) => { let best = 0; for (let i = 0; i <= 4000; i++) { const x = (p.L / 2) * (i / 4000); best = Math.max(best, x * (p.L - 2 * x)); } return best; },
  },
  'definite-poly': {
    title: 'a definite integral of a polynomial',
    make(r) {
      const p = pick(r, -3, 6), q = pick(r, -4, 6), s = pick(r, -5, 5), a = pick(r, -2, 1), b = a + pick(r, 1, 3);
      const F = (x) => (p * x ** 3) / 3 + (q * x ** 2) / 2 + s * x, answer = F(b) - F(a);
      return {
        q: `<p>Evaluate ∫ from ${a} to ${b} of (${p}x² ${q < 0 ? '−' : '+'} ${Math.abs(q)}x ${s < 0 ? '−' : '+'} ${Math.abs(s)}) dx.</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Antiderivative: px³/3 + qx²/2 + sx. Then F(upper) − F(lower).',
        solution: steps(`F(x) = ${p}x³/3 ${q < 0 ? '−' : '+'} ${Math.abs(q)}x²/2 ${s < 0 ? '−' : '+'} ${Math.abs(s)}x.`, `F(${b}) = ${+F(b).toFixed(3)}, F(${a}) = ${+F(a).toFixed(3)}.`, `Integral = <b>${+answer.toFixed(3)}</b>.`), c2: p, c1: q, c0: s, a, b,
      };
    },
    verify: (P) => { const f = (x) => P.c2 * x * x + P.c1 * x + P.c0, m = (P.a + P.b) / 2; return ((P.b - P.a) / 6) * (f(P.a) + 4 * f(m) + f(P.b)); }, // Simpson's rule: exact for a quadratic
  },
  'area-parabola-line': {
    title: 'area between a parabola and a line',
    make(r) {
      const k = pick(r, 1, 6), answer = k ** 3 / 6;
      return {
        q: `<p>Find the area enclosed between y = x² and y = ${k}x.</p>`,
        answer, unit: 'sq units', tol: 0.001,
        hint: 'They meet where x² = kx: x = 0 and x = k. Area = ∫₀ᵏ (kx − x²) dx (line on top).',
        solution: steps(`Meeting points: x = 0 and x = ${k}.`, `Area = [${k}x²/2 − x³/3] from 0 to ${k} = ${k ** 3}/2 − ${k ** 3}/3 = ${k ** 3}/6.`, `= <b>${+answer.toFixed(3)} square units</b>.`), k,
      };
    },
    verify: (p) => { let t = 0; const N = 4000, h = p.k / N; for (let i = 0; i < N; i++) { const x = (i + 0.5) * h; t += (p.k * x - x * x) * h; } return t; },
  },
  'cross-area': {
    title: 'area of a triangle from two vectors',
    make(r) {
      const a = [pick(r, -3, 4), pick(r, -3, 4), pick(r, -3, 4)], b = [pick(r, -3, 4), pick(r, -3, 4), pick(r, -3, 4)];
      if (a[0] * b[1] === a[1] * b[0]) b[2] = a[2] + 1, b[0] = a[0] + 1;
      const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], mag = Math.hypot(...c), answer = mag / 2;
      const v = (x) => `${x[0]}î ${x[1] < 0 ? '−' : '+'} ${Math.abs(x[1])}ĵ ${x[2] < 0 ? '−' : '+'} ${Math.abs(x[2])}k̂`;
      return {
        q: `<p>Two sides of a triangle are the vectors a = ${v(a)} and b = ${v(b)}. Find its area.</p>`,
        answer, unit: 'sq units', tol: 0.005, abs: 0.01,
        hint: 'Area of the triangle = ½ |a × b|.',
        solution: steps(`a × b = ${v(c)}.`, `|a × b| = √(${c[0] ** 2} + ${c[1] ** 2} + ${c[2] ** 2}) = ${+mag.toFixed(3)}.`, `Area = <b>${+answer.toFixed(3)}</b>.`), a, b,
      };
    },
    verify: (p) => { const [a, b] = [p.a, p.b]; const aa = a[0] ** 2 + a[1] ** 2 + a[2] ** 2, bb = b[0] ** 2 + b[1] ** 2 + b[2] ** 2, ab = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; return Math.sqrt(aa * bb - ab * ab) / 2; },
  },
  'lp-corner': {
    title: 'maximise a profit with corner points',
    make(r) {
      const A = pick(r, 8, 20), B = pick(r, 3, A - 2), C = Math.max(A - B + 1, pick(r, 3, A - 1)), px = pick(r, 2, 9), py = pick(r, 2, 9);
      const cs = [[0, 0], [B, 0], [B, Math.min(A - B, C)], [A - C, C], [0, C]], Z = cs.map(([x, y]) => px * x + py * y), answer = Math.max(...Z);
      return {
        q: `<p>Maximise Z = ${px}x + ${py}y subject to x + y ≤ ${A}, x ≤ ${B}, y ≤ ${C}, x ≥ 0, y ≥ 0. What is the largest Z?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Draw the feasible region, list its corner points, and evaluate Z at each. The largest value is the answer.',
        solution: steps(`Corners: ${cs.map(([x, y]) => `(${x}, ${y})`).join(', ')}.`, `Z at each: ${Z.join(', ')}.`, `Maximum Z = <b>${answer}</b>.`), A, B, C, px, py,
      };
    },
    verify: (p) => { let best = -Infinity; for (let x = 0; x <= p.B; x += 0.5) for (let y = 0; y <= p.C; y += 0.5) if (x + y <= p.A) best = Math.max(best, p.px * x + p.py * y); return best; },
  },
  'bayes': {
    title: 'which machine made the faulty bolt? (Bayes)',
    make(r) {
      const a = pick(r, 3, 7) * 10, da = pick(r, 1, 6), db = pick(r, 1, 6);
      const pa = (a / 100) * (da / 100), pb = ((100 - a) / 100) * (db / 100), answer = pa / (pa + pb);
      return {
        q: `<p>Machine A makes ${a}% of a factory's bolts and machine B the rest. ${da}% of A's bolts and ${db}% of B's are faulty. A bolt picked at random is faulty. What is the probability it came from A? (Answer as a decimal.)</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'P(A | faulty) = P(A)P(faulty | A) ÷ [P(A)P(faulty | A) + P(B)P(faulty | B)].',
        solution: steps(`P(A)P(F|A) = ${a / 100} × ${da / 100} = ${+pa.toFixed(4)}.`, `P(B)P(F|B) = ${(100 - a) / 100} × ${db / 100} = ${+pb.toFixed(4)}.`, `P(A|F) = ${+pa.toFixed(4)} ÷ ${+(pa + pb).toFixed(4)} = <b>${+answer.toFixed(4)}</b>.`), a, da, db,
      };
    },
    verify: (p) => { const N = 1e6, fa = N * p.a / 100 * p.da / 100, fb = N * (100 - p.a) / 100 * p.db / 100; return fa / (fa + fb); },
  },

  // ---------- Module 9: biology ----------
  'ploidy': {
    title: 'chromosome number in a plant tissue',
    make(r) {
      const n = [7, 8, 10, 12, 14, 20][pick(r, 0, 5)];
      const t = [['endosperm', 3], ['zygote', 2], ['pollen grain (generative cell)', 1], ['nucellus', 2], ['synergid', 1], ['primary endosperm nucleus', 3], ['leaf cell', 2], ['egg cell', 1]][pick(r, 0, 7)];
      const answer = n * t[1];
      return {
        q: `<p>A flowering plant has ${2 * n} chromosomes in its leaf cells. How many chromosomes are in a cell of its ${t[0]}?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Leaf cells are 2n. Gametes and the cells of the embryo sac are n; the zygote is 2n; the endosperm (polar nuclei + a male gamete) is 3n.',
        solution: steps(`2n = ${2 * n}, so n = ${n}.`, `The ${t[0]} is ${t[1]}n.`, `${t[1]} × ${n} = <b>${answer}</b>.`), n, k: t[1],
      };
    },
    verify: (p) => p.n * p.k,
  },
  'gamete-count': {
    title: 'how many gametes from meiosis?',
    make(r) {
      const cells = pick(r, 1, 50) * 10, sex = pick(r, 0, 1) ? 'primary spermatocytes' : 'primary oocytes', answer = sex.includes('sperm') ? 4 * cells : cells;
      return {
        q: `<p>${cells} ${sex} complete meiosis. How many functional ${sex.includes('sperm') ? 'sperms' : 'ova'} are formed?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Each primary spermatocyte gives 4 sperms. Each primary oocyte gives 1 ovum and polar bodies, which degenerate.',
        solution: steps(sex.includes('sperm') ? `1 primary spermatocyte → 2 secondary spermatocytes → 4 spermatids → 4 sperms.` : `1 primary oocyte → 1 secondary oocyte + 1st polar body → 1 ovum + 2nd polar body. Polar bodies are not functional.`, `${cells} × ${sex.includes('sperm') ? 4 : 1} = <b>${answer}</b>.`), cells, sex,
      };
    },
    verify: (p) => p.cells * (p.sex.includes('sperm') ? 4 : 1),
  },
  'dihybrid-ratio': {
    title: 'expected offspring from a dihybrid cross',
    make(r) {
      const N = pick(r, 2, 20) * 16, ph = [['round and yellow (both dominant)', 9], ['round and green', 3], ['wrinkled and yellow', 3], ['wrinkled and green (both recessive)', 1]][pick(r, 0, 3)], answer = (N * ph[1]) / 16;
      return {
        q: `<p>Two pea plants that are heterozygous for seed shape and seed colour (RrYy × RrYy) give ${N} offspring. About how many are ${ph[0]}?</p>`,
        answer, unit: 'plants', tol: 0, abs: 0.01,
        hint: 'Independent assortment gives 9 : 3 : 3 : 1 out of 16.',
        solution: steps(`Fraction = ${ph[1]}/16.`, `${N} × ${ph[1]}/16 = <b>${answer}</b>.`), N, k: ph[1],
      };
    },
    verify: (p) => (p.N / 16) * p.k,
  },
  'chargaff': {
    title: 'base percentages in double-stranded DNA',
    make(r) {
      const A = pick(r, 10, 40), ask = ['guanine', 'cytosine', 'thymine'][pick(r, 0, 2)], answer = ask === 'thymine' ? A : 50 - A;
      return {
        q: `<p>A double-stranded DNA sample has ${A}% adenine. What percentage is ${ask}?</p>`,
        answer, unit: '%', tol: 0, abs: 0.01,
        hint: 'Chargaff: A = T and G = C, and all four add to 100%.',
        solution: steps(`T = A = ${A}%, so A + T = ${2 * A}%.`, `G + C = ${100 - 2 * A}%, so G = C = ${50 - A}%.`, `${ask[0].toUpperCase() + ask.slice(1)} = <b>${answer}%</b>.`), A, ask,
      };
    },
    verify: (p) => (p.ask === 'thymine' ? p.A : (100 - 2 * p.A) / 2),
  },
  'hardy-weinberg': {
    title: 'carriers from the Hardy-Weinberg rule',
    make(r) {
      const q = [0.1, 0.2, 0.3, 0.4, 0.05][pick(r, 0, 4)], qq = +(q * q).toFixed(4), answer = 2 * q * (1 - q) * 100;
      return {
        q: `<p>In a population in Hardy-Weinberg equilibrium, ${+(qq * 100).toFixed(2)}% of people show a recessive trait (aa). What percentage are carriers (Aa)?</p>`,
        answer, unit: '%', tol: 0.001,
        hint: 'q² = frequency of aa. q = √q², p = 1 − q, carriers = 2pq.',
        solution: steps(`q² = ${qq}, so q = ${q}.`, `p = 1 − ${q} = ${+(1 - q).toFixed(2)}.`, `2pq = 2 × ${+(1 - q).toFixed(2)} × ${q} = ${+(answer / 100).toFixed(4)} = <b>${+answer.toFixed(2)}%</b>.`), qq,
      };
    },
    verify: (p) => { const q = Math.sqrt(p.qq); return 200 * q * (1 - q); },
  },
  'bacterial-growth': {
    title: 'bacteria doubling in a fermenter',
    make(r) {
      const N0 = pick(r, 1, 9) * 100, g = [20, 30, 40, 60][pick(r, 0, 3)], k = pick(r, 2, 8), answer = N0 * 2 ** k;
      return {
        q: `<p>A culture starts with ${N0} bacteria that divide every ${g} minutes. With plenty of food, how many are there after ${(g * k) / 60} hours?</p>`,
        answer, unit: 'cells', tol: 0, abs: 0.01,
        hint: 'Number of generations = time ÷ doubling time. N = N₀ × 2ⁿ.',
        solution: steps(`${g * k} min ÷ ${g} min = ${k} generations.`, `N = ${N0} × 2<sup>${k}</sup> = <b>${answer.toLocaleString('en-IN')}</b>.`), N0, g, k,
      };
    },
    verify: (p) => p.N0 * Math.pow(2, (p.g * p.k) / p.g),
  },
  'pcr-copies': {
    title: 'DNA copies after PCR cycles',
    make(r) {
      const N0 = pick(r, 1, 5), n = pick(r, 5, 25), answer = N0 * 2 ** n;
      return {
        q: `<p>A PCR starts with ${N0} double-stranded copies of a gene. Assuming every cycle doubles the DNA, how many copies are there after ${n} cycles?</p>`,
        answer, unit: 'copies', tol: 0.0001,
        hint: 'Each cycle (denature, anneal, extend) doubles the number of copies: N = N₀ × 2ⁿ.',
        solution: steps(`N = ${N0} × 2<sup>${n}</sup> = <b>${answer.toLocaleString('en-IN')}</b>.`, `That is why ${n} cycles, about ${Math.round(n * 3)} minutes, turn a trace of DNA into enough to test.`), N0, n,
      };
    },
    verify: (p) => p.N0 * Math.exp(p.n * Math.LN2),
  },
  'ten-percent': {
    title: 'energy up a food chain (10% law)',
    make(r) {
      const E = pick(r, 1, 9) * 10000, lv = pick(r, 2, 4), names = ['', 'producers', 'herbivores', 'primary carnivores', 'secondary carnivores'], answer = E * 0.1 ** (lv - 1);
      return {
        q: `<p>Producers in an ecosystem fix ${E.toLocaleString('en-IN')} J of energy. By the 10% law, how much energy reaches the ${names[lv]} (J)?</p>`,
        answer, unit: 'J', tol: 0.001,
        hint: 'Each step up the chain passes on about 10% of the energy of the level below.',
        solution: steps(`From producers to ${names[lv]} is ${lv - 1} step${lv > 2 ? 's' : ''}.`, `${E} × 0.1<sup>${lv - 1}</sup> = <b>${+answer.toFixed(2)} J</b>.`), E, lv,
      };
    },
    verify: (p) => p.E / Math.pow(10, p.lv - 1),
  },
  'species-area': {
    title: 'species richness from the species-area relation',
    make(r) {
      const C = pick(r, 2, 10) * 5, Z = [0.1, 0.15, 0.2][pick(r, 0, 2)], A = [100, 1000, 10000, 100000][pick(r, 0, 3)], answer = C * A ** Z;
      return {
        q: `<p>For a group of plants, the species-area relation is S = C·A<sup>Z</sup> with C = ${C} and Z = ${Z}. How many species would you expect in an area of ${A.toLocaleString('en-IN')} km²?</p>`,
        answer, unit: 'species', tol: 0.01,
        hint: 'Plug in: S = C × A^Z. On a log-log graph this is a straight line, log S = log C + Z log A.',
        solution: steps(`A<sup>Z</sup> = ${A}<sup>${Z}</sup> = ${+(A ** Z).toFixed(3)}.`, `S = ${C} × ${+(A ** Z).toFixed(3)} ≈ <b>${+answer.toFixed(1)}</b>.`), C, Z, A,
      };
    },
    verify: (p) => 10 ** (Math.log10(p.C) + p.Z * Math.log10(p.A)),
  },
};
