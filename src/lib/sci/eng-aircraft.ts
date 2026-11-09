// Aircraft performance from a parabolic drag polar CD = CD0 + k CL², k = 1 / (π e AR): best lift-to-drag ratio, the
// speeds for least drag and least power, stall speed, Breguet range and endurance for jets and propeller aircraft,
// and a ground-roll estimate. Standard textbook flight mechanics (equations only). Plain TypeScript, no DOM.
import { atmosphere, G0 } from './eng-atmos.ts';

export type Engine = 'jet' | 'prop';
export type Aircraft = {
  mass: number; // take-off mass at the start of the leg, kg
  S: number; // wing area, m²
  span: number; // m
  CD0: number; e: number; CLmax: number;
  engine: Engine;
  thrust?: number; // jet: maximum thrust at take-off, N
  tsfc?: number; // jet: thrust-specific fuel consumption, 1/h (kg of fuel per kg-force per hour, = lb/(lbf·h))
  power?: number; // prop: shaft power at take-off, W
  eta?: number; // prop: propeller efficiency, 0..1
  bsfc?: number; // prop: brake-specific fuel consumption, kg/(kW·h)
  fuel: number; // fuel burned in cruise, kg
  alt: number; // cruise altitude, geometric m (ISA)
  fieldAlt?: number; // take-off field elevation, m (ISA)
  mu?: number; // rolling friction coefficient
  CLg?: number; // lift coefficient during the ground roll
};

export const polar = (CD0: number, k: number, CL: number) => CD0 + k * CL * CL;
export const speedFor = (W: number, rho: number, S: number, CL: number) => Math.sqrt((2 * W) / (rho * S * CL));

export function performance(a: Aircraft) {
  const AR = (a.span * a.span) / a.S, k = 1 / (Math.PI * a.e * AR);
  const W0 = a.mass * G0, W1 = (a.mass - a.fuel) * G0;
  const rho = atmosphere(a.alt).rho;
  const LDmax = 1 / (2 * Math.sqrt(a.CD0 * k));
  const CLmd = Math.sqrt(a.CD0 / k), CLmp = Math.sqrt((3 * a.CD0) / k), CLjr = Math.sqrt(a.CD0 / (3 * k));
  const LD = (CL: number) => CL / polar(a.CD0, k, CL);
  const at = (CL: number) => ({ CL, V: speedFor(W0, rho, a.S, CL), LD: LD(CL), D: W0 / LD(CL), P: (W0 / LD(CL)) * speedFor(W0, rho, a.S, CL) });
  const speeds = {
    stall: at(a.CLmax), minDrag: at(CLmd), minPower: at(CLmp), jetRange: at(CLjr),
  };
  const lnW = Math.log(W0 / W1);
  let range: { V: number; R: number; Ralt?: number; CL: number; note: string }, endurance: { E: number; CL: number; V: number; note: string };
  if (a.engine === 'jet') {
    const ct = (a.tsfc ?? 0.7) / 3600; // 1/s
    const CL = CLjr, V = speeds.jetRange.V;
    // Cruise climb (constant CL and speed, height rising as fuel burns): Breguet's classic form.
    const R = (V / ct) * LD(CL) * lnW;
    // Constant height and CL (speed falling as fuel burns).
    const Ralt = (2 / ct) * Math.sqrt(2 / (rho * a.S)) * (Math.sqrt(CL) / polar(a.CD0, k, CL)) * (Math.sqrt(W0) - Math.sqrt(W1));
    range = { V, R, Ralt, CL, note: 'best range: CL = √(CD0/3k), L/D = 0.866 (L/D)max' };
    endurance = { E: (1 / ct) * LDmax * lnW, CL: CLmd, V: speeds.minDrag.V, note: 'best endurance at (L/D)max, the least-drag speed' };
  } else {
    const eta = a.eta ?? 0.8, cp = ((a.bsfc ?? 0.3) / 3.6e6) * G0; // 1/m: weight of fuel per unit of shaft work
    range = { V: speeds.minDrag.V, R: (eta / cp) * LDmax * lnW, CL: CLmd, note: 'best range at (L/D)max, the least-drag speed' };
    const CL = CLmp, E = (eta / cp) * (CL ** 1.5 / polar(a.CD0, k, CL)) * Math.sqrt(2 * rho * a.S) * (1 / Math.sqrt(W1) - 1 / Math.sqrt(W0));
    endurance = { E, CL, V: speeds.minPower.V, note: 'best endurance at least power: CL = √(3 CD0/k), constant height' };
  }
  return { AR, k, W0, W1, rho, LDmax, CLmd, CLmp, CLjr, speeds, range, endurance, takeoff: takeoff(a, k) };
}

/**
 * Ground roll to lift-off at 1.2 × the stall speed, integrating m dV/dt = T − D − μ(W − L) in closed form for a
 * constant thrust. A propeller's thrust is taken as η P / (0.7 V_LO), its value at 70 % of lift-off speed, a usual
 * average. Ground effect is ignored, so the drag is a little high.
 */
export function takeoff(a: Aircraft, k = 1 / (Math.PI * a.e * (a.span * a.span) / a.S)) {
  const W = a.mass * G0, rho = atmosphere(a.fieldAlt ?? 0).rho, mu = a.mu ?? 0.03, CLg = a.CLg ?? 0.4;
  const Vs = speedFor(W, rho, a.S, a.CLmax), Vlo = 1.2 * Vs;
  const T = a.engine === 'jet' ? a.thrust ?? 0 : ((a.eta ?? 0.8) * (a.power ?? 0)) / (0.7 * Vlo);
  const A = G0 * (T / W - mu), B = (G0 / W) * 0.5 * rho * a.S * (polar(a.CD0, k, CLg) - mu * CLg);
  const ok = A - B * Vlo * Vlo > 0;
  const s = !ok ? Infinity : Math.abs(B) < 1e-12 ? (Vlo * Vlo) / (2 * A) : Math.log(A / (A - B * Vlo * Vlo)) / (2 * B);
  const t = !ok ? Infinity : Math.abs(B) < 1e-12 ? Vlo / A : Math.atanh(Vlo * Math.sqrt(B / A)) / Math.sqrt(A * B);
  // The simple one-line estimate s ≈ 1.44 W² / (g ρ S CLmax T), for comparison.
  const simple = (1.44 * W * W) / (G0 * rho * a.S * a.CLmax * T);
  return { rho, Vs, Vlo, T, s, t, simple, TW: T / W, ok };
}

/** Drag and power needed at speed V (level flight, weight W, density rho). */
export function dragAt(a: Pick<Aircraft, 'S' | 'CD0'>, k: number, W: number, rho: number, V: number) {
  const q = 0.5 * rho * V * V, CL = W / (q * a.S), D = q * a.S * polar(a.CD0, k, CL);
  return { CL, D, P: D * V, Dp: q * a.S * a.CD0, Di: q * a.S * k * CL * CL };
}

export const EXAMPLES: Record<string, Aircraft> = {
  // Made-up, rounded values for illustration, not any real aircraft.
  prop: { mass: 1100, S: 16, span: 11, CD0: 0.028, e: 0.78, CLmax: 1.6, engine: 'prop', power: 120000, eta: 0.8, bsfc: 0.3, fuel: 120, alt: 2500, fieldAlt: 300, mu: 0.04, CLg: 0.4 },
  jet: { mass: 8000, S: 28, span: 15, CD0: 0.022, e: 0.8, CLmax: 1.5, engine: 'jet', thrust: 30000, tsfc: 0.7, fuel: 2000, alt: 11000, fieldAlt: 300, mu: 0.02, CLg: 0.3 },
};
