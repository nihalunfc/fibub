// Cryovial inventory: freezers, racks and square boxes (9 × 9 or 10 × 10) of frozen cell vials, with search,
// a thaw log, CSV and JSON import/export, and a freezing helper (cells and freezing medium for N vials).
// Positions are a row letter and a column number (A1 top left), filled row by row. A thawed vial keeps its
// record (and where it came from) for the thaw log but frees its place in the box. Plain data, no DOM.
import { num } from './num.ts';

export type Box = { id: string; freezer: string; rack: string; name: string; rows: number; cols: number };
export type Vial = {
  id: string; box: string; pos: string;
  line: string; passage: number | null; frozen: string; cells: number | null; medium: string; who: string; note: string;
  /** Set when thawed: the date (YYYY-MM-DD), who thawed it, a note and the place it came from. */
  thawed?: string; thawBy?: string; thawNote?: string; place?: string;
};
export type Inventory = { boxes: Box[]; vials: Vial[]; next: number };
export type VialFields = { line: string; passage?: number | null; frozen: string; cells?: number | null; medium?: string; who?: string; note?: string };

export const SIZES = [9, 10];
export const MAX_SIDE = 12;
export const newInventory = (): Inventory => ({ boxes: [], vials: [], next: 1 });
const uid = (inv: Inventory, p: string) => `${p}${inv.next++}`;
const clean = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim();
const key = (f: string, r: string, n: string) => [f, r, n].map((s) => clean(s).toLowerCase()).join('\u0000');

// ---------- Positions ----------
export const rowLetter = (r: number) => String.fromCharCode(65 + r);
export const posName = (r: number, c: number) => `${rowLetter(r)}${c + 1}`;
/** "c7", "C07" or "C 7" in a box → { r, c } (0-based), or null when it is not a place in that box. */
export function parsePos(s: string, box: Pick<Box, 'rows' | 'cols'>): { r: number; c: number } | null {
  const m = /^([A-Za-z])\s*0*(\d{1,2})$/.exec(clean(s));
  if (!m) return null;
  const r = m[1].toUpperCase().charCodeAt(0) - 65, c = Number(m[2]) - 1;
  return r >= 0 && r < box.rows && c >= 0 && c < box.cols ? { r, c } : null;
}
export const posIndex = (box: Pick<Box, 'rows' | 'cols'>, pos: string) => { const p = parsePos(pos, box); return p ? p.r * box.cols + p.c : -1; };
export const boxLabel = (b: Box) => `${b.freezer} › ${b.rack} › ${b.name}`;
export const placeOf = (inv: Inventory, v: Vial) => { const b = inv.boxes.find((x) => x.id === v.box); return b ? `${boxLabel(b)} › ${v.pos}` : v.place || v.pos; };

/** A real calendar date written YYYY-MM-DD. */
export function isDate(s: string): boolean {
  const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}
export const addDays = (iso: string, days: number) => new Date(Date.parse(iso + 'T00:00:00Z') + days * 864e5).toISOString().slice(0, 10);

