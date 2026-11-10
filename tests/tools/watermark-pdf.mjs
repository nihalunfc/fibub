// #1703 Watermark PDF
import { makePdf, pages, text, saved } from '../lib/pdfkit.mjs';
export const path = '/documents/watermark-pdf/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.setInputFiles('.wm-file', { name: 'q.pdf', mimeType: 'application/pdf', buffer: await makePdf(3) });
  await page.waitForFunction(() => !document.querySelector('.wm-go').disabled);
  const o = await saved(page, () => page.click('.wm-go'));
  const t = await text(o.buf);
  check(await pages(o.buf) === 3, 'watermark-pdf: same page count');
  check(t.every((x) => x.includes('DRAFT')), 'watermark-pdf: DRAFT found on every page');
  await page.fill('.wm-pages', '2');
  const p = await text((await saved(page, () => page.click('.wm-go'))).buf);
  check(!p[0].includes('DRAFT') && p[1].includes('DRAFT') && !p[2].includes('DRAFT'), 'watermark-pdf: only page 2 marked');
  await page.fill('.wm-pages', ''); await page.selectOption('.wm-kind', 'stamp'); await page.selectOption('.wm-stamp', 'Paid');
  const s = await text((await saved(page, () => page.click('.wm-go'))).buf);
  check(/PAID\s+20\d\d-/.test(s[0]), `watermark-pdf: Paid stamp with date (${s[0]})`);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8Dwn4EIwDiqEAAmFAH/ZDDlsgAAAABJRU5ErkJggg==', 'base64');
  await page.setInputFiles('.wm-file', { name: 'id.png', mimeType: 'image/png', buffer: png });
  await page.waitForSelector('.wm-canvas:not([hidden])');
  const img = await saved(page, () => page.click('.wm-go'));
  check(img.name === 'id-marked.png' && img.buf.length > 50, 'watermark-pdf: PNG gets a marked copy');
  await page.setInputFiles('.wm-file', { name: 'q.pdf', mimeType: 'application/pdf', buffer: await makePdf(1) });
  await page.waitForTimeout(400); await page.selectOption('.wm-kind', 'text'); await page.fill('.wm-text', 'Привет'); await page.click('.wm-go');
  check((await page.textContent('.wm-msg')).includes('Latin'), 'watermark-pdf: non-Latin text explained');
};
