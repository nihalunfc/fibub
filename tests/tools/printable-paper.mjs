// #1762 Printable paper
import { pages, saved } from '../lib/pdfkit.mjs';
export const path = '/documents/printable-paper/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/printable-paper/`); await page.waitForTimeout(300);
  let f = await saved(page, () => page.click('.pp .pp-pdf'));
  check((await pages(f.buf)) === 1, 'printable-paper: one choice = 1 page');
  for (const t of ['graph', 'dots', 'iso', 'hex', 'staff']) await page.check(`.pp [data-t=${t}] .pp-on`);
  await page.waitForTimeout(100);
  f = await saved(page, () => page.click('.pp .pp-pdf'));
  check((await pages(f.buf)) === 6, 'printable-paper: six kinds = 6 pages');
  await page.fill('.pp .pp-pages', '2');
  f = await saved(page, () => page.click('.pp .pp-pdf'));
  check((await pages(f.buf)) === 12, 'printable-paper: 2 pages each = 12');
  const px = await page.evaluate(() => { const c = document.querySelector('.pp-canvas'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 250) n++; return n; });
  check(px > 500, 'printable-paper: preview is drawn');
  await page.selectOption('.pp .pp-unit', 'in');
  check(Math.abs(parseFloat(await page.inputValue('.pp [data-t=graph] .pp-spacing')) - 0.197) < 0.001, 'printable-paper: 5 mm shows as 0.197 in');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption('.pp .pp-size', 'a3'); await page.selectOption('.pp .pp-weight', 'bold'); await page.waitForTimeout(100);
  const dims = await page.evaluate(() => { const c = document.querySelector('.pp-canvas'); return [c.width, c.height]; });
  check(dims[0] === 891 && dims[1] === 1260, `printable-paper: A3 preview is 297 x 420 mm at 3 px per mm (${dims})`);
  f = await saved(page, () => page.click('.pp .pp-pdf'));
  check((await pages(f.buf)) === 12, 'printable-paper: A3 bold still makes the PDF');
};
