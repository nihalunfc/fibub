// Protocol timer: multi-step protocols (named steps with durations) and timers that run them. Plain TypeScript, no
// DOM. A running timer stores only timestamps (when the current step started, when it was paused), never a
// counter that ticks, so it stays right when the browser tab sleeps in the background or the page is reloaded.

export type Step = { name: string; sec: number };
export type Protocol = { id: string; name: string; steps: Step[]; auto: boolean };
export type Run = {
  id: string;
  name: string;
  steps: Step[];
  auto: boolean;          // true: the next step starts by itself; false: wait for "Next step"
  idx: number;            // current step
  t0: number;             // ms timestamp when the current step started (moved forward by pauses)
  paused: number | null;  // ms timestamp when paused, or null while running
  waiting: boolean;       // the current step has finished and the run waits for the user (auto = false)
  done: boolean;
  endedAt: number | null; // ms timestamp when the last step finished
  startedAt: number;
};
export type Event = { kind: 'step' | 'end'; run: string; idx: number; at: number; name: string; next: string };

/**
 * A duration as people write it, in seconds. "5" or "5 min" = 5 minutes; "90 s", "1.5 h", "1 h 30 min", "2h30m",
 * "1:30" (minutes:seconds), "1:30:00" (hours:minutes:seconds), "overnight" is not accepted. NaN if unreadable.
 */
export function parseDuration(s: string): number {
  const t = (s ?? '').trim().toLowerCase().replace(',', '.');
  if (!t) return NaN;
  let m;
  if ((m = /^(\d+):([0-5]?\d)$/.exec(t))) return +m[1] * 60 + +m[2];
  if ((m = /^(\d+):([0-5]?\d):([0-5]?\d)$/.exec(t))) return +m[1] * 3600 + +m[2] * 60 + +m[3];
  if (/^\d+(\.\d+)?$/.test(t)) return Math.round(Number(t) * 60);
  const unit: Record<string, number> = { h: 3600, hr: 3600, hrs: 3600, hour: 3600, hours: 3600, m: 60, min: 60, mins: 60, minute: 60, minutes: 60, s: 1, sec: 1, secs: 1, second: 1, seconds: 1, d: 86400, day: 86400, days: 86400 };
  const re = /(\d+(?:\.\d+)?)\s*([a-z]+)/g;
  let total = 0, used = '';
  while ((m = re.exec(t))) {
    if (!(m[2] in unit)) return NaN;
    total += Number(m[1]) * unit[m[2]];
    used += m[0];
  }
  if (!used || t.replace(/\s+/g, '') !== used.replace(/\s+/g, '')) return NaN;
  return Math.round(total);
}

/** Seconds as a clock: 5:00, 1:02:03 (rounded up, so a timer never shows 0:00 while time is left). */
export function clock(sec: number): string {
  const s = Math.max(0, Math.ceil(sec - 1e-9));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
}
/** Seconds in words for step lists: "5 min", "1 h 30 min", "45 s". */
export function words(sec: number): string {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
  return [h ? `${h} h` : '', m ? `${m} min` : '', s ? `${s} s` : ''].filter(Boolean).join(' ') || '0 s';
}

/** Steps from text, one per line: "name, duration" (also tab, | or " - " before the duration). */
export function parseSteps(text: string): { steps: Step[]; errors: string[] } {
  const steps: Step[] = [], errors: string[] = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((line, i) => {
    const l = line.trim();
    if (!l || l.startsWith('#')) return;
    const m = /^(.*?)\s*(?:,|\t|\||\s-\s|;)\s*([^,\t|;]+)$/.exec(l);
    const sec = m ? parseDuration(m[2]) : NaN;
    if (!m || !Number.isFinite(sec)) { errors.push(`Line ${i + 1} ("${l}"): write the step name, a comma, then the time, such as "Wash, 5 min".`); return; }
    if (sec <= 0) { errors.push(`Line ${i + 1}: the time must be more than 0.`); return; }
    if (sec > 7 * 86400) { errors.push(`Line ${i + 1}: at most 7 days per step.`); return; }
    steps.push({ name: m[1].trim() || `Step ${steps.length + 1}`, sec });
  });
  return { steps, errors };
}
export const stepsText = (steps: Step[]) => steps.map((s) => `${s.name}, ${words(s.sec)}`).join('\n');
export const total = (steps: Step[]) => steps.reduce((a, s) => a + s.sec, 0);

export function start(p: { name: string; steps: Step[]; auto: boolean }, now: number, id: string): Run {
  return { id, name: p.name, steps: p.steps.map((s) => ({ ...s })), auto: p.auto, idx: 0, t0: now, paused: null, waiting: false, done: false, endedAt: null, startedAt: now };
}

/**
 * Bring a run up to `now`: finish every step whose time is up (several at once if the tab slept), and return the
 * alarms that fell due, each with the moment it fell due. Does not change the run passed in.
 */
export function advance(run: Run, now: number): { run: Run; events: Event[] } {
  const r: Run = { ...run };
  const events: Event[] = [];
  if (r.done || r.waiting || r.paused !== null) return { run: r, events };
  for (;;) {
    const end = r.t0 + Math.round(r.steps[r.idx].sec * 1000);
    if (now < end) break;
    const last = r.idx === r.steps.length - 1;
    events.push({ kind: last ? 'end' : 'step', run: r.id, idx: r.idx, at: end, name: r.steps[r.idx].name, next: last ? '' : r.steps[r.idx + 1].name });
    if (last) { r.done = true; r.endedAt = end; break; }
    if (!r.auto) { r.waiting = true; break; }
    r.idx++; r.t0 = end;
  }
  return { run: r, events };
}