// ---------- Boxes ----------
export function addBox(inv: Inventory, b: { freezer: string; rack: string; name: string; rows?: number; cols?: number }): Box {
  const freezer = clean(b.freezer), rack = clean(b.rack), name = clean(b.name);
  const rows = b.rows ?? 9, cols = b.cols ?? rows;
  if (!freezer || !rack || !name) throw new Error('Give the freezer, the rack and the box a name.');
  if (![rows, cols].every((n) => Number.isInteger(n) && n >= 1 && n <= MAX_SIDE)) throw new Error(`A box has 1 to ${MAX_SIDE} rows and columns.`);
  if (inv.boxes.some((x) => key(x.freezer, x.rack, x.name) === key(freezer, rack, name))) throw new Error(`There is already a box called ${name} in ${freezer} › ${rack}.`);
  const box: Box = { id: uid(inv, 'b'), freezer, rack, name, rows, cols };
  inv.boxes.push(box);
  return box;
}
export function findBox(inv: Inventory, freezer: string, rack: string, name: string) { return inv.boxes.find((x) => key(x.freezer, x.rack, x.name) === key(freezer, rack, name)); }
export function renameBox(inv: Inventory, id: string, b: { freezer: string; rack: string; name: string }) {
  const box = inv.boxes.find((x) => x.id === id);
  if (!box) throw new Error('That box is not in the inventory.');
  const freezer = clean(b.freezer), rack = clean(b.rack), name = clean(b.name);
  if (!freezer || !rack || !name) throw new Error('Give the freezer, the rack and the box a name.');
  const other = findBox(inv, freezer, rack, name);
  if (other && other.id !== id) throw new Error(`There is already a box called ${name} in ${freezer} › ${rack}.`);
  Object.assign(box, { freezer, rack, name });
}
/** Remove a box and the vials still in it. Thawed vials stay in the thaw log with their old place written out. */
export function removeBox(inv: Inventory, id: string): number {
  const box = inv.boxes.find((x) => x.id === id);
  if (!box) return 0;
  let gone = 0;
  inv.vials = inv.vials.filter((v) => {
    if (v.box !== id) return true;
    if (v.thawed) { v.place = `${boxLabel(box)} › ${v.pos}`; v.box = ''; return true; }
    gone++; return false;
  });
  inv.boxes = inv.boxes.filter((x) => x.id !== id);
  return gone;
}
/** Boxes in order: freezer, rack, box name (numbers inside names sort as numbers). */
export const sortedBoxes = (inv: Inventory) => [...inv.boxes].sort((a, b) => cmp(a.freezer, b.freezer) || cmp(a.rack, b.rack) || cmp(a.name, b.name));
const cmp = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });

// ---------- Vials ----------
export const inStock = (v: Vial) => !v.thawed;
/** The vials in a box now, by position. */
export function occupancy(inv: Inventory, boxId: string): Map<string, Vial> {
  const m = new Map<string, Vial>();
  for (const v of inv.vials) if (v.box === boxId && inStock(v)) m.set(v.pos, v);
  return m;
}
/** Free places in a box, row by row (A1, A2, … A9, B1 …), from `from` (included) to the end of the box. */
export function freePositions(inv: Inventory, box: Box, from = 'A1'): string[] {
  const start = parsePos(from, box);
  if (!start) return [];
  const used = occupancy(inv, box.id), out: string[] = [];
  for (let i = start.r * box.cols + start.c; i < box.rows * box.cols; i++) {
    const p = posName(Math.floor(i / box.cols), i % box.cols);
    if (!used.has(p)) out.push(p);
  }
  return out;
}

function checkFields(f: VialFields) {
  if (!clean(f.line)) throw new Error('Type the cell line (or sample) name.');
  if (!isDate(clean(f.frozen))) throw new Error('Type the date frozen as YYYY-MM-DD, for example 2026-11-09.');
  if (f.passage != null && !(Number.isInteger(f.passage) && f.passage >= 0)) throw new Error('The passage is a whole number, 0 or more (or leave it empty).');
  if (f.cells != null && !(Number.isFinite(f.cells) && f.cells > 0)) throw new Error('Cells per vial must be a number above 0 (or leave it empty).');
}
const fields = (f: VialFields) => ({ line: clean(f.line), passage: f.passage ?? null, frozen: clean(f.frozen), cells: f.cells ?? null, medium: clean(f.medium), who: clean(f.who), note: clean(f.note) });

/** Add `count` vials with the same details to the free places of a box, from `start` onwards. */
export function addVials(inv: Inventory, boxId: string, start: string, count: number, f: VialFields): Vial[] {
  const box = inv.boxes.find((x) => x.id === boxId);
  if (!box) throw new Error('Pick or add a box first.');
  if (!(Number.isInteger(count) && count >= 1)) throw new Error('The number of vials is a whole number, 1 or more.');
  if (!parsePos(start, box)) throw new Error(`Start at a place in the box, A1 to ${posName(box.rows - 1, box.cols - 1)}.`);
  checkFields(f);
  const free = freePositions(inv, box, start);
  if (free.length < count) throw new Error(`Only ${free.length} free place${free.length === 1 ? '' : 's'} from ${clean(start).toUpperCase()} to the end of ${box.name}; ${count} vials do not fit. Start earlier or use another box.`);
  const out = free.slice(0, count).map((pos) => ({ id: uid(inv, 'v'), box: box.id, pos, ...fields(f) }));
  inv.vials.push(...out);
  return out;
}

