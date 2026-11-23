// Class 12 Maths, Vector Algebra: live problems (original fibub questions). Ids start with c12m-vec-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

// (a, b, c, length): whole-number lengths
const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11], [2, 10, 11, 15]];
const sg = (r) => (r() < 0.5 ? -1 : 1);
const vec = (a) => `${a[0]}<b>i</b> ${a[1] < 0 ? '−' : '+'} ${Math.abs(a[1])}<b>j</b> ${a[2] < 0 ? '−' : '+'} ${Math.abs(a[2])}<b>k</b>`;

export default tidyProblems({
  'c12m-vec-mag': {
    title: 'magnitude and unit vector',
    make(r) {
      const [a, b, c, m] = choose(r, QUAD), s = [sg(r), sg(r), sg(r)], v = [a * s[0], b * s[1], c * s[2]], k = pick(r, 1, 3);
      return { v, m, k, q: `<p>Find the magnitude of the vector ${k === 1 ? '' : k + '('}${vec(v)}${k === 1 ? '' : ')'}.</p>`, answer: m * k, unit: '', tol: 0.005,
        hint: '|x i + y j + z k| = √(x² + y² + z²). A scalar multiplier k scales the length by |k|.',
        solution: steps(`The squares of the components: ${v[0] ** 2}, ${v[1] ** 2}, ${v[2] ** 2}; sum ${v[0] ** 2 + v[1] ** 2 + v[2] ** 2}.`, `Length of the vector inside = √${v[0] ** 2 + v[1] ** 2 + v[2] ** 2} = ${m}.`, k === 1 ? `Answer: <b>${m}</b>.` : `Multiplying by ${k} multiplies the length by ${k}: <b>${m * k}</b>.`) };
    },
    verify: (p) => Math.sqrt((p.v[0] * p.k) ** 2 + (p.v[1] * p.k) ** 2 + (p.v[2] * p.k) ** 2),
  },
  'c12m-vec-dot': {
    title: 'the scalar (dot) product',
    make(r) {
      const a = [pick(r, -5, 5), pick(r, -5, 5), pick(r, -5, 5)], b = [pick(r, -5, 5), pick(r, -5, 5), pick(r, -5, 5)];
      return { a, b, q: `<p>Find <b>a</b>·<b>b</b> for <b>a</b> = ${vec(a)} and <b>b</b> = ${vec(b)}.</p>`, answer: a[0] * b[0] + a[1] * b[1] + a[2] * b[2], unit: '', tol: 0.005, abs: 0.01,
        hint: 'Multiply matching components and add: a₁b₁ + a₂b₂ + a₃b₃.',
        solution: steps(`${a[0]}×${b[0]} = ${a[0] * b[0]}, ${a[1]}×${b[1]} = ${a[1] * b[1]}, ${a[2]}×${b[2]} = ${a[2] * b[2]}.`, `Sum = <b>${a[0] * b[0] + a[1] * b[1] + a[2] * b[2]}</b>.`) };
    },
    // |a + b|² = |a|² + |b|² + 2 a·b
    verify: (p) => { const s = p.a.map((x, i) => x + p.b[i]), sq = (v) => v[0] ** 2 + v[1] ** 2 + v[2] ** 2; return (sq(s) - sq(p.a) - sq(p.b)) / 2; },
  },
  'c12m-vec-proj': {
    title: 'projection of one vector on another',
    make(r) {
      const [x, y, z, m] = choose(r, QUAD), b = [x * sg(r), y * sg(r), z * sg(r)], a = [pick(r, -6, 6), pick(r, -6, 6), pick(r, -6, 6)], d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      return { a, b, m, q: `<p>Find the scalar projection (the component) of <b>a</b> = ${vec(a)} on <b>b</b> = ${vec(b)}.</p>`, answer: d / m, unit: '', tol: 0.01, abs: 0.01,
        hint: 'Projection of a on b = (a·b)/|b|.',
        solution: steps(`a·b = ${d}.`, `|b| = ${m}.`, `Projection = ${d}/${m} = <b>${n(d / m, 4)}</b>.`) };
    },
    // dot a with the unit vector of b
    verify: (p) => { const u = p.b.map((t) => t / Math.hypot(...p.b)); return p.a[0] * u[0] + p.a[1] * u[1] + p.a[2] * u[2]; },
  },
  'c12m-vec-cross': {
    title: 'area of a parallelogram',
    make(r) {
      const a = [pick(r, -4, 4), pick(r, -4, 4), pick(r, -4, 4)], b = [pick(r, -4, 4), pick(r, -4, 4), pick(r, -4, 4)];
      const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      return { a, b, q: `<p>A parallelogram has adjacent sides <b>a</b> = ${vec(a)} and <b>b</b> = ${vec(b)}. Find its area (it may not be a whole number: give 2 decimal places).</p>`, answer: Math.hypot(...c), unit: 'square units', tol: 0.01, abs: 0.01,
        hint: 'Area = |a × b|. Use the determinant for a × b, then take its length.',
        solution: steps(`a × b = (${a[1]}·${b[2]} − ${a[2]}·${b[1]}) i − (${a[0]}·${b[2]} − ${a[2]}·${b[0]}) j + (${a[0]}·${b[1]} − ${a[1]}·${b[0]}) k = ${vec(c)}.`, `|a × b| = √(${c[0] ** 2} + ${c[1] ** 2} + ${c[2] ** 2}) = <b>${n(Math.hypot(...c), 4)}</b>.`) };
    },
    // Lagrange: |a x b|² = |a|²|b|² − (a·b)²
    verify: (p) => { const sq = (v) => v[0] ** 2 + v[1] ** 2 + v[2] ** 2, d = p.a[0] * p.b[0] + p.a[1] * p.b[1] + p.a[2] * p.b[2]; return Math.sqrt(Math.max(0, sq(p.a) * sq(p.b) - d * d)); },
  },
  'c12m-vec-tri': {
    title: 'area of a triangle from its corners',
    make(r) {
      const P = [pick(r, 0, 6), pick(r, 0, 6)], Q = [pick(r, 0, 6), pick(r, 0, 6)], R = [pick(r, 0, 6), pick(r, 0, 6)], u = [Q[0] - P[0], Q[1] - P[1]], v = [R[0] - P[0], R[1] - P[1]], cr = u[0] * v[1] - u[1] * v[0];
      return { P, Q, R, q: `<p>Find the area of the triangle with corners A(${P[0]}, ${P[1]}), B(${Q[0]}, ${Q[1]}) and C(${R[0]}, ${R[1]}) using vectors. (If the three points lie on one line, the answer is 0.)</p>`, answer: Math.abs(cr) / 2, unit: 'square units', tol: 0.005, abs: 0.01,
        hint: 'Area = ½|AB × AC|. In the plane, AB × AC = (u₁v₂ − u₂v₁) k.',
        solution: steps(`AB = (${u[0]}, ${u[1]}), AC = (${v[0]}, ${v[1]}).`, `AB × AC = (${u[0]}·${v[1]} − ${u[1]}·${v[0]}) k = ${cr} k.`, `Area = ½ × |${cr}| = <b>${Math.abs(cr) / 2}</b>.`) };
    },
    // shoelace
    verify: (p) => Math.abs(p.P[0] * (p.Q[1] - p.R[1]) + p.Q[0] * (p.R[1] - p.P[1]) + p.R[0] * (p.P[1] - p.Q[1])) / 2,
  },
  'c12m-vec-work': {
    title: 'work done by a constant force',
    make(r) {
      const F = [pick(r, -4, 6), pick(r, -4, 6), pick(r, -4, 6)], d = [pick(r, 1, 5), pick(r, -3, 5), pick(r, -3, 5)];
      return { F, d, q: `<p>A force <b>F</b> = ${vec(F)} newtons moves a cart through a displacement <b>d</b> = ${vec(d)} metres. Find the work done in joules.</p>`, answer: F[0] * d[0] + F[1] * d[1] + F[2] * d[2], unit: 'J', tol: 0.005, abs: 0.01,
        hint: 'Work = F·d.',
        solution: steps(`F·d = ${F[0]}×${d[0]} + ${F[1]}×${d[1]} + ${F[2]}×${d[2]}.`, `= ${F[0] * d[0]} + ${F[1] * d[1]} + ${F[2] * d[2]} = <b>${F[0] * d[0] + F[1] * d[1] + F[2] * d[2]} J</b>.`) };
    },
    // |F||d| cos(theta) with theta from atan2(|F x d|, F.d)
    verify: (p) => { const c = [p.F[1] * p.d[2] - p.F[2] * p.d[1], p.F[2] * p.d[0] - p.F[0] * p.d[2], p.F[0] * p.d[1] - p.F[1] * p.d[0]], dt = p.F[0] * p.d[0] + p.F[1] * p.d[1] + p.F[2] * p.d[2], th = Math.atan2(Math.hypot(...c), dt); return Math.hypot(...p.F) * Math.hypot(...p.d) * Math.cos(th); },
  },
  'c12m-vec-section': {
    title: 'the section formula',
    make(r) {
      const A = [pick(r, -6, 6), pick(r, -6, 6), pick(r, -6, 6)], B = [pick(r, -6, 6), pick(r, -6, 6), pick(r, -6, 6)], m = pick(r, 1, 4), k = pick(r, 1, 4), ax = pick(r, 0, 2);
      const P = A.map((t, i) => (k * t + m * B[i]) / (m + k));
      return { A, B, m, k, ax, q: `<p>The point P divides the line segment from A(${A.join(', ')}) to B(${B.join(', ')}) internally in the ratio ${m} : ${k}. Find the ${['x', 'y', 'z'][ax]}-coordinate of P (2 decimal places).</p>`, answer: P[ax], unit: '', tol: 0.005, abs: 0.01,
        hint: 'r = (n·a + m·b)/(m + n) for the ratio m : n.',
        solution: steps(`P = (${k}A + ${m}B)/${m + k}.`, `${['x', 'y', 'z'][ax]}-coordinate = (${k}×${A[ax]} + ${m}×${B[ax]})/${m + k} = <b>${n(P[ax], 4)}</b>.`) };
    },
    // go the fraction m/(m+k) of the way from A to B
    verify: (p) => p.A[p.ax] + (p.m / (p.m + p.k)) * (p.B[p.ax] - p.A[p.ax]),
  },
}, ['c12m-vec-mag', 'c12m-vec-dot', 'c12m-vec-proj', 'c12m-vec-cross', 'c12m-vec-tri', 'c12m-vec-work']);
