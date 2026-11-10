// Draw the things a visitor placed (pictures, text, ticks) onto the real PDF pages with pdf-lib.
// Everything is drawn into the page itself ("flattened"), so it cannot be moved afterwards.
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { pageGeometry, shownSize, toPdfPoint, type Item } from './pdfview';

export class EncryptedError extends Error {}

export async function loadForEdit(bytes: Uint8Array): Promise<PDFDocument> {
  try { return await PDFDocument.load(bytes, { updateMetadata: false }); }
  catch (e: any) {
    if (/encrypt/i.test(String(e?.message))) throw new EncryptedError('encrypted');
    throw e;
  }
}

function textToPng(text: string, px: number): { url: string; w: number; h: number } {
  const c = document.createElement('canvas'), g = c.getContext('2d')!;
  g.font = `${px}px system-ui, sans-serif`;
  c.width = Math.ceil(g.measureText(text).width) + 4; c.height = Math.ceil(px * 1.3);
  g.font = `${px}px system-ui, sans-serif`; g.textBaseline = 'alphabetic'; g.fillStyle = '#000';
  g.fillText(text, 2, px);
  return { url: c.toDataURL('image/png'), w: c.width, h: c.height };
}

export async function drawItems(doc: PDFDocument, items: Item[]) {
  const pages = doc.getPages();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const cache = new Map<string, any>();
  for (const it of items) {
    const page = pages[it.page]; if (!page) continue;
    const g = pageGeometry(page), sz = shownSize(g);
    const P = (fx: number, fy: number) => toPdfPoint(g, fx, fy);
    if (it.src) {
      let img = cache.get(it.src);
      if (!img) { img = await doc.embedPng(it.src); cache.set(it.src, img); }
      const a = P(it.fx, it.fy + it.fh);
      page.drawImage(img, { x: a.x, y: a.y, width: it.fw * sz.w, height: it.fh * sz.h, rotate: degrees(g.rot) });
    } else if (it.kind === 'tick') {
      const pts = [[0.15, 0.55], [0.4, 0.82], [0.88, 0.18]].map(([u, t]) => P(it.fx + u * it.fw, it.fy + t * it.fh));
      const thick = Math.max(1, it.fh * sz.h * 0.11);
      for (let i = 0; i < 2; i++) page.drawLine({ start: pts[i], end: pts[i + 1], thickness: thick, color: rgb(0, 0, 0) });
    } else if (it.text) {
      const size = Math.max(4, it.fh * sz.h * 0.8);
      const a = P(it.fx, it.fy + it.fh * 0.86);
      let ok = true;
      try { font.widthOfTextAtSize(it.text, size); } catch { ok = false; }
      if (ok) page.drawText(it.text, { x: a.x, y: a.y, size, font, color: rgb(0, 0, 0), rotate: degrees(g.rot) });
      else {
        // Letters Helvetica does not have (for example Arabic or rupee signs): draw them as a picture.
        const t = textToPng(it.text, 64), img = await doc.embedPng(t.url), h = it.fh * sz.h, w = h * (t.w / t.h);
        const b = P(it.fx, it.fy + it.fh);
        page.drawImage(img, { x: b.x, y: b.y, width: w, height: h, rotate: degrees(g.rot) });
      }
    }
  }
}
