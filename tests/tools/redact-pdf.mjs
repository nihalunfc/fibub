// #1706 Redact PDF
import { createRequire } from 'node:module';
export const path = '/documents/redact-pdf/';
const require = createRequire(import.meta.url);
export default async ({ page, check, BASE }) => {
  const { PDFDocument, StandardFonts } = require('pdf-lib');
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await PDFDocument.create(); const f = await doc.embedFont(StandardFonts.Helvetica);
  const p1 = doc.addPage([500, 600]);
  const lines = ['Letter for Jane Doe', 'Email: jane.doe@example.com', 'Card: 4111 1111 1111 1111', 'Not a card: 1234 5678 9012 3456', 'SSN 123-45-6789 and SIN 046 454 286', 'PAN ABCDE1234F, NI AB 12 34 56 C', 'Call 416-555-0199 today'];
  lines.forEach((l, i) => p1.drawText(l, { x: 50, y: 540 - i * 30, size: 14, font: f }));
  doc.addPage([500, 600]).drawText('Second page keeps its text', { x: 50, y: 540, size: 14, font: f });
  const buf = Buffer.from(await doc.save());
  const textOf = async (b, n) => (await (await pdfjs.getDocument({ data: new Uint8Array(b) }).promise).getPage(n).then((p) => p.getTextContent())).items.map((i) => i.str).join(' ');
  const read = (dl) => new Promise((res, rej) => { const c = []; dl.createReadStream().then((s) => { s.on('data', (d) => c.push(d)); s.on('end', () => res(Buffer.concat(c))); s.on('error', rej); }); });
  check((await textOf(buf, 1)).includes('jane.doe@example.com'), 'redact-pdf: fixture has the text');

  await page.goto(`${BASE}/documents/redact-pdf/`); await page.waitForTimeout(400);
  await page.setInputFiles('.rd .rd-file', { name: 'letter.pdf', mimeType: 'application/pdf', buffer: buf });
  await page.waitForSelector('.rd .pv-page[data-drawn="1"]', { timeout: 15000 });
  // Shapes: email, card (only the one that passes the Luhn test), SSN, SIN, PAN, NI, phone.
  await page.fill('.rd-words', 'Jane Doe');
  for (const v of ['email', 'card', 'ssn', 'sin', 'pan', 'ni', 'phone']) await page.check(`.rd-patbox input[value="${v}"]`);
  await page.click('.rd-search'); await page.waitForTimeout(800);
  const rows = await page.locator('.rd-list li').allTextContents();
  const has = (s) => rows.some((r) => r.includes(s));
  check(rows.length === 8 && has('Word "Jane Doe"') && has('jane.doe@example.com') && has('4111 1111 1111 1111') && !has('1234 5678') && has('123-45-6789') && has('046 454 286') && has('ABCDE1234F') && has('AB 12 34 56 C') && has('416-555-0199'), `redact-pdf: finds words and shapes (${rows.length} rows) ${JSON.stringify(rows)}`);
  // Drawn box on page 2 over its text.
  const l2 = page.locator('.rd .pv-layer').nth(1);
  await l2.evaluate((e) => e.scrollIntoView({ block: 'start' }));
  const b2 = await l2.boundingBox();
  await page.mouse.move(b2.x + b2.width * 0.05, b2.y + b2.height * 0.05); await page.mouse.down();
  await page.mouse.move(b2.x + b2.width * 0.2, b2.y + b2.height * 0.12, { steps: 4 }); await page.mouse.up();
  { const ct = await page.locator('.rd-count').textContent(); check(ct.startsWith('9 boxes on 2 pages'), 'redact-pdf: drawn box counted ' + ct); }
  // Keep one of the found items.
  await page.locator('.rd-list li').filter({ hasText: 'Jane Doe' }).locator('button').click();
  check((await page.locator('.rd-list li').count()) === 7, 'redact-pdf: keep-this removes a find');
  await page.selectOption('.rd-dpi', '150');
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click('.rd-save')]);
  const out = await read(dl);
  check(dl.suggestedFilename() === 'letter-redacted.pdf', 'redact-pdf: file name');
  const t1 = await textOf(out, 1), t2 = await textOf(out, 2);
  check(t1.trim() === '' && !t1.includes('jane.doe') && !t1.includes('4111') && !t1.includes('123-45-6789'), `redact-pdf: redacted page has no text left ("${t1.slice(0, 40)}")`);
  check(t2.trim() === '', 'redact-pdf: page with a drawn box is a picture too');
  await page.waitForTimeout(300);
  check((await page.textContent('.rd-report')).includes('contain no text at all'), 'redact-pdf: tool reports its own check');
  // Only a word, page 2 untouched: page 2 keeps real text.
  await page.click('.rd-other');
  await page.setInputFiles('.rd .rd-file', { name: 'letter.pdf', mimeType: 'application/pdf', buffer: buf });
  await page.waitForSelector('.rd .pv-page[data-drawn="1"]', { timeout: 15000 });
  for (const v of ['email', 'card', 'ssn', 'sin', 'pan', 'ni', 'phone']) await page.uncheck(`.rd-patbox input[value="${v}"]`);
  await page.fill('.rd-words', 'Email: jane.doe@example.com'); await page.click('.rd-search'); await page.waitForTimeout(600);
  check((await page.locator('.rd-list li').count()) === 1, 'redact-pdf: phrase found as one place ' + await page.textContent('.rd-found'));
  const [dl2] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click('.rd-save')]);
  const o2 = await read(dl2);
  const d2 = await PDFDocument.load(o2);
  check(d2.getPageCount() === 2 && (await textOf(o2, 1)).trim() === '' && (await textOf(o2, 2)).includes('Second page keeps its text'), 'redact-pdf: untouched page keeps its real text');
};
