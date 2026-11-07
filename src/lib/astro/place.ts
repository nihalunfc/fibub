// Where and when you observe. Shared by every astronomy tool on fibub.
// The place is kept for this tab only (sessionStorage), so moving between astronomy tools keeps it.
// It is kept between visits (localStorage) only when the person ticks "Remember my place".
export type Place = { name: string; lat: number; lon: number; elev: number; tz: string };

// A few cities to start from. Coordinates to 0.01°, which is close enough for rise and set times.
export const CITIES: Place[] = [
  ['Toronto', 43.65, -79.38, 76, 'America/Toronto'], ['Niagara Falls, ON', 43.09, -79.08, 180, 'America/Toronto'], ['Ottawa', 45.42, -75.70, 70, 'America/Toronto'],
  ['Montreal', 45.50, -73.57, 30, 'America/Toronto'], ['Vancouver', 49.28, -123.12, 70, 'America/Vancouver'], ['Calgary', 51.05, -114.07, 1045, 'America/Edmonton'],
  ['Edmonton', 53.55, -113.49, 645, 'America/Edmonton'], ['Winnipeg', 49.90, -97.14, 239, 'America/Winnipeg'], ['Halifax', 44.65, -63.57, 20, 'America/Halifax'],
  ['New York', 40.71, -74.01, 10, 'America/New_York'], ['Chicago', 41.88, -87.63, 180, 'America/Chicago'], ['Denver', 39.74, -104.99, 1600, 'America/Denver'],
  ['Los Angeles', 34.05, -118.24, 90, 'America/Los_Angeles'], ['Tucson', 32.22, -110.97, 730, 'America/Phoenix'], ['Honolulu', 21.31, -157.86, 5, 'Pacific/Honolulu'],
  ['Mexico City', 19.43, -99.13, 2240, 'America/Mexico_City'], ['São Paulo', -23.55, -46.63, 760, 'America/Sao_Paulo'], ['Santiago', -33.45, -70.67, 570, 'America/Santiago'],
  ['London', 51.51, -0.13, 20, 'Europe/London'], ['Edinburgh', 55.95, -3.19, 50, 'Europe/London'], ['Dublin', 53.35, -6.26, 10, 'Europe/Dublin'],
  ['Paris', 48.86, 2.35, 35, 'Europe/Paris'], ['Berlin', 52.52, 13.40, 35, 'Europe/Berlin'], ['Madrid', 40.42, -3.70, 650, 'Europe/Madrid'],
  ['Rome', 41.90, 12.50, 20, 'Europe/Rome'], ['Cairo', 30.04, 31.24, 25, 'Africa/Cairo'], ['Nairobi', -1.29, 36.82, 1795, 'Africa/Nairobi'],
  ['Cape Town', -33.92, 18.42, 10, 'Africa/Johannesburg'], ['Dubai', 25.20, 55.27, 10, 'Asia/Dubai'], ['Abu Dhabi', 24.45, 54.38, 10, 'Asia/Dubai'],
  ['Doha', 25.29, 51.53, 10, 'Asia/Qatar'], ['Riyadh', 24.71, 46.68, 610, 'Asia/Riyadh'], ['Kuwait City', 29.38, 47.99, 10, 'Asia/Kuwait'],
  ['Muscat', 23.59, 58.41, 10, 'Asia/Muscat'], ['Manama', 26.23, 50.59, 5, 'Asia/Bahrain'], ['Mumbai', 19.08, 72.88, 10, 'Asia/Kolkata'],
  ['Delhi', 28.61, 77.21, 215, 'Asia/Kolkata'], ['Bengaluru', 12.97, 77.59, 920, 'Asia/Kolkata'], ['Chennai', 13.08, 80.27, 10, 'Asia/Kolkata'],
  ['Kochi', 9.93, 76.27, 5, 'Asia/Kolkata'], ['Kozhikode', 11.26, 75.78, 5, 'Asia/Kolkata'], ['Kolkata', 22.57, 88.36, 10, 'Asia/Kolkata'],
  ['Hyderabad', 17.39, 78.49, 540, 'Asia/Kolkata'], ['Pune', 18.52, 73.86, 560, 'Asia/Kolkata'], ['Leh', 34.15, 77.58, 3500, 'Asia/Kolkata'],
  ['Singapore', 1.35, 103.82, 15, 'Asia/Singapore'], ['Tokyo', 35.68, 139.69, 40, 'Asia/Tokyo'], ['Beijing', 39.90, 116.40, 45, 'Asia/Shanghai'],
  ['Sydney', -33.87, 151.21, 20, 'Australia/Sydney'], ['Melbourne', -37.81, 144.96, 30, 'Australia/Melbourne'], ['Perth', -31.95, 115.86, 20, 'Australia/Perth'],
  ['Auckland', -36.85, 174.76, 20, 'Pacific/Auckland'],
].map(([name, lat, lon, elev, tz]) => ({ name, lat, lon, elev, tz }) as Place);

const KEY = 'fibub-sky-place-v1';
export const browserTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; } };

/** The best first guess: a city in the browser's own time zone, or Toronto. No location is asked for. */
export function guessPlace(): Place {
  const tz = browserTz();
  return { ...(CITIES.find((c) => c.tz === tz) ?? CITIES[0]), ...(CITIES.some((c) => c.tz === tz) ? {} : { tz }) };
}

