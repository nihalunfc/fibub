// Earth satellite orbits: two-line element sets, Keplerian motion with the main J2 drifts (and the TLE's
// drag term), ground tracks, look angles and passes over a place. Not SGP4: good for planning over a few
// days, not for conjunction work.

export const MU = 398600.4418, RE = 6378.137, J2 = 1.08262668e-3, F_WGS = 1 / 298.257223563, DAY_S = 86400;
const D2R = Math.PI / 180, TAU = 2 * Math.PI;

export type Elements = {
  name: string; epoch: number; // ms
  inc: number; raan: number; ecc: number; argp: number; M0: number; // degrees, except ecc
  n: number; // revolutions per day
  ndot2: number; // TLE first derivative of mean motion divided by 2 (rev/day²)
};

/** The TLE checksum: digits add their value, minus signs count 1, everything else 0; modulo 10. */
export function tleChecksum(line: string) {
  let s = 0; for (const c of line.slice(0, 68)) { if (c >= '0' && c <= '9') s += +c; else if (c === '-') s += 1; }
  return s % 10;
}

/** Read a two-line (or three-line, with a name) element set. */
export function parseTLE(text: string): Elements {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim());
  const i1 = lines.findIndex((l) => l.startsWith('1 ')), l1 = lines[i1], l2 = lines[i1 + 1];
  if (i1 < 0 || !l2 || !l2.startsWith('2 ')) throw new Error('Paste the two lines that start with "1 " and "2 " (a name line above them is fine).');
  if (l1.length < 68 || l2.length < 68) throw new Error('Each TLE line must be 69 characters long; part of a line seems to be missing.');
  for (const l of [l1, l2]) if (l.length >= 69 && tleChecksum(l) !== +l[68]) throw new Error(`The checksum on line ${l[0]} does not match: a digit may have been mistyped.`);
  const yy = +l1.slice(18, 20), doy = +l1.slice(20, 32), year = yy < 57 ? 2000 + yy : 1900 + yy;
  const epoch = Date.UTC(year, 0, 1) + (doy - 1) * 864e5;
  const name = i1 > 0 ? lines[i1 - 1].replace(/^0 /, '').trim() : `Satellite ${l1.slice(2, 7).trim()}`;
  const el: Elements = {
    name, epoch, ndot2: +l1.slice(33, 43),
    inc: +l2.slice(8, 16), raan: +l2.slice(17, 25), ecc: +`0.${l2.slice(26, 33).trim()}`, argp: +l2.slice(34, 42), M0: +l2.slice(43, 51), n: +l2.slice(52, 63),
  };
  if (![el.inc, el.raan, el.ecc, el.argp, el.M0, el.n, epoch].every(Number.isFinite) || !(el.n > 0)) throw new Error('Some numbers in the TLE could not be read.');
  return el;
}

/** Elements from perigee and apogee heights (km above the equator's radius). */
export function fromHeights(name: string, perigee: number, apogee: number, inc: number, raan: number, argp: number, M0: number, epoch: number): Elements {
  if (!(perigee > 0) || !(apogee >= perigee)) throw new Error('The apogee must be at least as high as the perigee, and the perigee above 0 km.');
  const rp = RE + perigee, ra = RE + apogee, a = (rp + ra) / 2;
  return { name, epoch, inc, raan, argp, M0, ecc: (ra - rp) / (ra + rp), n: DAY_S / (TAU * Math.sqrt(a ** 3 / MU)), ndot2: 0 };
}

/** Size, speeds and J2 drift rates of an orbit (rates in degrees per day). */
export function orbitInfo(el: Elements) {
  const nRad = (el.n * TAU) / DAY_S, a = Math.cbrt(MU / (nRad * nRad)), e = el.ecc, p = a * (1 - e * e), ci = Math.cos(el.inc * D2R);
  const k = 1.5 * J2 * (RE / p) ** 2 * nRad * (DAY_S / D2R);
  return {
    a, periodMin: 1440 / el.n, perigee: a * (1 - e) - RE, apogee: a * (1 + e) - RE,
    vPerigee: Math.sqrt(MU * (2 / (a * (1 - e)) - 1 / a)), vApogee: Math.sqrt(MU * (2 / (a * (1 + e)) - 1 / a)),
    raanRate: -k * ci, argpRate: 0.5 * k * (5 * ci * ci - 1), mRate: 0.5 * k * Math.sqrt(1 - e * e) * (3 * ci * ci - 1),
  };
}

