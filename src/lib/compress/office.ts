// Word, Excel and PowerPoint files (.docx, .xlsx, .pptx and the OpenDocument ones) are ZIP
// archives of XML plus a media folder. We shrink the pictures in the media folder, keep every
// file name the same so the document still finds them, and pack it all again more tightly.
import type { AsyncZippable } from 'fflate';
import { compressImage } from './image';
import { strFromU8, strToU8 } from 'fflate';
import { unzipAsync, zipAsync } from './zipper';
import type { Level, Progress } from './types';

const PICTURE = /(^|\/)(media|Pictures)\/[^/]+\.(jpe?g|png)$/i;

export async function compressOffice(input: Uint8Array, level: Level, onProgress: Progress) {
  onProgress({ fraction: null, label: 'Opening the document…' });
  const files = await unzipAsync(input);
  let names = Object.keys(files);
  const pictures = level === 'light' ? [] : names.filter((n) => PICTURE.test(n));
  // In Word/Excel/PowerPoint (not OpenDocument) a PNG photo can be stored as a JPEG, which is
  // often 5 to 10 times smaller. The picture is renamed and every reference to it updated.
  const ooxml = '[Content_Types].xml' in files;
  const renames: [string, string][] = [];
  let shrunk = 0;
  for (let i = 0; i < pictures.length; i++) {
    const n = pictures[i];
    onProgress({ fraction: i / (pictures.length + 1), label: `Shrinking picture ${i + 1} of ${pictures.length}…` });
    const isPng = /\.png$/i.test(n);
    const mime = isPng ? 'image/png' : 'image/jpeg';
    const r = await compressImage(new Blob([files[n] as Uint8Array<ArrayBuffer>], { type: mime }), mime, level, !(isPng && ooxml));
    if (!r || r.bytes.length >= files[n].length) continue;
    if (isPng && r.mime === 'image/jpeg') {
      const renamed = n.replace(/\.png$/i, '.jpeg');
      if (renamed in files) continue;
      delete files[n];
      files[renamed] = r.bytes;
      renames.push([n.split('/').pop()!, renamed.split('/').pop()!]);
    } else if (r.mime === mime) {
      files[n] = r.bytes;
    } else continue;
    shrunk++;
  }
  if (renames.length) {
    for (const name of Object.keys(files)) {
      if (!/\.rels$/i.test(name)) continue;
      let xml = strFromU8(files[name]);
      for (const [from, to] of renames) xml = xml.split(`/${from}"`).join(`/${to}"`).split(`"${from}"`).join(`"${to}"`);
      files[name] = strToU8(xml);
    }
    let types = strFromU8(files['[Content_Types].xml']);
    if (!/Extension="jpeg"/i.test(types)) types = types.replace('<Default ', '<Default Extension="jpeg" ContentType="image/jpeg"/><Default ');
    files['[Content_Types].xml'] = strToU8(types);
  }
  onProgress({ fraction: pictures.length ? pictures.length / (pictures.length + 1) : null, label: 'Packing the document…' });
  names = Object.keys(files);
  // OpenDocument files must start with an uncompressed "mimetype" entry.
  const out: AsyncZippable = {};
  if (files.mimetype) out.mimetype = [files.mimetype, { level: 0 }];
  for (const n of names) if (n !== 'mimetype') out[n] = files[n];
  const bytes = await zipAsync(out, { level: 9 });
  return { bytes, pictures: pictures.length, shrunk };
}
