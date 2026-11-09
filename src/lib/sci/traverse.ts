// Survey traverses: angle parsing, closure, Bowditch and transit adjustments, area, inverse and intersections. No DOM.
// Azimuths are whole-circle bearings in degrees, clockwise from grid north. Coordinates are (E, N).

const D2R = Math.PI / 180;
export const norm360 = (a: number) => ((a % 360) + 360) % 360;
export const norm180 = (a: number) => { const x = norm360(a); return x > 180 ? x - 360 : x; };

/**
 * Reads an angle. unit 'deg' accepts decimal degrees or degrees, minutes and seconds written as "45 30 15",
 * "45-30-15", "45°30'15\"" or "45d30m15s"; 'gon' takes gons (400 to a circle). A quadrant bearing such as
 * "N 45 30 E" or "S45°W" becomes an azimuth. NaN if it cannot be read.
 */
export function parseAngle(s: string, unit: 'deg' | 'gon' = 'deg'): number {
  const raw = s.trim().toUpperCase();
  let t = raw.replace(/[°º″"′'DMS]/g, ' ');
  const quad = raw.match(/^([NS])\s*(.*?)\s*([EW])$/);
  if (quad) {
    const a = parseAngle(quad[2], unit === 'gon' ? 'gon' : 'deg');
    const a360 = unit === 'gon' ? a * 0.9 : a;
    if (!(a360 >= 0 && a360 <= 90)) return NaN;
    const az = quad[1] === 'N' ? (quad[3] === 'E' ? a360 : 360 - a360) : quad[3] === 'E' ? 180 - a360 : 180 + a360;
    return unit === 'gon' ? norm360(az) / 0.9 : norm360(az);
  }
  if (unit === 'gon') { const g = Number(t.replace(/[^\d.+-]/g, '')); return t.trim() && Number.isFinite(g) ? g : NaN; }
  const neg = /^\s*-/.test(t);
  t = t.replace(/^\s*-/, '').replace(/(\d)-(\d)/g, '$1 $2');
  const parts = t.trim().split(/[\s:]+/).filter(Boolean).map(Number);
  if (!parts.length || parts.length > 3 || parts.some((p) => !Number.isFinite(p) || p < 0)) return NaN;
  if (parts.length > 1 && (parts[1] >= 60 || (parts[2] ?? 0) >= 60)) return NaN;
  const v = parts[0] + (parts[1] ?? 0) / 60 + (parts[2] ?? 0) / 3600;
  return neg ? -v : v;
}

/** 45.50417 → "45°30′15″" (seconds to dp places). */
export function fmtDMS(deg: number, dp = 0) {
  const sgn = deg < 0 ? '-' : '';
  let a = Math.abs(deg), d = Math.floor(a), m = Math.floor((a - d) * 60);
  let s = +((a - d - m / 60) * 3600).toFixed(dp);
  if (s >= 60) { s = 0; m++; }
  if (m >= 60) { m = 0; d++; }
  return `${sgn}${d}°${String(m).padStart(2, '0')}′${s.toFixed(dp).padStart(dp ? dp + 3 : 2, '0')}″`;
}

/** Azimuth → quadrant bearing, e.g. 135 → "S 45°00′00″ E". */
export function fmtQuadrant(az: number, dp = 0) {
  const a = norm360(az);
  if (a <= 90) return `N ${fmtDMS(a, dp)} E`;
  if (a <= 180) return `S ${fmtDMS(180 - a, dp)} E`;
  if (a <= 270) return `S ${fmtDMS(a - 180, dp)} W`;
  return `N ${fmtDMS(360 - a, dp)} W`;
}

export type Leg = { az: number; d: number };

/**
 * Azimuths of each leg of a closed loop from angles turned clockwise at each station (back station to forward
 * station) and the azimuth of the first leg. angles[0] is at station 1 and closes the loop; angles[i] (i ≥ 1) is at
 * the start of leg i. Any angular misclosure is shared equally among the angles.
 */
export function anglesToAzimuths(angles: number[], firstAz: number) {
  const n = angles.length, walk = (ang: number[]) => { const az = [norm360(firstAz)]; for (let i = 1; i < n; i++) az.push(norm360(az[i - 1] + 180 + ang[i])); return az; };
  const raw = walk(angles), back = norm360(raw[n - 1] + 180 + angles[0]);
  const misclosure = norm180(back - firstAz), corr = -misclosure / n;
  const adj = angles.map((a) => a + corr);
  const sum = angles.reduce((s, a) => s + a, 0);
  return { az: walk(adj), misclosure, perAngle: corr, sum, interior: (n - 2) * 180, exterior: (n + 2) * 180 };
}

/** Plain coordinates of each station by adding up the legs from a start point. */
export function walk(legs: Leg[], E0: number, N0: number) {
  const pts = [{ E: E0, N: N0 }];
  for (const l of legs) { const p = pts[pts.length - 1]; pts.push({ E: p.E + l.d * Math.sin(l.az * D2R), N: p.N + l.d * Math.cos(l.az * D2R) }); }
  return pts;
}

/**
 * Closes a traverse. For a loop the end is the start; for a link traverse give the known end point. Returns the
 * misclosure (computed end − known end), its length and direction, the precision as 1 : (length ÷ misclosure) and the
 * adjusted coordinates by the Bowditch (compass) rule, corrections in proportion to leg length, or the transit rule,
 * corrections in proportion to each leg's |ΔE| and |ΔN|.
 */
export function close(legs: Leg[], start: { E: number; N: number }, end: { E: number; N: number } | null, rule: 'bowditch' | 'transit' = 'bowditch') {
  const raw = walk(legs, start.E, start.N), last = raw[raw.length - 1], target = end ?? start;
  const fE = last.E - target.E, fN = last.N - target.N, f = Math.hypot(fE, fN);
  const lengthSum = legs.reduce((s, l) => s + l.d, 0);
  const dE = legs.map((l) => l.d * Math.sin(l.az * D2R)), dN = legs.map((l) => l.d * Math.cos(l.az * D2R));
  const sE = dE.reduce((s, x) => s + Math.abs(x), 0), sN = dN.reduce((s, x) => s + Math.abs(x), 0);
  const cE = legs.map((l, i) => (rule === 'bowditch' ? -fE * l.d / lengthSum : sE > 0 ? -fE * Math.abs(dE[i]) / sE : 0));
  const cN = legs.map((l, i) => (rule === 'bowditch' ? -fN * l.d / lengthSum : sN > 0 ? -fN * Math.abs(dN[i]) / sN : 0));
  const adj = [{ ...start }];
  legs.forEach((_, i) => { const p = adj[i]; adj.push({ E: p.E + dE[i] + cE[i], N: p.N + dN[i] + cN[i] }); });
  const legsAdj = legs.map((_, i) => inverse(adj[i], adj[i + 1]));
  return { raw, adj, dE, dN, cE, cN, fE, fN, f, dir: f > 0 ? norm360(Math.atan2(fE, fN) / D2R) : 0, length: lengthSum, precision: f > 0 ? lengthSum / f : Infinity, legsAdj };
}

/** Area inside a closed polygon of points (shoelace formula), always positive. */
export function area(pts: { E: number; N: number }[]) {
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a.E * b.N - b.E * a.N; }
  return Math.abs(s) / 2;
}

/** Azimuth and distance from a to b. */
export function inverse(a: { E: number; N: number }, b: { E: number; N: number }) {
  const dE = b.E - a.E, dN = b.N - a.N;
  return { az: norm360(Math.atan2(dE, dN) / D2R), d: Math.hypot(dE, dN), dE, dN };
}

/** Where a line from a on azimuth azA meets a line from b on azimuth azB (null if parallel). */
export function bearingBearing(a: { E: number; N: number }, azA: number, b: { E: number; N: number }, azB: number) {
  const ua = [Math.sin(azA * D2R), Math.cos(azA * D2R)], ub = [Math.sin(azB * D2R), Math.cos(azB * D2R)];
  const den = ua[0] * ub[1] - ua[1] * ub[0];
  if (Math.abs(den) < 1e-12) return null;
  const t = ((b.E - a.E) * ub[1] - (b.N - a.N) * ub[0]) / den;
  return { E: a.E + t * ua[0], N: a.N + t * ua[1], ta: t, tb: ((b.E - a.E) * ua[1] - (b.N - a.N) * ua[0]) / den };
}

/** The (zero, one or) two points at distance rA from a and rB from b. */
export function distanceDistance(a: { E: number; N: number }, rA: number, b: { E: number; N: number }, rB: number) {
  const { d, dE, dN } = inverse(a, b);
  if (!(d > 0) || d > rA + rB + 1e-9 || d < Math.abs(rA - rB) - 1e-9) return [];
  const x = (rA * rA - rB * rB + d * d) / (2 * d), h = Math.sqrt(Math.max(0, rA * rA - x * x));
  const ex = dE / d, nx = dN / d, mE = a.E + x * ex, mN = a.N + x * nx;
  // Left and right of the line a → b.
  const left = { E: mE - h * nx, N: mN + h * ex }, right = { E: mE + h * nx, N: mN - h * ex };
  return h < 1e-9 ? [right] : [left, right];
}
