// Camera-trap photos: a small EXIF reader (JPEG APP1, both byte orders), events by time gap, independent detections
// per station and species, and summaries (detections, relative abundance index per 100 trap-nights, naive occupancy,
// activity by hour). Times are the camera's wall-clock time, kept as milliseconds of a UTC date with the same
// digits, so no time zone or daylight saving shift is ever applied. No DOM.

export type Exif = { make?: string; model?: string; dateTimeOriginal?: string; dateTimeDigitized?: string; dateTime?: string; subSec?: string; offset?: string; width?: number; height?: number; orientation?: number };

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

/** Reads the EXIF block of a JPEG (the first 256 kB are enough). Returns null when there is none. */
export function readExif(input: ArrayBuffer | Uint8Array): Exif | null {
  const b = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let p = 2;
  while (p + 4 <= b.length) {
    if (b[p] !== 0xff) return null;
    const m = b[p + 1];
    if (m === 0xff) { p++; continue; }
    if (m === 0xd9 || m === 0xda) return null; // end of image or start of scan: no EXIF before the picture
    const len = (b[p + 2] << 8) | b[p + 3];
    if (m === 0xe1 && len >= 8 && b[p + 4] === 0x45 && b[p + 5] === 0x78 && b[p + 6] === 0x69 && b[p + 7] === 0x66 && b[p + 8] === 0 && b[p + 9] === 0) {
      return readTiffExif(b.subarray(p + 10, Math.min(b.length, p + 2 + len)));
    }
    p += 2 + len;
  }
  return null;
}

function readTiffExif(t: Uint8Array): Exif | null {
  if (t.length < 8) return null;
  const le = t[0] === 0x49 && t[1] === 0x49;
  if (!le && !(t[0] === 0x4d && t[1] === 0x4d)) return null;
  const dv = new DataView(t.buffer, t.byteOffset, t.byteLength);
  const u16 = (o: number) => dv.getUint16(o, le), u32 = (o: number) => dv.getUint32(o, le);
  if (u16(2) !== 42) return null;
  const ifd = (off: number) => {
    const tags = new Map<number, string | number>();
    if (off + 2 > t.length) return tags;
    const n = u16(off);
    for (let i = 0; i < n; i++) {
      const e = off + 2 + 12 * i; if (e + 12 > t.length) break;
      const tag = u16(e), type = u16(e + 2), count = u32(e + 4), size = (TYPE_SIZE[type] ?? 1) * count;
      const vo = size <= 4 ? e + 8 : u32(e + 8);
      if (vo + size > t.length) continue;
      if (type === 2) { let s = ''; for (let k = 0; k < count; k++) { const c = t[vo + k]; if (c === 0) break; s += String.fromCharCode(c); } tags.set(tag, s.trim()); }
      else if (type === 3) tags.set(tag, u16(vo));
      else if (type === 4) tags.set(tag, u32(vo));
    }
    return tags;
  };
  const i0 = ifd(u32(4)), out: Exif = {};
  const str = (m: Map<number, string | number>, k: number) => (typeof m.get(k) === 'string' && m.get(k) ? (m.get(k) as string) : undefined);
  out.make = str(i0, 0x010f); out.model = str(i0, 0x0110); out.dateTime = str(i0, 0x0132);
  if (typeof i0.get(0x0112) === 'number') out.orientation = i0.get(0x0112) as number;
  const ex = i0.get(0x8769);
  if (typeof ex === 'number') {
    const e = ifd(ex);
    out.dateTimeOriginal = str(e, 0x9003); out.dateTimeDigitized = str(e, 0x9004); out.subSec = str(e, 0x9291); out.offset = str(e, 0x9011);
    if (typeof e.get(0xa002) === 'number') out.width = e.get(0xa002) as number;
    if (typeof e.get(0xa003) === 'number') out.height = e.get(0xa003) as number;
  }
  for (const k of Object.keys(out) as (keyof Exif)[]) if (out[k] === undefined) delete out[k];
  return out;
}

