// Plain PDF page helpers for organise-pdf, page-numbers and watermark-pdf. Everything runs in the browser.
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
export { loadPdfJs } from '../compress/pdf';

/** "1-3,5" -> [[0,1,2],[4]] (0-based). Each comma part is one group. Throws a plain message on bad input. */
export function parseRanges(text: string, n: number): number[][] {
  const groups: number[][] = [];
  for (const part of text.split(',').map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`"${part}" is not a page or range such as 3 or 2-5.`);
    const a = Number(m[1]), b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b < 1 || a > n || b > n) throw new Error(`Page ${Math.max(a, b)} is outside 1 to ${n}.`);
    const g: number[] = [];
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) g.push(i - 1);
    groups.push(g);
  }
  if (!groups.length) throw new Error('Type the pages you want, such as 1-3,5.');
  return groups;
}

export interface PageRef { src: number; index: number; rot: number }

/** Build one PDF from pages of several source files, each with an extra rotation. */
export async function buildPdf(sources: Uint8Array[], pages: PageRef[]): Promise<Uint8Array> {
  const docs = new Map<number, PDFDocument>();
  const out = await PDFDocument.create();
  for (const p of pages) {
    if (p.src < 0) { out.addPage([595.28, 841.89]); continue; } // src -1 = a blank A4 page
    let d = docs.get(p.src);
    if (!d) { d = await PDFDocument.load(sources[p.src], { ignoreEncryption: true }); docs.set(p.src, d); }
    const [cp] = await out.copyPages(d, [p.index]);
    if (p.rot) cp.setRotation(degrees((cp.getRotation().angle + p.rot) % 360));
    out.addPage(cp);
  }
  return out.save();
}

export async function pageCount(bytes: Uint8Array): Promise<number> {
  return (await PDFDocument.load(bytes, { ignoreEncryption: true })).getPageCount();
}

