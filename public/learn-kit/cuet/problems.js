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
};
