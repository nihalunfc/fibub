// #1708 Scan to PDF
import { pages, saved } from '../lib/pdfkit.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PDFDocument } = require('pdf-lib');
export const path = '/documents/scan-to-pdf/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  // dark desk, tilted white sheet with text-like bars
  const png = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 800; c.height = 600; const x = c.getContext('2d');
    x.fillStyle = '#222'; x.fillRect(0, 0, 800, 600); x.fillStyle = '#f4f4f0'; x.beginPath();
    x.moveTo(150, 80); x.lineTo(650, 110); x.lineTo(620, 520); x.lineTo(120, 480); x.closePath(); x.fill();
    x.fillStyle = '#111'; for (let i = 0; i < 6; i++) x.fillRect(200, 170 + i * 50, 340, 14);
    return c.toDataURL('image/png').split(',')[1];
  });
  const file = { name: 's.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') };
  await page.setInputFiles('.stp-file', [file]); await page.waitForSelector('.stp-card', { timeout: 10000 });
  const q = JSON.parse(await page.getAttribute('.stp-src', 'data-corners'));
  const near = (a, b) => Math.abs(a[0] - b[0]) < 0.06 && Math.abs(a[1] - b[1]) < 0.06;
  check(near(q[0], [150 / 800, 80 / 600]) && near(q[1], [650 / 800, 110 / 600]) && near(q[2], [620 / 800, 520 / 600]) && near(q[3], [120 / 800, 480 / 600]), 'scan-to-pdf: finds the four page corners ' + JSON.stringify(q));
  const a4 = await saved(page, () => page.click('.stp-make'));
  const d = await PDFDocument.load(a4.buf), s = d.getPage(0).getSize();
  check(d.getPageCount() === 1 && Math.abs(s.width - 595.28) < 1, 'scan-to-pdf: one A4 page');
  await page.setInputFiles('.stp-cam', [file]); await page.waitForFunction(() => document.querySelectorAll('.stp-card').length === 2);
  await page.selectOption('.stp-size', 'letter');
  const l = await saved(page, () => page.click('.stp-make'));
  check(await pages(l.buf) === 2 && Math.abs((await PDFDocument.load(l.buf)).getPage(0).getSize().width - 612) < 1, 'scan-to-pdf: two Letter pages');
  await page.selectOption('.stp-filter', 'bw');
  const bw = await page.evaluate(() => { const c = document.querySelector('.stp-prev'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let dark = 0, light = 0, mid = 0; for (let i = 0; i < d.length; i += 4) { if (d[i] === 0) dark++; else if (d[i] === 255) light++; else mid++; } return { dark, light, mid }; });
  check(bw.mid === 0 && bw.dark > 200 && bw.light > bw.dark, 'scan-to-pdf: black and white has only black and white ' + JSON.stringify(bw));
  await page.click('.stp-card.cur [data-a=d]');
  check((await page.$$('.stp-card')).length === 1, 'scan-to-pdf: delete removes a page');
  await page.selectOption('.stp-size', 'fit'); await page.click('.stp-rot');
  const f = await saved(page, () => page.click('.stp-make'));
  const fs = (await PDFDocument.load(f.buf)).getPage(0).getSize();
  check(fs.width < fs.height === (fs.width / fs.height < 1) && Math.abs(fs.width / fs.height - 1) > 0.05, 'scan-to-pdf: fit size follows the (turned) scan shape');
};
