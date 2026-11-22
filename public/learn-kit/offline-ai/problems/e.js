// Live problems for Offline AI, part e: Module 13 (agents and automation), Module 14 (customising models)
// and Module 15 (scaling up). See ../problems.js. Each make(rand) returns { q, answer, unit, tol, hint, solution }
// plus its inputs; verify(p) works the answer out another way for tests/course-kit.mjs.
import { pick, n, steps } from './util.js';

/** Whole numbers at full precision with thousands separators (for exact counts). */
const f = (v) => (+v.toFixed(6)).toLocaleString('en-CA', { maximumFractionDigits: 6 });
const one = (r, list) => list[Math.floor(r() * list.length * 0.999999)];

export default {
  // ---------- 13.1 What an agent is ----------
  'what-is-an-agent-steps': {
    title: 'How many steps fit in the context?',
    make(r) {
      const C = one(r, [4096, 8192, 16384, 32768]), T = pick(r, 300, 900, 100), S = pick(r, 800, 2400, 100);
      const room = C - T, answer = Math.floor(room / S);
      return {
        q: `<p>A file-reading agent runs with a context window of <b>${f(C)} tokens</b>. The system message and task take <b>${f(T)} tokens</b>. Each step (the model's tool call plus the file text it gets back) adds about <b>${f(S)} tokens</b>. How many <b>full steps</b> fit before the window is full?</p>`,
        answer, unit: 'steps', tol: 0.001,
        hint: 'Take the task off the window to find the room left, divide by the tokens per step, and round down: a half step does not fit.',
        solution: steps(
          `Room left: ${f(C)} − ${f(T)} = ${f(room)} tokens.`,
          `Steps: ${f(room)} ÷ ${f(S)} = ${n(room / S)}.`,
          `Round down to whole steps: <b>${f(answer)}</b>. After that the start of the job falls out of the window, so cap file reads or summarise the notes.`),
        C, T, S,
      };
    },
    verify: (p) => { let used = p.T, k = 0; while (used + p.S <= p.C) { used += p.S; k++; } return k; },
  },

  // ---------- 13.2 Letting a local model use tools safely ----------
  'local-tool-calling-approvals': {
    title: 'How long do approvals take each week?',
    make(r) {
      const T = pick(r, 4, 15), w = pick(r, 1, 4), s = pick(r, 10, 40, 5), days = 5;
      const answer = (T * w * s * days) / 60;
      return {
        q: `<p>An office agent runs <b>${T} tasks a day</b>. Each task makes about <b>${w}</b> write request${w > 1 ? 's' : ''} that need a person's "y", and reading one request properly takes about <b>${s} seconds</b>. How many <b>minutes a week</b> (5 working days) go on approvals?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Count the approvals in a week (tasks × requests × days), multiply by the seconds each takes, and divide by 60.',
        solution: steps(
          `Approvals a day: ${T} × ${w} = ${T * w}.`,
          `A week: ${T * w} × ${days} = ${T * w * days}.`,
          `Seconds: ${T * w * days} × ${s} = ${f(T * w * days * s)}.`,
          `Minutes: ÷ 60 = <b>${n(answer)}</b>. If that feels like a lot, people stop reading; fewer write tools or an output-folder rule keeps approvals rare.`),
        T, w, s, days,
      };
    },
    verify: (p) => { let sec = 0; for (let d = 0; d < p.days; d++) for (let t = 0; t < p.T; t++) sec += p.w * p.s; return sec / 60; },
  },

  // ---------- 13.3 A coding assistant on your machine ----------
  'local-coding-assistant-wait': {
    title: 'How long is the wait for one edit?',
    make(r) {
      const P = pick(r, 2000, 12000, 500), pf = pick(r, 300, 2000, 100), O = pick(r, 200, 800, 50), d = pick(r, 15, 80, 5);
      const answer = P / pf + O / d;
      return {
        q: `<p>You ask a local coding model to change a file. It is sent <b>${f(P)} prompt tokens</b> (the file plus your request) and writes a <b>${f(O)}-token</b> change. On your machine it reads at <b>${f(pf)} tokens a second</b> and writes at <b>${d} tokens a second</b>. About how many <b>seconds</b> is the wait?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Reading time is prompt tokens ÷ reading speed. Writing time is output tokens ÷ writing speed. Add them.',
        solution: steps(
          `Reading: ${f(P)} ÷ ${f(pf)} = ${n(P / pf)} s.`,
          `Writing: ${f(O)} ÷ ${d} = ${n(O / d)} s.`,
          `Total: <b>${n(answer)} seconds</b>.`),
        P, pf, O, d,
      };
    },
    verify: (p) => (p.P * p.d + p.O * p.pf) / (p.pf * p.d),
  },

  // ---------- 13.4 Offline speech ----------
  'offline-speech-batch': {
    title: 'How long will the transcripts take?',
    make(r) {
      const R = pick(r, 6, 30), m = pick(r, 20, 90, 5), x = pick(r, 2, 8);
      const total = R * m, answer = total / x;
      return {
        q: `<p>A researcher has <b>${R} interviews</b> of about <b>${m} minutes</b> each. On her laptop, Whisper transcribes at <b>${x} times faster than real time</b>. About how many <b>minutes</b> will the whole batch take?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: '"x times faster than real time" means one minute of recording takes 1 ÷ x minutes. Find the total recording time first.',
        solution: steps(
          `Total recording: ${R} × ${m} = ${f(total)} minutes.`,
          `At ${x}× real time: ${f(total)} ÷ ${x} = <b>${n(answer)} minutes</b> (${n(answer / 60)} hours). A good overnight job.`),
        R, m, x,
      };
    },
    verify: (p) => { let t = 0; for (let i = 0; i < p.R; i++) t += p.m / p.x; return t; },
  },
  'offline-speech-chain': {
    title: 'How long until you hear the answer?',
    make(r) {
      const a = pick(r, 0.6, 2, 0.1), b = pick(r, 0.2, 1, 0.1), k = pick(r, 20, 80, 5), v = pick(r, 15, 50, 5), c = pick(r, 0.2, 0.8, 0.1);
      const answer = a + b + k / v + c;
      return {
        q: `<p>Your offline voice assistant takes <b>${a} s</b> to turn your question into text, <b>${b} s</b> before the chat model writes its first token, then writes <b>${k} tokens</b> at <b>${v} tokens a second</b>, and Piper takes <b>${c} s</b> to speak it. How many <b>seconds</b> after you stop talking do you hear the answer?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'It is a chain, so add every link. The only one to work out is the writing time: tokens ÷ tokens per second.',
        solution: steps(
          `Writing time: ${k} ÷ ${v} = ${n(k / v)} s.`,
          `Add the links: ${a} + ${b} + ${n(k / v)} + ${c} = <b>${n(answer)} s</b>.`,
          `The biggest link is the one to speed up first.`),
        a, b, k, v, c,
      };
    },
    verify: (p) => [p.c, p.k / p.v, p.b, p.a].reduce((s, x) => s + x, 0),
  },

  // ---------- 13.5 Reading images locally ----------
  'local-vision-tokens': {
    title: 'How many photos fit in one request?',
    make(r) {
      const [S, p] = one(r, [[448, 14], [672, 14], [896, 14], [512, 16], [768, 16]]), k = one(r, [2, 4]);
      const C = one(r, [8192, 16384, 32768]), txt = pick(r, 1000, 4000, 500);
      const side = S / p, patches = side * side, tok = patches / (k * k), answer = Math.floor((C - txt) / tok);
      return {
        q: `<p>A vision model resizes every photo to <b>${S} × ${S} pixels</b>, cuts it into <b>${p}-pixel</b> square patches, and merges each <b>${k} × ${k}</b> block of patches into one token. Your context window is <b>${f(C)} tokens</b> and you keep <b>${f(txt)} tokens</b> for the prompt and answer. How many whole photos fit in one request?</p>`,
        answer, unit: 'photos', tol: 0.001,
        hint: 'Patches across = size ÷ patch size; square it for all patches; divide by the merge block (k × k) for tokens per photo. Then divide the room left by that, rounding down.',
        solution: steps(
          `Patches across: ${S} ÷ ${p} = ${side}; all patches: ${side} × ${side} = ${f(patches)}.`,
          `Tokens per photo: ${f(patches)} ÷ ${k * k} = ${f(tok)}.`,
          `Room for photos: ${f(C)} − ${f(txt)} = ${f(C - txt)} tokens.`,
          `Photos: ${f(C - txt)} ÷ ${f(tok)} = ${n((C - txt) / tok)}, so <b>${f(answer)}</b> whole photos.`),
        S, p, k, C, txt,
      };
    },
    verify: (q) => { const tok = Math.round((q.S / q.p) ** 2 / q.k ** 2); let used = q.txt, c = 0; while (used + tok <= q.C) { used += tok; c++; } return c; },
  },

  // ---------- 13.6 Making images offline ----------
  'local-image-generation-time': {
    title: 'How much time does a turbo model save?',
    make(r) {
      const N = pick(r, 20, 120, 10), S1 = pick(r, 20, 50, 5), S2 = pick(r, 1, 8), t = pick(r, 0.2, 1.2, 0.1);
      const answer = (N * (S1 - S2) * t) / 60;
      return {
        q: `<p>A teacher needs <b>${N} illustrations</b>. One step takes <b>${t} s</b> on her graphics card. A standard model needs <b>${S1} steps</b> per image; a turbo model trained for few steps needs <b>${S2}</b>. How many <b>minutes</b> does the turbo model save over the whole batch?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Time per image = steps × time per step. Find the steps saved per image, multiply by the images and the time per step, then divide by 60.',
        solution: steps(
          `Steps saved per image: ${S1} − ${S2} = ${S1 - S2}.`,
          `Over the batch: ${N} × ${S1 - S2} = ${f(N * (S1 - S2))} steps.`,
          `Seconds: × ${t} = ${n(N * (S1 - S2) * t)} s.`,
          `Minutes: ÷ 60 = <b>${n(answer)}</b>. Check the turbo model's licence before using the images for work.`),
        N, S1, S2, t,
      };
    },
    verify: (p) => (p.N * p.S1 * p.t) / 60 - (p.N * p.S2 * p.t) / 60,
  },

  // ---------- 13.7 Scheduled jobs ----------
  'scheduled-jobs-window': {
    title: 'How long will tonight\'s job run?',
    make(r) {
      const I = pick(r, 20, 120, 5), P = pick(r, 1000, 6000, 500), pf = pick(r, 200, 1500, 100), O = pick(r, 40, 150, 10), d = pick(r, 10, 40, 5);
      const per = P / pf + O / d, answer = (I * per) / 60;
      return {
        q: `<p>A nightly script summarises <b>${I} files</b>. Each file sends about <b>${f(P)} prompt tokens</b> and gets a <b>${O}-token</b> summary back. The model reads at <b>${f(pf)} tokens a second</b> and writes at <b>${d} tokens a second</b>. About how many <b>minutes</b> will the job run?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Work out one file first: reading time (prompt ÷ reading speed) plus writing time (output ÷ writing speed). Multiply by the files and divide by 60.',
        solution: steps(
          `Reading one file: ${f(P)} ÷ ${f(pf)} = ${n(P / pf)} s.`,
          `Writing one summary: ${O} ÷ ${d} = ${n(O / d)} s.`,
          `One file: ${n(per)} s. All files: ${I} × ${n(per)} = ${n(I * per)} s.`,
          `Minutes: ÷ 60 = <b>${n(answer)}</b>.`),
        I, P, pf, O, d,
      };
    },
    verify: (p) => (p.I * p.P) / p.pf / 60 + (p.I * p.O) / p.d / 60,
  },

  // ---------- 13.8 Guard rails ----------
  'agent-guard-rails-layers': {
    title: 'How rare is lasting damage?',
    make(r) {
      const a = pick(r, 10, 50, 5), b = pick(r, 5, 20, 5), c = pick(r, 20, 100, 10);
      const answer = a * b * c;
      return {
        q: `<p>Your agent goes wrong on <b>1 task in ${a}</b>. You miss <b>1 bad approval in ${b}</b>. Your backup fails <b>1 time in ${c}</b>. The layers are independent. Lasting damage needs all three to fail. It happens on 1 task in how many?</p>`,
        answer, unit: 'tasks', tol: 0.001,
        hint: 'Damage needs every layer to fail, so multiply the chances: 1/a × 1/b × 1/c. The "1 in ..." number is a × b × c.',
        solution: steps(
          `Chance per task: 1/${a} × 1/${b} × 1/${c}.`,
          `Multiply the bottoms: ${a} × ${b} × ${c} = ${f(answer)}.`,
          `So about <b>1 task in ${f(answer)}</b>. If approvals stop being read (that layer fails every time), it drops to 1 in ${f(a * c)}.`),
        a, b, c,
      };
    },
    verify: (p) => 1 / ((1 / p.a) * (1 / p.b) * (1 / p.c)),
  },

  // ---------- 14.1 Prompting, RAG or fine-tuning ----------
  'prompt-rag-or-finetune-prefill': {
    title: 'What does a long example prompt cost each day?',
    make(r) {
      const P = pick(r, 800, 3000, 100), R = pick(r, 1000, 20000, 1000), s = pick(r, 500, 3000, 250);
      const tokens = P * R, answer = tokens / s / 3600;
      return {
        q: `<p>A team's system prompt holds <b>${f(P)} tokens</b> of example letters and is sent with each of <b>${f(R)} requests a day</b>. Their server reads prompts at <b>${f(s)} tokens a second</b>. How many <b>hours</b> of reading a day does that prompt cost, which a fine-tune could remove?</p>`,
        answer, unit: 'hours', tol: 0.01,
        hint: 'Tokens a day = prompt tokens × requests. Divide by the reading speed for seconds, then by 3,600 for hours.',
        solution: steps(
          `Tokens a day: ${f(P)} × ${f(R)} = ${f(tokens)}.`,
          `Seconds: ${f(tokens)} ÷ ${f(s)} = ${n(tokens / s)} s.`,
          `Hours: ÷ 3,600 = <b>${n(answer)}</b>. That is reading time the server spends on the same instructions over and over.`),
        P, R, s,
      };
    },
    verify: (p) => (p.P / p.s) * (p.R / 3600),
  },

  // ---------- 14.2 LoRA and QLoRA ----------
  'lora-params': {
    title: 'How many numbers does LoRA train?',
    make(r) {
      const d = one(r, [2048, 3072, 4096, 5120]), rk = one(r, [8, 16, 32, 64]), L = pick(r, 16, 40, 2), m = 4;
      const per = rk * (d + d), total = per * L * m, answer = total / 1e6;
      return {
        q: `<p>You add LoRA adapters with rank <b>r = ${rk}</b> to the four attention grids (q, k, v, o) in each of a model's <b>${L} layers</b>. Treat every grid as <b>${f(d)} × ${f(d)}</b>. How many <b>million</b> numbers does LoRA train?</p>`,
        answer, unit: 'million', tol: 0.01,
        hint: 'Each grid gets B (d × r) and A (r × d): r × (d + d) numbers. Multiply by 4 grids per layer and by the number of layers.',
        solution: steps(
          `One grid: ${rk} × (${f(d)} + ${f(d)}) = ${f(per)}.`,
          `One layer (4 grids): ${f(per * m)}.`,
          `All ${L} layers: ${f(per * m)} × ${L} = ${f(total)}.`,
          `In millions: <b>${n(answer, 4)}</b>. At 2 bytes each the adapter is about ${n(total * 2 / 1e6)} MB.`),
        d, rk, L, m,
      };
    },
    verify: (p) => (p.L * p.m * (p.d * p.rk + p.rk * p.d)) / 1e6,
  },

  // ---------- 14.3 Fine-tuning at home ----------
  'finetune-at-home-time': {
    title: 'How long will the training run take?',
    make(r) {
      const b = one(r, [1, 2, 4]), g = one(r, [2, 4, 8]), eb = b * g, E = eb * pick(r, 25, 150), ep = pick(r, 1, 3), s = pick(r, 4, 15, 0.5);
      const st = (E / eb) * ep, answer = (st * s) / 60;
      return {
        q: `<p>You fine-tune on <b>${f(E)} examples</b> with batch size <b>${b}</b>, gradient accumulation <b>${g}</b> and <b>${ep} epoch${ep > 1 ? 's' : ''}</b>. Each step takes about <b>${s} seconds</b>. About how many <b>minutes</b> will the run take?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Effective batch = batch × accumulation. Steps = examples ÷ effective batch × epochs. Then multiply by seconds per step and divide by 60.',
        solution: steps(
          `Effective batch: ${b} × ${g} = ${eb}.`,
          `Steps per epoch: ${f(E)} ÷ ${eb} = ${f(E / eb)}; × ${ep} = ${f(st)} steps.`,
          `Seconds: ${f(st)} × ${s} = ${n(st * s)}.`,
          `Minutes: ÷ 60 = <b>${n(answer)}</b>.`),
        b, g, E, ep, s,
      };
    },
    verify: (p) => { let t = 0; for (let e = 0; e < p.ep; e++) for (let i = 0; i < p.E; i += p.b * p.g) t += p.s; return t / 60; },
  },

  // ---------- 14.4 Training set and blind test ----------
  'training-data-split': {
    title: 'How many examples go into training?',
    make(r) {
      const N = pick(r, 200, 1200, 10), D = pick(r, 10, 100, 10), M = N - D, answer = (M * 8) / 10;
      return {
        q: `<p>You export <b>${f(N)} examples</b> and drop <b>${D}</b> that are outdated or not up to standard. The rest are split 80% training, 10% validation and 10% test. How many examples go into the <b>training</b> set?</p>`,
        answer, unit: 'examples', tol: 0.001,
        hint: 'First take off the dropped examples. Then 80% of what is left trains.',
        solution: steps(
          `Kept: ${f(N)} − ${D} = ${f(M)}.`,
          `Training: ${f(M)} × 0.8 = <b>${f(answer)}</b>.`,
          `Validation and test get ${f(M / 10)} each, and the test set stays locked away until the end.`),
        N, D,
      };
    },
    verify: (p) => (p.N - p.D) - 2 * ((p.N - p.D) / 10),
  },
  'training-data-winrate': {
    title: 'What is the tuned model\'s win rate?',
    make(r) {
      const P = pick(r, 20, 60), t = pick(r, 0, 4), dec = P - t, W = pick(r, Math.ceil(dec / 2), dec - 1), L = dec - W;
      const answer = (W / dec) * 100;
      return {
        q: `<p>In a blind test of <b>${P} pairs</b>, the tuned model wins <b>${W}</b>, the base model wins <b>${L}</b>, and <b>${t}</b> ${t === 1 ? 'is a tie' : 'are ties'}. What is the tuned model's <b>win rate</b>, in percent?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Leave the ties out. Win rate = tuned wins ÷ (tuned wins + base wins), times 100.',
        solution: steps(
          `Decided pairs: ${W} + ${L} = ${dec}.`,
          `Win rate: ${W} ÷ ${dec} = ${n(W / dec)}, so <b>${n(answer)}%</b>.`,
          `${answer >= 75 ? 'A clear win.' : 'Not a clear win; test more pairs or look for a bigger gap.'}`),
        P, t, W, L,
      };
    },
    verify: (p) => 100 - (p.L / (p.W + p.L)) * 100,
  },

  // ---------- 14.5 Merging and sharing ----------
  'sharing-adapters-storage': {
    title: 'How much disk do adapters save?',
    make(r) {
      const B = one(r, [2, 4.9, 7.7, 16]), a = pick(r, 20, 200, 10), N = pick(r, 3, 10);
      const merged = N * B, adapters = B + (N * a) / 1000, answer = merged - adapters;
      return {
        q: `<p>You have <b>${N}</b> fine-tunes of the same base model. The base model file is <b>${B} GB</b> and each adapter is <b>${a} MB</b>. How many <b>GB</b> do you save by keeping one base plus ${N} adapters, instead of ${N} merged models? (1 GB = 1,000 MB.)</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'A merged model is the same size as the base. Compare N × base with base + N × adapter (in GB).',
        solution: steps(
          `${N} merged models: ${N} × ${B} = ${n(merged)} GB.`,
          `One base + ${N} adapters: ${B} + ${N} × ${a} ÷ 1,000 = ${n(adapters)} GB.`,
          `Saved: ${n(merged)} − ${n(adapters)} = <b>${n(answer)} GB</b>. Merged copies are still easier to hand to someone else.`),
        B, a, N,
      };
    },
    verify: (p) => (p.N - 1) * p.B - (p.N * p.a) / 1000,
  },
};
