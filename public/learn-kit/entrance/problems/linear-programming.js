// Live problems for Linear programming.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
// constraints as [a, b, c] meaning ax + by ≤ c; x ≥ 0 and y ≥ 0 are written as −x ≤ 0 and −y ≤ 0
const ok = (cons, x, y) => cons.every(([a, b, c]) => a * x + b * y <= c + 1e-9);
const corners = (cons) => { const out = []; for (let i = 0; i < cons.length; i++) for (let j = i + 1; j < cons.length; j++) { const [a1, b1, c1] = cons[i], [a2, b2, c2] = cons[j], D = a1 * b2 - a2 * b1; if (Math.abs(D) < 1e-12) continue; const x = (c1 * b2 - c2 * b1) / D, y = (a1 * c2 - a2 * c1) / D; if (ok(cons, x, y)) out.push([x, y]); } return out; };
// clip a big square by each half-plane (Sutherland-Hodgman), then the shoelace area
const clipArea = (cons) => { let P = [[0, 0], [1e3, 0], [1e3, 1e3], [0, 1e3]]; for (const [a, b, c] of cons) { const Q = []; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length], fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c; if (fp <= 0) Q.push(p); if (fp * fq < 0) { const t = fp / (fp - fq); Q.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); } } P = Q; } let s = 0; for (let i = 0; i < P.length; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length]; s += x1 * y2 - x2 * y1; } return Math.abs(s) / 2; };
const setup = (r) => { const A = pick(r, 8, 20, 2), B = pick(r, Math.ceil(A * 0.75), 3 * A - 2); return { A, B }; };
const fr = (num) => (num % 5 === 0 ? `${num / 5}` : `${num}/5`);

export default {
  'lp-max': {
    title: 'maximise by the corner point method',
    make(r) {
      const { A, B } = setup(r), p = pick(r, 1, 6), q = pick(r, 1, 6);
      const X = (2 * B - A) / 5, Y = (3 * A - B) / 5;
      const C = [[0, 0], [B / 3, 0], [X, Y], [0, A / 2]], Z = C.map(([x, y]) => p * x + q * y), answer = Math.max(...Z);
      return { A, B, p, qq: q,
        q: `<p>Maximise Z = ${p}x + ${q}y subject to x + 2y ≤ ${A}, 3x + y ≤ ${B}, x ≥ 0, y ≥ 0. (Give the maximum value, 2 decimal places if needed.)</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'The feasible region is a quadrilateral. Find its corners (including where x + 2y = A meets 3x + y = B) and evaluate Z at each.',
        solution: steps(`Corners: (0, 0), (${n(B / 3)}, 0), (0, ${n(A / 2)}), and the meeting point of the two lines: x = (2×${B} − ${A})/5 = ${fr(2 * B - A)}, y = (3×${A} − ${B})/5 = ${fr(3 * A - B)}.`, `Z at the corners: ${C.map(([x, y], i) => `(${n(x)}, ${n(y)}) → ${n(Z[i], 5)}`).join('; ')}.`, `The bounded region's maximum is at a corner: <b>Z = ${n(answer, 6)}</b>.`) };
    },
    // general corner search over every pair of boundary lines
    verify: (x) => { const cons = [[1, 2, x.A], [3, 1, x.B], [-1, 0, 0], [0, -1, 0]]; return Math.max(...corners(cons).map(([u, v]) => x.p * u + x.qq * v)); },
  },
  'lp-area': {
    title: 'area of a feasible region',
    make(r) {
      const { A, B } = setup(r);
      const X = (2 * B - A) / 5, Y = (3 * A - B) / 5;
      // split along the diagonal from the origin to the meeting point: two triangles
      const t1 = 0.5 * (B / 3) * Y, t2 = 0.5 * (A / 2) * X, answer = t1 + t2;
      return { A, B,
        q: `<p>Find the area of the feasible region x + 2y ≤ ${A}, 3x + y ≤ ${B}, x ≥ 0, y ≥ 0. (2 decimal places)</p>`,
        answer, unit: 'square units', tol: 0.001, abs: 0.01,
        hint: 'Find the four corners, then cut the quadrilateral into two triangles along the line from the origin to the meeting point of the two slanted lines.',
        solution: steps(`Corners: (0, 0), (${n(B / 3)}, 0), (${n(X)}, ${n(Y)}), (0, ${n(A / 2)}).`, `Triangle with base ${n(B / 3)} on the x-axis and height ${n(Y)}: area ${n(t1, 5)}.`, `Triangle with base ${n(A / 2)} on the y-axis and height ${n(X)}: area ${n(t2, 5)}.`, `Total = <b>${n(answer, 6)}</b>.`) };
    },
    verify: (x) => clipArea([[1, 2, x.A], [3, 1, x.B], [-1, 0, 0], [0, -1, 0]]),
  },
};
