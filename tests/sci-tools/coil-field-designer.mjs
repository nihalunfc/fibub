// #910 coil field designer: loop fields checked against a direct numerical Biot-Savart integral (SciPy quad),
// elliptic integrals against SciPy ellipk/ellipe, and the textbook Helmholtz and Maxwell results.
import * as C from '../../src/lib/sci/ph-coil.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
  check('coil: μ0 (CODATA 2022)', C.MU0 === 1.25663706127e-6);
  { const a = C.ellipKE(0.5), b = C.ellipKE(0.99);
    check('coil: K(0.5), E(0.5) match SciPy', rel(a.K, 1.8540746773013719, 1e-13) && rel(a.E, 1.3506438810476755, 1e-13));
    check('coil: K(0.99), E(0.99) match SciPy', rel(b.K, 3.6956373629898747, 1e-12) && rel(b.E, 1.015993545025224, 1e-12)); }
  for (const [a, NI, r, z, br, bz] of [[0.1, 100, 0.05, 0.03, 0.0001638712361249026, 0.0006035865099578274], [0.1, 100, 0.15, -0.02, -9.612034748990533e-05, -0.000139779939033087], [0.2, 50, 0.01, 0.3, 9.272105494293674e-07, 2.6771819987990165e-05]]) {
    const f = C.loopField(a, NI, r, z);
    check(`coil: off-axis loop field at r=${r}, z=${z} matches a Biot-Savart integral`, rel(f.br, br, 1e-9) && rel(f.bz, bz, 1e-9));
  }
  check('coil: on-axis field μ0NIa²/2(a²+z²)^1.5', rel(C.loopField(0.1, 100, 0, 0.07).bz, C.axisLoop(0.1, 100, 0.07), 1e-12) && C.loopField(0.1, 100, 0, 0.07).br === 0);
  check('coil: centre of a loop μ0NI/2a', rel(C.loopField(0.1, 1, 0, 0).bz, C.MU0 / 0.2, 1e-12));
  // Helmholtz, R = 10 cm, 100 turns, 1 A.
  const H = C.loops(C.preset('helmholtz', 0.1, 100, 1));
  check('coil: Helmholtz centre field (4/5)^1.5 μ0NI/R = 0.8992 mT', rel(C.fieldAt(H, 0, 0).bz, 0.0008991762854544921, 1e-12) && rel(C.helmholtzCentre(0.1, 100, 1), 0.0008991762854544921, 1e-12));
  check('coil: Helmholtz 1 % half-length 31.4 mm (SciPy brentq)', Math.abs(C.uniformLength(H, 0, 0.01, 1e-4, 0.1) - 0.0313746) < 1e-4);
  check('coil: Helmholtz 0.1 % half-length 17.3 mm', Math.abs(C.uniformLength(H, 0, 0.001, 1e-4, 0.1) - 0.0173071) < 1e-4);
  check('coil: Helmholtz has zero gradient at the centre', Math.abs(C.gradient(H, 0, 1e-4)) < 1e-9);
  // Maxwell coil: deviation along the axis grows as z⁶, so at 0.1 R it is about −2.0 × 10⁻⁶ (SciPy).
  { const M = C.loops(C.preset('maxwell', 1, 64, 1)), b0 = C.fieldAt(M, 0, 0).bz;
    check('coil: Maxwell deviation at 0.1 R and 0.2 R', rel(C.fieldAt(M, 0, 0.1).bz / b0 - 1, -2.0141594677669516e-06, 1e-5) && rel(C.fieldAt(M, 0, 0.2).bz / b0 - 1, -0.00012346196106993723, 1e-6));
    check('coil: Maxwell more uniform than Helmholtz', C.uniformLength(M, 0, 1e-3, 1e-3, 1) > C.uniformLength(C.loops(C.preset('helmholtz', 1, 64, 1)), 0, 1e-3, 1e-3, 1) * 1.5); }
  // Anti-Helmholtz: zero field at centre, gradient from the two loops' axial gradients.
  { const A = C.loops(C.preset('anti', 0.1, 100, 1)), z = (Math.sqrt(3) / 2) * 0.1;
    const want = 2 * (3 * C.MU0 * 100 * 0.01 * z) / (2 * Math.pow(0.01 + z * z, 2.5));
    check('coil: anti-Helmholtz zero field and 3μ0NIa²z/(a²+z²)^2.5 gradient', Math.abs(C.fieldAt(A, 0, 0).bz) < 1e-15 && rel(C.gradient(A, 0, 1e-5), want, 1e-6)); }
  // Divergence-free field: (1/r)∂(r Br)/∂r + ∂Bz/∂z = 0.
  { const L = C.loops(C.preset('helmholtz', 0.1, 100, 1)), r = 0.04, z = 0.03, h = 1e-6;
    const d = ((r + h) * C.fieldAt(L, r + h, z).br - (r - h) * C.fieldAt(L, r - h, z).br) / (2 * h * r) + (C.fieldAt(L, r, z + h).bz - C.fieldAt(L, r, z - h).bz) / (2 * h);
    check('coil: ∇·B = 0 off the axis', Math.abs(d) < 1e-6 * C.fieldAt(L, r, z).b / 0.01); }
  // A winding pack split into loops keeps the ampere-turns and, far away, the field.
  { const thick = C.loops([{ R: 0.1, z: 0, N: 100, I: 1, w: 0.02, d: 0.01 }]);
    check('coil: winding pack shares the ampere-turns', thick.length === 25 && Math.abs(thick.reduce((s, l) => s + l.NI, 0) - 100) < 1e-9);
    check('coil: winding pack field far away equals a thin loop', rel(C.fieldAt(thick, 0, 1).bz, C.axisLoop(0.1, 100, 1), 1e-3)); }
  check('coil: anti-Helmholtz 1 % gradient half-length 25.1 mm (SciPy brentq)', Math.abs(C.gradientUniformLength(C.loops(C.preset('anti', 0.1, 100, 1)), 0, 0.01, 1e-4, 0.08) - 0.0250953) < 1e-4);
  check('coil: wire length N × 2πR', rel(C.wireLength(C.preset('helmholtz', 0.1, 100, 1)), 2 * 100 * 2 * Math.PI * 0.1, 1e-12));
  check('coil: uniform sphere of a Helmholtz pair is smaller than its 1 % axis length but not zero', (() => { const s = C.uniformSphere(H, 0, 0.01, 5e-4, 0.1); return s > 0.01 && s <= 0.0315; })());
};
