// Rutherford scattering for the school tool rutherford-scattering: an alpha particle passing a heavy nucleus
// (fixed, point charge, Coulomb repulsion). Head-on distance of closest approach d = k(2e)(Ze)/K, scattering angle
// from the impact parameter tan(θ/2) = d/(2b), closest approach r_min = (d/2)(1 + √(1 + (2b/d)²)), and a step-by-step
// path for drawing. Plain maths, no DOM.
export const KE2_MEV_FM = 1.43996448; // e²/(4πε₀) in MeV fm (CODATA 2018)
export const TARGETS = [
  { id: 'au', name: 'Gold', Z: 79 },
  { id: 'ag', name: 'Silver', Z: 47 },
  { id: 'cu', name: 'Copper', Z: 29 },
  { id: 'al', name: 'Aluminium', Z: 13 },
];
/** Head-on closest approach of an alpha particle (charge 2e) of kinetic energy K MeV to a nucleus of charge Ze, in fm. */
export const headOn = (Z: number, K: number) => (KE2_MEV_FM * 2 * Z) / K;
/** Scattering angle (radians) for impact parameter b (same units as d). */
export const angleFromB = (b: number, d: number) => 2 * Math.atan(d / (2 * Math.abs(b)));
export const bFromAngle = (theta: number, d: number) => d / (2 * Math.tan(theta / 2));
export const closest = (b: number, d: number) => (d / 2) * (1 + Math.sqrt(1 + ((2 * b) / d) ** 2));
/**
 * Path of an alpha particle with impact parameter b coming from far to the left, in units where d = 1 and the speed
 * far away is 1 (acceleration 0.5/r² away from the nucleus at the origin). It starts 2,000 d away (with the speed
 * reduced to keep the energy right) and is followed by velocity Verlet with a step that grows with the distance.
 * Returns the points inside the drawing window |x|, |y| ≤ win, the final direction, speed and closest approach.
 */
export function path(b: number, win = 40, far = 2000) {
  let x = -Math.sqrt(far * far - b * b), y = b, vx = Math.sqrt(1 - 1 / far), vy = 0;
  const pts: [number, number][] = [];
  const acc = (px: number, py: number) => { const r2 = px * px + py * py, r = Math.sqrt(r2), a = 0.5 / r2; return [(a * px) / r, (a * py) / r]; };
  let [ax, ay] = acc(x, y), rmin = Infinity, last = 0;
  for (let i = 0; i < 400000; i++) {
    const r = Math.hypot(x, y); rmin = Math.min(rmin, r);
    const dt = Math.min(0.002 * r * r + 0.0005, 0.02 * r);
    x += vx * dt + 0.5 * ax * dt * dt; y += vy * dt + 0.5 * ay * dt * dt;
    const [nx, ny] = acc(x, y); vx += 0.5 * (ax + nx) * dt; vy += 0.5 * (ay + ny) * dt; ax = nx; ay = ny;
    if (Math.abs(x) <= win && Math.abs(y) <= win && (i - last >= 6 || !pts.length)) { pts.push([x, y]); last = i; }
    if (Math.hypot(x, y) > far && i > 10 && x * vx + y * vy > 0) break;
  }
  return { pts, angle: Math.atan2(Math.abs(vy), vx), speed: Math.hypot(vx, vy), rmin, end: Math.hypot(x, y) };
}
