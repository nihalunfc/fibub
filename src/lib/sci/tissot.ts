// Map projections on a sphere (radius 1) and their distortion, worked out from the projection's partial derivatives
// as in Snyder, "Map Projections: A Working Manual" (USGS 1987), section 4: scale along the meridian h, along the
// parallel k, areal scale s, the Tissot ellipse's semi-axes a and b, and the maximum angular distortion ω.
// The derivatives are central differences of the forward formulas (as PROJ's own factors do when a projection has
// no analytic ones). No DOM.

export const D = Math.PI / 180;
export type Params = { lon0: number; lat0: number; lat1: number; lat2: number }; // degrees
export type ProjDef = {
  id: string; name: string; kind: string; property: string; uses: (keyof Params)[];
  /** Projected x, y on a unit sphere, or null where the projection cannot show the point. */
  fwd: (lam: number, phi: number, p: P) => [number, number] | null;
  /** Points drawn: latitude limits (degrees) and, for azimuthal views, the largest distance from the centre. */
  latMax?: number; maxC?: number; maxB?: number;
};
type P = { lam0: number; phi0: number; phi1: number; phi2: number };

const wrap = (a: number) => { let x = (a + Math.PI) % (2 * Math.PI); if (x < 0) x += 2 * Math.PI; return x - Math.PI; };
const tq = (phi: number) => Math.tan(Math.PI / 4 + phi / 2);
// Great-circle distance c from the centre, and the azimuthal x, y directions.
function azi(lam: number, phi: number, p: P) {
  const dl = wrap(lam - p.lam0), cosc = Math.sin(p.phi0) * Math.sin(phi) + Math.cos(p.phi0) * Math.cos(phi) * Math.cos(dl);
  return { c: Math.acos(Math.max(-1, Math.min(1, cosc))), cosc, X: Math.cos(phi) * Math.sin(dl), Y: Math.cos(p.phi0) * Math.sin(phi) - Math.sin(p.phi0) * Math.cos(phi) * Math.cos(dl) };
}
function lccConsts(p: P) {
  const n = Math.abs(p.phi1 - p.phi2) < 1e-10 ? Math.sin(p.phi1) : Math.log(Math.cos(p.phi1) / Math.cos(p.phi2)) / Math.log(tq(p.phi2) / tq(p.phi1));
  const F = (Math.cos(p.phi1) * tq(p.phi1) ** n) / n;
  return { n, F, rho0: F / tq(p.phi0) ** n };
}
function aeaConsts(p: P) {
  const n = (Math.sin(p.phi1) + Math.sin(p.phi2)) / 2, C = Math.cos(p.phi1) ** 2 + 2 * n * Math.sin(p.phi1);
  return { n, C, rho0: Math.sqrt(C - 2 * n * Math.sin(p.phi0)) / n };
}
/** Mollweide's auxiliary angle: 2θ + sin 2θ = π sin φ (Newton). */
export function mollTheta(phi: number) {
  if (Math.abs(Math.abs(phi) - Math.PI / 2) < 1e-12) return Math.sign(phi) * Math.PI / 2;
  let t = phi;
  for (let i = 0; i < 50; i++) { const d = -(2 * t + Math.sin(2 * t) - Math.PI * Math.sin(phi)) / (2 + 2 * Math.cos(2 * t)); t += d; if (Math.abs(d) < 1e-15) break; }
  return t;
}

