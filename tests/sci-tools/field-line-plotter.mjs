// #909 field line plotter: fields and potentials checked against an independent NumPy/SciPy script
// (potential summed by hand, field from its numerical gradient), plus Gauss's law and textbook limits.
import * as F from '../../src/lib/sci/ph-fieldlines.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(Math.abs(b), 1e-30);
  const S = [
    { kind: 'point', x: 0, y: 0, q: 2e-9 }, { kind: 'point', x: 0.1, y: 0.05, q: -1e-9 },
    { kind: 'line', x: -0.05, y: 0.1, q: 0.5e-9 }, { kind: 'dipole', x: 0.05, y: -0.08, q: 1e-11, ang: 30 },
  ];
  check('fieldlines: k = 1/(4πε0)', rel(F.KE, 8987551786.170797, 1e-12));
  const ref = [
    [0.03, 0.04, 255.2239318727874, 6113.503419555855, 5979.1770310368975],
    [-0.1, -0.1, 101.71702080987535, -482.20841946999826, -594.9905221314111],
    [0.2, 0, 24.388956879556666, -130.1739352577158, 325.81647655405277],
  ];
  for (const [x, y, v, ex, ey] of ref) {
    const f = F.field(S, x, y);
    check(`fieldlines: V at (${x}, ${y}) matches SciPy`, rel(f.v, v, 1e-9));
    check(`fieldlines: E at (${x}, ${y}) matches the SciPy gradient`, rel(f.ex, ex, 1e-5) && rel(f.ey, ey, 1e-5));
  }
  // Point charge: 1 nC at 1 m gives 8.988 V and 8.988 V/m.
  { const f = F.field([{ kind: 'point', x: 0, y: 0, q: 1e-9 }], 1, 0); check('fieldlines: 1 nC at 1 m', rel(f.ex, 8.987551786, 1e-9) && rel(f.v, 8.987551786, 1e-9)); }
  // Dipole on its axis: E = 2kp/r³; on the perpendicular bisector E = −kp/r³.
  { const d = [{ kind: 'dipole', x: 0, y: 0, q: 1e-12, ang: 0 }];
    check('fieldlines: dipole axial field 2kp/r³', rel(F.field(d, 0.1, 0).ex, (2 * F.KE * 1e-12) / 1e-3, 1e-9));
    check('fieldlines: dipole equatorial field −kp/r³', rel(F.field(d, 0, 0.1).ex, (-F.KE * 1e-12) / 1e-3, 1e-9) && Math.abs(F.field(d, 0, 0.1).v) < 1e-15); }
  // Two ±q point charges far away look like a dipole p = q d.
  { const pair = [{ kind: 'point', x: -0.0005, y: 0, q: 1e-9 }, { kind: 'point', x: 0.0005, y: 0, q: -1e-9 }];
    const dip = [{ kind: 'dipole', x: 0, y: 0, q: 1e-12, ang: 180 }];
    check('fieldlines: a small ± pair matches a point dipole far away', rel(F.field(pair, 0.3, 0.2).ex, F.field(dip, 0.3, 0.2).ex, 1e-4)); }
  // Line charge: E = 2kλ/r = λ/(2πε0 r); Gauss: flux per metre = λ/ε0.
  { const l = [{ kind: 'line', x: 0, y: 0, q: 1e-9 }];
    check('fieldlines: line charge field λ/(2πε0 r)', rel(F.field(l, 0.5, 0).ex, 1e-9 / (2 * Math.PI * F.EPS0 * 0.5), 1e-12));
    check("fieldlines: Gauss's law around a line charge", rel(F.flux2D([S[2], { kind: 'line', x: 0.3, y: 0, q: 7e-9 }], -0.05, 0.1, 0.01), 0.5e-9 / F.EPS0, 1e-3)); }
  // −∇V = E for every kind, by central differences in this code.
  for (const s of S) { const h = 1e-6, x = 0.07, y = 0.02, f = F.fieldOf(s, x, y);
    const gx = -(F.fieldOf(s, x + h, y).v - F.fieldOf(s, x - h, y).v) / (2 * h), gy = -(F.fieldOf(s, x, y + h).v - F.fieldOf(s, x, y - h).v) / (2 * h);
    check(`fieldlines: E = −∇V for a ${s.kind}`, rel(f.ex, gx, 1e-5) && rel(f.ey, gy, 1e-5)); }
  // Coulomb force between two point charges: 1 nC and −1 nC 10 cm apart pull with 899 nN.
  { const p = [{ kind: 'point', x: 0, y: 0, q: 1e-9 }, { kind: 'point', x: 0.1, y: 0, q: -1e-9 }]; const f = F.forceOn(p, 0);
    check('fieldlines: Coulomb force', rel(f.fx, F.KE * 1e-18 / 0.01, 1e-9) && f.fy === 0); }
  // Two parallel line charges: force per metre λ1λ2/(2πε0 d).
  { const p = [{ kind: 'line', x: 0, y: 0, q: 1e-9 }, { kind: 'line', x: 0.2, y: 0, q: 2e-9 }, { kind: 'point', x: 0, y: 0.3, q: 5e-9 }]; const f = F.forceOn(p, 1);
    check('fieldlines: force per metre between line charges (point charges ignored)', rel(f.fx, 2e-18 / (2 * Math.PI * F.EPS0 * 0.2), 1e-9) && f.perMetre); }
  // Field lines of a ± pair: lines from + end on −; none from − are added (equal charges).
  { const p = [{ kind: 'point', x: -0.05, y: 0, q: 1e-9 }, { kind: 'point', x: 0.05, y: 0, q: -1e-9 }];
    const L = F.fieldLines(p, { x0: -0.2, x1: 0.2, y0: -0.15, y1: 0.15 }, 12);
    const ended = L.filter((l) => l.end === 1).length;
    check(`fieldlines: ± pair lines run from + to − (${L.length} lines, ${ended} end on −)`, L.length >= 12 && L.length <= 14 && ended >= 10 && L.every((l) => l.start === 0 || l.start === 1)); }
  // Lines per charge in proportion: +2 and +1 give 16 and 8.
  { const p = [{ kind: 'point', x: -0.05, y: 0, q: 2e-9 }, { kind: 'point', x: 0.05, y: 0, q: 1e-9 }];
    const L = F.fieldLines(p, { x0: -0.2, x1: 0.2, y0: -0.15, y1: 0.15 }, 16);
    check('fieldlines: line count in proportion to charge', L.filter((l) => l.start === 0).length === 16 && L.filter((l) => l.start === 1).length === 8); }
  // Equipotential contours of one point charge are circles of radius kq/V.
  { const p = [{ kind: 'point', x: 0, y: 0, q: 1e-9 }], box = { x0: -1, x1: 1, y0: -1, y1: 1 }, n = 201;
    const g = F.potentialGrid(p, box, n, n), seg = F.contour(g, n, n, box, 20);
    const r = seg.map((s) => Math.hypot(s[0], s[1])), want = F.KE * 1e-9 / 20;
    check(`fieldlines: 20 V contour is a circle of radius kq/V (${seg.length} segments)`, seg.length > 50 && r.every((x) => Math.abs(x - want) < 0.003));
    const lv = F.niceLevels(g); check('fieldlines: levels are round and positive for one + charge', lv.length >= 3 && lv.every((v) => v > 0)); }
};
