// The place and night every astronomy tool on the page works with. The SkyPlace bar sets it;
// tools listen with onSky() and redraw.
import { loadPlace, savePlace, localDate, localHours, type Place } from './place';

export type Sky = { place: Place; date: string; remembered: boolean };
let sky: Sky | null = null;
const subs = new Set<(s: Sky) => void>();

/** The date of tonight's evening: before 6 am it is still last night. */
export function tonight(tz: string) {
  const now = new Date();
  return localHours(now, tz) < 6 ? localDate(new Date(now.getTime() - 864e5), tz) : localDate(now, tz);
}
export function getSky(): Sky {
  if (!sky) {
    const { place, remembered } = loadPlace();
    const q = new URLSearchParams(location.search).get('date');
    sky = { place, remembered, date: q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : tonight(place.tz) };
  }
  return sky;
}
export function setSky(change: Partial<Sky>) {
  sky = { ...getSky(), ...change };
  savePlace(sky.place, sky.remembered);
  for (const f of subs) f(sky);
}
/** Call `f` now and whenever the place or date changes. */
export function onSky(f: (s: Sky) => void) {
  subs.add(f);
  f(getSky());
  return () => subs.delete(f);
}
