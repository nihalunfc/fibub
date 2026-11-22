// Live problems for Plant growth and development.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'pgrow-rgr': {
    title: 'absolute and relative growth rate of two leaves',
    make(r) {
      const a0 = pick(r, 2, 10), b0 = a0 * pick(r, 3, 8), gain = pick(r, 2, 10), t = pick(r, 2, 7);
      const answer = (gain / (a0 * t)) * 100 / ((gain / (b0 * t)) * 100);
      return { a0, b0, gain, t,
        q: `<p>Leaf A grows from ${a0} cm² to ${a0 + gain} cm² and leaf B from ${b0} cm² to ${b0 + gain} cm² in the same ${t} days. Both have the same absolute growth rate. How many times larger is the relative growth rate of leaf A than that of leaf B?</p>`,
        answer, unit: 'times', tol: 0.005,
        hint: 'Absolute growth rate = gain ÷ time. Relative growth rate = gain ÷ (initial size × time).',
        solution: steps(`Absolute rate for both = ${gain} ÷ ${t} = ${n(gain / t)} cm² per day.`, `Relative rate of A = ${gain} ÷ (${a0} × ${t}) = ${n(gain / (a0 * t))} per day; of B = ${gain} ÷ (${b0} × ${t}) = ${n(gain / (b0 * t))} per day.`, `Ratio = <b>${n(answer)}</b>: the smaller leaf is growing more efficiently.`) };
    },
    verify: (x) => x.b0 / x.a0,
  },
  'pgrow-geometric': {
    title: 'size after geometric growth, W₁ = W₀ e^(rt)',
    make(r) {
      const W0 = pick(r, 2, 20), rate = pick(r, 0.05, 0.4, 0.05), t = pick(r, 2, 12);
      const answer = W0 * Math.exp(rate * t);
      return { W0, rate, t,
        q: `<p>A plant cell culture grows geometrically with relative growth rate r = ${rate} per day. Its mass is ${W0} g at the start. What is its mass after ${t} days? (Use W<sub>1</sub> = W<sub>0</sub>e<sup>rt</sup>.)</p>`,
        answer, unit: 'g', tol: 0.01,
        hint: 'Multiply r by t first, then raise e to that power and multiply by the starting mass.',
        solution: steps(`rt = ${rate} × ${t} = ${n(rate * t, 4)}.`, `e<sup>${n(rate * t, 4)}</sup> = ${n(Math.exp(rate * t), 4)}.`, `W<sub>1</sub> = ${W0} × ${n(Math.exp(rate * t), 4)} = <b>${n(answer)} g</b>.`) };
    },
    verify: (x) => { let w = x.W0; const k = 1000; for (let i = 0; i < k * x.t; i++) w *= 1 + x.rate / k; return w; },
  },
  'pgrow-doubling': {
    title: 'doubling time from the relative growth rate',
    make(r) {
      const rate = pick(r, 0.02, 0.5, 0.01);
      const answer = 0.693 / rate;
      return { rate,
        q: `<p>A culture grows geometrically with relative growth rate r = ${rate} per hour. Taking ln 2 = 0.693, how long does it take to double in size?</p>`,
        answer, unit: 'h', tol: 0.01,
        hint: 'Doubling means W<sub>1</sub> = 2W<sub>0</sub>, so e<sup>rt</sup> = 2 and rt = ln 2.',
        solution: steps('2W<sub>0</sub> = W<sub>0</sub>e<sup>rt</sup>, so rt = ln 2 = 0.693.', `t = 0.693 ÷ ${rate} = <b>${n(answer)} h</b>.`) };
    },
    verify: (x) => Math.LN2 / x.rate, // exact ln 2 (0.6931...) differs from 0.693 by 0.02%
  },
};
