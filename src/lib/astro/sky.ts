// Sky calculations for the astronomy tools, built on astronomy-engine (MIT, accurate to about
// an arcminute). Everything runs in the browser.
import * as A from 'astronomy-engine';
import { type Place } from './place';
import CATALOG from './catalog.json';

export { A };
export const observer = (p: Place) => new A.Observer(p.lat, p.lon, p.elev || 0);
const d = (t: A.AstroTime | null | undefined) => (t ? t.date : null);
const HOUR = 3600e3;

// ---- Objects ----
/** A deep-sky object: id ("M31 / NGC 224"), common name, type, J2000 RA and Dec in degrees, magnitude, size in arcmin, constellation. */
export type DSO = { id: string; name: string; type: string; ra: number; dec: number; mag: number | null; size: number | null; con: string };
export const OBJECTS: DSO[] = (CATALOG as any[]).map(([id, name, type, ra, dec, mag, size, con]) => ({ id, name: name === id ? '' : name, type, ra, dec, mag, size, con }));
export const PLANETS = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] as const;
export type Target = { kind: 'body'; body: string; label: string } | { kind: 'radec'; ra: number; dec: number; label: string; mag?: number | null; type?: string };

export const dsoLabel = (o: DSO) => (o.name ? `${o.id.split(' / ')[0]} ${o.name}` : o.id);
/** Find a target by what someone types: "M31", "m 31", "NGC 7000", "Andromeda", "Jupiter", "Moon". */
export function findTarget(text: string): Target | null {
  const q = text.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return null;
  for (const b of ['Sun', 'Moon', ...PLANETS]) if (q === b.toLowerCase()) return { kind: 'body', body: b, label: b };
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
  const nq = norm(q);
  const o = OBJECTS.find((o) => o.id.split(' / ').some((id) => norm(id) === nq))
    ?? OBJECTS.find((o) => o.name && norm(o.name) === nq)
    ?? OBJECTS.find((o) => o.name && o.name.toLowerCase().includes(q))
    ?? OBJECTS.find((o) => norm(o.id).startsWith(nq));
  return o ? { kind: 'radec', ra: o.ra, dec: o.dec, label: dsoLabel(o), mag: o.mag, type: o.type } : null;
}
export const searchObjects = (text: string, max = 8) => {
  const q = text.trim().toLowerCase();
  if (!q) return [];
  const nq = q.replace(/\s+/g, '');
  return [...['Moon', ...PLANETS].filter((b) => b.toLowerCase().startsWith(q)).map((b) => b),
    ...OBJECTS.filter((o) => o.id.toLowerCase().replace(/\s+/g, '').split('/').some((x) => x.startsWith(nq)) || o.name.toLowerCase().includes(q)).map(dsoLabel)].slice(0, max);
};

