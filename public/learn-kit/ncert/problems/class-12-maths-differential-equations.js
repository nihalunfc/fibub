// Class 12 Maths, Chapter 9 Differential Equations: live problems (original fibub questions). Ids start with c12m-de-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

// Runge-Kutta 4 from (x0, y0) to x1: a numerical check that needs no formula for the solution.
const rk4 = (F, x0, y0, x1, N = 400) => { const h = (x1 - x0) / N; let x = x0, y = y0; for (let i = 0; i < N; i++) { const k1 = F(x, y), k2 = F(x + h / 2, y + h * k1 / 2), k3 = F(x + h / 2, y + h * k2 / 2), k4 = F(x + h, y + h * k3); y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += h; } return y; };

export default tidyProblems({
  'c12m-de-order': {
    title: 'order times degree',
    make(r) {
      const o = choose(r, [1, 2, 3]), d = choose(r, [1, 2, 3, 4]), low = o > 1 ? o - 1 : 0, ds = (k) => (k === 1 ? 'dy/dx' : `d<sup>${k}</sup>y/dx<sup>${k}</sup>`), pw = (e, p) => (p === 1 ? `${e}` : `(${e})<sup>${p}</sup>`);
      const eq = `${pw(ds(o), d)} + ${low ? pw(ds(low), 5) : 'y'} = x`;
      return { o, d, q: `<p>For the differential equation ${eq}, find (order) × (degree).</p>`, answer: o * d, unit: '', tol: 0, abs: 0.001,
        hint: 'Order is the highest derivative that appears; degree is the power of that highest derivative. A power on a lower derivative does not count.',
        solution: steps(`The highest derivative is ${ds(o)}, so the order is ${o}.`, `It is raised to the power ${d}, so the degree is ${d}.`, `Order × degree = <b>${o * d}</b>.`) };
    },
    verify: (x) => x.d * x.o,
  },
  'c12m-de-growth': {
    title: 'dy/dx = ky, find y',
    make(r) {
      const k = choose(r, [0.1, 0.2, 0.3, -0.1, -0.2, -0.4]), y0 = pick(r, 2, 9), a = pick(r, 2, 5), answer = y0 * Math.exp(k * a);
      return { k, y0, a, q: `<p>The amount of a medicine or a culture satisfies dy/dt = ${k}y with y(0) = ${y0}. Find y when t = ${a}.</p>`, answer, unit: '', tol: 0.01, abs: 0.01,
        hint: 'Separate: dy/y = k dt. Integrate to get ln y = kt + C, so y = y₀ e^(kt).',
        solution: steps('Separate the variables: dy/y = k dt.', `Integrate: ln y = ${k}t + C. With y(0) = ${y0}, y = ${y0} e<sup>${k}t</sup>.`, `At t = ${a}: y = ${y0}·e<sup>${n(k * a)}</sup> = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => rk4((t, y) => x.k * y, 0, x.y0, x.a),
  },
  'c12m-de-sep': {
    title: 'separable: y dy = x dx',
    make(r) {
      const y0 = pick(r, 1, 5), a = pick(r, 2, 6), answer = Math.sqrt(y0 * y0 + a * a);
      return { y0, a, q: `<p>Solve dy/dx = x/y with y(0) = ${y0} and find y when x = ${a}. (y is positive.)</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: 'Separate: y dy = x dx. Integrate both sides and use the starting value to find the constant.',
        solution: steps('y dy = x dx, so y²/2 = x²/2 + C, i.e. y² = x² + K.', `y(0) = ${y0} gives K = ${y0 * y0}. So y² = x² + ${y0 * y0}.`, `At x = ${a}: y = √(${a * a} + ${y0 * y0}) = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => rk4((t, y) => t / y, 0, x.y0, x.a),
  },
  'c12m-de-linear': {
    title: 'linear equation, integrating factor',
    make(r) {
      const p = choose(r, [1, 2, 3]), qq = pick(r, 2, 9), y0 = pick(r, 0, 5), a = choose(r, [0.5, 1, 2]), answer = qq / p + (y0 - qq / p) * Math.exp(-p * a);
      return { p, qq, y0, a, q: `<p>Solve dy/dx + ${p}y = ${qq} with y(0) = ${y0}, and find y when x = ${a}.</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: `The integrating factor is e^(∫${p} dx) = e^(${p}x). Multiply through: d/dx(y e^(${p}x)) = ${qq} e^(${p}x).`,
        solution: steps(`IF = e<sup>${p}x</sup>. Then d/dx(y e<sup>${p}x</sup>) = ${qq}e<sup>${p}x</sup>.`, `Integrate: y e<sup>${p}x</sup> = ${n(qq / p)}e<sup>${p}x</sup> + C, so y = ${n(qq / p)} + C e<sup>−${p}x</sup>. With y(0) = ${y0}: C = ${n(y0 - qq / p)}.`, `At x = ${a}: y = ${n(qq / p)} + ${n(y0 - qq / p)}e<sup>${n(-p * a)}</sup> = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => rk4((t, y) => x.qq - x.p * y, 0, x.y0, x.a),
  },
  'c12m-de-homog': {
    title: 'homogeneous equation, y = vx',
    make(r) {
      const c = pick(r, 1, 4), a = choose(r, [2, 3, 4]), answer = a * (Math.log(a) + c);
      return { c, a, q: `<p>Solve the homogeneous equation dy/dx = (x + y)/x with y(1) = ${c} and find y when x = ${a}.</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: 'Put y = vx, so dy/dx = v + x dv/dx. The equation becomes x dv/dx = 1.',
        solution: steps('y = vx: v + x dv/dx = 1 + v, so x dv/dx = 1 and dv = dx/x.', `v = ln x + C, so y = x(ln x + C). With y(1) = ${c}: C = ${c}.`, `At x = ${a}: y = ${a}(ln ${a} + ${c}) = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => rk4((t, y) => (t + y) / t, 1, x.c, x.a),
  },
  'c12m-de-cool': {
    title: 'cooling or doubling time',
    make(r) {
      const T = choose(r, [3, 4, 5, 6]), f = choose(r, [4, 8, 16, 3]), answer = T * Math.log2(f);
      return { T, f, q: `<p>A bacterial culture grows so that dy/dt is proportional to y, and it doubles every ${T} hours. In how many hours does it become ${f} times its starting size?</p>`, answer, unit: 'h', tol: 0.005, abs: 0.005,
        hint: 'y = y₀e^(kt) with e^(kT) = 2, so k = ln 2/T. Then solve e^(kt) = f.',
        solution: steps(`k = ln 2 / ${T} = ${n(Math.log(2) / T)} per hour.`, `e<sup>kt</sup> = ${f}, so t = ln ${f} / k.`, `t = ${T} · ln ${f} / ln 2 = <b>${n(answer)} h</b>.`) };
    },
    verify: (x) => { let t = 0; const k = Math.log(2) / x.T; while (Math.exp(k * t) < x.f - 1e-12 && t < 1000) t += 0.0005; return Math.abs(Math.exp(k * t) - x.f) < 0.01 * x.f ? t : t; },
  },
}, ['c12m-de-linear']);
