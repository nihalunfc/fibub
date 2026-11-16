// #T959 Voice recorder
export const path = '/everyday/voice-recorder/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  // Headless browsers have no microphone: ?stub-mic hands back a 440 Hz tone as the "microphone"; ?no-mic removes the API.
  await page.addInitScript(() => {
    if (!/^\/everyday\/voice-recorder\//.test(location.pathname) || !navigator.mediaDevices) return;
    if (location.search.includes('no-mic')) Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: undefined, configurable: true });
    if (location.search.includes('stub-mic')) navigator.mediaDevices.getUserMedia = async () => {
      const ac = new AudioContext(), o = ac.createOscillator(), d = ac.createMediaStreamDestination(); o.frequency.value = 440; o.connect(d); o.start(); return d.stream;
    };
  });
  const R = '.vr ';
  await page.goto(`${BASE}/everyday/voice-recorder/?no-mic`); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.vr-none') && await page.isDisabled(R + '.vr-start'), 'voice-recorder: says so when the browser cannot record');
  await page.goto(`${BASE}/everyday/voice-recorder/?stub-mic`); await page.waitForTimeout(300);
  await page.click(R + '.vr-start');
  await page.waitForSelector(R + '.vr-stop:not([hidden])'); await page.waitForTimeout(1600);
  await page.click(R + '.vr-stop');
  await page.waitForFunction(() => /recorded/i.test(document.querySelector('.vr-info').textContent), null, { timeout: 15000 });
  const info = await page.textContent(R + '.vr-info');
  check(/recorded\. WAV/.test(info) && await page.isVisible(R + '.vr-start'), `voice-recorder: records and offers WAV (${info})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vr-wav')]); const f = OUT + 'vr.wav'; await d.saveAs(f); const b = readFileSync(f);
  const secs = b.readUInt32LE(40) / 2 / b.readUInt32LE(24);
  check(b.toString('latin1', 0, 4) === 'RIFF' && b.readUInt16LE(22) === 1 && secs > 1 && secs < 3, `voice-recorder: mono WAV of about 1.6 s (${secs.toFixed(2)} s)`);
  const [u] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vr-ulaw')]);
  check(/^recording-.*\.ulaw$/.test(u.suggestedFilename()), 'voice-recorder: phone (.ulaw) download');
};
