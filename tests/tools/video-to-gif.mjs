// #T921 Video to GIF
export const path = '/everyday/video-to-gif/';
// Count the image blocks in a GIF by walking its blocks.
const gifFrames = (b) => {
  let p = 13, n = 0;
  if (b[10] & 0x80) p += 3 * (2 << (b[10] & 7));
  const skipSub = () => { while (b[p]) p += b[p] + 1; p++; };
  while (p < b.length) {
    const t = b[p];
    if (t === 0x3b) return n;
    if (t === 0x21) { p += 2; skipSub(); }
    else if (t === 0x2c) { const f = b[p + 9]; p += 10; if (f & 0x80) p += 3 * (2 << (f & 7)); p++; skipSub(); n++; }
    else return -1;
  }
  return -1;
};
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/video-to-gif/`); await page.waitForTimeout(300);
  const R = '.vtg ';
  check(await page.isHidden(R + '.vtg-stage'), 'video-to-gif: waits for a video');
  // ball-throw.webm: 320 x 240, 13 frames at 30 fps (0.43 s).
  await page.setInputFiles(R + '.vtg-file', new URL('../fixtures/ball-throw.webm', import.meta.url).pathname);
  await page.waitForSelector(R + '.vtg-stage:not([hidden])', { timeout: 8000 }); await page.waitForTimeout(900);
  const info = () => page.textContent(R + '.vtg-info');
  check((await info()).startsWith('4 frames, 320 × 240 px'), `video-to-gif: 10 fps on 0.43 s is 4 frames (${await info()})`);
  const makeGif = async (name) => {
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), (async () => { await page.click(R + '.vtg-make'); await page.waitForSelector(R + '.vtg-out:not([hidden])', { timeout: 30000 }); await page.click(R + '.vtg-dl'); })()]);
    const f = OUT + name; await d.saveAs(f); return readFileSync(f);
  };
  const g1 = await makeGif('vtg-10.gif');
  check(g1.subarray(0, 6).toString('latin1') === 'GIF89a' && gifFrames(g1) === 4 && g1.includes(Buffer.from('NETSCAPE2.0')), `video-to-gif: GIF89a with 4 frames that loops (${gifFrames(g1)})`);
  await page.fill(R + '.vtg-fps', '20'); await page.dispatchEvent(R + '.vtg-fps', 'input'); await page.uncheck(R + '.vtg-loop');
  await page.fill(R + '.vtg-w', '160'); await page.waitForTimeout(900);
  check((await info()).startsWith('9 frames, 160 × 120 px'), `video-to-gif: 20 fps and width 160 change the plan (${await info()})`);
  const g2 = await makeGif('vtg-20.gif');
  check(gifFrames(g2) === 9 && g2.readUInt16LE(6) === 160 && !g2.includes(Buffer.from('NETSCAPE2.0')), `video-to-gif: 9 frames, 160 wide, plays once (${gifFrames(g2)})`);
  await page.fill(R + '.vtg-e', '0'); await page.waitForTimeout(200);
  check((await info()).includes('end must be after') && await page.isDisabled(R + '.vtg-make'), 'video-to-gif: end before start is refused');
};
