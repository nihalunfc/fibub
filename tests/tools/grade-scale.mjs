// #1605 Grade scale
export const path = '/collecting/grade-scale/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/grade-scale/`); await page.waitForTimeout(300);
  const f = async () => (await page.textContent('.gs .gs-facts')) + (await page.textContent('.gs .gs-out'));
  let t = await f();
  check(/Extremely Fine/.test(t) && /EF \/ XF/.test(t) && /SUP/.test(t) && /VZ/.test(t), `grade-scale: 45 is Extremely Fine, EF / XF, SUP, VZ (${t})`);
  await page.selectOption('.gs .gs-num', '65'); await page.waitForTimeout(100);
  t = await f();
  check(/Mint State/.test(t) && /FDC/.test(t), 'grade-scale: 65 is Mint State, FDC');
  await page.selectOption('.gs .gs-num', '1'); await page.waitForTimeout(100);
  check(/Poor/.test(await page.textContent('.gs .gs-out')), 'grade-scale: 1 is Poor');
  await page.fill('.gs .gs-range', '15'); await page.waitForTimeout(100);
  check((await page.inputValue('.gs .gs-num')) === '50', 'grade-scale: slider moves the number');
  check((await page.locator('.gs .gs-tab tbody tr').count()) === 10 && (await page.locator('.gs .gs-notes tbody tr').count()) === 8, 'grade-scale: tables list all bands and banknote terms');
};
