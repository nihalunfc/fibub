// Live problems for Offline AI, part d: Module 10 (settings and prompts), Module 11 (the local API) and
// Module 12 (private document search, RAG). See ../problems.js. Each make(rand) returns
// { q, answer, unit, tol, hint, solution } plus its inputs; verify(p) works the answer out another way.
import { pick, n, steps, table } from './util.js';

/** Exact whole numbers with thousands separators (used whenever the answer is an exact count). */
const c = (v) => Math.round(v).toLocaleString('en-CA');
const pct = (v, d = 1) => (+(v * 100).toFixed(d)).toLocaleString('en-CA') + '%';

export default {
  // ---------- 10.1 Temperature, top-p and the other dials ----------
  'sampling-settings-softmax': {
    title: 'How sure is the model at this temperature?',
    make(r) {
      const a = pick(r, 1.5, 4, 0.5), gap = pick(r, 0.5, 2, 0.5), b = +(a - gap).toFixed(2), T = [0.5, 0.7, 1, 1.5][Math.floor(r() * 3.999)];
      const ea = Math.exp(a / T), eb = Math.exp(b / T), answer = (100 * ea) / (ea + eb);
      return {
        q: `<p>A support bot is choosing its next word. Only two words are left in the running: " refund" with a score of <b>${a}</b> and " replacement" with a score of <b>${b}</b>. The temperature is <b>${T}</b>. What is the chance, in percent, that it picks " refund"?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Divide each score by the temperature, raise e to that power, then divide the top word\'s number by the total of both.',
        solution: steps(
          `Divide by T: ${a} ÷ ${T} = ${n(a / T)} and ${b} ÷ ${T} = ${n(b / T)}.`,
          `Raise e to each: e<sup>${n(a / T)}</sup> ≈ ${n(ea)} and e<sup>${n(b / T)}</sup> ≈ ${n(eb)}.`,
          `Total: ${n(ea + eb)}.`,
          `Chance of " refund": ${n(ea)} ÷ ${n(ea + eb)} ≈ <b>${n(answer)}%</b>.`,
          `A lower temperature would push this closer to 100%; a higher one closer to 50%.`),
        a, b, T,
      };
    },
    // With two words, softmax is the logistic curve of the score gap divided by T.
    verify: (p) => 100 / (1 + Math.exp(-(p.a - p.b) / p.T)),
  },

  // ---------- 10.2 System prompts and chat templates ----------
  'system-prompts-monthly-tokens': {
    title: 'How many tokens does the system prompt cost in a month?',
    make(r) {
      const S = pick(r, 120, 480, 20), R = pick(r, 25, 90, 5), D = pick(r, 18, 23, 1);
      const answer = S * R * D;
      return {
        q: `<p>A small office's helper bot has a system prompt of <b>${c(S)} tokens</b>. It is sent with every request. The team makes <b>${c(R)} requests a day</b> on <b>${c(D)} working days</b> a month. How many tokens does the system prompt alone use in a month?</p>`,
        answer, unit: 'tokens', tol: 0, abs: 0.5,
        hint: 'The system prompt is read again on every request. Multiply its size by the requests per day, then by the days.',
        solution: steps(
          `Per day: ${c(S)} × ${c(R)} = ${c(S * R)} tokens.`,
          `Per month: ${c(S * R)} × ${c(D)} = <b>${c(answer)}</b> tokens.`,
          `Cutting the prompt in half would save ${c(answer / 2)} tokens of reading a month (prompt caching, Lesson 3.8, also helps).`),
        S, R, D,
      };
    },
    verify: (p) => { let t = 0; for (let d = 0; d < p.D; d++) t += p.S * p.R; return t; },
  },

  // ---------- 10.3 Context length settings ----------
  'context-settings-needed': {
    title: 'How much context does this job need?',
    make(r) {
      const W = pick(r, 3000, 15000, 300), A = pick(r, 500, 1500, 100), S = pick(r, 100, 400, 50);
      const answer = W / 0.75 + A + S;
      return {
        q: `<p>A paralegal wants a local model to summarise a contract of <b>${c(W)} words</b>. The system prompt is <b>${c(S)} tokens</b> and she allows <b>${c(A)} tokens</b> for the summary. Using words ÷ 0.75 for the contract, how many tokens of context does the job need?</p>`,
        answer, unit: 'tokens', tol: 0, abs: 0.5,
        hint: 'Turn words into tokens with words ÷ 0.75, then add the system prompt and the room for the answer.',
        solution: steps(
          `Contract: ${c(W)} ÷ 0.75 = ${c(W / 0.75)} tokens.`,
          `Add the system prompt: ${c(W / 0.75)} + ${c(S)} = ${c(W / 0.75 + S)}.`,
          `Add the answer room: + ${c(A)} = <b>${c(answer)}</b> tokens.`,
          `Pick the next common setting above it, here ${c([4096, 8192, 16384, 32768].find((x) => x >= answer) || 65536)}, and check that the memory still fits (Lesson 8.4).`),
        W, A, S,
      };
    },
    verify: (p) => (p.W * 4) / 3 + p.S + p.A,
  },

  // ---------- 10.4 Reasoning models at home ----------
  'local-reasoning-wait': {
    title: 'How long until the answer starts?',
    make(r) {
      const P = pick(r, 400, 2000, 100), rd = pick(r, 200, 800, 100), T = pick(r, 600, 3000, 100), g = pick(r, 10, 40, 5);
      const answer = P / rd + T / g;
      return {
        q: `<p>An accountant asks a reasoning model on her laptop a tax question. The prompt is <b>${c(P)} tokens</b>, which the laptop reads at <b>${c(rd)} tokens a second</b>. The model then writes <b>${c(T)} thinking tokens</b> at <b>${c(g)} tokens a second</b> before the answer begins. How many seconds until the first word of the answer appears?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Two waits in a row: reading the prompt (tokens ÷ reading speed), then writing the thinking (tokens ÷ writing speed). Add them.',
        solution: steps(
          `Reading the prompt: ${c(P)} ÷ ${c(rd)} = ${n(P / rd)} s.`,
          `Thinking: ${c(T)} ÷ ${c(g)} = ${n(T / g)} s.`,
          `Wait before the answer: ${n(P / rd)} + ${n(T / g)} = <b>${n(answer)} s</b>.`,
          `With thinking off, she would wait only ${n(P / rd)} s. The thinking is the big part.`),
        P, rd, T, g,
      };
    },
    verify: (p) => (p.P * p.g + p.T * p.rd) / (p.rd * p.g),
  },

  // ---------- 10.5 Prompts for smaller models ----------
  'prompts-for-small-models-retry': {
    title: 'How much does one retry per step help?',
    make(r) {
      const p = pick(r, 0.8, 0.95, 0.05), k = pick(r, 3, 6, 1);
      const once = 1 - (1 - p) ** 2, answer = 100 * once ** k;
      return {
        q: `<p>A clinic splits a job into <b>${k} separate calls</b> to a small model. Each call comes out right <b>${Math.round(p * 100)}%</b> of the time. Code checks every result and, if a check fails, tries that call <b>once more</b>. Assume the checks catch every mistake and each try is independent. What is the chance, in percent, that all ${k} steps end up right?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'One step fails only if both tries fail: 1 − (1 − p)². Every step must succeed, so raise that to the power of the number of steps.',
        solution: steps(
          `Both tries fail: (1 − ${p})² = ${n((1 - p) ** 2)}.`,
          `So one step ends up right with chance 1 − ${n((1 - p) ** 2)} = ${n(once, 4)}.`,
          `All ${k} steps: ${n(once, 4)}<sup>${k}</sup> ≈ <b>${n(answer)}%</b>.`,
          `Without retries it would be ${p}<sup>${k}</sup> ≈ ${n(100 * p ** k)}%. Checking and retrying is what makes small models dependable.`),
        p, k,
      };
    },
    verify: (q) => { let ok = 1; for (let i = 0; i < q.k; i++) ok *= q.p + (1 - q.p) * q.p; return 100 * ok; },
  },

  // ---------- 11.1 Your computer as an AI server ----------
  'local-ai-server-resend': {
    title: 'How many tokens does a whole chat send?',
    make(r) {
      const s = pick(r, 100, 300, 50), u = pick(r, 30, 90, 10), a = pick(r, 80, 300, 20), K = pick(r, 4, 8, 1);
      // Request k carries the system prompt, all earlier turns, and the new user message.
      const answer = K * (s + u) + ((u + a) * (K * (K - 1))) / 2;
      return {
        q: `<p>A script holds a chat with a local model through the API. The system prompt is <b>${c(s)} tokens</b>. Every user message is <b>${c(u)} tokens</b> and every reply is <b>${c(a)} tokens</b>. Each request sends the whole conversation so far plus the new message. Over <b>${c(K)} requests</b>, how many tokens are sent to the model in total (not counting the replies it writes)?</p>`,
        answer, unit: 'tokens', tol: 0, abs: 0.5,
        hint: 'Request k carries the system prompt, k − 1 earlier message-and-reply pairs, and the new user message. Add up requests 1 to K.',
        solution: steps(
          `Request k sends ${c(s)} + (k − 1) × (${c(u)} + ${c(a)}) + ${c(u)} tokens.`,
          `Request 1: ${c(s + u)}. Request ${K}: ${c(s + u + (K - 1) * (u + a))}.`,
          `The fixed part over ${K} requests: ${c(K)} × ${c(s + u)} = ${c(K * (s + u))}.`,
          `The growing part: ${c(u + a)} × (0 + 1 + … + ${K - 1}) = ${c(u + a)} × ${c((K * (K - 1)) / 2)} = ${c(((u + a) * K * (K - 1)) / 2)}.`,
          `Total: <b>${c(answer)}</b> tokens. A long chat costs more with every turn.`),
        s, u, a, K,
      };
    },
    verify: (p) => { let t = 0, hist = 0; for (let k = 1; k <= p.K; k++) { t += p.s + hist + p.u; hist += p.u + p.a; } return t; },
  },

  // ---------- 11.2 Calling it from Python ----------
  'call-from-python-batch': {
    title: 'How long will the folder job take?',
    make(r) {
      const F = pick(r, 80, 400, 20), tin = pick(r, 1000, 4000, 500), tout = pick(r, 60, 200, 20), rd = pick(r, 200, 800, 100), g = pick(r, 10, 40, 5);
      const each = tin / rd + tout / g, answer = (F * each) / 60;
      return {
        q: `<p>A bookkeeper runs the folder script on <b>${c(F)} files</b>. Each file is about <b>${c(tin)} tokens</b> going in and each summary is about <b>${c(tout)} tokens</b>. Her laptop reads at <b>${c(rd)} tokens a second</b> and writes at <b>${c(g)} tokens a second</b>. About how many <b>minutes</b> will the whole job take?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Time for one file = input ÷ reading speed + output ÷ writing speed. Multiply by the number of files, then divide by 60.',
        solution: steps(
          `Reading one file: ${c(tin)} ÷ ${c(rd)} = ${n(tin / rd)} s.`,
          `Writing one summary: ${c(tout)} ÷ ${c(g)} = ${n(tout / g)} s.`,
          `One file: ${n(each)} s. All files: ${c(F)} × ${n(each)} = ${n(F * each)} s.`,
          `In minutes: ÷ 60 = <b>${n(answer)}</b>.`),
        F, tin, tout, rd, g,
      };
    },
    verify: (p) => ((p.F * p.tin) / p.rd + (p.F * p.tout) / p.g) / 60,
  },

  // ---------- 11.3 Streaming, JSON output and tool calling ----------
  'streaming-json-tools-first-word': {
    title: 'How much sooner does streaming show the first word?',
    make(r) {
      const P = pick(r, 200, 1500, 100), rd = pick(r, 200, 800, 100), out = pick(r, 150, 600, 50), g = pick(r, 10, 40, 5);
      const full = P / rd + out / g, first = P / rd + 1 / g, answer = full - first;
      return {
        q: `<p>A help-desk tool sends a <b>${c(P)}-token</b> prompt and gets back a <b>${c(out)}-token</b> answer. The laptop reads at <b>${c(rd)} tokens a second</b> and writes at <b>${c(g)} tokens a second</b>. Without streaming, the user sees nothing until the whole answer is done. With streaming, they see each token as soon as it is written. How many seconds sooner does the first word appear with streaming?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Both ways wait the same time to read the prompt. Without streaming you wait for every output token; with streaming, only for the first one.',
        solution: steps(
          `Reading the prompt (the same both ways): ${c(P)} ÷ ${c(rd)} = ${n(P / rd)} s.`,
          `No streaming: + ${c(out)} ÷ ${c(g)} = ${n(out / g)} s, so ${n(full)} s in all.`,
          `Streaming: + 1 ÷ ${c(g)} = ${n(1 / g)} s, so ${n(first)} s to the first word.`,
          `Difference: <b>${n(answer)} s</b> sooner. The total time is the same; it only feels faster.`),
        P, rd, out, g,
      };
    },
    verify: (p) => (p.out - 1) / p.g,
  },

  // ---------- 11.4 Switching between local and cloud ----------
  'swap-local-cloud-bill': {
    title: 'What does the cloud share of the work cost?',
    make(r) {
      const J = pick(r, 1000, 5000, 100), sh = pick(r, 5, 25, 5), T = pick(r, 2000, 8000, 500), price = pick(r, 2, 10, 0.5);
      const jobs = (J * sh) / 100, tokens = jobs * T, answer = (tokens / 1e6) * price;
      return {
        q: `<p>A small agency runs <b>${c(J)} jobs a month</b> through one script. <b>${sh}%</b> of them are hard enough to send to a cloud model; the rest stay local. Each cloud job uses about <b>${c(T)} tokens</b>, and the provider charges <b>${price} per million tokens</b> (a made-up price; check current prices). What is the monthly cloud bill?</p>`,
        answer, unit: 'per month', tol: 0.01,
        hint: 'Find how many jobs go to the cloud, multiply by tokens per job, turn that into millions of tokens, then multiply by the price.',
        solution: steps(
          `Cloud jobs: ${c(J)} × ${sh}% = ${c(jobs)}.`,
          `Tokens: ${c(jobs)} × ${c(T)} = ${c(tokens)}.`,
          `In millions: ${c(tokens)} ÷ 1,000,000 = ${n(tokens / 1e6)}.`,
          `Bill: ${n(tokens / 1e6)} × ${price} = <b>${n(answer)}</b> a month. The local jobs cost only electricity.`),
        J, sh, T, price,
      };
    },
    verify: (p) => (p.price * p.T * p.J * (p.sh / 100)) / 1e6,
  },

  // ---------- 12.1 Why the model cannot read your files ----------
  'why-rag-shrink': {
    title: 'How much smaller is the RAG prompt?',
    make(r) {
      const pages = pick(r, 200, 3000, 100), k = pick(r, 3, 8, 1), cs = pick(r, 250, 500, 50), I = pick(r, 100, 300, 50), qt = pick(r, 20, 60, 10);
      const library = pages * 500, prompt = I + k * cs + qt, answer = library / prompt;
      return {
        q: `<p>A council office has <b>${c(pages)} pages</b> of policies (about 500 tokens a page). With RAG, each question sends <b>${c(k)} chunks</b> of <b>${c(cs)} tokens</b>, plus <b>${c(I)} tokens</b> of instructions and a <b>${c(qt)}-token</b> question. How many times smaller is the RAG prompt than pasting the whole library?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Library tokens = pages × 500. Prompt tokens = instructions + chunks × chunk size + question. Divide the first by the second.',
        solution: steps(
          `Library: ${c(pages)} × 500 = ${c(library)} tokens.`,
          `Prompt: ${c(I)} + ${c(k)} × ${c(cs)} + ${c(qt)} = ${c(prompt)} tokens.`,
          `Ratio: ${c(library)} ÷ ${c(prompt)} ≈ <b>${n(answer)}</b> times smaller.`,
          `The prompt stays about the same size however big the library grows.`),
        pages, k, cs, I, qt,
      };
    },
    verify: (p) => (p.pages * 500) / (p.I + p.qt + p.k * p.cs),
  },

  // ---------- 12.2 Embeddings ----------
  'embeddings-cosine': {
    title: 'How close are these two meanings?',
    make(r) {
      const V = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [3, 0, 4], [0, 3, 4], [4, 0, 3], [2, 3, 6], [6, 2, 3]];
      const i = Math.floor(r() * 7.999), j = (i + 1 + Math.floor(r() * 6.999)) % 8;
      const a = V[i], b = V[j];
      const dotp = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], la = Math.hypot(...a), lb = Math.hypot(...b), answer = dotp / (la * lb);
      return {
        q: `<p>A toy embedding model gives each sentence just 3 numbers. "Staff get 20 vacation days" becomes <b>a = (${a.join(', ')})</b> and "How much annual leave do I get?" becomes <b>b = (${b.join(', ')})</b>. What is their cosine similarity?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Multiply matching numbers and add them up (the dot product). Divide by the length of a times the length of b, where length = √(sum of squares).',
        solution: steps(
          `Dot product: ${a.map((v, k) => `${v}×${b[k]}`).join(' + ')} = ${dotp}.`,
          `Length of a: √(${a.map((v) => v * v).join(' + ')}) = ${n(la)}. Length of b: √(${b.map((v) => v * v).join(' + ')}) = ${n(lb)}.`,
          `Cosine: ${dotp} ÷ (${n(la)} × ${n(lb)}) = <b>${n(answer)}</b>.`,
          `Close to 1 means the two arrows point almost the same way: similar meaning.`),
        a, b,
      };
    },
    // Law of cosines: |a − b|² = |a|² + |b|² − 2|a||b|cos θ.
    verify: (p) => { const sq = (v) => v.reduce((s, x) => s + x * x, 0), d = p.a.map((x, k) => x - p.b[k]); return (sq(p.a) + sq(p.b) - sq(d)) / (2 * Math.sqrt(sq(p.a) * sq(p.b))); },
  },

  // ---------- 12.3 Cutting documents into chunks ----------
  'chunking-count': {
    title: 'How many chunks will this handbook make?',
    make(r) {
      const W = pick(r, 2000, 20000, 100), s = pick(r, 200, 500, 50), o = pick(r, 0, 100, 25);
      const step = s - o, answer = Math.ceil((W - o) / step);
      return {
        q: `<p>An HR team chunks a staff handbook of <b>${c(W)} words</b> with chunk size <b>${c(s)} words</b> and overlap <b>${c(o)} words</b>, using the <code>chunk_text</code> function from this lesson. How many chunks does it make?</p>`,
        answer, unit: 'chunks', tol: 0, abs: 0.5,
        hint: 'Each new chunk starts (size − overlap) words after the one before. Chunks = (W − overlap) ÷ (size − overlap), rounded up.',
        solution: steps(
          `Step between chunk starts: ${c(s)} − ${c(o)} = ${c(step)} words.`,
          `(${c(W)} − ${c(o)}) ÷ ${c(step)} = ${n((W - o) / step, 4)}.`,
          `Round up (a part chunk still counts): <b>${c(answer)}</b> chunks.`,
          `The last chunk holds ${c(W - (answer - 1) * step)} words.`),
        W, s, o,
      };
    },
    // Run the same loop as chunk_text and count.
    verify: (p) => { let k = 0; for (let st = 0; st < Math.max(p.W - p.o, 1); st += p.s - p.o) k++; return k; },
  },

  // ---------- 12.4 Vector databases ----------
  'vector-databases-size': {
    title: 'How big are the stored vectors?',
    make(r) {
      const N = pick(r, 2000, 60000, 1000), d = [384, 768, 1024][Math.floor(r() * 2.999)], b = 4;
      const answer = (N * d * b) / 1e6;
      return {
        q: `<p>A law office stores <b>${c(N)} chunks</b>, each with a vector of <b>${c(d)} numbers</b> saved as 32-bit floats (<b>4 bytes</b> each). How many MB do the vectors take? (1 MB = 1,000,000 bytes.)</p>`,
        answer, unit: 'MB', tol: 0.001,
        hint: 'Bytes = chunks × numbers per vector × 4. Then divide by 1,000,000.',
        solution: steps(
          `One vector: ${c(d)} × 4 = ${c(d * b)} bytes.`,
          `All vectors: ${c(N)} × ${c(d * b)} = ${c(N * d * b)} bytes.`,
          `In MB: ÷ 1,000,000 = <b>${(+answer.toFixed(3)).toLocaleString('en-CA')}</b> MB.`,
          `The chunk text adds a little more. It is still one small file on your disk.`),
        N, d, b,
      };
    },
    verify: (p) => ((p.d * p.b) / 1000) * (p.N / 1000),
  },

  // ---------- 12.5 Retrieval, re-ranking and citations ----------
  'retrieval-and-citations-rrf': {
    title: 'What is this chunk\'s fused score?',
    make(r) {
      const v = pick(r, 1, 10, 1), kw = pick(r, 1, 15, 1);
      const answer = 1000 * (1 / (60 + v) + 1 / (60 + kw));
      return {
        q: `<p>A clinic's hybrid search uses reciprocal rank fusion. The price-list chunk is ranked <b>${v}</b> by vector search and <b>${kw}</b> by keyword search. What is its fused score? Give it <b>× 1,000</b> (so 0.0323 is entered as 32.3).</p>`,
        answer, unit: '(× 1,000)', tol: 0.002,
        hint: 'Each list adds 1 ÷ (60 + rank). Add the two, then multiply by 1,000.',
        solution: steps(
          `Vector list: 1 ÷ (60 + ${v}) = 1 ÷ ${60 + v} ≈ ${n(1 / (60 + v), 4)}.`,
          `Keyword list: 1 ÷ (60 + ${kw}) = 1 ÷ ${60 + kw} ≈ ${n(1 / (60 + kw), 4)}.`,
          `Sum ≈ ${n(answer / 1000, 4)}; × 1,000 = <b>${n(answer, 4)}</b>.`,
          `A chunk found by only one list, even at rank 1, scores at most 1 ÷ 61 ≈ 0.0164 (16.4).`),
        v, kw,
      };
    },
    verify: (p) => 1000 * ((120 + p.v + p.kw) / ((60 + p.v) * (60 + p.kw))),
  },

  // ---------- 12.6 Reading PDFs, scans, spreadsheets and email ----------
  'reading-files-coverage': {
    title: 'How much of the folder can the pipeline see?',
    make(r) {
      const pdf = pick(r, 100, 400, 10), scans = pick(r, 10, 80, 5), docx = pick(r, 20, 120, 10), eml = pick(r, 100, 900, 50), other = pick(r, 5, 40, 5);
      const total = pdf + docx + eml + other, seen = pdf - scans + docx + eml, answer = (100 * seen) / total;
      return {
        q: `<p>A property manager's folder has <b>${c(pdf)} PDFs</b> (of which <b>${c(scans)}</b> are scans with no OCR yet), <b>${c(docx)} Word files</b>, <b>${c(eml)} saved emails</b> and <b>${c(other)} files</b> of a type <code>read_any</code> skips. What percentage of the files can the pipeline actually read text from?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Count every file for the total. Readable = PDFs minus scans, plus Word files, plus emails. Divide and multiply by 100.',
        solution: steps(
          `Total files: ${c(pdf)} + ${c(docx)} + ${c(eml)} + ${c(other)} = ${c(total)}.`,
          `Readable: (${c(pdf)} − ${c(scans)}) + ${c(docx)} + ${c(eml)} = ${c(seen)}.`,
          `Share: ${c(seen)} ÷ ${c(total)} = <b>${n(answer)}%</b>.`,
          `Running OCRmyPDF on the ${c(scans)} scans would lift it to ${n((100 * (seen + scans)) / total)}%.`),
        pdf, scans, docx, eml, other,
      };
    },
    verify: (p) => 100 - (100 * (p.scans + p.other)) / (p.pdf + p.docx + p.eml + p.other),
  },

  // ---------- 12.7 Testing answers ----------
  'testing-rag-mrr': {
    title: 'What is the MRR of this test run?',
    make(r) {
      const N = 8, ranks = Array.from({ length: N }, (_, i) => { const x = (r() + i * 0.381) % 1; return x < 0.45 ? 1 : x < 0.65 ? 2 : x < 0.78 ? 3 : x < 0.88 ? 5 : 0; });
      // Fixed seeds can give eight equal ranks; keep at least one miss and one rank 2 so the sum is interesting.
      if (!ranks.includes(0)) ranks[3] = 0;
      if (!ranks.includes(2)) ranks[5] = 2;
      const rr = ranks.map((k) => (k ? 1 / k : 0)), sum = rr.reduce((s, v) => s + v, 0), answer = sum / N;
      const fr = (k) => (k ? (k === 1 ? '1' : `1/${k}`) : '0');
      const hits = ranks.filter((k) => k).length;
      return {
        q: `<p>A teacher runs 8 test questions against the school's policy index. For each one, this is the rank where the right page appeared in the top 5 ("miss" means it was not there):</p>${table(['Question', ...ranks.map((_, i) => i + 1)], [['Rank', ...ranks.map((k) => (k ? k : 'miss'))]])}<p>What is the mean reciprocal rank (MRR)?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Turn each rank into 1 ÷ rank (a miss counts 0), add them up, and divide by the number of questions.',
        solution: steps(
          `Reciprocal ranks: ${ranks.map(fr).join(', ')}.`,
          `Sum: ${n(sum, 4)}.`,
          `MRR: ${n(sum, 4)} ÷ 8 = <b>${n(answer)}</b>.`,
          `Hit rate at 5 for the same run: ${hits} ÷ 8 = ${pct(hits / 8)}.`),
        ranks,
      };
    },
    verify: (p) => { const m = p.ranks.filter((k) => k); return m.reduce((s, k) => s + 1 / k, 0) / p.ranks.length; },
  },
};
