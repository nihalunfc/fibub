// #678 one-group diffusion. Analytic values checked against SciPy (j0, jn_zeros, brentq root-finding of k_eff(size) = 1
// in the physical size), and the finite-volume power iteration against the analytic k_eff and flux shapes, and against a
// separate node-based finite-difference eigenvalue solve (SciPy dense generalized eig).
import { buckling, extrapolated, extrap, keff1, kInf, L2, materialB2, criticalSize, twoGroup, besselJ0, J0_ZERO, fdSolve, shape, volume, EXAMPLE_ONE, EXAMPLE_TWO } from '../../src/lib/sci/eng-diffusion.ts';
const REF = {"j0zero": 2.4048255576957724, "kinf": 1.2564102564102564, "L2": 46.15384615384615, "keff": {"slab": 1.1300786038395751, "sphere": 0.9977408758160508, "cylinder": 0.9966264467538491, "cylinder_inf": 1.0506425416126077, "cuboid": 1.0074778188076075}, "crit": {"slab": 38.314888386244355, "sphere": 40.231888386244336, "cyl_inf": 30.347120526219545, "cyl_h1": 36.620068795893665, "cube": 69.17001616752502}, "j0": [1.0, 0.938469807240813, 0.7651976865579665, 0.5118276717359181, 0.22389077914123562, 1.326828430112823e-05, -0.2600519549019335, -0.1775967713143383], "two": {"kinf": 1.3177083333333333, "keff_sphere": 1.0619856577493814, "B2c": 0.005177013425235492}, "fd_slab_node_400": 1.1300787498663818};
export default async (check) => {
  const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
  const m = EXAMPLE_ONE, d = extrap(m.D);
  check('diffusion: J0 first zero and series', rel(J0_ZERO, REF.j0zero, 1e-15) && [0, 0.5, 1, 1.5, 2, 2.4048, 3, 5].every((x, i) => Math.abs(besselJ0(x) - REF.j0[i]) < 1e-13));
  check('diffusion: k∞ and L² of the example', rel(kInf(m), REF.kinf, 1e-15) && rel(L2(m), REF.L2, 1e-15));
  const G = { slab: { kind: 'slab', a: 60 }, sphere: { kind: 'sphere', R: 40 }, cylinder: { kind: 'cylinder', R: 35, H: 80 }, cylinder_inf: { kind: 'cylinder', R: 35 }, cuboid: { kind: 'cuboid', a: 70, b: 60, c: 90 } };
  for (const [k, g] of Object.entries(G)) check(`diffusion: k_eff of the ${k} matches SciPy (${keff1(m, buckling(extrapolated(g, d))).toFixed(6)})`, rel(keff1(m, buckling(extrapolated(g, d))), REF.keff[k], 1e-13));
  const B2c = materialB2(m);
  check('diffusion: critical slab, sphere, cylinders and cube match root-finding', rel(criticalSize('slab', B2c, d).a, REF.crit.slab, 1e-10) && rel(criticalSize('sphere', B2c, d).R, REF.crit.sphere, 1e-10) && rel(criticalSize('cylinder', B2c, d).R, REF.crit.cyl_inf, 1e-10) && rel(criticalSize('cylinder', B2c, d, 1).R, REF.crit.cyl_h1, 1e-10) && rel(criticalSize('cuboid', B2c, d).a, REF.crit.cube, 1e-10));
  { const c = criticalSize('cylinder', B2c, d, 1); check('diffusion: critical cylinder with H = D (extrapolated) is exactly critical', rel(keff1(m, buckling(extrapolated(c, d))), 1, 1e-12) && rel(c.H + 2 * d, 2 * (c.R + d), 1e-12)); }
  check('diffusion: no critical size when k∞ < 1', criticalSize('sphere', materialB2({ D: 1, sigA: 0.02, nuSigF: 0.018 }), 0) === null);
  const t = twoGroup(EXAMPLE_TWO);
  check(`diffusion: two-group k∞ ${t.kInf.toFixed(5)}, k_eff of a 50 cm sphere and critical B² match SciPy`, rel(t.kInf, REF.two.kinf, 1e-14) && rel(t.keff(Math.PI ** 2 / 2500), REF.two.keff_sphere, 1e-13) && rel(t.B2c, REF.two.B2c, 1e-9) && rel(t.keff(t.B2c), 1, 1e-12));
  // Finite volume vs analytic.
  for (const [k, g] of Object.entries(G)) {
    const ge = extrapolated(g, d), fd = fdSolve(m, ge, 400), an = keff1(m, buckling(ge));
    const mainLen = ge.kind === 'slab' || ge.kind === 'cuboid' ? ge.a : ge.R;
    const shapeErr = Math.max(...fd.x.map((x, i) => Math.abs(fd.phi[i] - shape(ge.kind === 'cuboid' ? { kind: 'slab', a: ge.a } : ge, x))));
    check(`diffusion: ${k} finite-volume k (${fd.k.toFixed(7)}) within 1e-5 of analytic, flux shape within 1e-3`, fd.converged && rel(fd.k, an, 1e-5) && shapeErr < 1e-3 && fd.x.at(-1) < mainLen);
  }
  { const ge = extrapolated(G.slab, d), k1 = fdSolve(m, ge, 100).k, k2 = fdSolve(m, ge, 200).k, an = keff1(m, buckling(ge));
    check('diffusion: finite-volume error falls about 4× when cells double (second order)', Math.abs(k1 - an) / Math.abs(k2 - an) > 3.5 && Math.abs(k1 - an) / Math.abs(k2 - an) < 4.5);
    check('diffusion: agrees with an independent node-based SciPy eigen solve', rel(fdSolve(m, ge, 400).k, REF.fd_slab_node_400, 2e-7)); }
  check('diffusion: volumes', rel(volume({ kind: 'sphere', R: 10 }), 4188.790204786391, 1e-14) && volume({ kind: 'cylinder', R: 1 }) === Infinity && rel(volume({ kind: 'cylinder', R: 1, H: 2 }), 2 * Math.PI, 1e-15));
};
