// #T4 File converter: several same-kind files, picture quality, PDF page size, before size
export const path = '/documents/file-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/file-converter/`); await page.waitForTimeout(400);
  const csv = (n) => ({ name: `t${n}.csv`, mimeType: 'text/csv', buffer: Buffer.from(`a,b\n${n},2\n`) });
  await page.setInputFiles('.fc-input', [csv(1), csv(2)]);
  await page.waitForSelector('.fc-picked:not([hidden])');
  check(/2 files/.test(await page.textContent('.fc-files')), 'converter: two CSVs accepted');
  check(!(await page.isVisible('.fc-more')), 'converter: picture options hidden for CSV');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fc-go').then(() => page.waitForSelector('.fc-result:not([hidden])')).then(() => page.click('.fc-dl'))]);
  check(/\.zip$/.test(dl.suggestedFilename()), `converter: ZIP for several CSVs (${dl.suggestedFilename()})`);
  check(/before:/.test(await page.textContent('.fc-done')), 'converter: before size shown');
  await page.click('.fc-again');
  // mixed kinds
  await page.setInputFiles('.fc-input', [csv(1), { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('[{"a":1}]') }]);
  check(/same kind/.test((await page.textContent('.fc-error')) || ''), 'converter: mixed kinds get a friendly message');
  // pictures: quality and page size
  const png = Buffer.from(await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 300; c.height = 600; const x = c.getContext('2d'); x.fillStyle = '#c33'; x.fillRect(0, 0, 300, 600); return c.toDataURL('image/png').split(',')[1]; }), 'base64');
  await page.setInputFiles('.fc-input', { name: 'p.png', mimeType: 'image/png', buffer: png });
  await page.waitForSelector('.fc-picked:not([hidden])');
  check(await page.isVisible('.fc-more'), 'converter: picture options shown');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const labels = await page.$$eval('.fc-chips label', (l) => l.map((x) => x.textContent.trim()));
  const ji = labels.indexOf('JPG');
  check(ji >= 0, 'converter: JPG offered');
  await page.check(`.fc-chips label:nth-child(${ji + 1}) input`);
  check(await page.isVisible('.fc-qrow') && !(await page.isVisible('.fc-prow')), 'converter: quality slider only for lossy targets');
  await page.check(`.fc-chips label:nth-child(${labels.indexOf('PDF') + 1}) input`);
  check(await page.isVisible('.fc-prow') && !(await page.isVisible('.fc-qrow')), 'converter: page size only for PDF');
  await page.selectOption('.fc-page', 'a4');
  await page.click('.fc-go');
  await page.waitForSelector('.fc-result:not([hidden])');
  check(/\.pdf/.test(await page.textContent('.fc-done')), 'converter: PDF made with A4 page');
};
