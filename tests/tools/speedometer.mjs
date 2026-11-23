// #T1076 Speedometer. Headless Chromium has no GPS: a fake geolocation is put in place and fed positions.
export const path = '/everyday/speedometer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/speedometer/`); await page.waitForTimeout(300);
  const R = '.sp ', t = (s) => page.textContent(R + s);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { watchPosition(ok) { window.__fix = ok; return 1; }, clearWatch() {} } });
  });
  await page.click(R + '.sp-start');
  check((await t('.sp-status')).includes('Looking for GPS'), 'speedometer: Start asks for GPS');
  // 20 m/s due north, one fix a second, no browser speed: 200 m in 10 s.
  await page.evaluate(() => {
    const step = 20 / 111195.08, t0 = Date.now() - 20000;
    for (let i = 0; i <= 10; i++) window.__fix({ timestamp: t0 + i * 1000, coords: { latitude: 43 + i * step, longitude: -79, accuracy: 5, speed: null, heading: null, altitude: 100 + i, altitudeAccuracy: 3 } });
  });
  check((await t('.sp-now')).trim() === '72', `speedometer: 20 m/s shows 72 km/h (${await t('.sp-now')})`);
  check((await t('.sp-dist')).includes('0.20 km') && (await t('.sp-head')).includes('N'), `speedometer: 200 m heading north (${await t('.sp-dist')}, ${await t('.sp-head')})`);
  await page.click(R + '[data-u="mph"]');
  check((await t('.sp-now')).trim() === '45' && (await t('.sp-unit')).includes('mph'), `speedometer: switching to mph shows 45 (${await t('.sp-now')})`);
  await page.click(R + '[data-u="kmh"]');
  await page.fill(R + '.sp-limit', '60'); await page.check(R + '.sp-alert');
  check(await page.evaluate(() => document.querySelector('.sp').classList.contains('sp-over')), 'speedometer: 72 km/h over a 60 alert turns red');
  // A bad fix is not counted.
  await page.evaluate(() => window.__fix({ timestamp: Date.now(), coords: { latitude: 44, longitude: -79, accuracy: 300, speed: null, heading: null, altitude: null, altitudeAccuracy: null } }));
  check((await t('.sp-status')).includes('better GPS fix'), 'speedometer: a ±300 m fix waits for a better one');
  await page.click(R + '.sp-reset');
  check((await t('.sp-max')) === '–', 'speedometer: reset clears the top speed');
  await page.click(R + '.sp-hud');
  check(await page.isVisible(R + '.sp-hudview'), 'speedometer: windscreen view opens');
  await page.click(R + '.sp-hudview');
  check(!(await page.isVisible(R + '.sp-hudview')), 'speedometer: tapping closes the windscreen view');
};
