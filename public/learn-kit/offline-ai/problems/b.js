// Live problems for Offline AI, part b: Modules 4, 5 and 6 (hardware, buying, power). See ../problems.js.
// Every person and business is made up. Prices and rates are example numbers given in the question, never a price list.
import { pick, n, steps, table } from './util.js';

// macOS lets the graphics side use about two thirds of unified memory on Macs with 36 GB or less, about three quarters above.
const macUse = (gb) => gb * (gb <= 36 ? 2 / 3 : 0.75), macPct = (gb) => (gb <= 36 ? 'two thirds' : 'three quarters');
const int = (v) => Math.round(v).toLocaleString('en-CA');
const money = (v, c = '$') => c + (+v).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default {
  // ---------- Module 4: the parts that matter ----------
  'memory-is-king-fit': {
    title: 'how much fast memory a model needs',
    make(r) {
      const P = pick(r, 4, 32, 1), b = [4, 4.5, 4.8, 5.5, 8][pick(r, 0, 4)], kv = pick(r, 0.5, 4, 0.5);
      const w = (P * b) / 8, answer = w + kv + 1;
      return {
        q: `<p>A design studio wants to run a <b>${P}-billion-parameter</b> model saved at <b>${b} bits per weight</b>. For the length of chat they need, the conversation memory (KV cache) is about ${kv} GB, and the engine needs about 1 GB of working room. How many <b>GB</b> of fast memory does it need in total?</p>`,
        answer, unit: 'GB', tol: 0.01,
        hint: 'Weights in GB = billions of parameters × bits per weight ÷ 8 (8 bits make a byte). Then add the KV cache and the 1 GB of working room.',
        solution: steps(
          `Weights: ${P} × ${b} ÷ 8 = ${n(w)} GB.`,
          `Add the conversation memory: ${n(w)} + ${kv} = ${n(w + kv)} GB.`,
          `Add working room: ${n(w + kv)} + 1 = <b>${n(answer)} GB</b>. ${answer <= 15 ? 'That fits on a 16 GB graphics card (about 15 GB usable).' : answer <= 23 ? 'Too big for a 16 GB card; a 24 GB card fits it.' : 'This needs a 32 GB card, two cards or a large unified-memory machine.'}`),
        P, b, kv,
      };
    },
    verify: (p) => p.P * 1e9 * (p.b / 8) / 1e9 + p.kv + 1,
  },
  'memory-is-king-largest': {
    title: 'the largest model that fits in your memory',
    make(r) {
      const M = [8, 12, 16, 24, 32][pick(r, 0, 4)], kv = pick(r, 0.5, 2, 0.5), b = [4, 4.5, 4.8][pick(r, 0, 2)];
      const left = M - 1 - kv, answer = (left * 8) / b;
      return {
        q: `<p>Your graphics card has <b>${M} GB</b> of memory. Keep 1 GB for the screen and the engine, and ${kv} GB for the conversation memory. What is the biggest model, in <b>billions of parameters</b>, that fits at <b>${b} bits per weight</b>?</p>`,
        answer, unit: 'billion parameters', tol: 0.01,
        hint: 'First find the GB left for the weights. Each billion parameters at b bits takes b ÷ 8 GB, so divide the GB left by that.',
        solution: steps(
          `GB left for weights: ${M} − 1 − ${kv} = ${n(left)} GB.`,
          `One billion parameters at ${b} bits takes ${b} ÷ 8 = ${n(b / 8)} GB.`,
          `${n(left)} ÷ ${n(b / 8)} = <b>${n(answer)} billion parameters</b>. Pick a model a little below this, so there is room to spare.`),
        M, kv, b,
      };
    },
    verify: (p) => (p.M - 1 - p.kv) / (p.b / 8),
  },
  'memory-bandwidth-ceiling': {
    title: 'the speed ceiling from memory bandwidth',
    make(r) {
      const bw = [100, 120, 273, 448, 614, 936, 1792][pick(r, 0, 6)], G = pick(r, 2, 20, 0.5), e = pick(r, 50, 80, 5);
      const top = bw / G, answer = top * e / 100;
      return {
        q: `<p>A shop owner's machine reads memory at <b>${bw} GB/s</b>. The model's weights are <b>${G} GB</b>, and all of them are read once for every new token. Real engines reach about <b>${e}%</b> of the ceiling. About how many <b>tokens per second</b> will it write?</p>`,
        answer, unit: 'tokens per second', tol: 0.01,
        hint: 'The ceiling is how many times per second the memory can hand over the whole model: bandwidth ÷ model size. Then take the stated share of it.',
        solution: steps(
          `Ceiling: ${bw} ÷ ${G} = ${n(top)} full reads per second, so at most ${n(top)} tokens per second.`,
          `Real engines lose time to other work: ${n(top)} × ${e}% = <b>${n(answer)} tokens per second</b>.`,
          `Above about 10 tokens per second, text appears faster than most people read.`),
        bw, G, e,
      };
    },
    verify: (p) => (p.e / 100) / (p.G / p.bw),
  },
  'memory-bandwidth-moe': {
    title: 'why a Mixture-of-Experts model writes fast',
    make(r) {
      const A = pick(r, 3, 17, 1), b = [4, 4.25, 4.5, 5][pick(r, 0, 3)], bw = [120, 256, 273, 448, 614][pick(r, 0, 4)];
      const g = (A * b) / 8, answer = bw / g;
      return {
        q: `<p>A Mixture-of-Experts model has many experts but uses only <b>${A} billion</b> parameters for each token. It is saved at <b>${b} bits per weight</b> and runs on a machine with <b>${bw} GB/s</b> of memory bandwidth. What is the <b>ceiling</b> on its writing speed, in tokens per second?</p>`,
        answer, unit: 'tokens per second', tol: 0.01,
        hint: 'Only the active parameters are read per token. GB read per token = active billions × bits ÷ 8. Then divide the bandwidth by it.',
        solution: steps(
          `GB read per token: ${A} × ${b} ÷ 8 = ${n(g)} GB.`,
          `Ceiling: ${bw} ÷ ${n(g)} = <b>${n(answer)} tokens per second</b>.`,
          `The whole model must still fit in memory; only the reading per token is small.`),
        A, b, bw,
      };
    },
    verify: (p) => (p.bw * 8) / (p.A * p.b),
  },
  'gpu-cpu-npu-split': {
    title: 'speed when a model is split between card and main memory',
    make(r) {
      const g = pick(r, 6, 22, 2), c = pick(r, 1, 8, 1), gb = [448, 672, 936][pick(r, 0, 2)], cb = [50, 60, 80, 100][pick(r, 0, 3)];
      const t = g / gb + c / cb, answer = 1 / t;
      return {
        q: `<p>A ${g + c} GB model does not fit on a student's graphics card, so the engine puts <b>${g} GB</b> on the card (<b>${gb} GB/s</b>) and the other <b>${c} GB</b> in main memory (<b>${cb} GB/s</b>). Each token reads both parts, one after the other. What is the <b>ceiling</b> on writing speed, in tokens per second?</p>`,
        answer, unit: 'tokens per second', tol: 0.01,
        hint: 'Work out the time to read each part (GB ÷ GB/s), add the two times, then take 1 ÷ the total.',
        solution: steps(
          `Card part: ${g} ÷ ${gb} = ${n(g / gb)} s.`,
          `Main-memory part: ${c} ÷ ${cb} = ${n(c / cb)} s.`,
          `Time per token: ${n(t)} s, so 1 ÷ ${n(t)} = <b>${n(answer)} tokens per second</b>. All on the card it would be ${n(gb / (g + c))}: the small slow part takes ${Math.round((c / cb) / t * 100)}% of the time.`),
        g, c, gb, cb,
      };
    },
    verify: (p) => (p.gb * p.cb) / (p.g * p.cb + p.c * p.gb),
  },
  'storage-power-cooling-psu': {
    title: 'size a power supply',
    make(r) {
      const card = [180, 220, 300, 350, 450, 575][pick(r, 0, 5)], rest = pick(r, 100, 200, 25), h = [1.3, 1.4, 1.5][pick(r, 0, 2)];
      const answer = (card + rest) * h;
      return {
        q: `<p>An office PC gets a graphics card rated at <b>${card} W</b>. The rest of the PC (processor, disks, fans) draws up to <b>${rest} W</b>. You want <b>${Math.round((h - 1) * 100)}%</b> headroom. What is the <b>smallest power supply</b>, in watts, you should consider?</p>`,
        answer, unit: 'W', tol: 0.01,
        hint: 'Add the card and the rest of the PC to get the peak, then multiply by 1 plus the headroom.',
        solution: steps(
          `Peak draw: ${card} + ${rest} = ${card + rest} W.`,
          `With ${Math.round((h - 1) * 100)}% headroom: ${card + rest} × ${h} = <b>${n(answer)} W</b>.`,
          `Power supplies come in steps such as 550, 650, 750, 850 and 1,000 W, so buy the next size up, and check the card maker's own recommendation.`),
        card, rest, h,
      };
    },
    verify: (p) => p.card * p.h + p.rest * p.h,
  },
  'storage-power-cooling-load': {
    title: 'how long a model takes to load from disk',
    make(r) {
      const G = pick(r, 4, 65, 1), fast = [2, 3, 5, 7][pick(r, 0, 3)], slow = [0.12, 0.15, 0.2][pick(r, 0, 2)];
      const tf = G / fast, ts = G / slow, answer = ts - tf;
      return {
        q: `<p>You load a <b>${G} GB</b> model file. An NVMe SSD reads about <b>${fast} GB/s</b>; an old hard disk reads about <b>${slow} GB/s</b>. How many <b>seconds</b> longer does the hard disk take to load it?</p>`,
        answer, unit: 'seconds', tol: 0.01,
        hint: 'Load time = file size ÷ read speed. Work out both times and subtract.',
        solution: steps(
          `SSD: ${G} ÷ ${fast} = ${n(tf)} s.`,
          `Hard disk: ${G} ÷ ${slow} = ${n(ts)} s (about ${n(ts / 60)} minutes).`,
          `Difference: <b>${n(answer)} s</b>. Once loaded, both write tokens at the same speed: the disk only matters at the start.`),
        G, fast, slow,
      };
    },
    verify: (p) => p.G * (1 / p.slow - 1 / p.fast),
  },
  'device-types-smallest-mac': {
    title: 'the smallest Mac memory that fits your model',
    make(r) {
      const P = [12, 14, 27, 31, 32][pick(r, 0, 4)], b = [4.5, 4.8, 5.5][pick(r, 0, 2)], kv = pick(r, 1, 10, 1);
      const need = (P * b) / 8 + kv + 1, sizes = [16, 24, 32, 48, 64, 96, 128];
      const answer = sizes.find((s) => macUse(s) >= need) ?? 192;
      return {
        q: `<p>A translator needs a <b>${P}B</b> model at <b>${b} bits</b> with about <b>${kv} GB</b> of conversation memory and 1 GB of working room. A Mac lets the model use about <b>two thirds</b> of its memory up to 36 GB, and about <b>three quarters</b> on bigger Macs. Macs come with ${sizes.join(', ')} GB. What is the <b>smallest</b> size that fits, in GB?</p>`,
        answer, unit: 'GB', tol: 0, abs: 0.01,
        hint: 'Work out the GB needed (weights + KV cache + 1). Then find the first size whose usable share (two thirds up to 36 GB, three quarters above) is at least that.',
        solution: steps(
          `Needed: ${P} × ${b} ÷ 8 + ${kv} + 1 = ${n(need)} GB.`,
          table(['Mac memory', 'Usable', 'Fits?'], sizes.map((s) => [s + ' GB', n(macUse(s)) + ' GB (' + macPct(s) + ')', macUse(s) >= need ? 'yes' : 'no'])),
          `Smallest that fits: <b>${answer} GB</b>. Mac memory cannot be added later, so many buyers take one size up.`),
        P, b, kv,
      };
    },
    verify: (p) => { const need = (p.P * p.b) / 8 + p.kv + 1; let s = 0; for (const m of [128, 96, 64, 48, 32, 24, 16]) if (m * (m > 36 ? 3 / 4 : 2 / 3) >= need) s = m; return s || 192; },
  },
  'phones-and-tablets-largest': {
    title: 'the largest model a phone can hold',
    make(r) {
      const U = pick(r, 2, 6, 0.5), res = pick(r, 0.5, 1, 0.25), b = [4, 4.5, 4.8][pick(r, 0, 2)];
      const answer = ((U - res) * 8) / b;
      return {
        q: `<p>Your phone can spare about <b>${U} GB</b> of memory for a model. You keep <b>${res} GB</b> of that for the conversation. What is the largest model, in <b>billions of parameters</b>, that fits at <b>${b} bits per weight</b>?</p>`,
        answer, unit: 'billion parameters', tol: 0.01,
        hint: 'GB for weights = usable GB − the conversation reserve. Parameters (billions) = GB × 8 ÷ bits.',
        solution: steps(
          `GB for weights: ${U} − ${res} = ${n(U - res)} GB.`,
          `${n(U - res)} × 8 ÷ ${b} = <b>${n(answer)} billion parameters</b>.`,
          `In practice choose a smaller model than this (for example a 2B to 4B phone model), so the phone stays quick and cool.`),
        U, res, b,
      };
    },
    verify: (p) => (p.U - p.res) / (p.b / 8),
  },
  'phones-and-tablets-download': {
    title: 'how long a phone model takes to download',
    make(r) {
      const G = pick(r, 1.5, 4, 0.5), mb = [25, 50, 100, 200][pick(r, 0, 3)];
      const answer = (G * 8000) / mb / 60;
      return {
        q: `<p>A phone version of a model is <b>${G} GB</b>. Your home Wi-Fi downloads at <b>${mb} megabits per second</b>. About how many <b>minutes</b> will the download take? (1 GB = 8,000 megabits.)</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Turn GB into megabits (× 8,000), divide by the speed to get seconds, then divide by 60.',
        solution: steps(
          `${G} GB × 8,000 = ${int(G * 8000)} megabits.`,
          `${int(G * 8000)} ÷ ${mb} = ${n(G * 8000 / mb)} seconds.`,
          `÷ 60 = <b>${n(answer)} minutes</b>. Download at home on Wi-Fi before you travel; after that the model needs no connection.`),
        G, mb,
      };
    },
    verify: (p) => p.G / (p.mb / 8000) / 60,
  },

  // ---------- Module 5: buying ----------
  'budget-tier-worth': {
    title: 'how much an upgrade is worth to you',
    make(r) {
      const h = pick(r, 2, 12, 1), v = pick(r, 10, 60, 5), m = [12, 18, 24, 36][pick(r, 0, 3)];
      const answer = h * v * m;
      return {
        q: `<p>A freelance writer finds that a faster machine would save about <b>${h} hours a month</b>. Her time is worth <b>${v}</b> (in her currency) an hour, and she would use the machine for <b>${m} months</b>. Up to how much is the upgrade worth paying?</p>`,
        answer, unit: 'in her currency', tol: 0.005,
        hint: 'Value = hours saved per month × value of an hour × months of use.',
        solution: steps(
          `Value per month: ${h} × ${v} = ${int(h * v)}.`,
          `Over ${m} months: ${int(h * v)} × ${m} = <b>${int(answer)}</b>.`,
          `If the upgrade costs less than this, it pays for itself. If it costs more, the free speed-ups and a smaller model may be the better choice.`),
        h, v, m,
      };
    },
    verify: (p) => p.m * p.v * p.h,
  },
  'budget-tier-payback': {
    title: 'months for an upgrade to pay for itself',
    make(r) {
      const price = pick(r, 400, 2400, 100), h = pick(r, 2, 10, 1), v = pick(r, 15, 50, 5);
      const answer = price / (h * v);
      return {
        q: `<p>A tutor can buy a graphics card for <b>${int(price)}</b> (in their currency). It would save about <b>${h} hours a month</b> of waiting, and their hour is worth <b>${v}</b>. After how many <b>months</b> has it paid for itself?</p>`,
        answer, unit: 'months', tol: 0.01,
        hint: 'Find the value saved each month (hours × value of an hour), then divide the price by it.',
        solution: steps(
          `Saved per month: ${h} × ${v} = ${int(h * v)}.`,
          `${int(price)} ÷ ${int(h * v)} = <b>${n(answer)} months</b>.`,
          `${answer <= 24 ? 'Under two years: a reasonable buy if the log shows you hit this wall often.' : 'More than two years: check the free speed-ups first.'}`),
        price, h, v,
      };
    },
    verify: (p) => p.price / p.h / p.v,
  },
  'starter-tier-per-gb': {
    title: 'price per GB of usable fast memory',
    make(r) {
      const cp = pick(r, 400, 600, 10), mp = pick(r, 1100, 1500, 50), mm = [24, 32][pick(r, 0, 1)];
      const mu = macUse(mm), a = cp / 15, b = mp / mu, answer = b / a;
      return {
        q: `<p>Option A: a 16 GB graphics card for <b>${cp}</b>, with about 15 GB usable. Option B: a Mac mini with <b>${mm} GB</b> for <b>${int(mp)}</b>, of which about two thirds is usable for a model. Same currency. How many <b>times</b> as much does option B cost per usable GB?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Price per GB = price ÷ usable GB for each. Then divide B by A.',
        solution: steps(
          `A: ${cp} ÷ 15 = ${n(a)} per GB.`,
          `B: usable ${mm} × 2/3 = ${n(mu)} GB, so ${int(mp)} ÷ ${n(mu)} = ${n(b)} per GB.`,
          `${n(b)} ÷ ${n(a)} = <b>${n(answer)} times</b>. But A needs a desktop PC to go in, and B is a whole computer that fits bigger models, so price per GB is only one part of the choice.`),
        cp, mp, mm,
      };
    },
    verify: (p) => (p.mp * 15) / (macUse(p.mm) * p.cp),
  },
  'enthusiast-tier-speed': {
    title: 'compare two machines on one model',
    make(r) {
      const G = pick(r, 14, 22, 1), a = [936, 1792][pick(r, 0, 1)], b = [256, 273, 270, 614][pick(r, 0, 3)];
      const answer = a / G - b / G;
      return {
        q: `<p>A developer wants a <b>${G} GB</b> model. Machine A reads memory at <b>${a} GB/s</b>, machine B at <b>${b} GB/s</b>. Both hold the model. How many more tokens per second is A's <b>ceiling</b> than B's?</p>`,
        answer, unit: 'tokens per second', tol: 0.01,
        hint: 'Each ceiling is bandwidth ÷ model size. Work out both, then subtract.',
        solution: steps(
          `A: ${a} ÷ ${G} = ${n(a / G)} tokens per second.`,
          `B: ${b} ÷ ${G} = ${n(b / G)} tokens per second.`,
          `Difference: <b>${n(answer)} tokens per second</b>, or ${n(a / b)} times as fast. B may still win on memory size, noise or power.`),
        G, a, b,
      };
    },
    verify: (p) => (p.a - p.b) / p.G,
  },
  'enthusiast-tier-value': {
    title: 'speed for every 1,000 spent',
    make(r) {
      const price = pick(r, 700, 3000, 100), bw = [936, 1792, 270, 614][pick(r, 0, 3)], G = pick(r, 16, 20, 1);
      const answer = (bw / G) / (price / 1000);
      return {
        q: `<p>A machine costs <b>${int(price)}</b> (in your currency) and reads memory at <b>${bw} GB/s</b>. Your model is <b>${G} GB</b>. What is its speed ceiling per 1,000 of price, in <b>tokens per second per 1,000</b>?</p>`,
        answer, unit: 'tokens per second per 1,000', tol: 0.01,
        hint: 'Speed ceiling = bandwidth ÷ model GB. Price in thousands = price ÷ 1,000. Divide the first by the second.',
        solution: steps(
          `Ceiling: ${bw} ÷ ${G} = ${n(bw / G)} tokens per second.`,
          `Price in thousands: ${int(price)} ÷ 1,000 = ${n(price / 1000)}.`,
          `${n(bw / G)} ÷ ${n(price / 1000)} = <b>${n(answer)}</b>. Work this out for each option to compare speed for money, then check that each one fits the model.`),
        price, bw, G,
      };
    },
    verify: (p) => (1000 * p.bw) / (p.G * p.price),
  },
  'unified-memory-boxes-moe': {
    title: 'a big Mixture-of-Experts model on a 128 GB box',
    make(r) {
      const A = [3, 5.1, 12, 17][pick(r, 0, 3)], b = [4.25, 4.5, 5][pick(r, 0, 2)], bw = [256, 273, 614][pick(r, 0, 2)], D = [32, 70][pick(r, 0, 1)];
      const moe = bw / ((A * b) / 8), dense = bw / ((D * b) / 8), answer = moe / dense;
      return {
        q: `<p>On a <b>${bw} GB/s</b> box, compare a Mixture-of-Experts model that reads <b>${A} billion</b> active parameters per token with a dense <b>${D}B</b> model. Both use <b>${b} bits</b> per weight. How many <b>times</b> higher is the MoE model's speed ceiling?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'GB read per token = billions × bits ÷ 8 for each model; ceiling = bandwidth ÷ that. Then divide the two ceilings.',
        solution: steps(
          `MoE: ${A} × ${b} ÷ 8 = ${n(A * b / 8)} GB per token, ceiling ${bw} ÷ ${n(A * b / 8)} = ${n(moe)} tokens per second.`,
          `Dense: ${D} × ${b} ÷ 8 = ${n(D * b / 8)} GB per token, ceiling ${n(dense)} tokens per second.`,
          `${n(moe)} ÷ ${n(dense)} = <b>${n(answer)} times</b> (simply ${D} ÷ ${A}). The bits and the bandwidth cancel out.`),
        A, b, bw, D,
      };
    },
    verify: (p) => p.D / p.A,
  },
  'team-server-busy': {
    title: 'how many people use the server at once',
    make(r) {
      const N = pick(r, 4, 30, 1), pc = pick(r, 2, 15, 1);
      const answer = N * pc / 100;
      return {
        q: `<p>A school office shares one AI machine among <b>${N}</b> staff. Each person keeps the model busy about <b>${pc}%</b> of the working day. On average, how many people are using it <b>at the same moment</b>?</p>`,
        answer, unit: 'people', tol: 0.01,
        hint: 'Expected number busy = number of people × the share of time each one is busy (as a decimal).',
        solution: steps(
          `${pc}% as a decimal is ${pc / 100}.`,
          `${N} × ${pc / 100} = <b>${n(answer)} people</b> on average.`,
          `${answer < 1 ? 'Below 1: most of the time nobody or one person is asking, so one machine that is fast for one person is enough.' : answer <= 2 ? 'Between 1 and 2: there will be short queues at busy times; a serving engine that batches requests helps.' : 'Above 2: plan batching (Module 15) or a second machine.'}`),
        N, pc,
      };
    },
    verify: (p) => (p.pc * p.N) / 100,
  },
  'team-server-idle': {
    title: 'the chance that nobody is waiting',
    make(r) {
      const N = pick(r, 4, 20, 1), pc = pick(r, 2, 10, 1), q = 1 - pc / 100;
      const answer = 100 * q ** N;
      return {
        q: `<p>${N} people share a machine. Each one, independently, is busy with it about <b>${pc}%</b> of the time. At a random moment, what is the chance (in <b>%</b>) that <b>nobody</b> is using it?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'One person is NOT busy with chance 1 − p. Everyone free at once: multiply that chance by itself once per person, (1 − p)^n.',
        solution: steps(
          `One person free: 1 − ${pc / 100} = ${n(q)}.`,
          `All ${N} free: ${n(q)}<sup>${N}</sup> = ${n(q ** N)}.`,
          `= <b>${n(answer)}%</b> of the time the machine is idle. Two or more people at once is rarer still, which is why one machine can serve a whole office.`),
        N, pc,
      };
    },
    verify: (p) => 100 * Math.exp(p.N * Math.log(1 - p.pc / 100)),
  },
  'buying-smart-landed': {
    title: 'the landed price of an imported card',
    make(r) {
      const usd = pick(r, 400, 1200, 50), fx = [0.75, 0.78, 0.8][pick(r, 0, 2)], ship = pick(r, 20, 60, 5), vat = 20, fee = pick(r, 1, 3, 0.5);
      const goods = usd * fx, base = goods + ship, withVat = base * (1 + vat / 100), answer = withVat + goods * fee / 100;
      return {
        q: `<p>Someone in the UK finds a card for <b>US$${usd}</b> on an American website. Take US$1 = £${fx} (an example rate). Shipping is <b>£${ship}</b>, import VAT is <b>${vat}%</b> on the card plus shipping, and the bank charges a <b>${fee}%</b> foreign-card fee on the card price. What is the <b>landed price</b> in pounds?</p>`,
        answer, unit: '£', tol: 0.005,
        hint: 'Convert the price to pounds, add shipping, add 20% VAT on that total, then add the bank fee (a percentage of the converted card price).',
        solution: steps(
          `Card in pounds: ${usd} × ${fx} = ${money(goods, '£')}.`,
          `Plus shipping: ${money(base, '£')}. Plus ${vat}% VAT: ${money(withVat, '£')}.`,
          `Bank fee: ${fee}% of ${money(goods, '£')} = ${money(goods * fee / 100, '£')}. Landed price: <b>${money(answer, '£')}</b>, and the warranty may only work in the USA.`),
        usd, fx, ship, vat, fee,
      };
    },
    verify: (p) => p.usd * p.fx * (1.2 + p.fee / 100) + p.ship * 1.2,
  },
  'buying-smart-expected': {
    title: 'expected cost of a used card with no warranty',
    make(r) {
      const used = pick(r, 500, 900, 50), risk = pick(r, 5, 25, 5), fresh = used + pick(r, 150, 500, 50);
      const answer = used + (risk / 100) * used;
      return {
        q: `<p>A used card costs <b>${used}</b>, has no warranty, and you judge a <b>${risk}%</b> chance it fails in the first year (you would then have to buy it again). A new card with warranty costs <b>${fresh}</b>. What is the <b>expected cost</b> of the used card?</p>`,
        answer, unit: 'in the same currency', tol: 0.005,
        hint: 'Expected cost = price + chance of failure × cost of replacing it.',
        solution: steps(
          `Expected replacement cost: ${risk / 100} × ${used} = ${n(risk / 100 * used)}.`,
          `${used} + ${n(risk / 100 * used)} = <b>${n(answer)}</b>.`,
          `${answer < fresh ? `Still below the new card's ${fresh}, but you carry the risk yourself.` : `Above the new card's ${fresh}: buy new.`}`),
        used, risk, fresh,
      };
    },
    verify: (p) => p.used * (1 + p.risk / 100),
  },
  'memory-shortage-premium': {
    title: 'how far today\'s price is above normal',
    make(r) {
      const med = pick(r, 400, 1200, 10), up = pick(r, -15, 40, 1), now = Math.round(med * (1 + up / 100));
      const answer = (now / med - 1) * 100;
      return {
        q: `<p>A price tracker shows a graphics card's 3-month median price in your country is <b>${int(med)}</b>. Today's lowest price is <b>${int(now)}</b>. What is today's premium over the median, in <b>%</b>? (A negative answer means it is below normal.)</p>`,
        answer, unit: '%', tol: 0, abs: 0.15,
        hint: 'Premium = today ÷ median − 1. Multiply by 100 for a percentage.',
        solution: steps(
          `${int(now)} ÷ ${int(med)} = ${n(now / med, 4)}.`,
          `− 1 = ${n(now / med - 1, 3)}, which is <b>${n(answer, 3)}%</b>.`,
          `${answer > 5 ? 'Above the usual price: set a price alert near the median and wait if you can.' : answer < -3 ? 'Below the usual price: a good time to buy if you need it.' : 'Close to normal: fine to buy if you need it now.'}`),
        med, now,
      };
    },
    verify: (p) => ((p.now - p.med) / p.med) * 100,
  },

  // ---------- Module 6: power, heat and running costs ----------
  'watts-daily-kwh': {
    title: 'energy used in a day',
    make(r) {
      const Ww = pick(r, 150, 500, 10), hw = pick(r, 1, 6, 0.5), Wi = pick(r, 10, 90, 5), hi = pick(r, 2, 12, 1);
      const answer = (Ww * hw + Wi * hi) / 1000;
      return {
        q: `<p>A video editor's PC draws <b>${Ww} W</b> while the model writes, for <b>${hw} hours</b> a day, and <b>${Wi} W</b> while idle with the model loaded, for another <b>${hi} hours</b>. How many <b>kWh</b> does it use in a day?</p>`,
        answer, unit: 'kWh', tol: 0.01,
        hint: 'Energy in watt-hours = watts × hours for each state. Add them and divide by 1,000 for kWh.',
        solution: steps(
          `Writing: ${Ww} × ${hw} = ${int(Ww * hw)} Wh.`,
          `Idle: ${Wi} × ${hi} = ${int(Wi * hi)} Wh.`,
          `Total ${int(Ww * hw + Wi * hi)} Wh ÷ 1,000 = <b>${n(answer)} kWh</b>. ${Wi * hi > Ww * hw ? 'Idle uses more than the work: sleep the machine when you are not using it.' : 'Most of it is the real work.'}`),
        Ww, hw, Wi, hi,
      };
    },
    verify: (p) => p.Ww / 1000 * p.hw + p.Wi / 1000 * p.hi,
  },
  'watts-power-limit': {
    title: 'energy saved by a lower power limit',
    make(r) {
      const W = pick(r, 250, 600, 10), cut = pick(r, 15, 30, 5), h = pick(r, 1, 6, 1), d = pick(r, 20, 30, 1);
      const answer = (W * cut / 100) * h * d / 1000;
      return {
        q: `<p>A PC draws <b>${W} W</b> while writing. You lower the card's power limit so the whole machine draws <b>${cut}%</b> less while writing, and lose only a little speed. It writes <b>${h} hours</b> a day, <b>${d} days</b> a month. How many <b>kWh a month</b> do you save?</p>`,
        answer, unit: 'kWh', tol: 0.01,
        hint: 'Watts saved = watts × the percentage cut. Then watts saved × hours × days ÷ 1,000.',
        solution: steps(
          `Watts saved: ${W} × ${cut / 100} = ${n(W * cut / 100)} W.`,
          `Per month: ${n(W * cut / 100)} × ${h} × ${d} = ${int(W * cut / 100 * h * d)} Wh.`,
          `= <b>${n(answer)} kWh a month</b>, with less heat and quieter fans as a bonus.`),
        W, cut, h, d,
      };
    },
    verify: (p) => p.W * p.h * p.d * p.cut / 1e5,
  },
  'electricity-cost-month': {
    title: 'a month of local AI in money',
    make(r) {
      const W = pick(r, 30, 750, 10), h = pick(r, 1, 8, 1), d = pick(r, 20, 30, 1), c = [['₹', 6.5, 'rupees'], ['CA$', 0.146, 'Canadian dollars'], ['US$', 0.182, 'US dollars'], ['£', 0.2632, 'pounds']][pick(r, 0, 3)];
      const kwh = (W * h * d) / 1000, answer = kwh * c[1];
      return {
        q: `<p>A machine draws <b>${W} W</b> while working, <b>${h} hours</b> a day for <b>${d} days</b> a month. Electricity costs <b>${c[0]}${c[1]} per kWh</b> (an example rate). What does the working time cost per month, in <b>${c[2]}</b>?</p>`,
        answer, unit: c[2], tol: 0.01,
        hint: 'kWh = watts × hours × days ÷ 1,000. Then multiply by the price per kWh.',
        solution: steps(
          `Energy: ${W} × ${h} × ${d} ÷ 1,000 = ${n(kwh)} kWh.`,
          `Cost: ${n(kwh)} × ${c[0]}${c[1]} = <b>${c[0]}${n(answer)}</b> a month.`,
          `Check your own bill's unit rate: it is the official source for you. Standing charges are paid whether or not the machine runs.`),
        W, h, d, rate: c[1],
      };
    },
    verify: (p) => p.W / 1000 * p.rate * p.h * p.d,
  },
  'electricity-cost-overnight': {
    title: 'savings from running a long job overnight',
    make(r) {
      const W = pick(r, 200, 800, 50), h = pick(r, 2, 10, 1), peak = [14.6, 18.9][pick(r, 0, 1)], low = 9.1;
      const kwh = W * h / 1000, answer = kwh * (peak - low) / 100;
      return {
        q: `<p>A researcher in Ontario runs a batch job on a <b>${W} W</b> PC for <b>${h} hours</b>. Time-of-use prices: <b>${peak}¢</b> per kWh in the daytime, <b>${low}¢</b> overnight (example rates; check your own bill). How many <b>dollars</b> does running it overnight save?</p>`,
        answer, unit: 'CA$', tol: 0.01,
        hint: 'Energy in kWh = W × h ÷ 1,000. The saving is that energy × (daytime price − overnight price). Convert cents to dollars.',
        solution: steps(
          `Energy: ${W} × ${h} ÷ 1,000 = ${n(kwh)} kWh.`,
          `Price gap: ${peak} − ${low} = ${n(peak - low)}¢ per kWh.`,
          `${n(kwh)} × ${n(peak - low)}¢ = ${n(kwh * (peak - low))}¢ = <b>CA$${n(answer)}</b> saved. Small for one job, but it adds up for nightly jobs.`),
        W, h, peak, low,
      };
    },
    verify: (p) => (p.W * p.h * p.peak - p.W * p.h * p.low) / 1e5,
  },
  'cooling-and-noise-heat': {
    title: 'heat a machine puts into a room',
    make(r) {
      const W = pick(r, 100, 700, 50), h = pick(r, 1, 10, 1), heater = [500, 750, 1000, 1500][pick(r, 0, 3)];
      const answer = W * h / heater;
      return {
        q: `<p>A PC draws <b>${W} W</b> for <b>${h} hours</b>. Nearly all of that ends up as heat in the room. For how many <b>hours</b> would a <b>${heater} W</b> electric heater have to run to give the same heat?</p>`,
        answer, unit: 'hours', tol: 0.01,
        hint: 'Heat from the PC in Wh = W × h. The heater gives its watts each hour, so divide.',
        solution: steps(
          `PC heat: ${W} × ${h} = ${int(W * h)} Wh (${n(W * h / 1000)} kWh).`,
          `Heater: ${int(W * h)} ÷ ${heater} = <b>${n(answer)} hours</b>.`,
          `In winter that is free heat; in a hot summer the air conditioner must remove it.`),
        W, h, heater,
      };
    },
    verify: (p) => (p.W / p.heater) * p.h,
  },
  'cooling-and-noise-ac': {
    title: 'what the air conditioner pays to remove the heat',
    make(r) {
      const W = pick(r, 200, 600, 50), h = pick(r, 2, 8, 1), cop = [2.5, 3, 3.5, 4][pick(r, 0, 3)], price = pick(r, 5, 9, 0.5);
      const kwh = W * h / 1000, ac = kwh / cop, answer = ac * price;
      return {
        q: `<p>In Chennai in May, a <b>${W} W</b> PC runs for <b>${h} hours</b> in an air-conditioned room. The air conditioner removes about <b>${cop} kWh</b> of heat for every 1 kWh of electricity it uses. Electricity is <b>₹${price}</b> per unit (kWh, an example rate). How many <b>rupees</b> extra does the air conditioner spend removing the PC's heat?</p>`,
        answer, unit: '₹', tol: 0.01,
        hint: 'Heat = PC energy in kWh. Air-conditioner electricity = heat ÷ its efficiency number. Then multiply by the price.',
        solution: steps(
          `Heat from the PC: ${W} × ${h} ÷ 1,000 = ${n(kwh)} kWh.`,
          `Air-conditioner electricity: ${n(kwh)} ÷ ${cop} = ${n(ac)} kWh.`,
          `Cost: ${n(ac)} × ₹${price} = <b>₹${n(answer)}</b>, on top of the PC's own ${n(kwh)} kWh (₹${n(kwh * price)}).`),
        W, h, cop, price,
      };
    },
    verify: (p) => (p.W * p.h * p.price) / (1000 * p.cop),
  },
  'laptops-and-throttling-battery': {
    title: 'hours of AI on one battery charge',
    make(r) {
      const Wh = pick(r, 40, 100, 5), W = pick(r, 15, 45, 1), keep = [0, 10, 20][pick(r, 0, 2)];
      const answer = (Wh * (1 - keep / 100)) / W;
      return {
        q: `<p>A laptop has a <b>${Wh} Wh</b> battery and draws about <b>${W} W</b> while a local model writes. ${keep ? `You want to keep <b>${keep}%</b> of the battery in reserve.` : 'You run it until the battery is empty.'} How many <b>hours</b> of AI use do you get?</p>`,
        answer, unit: 'hours', tol: 0.01,
        hint: 'Hours = watt-hours you can use ÷ watts drawn. Take the reserve off the battery size first.',
        solution: steps(
          `Usable energy: ${Wh} × ${1 - keep / 100} = ${n(Wh * (1 - keep / 100))} Wh.`,
          `${n(Wh * (1 - keep / 100))} ÷ ${W} = <b>${n(answer)} hours</b>.`,
          `On battery, power-saving modes may lower the draw and the speed together, so real numbers vary.`),
        Wh, W, keep,
      };
    },
    verify: (p) => p.Wh / p.W - (p.Wh * p.keep) / (100 * p.W),
  },
  'laptops-and-throttling-tokens': {
    title: 'tokens written when a laptop throttles',
    make(r) {
      const s1 = pick(r, 8, 20, 1), m1 = pick(r, 2, 8, 1), drop = pick(r, 20, 45, 5), T = pick(r, 20, 60, 5);
      const s2 = s1 * (1 - drop / 100), answer = (s1 * m1 + s2 * (T - m1)) * 60;
      return {
        q: `<p>A batch job runs for <b>${T} minutes</b> on a laptop. It writes <b>${s1} tokens per second</b> for the first <b>${m1} minutes</b>, then the chip gets hot and speed drops by <b>${drop}%</b> for the rest of the job. How many <b>tokens</b> does it write in total?</p>`,
        answer, unit: 'tokens', tol: 0.01,
        hint: 'Split the job into two parts. Tokens = speed × seconds for each part (minutes × 60). The throttled speed is the first speed × (1 − drop).',
        solution: steps(
          `Throttled speed: ${s1} × ${1 - drop / 100} = ${n(s2)} tokens per second.`,
          `First part: ${s1} × ${m1 * 60} s = ${int(s1 * m1 * 60)}. Second part: ${n(s2)} × ${(T - m1) * 60} s = ${int(s2 * (T - m1) * 60)}.`,
          `Total: <b>${int(answer)} tokens</b>. Without throttling it would be ${int(s1 * T * 60)}, so cooling and power settings are worth ${int(s1 * T * 60 - answer)} tokens here.`),
        s1, m1, drop, T,
      };
    },
    verify: (p) => 60 * p.s1 * (p.T - (p.T - p.m1) * p.drop / 100),
  },
};
