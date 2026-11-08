// GPS track maths: distances on the sphere and the WGS84 ellipsoid, moving time, speeds, climbing, splits, thinning.
// No DOM. Times in milliseconds, distances in metres, speeds in m/s.

export const R_MEAN = 6371008.8; // m, mean earth radius (IUGG)
export const WGS84 = { a: 6378137, f: 1 / 298.257223563 };
const D2R = Math.PI / 180;

/** Great-circle distance on a sphere of radius R (haversine). */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number, R = R_MEAN) {
  const p1 = lat1 * D2R, p2 = lat2 * D2R, dp = p2 - p1, dl = (lon2 - lon1) * D2R;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Distance and forward azimuth on the WGS84 ellipsoid by Vincenty's inverse formula. Falls back to the haversine
 * distance (scaled to the ellipsoid) in the rare nearly-antipodal cases where the iteration does not converge.
 */
export function vincenty(lat1: number, lon1: number, lat2: number, lon2: number) {
  const { a, f } = WGS84, b = a * (1 - f);
  const L = (lon2 - lon1) * D2R, U1 = Math.atan((1 - f) * Math.tan(lat1 * D2R)), U2 = Math.atan((1 - f) * Math.tan(lat2 * D2R));
  const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
  let lam = L, sinS = 0, cosS = 0, sig = 0, cos2a = 0, cos2sm = 0, sl = 0, cl = 0;
  for (let it = 0; it < 200; it++) {
    sl = Math.sin(lam); cl = Math.cos(lam);
    sinS = Math.sqrt((cU2 * sl) ** 2 + (cU1 * sU2 - sU1 * cU2 * cl) ** 2);
    if (sinS === 0) return { d: 0, az: 0, converged: true };
    cosS = sU1 * sU2 + cU1 * cU2 * cl; sig = Math.atan2(sinS, cosS);
    const sina = (cU1 * cU2 * sl) / sinS; cos2a = 1 - sina * sina;
    cos2sm = cos2a !== 0 ? cosS - (2 * sU1 * sU2) / cos2a : 0;
    const C = (f / 16) * cos2a * (4 + f * (4 - 3 * cos2a));
    const prev = lam;
    lam = L + (1 - C) * f * sina * (sig + C * sinS * (cos2sm + C * cosS * (-1 + 2 * cos2sm * cos2sm)));
    if (Math.abs(lam - prev) < 1e-12) {
      const u2 = (cos2a * (a * a - b * b)) / (b * b);
      const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))), B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
      const dS = B * sinS * (cos2sm + (B / 4) * (cosS * (-1 + 2 * cos2sm * cos2sm) - (B / 6) * cos2sm * (-3 + 4 * sinS * sinS) * (-3 + 4 * cos2sm * cos2sm)));
      const az = (Math.atan2(cU2 * sl, cU1 * sU2 - sU1 * cU2 * cl) / D2R + 360) % 360;
      return { d: b * A * (sig - dS), az, converged: true };
    }
  }
  return { d: haversine(lat1, lon1, lat2, lon2, (2 * a + b) / 3), az: NaN, converged: false };
}

export type Pt = { lat: number; lon: number; ele?: number; t?: number; seg: number };

/** Reads a time: ISO 8601 text, or a plain number of seconds. NaN if neither. */
export function parseTime(s: string): number {
  const x = s.trim();
  if (/^-?\d+(\.\d+)?$/.test(x)) return Number(x) * 1000;
  const t = Date.parse(x);
  return Number.isFinite(t) ? t : NaN;
}

/**
 * Track statistics. Distance is not counted across a gap between segments. moveSpeed: slower than this counts as
 * stopped. spikeSpeed: steps faster than this are treated as GPS spikes (their distance and speed are dropped).
 * eleStep: climbing and descending are only counted once the height has changed by at least this much (hysteresis),
 * which hides GPS height noise.
 */
