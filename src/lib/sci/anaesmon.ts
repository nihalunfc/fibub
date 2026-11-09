// Anaesthesia monitoring log for teaching: record times, vital signs at set intervals, the user's own alert
// ranges, a summary and CSV in and out. It records and charts; it never calculates or suggests drug doses. No DOM.

export const VITALS = [
  { key: 'hr', name: 'Heart rate', short: 'HR', unit: 'beats/min' },
  { key: 'rr', name: 'Respiratory rate', short: 'RR', unit: 'breaths/min' },
  { key: 'spo2', name: 'SpO₂', short: 'SpO₂', unit: '%' },
  { key: 'etco2', name: 'EtCO₂', short: 'EtCO₂', unit: 'mmHg' },
  { key: 'temp', name: 'Temperature', short: 'Temp', unit: '°C' },
  { key: 'sap', name: 'Systolic BP', short: 'SAP', unit: 'mmHg' },
  { key: 'map', name: 'Mean BP', short: 'MAP', unit: 'mmHg' },
  { key: 'dap', name: 'Diastolic BP', short: 'DAP', unit: 'mmHg' },
] as const;
export type VKey = (typeof VITALS)[number]['key'];
export type LogRow = { time: string; v: Record<VKey, number>; depth: string };
export type Range = { min: number; max: number };
export type Ranges = Record<VKey, Range>;