/** Change a vial's details, or move it to a free place (in this or another box). */
export function updateVial(inv: Inventory, id: string, f: VialFields & { box?: string; pos?: string }) {
  const v = inv.vials.find((x) => x.id === id);
  if (!v) throw new Error('That vial is not in the inventory.');
  checkFields(f);
  const boxId = f.box ?? v.box, box = inv.boxes.find((x) => x.id === boxId);
  if (!box) throw new Error('Pick a box for the vial.');
  const p = parsePos(f.pos ?? v.pos, box);
  if (!p) throw new Error(`The place must be in the box, A1 to ${posName(box.rows - 1, box.cols - 1)}.`);
  const pos = posName(p.r, p.c);
  if (inStock(v)) { const there = occupancy(inv, boxId).get(pos); if (there && there.id !== id) throw new Error(`${pos} in ${box.name} already holds ${there.line}.`); }
  Object.assign(v, fields(f), { box: boxId, pos });
}
export function removeVial(inv: Inventory, id: string) { inv.vials = inv.vials.filter((v) => v.id !== id); }

/** Mark vials thawed on a date. Their places become free; they move to the thaw log. */
export function thaw(inv: Inventory, ids: string[], date: string, by = '', note = ''): Vial[] {
  if (!isDate(clean(date))) throw new Error('Type the thaw date as YYYY-MM-DD.');
  const vs = ids.map((id) => inv.vials.find((v) => v.id === id)).filter((v): v is Vial => !!v && inStock(v));
  if (!vs.length) throw new Error('Pick one or more vials that are still in the freezer.');
  const early = vs.find((v) => clean(date) < v.frozen);
  if (early) throw new Error(`The thaw date is before ${early.line} (${early.pos}) was frozen on ${early.frozen}.`);
  for (const v of vs) Object.assign(v, { thawed: clean(date), thawBy: clean(by), thawNote: clean(note), place: placeOf(inv, v) });
  return vs;
}
/** Undo a thaw: the vial goes back to its place if that place is still free. */
export function unthaw(inv: Inventory, id: string) {
  const v = inv.vials.find((x) => x.id === id);
  if (!v || !v.thawed) throw new Error('That vial is not in the thaw log.');
  const box = inv.boxes.find((b) => b.id === v.box);
  if (!box) throw new Error('Its box has been removed; add the vial again by hand.');
  const there = occupancy(inv, box.id).get(v.pos);
  if (there) throw new Error(`${v.pos} in ${box.name} now holds ${there.line}; move that vial first.`);
  delete v.thawed; delete v.thawBy; delete v.thawNote; delete v.place;
}

// ---------- Search and summaries ----------
export type Filter = { text?: string; freezer?: string; line?: string; status?: 'in' | 'thawed' | 'all' };
/** Vials matching every word of the text (line, medium, who, notes, place, passage as "P12", dates) and the filters, in freezer order. */
export function filterVials(inv: Inventory, f: Filter = {}): Vial[] {
  const words = clean(f.text).toLowerCase().split(' ').filter(Boolean), status = f.status ?? 'in';
  const boxes = new Map(inv.boxes.map((b) => [b.id, b]));
  const order = new Map(sortedBoxes(inv).map((b, i) => [b.id, i]));
  return inv.vials.filter((v) => {
    if (status === 'in' && !inStock(v)) return false;
    if (status === 'thawed' && inStock(v)) return false;
    const b = boxes.get(v.box);
    if (f.freezer && (b ? b.freezer : '') !== f.freezer) return false;
    if (f.line && v.line !== f.line) return false;
    if (!words.length) return true;
    const hay = [v.line, v.medium, v.who, v.note, placeOf(inv, v), v.passage == null ? '' : `p${v.passage}`, v.frozen, v.thawed ?? '', v.thawBy ?? '', v.thawNote ?? ''].join(' ').toLowerCase();
    return words.every((w) => hay.includes(w));
  }).sort((a, b) => (order.get(a.box) ?? 1e9) - (order.get(b.box) ?? 1e9) || posSort(boxes.get(a.box), a.pos, b.pos) || cmp(a.line, b.line));
}
const posSort = (box: Box | undefined, a: string, b: string) => (box ? posIndex(box, a) - posIndex(box, b) : cmp(a, b));

