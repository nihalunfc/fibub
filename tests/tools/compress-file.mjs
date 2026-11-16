// #T? Compress file: batch of several files
export const path = '/documents/compress-file/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/compress-file/`); await page.waitForTimeout(400);
  const png = async (w, h) => Buffer.from((await page.evaluate(([w, h]) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    for (let i = 0; i < 400; i++) { x.fillStyle = `hsl(${(i * 37) % 360} 70% 50%)`; x.fillRect((i * 53) % w, (i * 29) % h, 90, 90); }
    return c.toDataURL('image/png').split(',')[1];
  }, [w, h])), 'base64');
  const a = { name: 'one.png', mimeType: 'image/png', buffer: await png(1800, 1200) };
  const b = { name: 'two.png', mimeType: 'image/png', buffer: await png(1500, 1500) };
  const t = { name: 'notes.xyz', mimeType: 'application/octet-stream', buffer: Buffer.from('some bytes') };
  await page.setInputFiles('.cmp-input', [a, b, t]);
  await page.waitForSelector('.cmp-go:not([hidden])');
  check(/3 files/.test(await page.textContent('.cmp-name')), 'compress: several files are accepted');
  check(/Compress all 3 files/.test(await page.textContent('.cmp-go')), 'compress: button says how many');
  await page.click('.cmp-go');
  await page.waitForSelector('.cmp-batch:not([hidden])', { timeout: 60000 });
  const rows = await page.$$eval('.cmp-blist li', (l) => l.map((x) => x.textContent));
  check(rows.length === 3 && /smaller/.test(rows[0]) && /smaller/.test(rows[1]), `compress: each file listed (${rows.join(' | ')})`);
  check(/kept as it is/.test(rows[2]), 'compress: unknown type is kept');
  check(await page.isVisible('.cmp-bzip'), 'compress: ZIP of all files offered');
  check(/files done/.test(await page.textContent('.cmp-bsum')), 'compress: total shown');
  await page.click('.cmp-bagain');
  await page.setInputFiles('.cmp-input', { name: 'empty.png', mimeType: 'image/png', buffer: Buffer.alloc(0) });
  check(/empty/.test((await page.textContent('.cmp-error')) || ''), 'compress: empty file message');
};