export function analyse(pts: Pt[], o: { moveSpeed: number; spikeSpeed: number; eleStep: number; ellipsoid: boolean }) {
  const n = pts.length, cum = new Array<number>(n).fill(0), speed = new Array<number>(n).fill(NaN);
  let dist = 0, moving = 0, maxV = 0, spikes = 0, gaps = 0;
  const timed = pts.every((p) => Number.isFinite(p.t));
  let last = 0;
  for (let i = 1; i < n; i++) {
    const a = pts[last], b = pts[i];
    if (a.seg !== b.seg) { gaps++; cum[i] = dist; last = i; continue; }
    const d = o.ellipsoid ? vincenty(a.lat, a.lon, b.lat, b.lon).d : haversine(a.lat, a.lon, b.lat, b.lon);
    const dt = timed ? (b.t! - a.t!) / 1000 : NaN;
    const v = dt > 0 ? d / dt : NaN;
    // A spike is skipped: the next point is measured from the last good one.
    if (Number.isFinite(v) && v > o.spikeSpeed) { spikes++; cum[i] = dist; continue; }
    dist += d; cum[i] = dist; speed[i] = v; last = i;
    if (Number.isFinite(v)) { if (v >= o.moveSpeed) moving += dt; if (v > maxV) maxV = v; }
  }
  // Climbing with a dead band: a rise or fall only counts once the height has turned back by at least eleStep from
  // its highest or lowest point, so noise smaller than eleStep never adds up.
  let gain = 0, loss = 0, eMin = Infinity, eMax = -Infinity, dir = 0, lo = NaN, hi = NaN;
  for (const p of pts) {
    if (!Number.isFinite(p.ele)) continue;
    const e = p.ele!; eMin = Math.min(eMin, e); eMax = Math.max(eMax, e);
    if (!Number.isFinite(lo)) { lo = hi = e; continue; }
    if (dir === 0) {
      lo = Math.min(lo, e); hi = Math.max(hi, e);
      if (hi - lo >= o.eleStep && hi > lo) { if (e === hi) { dir = 1; } else { dir = -1; } }
    } else if (dir > 0) {
      if (e > hi) hi = e; else if (hi - e >= o.eleStep && hi - e > 0) { gain += hi - lo; dir = -1; lo = e; }
    } else if (e < lo) lo = e; else if (e - lo >= o.eleStep && e - lo > 0) { loss += hi - lo; dir = 1; hi = e; }
  }
  if (dir > 0) gain += hi - lo; else if (dir < 0) loss += hi - lo;
  const elapsed = timed && n > 1 ? (pts[n - 1].t! - pts[0].t!) / 1000 : NaN;
  return { dist, cum, speed, elapsed, moving: timed ? moving : NaN, avg: dist / elapsed, avgMoving: moving > 0 ? dist / moving : NaN, maxV: timed ? maxV : NaN, gain, loss, eMin, eMax, spikes, gaps, timed };
}

/** Time (s from the start) at each whole multiple of `unit` metres, by linear interpolation, and each split's time. */
export function splits(pts: Pt[], cum: number[], unit: number) {
  const out: { at: number; time: number; split: number }[] = [];
  if (!pts.every((p) => Number.isFinite(p.t)) || !(unit > 0)) return out;
  const t0 = pts[0].t!, total = cum[cum.length - 1];
  let k = 1, prev = 0;
  for (let i = 1; i < pts.length && k * unit <= total + 1e-9; i++) {
    while (k * unit <= cum[i] + 1e-9 && cum[i] > cum[i - 1]) {
      const fr = (k * unit - cum[i - 1]) / (cum[i] - cum[i - 1]), t = (pts[i - 1].t! + fr * (pts[i].t! - pts[i - 1].t!) - t0) / 1000;
      out.push({ at: k * unit, time: t, split: t - prev }); prev = t; k++;
    }
  }
  return out;
}

/** Douglas-Peucker thinning to a tolerance in metres (local flat projection), keeping each segment's ends. */
export function thin(pts: Pt[], tol: number) {
  if (!(tol > 0) || pts.length < 3) return pts.slice();
  const lat0 = pts.reduce((s, p) => s + p.lat, 0) / pts.length, kx = R_MEAN * D2R * Math.cos(lat0 * D2R), ky = R_MEAN * D2R;
  const keep = new Uint8Array(pts.length);
  const dp = (i0: number, i1: number) => {
    keep[i0] = keep[i1] = 1;
    const stack: [number, number][] = [[i0, i1]];
    while (stack.length) {
      const [s, e] = stack.pop()!;
      const ax = pts[s].lon * kx, ay = pts[s].lat * ky, bx = pts[e].lon * kx, by = pts[e].lat * ky, L = Math.hypot(bx - ax, by - ay);
      let best = -1, bi = -1;
      for (let i = s + 1; i < e; i++) {
        const px = pts[i].lon * kx, py = pts[i].lat * ky;
        const d = L > 0 ? Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / L : Math.hypot(px - ax, py - ay);
        if (d > best) { best = d; bi = i; }
      }
      if (best > tol) { keep[bi] = 1; stack.push([s, bi], [bi, e]); }
    }
  };
  let s = 0;
  for (let i = 1; i <= pts.length; i++) if (i === pts.length || pts[i].seg !== pts[s].seg) { dp(s, i - 1); s = i; }
  return pts.filter((_, i) => keep[i]);
}

/** "1:02:05" or "4:07" from seconds. */
export function fmtDuration(s: number) {
  if (!Number.isFinite(s)) return '–';
  const r = Math.round(s), h = Math.floor(r / 3600), m = Math.floor((r % 3600) / 60), sec = r % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
}
