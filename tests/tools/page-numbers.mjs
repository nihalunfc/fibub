// #1702 Page numbers
import { makePdf, pages, text, saved } from '../lib/pdfkit.mjs';
export const path = '/documents/page-numbers/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.setInputFiles('.pn-file', { name: 'r.pdf', mimeType: 'application/pdf', buffer: await makePdf(4) });
  await page.waitForFunction(() => !document.querySelector('.pn-go').disabled);
  await page.selectOption('.pn-style', 'pageof');
  const o = await saved(page, () => page.click('.pn-go'));
  const t = await text(o.buf);
  check(await pages(o.buf) === 4, 'page-numbers: same page count');
  check(t[0].includes('Page 1 of 4') && t[3].includes('Page 4 of 4'), `page-numbers: Page 1 of 4 ... Page 4 of 4 (${t[0]})`);
  await page.fill('.pn-skip', '1'); await page.fill('.pn-footer', 'From {file} on {date}');
  const s = await text((await saved(page, () => page.click('.pn-go'))).buf);
  check(!/Page \d/.test(s[0]) && s[1].includes('Page 1 of 3'), `page-numbers: skip 1 starts on page 2 (${s[1]})`);
  check(s[0].includes('From r on 20'), 'page-numbers: footer fills {file} and {date}');
  await page.selectOption('.pn-mode', 'bates'); await page.fill('.pn-skip', '0'); await page.fill('.pn-prefix', 'ABC-'); await page.fill('.pn-start', '41');
  const b = await text((await saved(page, () => page.click('.pn-go'))).buf);
  check(b[0].includes('ABC-000041') && b[3].includes('ABC-000044'), `page-numbers: Bates ABC-000041 (${b[0]})`);
  check((await page.textContent('.pn-preview')).includes('ABC-000041'), 'page-numbers: preview shows first label');
};
