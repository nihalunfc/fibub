// DJ set maths: beats, bars and phrases, set length planning, energy curves, drills and crowd-log summaries.
// Plain TypeScript, no DOM. Checked in tests/tools/*.mjs and by quick scripts.

export const beatSec = (bpm: number) => 60 / bpm;
export const barSec = (bpm: number, beatsPerBar = 4) => (60 / bpm) * beatsPerBar;
export const phraseSec = (bpm: number, bars: number, beatsPerBar = 4) => barSec(bpm, beatsPerBar) * bars;
export const secToBars = (sec: number, bpm: number, beatsPerBar = 4) => sec / barSec(bpm, beatsPerBar);
export const barsToSec = (bars: number, bpm: number, beatsPerBar = 4) => bars * barSec(bpm, beatsPerBar);

/** Seconds as m:ss (or h:mm:ss), rounded to the nearest second unless dec > 0. */
export function fmtTime(sec: number, dec = 0): string {
  if (!isFinite(sec)) return '-';
  const neg = sec < 0 ? '-' : '';
  let s = Math.abs(sec);
  const f = 10 ** dec;
  s = Math.round(s * f) / f;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  const rs = dec ? r.toFixed(dec).padStart(3 + dec, '0') : String(Math.floor(r)).padStart(2, '0');
  return neg + (h ? `${h}:${String(m).padStart(2, '0')}:${rs}` : `${m}:${rs}`);
}

/** "3:45", "1:02:03", "225" (seconds) or "3.5" -> seconds; NaN if unreadable. */
export function parseTime(text: string): number {
  const t = text.trim();
  if (!t) return NaN;
  const parts = t.split(':');
  if (parts.length > 3 || parts.some((p) => !/^\d+(\.\d+)?$/.test(p.trim()))) return NaN;
  return parts.reduce((a, p) => a * 60 + parseFloat(p), 0);
}

/** "21:30" -> minutes since midnight; NaN if unreadable. */
export function parseClock(text: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  if (!m || +m[1] > 23 || +m[2] > 59) return NaN;
  return +m[1] * 60 + +m[2];
}
export const fmtClock = (min: number) => {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/** Seconds from a cue time to the next phrase start (0 if the cue is exactly on one). */
export function timeToNextPhrase(bpm: number, cueSec: number, bars: number, beatsPerBar = 4): number {
  const p = phraseSec(bpm, bars, beatsPerBar);
  const r = ((cueSec % p) + p) % p;
  return r < 1e-9 || p - r < 1e-9 ? 0 : p - r;
}

/** Where a count of beats (0 based, from the downbeat) falls: beat 1..n, bar and phrase numbers (1 based). */
export function position(beatIndex: number, bars: number, beatsPerBar = 4) {
  const bar = Math.floor(beatIndex / beatsPerBar);
  return { beat: (beatIndex % beatsPerBar) + 1, bar: bar + 1, barInPhrase: (bar % bars) + 1, phrase: Math.floor(bar / bars) + 1, phraseStart: bar % bars === 0 && beatIndex % beatsPerBar === 0 };
}

// ---- Set planning ----
export type Slot = 'warmup' | 'peak' | 'closing' | 'allnight';
export const SLOTS: Record<Slot, { label: string; curve: string }> = {
  warmup: { label: 'Warm-up', curve: 'warmup' },
  peak: { label: 'Peak time', curve: 'peak' },
  closing: { label: 'Closing', curve: 'closing' },
  allnight: { label: 'All night', curve: 'journey' },
};

/** Tracks needed to fill a set. Each later track starts `overlap` seconds before the one before ends. */
export function tracksNeeded(setSec: number, trackSec: number, overlapSec: number): number {
  const step = trackSec - overlapSec;
  if (!(setSec > 0) || !(step > 0)) return 0;
  if (setSec <= trackSec) return 1;
  return Math.ceil((setSec - overlapSec) / step - 1e-9);
}
export const trackStarts = (n: number, trackSec: number, overlapSec: number) => Array.from({ length: n }, (_, i) => i * (trackSec - overlapSec));

export interface Pt { x: number; y: number } // x 0..1 along the set, y 1..10
export const PRESETS: Record<string, { label: string; pts: Pt[] }> = {
  warmup: { label: 'Warm-up', pts: [{ x: 0, y: 2 }, { x: 0.35, y: 3 }, { x: 0.7, y: 4.5 }, { x: 1, y: 6 }] },
  peak: { label: 'Peak time', pts: [{ x: 0, y: 6 }, { x: 0.3, y: 8 }, { x: 0.6, y: 10 }, { x: 0.85, y: 9 }, { x: 1, y: 8 }] },
  closing: { label: 'Closing', pts: [{ x: 0, y: 8 }, { x: 0.3, y: 9 }, { x: 0.6, y: 7 }, { x: 0.85, y: 5 }, { x: 1, y: 3 }] },
  journey: { label: 'Journey', pts: [{ x: 0, y: 3 }, { x: 0.25, y: 6 }, { x: 0.5, y: 9 }, { x: 0.7, y: 6 }, { x: 0.85, y: 9 }, { x: 1, y: 4 }] },
};
export const clampE = (v: number) => Math.max(1, Math.min(10, v));

/** Energy (1..10) at position x (0..1), straight lines between the points. */
export function energyAt(pts: Pt[], x: number): number {
  if (!pts.length) return 5;
  const p = [...pts].sort((a, b) => a.x - b.x);
  if (x <= p[0].x) return p[0].y;
  for (let i = 1; i < p.length; i++) {
    if (x <= p[i].x) { const a = p[i - 1], b = p[i]; return b.x === a.x ? b.y : a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x); }
  }
  return p[p.length - 1].y;
}

