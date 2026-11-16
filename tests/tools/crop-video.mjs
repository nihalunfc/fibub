// #T978 Crop video
export const path = '/everyday/crop-video/';
export default async ({ page, check, BASE, OUT }) => {
  await page.goto(`${BASE}/everyday/crop-video/`); await page.waitForTimeout(300);
  const R = '.vj ';
  await page.setInputFiles(R + '.vj-file', new URL('../fixtures/clip-h264.mp4', import.meta.url).pathname);
  await page.waitForSelector(R + '.vj-set:not([hidden])', { timeout: 15000 });
  check((await page.textContent(R + '.vj-plan')).startsWith('Keeps 240 × 240 of 320 × 240, from 40 px left and 0 px down'), `crop-video: centred square (${await page.textContent(R + '.vj-plan')})`);
  const box = await page.$eval(R + '.vj-box', (b) => b.getBoundingClientRect().width > 10);
  check(box, 'crop-video: crop box drawn over the preview');
  await page.click(R + '.vj-go');
  await page.waitForFunction(() => !document.querySelector('.vj-out').hidden || !document.querySelector('.vj-err').hidden, null, { timeout: 60000 });
  await page.waitForFunction(() => document.querySelector('.vj-result').videoWidth > 0, null, { timeout: 10000 }).catch(() => {});
  const v = await page.$eval(R + '.vj-result', (v) => [v.videoWidth, v.videoHeight]);
  check(v.join('x') === '240x240', `crop-video: result is 240 × 240 (${v}; ${await page.textContent(R + '.vj-res')}${await page.textContent(R + '.vj-err')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vj-dl')]); await d.saveAs(OUT + 'crop.mp4');
  check(/^clip-h264-cropped\.(mp4|webm)$/.test(d.suggestedFilename()), `crop-video: download named ${d.suggestedFilename()}`);
};