export const PROJECTIONS: ProjDef[] = [
  { id: 'merc', name: 'Mercator', kind: 'Cylindrical', property: 'Conformal (keeps angles and local shapes)', uses: ['lon0'], latMax: 85,
    fwd: (l, f, p) => [wrap(l - p.lam0), Math.log(tq(f))] },
  { id: 'tmerc', name: 'Transverse Mercator', kind: 'Cylindrical (transverse)', property: 'Conformal', uses: ['lon0'], maxB: 0.985,
    fwd: (l, f, p) => { const dl = wrap(l - p.lam0), B = Math.cos(f) * Math.sin(dl); if (Math.abs(B) >= 1) return null; return [0.5 * Math.log((1 + B) / (1 - B)), Math.atan2(Math.tan(f), Math.cos(dl)) - p.phi0]; } },
  { id: 'eqc', name: 'Equirectangular', kind: 'Cylindrical', property: 'Equidistant along meridians', uses: ['lon0', 'lat1'],
    fwd: (l, f, p) => [wrap(l - p.lam0) * Math.cos(p.phi1), f] },
  { id: 'lcc', name: 'Lambert conformal conic', kind: 'Conic', property: 'Conformal', uses: ['lon0', 'lat0', 'lat1', 'lat2'],
    fwd: (l, f, p) => { const { n, F, rho0 } = lccConsts(p), rho = F / tq(f) ** n, t = n * wrap(l - p.lam0); return Number.isFinite(rho) ? [rho * Math.sin(t), rho0 - rho * Math.cos(t)] : null; } },
  { id: 'aea', name: 'Albers equal-area conic', kind: 'Conic', property: 'Equal-area', uses: ['lon0', 'lat0', 'lat1', 'lat2'],
    fwd: (l, f, p) => { const { n, C, rho0 } = aeaConsts(p), r2 = C - 2 * n * Math.sin(f); if (r2 < 0) return null; const rho = Math.sqrt(r2) / n, t = n * wrap(l - p.lam0); return [rho * Math.sin(t), rho0 - rho * Math.cos(t)]; } },
  { id: 'aeqd', name: 'Azimuthal equidistant', kind: 'Azimuthal', property: 'Equidistant from the centre', uses: ['lon0', 'lat0'], maxC: 179,
    fwd: (l, f, p) => { const a = azi(l, f, p), k = a.c < 1e-12 ? 1 : a.c / Math.sin(a.c); return [k * a.X, k * a.Y]; } },
  { id: 'laea', name: 'Lambert azimuthal equal-area', kind: 'Azimuthal', property: 'Equal-area', uses: ['lon0', 'lat0'], maxC: 179,
    fwd: (l, f, p) => { const a = azi(l, f, p); if (1 + a.cosc < 1e-12) return null; const k = Math.sqrt(2 / (1 + a.cosc)); return [k * a.X, k * a.Y]; } },
  { id: 'stere', name: 'Stereographic', kind: 'Azimuthal', property: 'Conformal', uses: ['lon0', 'lat0'], maxC: 110,
    fwd: (l, f, p) => { const a = azi(l, f, p); if (1 + a.cosc < 1e-12) return null; const k = 2 / (1 + a.cosc); return [k * a.X, k * a.Y]; } },
  { id: 'ortho', name: 'Orthographic', kind: 'Azimuthal', property: 'Neither (the globe as seen from far away)', uses: ['lon0', 'lat0'], maxC: 89.5,
    fwd: (l, f, p) => { const a = azi(l, f, p); if (a.cosc < 0) return null; return [a.X, a.Y]; } },
  { id: 'moll', name: 'Mollweide', kind: 'Pseudocylindrical', property: 'Equal-area', uses: ['lon0'],
    fwd: (l, f, p) => { const t = mollTheta(f); return [((2 * Math.SQRT2) / Math.PI) * wrap(l - p.lam0) * Math.cos(t), Math.SQRT2 * Math.sin(t)]; } },
  { id: 'sinu', name: 'Sinusoidal', kind: 'Pseudocylindrical', property: 'Equal-area', uses: ['lon0'],
    fwd: (l, f, p) => [wrap(l - p.lam0) * Math.cos(f), f] },
];
export const byId = (id: string) => PROJECTIONS.find((p) => p.id === id)!;
export const toRad = (q: Params): P => ({ lam0: q.lon0 * D, phi0: q.lat0 * D, phi1: q.lat1 * D, phi2: q.lat2 * D });

/** Whether a point (degrees) is inside the part of the projection that is drawn. */
export function shown(def: ProjDef, lon: number, lat: number, q: Params) {
  if (def.latMax && Math.abs(lat) > def.latMax) return false;
  const p = toRad(q);
  if (def.maxC !== undefined) { const a = azi(lon * D, lat * D, p); if (a.c > def.maxC * D) return false; }
  if (def.maxB !== undefined && (Math.abs(Math.cos(lat * D) * Math.sin(wrap(lon * D - p.lam0))) > def.maxB || Math.cos(wrap(lon * D - p.lam0)) < 0)) return false;
  // Conics: from 30° on the far side of the equator to the pole on the cone's side.
  if (def.kind === 'Conic') { const n = def.id === 'lcc' ? lccConsts(p).n : aeaConsts(p).n; if (Math.sign(n) * lat < -30) return false; }
  return true;
}

