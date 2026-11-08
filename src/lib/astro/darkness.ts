// Darkness through a night, sampled every few minutes: how the Sun's depth and the Moon's position
// split the night into day, twilight, dark with the Moon up, and dark with no Moon.
import * as A from 'astronomy-engine';
import type { Place } from './place.ts';

export const STEP_MIN = 10, SLOTS = (24 * 60) / STEP_MIN;
/** 0 day, 1 civil twilight, 2 nautical, 3 astronomical, 4 dark with the Moon up, 5 dark with no Moon. */
export type State = 0 | 1 | 2 | 3 | 4 | 5;
export const STATE_NAMES = ['Day', 'Civil twilight', 'Nautical twilight', 'Astronomical twilight', 'Dark, Moon up', 'Dark, no Moon'];

// Geometric altitude: twilight limits are defined without refraction.
const alt = (body: A.Body, t: Date, obs: A.Observer) => { const eq = A.Equator(body, t, obs, true, true); return A.Horizon(t, obs, eq.ra, eq.dec).altitude; };

export type DarkNight = { date: string; start: Date; states: Uint8Array; darkH: number; moonFreeH: number; dusk: Date | null; dawn: Date | null; illum: number };

/** The night that begins on the evening of `iso` (YYYY-MM-DD) at the place, from local solar noon to the next. */
export function darkNight(place: Place, iso: string, minIllum = 0): DarkNight {
  const obs = new A.Observer(place.lat, place.lon, place.elev || 0);
  const [y, m, d] = iso.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 12) - (place.lon / 15) * 3600e3);
  const illum = A.Illumination(A.Body.Moon, new Date(start.getTime() + 12 * 3600e3)).phase_fraction;
  const states = new Uint8Array(SLOTS);
  let darkN = 0, freeN = 0, dusk: Date | null = null, dawn: Date | null = null, prevSun = NaN, prevT = start;
  // Samples sit in the middle of each slot.
  for (let i = 0; i < SLOTS; i++) {
    const t = new Date(start.getTime() + (i + 0.5) * STEP_MIN * 60e3);
    const s = alt(A.Body.Sun, t, obs);
    let st: State = s > -0.833 ? 0 : s > -6 ? 1 : s > -12 ? 2 : s > -18 ? 3 : 5;
    if (st === 5) {
      darkN++;
      const moonCounts = illum >= minIllum && alt(A.Body.Moon, t, obs) > 0;
      if (moonCounts) st = 4; else freeN++;
    }
    // Astronomical dusk and dawn, by linear interpolation between samples.
    if (i > 0 && Number.isFinite(prevSun)) {
      const f = (prevSun + 18) / (prevSun - s), at = new Date(prevT.getTime() + f * (t.getTime() - prevT.getTime()));
      if (prevSun > -18 && s <= -18 && !dusk) dusk = at;
      if (prevSun <= -18 && s > -18) dawn = at;
    }
    states[i] = st; prevSun = s; prevT = t;
  }
  const darkH = dusk && dawn && dawn > dusk ? (dawn.getTime() - dusk.getTime()) / 3600e3 : (darkN * STEP_MIN) / 60;
  // The Moon-free share comes from the samples; the length of the dark from the interpolated dusk and dawn.
  return { date: iso, start, states, darkH, moonFreeH: darkN ? (darkH * freeN) / darkN : 0, dusk, dawn, illum };
}

/** ISO dates for every evening of a year. */
export function yearDates(year: number) {
  const out: string[] = [];
  for (let t = Date.UTC(year, 0, 1); t < Date.UTC(year + 1, 0, 1); t += 864e5) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
