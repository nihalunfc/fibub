// #1767 Booklet maker
import { makePdf, pages, text, saved } from '../lib/pdfkit.mjs';
export const path = '/documents/booklet-maker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const six = await makePdf(6);
  await page.setInputFiles('.bkl-file', { name: 'six.pdf', mimeType: 'application/pdf', buffer: six });
  await page.waitForSelector('.bkl-main:not([hidden])', { timeout: 10000 });
  const sum = await page.textContent('.bkl-sum');
  check(sum.includes('2 sheets') && sum.includes('4 sides') && sum.includes('2 blank'), `booklet: 6 pages -> 2 sheets, 4 sides (${sum})`);
  const b = await saved(page, () => page.click('.bkl-go'));
  check(await pages(b.buf) === 4, 'booklet: output has 4 sides');
  const t = await text(b.buf);
  check(t[0].includes('body 1') && !t[0].includes('body 2') && t[2].includes('body 6') && t[2].includes('body 3') && t[3].includes('body 4') && t[3].includes('body 5'), 'booklet: pages are in saddle-stitch order');
  await page.check('input[name=bkl-mode][value=nup]'); await page.selectOption('.bkl-per', '4');
  const n = await saved(page, () => page.click('.bkl-go'));
  check(await pages(n.buf) === 2, 'booklet: 4-up of 6 pages gives 2 sheets');
  await page.check('input[name=bkl-mode][value=poster]');
  const p = await saved(page, () => page.click('.bkl-go'));
  check(await pages(p.buf) === 4, 'booklet: 2 x 2 poster gives 4 tiles');
  check((await text(p.buf)).join(' ').includes('Row 2, column 2 of 2 x 2'), 'booklet: poster tiles are labelled');
};
