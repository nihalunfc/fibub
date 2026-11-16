// #T2 Image resizer: social presets, before/after, batch
export const path = '/documents/image-resizer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/image-resizer/`);
  await page.waitForSelector('input[name=rz-format]', { state: 'attached' });
  const png = async (w, h, color) => Buffer.from((await page.evaluate(([w, h, color]) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d'); x.fillStyle = color; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.fillRect(0, 0, w / 2, h / 2);
    return c.toDataURL('image/png').split(',')[1];
  }, [w, h, color])), 'base64');
  const a = { name: 'a.png', mimeType: 'image/png', buffer: await png(1600, 1200, '#2266cc') };
  const b = { name: 'b.png', mimeType: 'image/png', buffer: await png(800, 1000, '#cc6622') };
  const c = { name: 'c.png', mimeType: 'image/png', buffer: await png(2000, 500, '#22aa66') };
  await page.setInputFiles('.rz-input', [a, b, c]);
  await page.waitForSelector('.rz-editor:not([hidden])');
  check(await page.isVisible('.rz-batch'), 'resizer: batch box shows for several images');
  check((await page.textContent('.rz-bn')) === '2', 'resizer: 2 more images waiting');
  // social preset
  await page.selectOption('.rz-aspect', { label: 'Instagram post, square 1080 × 1080' });
  check((await page.inputValue('.rz-w')) === '1080' && (await page.inputValue('.rz-hgt')) === '1080', 'resizer: Instagram preset sets 1080 × 1080');
  check(/check the app/.test(await page.textContent('.rz-photo-note')), 'resizer: social note says check the app');
  check((await page.inputValue('.rz-bmode')) === 'cover', 'resizer: preset batch mode is exact size');
  await page.click('.rz-go');
  await page.waitForSelector('.rz-result:not([hidden])');
  check(/After: 1080 × 1080 px/.test(await page.textContent('.rz-ba-after')) && /Before: 1600 × 1200 px/.test(await page.textContent('.rz-ba-before')), 'resizer: before and after shown');
  // batch: exact size
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.click('.rz-bgo');
  await page.waitForSelector('.rz-bzip:not([hidden])', { timeout: 15000 });
  const items = await page.$$eval('.rz-blist li', (l) => l.map((x) => x.textContent));
  check(items.length === 2 && items.every((t) => t.includes('1080 × 1080 px')), `resizer: batch gives 1080 × 1080 (${items.join(' | ')})`);
  check(items[0].startsWith('b-resized.') && items[1].startsWith('c-resized.'), 'resizer: batch names');
  // fit mode: 800 x 1000 inside 1080 x 1080 is never enlarged
  await page.selectOption('.rz-bmode', 'fit');
  await page.click('.rz-bgo');
  await page.waitForFunction(() => /2 of 2 done/.test(document.querySelector('.rz-bstatus').textContent), null, { timeout: 15000 });
  const fit = await page.$$eval('.rz-blist li', (l) => l.map((x) => x.textContent));
  check(fit[0].includes('800 × 1000 px') && fit[1].includes('1080 × 270 px'), `resizer: fit mode keeps shape (${fit.join(' | ')})`);
  // wrong file type
  await page.click('.rz-new');
  await page.setInputFiles('.rz-input', { name: 'x.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  check(/not a picture/.test((await page.textContent('.rz-error0')) || ''), 'resizer: friendly message for a non-image');
};
