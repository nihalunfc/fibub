// #T968 Rotate video
export const path = '/everyday/rotate-video/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/rotate-video/`); await page.waitForTimeout(300);
  const R = '.vj ';
  await page.setInputFiles(R + '.vj-file', new URL('../fixtures/clip-h264.mp4', import.meta.url).pathname);
  await page.waitForSelector(R + '.vj-set:not([hidden])', { timeout: 15000 });
  check((await page.textContent(R + '.vj-plan')).includes('turn" flag'), 'rotate-video: quick turn by default');
  await page.click(R + '.vj-go');
  await page.waitForFunction(() => !document.querySelector('.vj-out').hidden || !document.querySelector('.vj-err').hidden, null, { timeout: 30000 });
  check(/Done in/.test(await page.textContent(R + '.vj-res')), `rotate-video: turned (${await page.textContent(R + '.vj-res')}${await page.textContent(R + '.vj-err')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vj-dl')]); const f = OUT + 'rot.mp4'; await d.saveAs(f); const b = readFileSync(f);
  // The tkhd matrix for 90 degrees clockwise is (0, 1, -1, 0) in 16.16 fixed point.
  const i = b.indexOf('tkhd'), m = (k) => b.readInt32BE(i + 4 + 4 + 36 + 4 * k);
  check(d.suggestedFilename() === 'clip-h264-turned.mp4' && i > 0 && m(0) === 0 && m(1) === 0x10000 && m(3) === -0x10000, `rotate-video: 90° turn flag in the MP4 (${[m(0), m(1), m(3), m(4)].join(',')})`);
  await page.goto(`${BASE}/everyday/rotate-video/`); await page.waitForTimeout(300);
  await page.setInputFiles(R + '.vj-file', new URL('../fixtures/clip-h264.mp4', import.meta.url).pathname);
  await page.waitForSelector(R + '.vj-set:not([hidden])', { timeout: 15000 });
  await page.check(R + '.vj-bake');
  await page.click(R + '.vj-go');
  await page.waitForFunction(() => !document.querySelector('.vj-out').hidden || !document.querySelector('.vj-err').hidden, null, { timeout: 60000 });
  await page.waitForFunction(() => document.querySelector('.vj-result').videoWidth > 0, null, { timeout: 10000 }).catch(() => {});
  const w = await page.$eval(R + '.vj-result', (v) => [v.videoWidth, v.videoHeight].join('x'));
  check(w === '240x320', `rotate-video: pixels turned when asked (${w}; ${await page.textContent(R + '.vj-res')}${await page.textContent(R + '.vj-err')})`);
};
