// Live problems for Offline AI, part f: Module 16 (cost), Module 17 (pros, cons and limits) and Module 18 (sectors
// and careers). See ../problems.js. Each make(rand) returns { q, answer, unit, tol, hint, solution } plus its inputs;
// verify(p) works the answer out another way for tests/course-kit.mjs. Inputs are shown in full (no rounding).
import { pick, n, steps } from './util.js';

/** A number shown in full, with thousands separators. */
const f = (v) => (+v.toFixed(6)).toLocaleString('en-CA', { maximumFractionDigits: 6 });
/** Money to two decimals. */
const m2 = (v) => v.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const one = (r, list) => list[Math.min(list.length - 1, Math.floor(r() * list.length))];

export default {
  // ---------- 16.1 What the plans give you ----------
  'what-subscriptions-give-landed': {
    title: 'What does a US$ plan really cost in Canada?',
    make(r) {
      const p = one(r, [20, 100, 200]), x = pick(r, 1.3, 1.45, 0.01), fee = one(r, [0, 2.5]), t = one(r, [5, 13, 15]);
      const taxed = p * (1 + t / 100), answer = taxed * x * (1 + fee / 100);
      return {
        q: `<p>A plan costs <b>US$${p}</b> a month. Checkout adds <b>${t}%</b> sales tax (GST or HST). Your bank converts at <b>1 US$ = ${f(x)} CA$</b> and adds a foreign-exchange fee of <b>${f(fee)}%</b>. What do you pay each month in Canadian dollars?</p>`,
        answer, unit: 'CA$', tol: 0.005,
        hint: 'Add the tax to the US$ price first. Then convert to CA$ with the rate, then add the bank fee on top.',
        solution: steps(
          `Price with tax: ${p} × ${f(1 + t / 100)} = US$${m2(taxed)}.`,
          `Converted: ${m2(taxed)} × ${f(x)} = CA$${m2(taxed * x)}.`,
          `With the ${f(fee)}% fee: × ${f(1 + fee / 100)} = <b>CA$${m2(answer)}</b>.`,
          'Order does not matter here: the tax, the rate and the fee are all multipliers.'),
        p, x, fee, t,
      };
    },
    verify: (q) => { const cad = q.p * q.x; return cad + cad * q.t / 100 + (cad + cad * q.t / 100) * q.fee / 100; },
  },
  'what-subscriptions-give-per-hour': {
    title: 'When is the heavy plan cheaper per hour?',
    make(r) {
      const a = 20, hA = pick(r, 5, 20, 1), b = one(r, [100, 200]);
      const perA = a / hA, answer = b / perA;
      return {
        q: `<p>You use a <b>US$${a}</b> plan for about <b>${hA} hours</b> of real work a month. A heavy plan costs <b>US$${b}</b>. How many hours a month would you need to use the heavy plan for each hour to cost the same as now?</p>`,
        answer, unit: 'hours', tol: 0.01,
        hint: 'Work out what one hour costs you now (price ÷ hours). Then ask how many hours of that price add up to the heavy plan.',
        solution: steps(
          `Cost per hour now: ${a} ÷ ${hA} = US$${m2(perA)}.`,
          `Heavy plan hours at that rate: ${b} ÷ ${m2(perA)} = <b>${n(answer)} hours</b>.`,
          'Below that, the heavy plan costs more per hour than the one you have; above it, less.'),
        a, hA, b,
      };
    },
    verify: (q) => (q.b * q.hA) / q.a,
  },

  // ---------- 16.2 Pay-per-token APIs ----------
  'pay-per-token-bill': {
    title: 'What is this month\'s API bill?',
    make(r) {
      const J = pick(r, 500, 5000, 500), ti = pick(r, 1000, 6000, 500), to = pick(r, 200, 1200, 100), pi = pick(r, 1, 3, 0.5), po = pi * 5;
      const inC = (J * ti * pi) / 1e6, outC = (J * to * po) / 1e6, answer = inC + outC;
      return {
        q: `<p>A script summarises <b>${f(J)}</b> documents a month. Each job sends <b>${f(ti)}</b> tokens and gets back <b>${f(to)}</b>. The model costs <b>US$${f(pi)}</b> per million input tokens and <b>US$${f(po)}</b> per million output tokens. What is the monthly bill?</p>`,
        answer, unit: 'US$', tol: 0.005,
        hint: 'Find all the input tokens in a month and all the output tokens. Turn each into millions, then multiply by its own price.',
        solution: steps(
          `Input: ${f(J)} × ${f(ti)} = ${f(J * ti)} tokens = ${f(J * ti / 1e6)} million × US$${f(pi)} = US$${m2(inC)}.`,
          `Output: ${f(J)} × ${f(to)} = ${f(J * to)} tokens = ${f(J * to / 1e6)} million × US$${f(po)} = US$${m2(outC)}.`,
          `Bill: <b>US$${m2(answer)}</b> a month.`),
        J, ti, to, pi, po,
      };
    },
    verify: (q) => q.J * (q.ti * q.pi + q.to * q.po) / 1e6,
  },
  'pay-per-token-cache': {
    title: 'The bill with cached instructions',
    make(r) {
      const J = pick(r, 10000, 50000, 5000), F = pick(r, 1000, 4000, 500), E = pick(r, 200, 800, 100), O = pick(r, 5, 50, 5), pi = one(r, [0.5, 1, 2]);
      const po = pi * 5, pc = pi / 10;
      const cache = (J * F * pc) / 1e6, fresh = (J * E * pi) / 1e6, out = (J * O * po) / 1e6, answer = cache + fresh + out;
      return {
        q: `<p>A shop sorts <b>${f(J)}</b> emails a month. Every request starts with the same <b>${f(F)}</b> tokens of instructions (cached, so they cost a tenth of the input price), then the email of <b>${f(E)}</b> tokens. The answer is <b>${f(O)}</b> tokens. Prices per million: input <b>US$${f(pi)}</b>, output <b>US$${f(po)}</b>. Ignoring the small one-off cost of writing the cache, what is the monthly bill?</p>`,
        answer, unit: 'US$', tol: 0.005,
        hint: 'Three parts: cached instructions at one tenth of the input price, the email at the full input price, and the answer at the output price. Each is jobs × tokens × price ÷ 1,000,000.',
        solution: steps(
          `Cached price: ${f(pi)} ÷ 10 = US$${f(pc)} per million.`,
          `Instructions: ${f(J)} × ${f(F)} × ${f(pc)} ÷ 10<sup>6</sup> = US$${m2(cache)}.`,
          `Emails: ${f(J)} × ${f(E)} × ${f(pi)} ÷ 10<sup>6</sup> = US$${m2(fresh)}.`,
          `Answers: ${f(J)} × ${f(O)} × ${f(po)} ÷ 10<sup>6</sup> = US$${m2(out)}.`,
          `Total: <b>US$${m2(answer)}</b>. Without the cache the instructions alone would cost US$${m2(cache * 10)}.`),
        J, F, E, O, pi,
      };
    },
    verify: (q) => (q.J / 1e6) * (q.F * q.pi * 0.1 + q.E * q.pi + q.O * q.pi * 5),
  },

  // ---------- 16.3 Full cost of owning ----------
  'cost-of-owning-monthly': {
    title: 'What does the machine really cost each month?',
    make(r) {
      const hw = pick(r, 800, 2400, 100), ex = pick(r, 50, 200, 25), rs = pick(r, 30, 50, 10), mo = one(r, [24, 36, 48]), el = pick(r, 1, 8, 1), hr = pick(r, 0, 2, 0.5), rate = pick(r, 10, 30, 5);
      const back = (hw * rs) / 100, share = (hw + ex - back) / mo, answer = share + el + hr * rate;
      return {
        q: `<p>You buy a machine for <b>${f(hw)}</b> plus <b>${f(ex)}</b> of extras. You expect to sell the machine for <b>${rs}%</b> of its price after <b>${mo} months</b>. Electricity adds <b>${el}</b> a month, and upkeep takes <b>${f(hr)} hours</b> a month that you value at <b>${rate}</b> an hour. What is the monthly cost of owning it? (Same currency throughout.)</p>`,
        answer, unit: 'a month', tol: 0.005,
        hint: 'Take the resale value off the price plus extras, spread what is left over the months, then add electricity and your time.',
        solution: steps(
          `Resale: ${rs}% of ${f(hw)} = ${f(back)}.`,
          `Hardware share: (${f(hw)} + ${f(ex)} − ${f(back)}) ÷ ${mo} = ${m2(share)} a month.`,
          `Time: ${f(hr)} × ${rate} = ${f(hr * rate)} a month.`,
          `Total: ${m2(share)} + ${el} + ${f(hr * rate)} = <b>${m2(answer)} a month</b>.`),
        hw, ex, rs, mo, el, hr, rate,
      };
    },
    verify: (q) => (q.hw * (1 - q.rs / 100) + q.ex) / q.mo + q.el + q.hr * q.rate,
  },

  // ---------- 16.4 Break-even ----------
  'break-even-months': {
    title: 'After how many months does local pay back?',
    make(r) {
      const hw = pick(r, 1000, 5000, 250), rs = pick(r, 0, 40, 10), c = pick(r, 60, 240, 20), e = pick(r, 2, 15, 1);
      const net = hw * (1 - rs / 100), answer = net / (c - e);
      return {
        q: `<p>A team spends <b>${c}</b> a month on cloud AI plans. They could cancel them and buy a machine for <b>${f(hw)}</b>, expecting to get <b>${rs}%</b> back when they sell it. It adds <b>${e}</b> a month to the power bill. After how many months does the machine pay for itself?</p>`,
        answer, unit: 'months', tol: 0.01,
        hint: 'What the machine really costs is its price minus the resale. Each month you save the plan price minus the power. Divide the first by the second.',
        solution: steps(
          `Real cost: ${f(hw)} × (1 − ${rs / 100}) = ${f(net)}.`,
          `Saving each month: ${c} − ${e} = ${c - e}.`,
          `Break-even: ${f(net)} ÷ ${c - e} = <b>${n(answer)} months</b>.`),
        hw, rs, c, e,
      };
    },
    verify: (q) => { let mo = 0, lo = 0, hi = 5000; for (let i = 0; i < 70; i++) { mo = (lo + hi) / 2; (q.c * mo < q.hw * (1 - q.rs / 100) + q.e * mo) ? (lo = mo) : (hi = mo); } return mo; },
  },
  'break-even-never-price': {
    title: 'At what power price does it never pay back?',
    make(r) {
      const W = pick(r, 300, 750, 50), h = pick(r, 2, 6, 1), p = one(r, [20, 25, 30]);
      const kwh = (W * h * 30) / 1000, answer = p / kwh;
      return {
        q: `<p>A desktop draws <b>${W} W</b> while it works, <b>${h} hours</b> a day, 30 days a month. It replaces a plan that costs <b>${p}</b> a month. Above what electricity price per kWh is the power alone as expensive as the plan, so the machine can never pay back?</p>`,
        answer, unit: 'per kWh', tol: 0.005,
        hint: 'Find the kWh used each month (watts × hours × days ÷ 1,000). The price where power costs as much as the plan is the plan price ÷ those kWh.',
        solution: steps(
          `Energy: ${W} × ${h} × 30 ÷ 1,000 = ${f(kwh)} kWh a month.`,
          `Price where power = plan: ${p} ÷ ${f(kwh)} = <b>${n(answer)} per kWh</b>.`,
          'Above that, each month on local costs more than the plan, so the hardware is never paid back.'),
        W, h, p,
      };
    },
    verify: (q) => q.p * 1000 / (q.W * q.h * 30),
  },

  // ---------- 16.5 When the cloud wins ----------
  'when-cloud-wins-volume': {
    title: 'At what volume does local win?',
    make(r) {
      const ti = pick(r, 1000, 5000, 500), to = pick(r, 200, 1000, 100), pi = one(r, [1, 2, 3]), po = pi * 5, L = pick(r, 30, 120, 10);
      const per = (ti * pi + to * po) / 1e6, answer = L / per;
      return {
        q: `<p>A job sends <b>${f(ti)}</b> tokens to an API and gets <b>${f(to)}</b> back, at <b>US$${pi}</b> per million in and <b>US$${po}</b> per million out. An office machine that does the same job well costs <b>US$${L}</b> a month in all (hardware spread over its life plus power). How many jobs a month before local is cheaper?</p>`,
        answer, unit: 'jobs', tol: 0.01,
        hint: 'Work out what one job costs on the API. The machine costs the same each month whatever the volume, so divide its monthly cost by the cost of one job.',
        solution: steps(
          `One job: (${f(ti)} × ${pi} + ${f(to)} × ${po}) ÷ 10<sup>6</sup> = US$${f(per)}.`,
          `Jobs to match the machine: ${L} ÷ ${f(per)} = <b>${n(answer, 4)} jobs a month</b>.`,
          'Fewer jobs than that: the API is cheaper. More: local is cheaper, if it passes your quality test.'),
        ti, to, pi, po, L,
      };
    },
    verify: (q) => (q.L * 1e6) / (q.ti * q.pi + q.to * q.po),
  },

  // ---------- 16.6 Hybrid budget ----------
  'hybrid-budget-saving': {
    title: 'What does the hybrid budget save in a year?',
    make(r) {
      const N = pick(r, 8, 15, 1), p = one(r, [20, 25, 30]), k = pick(r, 1, 2, 1), mm = pick(r, 40, 80, 5), e = pick(r, 2, 12, 1);
      const before = N * p, after = k * p + mm + e, answer = 12 * (before - after);
      return {
        q: `<p>An office pays for <b>${N}</b> AI plans at <b>${p}</b> a month each. It switches to a hybrid budget: <b>${k}</b> plans kept for the hardest work, plus an office machine whose cost spread over its life is <b>${mm}</b> a month, and <b>${e}</b> a month of power. How much does it save in a year?</p>`,
        answer, unit: 'a year', tol: 0.001,
        hint: 'Monthly cost before: plans × price. After: kept plans × price + machine share + power. Take the difference and multiply by 12.',
        solution: steps(
          `Before: ${N} × ${p} = ${before} a month.`,
          `After: ${k} × ${p} + ${mm} + ${e} = ${after} a month.`,
          `Saving: (${before} − ${after}) × 12 = <b>${f(answer)} a year</b>.`),
        N, p, k, mm, e,
      };
    },
    verify: (q) => 12 * ((q.N - q.k) * q.p) - 12 * (q.mm + q.e),
  },

  // ---------- 17.1 Quality gap ----------
  'quality-gap-error-hours': {
    title: 'How much time do the mistakes cost?',
    make(r) {
      const J = pick(r, 500, 3000, 100), er = pick(r, 1, 6, 1), mi = pick(r, 5, 20, 5);
      const errs = (J * er) / 100, answer = (errs * mi) / 60;
      return {
        q: `<p>A local model handles <b>${f(J)}</b> jobs a month. It gets <b>${er}%</b> of them wrong, and each mistake takes <b>${mi} minutes</b> to spot and fix. How many hours a month do the mistakes cost?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'Number of mistakes = jobs × error rate. Multiply by the minutes per mistake, then divide by 60.',
        solution: steps(
          `Mistakes: ${f(J)} × ${er}% = ${f(errs)}.`,
          `Minutes: ${f(errs)} × ${mi} = ${f(errs * mi)}.`,
          `Hours: ÷ 60 = <b>${n(answer)}</b>. Going local is worth it if it saves more time or money than this.`),
        J, er, mi,
      };
    },
    verify: (q) => q.J * (q.er / 100) * (q.mi / 60),
  },

  // ---------- 17.2 Speed limits ----------
  'speed-limits-ceiling': {
    title: 'What is the top writing speed?',
    make(r) {
      const B = one(r, [120, 273, 400, 546, 819, 936, 1792]), A = one(r, [3, 5.1, 8, 12, 14, 27, 32]), b = one(r, [4.5, 5, 8]);
      const gb = (A * b) / 8, answer = B / gb;
      return {
        q: `<p>A machine has <b>${B} GB/s</b> of memory bandwidth. The model has <b>${f(A)} billion</b> active parameters stored at <b>${f(b)} bits</b> each. What is the ceiling on writing speed, in tokens per second?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'Each token needs one read of the active weights. Their size in GB is billions of parameters × bits ÷ 8. Divide bandwidth by that size.',
        solution: steps(
          `Size read per token: ${f(A)} × ${f(b)} ÷ 8 = ${f(gb)} GB.`,
          `Ceiling: ${B} ÷ ${f(gb)} = <b>${n(answer)} tokens per second</b>.`,
          'Real speed is usually 50 to 80% of this ceiling.'),
        B, A, b,
      };
    },
    verify: (q) => (q.B * 8) / (q.A * q.b),
  },
  'speed-limits-answer-time': {
    title: 'How long until the answer is finished?',
    make(r) {
      const P = pick(r, 1000, 40000, 1000), pre = pick(r, 200, 2000, 100), T = pick(r, 0, 3000, 500), A = pick(r, 100, 600, 100), d = pick(r, 15, 60, 5);
      const read = P / pre, write = (T + A) / d, answer = read + write;
      return {
        q: `<p>You paste a prompt of <b>${f(P)}</b> tokens. The machine reads prompts at <b>${f(pre)}</b> tokens per second and writes at <b>${d}</b> tokens per second. The model thinks for <b>${f(T)}</b> tokens, then writes a <b>${A}</b>-token answer. How many seconds until the answer is finished?</p>`,
        answer, unit: 'seconds', tol: 0.005,
        hint: 'Two phases. Reading: prompt tokens ÷ reading speed. Writing: thinking tokens plus answer tokens, ÷ writing speed. Add them.',
        solution: steps(
          `Reading the prompt: ${f(P)} ÷ ${f(pre)} = ${n(read)} s.`,
          `Writing: (${f(T)} + ${A}) ÷ ${d} = ${n(write)} s.`,
          `Total: <b>${n(answer)} seconds</b>.${T ? ` The thinking alone took ${n(T / d)} s.` : ''}`),
        P, pre, T, A, d,
      };
    },
    verify: (q) => (q.P * q.d + (q.T + q.A) * q.pre) / (q.pre * q.d),
  },

  // ---------- 17.3 Memory limits ----------
  'memory-limits-kv': {
    title: 'How big is the KV cache?',
    make(r) {
      const L = one(r, [32, 40, 48, 62]), H = one(r, [4, 8, 16]), D = 128, by = one(r, [2, 1]), T = one(r, [8192, 16384, 32768, 65536, 131072]);
      const bytesPer = 2 * L * H * D * by, answer = (bytesPer * T) / 1024 ** 3;
      return {
        q: `<p>A model has <b>${L}</b> layers, <b>${H}</b> key-value heads and a head size of <b>${D}</b>. The KV cache stores each number in <b>${by} byte${by > 1 ? 's' : ''}</b>. How many GB does the cache need for a context of <b>${f(T)}</b> tokens? (Here 1 GB = 1,024 × 1,024 × 1,024 bytes.)</p>`,
        answer, unit: 'GB', tol: 0.005,
        hint: 'Bytes per token = 2 (a key and a value) × layers × KV heads × head size × bytes per number. Multiply by the tokens, then divide by 1,024 three times.',
        solution: steps(
          `Per token: 2 × ${L} × ${H} × ${D} × ${by} = ${f(bytesPer)} bytes.`,
          `For ${f(T)} tokens: ${f(bytesPer)} × ${f(T)} = ${f(bytesPer * T)} bytes.`,
          `In GB: ÷ 1,024³ = <b>${n(answer)} GB</b>, on top of the weights.`),
        L, H, D, by, T,
      };
    },
    verify: (q) => (2 * q.L * q.H * q.D * q.by / 1024) * (q.T / 1024) / 1024,
  },

  // ---------- 17.4 Limits in theory ----------
  'theoretical-limits-chain': {
    title: 'How often is the whole chain right?',
    make(r) {
      const p = pick(r, 0.9, 0.99, 0.01), k = pick(r, 5, 40, 5);
      const answer = 100 * p ** k;
      return {
        q: `<p>An agent does a task in <b>${k}</b> steps. Each step is right <b>${f(p * 100)}%</b> of the time, and one wrong step spoils the result. In what percentage of runs is the whole task right?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'All steps must be right. Multiply the chance for one step by itself once for every step: p to the power n.',
        solution: steps(
          `Chance per step: ${f(p)}.`,
          `All ${k} right: ${f(p)}<sup>${k}</sup> = ${n(p ** k)}.`,
          `As a percentage: <b>${n(answer)}%</b>. Checking between steps stops one slip spoiling the whole run.`),
        p, k,
      };
    },
    verify: (q) => 100 * Math.exp(q.k * Math.log(q.p)),
  },

  // ---------- 17.5 Limits in practice ----------
  'practical-limits-upkeep': {
    title: 'What does upkeep cost in the first year?',
    make(r) {
      const s = pick(r, 4, 12, 1), mo = pick(r, 0.5, 2, 0.5), fx = pick(r, 2, 8, 1), v = pick(r, 15, 40, 5);
      const hrs = s + 12 * mo + fx, answer = hrs * v;
      return {
        q: `<p>Setting up a local AI machine takes <b>${s} hours</b>. Updates take <b>${f(mo)} hours</b> a month, and fixing problems about <b>${fx} hours</b> a year. You value your time at <b>${v}</b> an hour. What is the first year's upkeep worth?</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'Add setup + 12 months of updates + fixes to get the hours. Then multiply by your hourly value.',
        solution: steps(
          `Hours: ${s} + 12 × ${f(mo)} + ${fx} = ${f(hrs)}.`,
          `Value: ${f(hrs)} × ${v} = <b>${f(answer)}</b>.`,
          'Put this in the cost of owning (Lesson 16.3). From year two the setup hours drop out.'),
        s, mo, fx, v,
      };
    },
    verify: (q) => q.s * q.v + q.mo * q.v * 12 + q.fx * q.v,
  },

  // ---------- 17.6 Security and privacy ----------
  'security-privacy-slip': {
    title: 'How many bad actions slip through?',
    make(r) {
      const a = pick(r, 5, 30, 1), g = pick(r, 10, 40, 10), c = one(r, [90, 95, 99]);
      const fooled = 12 * a * (g / 100), answer = fooled * (1 - c / 100);
      return {
        q: `<p>An email agent receives about <b>${a}</b> prompt-injection attempts a month. Tests show the model falls for <b>${g}%</b> of them. A person approves every action before it happens and catches <b>${c}%</b> of the bad ones. How many bad actions would you expect to get through in a year?</p>`,
        answer, unit: 'a year', tol: 0.01,
        hint: 'Attempts in a year × share the model falls for = bad actions proposed. The person stops most; multiply by the share they miss (100% − catch rate).',
        solution: steps(
          `Attempts a year: ${a} × 12 = ${12 * a}.`,
          `Model fooled: ${12 * a} × ${g}% = ${n(fooled)} bad actions proposed.`,
          `Missed by the person: ${n(fooled)} × ${100 - c}% = <b>${n(answer)} a year</b>.`,
          `Without the approval step it would be all ${n(fooled)}. Giving the agent no send tool at all makes it zero.`),
        a, g, c,
      };
    },
    verify: (q) => (12 * q.a * q.g * (100 - q.c)) / 10000,
  },

  // ---------- 17.7 Law and ethics ----------
  'law-and-ethics-retention': {
    title: 'How many stored chats does a shorter retention remove?',
    make(r) {
      const C = pick(r, 20, 120, 5), R1 = one(r, [365, 180]), R2 = one(r, [30, 60, 90]);
      const answer = C * (R1 - R2);
      return {
        q: `<p>A clinic's AI front end saves about <b>${C}</b> chats a day, every day. It keeps each chat for <b>${R1} days</b>. The privacy officer wants to keep them for <b>${R2} days</b> instead. Once things settle, how many fewer chats are stored at any one time?</p>`,
        answer, unit: 'chats', tol: 0.001,
        hint: 'At any moment the store holds every chat from the last R days: chats per day × retention days. Compare the two retention periods.',
        solution: steps(
          `Now: ${C} × ${R1} = ${f(C * R1)} chats stored.`,
          `After: ${C} × ${R2} = ${f(C * R2)} chats stored.`,
          `Fewer: ${f(C * R1)} − ${f(C * R2)} = <b>${f(answer)}</b>. Less stored data means less to protect and less harm in a breach.`),
        C, R1, R2,
      };
    },
    verify: (q) => q.C * q.R1 - q.C * q.R2,
  },

  // ---------- 17.8 Cloud features locally ----------
  'cloud-features-locally-payback': {
    title: 'How fast does rebuilding a feature pay back?',
    make(r) {
      const U = pick(r, 10, 60, 5), s = pick(r, 1, 5, 1), H = pick(r, 2, 10, 1);
      const saved = U * s, answer = (H * 60) / saved;
      return {
        q: `<p>You use a cloud feature <b>${U} times</b> a month, and a local version would save you <b>${s} minute${s > 1 ? 's' : ''}</b> each time (no upload, no waiting). Setting it up takes <b>${H} hours</b>. After how many months has the setup paid for itself in time?</p>`,
        answer, unit: 'months', tol: 0.01,
        hint: 'Minutes saved a month = uses × minutes each. Turn the setup into minutes (× 60) and divide.',
        solution: steps(
          `Saved a month: ${U} × ${s} = ${saved} minutes.`,
          `Setup: ${H} × 60 = ${H * 60} minutes.`,
          `Payback: ${H * 60} ÷ ${saved} = <b>${n(answer)} months</b>.`),
        U, s, H,
      };
    },
    verify: (q) => q.H / (q.U * q.s / 60),
  },

  // ---------- 18.1 Healthcare ----------
  'healthcare-minutes-saved': {
    title: 'How much time does the clinic save?',
    make(r) {
      const h = pick(r, 6, 12, 1), rv = pick(r, 2, 4, 1), nn = pick(r, 15, 30, 1), d = pick(r, 1, 6, 1);
      const per = h - rv, answer = (per * nn * d) / 60;
      return {
        q: `<p>A doctor takes <b>${h} minutes</b> to write a visit note by hand, or <b>${rv} minutes</b> to check and correct a draft from a local model. Each of <b>${d}</b> doctor${d > 1 ? 's' : ''} writes <b>${nn}</b> notes a day. How many hours a day does the clinic save?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'Saving per note = minutes by hand − minutes to review. Multiply by notes and doctors, then divide by 60.',
        solution: steps(
          `Per note: ${h} − ${rv} = ${per} minutes.`,
          `Per day: ${per} × ${nn} × ${d} = ${per * nn * d} minutes.`,
          `In hours: ÷ 60 = <b>${n(answer)}</b>. The review time is not optional: the doctor signs the note.`),
        h, rv, nn, d,
      };
    },
    verify: (q) => (q.h * q.nn * q.d - q.rv * q.nn * q.d) / 60,
  },

  // ---------- 18.2 Law and accounting ----------
  'law-and-accounting-season': {
    title: 'Hours saved in tax season',
    make(r) {
      const C = pick(r, 80, 400, 20), o = pick(r, 30, 60, 5), nw = pick(r, 10, 20, 5);
      const answer = (C * (o - nw)) / 60;
      return {
        q: `<p>An accounting practice handles <b>${C}</b> clients in tax season. Checking each client's bank statements took <b>${o} minutes</b>. With a local model pulling out the totals and staff checking them, it takes <b>${nw} minutes</b>. How many staff hours does the season save?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'Minutes saved per client = old − new. Multiply by clients, then divide by 60.',
        solution: steps(
          `Per client: ${o} − ${nw} = ${o - nw} minutes.`,
          `All clients: ${C} × ${o - nw} = ${f(C * (o - nw))} minutes.`,
          `Hours: ÷ 60 = <b>${n(answer)}</b>.`),
        C, o, nw,
      };
    },
    verify: (q) => (q.C * q.o) / 60 - (q.C * q.nw) / 60,
  },

  // ---------- 18.3 Finance ----------
  'finance-checks': {
    title: 'How long do the flagged checks take?',
    make(r) {
      const F = pick(r, 100, 400, 50), k = pick(r, 20, 30, 1), fl = pick(r, 4, 12, 2), s = pick(r, 30, 90, 15);
      const fields = F * k, flagged = (fields * fl) / 100, answer = (flagged * s) / 3600;
      return {
        q: `<p>A research team reads <b>${F}</b> company filings a quarter. A local model pulls <b>${k}</b> fields from each, with page references, and flags <b>${fl}%</b> of the fields as uncertain. An analyst checks each flagged field in about <b>${s} seconds</b>. How many hours of checking is that a quarter?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'All fields = filings × fields per filing. Flagged = that × the flag rate. Multiply by seconds per check and divide by 3,600.',
        solution: steps(
          `All fields: ${F} × ${k} = ${f(fields)}.`,
          `Flagged: ${f(fields)} × ${fl}% = ${f(flagged)}.`,
          `Seconds: ${f(flagged)} × ${s} = ${f(flagged * s)}.`,
          `Hours: ÷ 3,600 = <b>${n(answer)}</b>. The page references are what make each check this quick.`),
        F, k, fl, s,
      };
    },
    verify: (q) => (q.F * q.k * q.fl * q.s) / 360000,
  },

  // ---------- 18.4 Education ----------
  'education-wait': {
    title: 'How long does the last student wait?',
    make(r) {
      const S = pick(r, 20, 40, 2), T = pick(r, 200, 500, 50), v = pick(r, 20, 60, 5);
      const asking = S / 2, each = T / v, answer = asking * each;
      return {
        q: `<p>A class of <b>${S}</b> students uses a classroom server. When the activity starts, half of them ask a question in the same minute. Each answer is about <b>${T}</b> tokens, and the server writes <b>${v}</b> tokens per second, one answer at a time (no batching). About how many seconds does the last student wait for their answer to finish?</p>`,
        answer, unit: 'seconds', tol: 0.005,
        hint: 'Number asking = students ÷ 2. Time per answer = tokens ÷ speed. The last student waits for every answer in the queue, including their own.',
        solution: steps(
          `Asking at once: ${S} ÷ 2 = ${asking}.`,
          `One answer: ${T} ÷ ${v} = ${n(each)} s.`,
          `Last student: ${asking} × ${n(each)} = <b>${n(answer)} seconds</b> (${n(answer / 60)} minutes). Batching (Lesson 15.1) lets the server write many answers at once.`),
        S, T, v,
      };
    },
    verify: (q) => (q.S * q.T) / (2 * q.v),
  },

  // ---------- 18.5 Software and data ----------
  'software-and-data-tokens': {
    title: 'How many tokens does the SQL helper send?',
    make(r) {
      const t = pick(r, 3, 10, 1), c = pick(r, 5, 15, 1), perCol = 12, perTable = 10, extra = 70;
      const answer = t * (perTable + perCol * c) + extra;
      return {
        q: `<p>The SQL helper sends the table layout and the question, never the rows. Your database has <b>${t}</b> tables with <b>${c}</b> columns each. Each table's first line costs about <b>${perTable}</b> tokens and each column line about <b>${perCol}</b>. The instructions and the question add <b>${extra}</b> tokens. How many tokens does one request send?</p>`,
        answer, unit: 'tokens', tol: 0.001,
        hint: 'One table costs its first line plus one line per column. Multiply by the number of tables, then add the instructions and question.',
        solution: steps(
          `One table: ${perTable} + ${perCol} × ${c} = ${perTable + perCol * c} tokens.`,
          `All tables: ${t} × ${perTable + perCol * c} = ${f(t * (perTable + perCol * c))}.`,
          `Plus instructions and question: + ${extra} = <b>${f(answer)} tokens</b>. Not one customer row is in it.`),
        t, c, perCol, perTable, extra,
      };
    },
    verify: (q) => q.t * q.perTable + q.t * q.c * q.perCol + q.extra,
  },

  // ---------- 18.6 Research labs ----------
  'research-labs-mislabelled': {
    title: 'How many labels are likely wrong?',
    make(r) {
      const N = one(r, [200, 250, 300, 400, 500]), ag = pick(r, 0.75, 0.95, 0.01), T = pick(r, 2000, 8000, 500);
      const A = Math.round(N * ag), rate = 1 - A / N, answer = T * rate;
      return {
        q: `<p>A lab uses a local model to sort <b>${f(T)}</b> survey answers into themes. Two researchers code a sample of <b>${N}</b> answers by hand and agree with the model on <b>${A}</b> of them. If the sample is typical, about how many of the ${f(T)} answers does the model label differently from the researchers?</p>`,
        answer, unit: 'answers', tol: 0.005,
        hint: 'Disagreement rate = (sample − agreements) ÷ sample. Apply that rate to the whole set.',
        solution: steps(
          `Agreement: ${A} ÷ ${N} = ${n(100 * A / N)}%.`,
          `Disagreement: ${N - A} ÷ ${N} = ${n(100 * rate)}%.`,
          `Whole set: ${f(T)} × ${N - A} ÷ ${N} ≈ <b>${n(answer)}</b> answers. Look at where the sample disagreed, and fix those theme definitions first.`),
        N, A, T,
      };
    },
    verify: (q) => (q.T * (q.N - q.A)) / q.N,
  },

  // ---------- 18.7 Air-gapped ----------
  'air-gapped-import': {
    title: 'How long does a model import take?',
    make(r) {
      const G = pick(r, 5, 70, 5), w = pick(r, 100, 400, 50), rd = pick(r, 200, 800, 100), hs = pick(r, 500, 1500, 250);
      const MB = G * 1000, tw = MB / w, tr = MB / rd, th = (2 * MB) / hs, answer = (tw + tr + th) / 60;
      return {
        q: `<p>A <b>${G} GB</b> model file must cross the air gap. Copying it onto the approved drive runs at <b>${w} MB/s</b>, copying it off inside runs at <b>${rd} MB/s</b>, and the SHA-256 checksum is worked out twice (outside and inside) at <b>${f(hs)} MB/s</b>. How many minutes do the copies and checks take? (1 GB = 1,000 MB.)</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: 'Turn GB into MB. Time for each pass = MB ÷ speed. Add the write, the read and two checksum passes, then divide by 60.',
        solution: steps(
          `Size: ${G} × 1,000 = ${f(MB)} MB.`,
          `Write: ${f(MB)} ÷ ${w} = ${n(tw)} s. Read: ${f(MB)} ÷ ${rd} = ${n(tr)} s.`,
          `Two checksums: 2 × ${f(MB)} ÷ ${f(hs)} = ${n(th)} s.`,
          `Total: ${n(tw + tr + th)} s ÷ 60 = <b>${n(answer)} minutes</b>.`),
        G, w, rd, hs,
      };
    },
    verify: (q) => (q.G * 1000 * (1 / q.w + 1 / q.rd + 2 / q.hs)) / 60,
  },

  // ---------- 18.8 Small business ----------
  'small-business-handling': {
    title: 'Hours saved on customer emails',
    make(r) {
      const E = pick(r, 20, 80, 5), o = pick(r, 3, 6, 1), nw = pick(r, 1, 2, 1), D = one(r, [26, 30]);
      const answer = (E * (o - nw) * D) / 60;
      return {
        q: `<p>A hotel answers about <b>${E}</b> guest emails a day, <b>${D}</b> days a month. Writing a reply took <b>${o} minutes</b>. With a local model drafting from the FAQ and staff checking, it takes <b>${nw} minute${nw > 1 ? 's' : ''}</b>. How many staff hours a month does that save?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'Minutes saved per email = old − new. Multiply by emails a day and days a month, then divide by 60.',
        solution: steps(
          `Per email: ${o} − ${nw} = ${o - nw} minutes.`,
          `Per month: ${E} × ${D} × ${o - nw} = ${f(E * D * (o - nw))} minutes.`,
          `Hours: ÷ 60 = <b>${n(answer)}</b>.`),
        E, o, nw, D,
      };
    },
    verify: (q) => (q.E * q.D * q.o - q.E * q.D * q.nw) / 60,
  },

  // ---------- 18.9 Field work ----------
  'field-work-battery': {
    title: 'How long will the battery last?',
    make(r) {
      const B = pick(r, 200, 1000, 100), W = one(r, [5, 10, 20, 30, 40, 60]);
      const usable = B * 0.85, answer = usable / W;
      return {
        q: `<p>A field team carries a <b>${f(B)} Wh</b> portable power station. About 15% is lost in conversion, so 85% reaches the device. Their machine draws <b>${W} W</b> while the model works. How many hours of model use do they get?</p>`,
        answer, unit: 'hours', tol: 0.005,
        hint: 'Usable energy = battery Wh × 0.85. Hours = usable Wh ÷ watts.',
        solution: steps(
          `Usable: ${f(B)} × 0.85 = ${f(usable)} Wh.`,
          `Hours: ${f(usable)} ÷ ${W} = <b>${n(answer)}</b>.`,
          'Idle time drains it too, so put the machine to sleep between questions.'),
        B, W,
      };
    },
    verify: (q) => (q.B / q.W) * 0.85,
  },

  // ---------- 18.10 Creators ----------
  'creators-rate': {
    title: 'How much does the hourly rate rise?',
    make(r) {
      const F = pick(r, 200, 800, 50), hh = pick(r, 8, 14, 1), d = pick(r, 1, 2, 1), e = pick(r, 2, 4, 1);
      const before = F / hh, after = F / (d + e), answer = after - before;
      return {
        q: `<p>A translation job pays <b>${F}</b>. By hand it takes <b>${hh} hours</b>. With a local model it takes <b>${d} hour${d > 1 ? 's' : ''}</b> to prepare and draft, then <b>${e} hours</b> of careful editing. By how much does the effective hourly rate rise?</p>`,
        answer, unit: 'an hour', tol: 0.005,
        hint: 'Effective rate = fee ÷ hours worked. Work it out both ways and take the difference.',
        solution: steps(
          `By hand: ${F} ÷ ${hh} = ${m2(before)} an hour.`,
          `With AI: ${F} ÷ (${d} + ${e}) = ${m2(after)} an hour.`,
          `Rise: <b>${m2(answer)} an hour</b>, if the quality holds after your edit.`),
        F, hh, d, e,
      };
    },
    verify: (q) => (q.F * (q.hh - q.d - q.e)) / (q.hh * (q.d + q.e)),
  },

  // ---------- 18.11 Careers ----------
  'careers-result': {
    title: 'Turn a measurement into a CV number',
    make(r) {
      const o = pick(r, 30, 90, 5), nw = pick(r, 10, 25, 5);
      const answer = (100 * (o - nw)) / o;
      return {
        q: `<p>Before your project, a weekly report took <b>${o} minutes</b>. You timed it with your local AI tool over a month: <b>${nw} minutes</b>. By what percentage did you cut the time? (This is the number for your CV bullet.)</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Percentage cut = (old − new) ÷ old × 100. Divide by the old time, not the new one.',
        solution: steps(
          `Time saved: ${o} − ${nw} = ${o - nw} minutes.`,
          `As a share of the old time: ${o - nw} ÷ ${o} = ${n((o - nw) / o)}.`,
          `Percentage: <b>${n(answer)}%</b>. A bullet: "Cut weekly report time by ${Math.round(answer)}% (${o} to ${nw} minutes) with a local AI tool."`),
        o, nw,
      };
    },
    verify: (q) => 100 - (100 * q.nw) / q.o,
  },

  // ---------- 18.12 Capstone ----------
  'capstone-value': {
    title: 'Is the setup worth it each month?',
    make(r) {
      const s = pick(r, 3, 12, 1), mi = pick(r, 15, 45, 15), v = pick(r, 20, 40, 5), c = pick(r, 40, 150, 10), D = 22;
      const hrs = (s * mi * D) / 60, value = hrs * v, answer = value - c;
      return {
        q: `<p>In your pilot, <b>${s}</b> staff each save <b>${mi} minutes</b> a day, <b>${D}</b> working days a month. Their time is worth <b>${v}</b> an hour. The setup costs <b>${c}</b> a month over its life (hardware share, power and upkeep). What is the net value each month?</p>`,
        answer, unit: 'a month', tol: 0.005,
        hint: 'Hours saved a month = staff × minutes a day × days ÷ 60. Multiply by the hourly value, then take off the monthly cost.',
        solution: steps(
          `Hours saved: ${s} × ${mi} × ${D} ÷ 60 = ${f(hrs)}.`,
          `Value of that time: ${f(hrs)} × ${v} = ${f(value)}.`,
          `Net: ${f(value)} − ${c} = <b>${f(answer)} a month</b>, if the measured saving holds outside the pilot.`),
        s, mi, v, c, D,
      };
    },
    verify: (q) => q.s * (q.mi / 60) * q.D * q.v - q.c,
  },
};
