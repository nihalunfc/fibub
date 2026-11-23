// Live trackers (#T1075 Speedometer, #T1076 G-Force Meter, #T1077 Step Counter, #T1078 Live Trackers, #T1079 Ergometer Link):
// the pure maths, with no DOM, so tests/device.mjs can check it. Nothing here stores or sends anything.

export const G = 9.80665; // standard gravity, m/s²

// ---------- speed ----------
export type SpeedUnit = 'kmh' | 'mph' | 'kn' | 'ms';
export const SPEED_UNITS: Record<SpeedUnit, { k: number; label: string; dist: number; dl: string }> = {
  kmh: { k: 3.6, label: 'km/h', dist: 1000, dl: 'km' },
  mph: { k: 2.2369362920544, label: 'mph', dist: 1609.344, dl: 'mi' },
  kn: { k: 1.9438444924406, label: 'knots', dist: 1852, dl: 'nmi' },
  ms: { k: 1, label: 'm/s', dist: 1000, dl: 'km' },
};
export const toUnit = (ms: number, u: SpeedUnit) => ms * SPEED_UNITS[u].k;

/** Distance in metres between two points (haversine on a 6 371 008.8 m sphere: within 0.5% of the ellipsoid, plenty for live speed). */
export function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const r = Math.PI / 180, R = 6371008.8;
  const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing from a to b, degrees clockwise from north. */
export function bearing(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const r = Math.PI / 180;
  const y = Math.sin((b.lon - a.lon) * r) * Math.cos(b.lat * r);
  const x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lon - a.lon) * r);
  return ((Math.atan2(y, x) / r) % 360 + 360) % 360;
}

export type GpsFix = { t: number; lat: number; lon: number; acc: number; speed?: number | null; heading?: number | null; alt?: number | null; altAcc?: number | null };
export type SpeedState = {
  last: GpsFix | null; speed: number; max: number; dist: number; moving: number; started: number; lastT: number;
  heading: number | null; alt: number | null; altMin: number | null; altMax: number | null; climb: number; altRef: number | null;
  fixes: number; skipped: number; acc: number;
};
export const MOVING = 0.5; // m/s: below this counts as standing still (GPS drift)
export const MAX_ACC = 50; // m: fixes less accurate than this are shown but not counted

export const newSpeed = (): SpeedState => ({ last: null, speed: 0, max: 0, dist: 0, moving: 0, started: 0, lastT: 0, heading: null, alt: null, altMin: null, altMax: null, climb: 0, altRef: null, fixes: 0, skipped: 0, acc: 0 });

/** Feed one GPS fix. Uses the browser's own speed (Doppler, best) when it gives one, else distance over time.
 *  Returns false when the fix was too inaccurate to count. */
export function addGps(s: SpeedState, f: GpsFix, maxAcc = MAX_ACC): boolean {
  s.acc = f.acc;
  if (!isFinite(f.lat) || !isFinite(f.lon) || f.acc > maxAcc) { s.skipped++; return false; }
  if (!s.started) s.started = f.t;
  const p = s.last;
  let v: number;
  if (typeof f.speed === 'number' && isFinite(f.speed) && f.speed >= 0) v = f.speed;
  else if (p && f.t > p.t) v = haversine(p, f) / ((f.t - p.t) / 1000);
  else v = 0;
  if (p && f.t > p.t) {
    const d = haversine(p, f), dt = (f.t - p.t) / 1000;
    // Ignore drift while standing still: the step must beat both the moving threshold and the accuracy circle.
    if (v >= MOVING && d > Math.min(p.acc, f.acc) * 0.5) { s.dist += d; s.moving += dt; }
    if (v >= MOVING) s.heading = typeof f.heading === 'number' && isFinite(f.heading) ? f.heading : bearing(p, f);
  }
  s.speed = v < MOVING ? 0 : v;
  if (s.speed > s.max) s.max = s.speed;
  if (typeof f.alt === 'number' && isFinite(f.alt)) {
    s.alt = f.alt;
    s.altMin = s.altMin == null ? f.alt : Math.min(s.altMin, f.alt);
    s.altMax = s.altMax == null ? f.alt : Math.max(s.altMax, f.alt);
    // Climb counts rises of more than 3 m from the last low point, so GPS jitter does not add up.
    if (s.altRef == null || f.alt < s.altRef) s.altRef = f.alt;
    else if (f.alt - s.altRef >= 3) { s.climb += f.alt - s.altRef; s.altRef = f.alt; }
  }
  s.last = f; s.lastT = f.t; s.fixes++;
  return true;
}
/** Average speed while moving, m/s. */
export const avgMoving = (s: SpeedState) => (s.moving > 0 ? s.dist / s.moving : 0);

