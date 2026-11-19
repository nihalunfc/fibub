// #T1060 Sensor Test. Headless Chromium has no sensors: no events arrive at first, then synthetic motion and orientation events are sent.
export const path = '/everyday/sensor-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/sensor-test/`); await page.waitForTimeout(300);
  const R = '.se ', t = (s) => page.textContent(R + s);
  await page.click(R + '.se-start');
  await page.waitForFunction(() => document.querySelector('.se .se-status').textContent.includes('No sensor data'), null, { timeout: 4000 }).catch(() => {});
  check((await t('.se-status')).includes('No sensor data') && (await t('.se-status')).includes('laptops'), 'sensor-test: no events on a desktop gives a plain message');
  // A 10 degree tilt: gravity 9.81 split as x = 9.81 sin 10, z = 9.81 cos 10.
  await page.evaluate(async () => {
    for (let i = 0; i < 10; i++) {
      window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x: 1.7035, y: 0, z: 9.6613 }, acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 1, beta: 2, gamma: 3 }, interval: 20 }));
      await new Promise((r) => setTimeout(r, 20));
    }
    window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 90, beta: 5, gamma: 10, absolute: true }));
  });
  await page.waitForTimeout(250);
  check((await t('.se-status')).includes('Sensors are working'), 'sensor-test: events switch the status to working');
  check((await t('.se-tx')).includes('10.0') && (await t('.se-ty')).includes('0.0'), `sensor-test: tilt from gravity reads 10.0 degrees (${await t('.se-tx')})`);
  check((await t('.se-head')).includes('270') && (await t('.se-head')).includes('W'), `sensor-test: alpha 90 gives heading 270 W (${await t('.se-head')})`);
  const hz = parseFloat(await t('.se-rate'));
  check(hz > 10 && hz < 100, `sensor-test: sample rate is measured (${hz} Hz)`);
  await page.click(R + '.se-stop');
  check(await page.isVisible(R + '.se-start'), 'sensor-test: Stop returns to the start button');
};
