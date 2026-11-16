// #T973 Video joiner
export const path = '/everyday/video-joiner/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/video-joiner/`); await page.waitForTimeout(300);
  const R = '.vjn ';
  await page.setInputFiles(R + '.vjn-file', ['clip-h264.mp4', 'clip-vp8.webm'].map((f) => new URL('../fixtures/' + f, import.meta.url).pathname));
  await page.waitForFunction(() => document.querySelector('.vjn-info').textContent.startsWith('2 clips'), null, { timeout: 15000 });
  check((await page.textContent(R + '.vjn-info')).startsWith('2 clips → 4.0 s, 320 × 240'), `video-joiner: two 2 s clips (${await page.textContent(R + '.vjn-info')})`);
  await page.click(R + '.vjn-go');
  await page.waitForFunction(() => !document.querySelector('.vjn-out').hidden || !document.querySelector('.vjn-err').hidden, null, { timeout: 90000 });
  const res = await page.textContent(R + '.vjn-res');
  check(/Done in .*: 4\.0 s, 320 × 240/.test(res), `video-joiner: joined (${res}${await page.textContent(R + '.vjn-err')})`);
  await page.waitForFunction(() => document.querySelector('.vjn-result').duration > 0, null, { timeout: 10000 }).catch(() => {});
  const dur = await page.$eval(R + '.vjn-result', (v) => v.duration);
  check(Math.abs(dur - 4) < 0.15, `video-joiner: result plays for 4 s (${dur})`);
};