/** Inclination (degrees) that makes an orbit sun-synchronous: its plane turns 360° a year. */
export function ssoInclination(perigee: number, apogee: number) {
  const rp = RE + perigee, ra = RE + apogee, a = (rp + ra) / 2, e = (ra - rp) / (ra + rp), p = a * (1 - e * e), n = Math.sqrt(MU / a ** 3);
  const need = (TAU / (365.2422 * DAY_S)), c = -need / (1.5 * J2 * (RE / p) ** 2 * n);
  return Math.abs(c) <= 1 ? Math.acos(c) / D2R : NaN;
}

export function kepler(M: number, e: number) {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 50; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-12) break; }
  return E;
}

/** Position (km) in the true-equator frame of the TLE (TEME), t in ms. */
export function position(el: Elements, t: number): [number, number, number] {
  const dtD = (t - el.epoch) / 864e5, info = orbitInfo(el);
  const revs = el.n * dtD + el.ndot2 * dtD * dtD; // the TLE stores ṅ/2, so this is n t + ṅ t²/2
  const nNow = el.n + 2 * el.ndot2 * dtD, a = Math.cbrt(MU / ((nNow * TAU) / DAY_S) ** 2), e = el.ecc;
  const M = (((el.M0 + revs * 360 + info.mRate * dtD) % 360) + 360) % 360 * D2R;
  const w = (el.argp + info.argpRate * dtD) * D2R, O = (el.raan + info.raanRate * dtD) * D2R, i = el.inc * D2R;
  const E = kepler(M, e), x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), ci = Math.cos(i), si = Math.sin(i);
  return [
    (cO * cw - sO * sw * ci) * x + (-cO * sw - sO * cw * ci) * y,
    (sO * cw + cO * sw * ci) * x + (-sO * sw + cO * cw * ci) * y,
    sw * si * x + cw * si * y,
  ];
}

/** Greenwich mean sidereal time (radians), IAU 1982, as SGP4 uses. */
export function gmst(t: number) {
  const tu = (t / 864e5 + 2440587.5 - 2451545.0) / 36525;
  const s = 67310.54841 + (876600 * 3600 + 8640184.812866) * tu + 0.093104 * tu * tu - 6.2e-6 * tu ** 3;
  return ((((s % 86400) + 86400) % 86400) / 86400) * TAU;
}

function toEcef(r: [number, number, number], t: number): [number, number, number] {
  const g = gmst(t), c = Math.cos(g), s = Math.sin(g);
  return [c * r[0] + s * r[1], -s * r[0] + c * r[1], r[2]];
}

/** The point on the ground below the satellite: geodetic latitude, longitude (degrees) and height (km). */
export function subpoint(r: [number, number, number], t: number) {
  const [x, y, z] = toEcef(r, t), e2 = F_WGS * (2 - F_WGS), p = Math.hypot(x, y);
  let lat = Math.atan2(z, p * (1 - e2)), h = 0;
  for (let k = 0; k < 6; k++) { const N = RE / Math.sqrt(1 - e2 * Math.sin(lat) ** 2); h = p / Math.cos(lat) - N; lat = Math.atan2(z, p * (1 - (e2 * N) / (N + h))); }
  return { lat: lat / D2R, lon: ((Math.atan2(y, x) / D2R + 540) % 360) - 180, h };
}

function siteEcef(lat: number, lon: number, hKm: number): [number, number, number] {
  const e2 = F_WGS * (2 - F_WGS), la = lat * D2R, lo = lon * D2R, N = RE / Math.sqrt(1 - e2 * Math.sin(la) ** 2);
  return [(N + hKm) * Math.cos(la) * Math.cos(lo), (N + hKm) * Math.cos(la) * Math.sin(lo), (N * (1 - e2) + hKm) * Math.sin(la)];
}

/** Azimuth, elevation (degrees) and range (km) of the satellite from a place. */
export function lookAngles(r: [number, number, number], t: number, lat: number, lon: number, hKm = 0) {
  const s = toEcef(r, t), o = siteEcef(lat, lon, hKm), d = [s[0] - o[0], s[1] - o[1], s[2] - o[2]];
  const la = lat * D2R, lo = lon * D2R;
  const east = -Math.sin(lo) * d[0] + Math.cos(lo) * d[1];
  const north = -Math.sin(la) * Math.cos(lo) * d[0] - Math.sin(la) * Math.sin(lo) * d[1] + Math.cos(la) * d[2];
  const up = Math.cos(la) * Math.cos(lo) * d[0] + Math.cos(la) * Math.sin(lo) * d[1] + Math.sin(la) * d[2];
  const range = Math.hypot(...d);
  return { az: ((Math.atan2(east, north) / D2R) + 360) % 360, el: Math.asin(up / range) / D2R, range };
}

