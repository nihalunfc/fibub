// Shared OCR (image to text) for any fibub tool. Tesseract.js runs in a Web Worker; the worker, the
// WebAssembly core and the language files are all served from this site (public/ocr/), never a CDN.
// Nothing is uploaded. The reader (about 4 MB, plus 1.4-3 MB per language) loads the first time it is
// needed and the browser keeps it, so later use works with no internet.
//
//   const { text, words } = await recognise(fileOrCanvas, 'eng', (p) => bar.value = p);
//
// Pin: tesseract.js 7.0.0 (package.json). If it is upgraded, copy the new worker.min.js and
// tesseract-core-*-lstm.wasm.js files into public/ocr/ too.

export type OcrLang = 'eng' | 'hin' | 'mal' | 'ara';
export const OCR_LANGS: { id: OcrLang; name: string; mb: number; rtl?: boolean }[] = [
  { id: 'eng', name: 'English', mb: 2.9 },
  { id: 'hin', name: 'Hindi', mb: 1.4 },
  { id: 'mal', name: 'Malayalam', mb: 2.8 },
  { id: 'ara', name: 'Arabic', mb: 1.7, rtl: true },
];
export interface OcrWord { text: string; bbox: { x0: number; y0: number; x1: number; y1: number }; conf: number }
export interface OcrResult { text: string; words: OcrWord[]; conf: number }
export type OcrSource = Blob | HTMLCanvasElement | ImageData | HTMLImageElement;

const BASE = '/ocr/';
let worker: any = null, workerLang = '', busy: Promise<unknown> = Promise.resolve();
let report: ((p: number, status: string) => void) | undefined;

async function getWorker(lang: string) {
  if (worker && workerLang === lang) return worker;
  const { createWorker } = await import('tesseract.js');
  if (worker) await worker.reinitialize(lang, 1);
  else worker = await createWorker(lang, 1, {
    workerPath: BASE + 'worker.min.js', corePath: BASE, langPath: BASE + 'lang', gzip: true,
    workerBlobURL: false, cacheMethod: 'none',
    logger: (m: { progress: number; status: string }) => report?.(m.progress, m.status),
  });
  workerLang = lang;
  return worker;
}

function toCanvas(src: ImageData) {
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  c.getContext('2d')!.putImageData(src, 0, 0); return c;
}

/** Load the reader and a language ahead of time (e.g. when the visitor picks a language). */
export function preload(lang: OcrLang = 'eng') {
  const job = busy.then(() => getWorker(lang)); busy = job.catch(() => {}); return job;
}

/** Read the text in a picture. `onProgress` gets 0..1 and a short status. Jobs run one at a time. */
export function recognise(source: OcrSource, lang: OcrLang | string = 'eng', onProgress?: (p: number, status: string) => void): Promise<OcrResult> {
  const job = busy.then(async () => {
    report = onProgress;
    try {
      const w = await getWorker(lang);
      const img = source instanceof ImageData ? toCanvas(source) : source;
      const { data } = await w.recognize(img, {}, { text: true, blocks: true });
      const words: OcrWord[] = [];
      for (const b of data.blocks || []) for (const p of b.paragraphs || []) for (const l of p.lines || []) for (const wd of l.words || [])
        words.push({ text: wd.text, bbox: wd.bbox, conf: Math.round(wd.confidence) });
      return { text: (data.text || '').replace(/\n{3,}/g, '\n\n').trimEnd(), words, conf: Math.round(data.confidence || 0) };
    } finally { report = undefined; }
  });
  busy = job.catch(() => {});
  return job;
}

/** Free the worker's memory (about 100 MB while loaded). */
export async function stopOcr() {
  await busy; if (worker) { const w = worker; worker = null; workerLang = ''; await w.terminate(); }
}
