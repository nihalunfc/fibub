// Pull plain text out of a PDF, a Word file or a text file, in the browser.
import { unzipSync, strFromU8 } from 'fflate';
import { loadPdfJs } from './pdfpages';
import type { Diff } from './textdiff';

const decode = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');

export function docxText(bytes: Uint8Array): string {
  const files = unzipSync(bytes, { filter: (f) => f.name === 'word/document.xml' });
  if (!files['word/document.xml']) throw new Error('This is not a Word (.docx) file.');
  const xml = strFromU8(files['word/document.xml']).replace(/<w:del\b[\s\S]*?<\/w:del>/g, '');
  return xml
    .replace(/<\/w:p>/g, '\n').replace(/<w:(?:br|cr)\s*\/>/g, '\n').replace(/<w:tab\s*\/>/g, ' ')
    .replace(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g, (_, t) => '\u0001' + t + '\u0002').replace(/<[^>]+>/g, '')
    .replace(/\u0002\u0001/g, '').replace(/[\u0001\u0002]/g, '').split('\n').map(decode).join('\n').trim();
}

export async function pdfText(bytes: Uint8Array): Promise<string> {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const tc = await (await doc.getPage(i)).getTextContent();
    let s = '';
    for (const it of tc.items as any[]) { s += it.str; if (it.hasEOL) s += '\n'; else if (it.str && !/\s$/.test(it.str)) s += ' '; }
    pages.push(s.trim());
  }
  return pages.join('\n\n');
}

export async function fileText(f: File): Promise<string> {
  const bytes = new Uint8Array(await f.arrayBuffer());
  if (bytes[0] === 0x25 && bytes[1] === 0x50) return pdfText(bytes);
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return docxText(bytes);
  return new TextDecoder().decode(bytes);
}

/** Draw the comparison as a PDF: green underline for new words, red strike for removed words. */
export async function redlinePdf(diff: Diff, titleA: string, titleB: string): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create(), font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595, H = 842, M = 50, size = 10.5, lh = 15, maxX = W - M;
  const clean = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/[^\x20-\x7e\xa0-\xff]/g, '?');
  let page = doc.addPage([W, H]), x = M, y = H - M;
  const newLine = () => { x = M; y -= lh; if (y < M) { page = doc.addPage([W, H]); y = H - M; } };
  const head = (t: string, f = bold, s = 12) => { page.drawText(clean(t), { x: M, y, size: s, font: f }); y -= lh + 3; };
  head('Document comparison'); head(`Original: ${titleA}`, font, size); head(`New: ${titleB}`, font, size);
  head(`${diff.changes} change${diff.changes === 1 ? '' : 's'}: ${diff.added} words added (green underline), ${diff.removed} words removed (red strike-through).`, font, size);
  y -= 6;
  const green = rgb(0.05, 0.5, 0.2), red = rgb(0.75, 0.1, 0.1), black = rgb(0, 0, 0);
  for (const op of diff.ops) {
    for (const w of op.words) {
      const txt = clean(w.w), width = font.widthOfTextAtSize(txt, size), sp = font.widthOfTextAtSize(' ', size);
      if (x + width > maxX && x > M) newLine();
      const color = op.t === 'ins' ? green : op.t === 'del' ? red : black;
      page.drawText(txt, { x, y, size, font, color });
      if (op.t === 'ins') page.drawLine({ start: { x, y: y - 2 }, end: { x: x + width, y: y - 2 }, thickness: 0.8, color });
      if (op.t === 'del') page.drawLine({ start: { x, y: y + size * 0.3 }, end: { x: x + width, y: y + size * 0.3 }, thickness: 0.8, color });
      x += width + sp;
      if (op.t !== 'del') for (let i = 0; i < w.nl; i++) newLine();
    }
  }
  return doc.save();
}
