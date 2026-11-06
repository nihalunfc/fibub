// One entry point for every compressor. The page loads this file only when it is needed.
import { compress as compressPdf, fitPdf } from './pdf';
import { orient, renderUnder, render } from '../image/edit';
import { compressImage, extFor } from './image';
import { compressOffice } from './office';
import { zipAsync, unzipAsync } from './zipper';
import { ext } from './detect';
import { readZipInfo } from '../zipinfo';
import { UnsupportedError, type Level, type Method, type Output, type Progress } from './types';

export { warmUp } from './pdf';

const base = (name: string) => name.replace(/\.[^.]+$/, '') || 'file';
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

export class TooBigError extends Error {
  name = 'TooBigError';
  constructor(public smallest: number) { super('too big'); }
}

/** The limit can only be met by losing visible quality. Carries the best no-loss version. */
export class NeedsLossError extends Error {
  name = 'NeedsLossError';
  constructor(public safe: Output) { super('needs loss'); }
}

const IMAGE_NO_LOSS = { minQuality: 0.6, minSide: 1600 };

/** Shrink a PDF or image until it fits under maxBytes (upload-limit mode). */
async function fitUnder(file: File, input: Uint8Array, method: Method, maxBytes: number, onProgress: Progress, allowLoss: boolean): Promise<Output> {
  if (method === 'pdf') {
    const r = await fitPdf(input, maxBytes, (label, fraction) => onProgress({ fraction, label }), allowLoss);
    if (!r.bytes && !allowLoss) {
      const safe = r.safest.length < input.length ? r.safest : input;
      throw new NeedsLossError({ bytes: safe, name: `${base(file.name)}-compressed.pdf`, mime: 'application/pdf', outcome: safe === input ? 'original' : 'smaller', note: 'Smallest version with no visible quality loss.' });
    }
    if (!r.bytes) throw new TooBigError(r.smallest);
    return {
      bytes: r.bytes, name: `${base(file.name)}-compressed.pdf`, mime: 'application/pdf', outcome: 'smaller',
      note: r.method === 'lossless' ? `${plural(r.pages, 'page')}. Fits without changing the text.` : `${plural(r.pages, 'page')}, turned into images at ${r.dpi} DPI to fit the limit.`,
    };
  }
  onProgress({ fraction: null, label: 'Finding the best quality that fits…' });
  const bmp = await createImageBitmap(file).catch(() => { throw new UnsupportedError('image'); });
  const canvas = orient(bmp, 0, false, false);
  const w = bmp.width, h = bmp.height;
  bmp.close();
  const start = { crop: { x: 0, y: 0, w, h }, outW: w, outH: h, format: 'image/jpeg' as const, quality: 0.9, background: '#ffffff' };
  const r = await renderUnder(canvas, start, maxBytes, (label) => onProgress({ fraction: null, label }), allowLoss ? undefined : IMAGE_NO_LOSS);
  if (!r && !allowLoss) {
    // The smallest no-loss version: quality 60%, long side no smaller than 1600 pixels.
    const k = Math.min(1, IMAGE_NO_LOSS.minSide / Math.max(w, h));
    const blob = await render(canvas, { ...start, outW: Math.round(w * k), outH: Math.round(h * k), quality: IMAGE_NO_LOSS.minQuality });
    canvas.width = canvas.height = 0;
    const bytes = blob.size < input.length ? new Uint8Array(await blob.arrayBuffer()) : input;
    throw new NeedsLossError({ bytes, name: bytes === input ? file.name : `${base(file.name)}-compressed.jpg`, mime: bytes === input ? file.type : 'image/jpeg', outcome: bytes === input ? 'original' : 'smaller', note: 'Smallest version with no visible quality loss.' });
  }
  canvas.width = canvas.height = 0;
  if (!r) throw new TooBigError(0);
  return {
    bytes: new Uint8Array(await r.blob.arrayBuffer()), name: `${base(file.name)}-compressed.jpg`, mime: 'image/jpeg', outcome: 'smaller',
    note: `${r.edit.outW} × ${r.edit.outH} pixels, JPG quality ${Math.round(r.edit.quality * 100)}%. Location and camera details were removed.`,
  };
}

