// Classical (Keplerian) orbital elements and state vectors for any central body: conversions both ways, the three
// anomalies for elliptic, parabolic and hyperbolic orbits, Kepler's equation, two-body propagation over time, and
// two-line element sets read field by field. Lengths in km, speeds in km/s, times in s, angles in degrees
// at the interface (radians inside). Pure two-body motion: no J2, drag or third bodies.
import { tleChecksum } from './satorbit.ts';

const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI;
export type V3 = [number, number, number];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const wrap = (x: number) => ((x % TAU) + TAU) % TAU;
const wrapPi = (x: number) => { const y = wrap(x); return y > Math.PI ? y - TAU : y; };

/** Elements: size as p (semi-latus rectum, km), which is finite for every conic; e ≥ 0; angles in degrees. */
export type Elements = { p: number; e: number; i: number; raan: number; argp: number; nu: number };

export type Kind = 'circular' | 'elliptic' | 'parabolic' | 'hyperbolic';
export const kindOf = (e: number, tol = 1e-10): Kind => (e < tol ? 'circular' : Math.abs(e - 1) < tol ? 'parabolic' : e < 1 ? 'elliptic' : 'hyperbolic');
/** Semi-major axis from p and e (negative for hyperbolas, Infinity for a parabola). */
export const aOf = (p: number, e: number) => (Math.abs(1 - e * e) < 1e-14 ? Infinity : p / (1 - e * e));
/** p from a size given as a semi-major axis or periapsis distance q. */
export const pFromA = (a: number, e: number) => a * (1 - e * e);
export const pFromQ = (q: number, e: number) => q * (1 + e);

/** State vectors (r km, v km/s) in the reference frame from the elements. */
export function toState(el: Elements, mu: number): { r: V3; v: V3 } {
  const { p, e } = el, i = el.i * D2R, O = el.raan * D2R, w = el.argp * D2R, nu = el.nu * D2R;
  if (!(p > 0) || !(e >= 0) || !(mu > 0)) throw new Error('The orbit needs p > 0, e ≥ 0 and μ > 0.');
  if (e >= 1 && 1 + e * Math.cos(nu) <= 1e-12) throw new Error(`A ${e > 1 ? 'hyperbolic' : 'parabolic'} orbit never reaches this true anomaly: |ν| must be below ${(Math.acos(-1 / e) * R2D).toFixed(4)}°.`);
  const rr = p / (1 + e * Math.cos(nu)), k = Math.sqrt(mu / p);
  const rP: V3 = [rr * Math.cos(nu), rr * Math.sin(nu), 0], vP: V3 = [-k * Math.sin(nu), k * (e + Math.cos(nu)), 0];
  const cO = Math.cos(O), sO = Math.sin(O), ci = Math.cos(i), si = Math.sin(i), cw = Math.cos(w), sw = Math.sin(w);
  // Rotation from the perifocal frame: R3(−Ω) R1(−i) R3(−ω).
  const Q = [
    [cO * cw - sO * sw * ci, -cO * sw - sO * cw * ci, sO * si],
    [sO * cw + cO * sw * ci, -sO * sw + cO * cw * ci, -cO * si],
    [sw * si, cw * si, ci],
  ];
  const rot = (x: V3): V3 => [Q[0][0] * x[0] + Q[0][1] * x[1], Q[1][0] * x[0] + Q[1][1] * x[1], Q[2][0] * x[0] + Q[2][1] * x[1]];
  return { r: rot(rP), v: rot(vP) };
}

export type FromState = Elements & {
  a: number; kind: Kind; h: number; energy: number;
  /** Which angles are undefined and how they were set: a circular orbit has no periapsis (ω = 0, ν = argument of
   *  latitude u), an equatorial orbit has no node (Ω = 0, ω = longitude of periapsis). */
  circular: boolean; equatorial: boolean; u: number; lonPeri: number; trueLon: number;
};

