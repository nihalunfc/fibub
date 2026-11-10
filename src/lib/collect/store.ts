// The visitor's collection, kept only in their own browser and only if they tick the box. Nothing is ever
// sent anywhere. Export saves a .json file the visitor keeps; Import reads it back. Clear deletes it.
// Tools on the Collecting shelf share one key, so a coin saved in the catalogue is there in the other tools.

export const COLLECTION_KEY = 'fibub-collection-v1';

export type Item = {
  id: string;
  kind: 'coin' | 'note' | 'bullion' | 'medal' | 'card' | 'stamp' | 'other';
  name: string;          // "1 rupee", "Morgan dollar", "1 oz bar"
  country?: string;
  year?: string;         // as written on it (may be AH, VS ...)
  ce?: string;           // common era year, if known
  metal?: string;        // an ALLOYS key from maths.ts, or free text
  fineness?: number;     // parts per thousand
  weight?: number;       // grams, measured
  diameter?: number;     // mm
  thickness?: number;    // mm
  grade?: string;
  ref?: string;          // the visitor's own catalogue number
  serial?: string;
  qty?: number;
  cost?: number;
  value?: number;        // the visitor's own value
  valued?: string;       // date the value was set
  place?: string;        // where it's kept (box, album, page)
  notes?: string;
};
export type Collection = { v: 1; cur: string; items: Item[] };

export const newId = () => Math.random().toString(36).slice(2, 10);
export const empty = (cur = 'usd'): Collection => ({ v: 1, cur, items: [] });

export function loadCollection(): Collection | null {
  try {
    const d = JSON.parse(localStorage.getItem(COLLECTION_KEY) || 'null');
    return d && Array.isArray(d.items) ? d : null;
  } catch { return null; }
}
export function saveCollection(c: Collection | null) {
  try { if (c) localStorage.setItem(COLLECTION_KEY, JSON.stringify(c)); else localStorage.removeItem(COLLECTION_KEY); } catch {}
}

/** Download any data as a .json file (made in the browser; nothing is uploaded). */
export function downloadJson(name: string, data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
/** Download rows as a CSV file that opens in Excel or Sheets. */
export function downloadCsv(name: string, rows: (string | number | undefined)[][]) {
  const cell = (v: unknown) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const url = URL.createObjectURL(new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
/** Read a collection back from an exported .json file (or a plain array of items). */
export async function readCollectionFile(f: File): Promise<Collection> {
  const d = JSON.parse(await f.text());
  const items = Array.isArray(d) ? d : d?.items;
  if (!Array.isArray(items)) throw new Error('That file has no items in it.');
  return { v: 1, cur: typeof d?.cur === 'string' ? d.cur : 'usd', items: items.filter((i: any) => i && typeof i.name === 'string').map((i: any) => ({ ...i, id: i.id || newId() })) };
}

/**
 * Wire an opt-in "Keep on this device" tick for any small piece of data under `key`. Returns `save()` to call
 * after each change. Unticking deletes what was kept. `restore` gets the saved data once, if there is any.
 */
export function keepOnDevice<T>(box: HTMLInputElement, key: string, get: () => T, restore: (d: T) => void) {
  let saved: T | null = null;
  try { saved = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
  if (saved != null) { box.checked = true; restore(saved); }
  const save = () => { try { if (box.checked) localStorage.setItem(key, JSON.stringify(get())); } catch {} };
  box.addEventListener('change', () => { try { if (box.checked) save(); else localStorage.removeItem(key); } catch {} });
  return save;
}
