// Health log: presets, unit conversion, simple statistics, weekly averages and CSV in and out.
// Plain TypeScript, no DOM. Numbers are only organised and charted; nothing is judged or categorised.
export type Field = { k: string; label: string; kind: 'num' | 'select' | 'text' | 'date'; unit?: string; min?: number; max?: number; step?: number; opts?: string[]; chart?: boolean; req?: boolean; conv?: 'glucose' | 'weight'; dp?: number; derived?: boolean };
export type Preset = { id: string; name: string; title: string; fields: Field[]; units?: string[] };
export type Entry = { id: string; t: string; v: Record<string, number | string> };
export type Log = { unit: string; name: string; cunit: string; targets: Record<string, number>; entries: Entry[] };

export const MG_PER_MMOL = 18.016, LB_PER_KG = 2.2046226218;

export const PRESETS: Preset[] = [
  { id: 'bp', name: 'Blood pressure', title: 'Blood pressure log', fields: [
    { k: 'sys', label: 'Systolic (top)', kind: 'num', unit: 'mmHg', min: 30, max: 350, step: 1, chart: true, req: true, dp: 0 },
    { k: 'dia', label: 'Diastolic (bottom)', kind: 'num', unit: 'mmHg', min: 20, max: 250, step: 1, chart: true, req: true, dp: 0 },
    { k: 'pulse', label: 'Pulse', kind: 'num', unit: 'bpm', min: 20, max: 300, step: 1, chart: true, dp: 0 },
    { k: 'arm', label: 'Arm', kind: 'select', opts: ['', 'Left', 'Right'] },
    { k: 'tod', label: 'Time of day', kind: 'select', opts: ['', 'Morning', 'Afternoon', 'Evening', 'Night'] },
  ] },
  { id: 'glucose', name: 'Blood glucose', title: 'Blood glucose log', units: ['mg/dL', 'mmol/L'], fields: [
    { k: 'value', label: 'Glucose', kind: 'num', conv: 'glucose', min: 0.1, max: 2000, step: 0.1, chart: true, req: true },
    { k: 'ctx', label: 'When', kind: 'select', opts: ['', 'Before meal', 'After meal', 'Other'] },
  ] },
  { id: 'weight', name: 'Weight', title: 'Weight log', units: ['kg', 'lb'], fields: [
    { k: 'value', label: 'Weight', kind: 'num', conv: 'weight', min: 0.1, max: 1500, step: 0.1, chart: true, req: true },
  ] },
  { id: 'sleep', name: 'Sleep', title: 'Sleep log', fields: [
    { k: 'hours', label: 'Hours slept', kind: 'num', unit: 'h', min: 0, max: 24, step: 0.25, chart: true, req: true, dp: 2 },
    { k: 'quality', label: 'Quality (1 to 5)', kind: 'num', min: 1, max: 5, step: 1, chart: true, dp: 0 },
  ] },
  { id: 'symptom', name: 'Symptom diary', title: 'Symptom diary', fields: [
    { k: 'symptom', label: 'Symptom', kind: 'text', req: true },
    { k: 'sev', label: 'How strong (0 to 10)', kind: 'num', min: 0, max: 10, step: 1, chart: true, req: true, dp: 0 },
    { k: 'note', label: 'Note', kind: 'text' },
  ] },
  { id: 'period', name: 'Period', title: 'Period log', fields: [
    { k: 'end', label: 'Last day', kind: 'date' },
    { k: 'flow', label: 'Flow', kind: 'select', opts: ['', 'Light', 'Medium', 'Heavy'] },
    { k: 'days', label: 'Length', kind: 'num', unit: 'days', chart: true, derived: true, dp: 0 },
  ] },
  { id: 'custom', name: 'Custom', title: 'Log', fields: [
    { k: 'value', label: 'Value', kind: 'num', min: -1e9, max: 1e9, step: 0.01, chart: true, req: true },
  ] },
];
export const preset = (id: string) => PRESETS.find((p) => p.id === id)!;

export const newLog = (p: Preset): Log => ({ unit: p.units?.[0] ?? '', name: '', cunit: '', targets: {}, entries: [] });

