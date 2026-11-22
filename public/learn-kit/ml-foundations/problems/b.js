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


// ---------- Module 5: trees ----------
const gini = (cs) => { const t = cs.reduce((a, b) => a + b, 0); return 1 - cs.reduce((a, c) => a + (c / t) ** 2, 0); };
const H2 = (p) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const vari = (v) => { const m = mean(v); return mean(v.map((x) => (x - m) ** 2)); };
const M5 = {
  'how-trees-decide-leaf': {
    title: 'follow a loan tree to its leaf',
    make(r) {
      const t1 = pick(r, 35, 50, 5), t2 = pick(r, 8, 16, 2);
      const L = [[pick(r, 10, 20, 1), pick(r, 2, 6, 1)], [pick(r, 1, 4, 1), pick(r, 14, 24, 1)], [pick(r, 6, 12, 1), pick(r, 4, 10, 1)]];
      const inc = pick(r, 25, 70, 5), debt = pick(r, 4, 24, 2);
      const leaf = inc <= t1 ? 0 : debt <= t2 ? 1 : 2, [ref, ok] = L[leaf], answer = (ok / (ref + ok)) * 100;
      const path = inc <= t1 ? `Income ${inc} ≤ ${t1}? Yes, so straight to leaf A.` : `Income ${inc} ≤ ${t1}? No. Debt ${debt} ≤ ${t2}? ${debt <= t2 ? 'Yes: leaf B.' : 'No: leaf C.'}`;
      return {
        q: `<p>A bank's decision tree (amounts in thousands of dollars):</p><ul><li>Income ≤ ${t1}? <b>Yes:</b> leaf A, ${L[0][0]} refused and ${L[0][1]} approved.</li><li><b>No:</b> Debt ≤ ${t2}? <b>Yes:</b> leaf B, ${L[1][0]} refused and ${L[1][1]} approved. <b>No:</b> leaf C, ${L[2][0]} refused and ${L[2][1]} approved.</li></ul><p>An applicant has income ${inc} and debt ${debt}. What probability of approval does the tree give? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Start at the top and answer each question with the applicant\'s numbers. The probability is the share of approved rows in the leaf you land in.',
        solution: steps(path, `That leaf holds ${ref} refused and ${ok} approved: ${ok} ÷ ${ref + ok} = <b>${n(answer)} %</b>.`),
        t1, t2, L, inc, debt,
      };
    },
    verify(p) { const rules = [[(i) => i <= p.t1, 0], [(i, d) => i > p.t1 && d <= p.t2, 1], [(i, d) => i > p.t1 && d > p.t2, 2]]; const k = rules.find(([f]) => f(p.inc, p.debt))[1]; return 100 * p.L[k][1] / (p.L[k][0] + p.L[k][1]); },
  },
  'gini-entropy-gini': {
    title: 'Gini impurity of a support queue',
    make(r) {
      const cs = [pick(r, 2, 12, 1), pick(r, 1, 10, 1), pick(r, 0, 6, 1)], t = cs[0] + cs[1] + cs[2];
      const answer = gini(cs);
      return {
        q: `<p>A node of a tree that routes support tickets holds ${cs[0]} billing, ${cs[1]} technical and ${cs[2]} delivery tickets. What is its Gini impurity?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Find each class\'s share of the node. Gini = 1 − (sum of the squared shares).',
        solution: steps(
          `${t} tickets: shares ${cs.map((c) => `${c}/${t} = ${n(c / t)}`).join(', ')}.`,
          `Squares: ${cs.map((c) => n((c / t) ** 2)).join(' + ')} = ${n(1 - answer)}.`,
          `Gini = 1 − ${n(1 - answer)} = <b>${n(answer)}</b>. That is the chance that two tickets drawn at random (with replacement) are of different kinds.`),
        cs,
      };
    },
    verify(p) { let dis = 0, all = 0; const lab = p.cs.flatMap((c, k) => Array(c).fill(k)); for (const a of lab) for (const b of lab) { all++; if (a !== b) dis++; } return dis / all; },
  },
  'gini-entropy-entropy': {
    title: 'entropy in bits',
    make(r) {
      const a = pick(r, 1, 15, 1), b = pick(r, 1, 15, 1), p = a / (a + b), answer = H2(p);
      return {
        q: `<p>A leaf of a churn tree holds ${a} customers who left and ${b} who stayed. What is its entropy, in bits (log base 2)?</p>`,
        answer, unit: 'bits', tol: 0.01,
        hint: 'With shares p and 1 − p, entropy = −p·log₂ p − (1 − p)·log₂(1 − p). log₂ x = ln x ÷ ln 2.',
        solution: steps(
          `Shares: p = ${a}/${a + b} = ${n(p)}, 1 − p = ${n(1 - p)}.`,
          `−${n(p)} × log₂ ${n(p)} = ${n(-p * Math.log2(p))}; −${n(1 - p)} × log₂ ${n(1 - p)} = ${n(-(1 - p) * Math.log2(1 - p))}.`,
          `Entropy = <b>${n(answer)} bits</b> (1 bit would be a perfect 50/50 mix, 0 a pure leaf).`),
        a, b,
      };
    },
    verify: (p) => { const t = p.a + p.b; return (-p.a * Math.log(p.a / t) - p.b * Math.log(p.b / t)) / (t * Math.LN2); },
  },
  'information-gain-split': {
    title: 'the Gini gain of a split',
    make(r) {
      const lA = pick(r, 1, 9, 1), lB = pick(r, 0, 6, 1), rA = pick(r, 0, 6, 1), rB = pick(r, 2, 10, 1);
      const pa = gini([lA + rA, lB + rB]), nl = lA + lB, nr = rA + rB, N = nl + nr;
      const gl = gini([lA, lB]), gr = gini([rA, rB]), answer = pa - (nl / N) * gl - (nr / N) * gr;
      return {
        q: `<p>A gym's tree asks "visits last month ≤ 4?" about ${N} members. ${table(['', 'renewed', 'quit'], [['parent', lA + rA, lB + rB], ['yes side', lA, lB], ['no side', rA, rB]])}<p>What is the Gini gain of this question?</p>`,
        answer, unit: '', tol: 0.01, abs: 0.002,
        hint: 'Gain = Gini(parent) − (n_yes/n)·Gini(yes) − (n_no/n)·Gini(no). Gini of a two-class box = 1 − p² − (1 − p)².',
        solution: steps(
          `Parent: Gini = ${n(pa)}.`,
          `Yes side (${nl} members): Gini = ${n(gl)}. No side (${nr} members): Gini = ${n(gr)}.`,
          `Weighted after: ${nl}/${N} × ${n(gl)} + ${nr}/${N} × ${n(gr)} = ${n(pa - answer)}.`,
          `Gain = ${n(pa)} − ${n(pa - answer)} = <b>${n(answer)}</b>.`),
        lA, lB, rA, rB,
      };
    },
    verify(p) { // via sums of squared counts: Gini·n = n − Σc²/n
      const s = (cs) => { const t = cs[0] + cs[1]; return t - (cs[0] ** 2 + cs[1] ** 2) / t; };
      const N = p.lA + p.lB + p.rA + p.rB;
      return (s([p.lA + p.rA, p.lB + p.rB]) - s([p.lA, p.lB]) - s([p.rA, p.rB])) / N;
    },
  },
  'regression-trees-split': {
    title: 'variance drop for a sales split',
    make(r) {
      const lo = [pick(r, 3, 6, 1), pick(r, 4, 8, 1), pick(r, 5, 9, 1)], hi = [pick(r, 12, 16, 1), pick(r, 14, 18, 1), pick(r, 15, 21, 1)];
      const all = [...lo, ...hi], answer = vari(all) - 0.5 * vari(lo) - 0.5 * vari(hi);
      return {
        q: `<p>Daily lemonade sales (in dozens) on six days, from coolest to warmest: ${all.join(', ')}. A regression tree splits the three cool days from the three warm days. By how much does the split lower the weighted variance of sales?</p>`,
        answer, unit: 'dozen²', tol: 0.01,
        hint: 'Variance = average squared distance from the mean. Work it out for all six days, then for each half; each half holds 3 of the 6 days, so it gets weight ½.',
        solution: steps(
          `All six: mean ${n(mean(all))}, variance ${n(vari(all))}.`,
          `Cool days: mean ${n(mean(lo))}, variance ${n(vari(lo))}. Warm days: mean ${n(mean(hi))}, variance ${n(vari(hi))}.`,
          `Weighted after: ½ × ${n(vari(lo))} + ½ × ${n(vari(hi))} = ${n((vari(lo) + vari(hi)) / 2)}.`,
          `Drop = ${n(vari(all))} − ${n((vari(lo) + vari(hi)) / 2)} = <b>${n(answer)}</b>. The leaves would predict ${n(mean(lo))} and ${n(mean(hi))} dozen.`),
        lo, hi,
      };
    },
    verify(p) { // between-group variance: the drop equals the spread of the two means around the overall mean
      const m = mean([...p.lo, ...p.hi]); return 0.5 * (mean(p.lo) - m) ** 2 + 0.5 * (mean(p.hi) - m) ** 2;
    },
  },
  'pruning-alpha': {
    title: 'when does pruning cut this branch?',
    make(r) {
      const L = pick(r, 2, 6, 1), e0 = pick(r, 0.05, 0.15, 0.01), d = pick(r, 0.01, 0.06, 0.005), answer = d / (L - 1);
      return {
        q: `<p>A branch of a churn tree has ${L} leaves. Collapsing it into a single leaf would raise the tree's training error from ${n(e0)} to ${n(e0 + d)}. With cost-complexity pruning, cost = error + α × (number of leaves), above what α is the branch pruned?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Collapsing saves (leaves − 1) leaves, each worth α in the cost, and adds the rise in error. Prune when the saving is bigger than the rise.',
        solution: steps(
          `Rise in error: ${n(e0 + d)} − ${n(e0)} = ${n(d)}.`,
          `Leaves saved: ${L} − 1 = ${L - 1}, worth ${L - 1}α.`,
          `Prune when ${L - 1}α > ${n(d)}, that is α > <b>${n(answer)}</b>.`),
        L, d, e0,
      };
    },
    verify(p) { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const a = (lo + hi) / 2; const keep = p.e0 + a * p.L, cut = p.e0 + p.d + a; cut < keep ? (hi = a) : (lo = a); } return lo; },
  },
};


// ---------- Module 6: ensembles ----------
const choose = (n, k) => { let c = 1; for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i; return c; };
const M6 = {
  'wisdom-of-crowds-majority': {
    title: 'how often is the majority right?',
    make(r) {
      const nv = [3, 5, 7][Math.min(2, Math.floor(r() * 3))], p = pick(r, 0.55, 0.85, 0.05);
      let tot = 0; const rows = [];
      for (let k = Math.ceil(nv / 2); k <= nv; k++) { const t = choose(nv, k) * p ** k * (1 - p) ** (nv - k); tot += t; rows.push(`exactly ${k} right: ${choose(nv, k)} × ${p}<sup>${k}</sup> × ${n(1 - p)}<sup>${nv - k}</sup> = ${n(t)}`); }
      const answer = tot * 100;
      return {
        q: `<p>A shop runs ${nv} independent fraud checks on each order. Each check is right ${Math.round(p * 100)} % of the time, and the shop goes with the majority. How often is the majority right? Answer in <b>%</b>.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: `The majority is right when at least ${Math.ceil(nv / 2)} of the ${nv} are right. The chance that exactly k are right is C(${nv}, k) × p<sup>k</sup> × (1 − p)<sup>${nv}−k</sup>. Add those up.`,
        solution: steps(...rows, `Total: <b>${n(answer)} %</b>, better than any single check's ${Math.round(p * 100)} %.`),
        nv, p,
      };
    },
    verify(p) { let d = [1]; for (let i = 0; i < p.nv; i++) { const e = Array(d.length + 1).fill(0); d.forEach((v, k) => { e[k] += v * (1 - p.p); e[k + 1] += v * p.p; }); d = e; } return 100 * d.reduce((a, v, k) => a + (k > p.nv / 2 ? v : 0), 0); },
  },
  'wisdom-of-crowds-variance': {
    title: 'averaging correlated forecasts',
    make(r) {
      const sd = pick(r, 10, 40, 5), rho = pick(r, 0.1, 0.8, 0.1), nm = pick(r, 3, 20, 1);
      const s2 = sd * sd, answer = rho * s2 + ((1 - rho) / nm) * s2;
      return {
        q: `<p>${nm} demand-forecasting models each predict tomorrow's orders with a spread (standard deviation) of ${sd} orders, so a variance of ${s2}. Any two models' errors have a correlation of ${rho}. What is the variance of their average forecast?</p>`,
        answer, unit: 'orders²', tol: 0.01,
        hint: 'Variance of the average = ρσ² + (1 − ρ)σ² ÷ n. The first part is shared by all models and never averages away.',
        solution: steps(
          `Shared part: ρσ² = ${rho} × ${s2} = ${n(rho * s2)}.`,
          `Part that averages away: (1 − ${rho}) × ${s2} ÷ ${nm} = ${n(((1 - rho) * s2) / nm)}.`,
          `Variance of the average = <b>${n(answer)}</b>, down from ${s2} for one model. With ${nm * 10} models it would still be at least ${n(rho * s2)}.`),
        s2, rho, nm,
      };
    },
    verify(p) { let tot = 0; for (let i = 0; i < p.nm; i++) for (let j = 0; j < p.nm; j++) tot += i === j ? p.s2 : p.rho * p.s2; return tot / (p.nm * p.nm); },
  },
  'bagging-bootstrap-oob': {
    title: 'how many rows are out of the bag?',
    make(r) {
      const nr = pick(r, 5, 60, 1), answer = nr * (1 - 1 / nr) ** nr;
      return {
        q: `<p>A small bakery has ${nr} days of sales records. You draw one bootstrap sample: ${nr} days picked at random <b>with replacement</b>. On average, how many of the days are never picked (out of the bag)?</p>`,
        answer, unit: 'days', tol: 0.01,
        hint: `One draw misses a given day with probability 1 − 1/${nr}. All ${nr} draws miss it with probability (1 − 1/${nr})<sup>${nr}</sup>. Multiply by the number of days.`,
        solution: steps(
          `Chance one draw misses a given day: 1 − 1/${nr} = ${n(1 - 1 / nr, 4)}.`,
          `Chance all ${nr} draws miss it: ${n(1 - 1 / nr, 4)}<sup>${nr}</sup> = ${n((1 - 1 / nr) ** nr, 4)}.`,
          `Expected days left out: ${nr} × ${n((1 - 1 / nr) ** nr, 4)} = <b>${n(answer)}</b>. For large data the share heads to e<sup>−1</sup> ≈ 36.8 %.`),
        nr,
      };
    },
    verify: (p) => p.nr * Math.exp(p.nr * Math.log1p(-1 / p.nr)),
  },
  'random-forests-oob-trees': {
    title: 'how many trees can test each row?',
    make(r) {
      const B = pick(r, 100, 800, 50), nr = pick(r, 200, 5000, 100), q = (1 - 1 / nr) ** nr, answer = B * q;
      return {
        q: `<p>A random forest for a ${nr}-row customer table has ${B} trees, each grown on its own bootstrap sample. For one particular customer, how many trees on average never saw that row, and so can be used for its out-of-bag prediction?</p>`,
        answer, unit: 'trees', tol: 0.01,
        hint: `A row is left out of one bootstrap sample with probability (1 − 1/n)<sup>n</sup>, very close to e<sup>−1</sup> ≈ 0.368 for large n. Multiply by the number of trees.`,
        solution: steps(
          `Chance a given tree's sample misses the row: (1 − 1/${nr})<sup>${nr}</sup> = ${n(q, 4)}.`,
          `Expected trees that missed it: ${B} × ${n(q, 4)} = <b>${n(answer)}</b>. Those trees vote on that row to give its out-of-bag prediction.`),
        B, nr,
      };
    },
    verify: (p) => p.B * Math.exp(-1) * (1 - 1 / (2 * p.nr)),
  },
  'feature-importance-permutation': {
    title: 'permutation importance from three shuffles',
    make(r) {
      const S = pick(r, 0.8, 0.92, 0.01), d = pick(r, 0.01, 0.12, 0.005);
      const sh = [S - d + pick(r, -0.008, 0.008, 0.002), S - d + pick(r, -0.008, 0.008, 0.002), S - d + pick(r, -0.008, 0.008, 0.002)].map((v) => +v.toFixed(3));
      const answer = S - (sh[0] + sh[1] + sh[2]) / 3;
      return {
        q: `<p>A churn model scores an accuracy of ${S} on validation data. You shuffle the "contract type" column three times, each time scoring again: ${sh.join(', ')}. What is the permutation importance of contract type (the average drop in accuracy)?</p>`,
        answer, unit: '', tol: 0.02, abs: 0.002,
        hint: 'Work out the drop for each shuffle (original score minus shuffled score), then average the three drops.',
        solution: steps(
          `Drops: ${sh.map((v) => n(S - v)).join(', ')}.`,
          `Average drop = <b>${n(answer)}</b>. Shuffling breaks the link between the column and the outcome; the bigger the drop, the more the model relied on it.`),
        S, sh,
      };
    },
    verify: (p) => p.sh.reduce((a, v) => a + (p.S - v), 0) / 3,
  },
  'boosting-alpha': {
    title: 'how much say does a stump get?',
    make(r) {
      const nr = pick(r, 10, 40, 2), k = pick(r, 1, Math.floor(nr * 0.4), 1), e = k / nr;
      const answer = 0.5 * Math.log((1 - e) / e);
      return {
        q: `<p>AdaBoost is sorting ${nr} loan applications, all starting with equal weight. Its first stump gets ${k} of them wrong. What is the stump's say α = ½ ln((1 − ε) ÷ ε), where ε is the weighted error?</p>`,
        answer, unit: '', tol: 0.01,
        hint: `With equal weights, the weighted error is just the share wrong: ε = ${k} ÷ ${nr}.`,
        solution: steps(
          `ε = ${k} ÷ ${nr} = ${n(e)}.`,
          `(1 − ε) ÷ ε = ${n(1 - e)} ÷ ${n(e)} = ${n((1 - e) / e)}.`,
          `α = ½ × ln ${n((1 - e) / e)} = <b>${n(answer)}</b>. The ${k} misclassified rows now have their weights multiplied by e<sup>α</sup> = ${n(Math.exp(answer))} before rescaling, so after rescaling they hold exactly half the total weight.`),
        e,
      };
    },
    verify: (p) => Math.atanh(1 - 2 * p.e),
  },
  'gradient-boosting-round': {
    title: 'one round of gradient boosting',
    make(r) {
      const y = [pick(r, 80, 120, 5), pick(r, 100, 140, 5), pick(r, 180, 220, 5), pick(r, 200, 260, 5)], eta = pick(r, 0.1, 1, 0.1);
      const F0 = mean(y), res = y.map((v) => v - F0), hl = (res[0] + res[1]) / 2, answer = F0 + eta * hl;
      return {
        q: `<p>Four flats have rents (in $10s per month) of ${y.join(', ')}, from smallest to largest. Gradient boosting starts from the average, then fits a stump to the residuals that splits the two small flats from the two big ones. With learning rate ${eta}, what is the new prediction for the <b>smallest</b> flat?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Start: F₀ = the average rent. Residual = rent − F₀. The stump\'s left leaf predicts the average residual of the two small flats. New prediction = F₀ + learning rate × that leaf value.',
        solution: steps(
          `F₀ = (${y.join(' + ')}) ÷ 4 = ${n(F0, 4)}.`,
          `Residuals: ${res.map((v) => n(v, 4)).join(', ')}.`,
          `Left leaf (two small flats): (${n(res[0], 4)} + ${n(res[1], 4)}) ÷ 2 = ${n(hl, 4)}.`,
          `New prediction: ${n(F0, 4)} + ${eta} × ${n(hl, 4)} = <b>${n(answer, 4)}</b>. Its residual shrinks from ${n(res[0], 4)} to ${n(y[0] - answer, 4)}.`),
        y, eta,
      };
    },
    verify(p) { const m = mean(p.y), ml = (p.y[0] + p.y[1]) / 2; return (1 - p.eta) * m + p.eta * ml; },
  },
};

export default { ...M4, ...M5, ...M6 };
