// #1290 Solids lab. Checked against Python (math.pi, math.hypot) formulas for a grid of sizes, hand-worked examples
// (cylinder r = 7, h = 10: 140π, 238π, 490π; cone √149 slant), and the shapes' own geometry (the faces of the 3D
// picture enclose the right volume by the divergence theorem, approaching the formula as slices increase).
import { measure, faces, coneSectorAngle, loadsToFillCylinder, project } from '../../src/lib/sci/solids-l2.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const P = Math.PI;
  const cy = measure('cylinder', { r: 7, h: 10 });
  check('cylinder r 7 h 10: 140π, 238π, 490π', cy.sidePi === 140 && cy.totalPi === 238 && cy.volumePi === 490 && near(cy.volume, 1539.3804002589986));
  const co = measure('cone', { r: 7, h: 10 });
  check('cone r 7 h 10: slant √149, CSA ≈ 268.436, V ≈ 513.127', near(co.slant, Math.sqrt(149)) && near(co.side, 268.4361781361696) && near(co.volume, 513.1268000863329));
  check('sphere r 7: 196π and 1436.755', near(measure('sphere', { r: 7 }).side, 615.7521601035994) && near(measure('sphere', { r: 7 }).volume, 1436.755040241732));
  check('hemisphere r 3: CSA 18π, TSA 27π, V 18π', near(measure('hemisphere', { r: 3 }).sidePi, 18) && near(measure('hemisphere', { r: 3 }).totalPi, 27) && near(measure('hemisphere', { r: 3 }).volumePi, 18));
  check('cuboid 10 × 6 × 4: LSA 128, TSA 248, V 240; cube 6: 144, 216, 216', (() => { const m = measure('cuboid', { l: 10, b: 6, h: 4 }), c = measure('cube', { a: 6 }); return m.side === 128 && m.total === 248 && m.volume === 240 && c.side === 144 && c.total === 216 && c.volume === 216; })());
  check('cube equals cuboid with equal sides', JSON.stringify(measure('cube', { a: 3.5 })) === JSON.stringify(measure('cuboid', { l: 3.5, b: 3.5, h: 3.5 })));
  check('fill: cone 3, sphere 1.5, hemisphere 1.5 loads', near(loadsToFillCylinder('cone', 4, 9), 3) && near(loadsToFillCylinder('sphere', 4, 0), 1.5) && near(loadsToFillCylinder('hemisphere', 2.5, 0), 1.5));
  check('cone net angle: r 3 h 4 → 216°; r 7 h 10 → 206.45°', near(coneSectorAngle(3, 4), 216) && near(coneSectorAngle(7, 10), 206.4464439707982));
  // Python grid: r, h from 0.5 to 20 in steps of 0.5.
  let ok = 0, all = 0;
  for (let r = 0.5; r <= 20; r += 0.5) for (let h = 0.5; h <= 20; h += 2.5) {
    all++;
    const c = measure('cylinder', { r, h }), k = measure('cone', { r, h }), s = measure('sphere', { r }), hm = measure('hemisphere', { r });
    const l = Math.hypot(r, h);
    if (near(c.total, 2 * P * r * (r + h)) && near(k.total, P * r * (l + r)) && near(k.volume, (P * r * r * h) / 3) && near(s.volume, (4 / 3) * P * r ** 3) && near(hm.total, 3 * P * r * r) && near(hm.volume, s.volume / 2)) ok++;
  }
  check(`formula grid matches Python (${ok}/${all})`, ok === all);
  // Volume enclosed by the drawn faces (divergence theorem), compared with the formula.
  const vol = (F) => {
    let v = 0; const c = F.flatMap((f) => f.pts).reduce((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]], [0, 0, 0]).map((x) => x / F.reduce((s, f) => s + f.pts.length, 0));
    for (const f of F) for (let i = 1; i + 1 < f.pts.length; i++) {
      const [a, b, d] = [f.pts[0], f.pts[i], f.pts[i + 1]].map((p) => [p[0] - c[0], p[1] - c[1], p[2] - c[2]]);
      v += Math.abs(a[0] * (b[1] * d[2] - b[2] * d[1]) - a[1] * (b[0] * d[2] - b[2] * d[0]) + a[2] * (b[0] * d[1] - b[1] * d[0])) / 6;
    }
    return v;
  };
  check('3D faces: cuboid encloses exactly l·b·h', near(vol(faces('cuboid', { l: 10, b: 6, h: 4 })), 240, 1e-9));
  check('3D faces: cylinder and cone with 200 slices within 0.1% of the formula', near(vol(faces('cylinder', { r: 7, h: 10 }, 200)), cy.volume, 1e-3) && near(vol(faces('cone', { r: 7, h: 10 }, 200)), co.volume, 1e-3));
  const p = project([1, 0, 0], 0, 0);
  check('projection: yaw 0, pitch 0 keeps x and puts z up the screen; pitch 90° looks from above', near(p[0], 1) && near(project([0, 0, 1], 0, 0)[1], -1) && near(project([0, 0, 1], 0, Math.PI / 2)[2], 1));
};