/** Elements from state vectors (r km, v km/s), handling the circular and equatorial special cases. */
export function fromState(r: V3, v: V3, mu: number, tol = 1e-10): FromState {
  const rn = norm(r), vn = norm(v);
  if (!(rn > 0) || !(mu > 0)) throw new Error('The position must not be zero, and μ must be positive.');
  const hv = cross(r, v), h = norm(hv);
  if (!(h > 1e-12 * rn * Math.max(vn, 1e-12))) throw new Error('The position and velocity are parallel (a straight-line, radial orbit): the elements are not defined.');
  const nv: V3 = [-hv[1], hv[0], 0], n = norm(nv);
  const rv = dot(r, v);
  const ev = [0, 1, 2].map((k) => ((vn * vn - mu / rn) * r[k] - rv * v[k]) / mu) as V3, e = norm(ev);
  const energy = (vn * vn) / 2 - mu / rn, p = (h * h) / mu;
  const i = Math.acos(Math.max(-1, Math.min(1, hv[2] / h)));
  const circular = e < tol, equatorial = n < tol * h;
  const ang = (a: V3, b: V3) => Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (norm(a) * norm(b)))));
  let raan = 0, argp = 0, nu = 0;
  if (!equatorial) { raan = Math.acos(Math.max(-1, Math.min(1, nv[0] / n))); if (nv[1] < 0) raan = TAU - raan; }
  // Argument of latitude u (from the node), longitude of periapsis and true longitude (from the x axis).
  let u = NaN; if (!equatorial) { u = ang(nv, r); if (r[2] < 0) u = TAU - u; }
  let lonPeri = NaN; if (!circular) { lonPeri = Math.atan2(ev[1], ev[0]); if (hv[2] < 0) lonPeri = -lonPeri; lonPeri = wrap(lonPeri); }
  let trueLon = Math.atan2(r[1], r[0]); if (hv[2] < 0) trueLon = -trueLon; trueLon = wrap(trueLon);
  if (!circular) { nu = ang(ev, r); if (rv < 0) nu = TAU - nu; }
  if (!circular && !equatorial) { argp = ang(nv, ev); if (ev[2] < 0) argp = TAU - argp; }
  else if (circular && !equatorial) { argp = 0; nu = u; }
  else if (!circular && equatorial) { raan = 0; argp = lonPeri; }
  else { raan = 0; argp = 0; nu = trueLon; }
  return {
    p, e: circular ? 0 : e, i: i * R2D, raan: raan * R2D, argp: argp * R2D, nu: nu * R2D,
    a: energy === 0 ? Infinity : -mu / (2 * energy), kind: kindOf(e, tol), h, energy, circular, equatorial,
    u: u * R2D, lonPeri: lonPeri * R2D, trueLon: trueLon * R2D,
  };
}

// ---- Anomalies (radians) ----
/** Eccentric (E, elliptic), hyperbolic (H) or parabolic (D = tan ν/2) anomaly from the true anomaly. */
export function nuToAnomaly(nu: number, e: number) {
  if (e < 1 - 1e-12) return 2 * Math.atan2(Math.sqrt(1 - e) * Math.sin(nu / 2), Math.sqrt(1 + e) * Math.cos(nu / 2));
  if (e > 1 + 1e-12) return 2 * Math.atanh(Math.sqrt((e - 1) / (e + 1)) * Math.tan(nu / 2));
  return Math.tan(nu / 2);
}
export function anomalyToNu(x: number, e: number) {
  if (e < 1 - 1e-12) return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(x / 2), Math.sqrt(1 - e) * Math.cos(x / 2));
  if (e > 1 + 1e-12) return 2 * Math.atan(Math.sqrt((e + 1) / (e - 1)) * Math.tanh(x / 2));
  return 2 * Math.atan(x);
}
/** Mean anomaly from E, H or D: M = E − e sin E; M = e sinh H − H; M = D + D³/3 (Barker). */
export function anomalyToMean(x: number, e: number) {
  if (e < 1 - 1e-12) return x - e * Math.sin(x);
  if (e > 1 + 1e-12) return e * Math.sinh(x) - x;
  return x + (x * x * x) / 3;
}
/** Solve Kepler's equation for E, H or D from the mean anomaly (Newton's method; Barker's cubic in closed form). */
export function meanToAnomaly(M: number, e: number) {
  if (e < 1 - 1e-12) {
    const Mw = wrapPi(M), k = M - Mw;
    let E = e < 0.8 ? Mw : Math.sign(Mw) * Math.PI || Math.PI;
    for (let it = 0; it < 100; it++) { const d = (E - e * Math.sin(E) - Mw) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-15) break; }
    return E + k;
  }
  if (e > 1 + 1e-12) {
    let H = Math.asinh(M / e);
    for (let it = 0; it < 200; it++) { const d = (e * Math.sinh(H) - H - M) / (e * Math.cosh(H) - 1); H -= d; if (Math.abs(d) < 1e-15 * Math.max(1, Math.abs(H))) break; }
    return H;
  }
  const B = 1.5 * M, w = Math.cbrt(B + Math.sqrt(B * B + 1));
  return w - 1 / w;
}
/** Mean motion (rad/s): √(μ/|a|³), or 2√(μ/p³) for a parabola (so M = n t with Barker's M). */
export const meanMotion = (p: number, e: number, mu: number) => { const a = aOf(p, e); return Number.isFinite(a) ? Math.sqrt(mu / Math.abs(a) ** 3) : 2 * Math.sqrt(mu / p ** 3); };

