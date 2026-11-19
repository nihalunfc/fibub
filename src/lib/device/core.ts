// Device test kit, the pure part: no DOM, so tests/device.mjs can check it in Node.
// Used by the device testers (#T1051-#T1063): mic, speakers, camera, keyboard, mouse, touch, screen, gamepad,
// vibration, sensors, battery, MIDI and device info. Browser helpers are in ./browser.ts.

/** Root-mean-square of a block of samples (-1..1). */
export function rms(x: ArrayLike<number>): number {
  let s = 0;
  for (let i = 0; i < x.length; i++) s += x[i] * x[i];
  return x.length ? Math.sqrt(s / x.length) : 0;
}

/** Largest absolute sample. */
export function peak(x: ArrayLike<number>): number {
  let p = 0;
  for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > p) p = a; }
  return p;
}

/** Level in dB below full scale (dBFS). Silence is clamped to the floor (default -100). */
export const dbfs = (amp: number, floor = -100) => (amp > 0 ? Math.max(floor, 20 * Math.log10(amp)) : floor);

/** 0..1 position of a dBFS level on a meter that starts at `floor` dB. */
export const meterPos = (db: number, floor = -60) => Math.min(1, Math.max(0, (db - floor) / -floor));

/** Plain words for a microphone level (peak dBFS over the last second or so). */
export function micVerdict(peakDb: number): { level: 'none' | 'quiet' | 'good' | 'loud' | 'clip'; text: string } {
  if (peakDb <= -70) return { level: 'none', text: 'No sound is reaching the browser. Check the mute switch and the chosen microphone.' };
  if (peakDb < -36) return { level: 'quiet', text: 'Very quiet. Speak closer or turn the input volume up in your system settings.' };
  if (peakDb < -6) return { level: 'good', text: 'Good level for calls and recordings.' };
  if (peakDb < -0.5) return { level: 'loud', text: 'Loud but fine. Turn it down a little if your voice sounds harsh.' };
  return { level: 'clip', text: 'Clipping: the sound is too loud and gets cut off. Turn the input volume down.' };
}

/** Median of a list (copy is sorted, the input is untouched). */
export function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Events per second from a list of timestamps in ms (the median gap, so one slow frame does not spoil it). */
export function rateFromTimes(times: number[]): number {
  const gaps: number[] = [];
  for (let i = 1; i < times.length; i++) { const g = times[i] - times[i - 1]; if (g > 0) gaps.push(g); }
  const g = median(gaps);
  return g > 0 ? 1000 / g : 0;
}

/** Screen refresh rates people actually have, used to round a measured frame rate to the likely panel rate. */
export const COMMON_HZ = [30, 48, 50, 60, 72, 75, 85, 90, 100, 120, 144, 165, 170, 180, 200, 240, 280, 360, 480, 500];
export function nearestHz(hz: number): number {
  let best = 0, d = Infinity;
  for (const h of COMMON_HZ) { const e = Math.abs(h - hz); if (e < d) { d = e; best = h; } }
  return d <= Math.max(2, best * 0.04) ? best : Math.round(hz);
}

/** Mouse report (polling) rate: count of moves in each whole second, the highest steady figure, rounded to a usual rate. */
export const POLL_RATES = [60, 125, 250, 500, 1000, 2000, 4000, 8000];
export function pollingRate(times: number[]): { hz: number; likely: number } {
  if (times.length < 10) return { hz: 0, likely: 0 };
  const hz = rateFromTimes(times);
  let likely = 0, d = Infinity;
  for (const r of POLL_RATES) { const e = Math.abs(Math.log(r / hz)); if (e < d) { d = e; likely = r; } }
  return { hz: Math.round(hz), likely: d < 0.2 ? likely : 0 };
}

/** Largest number of keys held at once seen so far (key rollover), given each keydown/keyup in order. */
export function rollover(events: { code: string; down: boolean }[]): number {
  const held = new Set<string>(); let max = 0;
  for (const e of events) { if (e.down) held.add(e.code); else held.delete(e.code); max = Math.max(max, held.size); }
  return max;
}

/** Stick drift: how far from centre a resting stick reads, and whether it passes a dead zone. */
export function stickDrift(x: number, y: number, deadzone = 0.1): { r: number; drifting: boolean } {
  const r = Math.hypot(x, y);
  return { r, drifting: r > deadzone };
}

/** Battery time left from two readings (level 0..1 at time t in ms). Returns minutes, or null when it is not changing. */
export function batteryEta(a: { level: number; t: number }, b: { level: number; t: number }, charging: boolean): number | null {
  const dl = b.level - a.level, dt = (b.t - a.t) / 60000;
  if (dt <= 0 || dl === 0) return null;
  const rate = dl / dt; // level per minute
  if (charging && rate > 0) return (1 - b.level) / rate;
  if (!charging && rate < 0) return b.level / -rate;
  return null;
}