export type View = { idx: number; left: number; elapsed: number; over: number; runLeft: number; finishAt: number | null };
/** What to show for a run at `now` (seconds): time left in the step, time over (while waiting), time left in all. */
export function view(run: Run, now: number): View {
  const t = run.paused ?? now;
  const dur = run.steps[run.idx].sec;
  const elapsed = run.done ? dur : Math.max(0, (t - run.t0) / 1000);
  const left = run.done ? 0 : Math.max(0, dur - elapsed);
  const over = run.waiting ? Math.max(0, (t - run.t0) / 1000 - dur) : 0;
  const rest = run.steps.slice(run.idx + 1).reduce((a, s) => a + s.sec, 0);
  const runLeft = run.done ? 0 : left + rest;
  const finishAt = run.done ? run.endedAt : run.paused !== null || !run.auto ? null : now + runLeft * 1000;
  return { idx: run.idx, left, elapsed, over, runLeft, finishAt };
}

export const pause = (r: Run, now: number): Run => (r.paused !== null || r.done || r.waiting ? r : { ...r, paused: now });
export const resume = (r: Run, now: number): Run => (r.paused === null ? r : { ...r, t0: r.t0 + (now - r.paused), paused: null });
/** Go on to the next step now (after a wait, or to skip the rest of this one). */
export function next(r: Run, now: number): Run {
  if (r.done) return r;
  if (r.idx === r.steps.length - 1) return { ...r, done: true, waiting: false, paused: null, endedAt: now };
  return { ...r, idx: r.idx + 1, t0: now, paused: r.paused !== null ? now : null, waiting: false };
}
/** Start the current step again from its full time. */
export const restartStep = (r: Run, now: number): Run => (r.done ? r : { ...r, t0: now, paused: r.paused !== null ? now : null, waiting: false });
/**
 * Add (or take away) time on the current step. Taking away never leaves less than 1 s, so the step keeps running.
 * On a finished step that is waiting for you, the added time counts from now (the step's length grows by that much).
 */
export function addTime(r: Run, sec: number, now: number): Run {
  if (r.done) return r;
  const steps = r.steps.map((s) => ({ ...s }));
  const elapsed = ((r.paused ?? now) - r.t0) / 1000;
  if (r.waiting) {
    if (sec <= 0) return r;
    const t = r.paused ?? now;
    steps[r.idx].sec += sec;
    return { ...r, steps, waiting: false, t0: t - r.steps[r.idx].sec * 1000 };
  }
  steps[r.idx].sec = sec >= 0 ? steps[r.idx].sec + sec : Math.max(steps[r.idx].sec + sec, elapsed + 1);
  return { ...r, steps };
}

export const randomId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Made-up example protocols (generic lab routines; change the times to your own method). */
export const EXAMPLES: Protocol[] = [
  { id: 'ex-blot', name: 'Western blot washes and antibodies (example)', auto: false, steps: [
    { name: 'Block', sec: 3600 }, { name: 'Primary antibody', sec: 3600 }, { name: 'Wash 1', sec: 300 }, { name: 'Wash 2', sec: 300 }, { name: 'Wash 3', sec: 300 },
    { name: 'Secondary antibody', sec: 3600 }, { name: 'Wash 1', sec: 300 }, { name: 'Wash 2', sec: 300 }, { name: 'Wash 3', sec: 300 }] },
  { id: 'ex-stain', name: 'Gel staining (example)', auto: true, steps: [{ name: 'Fix', sec: 900 }, { name: 'Stain', sec: 1800 }, { name: 'Destain', sec: 1200 }] },
  { id: 'ex-tea', name: 'Quick test: three short steps', auto: true, steps: [{ name: 'Mix', sec: 10 }, { name: 'Spin', sec: 20 }, { name: 'Read', sec: 10 }] },
];

/** Check a JSON file of protocols (an export from this page) and return them. Throws with a plain message. */
export function fromJson(text: string): Protocol[] {
  let d: unknown;
  try { d = JSON.parse(text); } catch { throw new Error('This file is not valid JSON.'); }
  const arr = Array.isArray(d) ? d : (d as { protocols?: unknown })?.protocols;
  if (!Array.isArray(arr)) throw new Error('This JSON file has no list of protocols (expected { "protocols": [...] }).');
  const out: Protocol[] = [];
  for (const x of arr) {
    if (!x || typeof x !== 'object') continue;
    const p = x as Record<string, unknown>;
    const steps = Array.isArray(p.steps) ? p.steps.map((s) => ({ name: String((s as Step)?.name ?? '').trim(), sec: Math.round(Number((s as Step)?.sec)) })).filter((s) => s.name && s.sec > 0 && s.sec <= 7 * 86400) : [];
    if (!steps.length) continue;
    out.push({ id: typeof p.id === 'string' && p.id ? p.id : randomId(), name: String(p.name ?? 'Protocol').trim() || 'Protocol', steps, auto: p.auto !== false });
  }
  if (!out.length) throw new Error('No protocols with steps were found in this file.');
  return out;
}
export const toJson = (list: Protocol[]) => JSON.stringify({ app: 'fibub protocol timer', version: 1, protocols: list }, null, 1);