// ---- Positions ----
/** Altitude and azimuth (degrees, with normal refraction) of a J2000 RA/Dec in degrees. */
export function altAzJ2000(ra: number, dec: number, time: Date, obs: A.Observer) {
  const v = A.VectorFromSphere(new A.Spherical(dec, ra, 1), A.MakeTime(time));
  const h = A.HorizonFromVector(A.RotateVector(A.Rotation_EQJ_HOR(time, obs), v), 'normal');
  return { alt: h.lat, az: h.lon };
}
export function altAzBody(body: string, time: Date, obs: A.Observer) {
  const eq = A.Equator(body as A.Body, time, obs, true, true);
  const h = A.Horizon(time, obs, eq.ra, eq.dec, 'normal');
  return { alt: h.altitude, az: h.azimuth, ra: eq.ra * 15, dec: eq.dec };
}
export function altAz(t: Target, time: Date, obs: A.Observer) {
  return t.kind === 'body' ? altAzBody(t.body, time, obs) : altAzJ2000(t.ra, t.dec, time, obs);
}
/** Airmass from apparent altitude (Kasten and Young 1989); Infinity below the horizon. */
export const airmass = (alt: number) => (alt <= 0 ? Infinity : 1 / (Math.sin(((alt + 244 / (165 + 47 * alt ** 1.1)) * Math.PI) / 180)));
/** Parallactic angle in degrees (angle between the direction to the pole and to the zenith). */
export function parallactic(raDeg: number, decDeg: number, time: Date, obs: A.Observer) {
  const lst = A.SiderealTime(time) + obs.longitude / 15;
  const H = ((lst * 15 - raDeg) * Math.PI) / 180, phi = (obs.latitude * Math.PI) / 180, dl = (decDeg * Math.PI) / 180;
  return (Math.atan2(Math.sin(H), Math.tan(phi) * Math.cos(dl) - Math.sin(dl) * Math.cos(H)) * 180) / Math.PI;
}
/** Local sidereal time in hours. */
export const lst = (time: Date, lon: number) => (((A.SiderealTime(time) + lon / 15) % 24) + 24) % 24;
/** RA/Dec of date (precessed, "JNow") from J2000, both in degrees. */
export function toJNow(ra: number, dec: number, time: Date) {
  const v = A.RotateVector(A.Rotation_EQJ_EQD(time), A.VectorFromSphere(new A.Spherical(dec, ra, 1), A.MakeTime(time)));
  const s = A.SphereFromVector(v);
  return { ra: ((s.lon % 360) + 360) % 360, dec: s.lat };
}
export function fromJNow(ra: number, dec: number, time: Date) {
  const v = A.RotateVector(A.Rotation_EQD_EQJ(time), A.VectorFromSphere(new A.Spherical(dec, ra, 1), A.MakeTime(time)));
  const s = A.SphereFromVector(v);
  return { ra: ((s.lon % 360) + 360) % 360, dec: s.lat };
}
export function separation(ra1: number, dec1: number, ra2: number, dec2: number) {
  const r = Math.PI / 180;
  const c = Math.sin(dec1 * r) * Math.sin(dec2 * r) + Math.cos(dec1 * r) * Math.cos(dec2 * r) * Math.cos((ra1 - ra2) * r);
  return (Math.acos(Math.min(1, Math.max(-1, c))) * 180) / Math.PI;
}
export const constellation = (raDeg: number, decDeg: number) => A.Constellation(raDeg / 15, decDeg);

// ---- The night ----
export type Night = {
  start: Date; end: Date;
  sunset: Date | null; sunrise: Date | null;
  civilDusk: Date | null; civilDawn: Date | null; nautDusk: Date | null; nautDawn: Date | null; astroDusk: Date | null; astroDawn: Date | null;
  moonrise: Date | null; moonset: Date | null; moonPhase: number; moonIllum: number; moonName: string;
  /** When it is properly dark (astronomical twilight ends to when it starts). Null when it never gets fully dark. */
  dark: [Date, Date] | null;
  /** The span to plan for: dark if there is one, else nautical or civil twilight, else sunset to sunrise. */
  window: [Date, Date];
  polar: 'day' | 'night' | null;
};

export function moonName(phase: number) {
  const n = ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
  return n[Math.round(phase / 45) % 8];
}

export function night(place: Place, iso: string): Night {
  const obs = observer(place);
  // The night is the place's own night: it starts at local solar noon there (from the longitude),
  // whatever time zone the times are shown in.
  const [y, m, dd] = iso.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, dd, 12) - (place.lon / 15) * HOUR), end = new Date(start.getTime() + 24 * HOUR);
  const within = (t: Date | null) => (t && t < end ? t : null);
  const down = (alt: number) => within(d(A.SearchAltitude(A.Body.Sun, obs, -1, start, 1, alt)));
  const up = (alt: number, after: Date | null) => within(d(A.SearchAltitude(A.Body.Sun, obs, +1, after ?? start, 1, alt)));
  const sunset = within(d(A.SearchRiseSet(A.Body.Sun, obs, -1, start, 1)));
  const sunrise = within(d(A.SearchRiseSet(A.Body.Sun, obs, +1, sunset ?? start, 1)));
  const civilDusk = down(-6), nautDusk = down(-12), astroDusk = down(-18);
  const astroDawn = astroDusk ? up(-18, astroDusk) : null, nautDawn = nautDusk ? up(-12, nautDusk) : null, civilDawn = civilDusk ? up(-6, civilDusk) : null;
  const mid = new Date(start.getTime() + 12 * HOUR);
  const moonrise = d(A.SearchRiseSet(A.Body.Moon, obs, +1, start, 1));
  const moonset = d(A.SearchRiseSet(A.Body.Moon, obs, -1, start, 1));
  const phase = A.MoonPhase(mid);
  const sunAltMid = altAzBody('Sun', mid, obs).alt;
  const polar = !sunset && !sunrise ? (sunAltMid > 0 ? 'day' : 'night') : null;
  const dark: [Date, Date] | null = astroDusk && astroDawn ? [astroDusk, astroDawn] : polar === 'night' && !astroDusk && sunAltMid < -18 ? [start, end] : null;
  const window: [Date, Date] = dark ?? (nautDusk && nautDawn ? [nautDusk, nautDawn] : civilDusk && civilDawn ? [civilDusk, civilDawn] : sunset && sunrise ? [sunset, sunrise] : [new Date(start.getTime() + 6 * HOUR), new Date(start.getTime() + 18 * HOUR)]);
  return {
    start, end, sunset, sunrise, civilDusk, civilDawn, nautDusk, nautDawn, astroDusk, astroDawn,
    moonrise, moonset, moonPhase: phase, moonIllum: A.Illumination(A.Body.Moon, mid).phase_fraction, moonName: moonName(phase),
    dark, window, polar,
  };
}

