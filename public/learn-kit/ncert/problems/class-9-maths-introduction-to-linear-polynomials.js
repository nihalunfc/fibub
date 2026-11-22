// Class 9 Maths, Introduction to Linear Polynomials: live problems (original fibub questions). Ids start with c9m-lin-.
import { pick, choose, n, steps } from './_util.js';

const sg = (v) => String(v).replace('-', '−');
const lin = (a, b) => `${a === 1 ? '' : a === -1 ? '−' : sg(a)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
const nz = (r, a, b) => { const v = pick(r, a, b); return v || b; };
export default {
  'c9m-lin-value': {
    title: 'value of a linear polynomial',
    make(r) {
      const a = nz(r, -7, 7), b = pick(r, -9, 9), x = pick(r, -6, 6);
      return { a, b, x, q: `<p>If p(x) = ${lin(a, b)}, find p(${sg(x)}).</p>`, answer: a * x + b, abs: 0.01, tol: 0, unit: '',
        hint: 'Replace x by the number, using brackets for a negative number, then multiply before adding.',
        solution: steps(`p(${sg(x)}) = ${sg(a)} × (${sg(x)}) ${b < 0 ? '−' : '+'} ${Math.abs(b)}.`, `= ${sg(a * x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = <b>${sg(a * x + b)}</b>.`) };
    },
    verify: (p) => [p.a, p.b].reduce((acc, v) => acc * p.x + v, 0),
  },
  'c9m-lin-zero': {
    title: 'zero of a linear polynomial',
    make(r) {
      const a = nz(r, -6, 6), z = pick(r, -8, 8), b = -a * z;
      return { a, b, q: `<p>Find the zero of the polynomial ${lin(a, b)}.</p>`, answer: z, abs: 0.001, tol: 0, unit: '',
        hint: 'Set the polynomial equal to 0 and solve for x. The zero of ax + b is −b/a.',
        solution: steps(`${lin(a, b)} = 0, so ${sg(a)}x = ${sg(-b)}.`, `x = ${sg(-b)} ÷ ${sg(a)} = <b>${sg(z)}</b>.`) };
    },
    verify: (p) => { for (let x = -40; x <= 40; x++) if (p.a * x + p.b === 0) return x; },
  },
  'c9m-lin-degree': {
    title: 'degree of a polynomial',
    make(r) {
      const d = choose(r, [0, 1, 2, 3, 4, 5]), c = [], co = (e) => (e === d ? nz(r, -5, 5) : pick(r, -5, 5));
      for (let e = 6; e >= 0; e--) c.push(e > d ? 0 : co(e));
      const t = c.map((v, i) => [v, 6 - i]).filter(([v]) => v).map(([v, e], i) => { const m = Math.abs(v), body = (m === 1 && e > 0 ? '' : m) + (e === 0 ? '' : e === 1 ? 'x' : 'x<sup>' + e + '</sup>'); return (i ? (v < 0 ? ' − ' : ' + ') : (v < 0 ? '−' : '')) + body; }).join('');
      return { c, d, q: `<p>Find the degree of the polynomial ${t}.</p>`, answer: d, abs: 0.01, tol: 0, unit: '',
        hint: 'The degree is the highest power of x that is actually present.',
        solution: steps(`The highest power of x here is ${d}.`, `So the degree is <b>${d}</b>${d === 0 ? ' (a constant)' : d === 1 ? ' (linear)' : d === 2 ? ' (quadratic)' : d === 3 ? ' (cubic)' : ''}.`) };
    },
    verify: (p) => { let e = 6; for (let i = 0; i < 7; i++) { if (p.c[i]) return 6 - i; } return 0; },
  },
  'c9m-lin-k': {
    title: 'value of k that makes a number a zero',
    make(r) {
      const a = nz(r, -6, 6), z = pick(r, -6, 6), k = -a * z;
      return { a, z, k, q: `<p>For what value of k is x = ${sg(z)} a zero of the polynomial ${sg(a)}x + k?</p>`, answer: k, abs: 0.01, tol: 0, unit: '',
        hint: 'A zero makes the polynomial equal 0, so put x = the given number and solve for k.',
        solution: steps(`p(${sg(z)}) = ${sg(a)}(${sg(z)}) + k = 0.`, `${sg(a * z)} + k = 0, so k = <b>${sg(k)}</b>.`) };
    },
    verify: (p) => { for (let k = -80; k <= 80; k++) if (p.a * p.z + k === 0) return k; },
  },
  'c9m-lin-slope': {
    title: 'slope of a line from two points',
    make(r) {
      const a = nz(r, -5, 5), b = pick(r, -6, 6), x1 = pick(r, -4, 1), x2 = x1 + pick(r, 2, 5);
      return { a, b, x1, x2, y1: a * x1 + b, y2: a * x2 + b, q: `<p>A line is the graph of a linear polynomial and passes through (${sg(x1)}, ${sg(a * x1 + b)}) and (${sg(x2)}, ${sg(a * x2 + b)}). How much does y change when x increases by 1 (the slope)?</p>`, answer: a, abs: 0.001, tol: 0, unit: '',
        hint: 'Slope = (change in y) ÷ (change in x).',
        solution: steps(`Change in y = ${sg(a * x2 + b)} − (${sg(a * x1 + b)}) = ${sg(a * (x2 - x1))}.`, `Change in x = ${sg(x2)} − (${sg(x1)}) = ${x2 - x1}.`, `Slope = ${sg(a * (x2 - x1))} ÷ ${x2 - x1} = <b>${sg(a)}</b>.`) };
    },
    verify: (p) => (p.y2 - p.y1) / (p.x2 - p.x1),
  },
  'c9m-lin-fare': {
    title: 'fare as a linear polynomial',
    make(r) {
      const f = choose(r, [20, 25, 30, 40, 50]), rate = choose(r, [8, 10, 12, 15, 18]), km = pick(r, 3, 24), total = f + rate * km;
      return { f, rate, total, km, q: `<p>An auto-rickshaw charges ₹${f} as a starting fare plus ₹${rate} for every kilometre, so the fare for x km is ${rate}x + ${f} rupees. Rohit paid ₹${total}. How many kilometres did he travel?</p>`, answer: km, abs: 0.01, tol: 0, unit: 'km',
        hint: 'Set the polynomial equal to the amount paid and solve for x.',
        solution: steps(`${rate}x + ${f} = ${total}.`, `${rate}x = ${total - f}, so x = <b>${km}</b> km.`) };
    },
    verify: (p) => { let x = 0; while (p.rate * x + p.f < p.total) x++; return x; },
  },
  'c9m-lin-plans': {
    title: 'when do two plans cost the same',
    make(r) {
      const x = pick(r, 10, 60, 5), ra = pick(r, 1, 4), rb = ra + pick(r, 1, 4), fa = pick(r, 60, 200, 10) + (rb - ra) * x, fb = fa - (rb - ra) * x;
      return { fa, fb, ra, rb, x, q: `<p>Plan A costs ₹${fa} + ₹${ra} per unit. Plan B costs ₹${fb} + ₹${rb} per unit. For how many units do the two plans cost exactly the same?</p>`, answer: x, abs: 0.01, tol: 0, unit: 'units',
        hint: 'Put the two costs equal, then collect the x terms on one side and the numbers on the other.',
        solution: steps(`${fa} + ${ra}x = ${fb} + ${rb}x.`, `${fa - fb} = ${rb - ra}x.`, `x = ${fa - fb} ÷ ${rb - ra} = <b>${x}</b> units.`) };
    },
    verify: (p) => { for (let x = 0; x <= 200; x++) if (p.fa + p.ra * x === p.fb + p.rb * x) return x; },
  },
};
