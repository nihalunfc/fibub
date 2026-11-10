// Label sheets: layouts, splitting the typed list into labels, and the PDF (pdf-lib). All sizes in mm.
import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';

export type Sheet = { id: string; name: string; pageW: number; pageH: number; cols: number; rows: number; w: number; h: number; left: number; top: number; gapX: number; gapY: number };
const IN = 25.4;
export const SHEETS: Sheet[] = [
  { id: 'l30', name: 'Letter, 30 labels (5160 size, 2.625 x 1 in)', pageW: 8.5 * IN, pageH: 11 * IN, cols: 3, rows: 10, w: 2.625 * IN, h: IN, left: 0.1875 * IN, top: 0.5 * IN, gapX: 0.125 * IN, gapY: 0 },
  { id: 'a21', name: 'A4, 21 labels (63.5 x 38.1 mm)', pageW: 210, pageH: 297, cols: 3, rows: 7, w: 63.5, h: 38.1, left: 7.21, top: 15.15, gapX: 2.54, gapY: 0 },
  { id: 'a65', name: 'A4, 65 labels (38.1 x 21.2 mm)', pageW: 210, pageH: 297, cols: 5, rows: 13, w: 38.1, h: 21.2, left: 4.7, top: 10.7, gapX: 2.5, gapY: 0 },
  { id: 'l10', name: 'Letter, 10 shipping labels (4 x 2 in)', pageW: 8.5 * IN, pageH: 11 * IN, cols: 2, rows: 5, w: 4 * IN, h: 2 * IN, left: 0.15625 * IN, top: 0.5 * IN, gapX: 0.1875 * IN, gapY: 0 },
  { id: 'custom', name: 'Custom grid', pageW: 210, pageH: 297, cols: 2, rows: 4, w: 90, h: 60, left: 10, top: 20, gapX: 5, gapY: 5 },
];

/** Turn the typed text into labels. mode 'line': one label per line, commas start a new line on the label.
 *  mode 'block': labels separated by a blank line. Lines are kept. */
export function splitLabels(text: string, mode: 'line' | 'block', headerRow = false): string[][] {
  const t = text.replace(/\r\n?/g, '\n');
  if (mode === 'block') return t.split(/\n\s*\n/).map((b) => b.split('\n').map((s) => s.trim()).filter(Boolean)).filter((l) => l.length);
  let rows = t.split('\n').filter((l) => l.trim());
  if (headerRow) rows = rows.slice(1);
  return rows.map((r) => parseCsvLine(r).map((s) => s.trim()).filter(Boolean)).filter((l) => l.length);
}
export function parseCsvLine(line: string): string[] {
  const out: string[] = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === ',' || c === '\t') { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur); return out;
}
export const perPage = (s: Sheet) => s.cols * s.rows;
/** Number of pages for n labels, with `skip` spots already used on the first sheet. */
export const pageCount = (s: Sheet, n: number, skip: number) => Math.max(1, Math.ceil((n + skip) / perPage(s)));

const mm = (v: number) => (v * 72) / 25.4;
function safe(font: PDFFont, s: string, lost: Set<string>) {
  let o = '';
  for (const ch of s) { try { font.encodeText(ch); o += ch; } catch { lost.add(ch); o += '?'; } }
  return o;
}
export type LabelOpts = { size: number; align: 'left' | 'center'; borders: boolean; skip: number; copies: number; boldFirst: boolean };

export async function labelsPdf(s: Sheet, labels: string[][], o: LabelOpts) {
  const doc = await PDFDocument.create();
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const lost = new Set<string>();
  const all: (string[] | null)[] = Array(Math.max(0, o.skip)).fill(null);
  for (const l of labels) for (let c = 0; c < Math.max(1, o.copies); c++) all.push(l);
  const per = perPage(s), pages = Math.max(1, Math.ceil(all.length / per));
  for (let p = 0; p < pages; p++) {
    const page = doc.addPage([mm(s.pageW), mm(s.pageH)]);
    for (let k = 0; k < per; k++) {
      const lab = all[p * per + k]; const c = k % s.cols, r = Math.floor(k / s.cols);
      const x = mm(s.left + c * (s.w + s.gapX)), yTop = s.pageH - (s.top + r * (s.h + s.gapY));
      const bw = mm(s.w), bh = mm(s.h);
      if (o.borders) page.drawRectangle({ x, y: mm(yTop) - bh, width: bw, height: bh, borderColor: rgb(0.75, 0.75, 0.75), borderWidth: 0.4 });
      if (!lab) continue;
      const pad = mm(2.5), maxW = bw - 2 * pad, maxH = bh - 2 * mm(1.5);
      const lines = lab.map((t) => safe(reg, t, lost));
      let size = o.size;
      const fits = (z: number) => lines.every((t, i) => (o.boldFirst && i === 0 ? bold : reg).widthOfTextAtSize(t, z) <= maxW) && lines.length * z * 1.18 <= maxH;
      while (size > 4 && !fits(size)) size -= 0.5;
      const lh = size * 1.18, total = lines.length * lh;
      let y = mm(yTop) - (bh - total) / 2 - size * 0.92;
      lines.forEach((t, i) => {
        const f = o.boldFirst && i === 0 ? bold : reg, w = f.widthOfTextAtSize(t, size);
        page.drawText(t, { x: o.align === 'center' ? x + (bw - w) / 2 : x + pad, y, size, font: f, color: rgb(0, 0, 0) });
        y -= lh;
      });
    }
  }
  return { bytes: await doc.save(), pages, lost: [...lost] };
}
