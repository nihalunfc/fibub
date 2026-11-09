// Apparent dip, true dip from two apparent dips, true and vertical thickness from outcrop width on sloping ground,
// depth to a bed in a borehole, and the three-point problem. Plain vector geometry in (north, east, down)
// coordinates, the same as the stereonet library. Angles in degrees, azimuths clockwise from north, planes by
// strike and dip with the right-hand rule (dip direction = strike + 90).
import { vec, line, planeFromPole, type Plane } from './stereonet.ts';

export type V3 = [number, number, number];
const R = Math.PI / 180;
const norm360 = (a: number) => ((a % 360) + 360) % 360;
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);

/** The unit normal of a plane that points up, into the hanging wall (north, east, down). */
export function normalUp(p: Plane): V3 {
  const d = (p.strike + 90) * R, s = Math.sin(p.dip * R);
  return [s * Math.cos(d), s * Math.sin(d), -Math.cos(p.dip * R)];
}

/** A plane (right-hand rule) from any normal vector. */
export function planeFromNormal(n: V3): Plane {
  const p = planeFromPole(line(n));
  return { strike: norm360(p.strike), dip: p.dip };
}

/**
 * The apparent dip of a plane in a vertical section that runs towards `trend`: tan α = tan δ · cos(trend − dip
 * direction) = tan δ · sin(trend − strike). Positive when the bed goes down towards `trend`, negative when it rises.
 */
export function apparentDip(p: Plane, trend: number): number {
  return Math.atan2(Math.sin(p.dip * R) * Math.cos((trend - p.strike - 90) * R), Math.cos(p.dip * R)) / R;
}

/** True dip from one apparent dip α seen in the direction `trend`, when the strike is known: tan δ = tan α / sin(trend − strike). */
export function trueDipFromApparent(strike: number, trend: number, alpha: number): number | null {
  const s = Math.sin((trend - strike) * R);
  if (Math.abs(s) < 1e-9) return null; // a section along the strike shows no dip at all
  const t = Math.tan(alpha * R) / s;
  if (t < -1e-12) return null; // the apparent dip goes the wrong way for this strike (dip direction is strike + 90)
  return Math.atan(Math.max(0, t)) / R;
}

/** One apparent dip, as seen in the direction `trend` (negative: rising that way). */
export type Apparent = { trend: number; dip: number };

/** The plane holding two apparent-dip lines (their cross product), or null when the two lines are the same. */
export function planeFromTwoApparent(a: Apparent, b: Apparent): { plane: Plane; between: number } | null {
  const u = vec({ trend: a.trend, plunge: a.dip }), v = vec({ trend: b.trend, plunge: b.dip });
  const n = cross(u, v), s = len(n);
  const between = Math.acos(Math.min(1, Math.abs(dot(u, v)))) / R;
  if (s < 1e-9) return null;
  return { plane: planeFromNormal(n), between };
}

export type ThicknessIn = {
  plane: Plane;
  /** Direction of the traverse across the outcrop (azimuth). */
  trend: number;
  /** Outcrop width, measured along the traverse. */
  width: number;
  /** Ground slope angle along the traverse (0 = flat). */
  slope: number;
  /** True when the ground goes downhill in the direction of the traverse. */
  downhill: boolean;
  /** 'slope': width taped along the ground; 'horizontal': width read off a map. */
  measured: 'slope' | 'horizontal';
};

/**
 * True thickness T = |w · n| for the traverse vector w (slope distance, along the ground) and the bed's unit normal n.
 * Written out (Ragan's general formula): T = w · |sin δ · cos σ · sin β − s · cos δ · sin σ|, where β is the angle
 * from the strike to the traverse, σ the slope and s = +1 when the ground goes down along the traverse, −1 when up.
 * The vertical thickness is T / cos δ.
 */
export function thickness(t: ThicknessIn) {
  const sg = t.slope * R;
  if (t.measured === 'horizontal' && Math.abs(Math.cos(sg)) < 1e-12) return null;
  const ws = t.measured === 'slope' ? t.width : t.width / Math.cos(sg);
  const w: V3 = [ws * Math.cos(sg) * Math.cos(t.trend * R), ws * Math.cos(sg) * Math.sin(t.trend * R), (t.downhill ? 1 : -1) * ws * Math.sin(sg)];
  const T = Math.abs(dot(w, normalUp(t.plane)));
  const cd = Math.cos(t.plane.dip * R);
  return {
    trueT: T,
    vertical: cd > 1e-12 ? T / cd : Infinity,
    slopeWidth: ws,
    horizWidth: ws * Math.cos(sg),
    beta: norm360(t.trend - t.plane.strike),
  };
}

export type BoreholeIn = {
  plane: Plane;
  /** Horizontal distance from a point on the bed's contact (where it crops out) to the collar. */
  dist: number;
  /** Direction from the contact to the collar. */
  trend: number;
  /** Height of the collar above the contact point (negative if lower). */
  rise: number;
  /** Direction and plunge of the hole (plunge 90 = vertical, downwards). */
  holeTrend: number;
  holePlunge: number;
  /** True thickness of the bed (optional), for the length of core through it. */
  T?: number;
};

/** Where a straight hole meets the bed: length along the hole and vertical depth below the collar. */
export function borehole(b: BoreholeIn) {
  const n = normalUp(b.plane);
  const C: V3 = [b.dist * Math.cos(b.trend * R), b.dist * Math.sin(b.trend * R), -b.rise];
  const u = vec({ trend: b.holeTrend, plunge: b.holePlunge }) as V3;
  const nu = dot(n, u);
  if (Math.abs(nu) < 1e-12) return { parallel: true as const };
  const L = -dot(n, C) / nu;
  return {
    parallel: false as const,
    along: L,
    vertical: L * u[2],
    /** Angle between the hole and the bed. */
    angle: Math.asin(Math.min(1, Math.abs(nu))) / R,
    /** Core length through a bed of true thickness T. */
    through: b.T !== undefined ? b.T / Math.abs(nu) : undefined,
    /** Apparent dip of the bed from the contact towards the collar. */
    apparent: apparentDip(b.plane, b.trend),
  };
}

export type Pt = { e: number; n: number; z: number };

/** Three-point problem: the plane through three points (east, north, elevation). Null if they are on one line. */
export function threePoint(p: [Pt, Pt, Pt]) {
  const v = (a: Pt): V3 => [a.n, a.e, -a.z];
  const A = v(p[0]), B = v(p[1]), Cc = v(p[2]);
  const ab: V3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], ac: V3 = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]];
  const n = cross(ab, ac), s = len(n), scale = len(ab) * len(ac);
  if (!(scale > 0) || s / scale < 1e-9) return null;
  const plane = planeFromNormal(n);
  // Where the strike line through the middle-height point meets the line joining the highest and lowest points.
  const order = [0, 1, 2].sort((i, j) => p[i].z - p[j].z), lo = p[order[0]], mid = p[order[1]], hi = p[order[2]];
  const f = hi.z === lo.z ? 0 : (mid.z - lo.z) / (hi.z - lo.z);
  const onLine = { e: lo.e + f * (hi.e - lo.e), n: lo.n + f * (hi.n - lo.n), z: mid.z };
  return { plane, dipDir: norm360(plane.strike + 90), area: s / 2, strikePoint: onLine, mid: order[1] };
}
