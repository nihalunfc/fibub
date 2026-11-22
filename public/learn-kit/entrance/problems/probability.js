// Live problems for Probability.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const C = (a, b) => { let x = 1; for (let i = 0; i < b; i++) x = (x * (a - i)) / (i + 1); return x; };

export default {
  'prob-bayes': {
    title: 'which machine made the faulty item? (Bayes)',
    make(r) {
      const a = pick(r, 20, 80, 5), dA = pick(r, 1, 6), dB = pick(r, 1, 6);
      const pA = a / 100, pB = 1 - pA, tot = pA * dA / 100 + pB * dB / 100;
      const answer = (pA * dA / 100) / tot;
      return { a, dA, dB,
        q: `<p>Machine A makes ${a}% of a factory's bolts and machine B makes the rest. ${dA}% of A's bolts and ${dB}% of B's bolts are faulty. A bolt picked at random is faulty. What is the probability that machine A made it? (Give a decimal.)</p>`,
        answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'P(A | faulty) = P(A)·P(faulty | A) ÷ P(faulty), and P(faulty) adds both routes: P(A)P(F|A) + P(B)P(F|B).',
        solution: steps(`P(A) = ${n(pA)}, P(B) = ${n(pB)}.`, `P(faulty) = ${n(pA)} × ${n(dA / 100)} + ${n(pB)} × ${n(dB / 100)} = ${n(tot, 4)}.`, `P(A | faulty) = ${n(pA * dA / 100, 4)} ÷ ${n(tot, 4)} = <b>${n(answer, 4)}</b>.`) };
    },
    // count bolts out of 10 000 instead of multiplying probabilities
    verify: (x) => { const A = 100 * x.a, B = 10000 - A, fa = A * x.dA / 100, fb = B * x.dB / 100; return fa / (fa + fb); },
  },
  'prob-binom': {
    title: 'exactly k successes in n trials (binomial)',
    make(r) {
      const nn = pick(r, 4, 10), p = pick(r, 0.1, 0.7, 0.1), k = pick(r, 1, nn - 1);
      const answer = C(nn, k) * p ** k * (1 - p) ** (nn - k);
      return { nn, p, k,
        q: `<p>A basketball player scores a free throw with probability ${n(p)}, independently each time. She takes ${nn} throws. What is the probability that she scores exactly ${k}? (Give a decimal to 4 places.)</p>`,
        answer, unit: '', tol: 0.005, abs: 0.0005,
        hint: `P(X = k) = ⁿCₖ pᵏ qⁿ⁻ᵏ with q = 1 − p.`,
        solution: steps(`n = ${nn}, p = ${n(p)}, q = ${n(1 - p)}, k = ${k}.`, `${nn}C${k} = ${C(nn, k)}.`, `P = ${C(nn, k)} × ${n(p)}<sup>${k}</sup> × ${n(1 - p)}<sup>${nn - k}</sup> = <b>${n(answer, 4)}</b>.`) };
    },
    // add up every one of the 2ⁿ sequences that has exactly k successes
    verify: (x) => { let s = 0; for (let m = 0; m < 1 << x.nn; m++) { let c = 0; for (let i = 0; i < x.nn; i++) if (m >> i & 1) c++; if (c === x.k) s += x.p ** c * (1 - x.p) ** (x.nn - c); } return s; },
  },
  'prob-atleast': {
    title: 'how many trials for "at least one"?',
    make(r) {
      const p = [1 / 6, 1 / 4, 1 / 5, 1 / 10][Math.floor(r() * 4)], lab = { [1 / 6]: '1/6', [1 / 4]: '1/4', [1 / 5]: '1/5', [1 / 10]: '1/10' }[p];
      const target = pick(r, 0.5, 0.95, 0.05);
      const answer = Math.ceil(Math.log(1 - target) / Math.log(1 - p) - 1e-12);
      return { p, target,
        q: `<p>Each trial succeeds with probability ${lab}, independently. What is the least number of trials needed so that the probability of at least one success is more than ${n(target)}?</p>`,
        answer, unit: 'trials', tol: 0, abs: 0.4,
        hint: 'P(at least one) = 1 − P(none) = 1 − qⁿ. Solve 1 − qⁿ > target, that is qⁿ < 1 − target, with logarithms.',
        solution: steps(`q = 1 − ${lab} = ${n(1 - p)}.`, `Need ${n(1 - p)}ⁿ < ${n(1 - target)}, so n > log(${n(1 - target)}) ÷ log(${n(1 - p)}) = ${n(Math.log(1 - target) / Math.log(1 - p), 4)}.`, `The least whole number is <b>${answer}</b>. Check: 1 − ${n(1 - p)}<sup>${answer}</sup> = ${n(1 - (1 - p) ** answer, 4)}.`) };
    },
    verify: (x) => { let k = 0; while (!(1 - (1 - x.p) ** k > x.target)) k++; return k; },
  },
};
