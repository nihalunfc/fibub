// Batch airmass planning: for a list of J2000 targets, a site and a span of time, the altitude and airmass through
// the night, the meridian transit, the highest point inside the span, the hours spent below an airmass limit, and
// the Moon's distance. Positions from astronomy-engine (precession, nutation, aberration; refraction optional).
// Airmass formulas: plane-parallel sec z, Hardie (1962), Kasten and Young (1989) and Pickering (2002).
import * as A from 'astronomy-engine';
import { parseAngle } from '../astro/place.ts';

const D2R = Math.PI / 180;
export type Formula = 'secz' | 'hardie' | 'ky' | 'pickering';
export const FORMULAS: { id: Formula; name: string; cite: string }[] = [
  { id: 'secz', name: 'sec z (plane-parallel)', cite: 'X = 1/cos z, a flat atmosphere; good above about 30° altitude.' },
  { id: 'hardie', name: 'Hardie (1962)', cite: 'X = sec z − 0.0018167(sec z − 1) − 0.002875(sec z − 1)² − 0.0008083(sec z − 1)³; Hardie, R. H. 1962, in Astronomical Techniques, ed. Hiltner, p. 184. Usable to z ≈ 85°.' },
  { id: 'ky', name: 'Kasten and Young (1989)', cite: 'X = 1/[cos z + 0.50572(96.07995° − z)^−1.6364]; Kasten, F. & Young, A. T. 1989, Applied Optics 28, 4735. About 38 at the horizon.' },
  { id: 'pickering', name: 'Pickering (2002)', cite: 'X = 1/sin(h + 244/(165 + 47h^1.1)), h the apparent altitude in degrees; Pickering, K. A. 2002, DIO 12, 3. About 38 at the horizon.' },
];

/** Airmass for an altitude h in degrees (above the horizon). Infinity at or below 0° (and where sec-z based
 *  formulas stop making sense, below 0°). */
export function airmass(h: number, f: Formula): number {
  if (!(h > 0)) return Infinity;
  const z = 90 - h, sec = 1 / Math.cos(z * D2R);
  switch (f) {
    case 'secz': return sec;
    case 'hardie': { const s = sec - 1; return sec - 0.0018167 * s - 0.002875 * s * s - 0.0008083 * s * s * s; }
    case 'ky': return 1 / (Math.cos(z * D2R) + 0.50572 * Math.pow(96.07995 - z, -1.6364));
    case 'pickering': return 1 / Math.sin((h + 244 / (165 + 47 * Math.pow(h, 1.1))) * D2R);
  }
}
/** The lowest altitude (degrees) at which the airmass is still at most `X`, by bisection (all four formulas
 *  fall steadily from the horizon to the zenith above 1°; Hardie's turns over near the horizon, so the search
 *  starts at 5°, where it is still monotonic, for limits it reaches). */
