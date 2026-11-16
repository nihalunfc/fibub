// #T975 Video speed
export const path = '/everyday/video-speed/';
export default async ({ page, check, BASE, OUT }) => {
  await page.goto(`${BASE}/everyday/video-speed/`); await page.waitForTimeout(300);
  const R = '.vj ';
  await page.setInputFiles(R + '.vj-file', new URL('../fixtures/clip-h264.mp4', import.meta.url).pathname);
  await page.waitForSelector(R + '.vj-set:not([hidden])', { timeout: 15000 });
  check((await page.textContent(R + '.vj-plan')).startsWith('2.0 s becomes 1.0 s at 2×'), `video-speed: plan (${await page.textContent(R + '.vj-plan')})`);
  await page.click(R + '.vj-go');
  await page.waitForFunction(() => !document.querySelector('.vj-out').hidden || !document.querySelector('.vj-err').hidden, null, { timeout: 60000 });
  check(/Done in/.test(await page.textContent(R + '.vj-res')), `video-speed: made (${await page.textContent(R + '.vj-res')}${await page.textContent(R + '.vj-err')})`);
  await page.waitForFunction(() => document.querySelector('.vj-result').duration > 0, null, { timeout: 10000 }).catch(() => {});
  const v = await page.$eval(R + '.vj-result', (v) => [v.videoWidth, v.duration]);
  check(v[0] === 320 && Math.abs(v[1] - 1) < 0.1, `video-speed: 2 s at 2× plays for 1 s (${v})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vj-dl')]); await d.saveAs(OUT + 'speed.mp4');
  check(/^clip-h264-2x\.(mp4|webm)$/.test(d.suggestedFilename()), `video-speed: download named ${d.suggestedFilename()}`);
};
