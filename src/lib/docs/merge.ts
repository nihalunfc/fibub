// #T1075 Merge Documents: join PDFs and pictures into one PDF, in the browser.
// The sums (limits, where a picture sits on its page, photo rotation) are plain functions so they can be checked
// without a page. Nothing here sends anything anywhere.
import { PDFDocument, degrees } from 'pdf-lib';

export type Device = 'phone' | 'computer';
export interface Limits { files: number; totalMB: number; fileMB: number; pages: number }

/**
 * Limits per device. Measured in Chromium on 2026-11-23 (largest tab's memory while merging image-heavy PDFs):
 * 105 MB of files peaked at 0.7 GB, 210 MB at 1.2 GB, 403 MB at 1.4 GB and 812 MB at 2.5 GB, i.e. 3 to 5 times the
 * files' size (the file being read, the new PDF while it is built, then the saved copy). Phone and tablet browsers
 * close a tab at roughly 1 GB, older phones sooner, so phones stop at 150 MB (about 0.9 GB at the peak) and
 * computers at 600 MB (about 2 GB).
 */
export const LIMITS: Record<Device, Limits> = {
  phone: { files: 50, totalMB: 150, fileMB: 75, pages: 1000 },
  computer: { files: 200, totalMB: 600, fileMB: 300, pages: 5000 },
};

/** Phones and tablets: a touch screen as the main pointer, or a browser that reports 4 GB of memory or less. */
export function pickDevice(coarsePointer: boolean, deviceMemoryGB?: number): Device {
  if (coarsePointer) return 'phone';
  if (deviceMemoryGB !== undefined && deviceMemoryGB <= 4) return 'phone';
  return 'computer';
}

export interface Totals { files: number; bytes: number; pages: number }
const MB = 1024 * 1024;

/** Plain reason a file cannot be added, or null if it fits. */
export function checkAdd(now: Totals, add: { name: string; bytes: number; pages: number }, lim: Limits): string | null {
  if (now.files + 1 > lim.files) return `You can merge up to ${lim.files} files at a time on this device. Merge these first, then add the result with the rest.`;
  if (add.bytes > lim.fileMB * MB) return `${add.name} is ${fmtSize(add.bytes)}. Each file can be up to ${lim.fileMB} MB on this device.`;
  if (now.bytes + add.bytes > lim.totalMB * MB) return `Adding ${add.name} would go over ${lim.totalMB} MB in total, the most this device can merge safely.`;
  if (now.pages + add.pages > lim.pages) return `Adding ${add.name} would make ${(now.pages + add.pages).toLocaleString('en')} pages. The most is ${lim.pages.toLocaleString('en')} pages in one PDF.`;
  return null;
}

export function fmtSize(b: number): string {
  if (b < 1024) return `${b} bytes`;
  if (b < MB) return `${Math.round(b / 1024)} KB`;
  return `${(b / MB).toFixed(b < 10 * MB ? 1 : 0)} MB`;
}

export type Kind = 'pdf' | 'jpg' | 'png' | 'other';
/** Tell the file type from its first bytes (names and types can lie). */
export function sniff(b: Uint8Array): Kind {
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'pdf'; // %PDF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  // Some PDFs have a few junk bytes before %PDF; readers accept up to 1 KB of it.
  const head = new TextDecoder('latin1').decode(b.subarray(0, 1024));
  if (head.includes('%PDF-')) return 'pdf';
  return 'other';
}

/** EXIF orientation of a JPEG (1 to 8), or 1 when it has none. Phones save most photos sideways with this tag. */
export function jpegOrientation(b: Uint8Array): number {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let p = 2;
  while (p + 4 <= b.length) {
    if (b[p] !== 0xff) return 1;
    const marker = b[p + 1], len = v.getUint16(p + 2);
    if (marker === 0xda || marker === 0xd9) return 1; // image data starts: no EXIF before it
    if (marker === 0xe1 && p + 10 <= b.length && v.getUint32(p + 4) === 0x45786966) { // "Exif"
      const t = p + 10; if (t + 8 > b.length) return 1;
      const le = v.getUint16(t) === 0x4949;
      const ifd = t + v.getUint32(t + 4, le); if (ifd + 2 > b.length) return 1;
      const n = v.getUint16(ifd, le);
      for (let i = 0; i < n; i++) {
        const e = ifd + 2 + i * 12; if (e + 12 > b.length) return 1;
        if (v.getUint16(e, le) === 0x0112) { const o = v.getUint16(e + 8, le); return o >= 1 && o <= 8 ? o : 1; }
      }
      return 1;
    }
    p += 2 + len;
  }
  return 1;
}
/** Clockwise turn that shows the photo the right way up. Mirrored orientations (2, 4, 5, 7) are rare; they get the nearest turn. */
export const orientationTurn = (o: number) => (o === 3 || o === 4 ? 180 : o === 5 || o === 6 ? 90 : o === 7 || o === 8 ? 270 : 0);

