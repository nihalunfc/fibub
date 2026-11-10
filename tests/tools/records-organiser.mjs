// #T903 Medical records organiser
import { saved, pages } from '../lib/pdfkit.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { unzipSync } = require('fflate');
export const path = '/documents/records-organiser/';
const mk = async (text, n) => { const d = await PDFDocument.create(), f = await d.embedFont(StandardFonts.Helvetica); for (let i = 0; i < n; i++) d.addPage([300, 400]).drawText(i ? `Page ${i + 1}` : text, { x: 20, y: 200, size: 11, font: f }); return Buffer.from(await d.save()); };
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const a = await mk('Blood test report CBC haemoglobin collected 14/03/2026', 2), b = await mk('Invoice total due, 2026-01-05', 1);
  await page.setInputFiles('.ro-file', [
    { name: 'report-a.pdf', mimeType: 'application/pdf', buffer: a },
    { name: 'bill-b.pdf', mimeType: 'application/pdf', buffer: b },
    { name: 'chest xray 2026-02-10.png', mimeType: 'image/png', buffer: PNG },
  ]);
  await page.waitForSelector('.ro-body tr:nth-child(3)', { timeout: 10000 });
  const dates = await page.$$eval('.ro-d', (e) => e.map((x) => x.value));
  check(dates.join() === '2026-01-05,2026-02-10,2026-03-14', `records-organiser: 3 rows sorted by date (${dates})`);
  const types = await page.$$eval('.ro-t', (e) => e.map((x) => x.value));
  check(types.join() === 'Bill,Imaging,Lab', `records-organiser: types guessed (${types})`);
  const m = await saved(page, () => page.click('.ro-pdf'));
  check(await pages(m.buf) === 1 + 2 + 1 + 1, 'records-organiser: merged PDF is contents page plus all pages (5)');
  const z = await saved(page, () => page.click('.ro-zip'));
  const names = Object.keys(unzipSync(new Uint8Array(z.buf)));
  check(names.length === 3 && names.some((n) => n.startsWith('2026-03-14 Lab - ')), `records-organiser: ZIP has renamed files (${names[0]})`);
  await page.selectOption('.ro-order', 'desc');
  check((await page.$$eval('.ro-d', (e) => e[0].value)) === '2026-03-14', 'records-organiser: newest first switch works');
  await page.setInputFiles('.ro-file', [{ name: 'photo.heic', mimeType: 'image/heic', buffer: Buffer.from('x') }]);
  check((await page.textContent('.ro-msg')).includes('File converter'), 'records-organiser: HEIC is skipped with a pointer to the File converter');
};
