// Site grid and trench recording: grid squares and labels, positions from tape offsets (from a peg, or along a
// baseline), heights from a level and staff, and a local grid tied to latitude/longitude by a plane approximation
// around a georeferenced origin (WGS84 radii of curvature, by Puissant's short-line formulas; under 1 mm from the ellipsoidal answer within a
// kilometre of the origin, see enToLatLon). Plain maths, no DOM.

export type Grid = { e0: number; n0: number; spacing: number; style: 'en' | 'alnum' };
export type Georef = { lat: number; lon: number; e: number; n: number; rot: number };

/** Column letters for a 0-based index: 0 → A, 25 → Z, 26 → AA. */
export function letters(i: number): string {
  let s = '', k = i + 1;
  while (k > 0) { const r = (k - 1) % 26; s = String.fromCharCode(65 + r) + s; k = Math.floor((k - 1) / 26); }
  return s;
}

/** The grid square holding a point: its south-west corner and its label. */
export function squareOf(e: number, n: number, g: Grid): { ie: number; in: number; e: number; n: number; label: string } {
  const eps = 1e-9;
  const ie = Math.floor((e - g.e0) / g.spacing + eps), iN = Math.floor((n - g.n0) / g.spacing + eps);
  const se = g.e0 + ie * g.spacing, sn = g.n0 + iN * g.spacing;
  const fmt = (x: number) => String(+x.toFixed(3));
  const label = g.style === 'alnum'
    ? (ie < 0 || iN < 0 ? 'outside grid' : `${letters(ie)}${iN + 1}`)
    : `E${fmt(se)} N${fmt(sn)}`;
  return { ie, in: iN, e: se, n: sn, label };
}

/** A point from a peg (or any known point) by offsets measured east and north. */
export const fromPeg = (pe: number, pn: number, east: number, north: number) => ({ e: pe + east, n: pn + north });

/**
 * A point from a baseline A→B: `along` metres from A towards B, then `off` metres at right angles (positive to the
 * right when facing B, negative to the left).
 */
export function fromBaseline(a: [number, number], b: [number, number], along: number, off: number): { e: number; n: number } {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (!(L > 0)) return { e: NaN, n: NaN };
  const ux = dx / L, uy = dy / L; // along the line; right-hand normal is (uy, -ux)
  return { e: a[0] + along * ux + off * uy, n: a[1] + along * uy - off * ux };
}

/** Height of a point from a level: height of instrument = datum + backsight; point = HI − foresight (staff reading). */
export const instrumentHeight = (datum: number, backsight: number) => datum + backsight;
export const levelFromStaff = (hi: number, foresight: number) => hi - foresight;

/** Point inside a trench (south-west corner, sizes east and north), edges included. */
export const inTrench = (e: number, n: number, t: { e: number; n: number; w: number; l: number }) =>
  e >= t.e - 1e-9 && e <= t.e + t.w + 1e-9 && n >= t.n - 1e-9 && n <= t.n + t.l + 1e-9;

// WGS84 ellipsoid.
const A = 6378137, F = 1 / 298.257223563, E2 = F * (2 - F);
const rad = Math.PI / 180;
/** Radii of curvature at a latitude: meridian (M, north-south) and prime vertical (N, east-west), metres. */
export function radii(latDeg: number): { M: number; N: number } {
  const s = Math.sin(latDeg * rad), w = 1 - E2 * s * s;
  return { M: (A * (1 - E2)) / w ** 1.5, N: A / Math.sqrt(w) };
}

/** Metres east and north of the origin (true north) to latitude/longitude: the point at that distance and azimuth
 * from the origin, by Puissant's short-line approximation (plane offsets over the radii of curvature, the
 * second-order term east² · tan φ / 2MN for the curve of a parallel, and the end latitude for longitude). */
export function enToLatLon(east: number, north: number, lat0: number, lon0: number): { lat: number; lon: number } {
  const { M, N } = radii(lat0), p0 = lat0 * rad;
  const p = p0 + north / M - (east * east * Math.tan(p0)) / (2 * M * N);
  const N2 = radii(p / rad).N;
  return { lat: p / rad, lon: lon0 + east / (N2 * Math.cos(p)) / rad };
}
/** Latitude/longitude to metres east and north of the origin (the inverse of enToLatLon, by iteration). */
export function latLonToEn(lat: number, lon: number, lat0: number, lon0: number): { east: number; north: number } {
  const p0 = lat0 * rad, p = lat * rad, { M, N } = radii(lat0);
  const east = (lon - lon0) * rad * radii(lat).N * Math.cos(p);
  const north = (p - p0 + (east * east * Math.tan(p0)) / (2 * M * N)) * M;
  return { east, north };
}

/** Grid coordinates to latitude/longitude. `rot` is the bearing of grid north, degrees clockwise from true north. */
export function gridToLatLon(e: number, n: number, g: Georef): { lat: number; lon: number } {
  const dE = e - g.e, dN = n - g.n, t = g.rot * rad;
  return enToLatLon(dE * Math.cos(t) + dN * Math.sin(t), -dE * Math.sin(t) + dN * Math.cos(t), g.lat, g.lon);
}
/** Latitude/longitude to grid coordinates (the inverse of gridToLatLon). */
export function latLonToGrid(lat: number, lon: number, g: Georef): { e: number; n: number } {
  const { east, north } = latLonToEn(lat, lon, g.lat, g.lon), t = g.rot * rad;
  return { e: g.e + east * Math.cos(t) - north * Math.sin(t), n: g.n + east * Math.sin(t) + north * Math.cos(t) };
}

export type Kind = 'find' | 'sample' | 'level' | 'point';
export type Rec = { id: string; kind: Kind; e: number; n: number; z: number | null; note: string; lat?: number; lon?: number; acc?: number; how: string };

/** Made-up example site: a 1000/5000 false origin, 5 m grid, a 4 × 2 m trench. */
export const EXAMPLE = {
  grid: { e0: 1000, n0: 5000, spacing: 5, style: 'en' as const },
  georef: { lat: 45.5, lon: -73.6, e: 1000, n: 5000, rot: 0 },
  trench: { name: 'Trench 1', e: 1012, n: 5021, w: 4, l: 2 },
  datum: 100, backsight: 1.42,
};
