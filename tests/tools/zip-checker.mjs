// ZIP checker
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { zipSync, strToU8 } = require('fflate');
export const path = '/documents/zip-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const up = '..' + '/evil.txt';
  const zip = Buffer.from(zipSync({ 'notes/a.txt': strToU8('hello '.repeat(500)), 'notes/b.txt': strToU8('world '.repeat(500)), 'run.exe': strToU8('MZ'), '__MACOSX/._a.txt': strToU8('x'), [up]: strToU8('bad') }));
  await page.setInputFiles('.zc-input', { name: 'test.zip', mimeType: 'application/zip', buffer: zip });
  await page.waitForSelector('.zc-report:not([hidden])', { timeout: 15000 });
  const w = await page.textContent('.zc-warn');
  check(w.includes('outside the folder') && w.includes('program or script') && w.includes('hidden system file'), `zip-checker: warns about unsafe path, program and junk files (${w.slice(0, 80)})`);
  check((await page.$$('.zc-table:not(.zc-typetable) tbody tr')).length === 5, 'zip-checker: lists the 5 files');
  await page.fill('.zc-q', 'notes');
  check((await page.$$('.zc-table:not(.zc-typetable) tbody tr')).length === 2, 'zip-checker: find narrows the list to 2');
  const types = await page.textContent('.zc-typetable tbody');
  check(types.includes('txt') && types.includes('exe'), 'zip-checker: totals by type');
};
