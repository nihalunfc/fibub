// Works out which compression methods suit a file, from its name and type.
// Kept free of heavy imports so the page can call it before the compressors load.
import type { Method } from './types';

const OFFICE = ['docx', 'docm', 'dotx', 'xlsx', 'xlsm', 'xltx', 'pptx', 'pptm', 'potx', 'odt', 'ods', 'odp'];
const IMAGE = ['jpg', 'jpeg', 'png', 'webp'];

export const ext = (name: string) => (name.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toLowerCase();

export interface Kind { label: string; methods: Method[] }

export function detect(file: { name: string; type: string }): Kind {
  const e = ext(file.name);
  if (e === 'pdf' || file.type === 'application/pdf') return { label: 'PDF document', methods: ['pdf', 'zip'] };
  if (IMAGE.includes(e) || /^image\/(jpeg|png|webp)$/.test(file.type)) return { label: `${e.toUpperCase() || 'Image'} image`, methods: ['image', 'zip'] };
  if (OFFICE.includes(e)) {
    const label = /^(doc|dot|odt)/.test(e) ? 'Word document' : /^(xl|ods)/.test(e) ? 'Excel workbook' : 'PowerPoint presentation';
    return { label: `${label} (.${e})`, methods: ['office', 'zip'] };
  }
  if (['csv', 'tsv', 'txt', 'json', 'xml', 'log', 'sql', 'md', 'html', 'svg'].includes(e)) return { label: `${e.toUpperCase()} text file`, methods: ['zip'] };
  if (['doc', 'xls', 'ppt'].includes(e)) return { label: `Older Office file (.${e})`, methods: ['zip'] };
  return { label: e ? `.${e} file` : 'File', methods: ['zip'] };
}

export const METHOD_INFO: Record<Method, { name: string; blurb: string }> = {
  pdf: { name: 'Compress the PDF', blurb: 'Gives back a smaller PDF.' },
  image: { name: 'Compress the image', blurb: 'Gives back a smaller image. Location and camera details are removed.' },
  office: { name: 'Shrink the pictures inside', blurb: 'Gives back the same document, with lighter pictures.' },
  zip: { name: 'Pack into a ZIP', blurb: 'Any file. Text files such as CSV often shrink by 80% or more. Unzip to use it.' },
};

/** Largest file we accept. Phones and tablets have far less memory to work with. */
export function sizeLimit(): number {
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  return (coarse ? 50 : 200) * 1024 * 1024;
}