/** Samples from `from` to `to` every `step` minutes. */
export function times(from: Date, to: Date, stepMin: number) {
  const out: Date[] = [];
  for (let t = from.getTime(); t <= to.getTime() + 1; t += stepMin * 60e3) out.push(new Date(t));
  return out;
}

/** Altitude through the night for a target, plus its transit (highest point) inside the span. */
export function track(t: Target, obs: A.Observer, from: Date, to: Date, stepMin = 10) {
  const pts = times(from, to, stepMin).map((time) => ({ time, ...altAz(t, time, obs) }));
  const best = pts.reduce((a, b) => (b.alt > a.alt ? b : a), pts[0]);
  return { pts, best };
}

/** Rise, set and transit for a target near this night (null if it never rises or never sets). */
export function riseSet(t: Target, place: Place, n: Night) {
  const obs = observer(place);
  if (t.kind === 'body') {
    const b = t.body as A.Body;
    return {
      rise: d(A.SearchRiseSet(b, obs, +1, n.start, 1)),
      set: d(A.SearchRiseSet(b, obs, -1, n.start, 1)),
      transit: A.SearchHourAngle(b, obs, 0, n.start).time.date,
    };
  }
  A.DefineStar(A.Body.Star1, t.ra / 15, t.dec, 1000);
  return {
    rise: d(A.SearchRiseSet(A.Body.Star1, obs, +1, n.start, 1)),
    set: d(A.SearchRiseSet(A.Body.Star1, obs, -1, n.start, 1)),
    transit: A.SearchHourAngle(A.Body.Star1, obs, 0, n.start).time.date,
  };
}

export type PlanetRow = { name: string; rise: Date | null; set: Date | null; transit: Date; transitAlt: number; mag: number; con: string; bestAlt: number; bestTime: Date; visible: boolean };
export function planets(place: Place, n: Night): PlanetRow[] {
  const obs = observer(place);
  const mid = new Date((n.window[0].getTime() + n.window[1].getTime()) / 2);
  return PLANETS.map((name) => {
    const rs = riseSet({ kind: 'body', body: name, label: name }, place, n);
    const tr = track({ kind: 'body', body: name, label: name }, obs, n.window[0], n.window[1], 15);
    const j = A.Equator(name as A.Body, mid, obs, false, true);
    return {
      name, ...rs, transitAlt: altAzBody(name, rs.transit, obs).alt,
      mag: A.Illumination(name as A.Body, mid).mag, con: A.Constellation(j.ra, j.dec).name,
      bestAlt: tr.best.alt, bestTime: tr.best.time, visible: tr.best.alt > 10,
    };
  });
}

/** What a setup can show: faintest catalogue magnitude worth listing. */
export const GEAR = {
  eyes: { label: 'Eyes only', mag: 5 },
  binoculars: { label: 'Binoculars', mag: 8 },
  small: { label: 'Small telescope (60 to 130 mm)', mag: 10 },
  large: { label: 'Large telescope (150 mm and up)', mag: 12.5 },
} as const;
export type Gear = keyof typeof GEAR;

