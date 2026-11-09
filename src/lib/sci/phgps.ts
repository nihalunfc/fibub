// Relativistic clock-rate corrections for navigation satellites (GPS and others) relative to a clock on the ground,
// to first order in 1/c² (weak field, slow motion), with Earth as a point mass. Plain maths, no DOM. SI units.

/** Earth's GM (m³/s², the standard value, rounded), a mean radius (m, rounded), rotation rate (rad/s), c (m/s). */
export const GM = 3.986004418e14, RE = 6.371e6, OMEGA = 7.2921150e-5, C = 299792458;
export const DAY = 86400;

/** Fractional rate offsets of a clock (relative to an ideal clock far away at rest): gravity −GM/(rc²), motion −v²/2c². */
export function satellite(r: number, e = 0) {
  // Circular orbit speed (mean for an eccentric one, via the semi-major axis): v² = GM/a.
  return { grav: -GM / (r * C * C), vel: -GM / (2 * r * C * C), v: Math.sqrt(GM / r), period: 2 * Math.PI * Math.sqrt((r * r * r) / GM), e };
}
export function ground(latDeg: number, h: number) {
  const R = RE + h, v = OMEGA * R * Math.cos((latDeg * Math.PI) / 180);
  return { grav: -GM / (R * C * C), vel: -(v * v) / (2 * C * C), v };
}

export type Shift = { grav: number; vel: number; net: number; usPerDay: { grav: number; vel: number; net: number }; f0: number; fFactory: number; kmPerDay: number };
/**
 * How much faster (positive) the satellite clock runs than the ground clock, split into the gravitational part (higher
 * up, weaker gravity: faster) and the velocity part (moving faster: slower), as fractions and in microseconds per day.
 * f0 is the nominal clock frequency (10.23 MHz for GPS) and fFactory the frequency it must be set to on the ground so
 * it reads f0 in orbit.
 */
export function shift(a: number, latDeg = 0, h = 0, f0 = 10.23e6): Shift {
  const s = satellite(a), g = ground(latDeg, h);
  const grav = s.grav - g.grav, vel = s.vel - g.vel, net = grav + vel;
  return { grav, vel, net, usPerDay: { grav: grav * DAY * 1e6, vel: vel * DAY * 1e6, net: net * DAY * 1e6 }, f0, fFactory: f0 / (1 + net), kmPerDay: (net * DAY * C) / 1000 };
}
/** Amplitude (s) of the periodic eccentricity correction Δt = (2/c²)√(GMa) e sin E. */
export const eccAmp = (a: number, e: number) => (2 * Math.sqrt(GM * a) * e) / (C * C);
/** Orbit radius at which the gravitational and velocity effects cancel for a ground clock at the given latitude and height. */
export function balanceRadius(latDeg = 0, h = 0): number {
  const g = ground(latDeg, h);
  // −3GM/(2rc²) = g.grav + g.vel  →  r = 3GM / (2 c² |g.grav + g.vel|)
  return (3 * GM) / (2 * C * C * Math.abs(g.grav + g.vel));
}
/** The exact Schwarzschild-plus-motion rate ratio (no 1/c² expansion), for checking the first-order result. */
export function exactRatio(a: number, latDeg = 0, h = 0): number {
  const s = satellite(a), g = ground(latDeg, h), R = RE + h;
  const rs = Math.sqrt(1 - (2 * GM) / (a * C * C) - (s.v * s.v) / (C * C)), rg = Math.sqrt(1 - (2 * GM) / (R * C * C) - (g.v * g.v) / (C * C));
  return rs / rg - 1;
}
