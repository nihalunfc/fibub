// Field notes: entries with date, place, people (pseudonyms) and tags; search, counts, and export to
// Markdown, CSV and JSON, with JSON import. Plain TypeScript, no DOM.

export type Note = { id: string; date: string; place: string; people: string[]; tags: string[]; text: string };
export const FORMAT = 'fibub-field-notes';

/** "a, b; c" → ['a', 'b', 'c'], trimmed, empty parts and repeats (ignoring case) dropped. */
export function list(s: string): string[] {
  const out: string[] = [], seen = new Set<string>();
  for (const p of s.split(/[,;\n]/)) { const t = p.trim().replace(/^#/, '').replace(/\s+/g, ' '); if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); out.push(t); } }
  return out;
}

export const validDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d + 'T00:00:00Z')) && new Date(d + 'T00:00:00Z').toISOString().slice(0, 10) === d;

/** Newest first; notes on the same day keep their order. */
export const sortNotes = (n: Note[]) => n.map((x, i) => ({ x, i })).sort((a, b) => (a.x.date < b.x.date ? 1 : a.x.date > b.x.date ? -1 : a.i - b.i)).map((p) => p.x);

export type Filter = { q?: string; tag?: string; person?: string; place?: string; from?: string; to?: string };
/** Notes matching every word of q (in text, place, people or tags) and each chosen tag, person, place and date range. */
export function filterNotes(notes: Note[], f: Filter): Note[] {
  const words = (f.q ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  const eq = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
  return notes.filter((n) => {
    if (f.tag && !n.tags.some((t) => eq(t, f.tag!))) return false;
    if (f.person && !n.people.some((p) => eq(p, f.person!))) return false;
    if (f.place && !eq(n.place, f.place)) return false;
    if (f.from && n.date < f.from) return false;
    if (f.to && n.date > f.to) return false;
    if (words.length) { const hay = [n.text, n.place, ...n.people, ...n.tags].join(' \n ').toLowerCase(); if (!words.every((w) => hay.includes(w))) return false; }
    return true;
  });
}

/** How many notes carry each tag (or person, or place), most first, then A to Z. Case is merged; the first spelling is kept. */
export function counts(notes: Note[], key: 'tags' | 'people' | 'place'): [string, number][] {
  const m = new Map<string, [string, number]>();
  for (const n of notes) {
    const vals = key === 'place' ? (n.place ? [n.place] : []) : n[key];
    for (const v of new Set(vals.map((x) => x))) { const k = v.toLowerCase(); const r = m.get(k); if (r) r[1]++; else m.set(k, [v, 1]); }
  }
  return [...m.values()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'en', { sensitivity: 'base' }));
}

// ---------- export ----------
export function toMarkdown(notes: Note[], title = 'Field notes'): string {
  const out = [`# ${title}`, ''];
  for (const n of notes) {
    out.push(`## ${n.date}${n.place ? ' · ' + n.place : ''}`, '');
    if (n.people.length) out.push(`**People:** ${n.people.join(', ')}  `);
    if (n.tags.length) out.push(`**Tags:** ${n.tags.map((t) => '#' + t.replace(/\s+/g, '-')).join(' ')}  `);
    if (n.people.length || n.tags.length) out.push('');
    out.push(n.text.trim(), '');
  }
  return out.join('\n');
}

const cell = (s: string) => (/[",\n\r]/.test(s) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
/** CSV with a header row; people and tags joined by "; ". */
export function toCsv(notes: Note[]): string {
  const rows = [['date', 'place', 'people', 'tags', 'text'], ...notes.map((n) => [n.date, n.place, n.people.join('; '), n.tags.join('; '), n.text])];
  return rows.map((r) => r.map(cell).join(',')).join('\r\n') + '\r\n';
}

export function toJson(notes: Note[]): string {
  return JSON.stringify({ format: FORMAT, version: 1, notes: notes.map(({ id, date, place, people, tags, text }) => ({ id, date, place, people, tags, text })) }, null, 2) + '\n';
}

/**
 * Notes from a JSON file made by this tool (or a plain array of notes). Bad entries are skipped and described.
 * `newId` gives an id to entries without one.
 */
export function fromJson(text: string, newId: () => string): { notes: Note[]; skipped: string[] } {
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw new Error('This file is not valid JSON. Choose a .json file exported from this tool.'); }
  const arr = Array.isArray(data) ? data : data && typeof data === 'object' && Array.isArray((data as { notes?: unknown }).notes) ? (data as { notes: unknown[] }).notes : null;
  if (!arr) throw new Error('No notes found: the file should have a "notes" list, as the JSON export from this tool does.');
  const notes: Note[] = [], skipped: string[] = [];
  const strs = (v: unknown) => (Array.isArray(v) ? list(v.filter((x) => typeof x === 'string').join(',')) : typeof v === 'string' ? list(v) : []);
  arr.forEach((r, i) => {
    if (!r || typeof r !== 'object') { skipped.push(`Entry ${i + 1} is not a note.`); return; }
    const o = r as Record<string, unknown>;
    const date = typeof o.date === 'string' ? o.date.trim().slice(0, 10) : '';
    if (!validDate(date)) { skipped.push(`Entry ${i + 1} has no valid date (YYYY-MM-DD).`); return; }
    const text = typeof o.text === 'string' ? o.text : '';
    notes.push({ id: typeof o.id === 'string' && o.id ? o.id : newId(), date, place: typeof o.place === 'string' ? o.place.trim() : '', people: strs(o.people), tags: strs(o.tags), text });
  });
  return { notes, skipped };
}

/** Add imported notes, skipping any with the same id or the same date, place and text as one already there. */
export function merge(have: Note[], incoming: Note[]): { notes: Note[]; added: number; dupes: number } {
  const ids = new Set(have.map((n) => n.id)), sig = new Set(have.map((n) => `${n.date}\u0000${n.place}\u0000${n.text}`));
  const out = [...have]; let added = 0, dupes = 0;
  for (const n of incoming) {
    const s = `${n.date}\u0000${n.place}\u0000${n.text}`;
    if (ids.has(n.id) || sig.has(s)) { dupes++; continue; }
    ids.add(n.id); sig.add(s); out.push(n); added++;
  }
  return { notes: out, added, dupes };
}
