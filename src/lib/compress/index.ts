// One entry point for every compressor. The page loads this file only when it is needed.
import { compress as compressPdf } from './pdf';
import { compressImage, extFor } from './image';
import { compressOffice } from './office';
import { zipAsync } from './zipper';
import { ext } from './detect';
import { UnsupportedError, type Level, type Method, type Output, type Progress } from './types';

export { warmUp } from './pdf';

const base = (name: string) => name.replace(/\.[^.]+$/, '') || 'file';
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

export async function compressFile(file: File, method: Method, level: Level, onProgress: Progress): Promise<Output> {
  const input = new Uint8Array(await file.arrayBuffer());
  const e = ext(file.name);
  let out: Output;

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