/** A field as shown for this log: its label and unit (custom logs use the typed name and unit; glucose and weight use the log's unit). */
export function fieldInfo(p: Preset, f: Field, log: Log): { label: string; unit: string } {
  if (p.id === 'custom' && f.k === 'value') return { label: log.name.trim() || 'Value', unit: log.cunit.trim() };
  return { label: f.label, unit: f.conv ? log.unit : f.unit ?? '' };
}
/** Stored number to the log's unit, and back. Glucose is kept in mg/dL and weight in kg. */
export function toUnit(f: Field, canon: number, unit: string): number {
  if (f.conv === 'glucose' && unit === 'mmol/L') return canon / MG_PER_MMOL;
  if (f.conv === 'weight' && unit === 'lb') return canon * LB_PER_KG;
  return canon;
}
export function fromUnit(f: Field, shown: number, unit: string): number {
  if (f.conv === 'glucose' && unit === 'mmol/L') return shown * MG_PER_MMOL;
  if (f.conv === 'weight' && unit === 'lb') return shown / LB_PER_KG;
  return shown;
}
/** Decimal places to show. */
export const places = (f: Field, unit: string) => (f.conv === 'glucose' ? (unit === 'mmol/L' ? 1 : 0) : f.conv ? 1 : f.dp ?? 2);
export function fmt(x: number, dp: number): string {
  const s = x.toFixed(dp);
  return dp > 0 ? s.replace(/\.?0+$/, '') : s;
}

// ---------- dates ----------
const pad = (n: number) => String(n).padStart(2, '0');
export const dayOf = (t: string) => t.slice(0, 10);
export function nowLocal(d = new Date()): string { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; }
const parseDay = (s: string) => new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10), 12);
/** The Monday of the week a day (YYYY-MM-DD) falls in. */
export function weekStart(day: string): string {
  const d = parseDay(day); d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export const daysBetween = (a: string, b: string) => Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86400000);
export const validT = (t: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(t) && !Number.isNaN(parseDay(t).getTime());

// ---------- numbers ----------
export type Stats = { n: number; avg: number; min: number; max: number };
export function stats(xs: number[]): Stats | null {
  if (!xs.length) return null;
  return { n: xs.length, avg: xs.reduce((s, x) => s + x, 0) / xs.length, min: Math.min(...xs), max: Math.max(...xs) };
}
/** Values of one field across entries, as numbers in the log's unit, with their times. */
export function series(p: Preset, f: Field, log: Log, entries: Entry[]): { t: string; y: number }[] {
  return entries.filter((e) => typeof e.v[f.k] === 'number').map((e) => ({ t: e.t, y: toUnit(f, e.v[f.k] as number, log.unit) })).sort((a, b) => a.t.localeCompare(b.t));
}
/** Average per week (weeks start on Monday). */
export function weekly(pts: { t: string; y: number }[]): { week: string; avg: number; n: number }[] {
  const m = new Map<string, number[]>();
  for (const p of pts) { const w = weekStart(dayOf(p.t)); (m.get(w) ?? m.set(w, []).get(w)!).push(p.y); }
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([week, ys]) => ({ week, avg: ys.reduce((s, y) => s + y, 0) / ys.length, n: ys.length }));
}

