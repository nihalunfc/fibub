// #T974 GIF to MP4
export const path = '/everyday/gif-to-mp4/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/gif-to-mp4/`); await page.waitForTimeout(300);
  const R = '.g2m ';
  await page.setInputFiles(R + '.g2m-file', new URL('../fixtures/anim.gif', import.meta.url).pathname);
  await page.waitForSelector(R + '.g2m-set:not([hidden])', { timeout: 15000 });
  await page.selectOption(R + '.g2m-rep', '3');
  check((await page.textContent(R + '.g2m-plan')).startsWith('15 frames, 1.5 s per loop, 4.5 s in all'), `gif-to-mp4: plan (${await page.textContent(R + '.g2m-plan')})`);
  await page.click(R + '.g2m-go');
  await page.waitForFunction(() => !document.querySelector('.g2m-out').hidden || !document.querySelector('.g2m-err').hidden, null, { timeout: 60000 });
  const res = await page.textContent(R + '.g2m-res');
  check(/Done in .*: 96 × 64, 4\.5 s/.test(res), `gif-to-mp4: made the video (${res}${await page.textContent(R + '.g2m-err')})`);
  await page.waitForFunction(() => document.querySelector('.g2m-result').videoWidth > 0, null, { timeout: 10000 }).catch(() => {});
  const v = await page.$eval(R + '.g2m-result', (v) => [v.videoWidth, v.videoHeight, v.duration]);
  check(v[0] === 96 && v[1] === 64 && Math.abs(v[2] - 4.5) < 0.15, `gif-to-mp4: result is 96 × 64 and 4.5 s (${v})`);
};
