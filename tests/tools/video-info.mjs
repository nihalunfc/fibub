// #T970 Video info
export const path = '/everyday/video-info/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/video-info/`); await page.waitForTimeout(300);
  const R = '.vi ';
  await page.setInputFiles(R + '.vi-file', new URL('../fixtures/clip-h264.mp4', import.meta.url).pathname);
  await page.waitForSelector(R + '.vi-out:not([hidden])', { timeout: 15000 });
  const t = await page.$$eval(R + '.vi-t tr', (r) => r.map((x) => x.textContent).join(' | '));
  check(/Container(MP4|ISO)/i.test(t) && t.includes('Length0:02.00') && t.includes('CodecH.264 (AVC) (avc1') && t.includes('Picture320 × 240 (4:3)') && t.includes('Frame rate25 frames') && t.includes('CodecAAC') && t.includes('1 (mono)'), `video-info: MP4 container, H.264 320x240 at 25 fps, AAC mono (${t.slice(0, 400)})`);
  await page.setInputFiles(R + '.vi-file', new URL('../fixtures/clip-vp8.webm', import.meta.url).pathname);
  await page.waitForFunction(() => document.querySelector('.vi-t').textContent.includes('VP8'), null, { timeout: 15000 });
  check((await page.textContent(R + '.vi-t')).includes('Opus'), 'video-info: WebM with VP8 and Opus');
};
