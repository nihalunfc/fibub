// Turn the text pieces of a bank statement PDF into a table: rows by height (y), columns by gaps in x.
import { loadPdfJs } from './pdfpages';

export interface Piece { s: string; x: number; y: number; w: number; page: number }

/** Group pieces into lines: pieces whose y differs by less than `tol` share a line (top to bottom, pages in order). */
export function groupRows(pieces: Piece[], tol = 3): Piece[][] {
  const rows: Piece[][] = [];
  const pages = [...new Set(pieces.map((p) => p.page))].sort((a, b) => a - b);
  for (const pg of pages) {
    const ps = pieces.filter((p) => p.page === pg && p.s.trim()).sort((a, b) => b.y - a.y || a.x - b.x);
    let cur: Piece[] = [];
    for (const p of ps) {
      if (cur.length && Math.abs(cur[0].y - p.y) > tol) { rows.push(cur.sort((a, b) => a.x - b.x)); cur = []; }
      cur.push(p);
    }
    if (cur.length) rows.push(cur.sort((a, b) => a.x - b.x));
  }
  return rows;
}

/** Join pieces closer than `gap` (words of one cell) into cells: [{s, x, end}]. */
export function cellsOf(row: Piece[], gap = 6) {
  const cells: { s: string; x: number; end: number }[] = [];
  for (const p of row) {
    const last = cells[cells.length - 1];
    if (last && p.x - last.end < gap) { last.s += (p.x - last.end > 0.5 || /\s$/.test(last.s) ? ' ' : '') + p.s.trim(); last.end = p.x + p.w; }
    else cells.push({ s: p.s.trim(), x: p.x, end: p.x + p.w });
  }
  return cells;
}

/** Column start positions: x values where cells begin, merged when within `tol` points, kept when used by enough rows. */
export function findColumns(rows: Piece[][], tol = 8): number[] {
  const starts: number[] = [];
  const all = rows.map((r) => cellsOf(r));
  for (const cells of all) for (const c of cells) starts.push(c.x);
  starts.sort((a, b) => a - b);
  const groups: number[][] = [];
  for (const x of starts) { const g = groups[groups.length - 1]; if (g && x - g[g.length - 1] <= tol) g.push(x); else groups.push([x]); }
  const need = Math.max(2, Math.ceil(all.length * 0.25));
  return groups.filter((g) => g.length >= need).map((g) => Math.round(Math.min(...g) - 1));
}

/** Cut each row at the column starts. A cell belongs to the last column that starts at or before it. */
export function toTable(rows: Piece[][], cols: number[]): string[][] {
  const edges = [...cols].sort((a, b) => a - b);
  return rows.map((r) => {
    const out = edges.map(() => '');
    for (const c of cellsOf(r)) {
      let i = 0; for (let k = 0; k < edges.length; k++) if (c.x >= edges[k] - 1) i = k;
      out[i] = out[i] ? out[i] + ' ' + c.s : c.s;
    }
    return out;
  });
}

/** Read every page of a PDF into text pieces with their positions. */
export async function readPieces(bytes: Uint8Array): Promise<Piece[]> {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise;
  const out: Piece[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const tc = await (await doc.getPage(i)).getTextContent();
    for (const it of tc.items as any[]) if (it.str && it.str.trim()) out.push({ s: it.str, x: it.transform[4], y: it.transform[5], w: it.width, page: i });
  }
  return out;
}
