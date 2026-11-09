// #1161 Circle sectors and tangents. Checked against hand-worked answers (r = 21, θ = 60° with π = 22/7: sector
// 231 cm², arc 22 cm; r = 4, P 5 away gives tangent 3) and on random cases: radius ⟂ tangent, the two tangents
// equal, angles at P and O add to 180°.
import { sector, tangents } from '../../src/lib/sci/circle-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const s = sector(21, 60, 22 / 7);
  check('sector: r 21, 60°, π = 22/7 → area 231, arc 22, perimeter 64', near(s.area, 231) && near(s.arc, 22) && near(s.perimeter, 64));
  // Segment: 231 − (√3/4)·441 = 231 − 190.95 = 40.05 (Python: 441*sqrt(3)/4 = 190.9586015344687)
  check('segment: r 21, 60° → 231 − 190.9586 = 40.0414', near(s.segment, 231 - (441 * Math.sqrt(3)) / 4) && near(s.tri, 190.9586015344687, 1e-9));
  check('sector: 90° quarter circle with π, 180° segment = sector', near(sector(10, 90).area, 25 * Math.PI) && near(sector(10, 180).segment, sector(10, 180).area, 1e-9) && near(sector(7, 360, 22 / 7).area, 154));
  check('major sector and major segment add with minor ones to the whole circle', near(s.area + s.major, (22 / 7) * 441) && near(s.segment + s.majorSegment, (22 / 7) * 441));
  const t = tangents([0, 0], 4, [5, 0]);
  check('tangents: r 4, P at 5 → length 3, contact at (3.2, ±2.4)', near(t.len, 3) && near(t.T1[0], 3.2) && near(Math.abs(t.T1[1]), 2.4) && near(t.T1[1], -t.T2[1]));
  check('tangents: P inside or on the circle → none', tangents([0, 0], 4, [3, 0]) === null && tangents([0, 0], 4, [4, 0]) === null);
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const O = [Math.random() * 10, Math.random() * 10], r = 0.5 + Math.random() * 5, ang = Math.random() * 7, d = r * (1.01 + Math.random() * 4);
    const P = [O[0] + d * Math.cos(ang), O[1] + d * Math.sin(ang)], T = tangents(O, r, P);
    for (const X of [T.T1, T.T2]) {
      const rad = [X[0] - O[0], X[1] - O[1]], tan = [P[0] - X[0], P[1] - X[1]];
      if (!near(Math.hypot(...rad), r, 1e-9) || Math.abs(rad[0] * tan[0] + rad[1] * tan[1]) > 1e-9 * d * d || !near(Math.hypot(...tan), T.len, 1e-9)) ok = false;
    }
    if (!near(T.atP + T.atO, 180)) ok = false;
  }
  check('300 random cases: contact points on the circle, radius ⟂ tangent, PT1 = PT2, angles add to 180°', ok);
};
