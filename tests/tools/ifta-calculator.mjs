// #T903 IFTA
export const path = '/vehicles/ifta-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/ifta-calculator/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.ift .ift-big'), tab = () => page.textContent('.ift .ift-tab'), net = () => page.textContent('.ift .ift-net');
  // 10,000 mi / 1,600 gal = 6.25 mpg; 4,000 mi -> 640 gal taxable, 500 bought, 140 x 0.30 = 42.00
  check((await big()).includes('6.25 mpg'), `ifta-calculator: 6.25 mpg (${await big()})`);
  check((await tab()).includes('640') && (await tab()).includes('owe 42.00'), `ifta-calculator: State A taxable 640, owes 42.00`);
  check((await tab()).includes('credit 35.00') && (await net()).includes('net tax owed 7.00'), `ifta-calculator: State B credit 35.00, net 7.00 (${await net()})`);
  await page.fill('.ift [data-k="fuel"]', '2000'); await page.waitForTimeout(100);
  check((await big()).includes('5.00 mpg') && (await tab()).includes('owe 90.00'), `ifta-calculator: more fuel used changes the tax (${await tab()})`);
  await page.fill('.ift [data-k="dist"]', '12000'); await page.waitForTimeout(100);
  check((await page.textContent('.ift .ift-warn')).includes('add up to 10,000'), 'ifta-calculator: warns when jurisdictions miss distance');
  await page.goto(`${BASE}/vehicles/ifta-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach(d => d.open = true));
  await page.fill('.ift [data-k="paste"]', 'TX, 3200, 410, 0.20\nOK, 1800, 150, 0.19');
  await page.click('.ift .ift-import'); await page.click('.ift .ift-sum');
  await page.fill('.ift [data-k="fuel"]', '1000'); await page.waitForTimeout(100);
  // 5,000 / 1,000 = 5.00; TX 640 taxable, 410 bought: 230 x 0.20 = 46.00; OK 360 - 150 = 210 x 0.19 = 39.90
  check((await tab()).includes('owe 46.00') && (await tab()).includes('owe 39.90'), `ifta-calculator: pasted rows work (${await tab()})`);
  check((await net()).includes('85.90'), `ifta-calculator: net 85.90 (${await net()})`);
};