export type PageSize = 'a4' | 'letter' | 'image';
export interface ImageOpts { size: PageSize; margin: number }
const SIZES = { a4: [595.28, 841.89], letter: [612, 792] } as const;

/**
 * Page and picture box for a picture of w x h pixels shown turned `turn` degrees clockwise.
 * The page turns to match the picture (landscape pictures get landscape pages). The picture fits inside the margin,
 * keeps its shape and sits in the middle. 'image' makes the page the picture's own shape, long side 842 pt (A4).
 * Returned in the page's own (unturned) frame, with `rotate` for the page, so the picture is never re-encoded.
 */
export function placeImage(w: number, h: number, turn: number, o: ImageOpts) {
  const side = turn % 180 !== 0;
  const sw = side ? h : w, sh = side ? w : h; // how it looks once turned
  let pw: number, ph: number;
  if (o.size === 'image') {
    const k = 841.89 / Math.max(sw, sh);
    pw = sw * k + 2 * o.margin; ph = sh * k + 2 * o.margin;
  } else {
    const [a, b] = SIZES[o.size];
    [pw, ph] = sw > sh ? [b, a] : [a, b];
  }
  const k = Math.min((pw - 2 * o.margin) / sw, (ph - 2 * o.margin) / sh);
  const bw = sw * k, bh = sh * k, bx = (pw - bw) / 2, by = (ph - bh) / 2;
  // Undo the turn: the page is stored unturned and given /Rotate, so swap the box into that frame.
  if (!side) {
    if (turn === 0) return { pageW: pw, pageH: ph, x: bx, y: by, w: bw, h: bh, rotate: 0 };
    return { pageW: pw, pageH: ph, x: pw - bx - bw, y: ph - by - bh, w: bw, h: bh, rotate: 180 };
  }
  // 90 clockwise on screen: the stored page is ph wide and pw tall.
  // A viewer turning the stored page 90 clockwise maps stored (x, y) to shown (y, W - x) where W is the stored width.
  if (turn === 90) return { pageW: ph, pageH: pw, x: ph - by - bh, y: bx, w: bh, h: bw, rotate: 90 };
  return { pageW: ph, pageH: pw, x: by, y: pw - bx - bw, w: bh, h: bw, rotate: 270 };
}

export interface MergeItem {
  kind: 'pdf' | 'jpg' | 'png';
  /** The file's bytes, or a way to read them when needed (so big files are not all held in memory at once). */
  bytes?: Uint8Array; read?: () => Promise<Uint8Array>;
  /** Pictures: pixel size as stored, and the photo's own EXIF turn. */
  w?: number; h?: number; exif?: number;
  /** Extra clockwise turn chosen by the user. */
  rot: number;
}

export class LockedPdfError extends Error {}

/** Page count of a PDF; throws LockedPdfError for a password-protected file (its pages cannot be copied). */
export async function pdfPages(bytes: Uint8Array): Promise<number> {
  try { return (await PDFDocument.load(bytes, { updateMetadata: false })).getPageCount(); }
  catch (e: any) {
    if (/encrypt/i.test(String(e?.message || e?.name))) throw new LockedPdfError('locked');
    throw e;
  }
}

/** Build the merged PDF. Sources are read and opened one at a time, so only one is held at once besides the result. */
export async function mergeToPdf(items: MergeItem[], o: ImageOpts, onStep?: (done: number, total: number) => void, title = 'Merged document'): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  out.setTitle(title); out.setProducer('fibub.com Merge Documents'); out.setCreator('fibub.com');
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const bytes = it.bytes ?? (await it.read!());
    if (it.kind === 'pdf') {
      const d = await PDFDocument.load(bytes, { updateMetadata: false });
      const copied = await out.copyPages(d, d.getPageIndices());
      for (const p of copied) {
        if (it.rot) p.setRotation(degrees((p.getRotation().angle + it.rot) % 360));
        out.addPage(p);
      }
    } else {
      const img = it.kind === 'jpg' ? await out.embedJpg(bytes) : await out.embedPng(bytes);
      const turn = ((it.exif || 0) + it.rot) % 360;
      const b = placeImage(img.width, img.height, turn, o);
      const p = out.addPage([b.pageW, b.pageH]);
      p.drawImage(img, { x: b.x, y: b.y, width: b.w, height: b.h });
      if (b.rotate) p.setRotation(degrees(b.rotate));
    }
    onStep?.(i + 1, items.length);
    await new Promise((r) => setTimeout(r, 0)); // let the page repaint the progress
  }
  return out.save();
}
