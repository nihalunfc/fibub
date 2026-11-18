// Gig helpers: safe listening time, soundcheck lists, setlist timing, release dates. Plain TypeScript, no DOM.

// ---- Hearing: allowed time at a level -------------------------------------------------------
// T = 8 h / 2^((L - Lc) / q). NIOSH 1998: Lc 85 dB(A), q 3. OSHA 29 CFR 1910.95: Lc 90 dB(A), q 5.
export type Rule = 'niosh' | 'osha';
export const RULES: Record<Rule, { label: string; lc: number; q: number }> = {
  niosh: { label: 'NIOSH: 85 dB(A) for 8 hours, 3 dB exchange', lc: 85, q: 3 },
  osha: { label: 'OSHA: 90 dB(A) for 8 hours, 5 dB exchange', lc: 90, q: 5 },
};
export const allowedHours = (level: number, rule: Rule): number => 8 / Math.pow(2, (level - RULES[rule].lc) / RULES[rule].q);
/** Dose in per cent for a time spent at one level. */
export const dosePct = (level: number, hours: number, rule: Rule): number => (hours / allowedHours(level, rule)) * 100;
/** Level you actually receive with plugs: (NRR - 7) x 0.5 off, never below zero. */
export const plugReduction = (nrr: number): number => Math.max(0, (nrr - 7) * 0.5);
export const levelWithPlugs = (level: number, nrr: number): number => level - plugReduction(nrr);

export function fmtHours(h: number): string {
  if (!isFinite(h)) return 'no limit';
  const sec = Math.round(h * 3600);
  if (sec >= 86400 * 2) return 'more than 2 days';
  const hh = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60;
  if (hh > 0) return `${hh} h ${String(mm).padStart(2, '0')} min`;
  if (mm > 0) return `${mm} min ${String(ss).padStart(2, '0')} s`;
  return `${ss} s`;
}