/** Forward projection in degrees in, unit-sphere x, y out. */
export function project(def: ProjDef, lon: number, lat: number, q: Params) {
  const r = def.fwd(lon * D, lat * D, toRad(q));
  return r && Number.isFinite(r[0]) && Number.isFinite(r[1]) ? r : null;
}

export type Factors = { h: number; k: number; s: number; a: number; b: number; omega: number; thetaP: number; conv: number; J: [number, number, number, number] };

/**
 * Distortion at (lon, lat) in degrees, from the partial derivatives of x and y with respect to latitude φ and
 * longitude λ (Snyder eqs. 4-2, 4-3, 4-9 to 4-13 on the sphere, R = 1).
 */
export function factors(def: ProjDef, lon: number, lat: number, q: Params, step = 1e-6): Factors | null {
  const p = toRad(q), lam = lon * D, phi = lat * D;
  if (Math.abs(phi) > Math.PI / 2 - 2 * step) return null;
  const f = (l: number, ph: number) => def.fwd(l, ph, p);
  const a1 = f(lam, phi + step), a2 = f(lam, phi - step), b1 = f(lam + step, phi), b2 = f(lam - step, phi);
  const c0 = f(lam, phi);
  if (!a1 || !a2 || !b1 || !b2 || !c0) return null;
  // A jump inside the step (a cut in the projection, such as the far side of a transverse Mercator) gives no factors.
  for (const [u, v] of [[a1, a2], [b1, b2]]) for (const i of [0, 1]) if (Math.abs(u[i] - 2 * c0[i] + v[i]) > 1e-6) return null;
  // A wrap of λ − λ0 between the samples (on the far edge of the map) would spoil the differences.
  const xp = (a1[0] - a2[0]) / (2 * step), yp = (a1[1] - a2[1]) / (2 * step), xl = (b1[0] - b2[0]) / (2 * step), yl = (b1[1] - b2[1]) / (2 * step);
  if (![xp, yp, xl, yp].every(Number.isFinite) || Math.abs(xl) > 1e5 || Math.abs(yl) > 1e5) return null;
  const c = Math.cos(phi);
  const h = Math.hypot(xp, yp), k = Math.hypot(xl, yl) / c, s = (yp * xl - xp * yl) / c;
  const ap = Math.sqrt(Math.max(0, h * h + k * k + 2 * s)), bp = Math.sqrt(Math.max(0, h * h + k * k - 2 * s));
  const A = (ap + bp) / 2, B = (ap - bp) / 2;
  const omega = 2 * Math.asin(Math.min(1, bp / ap)) / D;
  const thetaP = Math.asin(Math.max(-1, Math.min(1, s / (h * k)))) / D;
  // Meridian convergence: angle of the meridian's image from the map's y axis (as PROJ reports it).
  const conv = -Math.atan2(xp, yp) / D;
  return { h, k, s, a: A, b: B, omega, thetaP, conv, J: [xp, yp, xl, yl] };
}

/** Inverse by Newton's method from the nearest point of a 5° grid (degrees out), or null. */
export function inverse(def: ProjDef, x: number, y: number, q: Params): [number, number] | null {
  let best: [number, number] | null = null, bd = Infinity;
  for (let lat = -87.5; lat <= 87.5; lat += 5) for (let lon = -177.5; lon <= 180; lon += 5) {
    if (!shown(def, lon, lat, q)) continue;
    const r = project(def, lon, lat, q); if (!r) continue;
    const d = (r[0] - x) ** 2 + (r[1] - y) ** 2; if (d < bd) { bd = d; best = [lon, lat]; }
  }
  if (!best) return null;
  let [lon, lat] = best;
  for (let it = 0; it < 60; it++) {
    const r = project(def, lon, lat, q), F = factors(def, lon, lat, q);
    if (!r || !F) return null;
    const ex = r[0] - x, ey = r[1] - y;
    if (Math.hypot(ex, ey) < 1e-12) break;
    const [xp, yp, xl, yl] = F.J, det = xp * yl - xl * yp;
    if (Math.abs(det) < 1e-14) return null;
    let dphi = (yl * ex - xl * ey) / det, dlam = (-yp * ex + xp * ey) / det;
    const mx = 5 * D, m = Math.max(Math.abs(dphi), Math.abs(dlam)); if (m > mx) { dphi *= mx / m; dlam *= mx / m; }
    lat = Math.max(-89.999, Math.min(89.999, lat - dphi / D)); lon = ((lon - dlam / D + 540) % 360) - 180;
  }
  const r = project(def, lon, lat, q);
  if (!r || Math.hypot(r[0] - x, r[1] - y) > 1e-6 || !shown(def, lon, lat, q)) return null;
  return [lon, lat];
}

