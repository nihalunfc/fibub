// #T976 Video converter
export const path = '/everyday/video-converter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.vj ';
  const run = async (fixture, to) => {
    await page.goto(`${BASE}/everyday/video-converter/`); await page.waitForTimeout(300);
    await page.setInputFiles(R + '.vj-file', new URL('../fixtures/' + fixture, import.meta.url).pathname);
    await page.waitForSelector(R + '.vj-set:not([hidden])', { timeout: 15000 });
    await page.selectOption(R + '.vj-to', to);
    await page.click(R + '.vj-go');
    await page.waitForFunction(() => !document.querySelector('.vj-out').hidden || !document.querySelector('.vj-err').hidden, null, { timeout: 60000 });
    return (await page.textContent(R + '.vj-res')) + (await page.textContent(R + '.vj-err'));
  };
  let res = await run('clip-vp8.webm', 'mp4');
  check(/MP4, picture encoded again\.$/.test(res), `video-converter: VP8 WebM to MP4 encodes the picture (${res})`);
  await page.waitForFunction(() => document.querySelector('.vj-result').videoWidth > 0, null, { timeout: 10000 }).catch(() => {});
  check((await page.$eval(R + '.vj-result', (v) => v.videoWidth)) === 320, 'video-converter: the MP4 plays in the page');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vj-dl')]); const f = OUT + 'conv.mp4'; await d.saveAs(f); const b = readFileSync(f);
  check(d.suggestedFilename() === 'clip-vp8.mp4' && b.toString('latin1', 4, 8) === 'ftyp' && b.includes('avc1'), 'video-converter: an H.264 MP4 file');
  res = await run('clip-h264.mp4', 'mov');
  check(/MOV, picture copied without loss/.test(res), `video-converter: H.264 MP4 to MOV is copied (${res})`);
};
