// Class 8 Maths, Chapter 8 Fractions in Disguise: live problems (original fibub questions). Ids start with c8m-pct-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8m-pct-of': {
    title: 'a percent of an amount',
    make(r) {
      const p = choose(r, [5, 10, 12, 15, 20, 25, 30, 40, 45]), A = pick(r, 40, 400, 20);
      return { p, A, q: `<p>Find ${p}% of ₹${A}.</p>`, answer: p * A / 100, abs: 0.01, tol: 0.001, unit: '₹',
        hint: `${p}% means ${p} out of 100: multiply by ${p} and divide by 100.`,
        solution: steps(`${p}% of ${A} = ${p}/100 × ${A}.`, `= <b>₹${p * A / 100}</b>.`) };
    },
    verify: (x) => (x.A / 100) * x.p,
  },
  'c8m-pct-profit': {
    title: 'profit percent',
    make(r) {
      const cp = pick(r, 100, 1000, 20), g = choose(r, [5, 10, 15, 20, 25, 30, 40]), sp = cp * (100 + g) / 100;
      return { cp, sp, q: `<p>A shopkeeper buys a bag for ₹${cp} and sells it for ₹${sp}. What is the profit percent?</p>`, answer: g, abs: 0.01, tol: 0.001, unit: '%',
        hint: 'Profit = SP − CP. Profit percent = profit ÷ CP × 100.',
        solution: steps(`Profit = ${sp} − ${cp} = ₹${sp - cp}.`, `Profit % = ${sp - cp} ÷ ${cp} × 100 = <b>${g}%</b>.`) };
    },
    verify: (x) => (x.sp / x.cp - 1) * 100,
  },
  'c8m-pct-disc': {
    title: 'price after discount',
    make(r) {
      const mrp = pick(r, 200, 2000, 100), d = choose(r, [5, 10, 15, 20, 25, 30, 40, 50]);
      return { mrp, d, q: `<p>A shirt has a marked price of ₹${mrp}. The shop gives ${d}% discount. What do you pay?</p>`, answer: mrp * (100 - d) / 100, abs: 0.01, tol: 0.001, unit: '₹',
        hint: 'Discount = d% of the marked price. Subtract it.',
        solution: steps(`Discount = ${d}% of ${mrp} = ₹${mrp * d / 100}.`, `You pay ${mrp} − ${mrp * d / 100} = <b>₹${mrp * (100 - d) / 100}</b>.`) };
    },
    verify: (x) => x.mrp - (x.mrp * x.d) / 100,
  },
  'c8m-pct-si': {
    title: 'simple interest',
    make(r) {
      const P = pick(r, 1000, 20000, 1000), R = choose(r, [4, 5, 6, 8, 10, 12]), T = pick(r, 2, 6);
      return { P, R, T, q: `<p>Find the simple interest on ₹${P} at ${R}% per year for ${T} years.</p>`, answer: P * R * T / 100, abs: 0.01, tol: 0.001, unit: '₹',
        hint: 'SI = P × R × T ÷ 100.',
        solution: steps(`SI = ${P} × ${R} × ${T} ÷ 100.`, `= <b>₹${P * R * T / 100}</b>.`) };
    },
    verify: (x) => { let t = 0; for (let y = 0; y < x.T; y++) t += (x.P * x.R) / 100; return t; },
  },
  'c8m-pct-ci': {
    title: 'compound amount for 2 years',
    make(r) {
      const P = choose(r, [4000, 8000, 10000, 20000]), R = choose(r, [5, 10, 20]), A = P * (100 + R) * (100 + R) / 10000;
      return { P, R, A, q: `<p>₹${P} is deposited at ${R}% per year, compounded yearly. What is the amount after 2 years?</p>`, answer: A, abs: 0.01, tol: 0.001, unit: '₹',
        hint: 'After year 1 the amount is P × (1 + R/100). In year 2 the interest is on that new amount.',
        solution: steps(`Year 1: ${P} × ${(100 + R) / 100} = ${P * (100 + R) / 100}.`, `Year 2: ${P * (100 + R) / 100} × ${(100 + R) / 100} = <b>₹${A}</b>.`) };
    },
    verify: (x) => { let a = x.P; for (let y = 0; y < 2; y++) a += (a * x.R) / 100; return a; },
  },
  'c8m-pct-change': {
    title: 'percent increase',
    make(r) {
      const old = choose(r, [40, 50, 80, 200, 250, 400]), g = choose(r, [10, 20, 25, 50]), nw = old * (100 + g) / 100;
      return { old, nw, q: `<p>The number of students in a club grew from ${old} to ${nw}. What is the percent increase?</p>`, answer: g, abs: 0.01, tol: 0.001, unit: '%',
        hint: 'Increase ÷ original × 100.',
        solution: steps(`Increase = ${nw} − ${old} = ${nw - old}.`, `${nw - old} ÷ ${old} × 100 = <b>${g}%</b>.`) };
    },
    verify: (x) => 100 * (x.nw - x.old) / x.old,
  },
  'c8m-pct-back': {
    title: 'find the marked price',
    make(r) {
      const mrp = pick(r, 200, 2000, 100), d = choose(r, [10, 20, 25, 40, 50]), sp = mrp * (100 - d) / 100;
      return { mrp, d, sp, q: `<p>After a ${d}% discount, a bag costs ₹${sp}. What was its marked price?</p>`, answer: mrp, abs: 0.01, tol: 0.001, unit: '₹',
        hint: `₹${sp} is ${100 - d}% of the marked price. Find 1% first.`,
        solution: steps(`${100 - d}% of marked price = ₹${sp}, so 1% = ${sp} ÷ ${100 - d}.`, `100% = ${sp} ÷ ${100 - d} × 100 = <b>₹${mrp}</b>.`) };
    },
    verify: (x) => { for (let m = 100; m <= 5000; m += 10) if (Math.abs(m * (100 - x.d) / 100 - x.sp) < 1e-6) return m; },
  },
};