export type Pick = DSO & { bestAlt: number; bestTime: Date; moonSep: number };
/** Deep-sky objects that climb above `minAlt` while it is dark, brightest first. */
export function bestObjects(place: Place, n: Night, gear: Gear, minAlt = 30, max = 30): Pick[] {
  const obs = observer(place);
  const ts = times(n.window[0], n.window[1], 20);
  const rots = ts.map((t) => ({ t, r: A.Rotation_EQJ_HOR(t, obs), at: A.MakeTime(t) }));
  const mid = ts[Math.floor(ts.length / 2)];
  const moon = A.Equator(A.Body.Moon, mid, obs, false, true);
  const lim = GEAR[gear].mag;
  const out: Pick[] = [];
  for (const o of OBJECTS) {
    if (o.mag == null || o.mag > lim) continue;
    let best = -90, bt = mid;
    for (const { t, r, at } of rots) {
      const v = A.RotateVector(r, A.VectorFromSphere(new A.Spherical(o.dec, o.ra, 1), at));
      const alt = (Math.asin(Math.max(-1, Math.min(1, v.z / Math.hypot(v.x, v.y, v.z)))) * 180) / Math.PI;
      if (alt > best) { best = alt; bt = t; }
    }
    if (best >= minAlt) out.push({ ...o, bestAlt: best, bestTime: bt, moonSep: separation(o.ra, o.dec, moon.ra * 15, moon.dec) });
  }
  // Brightest first, with a small bonus for big famous objects (Messier) so the list reads well.
  return out.sort((a, b) => (a.mag! - (a.id.startsWith('M') ? 1 : 0)) - (b.mag! - (b.id.startsWith('M') ? 1 : 0))).slice(0, max);
}

// ---- Events in a month ----
export type SkyEvent = { date: Date; kind: 'moon' | 'meteor' | 'eclipse' | 'planet' | 'season'; title: string; detail: string };

// Major meteor showers. Peak dates move by about a day from year to year; the International Meteor
// Organization (imo.net) publishes the exact times each year. ZHR = meteors an hour under a perfect dark sky;
// r = population index (how much faster the count grows per magnitude of darker sky), from the IMO calendar.
export const SHOWERS = [
  { name: 'Quadrantids', m: 1, d: 3, zhr: 110, radiant: [230, 49], r: 2.1 },
  { name: 'Lyrids', m: 4, d: 22, zhr: 18, radiant: [272, 33], r: 2.1 },
  { name: 'Eta Aquariids', m: 5, d: 6, zhr: 50, radiant: [338, -1], r: 2.4 },
  { name: 'Southern Delta Aquariids', m: 7, d: 30, zhr: 25, radiant: [340, -16], r: 3.2 },
  { name: 'Perseids', m: 8, d: 12, zhr: 100, radiant: [48, 58], r: 2.2 },
  { name: 'Draconids', m: 10, d: 8, zhr: 10, radiant: [262, 54], r: 2.6 },
  { name: 'Orionids', m: 10, d: 21, zhr: 20, radiant: [95, 16], r: 2.5 },
  { name: 'Northern Taurids', m: 11, d: 12, zhr: 5, radiant: [58, 22], r: 2.3 },
  { name: 'Leonids', m: 11, d: 17, zhr: 15, radiant: [152, 22], r: 2.5 },
  { name: 'Geminids', m: 12, d: 14, zhr: 150, radiant: [112, 33], r: 2.6 },
  { name: 'Ursids', m: 12, d: 22, zhr: 10, radiant: [217, 76], r: 3.0 },
] as const;