/** Tilt from gravity (accelerometer including gravity, m/s²), in degrees: x leans left-right, y leans front-back. Flat = 0, 0. */
export function tiltFromGravity(x: number, y: number, z: number): { x: number; y: number } {
  const deg = 180 / Math.PI;
  return { x: Math.atan2(x, Math.hypot(y, z)) * deg, y: Math.atan2(y, Math.hypot(x, z)) * deg };
}

/** Compass heading 0..360 from DeviceOrientation alpha (counter-clockwise from north) or iOS webkitCompassHeading. */
export const headingFromAlpha = (alpha: number) => ((360 - alpha) % 360 + 360) % 360;
export function compassPoint(deg: number): string {
  const pts = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return pts[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

/** MIDI note number to name, middle C (60) = C4. */
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const noteName = (n: number) => NOTES[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1);

/** Read a raw MIDI message into words. */
export function midiMessage(d: ArrayLike<number>): { kind: string; ch: number; text: string } {
  const st = d[0] ?? 0, ch = (st & 15) + 1, a = d[1] ?? 0, b = d[2] ?? 0;
  switch (st & 0xf0) {
    case 0x90: return b ? { kind: 'note-on', ch, text: `Note on ${noteName(a)} (${a}), velocity ${b}` } : { kind: 'note-off', ch, text: `Note off ${noteName(a)} (${a})` };
    case 0x80: return { kind: 'note-off', ch, text: `Note off ${noteName(a)} (${a})` };
    case 0xb0: return { kind: 'cc', ch, text: `Control ${a} = ${b}` };
    case 0xc0: return { kind: 'program', ch, text: `Program change ${a + 1}` };
    case 0xe0: return { kind: 'pitch', ch, text: `Pitch bend ${((b << 7) | a) - 8192}` };
    case 0xd0: return { kind: 'pressure', ch, text: `Channel pressure ${a}` };
    case 0xa0: return { kind: 'aftertouch', ch, text: `Aftertouch ${noteName(a)} = ${b}` };
  }
  if (st === 0xf8) return { kind: 'clock', ch: 0, text: 'Clock' };
  if (st === 0xfa) return { kind: 'start', ch: 0, text: 'Start' };
  if (st === 0xfc) return { kind: 'stop', ch: 0, text: 'Stop' };
  if (st === 0xf0) return { kind: 'sysex', ch: 0, text: `System exclusive, ${d.length} bytes` };
  return { kind: 'other', ch: 0, text: `Other (${Array.from(d).map((x) => x.toString(16).padStart(2, '0')).join(' ')})` };
}

/** Camera resolution name, e.g. 1920×1080 → "1080p (Full HD)". */
export function resolutionName(w: number, h: number): string {
  const s = Math.min(w, h);
  if (s >= 2160) return '4K (2160p)';
  if (s >= 1440) return '1440p (QHD)';
  if (s >= 1080) return '1080p (Full HD)';
  if (s >= 720) return '720p (HD)';
  if (s >= 480) return '480p (SD)';
  return `${s}p (low)`;
}

/** Aspect ratio as small whole numbers, e.g. 1920×1080 → "16:9". */
export function aspect(w: number, h: number): string {
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const k = g(w, h) || 1; let a = w / k, b = h / k;
  if (a === 8 && b === 5) return '16:10';
  if (a > 50) { const known = [[16, 9], [16, 10], [4, 3], [3, 2], [21, 9], [5, 4], [1, 1], [9, 16], [3, 4], [9, 19.5]]; const r = w / h; let best = known[0], d = Infinity; for (const q of known) { const e = Math.abs(q[0] / q[1] - r); if (e < d) { d = e; best = q; } } if (d < 0.02) [a, b] = best; else return (w / h).toFixed(2) + ':1'; }
  return `${a}:${b}`;
}

/** Pixels per inch from the resolution and the diagonal size in inches. */
export const ppi = (w: number, h: number, inches: number) => (inches > 0 ? Math.hypot(w, h) / inches : 0);

/** Touch grid coverage: which cells of a cols×rows grid were touched, given points in 0..1 page space. */
export function gridCoverage(points: { x: number; y: number }[], cols: number, rows: number): { hit: boolean[]; share: number } {
  const hit = new Array(cols * rows).fill(false);
  for (const p of points) {
    const c = Math.min(cols - 1, Math.max(0, Math.floor(p.x * cols))), r = Math.min(rows - 1, Math.max(0, Math.floor(p.y * rows)));
    hit[r * cols + c] = true;
  }
  return { hit, share: hit.filter(Boolean).length / hit.length };
}

/** Vibration pattern from text like "200, 100, 200" (ms on, off, on ...), capped to what browsers accept. */
export function parsePattern(s: string): number[] {
  return s.split(/[\s,;]+/).filter(Boolean).map(Number).filter((n) => Number.isFinite(n) && n >= 0).map((n) => Math.min(10000, Math.round(n))).slice(0, 50);
}
export const patternLength = (p: number[]) => p.reduce((a, b) => a + b, 0);
