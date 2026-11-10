// #1707 Metadata cleaner
import { createRequire } from 'node:module';
import { saved } from '../lib/pdfkit.mjs';
import { makeDocx, makeJpeg, makePng, textOf, upload, files } from '../lib/officekit.mjs';
const require = createRequire(import.meta.url);
const { PDFDocument } = require('pdf-lib'), { unzipSync } = require('fflate');
export const path = '/documents/metadata-cleaner/';
export default async ({ page, check, BASE }) => {
  const go = async () => { await page.goto(`${BASE}${path}`); await page.waitForTimeout(300); };
  await go();
  // DOCX
  await page.setInputFiles('.mc-file', upload('report.docx', makeDocx()));
  await page.waitForSelector('.mc-card');
  const t = await page.textContent('.mc-card');
  check(t.includes('Jane Doe') && t.includes('Raj Patel') && t.includes('Acme Corp') && t.includes('321'), 'metadata-cleaner: docx shows author, last modified by, company, edit time');
  const d = await saved(page, () => page.click('.mc-clean'));
  check(d.name === 'report-clean.docx', `metadata-cleaner: clean name (${d.name})`);
  const core = textOf(d.buf, 'docProps/core.xml'), app = textOf(d.buf, 'docProps/app.xml');
  check(!core.includes('Jane') && !core.includes('Raj') && !core.includes('revision') && !app.includes('Acme') && !app.includes('321'), 'metadata-cleaner: docx properties removed');
  check(!files(d.buf)['docProps/custom.xml'] && !textOf(d.buf, '[Content_Types].xml').includes('custom') && !textOf(d.buf, '_rels/.rels').includes('custom'), 'metadata-cleaner: custom part dropped with its links');
  check(textOf(d.buf, 'word/document.xml').includes('Hello'), 'metadata-cleaner: body kept');
  // PDF
  await go();
  const pd = await PDFDocument.create(); pd.addPage([200, 200]); pd.setAuthor('Pat Writer'); pd.setProducer('Secret Tool'); pd.setTitle('Plan');
  await page.setInputFiles('.mc-file', upload('a.pdf', Buffer.from(await pd.save())));
  await page.waitForSelector('.mc-card');
  check((await page.textContent('.mc-card')).includes('Pat Writer'), 'metadata-cleaner: pdf author shown');
  const p = await saved(page, () => page.click('.mc-clean'));
  const pc = await PDFDocument.load(p.buf, { updateMetadata: false });
  check(!pc.getAuthor() && !pc.getProducer() && !pc.getTitle() && pc.getPageCount() === 1, 'metadata-cleaner: pdf info removed, page kept');
  // JPEG
  await go();
  await page.setInputFiles('.mc-file', upload('photo.jpg', makeJpeg()));
  await page.waitForSelector('.mc-card');
  const jt = await page.textContent('.mc-card');
  check(jt.includes('43.65333') && jt.includes('-79.38333') && jt.includes('TestCam'), `metadata-cleaner: jpeg GPS and camera shown (${jt.slice(0, 120)})`);
  const j = await saved(page, () => page.click('.mc-clean'));
  check(!j.buf.includes('TestCam') && !j.buf.includes('Exif') && j.buf[0] === 0xff && j.buf.includes(Buffer.from([1, 2, 3, 4, 0xff, 0xd9])), 'metadata-cleaner: jpeg EXIF removed, image data untouched');
  // rotated photo keeps only orientation
  await go();
  await page.setInputFiles('.mc-file', upload('rot.jpg', makeJpeg(6)));
  await page.waitForSelector('.mc-card');
  const r = await saved(page, () => page.click('.mc-clean'));
  check(!r.buf.includes('TestCam') && r.buf.includes('Exif') && r.buf.length < 120, 'metadata-cleaner: rotated photo keeps only orientation');
  // PNG + batch ZIP
  await go();
  await page.setInputFiles('.mc-file', [upload('p.png', makePng()), upload('b.docx', makeDocx())]);
  await page.waitForFunction(() => document.querySelectorAll('.mc-card').length === 2);
  const z = await saved(page, () => page.click('.mc-clean'));
  const zf = unzipSync(new Uint8Array(z.buf));
  check(Object.keys(zf).length === 2 && !Buffer.from(zf['p-clean.png']).includes('Jane') && Buffer.from(zf['p-clean.png']).includes('IDAT'), 'metadata-cleaner: batch gives ZIP with cleaned png');
  // unsupported
  await go();
  await page.setInputFiles('.mc-file', upload('x.txt', Buffer.from('hello')));
  await page.waitForTimeout(300);
  check((await page.textContent('.mc-msg')).includes('not a type'), 'metadata-cleaner: unsupported file explained');
};
