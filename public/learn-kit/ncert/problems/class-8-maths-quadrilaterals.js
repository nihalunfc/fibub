// Class 8 Maths, Quadrilaterals: live problems (original fibub questions). Ids start with c8m-quad-.
import { pick, choose, n, steps } from './_util.js';

const HALF = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
export default {
  'c8m-quad-fourth': {
    title: 'the fourth angle',
    make(r) {
      const a = pick(r, 60, 110, 5), b = pick(r, 70, 120, 5), c = pick(r, 50, 100, 5);
      return { a, b, c, q: `<p>Three angles of a plot shaped like a quadrilateral are <b>${a}°</b>, <b>${b}°</b> and <b>${c}°</b>. Find the fourth angle.</p>`, answer: 360 - a - b - c, unit: '°', tol: 0.002,
        hint: 'The four angles of a quadrilateral add up to 360°.',
        solution: steps(`${a} + ${b} + ${c} = ${a + b + c}.`, `360 − ${a + b + c} = <b>${360 - a - b - c}°</b>.`) };
    },
    verify(x) { return 2 * 180 - (x.a + x.b + x.c); },
  },
  'c8m-quad-ratio': {
    title: 'neighbouring angles in a ratio',
    make(r) {
      const p = pick(r, 1, 5), q = p + pick(r, 1, 4);
      return { p, q2: q, q: `<p>Two neighbouring angles of a parallelogram are in the ratio <b>${p} : ${q}</b>. Find the larger angle, in degrees (decimals allowed).</p>`, answer: +((180 * q) / (p + q)).toFixed(3), unit: '°', tol: 0.003,
        hint: 'Neighbouring angles add up to 180°. Share 180° in the ratio.',
        solution: steps(`${p} + ${q} = ${p + q} equal parts make 180°.`, `One part = 180 ÷ ${p + q}.`, `Larger angle = ${q} parts = <b>${((180 * q) / (p + q)).toFixed(2)}°</b>.`) };
    },
    verify(x) { return 180 - (180 * x.p) / (x.p + x.q2); },
  },
  'c8m-quad-diagonals': {
    title: 'diagonals that bisect',
    make(r) {
      const x = pick(r, 3, 15), y = pick(r, 3, 15);
      return { x, y, q: `<p>The diagonals of a parallelogram ABCD meet at O. OA = <b>${x} cm</b> and OB = <b>${y} cm</b>. Find the sum AC + BD.</p>`, answer: 2 * (x + y), unit: 'cm', tol: 0.002,
        hint: 'The diagonals of a parallelogram bisect each other, so AC = 2 × OA and BD = 2 × OB.',
        solution: steps(`AC = 2 × ${x} = ${2 * x} cm.`, `BD = 2 × ${y} = ${2 * y} cm.`, `AC + BD = <b>${2 * (x + y)} cm</b>.`) };
    },
    verify(x) { return x.x + x.x + x.y + x.y; },
  },
  'c8m-quad-rhombus': {
    title: 'perimeter of a rhombus from its diagonals',
    make(r) {
      const [u, v, w] = choose(r, HALF), k = choose(r, [1, 2, 3]);
      return { u, v, k, q: `<p>The diagonals of a rhombus are <b>${2 * u * k} cm</b> and <b>${2 * v * k} cm</b>. Find its perimeter.</p>`, answer: 4 * w * k, unit: 'cm', tol: 0.002,
        hint: 'The diagonals of a rhombus cross at right angles and bisect each other. A side is the long side of a right triangle with the two half-diagonals. A rhombus has four equal sides.',
        solution: steps(`Half-diagonals: ${u * k} and ${v * k}.`, `Side² = ${(u * k) ** 2} + ${(v * k) ** 2} = ${(w * k) ** 2}, so the side is ${w * k} cm.`, `Perimeter = 4 × ${w * k} = <b>${4 * w * k} cm</b>.`) };
    },
    verify(x) { return 4 * Math.hypot(x.u * x.k, x.v * x.k); },
  },
  'c8m-quad-kite': {
    title: 'angles of a kite',
    make(r) {
      const e = pick(r, 50, 100, 5), t = pick(r, 40, 90, 5);
      return { e, t, q: `<p>In a kite ABCD, AB = AD and CB = CD. The angles at B and D are each <b>${e}°</b> and the angle at A is <b>${t}°</b>. Find the angle at C.</p>`, answer: 360 - 2 * e - t, unit: '°', tol: 0.002,
        hint: 'The angles at B and D of a kite are equal. All four angles add up to 360°.',
        solution: steps(`A + B + D = ${t} + ${e} + ${e} = ${t + 2 * e}.`, `C = 360 − ${t + 2 * e} = <b>${360 - 2 * e - t}°</b>.`) };
    },
    verify(x) { return 360 - (x.t + x.e + x.e); },
  },
  'c8m-quad-trap': {
    title: 'angles between parallel sides of a trapezium',
    make(r) {
      const a = pick(r, 50, 110, 5), b = pick(r, 60, 120, 5);
      return { a, b, q: `<p>In trapezium ABCD, AB is parallel to DC. Angle A = <b>${a}°</b> and angle B = <b>${b}°</b>. Find the sum of angles C and D.</p>`, answer: 360 - a - b, unit: '°', tol: 0.002,
        hint: 'Angles on the same slanting side between parallel lines add to 180°: A + D = 180° and B + C = 180°.',
        solution: steps(`D = 180 − ${a} = ${180 - a}°.`, `C = 180 − ${b} = ${180 - b}°.`, `C + D = ${180 - b} + ${180 - a} = <b>${360 - a - b}°</b>.`) };
    },
    verify(x) { return 180 - x.a + (180 - x.b); },
  },
};
