// Solar and lunar eclipses seen from one place: contact times, altitudes, how much is covered, and the
// geometry to draw them.
import * as A from 'astronomy-engine';
import type { Place } from './place.ts';

const obsOf = (p: Place) => new A.Observer(p.lat, p.lon, p.elev || 0);
const R_EARTH = 6378.1366, R_SUN = 695700, R_MOON = 1737.4, AU_KM = 149597870.7;

export type SolarEclipse = {
  kind: 'partial' | 'annular' | 'total'; globalKind: 'partial' | 'annular' | 'total';
  obscuration: number; magnitude: number;
  begin: Date; peak: Date; end: Date; centralBegin: Date | null; centralEnd: Date | null;
  altBegin: number; altPeak: number; altEnd: number; visible: boolean;
  /** Where the eclipse is greatest on Earth (for central eclipses, on the path). */
  greatest: { lat: number; lon: number } | null;
};

export type LunarEclipse = {
  kind: 'penumbral' | 'partial' | 'total'; obscuration: number; peak: Date;
  /** P1, U1, U2, U3, U4, P4: null for contacts this eclipse does not have. */
  contacts: (Date | null)[];
  moonAltPeak: number; visible: boolean; visibleFrom: Date | null; visibleTo: Date | null;
};

/** Sun and Moon as seen from the place: altitude, and the Moon's offset from the Sun on the sky (degrees). */
export function sunMoon(place: Place, t: Date) {
  const o = obsOf(place);
  const s = A.Equator(A.Body.Sun, t, o, true, true), m = A.Equator(A.Body.Moon, t, o, true, true);
  const hs = A.Horizon(t, o, s.ra, s.dec, 'normal'), hm = A.Horizon(t, o, m.ra, m.dec, 'normal');
  const d2r = Math.PI / 180, ra0 = s.ra * 15 * d2r, de0 = s.dec * d2r, ra = m.ra * 15 * d2r, de = m.dec * d2r;
  // Gnomonic offsets of the Moon from the Sun: east and north, degrees.
  const cosc = Math.sin(de0) * Math.sin(de) + Math.cos(de0) * Math.cos(de) * Math.cos(ra - ra0);
  const east = (Math.cos(de) * Math.sin(ra - ra0)) / cosc / d2r;
  const north = (Math.cos(de0) * Math.sin(de) - Math.sin(de0) * Math.cos(de) * Math.cos(ra - ra0)) / cosc / d2r;
  const rs = Math.asin(R_SUN / (s.dist * AU_KM)) / d2r, rm = Math.asin(R_MOON / (m.dist * AU_KM)) / d2r;
  return { sunAlt: hs.altitude, moonAlt: hm.altitude, sunAz: hs.azimuth, east, north, rSun: rs, rMoon: rm };
}

/** Fraction of the Sun's disc area covered by a Moon of radius rm at separation d (all in the same units). */
export function overlap(rs: number, rm: number, d: number) {
  if (d >= rs + rm) return 0;
  if (d <= Math.abs(rm - rs)) return rm >= rs ? 1 : (rm * rm) / (rs * rs);
  const a = Math.acos((d * d + rs * rs - rm * rm) / (2 * d * rs)), b = Math.acos((d * d + rm * rm - rs * rs) / (2 * d * rm));
  const area = rs * rs * a + rm * rm * b - 0.5 * Math.sqrt((-d + rs + rm) * (d + rs - rm) * (d - rs + rm) * (d + rs + rm));
  return area / (Math.PI * rs * rs);
}

/** Solar eclipses whose partial phase reaches the place, from `from` until `to` (ms). */
export function solarEclipses(place: Place, from: number, to: number): SolarEclipse[] {
  const out: SolarEclipse[] = [], o = obsOf(place);
  let e = A.SearchLocalSolarEclipse(new Date(from), o);
  while (e.peak.time.date.getTime() < to) {
    const g = A.SearchGlobalSolarEclipse(new Date(e.peak.time.date.getTime() - 2 * 864e5));
    const sm = sunMoon(place, e.peak.time.date), sep = Math.hypot(sm.east, sm.north);
    const alts = [e.partial_begin.altitude, e.peak.altitude, e.partial_end.altitude];
    out.push({
      kind: e.kind as SolarEclipse['kind'], globalKind: g.kind as SolarEclipse['globalKind'], obscuration: e.obscuration,
      // Magnitude: the fraction of the Sun's diameter covered at greatest eclipse.
      magnitude: (sm.rSun + sm.rMoon - sep) / (2 * sm.rSun),
      begin: e.partial_begin.time.date, peak: e.peak.time.date, end: e.partial_end.time.date,
      centralBegin: e.total_begin ? e.total_begin.time.date : null, centralEnd: e.total_end ? e.total_end.time.date : null,
      altBegin: alts[0], altPeak: alts[1], altEnd: alts[2], visible: alts.some((a) => a > 0),
      greatest: g.latitude !== undefined && g.longitude !== undefined ? { lat: g.latitude, lon: g.longitude } : null,
    });
    e = A.NextLocalSolarEclipse(e.peak.time, o);
  }
  return out;
}

