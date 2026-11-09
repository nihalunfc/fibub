// Sequential ray tracing through centred spherical (and flat) surfaces: paraxial y-nu trace for focal lengths,
// exact 3-D real rays (Spencer and Murty / Welford) for spot diagrams and aberrations. Lengths in mm.
// The aperture stop is the first surface (the entrance pupil is there). Plain maths, no DOM.

export type Surface = { c: number; t: number; n: number; sd: number; R: number };
export type System = { n0: number; surfaces: Surface[] };
export type V3 = [number, number, number];
export type RayHit = { pts: V3[]; ok: boolean; why?: string; end: V3; dir: V3 };

/** Read surfaces, one per line: "radius thickness index [semi-diameter]". Radius "inf", "flat" or 0 is a plane.
 * Thickness is the distance to the next surface (the last one is ignored); index is the medium after the surface. */
export function parseSurfaces(text: string): Surface[] {
  const out: Surface[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const p = line.split(/[\s,;\t]+/);
    const flat = /^(inf|infinity|∞|flat|plane)$/i.test(p[0]);
    const R = flat ? Infinity : Number(p[0].replace('−', '-'));
    const t = p[1] === undefined ? 0 : Number(p[1]), n = p[2] === undefined ? NaN : Number(p[2]), sd = p[3] === undefined ? Infinity : Number(p[3]);
    if (!flat && !Number.isFinite(R)) throw new Error(`Line ${i + 1}: "${p[0]}" is not a radius (mm, or "inf" for flat).`);
    if (!(t >= 0) || !Number.isFinite(t)) throw new Error(`Line ${i + 1}: the thickness must be 0 or more (mm).`);
    if (!(n >= 1 && n < 5)) throw new Error(`Line ${i + 1}: give the refractive index after the surface (1 for air, about 1.5 for glass).`);
    if (!(sd > 0)) throw new Error(`Line ${i + 1}: the semi-diameter must be greater than 0 (or leave it out).`);
    out.push({ R, c: R === 0 || !Number.isFinite(R) ? 0 : 1 / R, t, n, sd });
  });
  if (out.length > 60) throw new Error('Up to 60 surfaces.');
  return out;
}

export type Paraxial = { efl: number; bfl: number; imageDist: number; mag: number; ys: number[]; us: number[]; chiefH: number; petzval: number };

/**
 * Paraxial trace. objDist = Infinity for an object at infinity, otherwise the distance (mm) in front of the first
 * surface. Returns the effective and back focal lengths, the paraxial image distance after the last surface for
 * this object, the magnification, and the paraxial chief-ray image height for a field angle (deg).
 */
