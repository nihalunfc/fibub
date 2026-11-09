// Earthquake location and magnitude: S−P distance, a Geiger-style least-squares epicentre (and optionally depth)
// from P and S arrival times in a uniform half-space, local magnitude ML (Hutton and Boore 1987, the IASPEI 2013
// standard form) and moment magnitude Mw (IASPEI 2013). Plain maths; no DOM.

import { invSPD, solveSPD } from './fit.ts';

export const EARTH_R = 6371; // km, mean radius

/** Hypocentral distance (km) from the S−P time (s) for P and S speeds vp, vs (km/s): d = Δt·vp·vs/(vp − vs). */
export function spDistance(tsp: number, vp: number, vs: number): number {
  if (!(vp > vs && vs > 0)) throw new Error('P must be faster than S, and both above zero');
  return (tsp * vp * vs) / (vp - vs);
}

/** Great-circle distance in km between two points in degrees (haversine). */
export function gcDistance(lat1: number, lon1: number, lat2: number, lon2: number, R = EARTH_R): number {
  const r = Math.PI / 180, dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}
/** Point reached from (lat, lon) going `dist` km along a great circle at azimuth az (degrees from north). */
export function gcDestination(lat: number, lon: number, az: number, dist: number, R = EARTH_R): [number, number] {
  const r = Math.PI / 180, d = dist / R, p1 = lat * r, l1 = lon * r, t = az * r;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(t));
  const l2 = l1 + Math.atan2(Math.sin(t) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [p2 / r, ((((l2 / r) + 540) % 360) - 180)];
}

export type Station = { name: string; a: number; b: number; tp?: number; ts?: number; amp?: number };
export type LocateOpts = { vp: number; vs: number; spherical: boolean; depth: number; freeDepth: boolean };
export type Location = {
  a: number; b: number; depth: number; t0: number;
  /** Standard errors: east and north in km, depth in km, origin time in s (scaled by the RMS residual). */
  seE: number; seN: number; seZ: number; seT: number;
  rms: number; n: number; nPar: number; iterations: number; converged: boolean;
  rows: { name: string; epi: number; hypo: number; az: number; resP?: number; resS?: number }[];
  /** Local frame used for plotting (km east and north of a0, b0). */
  a0: number; b0: number;
};

/** Local frame: km east/north of (a0, b0) to station coordinates and back. Flat: a, b already in km (x east, y north). */
function frame(spherical: boolean, a0: number, b0: number) {
  const r = Math.PI / 180, c = Math.cos(a0 * r);
  return spherical
    ? { toAB: (e: number, n: number): [number, number] => [a0 + n / (EARTH_R * r), b0 + e / (EARTH_R * r * Math.max(c, 1e-6))],
        toEN: (a: number, b: number): [number, number] => [(b - b0) * EARTH_R * r * c, (a - a0) * EARTH_R * r],
        dist: (a1: number, b1: number, a2: number, b2: number) => gcDistance(a1, b1, a2, b2) }
    : { toAB: (e: number, n: number): [number, number] => [e, n], toEN: (a: number, b: number): [number, number] => [a, b],
        dist: (a1: number, b1: number, a2: number, b2: number) => Math.hypot(a1 - a2, b1 - b2) };
}

/** Azimuth from point 1 to point 2 in degrees (spherical: initial great-circle bearing; flat: a = x east, b = y north). */
export function azimuth(spherical: boolean, a1: number, b1: number, a2: number, b2: number): number {
  if (!spherical) return ((Math.atan2(a2 - a1, b2 - b1) * 180) / Math.PI + 360) % 360;
  const r = Math.PI / 180, p1 = a1 * r, p2 = a2 * r, dl = (b2 - b1) * r;
  return ((Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)) * 180) / Math.PI + 360) % 360;
}

/**
 * Locate an earthquake by least squares (Geiger's method with Marquardt damping): unknowns are the epicentre
 * (east, north offsets in a local frame), the origin time and, if freeDepth, the depth. Travel time = hypocentral
 * distance ÷ speed along a straight ray in a uniform half-space; epicentral distance is flat (x, y in km) or along
 * the great circle (latitude, longitude). Stations use a = x or latitude, b = y or longitude.
 */