const moonAlt = (o: A.Observer, t: Date) => { const m = A.Equator(A.Body.Moon, t, o, true, true); return A.Horizon(t, o, m.ra, m.dec, 'normal').altitude; };

/** Lunar eclipses from `from` until `to` (ms), with whether the Moon is up for them at the place. */
export function lunarEclipses(place: Place, from: number, to: number): LunarEclipse[] {
  const out: LunarEclipse[] = [], o = obsOf(place);
  let e = A.SearchLunarEclipse(new Date(from));
  while (e.peak.date.getTime() < to) {
    const pk = e.peak.date.getTime(), at = (min: number) => new Date(pk + min * 60e3);
    const contacts = [at(-e.sd_penum), e.sd_partial ? at(-e.sd_partial) : null, e.sd_total ? at(-e.sd_total) : null, e.sd_total ? at(e.sd_total) : null, e.sd_partial ? at(e.sd_partial) : null, at(e.sd_penum)];
    // The phase that matters: the umbral part if there is one, otherwise the penumbral part.
    const sd = e.sd_partial || e.sd_penum;
    let first: Date | null = null, last: Date | null = null;
    for (let m = -sd; m <= sd + 1e-9; m += Math.max(1, sd / 60)) { const t = at(Math.min(m, sd)); if (moonAlt(o, t) > 0) { first ??= t; last = t; } }
    out.push({ kind: e.kind as LunarEclipse['kind'], obscuration: e.obscuration, peak: e.peak.date, contacts, moonAltPeak: moonAlt(o, e.peak.date), visible: !!first, visibleFrom: first, visibleTo: last });
    e = A.NextLunarEclipse(e.peak);
  }
  return out;
}

/** The Moon's place relative to the centre of Earth's shadow, and the shadow's radii, in degrees (geocentric). */
export function shadowGeometry(t: Date) {
  const time = A.MakeTime(t);
  const s = A.GeoVector(A.Body.Sun, time, true), m = A.GeoMoon(time);
  const ds = Math.hypot(s.x, s.y, s.z), dm = Math.hypot(m.x, m.y, m.z);
  const d2r = Math.PI / 180;
  const piM = Math.asin(R_EARTH / (dm * AU_KM)) / d2r, piS = Math.asin(R_EARTH / (ds * AU_KM)) / d2r, sS = Math.asin(R_SUN / (ds * AU_KM)) / d2r;
  // Danjon's rule: Earth's atmosphere enlarges the shadow by about 1/85 (as the French almanac uses).
  const k = 1 + 1 / 85;
  const umbra = k * (piM + piS - sS), penumbra = k * (piM + piS + sS), rMoon = Math.asin(R_MOON / (dm * AU_KM)) / d2r;
  // Shadow centre: the point opposite the Sun. Offsets of the Moon from it, in the sky's east and north.
  const eq = (v: A.Vector) => { const r = Math.hypot(v.x, v.y, v.z); return { ra: Math.atan2(v.y, v.x), dec: Math.asin(v.z / r) }; };
  const c = eq({ x: -s.x, y: -s.y, z: -s.z } as A.Vector), mo = eq(m);
  const cosc = Math.sin(c.dec) * Math.sin(mo.dec) + Math.cos(c.dec) * Math.cos(mo.dec) * Math.cos(mo.ra - c.ra);
  const east = (Math.cos(mo.dec) * Math.sin(mo.ra - c.ra)) / cosc / d2r;
  const north = (Math.cos(c.dec) * Math.sin(mo.dec) - Math.sin(c.dec) * Math.cos(mo.dec) * Math.cos(mo.ra - c.ra)) / cosc / d2r;
  return { east, north, umbra, penumbra, rMoon };
}
