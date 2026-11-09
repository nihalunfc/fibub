// Charged particle motion in given fields with the Boris pusher, and the guiding-centre drift theory to compare with.
// Non-relativistic, SI units. Boris, J. P. (1970); drift formulas from Chen, Introduction to Plasma Physics, ch. 2.

export type V3 = [number, number, number];
export const E_CH = 1.602176634e-19, AMU = 1.66053906660e-27, ME = 9.1093837015e-31;
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
const norm = (a: V3) => Math.sqrt(dot(a, a));

export type Fields = (x: V3) => { E: V3; B: V3; g?: V3 };

/** One Boris step: velocity at half steps, position at whole steps. Exact energy conservation in a pure magnetic field. */
export function borisStep(x: V3, v: V3, q: number, m: number, dt: number, f: Fields): { x: V3; v: V3 } {
  const { E, B, g } = f(x);
  const a: V3 = [(q / m) * E[0] + (g?.[0] ?? 0), (q / m) * E[1] + (g?.[1] ?? 0), (q / m) * E[2] + (g?.[2] ?? 0)];
  const vm = add(v, a, dt / 2);
  const t: V3 = [(q / m) * B[0] * dt / 2, (q / m) * B[1] * dt / 2, (q / m) * B[2] * dt / 2];
  const s = 2 / (1 + dot(t, t));
  const vp = add(vm, cross(vm, t));
  const vplus = add(vm, cross(vp, t), s);
  const vn = add(vplus, a, dt / 2);
  return { x: add(x, vn, dt), v: vn };
}

/** Guiding-centre position: X + (m/q) (v × B)/B². */
export function guidingCentre(x: V3, v: V3, q: number, m: number, B: V3): V3 {
  const b2 = dot(B, B);
  return add(x, cross(v, B), m / (q * b2));
}

export type Scenario = 'exb' | 'gradb' | 'curv' | 'grav';
export type DriftIn = {
  scenario: Scenario; q: number; m: number; // charge (C) and mass (kg)
  B0: number; // T
  E?: number; // V/m, along x (E x B case)
  L?: number; // m, gradient length: B = B0 (1 + x/L) z (grad-B case)
  R0?: number; // m, major radius: B = B0 R0 / R in the toroidal direction (curvature case)
  g?: number; // m/s^2 along x, a steady force per unit mass (gravity drift case)
  Wperp: number; Wpar: number; // eV
  periods: number; steps: number; // gyro-periods to run, steps per gyro-period
};

export function fieldsFor(p: DriftIn): Fields {
  const B0 = p.B0;
  switch (p.scenario) {
    case 'exb': return () => ({ E: [p.E ?? 0, 0, 0], B: [0, 0, B0] });
    case 'gradb': return (x) => ({ E: [0, 0, 0], B: [0, 0, B0 * (1 + x[0] / (p.L ?? 1))] });
    case 'grav': return () => ({ E: [0, 0, 0], B: [0, 0, B0], g: [p.g ?? 0, 0, 0] });
    case 'curv': return (x) => {
      const R = Math.hypot(x[0], x[1]), b = (B0 * (p.R0 ?? 1)) / R;
      return { E: [0, 0, 0], B: [(-b * x[1]) / R, (b * x[0]) / R, 0] };
    };
  }
}

/** Drift velocity predicted by guiding-centre theory at the start point, as a vector (m/s). */
export function theoryDrift(p: DriftIn): V3 {
  const { q, m, B0 } = p, vperp = Math.sqrt((2 * p.Wperp * E_CH) / m), vpar = Math.sqrt((2 * p.Wpar * E_CH) / m);
  switch (p.scenario) {
    case 'exb': return [0, -(p.E ?? 0) / B0, 0]; // E x B / B^2 with E = E x, B = B z
    case 'grav': return [0, -(m * (p.g ?? 0)) / (q * B0), 0]; // F x B / (q B^2)
    case 'gradb': { // (m v_perp^2 / 2 q B) (B x grad B)/B^2, grad B = B0/L x
      const L = p.L ?? 1;
      return [0, (m * vperp * vperp) / (2 * q * B0) * (1 / L), 0];
    }
    case 'curv': { // (m / q B R)(v_par^2 + v_perp^2 / 2) along z at R = R0
      const R = p.R0 ?? 1;
      return [0, 0, (m / (q * B0 * R)) * (vpar * vpar + (vperp * vperp) / 2)];
    }
  }
}

/** Run the Boris pusher. Returns the path, the measured guiding-centre drift and energy check. */
export function simulate(p: DriftIn) {
  const { q, m, B0 } = p, f = fieldsFor(p);
  const wc = (Math.abs(q) * B0) / m, Tc = (2 * Math.PI) / wc, dt = Tc / p.steps;
  const vperp = Math.sqrt((2 * p.Wperp * E_CH) / m), vpar = Math.sqrt((2 * p.Wpar * E_CH) / m);
  const rL = vperp / wc;
  let x: V3, v: V3;
  if (p.scenario === 'curv') { x = [p.R0 ?? 1, 0, 0]; v = [vperp, vpar, 0]; } // perpendicular part along R, parallel along phi
  else { x = [-(m / q) * vperp / B0, 0, 0]; v = [0, vperp, vpar]; } // guiding centre starts at the origin
  const n = Math.round(p.periods * p.steps);
  const path: V3[] = [x], vel: V3[] = [v];
  for (let i = 0; i < n; i++) { const s = borisStep(x, v, q, m, dt, f); x = s.x; v = s.v; path.push(x); vel.push(v); }
  // Display plane: x-y (across B) for the straight-field cases, R-z (poloidal cut) for the curved field.
  const plane = (u: V3): [number, number] => (p.scenario === 'curv' ? [Math.hypot(u[0], u[1]), u[2]] : [u[0], u[1]]);
  const gcAvg = (from: number): [number, number] => {
    let a = [0, 0];
    for (let i = from; i < from + p.steps; i++) {
      const g = plane(guidingCentre(path[i], vel[i], q, m, f(path[i]).B));
      a = [a[0] + g[0] / p.steps, a[1] + g[1] / p.steps];
    }
    return a as [number, number];
  };
  const g0 = gcAvg(0), g1 = gcAvg(n - p.steps), span = (n - p.steps) * dt;
  const measured: [number, number] = [(g1[0] - g0[0]) / span, (g1[1] - g0[1]) / span];
  const th = theoryDrift(p), theory: [number, number] = p.scenario === 'curv' ? [th[0], th[2]] : [th[0], th[1]];
  const pts = path.map(plane);
  const ke = (u: V3) => 0.5 * m * dot(u, u);
  const ke0 = ke(vel[0]), ke1 = ke(vel[n]);
  return { path, pts, dt, Tc, wc, rL, vperp, vpar, measured, theory, ke0, ke1, n, gc0: g0 };
}

export const speed = norm;
