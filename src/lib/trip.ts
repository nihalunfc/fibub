// Trip Tracker maths: filtering live GPS fixes, distance, speeds, speed changes, gaps, marks and legs, plus the
// GPX and CSV writers. No DOM. Times in milliseconds, distances in metres, speeds in m/s, accelerations in m/s².
// Distances use the WGS84 ellipsoid (Vincenty), the same maths as the GPS track analyser.
import { vincenty, haversine } from './sci/gpstrack.ts';

export type Mode = 'walk' | 'run' | 'cycle' | 'car' | 'bus' | 'train';
export const MODE_LIST: Mode[] = ['walk', 'run', 'cycle', 'car', 'bus', 'train'];

export type ModeRules = {
  label: string;
  /** Fastest believable speed; a fix that implies more is dropped. */
  maxSpeed: number;
  /** Worst accuracy (metres) a fix may have and still be used. */
  maxAcc: number;
  /** A speed change counts when it is at least this steep ... */
  sharp: number;
  /** ... lasts at least two fixes in a row ... */
  minSteps: number;
  /** ... and changes the speed by at least this much. */
  minDelta: number;
};
export const MODES: Record<Mode, ModeRules> = {
  walk: { label: 'Walk', maxSpeed: 4, maxAcc: 50, sharp: 0.8, minSteps: 2, minDelta: 1 },
  run: { label: 'Run', maxSpeed: 8, maxAcc: 50, sharp: 0.8, minSteps: 2, minDelta: 1.5 },
  cycle: { label: 'Cycle', maxSpeed: 20, maxAcc: 50, sharp: 1.5, minSteps: 2, minDelta: 2 },
  car: { label: 'Car', maxSpeed: 60, maxAcc: 65, sharp: 2.5, minSteps: 2, minDelta: 3 },
  bus: { label: 'Bus', maxSpeed: 60, maxAcc: 65, sharp: 2.5, minSteps: 2, minDelta: 3 },
  train: { label: 'Train', maxSpeed: 100, maxAcc: 65, sharp: 2.5, minSteps: 2, minDelta: 3 },
};

/** A gap in the fixes longer than this (seconds) is recorded as a gap. */
export const GAP_SECONDS = 20;
/** Slower than this (m/s) counts as stopped, not moving. */
export const STOP_SPEED = 0.5;
/** Weight of the newest speed when smoothing (1 = no smoothing). */
const SMOOTH = 0.6;
/** This many bad jumps in a row mean the last good fix was the odd one out. */
const MAX_JUMPS = 5;

/** A raw reading from the browser. */
export type Fix = { t: number; lat: number; lon: number; acc: number; speed?: number | null; hid?: boolean };

/** A fix that was kept. `brk` says why distance is not counted from the previous sample. */
export type Sample = {
  t: number; lat: number; lon: number; acc: number;
  /** Smoothed speed, m/s. */
  v: number;
  /** Metres from the previous sample (0 after a break). */
  s: number;
  brk?: 'gap' | 'pause';
  /** For a gap: straight-line metres across it. */
  g?: number;
  /** For a gap: the page was hidden. */
  h?: boolean;
};
export type Mark = { i: number; label: string; auto: boolean };
export type Trip = {
  id: string; name: string; mode: Mode; startedAt: number;
  /** Metres between automatic marks (1000 or 1609.344). */
  autoUnit: number;
  samples: Sample[]; marks: Mark[];
  dropped: { acc: number; jump: number; dup: number };
  /** True while it is still being recorded (an autosave of it is an unfinished trip). */
  live?: boolean;
  /** Set by the recorder: the next kept fix starts a new piece after a pause. */
  pendingPause?: boolean;
  jumps?: number;
};

export const dist = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const r = vincenty(a.lat, a.lon, b.lat, b.lon);
  return r.converged ? r.d : haversine(a.lat, a.lon, b.lat, b.lon);
};

