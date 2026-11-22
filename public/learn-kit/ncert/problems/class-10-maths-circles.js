// Class 10 Maths, Circles: live problems (original fibub questions). Ids start with c10m-circ-.
import { pick, choose, n, steps } from './_util.js';

// right-triangle triples (leg, leg, hypotenuse) scaled by k
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
const tri = (r) => { const t = choose(r, TRI), k = choose(r, [1, 1, 2, 3]); const swap = r() < 0.5; const [a, b, c] = t; return swap ? [b * k, a * k, c * k] : [a * k, b * k, c * k]; };

export default {
  'c10m-circ-tlen': {
    title: 'the length of a tangent',
    make(r) {
      const [rad, t, d] = tri(r);
      return { rad, d, q: `<p>The radius of a circle is ${n(rad)} cm. A point P is ${n(d)} cm from the centre O. Find the length of a tangent drawn from P to the circle, in cm.</p>`, answer: t, unit: 'cm', tol: 0.001,
        hint: 'The tangent PT is perpendicular to the radius OT, so triangle OTP has a right angle at T. Use Pythagoras with OP as the hypotenuse.',
        solution: steps(`OT ⟂ PT, so OP² = OT² + PT².`, `PT² = ${n(d)}² − ${n(rad)}² = ${n(d * d)} − ${n(rad * rad)} = ${n(d * d - rad * rad)}.`, `PT = <b>${n(t)} cm</b>.`) };
    },
    verify: (x) => Math.sqrt((x.d - x.rad) * (x.d + x.rad)),
  },
  'c10m-circ-dist': {
    title: 'how far is the point from the centre?',
    make(r) {
      const [rad, t, d] = tri(r);
      return { rad, t, q: `<p>A tangent from an outside point P to a circle of radius ${n(rad)} cm is ${n(t)} cm long. How far is P from the centre of the circle, in cm?</p>`, answer: d, unit: 'cm', tol: 0.001,
        hint: 'Draw the radius to the point of contact. It makes a right angle with the tangent, so OP is the hypotenuse.',
        solution: steps(`The radius to the point of contact is perpendicular to the tangent.`, `OP² = r² + PT² = ${n(rad * rad)} + ${n(t * t)} = ${n(rad * rad + t * t)}.`, `OP = <b>${n(d)} cm</b>.`) };
    },
    verify: (x) => Math.hypot(x.rad, x.t),
  },
  'c10m-circ-aob': {
    title: 'the angle between two tangents',
    make(r) {
      const apb = pick(r, 30, 140, 5);
      return { apb, q: `<p>Two tangents PA and PB are drawn from an outside point P to a circle with centre O. If ∠APB = ${apb}°, find ∠AOB in degrees.</p>`, answer: 180 - apb, unit: '°', tol: 0.001,
        hint: 'In the quadrilateral OAPB, the angles at A and B are right angles (tangent ⟂ radius). The four angles of a quadrilateral add up to 360°.',
        solution: steps(`∠OAP = ∠OBP = 90°, since a tangent is perpendicular to the radius.`, `∠AOB = 360° − 90° − 90° − ${apb}°.`, `∠AOB = <b>${180 - apb}°</b>.`) };
    },
    verify: (x) => 360 - 180 - x.apb,
  },
  'c10m-circ-opq': {
    title: 'an angle in the tangent triangle',
    make(r) {
      const pou = pick(r, 20, 70, 5);
      return { pou, q: `<p>PQ is a tangent to a circle with centre O, touching it at P. If ∠POQ = ${pou}°, find ∠OQP in degrees.</p>`, answer: 90 - pou, unit: '°', tol: 0.001,
        hint: 'The tangent is perpendicular to the radius at P, so ∠OPQ = 90°. The angles of triangle OPQ add to 180°.',
        solution: steps(`∠OPQ = 90° (tangent ⟂ radius).`, `∠OQP = 180° − 90° − ${pou}°.`, `∠OQP = <b>${90 - pou}°</b>.`) };
    },
    verify: (x) => 180 - 90 - x.pou,
  },
  'c10m-circ-incircle': {
    title: 'tangent length from a corner of a triangle',
    make(r) {
      const x = pick(r, 2, 9, 0.5), y = pick(r, 2, 9, 0.5), z = pick(r, 2, 9, 0.5);
      const AB = x + y, BC = y + z, CA = z + x;
      return { AB, BC, CA, q: `<p>A circle is inscribed in triangle ABC (it touches all three sides). AB = ${n(AB)} cm, BC = ${n(BC)} cm and CA = ${n(CA)} cm. Find the length of the tangent from A to the circle, in cm.</p>`, answer: x, unit: 'cm', tol: 0.001,
        hint: 'Call the tangent lengths from A, B and C x, y and z. Tangents from one point are equal, so AB = x + y, BC = y + z and CA = z + x.',
        solution: steps(`With tangent lengths x, y, z from A, B, C: AB = x + y, BC = y + z, CA = z + x.`, `AB + CA − BC = (x + y) + (z + x) − (y + z) = 2x.`, `x = (${n(AB)} + ${n(CA)} − ${n(BC)}) ÷ 2 = <b>${n(x)} cm</b>.`) };
    },
    verify: (p) => (p.AB + p.BC + p.CA) / 2 - p.BC,
  },
  'c10m-circ-quad': {
    title: 'a quadrilateral round a circle',
    make(r) {
      const AB = pick(r, 5, 12), BC = pick(r, 6, 14), CD = pick(r, 4, 11), DA = AB + CD - BC;
      return { AB, BC, CD, q: `<p>A quadrilateral ABCD is drawn so that all four sides touch a circle. AB = ${n(AB)} cm, BC = ${n(BC)} cm and CD = ${n(CD)} cm. Find AD in cm.</p>`, answer: DA, unit: 'cm', tol: 0.001, abs: 0.001,
        hint: 'Tangents from each vertex are equal. Add the lengths and show AB + CD = BC + DA.',
        solution: steps(`Let the tangent lengths from A, B, C, D be p, q, r, s. Then AB = p + q, BC = q + r, CD = r + s, DA = s + p.`, `AB + CD = p + q + r + s = BC + DA.`, `AD = ${n(AB)} + ${n(CD)} − ${n(BC)} = <b>${n(DA)} cm</b>.`) };
    },
    verify: (x) => x.AB + x.CD - x.BC,
  },
  'c10m-circ-chord': {
    title: 'a chord that touches the inner circle',
    make(r) {
      const [rad, h, R] = tri(r);
      return { R, rad, h, q: `<p>Two concentric circles have radii ${n(R)} cm and ${n(rad)} cm. A chord of the larger circle touches the smaller circle. Find the length of the chord in cm.</p>`, answer: 2 * h, unit: 'cm', tol: 0.001,
        hint: 'The chord touches the small circle at M, so OM ⟂ chord, and a perpendicular from the centre bisects the chord. Half the chord is a leg of a right triangle with hypotenuse R.',
        solution: steps(`OM = ${n(rad)} cm is perpendicular to the chord, so M is its midpoint.`, `Half the chord = √(${n(R)}² − ${n(rad)}²) = √${n(R * R - rad * rad)} = ${n(h)} cm.`, `Chord = 2 × ${n(h)} = <b>${n(2 * h)} cm</b>.`) };
    },
    verify: (x) => 2 * Math.sqrt(x.R * x.R - x.rad * x.rad),
  },
};
