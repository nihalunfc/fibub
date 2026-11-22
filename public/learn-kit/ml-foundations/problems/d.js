// Live problems for ML foundations, part d: Module 10 (text to LLMs) and Module 11 (putting it together).
// See ../problems.js. Each make(rand) returns { q, answer, unit, tol, hint, solution } plus its inputs;
// verify(p) works the answer out another way for tests/ml-kit.mjs.
import { pick, n, steps, table } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const dotp = (a, b) => sum(a.map((v, i) => v * b[i]));
const len = (a) => Math.sqrt(dotp(a, a));

export default {
  // ---------- 10.1 Text as numbers ----------
  'text-as-numbers-tfidf': {
    title: 'TF-IDF of one word in a support ticket',
    make(r) {
      const N = pick(r, 20, 200, 10), df = pick(r, 2, 10, 1), c = pick(r, 1, 5, 1);
      const idf = Math.log(N / df), answer = c * idf;
      return {
        q: `<p>A shop has ${N} support tickets. The word "refund" appears in ${df} of them. In one ticket it appears ${c} time${c > 1 ? 's' : ''}. What is the TF-IDF of "refund" in that ticket? (Use the natural logarithm, ln.)</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'TF is the count in this ticket. IDF is ln(number of tickets ÷ tickets that contain the word). Multiply them.',
        solution: steps(
          `TF = ${c} (how often "refund" is in this ticket).`,
          `IDF = ln(${N} ÷ ${df}) = ln(${n(N / df)}) = ${n(idf, 4)}. The word is fairly rare, so its weight is high.`,
          `TF-IDF = ${c} × ${n(idf, 4)} = <b>${n(answer, 4)}</b>.`),
        N, df, c,
      };
    },
    verify: (p) => p.c * (Math.log(p.N) - Math.log(p.df)),
  },
  'text-as-numbers-cosine': {
    title: 'cosine similarity of two reviews',
    make(r) {
      const a = [pick(r, 0, 3), pick(r, 1, 3), pick(r, 0, 2)], b = [pick(r, 1, 3), pick(r, 0, 2), pick(r, 1, 3)];
      const d = dotp(a, b), la = len(a), lb = len(b), answer = d / (la * lb);
      return {
        q: `<p>Two short reviews are turned into counts of three words:</p>${table(['', 'battery', 'slow', 'charger'], [['Review A', ...a], ['Review B', ...b]])}<p>What is the cosine similarity of the two rows? (0 = nothing in common, 1 = the same mix of words.)</p>`,
        answer, unit: '', tol: 0.01, abs: 0.005,
        hint: 'Multiply the two rows place by place and add (the dot product). Divide by the length of each row: the square root of the sum of its squares.',
        solution: steps(
          `Dot product: ${a.map((v, i) => `${v}×${b[i]}`).join(' + ')} = ${d}.`,
          `Length of A = √(${a.map((v) => v * v).join(' + ')}) = ${n(la, 4)}; length of B = √(${b.map((v) => v * v).join(' + ')}) = ${n(lb, 4)}.`,
          `Cosine = ${d} ÷ (${n(la, 4)} × ${n(lb, 4)}) = <b>${n(answer, 3)}</b>.`),
        a, b,
      };
    },
    verify: (p) => { const u = p.a.map((v) => v / len(p.a)), w = p.b.map((v) => v / len(p.b)); return dotp(u, w); },
  },

  // ---------- 10.2 Embeddings ----------
  'embeddings-cosine': {
    title: 'does this review match the search?',
    make(r) {
      const q = [pick(r, 1, 3), pick(r, 0, 2), pick(r, 1, 3)], v = [pick(r, 1, 3), pick(r, 0, 3), pick(r, 0, 2)];
      const d = dotp(q, v), answer = d / (len(q) * len(v));
      return {
        q: `<p>A search box turns the query "battery lasts long" into the embedding (${q.join(', ')}) and a review into (${v.join(', ')}). Real embeddings have hundreds of numbers; these have three. What is their cosine similarity?</p>`,
        answer, unit: '', tol: 0.01, abs: 0.005,
        hint: 'Cosine = (dot product) ÷ (length × length). The length of a vector is the square root of the sum of its squares.',
        solution: steps(
          `Dot product: ${q.map((x, i) => `${x}×${v[i]}`).join(' + ')} = ${d}.`,
          `Lengths: √${dotp(q, q)} = ${n(len(q), 4)} and √${dotp(v, v)} = ${n(len(v), 4)}.`,
          `Cosine = ${d} ÷ ${n(len(q) * len(v), 4)} = <b>${n(answer, 3)}</b>. ${answer > 0.85 ? 'A close match: the search would show this review near the top.' : 'A loose match: other reviews would probably rank higher.'}`),
        qv: q, v,
      };
    },
    verify: (p) => { const ang = (a, b) => Math.acos(Math.min(1, dotp(a, b) / (len(a) * len(b)))); return Math.cos(ang(p.qv, p.v)); },
  },
  'embeddings-table-size': {
    title: 'how big is an embedding table?',
    make(r) {
      const V = pick(r, 30000, 150000, 10000), d = pick(r, 256, 4096, 256), bytes = r() < 0.5 ? 2 : 4;
      const answer = (V * d * bytes) / 1e6;
      return {
        q: `<p>A language model has a vocabulary of ${V.toLocaleString('en-CA')} tokens and gives each one ${d.toLocaleString('en-CA')} numbers. Each number takes ${bytes} bytes. How many <b>megabytes</b> (millions of bytes) does the embedding table need?</p>`,
        answer, unit: 'MB', tol: 0.01,
        hint: 'The table has one row per token and one column per number: rows × columns numbers, each taking the given number of bytes.',
        solution: steps(
          `Numbers in the table: ${V.toLocaleString('en-CA')} × ${d.toLocaleString('en-CA')} = ${n(V * d, 4)}.`,
          `Bytes: ${n(V * d, 4)} × ${bytes} = ${n(V * d * bytes, 4)}.`,
          `In megabytes: ÷ 1,000,000 = <b>${n(answer, 4)} MB</b>. That's only the first layer; the blocks hold far more.`),
        V, d, bytes,
      };
    },
    verify: (p) => (p.V / 1000) * (p.d / 1000) * p.bytes,
  },

  // ---------- 10.3 Next word ----------
  'next-word-bigram': {
    title: 'probability of a sentence from word pairs',
    make(r) {
      const s = pick(r, 10, 20), a = pick(r, 6, s - 1), t = pick(r, 15, 30), b = pick(r, 2, 8), c = pick(r, 4, 10), e = pick(r, 1, 3);
      const answer = (a / s) * (b / t) * (e / c);
      return {
        q: `<p>A bigram model is built from ${s} sentences of café orders. ${a} of them start with "a". "a" appears ${t} times and is followed by "large" ${b} times. "large" appears ${c} times and is followed by "coffee" ${e} time${e > 1 ? 's' : ''}. What probability does the model give the sentence start "a large coffee"?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Each word\'s probability is (times this pair appears) ÷ (times the word before appears). Multiply the three probabilities together.',
        solution: steps(
          `P(a | start) = ${a}/${s} = ${n(a / s, 4)}.`,
          `P(large | a) = ${b}/${t} = ${n(b / t, 4)}.`,
          `P(coffee | large) = ${e}/${c} = ${n(e / c, 4)}.`,
          `Multiply: ${n(a / s, 4)} × ${n(b / t, 4)} × ${n(e / c, 4)} = <b>${n(answer, 3)}</b>.`),
        s, a, t, b, c, e,
      };
    },
    verify: (p) => Math.exp(Math.log(p.a) + Math.log(p.b) + Math.log(p.e) - Math.log(p.s) - Math.log(p.t) - Math.log(p.c)),
  },
  'next-word-perplexity': {
    title: 'loss and perplexity on three words',
    make(r) {
      const ps = [pick(r, 0.1, 0.9, 0.05), pick(r, 0.05, 0.6, 0.05), pick(r, 0.2, 0.9, 0.1)];
      const L = sum(ps.map((p) => -Math.log(p))) / 3, answer = Math.exp(L);
      return {
        q: `<p>A phone keyboard model gives the word the person really typed next these probabilities: ${ps.join(', ')}. What is its <b>perplexity</b> on these three words?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'The loss for each word is −ln p. Average the three losses, then raise e to that average.',
        solution: steps(
          `Losses: ${ps.map((p) => `−ln ${p} = ${n(-Math.log(p), 4)}`).join('; ')}.`,
          `Mean loss = ${n(L, 4)}.`,
          `Perplexity = e<sup>${n(L, 4)}</sup> = <b>${n(answer, 3)}</b>: the model is as unsure as if it picked fairly among about ${Math.round(answer)} words.`),
        ps,
      };
    },
    verify: (p) => 1 / Math.cbrt(p.ps[0] * p.ps[1] * p.ps[2]),
  },

  // ---------- 10.4 Attention ----------
  'attention-weight': {
    title: 'one attention weight by hand',
    make(r) {
      const q = [pick(r, 1, 2), pick(r, 0, 1)], ks = [[pick(r, 1, 3), pick(r, 0, 1)], [pick(r, 0, 1), pick(r, 1, 3)], [pick(r, 0, 2), pick(r, 0, 2)]];
      const sc = ks.map((k) => dotp(q, k) / Math.SQRT2), ex = sc.map(Math.exp), answer = ex[0] / sum(ex);
      return {
        q: `<p>In "the dog chased the ball", the word "chased" has query q = (${q.join(', ')}). Three words offer keys: dog (${ks[0].join(', ')}), ball (${ks[1].join(', ')}) and the (${ks[2].join(', ')}). Each key has d = 2 numbers. What attention weight does "chased" give to "dog"?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Score = (q · k) ÷ √2 for each word. Take e to each score, then divide dog\'s by the total.',
        solution: steps(
          `Dot products: dog ${dotp(q, ks[0])}, ball ${dotp(q, ks[1])}, the ${dotp(q, ks[2])}.`,
          `Divide by √2 = 1.414: scores ${sc.map((s) => n(s, 3)).join(', ')}.`,
          `e<sup>score</sup>: ${ex.map((v) => n(v, 4)).join(', ')}; total ${n(sum(ex), 4)}.`,
          `Weight on dog = ${n(ex[0], 4)} ÷ ${n(sum(ex), 4)} = <b>${n(answer, 3)}</b>.`),
        qv: q, ks,
      };
    },
    verify: (p) => { const s = p.ks.map((k) => dotp(p.qv, k) / Math.SQRT2); return 1 / (1 + Math.exp(s[1] - s[0]) + Math.exp(s[2] - s[0])); },
  },
  'attention-cost': {
    title: 'how much more work is a longer context?',
    make(r) {
      const a = pick(r, 2, 16, 2) * 1000, k = pick(r, 2, 8, 1), b = a * k, answer = k * k;
      return {
        q: `<p>A chatbot's context grows from ${a.toLocaleString('en-CA')} tokens to ${b.toLocaleString('en-CA')} tokens. Every token scores every token in attention. How many times more attention scores are needed?</p>`,
        answer, unit: 'times', tol: 0.001,
        hint: 'With n tokens there are n × n scores. Work out how many times longer the context is, then square it.',
        solution: steps(
          `The context is ${b.toLocaleString('en-CA')} ÷ ${a.toLocaleString('en-CA')} = ${k} times longer.`,
          `Scores grow as n², so the work grows by ${k}² = <b>${answer}</b> times.`),
        a, b,
      };
    },
    verify: (p) => (p.b * p.b) / (p.a * p.a),
  },

  // ---------- 10.5 Transformer block ----------
  'transformer-block-params': {
    title: 'count the weights in a small model',
    make(r) {
      const d = pick(r, 256, 2048, 256), N = pick(r, 4, 24, 2), V = pick(r, 20000, 60000, 5000);
      const blocks = 12 * d * d * N, emb = V * d, answer = (blocks + emb) / 1e6;
      return {
        q: `<p>A small model has width d = ${d.toLocaleString('en-CA')}, ${N} transformer blocks and a vocabulary of ${V.toLocaleString('en-CA')}. Using 12d² weights per block plus a V × d embedding table, about how many <b>million</b> parameters does it have?</p>`,
        answer, unit: 'million', tol: 0.01,
        hint: 'One block: 12 × d × d. Multiply by the number of blocks. Then add the embedding table, V × d.',
        solution: steps(
          `One block: 12 × ${d}² = ${n(12 * d * d, 4)}.`,
          `${N} blocks: ${n(blocks, 4)}.`,
          `Embedding table: ${V.toLocaleString('en-CA')} × ${d} = ${n(emb, 4)}.`,
          `Total ≈ ${n(blocks + emb, 4)}, that is <b>${n(answer, 4)} million</b>.`),
        d, N, V,
      };
    },
    verify: (p) => (p.d * (12 * p.d * p.N + p.V)) / 1e6,
  },
  'transformer-block-layernorm': {
    title: 'normalise one token\'s vector',
    make(r) {
      const x = [pick(r, -2, 2), pick(r, 0, 4), pick(r, 1, 5), pick(r, 5, 9)];
      const mu = sum(x) / 4, sd = Math.sqrt(sum(x.map((v) => (v - mu) ** 2)) / 4), answer = (x[3] - mu) / sd;
      return {
        q: `<p>Layer normalisation rescales one token's vector to mean 0 and spread 1. The vector is (${x.join(', ')}). What does its last number, ${x[3]}, become? (Use the plain standard deviation: divide by 4, not 3.)</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Find the mean of the four numbers. Find the standard deviation: the square root of the average squared gap from the mean. Then (number − mean) ÷ standard deviation.',
        solution: steps(
          `Mean = (${x.join(' + ')}) ÷ 4 = ${n(mu, 4)}.`,
          `Squared gaps: ${x.map((v) => n((v - mu) ** 2, 4)).join(', ')}; average ${n(sd * sd, 4)}; standard deviation ${n(sd, 4)}.`,
          `(${x[3]} − ${n(mu, 4)}) ÷ ${n(sd, 4)} = <b>${n(answer, 3)}</b>.`),
        x,
      };
    },
    verify: (p) => { const m = sum(p.x) / 4, v = sum(p.x.map((a) => a * a)) / 4 - m * m; return (p.x[3] - m) / Math.sqrt(v); },
  },

  // ---------- 10.6 Training an LLM ----------
  'training-an-llm-compute': {
    title: 'how long does pretraining take?',
    make(r) {
      const N = pick(r, 1, 70, 1), D = pick(r, 1, 15, 1), G = pick(r, 256, 4096, 256), R = pick(r, 2, 6, 1);
      const C = 6 * N * 1e9 * D * 1e12, answer = C / (G * R * 1e14) / 86400;
      return {
        q: `<p>A lab trains a model with ${N} billion parameters on ${D} trillion tokens. It has ${G.toLocaleString('en-CA')} graphics cards, each doing about ${R} × 10<sup>14</sup> operations a second in practice. Using C ≈ 6ND, about how many <b>days</b> does pretraining take?</p>`,
        answer, unit: 'days', tol: 0.02,
        hint: 'Work out C = 6 × N × D operations. Divide by the operations all the cards do together each second to get seconds, then divide by 86,400 seconds in a day.',
        solution: steps(
          `C = 6 × ${N} × 10<sup>9</sup> × ${D} × 10<sup>12</sup> = ${n(C)} operations.`,
          `All cards together: ${G.toLocaleString('en-CA')} × ${R} × 10<sup>14</sup> = ${n(G * R * 1e14)} operations a second.`,
          `Time = ${n(C)} ÷ ${n(G * R * 1e14)} = ${n(C / (G * R * 1e14))} seconds.`,
          `÷ 86,400 = <b>${n(answer)} days</b>, before any restarts or experiments.`),
        N, D, G, R,
      };
    },
    verify: (p) => (6 * p.N * p.D * 1e7) / (p.G * p.R * 86400) ,
  },
  'training-an-llm-perplexity': {
    title: 'what a drop in loss means',
    make(r) {
      const a = pick(r, 2.2, 3.4, 0.1), b = +(a - pick(r, 0.2, 0.8, 0.1)).toFixed(1);
      const answer = Math.exp(b);
      return {
        q: `<p>During pretraining, the loss on held-out text falls from ${a} to ${b}. What is the new <b>perplexity</b>? (It was e<sup>${a}</sup> = ${n(Math.exp(a), 3)}.)</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Perplexity is e raised to the loss.',
        solution: steps(
          `Perplexity = e<sup>loss</sup> = e<sup>${b}</sup> = <b>${n(answer, 3)}</b>.`,
          `Before it was ${n(Math.exp(a), 3)}, so the model's uncertainty shrank by a factor of ${n(Math.exp(a - b), 3)}: like choosing among about ${Math.round(answer)} tokens instead of ${Math.round(Math.exp(a))}.`),
        a, b,
      };
    },
    verify: (p) => Math.exp(p.a) / Math.exp(p.a - p.b),
  },

  // ---------- 10.7 What an LLM is ----------
  'what-is-an-llm-errors': {
    title: 'chance of at least one wrong fact',
    make(r) {
      const right = pick(r, 95, 99.5, 0.5), k = pick(r, 10, 60, 5);
      const answer = (1 - (right / 100) ** k) * 100;
      return {
        q: `<p>An assistant gets each fact right ${right} % of the time, independently. It writes a briefing with ${k} facts. What is the chance, in %, that the briefing contains <b>at least one</b> wrong fact?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'First find the chance that every fact is right: (right rate) to the power of the number of facts. At least one error is everything else.',
        solution: steps(
          `All ${k} right: ${right / 100}<sup>${k}</sup> = ${n((right / 100) ** k, 4)}.`,
          `At least one wrong: 1 − ${n((right / 100) ** k, 4)} = ${n(1 - (right / 100) ** k, 4)}.`,
          `That is <b>${n(answer, 3)} %</b>. Small error rates add up, so check the facts that matter.`),
        right, k,
      };
    },
    verify: (p) => (1 - Math.exp(p.k * Math.log(p.right / 100))) * 100,
  },
  'what-is-an-llm-temperature': {
    title: 'what lowering the temperature does',
    make(r) {
      const a = pick(r, 0.4, 0.7, 0.05), b = +pick(r, 0.15, Math.min(0.4, 0.95 - a), 0.05).toFixed(2), c = +(1 - a - b).toFixed(2);
      const answer = (a * a) / (a * a + b * b + c * c);
      return {
        q: `<p>For the next word after "The meeting is on", a model gives Monday ${a}, Tuesday ${b} and all others ${c}. At temperature 0.5 each probability is squared and the results are rescaled to add up to 1. What is the new probability of Monday?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Temperature 0.5 means p<sup>1/0.5</sup> = p². Square all three, add them, and divide Monday\'s square by the total.',
        solution: steps(
          `Squares: ${a}² = ${n(a * a, 4)}, ${b}² = ${n(b * b, 4)}, ${c}² = ${n(c * c, 4)}.`,
          `Total = ${n(a * a + b * b + c * c, 4)}.`,
          `Monday: ${n(a * a, 4)} ÷ ${n(a * a + b * b + c * c, 4)} = <b>${n(answer, 3)}</b>. The top word gets likelier, but only the meeting invite in the prompt can make it certain.`),
        a, b, c,
      };
    },
    verify: (p) => 1 / (1 + (p.b / p.a) ** 2 + (p.c / p.a) ** 2),
  },

  // ---------- 11.1 Capstone ----------
  'capstone-mae': {
    title: 'mean absolute error of a sales forecast',
    make(r) {
      const errs = Array.from({ length: 5 }, () => pick(r, 5, 45, 5) * (r() < 0.5 ? -1 : 1));
      const answer = sum(errs.map(Math.abs)) / 5;
      const actual = errs.map((e, i) => 300 + 20 * i), pred = actual.map((a, i) => a - errs[i]);
      return {
        q: `<p>A bakery's model forecast five test days it never saw:</p>${table(['day', 'actual sales', 'forecast'], actual.map((a, i) => [i + 1, a, pred[i]]))}<p>What is the mean absolute error (MAE), in sales a day?</p>`,
        answer, unit: 'sales', tol: 0.001,
        hint: 'For each day, take actual − forecast and drop the minus sign. Add the five misses and divide by 5.',
        solution: steps(
          `Misses: ${errs.map((e) => Math.abs(e)).join(', ')}.`,
          `Total = ${sum(errs.map(Math.abs))}.`,
          `MAE = ${sum(errs.map(Math.abs))} ÷ 5 = <b>${n(answer)}</b> sales a day. The owner can read that directly: "we miss by about ${Math.round(answer)} a day".`),
        actual, pred,
      };
    },
    verify: (p) => sum(p.actual.map((a, i) => Math.sqrt((a - p.pred[i]) ** 2))) / p.actual.length,
  },
  'capstone-skill': {
    title: 'how much better than the baseline?',
    make(r) {
      const base = pick(r, 60, 120, 2), model = pick(r, 20, 50, 1);
      const answer = ((base - model) / base) * 100;
      return {
        q: `<p>On the held-out days, guessing the training average misses by ${base} sales a day (MAE). A random forest misses by ${model}. By what <b>percentage</b> does the forest cut the baseline's error?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Find how much smaller the forest\'s error is, then divide by the baseline\'s error and multiply by 100.',
        solution: steps(
          `Error saved: ${base} − ${model} = ${base - model} sales a day.`,
          `As a share of the baseline: ${base - model} ÷ ${base} = ${n((base - model) / base, 4)}.`,
          `That is <b>${n(answer, 3)} %</b> less error than guessing the average.`),
        base, model,
      };
    },
    verify: (p) => 100 - (100 * p.model) / p.base,
  },

  // ---------- 11.2 Which model when ----------
  'which-model-when-se': {
    title: 'the one-standard-error limit',
    make(r) {
      const k = [5, 10][Math.floor(r() * 2)], e = pick(r, 0.10, 0.25, 0.005), s = pick(r, 0.01, 0.04, 0.005);
      const se = s / Math.sqrt(k), answer = e + se;
      return {
        q: `<p>A team compares models for spotting late deliveries with ${k}-fold cross-validation. The best model has mean error ${e} with a standard deviation of ${s} across the folds. Under the one-standard-error rule, what is the highest mean error a simpler model may have and still be chosen?</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Standard error = fold standard deviation ÷ √(number of folds). The limit is the best mean error plus one standard error.',
        solution: steps(
          `SE = ${s} ÷ √${k} = ${s} ÷ ${n(Math.sqrt(k), 4)} = ${n(se, 3)}.`,
          `Limit = ${e} + ${n(se, 3)} = <b>${n(answer, 4)}</b>.`,
          'Any simpler model at or under this limit is as good within chance, so take the simplest one.'),
        k, e, s,
      };
    },
    verify: (p) => p.e + Math.sqrt((p.s * p.s) / p.k),
  },

  // ---------- 11.3 Next steps ----------
  'next-steps-baseline': {
    title: 'score a "same week last year" baseline',
    make(r) {
      const now = Array.from({ length: 4 }, () => pick(r, 20, 45));
      const last = now.map((v) => v + pick(r, -8, 8));
      const answer = sum(now.map((v, i) => Math.abs(v - last[i]))) / 4;
      return {
        q: `<p>For a running club project, the baseline guess for each week is "the same as this week last year". Here are four test weeks:</p>${table(['week', 'runners this year', 'same week last year'], now.map((v, i) => [i + 1, v, last[i]]))}<p>What is the baseline's mean absolute error, in runners a week? Any model you build must beat it.</p>`,
        answer, unit: 'runners', tol: 0.001, abs: 0.01,
        hint: 'For each week, the miss is the gap between this year and last year, with no minus sign. Average the four misses.',
        solution: steps(
          `Misses: ${now.map((v, i) => Math.abs(v - last[i])).join(', ')}.`,
          `Total ${sum(now.map((v, i) => Math.abs(v - last[i])))}, divided by 4 = <b>${n(answer)}</b> runners a week.`),
        now, last,
      };
    },
    verify: (p) => sum(p.now.map((v, i) => Math.max(v - p.last[i], p.last[i] - v))) / 4,
  },
};
