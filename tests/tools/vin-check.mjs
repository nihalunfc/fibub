// #T909 VIN check
export const path = '/vehicles/vin-check/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/vin-check/`); await page.waitForTimeout(300);
  const rows = () => page.textContent('.vc .vc-rows');
  check((await rows()).includes('Valid (X)') && (await rows()).includes('North America'), 'vin-check: 1M8GDM9AXKP042788 valid, North America');
  check((await rows()).includes('1989 or 2019'), 'vin-check: year K = 1989 or 2019');
  await page.fill('.vc .vc-in', '1M8GDM9A1KP042788'); await page.waitForTimeout(100);
  check((await rows()).includes('Invalid'), 'vin-check: wrong check digit is invalid');
  await page.fill('.vc .vc-in', '1M8GDM9AXKP04278O'); await page.waitForTimeout(100);
  check((await rows()).includes('Not allowed: O'), 'vin-check: letter O flagged');
  await page.fill('.vc .vc-in', '1M8GDM'); await page.waitForTimeout(100);
  check((await page.textContent('.vc .vc-count')).startsWith('6 of 17'), 'vin-check: short VIN counted');
  // more options: country, likely year, working, typo fix
  await page.fill('.vc .vc-in', '1M8GDM9AXKP042788'); await page.waitForTimeout(100);
  check((await rows()).includes('United States') && (await rows()).includes('Most likely year1989'), `vin-check: made in the US, most likely 1989 (${await rows()})`);
  check((await rows()).includes('Maker code (first 3)1M8') && (await rows()).includes('Serial number (last 6)042788'), 'vin-check: maker code and serial');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.locator('.vc .vc-tab tbody tr').count()) === 17, 'vin-check: 17 rows of working');
  check((await page.textContent('.vc .vc-sum')).includes('leaves 10 (written X)'), `vin-check: sum leaves 10, written X (${await page.textContent('.vc .vc-sum')})`);
  // 'WVWZZZ1JZ3W386752' is a well-known sample VIN from Germany
  await page.fill('.vc .vc-in', 'WVWZZZ1JZ3W386752'); await page.waitForTimeout(100);
  check((await rows()).includes('Germany'), 'vin-check: W is Germany');
  await page.fill('.vc .vc-in', '1M8GDM9AXKP04278O'); await page.waitForTimeout(100);
  check((await page.textContent('.vc .vc-fix')).includes('1M8GDM9AXKP042780'), `vin-check: O could be a zero (${await page.textContent('.vc .vc-fix')})`);
  await page.fill('.vc .vc-in', ''); await page.waitForTimeout(100);
  check((await page.textContent('.vc .vc-fix')) === '' && !(await page.textContent('.vc')).includes('NaN'), 'vin-check: blank input clears the extras');
};