export function monthEvents(place: Place, year: number, month: number): SkyEvent[] {
  const obs = observer(place);
  const from = new Date(Date.UTC(year, month - 1, 1) - 14 * HOUR), to = new Date(Date.UTC(year, month, 1) + 14 * HOUR);
  const inMonth = (t: Date) => t >= from && t < to;
  const ev: SkyEvent[] = [];
  const Q = ['New Moon', 'First quarter', 'Full Moon', 'Last quarter'];
  for (let q = A.SearchMoonQuarter(new Date(from.getTime() - 8 * 24 * HOUR)); q.time.date < to; q = A.NextMoonQuarter(q)) {
    if (inMonth(q.time.date)) ev.push({ date: q.time.date, kind: 'moon', title: Q[q.quarter], detail: q.quarter === 0 ? 'Darkest nights for faint galaxies and nebulae.' : q.quarter === 2 ? 'Bright sky all night; good for the Moon and planets.' : 'Moon up half the night.' });
  }
  for (let a = A.SearchLunarApsis(new Date(from.getTime() - 30 * 24 * HOUR)); a.time.date < to; a = A.NextLunarApsis(a)) {
    if (inMonth(a.time.date)) ev.push({ date: a.time.date, kind: 'moon', title: a.kind === 0 ? 'Moon at perigee (closest)' : 'Moon at apogee (farthest)', detail: `${Math.round(a.dist_km).toLocaleString()} km away.` });
  }
  const s = A.Seasons(year);
  for (const [t, name] of [[s.mar_equinox, 'March equinox'], [s.jun_solstice, 'June solstice'], [s.sep_equinox, 'September equinox'], [s.dec_solstice, 'December solstice']] as const)
    if (inMonth(t.date)) ev.push({ date: t.date, kind: 'season', title: name, detail: name.includes('equinox') ? 'Day and night are about equal everywhere.' : place.lat >= 0 === name.startsWith('June') ? 'Longest day of the year where you are.' : 'Shortest day of the year where you are.' });
  // Eclipses: lunar ones (seen from anywhere the Moon is up) and solar ones seen from this place.
  for (let e = A.SearchLunarEclipse(new Date(from.getTime() - 200 * 24 * HOUR)), i = 0; i < 4 && e.peak.date < to; e = A.NextLunarEclipse(e.peak), i++) {
    if (inMonth(e.peak.date)) {
      const alt = altAzBody('Moon', e.peak.date, obs).alt;
      ev.push({ date: e.peak.date, kind: 'eclipse', title: `${cap(e.kind)} lunar eclipse`, detail: alt > 0 ? `The Moon is up for you at mid-eclipse (${Math.round(alt)}° high).` : 'The Moon is below your horizon at mid-eclipse.' });
    }
  }
  try {
    for (let e = A.SearchLocalSolarEclipse(new Date(from.getTime() - 200 * 24 * HOUR), obs), i = 0; i < 4 && e.peak.time.date < to; e = A.NextLocalSolarEclipse(e.peak.time, obs), i++) {
      if (inMonth(e.peak.time.date)) ev.push({ date: e.peak.time.date, kind: 'eclipse', title: `${cap(e.kind)} solar eclipse`, detail: `${Math.round(e.obscuration * 100)}% of the Sun covered from your place. Never look at the Sun without a certified solar filter.` });
    }
  } catch { /* none found */ }
  for (const b of ['Mercury', 'Venus'] as const) {
    let e = A.SearchMaxElongation(b as A.Body, new Date(from.getTime() - 120 * 24 * HOUR));
    for (let i = 0; i < 6 && e.time.date < to; i++, e = A.SearchMaxElongation(b as A.Body, new Date(e.time.date.getTime() + 24 * HOUR)))
      if (inMonth(e.time.date)) ev.push({ date: e.time.date, kind: 'planet', title: `${b} at greatest ${e.visibility} elongation`, detail: `${Math.round(e.elongation)}° from the Sun: best time to see it ${e.visibility === 'evening' ? 'after sunset' : 'before sunrise'}.` });
  }
  for (const b of ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] as const) {
    const t = A.SearchRelativeLongitude(b as A.Body, 0, from).date;
    if (inMonth(t)) ev.push({ date: t, kind: 'planet', title: `${b} at opposition`, detail: 'Closest and brightest for the year, up all night.' });
  }
  for (const sh of SHOWERS) if (sh.m === month) {
    const peak = new Date(Date.UTC(year, month - 1, sh.d, 6));
    const illum = A.Illumination(A.Body.Moon, peak).phase_fraction;
    ev.push({ date: peak, kind: 'meteor', title: `${sh.name} meteor shower peak (around)`, detail: `Up to ${sh.zhr} an hour under dark skies; the Moon is ${Math.round(illum * 100)}% lit${illum > 0.6 ? ', so expect fewer' : ''}. Best after midnight.` });
  }
  return ev.sort((a, b) => a.date.getTime() - b.date.getTime());
}
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
