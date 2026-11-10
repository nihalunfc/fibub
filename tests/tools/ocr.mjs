// #T836 Image to text
import { saved } from '../lib/pdfkit.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PDFDocument, StandardFonts } = require('pdf-lib');
export const path = '/documents/ocr/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const png = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 900; c.height = 300; const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 900, 300); x.fillStyle = '#000'; x.font = 'bold 56px sans-serif';
    x.fillText('INVOICE 2026', 60, 110); x.fillText('Total due 450.75', 60, 210);
    return c.toDataURL('image/png').split(',')[1];
  });
  const file = { name: 'shot.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') };
  const offsite = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (!u.href.startsWith(BASE) && !/^(data|blob):/.test(u.protocol)) offsite.push(u.host); });
  await page.setInputFiles('.ocr-file', [file]);
  await page.waitForSelector('.ocr[data-done]', { timeout: 90000 });
  const t = await page.inputValue('.ocr-text');
  check(/INVOICE\s+2026/.test(t) && /Total due 450\.75/.test(t), 'ocr: reads the worked example ' + JSON.stringify(t));
  check(/Found 5 words on 1 page/.test(await page.textContent('.ocr-msg')), 'ocr: counts 5 words');
  check(offsite.length === 0, 'ocr: loads nothing from other sites ' + offsite.join(','));
  const txt = await saved(page, () => page.click('.ocr-txt'));
  check(txt.buf.toString('utf8') === t, 'ocr: .txt download matches the box');
  // scanned PDF, 2 pages -> page markers
  const d = await PDFDocument.create(), f = await d.embedFont(StandardFonts.HelveticaBold);
  for (const w of ['FIRST PAGE', 'SECOND PAGE']) d.addPage([400, 200]).drawText(w, { x: 30, y: 90, size: 36, font: f });
  const pdf = { name: 'scan.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await d.save()) };
  const before = await page.getAttribute('.ocr', 'data-done');
  await page.setInputFiles('.ocr-file', [pdf]);
  await page.waitForFunction((b) => document.querySelector('.ocr').dataset.done !== b, before, { timeout: 90000 });
  const t2 = await page.inputValue('.ocr-text');
  check(/--- Page 1 ---\s*FIRST PAGE/.test(t2) && /--- Page 2 ---\s*SECOND PAGE/.test(t2), 'ocr: reads both PDF pages in order ' + JSON.stringify(t2));
};
