// Observing log entries and their CSV file. The CSV is the "database": one row per observation,
// so it opens in Excel, Google Sheets, Python or a database without any conversion.
export type Entry = {
  id: string; utc: string; date: string; time: string; object: string; type: string; con: string; ra: string; dec: string;
  place: string; lat: string; lon: string; scope: string; optics: string; power: string; filter: string;
  seeing: string; transparency: string; bortle: string; rating: string; notes: string;
};
export const COLUMNS: [keyof Entry, string][] = [
  ['id', 'id'], ['utc', 'utc_time'], ['date', 'local_date'], ['time', 'local_time'], ['object', 'object'], ['type', 'type'], ['con', 'constellation'],
  ['ra', 'ra_j2000'], ['dec', 'dec_j2000'], ['place', 'place'], ['lat', 'latitude'], ['lon', 'longitude'], ['scope', 'telescope'], ['optics', 'eyepiece_or_camera'],
  ['power', 'magnification'], ['filter', 'filter'], ['seeing', 'seeing_1_to_5'], ['transparency', 'transparency_1_to_5'], ['bortle', 'bortle'], ['rating', 'rating_1_to_5'], ['notes', 'notes'],
];

const cell = (v: string) => (/[",\r\n]/.test(v) || /^[=+\-@]/.test(v) ? `"${(/^[=+\-@]/.test(v) && !/^-?\d/.test(v) ? "'" : '') + v.replace(/"/g, '""')}"` : v);
export function toCsv(entries: Entry[]) {
  return [COLUMNS.map((c) => c[1]).join(','), ...entries.map((e) => COLUMNS.map(([k]) => cell(e[k] ?? '')).join(','))].join('\r\n') + '\r\n';
}

/** Read CSV text (RFC 4180, with quotes and line breaks inside quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], f = '', q = false;
  const t = text.replace(/^﻿/, '');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; continue; }
    if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; } else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; } else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ''));
}

/** Entries from a log CSV. Columns are matched by name, so files edited in a spreadsheet still work. */
export function fromCsv(text: string): { entries: Entry[]; ok: boolean } {
  const rows = parseCsv(text);
  if (!rows.length) return { entries: [], ok: true };
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const idx = COLUMNS.map(([, name]) => head.indexOf(name));
  if (idx[COLUMNS.findIndex(([k]) => k === 'object')] < 0) return { entries: [], ok: false };
  const entries = rows.slice(1).map((r, n) => {
    const e = {} as Entry;
    COLUMNS.forEach(([k], i) => { e[k] = idx[i] >= 0 ? (r[idx[i]] ?? '').replace(/^'(?=[=+\-@])/, '') : ''; });
    if (!e.id) e.id = `row-${n}-${e.utc || e.date}-${e.object}`;
    return e;
  });
  return { entries, ok: true };
}

/** Old entries plus new ones, without duplicates, oldest first. */
export function merge(old: Entry[], add: Entry[]) {
  const seen = new Set(old.map((e) => e.id));
  return [...old, ...add.filter((e) => !seen.has(e.id))].sort((a, b) => (a.utc || a.date).localeCompare(b.utc || b.date));
}
