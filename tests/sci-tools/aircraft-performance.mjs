// #668 aircraft performance. Checked against an independent SciPy script: speeds by numerically minimising drag,
// power and drag/speed (minimize_scalar), Breguet range and endurance by numerical integration over the weight
// (quad), the ground roll by integrating m dV/dt = T − D − μ(W − L) with solve_ivp; density from a separately
// integrated standard atmosphere.
import { performance, takeoff, dragAt, EXAMPLES } from '../../src/lib/sci/eng-aircraft.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-6) => Math.abs(a / b - 1) < t;
  const p = performance(EXAMPLES.prop);
  check('aircraft: prop (L/D)max 12.8631 (SciPy)', rel(p.LDmax, 12.863108, 1e-6));
  check('aircraft: prop least-drag and least-power speeds (SciPy)', rel(p.speeds.minDrag.V, 44.228192, 1e-7) && rel(p.speeds.minPower.V, 33.606158, 1e-7));
  check('aircraft: prop stall speed 29.676 m/s', rel(p.speeds.stall.V, 29.676055, 1e-7));
  check('aircraft: prop Breguet range 1454.54 km (SciPy quad)', rel(p.range.R, 1454544.178, 1e-7));
  check('aircraft: prop endurance 38587 s (SciPy quad)', rel(p.endurance.E, 38586.9714, 1e-7));
  check('aircraft: prop ground roll 149.08 m, 9.255 s (SciPy solve_ivp)', rel(p.takeoff.s, 149.075285, 1e-6) && rel(p.takeoff.t, 9.2547637, 1e-6));
  const j = performance(EXAMPLES.jet);
  check('aircraft: jet (L/D)max and best-range speed (SciPy)', rel(j.LDmax, 15.1492397, 1e-7) && rel(j.speeds.jetRange.V, 199.78898, 1e-6));
  check('aircraft: jet best-range speed = 3^¼ × least-drag speed', rel(j.speeds.jetRange.V / j.speeds.minDrag.V, 3 ** 0.25, 1e-12));
  check('aircraft: jet cruise-climb range 3878.02 km (SciPy quad)', rel(j.range.R, 3878021.9, 1e-7));
  check('aircraft: jet constant-height range 3612.02 km (SciPy quad)', rel(j.range.Ralt, 3612018.0, 1e-7));
  check('aircraft: jet endurance 22413 s (SciPy quad)', rel(j.endurance.E, 22413.4183, 1e-7));
  check('aircraft: jet ground roll 653.85 m, 19.27 s (SciPy)', rel(j.takeoff.s, 653.85091, 1e-6) && rel(j.takeoff.t, 19.2716198, 1e-6));
  check('aircraft: L/D at least power and jet range = 0.866 (L/D)max', rel(j.speeds.minPower.LD / j.LDmax, Math.sqrt(3) / 2, 1e-12) && rel(j.speeds.jetRange.LD / j.LDmax, Math.sqrt(3) / 2, 1e-12));
  const d = dragAt(EXAMPLES.prop, p.k, p.W0, p.rho, p.speeds.minDrag.V);
  check('aircraft: parasite = induced drag at least-drag speed', rel(d.Dp, d.Di, 1e-9) && rel(d.D, p.W0 / p.LDmax, 1e-9));
  check('aircraft: too little thrust never lifts off', !takeoff({ ...EXAMPLES.jet, thrust: 1000 }).ok && takeoff({ ...EXAMPLES.jet, thrust: 1000 }).s === Infinity);
};