export function download(bytes: Uint8Array | Blob, name: string, type = 'application/pdf') {
  const blob = bytes instanceof Blob ? bytes : new Blob([bytes as BlobPart], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export const baseName = (name: string) => name.replace(/\.[^.]+$/, '');

/** Helvetica only draws Latin letters; say so plainly instead of failing. */
export function latinOnly(text: string): string {
  if (/[^ -~ -ÿ]/.test(text)) throw new Error('Only Latin letters, numbers and common symbols can be drawn on a PDF here.');
  return text;
}

export function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

// ---- page numbers ----
export type NumPos = 'bl' | 'bc' | 'br' | 'tl' | 'tc' | 'tr';
export interface NumberOpts {
  mode: 'numbers' | 'bates'; pos: NumPos; style: 'n' | 'page' | 'pageof'; start: number; skip: number; size: number;
  header: string; footer: string; file: string; date: string; prefix: string; digits: number;
  /** Optional extras: number look, margin from the page edge (points), leave the last pages unnumbered, outside corners on facing pages. */
  fmt?: 'arabic' | 'roman' | 'ROMAN' | 'alpha'; margin?: number; skipEnd?: number; mirror?: boolean;
}

/** 1 -> "i" / "I" / "a" depending on fmt. Falls back to digits for 0 and negatives. */
export function formatNumber(n: number, fmt: NumberOpts['fmt'] = 'arabic'): string {
  if (!fmt || fmt === 'arabic' || n < 1) return String(n);
  if (fmt === 'alpha') { let s = '', k = n; while (k > 0) { k--; s = String.fromCharCode(97 + (k % 26)) + s; k = Math.floor(k / 26); } return s; }
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let r = '', k = n; for (const [v, t] of map) while (k >= v) { r += t; k -= v; }
  return fmt === 'roman' ? r.toLowerCase() : r;
}
export function labelFor(o: NumberOpts, value: number, last: number): string {
  if (o.mode === 'bates') return o.prefix + String(value).padStart(o.digits, '0');
  const a = formatNumber(value, o.fmt), z = formatNumber(last, o.fmt);
  return o.style === 'n' ? a : o.style === 'page' ? `Page ${a}` : `Page ${a} of ${z}`;
}
const fill = (t: string, o: NumberOpts) => t.replace(/\{date\}/g, o.date).replace(/\{file\}/g, o.file);

export async function addPageNumbers(bytes: Uint8Array, o: NumberOpts): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const numbered = Math.max(0, pages.length - o.skip - (o.skipEnd || 0));
  const last = o.start + numbered - 1;
  const margin = Math.max(10, o.margin ?? 28), s = o.size;
  const draw = (page: any, text: string, h: 'l' | 'c' | 'r', top: boolean, lift: number) => {
    latinOnly(text);
    const { width, height } = page.getSize(), w = font.widthOfTextAtSize(text, s);
    const x = h === 'l' ? margin : h === 'r' ? width - margin - w : (width - w) / 2;
    const y = top ? height - margin - s - lift : margin + lift;
    page.drawText(text, { x, y, size: s, font, color: rgb(0.1, 0.1, 0.1) });
  };
  pages.forEach((page, i) => {
    const top = o.pos[0] === 't';
    let h = o.pos[1] as 'l' | 'c' | 'r';
    // Facing pages: the number sits on the outside edge (right on odd pages, left on even pages).
    if (o.mirror && h !== 'c' && i % 2 === 1) h = h === 'l' ? 'r' : 'l';
    if (i >= o.skip && i < pages.length - (o.skipEnd || 0)) draw(page, labelFor(o, o.start + i - o.skip, last), h, top, 0);
    // Header and footer text sit in the middle; they move in if a number is already there.
    if (o.header.trim()) draw(page, fill(o.header, o), 'c', true, o.pos === 'tc' && i >= o.skip ? s * 1.6 : 0);
    if (o.footer.trim()) draw(page, fill(o.footer, o), 'c', false, o.pos === 'bc' && i >= o.skip ? s * 1.6 : 0);
  });
  return doc.save();
}

// ---- watermark ----
export interface MarkOpts {
  kind: 'text' | 'stamp'; text: string; opacity: number; angle: number; size: number; color: string;
  stamp: string; stampCorner: 'tl' | 'tr' | 'bl' | 'br'; date: string; pages: number[] | null;
  /** Repeat the words in a grid over the whole page (optional). */
  tile?: boolean;
}
export async function watermarkPdf(bytes: Uint8Array, o: MarkOpts): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const col = hexToRgb(o.color);
  doc.getPages().forEach((page, i) => {
    if (o.pages && !o.pages.includes(i)) return;
    const { width, height } = page.getSize();
    if (o.kind === 'text') {
      const t = latinOnly(o.text), w = font.widthOfTextAtSize(t, o.size), th = o.size * 0.7, a = (o.angle * Math.PI) / 180;
      // Place the text so its middle lands on the middle of the page, whatever the angle.
      const at = (cx: number, cy: number) => {
        const x = cx - (w / 2) * Math.cos(a) + (th / 2) * Math.sin(a);
        const y = cy - (w / 2) * Math.sin(a) - (th / 2) * Math.cos(a);
        page.drawText(t, { x, y, size: o.size, font, color: col, opacity: o.opacity, rotate: degrees(o.angle) });
      };
      if (o.tile) {
        const gx = w * 1.5, gy = o.size * 3, n = Math.ceil(Math.hypot(width, height) / Math.min(gx, gy));
        for (let r = -n; r <= n; r++) for (let c = -n; c <= n; c++) {
          const cx = width / 2 + c * gx + (r % 2 ? gx / 2 : 0), cy = height / 2 + r * gy;
          if (cx > -w && cx < width + w && cy > -w && cy < height + w) at(cx, cy);
        }
      } else at(width / 2, height / 2);
    } else {
      const t = latinOnly(`${o.stamp.toUpperCase()}  ${o.date}`), s = 16, w = font.widthOfTextAtSize(t, s), pad = 8, m = 24;
      const x = o.stampCorner[1] === 'l' ? m : width - m - w - pad * 2;
      const y = o.stampCorner[0] === 'b' ? m : height - m - s - pad * 2;
      page.drawRectangle({ x, y, width: w + pad * 2, height: s + pad * 2, borderColor: col, borderWidth: 2, opacity: o.opacity, borderOpacity: o.opacity });
      page.drawText(t, { x: x + pad, y: y + pad + 2, size: s, font, color: col, opacity: o.opacity });
    }
  });
  return doc.save();
}

/** "1,3-5,9" -> sorted unique 0-based indexes (one flat list). */
export function pickPages(text: string, n: number): number[] {
  return [...new Set(parseRanges(text, n).flat())].sort((a, b) => a - b);
}
