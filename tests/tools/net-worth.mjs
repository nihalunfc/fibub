// #1750 Net worth
export const path = '/money/net-worth/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/net-worth/`); await page.waitForTimeout(400);
  const R = '.nw ';
  const big = () => page.textContent(R + '.nw-big');
  check((await big()) === 'Net worth 23,500', `net-worth: 25,000 - 1,500 (${await big()})`);
  check((await page.textContent(R + '.nw-a')) === '25,000' && (await page.textContent(R + '.nw-d')) === '1,500', 'net-worth: assets and debts totals');
  await page.fill(R + '.nw-list[data-kind="debt"] .nw-row:nth-child(1) [data-f="amount"]', '30000'); await page.waitForTimeout(100);
  check((await big()) === 'Net worth -5,000', `net-worth: negative (${await big()})`);
  await page.click(R + '.nw-add[data-kind="asset"]'); await page.fill(R + '.nw-list[data-kind="asset"] .nw-row:nth-child(3) [data-f="amount"]', '10000'); await page.waitForTimeout(100);
  check((await big()) === 'Net worth 5,000', 'net-worth: adding an asset');
  check(await page.evaluate(() => localStorage.getItem('fibub-net-worth-v1')) === null, 'net-worth: nothing saved while unticked');
  await page.click(R + '.nw-snap'); await page.waitForTimeout(100);
  check((await page.$$(R + '.nw-table tbody tr')).length === 0, 'net-worth: no snapshot kept unless ticked');
  await page.check(R + '.nw-remember'); await page.click(R + '.nw-snap'); await page.waitForTimeout(100);
  check((await page.$$(R + '.nw-table tbody tr')).length === 1, 'net-worth: snapshot kept when ticked');
  check(await page.evaluate(() => !!localStorage.getItem('fibub-net-worth-v1')), 'net-worth: saved when ticked');
  await page.click(R + '.nw-clear'); await page.waitForTimeout(100);
  check(await page.evaluate(() => localStorage.getItem('fibub-net-worth-v1')) === null, 'net-worth: Clear removes it');
  // ratios and symbol (reload to the default rows: assets 25,000, debt 1,500)
  await page.goto(`${BASE}/money/net-worth/`); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.textContent(R + '.nw-ratios')).includes('6%'), 'net-worth: debt-to-asset 1,500/25,000 = 6%');
  await page.fill(R + '.nw-s', '$'); await page.waitForTimeout(100);
  check((await big()) === 'Net worth $23,500', `net-worth: symbol (${await big()})`);
};
