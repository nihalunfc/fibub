// #1761 Certificate maker
import { pages, text, saved } from '../lib/pdfkit.mjs';
export const path = '/documents/certificate-maker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/certificate-maker/`); await page.waitForTimeout(300);
  await page.fill('.cm .cm-names', 'Name\nAsha Rao\nBen Lee, B\nChidi Okafor'); await page.waitForTimeout(100);
  check((await page.textContent('.cm .cm-count')).includes('3 names'), 'certificate-maker: heading skipped, 3 names');
  await page.fill('.cm .cm-title', 'Certificate of Merit'); await page.fill('.cm .cm-date', '2026-11-10');
  const f = await saved(page, () => page.click('.cm .cm-pdf'));
  check((await pages(f.buf)) === 3, 'certificate-maker: 3 names = 3 pages');
  const t = await text(f.buf);
  check(t[1].includes('Ben Lee') && t[0].includes('Certificate of Merit') && t[2].includes('10 November 2026'), 'certificate-maker: name, title and date on pages');
  for (const l of ['modern', 'simple']) {
    await page.selectOption('.cm .cm-layout', l);
    const g = await saved(page, () => page.click('.cm .cm-pdf'));
    check((await pages(g.buf)) === 3, `certificate-maker: ${l} layout makes 3 pages`);
  }
  await page.fill('.cm .cm-names', '');
  const e = await saved(page, () => page.click('.cm .cm-pdf'));
  check((await pages(e.buf)) === 1, 'certificate-maker: no names = 1 blank page');
};
