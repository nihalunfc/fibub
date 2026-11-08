// Meteor rates you can expect to see: the shower's ZHR corrected for the radiant's altitude and the
// sky's limiting magnitude (IMO): HR = ZHR × sin(h) / r^(6.5 − LM).
import { SHOWERS, night, observer, altAzJ2000, altAzBody, times, type Night } from './sky';
import { type Place } from './place';

export type Shower = (typeof SHOWERS)[number];
import { hourlyRate } from '../sci/meteorrate';
export { hourlyRate };

export type MeteorHour = { time: Date; radiantAlt: number; moonAlt: number; dark: boolean; rate: number };

/** Rates through one night (evening of `iso`), every 30 minutes from dusk to dawn. */
export function meteorNight(place: Place, iso: string, sh: Shower, lm: number) {
  const n: Night = night(place, iso), obs = observer(place);
  const [a, b] = [n.sunset ?? n.window[0], n.sunrise ?? n.window[1]];
  const hours: MeteorHour[] = times(a, b, 30).map((time) => {
    const radiantAlt = altAzJ2000(sh.radiant[0], sh.radiant[1], time, obs).alt, moonAlt = altAzBody('Moon', time, obs).alt;
    const sun = altAzBody('Sun', time, obs).alt, dark = sun < -12;
    return { time, radiantAlt, moonAlt, dark, rate: dark ? hourlyRate(sh.zhr, sh.r, lm, radiantAlt) : 0 };
  });
  const best = hours.reduce((x, y) => (y.rate > x.rate ? y : x), hours[0]);
  return { night: n, hours, best };
}

/** The next peak date on or after `from` (by month and day). */
export function nextPeak(sh: Shower, from: Date) {
  const y = from.getUTCFullYear();
  const at = (yy: number) => Date.UTC(yy, sh.m - 1, sh.d);
  return new Date(at(y) + 864e5 >= from.getTime() ? at(y) : at(y + 1));
}
export const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);