// ---------- g-force ----------
type V3 = [number, number, number];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: V3): V3 => { const m = Math.hypot(...a) || 1; return [a[0] / m, a[1] / m, a[2] / m]; };

export type Mount = 'flat' | 'upright';
export type Frame = { g0: V3; up: V3; fwd: V3; right: V3 };
/** Build a car frame from the gravity reading at rest (accelerationIncludingGravity, which points up when still).
 *  flat: phone lying flat, top of the phone pointing forward. upright: phone in a holder, screen facing you, so the back faces forward. */
export function makeFrame(g0: V3, mount: Mount): Frame {
  const up = unit(g0);
  const f: V3 = mount === 'flat' ? [0, 1, 0] : [0, 0, -1];
  const k = dot(f, up);
  let fwd: V3 = [f[0] - k * up[0], f[1] - k * up[1], f[2] - k * up[2]];
  if (Math.hypot(...fwd) < 0.2) fwd = [1, 0, 0]; // phone mounted along its own forward axis: fall back to its side
  fwd = unit(fwd);
  return { g0, up, fwd, right: cross(fwd, up) };
}
/** Split a reading (with gravity, m/s²) into g along the car: forward (+ speeding up), right (+ turning right), up (+ bump up). */
export function carG(a: V3, fr: Frame): { fwd: number; right: number; up: number; total: number } {
  const d: V3 = [a[0] - fr.g0[0], a[1] - fr.g0[1], a[2] - fr.g0[2]];
  const fwd = dot(d, fr.fwd) / G, right = dot(d, fr.right) / G, up = dot(d, fr.up) / G;
  return { fwd, right, up, total: Math.hypot(fwd, right) };
}
/** Exponential smoothing factor for a time constant tau (s) at a step dt (s). */
export const alpha = (dt: number, tau: number) => (tau <= 0 ? 1 : 1 - Math.exp(-dt / tau));

// ---------- steps ----------
/** A streaming step detector on the size of the acceleration (with gravity). Each step is a peak in the smoothed signal
 *  that rises more than `threshold` m/s² above the running mean and comes at least `minGap` ms after the last one.
 *  Walking is 1.4 to 2.2 steps a second, running up to 3.5, so 250 ms is a safe floor. */
export function makeStepCounter(threshold = 1.2, minGap = 250) {
  let lp: number | null = null, mean: number | null = null, prev = 0, prev2 = 0, lastStep = -1e9, lastT: number | null = null;
  const steps: number[] = [];
  return {
    steps,
    /** Push one sample (time in ms, magnitude m/s²). Returns true when this sample completes a step. */
    push(t: number, mag: number): boolean {
      const dt = lastT == null ? 0.02 : Math.max(0.001, (t - lastT) / 1000); lastT = t;
      lp = lp == null ? mag : lp + alpha(dt, 0.04) * (mag - lp);
      mean = mean == null ? mag : mean + alpha(dt, 1.5) * (mag - mean);
      const x = lp - mean;
      // prev is a peak if it beat both neighbours and the threshold.
      const hit = prev > threshold && prev >= prev2 && prev > x && t - lastStep >= minGap;
      prev2 = prev; prev = x;
      if (hit) { lastStep = t; steps.push(t); return true; }
      return false;
    },
  };
}
/** Steps a minute from the step times in the last `windowMs`. */
export function cadence(stepTimes: number[], now: number, windowMs = 10000): number {
  const w = stepTimes.filter((t) => now - t <= windowMs);
  if (w.length < 3) return 0;
  return ((w.length - 1) / ((w[w.length - 1] - w[0]) / 1000)) * 60;
}
/** Stride length from height (m): about 0.414 × height walking, 0.65 × running (common rule of thumb, as in #T915). */
export const stepLength = (heightM: number, running = false) => heightM * (running ? 0.65 : 0.414);

