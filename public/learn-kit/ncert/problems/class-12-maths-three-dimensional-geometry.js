// Class 12 Maths, Three Dimensional Geometry: live problems (original fibub questions). Ids start with c12m-3d-.
import { pick, choose, n, steps } from './_util.js';

const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [3, 4, 12, 13], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9]];
const sg = (r) => (r() < 0.5 ? -1 : 1);
const sq = (v) => v[0] ** 2 + v[1] ** 2 + v[2] ** 2, dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const pt = (a) => `(${a.join(', ')})`;

export default {
  'c12m-3d-dc': {
    title: 'direction cosines of a line through two points',
    make(r) {
      const [a, b, c, m] = choose(r, QUAD), s = [sg(r), sg(r), sg(r)], d = [a * s[0], b * s[1], c * s[2]], P = [pick(r, -4, 4), pick(r, -4, 4), pick(r, -4, 4)], Q = P.map((t, i) => t + d[i]), ax = pick(r, 0, 2);
      return { P, Q, d, m, ax, q: `<p>Find the direction cosine ${['l (with the x-axis)', 'm (with the y-axis)', 'n (with the z-axis)'][ax]} of the line from P${pt(P)} to Q${pt(Q)}, for the direction P to Q (3 decimal places).</p>`, answer: d[ax] / m, unit: '', tol: 0.01, abs: 0.002,
        hint: 'Direction ratios = Q − P. Divide each by √(a² + b² + c²).',
        solution: steps(`Direction ratios: ${d.join(', ')}.`, `√(${d[0] ** 2} + ${d[1] ** 2} + ${d[2] ** 2}) = ${m}.`, `Direction cosine = ${d[ax]}/${m} = <b>${n(d[ax] / m, 3)}</b>.`) };
    },
    // cos of the angle between the direction and the matching axis
    verify: (p) => { const e = [0, 0, 0]; e[p.ax] = 1; return dt(p.Q.map((t, i) => t - p.P[i]), e) / Math.hypot(...p.Q.map((t, i) => t - p.P[i])); },
  },
  'c12m-3d-angle': {
    title: 'angle between two lines',
    make(r) {
      const A = choose(r, QUAD), B = choose(r, QUAD), a = [A[0] * sg(r), A[1] * sg(r), A[2] * sg(r)], b = [B[2] * sg(r), B[0] * sg(r), B[1] * sg(r)];
      return { a, b, ma: A[3], mb: B[3], q: `<p>Two lines have direction ratios ${pt(a)} and ${pt(b)}. Find cos θ for the (acute) angle θ between them, to 3 decimal places.</p>`, answer: Math.abs(dt(a, b)) / (A[3] * B[3]), unit: '', tol: 0.01, abs: 0.002,
        hint: 'cos θ = |a₁a₂ + b₁b₂ + c₁c₂| / (|b₁||b₂|).',
        solution: steps(`Dot product = ${dt(a, b)}.`, `|b₁| = ${A[3]}, |b₂| = ${B[3]}.`, `cos θ = ${Math.abs(dt(a, b))}/${A[3] * B[3]} = <b>${n(Math.abs(dt(a, b)) / (A[3] * B[3]), 3)}</b>.`) };
    },
    // cos = dot / sqrt(dot^2 + |cross|^2)
    verify: (p) => { const d = Math.abs(dt(p.a, p.b)), c = sq(cr(p.a, p.b)); return d / Math.sqrt(d * d + c); },
  },
  'c12m-3d-skew': {
    title: 'shortest distance between skew lines',
    make(r) {
      const PAIRS = [[[1, 0, 0], [0, 1, 1]], [[1, 1, 0], [0, 1, 1]], [[2, 1, 0], [1, 0, 1]], [[1, -1, 1], [2, 1, 0]], [[0, 1, 2], [1, 1, 0]], [[1, 2, 1], [1, 0, -1]]];
      const [b1, b2] = choose(r, PAIRS), a1 = [pick(r, -3, 3), pick(r, -3, 3), pick(r, -3, 3)], a2 = [pick(r, -3, 3), pick(r, -3, 3), pick(r, -3, 3)], nn = cr(b1, b2), dd = a2.map((t, i) => t - a1[i]);
      return { a1, b1, a2, b2, q: `<p>Find the shortest distance between the lines <b>r</b> = ${pt(a1)} + λ${pt(b1)} and <b>r</b> = ${pt(a2)} + μ${pt(b2)} (3 decimal places; if the lines meet it is 0).</p>`, answer: Math.abs(dt(dd, nn)) / Math.sqrt(sq(nn)), unit: 'units', tol: 0.01, abs: 0.002,
        hint: 'd = |(a₂ − a₁)·(b₁ × b₂)| / |b₁ × b₂|.',
        solution: steps(`b₁ × b₂ = ${pt(nn)}, |b₁ × b₂| = √${sq(nn)}.`, `a₂ − a₁ = ${pt(dd)}; dot with b₁ × b₂ = ${dt(dd, nn)}.`, `d = |${dt(dd, nn)}|/√${sq(nn)} = <b>${n(Math.abs(dt(dd, nn)) / Math.sqrt(sq(nn)), 4)}</b>.`) };
    },
    // minimise |a1 + s b1 - a2 - t b2| by solving the two normal equations
    verify: (p) => {
      const d = p.a2.map((t, i) => t - p.a1[i]), A = dt(p.b1, p.b1), B = -dt(p.b1, p.b2), C = dt(p.b2, p.b2), E = dt(d, p.b1), F = -dt(d, p.b2);
      // minimise |s b1 - t b2 - d|: [A B; B C][s t] = [E F]
      const det = A * C - B * B, s = (E * C - B * F) / det, t = (A * F - B * E) / det;
      return Math.hypot(...p.b1.map((x, i) => s * x - t * p.b2[i] - d[i]));
    },
  },
  'c12m-3d-parallel': {
    title: 'distance between parallel lines',
    make(r) {
      const [a, b, c, m] = choose(r, QUAD), b1 = [a, b, c], a1 = [pick(r, -3, 3), pick(r, -3, 3), pick(r, -3, 3)], a2 = [pick(r, -3, 3), pick(r, -3, 3), pick(r, -3, 3)], dd = a2.map((t, i) => t - a1[i]), cc = cr(dd, b1);
      return { a1, a2, b1, m, q: `<p>Find the distance between the parallel lines <b>r</b> = ${pt(a1)} + λ${pt(b1)} and <b>r</b> = ${pt(a2)} + μ${pt(b1)} (3 decimal places).</p>`, answer: Math.sqrt(sq(cc)) / m, unit: 'units', tol: 0.01, abs: 0.002,
        hint: 'd = |(a₂ − a₁) × b| / |b|.',
        solution: steps(`a₂ − a₁ = ${pt(dd)}.`, `(a₂ − a₁) × b = ${pt(cc)}, length √${sq(cc)}.`, `|b| = ${m}, so d = √${sq(cc)}/${m} = <b>${n(Math.sqrt(sq(cc)) / m, 4)}</b>.`) };
    },
    // d^2 = |a2 - a1|^2 - (component along b)^2
    verify: (p) => { const d = p.a2.map((t, i) => t - p.a1[i]), al = dt(d, p.b1) / Math.hypot(...p.b1); return Math.sqrt(Math.max(0, sq(d) - al * al)); },
  },
  'c12m-3d-perp': {
    title: 'perpendicular lines: find k',
    make(r) {
      const a1 = pick(r, 1, 5), a2 = pick(r, 1, 5), b2 = pick(r, -4, 4), c2 = pick(r, 1, 4), k = pick(r, -4, 4), b1 = -(a1 * a2 + k * c2) / b2;
      // choose b2 so that b1 is a whole number: b1 := integer, then solve for b2 is awkward, so build from k, c2, a1, a2, b1
      const b1i = pick(r, 1, 4), b2i = -(a1 * a2 + k * c2) / b1i;
      void b1; void b2;
      const B2 = Number.isInteger(b2i) ? b2i : -(a1 * a2 + k * c2), B1 = Number.isInteger(b2i) ? b1i : 1;
      return { a1, B1, a2, B2, c2, k, q: `<p>The lines with direction ratios (${a1}, ${B1}, k) and (${a2}, ${B2}, ${c2}) are perpendicular. Find k.</p>`, answer: k, unit: '', tol: 0.005, abs: 0.01,
        hint: 'Perpendicular lines: a₁a₂ + b₁b₂ + c₁c₂ = 0. Solve for k.',
        solution: steps(`${a1}×${a2} + ${B1}×${B2} + k×${c2} = 0.`, `${a1 * a2 + B1 * B2} + ${c2}k = 0.`, `k = <b>${k}</b>.`) };
    },
    verify: (p) => -(p.a1 * p.a2 + p.B1 * p.B2) / p.c2,
  },
  'c12m-3d-point': {
    title: 'a point on a line',
    make(r) {
      const [a, b, c] = choose(r, [[1, 2, 2], [2, 1, 3], [1, 3, 1], [2, 2, 1], [3, 1, 2]]), P = [pick(r, -3, 3), pick(r, -3, 3), pick(r, -3, 3)], lam = pick(r, -3, 3), ax = pick(r, 1, 2), X = P[0] + lam * a;
      return { P, a, b, c, X, ax, lam, q: `<p>A line passes through ${pt(P)} with direction ratios (${a}, ${b}, ${c}). Find the ${['x', 'y', 'z'][ax]}-coordinate of the point of the line whose x-coordinate is ${X}.</p>`, answer: P[ax] + lam * [a, b, c][ax], unit: '', tol: 0.005, abs: 0.01,
        hint: 'Write (x − x₁)/a = (y − y₁)/b = (z − z₁)/c = λ. Find λ from x, then use it for the other coordinate.',
        solution: steps(`λ = (${X} − ${P[0]})/${a} = ${lam}.`, `${['x', 'y', 'z'][ax]} = ${P[ax]} + ${lam}×${[a, b, c][ax]} = <b>${P[ax] + lam * [a, b, c][ax]}</b>.`) };
    },
    verify: (p) => p.P[p.ax] + ((p.X - p.P[0]) / p.a) * [p.a, p.b, p.c][p.ax],
  },
};
