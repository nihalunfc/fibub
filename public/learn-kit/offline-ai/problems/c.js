// Live problems for Offline AI, part c: Modules 7 (getting models), 8 (quantisation) and 9 (installing) (see ../problems.js).
import { pick, steps, table } from './util.js';

const fx = (v, d = 2) => (+v.toFixed(d)).toLocaleString('en-CA', { maximumFractionDigits: d });
const int = (v) => v.toLocaleString('en-CA');
/** 'A' or 'An' before a number (an 8 GB, an 11B, an 18B). */
const an = (v) => (/^(8|11|18)(\D|$)/.test(String(v)) ? 'An' : 'A');
/** A value from 0 to 1 that differs per row even when r() is constant. */
const vary = (r, i) => (r() + i * 0.293 + i * i * 0.071) % 1;

export default {
  // ---------- Module 7: getting and choosing models ----------
  'where-models-live-shortlist': {
    title: 'count the downloads that pass the trust checks',
    make(r) {
      const FMT = ['GGUF', 'safetensors', '.pt (pickle)', 'GGUF', 'MLX', '.bin (pickle)'];
      const rows = [0, 1, 2, 3, 4, 5].map((i) => {
        const lic = vary(r, i) < 0.72;
        const fmt = FMT[Math.floor(vary(r, i + 7) * FMT.length)];
        const dl = [40, 900, 12000, 85000, 640000, 2100000][Math.floor(vary(r, i + 3) * 6)];
        return { name: `Upload ${String.fromCharCode(65 + i)}`, lic, fmt, dl };
      });
      const passes = (x) => x.lic && !x.fmt.includes('pickle') && x.dl >= 10000;
      const answer = rows.filter(passes).length;
      return {
        q: `<p>Priya searches for a popular model and finds six uploads. Her rule: keep an upload only if it <b>names a licence</b>, uses a <b>data-only format</b> (GGUF, safetensors or MLX, not pickle) and has <b>at least 10,000 downloads</b>.</p>${table(['Upload', 'Licence named?', 'Format', 'Downloads'], rows.map((x) => [x.name, x.lic ? 'yes' : 'no', x.fmt, int(x.dl)]))}<p>How many uploads pass all three checks?</p>`,
        answer, unit: 'uploads', tol: 0, abs: 0.01,
        hint: 'Go row by row. One "no", one pickle file or fewer than 10,000 downloads is enough to drop an upload.',
        solution: steps(
          ...rows.map((x) => `${x.name}: ${passes(x) ? 'passes' : 'dropped (' + [!x.lic && 'no licence', x.fmt.includes('pickle') && 'pickle format', x.dl < 10000 && 'only ' + int(x.dl) + ' downloads'].filter(Boolean).join(', ') + ')'}.`),
          `<b>${answer}</b> upload${answer === 1 ? '' : 's'} pass. If none pass, go to the model maker's own page instead.`),
        rows,
      };
    },
    verify: (p) => p.rows.reduce((s, x) => s + (x.lic && /GGUF|safetensors|MLX/.test(x.fmt) && x.dl > 9999 ? 1 : 0), 0),
  },
  'where-models-live-download': {
    title: 'how long a model download takes',
    make(r) {
      const sizes = [4.6, 6.6, 7.7, 16, 19], names = ['Gemma 4 E2B', 'Gemma 4 E4B', 'Gemma 4 12B', 'Gemma 4 26B A4B', 'Gemma 4 31B'];
      const k = pick(r, 0, 4), gb = sizes[k], mbps = pick(r, 20, 300, 10);
      const answer = (gb * 8000) / mbps / 60;
      return {
        q: `<p>Your home internet downloads at ${mbps} megabits per second (Mbit/s). How many minutes will the ${gb} GB download of ${names[k]} take at that speed? (1 byte = 8 bits, and 1 GB = 1,000 megabytes.)</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Turn gigabytes into megabits first (× 1,000 × 8), divide by the speed to get seconds, then divide by 60.',
        solution: steps(
          `${gb} GB = ${int(gb * 1000)} megabytes = ${int(gb * 8000)} megabits.`,
          `${int(gb * 8000)} ÷ ${mbps} = ${fx((gb * 8000) / mbps, 1)} seconds.`,
          `÷ 60 = <b>${fx(answer, 1)} minutes</b>. Real downloads are often a little slower, so start it before you need it.`),
        gb, mbps,
      };
    },
    verify: (p) => (p.gb * 1e9 * 8) / (p.mbps * 1e6) / 60,
  },
  'licences-count': {
    title: 'count the models a business may use',
    make(r) {
      const users = [3, 40, 250, 900][pick(r, 0, 3)] * 1e6;
      const POOL = [
        ['Apache 2.0', () => true, 'standard licence, commercial use allowed'],
        ['MIT', () => true, 'standard licence, commercial use allowed'],
        ['Non-commercial', () => false, 'no business use'],
        ['Research only', () => false, 'no business use'],
        ['Custom: free below 100 million monthly users', (u) => u < 1e8, 'allowed only below 100 million users'],
        ['Custom: free below 700 million monthly users', (u) => u < 7e8, 'allowed only below 700 million users'],
        ['Custom: show the maker\'s name', () => true, 'allowed, with the maker\'s name shown'],
      ];
      const rows = [0, 1, 2, 3, 4, 5].map((i) => POOL[Math.floor(vary(r, i + 2) * POOL.length)]);
      const answer = rows.filter((x) => x[1](users)).length;
      return {
        q: `<p>A company's app has <b>${int(users)}</b> monthly users. It wants to build a paid feature on one of six open-weight models. Their licences:</p>${table(['Model', 'Licence'], rows.map((x, i) => [`Model ${i + 1}`, x[0]]))}<p>How many of the six may the company use in its paid product, following each licence's main condition?</p>`,
        answer, unit: 'models', tol: 0, abs: 0.01,
        hint: 'Apache 2.0 and MIT allow commercial use. "Non-commercial" and "research only" do not. For a user limit, compare it with the company\'s user count.',
        solution: steps(
          ...rows.map((x, i) => `Model ${i + 1} (${x[0]}): ${x[1](users) ? '<b>yes</b>' : 'no'}; ${x[2]}.`),
          `Total: <b>${answer}</b>. Before using any of them, read the full licence and note it with the date in your project notes.`),
        users, kinds: rows.map((x) => x[0]),
      };
    },
    verify: (p) => p.kinds.filter((k) => /Apache|MIT|name/.test(k) || (/100 million/.test(k) && p.users < 1e8) || (/700 million/.test(k) && p.users < 7e8)).length,
  },
  'model-families-moe-memory': {
    title: 'memory for a Mixture-of-Experts model',
    make(r) {
      const total = pick(r, 20, 120, 2), active = pick(r, 3, 12), bits = [4.5, 4.8][pick(r, 0, 1)];
      const answer = (total * bits) / 8;
      return {
        q: `<p>A new model is announced as "${total}B A${active}B": ${total} billion parameters in total, ${active} billion active for each token. You will run it at ${bits} bits per weight. About how many GB do its weights need in memory?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'Memory depends on ALL the parameters, not just the active ones. GB = billions of parameters × bits ÷ 8.',
        solution: steps(
          `Every expert must sit in memory, so use the total: ${total} billion.`,
          `${total} × ${bits} ÷ 8 = <b>${fx(answer, 1)} GB</b>, plus room for the conversation (Lesson 8.4).`,
          `Its speed is a different story: each token reads only about ${active} × ${bits} ÷ 8 = ${fx((active * bits) / 8, 1)} GB, so it writes about as fast as ${an(active).toLowerCase()} ${active}B model.`),
        total, bits,
      };
    },
    verify: (p) => (p.total * 1e9 * (p.bits / 8)) / 1e9,
  },
  'model-families-moe-speed': {
    title: 'top writing speed of a Mixture-of-Experts model',
    make(r) {
      const active = [3, 4, 5.1, 6, 8][pick(r, 0, 4)], bits = 4.5, bw = pick(r, 100, 500, 25);
      const gbRead = (active * bits) / 8, answer = bw / gbRead;
      return {
        q: `<p>A Mixture-of-Experts model uses ${active} billion active parameters per token, stored at ${bits} bits each. It runs on a machine whose memory can be read at ${bw} GB per second. Each token needs the active weights read once. What is the top writing speed, in tokens per second?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'First find how many GB are read per token (active billions × bits ÷ 8). Then speed = bandwidth ÷ GB per token.',
        solution: steps(
          `GB read per token = ${active} × ${bits} ÷ 8 = ${fx(gbRead, 4)} GB.`,
          `Speed = ${bw} ÷ ${fx(gbRead, 4)} = <b>${fx(answer, 0)} tokens per second</b> at best.`,
          'Real speed is lower (often 50% to 80% of this), but a dense model of the same total size would be many times slower still.'),
        active, bits, bw,
      };
    },
    verify: (p) => (p.bw * 8) / (p.active * p.bits),
  },
  'benchmarks-score': {
    title: 'score a model on your own tasks',
    make(r) {
      const a = pick(r, 6, 10), b = pick(r, 6, 10), c = pick(r, 5, 9);
      const ra = pick(r, 3, a), rb = pick(r, 3, b), rc = pick(r, 2, c - 1);
      const total = a + b + c, right = ra + rb + rc, answer = (right / total) * 100;
      return {
        q: `<p>Imran tests a model blind on his own work:</p>${table(['Task type', 'Tasks', 'Answered well'], [['Summaries', a, ra], ['Customer emails', b, rb], ['Spreadsheet formulas', c, rc]])}<p>What is the model's overall score, as a percentage of all tasks?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Add up all the tasks and all the good answers first. Do not average the three percentages: the groups are different sizes.',
        solution: steps(
          `Tasks: ${a} + ${b} + ${c} = ${total}.`,
          `Good answers: ${ra} + ${rb} + ${rc} = ${right}.`,
          `Score = ${right} ÷ ${total} × 100 = <b>${fx(answer, 1)}%</b>. With about 20 to 30 tasks, a gap of one or two tasks between models is noise.`),
        a, b, c, ra, rb, rc,
      };
    },
    verify: (p) => { const t = p.a + p.b + p.c; return 100 * ((p.ra / p.a) * (p.a / t) + (p.rb / p.b) * (p.b / t) + (p.rc / p.c) * (p.c / t)); },
  },
  'file-formats-size': {
    title: 'space saved by picking the GGUF',
    make(r) {
      const P = pick(r, 4, 32);
      const big = P * 2, small = (P * 4.8) / 8, answer = big - small;
      return {
        q: `<p>${an(P)} ${P}B model comes as the maker's 16-bit safetensors release, or as a Q4_K_M GGUF (about 4.8 bits per weight). How many GB of disk do you save by downloading the GGUF instead? (Ignore the small extra files.)</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'File size in GB ≈ billions of parameters × bits per weight ÷ 8. Work out both files, then subtract.',
        solution: steps(
          `16-bit: ${P} × 16 ÷ 8 = ${fx(big, 1)} GB.`,
          `Q4_K_M: ${P} × 4.8 ÷ 8 = ${fx(small, 1)} GB.`,
          `Saving: ${fx(big, 1)} − ${fx(small, 1)} = <b>${fx(answer, 1)} GB</b>, and the GGUF also loads straight into Ollama, LM Studio and llama.cpp.`),
        P,
      };
    },
    verify: (p) => p.P * (16 - 4.8) / 8,
  },
  'safe-downloads-budget': {
    title: 'disk budget for a model collection',
    make(r) {
      const M = [['Gemma 4 E2B', 4.6], ['Gemma 4 E4B', 6.6], ['Gemma 4 12B', 7.7], ['Gemma 4 31B', 19], ['gpt-oss-120b', 65]];
      const i = pick(r, 0, 2), j = pick(r, i + 1, 3), k = pick(r, j + 1, 4);
      const keep = [M[i], M[j], M[k]], sum = keep.reduce((s, m) => s + m[1], 0), answer = sum * 1.2;
      return {
        q: `<p>You want to keep three models: ${keep.map((m) => `${m[0]} (${m[1]} GB)`).join(', ')}. Using the rule "sum of the files plus 20% room for new versions", how much disk space should you set aside?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'Add the three sizes, then multiply by 1.2.',
        solution: steps(
          `Sum: ${keep.map((m) => m[1]).join(' + ')} = ${fx(sum, 1)} GB.`,
          `Add 20%: ${fx(sum, 1)} × 1.2 = <b>${fx(answer, 1)} GB</b>.`,
          'If your drive cannot spare that, move the model folder to an external SSD (OLLAMA_MODELS, or the models folder setting in LM Studio).'),
        sizes: keep.map((m) => m[1]),
      };
    },
    verify: (p) => p.sizes.reduce((s, v) => s + v + v / 5, 0),
  },

  // ---------- Module 8: quantisation ----------
  'what-is-quantisation-round': {
    title: 'round a weight to 4 bits and back',
    make(r) {
      const ws = [0, 1, 2, 3].map((i) => +((vary(r, i) * 1.6 - 0.8)).toFixed(3));
      ws[pick(r, 0, 3)] = +(pick(r, 0.5, 0.95, 0.01) * (r() < 0.5 ? -1 : 1)).toFixed(3); // one clearly large weight sets the scale
      const max = Math.max(...ws.map(Math.abs)), scale = max / 7, which = pick(r, 0, 3);
      // keep clear of exact halfway points, where two levels are equally close
      if (Math.abs((Math.abs(ws[which] / scale) % 1) - 0.5) < 0.02) ws[which] = +(ws[which] + (ws[which] < 0 ? 0.004 : -0.004)).toFixed(3);
      const w = ws[which];
      const q = Math.round(w / scale), answer = q * scale;
      return {
        q: `<p>A block of four weights is stored at 4 bits: <b>${ws.join(', ')}</b>. The block keeps one scale, s = (largest size, ignoring the sign) ÷ 7, and each weight is stored as a whole number from −7 to 7: round(w ÷ s). When the model runs, it uses (whole number) × s. What value does it use for the weight ${w}? Give 3 decimal places.</p>`,
        answer, unit: '', tol: 0, abs: 0.0015,
        hint: 'Find the largest size in the block, divide by 7 to get s, then divide the weight by s, round to the nearest whole number and multiply back by s.',
        solution: steps(
          `Largest size: ${max}. Scale s = ${max} ÷ 7 = ${fx(scale, 4)}.`,
          `${w} ÷ ${fx(scale, 4)} = ${fx(w / scale, 3)}, which rounds to <b>${q}</b>. That whole number is what the file stores (4 bits).`,
          `Back: ${q} × ${fx(scale, 4)} = <b>${fx(answer, 3)}</b>. The rounding error is ${fx(Math.abs(answer - w), 4)}, never more than half a step (${fx(scale / 2, 4)}).`),
        w, max,
      };
    },
    verify: (p) => { const s = p.max / 7; let best = 0, bd = Infinity; for (let k = -7; k <= 7; k++) { const d = Math.abs(k * s - p.w); if (d <= bd + 1e-12) { bd = d; best = k * s; } } return best; },
  },
  'bits-per-weight-largest': {
    title: 'largest model that fits at a given bits per weight',
    make(r) {
      const opts = [['Q8_0', 8.5], ['Q6_K', 6.6], ['Q4_K_M', 4.8], ['Q3_K_M', 3.9]];
      const [qn, b] = opts[pick(r, 0, 3)], M = [12, 16, 24, 32, 48][pick(r, 0, 4)], X = pick(r, 2, 5);
      const answer = ((M - X) * 8) / b;
      return {
        q: `<p>Your graphics card has ${M} GB. You keep ${X} GB free for the conversation memory and the system. What is the largest model, in billions of parameters, whose weights fit in the rest at ${qn} (about ${b} bits per weight)?</p>`,
        answer, unit: 'billion parameters', tol: 0.01,
        hint: 'Room for weights = card − reserve. Each billion parameters at b bits takes b ÷ 8 GB, so divide the room by b ÷ 8.',
        solution: steps(
          `Room for weights: ${M} − ${X} = ${M - X} GB.`,
          `One billion parameters at ${b} bits = ${b} ÷ 8 = ${fx(b / 8, 4)} GB.`,
          `${M - X} ÷ ${fx(b / 8, 4)} = <b>${fx(answer, 1)} billion</b> parameters. Pick the nearest real model below this.`),
        M, X, b,
      };
    },
    verify: (p) => (p.M - p.X) / (p.b / 8),
  },
  'quant-formats-bpw': {
    title: 'file size from bits per number and block scales',
    make(r) {
      const b = [4, 5, 8][pick(r, 0, 2)], k = [32, 64][pick(r, 0, 1)], s = 16, P = pick(r, 4, 32);
      const eff = b + s / k, answer = (P * eff) / 8;
      return {
        q: `<p>${an(P)} ${P}B model is quantised with ${b}-bit numbers in blocks of ${k} weights, and each block also stores one ${s}-bit scale. About how big is the file in GB?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: `Each block of ${k} weights costs ${k} × ${b} bits plus ${s} bits for the scale. Turn that into bits per weight, then GB = billions × bits ÷ 8.`,
        solution: steps(
          `Bits per weight = ${b} + ${s} ÷ ${k} = ${fx(eff, 3)}.`,
          `File ≈ ${P} × ${fx(eff, 3)} ÷ 8 = <b>${fx(answer, 2)} GB</b>.`,
          `The scale costs only ${fx(s / k, 3)} extra bits per weight but keeps every block close to its true size.`),
        b, k, s, P,
      };
    },
    verify: (p) => { const blocks = (p.P * 1e9) / p.k; return (blocks * (p.k * p.b + p.s)) / 8 / 1e9; },
  },
  'kv-cache-size': {
    title: 'work out the KV cache for a long document',
    make(r) {
      const M = [['Llama 3.1 8B', 32, 8, 128], ['Qwen2.5-32B', 64, 8, 128], ['Llama 2 7B', 32, 32, 128]];
      const [name, L, H, d] = M[pick(r, 0, 2)], T = [4096, 8192, 16384, 32768][pick(r, 0, 3)], B = [2, 1][pick(r, 0, 1)];
      const perTok = 2 * L * H * d * B, answer = (perTok * T) / 1024 ** 3;
      return {
        q: `<p>${name} has ${L} layers, ${H} key-value heads and a head size of ${d}. You give it a ${int(T)}-token document with the cache stored at ${B * 8} bits (${B} byte${B > 1 ? 's' : ''} per number). How many GB does the KV cache need? (Use 1 GB = 1,073,741,824 bytes, as engines do.)</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'Bytes per token = 2 (a key and a value) × layers × KV heads × head size × bytes per number. Multiply by the tokens, then divide by 1,073,741,824.',
        solution: steps(
          `Per token: 2 × ${L} × ${H} × ${d} × ${B} = ${int(perTok)} bytes (${fx(perTok / 1024, 0)} KB).`,
          `All tokens: ${int(perTok)} × ${int(T)} = ${int(perTok * T)} bytes.`,
          `÷ 1,073,741,824 = <b>${fx(answer, 2)} GB</b>, on top of the model's own weights.`),
        L, H, d, B, T,
      };
    },
    verify: (p) => ((p.L * p.H * p.d * p.B * 2) / 1024) * p.T / 1024 / 1024,
  },
  'kv-cache-tokens': {
    title: 'how much context fits in the memory you have left',
    make(r) {
      const card = [12, 16, 24][pick(r, 0, 2)], w = pick(r, 5, card - 5, 0.5), sys = 1, left = card - w - sys;
      const kb = 64; // Llama 3.1 8B with an 8-bit cache: 2 × 32 × 8 × 128 × 1 bytes = 65,536 bytes
      const answer = (left * 1048576) / kb;
      return {
        q: `<p>On a ${card} GB graphics card, the model's weights take ${w} GB and the engine needs about ${sys} GB for itself. The model is Llama 3.1 8B with an 8-bit KV cache, which costs 64 KB per token (1 GB = 1,048,576 KB). About how many tokens of context fit in the memory that is left?</p>`,
        answer, unit: 'tokens', tol: 0.01,
        hint: 'Memory left = card − weights − engine. Turn it into KB, then divide by 64 KB per token.',
        solution: steps(
          `Left: ${card} − ${w} − ${sys} = ${fx(left, 1)} GB = ${int(Math.round(left * 1048576))} KB.`,
          `÷ 64 KB per token = <b>${int(Math.round(answer))} tokens</b>.`,
          'Set the context a bit below this (engines use sizes like 8,192, 16,384 or 32,768) so other apps keep some room.'),
        left, kb,
      };
    },
    verify: (p) => p.left * 16384 * (64 / p.kb),
  },
  'choose-a-quant-fit': {
    title: 'check how much memory is left with your pick',
    make(r) {
      const U = [16, 24, 32][pick(r, 0, 2)], k = pick(r, 0.08, 0.16, 0.02), C = [8, 16, 32][pick(r, 0, 2)];
      const maxP = Math.floor((U - 2 - k * C) / 0.6), P = pick(r, Math.max(4, maxP - 8), maxP);
      const wgt = P * 0.6, kv = k * C, answer = U - wgt - kv - 1;
      return {
        q: `<p>You have ${U} GB of usable fast memory. You plan to run a ${P}B model at Q4_K_M (4.8 bits per weight) with ${C}K context. For this model the KV cache costs about ${k} GB per 1K tokens, and the engine needs about 1 GB. How many GB are left over as headroom?</p>`,
        answer, unit: 'GB', tol: 0.01, abs: 0.05,
        hint: 'Weights = billions × 4.8 ÷ 8. KV cache = GB per 1K × context in K. Subtract both and the 1 GB from the usable memory.',
        solution: steps(
          `Weights: ${P} × 4.8 ÷ 8 = ${fx(wgt, 2)} GB.`,
          `KV cache: ${k} × ${C} = ${fx(kv, 2)} GB.`,
          `Left: ${U} − ${fx(wgt, 2)} − ${fx(kv, 2)} − 1 = <b>${fx(answer, 2)} GB</b>. Aim for 10% to 20% of ${U} GB (${fx(U * 0.1, 1)} to ${fx(U * 0.2, 1)} GB); ${answer >= U * 0.1 ? 'this pick has enough' : 'this pick is tight, so try a shorter context or one size smaller'}.`),
        U, P, k, C,
      };
    },
    verify: (p) => p.U - 1 - (p.P * 4.8) / 8 - p.k * p.C,
  },

  // ---------- Module 9: installing ----------
  'lm-studio-memory': {
    title: 'memory left after loading a model',
    make(r) {
      const T = [8, 16, 32][pick(r, 0, 2)], files = { 8: [4.6], 16: [6.6, 7.7], 32: [7.7, 16, 19] }[T];
      const F = files[pick(r, 0, files.length - 1)];
      const S = pick(r, T === 8 ? 1.5 : 2.5, Math.min(6, T - F * 1.2 - 0.5), 0.5);
      const answer = T - S - F * 1.2;
      return {
        q: `<p>Your computer has ${T} GB of memory. The system and your open apps already use ${S} GB. You load a ${F} GB model file, which needs about 1.2 × its size once the conversation memory is added. How many GB are still free?</p>`,
        answer, unit: 'GB', tol: 0.01, abs: 0.05,
        hint: 'Memory the model needs = file × 1.2. Subtract that and what is already in use from the total.',
        solution: steps(
          `Model needs: ${F} × 1.2 = ${fx(F * 1.2, 2)} GB.`,
          `Free: ${T} − ${S} − ${fx(F * 1.2, 2)} = <b>${fx(answer, 2)} GB</b>.`,
          answer < 1.5 ? 'That is very tight: close the browser or pick a smaller file, or the computer will start swapping to disk (Lesson 9.7).' : 'That leaves breathing room for a browser and a longer chat.'),
        T, S, F,
      };
    },
    verify: (p) => p.T - p.S - p.F - p.F / 5,
  },
  'lm-studio-wait': {
    title: 'how long an answer takes to appear',
    make(r) {
      const W = pick(r, 150, 600, 50), s = pick(r, 4, 30);
      const tok = W * 1.3, answer = tok / s;
      return {
        q: `<p>You ask for a ${W}-word answer. English text is about 1.3 tokens per word. The app shows a speed of ${s} tokens per second. About how many seconds does the answer take to finish writing?</p>`,
        answer, unit: 'seconds', tol: 0.01,
        hint: 'Words × 1.3 gives tokens. Tokens ÷ tokens per second gives seconds.',
        solution: steps(
          `Tokens: ${W} × 1.3 = ${fx(tok, 0)}.`,
          `Time: ${fx(tok, 0)} ÷ ${s} = <b>${fx(answer, 1)} seconds</b>.`,
          `Most people read about 4 to 5 words a second, so above about 10 tokens per second the text appears faster than you read it${s >= 10 ? ', as here' : '; this one will feel slow'}.`),
        W, s,
      };
    },
    verify: (p) => (p.W * 13) / (p.s * 10),
  },
  'ollama-split': {
    title: 'speed when part of the model spills onto the processor',
    make(r) {
      const G = pick(r, 6, 12, 0.5), g = pick(r, 3, G - 1, 0.5), gbw = pick(r, 200, 500, 50), cbw = pick(r, 40, 80, 10);
      const t = g / gbw + (G - g) / cbw, answer = 1 / t;
      return {
        q: `<p>${an(G)} ${G} GB model is loaded with ${g} GB on the graphics card (which reads ${gbw} GB/s) and the rest in the processor's memory (which reads ${cbw} GB/s). Each token reads every part once. About how many tokens per second does it write?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'Time per token = GB on GPU ÷ GPU speed + GB on CPU ÷ CPU speed. Speed = 1 ÷ time.',
        solution: steps(
          `On the processor: ${G} − ${g} = ${fx(G - g, 1)} GB.`,
          `Time per token: ${g} ÷ ${gbw} + ${fx(G - g, 1)} ÷ ${cbw} = ${fx(g / gbw, 4)} + ${fx((G - g) / cbw, 4)} = ${fx(t, 4)} s.`,
          `Speed: 1 ÷ ${fx(t, 4)} = <b>${fx(answer, 1)} tokens per second</b>. All on the card it would be ${fx(gbw / G, 1)}: the small slow part costs the most.`),
        G, g, gbw, cbw,
      };
    },
    verify: (p) => (p.gbw * p.cbw) / (p.g * p.cbw + (p.G - p.g) * p.gbw),
  },
  'llama-cpp-layers': {
    title: 'how many layers fit on the graphics card',
    make(r) {
      const N = [32, 40, 48, 64][pick(r, 0, 3)], F = pick(r, 6, 20, 0.5), V = [6, 8, 12, 16][pick(r, 0, 3)], R = pick(r, 0.5, 2, 0.5);
      const answer = Math.min(N, Math.floor(((V - R) * N) / F + 1e-9));
      return {
        q: `<p>${an(F)} ${F} GB GGUF file has ${N} layers of equal size. Your graphics card has ${V} GB, and you keep ${R} GB of it for the context. How many whole layers can llama.cpp put on the card with <code>-ngl</code>?</p>`,
        answer, unit: 'layers', tol: 0, abs: 0.01,
        hint: 'Size of one layer = file ÷ layers. Room = card − context. Layers = room ÷ layer size, rounded down (and never more than the model has).',
        solution: steps(
          `One layer: ${F} ÷ ${N} = ${fx(F / N, 4)} GB.`,
          `Room: ${V} − ${R} = ${fx(V - R, 1)} GB.`,
          `${fx(V - R, 1)} ÷ ${fx(F / N, 4)} = ${fx(((V - R) * N) / F, 2)}${answer === N ? `, more than the ${N} layers there are, so all of them fit` : ', rounded down'}: <b>${answer} layers</b> on the card${answer < N ? `, ${N - answer} on the processor` : ''}.`),
        N, F, V, R,
      };
    },
    verify: (p) => { let c = 0; while (c < p.N && ((c + 1) * p.F) / p.N <= p.V - p.R + 1e-9) c++; return c; },
  },
  'mlx-on-mac-speed': {
    title: 'top speed of a model on a Mac',
    make(r) {
      const mem = [16, 24, 32, 48, 64][pick(r, 0, 4)], bw = [120, 150, 200, 270, 400][pick(r, 0, 4)];
      const S = pick(r, 2.5, Math.floor(mem * 0.75) - 2, 0.5), answer = bw / S;
      return {
        q: `<p>A Mac has ${mem} GB of unified memory that reads at ${bw} GB/s. You run a ${S} GB 4-bit model with MLX. It fits (three quarters of ${mem} is ${fx(mem * 0.75, 1)} GB). What is its top writing speed in tokens per second?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'A dense model reads all its weights for each token. Top speed = bandwidth ÷ model size.',
        solution: steps(
          `Each token reads the whole ${S} GB.`,
          `${bw} ÷ ${S} = <b>${fx(answer, 1)} tokens per second</b> at most.`,
          'Expect about 60% to 80% of that in practice. A bigger model on the same Mac writes slower in the same proportion.'),
        bw, S,
      };
    },
    verify: (p) => 1 / (p.S / p.bw),
  },
  'local-chat-ui-queue': {
    title: 'how many answers per hour a shared chat window can give',
    make(r) {
      const s = pick(r, 8, 40), L = pick(r, 200, 800, 50);
      const answer = (s * 3600) / L;
      return {
        q: `<p>A family shares one computer through a local chat window. The engine writes ${s} tokens per second and answers one question at a time. A typical answer is ${L} tokens. About how many answers can it give in one hour of non-stop use?</p>`,
        answer, unit: 'answers', tol: 0.01,
        hint: 'Tokens per hour = tokens per second × 3,600. Divide by tokens per answer.',
        solution: steps(
          `Tokens per hour: ${s} × 3,600 = ${int(s * 3600)}.`,
          `Answers: ${int(s * 3600)} ÷ ${L} = <b>${fx(answer, 1)}</b>.`,
          `Each answer takes ${fx(L / s, 1)} seconds, so two people asking at once wait for each other a little, which is fine for a family.`),
        s, L,
      };
    },
    verify: (p) => 60 / (p.L / p.s / 60),
  },
  'going-offline-chain': {
    title: 'chance an untested setup works offline',
    make(r) {
      const a = pick(r, 2, 4), pa = pick(r, 0.9, 0.98, 0.01), b = pick(r, 1, 3), pb = pick(r, 0.7, 0.88, 0.01);
      const answer = Math.pow(pa, a) * Math.pow(pb, b) * 100;
      return {
        q: `<p>Your setup has ${a} parts that are each ${fx(pa * 100, 0)}% likely to work offline untested (the chat app, the models) and ${b} part${b > 1 ? 's' : ''} that ${b > 1 ? 'are each' : 'is'} only ${fx(pb * 100, 0)}% likely (scripts that may check online). Everything must work for the job to work. What is the chance, as a percentage, that it all works when you pull the cable?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'For a chain, multiply the chances: each part\'s chance as a decimal, once per part. Then × 100.',
        solution: steps(
          `Reliable parts: ${pa}<sup>${a}</sup> = ${fx(Math.pow(pa, a), 4)}.`,
          `Riskier part${b > 1 ? 's' : ''}: ${pb}<sup>${b}</sup> = ${fx(Math.pow(pb, b), 4)}.`,
          `Together: ${fx(Math.pow(pa, a), 4)} × ${fx(Math.pow(pb, b), 4)} × 100 = <b>${fx(answer, 1)}%</b>. A ten-minute test turns that guess into a yes or no.`),
        a, pa, b, pb,
      };
    },
    verify: (p) => 100 * Math.exp(p.a * Math.log(p.pa) + p.b * Math.log(p.pb)),
  },
  'troubleshooting-swap': {
    title: 'how swapping to disk slows a model down',
    make(r) {
      const G = pick(r, 6, 16, 0.5), x = pick(r, 0.5, 3, 0.5), M = pick(r, 60, 120, 10), D = [2, 3, 5, 7][pick(r, 0, 3)];
      const t = (G - x) / M + x / D, answer = 1 / t;
      return {
        q: `<p>${an(G)} ${G} GB model no longer fits because of open browser tabs, so ${x} GB of it is swapped to the SSD. Memory reads at ${M} GB/s; the SSD reads at ${D} GB/s. Each token reads all of the model once. About how many tokens per second does it write now?</p>`,
        answer, unit: 'tokens/s', tol: 0.01,
        hint: 'Time per token = GB in memory ÷ memory speed + GB on disk ÷ disk speed. Speed = 1 ÷ that time.',
        solution: steps(
          `In memory: ${G} − ${x} = ${fx(G - x, 1)} GB, taking ${fx(G - x, 1)} ÷ ${M} = ${fx((G - x) / M, 4)} s.`,
          `On disk: ${x} ÷ ${D} = ${fx(x / D, 4)} s.`,
          `Speed: 1 ÷ ${fx(t, 4)} = <b>${fx(answer, 2)} tokens per second</b>, against ${fx(M / G, 1)} with everything in memory. Close the tabs.`),
        G, x, M, D,
      };
    },
    verify: (p) => (p.M * p.D) / ((p.G - p.x) * p.D + p.x * p.M),
  },
};
