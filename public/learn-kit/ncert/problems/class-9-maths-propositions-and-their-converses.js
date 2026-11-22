// Class 9 Maths, Propositions and their Converses: live problems (original fibub questions). Ids start with c9m-logic-.
import { pick, choose, n, steps } from './_util.js';

const isPrime = (m) => { if (m < 2) return false; for (let d = 2; d * d <= m; d++) if (m % d === 0) return false; return true; };
export default {
  'c9m-logic-vert': {
    title: 'angles at crossing lines',
    make(r) {
      const a = pick(r, 25, 80), s = choose(r, ['next to', 'vertically opposite to']);
      const adj = s === 'next to';
      return { a, adj, q: `<p>Two straight lines cross. One of the four angles is ${a}°. What is the angle that is ${s} it (in degrees)?</p>`, answer: adj ? 180 - a : a, abs: 0.01, tol: 0, unit: '°',
        hint: adj ? 'Two angles next to each other on a straight line add up to 180°.' : 'Vertically opposite angles are equal (proved with two straight-line sums).',
        solution: steps(adj ? `Neighbouring angles lie on a straight line, so they add to 180°.` : `Vertically opposite angles are equal.`, adj ? `180° − ${a}° = <b>${180 - a}°</b>.` : `So the angle is <b>${a}°</b>.`) };
    },
    verify: (p) => (p.adj ? 360 - p.a - p.a - (180 - p.a) : p.a),
  },
  'c9m-logic-tri': {
    title: 'third angle of a triangle',
    make(r) {
      const a = pick(r, 30, 80), b = pick(r, 30, 80);
      return { a, b, q: `<p>Two angles of a triangle are ${a}° and ${b}°. Find the third angle (degrees).</p>`, answer: 180 - a - b, abs: 0.01, tol: 0, unit: '°',
        hint: 'The three angles of a triangle add up to 180° (proved with a line parallel to the base).',
        solution: steps(`Angle sum: ${a}° + ${b}° + third = 180°.`, `Third angle = 180° − ${a + b}° = <b>${180 - a - b}°</b>.`) };
    },
    verify: (p) => 360 - 180 - p.a - p.b,
  },
  'c9m-logic-isos': {
    title: 'base angle of an isosceles triangle',
    make(r) {
      const apex = pick(r, 20, 140, 2);
      return { apex, q: `<p>In an isosceles triangle the angle between the two equal sides is ${apex}°. Find each of the other two (equal) angles.</p>`, answer: (180 - apex) / 2, abs: 0.01, tol: 0, unit: '°',
        hint: 'The angles opposite equal sides are equal. All three add up to 180°.',
        solution: steps(`The two base angles are equal; call each b. Then ${apex}° + 2b = 180°.`, `2b = ${180 - apex}°, so b = <b>${(180 - apex) / 2}°</b>.`) };
    },
    verify: (p) => 90 - p.apex / 2,
  },
  'c9m-logic-isosx': {
    title: 'equal angles, find x',
    make(r) {
      const x = pick(r, 5, 20), p = pick(r, 2, 4), qd = pick(r, 1, 4), c = pick(r, 3, 15);
      const lhs = p * x + c, k = p + qd, d = lhs - k * x;
      return { x, p, qd, c, d, q: `<p>In triangle ABC, AB = AC. Angle B = (${p}x + ${c})° and angle C = (${k}x ${d < 0 ? '−' : '+'} ${Math.abs(d)})°. Find x.</p>`, answer: x, abs: 0.01, tol: 0, unit: '',
        hint: 'AB = AC, so the angles opposite them, C and B, are equal. Put the two expressions equal.',
        solution: steps(`Equal sides, so equal opposite angles: ${p}x + ${c} = ${k}x ${d < 0 ? '−' : '+'} ${Math.abs(d)}.`, `Collect x: ${c} ${d < 0 ? '+' : '−'} ${Math.abs(d)} = ${qd}x, so x = <b>${x}</b>.`) };
    },
    verify: (q) => { const k = q.p + q.qd; return (q.c - q.d) / q.qd + 0 * k; },
  },
  'c9m-logic-counter': {
    title: 'find the counterexample',
    make(r) {
      const k = pick(r, 1, 30);
      let m = k + 1; while (isPrime(2 * m + 1)) m++;
      return { k, q: `<p>Claim: “2n + 1 is prime for every whole number n.” Find the smallest n greater than ${k} for which 2n + 1 is <b>not</b> prime.</p>`, answer: m, abs: 0.01, tol: 0, unit: '',
        hint: `Try n = ${k + 1}, ${k + 2}, ... and test whether 2n + 1 has a factor other than 1 and itself.`,
        solution: steps(`Test n = ${k + 1}, ${k + 2}, ... until 2n + 1 has a factor.`, `At n = ${m}: 2n + 1 = ${2 * m + 1}, which is not prime, so <b>n = ${m}</b> is a counterexample.`) };
    },
    verify: (p) => { let m = p.k + 1; for (;;) { const v = 2 * m + 1; let comp = false; for (let d = 2; d < v; d++) if (v % d === 0) { comp = true; break; } if (comp) return m; m++; } },
  },
};
