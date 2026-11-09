// Collisions of two bodies: 1D with a coefficient of restitution, 2D oblique impact of smooth spheres (restitution along
// the line of centres, tangential velocities unchanged) or sticking together, and e found from measured speeds. No DOM.

export type V2 = [number, number];

/** 1D collision: final velocities from masses, initial velocities and restitution e (1 elastic, 0 they move off together). */
export function collide1D(m1: number, u1: number, m2: number, u2: number, e: number) {
  const M = m1 + m2, P = m1 * u1 + m2 * u2;
  const v1 = (P + m2 * e * (u2 - u1)) / M, v2 = (P + m1 * e * (u1 - u2)) / M;
  const K0 = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2, K1 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  return { v1, v2, P0: P, P1: m1 * v1 + m2 * v2, K0, K1, lost: K0 - K1, J: m2 * (v2 - u2), approach: u1 - u2, vcm: P / M };
}

/**
 * 2D impact. phi is the direction (degrees, from the +x axis) of the line from body 1's centre to body 2's centre at contact.
 * Smooth spheres: only the components along that line change, by the 1D rule with restitution e. With `stick` they
 * move off as one body. Returns final velocity vectors and the momentum and energy books.
 */
export function collide2D(m1: number, u1: V2, m2: number, u2: V2, phiDeg: number, e: number, stick = false) {
  const M = m1 + m2, P: V2 = [m1 * u1[0] + m2 * u2[0], m1 * u1[1] + m2 * u2[1]];
  const K0 = 0.5 * m1 * (u1[0] ** 2 + u1[1] ** 2) + 0.5 * m2 * (u2[0] ** 2 + u2[1] ** 2);
  let v1: V2, v2: V2, closing = 0;
  const n: V2 = [Math.cos((phiDeg * Math.PI) / 180), Math.sin((phiDeg * Math.PI) / 180)], t: V2 = [-n[1], n[0]];
  const a1 = u1[0] * n[0] + u1[1] * n[1], a2 = u2[0] * n[0] + u2[1] * n[1];
  closing = a1 - a2;
  if (stick) { v1 = [P[0] / M, P[1] / M]; v2 = [...v1] as V2; }
  else {
    const t1 = u1[0] * t[0] + u1[1] * t[1], t2 = u2[0] * t[0] + u2[1] * t[1];
    const r = collide1D(m1, a1, m2, a2, e);
    v1 = [r.v1 * n[0] + t1 * t[0], r.v1 * n[1] + t1 * t[1]];
    v2 = [r.v2 * n[0] + t2 * t[0], r.v2 * n[1] + t2 * t[1]];
  }
  const K1 = 0.5 * m1 * (v1[0] ** 2 + v1[1] ** 2) + 0.5 * m2 * (v2[0] ** 2 + v2[1] ** 2);
  const P1: V2 = [m1 * v1[0] + m2 * v2[0], m1 * v1[1] + m2 * v2[1]];
  const J: V2 = [m2 * (v2[0] - u2[0]), m2 * (v2[1] - u2[1])];
  return { v1, v2, P0: P, P1, K0, K1, lost: K0 - K1, J, closing, n };
}

/** Restitution and the momentum and energy books from measured 1D speeds before and after. */
export function fromMeasured(m1: number, u1: number, m2: number, u2: number, v1: number, v2: number) {
  const P0 = m1 * u1 + m2 * u2, P1 = m1 * v1 + m2 * v2;
  const K0 = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2, K1 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  return { e: (v2 - v1) / (u1 - u2), P0, P1, dP: P1 - P0, dPrel: P0 !== 0 ? (P1 - P0) / Math.abs(P0) : NaN, K0, K1, lost: K0 - K1 };
}

/** Deflection angle of a vector, degrees. */
export const angleOf = (v: V2) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;
