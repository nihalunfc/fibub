// Live problems for Offline AI, part a: Module 1 (why run AI yourself), Module 2 (how a language model works)
// and Module 3 (tokens). See ../problems.js. Each make(rand) returns { q, answer, unit, tol, hint, solution }
// plus its inputs; verify(p) works the answer out another way for tests/course-kit.mjs.
import { pick, n, steps, table } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);

export default {
  // ---------- 1.1 What this course gives you ----------
  'course-overview-pace': {
    title: 'How many weeks will the short path take?',
    make(r) {
      const L = pick(r, 20, 40, 5), per = 30, d = pick(r, 20, 60, 10), k = pick(r, 3, 7, 1);
      const total = L * per, week = d * k, answer = total / week;
      return {
        q: `<p>You plan to take <b>${L} lessons</b>. Each takes about 20 minutes of reading and 10 of practice. You can study <b>${d} minutes a day</b> on <b>${k} days a week</b>. About how many weeks will it take?</p>`,
        answer, unit: 'weeks', tol: 0.01,
        hint: 'Work out the total minutes (lessons × minutes per lesson), then the minutes you study in one week. Divide the first by the second.',
        solution: steps(
          `Minutes per lesson: 20 + 10 = ${per}.`,
          `Total: ${L} × ${per} = ${total} minutes.`,
          `Per week: ${d} × ${k} = ${week} minutes.`,
          `Weeks: ${total} ÷ ${week} = <b>${n(answer)}</b>.`),
        L, per, d, k,
      };
    },
    verify: (p) => ((p.L * p.per) / 60) / ((p.d * p.k) / 60),
  },

  // ---------- 1.2 Cloud AI and local AI ----------
  'cloud-vs-local-breakeven': {
    title: 'When does buying hardware beat a plan?',
    make(r) {
      const p = pick(r, 15, 40, 5), H = pick(r, 400, 1600, 100), e = pick(r, 2, 8, 1);
      const answer = H / (p - e);
      return {
        q: `<p>A freelancer pays <b>${p} a month</b> for a cloud AI plan. A computer that could run a good local model costs <b>${H}</b>, and running it adds about <b>${e} a month</b> to the electricity bill. After how many months is local cheaper in total? (Same currency throughout.)</p>`,
        answer, unit: 'months', tol: 0.01,
        hint: 'Cloud costs p × m and local costs H + e × m. Set them equal and solve for m: local catches up by (p − e) each month.',
        solution: steps(
          `Cloud after m months: ${p}m. Local: ${H} + ${e}m.`,
          `Each month local catches up by ${p} − ${e} = ${p - e}.`,
          `Head start to make up: ${H}. Months: ${H} ÷ ${p - e} = <b>${n(answer)}</b>.`,
          `After that, every month on local saves ${p - e}.`),
        p, H, e,
      };
    },
    verify: (q) => { let m = 0, lo = 0, hi = 1000; for (let i = 0; i < 60; i++) { m = (lo + hi) / 2; (q.p * m < q.H + q.e * m) ? (lo = m) : (hi = m); } return m; },
  },

  // ---------- 1.3 What offline really means ----------
  'what-offline-means-download': {
    title: 'How long is the one-time download?',
    make(r) {
      const files = [pick(r, 0.5, 1, 0.5), pick(r, 3, 12, 1), pick(r, 1, 3, 0.5)], s = pick(r, 20, 200, 10);
      const size = sum(files), answer = (size * 8000) / s / 60;
      return {
        q: `<p>Before a trip with no signal you download an app (${files[0]} GB), a chat model (${files[1]} GB) and a speech-to-text model (${files[2]} GB). Your connection is <b>${s} Mbit/s</b>. About how many <b>minutes</b> will the download take?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Add the sizes. Multiply gigabytes by 8,000 to get megabits, divide by the speed for seconds, then by 60 for minutes.',
        solution: steps(
          `Total size: ${files.join(' + ')} = ${n(size)} GB.`,
          `In megabits: ${n(size)} × 8,000 = ${n(size * 8000)} Mbit.`,
          `Seconds: ${n(size * 8000)} ÷ ${s} = ${n(size * 8000 / s)} s.`,
          `Minutes: ÷ 60 = <b>${n(answer)}</b>.`),
        files, s,
      };
    },
    verify: (p) => p.files.reduce((t, f) => t + (f * 1000 * 8) / p.s, 0) / 60,
  },

  // ---------- 1.4 Pick your track ----------
  'pick-your-track-fit': {
    title: 'How much memory does this model need?',
    make(r) {
      const P = pick(r, 3, 32, 1), b = [4, 5, 8][Math.floor(r() * 2.999)], room = 2;
      const w = (P * b) / 8, answer = w + room;
      return {
        q: `<p>A model has <b>${P} billion</b> parameters stored at <b>${b} bits</b> per weight. Allow <b>${room} GB</b> of working room. About how many GB of memory does it need?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'Weights in GB = billions of parameters × bits per weight ÷ 8. Then add the working room.',
        solution: steps(
          `Weights: ${P} × ${b} ÷ 8 = ${n(w)} GB.`,
          `Add working room: ${n(w)} + ${room} = <b>${n(answer)} GB</b>.`,
          answer <= 12 ? 'That fits on a 16 GB laptop (about 4 GB goes to the system).' : answer <= 20 ? 'Too tight for a 16 GB laptop; a 24 GB machine or graphics card is comfortable.' : 'That needs a 32 GB machine or more.'),
        P, b, room,
      };
    },
    verify: (p) => p.P * 1e9 * (p.b / 8) / 1e9 + p.room,
  },

  // ---------- 1.5 Five myths ----------
  'local-ai-myths-speed': {
    title: 'Will this laptop write faster than you read?',
    make(r) {
      const bw = pick(r, 60, 200, 10), P = pick(r, 4, 14, 2), size = (P * 4) / 8 + 1, read = 7;
      const tps = bw / size, answer = tps / read;
      return {
        q: `<p>A laptop's memory reads at <b>${bw} GB/s</b>. You run a <b>${P}B</b> model at 4 bits per weight, which takes about ${n(size)} GB with everything it needs. You read about 7 tokens a second. About how many times faster than you read can it write, at best?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Top speed in tokens per second ≈ bandwidth ÷ model size. Then divide by your reading speed.',
        solution: steps(
          `Top speed: ${bw} ÷ ${n(size)} = ${n(tps)} tokens per second.`,
          `Compared with reading: ${n(tps)} ÷ ${read} = <b>${n(answer)}</b> times.`,
          'Real speeds are a little lower, but this tells you if a machine is worth trying.'),
        bw, size, read,
      };
    },
    verify: (p) => (p.bw / p.read) / p.size,
  },
  // ---------- 2.1 Predicting the next token ----------
  'next-token-prediction-softmax': {
    title: 'Chance of the top token at a given temperature',
    make(r) {
      const s = [pick(r, 2, 4, 0.5), pick(r, 0.5, 1.5, 0.5), 0], T = [0.5, 0.7, 1, 1.5][Math.floor(r() * 3.999)];
      const ex = s.map((v) => Math.exp(v / T)), tot = sum(ex), answer = (100 * ex[0]) / tot;
      return {
        q: `<p>An email helper is choosing the next word after "Thanks for your". It scores three tokens: " help" <b>${s[0]}</b>, " email" <b>${s[1]}</b>, " patience" <b>${s[2]}</b>. The temperature is <b>${T}</b>. What is the chance, in %, that it picks " help"?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Divide each score by T, take e to the power of each, then divide the first by the total. Multiply by 100 for a percentage.',
        solution: steps(
          `Divide by T = ${T}: ${s.map((v) => n(v / T, 4)).join(', ')}.`,
          `e to each: ${ex.map((v) => n(v, 4)).join(', ')}. Total ${n(tot, 4)}.`,
          `Share of " help": ${n(ex[0], 4)} ÷ ${n(tot, 4)} = <b>${n(answer)}%</b>.`),
        s, T,
      };
    },
    verify: (p) => 100 / (1 + p.s.slice(1).reduce((t, v) => t + Math.exp((v - p.s[0]) / p.T), 0)),
  },

  // ---------- 2.2 Parameters ----------
  'parameters-gb': {
    title: 'How big are the weights?',
    make(r) {
      const P = pick(r, 2, 70, 1), b = [16, 8, 4][Math.floor(r() * 2.999)];
      const answer = (P * b) / 8;
      return {
        q: `<p>A model card says the model has <b>${P}B</b> parameters. You plan to run it at <b>${b} bits</b> per parameter. How many GB do the weights take?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'GB = billions of parameters × bits ÷ 8, since 8 bits make one byte.',
        solution: steps(
          `Bytes per parameter: ${b} ÷ 8 = ${b / 8}.`,
          `${P} billion × ${b / 8} bytes = <b>${n(answer)} GB</b>.`,
          'The real file is a little bigger, because a few parts are stored more precisely.'),
        P, b,
      };
    },
    verify: (p) => (p.P * 1e9 * p.b) / 8 / 1e9,
  },

  // ---------- 2.3 Training and inference ----------
  'training-vs-inference-compute': {
    title: 'Training versus one long answer',
    make(r) {
      const P = pick(r, 2, 30, 1), D = pick(r, 2, 15, 1), N = pick(r, 500, 5000, 500);
      const train = 6 * P * 1e9 * D * 1e12, inf = 2 * P * 1e9 * N, answer = train / inf;
      return {
        q: `<p>A <b>${P}B</b> model was trained on <b>${D} trillion</b> tokens. You ask it for a <b>${N}-token</b> report. Using training ≈ 6 × parameters × training tokens and inference ≈ 2 × parameters per token, how many times more compute did training take than your report?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Write both with powers of ten. The parameters cancel: the ratio is (6 × training tokens) ÷ (2 × tokens written).',
        solution: steps(
          `Training: 6 × ${P}×10<sup>9</sup> × ${D}×10<sup>12</sup> = ${n(train)} calculations.`,
          `Your report: 2 × ${P}×10<sup>9</sup> × ${N} = ${n(inf)} calculations.`,
          `Ratio: <b>${n(answer)}</b>. The parameters cancel, so it is 3 × ${D}×10<sup>12</sup> ÷ ${N}.`),
        P, D, N,
      };
    },
    verify: (p) => (3 * p.D * 1e12) / p.N,
  },

  // ---------- 2.4 Transformers and attention ----------
  'transformers-attention-weight': {
    title: 'How much attention goes to the right word?',
    make(r) {
      const s = [pick(r, 1.5, 4, 0.5), pick(r, 0, 1.5, 0.5), pick(r, 0, 1, 0.5)];
      const ex = s.map(Math.exp), tot = sum(ex), answer = (100 * ex[0]) / tot;
      return {
        q: `<p>In "The dog chased the ball until it was tired", the token "it" compares its query with three earlier tokens. Match scores: "dog" <b>${s[0]}</b>, "ball" <b>${s[1]}</b>, "the" <b>${s[2]}</b>. After softmax, what share of its attention, in %, goes to "dog"?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Take e to the power of each score, add them up, and divide the "dog" one by the total.',
        solution: steps(
          `e to each score: ${ex.map((v) => n(v, 4)).join(', ')}.`,
          `Total: ${n(tot, 4)}.`,
          `Share for "dog": ${n(ex[0], 4)} ÷ ${n(tot, 4)} = <b>${n(answer)}%</b>. So "it" mostly takes on the dog's meaning.`),
        s,
      };
    },
    verify: (p) => 100 / (1 + Math.exp(p.s[1] - p.s[0]) + Math.exp(p.s[2] - p.s[0])),
  },

  // ---------- 2.5 Dense and MoE ----------
  'dense-vs-moe-speed': {
    title: 'Speed ceiling of a Mixture-of-Experts model',
    make(r) {
      const T = pick(r, 30, 120, 10), A = pick(r, 3, 12, 1), bw = pick(r, 200, 800, 50), b = 4;
      const mem = (T * b) / 8, read = (A * b) / 8, answer = bw / read;
      return {
        q: `<p>An MoE model is called "${T}B A${A}B": ${T} billion parameters in total, ${A} billion active per token. It runs at <b>4 bits</b> per parameter on a machine with <b>${bw} GB/s</b> memory bandwidth and enough memory to hold it. What is its speed ceiling in tokens per second?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'Speed follows the active parameters: GB read per token = active × bits ÷ 8. Then bandwidth ÷ that.',
        solution: steps(
          `Memory needed (all experts): ${T} × 4 ÷ 8 = ${n(mem)} GB. The machine must hold this.`,
          `Read per token (active only): ${A} × 4 ÷ 8 = ${n(read)} GB.`,
          `Ceiling: ${bw} ÷ ${n(read)} = <b>${n(answer)} tokens per second</b>. A dense ${T}B model would manage only ${n(bw / mem)}.`),
        A, bw, b,
      };
    },
    verify: (p) => (p.bw * 8) / (p.A * p.b),
  },

  // ---------- 2.6 Model types ----------
  'model-types-thinking-time': {
    title: 'What does thinking cost in time?',
    make(r) {
      const th = pick(r, 300, 3000, 100), a = pick(r, 100, 500, 50), sp = pick(r, 10, 60, 5);
      const answer = (th + a) / sp;
      return {
        q: `<p>A reasoning model writes <b>${th}</b> thinking tokens and then a <b>${a}</b>-token answer. Your machine writes <b>${sp} tokens per second</b>. How many seconds until the answer is finished? (Ignore the short time to read the question.)</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Thinking tokens are written at the same speed as answer tokens. Add them and divide by the speed.',
        solution: steps(
          `Total tokens written: ${th} + ${a} = ${th + a}.`,
          `Time: ${th + a} ÷ ${sp} = <b>${n(answer)} s</b>.`,
          `With thinking off it would be ${a} ÷ ${sp} = ${n(a / sp)} s. Use thinking when the problem is hard enough to be worth the wait.`),
        th, a, sp,
      };
    },
    verify: (p) => p.th / p.sp + p.a / p.sp,
  },

  // ---------- 2.7 Hallucination ----------
  'hallucination-chain': {
    title: 'Chance a whole report is error-free',
    make(r) {
      const p = pick(r, 0.9, 0.99, 0.01), k = pick(r, 5, 30, 1);
      const answer = 100 * Math.pow(p, k);
      return {
        q: `<p>A local model drafts a market report with <b>${k}</b> separate facts. Each fact is right with probability <b>${n(p)}</b>, independently. What is the chance, in %, that every fact is right?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'All must be right, so multiply the chance for one fact by itself, once per fact: pⁿ.',
        solution: steps(
          `Chance all ${k} are right: ${n(p)}<sup>${k}</sup> = ${n(answer / 100, 4)}.`,
          `As a percentage: <b>${n(answer)}%</b>.`,
          `So about ${n(100 - answer)}% of such reports contain at least one error. Check the facts against sources.`),
        p, k,
      };
    },
    verify: (q) => 100 * Math.exp(q.k * Math.log(q.p)),
  },
};
