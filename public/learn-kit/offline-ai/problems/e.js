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
};
