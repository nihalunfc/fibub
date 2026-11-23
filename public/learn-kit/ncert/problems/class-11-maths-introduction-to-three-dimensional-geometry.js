// Class 11 Maths, Introduction to Three-dimensional Geometry: live problems (original fibub questions). Ids start with c11m-3d-.
import { pick, choose, n, steps } from './_util.js';

const sg = (v) => (v < 0 ? '−' + Math.abs(v) : String(v));
const pt = (p) => `(${p.map(sg).join(', ')})`;
export default {
  'c11m-3d-dist': {
    title: 'distance between two points in space',
    make(r) {
      const A = [pick(r, -5, 5), pick(r, -5, 5), pick(r, -5, 5)], B = [A[0] + choose(r, [3, -4, 6, 2, -2, 8]), A[1] + choose(r, [4, 12, -3, 6, 2, 1]), A[2] + choose(r, [12, 0, 4, -6, 9, 2])];
      const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
      return { A, B, q: `<p>Find the distance between A${pt(A)} and B${pt(B)} (a decimal to 2 places).</p>`, answer: Math.sqrt(d[0] ** 2 + d[1] ** 2 + d[2] ** 2), unit: 'units', tol: 0.01,
        hint: 'AB = √((x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²).',
        solution: steps(`Differences: ${d.map(sg).join(', ')}.`, `Squares: ${d.map((t) => t * t).join(' + ')} = ${d.reduce((s, t) => s + t * t, 0)}.`, `AB = <b>${n(Math.sqrt(d.reduce((s, t) => s + t * t, 0)), 4)}</b>.`) };
    },
    // floor diagonal first, then the vertical edge
    verify: (p) => { const fl = Math.hypot(p.B[0] - p.A[0], p.B[1] - p.A[1]); return Math.hypot(fl, p.B[2] - p.A[2]); },
  },
  'c11m-3d-octant': {
    title: 'which octant is the point in?',
    make(r) {
      const P = [pick(r, -6, 6), pick(r, -6, 6), pick(r, -6, 6)].map((v) => v || 1), OCT = [[1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1]];
      const k = OCT.findIndex((o) => o.every((s, i) => s === Math.sign(P[i])));
      return { P, q: `<p>In which octant does the point ${pt(P)} lie? Octants are numbered I (+, +, +), II (−, +, +), III (−, −, +), IV (+, −, +), V (+, +, −), VI (−, +, −), VII (−, −, −), VIII (+, −, −). Type the number (1 to 8).</p>`, answer: k + 1, unit: '', tol: 0,
        hint: 'Write the signs of x, y and z in that order and match them with the list.',
        solution: steps(`Signs of ${pt(P)}: (${P.map((t) => (t > 0 ? '+' : '−')).join(', ')}).`, `That matches octant number <b>${k + 1}</b>.`) };
    },
    // top half (z > 0) are 1-4, bottom 5-8; within each half the quadrant gives 1..4
    verify: (p) => { const [x, y, z] = p.P, quad = x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 && y < 0 ? 3 : 4; return quad + (z > 0 ? 0 : 4); },
  },
  'c11m-3d-section': {
    title: 'a point dividing a segment in a ratio',
    make(r) {
      const m = pick(r, 1, 4), nn = pick(r, 1, 4), k = m + nn, A = [pick(r, -4, 4) * k, pick(r, -4, 4) * k, pick(r, -4, 4) * k], B = [pick(r, -4, 4) * k, pick(r, -4, 4) * k, pick(r, -4, 4) * k], ax = pick(r, 0, 2), nm = 'xyz'[ax];
      return { A, B, m, nn, ax, q: `<p>P divides the segment joining A${pt(A)} and B${pt(B)} internally in the ratio ${m} : ${nn}. Find the ${nm}-coordinate of P.</p>`, answer: (m * B[ax] + nn * A[ax]) / k, unit: '', tol: 0.001, abs: 0.001,
        hint: `P = ((m·x₂ + n·x₁)/(m + n), …) with m = ${m} and n = ${nn}.`,
        solution: steps(`${nm}-coordinates: ${A[ax]} for A and ${B[ax]} for B.`, `(${m}×${B[ax]} + ${nn}×${A[ax]}) ÷ ${k} = <b>${n((m * B[ax] + nn * A[ax]) / k, 4)}</b>.`) };
    },
    // walk the fraction m/(m+n) of the way from A to B
    verify: (p) => p.A[p.ax] + (p.m / (p.m + p.nn)) * (p.B[p.ax] - p.A[p.ax]),
  },
  'c11m-3d-centroid': {
    title: 'centroid of a triangle in space',
    make(r) {
      const A = [pick(r, -3, 3) * 3, pick(r, -3, 3) * 3, pick(r, -3, 3) * 3], B = [pick(r, -3, 3) * 3, pick(r, -3, 3) * 3, pick(r, -3, 3) * 3], C = [pick(r, -3, 3) * 3, pick(r, -3, 3) * 3, pick(r, -3, 3) * 3], ax = pick(r, 0, 2);
      return { A, B, C, ax, q: `<p>The vertices of a triangle are A${pt(A)}, B${pt(B)} and C${pt(C)}. Find the ${'xyz'[ax]}-coordinate of its centroid.</p>`, answer: (A[ax] + B[ax] + C[ax]) / 3, unit: '', tol: 0.001, abs: 0.001,
        hint: 'The centroid is the average of the three vertices, coordinate by coordinate.',
        solution: steps(`(${A[ax]} + ${B[ax]} + ${C[ax]}) ÷ 3.`, `= <b>${n((A[ax] + B[ax] + C[ax]) / 3, 4)}</b>.`) };
    },
    // the centroid divides a median in the ratio 2:1 from the vertex: G = (A + 2M)/3 with M the midpoint of BC
    verify: (p) => (p.A[p.ax] + 2 * ((p.B[p.ax] + p.C[p.ax]) / 2)) / 3,
  },
  'c11m-3d-axis': {
    title: 'distance of a point from a coordinate axis',
    make(r) {
      const P = [pick(r, -6, 6), pick(r, -6, 6), pick(r, -6, 6)], ax = pick(r, 0, 2), nm = 'xyz'[ax], o = [0, 1, 2].filter((i) => i !== ax);
      return { P, ax, q: `<p>Find the distance of the point ${pt(P)} from the ${nm}-axis (a decimal to 2 places).</p>`, answer: Math.hypot(P[o[0]], P[o[1]]), unit: 'units', tol: 0.01, abs: 0.001,
        hint: `The foot of the perpendicular on the ${nm}-axis has the same ${nm}-coordinate and zeros for the other two. Use the distance formula, or square-root the sum of the other two squares.`,
        solution: steps(`The foot on the ${nm}-axis is ${pt([0, 1, 2].map((i) => (i === ax ? P[i] : 0)))}.`, `Distance = √(${P[o[0]]}² + ${P[o[1]]}²) = <b>${n(Math.hypot(P[o[0]], P[o[1]]), 4)}</b>.`) };
    },
    // distance formula from P to its foot on the axis
    verify: (p) => { const F = [0, 1, 2].map((i) => (i === p.ax ? p.P[i] : 0)); return Math.sqrt((p.P[0] - F[0]) ** 2 + (p.P[1] - F[1]) ** 2 + (p.P[2] - F[2]) ** 2); },
  },
};