export type Info = {
  kind: Kind; a: number; p: number; e: number; rp: number; ra: number; period: number; n: number; energy: number; h: number;
  vp: number; va: number; vinf: number; turn: number; nuMax: number; E: number; M: number; tp: number; r: number; speed: number; fpa: number;
};
/** Size, shape, speeds and timing of an orbit at the given true anomaly. tp: time since periapsis (s). */
export function info(el: Elements, mu: number): Info {
  const { p, e } = el, a = aOf(p, e), nu = el.nu * D2R, kind = kindOf(e);
  const rp = p / (1 + e), ra = e < 1 ? p / (1 - e) : Infinity, n = meanMotion(p, e, mu);
  const x = nuToAnomaly(nu, e), M = anomalyToMean(x, e), r = p / (1 + e * Math.cos(nu));
  const energy = Number.isFinite(a) ? -mu / (2 * a) : 0, h = Math.sqrt(mu * p);
  return {
    kind, a, p, e, rp, ra, period: e < 1 ? TAU / n : Infinity, n, energy, h,
    vp: Math.sqrt(mu * (2 / rp - (Number.isFinite(a) ? 1 / a : 0))), va: e < 1 ? Math.sqrt(mu * (2 / ra - 1 / a)) : NaN,
    vinf: e > 1 ? Math.sqrt(-mu / a) : e === 1 ? 0 : NaN, turn: e > 1 ? 2 * Math.asin(1 / e) * R2D : NaN, nuMax: e >= 1 ? Math.acos(-1 / e) * R2D : NaN,
    E: x, M, tp: M / n, r, speed: Math.sqrt(mu * (2 / r - (Number.isFinite(a) ? 1 / a : 0))), fpa: Math.atan2(e * Math.sin(nu), 1 + e * Math.cos(nu)) * R2D,
  };
}

/** Elements dt seconds later (two-body: only the true anomaly changes). */
export function propagate(el: Elements, mu: number, dt: number): Elements {
  const n = meanMotion(el.p, el.e, mu), M0 = anomalyToMean(nuToAnomaly(el.nu * D2R, el.e), el.e);
  const nu = anomalyToNu(meanToAnomaly(M0 + n * dt, el.e), el.e);
  return { ...el, nu: (el.e < 1 ? wrap(nu) : nu) * R2D };
}

/** Points along the orbit in the reference frame (km) for drawing; hyperbolas and parabolas up to rMax. */
export function track(el: Elements, mu: number, rMax: number, n = 361): V3[] {
  const out: V3[] = [];
  let lo = -180, hi = 180;
  if (el.e >= 1) { const lim = el.e > 1 ? Math.acos(-1 / el.e) * R2D : 180; const cut = Math.acos(Math.max(-1, Math.min(1, (el.p / rMax - 1) / el.e))) * R2D; hi = Math.min(lim - 1e-6, Number.isFinite(cut) ? cut : lim - 1e-6); lo = -hi; }
  for (let k = 0; k < n; k++) out.push(toState({ ...el, nu: lo + ((hi - lo) * k) / (n - 1) }, mu).r);
  return out;
}