export function locate(st: Station[], o: LocateOpts): Location {
  const obs: { i: number; t: number; v: number; ph: 'P' | 'S' }[] = [];
  st.forEach((s, i) => { if (Number.isFinite(s.tp)) obs.push({ i, t: s.tp!, v: o.vp, ph: 'P' }); if (Number.isFinite(s.ts)) obs.push({ i, t: s.ts!, v: o.vs, ph: 'S' }); });
  const nPar = o.freeDepth ? 4 : 3;
  if (st.length < 3) throw new Error('Enter at least three stations');
  if (obs.length < nPar) throw new Error(`Need at least ${nPar} arrival times for ${nPar} unknowns`);
  if (!(o.vp > o.vs && o.vs > 0)) throw new Error('P must be faster than S, and both above zero');
  if (!(o.depth >= 0)) throw new Error('Depth must be zero or more');
  const a0 = st.reduce((s, x) => s + x.a, 0) / st.length, b0 = st.reduce((s, x) => s + x.b, 0) / st.length;
  const F = frame(o.spherical, a0, b0);
  // Start under the station with the earliest arrival, a little toward the middle, with depth as given.
  const first = obs.reduce((m, x) => (x.t < m.t ? x : m), obs[0]);
  const [e1, n1] = F.toEN(st[first.i].a, st[first.i].b);
  const tmin = Math.min(...obs.map((x) => x.t));
  let p = [e1 * 0.8, n1 * 0.8, tmin - 1, o.freeDepth ? Math.max(o.depth, 5) : o.depth];
  const model = (q: number[]) => { const [a, b] = F.toAB(q[0], q[1]); return obs.map((x) => { const d = F.dist(a, b, st[x.i].a, st[x.i].b); return q[2] + Math.hypot(d, q[3]) / x.v; }); };
  const resid = (q: number[]) => model(q).map((m, k) => obs[k].t - m);
  const cost = (r: number[]) => r.reduce((s, v) => s + v * v, 0);
  const jac = (q: number[]) => {
    const J = obs.map(() => new Array(nPar).fill(0));
    for (let j = 0; j < nPar; j++) {
      const h = j === 2 ? 1e-4 : 1e-3, qp = q.slice(), qm = q.slice(); qp[j] += h; qm[j] -= h;
      if (j === 3 && qm[3] < 0) { qm[3] = q[3]; }
      const mp = model(qp), mm = model(qm), dh = qp[j] - qm[j];
      obs.forEach((_, k) => { J[k][j] = (mp[k] - mm[k]) / dh; });
    }
    return J;
  };
  let r = resid(p), c = cost(r), lambda = 1e-3, it = 0, converged = false;
  for (; it < 200; it++) {
    const J = jac(p);
    const A = Array.from({ length: nPar }, (_, i) => Array.from({ length: nPar }, (_, j) => J.reduce((s, row) => s + row[i] * row[j], 0)));
    const g = Array.from({ length: nPar }, (_, i) => J.reduce((s, row, k) => s + row[i] * r[k], 0));
    let improved = false;
    for (let tries = 0; tries < 40; tries++) {
      const d = solveSPD(A.map((row, i) => row.map((v, j) => (i === j ? v * (1 + lambda) + 1e-12 : v))), g);
      if (d) {
        const q = p.slice(); for (let j = 0; j < nPar; j++) q[j] += d[j];
        if (q[3] < 0) q[3] = Math.abs(q[3]) * 0.5; // depth stays below the surface
        const rq = resid(q), cq = cost(rq);
        if (Number.isFinite(cq) && cq <= c) {
          const step = Math.max(...d.map(Math.abs));
          const rel = (c - cq) / Math.max(c, 1e-300);
          p = q; r = rq; c = cq; lambda = Math.max(lambda / 10, 1e-12); improved = true;
          if (step < 1e-7 || rel < 1e-15) converged = true;
          break;
        }
      }
      lambda *= 10;
    }
    if (!improved) { converged = true; break; }
    if (converged) break;
  }
  const n = obs.length, df = n - nPar;
  const rms = Math.sqrt(c / n);
  const J = jac(p);
  const A = Array.from({ length: nPar }, (_, i) => Array.from({ length: nPar }, (_, j) => J.reduce((s, row) => s + row[i] * row[j], 0)));
  const inv = invSPD(A);
  const s2 = df > 0 ? c / df : NaN;
  const se = (j: number) => (inv && df > 0 ? Math.sqrt(inv[j][j] * s2) : NaN);
  const [a, b] = F.toAB(p[0], p[1]);
  const rows = st.map((s, i) => {
    const epi = F.dist(a, b, s.a, s.b), hypo = Math.hypot(epi, p[3]);
    const kp = obs.findIndex((x) => x.i === i && x.ph === 'P'), ks = obs.findIndex((x) => x.i === i && x.ph === 'S');
    return { name: s.name, epi, hypo, az: azimuth(o.spherical, a, b, s.a, s.b), resP: kp >= 0 ? r[kp] : undefined, resS: ks >= 0 ? r[ks] : undefined };
  });
  return { a, b, depth: p[3], t0: p[2], seE: se(0), seN: se(1), seZ: o.freeDepth ? se(3) : 0, seT: se(2), rms, n, nPar, iterations: it, converged, rows, a0, b0 };
}

