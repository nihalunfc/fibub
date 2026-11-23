// Class 12 Maths, Probability: live problems (original fibub questions). Ids start with c12m-prob-.
import { pick, choose, n, steps } from './_util.js';

const D4 = (v) => (+v).toFixed(4);
const C = (nn, k) => { let c = 1; for (let i = 1; i <= k; i++) c = (c * (nn - k + i)) / i; return Math.round(c); };

export default {
  'c12m-prob-cond': {
    title: 'conditional probability with two dice',
    make(r) {
      const s = pick(r, 4, 10), k = pick(r, 1, 6); let nb = 0, nab = 0;
      for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (x + y === s) { nb++; if (x === k || y === k) nab++; }
      return { s, k, q: `<p>Two fair dice are thrown. Given that the sum is ${s}, find the probability that at least one die shows ${k} (a decimal to 3 places; 0 if impossible).</p>`, answer: nab / nb, unit: '', tol: 0.005, abs: 0.001,
        hint: 'P(A | B) = n(A ∩ B)/n(B): the sample space shrinks to the pairs with sum ' + s + '.',
        solution: steps(`Pairs with sum ${s}: ${nb} of them.`, `Among these, ${nab} have a ${k}.`, `P = ${nab}/${nb} = <b>${n(nab / nb, 4)}</b>.`) };
    },
    // P(A and B) / P(B) with probabilities out of 36
    verify: (p) => { let pab = 0, pb = 0; for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) { if (x + y === p.s) pb += 1 / 36; if (x + y === p.s && (x === p.k || y === p.k)) pab += 1 / 36; } return pb ? pab / pb : 0; },
  },
  'c12m-prob-twodraws': {
    title: 'two draws without replacement',
    make(r) {
      const R = pick(r, 3, 9), B = pick(r, 2, 9), N = R + B;
      return { R, B, N, q: `<p>A bag has ${R} red and ${B} blue balls. Two balls are drawn one after the other without replacement. Find the probability that both are red (3 decimal places).</p>`, answer: (R / N) * ((R - 1) / (N - 1)), unit: '', tol: 0.01, abs: 0.001,
        hint: 'P(both red) = P(first red) × P(second red | first red).',
        solution: steps(`P(first red) = ${R}/${N}.`, `After one red is gone: P(second red) = ${R - 1}/${N - 1}.`, `Product = <b>${n((R / N) * ((R - 1) / (N - 1)), 4)}</b>.`) };
    },
    // choose 2 balls together: C(R,2)/C(N,2)
    verify: (p) => C(p.R, 2) / C(p.N, 2),
  },
  'c12m-prob-total': {
    title: 'total probability: a defective item',
    make(r) {
      const sh = choose(r, [[50, 30, 20], [40, 40, 20], [60, 25, 15], [30, 30, 40], [50, 25, 25]]), d = [pick(r, 1, 4), pick(r, 2, 5), pick(r, 3, 8)];
      const PA = (sh[0] * d[0] + sh[1] * d[1] + sh[2] * d[2]) / 10000;
      return { sh, d, q: `<p>Three machines make ${sh[0]}%, ${sh[1]}% and ${sh[2]}% of the bolts in a factory, and ${d[0]}%, ${d[1]}% and ${d[2]}% of their bolts are defective. A bolt is picked at random. Find the probability that it is defective (4 decimal places).</p>`, answer: PA, unit: '', tol: 0.005,
        hint: 'P(D) = Σ P(machine) × P(D | machine).',
        solution: steps(`P(D) = ${sh[0] / 100}×${d[0] / 100} + ${sh[1] / 100}×${d[1] / 100} + ${sh[2] / 100}×${d[2] / 100}.`, `= <b>${D4(PA)}</b>.`) };
    },
    // count out of 10000 bolts
    verify: (p) => { let bad = 0; for (let i = 0; i < 3; i++) bad += (10000 * p.sh[i] / 100) * (p.d[i] / 100); return bad / 10000; },
  },
  'c12m-prob-bayes': {
    title: "Bayes' theorem: which machine?",
    make(r) {
      const sh = choose(r, [[50, 30, 20], [40, 40, 20], [60, 25, 15], [30, 30, 40], [50, 25, 25]]), d = [pick(r, 1, 4), pick(r, 2, 5), pick(r, 3, 8)], w = pick(r, 0, 2);
      const j = sh.map((s, i) => (s / 100) * (d[i] / 100)), PA = j[0] + j[1] + j[2];
      return { sh, d, w, q: `<p>Three machines make ${sh[0]}%, ${sh[1]}% and ${sh[2]}% of the bolts, and ${d[0]}%, ${d[1]}% and ${d[2]}% of their bolts are defective. A bolt is found defective. Find the probability that it came from machine ${w + 1} (3 decimal places).</p>`, answer: j[w] / PA, unit: '', tol: 0.005,
        hint: 'Bayes: P(Mi | D) = P(Mi)P(D | Mi) / ΣP(Mj)P(D | Mj).',
        solution: steps(`Joint probabilities: ${j.map((v) => D4(v)).join(', ')}.`, `P(D) = ${D4(PA)}.`, `P(M${w + 1} | D) = ${D4(j[w])}/${D4(PA)} = <b>${n(j[w] / PA, 4)}</b>.`) };
    },
    // natural frequencies out of 100000 bolts
    verify: (p) => { const bad = p.sh.map((s, i) => 100000 * (s / 100) * (p.d[i] / 100)); return bad[p.w] / (bad[0] + bad[1] + bad[2]); },
  },
  'c12m-prob-binom': {
    title: 'a binomial probability',
    make(r) {
      const nn = pick(r, 4, 8), k = pick(r, 1, nn - 1), p = choose(r, [0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
      return { nn, k, p, q: `<p>A cricketer hits the stumps with probability ${p} on each throw, independently. In ${nn} throws, find the probability of exactly ${k} hits (4 decimal places).</p>`, answer: C(nn, k) * p ** k * (1 - p) ** (nn - k), unit: '', tol: 0.005, abs: 0.0001,
        hint: 'P(X = k) = C(n, k) pᵏ qⁿ⁻ᵏ.',
        solution: steps(`n = ${nn}, k = ${k}, p = ${p}, q = ${n(1 - p, 3)}.`, `C(${nn}, ${k}) = ${C(nn, k)}.`, `P = ${C(nn, k)} × ${p}^${k} × ${n(1 - p, 3)}^${nn - k} = <b>${D4(C(nn, k) * p ** k * (1 - p) ** (nn - k))}</b>.`) };
    },
    // add up every one of the 2^n sequences with exactly k hits
    verify: (m) => { let t = 0; for (let b = 0; b < 1 << m.nn; b++) { let h = 0; for (let i = 0; i < m.nn; i++) h += (b >> i) & 1; if (h === m.k) t += m.p ** h * (1 - m.p) ** (m.nn - h); } return t; },
  },
  'c12m-prob-mean': {
    title: 'mean of a random variable',
    make(r) {
      const nn = pick(r, 4, 12), p = choose(r, [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]);
      return { nn, p, q: `<p>X is the number of successes in ${nn} independent trials with success probability ${p} each. Find the mean E(X).</p>`, answer: nn * p, unit: '', tol: 0.005, abs: 0.01,
        hint: 'For a binomial distribution the mean is np.',
        solution: steps(`E(X) = np = ${nn} × ${p}.`, `= <b>${n(nn * p, 4)}</b>.`) };
    },
    // E(X) = sum of k P(X = k)
    verify: (m) => { let e = 0; for (let k = 0; k <= m.nn; k++) e += k * C(m.nn, k) * m.p ** k * (1 - m.p) ** (m.nn - k); return e; },
  },
  'c12m-prob-indep': {
    title: 'independent events: P(A or B)',
    make(r) {
      const a = pick(r, 10, 80, 5) / 100, b = pick(r, 10, 80, 5) / 100;
      return { a, b, q: `<p>A and B are independent events with P(A) = ${a} and P(B) = ${b}. Find P(A ∪ B) (3 decimal places).</p>`, answer: a + b - a * b, unit: '', tol: 0.005,
        hint: 'For independent events P(A ∩ B) = P(A)P(B). Then P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
        solution: steps(`P(A ∩ B) = ${a} × ${b} = ${n(a * b, 4)}.`, `P(A ∪ B) = ${a} + ${b} − ${n(a * b, 4)} = <b>${n(a + b - a * b, 4)}</b>.`) };
    },
    // 1 - P(neither)
    verify: (m) => 1 - (1 - m.a) * (1 - m.b),
  },
};
