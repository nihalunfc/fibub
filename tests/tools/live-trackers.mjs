// #T1078 Live Trackers. Headless Chromium: fake GPS and synthetic motion make their cards appear; missing sensors are listed.
export const path = '/everyday/live-trackers/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/live-trackers/`); await page.waitForTimeout(300);
  const R = '.lt ';
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { watchPosition(ok) { window.__fix = ok; return 1; }, clearWatch() {} } });
  });
  check(await page.locator(R + '.lt-card:visible').count() === 0, 'live trackers: no cards before the check');
  await page.click(R + '.lt-start');
  await page.waitForTimeout(300);
  await page.evaluate(async () => {
    window.__fix({ timestamp: Date.now(), coords: { latitude: 43, longitude: -79, accuracy: 6, speed: 10, heading: 90, altitude: 182, altitudeAccuracy: 4 } });
    for (let i = 0; i < 5; i++) { window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x: 0, y: 0, z: 9.80665 }, interval: 20 })); await new Promise((r) => setTimeout(r, 20)); }
  });
  await page.waitForTimeout(2300);
  check(await page.isVisible(R + '[data-k="speed"]') && (await page.textContent(R + '.lt-speed')).match(/36 km\/h|22 mph/), `live trackers: GPS card shows 10 m/s (${await page.textContent(R + '.lt-speed')})`);
  check(await page.isVisible(R + '[data-k="alt"]') && await page.isVisible(R + '[data-k="g"]') && await page.isVisible(R + '[data-k="steps"]'), 'live trackers: altitude, g-force and steps cards appear');
  check((await page.textContent(R + '.lt-g')).includes('0.00 g'), 'live trackers: still phone reads 0.00 g');
  const miss = await page.textContent(R + '.lt-miss');
  check(miss.includes('Compass') && !miss.includes('Motion'), 'live trackers: compass listed as missing, motion not');
  check(await page.getAttribute(R + '[data-k="g"]', 'href') === '/everyday/g-force-meter/', 'live trackers: cards link to the full tool');
};
