// #T962 Instrument tuner
export const path = '/everyday/instrument-tuner/';
export default async ({ page, check, BASE }) => {
  // No microphone headless: ?stub-mic plays a 445 Hz sine as the "microphone".
  await page.addInitScript(() => {
    if (!/^\/everyday\/instrument-tuner\//.test(location.pathname) || !location.search.includes('stub-mic')) return;
    navigator.mediaDevices.getUserMedia = async () => { const ac = new AudioContext(), o = ac.createOscillator(), d = ac.createMediaStreamDestination(); o.frequency.value = 445; o.connect(d); o.start(); return d.stream; };
  });
  const R = '.it ';
  await page.goto(`${BASE}/everyday/instrument-tuner/?stub-mic`); await page.waitForTimeout(300);
  check((await page.$$(R + '.it-strings button')).length === 0, 'instrument-tuner: chromatic has no strings');
  await page.click(R + '.it-go');
  await page.waitForFunction(() => document.querySelector('.it-read').textContent.includes('Hz'), null, { timeout: 8000 });
  const r = await page.textContent(R + '.it-read');
  check((await page.textContent(R + '.it-name')) === 'A' && (await page.textContent(R + '.it-oct')) === '4' && /^445\.\d Hz · \+(19|20) cents · too high/.test(r), `instrument-tuner: 445 Hz = A4 +20 cents (${r})`);
  await page.selectOption(R + '.it-preset', 'ukulele');
  check((await page.$$eval(R + '.it-strings button', (b) => b.map((x) => x.textContent).join(' '))) === 'G4 C4 E4 A4', 'instrument-tuner: ukulele strings');
  await page.waitForTimeout(400);
  check(await page.isVisible(R + '.it-strings button.near[data-note=A4]'), 'instrument-tuner: nearest string lit');
  await page.click(R + '.it-go');
  check((await page.textContent(R + '.it-go')) === 'Start listening', 'instrument-tuner: stops');
};
