// #T1061 Battery Test. Headless Chromium has no real battery: getBattery is removed, then replaced by an EventTarget we control.
export const path = '/everyday/battery-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/battery-test/`); await page.waitForTimeout(300);
  const R = '.bt ', t = (s) => page.textContent(R + s);
  await page.evaluate(() => { Object.defineProperty(navigator, 'getBattery', { value: undefined, configurable: true }); });
  await page.click(R + '.bt-start');
  check((await t('.bt-status')).includes('does not share battery') && (await t('.bt-status')).includes('Safari'), 'battery-test: a missing API is explained');
  await page.evaluate(() => {
    const b = new EventTarget(); Object.assign(b, { level: 0.5, charging: false, chargingTime: Infinity, dischargingTime: Infinity }); window.__bat = b;
    Object.defineProperty(navigator, 'getBattery', { value: async () => b, configurable: true });
  });
  await page.click(R + '.bt-start'); await page.waitForTimeout(200);
  check((await t('.bt-level')) === '50%' && (await t('.bt-chg')) === 'No' && (await t('.bt-dt')) === 'not reported', 'battery-test: shows 50%, not charging, Infinity as not reported');
  // 10 minutes later the level has dropped 1 point: 0.01 per 10 min, so 49 points take 490 min = 8 h 10 min.
  await page.evaluate(() => { const real = Date.now(); Date.now = () => real + 600000; window.__bat.level = 0.49; window.__bat.dispatchEvent(new Event('levelchange')); });
  await page.waitForTimeout(100);
  check((await t('.bt-level')) === '49%' && (await t('.bt-log')).includes('49%'), 'battery-test: a level change shows and is logged');
  check((await t('.bt-eta')).includes('8 h 10 min left'), `battery-test: own estimate is 8 h 10 min (${await t('.bt-eta')})`);
  await page.evaluate(() => { window.__bat.charging = true; window.__bat.chargingTime = 1800; window.__bat.dispatchEvent(new Event('chargingchange')); });
  await page.waitForTimeout(100);
  check((await t('.bt-chg')) === 'Yes' && (await t('.bt-ct')) === '30 min', 'battery-test: charging shows time to full as 30 min');
};
