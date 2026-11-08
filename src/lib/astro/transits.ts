// Exoplanet transit windows: when each transit happens, and how much of it a place can see in the dark.
import * as A from 'astronomy-engine';
import type { Place } from './place.ts';
import { ttMinusUtc } from '../sci/marstime.ts';

const rad = Math.PI / 180, C_AU_DAY = 173.1446326846693;
const unit = (raDeg: number, decDeg: number) => ({ x: Math.cos(decDeg * rad) * Math.cos(raDeg * rad), y: Math.cos(decDeg * rad) * Math.sin(raDeg * rad), z: Math.sin(decDeg * rad) });

/** Light-time from the Earth to the solar system barycentre along the star's direction, in days (BJD − JD). */
export function baryDelay(ms: number, raDeg: number, decDeg: number) {
  const s = A.BaryState(A.Body.Earth, new Date(ms)), n = unit(raDeg, decDeg);
  return (s.x * n.x + s.y * n.y + s.z * n.z) / C_AU_DAY;
}
/** UTC moment (ms since 1970) of a barycentric Julian date (BJD_TDB) for a star at RA/Dec (degrees, J2000). */
export function bjdToMs(bjd: number, raDeg: number, decDeg: number) {
  let ms = (bjd - 2440587.5) * 864e5;
  for (let i = 0; i < 3; i++) ms = (bjd - baryDelay(ms, raDeg, decDeg) - 2440587.5) * 864e5 - ttMinusUtc(ms) * 1000;
  return ms;
}
export const msToBjd = (ms: number, raDeg: number, decDeg: number) => 2440587.5 + (ms + ttMinusUtc(ms) * 1000) / 864e5 + baryDelay(ms, raDeg, decDeg);

function starAlt(raDeg: number, decDeg: number, t: Date, obs: A.Observer) {
  const v = A.VectorFromSphere(new A.Spherical(decDeg, raDeg, 1), A.MakeTime(t));
  return A.HorizonFromVector(A.RotateVector(A.Rotation_EQJ_HOR(t, obs), v), 'normal').lat;
}
const sunAlt = (t: Date, obs: A.Observer) => { const eq = A.Equator(A.Body.Sun, t, obs, true, true); return A.Horizon(t, obs, eq.ra, eq.dec).altitude; };

export type TransitTarget = { ra: number; dec: number; t0: number; period: number; durH: number; t0Err?: number; pErr?: number };
export type TransitWindow = {
  epoch: number; mid: Date; ingress: Date; egress: Date; sigmaMin: number;
  altIn: number; altMid: number; altOut: number; sunMid: number;
  /** Share of the transit itself (ingress to egress) that is dark enough and high enough. */
  seen: number; baseBefore: boolean; baseAfter: boolean; quality: 'full' | 'transit' | 'partial' | 'none';
  moonIllum: number; moonSep: number;
};

/**
 * Transits whose middle falls between `from` and `to` (ms), as seen from a place.
 * Counted as visible while the star is at least `minAlt` high and the Sun at most `sunMax` (degrees);
 * `baseH` hours of out-of-transit baseline are wanted on each side.
 */
export function transitWindows(tg: TransitTarget, place: Place, from: number, to: number, minAlt = 30, sunMax = -12, baseH = 0.5): TransitWindow[] {
  const obs = new A.Observer(place.lat, place.lon, place.elev || 0), out: TransitWindow[] = [];
  const bjdFrom = msToBjd(from, tg.ra, tg.dec), bjdTo = msToBjd(to, tg.ra, tg.dec);
  const n0 = Math.ceil((bjdFrom - tg.t0) / tg.period), n1 = Math.floor((bjdTo - tg.t0) / tg.period);
  if (n1 - n0 > 2000) throw new Error('That is more than 2000 transits: shorten the date range');
  const ok = (t: number) => { const d = new Date(t); return sunAlt(d, obs) <= sunMax && starAlt(tg.ra, tg.dec, d, obs) >= minAlt; };
  const star = unit(tg.ra, tg.dec);
  for (let n = n0; n <= n1; n++) {
    const midMs = bjdToMs(tg.t0 + n * tg.period, tg.ra, tg.dec), half = (tg.durH / 2) * 3600e3, base = baseH * 3600e3;
    const inMs = midMs - half, egMs = midMs + half;
    // The transit in 41 samples; the baselines in 7 each.
    let good = 0; const N = 40;
    for (let i = 0; i <= N; i++) if (ok(inMs + ((egMs - inMs) * i) / N)) good++;
    const seen = good / (N + 1);
    let bb = true, ba = true;
    for (let i = 0; i <= 6 && base > 0; i++) { if (!ok(inMs - (base * i) / 6)) bb = false; if (!ok(egMs + (base * i) / 6)) ba = false; }
    const mid = new Date(midMs);
    const m = A.GeoVector(A.Body.Moon, mid, true), mr = Math.hypot(m.x, m.y, m.z);
    const moonSep = Math.acos(Math.min(1, Math.max(-1, (m.x * star.x + m.y * star.y + m.z * star.z) / mr))) / rad;
    const sigmaMin = Math.sqrt((tg.t0Err ?? 0) ** 2 + (n * (tg.pErr ?? 0)) ** 2) * 1440;
    out.push({
      epoch: n, mid, ingress: new Date(inMs), egress: new Date(egMs), sigmaMin,
      altIn: starAlt(tg.ra, tg.dec, new Date(inMs), obs), altMid: starAlt(tg.ra, tg.dec, mid, obs), altOut: starAlt(tg.ra, tg.dec, new Date(egMs), obs), sunMid: sunAlt(mid, obs),
      seen, baseBefore: bb, baseAfter: ba,
      quality: seen === 1 && bb && ba ? 'full' : seen === 1 ? 'transit' : seen > 0 ? 'partial' : 'none',
      moonIllum: A.Illumination(A.Body.Moon, mid).phase_fraction, moonSep,
    });
  }
  return out;
}

/** A light curve shape for planning plots: relative flux against time, a trapezoid with the given depth. */
export function trapezoid(tHours: number, durH: number, depth: number, rampH = Math.min(durH * 0.15, 0.4)) {
  const x = Math.abs(tHours), h = durH / 2;
  if (x >= h) return 1;
  if (x <= h - rampH) return 1 - depth;
  return 1 - (depth * (h - x)) / rampH;
}