/** Rule of thumb: a low-energy segment sits at the low end of your BPM range, a high one at the top. Range is +-8% of the span. */
export function bpmForEnergy(e: number, lo: number, hi: number) {
  const mid = lo + ((hi - lo) * (clampE(e) - 1)) / 9, w = (hi - lo) * 0.08 + 1;
  return { lo: Math.max(lo, Math.round(mid - w)), hi: Math.min(hi, Math.round(mid + w)) };
}

export interface Seg { from: number; to: number; energy: number; bpmLo: number; bpmHi: number; label: string }
export function segments(pts: Pt[], n: number, setSec: number, bpmLo: number, bpmHi: number): Seg[] {
  return Array.from({ length: n }, (_, i) => {
    const e = energyAt(pts, (i + 0.5) / n), r = bpmForEnergy(e, bpmLo, bpmHi);
    return { from: (setSec * i) / n, to: (setSec * (i + 1)) / n, energy: Math.round(e * 10) / 10, bpmLo: r.lo, bpmHi: r.hi, label: e < 4 ? 'Easy' : e < 7 ? 'Build' : 'High' };
  });
}

/** Pasted track list: one per line, optional trailing duration "m:ss" or "(m:ss)". */
export function parseTracks(text: string, defaultSec: number): { name: string; sec: number }[] {
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = /^(.*?)[\s,;|\t]*\(?(\d{1,3}:\d{2})\)?\s*$/.exec(l);
    const sec = m ? parseTime(m[2]) : NaN;
    return m && isFinite(sec) && m[1] ? { name: m[1].replace(/[\s\-]+$/, ''), sec } : { name: l, sec: defaultSec };
  });
}

export function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
export const toCsv = (rows: (string | number)[][]) => rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';

// ---- Transition drills ----
export interface Drill { id: string; label: string; bars: number; info: string }
export const DRILLS: Drill[] = [
  { id: 'ear', label: 'Beatmatch by ear', bars: 8, info: 'Start the new track, match speed by ear, hold the match for the whole count.' },
  { id: 'blend16', label: '16-bar blend', bars: 16, info: 'Bring the new track in and fade the old one out over 16 bars.' },
  { id: 'eq32', label: '32-bar EQ swap', bars: 32, info: 'Swap the bass between the tracks over 32 bars with the EQ, then fade out the old track.' },
  { id: 'cut', label: 'Quick cut', bars: 2, info: 'Cut to the new track on the first beat of a phrase.' },
  { id: 'echo', label: 'Echo out', bars: 8, info: 'Throw the old track into an echo, drop it out and start the new one on the phrase.' },
  { id: 'custom', label: 'Custom', bars: 16, info: 'Set your own number of bars.' },
];
/** Countdown plan: segments of `segBars` bars (the last may be shorter) covering `bars` bars. */
export function drillSegments(bars: number, segBars: number, bpm: number, beatsPerBar = 4) {
  const out: { startBar: number; bars: number; from: number; to: number }[] = [];
  for (let b = 0; b < bars; b += segBars) {
    const n = Math.min(segBars, bars - b);
    out.push({ startBar: b + 1, bars: n, from: barsToSec(b, bpm, beatsPerBar), to: barsToSec(b + n, bpm, beatsPerBar) });
  }
  return out;
}
export type Rating = 'clean' | 'ok' | 'trainwreck';
export const RATING_SCORE: Record<Rating, number> = { clean: 2, ok: 1, trainwreck: 0 };
export function drillStats(r: Rating[]) {
  let streak = 0, best = 0;
  for (const x of r) { streak = x === 'clean' ? streak + 1 : 0; best = Math.max(best, streak); }
  const avg = r.length ? r.reduce((a, x) => a + RATING_SCORE[x], 0) / r.length : 0;
  return { n: r.length, clean: r.filter((x) => x === 'clean').length, ok: r.filter((x) => x === 'ok').length, bad: r.filter((x) => x === 'trainwreck').length, avg: Math.round((avg / 2) * 100), bestStreak: best };
}

// ---- Crowd log ----
export interface LogEntry { t: number; e: number; track: string; note: string }
export function crowdSummary(log: LogEntry[]) {
  if (!log.length) return null;
  const peak = log.reduce((a, b) => (b.e > a.e ? b : a));
  const low = log.reduce((a, b) => (b.e < a.e ? b : a));
  const avg = log.reduce((a, b) => a + b.e, 0) / log.length;
  const by = new Map<string, number[]>();
  for (const l of log) if (l.track.trim()) (by.get(l.track.trim()) ?? by.set(l.track.trim(), []).get(l.track.trim())!).push(l.e);
  const tr = [...by].map(([name, v]) => ({ name, avg: v.reduce((a, b) => a + b, 0) / v.length, n: v.length }));
  const best = tr.length ? tr.reduce((a, b) => (b.avg > a.avg ? b : a)) : null;
  const worst = tr.length ? tr.reduce((a, b) => (b.avg < a.avg ? b : a)) : null;
  return { n: log.length, peak, low, avg: Math.round(avg * 10) / 10, best, worst };
}
