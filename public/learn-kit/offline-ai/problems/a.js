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
  // ---------- 3.1 What a token is ----------
  'what-is-a-token-estimate': {
    title: 'Will the report fit?',
    make(r) {
      const pages = pick(r, 4, 30, 1), wpp = pick(r, 300, 600, 50);
      const words = pages * wpp, answer = words / 0.75;
      return {
        q: `<p>A consultant wants a local model to read a <b>${pages}-page</b> English report with about <b>${wpp} words</b> per page. About how many tokens is it? (Use 0.75 words per token.)</p>`,
        answer, unit: 'tokens', tol: 0.01,
        hint: 'Find the total words first, then divide by 0.75 (an English token is about three-quarters of a word).',
        solution: steps(
          `Words: ${pages} × ${wpp} = ${n(words, 5)}.`,
          `Tokens: ${n(words, 5)} ÷ 0.75 = <b>${n(answer, 4)}</b>.`,
          answer + 1500 <= 16384 ? 'With room for instructions and an answer, that fits a 16K window.' : 'That is too big for a 16K window in one go: split it or raise the context.'),
        words,
      };
    },
    verify: (p) => (p.words * 4) / 3,
  },

  // ---------- 3.2 Tokenizers differ ----------
  'tokenizers-differ-fit': {
    title: 'How much non-English text fits?',
    make(r) {
      const ctx = [4096, 8192, 16384, 32768][Math.floor(r() * 3.999)], keep = pick(r, 500, 2000, 250), c = pick(r, 1.5, 3, 0.5);
      const room = ctx - keep, answer = room * c;
      return {
        q: `<p>A translator's model has a context of <b>${ctx.toLocaleString('en-CA')}</b> tokens. She keeps <b>${keep.toLocaleString('en-CA')}</b> tokens for instructions and the answer. Her Hindi documents average <b>${c} characters per token</b> with this tokenizer. About how many characters of document fit?</p>`,
        answer, unit: 'characters', tol: 0.01,
        hint: 'Tokens left for the document = context − kept tokens. Characters = tokens × characters per token.',
        solution: steps(
          `Tokens left: ${ctx.toLocaleString('en-CA')} − ${keep.toLocaleString('en-CA')} = ${room.toLocaleString('en-CA')}.`,
          `Characters: ${room.toLocaleString('en-CA')} × ${c} = <b>${n(answer, 5)}</b>.`,
          `English at about 4 characters per token would fit ${n(room * 4, 5)}.`),
        ctx, keep, c,
      };
    },
    verify: (p) => p.ctx * p.c - p.keep * p.c,
  },

  // ---------- 3.3 Context window ----------
  'context-window-room': {
    title: 'How big can the document be?',
    make(r) {
      const ctx = [8192, 16384, 32768][Math.floor(r() * 2.999)], sys = pick(r, 200, 800, 100), hist = pick(r, 1000, 4000, 500), ans = pick(r, 500, 2000, 250);
      const answer = ctx - sys - hist - ans;
      return {
        q: `<p>A support bot runs with a context of <b>${ctx.toLocaleString('en-CA')}</b> tokens. Its system prompt is <b>${sys}</b> tokens, the chat so far is <b>${hist.toLocaleString('en-CA')}</b>, and you keep <b>${ans.toLocaleString('en-CA')}</b> free for the answer. How many tokens can a pasted document be?</p>`,
        answer, unit: 'tokens', tol: 0.005,
        hint: 'Everything must add up to no more than the context length. Subtract the other three from it.',
        solution: steps(
          `Already used or kept: ${sys} + ${hist.toLocaleString('en-CA')} + ${ans.toLocaleString('en-CA')} = ${(sys + hist + ans).toLocaleString('en-CA')}.`,
          `Room for the document: ${ctx.toLocaleString('en-CA')} − ${(sys + hist + ans).toLocaleString('en-CA')} = <b>${answer.toLocaleString('en-CA')}</b> tokens.`,
          `That is about ${n(answer * 0.75, 3)} English words.`),
        ctx, sys, hist, ans,
      };
    },
    verify: (p) => p.ctx - (p.sys + p.hist + p.ans),
  },

  // ---------- 3.4 Input, output and thinking ----------
  'input-output-thinking-time': {
    title: 'How long will this request take?',
    make(r) {
      const tin = pick(r, 1000, 8000, 500), rd = pick(r, 200, 1000, 100), th = pick(r, 0, 2000, 250), out = pick(r, 100, 600, 50), wr = pick(r, 8, 40, 2);
      const answer = tin / rd + (th + out) / wr;
      return {
        q: `<p>A lawyer sends <b>${tin.toLocaleString('en-CA')}</b> input tokens to a local reasoning model that reads at <b>${rd}</b> tokens per second. It writes <b>${th.toLocaleString('en-CA')}</b> thinking tokens and a <b>${out}</b>-token answer at <b>${wr}</b> tokens per second. About how many seconds does the whole request take?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Reading time = input ÷ reading speed. Writing time = (thinking + answer) ÷ writing speed. Add them.',
        solution: steps(
          `Reading: ${tin.toLocaleString('en-CA')} ÷ ${rd} = ${n(tin / rd)} s.`,
          `Writing: (${th} + ${out}) ÷ ${wr} = ${n((th + out) / wr)} s.`,
          `Total: <b>${n(answer)} s</b>. Writing is ${n(100 * ((th + out) / wr) / answer, 2)}% of it.`),
        tin, rd, th, out, wr,
      };
    },
    verify: (p) => (p.tin * p.wr + (p.th + p.out) * p.rd) / (p.rd * p.wr),
  },

  // ---------- 3.5 Tokens per second ----------
  'tokens-per-second-ceiling': {
    title: 'What writing speed should you expect?',
    make(r) {
      const bw = pick(r, 100, 1000, 50), size = pick(r, 3, 20, 0.5), eff = pick(r, 0.6, 0.8, 0.1);
      const ceil = bw / size, answer = ceil * eff;
      return {
        q: `<p>A shop owner is choosing a machine. Its memory bandwidth is <b>${bw} GB/s</b> and the model she wants takes <b>${size} GB</b>. If real engines reach about <b>${Math.round(eff * 100)}%</b> of the ceiling, what writing speed should she expect, in tokens per second?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'Ceiling = bandwidth ÷ model size (one full read of the model per token). Then take the given percentage of it.',
        solution: steps(
          `Ceiling: ${bw} ÷ ${size} = ${n(ceil)} tokens per second.`,
          `Realistic: ${n(ceil)} × ${eff} = <b>${n(answer)} tokens per second</b>.`,
          answer >= 10 ? 'Comfortable to read along with.' : 'Below about 10 it will feel slow for chat; a smaller model would help.'),
        bw, size, eff,
      };
    },
    verify: (p) => (p.bw * p.eff) / p.size,
  },

  // ---------- 3.6 Short, clear prompts ----------
  'token-saving-prompts-time': {
    title: 'Minutes saved by a shorter answer format',
    make(r) {
      const jobs = pick(r, 100, 1000, 50), oldT = pick(r, 250, 600, 50), newT = pick(r, 40, 150, 10), sp = pick(r, 8, 30, 2);
      const answer = (jobs * (oldT - newT)) / sp / 60;
      return {
        q: `<p>An office runs <b>${jobs}</b> invoice checks a week on a local model that writes <b>${sp}</b> tokens per second. Answers used to average <b>${oldT}</b> tokens. A tighter format ("Total; Due date; Problems: max 3 words each") cuts them to <b>${newT}</b>. How many <b>minutes</b> of writing does that save each week?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Tokens saved per job = old − new. Multiply by the jobs, divide by the speed for seconds, then by 60.',
        solution: steps(
          `Saved per job: ${oldT} − ${newT} = ${oldT - newT} tokens.`,
          `Per week: ${jobs} × ${oldT - newT} = ${n(jobs * (oldT - newT), 5)} tokens.`,
          `Time: ${n(jobs * (oldT - newT), 5)} ÷ ${sp} = ${n(jobs * (oldT - newT) / sp, 5)} s = <b>${n(answer)} minutes</b>.`),
        jobs, oldT, newT, sp,
      };
    },
    verify: (p) => (p.jobs * p.oldT) / p.sp / 60 - (p.jobs * p.newT) / p.sp / 60,
  },

  // ---------- 3.7 Trimming context ----------
  'token-saving-context-history': {
    title: 'Total tokens read by a long chat',
    make(r) {
      const t = pick(r, 100, 500, 50), k = pick(r, 10, 60, 5);
      const answer = (t * k * (k + 1)) / 2;
      return {
        q: `<p>A planner chats with a local model for <b>${k}</b> turns. Each turn adds about <b>${t}</b> tokens (question plus reply), and every turn re-sends the whole history. About how many input tokens has the model read in total by the end?</p>`,
        answer, unit: 'tokens', tol: 0.005,
        hint: 'Turn 1 reads t, turn 2 reads 2t, … turn n reads n·t. The sum 1 + 2 + … + n is n(n + 1) ÷ 2.',
        solution: steps(
          `1 + 2 + … + ${k} = ${k} × ${k + 1} ÷ 2 = ${(k * (k + 1)) / 2}.`,
          `Total: ${t} × ${(k * (k + 1)) / 2} = <b>${n(answer, 6)}</b> tokens.`,
          `The last turn alone reads ${n(t * k, 5)}. A 300-token summary and a fresh chat would reset that.`),
        t, k,
      };
    },
    verify: (p) => { let s = 0; for (let i = 1; i <= p.k; i++) s += i * p.t; return s; },
  },

  // ---------- 3.8 Caching ----------
  'token-saving-caching-reads': {
    title: 'How many times fewer tokens with caching?',
    make(r) {
      const N = pick(r, 100, 2000, 100), P = pick(r, 1000, 4000, 250), nw = pick(r, 100, 600, 50);
      const without = N * (P + nw), withC = P + N * nw, answer = without / withC;
      return {
        q: `<p>A bookkeeper classifies <b>${N.toLocaleString('en-CA')}</b> receipts. Every request starts with the same <b>${P.toLocaleString('en-CA')}</b>-token instructions, then about <b>${nw}</b> tokens of receipt text. With prompt caching (prefix read once), how many times fewer input tokens are read than without it?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Without caching: n × (prefix + new). With caching: prefix + n × new. Divide the first by the second.',
        solution: steps(
          `Without: ${N.toLocaleString('en-CA')} × (${P.toLocaleString('en-CA')} + ${nw}) = ${n(without, 6)}.`,
          `With: ${P.toLocaleString('en-CA')} + ${N.toLocaleString('en-CA')} × ${nw} = ${n(withC, 6)}.`,
          `Ratio: <b>${n(answer)}</b> times fewer.`),
        N, P, nw,
      };
    },
    verify: (p) => (p.P + p.nw) / (p.P / p.N + p.nw),
  },

  // ---------- 3.9 Unlimited tokens ----------
  'unlimited-tokens-cost': {
    title: 'Electricity per million tokens',
    make(r) {
      const W = pick(r, 40, 450, 10), tps = pick(r, 8, 80, 2), price = pick(r, 0.08, 0.4, 0.01);
      const kwh = W / (3.6 * tps), answer = kwh * price;
      return {
        q: `<p>A desktop draws <b>${W} W</b> while it writes <b>${tps}</b> tokens per second. Electricity costs <b>${n(price)}</b> per kWh. What does a million output tokens cost in electricity (same currency)?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Time for a million tokens = 1,000,000 ÷ speed (seconds); turn it into hours. kWh = kW × hours. Multiply by the price.',
        solution: steps(
          `Time: 1,000,000 ÷ ${tps} = ${n(1e6 / tps, 5)} s = ${n(1e6 / tps / 3600)} hours.`,
          `Energy: ${W / 1000} kW × ${n(1e6 / tps / 3600)} h = ${n(kwh)} kWh.`,
          `Cost: ${n(kwh)} × ${n(price)} = <b>${n(answer)}</b> per million tokens.`),
        W, tps, price,
      };
    },
    verify: (p) => (p.W / 1000) * (1e6 / p.tps / 3600) * p.price,
  },

  // ---------- 3.10 Measure tokens ----------
  'measure-tokens-rate': {
    title: 'Tokens per second from an Ollama reply',
    make(r) {
      const cnt = pick(r, 40, 600, 10), secs = pick(r, 2, 40, 0.1);
      const ns = Math.round(secs * 1e9), answer = cnt / (ns / 1e9);
      return {
        q: `<p>An Ollama reply says <code>eval_count: ${cnt}</code> and <code>eval_duration: ${ns.toLocaleString('en-CA')}</code> (nanoseconds). What was the writing speed in tokens per second?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'Divide the duration by 1,000,000,000 to get seconds, then divide the token count by the seconds.',
        solution: steps(
          `Seconds: ${ns.toLocaleString('en-CA')} ÷ 1,000,000,000 = ${n(ns / 1e9, 4)} s.`,
          `Speed: ${cnt} ÷ ${n(ns / 1e9, 4)} = <b>${n(answer)} tokens per second</b>.`),
        cnt, ns,
      };
    },
    verify: (p) => (p.cnt * 1e9) / p.ns,
  },
  'measure-tokens-job': {
    title: 'How long will the batch job take?',
    make(r) {
      const items = pick(r, 100, 2000, 50), tin = pick(r, 500, 3000, 100), tout = pick(r, 40, 200, 10), rd = pick(r, 200, 1000, 50), wr = pick(r, 8, 40, 1);
      const per = tin / rd + tout / wr, answer = (items * per) / 60;
      return {
        q: `<p>Before an overnight job you measure typical items: <b>${tin.toLocaleString('en-CA')}</b> input and <b>${tout}</b> output tokens each, reading at <b>${rd}</b> and writing at <b>${wr}</b> tokens per second. How many <b>minutes</b> will <b>${items.toLocaleString('en-CA')}</b> items take?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Time per item = input ÷ read speed + output ÷ write speed. Multiply by the items, then divide by 60.',
        solution: steps(
          `Per item: ${tin} ÷ ${rd} + ${tout} ÷ ${wr} = ${n(tin / rd)} + ${n(tout / wr)} = ${n(per)} s.`,
          `All items: ${items} × ${n(per)} = ${n(items * per, 5)} s.`,
          `Minutes: ÷ 60 = <b>${n(answer)}</b> (about ${n(answer / 60, 2)} hours).`),
        items, tin, tout, rd, wr,
      };
    },
    verify: (p) => (p.items * p.tin) / p.rd / 60 + (p.items * p.tout) / p.wr / 60,
  },
};