/** Low-precision Sun direction (unit vector, equator of date), good to about 0.01°. */
export function sunVector(t: number): [number, number, number] {
  const n = t / 864e5 + 2440587.5 - 2451545.0, L = (280.46 + 0.9856474 * n) * D2R, g = (357.528 + 0.9856003 * n) * D2R;
  const lam = L + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * D2R, eps = (23.439 - 4e-7 * n) * D2R;
  return [Math.cos(lam), Math.cos(eps) * Math.sin(lam), Math.sin(eps) * Math.sin(lam)];
}
/** True when the satellite is in sunlight (cylindrical Earth shadow). */
export function sunlit(r: [number, number, number], t: number) {
  const s = sunVector(t), d = r[0] * s[0] + r[1] * s[1] + r[2] * s[2];
  if (d > 0) return true;
  return Math.hypot(r[0] - d * s[0], r[1] - d * s[1], r[2] - d * s[2]) > RE;
}
/** The Sun's elevation (degrees) at a place. */
export function sunElevation(t: number, lat: number, lon: number) {
  const s = sunVector(t), au = 149597870.7;
  return lookAngles([s[0] * au, s[1] * au, s[2] * au], t, lat, lon).el;
}

export type Pass = { rise: number; peak: number; set: number; maxEl: number; riseAz: number; peakAz: number; setAz: number; visible: boolean };

/** Passes above `minEl` degrees over a place between two moments (ms). A pass is visible when the satellite is
 *  sunlit while the sky at the place is dark (Sun below −6°) at some point with the satellite at least 10° up. */
export function passes(el: Elements, lat: number, lon: number, hKm: number, from: number, to: number, minEl = 10): Pass[] {
  const out: Pass[] = [], step = Math.min(60, Math.max(10, (1440 / el.n) * 60 / 40)) * 1000;
  const elev = (t: number) => lookAngles(position(el, t), t, lat, lon, hKm).el;
  const edge = (a: number, b: number, up: boolean) => { for (let k = 0; k < 30 && b - a > 500; k++) { const c = (a + b) / 2; if ((elev(c) > 0) === up) b = c; else a = c; } return (a + b) / 2; };
  let prev = elev(from), t0: number | null = prev > 0 ? from : null;
  for (let t = from + step; t <= to; t += step) {
    const e = elev(t);
    if (prev <= 0 && e > 0) t0 = edge(t - step, t, true);
    if (prev > 0 && e <= 0 && t0 !== null) {
      const t1 = edge(t - step, t, false);
      // Highest point by golden-section search between rise and set.
      let a = t0, b = t1;
      for (let k = 0; k < 40 && b - a > 500; k++) { const m1 = b - (b - a) * 0.618, m2 = a + (b - a) * 0.618; if (elev(m1) < elev(m2)) a = m1; else b = m2; }
      const pk = (a + b) / 2, la = (x: number) => lookAngles(position(el, x), x, lat, lon, hKm);
      const P = la(pk);
      if (P.el >= minEl) {
        let vis = false;
        for (let x = t0; x <= t1 && !vis; x += 20e3) { const L = la(x); if (L.el >= 10 && sunlit(position(el, x), x) && sunElevation(x, lat, lon) < -6) vis = true; }
        out.push({ rise: t0, peak: pk, set: t1, maxEl: P.el, riseAz: la(t0).az, peakAz: P.az, setAz: la(t1).az, visible: vis });
      }
      t0 = null;
    }
    prev = e;
  }
  return out;
}

/** Ground track points from `from` to `to` (ms). */
export function groundTrack(el: Elements, from: number, to: number, n = 600) {
  const pts: { t: number; lat: number; lon: number; h: number; lit: boolean }[] = [];
  for (let k = 0; k <= n; k++) { const t = from + ((to - from) * k) / n, r = position(el, t); pts.push({ t, ...subpoint(r, t), lit: sunlit(r, t) }); }
  return pts;
}

/** Half-angle (degrees of Earth's surface) the satellite can see down to a given elevation. */
export function footprint(hKm: number, minEl = 0) {
  const e = minEl * D2R;
  return (Math.acos((RE / (RE + hKm)) * Math.cos(e)) - e) / D2R;
}