// ---- Two-line element sets ----
export type TLE = {
  name: string; satnum: string; classification: string; intl: string; epochYear: number; epochDay: number; epoch: Date;
  ndot2: number; nddot6: number; bstar: number; ephType: string; elsetNum: number;
  inc: number; raan: number; ecc: number; argp: number; M: number; n: number; revNum: number;
  check1: { found: number; computed: number }; check2: { found: number; computed: number };
};
/** TLE "assumed decimal point" exponential fields such as " 12345-3" = 0.12345e-3. */
export function tleExp(s: string) {
  const t = s.trim();
  if (!t || /^[+-]?0+[+-]0$/.test(t) || /^[+-]?0+$/.test(t)) return 0;
  const m = t.match(/^([+-]?)(\d{1,5})([+-]\d)$/);
  if (!m) return NaN;
  return Number(`${m[1] === '-' ? '-' : ''}0.${m[2]}e${m[3]}`);
}

/** Read every field of a two- or three-line element set, with both checksums (a wrong checksum is an error). */
export function parseTle(text: string): TLE {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim());
  const i1 = lines.findIndex((l) => l.startsWith('1 '));
  const l1 = lines[i1], l2 = lines[i1 + 1];
  if (i1 < 0 || !l2 || !l2.startsWith('2 ')) throw new Error('Paste the two lines that start with "1 " and "2 " (a name line above them is fine).');
  if (l1.length < 69 || l2.length < 69) throw new Error('Each TLE line must be 69 characters long; part of a line seems to be missing.');
  if (l1.slice(2, 7) !== l2.slice(2, 7)) throw new Error('The two lines have different satellite numbers.');
  const check1 = { found: +l1[68], computed: tleChecksum(l1) }, check2 = { found: +l2[68], computed: tleChecksum(l2) };
  for (const [k, c] of [[1, check1], [2, check2]] as const) if (c.found !== c.computed) throw new Error(`The checksum on line ${k} is ${c.found} but the digits add up to ${c.computed}: a character may have been mistyped.`);
  const yy = +l1.slice(18, 20), epochYear = yy < 57 ? 2000 + yy : 1900 + yy, epochDay = +l1.slice(20, 32);
  const t: TLE = {
    name: i1 > 0 ? lines[i1 - 1].replace(/^0 /, '').trim() : '',
    satnum: l1.slice(2, 7).trim(), classification: l1[7], intl: l1.slice(9, 17).trim(), epochYear, epochDay,
    epoch: new Date(Date.UTC(epochYear, 0, 1) + (epochDay - 1) * 864e5),
    ndot2: +l1.slice(33, 43), nddot6: tleExp(l1.slice(44, 52)), bstar: tleExp(l1.slice(53, 61)), ephType: l1[62], elsetNum: +l1.slice(64, 68),
    inc: +l2.slice(8, 16), raan: +l2.slice(17, 25), ecc: +`0.${l2.slice(26, 33).trim()}`, argp: +l2.slice(34, 42), M: +l2.slice(43, 51),
    n: +l2.slice(52, 63), revNum: +l2.slice(63, 68), check1, check2,
  };
  if (![t.inc, t.raan, t.ecc, t.argp, t.M, t.n, t.epochDay, t.ndot2, t.nddot6, t.bstar].every(Number.isFinite) || !(t.n > 0)) throw new Error('Some numbers in the TLE could not be read.');
  return t;
}

/** Keplerian elements from a TLE (Earth μ): a from the mean motion by Kepler's third law, ν from M.
 *  TLEs hold SGP4 mean elements, so these are approximate osculating elements (a few km off). */
export function tleToElements(t: TLE, mu: number): Elements & { a: number } {
  const n = (t.n * TAU) / 86400, a = Math.cbrt(mu / (n * n));
  const nu = anomalyToNu(meanToAnomaly(t.M * D2R, t.ecc), t.ecc) * R2D;
  return { a, p: pFromA(a, t.ecc), e: t.ecc, i: t.inc, raan: t.raan, argp: t.argp, nu: ((nu % 360) + 360) % 360 };
}
