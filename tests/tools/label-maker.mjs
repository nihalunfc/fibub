// #1760 Label maker
import { pages, text, saved } from '../lib/pdfkit.mjs';
export const path = '/documents/label-maker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/label-maker/`); await page.waitForTimeout(300);
  const rows = Array.from({ length: 31 }, (_, i) => `Person ${i + 1}, ${i + 1} Main Road, Pune`).join('\n');
  await page.selectOption('.lm .lm-sheet', 'l30');
  await page.fill('.lm .lm-text', rows); await page.waitForTimeout(100);
  check((await page.textContent('.lm .lm-count')).includes('31 labels') && (await page.textContent('.lm .lm-count')).includes('2 pages'), 'label-maker: 31 rows on 30-up = 2 pages');
  const f = await saved(page, () => page.click('.lm .lm-pdf'));
  check((await pages(f.buf)) === 2, 'label-maker: PDF has 2 pages');
  check((await text(f.buf))[1].includes('Person 31'), 'label-maker: last label on page 2');
  await page.fill('.lm .lm-skip', '5'); await page.waitForTimeout(100);
  check((await page.textContent('.lm .lm-count')).includes('2 pages'), 'label-maker: skip keeps 2 pages');
  await page.fill('.lm .lm-skip', '0');
  await page.selectOption('.lm .lm-sheet', 'a21'); await page.waitForTimeout(100);
  check((await page.textContent('.lm .lm-count')).includes('2 pages'), 'label-maker: 21-up needs 2 pages for 31');
  await page.fill('.lm .lm-copies', '2'); await page.waitForTimeout(100);
  check((await page.textContent('.lm .lm-count')).includes('3 pages'), 'label-maker: 2 copies = 62 labels = 3 pages on 21-up');
};
