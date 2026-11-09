// #635 D-H forward kinematics. Checked against an independent numpy implementation (products of Rz, Tz, Tx, Rx
// in both conventions), scipy's Rotation (ZYX Euler angles and quaternions) and a finite-difference Jacobian on
// the 4 example arms and 24 random tables: largest differences 1e-14 (pose), 6e-14° (angles), 1.2e-8 (Jacobian).
import { forward, genericRank, rpy, quaternion, axisAngle, jacobian, convert, linkTransform, DH_EXAMPLES } from '../../src/lib/sci/ctl-dh.ts';
export default async (check) => {
  const near = (a, b, t = 1e-4) => Math.abs(a - b) <= t;
  const ex = Object.fromEntries(DH_EXAMPLES.map((e) => [e.id, e]));
  // Planar 2-link: x = L1 cos θ1 + L2 cos(θ1+θ2).
  { const e = ex.planar2, f = forward(e.rows, e.q, 'standard'), r = Math.PI / 180;
    check('dh: planar 2-link end point from the closed form', near(f.end[0][3], 0.5 * Math.cos(30 * r) + 0.4 * Math.cos(75 * r), 1e-12) && near(f.end[1][3], 0.5 * Math.sin(30 * r) + 0.4 * Math.sin(75 * r), 1e-12) && near(rpy(f.end).yaw, 75, 1e-9)); }
  // 6-axis example, numpy: position (0.5329, 0.3076, 1.0860), yaw -150, pitch -25, roll 0.
  { const e = ex.arm6, f = forward(e.rows, e.q, 'standard'), a = rpy(f.end), qt = quaternion(f.end);
    check('dh: 6-axis example pose matches numpy', near(f.end[0][3], 0.5329) && near(f.end[1][3], 0.3076) && near(f.end[2][3], 1.0860) && near(f.end[0][0], -0.7849) && near(f.end[2][2], 0.9063));
    check('dh: 6-axis example roll, pitch, yaw and quaternion match scipy', near(a.roll, 0, 1e-9) && near(a.pitch, -25, 1e-9) && near(a.yaw, -150, 1e-9) && near(qt[0], 0.2527) && near(qt[3], -0.9430));
    const aa = axisAngle(f.end); check('dh: axis-angle is consistent with the quaternion', near(Math.cos((aa.angle * Math.PI) / 360), qt[0], 1e-12));
    check('dh: 6-axis Jacobian has full rank 6 here', jacobian(e.rows, f).rank === 6); }
  // SCARA (prismatic joint) and the spherical arm, numpy.
  { const e = ex.scara, f = forward(e.rows, e.q, 'standard'); check('dh: SCARA example (with a prismatic joint) matches numpy', near(f.end[0][3], 0.3810) && near(f.end[1][3], 0.4151) && near(f.end[2][3], 0.3) && near(f.end[2][2], -1)); }
  { const e = ex.stanford, f = forward(e.rows, e.q, 'standard'); check('dh: spherical RRP arm matches numpy', near(f.end[0][3], 0.0884) && near(f.end[1][3], 0.2298) && near(f.end[2][3], 0.6897)); }
  // Modified convention single row: Rx(α) Tx(a) Rz(θ) Tz(d).
  { const A = linkTransform({ type: 'R', theta: 30, d: 0.2, a: 0.1, alpha: 90 }, 0, 'modified');
    check('dh: modified-convention link transform (Craig form)', near(A[0][3], 0.1, 1e-12) && near(A[1][3], -0.2, 1e-12) && near(A[2][3], 0, 1e-12) && near(A[2][0], 0.5, 1e-12) && near(A[1][2], -1, 1e-12)); }
  // Converting between conventions keeps the end pose.
  for (const e of DH_EXAMPLES) {
    const f = forward(e.rows, e.q, 'standard'), c = convert(e.rows, 'standard'), g = forward(c.rows, c.map.map((i) => (i < 0 ? 0 : e.q[i])), 'modified');
    const back = convert(c.rows, 'modified'), h = forward(back.rows, back.map.map((i) => (i < 0 ? 0 : c.map[i] < 0 ? 0 : e.q[c.map[i]])), 'standard');
    check(`dh: ${e.id} standard → modified → standard keeps the end pose`, f.end.every((r, i) => r.every((x, j) => near(x, g.end[i][j], 1e-12) && near(x, h.end[i][j], 1e-12))));
  }
  // Jacobian against finite differences.
  { const e = ex.arm6, f = forward(e.rows, e.q, 'standard'), J = jacobian(e.rows, f).J, h = 1e-6; let worst = 0;
    e.rows.forEach((_, i) => { const qp = e.q.slice(), qm = e.q.slice(); qp[i] += h * 180 / Math.PI; qm[i] -= h * 180 / Math.PI; const p = forward(e.rows, qp, 'standard').end, m = forward(e.rows, qm, 'standard').end; for (let k = 0; k < 3; k++) worst = Math.max(worst, Math.abs((p[k][3] - m[k][3]) / (2 * h) - J[k][i])); });
    check(`dh: Jacobian linear part matches finite differences (${worst.toExponential(1)})`, worst < 1e-7); }
  { const e = ex.planar2, f = forward(e.rows, [30, 0], 'standard'); const j = jacobian(e.rows, f); const g = genericRank(e.rows, 'standard'); check('dh: stretched-out planar arm: tip can move in only 1 direction (position rank 1 < usual 2)', j.posRank === 1 && j.rank === 2 && g.posRank === 2 && g.rank === 2);
    check('dh: usual Jacobian ranks of the example arms (6, 2, 4, 3)', ['arm6', 'planar2', 'scara', 'stanford'].map((id) => genericRank(ex[id].rows, 'standard').rank).join() === '6,2,4,3'); }
};
