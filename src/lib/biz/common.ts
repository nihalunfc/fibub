// Small helpers shared by the business tools: dates, pasted tables and CSV.
export const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => iso(new Date());
export const addDays = (s: string, n: number) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
export const validISO = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(new Date(s + 'T12:00:00').getTime());
export const dayDiff = (a: string, b: string) => Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 864e5);
export const dowOf = (s: string) => new Date(s + 'T12:00:00').getDay();
export const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const dayLabel = (s: string) => validISO(s) ? new Date(s + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : (s || '?');
export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const fin = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
/** A typed or pasted number: '' stays '' so a blank box is not read as zero. */
export const toNum = (v: unknown): number | '' => { if (v === '' || v == null) return ''; const n = parseFloat(String(v).replace(/[$£€₹,\s%]/g, '')); return Number.isFinite(n) ? n : ''; };

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/** Reads dates such as 2026-10-19, 10/19/2026, 19-Oct-2026, Oct 19, 2026 or an Excel day number. Returns YYYY-MM-DD or null. */
export function parseDate(raw: unknown, dmy = false): string | null {
  const s = String(raw ?? '').trim().replace(/^"|"$/g, '');
  if (!s) return null;
  const mk = (y: number, mo: number, d: number) => {
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1990 || y > 2100) return null;
    const r = `${y}-${pad(mo)}-${pad(d)}`, t = new Date(r + 'T12:00:00');
    return isNaN(t.getTime()) || t.getDate() !== d ? null : r;
  };
  let m: RegExpMatchArray | null;
  if (/^\d{5}(\.\d+)?$/.test(s)) { const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(+s) * 864e5); return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`; }
  if ((m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/))) return mk(+m[1], +m[2], +m[3]);
  if ((m = s.match(/^(\d{4})(\d{2})(\d{2})$/))) return mk(+m[1], +m[2], +m[3]);
  if ((m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/))) { let y = +m[3]; if (y < 100) y += 2000; const a = +m[1], b = +m[2]; return dmy || a > 12 ? mk(y, b, a) : mk(y, a, b); }
  if ((m = s.match(/^(\d{1,2})[-\s/]([a-z]{3})[a-z]*\.?[-\s/,]+(\d{2,4})/i))) { let y = +m[3]; if (y < 100) y += 2000; return mk(y, MONTHS.indexOf(m[2].toLowerCase()) + 1, +m[1]); }
  if ((m = s.match(/^(?:[a-z]+,?\s+)?([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/i))) return mk(+m[3], MONTHS.indexOf(m[1].toLowerCase()) + 1, +m[2]);
  return null;
}

/** Splits pasted text (tab, semicolon or comma separated, with quotes) into rows of cells. */
export function parseTable(t: string): string[][] {
  const lines = t.split(/\r?\n/).filter((l) => l.trim()).slice(0, 6);
  const cnt = (ch: string) => Math.max(0, ...lines.map((l) => l.split(ch).length - 1));
  const delim = cnt('\t') > 0 ? '\t' : cnt(';') > cnt(',') ? ';' : ',';
  const out: string[][] = []; let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(cell); out.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); out.push(row); }
  return out.filter((r) => r.some((x) => String(x).trim()));
}

export const csvCell = (v: unknown) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export const toCSV = (rows: unknown[][]) => rows.map((r) => r.map(csvCell).join(',')).join('\n');
export function downloadText(name: string, text: string, type = 'text/csv;charset=utf-8') {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + text], { type })); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Opt-in saving in this browser only: nothing is stored until the box is ticked (house rule). */
export function keeper(key: string, box: HTMLInputElement, clear: HTMLElement, get: () => unknown, set: (v: any) => void) {
  const read = () => { try { const t = localStorage.getItem(key); return t ? JSON.parse(t) : null; } catch { return null; } };
  const saved = read();
  if (saved) { try { set(saved); box.checked = true; } catch { /* old format: ignore */ } }
  let timer = 0;
  const save = () => {
    if (!box.checked) return;
    clearTimeout(timer);
    timer = window.setTimeout(() => { try { localStorage.setItem(key, JSON.stringify(get())); } catch { /* full or blocked */ } }, 300);
  };
  box.addEventListener('change', () => { if (box.checked) save(); else try { localStorage.removeItem(key); } catch { /* blocked */ } });
  clear.addEventListener('click', () => { try { localStorage.removeItem(key); } catch { /* blocked */ } box.checked = false; });
  return save;
}