function valid(p: any): p is Place {
  return p && typeof p.name === 'string' && Number.isFinite(p.lat) && Math.abs(p.lat) <= 90 && Number.isFinite(p.lon) && Math.abs(p.lon) <= 180 && typeof p.tz === 'string';
}
export function loadPlace(): { place: Place; remembered: boolean } {
  for (const [store, remembered] of [[sessionStorage, false], [localStorage, true]] as const) {
    try { const p = JSON.parse(store.getItem(KEY) || 'null'); if (valid(p)) return { place: { elev: 0, ...p }, remembered: remembered || !!localStorage.getItem(KEY) }; } catch { /* blocked */ }
  }
  return { place: guessPlace(), remembered: false };
}
export function savePlace(p: Place, remember: boolean) {
  try { sessionStorage.setItem(KEY, JSON.stringify(p)); } catch { /* blocked */ }
  try { remember ? localStorage.setItem(KEY, JSON.stringify(p)) : localStorage.removeItem(KEY); } catch { /* blocked */ }
}

// ---- Time zones ----
const dtf = new Map<string, Intl.DateTimeFormat>();
function parts(date: Date, tz: string) {
  let f = dtf.get(tz);
  if (!f) { f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }); dtf.set(tz, f); }
  const o: Record<string, number> = {};
  for (const x of f.formatToParts(date)) if (x.type !== 'literal') o[x.type] = +x.value;
  return o as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}
/** Minutes the zone is ahead of UTC at that moment (e.g. -300 for Toronto in winter). */
export function tzOffset(tz: string, date: Date) {
  const p = parts(date, tz);
  return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}
/** The moment when the clock in `tz` shows this date and time. */
export function zoned(y: number, m: number, d: number, h = 0, mi = 0, tz = 'UTC') {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  let t = guess - tzOffset(tz, new Date(guess)) * 60000;
  t = guess - tzOffset(tz, new Date(t)) * 60000;
  return new Date(t);
}
export const localDate = (date: Date, tz: string) => { const p = parts(date, tz); return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`; };
export const localTime = (date: Date, tz: string) => { const p = parts(date, tz); return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`; };
export const localHours = (date: Date, tz: string) => { const p = parts(date, tz); return p.hour + p.minute / 60 + p.second / 3600; };
/** Local noon of a YYYY-MM-DD date: the start of that date's night. */
export const noonOf = (iso: string, tz: string) => { const [y, m, d] = iso.split('-').map(Number); return zoned(y, m, d, 12, 0, tz); };
export const todayIn = (tz: string) => localDate(new Date(), tz);

export function fmtTime(date: Date | null | undefined, tz: string) {
  if (!date) return '-';
  return localTime(date, tz);
}
export function fmtDay(date: Date, tz: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat(undefined, { timeZone: tz, ...opts }).format(date);
}
export function tzLabel(tz: string, date = new Date()) {
  const o = tzOffset(tz, date), s = o < 0 ? '−' : '+', a = Math.abs(o);
  return `UTC${s}${Math.floor(a / 60)}${a % 60 ? ':' + String(a % 60).padStart(2, '0') : ''}`;
}
export const allZones = (): string[] => { try { return (Intl as any).supportedValuesOf('timeZone'); } catch { return [...new Set(CITIES.map((c) => c.tz))].sort(); } };

// ---- Angles ----
export const pad = (n: number, w = 2) => String(n).padStart(w, '0');
/** 5.5 -> "05h 30m 00.0s" (hours) or 41.27 -> "+41° 16′ 12″" (degrees). */
export function sexa(v: number, kind: 'h' | 'd', dp = 1) {
  const sign = v < 0 ? '−' : kind === 'd' ? '+' : '';
  let a = Math.abs(v);
  let d = Math.floor(a), m = Math.floor((a - d) * 60), s = ((a - d) * 60 - m) * 60;
  if (+s.toFixed(dp) >= 60) { s = 0; m++; } if (m >= 60) { m = 0; d++; }
  if (kind === 'h') { d %= 24; return `${pad(d)}h ${pad(m)}m ${s.toFixed(dp).padStart(dp ? dp + 3 : 2, '0')}s`; }
  return `${sign}${pad(d)}° ${pad(m)}′ ${s.toFixed(dp).padStart(dp ? dp + 3 : 2, '0')}″`;
}
/**
 * Read an angle typed in any common way: "10.684", "00 42 44.3", "0h42m44.3s", "+41°16′9″", "41:16:09".
 * `hours` reads right ascension: hours when written as h m s or with colons/spaces, degrees when it is a
 * single decimal number (as catalogues like SIMBAD print it) or has a degree sign.
 */
export function parseAngle(text: string, hours = false): number | null {
  let t = text.trim().replace(/[−–]/g, '-').replace(/,/g, '.');
  if (!t) return null;
  const deg = /°|d(eg)?\b/i.test(t) && !/h/i.test(t);
  const neg = t.startsWith('-');
  const nums = t.replace(/^[+-]/, '').split(/[^\d.]+/).filter(Boolean).map(Number);
  if (!nums.length || nums.some((n) => !Number.isFinite(n)) || nums.length > 3) return null;
  let v = nums[0] + (nums[1] ?? 0) / 60 + (nums[2] ?? 0) / 3600;
  if (nums.length > 1 && ((nums[1] ?? 0) >= 60 || (nums[2] ?? 0) >= 60)) return null;
  if (neg) v = -v;
  if (hours) {
    const h = /h/i.test(t);
    if (deg || (nums.length === 1 && !h)) v /= 15;
    if (v < 0 || v >= 24.0000001) return null;
  } else if (Math.abs(v) > 90) return null;
  return v;
}