/** Points of a circle of radius `rad` km around (a, b), in the plotting frame (km east, north of a0, b0). */
export function circleEN(spherical: boolean, a0: number, b0: number, a: number, b: number, rad: number, n = 96): [number[], number[]] {
  const F = frame(spherical, a0, b0), xs: number[] = [], ys: number[] = [];
  for (let k = 0; k <= n; k++) {
    const az = (360 * k) / n;
    let pa: number, pb: number;
    if (spherical) [pa, pb] = gcDestination(a, b, az, rad);
    else { const t = (az * Math.PI) / 180; pa = a + rad * Math.sin(t); pb = b + rad * Math.cos(t); }
    const [e, nn] = F.toEN(pa, pb); xs.push(e); ys.push(nn);
  }
  return [xs, ys];
}
/** Station or epicentre position in the plotting frame. */
export const toEN = (spherical: boolean, a0: number, b0: number, a: number, b: number) => frame(spherical, a0, b0).toEN(a, b);

/**
 * Local magnitude ML from a Wood-Anderson amplitude and hypocentral distance R (km), Hutton and Boore (1987), as
 * adopted by IASPEI (2013): ML = log10(A) + 1.11 log10(R) + 0.00189 R − 2.09, A = zero-to-peak ground displacement
 * in nm of the simulated Wood-Anderson record (the trace amplitude ÷ the nominal magnification 2080). With A as the
 * Wood-Anderson trace amplitude in mm this is ML = log10(A) + 1.11 log10(R) + 0.00189 R + 0.591 (R = 100 km, A = 1 mm
 * gives ML 3, Richter's anchor). Intended for roughly 10 to 600 km.
 */
export function localMagnitude(amp: number, R: number, unit: 'mm' | 'nm' = 'mm'): number {
  if (!(amp > 0 && R > 0)) return NaN;
  const nm = unit === 'nm' ? amp : (amp * 1e6) / 2080;
  return Math.log10(nm) + 1.11 * Math.log10(R) + 0.00189 * R - 2.09;
}

/** Moment magnitude from seismic moment M0 in N·m (IASPEI 2013): Mw = (2/3)(log10 M0 − 9.1). */
export const momentMagnitude = (M0: number) => (M0 > 0 ? (2 / 3) * (Math.log10(M0) - 9.1) : NaN);
/** Seismic moment M0 = μ·A·D (N·m) for rigidity μ (Pa), fault area A (m²) and average slip D (m). */
export const seismicMoment = (mu: number, area: number, slip: number) => mu * area * slip;
/** M0 (N·m) for a given Mw, the inverse of momentMagnitude. */
export const momentFromMw = (mw: number) => 10 ** (1.5 * mw + 9.1);

/** Parse a time: seconds (12.5), m:ss.s or h:mm:ss.s. Returns seconds, or NaN. */
export function parseTime(s: string): number {
  const t = s.trim();
  if (!t || t === '-' || t === '—') return NaN;
  if (!t.includes(':')) { const v = Number(t.replace(',', '.')); return Number.isFinite(v) ? v : NaN; }
  const parts = t.split(':').map((x) => Number(x.replace(',', '.')));
  if (parts.some((x) => !Number.isFinite(x)) || parts.length > 3) return NaN;
  return parts.reduce((acc, v) => acc * 60 + v, 0);
}
/** Format seconds like the input: h:mm:ss.ss if `clock`, else plain seconds. */
export function fmtTime(sec: number, clock: boolean, dec = 2): string {
  if (!clock) return sec.toFixed(dec);
  const day = 86400, k = 10 ** dec; let s = ((Math.round(sec * k) / k % day) + day) % day;
  const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
  const ss = s.toFixed(dec);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${ss.padStart(dec ? dec + 3 : 2, '0')}`;
}
