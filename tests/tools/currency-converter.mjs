// #T849 Currency converter
export const path = '/money/currency-converter/';
export default async ({ page, check, BASE }) => {
  const offsite = [];
  page.on('request', (r) => { if (!r.url().startsWith(BASE) && !/^(data|blob):/.test(r.url())) offsite.push(r.url()); });
  // 1) feed down (tests answer 404) -> rough built-in rates, said plainly
  await page.goto(`${BASE}${path}`); await page.waitForSelector('.fxc[data-live]');
  check(await page.getAttribute('.fxc', 'data-live') === 'false' && /Could not load/.test(await page.textContent('.fxc-src')), 'currency: says when it falls back to built-in rates');
  check(await page.getAttribute('.fxc', 'data-result') === '63214.29', 'currency: 1,000 CAD = 63,214.29 INR at 1.40 / 88.50 ' + await page.getAttribute('.fxc', 'data-result'));
  await page.fill('.fxc-their', '61.5'); await page.fill('.fxc-fee', '5');
  check(await page.getAttribute('.fxc', 'data-got') === '61192.50' && await page.getAttribute('.fxc', 'data-lost-pct') === '3.20' && /2\.71% below/.test(await page.textContent('.fxc-offer')), 'currency: bank offer 61.50 with 5 CAD fee costs 3.20%');
  await page.click('.fxc-swap');
  check(Math.abs(+(await page.getAttribute('.fxc', 'data-result')) - 1000 / 63.2142857 * 1) < 0.01 * 1000, 'currency: swap converts INR to CAD');
  await page.click('.fxc summary:has-text("Use my own rate")'); await page.fill('.fxc-own', '0.02');
  check(await page.getAttribute('.fxc', 'data-result') === '20.00', 'currency: my own rate replaces today\'s');
  // 2) live feed, with one broken value that must be ignored
  await page.route('**/api/prices', (r) => r.fulfill({ json: { date: '2026-11-09', metals: { gold: 4100, silver: 52, platinum: 1600, palladium: 1450 }, fx: { usd: 1, inr: 90, cad: 1.5, gbp: 1e9, eur: '<img src=x onerror=alert(1)>' } } }));
  await page.goto(`${BASE}${path}`); await page.waitForSelector('.fxc[data-live=true]');
  check(await page.getAttribute('.fxc', 'data-result') === '60000.00' && (await page.textContent('.fxc-src')).includes('2026-11-09'), 'currency: uses the daily feed (1,000 CAD = 60,000 INR at 1.5 / 90)');
  await page.selectOption('.fxc-to', 'gbp');
  check(Math.abs(+(await page.getAttribute('.fxc', 'data-result')) - 1000 / 1.5 * 0.76) < 0.01 && !(await page.$('.fxc img')), 'currency: a broken rate in the feed is ignored, nothing from the feed becomes HTML');
  check(offsite.length === 0, 'currency: the browser asks only fibub.com ' + offsite.join(' '));
};