export type LineSummary = { line: string; inStock: number; thawed: number; passages: [number, number] | null; oldest: string; newest: string; cells: number; boxes: number };
/** One row per line: vials in stock and thawed, passages and dates of the vials in stock, total cells in stock. */
export function lineSummary(inv: Inventory): LineSummary[] {
  const m = new Map<string, Vial[]>();
  for (const v of inv.vials) { const l = m.get(v.line) ?? []; l.push(v); m.set(v.line, l); }
  return [...m.entries()].map(([line, vs]) => {
    const st = vs.filter(inStock), ps = st.map((v) => v.passage).filter((p): p is number => p != null), ds = st.map((v) => v.frozen).sort();
    return { line, inStock: st.length, thawed: vs.length - st.length, passages: ps.length ? [Math.min(...ps), Math.max(...ps)] as [number, number] : null, oldest: ds[0] ?? '', newest: ds[ds.length - 1] ?? '', cells: st.reduce((s, v) => s + (v.cells ?? 0), 0), boxes: new Set(st.map((v) => v.box)).size };
  }).sort((a, b) => cmp(a.line, b.line));
}
/** Thawed vials, newest thaw first. */
export const thawLog = (inv: Inventory) => inv.vials.filter((v) => !!v.thawed).sort((a, b) => (b.thawed! < a.thawed! ? -1 : b.thawed! > a.thawed! ? 1 : cmp(a.line, b.line) || cmp(a.pos, b.pos)));
export const boxUse = (inv: Inventory, b: Box) => ({ used: occupancy(inv, b.id).size, places: b.rows * b.cols });

