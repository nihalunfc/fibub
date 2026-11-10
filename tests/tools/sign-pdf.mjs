// #1704 Sign PDF
import { createRequire } from 'node:module';
export const path = '/documents/sign-pdf/';
const require = createRequire(import.meta.url);
export default async ({ page, check, BASE }) => {
  const { PDFDocument, StandardFonts, PDFName, PDFDict } = require('pdf-lib');
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await PDFDocument.create(); const f = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 2; i++) doc.addPage([400, 500]).drawText(`Agreement page ${i}`, { x: 50, y: 440, size: 18, font: f });
  const buf = Buffer.from(await doc.save());
  await page.goto(`${BASE}/documents/sign-pdf/`); await page.waitForTimeout(400);
  await page.setInputFiles('.sg .sg-file', { name: 'lease.pdf', mimeType: 'application/pdf', buffer: buf });
  await page.waitForSelector('.sg .pv-page[data-drawn="1"]', { timeout: 15000 });
  check((await page.locator('.sg .pv-page').count()) === 2, 'sign-pdf: both pages shown');
  const tap = async (n, fx, fy) => { const l = page.locator('.sg .pv-layer').nth(n), b = await l.boundingBox(); await l.click({ position: { x: b.width * fx, y: b.height * fy } }); };
  // Nothing made yet: asks for a signature first.
  await page.click('.sg-add[data-k="sig"]');
  check((await page.textContent('.sg-status')).includes('Make your signature first'), 'sign-pdf: asks for a signature first');
  // Type a signature.
  await page.click('.sg-tab[data-t="type"]'); await page.fill('.sg-name', 'Asha Rao'); await page.waitForTimeout(150);
  check(!(await page.locator('.sg-prev').isHidden()) && (await page.inputValue('.sg-ini')) === 'AR', 'sign-pdf: typed signature preview and initials AR');
  // Draw one too and place it on page 2.
  await page.click('.sg-tab[data-t="draw"]');
  const pad = await page.locator('.sg-pad').boundingBox();
  await page.mouse.move(pad.x + 30, pad.y + 60); await page.mouse.down();
  for (let i = 0; i < 12; i++) await page.mouse.move(pad.x + 30 + i * 18, pad.y + 60 + Math.sin(i) * 30);
  await page.mouse.up(); await page.waitForTimeout(100);
  check(!(await page.locator('.sg-prev').isHidden()), 'sign-pdf: drawn signature preview');
  await page.click('.sg-add[data-k="sig"]');
  await tap(1, 0.5, 0.8);
  check((await page.locator('.sg .pv-layer').nth(1).locator('.pv-item img').count()) === 1, 'sign-pdf: signature placed on page 2');
  // Date on page 2, initials on page 1 for every page.
  await page.click('.sg-add[data-k="date"]'); await tap(1, 0.2, 0.9);
  await page.click('.sg-tab[data-t="type"]');
  await page.click('.sg-add[data-k="initials"]');
  await tap(0, 0.85, 0.92);
  await page.check('.sg-every');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.sg-save')]);
  const out = await new Promise((res, rej) => { const c = []; dl.createReadStream().then((s) => { s.on('data', (d) => c.push(d)); s.on('end', () => res(Buffer.concat(c))); s.on('error', rej); }); });
  check(dl.suggestedFilename() === 'lease-signed.pdf', `sign-pdf: file name ${dl.suggestedFilename()}`);
  const o = await PDFDocument.load(out);
  const imgs = (p) => { const x = p.node.Resources()?.lookupMaybe(PDFName.of('XObject'), PDFDict); return x ? x.keys().length : 0; };
  const pages = o.getPages();
  check(pages.length === 2 && imgs(pages[0]) >= 1 && imgs(pages[1]) >= 2, `sign-pdf: pictures on pages (${imgs(pages[0])}, ${imgs(pages[1])}): initials on both, signature on page 2`);
  const t = await (await pdfjs.getDocument({ data: new Uint8Array(out) }).promise).getPage(2).then((p) => p.getTextContent());
  const text = t.items.map((i) => i.str).join(' ');
  check(/20\d\d-\d\d-\d\d/.test(text) && text.includes('Agreement page 2'), `sign-pdf: date text added, page text kept (${text.slice(0, 60)})`);
  check(!(await page.locator('.sg-saved').isHidden()), 'sign-pdf: saved message');
};