/** Minutes since midnight from "09:05" or "9.05"; NaN if not a time. */
export function minutes(s: string): number {
  const r = /^\s*(\d{1,2})[:.h](\d{2})\s*$/.exec(s);
  if (!r || +r[1] > 23 || +r[2] > 59) return NaN;
  return +r[1] * 60 + +r[2];
}
export const hhmm = (m: number) => { const x = ((Math.round(m) % 1440) + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };
/** n times from start, every `step` minutes, wrapping past midnight. */
export const times = (start: string, step: number, n: number) => { const s = minutes(start); return Array.from({ length: n }, (_, k) => hhmm(s + k * step)); };
/** Minutes after the first row, counting across midnight. */
export function elapsed(rows: LogRow[]): number[] {
  let day = 0, prev = NaN; const t0 = minutes(rows[0]?.time ?? '');
  return rows.map((r) => { const m = minutes(r.time); if (Number.isFinite(prev) && m < prev) day += 1440; prev = m; return m + day - t0; });
}
export const emptyRow = (time: string): LogRow => ({ time, v: Object.fromEntries(VITALS.map((x) => [x.key, NaN])) as Record<VKey, number>, depth: '' });
export const noRanges = (): Ranges => Object.fromEntries(VITALS.map((x) => [x.key, { min: NaN, max: NaN }])) as Ranges;

export type Alert = { row: number; time: string; key: VKey; value: number; side: 'low' | 'high'; limit: number };
/** Readings below or above the user's ranges (a blank limit is no limit). */
export function alerts(rows: LogRow[], ranges: Ranges): Alert[] {
  const out: Alert[] = [];
  rows.forEach((r, i) => VITALS.forEach(({ key }) => {
    const x = r.v[key], g = ranges[key]; if (!Number.isFinite(x)) return;
    if (Number.isFinite(g.min) && x < g.min) out.push({ row: i, time: r.time, key, value: x, side: 'low', limit: g.min });
    if (Number.isFinite(g.max) && x > g.max) out.push({ row: i, time: r.time, key, value: x, side: 'high', limit: g.max });
  }));
  return out;
}

/** Readings that cannot be right as typed (SpO₂ over 100 %, a mean pressure outside systolic and diastolic, a negative value). */
export function problems(rows: LogRow[]): string[] {
  const out: string[] = [];
  rows.forEach((r) => {
    for (const { key, name } of VITALS) if (r.v[key] < 0) out.push(`${r.time}: ${name} cannot be negative.`);
    if (r.v.spo2 > 100) out.push(`${r.time}: SpO₂ cannot be above 100 %.`);
    if (r.v.sap < r.v.dap) out.push(`${r.time}: systolic is below diastolic.`);
    else if (r.v.map > r.v.sap || r.v.map < r.v.dap) out.push(`${r.time}: mean pressure is not between diastolic and systolic.`);
  });
  return out;
}

export type Stat = { key: VKey; n: number; min: number; max: number; mean: number; first: number; last: number };
export function summary(rows: LogRow[]): Stat[] {
  return VITALS.map(({ key }) => {
    const xs = rows.map((r) => r.v[key]).filter(Number.isFinite);
    return { key, n: xs.length, min: xs.length ? Math.min(...xs) : NaN, max: xs.length ? Math.max(...xs) : NaN, mean: xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : NaN, first: xs[0] ?? NaN, last: xs[xs.length - 1] ?? NaN };
  });
}

export const HEAD = ['time', ...VITALS.map((x) => x.key), 'depth_and_notes'];
/** CSV cells of the log. */
export const toRows = (rows: LogRow[]) => [HEAD, ...rows.map((r) => [r.time, ...VITALS.map((x) => (Number.isFinite(r.v[x.key]) ? String(r.v[x.key]) : '')), r.depth])];
/** A log back from rows of cells (a CSV this tool wrote, or any table with the same column names). */
export function fromRows(cells: string[][], num: (s: string) => number): { rows: LogRow[]; errors: string[] } {
  const errors: string[] = [];
  if (!cells.length) return { rows: [], errors: ['The file is empty.'] };
  const head = cells[0].map((h) => h.toLowerCase().trim());
  const ti = head.indexOf('time');
  if (ti < 0) return { rows: [], errors: ['The first row needs a "time" column (the CSV this tool writes has one).'] };
  const idx = VITALS.map((x) => head.indexOf(x.key)), di = head.findIndex((h) => h.startsWith('depth'));
  const rows: LogRow[] = [];
  cells.slice(1).forEach((c, k) => {
    if (Number.isNaN(minutes(c[ti] ?? ''))) { errors.push(`Row ${k + 2}: "${c[ti] ?? ''}" is not a time like 09:05.`); return; }
    const r = emptyRow(hhmm(minutes(c[ti])));
    VITALS.forEach((x, j) => { const s = idx[j] >= 0 ? (c[idx[j]] ?? '').trim() : ''; r.v[x.key] = s ? num(s) : NaN; });
    r.depth = di >= 0 ? c[di] ?? '' : '';
    rows.push(r);
  });
  return { rows, errors };
}

/** A made-up teaching record (not a real patient). */
export const EXAMPLE = {
  species: 'Dog', procedure: 'Teaching example', start: '09:00', step: 5,
  rows: [
    ['09:00', 112, 18, 98, 38, 37.9, 128, 92, 72, 'Induced; eye central, jaw tone moderate'],
    ['09:05', 104, 14, 99, 40, 37.8, 118, 84, 66, 'Eye rotated ventrally, no palpebral reflex'],
    ['09:10', 96, 12, 99, 42, 37.6, 110, 78, 60, ''],
    ['09:15', 92, 10, 98, 44, 37.4, 96, 66, 52, 'Surgery started'],
    ['09:20', 88, 8, 97, 47, 37.2, 88, 58, 46, 'Pressure falling; told supervisor'],
    ['09:25', 94, 10, 98, 44, 37.1, 98, 68, 54, ''],
    ['09:30', 100, 12, 99, 41, 36.9, 108, 76, 60, 'Stable'],
    ['09:35', 98, 12, 99, 40, 36.8, 112, 80, 64, ''],
    ['09:40', 102, 14, 98, 39, 36.7, 116, 84, 68, 'Skin closure'],
  ] as (string | number)[][],
};
/** Made-up practice ranges for the example, to show how alerts work. They are not clinical targets. */
export const PRACTICE_RANGES: Partial<Record<VKey, [number, number]>> = { hr: [60, 160], rr: [8, 30], spo2: [95, 100], etco2: [35, 45], temp: [37, 39.5], sap: [90, 160], map: [60, 120], dap: [40, 100] };

/** Cells of a comma-separated file with quoted fields (RFC 4180), as this tool writes it. Tab-separated text works too. */
export function parseCsv(text: string): string[][] {
  const t = text.replace(/^﻿/, ''), sep = !t.split('\n')[0].includes(',') && t.includes('\t') ? '\t' : ',';
  const rows: string[][] = []; let row: string[] = [], cell = '', inQ = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inQ) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else inQ = false; } else cell += c; continue; }
    if (c === '"' && cell === '') inQ = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some((x) => x.trim())) rows.push(row); row = []; }
    else cell += c;
  }
  row.push(cell); if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}
