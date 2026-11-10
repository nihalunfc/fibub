// #1721 Rent or buy
export const path = '/money/rent-vs-buy/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rent-vs-buy/`); await page.waitForTimeout(400);
  const R = '.rb ';
  const big = () => page.textContent(R + '.rb-big');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(100); };
  check((await big()) === 'Buying pulls ahead in year 16', `rent-vs-buy: documented case breaks even in year 16 (${await big()})`);
  check((await page.locator(R + '.rb-tab tbody tr').count()) === 30, 'rent-vs-buy: 30 table rows');
  await set('hg', '0'); await set('rg', '0');
  check((await big()).startsWith('Renting stays ahead'), `rent-vs-buy: no growth at all, renting stays ahead (${await big()})`);
  await set('hg', '3'); await set('rg', '3'); await set('rent', '4000');
  check(/year (\d|1[0-2])$/.test(await big()) || (await big()) === 'Buying is ahead from year 1', `rent-vs-buy: higher rent makes buying win sooner (${await big()})`);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rb-csv')]);
  check(dl.suggestedFilename().endsWith('.csv'), 'rent-vs-buy: CSV downloads');
};
