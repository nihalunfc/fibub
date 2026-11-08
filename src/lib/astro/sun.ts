// The Sun through one day at a place: rise, set, noon, twilight, equation of time, and a year of day lengths.
import * as A from 'astronomy-engine';
import type { Place } from './place.ts';

const obsOf = (p: Place) => new A.Observer(p.lat, p.lon, p.elev || 0);
const d = (t: A.AstroTime | null) => (t ? t.date : null);

/** Local mean midnight that starts the given date (YYYY-MM-DD) at the place's longitude. */
export function dayStart(place: Place, iso: string) {
  const [y, m, dd] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, dd) - (place.lon / 15) * 3600e3);
}

export function sunAltAz(place: Place, t: Date) {
  const obs = obsOf(place), eq = A.Equator(A.Body.Sun, t, obs, true, true), h = A.Horizon(t, obs, eq.ra, eq.dec, 'normal');
  return { alt: h.altitude, az: h.azimuth, ra: eq.ra, dec: eq.dec, dist: eq.dist };
}

export type SunDay = {
  noon: Date; noonAlt: number; rise: Date | null; set: Date | null; riseAz: number | null; setAz: number | null; dayH: number;
  civil: [Date | null, Date | null]; nautical: [Date | null, Date | null]; astro: [Date | null, Date | null];
  eotMin: number; decl: number; distAU: number; polar: 'day' | 'night' | null;
};

/** Everything about the Sun on one local date. Rise and set use the upper limb with standard refraction, as almanacs do. */
export function sunDay(place: Place, iso: string): SunDay {
  const obs = obsOf(place), start = dayStart(place, iso);
  const noonT = A.SearchHourAngle(A.Body.Sun, obs, 0, start, +1).time.date;
  const n = sunAltAz(place, noonT);
  const rise = d(A.SearchRiseSet(A.Body.Sun, obs, +1, start, 1)), set = d(A.SearchRiseSet(A.Body.Sun, obs, -1, start, 1));
  const tw = (alt: number): [Date | null, Date | null] => [d(A.SearchAltitude(A.Body.Sun, obs, +1, start, 1, alt)), d(A.SearchAltitude(A.Body.Sun, obs, -1, start, 1, alt))];
  // Day length: from today's rise to today's set; with no rise or set the Sun stays up (or down) all day.
  let dayH: number, polar: SunDay['polar'] = null;
  if (rise && set && set > rise) dayH = (set.getTime() - rise.getTime()) / 3600e3;
  else if (rise && set) dayH = 24 - (rise.getTime() - set.getTime()) / 3600e3;
  else { polar = n.alt > 0 ? 'day' : 'night'; dayH = polar === 'day' ? 24 : 0; }
  // Equation of time: apparent noon against mean noon (12:00 local mean time) at this longitude.
  const meanNoon = start.getTime() + 12 * 3600e3;
  const az = (t: Date | null) => (t ? sunAltAz(place, t).az : null);
  return {
    noon: noonT, noonAlt: n.alt, rise, set, riseAz: az(rise), setAz: az(set), dayH,
    civil: tw(-6), nautical: tw(-12), astro: tw(-18),
    eotMin: (meanNoon - noonT.getTime()) / 60e3, decl: n.dec, distAU: n.dist, polar,
  };
}

/** Day length in hours for every date of a year. */
export function yearOfDays(place: Place, year: number) {
  const out: { iso: string; dayH: number; eotMin: number; noonAlt: number }[] = [];
  for (let t = Date.UTC(year, 0, 1); t < Date.UTC(year + 1, 0, 1); t += 864e5) {
    const iso = new Date(t).toISOString().slice(0, 10), s = sunDay(place, iso);
    out.push({ iso, dayH: s.dayH, eotMin: s.eotMin, noonAlt: s.noonAlt });
  }
  return out;
}

/** Solstices and equinoxes of a year. */
export function seasons(year: number) {
  const s = A.Seasons(year);
  return [['March equinox', s.mar_equinox.date], ['June solstice', s.jun_solstice.date], ['September equinox', s.sep_equinox.date], ['December solstice', s.dec_solstice.date]] as [string, Date][];
}
