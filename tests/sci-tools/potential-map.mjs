// #1402 Equipotentials and potential hills. Checked against a NumPy script: dipole ±2 nC at (12,14) and (24,14) cm,
// probe (18,20): V = 0, |E| = 3530.6438 V/m along +x; like charges: V = 423.67725 V. Field compared with a central
// difference of V; contour end points checked to lie on their level.
import * as P from '../../src/lib/sci/potential-map.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-9;

export default async (check) => {
  const dip = [{ q: 2, x: 12, y: 14 }, { q: -2, x: 24, y: 14 }], like = [{ q: 2, x: 12, y: 14 }, { q: 2, x: 24, y: 14 }];
  check('potential: dipole midline is 0 V', Math.abs(P.potential(dip, 18, 20)) < 1e-9);
  const f = P.field(dip, 18, 20);
  check('potential: dipole field matches NumPy', near(f.E, 3530.643785703689) && Math.abs(f.Ey) < 1e-9 && f.Ex > 0);
  check('potential: like charges add', near(P.potential(like, 18, 20), 423.6772542844426));
  let ok = true;
  const three = [{ q: 3, x: 10, y: 10 }, { q: -2, x: 24, y: 8 }, { q: 1, x: 20, y: 22 }];
  for (const [x, y] of [[5, 5], [17, 13], [30, 20], [15.5, 24.5]]) {
    const h = 1e-4, fx = -(P.potential(three, x + h, y) - P.potential(three, x - h, y)) / (2 * h / 100), fy = -(P.potential(three, x, y + h) - P.potential(three, x, y - h)) / (2 * h / 100);
    const e = P.field(three, x, y); if (!near(e.Ex, fx, 1e-5) || !near(e.Ey, fy, 1e-5)) ok = false;
  }
  check('potential: field = −grad V', ok);
  const g = [];
  for (let j = 0; j <= 56; j++) { const r = []; for (let i = 0; i <= 72; i++) r.push(P.potential(three, i * 0.5, j * 0.5)); g.push(r); }
  const segs = P.contour(g, 0, 0, 0.5, 200);
  let okc = segs.length > 20;
  for (const [x1, y1, x2, y2] of segs) for (const [x, y] of [[x1, y1], [x2, y2]]) if (Math.abs(P.potential(three, x, y) - 200) > 20) okc = false;
  check('potential: contour ends lie on the 200 V level (to the grid accuracy)', okc);
  const path = P.rollPath(dip, 18, 20, 36, 28), [ex, ey] = path[path.length - 1];
  let down = true;
  for (let k = 1; k < path.length; k++) if (P.potential(dip, ...path[k]) > P.potential(dip, ...path[k - 1]) + 1e-6) down = false;
  check('potential: test charge rolls downhill to the negative charge', down && Math.hypot(ex - 24, ey - 14) < 0.7);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of P.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('potential: 60 seeded question sets check out', okq);
};