export async function compressFile(file: File, method: Method, level: Level, onProgress: Progress, maxBytes?: number, allowLoss = false): Promise<Output> {
  const input = new Uint8Array(await file.arrayBuffer());
  const e = ext(file.name);
  let out: Output;
  if (maxBytes && (method === 'pdf' || method === 'image')) {
    if (input.length <= maxBytes) return { bytes: input, name: file.name, mime: file.type || 'application/octet-stream', outcome: 'original', note: 'fits' };
    return fitUnder(file, input, method, maxBytes, onProgress, allowLoss);
  }

  if (method === 'pdf') {
    const r = await compressPdf(input, level, (d, t) => onProgress({ fraction: d / t, label: `Compressing page ${d} of ${t}…` }));
    out = {
      bytes: r.bytes, name: `${base(file.name)}-compressed.pdf`, mime: 'application/pdf', outcome: 'smaller',
      note: r.method === 'image' ? `${plural(r.pages, 'page')}, turned into images.`
        : level === 'light' ? `${plural(r.pages, 'page')}. Text and links are unchanged.`
        : `${plural(r.pages, 'page')}. Image compression would not have helped this file, so text and links were kept as they are.`,
    };
  } else if (method === 'image') {
    onProgress({ fraction: null, label: 'Compressing the image…' });
    const r = await compressImage(file, file.type || `image/${e === 'jpg' ? 'jpeg' : e}`, level, false);
    if (!r) throw new UnsupportedError('image');
    const changedType = extFor(r.mime) !== (e === 'jpeg' ? 'jpg' : e);
    out = {
      bytes: r.bytes, name: `${base(file.name)}-compressed.${extFor(r.mime)}`, mime: r.mime, outcome: 'smaller',
      note: `${r.width} × ${r.height} pixels${changedType ? `, saved as ${extFor(r.mime).toUpperCase()} because that is much smaller for photos` : ''}. Location and camera details were removed.`,
    };
  } else if (method === 'office') {
    let r;
    try { r = await compressOffice(input, level, onProgress); } catch { throw new UnsupportedError('office'); }
    out = {
      bytes: r.bytes, name: `${base(file.name)}-compressed.${e}`, mime: file.type || 'application/octet-stream', outcome: 'smaller',
      note: r.pictures ? `${r.shrunk} of ${plural(r.pictures, 'picture')} made lighter; text and layout unchanged.` : 'Repacked more tightly; text, layout and pictures unchanged.',
    };
  } else if (method === 'repack') {
    onProgress({ fraction: null, label: 'Opening the ZIP…' });
    let info;
    try { info = readZipInfo(input); } catch { throw new UnsupportedError('zip'); }
    // Never unpack password-protected or unusual entries: the result would be wrong.
    if (info.entries.some((e) => e.encrypted || ![0, 8].includes(e.method))) throw new UnsupportedError('zip');
    let files;
    try { files = await unzipAsync(input); } catch { throw new UnsupportedError('zip'); }
    onProgress({ fraction: null, label: 'Repacking with the strongest compression…' });
    const bytes = await zipAsync(files, { level: 9 });
    const n = Object.keys(files).filter((k) => !k.endsWith('/')).length;
    out = { bytes, name: `${base(file.name)}-compressed.zip`, mime: 'application/zip', outcome: 'smaller', note: `${plural(n, 'file')} inside, unchanged, packed more tightly.` };
  } else {
    onProgress({ fraction: null, label: 'Packing into a ZIP…' });
    const bytes = await zipAsync({ [file.name]: [input, { mtime: file.lastModified || Date.now() }] }, { level: level === 'light' ? 6 : 9 });
    out = { bytes, name: `${base(file.name)}.zip`, mime: 'application/zip', outcome: 'smaller', note: 'Packed into a ZIP. Open it on any computer or phone to get the original file back.' };
  }

  if (out.bytes.length >= input.length) {
    return { bytes: input, name: file.name, mime: file.type || 'application/octet-stream', outcome: 'original', note: '' };
  }
  return out;
}