// ---------- Bluetooth fitness sensors (GATT standard characteristics) ----------
/** Heart Rate Measurement (0x2A37): flags bit 0 says uint8 or uint16 beats a minute. */
export function parseHeartRate(v: DataView): { bpm: number } {
  const flags = v.getUint8(0);
  return { bpm: flags & 1 ? v.getUint16(1, true) : v.getUint8(1) };
}
/** Cycling Power Measurement (0x2A63): flags uint16, then instantaneous power sint16 in watts. */
export function parseCyclingPower(v: DataView): { watts: number } {
  return { watts: v.getInt16(2, true) };
}
const u24 = (v: DataView, o: number) => v.getUint8(o) | (v.getUint8(o + 1) << 8) | (v.getUint8(o + 2) << 16);
export type Ergo = { speed?: number; cadence?: number; strokeRate?: number; strokes?: number; distance?: number; pace?: number; watts?: number; avgWatts?: number; kcal?: number; hr?: number; elapsed?: number; resistance?: number };
/** Fitness Machine Service: Indoor Bike Data (0x2AD2). Speed km/h, cadence rpm, distance m, power W. */
export function parseIndoorBike(v: DataView): Ergo {
  const f = v.getUint16(0, true), o: Ergo = {}; let i = 2;
  if (!(f & 1)) { o.speed = v.getUint16(i, true) / 100; i += 2; }
  if (f & 2) i += 2; // average speed
  if (f & 4) { o.cadence = v.getUint16(i, true) / 2; i += 2; }
  if (f & 8) i += 2; // average cadence
  if (f & 16) { o.distance = u24(v, i); i += 3; }
  if (f & 32) { o.resistance = v.getInt16(i, true); i += 2; }
  if (f & 64) { o.watts = v.getInt16(i, true); i += 2; }
  if (f & 128) { o.avgWatts = v.getInt16(i, true); i += 2; }
  if (f & 256) { o.kcal = v.getUint16(i, true); i += 5; }
  if (f & 512) { o.hr = v.getUint8(i); i += 1; }
  if (f & 1024) i += 1; // metabolic equivalent
  if (f & 2048) { o.elapsed = v.getUint16(i, true); i += 2; }
  return o;
}
/** Fitness Machine Service: Rower Data (0x2AD1). Stroke rate a minute, strokes, distance m, pace s per 500 m, power W. */
export function parseRower(v: DataView): Ergo {
  const f = v.getUint16(0, true), o: Ergo = {}; let i = 2;
  if (!(f & 1)) { o.strokeRate = v.getUint8(i) / 2; o.strokes = v.getUint16(i + 1, true); i += 3; }
  if (f & 2) i += 1; // average stroke rate
  if (f & 4) { o.distance = u24(v, i); i += 3; }
  if (f & 8) { o.pace = v.getUint16(i, true); i += 2; }
  if (f & 16) i += 2; // average pace
  if (f & 32) { o.watts = v.getInt16(i, true); i += 2; }
  if (f & 64) { o.avgWatts = v.getInt16(i, true); i += 2; }
  if (f & 128) { o.resistance = v.getInt16(i, true); i += 2; }
  if (f & 256) { o.kcal = v.getUint16(i, true); i += 5; }
  if (f & 512) { o.hr = v.getUint8(i); i += 1; }
  if (f & 1024) i += 1;
  if (f & 2048) { o.elapsed = v.getUint16(i, true); i += 2; }
  return o;
}
/** Pace (s per 500 m) as m:ss. */
export const fmtPace500 = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
/** Elapsed seconds as h:mm:ss or m:ss. */
export function fmtClock(sec: number): string {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60, p = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${p(m)}:${p(s)}` : `${m}:${p(s)}`;
}
