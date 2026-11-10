// #T924 Screen recorder
export const path = '/everyday/screen-recorder/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  // Headless browsers cannot share a screen: ?no-display removes the API, ?stub-display hands back an animated canvas.
  await page.addInitScript(() => {
    const q = location.search;
    if (!navigator.mediaDevices || !/^\/everyday\/screen-recorder\//.test(location.pathname)) return;
    if (q.includes('no-display')) Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', { value: undefined, configurable: true });
    if (q.includes('stub-display')) navigator.mediaDevices.getDisplayMedia = async () => {
      const c = document.createElement('canvas'); c.width = 320; c.height = 180; const g = c.getContext('2d'); let f = 0;
      setInterval(() => { g.fillStyle = '#fff'; g.fillRect(0, 0, 320, 180); g.fillStyle = '#06c'; g.fillRect((f++ * 6) % 320, 60, 40, 40); }, 33);
      return c.captureStream(30);
    };
  });
  const R = '.scr ';
  await page.goto(`${BASE}/everyday/screen-recorder/?no-display`); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.scr-none') && await page.isDisabled(R + '.scr-start'), 'screen-recorder: says so when the browser cannot record the screen');
  await page.goto(`${BASE}/everyday/screen-recorder/?stub-display`); await page.waitForTimeout(300);
  check(await page.isHidden(R + '.scr-none') && await page.isEnabled(R + '.scr-start'), 'screen-recorder: ready when screen sharing exists');
  await page.selectOption(R + '.scr-count', '0'); await page.uncheck(R + '.scr-audio');
  await page.click(R + '.scr-start'); await page.waitForSelector(R + '.scr-pause:not([hidden])', { timeout: 5000 });
  check((await page.textContent(R + '.scr-status')).includes('no sound'), 'screen-recorder: recording, no sound');
  await page.waitForTimeout(1200); await page.click(R + '.scr-pause');
  check((await page.textContent(R + '.scr-pause')) === 'Resume', 'screen-recorder: pause');
  await page.waitForTimeout(1500); await page.click(R + '.scr-pause'); await page.waitForTimeout(1000);
  await page.click(R + '.scr-stop'); await page.waitForSelector(R + '.scr-out:not([hidden])', { timeout: 5000 });
  const t = await page.textContent(R + '.scr-res');
  check(/Recording ready: 00:02/.test(t), `screen-recorder: timer leaves out the pause (${t})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.scr-dl')]);
  const f = OUT + 'screen.webm'; await d.saveAs(f); const b = readFileSync(f);
  check(d.suggestedFilename().startsWith('screen-recording-') && d.suggestedFilename().endsWith('.webm') && b.length > 1000 && b.readUInt32BE(0) === 0x1a45dfa3 && b.includes(Buffer.from('webm')), `screen-recorder: WebM download (${b.length} bytes)`);
};