/** "2026:05:03 21:14:07" (EXIF) or "2026-05-03 21:14:07" / "2026-05-03T21:14" to wall-clock milliseconds, else NaN. */
export function parseTime(s: string | undefined): number {
  const m = (s ?? '').trim().match(/^(\d{4})[:\-/](\d{1,2})[:\-/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return NaN;
  const [y, mo, d, h, mi, se] = m.slice(1).map((v) => +(v ?? 0));
  if (y < 1900 || mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || se > 59) return NaN;
  return Date.UTC(y, mo - 1, d, h, mi, se);
}
const p2 = (n: number) => String(n).padStart(2, '0');
export function fmtTime(t: number, seconds = true) {
  if (!Number.isFinite(t)) return '';
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}${seconds ? ':' + p2(d.getUTCSeconds()) : ''}`;
}
export const hourOf = (t: number) => new Date(t).getUTCHours();
const DAY = 864e5;

export type Photo = { station: string; t: number; name?: string };
/** Sorted order (station, then time, then name) and an event number for each photo: a new event starts at a new station or after a gap longer than gapMin. */
export function groupEvents<T extends Photo>(photos: T[], gapMin: number) {
  const order = photos.map((_, i) => i).sort((a, b) => photos[a].station.localeCompare(photos[b].station) || photos[a].t - photos[b].t || (photos[a].name ?? '').localeCompare(photos[b].name ?? ''));
  const event = new Array<number>(photos.length);
  let ev = -1, prev: T | null = null;
  for (const i of order) {
    const p = photos[i];
    if (!prev || prev.station !== p.station || !(p.t - prev.t <= gapMin * 6e4)) ev++;
    event[i] = ev; prev = p;
  }
  return { order, event, count: ev + 1 };
}

export type Rec = { station: string; t: number; species: string; count: number };
export type Detection = { station: string; species: string; start: number; end: number; photos: number; count: number };
/**
 * Independent detections: for each station and species, records sorted by time; a new detection starts when the time
 * since the last record (from = 'last') or since the first record of the current detection (from = 'first') is more
 * than gapMin minutes. The detection's count is the most animals in any one of its photos.
 */
export function detections(recs: Rec[], gapMin: number, from: 'last' | 'first' = 'last'): Detection[] {
  const groups = new Map<string, Rec[]>();
  for (const r of recs) { if (!r.species || !Number.isFinite(r.t)) continue; const k = `${r.station}\u0000${r.species}`; (groups.get(k) ?? groups.set(k, []).get(k)!).push(r); }
  const out: Detection[] = [];
  for (const list of groups.values()) {
    list.sort((a, b) => a.t - b.t);
    let cur: Detection | null = null;
    for (const r of list) {
      const ref = cur ? (from === 'last' ? cur.end : cur.start) : 0;
      if (!cur || r.t - ref > gapMin * 6e4) { cur = { station: r.station, species: r.species, start: r.t, end: r.t, photos: 0, count: 0 }; out.push(cur); }
      cur.end = r.t; cur.photos++; cur.count = Math.max(cur.count, r.count || 0);
    }
  }
  return out.sort((a, b) => a.station.localeCompare(b.station) || a.start - b.start || a.species.localeCompare(b.species));
}

export type SpeciesSummary = { species: string; detections: number; animals: number; rai: number; stations: number; naiveOcc: number; hours: number[] };
/** Per species: detections, total of the detections' counts, RAI = detections per 100 trap-nights, stations with it and naive occupancy. */
export function summarise(dets: Detection[], trapNights: Record<string, number>): { species: SpeciesSummary[]; totalNights: number; stations: number } {
  const st = Object.keys(trapNights), totalNights = st.reduce((s, k) => s + (trapNights[k] || 0), 0);
  const by = new Map<string, Detection[]>();
  for (const d of dets) (by.get(d.species) ?? by.set(d.species, []).get(d.species)!).push(d);
  const species = [...by.entries()].map(([species, list]) => {
    const hours = new Array(24).fill(0); list.forEach((d) => hours[hourOf(d.start)]++);
    const where = new Set(list.map((d) => d.station));
    return { species, detections: list.length, animals: list.reduce((s, d) => s + d.count, 0), rai: totalNights > 0 ? (100 * list.length) / totalNights : NaN, stations: where.size, naiveOcc: st.length ? where.size / st.length : NaN, hours };
  }).sort((a, b) => b.detections - a.detections || a.species.localeCompare(b.species));
  return { species, totalNights, stations: st.length };
}

/** A first guess at trap-nights: calendar days from the first to the last photo of the station (at least 1). */
export function guessNights(times: number[]) {
  const ok = times.filter(Number.isFinite); if (!ok.length) return 0;
  const a = Math.floor(Math.min(...ok) / DAY), b = Math.floor(Math.max(...ok) / DAY);
  return Math.max(1, b - a);
}

/** The station of a file: its folder (from webkitRelativePath), or "" when files were picked one by one. */
export function stationOf(relPath: string) {
  const parts = relPath.split('/').filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : '';
}

export const csvCell = (v: unknown) => { const s = v === undefined || v === null ? '' : String(v); return /[",\n\r]/.test(s) || /^[=+\-@]/.test(s) ? `"${(/^[=+\-@]/.test(s) ? "'" : '') + s.replace(/"/g, '""')}"` : s; };

/** A made-up survey for the example: three stations, about two weeks, tagged. */
export function exampleSurvey() {
  let seed = 4242; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const SP: [string, number, number[], number][] = [['Deer', 9, [5, 6, 7, 18, 19, 20, 21], 3], ['Fox', 7, [21, 22, 23, 0, 1, 2, 3], 1], ['Hare', 6, [20, 21, 22, 4, 5], 1], ['Badger', 4, [22, 23, 0, 1], 2], ['Bird', 3, [8, 10, 12, 15], 1]];
  const stations = ['Camera A', 'Camera B', 'Camera C'], start = Date.UTC(2026, 4, 1, 12, 0, 0);
  const photos: { station: string; t: number; name: string; species: string; count: number; behaviour: string }[] = [];
  const beh = ['Moving', 'Feeding', 'Vigilant', 'Resting'];
  stations.forEach((s, si) => {
    let k = 0;
    for (const [sp, n, hours, maxN] of SP) {
      const visits = Math.max(1, Math.round(n * (si === 2 && sp === 'Badger' ? 0 : si === 1 ? 0.6 : 1)));
      if (si === 2 && sp === 'Badger') continue;
      for (let v = 0; v < visits; v++) {
        const day = Math.floor(rnd() * 13) + 1, hr = hours[Math.floor(rnd() * hours.length)], t0 = start - 12 * 36e5 + day * DAY + hr * 36e5 + Math.floor(rnd() * 3540) * 1000;
        const burst = 1 + Math.floor(rnd() * 4), cnt = 1 + Math.floor(rnd() * maxN), b = beh[Math.floor(rnd() * beh.length)];
        for (let j = 0; j < burst; j++) photos.push({ station: s, t: t0 + j * 20000, name: `IMG_${String(++k).padStart(4, '0')}.JPG`, species: sp, count: cnt, behaviour: b });
      }
    }
    // Two empty triggers (wind, sun on grass).
    for (let j = 0; j < 2; j++) photos.push({ station: s, t: start + Math.floor(rnd() * 13 * DAY), name: `IMG_${String(++k).padStart(4, '0')}.JPG`, species: '', count: 0, behaviour: '' });
  });
  // Rename in time order per station, like a real camera.
  for (const s of stations) { const list = photos.filter((p) => p.station === s).sort((a, b) => a.t - b.t); list.forEach((p, i) => (p.name = `IMG_${String(i + 1).padStart(4, '0')}.JPG`)); }
  return { photos, stations, nights: { 'Camera A': 14, 'Camera B': 14, 'Camera C': 12 } as Record<string, number> };
}
