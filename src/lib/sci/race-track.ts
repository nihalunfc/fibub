// Time, speed and distance on a race track (school maths, proportional reasoning): distance = speed × time,
// km/h ↔ m/s, and when two runners meet, using the relative speed. Runner A starts at 0 and runs forwards. Runner
// B either starts `head` metres ahead and runs the same way, or starts at the far end and runs towards A.
// Plain TypeScript, no DOM.

export type Race = { length: number; vA: number; vB: number; head: number; towards: boolean };

export const kmhToMs = (v: number) => v / 3.6;
export const msToKmh = (v: number) => v * 3.6;

/** Positions (metres from A's start) at time t, each stopped at its finish line. */
export function positions(r: Race, t: number): [number, number] {
  const a = Math.min(r.length, r.vA * t);
  const b = r.towards ? Math.max(0, r.length - r.vB * t) : Math.min(r.length, r.head + r.vB * t);
  return [a, b];
}

/** Time for each runner to reach their finish line. */
export function finishTimes(r: Race): [number, number] {
  return [r.length / r.vA, r.towards ? r.length / r.vB : (r.length - r.head) / r.vB];
}

/**
 * When and where they meet: towards each other the gap closes at vA + vB; the same way, A gains at vA − vB.
 * Null when they never meet on the track (A is not faster, or B finishes first).
 */
export function meet(r: Race): { t: number; at: number; rel: number; gap: number } | null {
  const gap = r.towards ? r.length : r.head, rel = r.towards ? r.vA + r.vB : r.vA - r.vB;
  if (gap <= 0) return { t: 0, at: 0, rel, gap };
  if (rel <= 0) return null;
  const t = gap / rel, at = r.vA * t;
  return at <= r.length + 1e-9 ? { t, at, rel, gap } : null;
}
