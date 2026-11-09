// Ethogram session analysis (plain maths, no DOM). States are mutually exclusive and last until the next
// state starts or a stop; point events have no duration. Gives time budgets, bout counts and bout durations,
// event counts and rates.

export type Kind = 'state' | 'event';
export type Behaviour = { key: string; name: string; kind: Kind };
/** One logged entry, t in seconds from the start of the session. kind 'stop' ends the running state. */
export type Entry = { t: number; name: string; kind: Kind | 'stop' };
export type Bout = { name: string; start: number; end: number };

export type StateStats = { name: string; total: number; share: number; bouts: number; mean: number; median: number; min: number; max: number };
export type EventStats = { name: string; count: number; perMin: number };
export type Analysis = { length: number; scored: number; unscored: number; bouts: Bout[]; states: StateStats[]; events: EventStats[]; transitions: number };

/** Parse an ethogram written one behaviour per line: key, name, kind (state or event), separated by commas, tabs or 2+ spaces. */
export function parseEthogram(text: string): Behaviour[] {
  const out: Behaviour[] = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const l = line.trim();
    if (!l || l.startsWith('#')) return;
    const parts = l.split(/\s*[,\t;]\s*|\s{2,}/).filter(Boolean);
    if (parts.length < 2) throw new Error(`Line ${i + 1}: write a key, a name and "state" or "event", such as "F, Foraging, state".`);
    const key = parts[0].toLowerCase(), kindTxt = (parts.length > 2 ? parts[parts.length - 1] : 'state').toLowerCase();
    const name = (parts.length > 2 ? parts.slice(1, -1) : parts.slice(1)).join(' ');
    if (!/^[a-z0-9]$/.test(key)) throw new Error(`Line ${i + 1}: the key must be one letter or digit (found "${parts[0]}").`);
    if (!/^(state|event|point|point event)$/.test(kindTxt)) throw new Error(`Line ${i + 1}: the type must be "state" or "event" (found "${kindTxt}").`);
    out.push({ key, name, kind: kindTxt === 'state' ? 'state' : 'event' });
  });
  const keys = new Set<string>(), names = new Set<string>();
  for (const b of out) {
    if (keys.has(b.key)) throw new Error(`The key "${b.key.toUpperCase()}" is used twice.`);
    if (names.has(b.name.toLowerCase())) throw new Error(`"${b.name}" is listed twice.`);
    keys.add(b.key); names.add(b.name.toLowerCase());
  }
  if (out.length > 36) throw new Error('Up to 36 behaviours, one per letter or digit.');
  return out;
}

/** Bouts of states from a log: each state runs until the next state, a stop, or the end of the session. */
export function bouts(log: Entry[], end: number): Bout[] {
  const s = [...log].sort((a, b) => a.t - b.t), out: Bout[] = [];
  let cur: Bout | null = null;
  for (const e of s) {
    if (e.kind === 'event') continue;
    if (cur) { cur.end = e.t; if (cur.end > cur.start) out.push(cur); cur = null; }
    if (e.kind === 'state') cur = { name: e.name, start: e.t, end: e.t };
  }
  if (cur) { cur.end = Math.max(cur.start, end); if (cur.end > cur.start) out.push(cur); }
  return out;
}

const median = (v: number[]) => { if (!v.length) return NaN; const s = [...v].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** Time budget (share of the session), bouts and events. Behaviours listed but never seen are reported with zeros. */
export function analyse(log: Entry[], end: number, ethogram: Behaviour[] = []): Analysis {
  const bs = bouts(log, end), length = Math.max(0, end);
  const stateNames = [...new Set([...ethogram.filter((b) => b.kind === 'state').map((b) => b.name), ...bs.map((b) => b.name)])];
  const eventNames = [...new Set([...ethogram.filter((b) => b.kind === 'event').map((b) => b.name), ...log.filter((e) => e.kind === 'event').map((e) => e.name)])];
  const states = stateNames.map((name) => {
    const d = bs.filter((b) => b.name === name).map((b) => b.end - b.start), total = d.reduce((a, b) => a + b, 0);
    return { name, total, share: length > 0 ? total / length : NaN, bouts: d.length, mean: d.length ? total / d.length : NaN, median: median(d), min: d.length ? Math.min(...d) : NaN, max: d.length ? Math.max(...d) : NaN };
  });
  const events = eventNames.map((name) => { const count = log.filter((e) => e.kind === 'event' && e.name === name).length; return { name, count, perMin: length > 0 ? (count / length) * 60 : NaN }; });
  const scored = states.reduce((a, s) => a + s.total, 0);
  let transitions = 0;
  for (let i = 1; i < bs.length; i++) if (bs[i].start === bs[i - 1].end && bs[i].name !== bs[i - 1].name) transitions++;
  return { length, scored, unscored: Math.max(0, length - scored), bouts: bs, states, events, transitions };
}

/** Seconds as m:ss.s (or h:mm:ss). */
export function clock(t: number, tenths = true): string {
  const s = Math.max(0, t), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  const sec = tenths ? (Math.floor(r * 10) / 10).toFixed(1).padStart(4, '0') : String(Math.floor(r)).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}