export function newTrip(mode: Mode, startedAt: number, autoUnit = 1000, id = 't' + startedAt.toString(36)): Trip {
  return { id, name: defaultName(mode, startedAt), mode, startedAt, autoUnit, samples: [], marks: [], dropped: { acc: 0, jump: 0, dup: 0 }, jumps: 0 };
}
export function defaultName(mode: Mode, t: number) {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${MODES[mode].label} ${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export type AddResult = { kept: boolean; reason?: 'acc' | 'jump' | 'dup' | 'invalid'; gap?: boolean };

/** Offer one fix to the trip. Mutates the trip. Returns whether it was kept. */
export function addFix(trip: Trip, f: Fix): AddResult {
  const R = MODES[trip.mode];
  if (!Number.isFinite(f.lat) || !Number.isFinite(f.lon) || !Number.isFinite(f.t) || Math.abs(f.lat) > 90 || Math.abs(f.lon) > 180) return { kept: false, reason: 'invalid' };
  const acc = Number.isFinite(f.acc) ? f.acc : Infinity;
  if (acc > R.maxAcc) { trip.dropped.acc++; return { kept: false, reason: 'acc' }; }
  const S = trip.samples, prev = S[S.length - 1];
  const sp = f.speed != null && Number.isFinite(f.speed) && f.speed >= 0 ? Math.min(f.speed, R.maxSpeed) : null;
  const first = (brk?: Sample['brk']): Sample => ({ t: f.t, lat: f.lat, lon: f.lon, acc, v: sp ?? 0, s: 0, ...(brk ? { brk } : {}) });
  if (!prev) { S.push(first()); trip.pendingPause = false; return { kept: true }; }
  const dt = (f.t - prev.t) / 1000;
  if (dt <= 0.4) { trip.dropped.dup++; return { kept: false, reason: 'dup' }; }
  const d = dist(prev, f);
  const implied = d / dt;
  if (implied > R.maxSpeed) {
    trip.jumps = (trip.jumps ?? 0) + 1;
    if (trip.jumps < MAX_JUMPS) { trip.dropped.jump++; return { kept: false, reason: 'jump' }; }
    // Several in a row: the earlier point was the wrong one, so carry on from here without counting the jump.
    trip.jumps = 0; trip.dropped.jump++;
    S.push({ ...first('gap'), g: 0, h: !!f.hid }); return { kept: true, gap: true };
  }
  trip.jumps = 0;
  if (trip.pendingPause) { trip.pendingPause = false; S.push(first('pause')); return { kept: true }; }
  // A quiet spell with no movement is not a gap, unless the page was hidden meanwhile.
  if (dt > GAP_SECONDS && (f.hid || d > Math.max(15, prev.acc + acc))) {
    S.push({ ...first('gap'), v: sp ?? prev.v, g: d, h: !!f.hid });
    return { kept: true, gap: true };
  }
  const raw = Math.min(sp ?? implied, R.maxSpeed);
  const v = SMOOTH * raw + (1 - SMOOTH) * prev.v;
  S.push({ t: f.t, lat: f.lat, lon: f.lon, acc, v, s: d });
  addAutoMarks(trip);
  return { kept: true };
}

function addAutoMarks(trip: Trip) {
  const S = trip.samples, i = S.length - 1;
  let along = 0;
  for (const s of S) along += s.s + (s.g ?? 0);
  const have = trip.marks.filter((m) => m.auto).length;
  if (along >= (have + 1) * trip.autoUnit) trip.marks.push({ i, label: '', auto: true });
}

/** Add a mark at the latest point. Returns false when there is no point yet. */
export function addMark(trip: Trip, label: string): boolean {
  if (!trip.samples.length) return false;
  trip.marks.push({ i: trip.samples.length - 1, label: label.trim().slice(0, 40), auto: false });
  return true;
}

/** Call when recording is paused: the next kept fix starts a new piece, with no distance across the pause. */
export function pauseTrip(trip: Trip) { trip.pendingPause = true; }

export type Gap = { i: number; t0: number; t1: number; seconds: number; metres: number; hidden: boolean; from: Sample; to: Sample };
export type SpeedEvent = { kind: 'up' | 'down'; i0: number; i1: number; t: number; into: number; from: number; to: number; accel: number; lat: number; lon: number };
export type Leg = { from: string; to: string; metres: number; gapMetres: number; seconds: number; moving: number; avg: number; top: number; i0: number; i1: number };
export type Analysis = {
  /** Cumulative tracked metres at each sample (gaps not included). */
  cum: number[];
  /** Cumulative seconds since the start at each sample, pauses not counted. */
  clock: number[];
  /** Metres along the trip including straight-line gap distance, at each sample. */
  along: number[];
  gaps: Gap[]; events: SpeedEvent[]; legs: Leg[];
  metres: number; gapMetres: number; elapsed: number; moving: number;
  avgMoving: number; avg: number; top: number; speed: number; acc: number;
  pauses: number;
};

export function analyse(trip: Trip): Analysis {
  const S = trip.samples, n = S.length, R = MODES[trip.mode];
  const cum = new Array<number>(n), clock = new Array<number>(n), along = new Array<number>(n);
  const gaps: Gap[] = [];
  let metres = 0, gapMetres = 0, elapsed = 0, moving = 0, top = 0, pauses = 0;
  for (let i = 0; i < n; i++) {
    const s = S[i];
    if (i > 0) {
      const dt = (s.t - S[i - 1].t) / 1000;
      if (s.brk === 'pause') pauses++;
      else elapsed += dt;
      metres += s.s;
      if (s.brk === 'gap') { gapMetres += s.g ?? 0; gaps.push({ i, t0: S[i - 1].t, t1: s.t, seconds: dt, metres: s.g ?? 0, hidden: !!s.h, from: S[i - 1], to: s }); }
      else if (s.brk == null && s.v >= STOP_SPEED) moving += dt;
    }
    if (s.v > top) top = s.v;
    cum[i] = metres; clock[i] = elapsed; along[i] = metres + gapMetres;
  }
  // Speed changes: runs of steps that all speed up (or all slow down) at least `sharp` m/s².
  const events: SpeedEvent[] = [];
  let runStart = -1, runSign = 0;
  const close = (end: number) => {
    if (runStart >= 0 && end - runStart >= R.minSteps) {
      const a = S[runStart], b = S[end], dv = b.v - a.v;
      if (Math.abs(dv) >= R.minDelta) events.push({ kind: dv > 0 ? 'up' : 'down', i0: runStart, i1: end, t: a.t, into: clock[runStart], from: a.v, to: b.v, accel: dv / ((b.t - a.t) / 1000), lat: a.lat, lon: a.lon });
    }
    runStart = -1; runSign = 0;
  };
  for (let i = 1; i < n; i++) {
    const dt = (S[i].t - S[i - 1].t) / 1000;
    if (S[i].brk || dt <= 0 || dt > 6) { close(i - 1); continue; }
    const a = (S[i].v - S[i - 1].v) / dt;
    const sign = Math.abs(a) >= R.sharp ? Math.sign(a) : 0;
    if (sign === 0) { close(i - 1); continue; }
    if (runStart >= 0 && sign === runSign) continue;
    close(i - 1);
    runStart = i - 1; runSign = sign;
  }
  close(n - 1);
  // Legs between marks.
  const legs: Leg[] = [];
  if (n > 1) {
    const cuts = [{ i: 0, label: 'Start' }];
    const unit = trip.autoUnit;
    const nameOf = (m: Mark, k: number) => (m.label || (m.auto ? `${fmtUnitMark(unit, trip.marks.filter((x) => x.auto).indexOf(m) + 1)}` : `Point ${k + 1}`));
    trip.marks.slice().sort((a, b) => a.i - b.i).forEach((m, k) => { if (m.i > cuts[cuts.length - 1].i && m.i < n) cuts.push({ i: m.i, label: nameOf(m, k) }); });
    cuts.push({ i: n - 1, label: 'End' });
    for (let k = 0; k + 1 < cuts.length; k++) {
      const a = cuts[k].i, b = cuts[k + 1].i;
      if (b <= a) continue;
      let mv = 0, tp = 0;
      for (let i = a + 1; i <= b; i++) {
        const dt = (S[i].t - S[i - 1].t) / 1000;
        if (!S[i].brk && S[i].v >= STOP_SPEED) mv += dt;
        if (S[i].v > tp) tp = S[i].v;
      }
      const m = cum[b] - cum[a], secs = clock[b] - clock[a];
      legs.push({ from: cuts[k].label, to: cuts[k + 1].label, metres: m, gapMetres: (along[b] - cum[b]) - (along[a] - cum[a]), seconds: secs, moving: mv, avg: mv > 0 ? m / mv : 0, top: tp, i0: a, i1: b });
    }
  }
  const last = S[n - 1];
  return {
    cum, clock, along, gaps, events, legs, metres, gapMetres, elapsed, moving, pauses,
    avgMoving: moving > 0 ? metres / moving : 0, avg: elapsed > 0 ? metres / elapsed : 0,
    top, speed: last ? last.v : 0, acc: last ? last.acc : NaN,
  };
}
function fmtUnitMark(unit: number, k: number) { return unit > 1500 ? `${k} mile` : `${k} km`; }

// ---------- formatting ----------
export const KMH = 3.6, MPH = 2.2369362920544;
export type Units = 'km' | 'mi';
export const unitInfo = (u: Units) => (u === 'mi' ? { d: 1609.344, dl: 'mi', v: MPH, vl: 'mph' } : { d: 1000, dl: 'km', v: KMH, vl: 'km/h' });
export const fmtDist = (m: number, u: Units) => { const i = unitInfo(u); return m / i.d >= 10 ? `${(m / i.d).toFixed(1)} ${i.dl}` : `${(m / i.d).toFixed(2)} ${i.dl}`; };
export const fmtSpeed = (v: number, u: Units) => { const i = unitInfo(u); return `${(v * i.v).toFixed(1)} ${i.vl}`; };
export function fmtPace(v: number, u: Units) {
  if (!(v >= 0.3)) return '–';
  const s = unitInfo(u).d / v, mm = Math.floor(s / 60), ss = Math.round(s % 60);
  return ss === 60 ? `${mm + 1}:00 /${unitInfo(u).dl}` : `${mm}:${String(ss).padStart(2, '0')} /${unitInfo(u).dl}`;
}
export function fmtDur(sec: number) {
  const s = Math.max(0, Math.round(sec)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`;
}
export const fmtMetres = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`);
export const fmtPos = (lat: number, lon: number) => `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
export const fmtClock = (t: number) => { const d = new Date(t), p = (n: number) => String(n).padStart(2, '0'); return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; };

// ---------- GPX and CSV ----------
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const iso = (t: number) => new Date(t).toISOString().replace(/\.\d{3}Z$/, 'Z');
const markName = (trip: Trip, m: Mark) => m.label || (m.auto ? fmtUnitMark(trip.autoUnit, trip.marks.filter((x) => x.auto).indexOf(m) + 1) : 'Point');

/** GPX 1.1 with times. A gap or pause starts a new track segment, so no line is drawn across missing data. */
export function toGpx(trip: Trip): string {
  const out = ['<?xml version="1.0" encoding="UTF-8"?>', '<gpx version="1.1" creator="fibub.com Trip Tracker" xmlns="http://www.topografix.com/GPX/1/1">',
    `<metadata><name>${xml(trip.name)}</name><time>${iso(trip.startedAt)}</time></metadata>`];
  for (const m of trip.marks) { const s = trip.samples[m.i]; if (s) out.push(`<wpt lat="${s.lat.toFixed(7)}" lon="${s.lon.toFixed(7)}"><time>${iso(s.t)}</time><name>${xml(markName(trip, m))}</name></wpt>`); }
  out.push(`<trk><name>${xml(trip.name)}</name><type>${trip.mode}</type>`);
  trip.samples.forEach((s, i) => {
    if (i === 0) out.push('<trkseg>');
    else if (s.brk) out.push('</trkseg>', '<trkseg>');
    out.push(`<trkpt lat="${s.lat.toFixed(7)}" lon="${s.lon.toFixed(7)}"><time>${iso(s.t)}</time></trkpt>`);
  });
  if (trip.samples.length) out.push('</trkseg>');
  out.push('</trk>', '</gpx>', '');
  return out.join('\n');
}

const csvCell = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
/** CSV: time, lat, lon, accuracy_m, speed_mps, mark, gap (the first point after a gap) and pause (after a pause). */
export function toCsv(trip: Trip): string {
  const rows = ['time,lat,lon,accuracy_m,speed_mps,mark,gap,pause'];
  const markAt = new Map<number, string[]>();
  for (const m of trip.marks) markAt.set(m.i, [...(markAt.get(m.i) ?? []), markName(trip, m)]);
  trip.samples.forEach((s, i) => {
    rows.push([iso(s.t), s.lat.toFixed(7), s.lon.toFixed(7), s.acc.toFixed(1), s.v.toFixed(2), csvCell((markAt.get(i) ?? []).join('; ')), s.brk === 'gap' ? '1' : '0', s.brk === 'pause' ? '1' : '0'].join(','));
  });
  return rows.join('\n') + '\n';
}

// ---------- saving ----------
type Packed = { id: string; name: string; mode: Mode; startedAt: number; autoUnit: number; live?: boolean; marks: [number, string, number][]; dropped: Trip['dropped']; s: (number | string)[][] };
const BRK = { gap: 1, pause: 2 } as const;
/** A compact plain-object form for localStorage (or JSON). */
export function pack(trip: Trip): Packed {
  const r = (x: number, k: number) => +x.toFixed(k);
  return {
    id: trip.id, name: trip.name, mode: trip.mode, startedAt: trip.startedAt, autoUnit: trip.autoUnit, live: trip.live || undefined, dropped: trip.dropped,
    marks: trip.marks.map((m) => [m.i, m.label, m.auto ? 1 : 0]),
    s: trip.samples.map((s) => [s.t, r(s.lat, 7), r(s.lon, 7), r(s.acc, 1), r(s.v, 2), r(s.s, 2), s.brk ? BRK[s.brk] : 0, r(s.g ?? 0, 1), s.h ? 1 : 0]),
  };
}
export function unpack(p: any): Trip | null {
  try {
    if (!p || typeof p.id !== 'string' || !MODES[p.mode as Mode] || !Array.isArray(p.s)) return null;
    const samples: Sample[] = p.s.map((a: number[]) => {
      const s: Sample = { t: a[0], lat: a[1], lon: a[2], acc: a[3], v: a[4], s: a[5] };
      if (a[6] === 1) { s.brk = 'gap'; s.g = a[7]; if (a[8]) s.h = true; } else if (a[6] === 2) s.brk = 'pause';
      return s;
    });
    if (samples.some((s) => !Number.isFinite(s.t + s.lat + s.lon + s.v + s.s))) return null;
    return {
      id: p.id, name: String(p.name ?? '').slice(0, 80), mode: p.mode, startedAt: Number(p.startedAt) || samples[0]?.t || 0, autoUnit: Number(p.autoUnit) || 1000, live: !!p.live,
      samples, marks: (p.marks ?? []).map((m: any[]) => ({ i: m[0], label: String(m[1] ?? ''), auto: !!m[2] })), dropped: p.dropped ?? { acc: 0, jump: 0, dup: 0 },
    };
  } catch { return null; }
}

// ---------- a made-up trip ----------
/**
 * Fixes for a made-up car trip of about 3 km near 1°N 1°E (open sea, so it cannot be anyone's real route): a hard
 * start, a turn, a hard stop, a wait, a second drive with 30 seconds of no signal, and a stop. Same every time.
 */
export function sampleFixes(t0 = Date.UTC(2026, 0, 15, 9, 0, 0)): Fix[] {
  let seed = 12345;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 - 0.5; };
  // [seconds, from speed, to speed (m/s), heading change in degrees over the stretch]
  const plan: [number, number, number, number][] = [
    [3, 0, 0, 0], [5, 0, 14, 0], [60, 14, 14, 0], [8, 14, 14, 90], [45, 14, 14, 0], [4, 14, 0, 0], [20, 0, 0, 0],
    [6, 0, 12, 0], [50, 12, 12, 0], [5, 12, 12, -80], [70, 12, 12, 0], [5, 12, 0, 0], [5, 0, 0, 0],
  ];
  const out: Fix[] = [];
  let t = 0, lat = 1, lon = 1, head = 45 * Math.PI / 180;
  const skipFrom = 170, skipTo = 200; // 30 s with no fixes (as if the page had been hidden)
  for (const [secs, v0, v1, turn] of plan) {
    for (let k = 0; k < secs; k++) {
      const v = v0 + ((v1 - v0) * (k + 1)) / secs;
      head += (turn * Math.PI / 180) / secs;
      lat += (v * Math.cos(head)) / 110574.3; lon += (v * Math.sin(head)) / (111320 * Math.cos(lat * Math.PI / 180));
      t++;
      if (t > skipFrom && t <= skipTo) continue;
      out.push({ t: t0 + t * 1000, lat: lat + rnd() * 1e-6, lon: lon + rnd() * 1e-6, acc: 5 + Math.round(rnd() * 4 + 2), speed: Math.max(0, v + rnd() * 0.2), hid: t === skipTo + 1 });
    }
  }
  out.unshift({ t: t0, lat: 1, lon: 1, acc: 6, speed: 0 });
  return out;
}

/** A trip built from fixes (used for the sample and by the tests). */
export function buildTrip(fixes: Fix[], mode: Mode, marks: { afterIndex: number; label: string }[] = [], autoUnit = 1000): Trip {
  const trip = newTrip(mode, fixes[0]?.t ?? 0, autoUnit, 'sample');
  fixes.forEach((f, k) => {
    addFix(trip, f);
    for (const m of marks) if (m.afterIndex === k) addMark(trip, m.label);
  });
  return trip;
}
export function sampleTrip(): Trip {
  const t = buildTrip(sampleFixes(), 'car', [{ afterIndex: 60, label: 'Corner shop' }]);
  t.name = 'Sample trip (made up)';
  return t;
}