// ---- Soundcheck list -------------------------------------------------------------------------
export interface CheckItem { id: string; text: string; done: boolean }
export interface CheckGroup { id: string; title: string; items: CheckItem[] }
const G = (id: string, title: string, items: string[]): CheckGroup => ({ id, title, items: items.map((text, i) => ({ id: `${id}${i}`, text, done: false })) });
export const defaultGroups = (): CheckGroup[] => [
  G('arrive', 'Arrive and load in', ['Meet the venue contact and ask who looks after the sound', 'Check where the booth is and where you can park or unload', 'Confirm your set time and the changeover time', 'Find the power switch for the booth']),
  G('power', 'Power and cables', ['Plug into a power strip with a surge guard', 'Tape or tidy cables so nobody trips', 'Pack spare cables and adaptors (RCA, jack, XLR)', 'Keep a spare USB stick and a charged phone']),
  G('gear', 'Mixer and players', ['Set up players and mixer, and connect them', 'Turn all channel gains, EQs and effects to neutral', 'Check each channel plays and shows level', 'Load your music and check it is found on every player', 'Set the master level where the venue asks']),
  G('booth', 'Booth monitor', ['Turn the booth monitor up only as far as you need', 'Check you can hear the kick and the bass clearly', 'Put in your earplugs if you use them']),
  G('pa', 'Main PA', ['Play a loud, familiar track and walk the room', 'Keep channel peaks out of the red and the master below the red', 'Ask the sound person if the system limiter is working', 'Check the low end is clear and nothing rattles or buzzes', 'Agree who can change the PA level during the night']),
  G('rec', 'Recording', ['Check the record input is not clipping', 'Make sure you have storage space and a charged recorder', 'Do a short test recording and play it back']),
  G('after', 'After the set', ['Pack your own gear and check nothing is left behind', 'Collect your fee and any receipts', 'Thank the staff and say when you could play again', 'Note anything to fix next time']),
];
export function progress(groups: CheckGroup[]): { done: number; total: number; pct: number } {
  let done = 0, total = 0;
  for (const g of groups) for (const i of g.items) { total++; if (i.done) done++; }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
export function listText(groups: CheckGroup[], venue: string, date: string): string {
  const out: string[] = [`Soundcheck list${venue ? ' for ' + venue : ''}${date ? ', ' + date : ''}`, ''];
  for (const g of groups) { out.push(g.title); for (const i of g.items) out.push(`[${i.done ? 'x' : ' '}] ${i.text}`); out.push(''); }
  const p = progress(groups); out.push(`${p.done} of ${p.total} done`);
  return out.join('\n');
}

// ---- Setlist ---------------------------------------------------------------------------------
export interface SetRow { title: string; artist: string; bpm: string; key: string; notes: string; len: string }
export function parseLen(t: string): number {
  const s = t.trim(); if (!s) return 0;
  const m = s.match(/^(\d+):([0-5]?\d)$/); if (m) return +m[1] * 60 + +m[2];
  const n = Number(s); return isFinite(n) && n > 0 ? Math.round(n * 60) : 0; // plain number = minutes
}
export function fmtLen(sec: number): string {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
export const setTotal = (rows: SetRow[]) => rows.reduce((a, r) => a + parseLen(r.len), 0);
/** Move a row up or down; returns a new array. */
export function moveRow<T>(a: T[], from: number, to: number): T[] {
  if (to < 0 || to >= a.length || from === to) return a.slice();
  const b = a.slice(); const [x] = b.splice(from, 1); b.splice(to, 0, x); return b;
}
export function setStarts(rows: SetRow[]): number[] { let t = 0; return rows.map((r) => { const s = t; t += parseLen(r.len); return s; }); }

// ---- Release checklist -----------------------------------------------------------------------
export interface RelItem { id: string; text: string; days: number; group: string }
// Days before (negative) or after (positive) release day. Suggestions, not rules; each can be edited.
export const REL_ITEMS: RelItem[] = [
  { id: 'master', group: 'Prepare', days: -42, text: 'Master ready and approved (final WAV, checked on more than one speaker)' },
  { id: 'art', group: 'Prepare', days: -42, text: 'Cover artwork ready (check your distributor for the size and file type it asks for)' },
  { id: 'codes', group: 'Prepare', days: -35, text: 'ISRC for each track and UPC/EAN for the release (your distributor can assign them)' },
  { id: 'meta', group: 'Prepare', days: -35, text: 'Metadata written: titles, artist names, writers, producers, genre, language' },
  { id: 'split', group: 'Prepare', days: -35, text: 'Split sheet signed by everyone who wrote or produced the tracks' },
  { id: 'upload', group: 'Deliver', days: -28, text: 'Upload to your distributor and set the release date' },
  { id: 'pitch', group: 'Deliver', days: -14, text: 'Pitch your next release to the editorial playlist team, at least 7 days before release day' },
  { id: 'presave', group: 'Promote', days: -14, text: 'Pre-save or pre-order link made and shared' },
  { id: 'promo', group: 'Promote', days: -7, text: 'Promo posts, preview clips and messages to blogs, radio and DJs sent' },
  { id: 'check', group: 'Promote', days: -1, text: 'Check the release is approved and the links work' },
  { id: 'day', group: 'Release day', days: 0, text: 'Release day: share the links, post, thank people, play it out' },
  { id: 'after1', group: 'After release', days: 1, text: 'Check it is live on every service and the credits are right' },
  { id: 'after2', group: 'After release', days: 7, text: 'Share first results, send thank-you messages, ask for playlist adds' },
  { id: 'after3', group: 'After release', days: 30, text: 'Look at your stats and write down what worked for next time' },
];
const pad = (n: number) => String(n).padStart(2, '0');
/** Date text YYYY-MM-DD plus n days, in UTC so time zones cannot shift it. */
export function addDays(iso: string, n: number): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/); if (!m) return '';
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + n));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
export function dayName(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/); if (!m) return '';
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay()];
}
const icsEsc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
/** All-day events. DTEND is the next day (it is exclusive). */
export function toIcs(events: { id: string; date: string; text: string }[], stamp = '20261118T000000Z'): string {
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//fibub//release checklist//EN', 'CALSCALE:GREGORIAN'];
  for (const e of events) {
    if (!e.date) continue;
    L.push('BEGIN:VEVENT', `UID:${e.id}-${e.date}@fibub.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${addDays(e.date, 1).replace(/-/g, '')}`, `SUMMARY:${icsEsc(e.text)}`, 'END:VEVENT');
  }
  L.push('END:VCALENDAR');
  return L.join('\r\n') + '\r\n';
}
export function csvCell(v: string | number): string { const s = String(v); return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
export const toCsv = (rows: (string | number)[][]) => rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
