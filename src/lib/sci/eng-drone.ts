// Multirotor flight time from momentum theory: hover power from the all-up weight, rotor area and a figure of merit,
// forward-flight power with Glauert's induced velocity plus body drag, electrical power through the motor and ESC
// efficiency, and flight time from the usable battery energy. Plain TypeScript, no DOM.
import { hoverPower } from './eng-prop.ts';

export const G = 9.80665;
export type Drone = {
  mass: number; // all-up mass, kg
  rotors: number; propD: number; // m
  FM: number; // rotor figure of merit
  eff: number; // motor and ESC efficiency (shaft power / electrical power)
  avionics: number; // W, flight controller, camera, radio
  wh: number; usable: number; // battery energy (Wh) and usable fraction
  rho: number; // air density, kg/m³
  CdA?: number; // body drag area, m²
  maxThrust?: number; // N per motor, from a test stand or maker's table
  volts?: number; // pack voltage for currents
};

/** Glauert induced velocity for a disc of area A carrying thrust T, tilted forward by alpha, at speed V. */
export function glauert(T: number, rho: number, A: number, V: number, alpha: number) {
  const vh = Math.sqrt(T / (2 * rho * A));
  if (V === 0) return vh;
  // Solve v = vh² / √((V cos α)² + (V sin α + v)²) by Newton's method from the hover value.
  let v = vh;
  for (let k = 0; k < 100; k++) {
    const s = Math.hypot(V * Math.cos(alpha), V * Math.sin(alpha) + v), f = v - (vh * vh) / s;
    const df = 1 + ((vh * vh) * (V * Math.sin(alpha) + v)) / (s * s * s);
    const nv = v - f / df;
    if (Math.abs(nv - v) < 1e-13) { v = nv; break; }
    v = nv > 0 ? nv : v / 2;
  }
  return v;
}

/** Shaft and electrical power and flight time at forward speed V (m/s); V = 0 is hover. */
export function powerAt(d: Drone, V: number) {
  const W = d.mass * G, A = (Math.PI * d.propD * d.propD) / 4, Atot = A * d.rotors;
  const D = 0.5 * d.rho * V * V * (d.CdA ?? 0), T = Math.hypot(W, D), alpha = Math.atan2(D, W);
  const vi = glauert(T, d.rho, Atot, V, alpha);
  // Induced power (with the figure of merit standing for profile and non-ideal losses) plus parasite power D·V.
  const Pind = (T * vi) / d.FM, Ppar = D * V, Pshaft = Pind + Ppar;
  const Pel = Pshaft / d.eff + d.avionics, E = d.wh * d.usable * 3600;
  const t = E / Pel;
  return { V, T, D, alpha, vi, Pind, Ppar, Pshaft, Pel, t, range: V * t, amps: d.volts ? Pel / d.volts : NaN };
}

export function hover(d: Drone) {
  const W = d.mass * G, A = (Math.PI * d.propD * d.propD) / 4, Atot = A * d.rotors;
  const Pshaft = hoverPower(W, d.rho, Atot, d.FM), p = powerAt(d, 0);
  return {
    ...p, Pshaft, discLoading: W / Atot, gPerW: (d.mass * 1000) / p.Pel,
    tw: d.maxThrust ? (d.maxThrust * d.rotors) / W : NaN, perMotor: W / d.rotors,
  };
}

/** Flight time from a measured hover current at the pack voltage. */
export const timeFromCurrent = (d: Pick<Drone, 'wh' | 'usable'>, amps: number, volts: number) => (d.wh * d.usable * 3600) / (amps * volts);

/** Speeds for the longest flight time and the longest range (golden-section search on 0..Vmax). */
export function bestSpeeds(d: Drone, Vmax = 40) {
  const golden = (f: (v: number) => number, a: number, b: number) => {
    const r = (Math.sqrt(5) - 1) / 2; let c = b - r * (b - a), e = a + r * (b - a);
    for (let k = 0; k < 200 && b - a > 1e-9; k++) { if (f(c) > f(e)) { b = e; e = c; c = b - r * (b - a); } else { a = c; c = e; e = a + r * (b - a); } }
    return (a + b) / 2;
  };
  const vEnd = golden((v) => powerAt(d, v).t, 0, Vmax), vRange = golden((v) => powerAt(d, v).range, 0, Vmax);
  return { endurance: powerAt(d, vEnd), range: powerAt(d, vRange) };
}

/** Battery energy in Wh from series cells, capacity and nominal cell voltage. */
export const batteryWh = (cells: number, mAh: number, cellV = 3.7) => (cells * cellV * mAh) / 1000;
