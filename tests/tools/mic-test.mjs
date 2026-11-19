// #T1051 Mic Test. No microphone headless: getUserMedia is replaced by a 1 kHz tone at half scale (-6 dB peak, -9 dB RMS).
export const path = '/everyday/mic-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/mic-test/`); await page.waitForTimeout(300);
  const R = '.mt ', t = (s) => page.textContent(R + s);
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { throw new DOMException('no', 'NotAllowedError'); }; });
  await page.click(R + '.mt-start'); await page.waitForTimeout(200);
  check((await t('.mt-status')).includes('not allowed'), 'mic-test: a refused permission says how to allow it');
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = async () => { const c = new AudioContext(); await c.resume(); const o = c.createOscillator(), g = c.createGain(), d = c.createMediaStreamDestination(); o.frequency.value = 1000; g.gain.value = 0.5; o.connect(g).connect(d); o.start(); return d.stream; }; });
  await page.click(R + '.mt-start'); await page.waitForTimeout(1200);
  const now = parseFloat(await t('.mt-now')), pk = parseFloat(await t('.mt-peak'));
  check(Math.abs(now - -9.03) < 1 && Math.abs(pk - -6.02) < 1, `mic-test: half-scale tone reads -9 dB now, -6 dB peak (${now}, ${pk})`);
  check((await t('.mt-status')).includes('Loud but fine') || (await t('.mt-status')).includes('Good level'), `mic-test: verdict (${await t('.mt-status')})`);
  check((await t('.mt-facts')).includes('Sample rate') && !(await page.isDisabled(R + '.mt-rec')), 'mic-test: shows browser settings and lets you record');
  await page.click(R + '.mt-stop');
  check(await page.isVisible(R + '.mt-start') && (await t('.mt-status')) === 'Microphone off.', 'mic-test: stop switches the microphone off');
};