export function altitudeFor(X: number, f: Formula): number {
  if (!(X >= 1)) return NaN;
  let lo = f === 'hardie' ? 5 : 0.01, hi = 90;
  if (airmass(lo, f) <= X) return lo;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (airmass(m, f) > X) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

export type Site = { lat: number; lon: number; elev: number };
export type Target = { name: string; ra: number; dec: number; line: number }; // ra, dec in degrees (J2000)

/** Read a target list: one target a line, "name, RA, Dec" (comma, tab or semicolon), or "name RA Dec" with
 *  spaces, where RA and Dec can be h m s / d m s with spaces or colons, or decimal. A decimal RA is in degrees
 *  unless `decimalRaHours`. A first line with the words RA and Dec is skipped. */
export function parseTargets(text: string, decimalRaHours = false): { targets: Target[]; bad: { line: number; text: string }[] } {
  const targets: Target[] = [], bad: { line: number; text: string }[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((raw, k) => {
    const l = raw.trim();
    if (!l || l.startsWith('#')) return;
    if (k === 0 && /\bra\b/i.test(l) && /\bdec\b/i.test(l)) return;
    let name = '', ras = '', decs = '';
    const parts = l.split(/\s*[,;\t]\s*/);
    if (parts.length >= 3) { decs = parts[parts.length - 1]; ras = parts[parts.length - 2]; name = parts.slice(0, -2).join(', '); }
    else {
      const t = l.split(/\s+/), isNum = (s: string) => /^[+-−]?\d+(\.\d*)?$/.test(s);
      // Try "name h m s d m s", then "name ra dec" (each a single token, decimal or with colons or units).
      if (t.length >= 6 && t.slice(-6).every(isNum)) { ras = t.slice(-6, -3).join(' '); decs = t.slice(-3).join(' '); name = t.slice(0, -6).join(' '); }
      else if (t.length >= 2) { decs = t[t.length - 1]; ras = t[t.length - 2]; name = t.slice(0, -2).join(' '); }
    }
    const raNum = /^[+]?\d+(\.\d*)?$/.test(ras.trim());
    let ra = parseAngle(ras, true);
    if (ra != null && raNum && decimalRaHours) ra = Number(ras);
    const dec = parseAngle(decs, false);
    if (ra == null || dec == null || !(ra >= 0 && ra < 24.0000001)) { bad.push({ line: k + 1, text: l }); return; }
    targets.push({ name: name || `Target ${targets.length + 1}`, ra: ra * 15, dec, line: k + 1 });
  });
  return { targets, bad };
}

/** Altitude and azimuth (degrees) of a J2000 position, topocentric, with or without standard refraction. */
// The rotation and the Earth's velocity depend only on the time and place, so they are kept for reuse
// across targets (a plan for many targets asks for the same times again and again).
const frames = new Map<string, { rot: A.RotationMatrix; b: [number, number, number] }>();
function frameAt(time: Date, obs: A.Observer) {
  const key = `${time.getTime()},${obs.latitude},${obs.longitude},${obs.height}`;
  let f = frames.get(key);
  if (!f) {
    if (frames.size > 20000) frames.clear();
    const e = A.BaryState(A.Body.Earth, time);
    f = { rot: A.Rotation_EQJ_HOR(time, obs), b: [e.vx / C_AU_DAY, e.vy / C_AU_DAY, e.vz / C_AU_DAY] };
    frames.set(key, f);
  }
  return f;
}
export function altAz(ra: number, dec: number, time: Date, obs: A.Observer, refraction: boolean) {
  const f = frameAt(time, obs), u = A.VectorFromSphere(new A.Spherical(dec, ra, 1), A.MakeTime(time));
  const x = u.x + f.b[0], y = u.y + f.b[1], z = u.z + f.b[2], n = Math.hypot(x, y, z);
  const h = A.HorizonFromVector(A.RotateVector(f.rot, new A.Vector(x / n, y / n, z / n, u.t)), undefined as any);
  // Standard refraction (astronomy-engine's 'normal' model), only for objects near or above the horizon.
  return { alt: refraction && h.lat > -1 ? h.lat + A.Refraction('normal' as any, h.lat) : h.lat, az: h.lon };
}
/** Annual aberration is applied to first order in v/c: the unit vector is shifted by the Earth's barycentric
 *  velocity over c (up to 20.5″), as star positions are seen from the moving Earth. */
const C_AU_DAY = 173.1446326742403;
/** RA and Dec of date (degrees) of a J2000 position, for the meridian transit. */
function ofDate(ra: number, dec: number, time: Date) {
  const v = A.RotateVector(A.Rotation_EQJ_EQD(time), A.VectorFromSphere(new A.Spherical(dec, ra, 1), A.MakeTime(time)));
  const s = A.SphereFromVector(v);
  return { ra: ((s.lon % 360) + 360) % 360, dec: s.lat };
}
/** Angular separation in degrees. */
export function separation(ra1: number, dec1: number, ra2: number, dec2: number) {
  const a = dec1 * D2R, b = dec2 * D2R, d = (ra2 - ra1) * D2R;
  const x = Math.sin((b - a) / 2) ** 2 + Math.cos(a) * Math.cos(b) * Math.sin(d / 2) ** 2;
  return (2 * Math.asin(Math.min(1, Math.sqrt(x)))) / D2R;
}
/** The Moon's topocentric J2000 RA and Dec (degrees), seen from the site. */
const moons = new Map<string, { ra: number; dec: number }>();
export function moonRaDec(time: Date, obs: A.Observer) {
  const key = `${time.getTime()},${obs.latitude},${obs.longitude},${obs.height}`;
  let m = moons.get(key);
  if (!m) { if (moons.size > 20000) moons.clear(); const e = A.Equator(A.Body.Moon, time, obs, false, true); m = { ra: e.ra * 15, dec: e.dec }; moons.set(key, m); }
  return m;
}

export type Plan = {
  target: Target;
  samples: { time: Date; alt: number; az: number; X: number }[];
  transit: Date; transitAlt: number; // upper culmination nearest the middle of the span
  best: Date; bestAlt: number; bestX: number; // highest point inside the span
  hoursBelow: number; firstBelow: Date | null; lastBelow: Date | null; // time with airmass ≤ limit
  moonAtBest: number; moonMin: number; // Moon separation (degrees) at the best time, and the least during the span
  neverUp: boolean;
};
export type Options = { formula: Formula; refraction: boolean; limit: number; stepMin: number };

/** Plan one target from `from` to `to`. The table uses `stepMin`; times below the limit and the highest point
 *  are found on a 1-minute grid with linear interpolation of the crossings, then refined to the second. */
export function plan(t: Target, site: Site, from: Date, to: Date, o: Options): Plan {
  const obs = new A.Observer(site.lat, site.lon, site.elev || 0), t0 = from.getTime(), t1 = to.getTime();
  const alt = (ms: number) => altAz(t.ra, t.dec, new Date(ms), obs, o.refraction).alt;
  const samples: Plan['samples'] = [];
  for (let ms = t0; ms <= t1 + 1; ms += o.stepMin * 60e3) { const a = altAz(t.ra, t.dec, new Date(ms), obs, o.refraction); samples.push({ time: new Date(ms), alt: a.alt, az: a.az, X: airmass(a.alt, o.formula) }); }
  // Fine grid.
  const hLim = altitudeFor(o.limit, o.formula), step = 60e3, n = Math.max(1, Math.ceil((t1 - t0) / step));
  let prevT = t0, prevA = alt(t0), bestT = t0, bestA = prevA, below = 0, first: number | null = prevA >= hLim ? t0 : null, last: number | null = first;
  for (let k = 1; k <= n; k++) {
    const ms = Math.min(t1, t0 + k * step), a = alt(ms);
    if (a > bestA) { bestA = a; bestT = ms; }
    const inA = prevA >= hLim, inB = a >= hLim;
    if (inA && inB) below += ms - prevT;
    else if (inA !== inB) {
      const tc = prevT + ((hLim - prevA) / (a - prevA)) * (ms - prevT);
      below += inA ? tc - prevT : ms - tc;
      if (inB && first == null) first = tc;
      if (inA) last = tc;
    }
    if (inB) last = ms;
    prevT = ms; prevA = a;
  }
  // Refine the highest point by golden-section search inside ±1 minute.
  if (bestT > t0 && bestT < t1) {
    let a = bestT - step, b = bestT + step;
    for (let i = 0; i < 40; i++) { const m1 = a + (b - a) * 0.382, m2 = a + (b - a) * 0.618; if (alt(m1) < alt(m2)) a = m1; else b = m2; }
    bestT = (a + b) / 2; bestA = alt(bestT);
  }
  // Meridian transit: hour angle 0 nearest the middle of the span (sidereal day 0.99727 solar days), refined.
  const mid = (t0 + t1) / 2;
  let tt = mid;
  for (let i = 0; i < 4; i++) {
    const d = ofDate(t.ra, t.dec, new Date(tt)), lst = (A.SiderealTime(new Date(tt)) * 15 + site.lon) % 360;
    let ha = (((lst - d.ra) % 360) + 540) % 360 - 180; // −180..180°
    tt -= (ha / 360) * 86164.0905e3;
  }
  const moon = moonRaDec(new Date(bestT), obs);
  let moonMin = Infinity;
  for (const s of samples) { const m = moonRaDec(s.time, obs); moonMin = Math.min(moonMin, separation(t.ra, t.dec, m.ra, m.dec)); }
  return {
    target: t, samples, transit: new Date(tt), transitAlt: alt(tt), best: new Date(bestT), bestAlt: bestA, bestX: airmass(bestA, o.formula),
    hoursBelow: below / 3600e3, firstBelow: first != null ? new Date(first) : null, lastBelow: last != null && first != null ? new Date(last) : null,
    moonAtBest: separation(t.ra, t.dec, moon.ra, moon.dec), moonMin, neverUp: bestA <= 0,
  };
}
