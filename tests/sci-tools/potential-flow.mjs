// #959 potential flow: stagnation points against SymPy roots of dW/dz; Blasius force against the SymPy residue (Kutta-Joukowski).
import { PRESETS, stagnation, blasius, velocity, potential, contours } from '../../src/lib/sci/phpotential.ts';
export default async (check) => {
  const P = Object.fromEntries(PRESETS.map((p) => [p.id, p.flow]));
  const close = (pts, want) => pts.length === want.length && want.every((w, i) => Math.hypot(pts[i][0] - w[0], pts[i][1] - w[1]) < 1e-8);
  check('potential: cylinder stagnation points at (±1, 0) (SymPy)', close(stagnation(P.cyl, -3, 3, -2, 2), [[-1, 0], [1, 0]]));
  check('potential: cylinder top speed is 2U', Math.abs(velocity(P.cyl, 0, 1)[0] - 2) < 1e-12);
  check('potential: cylinder surface is a streamline (ψ = 0 on r = 1)', [0.3, 1.2, 2.5, 4].every((t) => Math.abs(potential(P.cyl, Math.cos(t), Math.sin(t))[1]) < 1e-12));
  check('potential: spinning cylinder stagnation at (±0.8660, −0.5) (SymPy)', close(stagnation(P.lift, -3, 3, -2, 2), [[-Math.sqrt(3) / 2, -0.5], [Math.sqrt(3) / 2, -0.5]]));
  { const F = blasius(P.lift, 0, 0, 1.5, 1.2); check('potential: Blasius lift ρUΓ = 1.2 × 2π, no drag (SymPy residue, d\'Alembert)', Math.abs(F.Fy - 1.2 * 2 * Math.PI) < 1e-9 && Math.abs(F.Fx) < 1e-9); }
  check('potential: Rankine half-body stagnation at −Q/2πU = −1 (SymPy)', close(stagnation(P.half, -3, 3, -2, 2), [[-1, 0]]));
  check('potential: Rankine oval stagnation at ±√3 (SymPy)', close(stagnation(P.oval, -3, 3, -2, 2), [[-Math.sqrt(3), 0], [Math.sqrt(3), 0]]));
  { const F = blasius(P.oval, 0, 0, 2.5, 1); check('potential: closed Rankine oval feels no force', Math.hypot(F.Fx, F.Fy) < 1e-9); }
  { const v = velocity(P.vpair, 0, 0); check('potential: midway between a vortex pair the speed is 2Γ/(πd) = 8/(1.2π) to the right', Math.abs(v[0] - 8 / (Math.PI * 1.2)) < 1e-12 && Math.abs(v[1]) < 1e-12); }
  { const f = { U: 2, alpha: 30, els: [] }, v = velocity(f, 0.3, 0.7); check('potential: uniform flow at 30°', Math.abs(v[0] - Math.sqrt(3)) < 1e-12 && Math.abs(v[1] - 1) < 1e-12); }
  { const g = new Float64Array([0, 1, 1, 0]); const c = contours(g, 2, 2, [0.5], 10); check('potential: marching squares saddle gives two segments', c.length === 2); }
  { const g = new Float64Array([0, 0, 5, 5]); check('potential: contours skip cells that jump across a branch cut', contours(g, 2, 2, [2], 4).length === 0 && contours(g, 2, 2, [2], 6).length === 1); }
};
