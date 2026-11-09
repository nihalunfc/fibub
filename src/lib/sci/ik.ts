// Planar inverse kinematics of 2-link and 3-link revolute arms (closed form). Angles in radians; each joint
// angle is measured from the previous link (the first from the +x axis), counter-clockwise positive.
// For 3 links the tool orientation phi (angle of the last link from +x) is given, which fixes the wrist point.

export type Sol = { q: number[]; elbow: 'up' | 'down' };
export const wrap = (a: number) => { let b = ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; if (b <= -Math.PI + 1e-15) b = Math.PI; return b; };

/** Forward kinematics: the position of every joint and the tip, and the tip orientation. */
export function fk(L: number[], q: number[]): { pts: [number, number][]; phi: number } {
  const pts: [number, number][] = [[0, 0]];
  let x = 0, y = 0, a = 0;
  L.forEach((l, i) => { a += q[i]; x += l * Math.cos(a); y += l * Math.sin(a); pts.push([x, y]); });
  return { pts, phi: a };
}

/** Reach of a 2-link arm: inner and outer radius of its workspace annulus. */
export const reach2 = (L1: number, L2: number) => ({ rMin: Math.abs(L1 - L2), rMax: L1 + L2 });

/** 2-link closed form. Returns [] when out of reach; one solution when stretched or folded (singular). */
export function ik2(L1: number, L2: number, x: number, y: number, tol = 1e-12): Sol[] {
  const r2 = x * x + y * y;
  let c2 = (r2 - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  if (c2 > 1 + tol || c2 < -1 - tol) return [];
  c2 = Math.max(-1, Math.min(1, c2));
  const s2 = Math.sqrt(Math.max(0, 1 - c2 * c2));
  const one = (s: number): number[] => { const q2 = Math.atan2(s, c2), q1 = Math.atan2(y, x) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2)); return [wrap(q1), wrap(q2)]; };
  // Positive elbow angle puts the elbow on the clockwise side of the line to the target: "elbow down".
  if (s2 < 1e-9) return [{ q: one(0), elbow: 'up' }];
  return [{ q: one(-s2), elbow: 'up' }, { q: one(s2), elbow: 'down' }];
}

/** 3-link closed form with tool orientation phi: solve the wrist with the 2-link formula, then the last joint. */
export function ik3(L1: number, L2: number, L3: number, x: number, y: number, phi: number): { sols: Sol[]; wrist: [number, number] } {
  const wx = x - L3 * Math.cos(phi), wy = y - L3 * Math.sin(phi);
  const sols = ik2(L1, L2, wx, wy).map((s) => ({ q: [s.q[0], s.q[1], wrap(phi - s.q[0] - s.q[1])], elbow: s.elbow }));
  return { sols, wrist: [wx, wy] };
}

/** Does every joint angle lie within its [min, max] limits (radians)? Returns the joints that break them. */
export function limitBreaks(q: number[], lim?: ([number, number] | undefined)[]): number[] {
  if (!lim) return [];
  return q.map((a, i) => (lim[i] && (a < lim[i]![0] - 1e-12 || a > lim[i]![1] + 1e-12) ? i : -1)).filter((i) => i >= 0);
}
