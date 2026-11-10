// #1613 Old money
export const path = '/collecting/pre-decimal/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/pre-decimal/`); await page.waitForTimeout(300);
  const t = await page.textContent('.pd .pd-gb-out');
  check(/510 old pence = 212\.5 new pence/.test(t), `pre-decimal: £2 2s 6d = 510d = 212.5p (${t})`);
  check(/£2\.125/.test(await page.textContent('.pd .pd-gb-facts')), 'pre-decimal: £2.125 decimal');
  await page.selectOption('.pd .pd-f', '2'); await page.waitForTimeout(100);
  check(/510\.5 old pence/.test(await page.textContent('.pd .pd-gb-out')), 'pre-decimal: two farthings add ½d');
  await page.fill('.pd .pd-back', '30'); await page.waitForTimeout(100);
  check(/£0 2s 6d/.test(await page.textContent('.pd .pd-back-out')), 'pre-decimal: 30d = 2s 6d (half crown)');
  await page.click('.pd .pd-m[data-m=in]'); await page.waitForTimeout(100);
  const i = await page.textContent('.pd .pd-in-out');
  check(/1\.5 rupees = 150 naye paise/.test(i), `pre-decimal: 1 rupee 8 annas = 150 naye paise (${i})`);
  await page.fill('.pd .pd-p', '2'); await page.waitForTimeout(100);
  check(/1\.5313 rupees/.test(await page.textContent('.pd .pd-in-out')), 'pre-decimal: adding pice changes the total');
};
