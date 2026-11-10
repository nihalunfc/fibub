// #1766 Merge CSV
import { saved } from '../lib/pdfkit.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { unzipSync, strFromU8 } = require('fflate');
export const path = '/documents/merge-csv/';
const f = (name, s) => ({ name, mimeType: 'text/csv', buffer: Buffer.from(s) });
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.setInputFiles('.mc-file', [f('a.csv', 'Name,City\nAnn,Paris\nBob,Rome\nCy,Paris\n'), f('b.csv', 'city,name\nOslo,Di\nRome,Ed\n')]);
  await page.waitForSelector('.mc-sum:not(:empty)', { timeout: 10000 });
  check((await page.textContent('.mc-sum')).includes('5 rows and 3 columns'), 'merge-csv: 3 + 2 rows give 5 (columns matched by name)');
  const m = await saved(page, () => page.click('.mc-csv'));
  const lines = m.buf.toString('utf8').replace(/^﻿/, '').trim().split(/\r?\n/);
  check(lines.length === 6 && lines[0] === 'Name,City,source_file' && lines[4] === 'Di,Oslo,b.csv', `merge-csv: merged CSV rows and column order (${lines[4]})`);
  await page.setInputFiles('.mc-file', [f('c.csv', 'Name,City,Phone\nFay,Rome,123\n')]);
  await page.waitForTimeout(200);
  check(!(await page.isHidden('.mc-prob')) && (await page.textContent('.mc-prob')).includes('c.csv'), 'merge-csv: different columns are refused and named');
  await page.check('input[name=mc-mode][value=union]'); await page.waitForTimeout(100);
  check((await page.textContent('.mc-sum')).includes('6 rows and 4 columns'), 'merge-csv: union keeps every column');
  await page.selectOption('.mc-col', { label: 'City' });
  const z = await saved(page, () => page.click('.mc-split'));
  const names = Object.keys(unzipSync(new Uint8Array(z.buf)));
  const rome = strFromU8(unzipSync(new Uint8Array(z.buf))['Rome.csv'] ?? new Uint8Array());
  check(names.length === 3 && rome.trim().split(/\r?\n/).length === 4, `merge-csv: split by City gives 3 files, Rome has 3 rows (${names.join(',')})`);
};
