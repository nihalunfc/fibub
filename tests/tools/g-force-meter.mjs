// #T1077 G-Force Meter. Headless Chromium has no sensors: synthetic devicemotion events are sent.
export const path = '/everyday/g-force-meter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/g-force-meter/`); await page.waitForTimeout(300);
  const R = '.gf ', t = (s) => page.textContent(R + s);
  await page.click(R + '.gf-start');
  const send = (x, y, z, n) => page.evaluate(async ([x, y, z, n]) => {
    for (let i = 0; i < n; i++) { window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x, y, z }, interval: 20 })); await new Promise((r) => setTimeout(r, 20)); }
  }, [x, y, z, n]);
  await send(0, 0, 9.80665, 30); // zero: flat, still
  check((await t('.gf-status')).includes('Live'), 'g-force: zeroes after half a second still');
  await send(0, -0.3 * 9.80665, 9.80665, 60); // firm braking, held 1.2 s so the smoothing settles
  await page.waitForTimeout(100);
  check((await t('.gf-pbrake')).includes('0.30'), `g-force: braking at 0.3 g peaks at 0.30 g (${await t('.gf-pbrake')})`);
  await send(0.5 * 9.80665, 0, 9.80665, 60);
  await page.waitForTimeout(100);
  check((await t('.gf-pright')).includes('0.50') && (await t('.gf-lat')).includes('+0.50'), `g-force: a 0.5 g right turn (${await t('.gf-pright')})`);
  await page.click(R + '.gf-reset');
  await page.click(R + '.gf-stop');
  check((await t('.gf-pbrake')) === '–' && await page.isVisible(R + '.gf-start'), 'g-force: reset clears peaks; Stop returns to Start');
};
