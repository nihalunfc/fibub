// School maths: areas related to circles and tangents (Class 10 circles and areas related to circles). Sector
// and segment areas, arc length, and the two tangents from an outside point. Angles in degrees. No DOM.

/** Sector of radius r and angle θ (degrees), using the given value of π (Math.PI, 22/7 or 3.14). */
export function sector(r: number, theta: number, pi = Math.PI) {
  const area = (theta / 360) * pi * r * r, arc = (theta / 360) * 2 * pi * r;
  // Segment = sector − triangle OAB (for θ > 180° the triangle is added back, which the sine handles).
  const tri = 0.5 * r * r * Math.sin((theta * Math.PI) / 180);
  return { area, arc, perimeter: arc + 2 * r, tri, segment: area - tri, major: pi * r * r - area, majorSegment: pi * r * r - (area - tri) };
}

export type Pt = [number, number];
/**
 * Tangents from P to the circle with centre O and radius r. Null when P is on or inside the circle.
 * T1, T2 are the points of contact; `len` is PT; angles at P (between the tangents) and at O (between the radii).
 */
export function tangents(O: Pt, r: number, P: Pt) {
  const dx = P[0] - O[0], dy = P[1] - O[1], d = Math.hypot(dx, dy);
  if (!(d > r)) return null;
  const len = Math.sqrt(d * d - r * r), base = Math.atan2(dy, dx), a = Math.acos(r / d);
  const T1: Pt = [O[0] + r * Math.cos(base + a), O[1] + r * Math.sin(base + a)], T2: Pt = [O[0] + r * Math.cos(base - a), O[1] + r * Math.sin(base - a)];
  const atP = (2 * Math.asin(r / d) * 180) / Math.PI;
  return { d, len, T1, T2, atP, atO: 180 - atP };
}

export const PI_CHOICES: Record<string, number> = { pi: Math.PI, '22/7': 22 / 7, '3.14': 3.14 };
