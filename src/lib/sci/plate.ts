// Microplate layouts: well names, and placing standards, samples, controls and blanks with
// replicates, in row or column order, optionally keeping the edge wells empty (edge effects).

export const PLATES: Record<number, [number, number]> = { 6: [2, 3], 12: [3, 4], 24: [4, 6], 48: [6, 8], 96: [8, 12], 384: [16, 24], 1536: [32, 48] };
/** Row letters: A..Z, then AA, AB, ... (1536-well plates have 32 rows). */
export const rowName = (r: number) => (r < 26 ? String.fromCharCode(65 + r) : 'A' + String.fromCharCode(65 + r - 26));
export const wellName = (r: number, c: number) => `${rowName(r)}${c + 1}`;

export type Kind = 'standard' | 'sample' | 'control' | 'blank';
export type Group = { kind: Kind; names: string[]; reps: number };
export type Well = { r: number; c: number; name: string; kind?: Kind; content?: string; rep?: number };
export type Options = { size: number; byColumn: boolean; repsAcross: boolean; skipEdge: boolean; skip: Set<string> };

/** The wells in fill order, without the edge or hand-picked empty wells. */
export function order(o: Options): Well[] {
  const [R, C] = PLATES[o.size];
  const out: Well[] = [];
  const outer = (o.byColumn ? C : R), inner = (o.byColumn ? R : C);
  for (let a = 0; a < outer; a++) for (let b = 0; b < inner; b++) {
    const r = o.byColumn ? b : a, c = o.byColumn ? a : b;
    const edge = r === 0 || c === 0 || r === R - 1 || c === C - 1;
    const name = wellName(r, c);
    if ((o.skipEdge && edge && R > 2 && C > 2) || o.skip.has(name)) continue;
    out.push({ r, c, name });
  }
  return out;
}

/**
 * Lay out the groups. Replicates sit next to each other: along the fill direction, or (repsAcross)
 * in a block across it, so a triplicate in row order fills A1, B1, C1. Returns every well of the plate.
 */
export function layout(groups: Group[], o: Options): { wells: Well[]; placed: number; needed: number } {
  const [R, C] = PLATES[o.size];
  const all: Well[] = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) all.push({ r, c, name: wellName(r, c) });
  const items: { kind: Kind; content: string; rep: number }[][] = [];
  for (const g of groups) for (const n of g.names) items.push(Array.from({ length: Math.max(1, g.reps) }, (_, i) => ({ kind: g.kind, content: n, rep: i + 1 })));
  const needed = items.reduce((s, x) => s + x.length, 0);
  const free = order(o), byName = new Map(all.map((w) => [w.name, w]));
  let placed = 0;
  if (!o.repsAcross) {
    const flat = items.flat();
    for (let i = 0; i < Math.min(flat.length, free.length); i++) { Object.assign(byName.get(free[i].name)!, flat[i]); placed++; }
  } else {
    // Blocks: replicates go across the fill direction (down a column when filling by rows).
    const used = new Set<string>();
    const isFree = new Set(free.map((w) => w.name));
    for (const set of items) {
      const start = free.find((w) => !used.has(w.name) && set.every((_, k) => { const r = o.byColumn ? w.r : w.r + k, c = o.byColumn ? w.c + k : w.c; return r < R && c < C && isFree.has(wellName(r, c)) && !used.has(wellName(r, c)); }));
      if (!start) break;
      set.forEach((it, k) => { const n = o.byColumn ? wellName(start.r, start.c + k) : wellName(start.r + k, start.c); used.add(n); Object.assign(byName.get(n)!, it); placed++; });
    }
  }
  return { wells: all, placed, needed };
}

/** Names from a list: one per line or comma-separated; "S1-S8" or "1-8" expands to a numbered run. */
export function names(text: string): string[] {
  const out: string[] = [];
  for (const part of text.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean)) {
    const m = /^([^\d-]*)(\d+)\s*[-–]\s*\1?(\d+)$/.exec(part);
    if (m && Number(m[3]) >= Number(m[2]) && Number(m[3]) - Number(m[2]) < 2000) for (let i = Number(m[2]); i <= Number(m[3]); i++) out.push(`${m[1]}${i}`);
    else out.push(part);
  }
  return out;
}
