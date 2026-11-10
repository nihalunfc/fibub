// Booklet maker: saddle-stitch booklet order, several pages per sheet, and poster tiles. Uses pdf-lib in the browser.
import { PDFDocument, StandardFonts, rgb, degrees, type PDFEmbeddedPage } from 'pdf-lib';

export type Paper = 'a4' | 'letter';
/** Sheet size in points, portrait. */
export const PAPER: Record<Paper, [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };
const MM = 72 / 25.4;

/** Pages padded up to a multiple of 4. */
export const padded = (n: number) => Math.max(4, Math.ceil(n / 4) * 4);

/**
 * Saddle-stitch order. Each side of a sheet has a left and a right page (0-based; -1 = blank).
 * Sides come out in print order: front of sheet 1, back of sheet 1, front of sheet 2, ...
 */
export function bookletSides(n: number): [number, number][] {
  const N = padded(n), sides: [number, number][] = [];
  const pg = (i: number) => (i < n ? i : -1);
  for (let s = 0; s < N / 4; s++) {
    sides.push([pg(N - 1 - 2 * s), pg(2 * s)]);
    sides.push([pg(2 * s + 1), pg(N - 2 - 2 * s)]);
  }
  return sides;
}

async function load(bytes: Uint8Array) { return PDFDocument.load(bytes, { ignoreEncryption: true }); }

/** Draw an embedded page to fit a box, centred, optionally with the whole sheet turned 180 degrees. */
function fit(page: ReturnType<PDFDocument['addPage']>, e: PDFEmbeddedPage, box: { x: number; y: number; w: number; h: number }, sheet: [number, number], turn: boolean, border: boolean) {
  const k = Math.min(box.w / e.width, box.h / e.height);
  const w = e.width * k, h = e.height * k;
  let x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
  if (turn) {
    x = sheet[0] - x - w; y = sheet[1] - y - h;
    page.drawPage(e, { x: x + w, y: y + h, width: w, height: h, rotate: degrees(180) });
  } else page.drawPage(e, { x, y, width: w, height: h });
  if (border) page.drawRectangle({ x, y, width: w, height: h, borderColor: rgb(0.6, 0.6, 0.6), borderWidth: 0.5 });
}

export type BookletOpts = { paper: Paper; flip: 'long' | 'short' };
export async function makeBooklet(bytes: Uint8Array, o: BookletOpts): Promise<{ bytes: Uint8Array; sheets: number; sides: number; blanks: number }> {
  const src = await load(bytes), n = src.getPageCount();
  const out = await PDFDocument.create();
  const emb = await out.embedPages(src.getPages());
  const [pw, ph] = PAPER[o.paper], W = ph, H = pw, m = 14;
  bookletSides(n).forEach(([l, r], i) => {
    const page = out.addPage([W, H]);
    const turn = o.flip === 'short' && i % 2 === 1;
    if (l >= 0) fit(page, emb[l], { x: m, y: m, w: W / 2 - m * 1.5, h: H - m * 2 }, [W, H], turn, false);
    if (r >= 0) fit(page, emb[r], { x: W / 2 + m * 0.5, y: m, w: W / 2 - m * 1.5, h: H - m * 2 }, [W, H], turn, false);
  });
  const N = padded(n);
  return { bytes: await out.save(), sheets: N / 4, sides: N / 2, blanks: N - n };
}

export type NupOpts = { per: 2 | 4; paper: Paper; border: boolean };
export async function makeNup(bytes: Uint8Array, o: NupOpts): Promise<{ bytes: Uint8Array; sheets: number }> {
  const src = await load(bytes), n = src.getPageCount();
  const out = await PDFDocument.create();
  const emb = await out.embedPages(src.getPages());
  const [pw, ph] = PAPER[o.paper], m = 14;
  const [W, H] = o.per === 2 ? [ph, pw] : [pw, ph];
  const cols = 2, rows = o.per / 2, cw = (W - m * (cols + 1)) / cols, ch = (H - m * (rows + 1)) / rows;
  for (let i = 0; i < n; i += o.per) {
    const page = out.addPage([W, H]);
    for (let k = 0; k < o.per && i + k < n; k++) {
      const c = k % cols, r = Math.floor(k / cols);
      fit(page, emb[i + k], { x: m + c * (cw + m), y: H - m - (r + 1) * ch - r * m, w: cw, h: ch }, [W, H], false, o.border);
    }
  }
  return { bytes: await out.save(), sheets: Math.ceil(n / o.per) };
}

export type PosterOpts = { page: number; cols: number; rows: number; paper: Paper; overlapMm: number; marks: boolean; landscape: boolean };
export async function makePoster(bytes: Uint8Array, o: PosterOpts): Promise<{ bytes: Uint8Array; tiles: number; sizeMm: [number, number] }> {
  const src = await load(bytes);
  if (o.page < 1 || o.page > src.getPageCount()) throw new Error(`Page ${o.page} is outside 1 to ${src.getPageCount()}.`);
  const sp = src.getPage(o.page - 1), { width: sw, height: sh } = sp.getSize();
  const out = await PDFDocument.create();
  const font = await out.embedFont(StandardFonts.Helvetica);
  const [a, b] = PAPER[o.paper], [W, H] = o.landscape ? [b, a] : [a, b];
  const M = 12 * MM, ov = Math.max(0, o.overlapMm) * MM;
  const pw = W - M * 2, ph = H - M * 2;
  const stepX = pw - ov, stepY = ph - ov;
  const PW = o.cols * stepX + ov, PH = o.rows * stepY + ov;
  const k = Math.min(PW / sw, PH / sh);
  const ox = (PW - sw * k) / 2, oy = (PH - sh * k) / 2; // top-left offset of the page inside the poster
  for (let r = 0; r < o.rows; r++) for (let c = 0; c < o.cols; c++) {
    const page = out.addPage([W, H]);
    const x0 = c * stepX, y0 = r * stepY; // tile origin from the poster's top-left
    const ix0 = Math.max(x0, ox), ix1 = Math.min(x0 + pw, ox + sw * k), iy0 = Math.max(y0, oy), iy1 = Math.min(y0 + ph, oy + sh * k);
    if (ix1 > ix0 && iy1 > iy0) {
      const box = { left: (ix0 - ox) / k, right: (ix1 - ox) / k, top: sh - (iy0 - oy) / k, bottom: sh - (iy1 - oy) / k };
      const e = await out.embedPage(sp, box);
      page.drawPage(e, { x: M + (ix0 - x0), y: H - M - (iy1 - y0), width: ix1 - ix0, height: iy1 - iy0 });
    }
    if (o.marks) {
      const L = 8, col = rgb(0.2, 0.2, 0.2);
      for (const [cx, cy] of [[M, M], [W - M, M], [M, H - M], [W - M, H - M]]) {
        const sx = cx < W / 2 ? -1 : 1, sy = cy < H / 2 ? -1 : 1;
        page.drawLine({ start: { x: cx, y: cy }, end: { x: cx + sx * L, y: cy }, thickness: 0.5, color: col });
        page.drawLine({ start: { x: cx, y: cy }, end: { x: cx, y: cy + sy * L }, thickness: 0.5, color: col });
      }
    }
    page.drawText(`Row ${r + 1}, column ${c + 1} of ${o.rows} x ${o.cols}`, { x: M, y: 4, size: 6, font, color: rgb(0.4, 0.4, 0.4) });
  }
  return { bytes: await out.save(), tiles: o.rows * o.cols, sizeMm: [Math.round(PW / MM), Math.round(PH / MM)] };
}
