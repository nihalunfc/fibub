// Live problems for ML foundations, part b (Modules 4-6: classification, trees, ensembles). See ../problems.js.
import { pick, n, steps, table } from './util.js';

const sig = (z) => 1 / (1 + Math.exp(-z));
const pct = (v) => n(v * 100) + ' %';

// ---------- Module 4: classification ----------
const M4 = {
  'classification-threshold': {
    title: 'when is a fraud check worth it?',
    make(r) {
      const miss = pick(r, 200, 900, 50), check = pick(r, 2, 12, 1);
      const answer = (check / miss) * 100;
      return {
        q: `<p>A shop's model gives each card payment a probability of being fraud. A missed fraud costs the shop <b>$${miss}</b>. Sending the customer a "was this you?" text costs <b>$${check}</b> in support time and stops the fraud if there is one. Above what fraud probability is the text worth sending? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Without a text, the expected loss is p × (cost of a missed fraud). With a text, the cost is the fixed text cost. Find the p where the two are equal.',
        solution: steps(
          `Expected loss if you let the payment through: p × $${miss}.`,
          `Cost if you send the text: $${check}, whatever p is.`,
          `They are equal when p × ${miss} = ${check}, so p = ${check} ÷ ${miss} = ${n(check / miss)}.`,
          `So send the text whenever p is above <b>${n(answer)} %</b>. The threshold comes from the costs, not from the model, and it is far below 50 %.`),
        miss, check,
      };
    },
    verify(p) { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; m * p.miss > p.check ? (hi = m) : (lo = m); } return lo * 100; },
  },
  'sigmoid-odds-prob': {
    title: 'from a score to a probability',
    make(r) {
      const w = pick(r, 0.3, 1.2, 0.1), b = pick(r, -6, -2, 0.5), x = pick(r, 2, 10, 1);
      const z = w * x + b, answer = sig(z);
      return {
        q: `<p>A gym's model predicts whether a new member will still be coming after three months from <i>x</i>, the number of visits in their first two weeks: z = ${w}·x ${b < 0 ? '−' : '+'} ${Math.abs(b)}, and p = σ(z) = 1 / (1 + e<sup>−z</sup>). A member made <b>${x}</b> visits. What is p? (Answer as a decimal between 0 and 1.)</p>`,
        answer, unit: '', tol: 0.01, abs: 0.003,
        hint: 'First work out the score z. Then put it through the sigmoid: e to the power −z, add 1, and take one over the result.',
        solution: steps(
          `Score: z = ${w} × ${x} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${n(z)}.`,
          `e<sup>−z</sup> = e<sup>${n(-z)}</sup> = ${n(Math.exp(-z))}.`,
          `p = 1 / (1 + ${n(Math.exp(-z))}) = <b>${n(answer)}</b>, about a ${Math.round(answer * 100)} % chance they keep coming.`),
        z,
      };
    },
    verify: (p) => Math.exp(p.z) / (1 + Math.exp(p.z)),
  },
  'sigmoid-odds-ratio': {
    title: 'a weight multiplies the odds',
    make(r) {
      const w = pick(r, 0.2, 1, 0.05), p0 = pick(r, 0.1, 0.6, 0.05), k = pick(r, 1, 3, 1);
      const o0 = p0 / (1 - p0), o1 = o0 * Math.exp(w * k), answer = (o1 / (1 + o1)) * 100;
      return {
        q: `<p>In a logistic model for whether a customer opens a marketing email, the weight on "emails opened last month" is <b>${w}</b>. A customer who opened none has a probability of <b>${p0}</b> of opening this one. What is the probability for a customer who opened <b>${k}</b> last month, everything else the same? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Turn the probability into odds, p ÷ (1 − p). Each extra email multiplies the odds by e to the power of the weight. Then turn the odds back into a probability, odds ÷ (1 + odds).',
        solution: steps(
          `Odds at the start: ${p0} ÷ ${n(1 - p0)} = ${n(o0)}.`,
          `${k} extra opened email${k > 1 ? 's add' : ' adds'} ${n(w * k)} to the log-odds, so the odds are multiplied by e<sup>${n(w * k)}</sup> = ${n(Math.exp(w * k))}: new odds ${n(o1)}.`,
          `Back to a probability: ${n(o1)} ÷ (1 + ${n(o1)}) = <b>${n(answer)} %</b>.`),
        p0, wk: w * k,
      };
    },
    verify: (p) => sig(Math.log(p.p0 / (1 - p.p0)) + p.wk) * 100,
  },
  'log-loss-mean': {
    title: 'score three forecasts with log-loss',
    make(r) {
      const ps = [pick(r, 0.55, 0.95, 0.05), pick(r, 0.05, 0.4, 0.05), pick(r, 0.3, 0.9, 0.05)];
      const ys = [1, 0, r() < 0.5 ? 0 : 1];
      const ls = ps.map((p, i) => (ys[i] ? -Math.log(p) : -Math.log(1 - p)));
      const answer = (ls[0] + ls[1] + ls[2]) / 3;
      return {
        q: `<p>A model predicts whether three online orders will be returned. ${table(['order', 'model says p(return)', 'returned?'], ps.map((p, i) => [i + 1, p, ys[i] ? 'yes' : 'no']))}<p>What is its mean log-loss (natural log)?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'For a "yes", the loss is −ln p. For a "no", it is −ln(1 − p). Work out all three and take the average.',
        solution: steps(
          ...ls.map((l, i) => `Order ${i + 1}: ${ys[i] ? `returned, so −ln ${ps[i]}` : `kept, so −ln(1 − ${ps[i]}) = −ln ${n(1 - ps[i])}`} = ${n(l)}.`),
          `Mean: (${ls.map((l) => n(l)).join(' + ')}) ÷ 3 = <b>${n(answer)}</b>. The biggest share comes from the order the model was least right about.`),
        ps, ys,
      };
    },
    verify: (p) => -Math.log(p.ps.reduce((a, q, i) => a * (p.ys[i] ? q : 1 - q), 1)) / 3,
  },
  'log-loss-step': {
    title: 'one gradient step for logistic regression',
    make(r) {
      const xs = [pick(r, 1, 3, 1), pick(r, 2, 5, 1), pick(r, 4, 8, 1)];
      const ys = [0, r() < 0.5 ? 0 : 1, 1], lr = pick(r, 0.2, 1, 0.1);
      const g = xs.reduce((a, x, i) => a + (0.5 - ys[i]) * x, 0) / 3, answer = -lr * g;
      return {
        q: `<p>Logistic regression predicts whether a trial user buys, from <i>x</i> = days they used the app. ${table(['user', 'x (days)', 'bought? (y)'], xs.map((x, i) => [i + 1, x, ys[i]]))}<p>Start with w = 0 and b = 0, so every p = σ(0) = 0.5. With learning rate ${lr}, what is <b>w</b> after one gradient-descent step? (Gradient for w: the average of (p − y) × x.)</p>`,
        answer, unit: '', tol: 0.01, abs: 0.002,
        hint: 'Every p is 0.5, so each error p − y is 0.5 for a non-buyer and −0.5 for a buyer. Multiply each error by its x, average, then step against the gradient: w_new = 0 − learning rate × gradient.',
        solution: steps(
          `Errors p − y: ${ys.map((y) => n(0.5 - y)).join(', ')}.`,
          `Error × x: ${xs.map((x, i) => n((0.5 - ys[i]) * x)).join(', ')}. Average: ${n(g)}.`,
          `w = 0 − ${lr} × ${n(g)} = <b>${n(answer)}</b>. ${answer > 0 ? 'Positive: buyers used the app more, so more days should push p up.' : answer < 0 ? 'Negative for now, because two of the three did not buy; more steps will sort it out as b drops.' : 'Zero for now; the bias moves first.'}`),
        xs, ys, lr,
      };
    },
    verify: (p) => { const sx = p.xs.reduce((a, b) => a + b, 0), sy = p.xs.reduce((a, x, i) => a + p.ys[i] * x, 0); return -p.lr * (0.5 * sx - sy) / 3; },
  },
  'decision-boundaries-debt': {
    title: 'where is the boundary for this applicant?',
    make(r) {
      const w1 = pick(r, 1, 2.5, 0.1), w2 = pick(r, 1.5, 3, 0.1), b = pick(r, -0.5, 1, 0.1), x1 = pick(r, -1, 1.5, 0.5);
      const answer = (w1 * x1 + b) / w2;
      return {
        q: `<p>A loan model works on standardised income x₁ and standardised debt x₂ (0 means average, 1 means one standard deviation above): z = ${w1}·x₁ − ${w2}·x₂ ${b < 0 ? '−' : '+'} ${Math.abs(b)}. It predicts "repays" when z ≥ 0. An applicant has x₁ = ${x1}. What is the <b>largest x₂</b> they can have and still be on the "repays" side?</p>`,
        answer, unit: '', tol: 0.01, abs: 0.005,
        hint: 'The boundary is where z = 0. Put in the income, set z to 0 and solve for x₂.',
        solution: steps(
          `Set z = 0: ${w1} × ${x1} − ${w2}·x₂ ${b < 0 ? '−' : '+'} ${Math.abs(b)} = 0.`,
          `${n(w1 * x1 + b)} = ${w2}·x₂, so x₂ = ${n(w1 * x1 + b)} ÷ ${w2} = <b>${n(answer)}</b>.`,
          `More debt than that tips z below zero: the applicant crosses the line to "defaults".`),
        w1, w2, b, x1,
      };
    },
    verify(p) { let lo = -20, hi = 20; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; p.w1 * p.x1 - p.w2 * m + p.b >= 0 ? (lo = m) : (hi = m); } return lo; },
  },
  'confusion-matrix-f1': {
    title: 'precision, recall and F1 from counts',
    make(r) {
      const tp = pick(r, 20, 90, 5), fp = pick(r, 5, 60, 5), fn = pick(r, 5, 60, 5), tn = pick(r, 800, 2000, 50);
      const P = tp / (tp + fp), R = tp / (tp + fn), answer = (2 * P * R) / (P + R);
      return {
        q: `<p>A warehouse model flags parcels likely to arrive damaged. On last month's parcels: ${table(['', 'flagged', 'not flagged'], [['really damaged', `TP = ${tp}`, `FN = ${fn}`], ['fine', `FP = ${fp}`, `TN = ${tn}`]])}<p>What is the model's <b>F1 score</b>? (Answer as a decimal.)</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Precision = TP ÷ (TP + FP). Recall = TP ÷ (TP + FN). F1 = 2 × precision × recall ÷ (precision + recall). TN is not needed.',
        solution: steps(
          `Precision = ${tp} ÷ ${tp + fp} = ${n(P)}: of the flagged parcels, that share were really damaged.`,
          `Recall = ${tp} ÷ ${tp + fn} = ${n(R)}: of the damaged parcels, that share were caught.`,
          `F1 = 2 × ${n(P)} × ${n(R)} ÷ (${n(P)} + ${n(R)}) = <b>${n(answer)}</b>.`,
          `Accuracy would be ${n((tp + tn) / (tp + tn + fp + fn))}, which looks far better because most parcels are fine.`),
        tp, fp, fn,
      };
    },
    verify: (p) => (2 * p.tp) / (2 * p.tp + p.fp + p.fn),
  },
  'confusion-matrix-base-rate': {
    title: 'a good test, a rare condition',
    make(r) {
      const prev = pick(r, 0.5, 5, 0.5), rec = pick(r, 80, 99, 1), spec = pick(r, 90, 99, 1);
      const tp = (prev / 100) * (rec / 100), fp = (1 - prev / 100) * (1 - spec / 100), answer = (tp / (tp + fp)) * 100;
      return {
        q: `<p>A screening test for a condition that <b>${prev} %</b> of people have catches <b>${rec} %</b> of real cases (recall) and correctly clears <b>${spec} %</b> of healthy people (specificity). Someone tests positive. What is the chance they really have the condition (the precision)? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Imagine 10,000 people. Work out how many have the condition and test positive, and how many are healthy but test positive. Precision = true positives ÷ all positives.',
        solution: steps(
          `Of 10,000 people, ${n(prev * 100)} have the condition; ${rec} % of them test positive: ${n(tp * 10000)} true positives.`,
          `${n(10000 - prev * 100)} are healthy; ${n(100 - spec)} % of them wrongly test positive: ${n(fp * 10000)} false positives.`,
          `Precision = ${n(tp * 10000)} ÷ (${n(tp * 10000)} + ${n(fp * 10000)}) = <b>${n(answer)} %</b>. When a condition is rare, false alarms from the many healthy people can outnumber the real cases.`),
        prev, rec, spec,
      };
    },
    verify(p) { const N = 1e6, pos = N * p.prev / 100, t = pos * p.rec / 100, f = (N - pos) * (100 - p.spec) / 100; return 100 * t / (t + f); },
  },
  'roc-auc-pairs': {
    title: 'AUC by counting pairs',
    make(r) {
      const used = new Set(), take = (lo, hi) => { let v = pick(r, lo, hi, 0.05); while (used.has(v)) v = +(v >= hi ? lo : v + 0.05).toFixed(2); used.add(v); return v; };
      const pos = [take(0.5, 0.95), take(0.3, 0.9), take(0.1, 0.7)], neg = [take(0.05, 0.5), take(0.2, 0.8), take(0.4, 0.95)];
      let good = 0; const rows = [];
      for (const a of pos) for (const b of neg) { const g = a > b ? 1 : a === b ? 0.5 : 0; good += g; }
      const answer = good / 9;
      for (const a of pos) rows.push(`positive ${a}: beats ${neg.filter((b) => a > b).length} of 3 negatives`);
      return {
        q: `<p>A churn model scores six customers. Three later left (positives) and three stayed (negatives).</p>${table(['', 'scores'], [['left (positive)', pos.join(', ')], ['stayed (negative)', neg.join(', ')]])}<p>What is the model's AUC?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Make every (positive, negative) pair: 3 × 3 = 9 pairs. Count the pairs where the positive has the higher score. AUC is that count ÷ 9.',
        solution: steps(...rows, `Pairs ordered correctly: ${good} of 9, so AUC = ${good} ÷ 9 = <b>${n(answer)}</b>. A random positive outscores a random negative ${Math.round(answer * 100)} % of the time.`),
        pos, neg,
      };
    },
    verify(p) { // Mann-Whitney: rank sum of the positives
      const all = [...p.pos.map((s) => [s, 1]), ...p.neg.map((s) => [s, 0])].sort((a, b) => a[0] - b[0]);
      let rs = 0; all.forEach(([s, y], i) => { if (y) { const ties = all.map((t, j) => [t, j]).filter(([t]) => t[0] === s).map(([, j]) => j + 1); rs += ties.reduce((a, b) => a + b, 0) / ties.length; } });
      return (rs - 3 * 4 / 2) / 9;
    },
  },
  'k-nearest-neighbours-vote': {
    title: 'a distance-weighted vote',
    make(r) {
      const pts = [[1, 1], [2, 4], [4, 2], [5, 5], [6, 1], [3, 6]];
      const qs = [[3, 3], [4, 4], [2, 2], [5, 3]];
      const q = qs[Math.min(3, Math.floor(r() * 4))];
      const lab = pts.map((_, i) => (i === 0 || r() < 0.5 ? 'buys' : 'skips'));
      lab[1] = lab[1] === lab[2] ? (lab[1] === 'buys' ? 'skips' : 'buys') : lab[1]; // keep the vote interesting
      const d = pts.map(([x, y]) => Math.hypot(x - q[0], y - q[1]));
      const idx = d.map((v, i) => i).sort((a, b) => d[a] - d[b] || a - b).slice(0, 3);
      const wb = idx.filter((i) => lab[i] === 'buys').reduce((a, i) => a + 1 / d[i], 0), wa = idx.reduce((a, i) => a + 1 / d[i], 0);
      const answer = (wb / wa) * 100;
      return {
        q: `<p>A bakery's app guesses whether a customer will buy the new loaf from two scaled features. Six past customers: ${table(['customer', 'position', 'did they?'], pts.map((p, i) => [String.fromCharCode(65 + i), `(${p[0]}, ${p[1]})`, lab[i]]))}<p>A new customer sits at (${q[0]}, ${q[1]}). Using k = 3 and votes weighted by 1 ÷ distance, what share of the vote says <b>buys</b>? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01, abs: 0.05,
        hint: 'Find the straight-line distance to each customer, √(Δx² + Δy²). Keep the 3 closest. Each one\'s vote counts 1 ÷ its distance. Share = weight of "buys" ÷ total weight.',
        solution: steps(
          `Distances: ${d.map((v, i) => `${String.fromCharCode(65 + i)} ${n(v)}`).join(', ')}.`,
          `The 3 nearest: ${idx.map((i) => `${String.fromCharCode(65 + i)} (${lab[i]}, weight ${n(1 / d[i])})`).join(', ')}.`,
          `Share for "buys" = ${n(wb)} ÷ ${n(wa)} = <b>${n(answer)} %</b>.`),
        pts, qp: q, lab,
      };
    },
    verify(p) {
      const ds = p.pts.map(([x, y], i) => [Math.sqrt((x - p.qp[0]) ** 2 + (y - p.qp[1]) ** 2), p.lab[i]]).sort((a, b) => a[0] - b[0]).slice(0, 3);
      return 100 * ds.reduce((a, [dd, l]) => a + (l === 'buys' ? 1 / dd : 0), 0) / ds.reduce((a, [dd]) => a + 1 / dd, 0);
    },
  },
  'naive-bayes-test': {
    title: 'Bayes\' rule for a warning light',
    make(r) {
      const prior = pick(r, 1, 10, 1), hit = pick(r, 80, 98, 2), fa = pick(r, 2, 15, 1);
      const answer = (hit * prior) / (hit * prior + fa * (100 - prior)) * 100;
      return {
        q: `<p>On a delivery van, <b>${prior} %</b> of engines that come in for service have a real fault. A warning light comes on for <b>${hit} %</b> of faulty engines, but also for <b>${fa} %</b> of healthy ones. The light is on. What is the chance the engine has a real fault? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Bayes\' rule: P(fault | light) = P(light | fault) × P(fault) ÷ P(light), where P(light) adds up the faulty and the healthy engines that light up.',
        solution: steps(
          `Faulty and light on: ${hit / 100} × ${prior / 100} = ${n((hit * prior) / 1e4)}.`,
          `Healthy and light on: ${fa / 100} × ${n(1 - prior / 100)} = ${n((fa * (100 - prior)) / 1e4)}.`,
          `P(fault | light) = ${n((hit * prior) / 1e4)} ÷ (${n((hit * prior) / 1e4)} + ${n((fa * (100 - prior)) / 1e4)}) = <b>${n(answer)} %</b>.`),
        prior, hit, fa,
      };
    },
    verify(p) { const odds = (p.prior / (100 - p.prior)) * (p.hit / p.fa); return (100 * odds) / (1 + odds); },
  },
  'naive-bayes-spam': {
    title: 'a two-word spam filter',
    make(r) {
      const ns = pick(r, 300, 600, 50), nn = pick(r, 600, 1200, 100), V = 1000, ps = pick(r, 0.2, 0.5, 0.05);
      const a1 = pick(r, 10, 30, 1), a2 = pick(r, 0, 3, 1), b1 = pick(r, 1, 6, 1), b2 = pick(r, 10, 40, 1);
      const L = (c, N) => (c + 1) / (N + V);
      const s = ps * L(a1, ns) * L(b1, ns), m = (1 - ps) * L(a2, nn) * L(b2, nn), answer = (s / (s + m)) * 100;
      return {
        q: `<p>A tiny spam filter was trained on emails: ${Math.round(ps * 100)} % were spam. Spam emails held ${ns} words in total, normal ones ${nn}; the vocabulary has ${V} different words. ${table(['word', 'times in spam', 'times in normal'], [['"winner"', a1, a2], ['"invoice"', b1, b2]])}<p>Using naive Bayes with add-one smoothing, P(word | class) = (count + 1) ÷ (words in class + ${V}), what is the chance the email "winner invoice" is spam? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'For each class multiply: prior × P(winner | class) × P(invoice | class). Then spam share = spam product ÷ (spam product + normal product).',
        solution: steps(
          `Spam: P(winner) = ${a1 + 1}/${ns + V} = ${n(L(a1, ns))}, P(invoice) = ${b1 + 1}/${ns + V} = ${n(L(b1, ns))}. Product with prior ${ps}: ${n(s)}.`,
          `Normal: P(winner) = ${a2 + 1}/${nn + V} = ${n(L(a2, nn))}, P(invoice) = ${b2 + 1}/${nn + V} = ${n(L(b2, nn))}. Product with prior ${n(1 - ps)}: ${n(m)}.`,
          `P(spam) = ${n(s)} ÷ (${n(s)} + ${n(m)}) = <b>${n(answer)} %</b>.`),
        ns, nn, V, ps, a1, a2, b1, b2,
      };
    },
    verify(p) { // in log space, as real filters do
      const ls = Math.log(p.ps) + Math.log((p.a1 + 1) / (p.ns + p.V)) + Math.log((p.b1 + 1) / (p.ns + p.V));
      const lm = Math.log(1 - p.ps) + Math.log((p.a2 + 1) / (p.nn + p.V)) + Math.log((p.b2 + 1) / (p.nn + p.V));
      return 100 / (1 + Math.exp(lm - ls));
    },
  },
};

export default { ...M4 };