export function paraxial(sys: System, objDist: number, y0: number, fieldDeg: number): Paraxial {
  const S = sys.surfaces;
  const trace = (y: number, u: number) => {
    const ys: number[] = [], us: number[] = [u];
    let n = sys.n0;
    S.forEach((s, k) => {
      ys.push(y);
      const n2 = s.n, u2 = (n * u - y * s.c * (n2 - n)) / n2;
      us.push(u2);
      if (k < S.length - 1) y += u2 * s.t;
      u = u2; n = n2;
    });
    return { ys, us, y, u };
  };
  const inf = trace(1, 0);
  const efl = -1 / inf.u, bfl = -inf.y / inf.u;
  const fin = Number.isFinite(objDist);
  const m = trace(y0, fin ? y0 / objDist : 0);
  const imageDist = -m.y / m.u;
  const tanF = Math.tan((fieldDeg * Math.PI) / 180);
  // Chief ray through the centre of the stop (first surface).
  const ch = trace(0, tanF);
  const chiefH = ch.y + ch.u * imageDist;
  const n0 = sys.n0, nk = S.length ? S[S.length - 1].n : n0;
  const mag = fin ? (n0 * (y0 / objDist)) / (nk * m.u) : 0;
  let pz = 0, n = n0;
  for (const s of S) { pz += (s.c * (s.n - n)) / (n * s.n); n = s.n; }
  return { efl, bfl, imageDist, mag, ys: m.ys, us: m.us, chiefH, petzval: pz };
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * Trace one real ray. start: a point; dir: a direction (any length); both in global coordinates with the first
 * surface vertex at z = 0. imageZ: the z of the image plane. Returns every intersection point.
 */
export function traceRay(sys: System, start: V3, dir: V3, imageZ: number): RayHit {
  const S = sys.surfaces;
  const L = Math.hypot(...dir);
  let D: V3 = [dir[0] / L, dir[1] / L, dir[2] / L];
  let P: V3 = [...start];
  let n = sys.n0, zv = 0;
  const pts: V3[] = [[...start]];
  for (let k = 0; k < S.length; k++) {
    const s = S[k];
    // Move to the vertex tangent plane z = zv.
    if (Math.abs(D[2]) < 1e-12) return { pts, ok: false, why: 'parallel to the axis', end: P, dir: D };
    const t0 = (zv - P[2]) / D[2];
    const x = P[0] + t0 * D[0], y = P[1] + t0 * D[1];
    // Intersect the sphere z' = c(x²+y²+z'²)/2 from (x, y, 0) (Spencer and Murty).
    const F = s.c * (x * x + y * y), G = D[2] - s.c * (x * D[0] + y * D[1]);
    const disc = G * G - s.c * F;
    if (disc < 0) return { pts, ok: false, why: `misses surface ${k + 1}`, end: P, dir: D };
    const t1 = F / (G + Math.sqrt(disc));
    P = [x + t1 * D[0], y + t1 * D[1], zv + t1 * D[2]];
    pts.push([...P]);
    if (Math.hypot(P[0], P[1]) > s.sd) return { pts, ok: false, why: `clipped by surface ${k + 1}`, end: P, dir: D };
    // Normal (pointing +z at the vertex) and refraction.
    const N: V3 = [-s.c * P[0], -s.c * P[1], 1 - s.c * (P[2] - zv)];
    const cosI = dot(N, D), n2 = s.n, mu = n / n2;
    const k2 = 1 - mu * mu * (1 - cosI * cosI);
    if (k2 < 0) return { pts, ok: false, why: `totally internally reflected at surface ${k + 1}`, end: P, dir: D };
    const g = Math.sqrt(k2) - mu * cosI;
    D = [mu * D[0] + g * N[0], mu * D[1] + g * N[1], mu * D[2] + g * N[2]];
    n = n2;
    if (k < S.length - 1) zv += s.t;
  }
  if (D[2] <= 0) return { pts, ok: false, why: 'travels backwards after the last surface', end: P, dir: D };
  const tI = (imageZ - P[2]) / D[2];
  const end: V3 = [P[0] + tI * D[0], P[1] + tI * D[1], imageZ];
  pts.push(end);
  return { pts, ok: true, end, dir: D };
}

/** z of the last surface vertex. */
export const lastVertex = (sys: System) => sys.surfaces.slice(0, -1).reduce((a, s) => a + s.t, 0);

/** The ray from the object (at infinity or objDist before surface 1) through pupil point (px, py) on surface 1's plane. */
export function rayFor(objDist: number, fieldDeg: number, px: number, py: number): { start: V3; dir: V3 } {
  const tf = Math.tan((fieldDeg * Math.PI) / 180);
  if (!Number.isFinite(objDist)) return { start: [px, py - tf * 10, -10], dir: [0, tf, 1] };
  const h = -objDist * tf;
  return { start: [0, h, -objDist], dir: [px, py - h, objDist] };
}

/** Pupil sample points: hexapolar rings (1 + 6 + 12 + ...), radius a. */
export function pupilGrid(a: number, rings: number): [number, number][] {
  const out: [number, number][] = [[0, 0]];
  for (let r = 1; r <= rings; r++) for (let j = 0; j < 6 * r; j++) { const th = (2 * Math.PI * j) / (6 * r); out.push([(a * r * Math.sin(th)) / rings, (a * r * Math.cos(th)) / rings]); }
  return out;
}

export type Spot = { xs: number[]; ys: number[]; cx: number; cy: number; rms: number; geo: number; lost: number; total: number };
/** Spot diagram on the plane imageZ for a field angle. */
export function spot(sys: System, objDist: number, fieldDeg: number, a: number, imageZ: number, rings = 8): Spot {
  const xs: number[] = [], ys: number[] = [];
  const grid = pupilGrid(a, rings);
  for (const [px, py] of grid) { const r = rayFor(objDist, fieldDeg, px, py), h = traceRay(sys, r.start, r.dir, imageZ); if (h.ok) { xs.push(h.end[0]); ys.push(h.end[1]); } }
  const n = xs.length;
  const cx = n ? xs.reduce((s, v) => s + v, 0) / n : NaN, cy = n ? ys.reduce((s, v) => s + v, 0) / n : NaN;
  let ss = 0, g = 0;
  for (let i = 0; i < n; i++) { const d2 = (xs[i] - cx) ** 2 + (ys[i] - cy) ** 2; ss += d2; g = Math.max(g, Math.sqrt(d2)); }
  return { xs, ys, cx, cy, rms: n ? Math.sqrt(ss / n) : NaN, geo: g, lost: grid.length - n, total: grid.length };
}

/** Longitudinal spherical aberration: where an on-axis meridional ray at pupil height h crosses the axis, minus the paraxial focus (mm). */
export function lsa(sys: System, objDist: number, h: number, paraxialZ: number): number {
  const r = rayFor(objDist, 0, 0, h), t = traceRay(sys, r.start, r.dir, paraxialZ);
  if (!t.ok || Math.abs(t.dir[1]) < 1e-15) return NaN;
  return t.end[2] - t.end[1] * (t.dir[2] / t.dir[1]) - paraxialZ;
}

/** Real chief-ray height on the image plane (for distortion). */
export function chiefHeight(sys: System, objDist: number, fieldDeg: number, imageZ: number): number {
  const r = rayFor(objDist, fieldDeg, 0, 0), t = traceRay(sys, r.start, r.dir, imageZ);
  return t.ok ? t.end[1] : NaN;
}

/** Plane (offset from imageZ, within ±range) with the smallest RMS spot, by golden-section search after a coarse scan. */
export function bestFocus(sys: System, objDist: number, fieldDeg: number, a: number, imageZ: number, range: number): { dz: number; rms: number } {
  const f = (dz: number) => { const s = spot(sys, objDist, fieldDeg, a, imageZ + dz, 6); return s.xs.length ? s.rms : Infinity; };
  let best = 0, bv = f(0);
  for (let i = -40; i <= 40; i++) { const dz = (range * i) / 40, v = f(dz); if (v < bv) { bv = v; best = dz; } }
  let lo = best - range / 40, hi = best + range / 40;
  const gr = (Math.sqrt(5) - 1) / 2;
  for (let it = 0; it < 60; it++) { const m1 = hi - gr * (hi - lo), m2 = lo + gr * (hi - lo); if (f(m1) < f(m2)) hi = m2; else lo = m1; }
  const dz = (lo + hi) / 2;
  return { dz, rms: spot(sys, objDist, fieldDeg, a, imageZ + dz, 10).rms };
}
