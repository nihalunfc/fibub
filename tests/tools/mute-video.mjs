// #T969 Mute video (also checks the shared VideoJob page)
export const path = '/everyday/mute-video/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/mute-video/`); await page.waitForTimeout(300);
  const R = '.vj ';
  const src = new URL('../fixtures/clip-h264.mp4', import.meta.url).pathname;
  await page.setInputFiles(R + '.vj-file', src);
  await page.waitForSelector(R + '.vj-set:not([hidden])', { timeout: 15000 });
  await page.click(R + '.vj-go');
  await page.waitForFunction(() => !document.querySelector('.vj-out').hidden || !document.querySelector('.vj-err').hidden, null, { timeout: 30000 });
  const res = await page.textContent(R + '.vj-res'), e = await page.textContent(R + '.vj-err');
  check(/Done in .* MP4/.test(res), `mute-video: copies an MP4 without its sound (${res}${e})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vj-dl')]); const f = OUT + 'mute.mp4'; await d.saveAs(f); const b = readFileSync(f);
  const s = b.toString('latin1');
  check(d.suggestedFilename() === 'clip-h264-no-sound.mp4' && s.includes('avc1') && !s.includes('mp4a') && b.length < readFileSync(src).length, `mute-video: H.264 kept, no AAC track (${b.length} bytes)`);
};
