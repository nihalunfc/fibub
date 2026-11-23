// #T1075 Merge Documents
import { makePdf, pages, saved, text } from '../lib/pdfkit.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PDFDocument } = require('pdf-lib');
export const path = '/documents/merge-documents/';

/** Put an EXIF block saying "orientation N" right after the JPEG's start marker. */
function withOrientation(jpg, o) {
  const tiff = Buffer.from([0x49, 0x49, 0x2a, 0, 8, 0, 0, 0, 1, 0, 0x12, 0x01, 3, 0, 1, 0, 0, 0, o, 0, 0, 0, 0, 0, 0, 0]);
  const body = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
  const len = Buffer.alloc(2); len.writeUInt16BE(body.length + 2);
  return Buffer.concat([jpg.subarray(0, 2), Buffer.from([0xff, 0xe1]), len, body, jpg.subarray(2)]);
}

export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const lim = await page.textContent('.mg-lim-list');
  check(/files/.test(lim) && /MB/.test(lim) && /pages/.test(lim), 'merge-documents: limits box lists files, MB and pages before anything is added');

  // A wide 300 x 200 picture, as PNG and as a JPG tagged "turn 90 clockwise".
  const [png, jpg] = await page.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 300; c.height = 200; const g = c.getContext('2d');
    g.fillStyle = '#c00'; g.fillRect(0, 0, 300, 100); g.fillStyle = '#00c'; g.fillRect(0, 100, 300, 100);
    const get = async (t) => Array.from(new Uint8Array(await (await new Promise((r) => c.toBlob(r, t, 0.9))).arrayBuffer()));
    return [await get('image/png'), await get('image/jpeg')];
  });
  const a = await makePdf(3, 'Alpha'), b = await makePdf(2, 'Bravo');
  await page.setInputFiles('.mg-file', [
    { name: 'b.pdf', mimeType: 'application/pdf', buffer: b },
    { name: 'a.pdf', mimeType: 'application/pdf', buffer: a },
    { name: 'wide.png', mimeType: 'image/png', buffer: Buffer.from(png) },
  ]);
  await page.waitForFunction(() => document.querySelectorAll('.mg-item').length === 3, null, { timeout: 10000 });
  check(/3 files of/.test(await page.textContent('.mg-use')) && /6 pages of/.test(await page.textContent('.mg-use')), 'merge-documents: counter shows 3 files and 6 pages');
  check(!(await page.isHidden('.mg-opts')), 'merge-documents: picture options appear once a picture is added');

  await page.click('.mg-sort');
  check((await page.textContent('.mg-item:nth-child(1) .mg-nm')).includes('a.pdf'), 'merge-documents: Sort A to Z puts a.pdf first');
  const m = await saved(page, () => page.click('.mg-merge'));
  const t = await text(m.buf);
  check(t.length === 6 && t[0].includes('Alpha body 1') && t[3].includes('Bravo body 1') && t[5].trim() === '', `merge-documents: 6 pages in list order, picture last (${t.length})`);
  const d = await PDFDocument.load(m.buf), last = d.getPage(5).getSize();
  check(Math.round(last.width) === 842 && Math.round(last.height) === 595, 'merge-documents: wide picture gets a landscape A4 page');
  check(/6 pages/.test(await page.textContent('.mg-out')), 'merge-documents: result says how many pages');

  // Move the picture to the top, turn it, and use the picture's own page shape.
  await page.click('.mg-item:nth-child(3) [data-a=up]'); await page.click('.mg-item:nth-child(2) [data-a=up]');
  await page.click('.mg-item:nth-child(1) [data-a=rot]');
  await page.selectOption('.mg-size', 'image'); await page.selectOption('.mg-margin', '0');
  const r = await saved(page, () => page.click('.mg-merge'));
  const rd = await PDFDocument.load(r.buf), p0 = rd.getPage(0);
  check((await text(r.buf))[0].trim() === '' && p0.getRotation().angle === 90, 'merge-documents: moved picture is page 1 and turned 90');
  const s0 = p0.getSize();
  check(Math.abs(s0.width / s0.height - 1.5) < 0.01, 'merge-documents: "same shape" page matches the 3:2 picture');

  // A phone photo stored sideways with an EXIF turn comes out turned, with no work from the user.
  await page.click('.mg-clear');
  await page.setInputFiles('.mg-file', [{ name: 'phone.jpg', mimeType: 'image/jpeg', buffer: withOrientation(Buffer.from(jpg), 6) }]);
  await page.waitForSelector('.mg-item');
  const e = await PDFDocument.load((await saved(page, () => page.click('.mg-merge'))).buf);
  check(e.getPage(0).getRotation().angle === 90, 'merge-documents: EXIF orientation 6 photo is turned upright');

  // A password-locked PDF is refused with a plain reason.
  const lock = await PDFDocument.load(a);
  lock.context.trailerInfo.Encrypt = lock.context.obj({ Filter: 'Standard', V: 1, R: 2 });
  await page.setInputFiles('.mg-file', [{ name: 'locked.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await lock.save({ useObjectStreams: false })) }]);
  await page.waitForFunction(() => /password/.test(document.querySelector('.mg-msg').textContent), null, { timeout: 10000 }).catch(() => {});
  check(/password/.test(await page.textContent('.mg-msg')) && (await page.$$('.mg-item')).length === 1, 'merge-documents: locked PDF refused with a reason');

  // Something that is not a PDF or picture is refused.
  await page.setInputFiles('.mg-file', [{ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }]);
  await page.waitForTimeout(300);
  check(/not a PDF or a picture/.test(await page.textContent('.mg-msg')), 'merge-documents: text file refused');
  void pages;

  // A phone (touch screen) gets the phone limits, and the page fits 375 px.
  const ctx = await page.context().browser().newContext({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: true });
  const ph = await ctx.newPage(); await ph.goto(`${BASE}${path}`); await ph.waitForTimeout(300);
  check(/150 MB/.test(await ph.textContent('.mg-lim-list')) && /phones/.test(await ph.textContent('.mg-dev')), 'merge-documents: phone shows the phone limits (150 MB)');
  check(await ph.evaluate(() => document.documentElement.scrollWidth <= 375), 'merge-documents: no sideways scroll at 375 px');
  await ctx.close();
};