/** Check a new entry; returns a plain message or ''. Only impossible values are refused, never "unhealthy" ones. */
export function checkEntry(p: Preset, log: Log, t: string, raw: Record<string, string>): string {
  if (!validT(t)) return 'Pick a date and time.';
  for (const f of p.fields) {
    if (f.derived) continue;
    const s = (raw[f.k] ?? '').trim();
    if (f.req && !s) return `${fieldInfo(p, f, log).label} is needed.`;
    if (f.kind === 'num' && s) {
      const x = Number(s.replace(',', '.'));
      if (!Number.isFinite(x)) return `${fieldInfo(p, f, log).label}: "${s}" is not a number.`;
      const lo = f.min ?? -Infinity, hi = f.max ?? Infinity;
      const canon = fromUnit(f, x, log.unit);
      if (canon < lo || canon > hi) return `${fieldInfo(p, f, log).label}: ${s} looks like a typing slip. Check the number.`;
    }
  }
  if (p.id === 'period' && raw.end && raw.end < dayOf(t)) return 'The last day is before the first day.';
  return '';
}
/** Build an entry from typed boxes (numbers entered in the log's unit are stored in the base unit). */
export function makeEntry(p: Preset, log: Log, t: string, raw: Record<string, string>): Entry {
  const v: Record<string, number | string> = {};
  for (const f of p.fields) {
    const s = (raw[f.k] ?? '').trim();
    if (!s || f.derived) continue;
    v[f.k] = f.kind === 'num' ? fromUnit(f, Number(s.replace(',', '.')), log.unit) : s;
  }
  if (p.id === 'period' && v.end) v.days = daysBetween(dayOf(t), String(v.end)) + 1;
  return { id: Math.random().toString(36).slice(2, 10), t, v };
}
/** The text shown for one field of an entry. */
export function show(p: Preset, f: Field, log: Log, e: Entry): string {
  const x = e.v[f.k];
  if (x === undefined || x === '') return '';
  return typeof x === 'number' ? fmt(toUnit(f, x, log.unit), places(f, log.unit)) : String(x);
}

// ---------- CSV ----------
const q = (s: string) => (/[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
export function headers(p: Preset, log: Log): string[] {
  return ['Date', 'Time', ...p.fields.map((f) => { const i = fieldInfo(p, f, log); return i.unit ? `${i.label} (${i.unit})` : i.label; })];
}
export function toCsv(p: Preset, log: Log, entries: Entry[]): string {
  const rows = [...entries].sort((a, b) => a.t.localeCompare(b.t)).map((e) => [e.t.slice(0, 10), e.t.slice(11), ...p.fields.map((f) => show(p, f, log, e))]);
  return [headers(p, log), ...rows].map((r) => r.map(q).join(',')).join('\r\n') + '\r\n';
}
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cur = '', inq = false;
  const t = text.replace(/^﻿/, '');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inq) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else inq = false; } else cur += c; }
    else if (c === '"') inq = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cur); cur = ''; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cur += c;
  }
  row.push(cur); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}
/** Read a CSV that looks like this tool's own export. Columns are matched by name; units in brackets are honoured. */
export function fromCsv(p: Preset, log: Log, text: string): { entries: Entry[]; skipped: number; unit?: string } {
  const rows = parseCsv(text);
  if (rows.length < 2) return { entries: [], skipped: 0 };
  const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const head = rows[0], col = (name: string) => head.findIndex((h) => norm(h) === norm(name));
  const di = col('Date'), ti = col('Time');
  if (di < 0) return { entries: [], skipped: rows.length - 1 };
  const unitOf = (h: string) => /\(([^)]*)\)/.exec(h)?.[1] ?? '';
  let unit = log.unit;
  const out: Entry[] = []; let skipped = 0;
  const fi = p.fields.map((f) => ({ f, i: col(fieldInfo(p, f, log).label) }));
  for (const f of p.fields) if (f.conv) { const i = fi.find((x) => x.f === f)!.i; const u = i >= 0 ? unitOf(head[i]) : ''; if (p.units?.includes(u)) unit = u; }
  for (const r of rows.slice(1)) {
    const day = (r[di] ?? '').trim(), tm = ti >= 0 ? (r[ti] ?? '').trim() : '';
    const t = `${day}T${/^\d{1,2}:\d{2}/.test(tm) ? tm.padStart(5, '0').slice(0, 5) : '00:00'}`;
    if (!validT(t)) { skipped++; continue; }
    const raw: Record<string, string> = {};
    for (const { f, i } of fi) if (i >= 0) raw[f.k] = (r[i] ?? '').trim();
    const tmp: Log = { ...log, unit };
    if (checkEntry(p, tmp, t, raw)) { skipped++; continue; }
    out.push(makeEntry(p, tmp, t, raw));
  }
  return { entries: out, skipped, unit: p.units ? unit : undefined };
}
