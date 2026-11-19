// #T1059 Vibration Test. Headless Chromium cannot vibrate: navigator.vibrate is removed, then replaced by a recorder.
export const path = '/everyday/vibration-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/vibration-test/`); await page.waitForTimeout(300);
  const R = '.vb ', t = (s) => page.textContent(R + s);
  await page.evaluate(() => { Object.defineProperty(navigator, 'vibrate', { value: undefined, configurable: true }); });
  await page.click(R + '.vb-p >> nth=0');
  check((await t('.vb-status')).includes('no Vibration API') || (await t('.vb-status')).includes('do not allow'), 'vibration-test: a missing API is explained');
  await page.evaluate(() => { window.__v = []; Object.defineProperty(navigator, 'vibrate', { value: (p) => { window.__v.push(p); return true; }, configurable: true }); });
  await page.click(R + '.vb-p >> nth=1');
  check(JSON.stringify(await page.evaluate(() => window.__v[0])) === '[1000]', 'vibration-test: Long sends one 1000 ms buzz');
  await page.click(R + '.vb-p >> nth=3');
  const sos = await page.evaluate(() => window.__v[1]);
  check(sos.length === 17 && sos.reduce((a, b) => a + b, 0) === 2700 && (await t('.vb-status')).includes('2,700 ms'), 'vibration-test: SOS is 17 steps and 2,700 ms');
  await page.fill(R + '.vb-in', '200, 100, 200');
  check((await t('.vb-info')).includes('3 steps, 500 ms'), 'vibration-test: custom pattern 200,100,200 is 500 ms');
  await page.click(R + '.vb-go'); await page.click(R + '.vb-stop');
  check(JSON.stringify(await page.evaluate(() => window.__v.slice(-2))) === '[[200,100,200],0]', 'vibration-test: custom pattern plays and Stop sends 0');
};
