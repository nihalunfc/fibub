// PDF compression that runs entirely in the browser. Nothing is uploaded.
//
// Two methods:
//  - "lossless": re-save the PDF with pdf-lib using compressed object streams. Text, links and
//    forms stay as they are. Usually a small saving.
//  - "image": draw each page with pdf.js onto a canvas, save it as a JPEG, and build a new PDF
//    from those images. Big savings on scans and photo-heavy files, but text is no longer
//    selectable or searchable and links and form fields are lost.
// The image method always also runs the lossless one and returns whichever file is smaller,
// so a text-only PDF is never made bigger.
import { PDFDocument } from 'pdf-lib';

import type { Level } from './types';
export const LEVELS: Record<Exclude<Level, 'light'>, { dpi: number; quality: number }> = {
  recommended: { dpi: 150, quality: 0.72 },
  smallest: { dpi: 100, quality: 0.5 },
};
// Keep each page canvas under ~16 million pixels so phones (iOS Safari) can draw it.
const MAX_PIXELS = 16_000_000;

export interface PdfResult {
  bytes: Uint8Array;
  method: 'lossless' | 'image' | 'original';
  pages: number;
}

export { EncryptedPdfError } from './types';
import { EncryptedPdfError } from './types';

export async function compressLossless(input: Uint8Array): Promise<Uint8Array> {
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(input, { updateMetadata: false });
  } catch (e: any) {
    if (/encrypt/i.test(String(e?.message))) throw new EncryptedPdfError('encrypted');
    throw e;
  }
  return doc.save({ useObjectStreams: true, addDefaultPage: false });
}

let pdfjsReady: Promise<typeof import('pdfjs-dist')> | null = null;
export function loadPdfJs() {
  pdfjsReady ??= (async () => {
    const pdfjs = await import('pdfjs-dist');
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    // Start the worker now, so the tool keeps working if the connection drops later.
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(worker.default, { type: 'module' });
    return pdfjs;
  })();
  return pdfjsReady;
}

/** Load everything the tool needs in advance, so it works offline once the page is open. */
export async function warmUp() {
  await loadPdfJs();
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? blob.arrayBuffer().then((b) => resolve(new Uint8Array(b))) : reject(new Error('Could not encode page'))),
      'image/jpeg',
      quality,
    ),
  );
}

export async function compressAsImages(
  input: Uint8Array,
  settings: { dpi: number; quality: number },
  onProgress: (done: number, total: number) => void = () => {},
): Promise<{ bytes: Uint8Array; pages: number }> {
  const { dpi, quality } = settings;
  const pdfjs = await loadPdfJs();
  // pdf.js takes ownership of the buffer it is given, so pass a copy.
  const task = pdfjs.getDocument({ data: input.slice(), isEvalSupported: false });
  let src;
  try {
    src = await task.promise;
  } catch (e: any) {
    if (e?.name === 'PasswordException' || /password/i.test(String(e?.message))) throw new EncryptedPdfError('encrypted');
    throw e;
  }
  const out = await PDFDocument.create();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const total = src.numPages;
  try {
    for (let i = 1; i <= total; i++) {
      const page = await src.getPage(i);
      const base = page.getViewport({ scale: 1 }); // size in PDF points, rotation applied
      let scale = dpi / 72;
      const px = base.width * base.height * scale * scale;
      if (px > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / px);
      const vp = page.getViewport({ scale });
      canvas.width = Math.max(1, Math.floor(vp.width));
      canvas.height = Math.max(1, Math.floor(vp.height));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const jpg = await out.embedJpg(await canvasToJpeg(canvas, quality));
      out.addPage([base.width, base.height]).drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
      page.cleanup();
      onProgress(i, total);
    }
  } finally {
    canvas.width = canvas.height = 0;
    await src.destroy();
  }
  return { bytes: await out.save({ useObjectStreams: true }), pages: total };
}

export async function compress(
  input: Uint8Array,
  level: Level,
  onProgress: (done: number, total: number) => void = () => {},
): Promise<PdfResult> {
  const lossless = await compressLossless(input);
  const pages = (await PDFDocument.load(lossless, { updateMetadata: false })).getPageCount();
  let best: PdfResult = { bytes: lossless, method: 'lossless', pages };
  if (level !== 'light') {
    const img = await compressAsImages(input, LEVELS[level], onProgress);
    if (img.bytes.length < best.bytes.length) best = { bytes: img.bytes, method: 'image', pages: img.pages };
  }
  if (best.bytes.length >= input.length) best = { bytes: input, method: 'original', pages };
  return best;
}


/** Steps tried, best looking first, when a PDF must fit under an upload limit. */
const FIT_STEPS = [
  { dpi: 150, quality: 0.72 }, { dpi: 130, quality: 0.62 }, { dpi: 110, quality: 0.55 }, { dpi: 96, quality: 0.48 },
  { dpi: 84, quality: 0.42 }, { dpi: 72, quality: 0.38 }, { dpi: 60, quality: 0.34 }, { dpi: 50, quality: 0.3 },
];

/**
 * Smallest change that gets the PDF under maxBytes: first the text-keeping re-save, then page
 * images from sharp to light. Returns the best-looking file that fits, or null with the smallest tried.
 */
/** Page images at this DPI or more look the same as the original on screen and in print. */
export const NO_LOSS_DPI = 110;

export async function fitPdf(input: Uint8Array, maxBytes: number, onStep: (label: string, fraction: number | null) => void, allowLoss = true) {
  onStep('Trying without changing the text…', null);
  const lossless = await compressLossless(input);
  const pages = (await PDFDocument.load(lossless, { updateMetadata: false })).getPageCount();
  if (lossless.length <= maxBytes) return { bytes: lossless, pages, method: 'lossless' as const, dpi: 0, smallest: lossless.length, safest: lossless };
  let smallest = lossless.length;
  let safest: Uint8Array = lossless; // smallest result with no visible loss
  const steps = allowLoss ? FIT_STEPS : FIT_STEPS.filter((s) => s.dpi >= NO_LOSS_DPI);
  for (let i = 0; i < steps.length; i++) {
    const st = steps[i];
    const r = await compressAsImages(input, st, (d, t) => onStep(`Try ${i + 1}: pages at ${st.dpi} DPI, page ${d} of ${t}…`, (i + d / t) / steps.length));
    smallest = Math.min(smallest, r.bytes.length);
    if (st.dpi >= NO_LOSS_DPI && r.bytes.length < safest.length) safest = r.bytes;
    if (r.bytes.length <= maxBytes) return { bytes: r.bytes, pages, method: 'image' as const, dpi: st.dpi, smallest, safest };
    // Skip ahead when far off, to save time on big files (not past the no-loss floor).
    if (allowLoss && r.bytes.length > maxBytes * 3 && i < steps.length - 3 && st.dpi < NO_LOSS_DPI) i++;
  }
  return { bytes: null, pages, method: 'image' as const, dpi: 0, smallest, safest };
}
