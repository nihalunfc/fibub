// #T967 Video compressor
export const path = '/everyday/video-compressor/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/video-compressor/`); await page.waitForTimeout(300);
  const R = '.vj ';
  await page.setInputFiles(R + '.vj-file', new URL('../fixtures/clip-vp8.webm', import.meta.url).pathname);
  await page.waitForSelector(R + '.vj-set:not([hidden])', { timeout: 15000 });
  await page.selectOption(R + '.vj-how', 'size'); await page.fill(R + '.vj-mb', '1');
  check((await page.textContent(R + '.vj-plan')).includes('aiming for 1 MB'), `video-compressor: target size plan (${await page.textContent(R + '.vj-plan')})`);
  await page.selectOption(R + '.vj-how', 'level-0'); await page.selectOption(R + '.vj-h', '0'); await page.check(R + '.vj-mute');
  await page.click(R + '.vj-go');
  await page.waitForFunction(() => !document.querySelector('.vj-out').hidden || !document.querySelector('.vj-err').hidden, null, { timeout: 60000 });
  const res = await page.textContent(R + '.vj-res');
  check(/Done in .*% smaller/.test(res), `video-compressor: smallest setting makes it smaller (${res}${await page.textContent(R + '.vj-err')})`);
  await page.waitForFunction(() => document.querySelector('.vj-result').videoWidth > 0, null, { timeout: 10000 }).catch(() => {});
  check((await page.$eval(R + '.vj-result', (v) => v.videoWidth)) === 320, 'video-compressor: result plays in the page');
};
