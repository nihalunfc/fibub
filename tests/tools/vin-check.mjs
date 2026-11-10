// #T910 VIN check
export const path = '/money/vin-check/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/vin-check/`); await page.waitForTimeout(300);
  const rows = () => page.textContent('.vc .vc-rows');
  check((await rows()).includes('Valid (X)') && (await rows()).includes('North America'), 'vin-check: 1M8GDM9AXKP042788 valid, North America');
  check((await rows()).includes('1989 or 2019'), 'vin-check: year K = 1989 or 2019');
  await page.fill('.vc .vc-in', '1M8GDM9A1KP042788'); await page.waitForTimeout(100);
  check((await rows()).includes('Invalid'), 'vin-check: wrong check digit is invalid');
  await page.fill('.vc .vc-in', '1M8GDM9AXKP04278O'); await page.waitForTimeout(100);
  check((await rows()).includes('Not allowed: O'), 'vin-check: letter O flagged');
  await page.fill('.vc .vc-in', '1M8GDM'); await page.waitForTimeout(100);
  check((await page.textContent('.vc .vc-count')).startsWith('6 of 17'), 'vin-check: short VIN counted');
};