// ---------- CSV and JSON ----------
export const CSV_HEAD = ['freezer', 'rack', 'box', 'box_size', 'position', 'line', 'passage', 'date_frozen', 'cells_per_vial', 'medium', 'frozen_by', 'notes', 'status', 'date_thawed', 'thawed_by', 'thaw_notes'];
const q = (s: string | number) => { const t = String(s); return /[",\n\r]/.test(t) || /^\s|\s$/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };

/** Every vial (in stock and thawed) and every empty box, one row each. */
export function toCsv(inv: Inventory): string {
  const rows: (string | number)[][] = [CSV_HEAD];
  const boxes = sortedBoxes(inv);
  for (const b of boxes) {
    const vs = inv.vials.filter((v) => v.box === b.id).sort((x, y) => posIndex(b, x.pos) - posIndex(b, y.pos) || Number(!!x.thawed) - Number(!!y.thawed));
    if (!vs.length) rows.push([b.freezer, b.rack, b.name, `${b.rows}x${b.cols}`, '', '', '', '', '', '', '', '', 'empty box', '', '', '']);
    for (const v of vs) rows.push(vialRow(v, b.freezer, b.rack, b.name, `${b.rows}x${b.cols}`));
  }
  for (const v of inv.vials.filter((x) => !inv.boxes.some((b) => b.id === x.box))) {
    const parts = (v.place ?? '').split(' › ');
    rows.push(vialRow(v, parts[0] ?? '', parts[1] ?? '', parts[2] ?? '', ''));
  }
  return rows.map((r) => r.map(q).join(',')).join('\n') + '\n';
}
const vialRow = (v: Vial, f: string, r: string, b: string, size: string) => [f, r, b, size, v.pos, v.line, v.passage ?? '', v.frozen, v.cells ?? '', v.medium, v.who, v.note, v.thawed ? 'thawed' : 'in stock', v.thawed ?? '', v.thawBy ?? '', v.thawNote ?? ''];

/** A CSV or TSV file as rows of cells: quoted cells may hold commas, quotes ("") and line breaks. */
export function parseCsv(text: string): string[][] {
  const t = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const first = t.split('\n', 1)[0];
  const sep = first.includes('\t') ? '\t' : (first.split(';').length > first.split(',').length ? ';' : ',');
  const rows: string[][] = [];
  let row: string[] = [], cell = '', inQ = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (inQ) {
      if (ch === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else inQ = false; } else cell += ch;
    } else if (ch === '"' && cell === '') inQ = true;
    else if (ch === sep) { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

const ALIAS: Record<string, string> = {
  freezer: 'freezer', tank: 'freezer', rack: 'rack', tower: 'rack', shelf: 'rack', box: 'box', boxname: 'box', boxsize: 'box_size', size: 'box_size',
  position: 'position', pos: 'position', place: 'position', slot: 'position', well: 'position',
  line: 'line', cellline: 'line', sample: 'line', passage: 'passage', p: 'passage',
  datefrozen: 'date_frozen', frozen: 'date_frozen', date: 'date_frozen', frozenon: 'date_frozen',
  cellspervial: 'cells_per_vial', cellcount: 'cells_per_vial', medium: 'medium', freezingmedium: 'medium',
  frozenby: 'frozen_by', who: 'frozen_by', by: 'frozen_by', notes: 'notes', note: 'notes', comments: 'notes',
  status: 'status', datethawed: 'date_thawed', thawed: 'date_thawed', thawedby: 'thawed_by', thawnotes: 'thaw_notes', thawnote: 'thaw_notes',
};
/** Map a header row to our column names; unknown columns are left out. */
export function headerMap(head: string[]): (string | null)[] {
  const seen = new Set<string>();
  return head.map((h) => { const k = ALIAS[h.toLowerCase().replace(/[^a-z]/g, '')] ?? null; if (!k || seen.has(k)) return null; seen.add(k); return k; });
}

export type ImportResult = { added: number; boxes: number; thawed: number; errors: string[] };
type Row = Record<string, string>;

/** Add rows (column name → text) to an inventory: boxes are made as needed, each vial needs a free place. */
export function importRows(inv: Inventory, rows: { row: Row; line: number }[]): ImportResult {
  const res: ImportResult = { added: 0, boxes: 0, thawed: 0, errors: [] };
  const err = (n: number, m: string) => { res.errors.push(`Line ${n}: ${m}`); };
  for (const { row, line: n } of rows) {
    const get = (k: string) => clean(row[k]);
    const freezer = get('freezer') || 'Freezer', rack = get('rack') || 'Rack', name = get('box') || 'Box';
    let size: [number, number] | null = null;
    if (get('box_size')) {
      const m = /^(\d{1,2})\s*[x×*]\s*(\d{1,2})$/i.exec(get('box_size')) ?? /^(\d{1,2})$/.exec(get('box_size'));
      const r = m ? Number(m[1]) : NaN, c = m ? Number(m[2] ?? m[1]) : NaN;
      if (!(r >= 1 && r <= MAX_SIDE && c >= 1 && c <= MAX_SIDE)) { err(n, `box size "${get('box_size')}" should look like 9x9 or 10x10.`); continue; }
      size = [r, c];
    }
    let box = findBox(inv, freezer, rack, name);
    if (box && size && (box.rows !== size[0] || box.cols !== size[1])) { err(n, `${name} is ${box.rows}x${box.cols}, not ${size[0]}x${size[1]}.`); continue; }
    const status = get('status').toLowerCase();
    if (!get('line') && (status === 'empty box' || !get('position'))) {
      if (!box) { box = addBox(inv, { freezer, rack, name, rows: size?.[0] ?? 9, cols: size?.[1] ?? size?.[0] ?? 9 }); res.boxes++; }
      continue;
    }
    const passageText = get('passage').replace(/^p/i, ''), cellsText = get('cells_per_vial');
    const passage = passageText ? Number(passageText) : null, cells = cellsText ? num(cellsText) : null;
    const thawedDate = get('date_thawed'), thawedNow = !!thawedDate || status === 'thawed';
    const f: VialFields = { line: get('line'), passage, frozen: get('date_frozen'), cells, medium: get('medium'), who: get('frozen_by'), note: get('notes') };
    try { checkFields(f); } catch (e) { err(n, (e as Error).message); continue; }
    if (thawedNow && !isDate(thawedDate)) { err(n, 'a thawed vial needs its thaw date as YYYY-MM-DD.'); continue; }
    if (thawedNow && thawedDate < f.frozen) { err(n, 'the thaw date is before the date frozen.'); continue; }
    const probe = box ?? { rows: size?.[0] ?? 9, cols: size?.[1] ?? size?.[0] ?? 9 };
    const p = parsePos(get('position'), probe);
    if (!p) { err(n, `"${get('position')}" is not a place in a ${probe.rows}x${probe.cols} box (A1 to ${posName(probe.rows - 1, probe.cols - 1)}).`); continue; }
    const pos = posName(p.r, p.c);
    if (box && !thawedNow) { const there = occupancy(inv, box.id).get(pos); if (there) { err(n, `${pos} in ${name} already holds ${there.line}.`); continue; } }
    if (!box) { box = addBox(inv, { freezer, rack, name, rows: probe.rows, cols: probe.cols }); res.boxes++; }
    const v: Vial = { id: uid(inv, 'v'), box: box.id, pos, ...fields(f) };
    if (thawedNow) { Object.assign(v, { thawed: thawedDate, thawBy: get('thawed_by'), thawNote: get('thaw_notes'), place: `${boxLabel(box)} › ${pos}` }); res.thawed++; }
    inv.vials.push(v);
    res.added++;
  }
  return res;
}

/** Read a CSV (or TSV) export back in, adding to `inv`. The first row must name the columns. */
export function importCsv(inv: Inventory, text: string): ImportResult {
  const rows = parseCsv(text);
  if (rows.length < 2) return { added: 0, boxes: 0, thawed: 0, errors: ['The file needs a header row and at least one row of vials.'] };
  const map = headerMap(rows[0]);
  if (!map.includes('line') || !map.includes('position')) return { added: 0, boxes: 0, thawed: 0, errors: ['The first row must name the columns, with at least "line" and "position" (as in a CSV saved from this page).'] };
  return importRows(inv, rows.slice(1).map((r, i) => ({ row: Object.fromEntries(map.map((k, j) => [k ?? '', r[j] ?? ''] as const).filter(([k]) => k)), line: i + 2 })));
}

export const JSON_FORMAT = 'fibub-cryovial-inventory';
/** The whole inventory as JSON (boxes, then vials with their place written out so the file reads on its own). */
export function toJson(inv: Inventory): string {
  const boxes = sortedBoxes(inv);
  return JSON.stringify({
    format: JSON_FORMAT, version: 1,
    boxes: boxes.map((b) => ({ freezer: b.freezer, rack: b.rack, box: b.name, rows: b.rows, cols: b.cols })),
    vials: inv.vials.map((v) => {
      const b = inv.boxes.find((x) => x.id === v.box), parts = (v.place ?? '').split(' › ');
      return { freezer: b ? b.freezer : parts[0] ?? '', rack: b ? b.rack : parts[1] ?? '', box: b ? b.name : parts[2] ?? '', position: v.pos, line: v.line, passage: v.passage, date_frozen: v.frozen, cells_per_vial: v.cells, medium: v.medium, frozen_by: v.who, notes: v.note, ...(v.thawed ? { date_thawed: v.thawed, thawed_by: v.thawBy ?? '', thaw_notes: v.thawNote ?? '' } : {}) };
    }),
  }, null, 1) + '\n';
}
export function importJson(inv: Inventory, text: string): ImportResult {
  let d: any;
  try { d = JSON.parse(text); } catch { return { added: 0, boxes: 0, thawed: 0, errors: ['This is not a JSON file this page can read.'] }; }
  if (!d || d.format !== JSON_FORMAT || !Array.isArray(d.vials)) return { added: 0, boxes: 0, thawed: 0, errors: ['This JSON file was not saved from the cryovial inventory page.'] };
  const res: ImportResult = { added: 0, boxes: 0, thawed: 0, errors: [] };
  for (const [i, b] of (Array.isArray(d.boxes) ? d.boxes : []).entries()) {
    if (!b || findBox(inv, b.freezer ?? '', b.rack ?? '', b.box ?? '')) continue;
    try { addBox(inv, { freezer: b.freezer, rack: b.rack, name: b.box, rows: b.rows, cols: b.cols }); res.boxes++; } catch (e) { res.errors.push(`Box ${i + 1}: ${(e as Error).message}`); }
  }
  const str = (x: unknown) => (x == null ? '' : String(x));
  const rows = d.vials.map((v: any, i: number) => {
    const b = findBox(inv, str(v?.freezer), str(v?.rack), str(v?.box));
    const row: Row = {};
    for (const k of CSV_HEAD) row[k] = str(v?.[k]);
    if (b) row.box_size = `${b.rows}x${b.cols}`;
    return { row, line: i + 1 };
  });
  const r = importRows(inv, rows);
  return { added: r.added, boxes: res.boxes + r.boxes, thawed: r.thawed, errors: [...res.errors, ...r.errors.map((e) => e.replace(/^Line/, 'Vial'))] };
}

// ---------- Freezing helper ----------
export type FreezeIn = {
  vials: number; cellsPerVial: number; mlPerVial: number; dmsoPct: number; serumPct: number; extraPct: number;
  /** Optional: the count of the cell suspension you have now. */
  countPerMl?: number; suspMl?: number;
  startC?: number; endC?: number; rateCPerMin?: number;
};
export type FreezeOut = {
  cellsInVials: number; cellsNeeded: number; conc: number;
  totalMl: number; dmsoMl: number; serumMl: number; mediumMl: number;
  haveCells: number; spinMl: number; maxVials: number; enough: boolean | null;
  coolMin: number; mix: string; warn: string[];
};
/** Cells and freezing medium for N vials. All cells are resuspended at cellsPerVial / mlPerVial, with `extraPct` more medium (and cells) for pipetting loss. */
export function freezePlan(p: FreezeIn): FreezeOut {
  const { vials, cellsPerVial: cpv, mlPerVial: ml, dmsoPct: d, serumPct: s, extraPct: x } = p;
  if (!(Number.isInteger(vials) && vials >= 1)) throw new Error('The number of vials is a whole number, 1 or more.');
  if (!(cpv > 0)) throw new Error('Type the cells per vial (above 0), for example 1e6.');
  if (!(ml > 0)) throw new Error('Type the volume per vial in mL (above 0).');
  if (!(d >= 0 && d < 100)) throw new Error('DMSO is a percentage from 0 to below 100.');
  if (!(s >= 0 && s <= 100)) throw new Error('Serum is a percentage from 0 to 100.');
  if (d + s > 100) throw new Error('DMSO and serum together cannot be more than 100 %.');
  if (!(x >= 0 && x <= 100)) throw new Error('The extra is a percentage from 0 to 100.');
  const k = 1 + x / 100, totalMl = vials * ml * k, conc = cpv / ml;
  const out: FreezeOut = {
    cellsInVials: vials * cpv, cellsNeeded: vials * cpv * k, conc, totalMl,
    dmsoMl: totalMl * d / 100, serumMl: totalMl * s / 100, mediumMl: totalMl * (100 - d - s) / 100,
    haveCells: NaN, spinMl: NaN, maxVials: NaN, enough: null, coolMin: NaN, mix: mixName(d, s), warn: [],
  };
  if (p.countPerMl !== undefined && Number.isFinite(p.countPerMl)) {
    if (!(p.countPerMl > 0)) throw new Error('The cell count must be above 0 cells per mL.');
    out.spinMl = out.cellsNeeded / p.countPerMl;
    if (p.suspMl !== undefined && Number.isFinite(p.suspMl)) {
      if (!(p.suspMl > 0)) throw new Error('The volume of cell suspension must be above 0 mL.');
      out.haveCells = p.countPerMl * p.suspMl;
      out.maxVials = Math.floor(out.haveCells / (cpv * k) + 1e-9);
      out.enough = out.haveCells >= out.cellsNeeded * (1 - 1e-12);
      if (!out.enough) out.warn.push(`You have ${round3(out.haveCells)} cells: enough for ${out.maxVials} vial${out.maxVials === 1 ? '' : 's'} at this density, not ${vials}.`);
    }
  }
  const a = p.startC ?? 20, b = p.endC ?? -80, r = p.rateCPerMin ?? 1;
  if (!(r > 0)) throw new Error('The cooling rate must be above 0 °C per minute.');
  if (!(a > b)) throw new Error('The start temperature must be above the end temperature.');
  out.coolMin = (a - b) / r;
  if (d > 15) out.warn.push('More than 15 % DMSO is unusual for freezing cells; check your protocol.');
  if (d === 0) out.warn.push('No DMSO (or other cryoprotectant) in the mix: most cells do not survive freezing without one.');
  if (ml > 1.8) out.warn.push('More than 1.8 mL per vial: check the fill line on your vials and leave room for the liquid to expand.');
  return out;
}
const round3 = (n: number) => Number(n.toPrecision(3)).toLocaleString('en-US');
/** "70 % medium, 20 % serum, 10 % DMSO" (parts that are 0 % are left out). */
export function mixName(dmso: number, serum: number): string {
  const m = +(100 - dmso - serum).toFixed(2), parts: string[] = [];
  if (m > 0) parts.push(`${m} % medium`);
  if (serum > 0) parts.push(`${+serum.toFixed(2)} % serum`);
  if (dmso > 0) parts.push(`${+dmso.toFixed(2)} % DMSO`);
  return parts.join(', ');
}
/** The usual steps after freezing, with dates: into a cooling container, then long-term storage, then a test thaw. */
export function freezeSchedule(date: string, moveAfterH: number, testAfterD: number): { date: string; what: string }[] {
  if (!isDate(date)) throw new Error('Type the freezing date as YYYY-MM-DD.');
  if (!(moveAfterH >= 0)) throw new Error('Type the hours before moving the vials to long-term storage (0 or more).');
  if (!(testAfterD >= 0)) throw new Error('Type the days before the test thaw (0 or more).');
  return [
    { date, what: 'Freeze: vials into a slow-cooling container in the −80 °C freezer.' },
    { date: addDays(date, Math.floor(moveAfterH / 24)), what: `Move the vials to long-term storage (${moveAfterH} h after freezing) and note their places here.` },
    { date: addDays(date, testAfterD), what: 'Test thaw one vial to check the cells recover; log it here.' },
  ];
}

// ---------- A made-up example ----------
export function example(): Inventory {
  const inv = newInventory();
  const b1 = addBox(inv, { freezer: 'LN2 tank 1', rack: 'Rack 3', name: 'Box 1', rows: 9 });
  const b2 = addBox(inv, { freezer: '−80 °C freezer B', rack: 'Shelf 2', name: 'Box 7', rows: 10 });
  addVials(inv, b1.id, 'A1', 6, { line: 'Fibro-A', passage: 5, frozen: '2026-03-12', cells: 1e6, medium: '90 % serum, 10 % DMSO', who: 'SK', note: 'Master stock' });
  addVials(inv, b1.id, 'A7', 4, { line: 'Fibro-A', passage: 8, frozen: '2026-06-02', cells: 2e6, medium: '90 % serum, 10 % DMSO', who: 'SK', note: '' });
  const c = addVials(inv, b1.id, 'C1', 5, { line: 'Clone 3B', passage: 12, frozen: '2026-08-20', cells: 5e6, medium: '70 % medium, 20 % serum, 10 % DMSO', who: 'RM', note: 'Selected clone' });
  const k = addVials(inv, b2.id, 'A1', 8, { line: 'Line K-9', passage: 3, frozen: '2026-10-15', cells: 3e6, medium: '70 % medium, 20 % serum, 10 % DMSO', who: 'JT', note: '' });
  thaw(inv, [c[2].id], '2026-10-01', 'RM', 'Recovered well');
  thaw(inv, [k[0].id], '2026-11-02', 'JT', 'Test thaw');
  return inv;
}
