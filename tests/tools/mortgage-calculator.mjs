// #1720 Mortgage calculator
export const path = '/money/mortgage-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/mortgage-calculator/`); await page.waitForTimeout(400);
  const R = '.mc ';
  const big = () => page.textContent(R + '.mc-big');
  const rows = () => page.textContent(R + '.mc-rows');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(100); };
  check((await big()).startsWith('2,338.36 a month'), `mortgage: 400k at 5% 25 yr standard = 2,338.36 (${await big()})`);
  await page.check(R + '[data-k="canada"]'); await page.waitForTimeout(100);
  check((await big()).startsWith('2,326.42 a month'), `mortgage: Canada semi-annual = 2,326.42 (${await big()})`);
  await set('down', '5');
  check((await rows()).includes('19,000'), 'mortgage: CMHC 4.00% premium on 475,000 = 19,000');
  await set('down', '3');
  check((await page.textContent(R + '.mc-warn')).includes('smallest down payment'), 'mortgage: minimum down payment warning');
  await set('down', '20'); await page.uncheck(R + '[data-k="canada"]');
  const before = await rows();
  await set('extra', '300');
  check((await rows()) !== before && (await rows()).includes('Interest saved'), 'mortgage: extra payment shows interest saved');
  await set('extra', '0');
  await page.selectOption(R + '[data-k="freq"]', 'accbiweekly'); await page.waitForTimeout(100);
  check((await big()).startsWith('1,169.18 every 2 weeks'), `mortgage: accelerated biweekly = half the monthly (${await big()})`);
  check((await page.locator(R + '.mc-tab tbody tr').count()) >= 20, 'mortgage: year table has rows');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mc-csv')]);
  check(dl.suggestedFilename().endsWith('.csv'), 'mortgage: CSV downloads');
};
