// #1752 Statement to CSV
import { createRequire } from 'node:module';
import { saved } from '../lib/pdfkit.mjs';
const require = createRequire(import.meta.url);
const { PDFDocument, StandardFonts } = require('pdf-lib');
export const path = '/documents/statement-to-csv/';
async function statement() {
  const d = await PDFDocument.create(), f = await d.embedFont(StandardFonts.Helvetica), p = d.addPage([600, 800]);
  const rows = [['Date', 'Description', 'Debit', 'Credit', 'Balance'], ['01 Jan 2026', 'Coffee Corner', '4.50', '', '995.50'], ['02 Jan 2026', 'Salary ACME', '', '2,000.00', '2,995.50'],
    ['03 Jan 2026', 'Rent January', '950.00', '', '2,045.50'], ['05 Jan 2026', 'Grocery Mart', '82.15', '', '1,963.35']];
  p.drawText('Account statement', { x: 40, y: 760, size: 16, font: f });
  rows.forEach((r, i) => [40, 120, 380, 450, 520].forEach((x, c) => r[c] && p.drawText(r[c], { x, y: 700 - i * 20, size: 10, font: f })));
  p.drawText('Closing balance 1,963.35', { x: 40, y: 560, size: 10, font: f });
  return Buffer.from(await d.save());
}
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/statement-to-csv/`); await page.waitForTimeout(300);
  check(await page.isHidden('.stc .stc-work'), 'statement-to-csv: hidden before a file');
  await page.setInputFiles('.stc .stc-file', { name: 'jan.pdf', mimeType: 'application/pdf', buffer: await statement() });
  await page.waitForSelector('.stc .stc-table tr', { timeout: 15000 });
  const cols = (await page.inputValue('.stc .stc-cols')).split(',').length;
  check(cols === 5, `statement-to-csv: five columns found (${cols})`);
  const rows = await page.$$eval('.stc .stc-table tr', (trs) => trs.map((t) => [...t.children].map((c) => c.textContent)));
  check(rows.length === 5 && rows[0].join('|') === 'Date|Description|Debit|Credit|Balance', `statement-to-csv: header row (${rows[0]})`);
  check(rows[1].join('|') === '01 Jan 2026|Coffee Corner|4.50||995.50' && rows[2][3] === '2,000.00' && rows[4][1] === 'Grocery Mart', 'statement-to-csv: same rows as the PDF');
  const dl = await saved(page, () => page.click('.stc .stc-csv'));
  const csv = dl.buf.toString('utf8');
  check(dl.name === 'jan.csv' && csv.includes('02 Jan 2026,Salary ACME,,"2,000.00","2,995.50"'), 'statement-to-csv: CSV download');
  await page.check('.stc .stc-tidy'); await page.waitForTimeout(100);
  const r2 = await page.$$eval('.stc .stc-table tr', (trs) => trs.map((t) => [...t.children].map((c) => c.textContent)));
  check(r2[3].join('|') === '2026-01-03|Rent January|950|' + '|2045.5', `statement-to-csv: tidy dates and amounts (${r2[3]})`);
  await page.uncheck('.stc .stc-dated'); await page.waitForTimeout(100);
  check((await page.$$('.stc .stc-table tr')).length > 5, 'statement-to-csv: all lines when date filter off');
  await page.setInputFiles('.stc .stc-file', { name: 'x.pdf', mimeType: 'application/pdf', buffer: Buffer.from('hello') }); await page.waitForTimeout(300);
  check((await page.textContent('.stc .stc-msg')).includes('not a PDF'), 'statement-to-csv: non-PDF refused');
};