/**
 * A line of (lon, lat) points (degrees) projected and cut into pieces wherever a point is not shown or the line
 * jumps across the map (the edge at λ0 ± 180°). Long steps are filled in so curves stay smooth.
 */
export function projectLine(def: ProjDef, pts: number[], q: Params, maxStep = 2, jump = 1.2): number[][] {
  const out: number[][] = []; let cur: number[] = [], prev: [number, number] | null = null;
  const end = () => { if (cur.length >= 4) out.push(cur); cur = []; prev = null; };
  const push = (lon: number, lat: number) => {
    const r = shown(def, lon, lat, q) ? project(def, lon, lat, q) : null;
    if (!r) return end();
    if (prev && Math.hypot(r[0] - prev[0], r[1] - prev[1]) > jump) end();
    cur.push(r[0], r[1]); prev = r;
  };
  const rel = (v: number) => { let x = (v - q.lon0 + 540) % 360; if (x < 0) x += 360; return x - 180; };
  for (let i = 0; i < pts.length; i += 2) {
    if (!i) { push(pts[0], pts[1]); continue; }
    const r0 = rel(pts[i - 2]), f0 = pts[i - 1], f1 = pts[i + 1];
    let d = rel(pts[i]) - r0; if (d > 180) d -= 360; else if (d < -180) d += 360;
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(d), Math.abs(f1 - f0)) / maxStep));
    let side = 0;
    for (let k = 1; k <= n; k++) {
      const t = k / n, rr = r0 + t * d, sd = rr >= 180 ? 1 : rr < -180 ? -1 : 0;
      // Crossing the map's edge (λ0 ± 180°) ends the piece at the edge and starts the next one on the other side.
      if (sd !== side) {
        const B = side + sd > 0 ? 180 : -180, te = (B - r0) / d, fe = f0 + te * (f1 - f0), e = 1 - 1e-9;
        push(q.lon0 + (B - 360 * side) * e, fe); end(); push(q.lon0 + (B - 360 * sd) * e, fe); side = sd;
      }
      push(q.lon0 + rr - 360 * sd, f0 + t * (f1 - f0));
    }
  }
  end();
  return out;
}

/** A Tissot ellipse: the image of a small circle of `radius` degrees of arc, drawn at its true size (linearised). */
export function ellipse(def: ProjDef, lon: number, lat: number, q: Params, radius: number, n = 48): number[] | null {
  const F = factors(def, lon, lat, q), c = project(def, lon, lat, q);
  if (!F || !c) return null;
  const [xp, yp, xl, yl] = F.J, r = radius * D, cp = Math.cos(lat * D), out: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (2 * Math.PI * i) / n, dphi = r * Math.cos(t), dlam = (r * Math.sin(t)) / cp;
    out.push(c[0] + xp * dphi + xl * dlam, c[1] + yp * dphi + yl * dlam);
  }
  return out;
}

/** The projection's outline: its edge meridians and limiting parallels, or the edge circle of an azimuthal view. */
export function outline(def: ProjDef, q: Params): number[][] {
  const pts: number[] = [];
  if (def.maxC !== undefined || def.maxB !== undefined) return [];
  const top = def.latMax ?? 90, e = 180 - 1e-7;
  for (let lat = -top; lat <= top; lat += 1) pts.push(q.lon0 - e, lat);
  for (let lon = -e; lon <= e; lon += 2) pts.push(q.lon0 + lon, top);
  for (let lat = top; lat >= -top; lat -= 1) pts.push(q.lon0 + e, lat);
  for (let lon = e; lon >= -e; lon -= 2) pts.push(q.lon0 + lon, -top);
  return projectLine(def, pts, q, 2, 10);
}
