// Promise wrappers around fflate's zip and unzip, which run in background workers so the
// page stays responsive while a large file is packed.
import { zip, unzip, type AsyncZippable, type Unzipped } from 'fflate';

export const zipAsync = (files: AsyncZippable, opts: { level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 } = {}) =>
  new Promise<Uint8Array>((res, rej) => zip(files, { level: 9, ...opts }, (err, data) => (err ? rej(err) : res(data))));

export const unzipAsync = (data: Uint8Array) =>
  new Promise<Unzipped>((res, rej) => unzip(data, (err, out) => (err ? rej(err) : res(out))));
