// #T966 Frame grabber
export const path = '/everyday/frame-grabber/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/frame-grabber/`); await page.waitForTimeout(300);
  const R = '.fg ';
  await page.setInputFiles(R + '.fg-file', new URL('../fixtures/clip-vp8.webm', import.meta.url).pathname);
  await page.waitForSelector(R + '.fg-stage:not([hidden])', { timeout: 15000 });
  check((await page.textContent(R + '.fg-name')).includes('320 × 240') && (await page.textContent(R + '.fg-plan')).startsWith('3 frames'), `frame-grabber: opens, plans 3 frames over 2 s (${await page.textContent(R + '.fg-plan')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fg-one')]); const f = OUT + 'fg.png'; await d.saveAs(f); const b = readFileSync(f);
  check(/^clip-vp8-00m00\.00s\.png$/.test(d.suggestedFilename()) && b.readUInt32BE(16) === 320 && b.readUInt32BE(20) === 240, `frame-grabber: one PNG, 320 × 240 (${d.suggestedFilename()})`);
  await page.fill(R + '.fg-every', '0.5'); await page.selectOption(R + '.fg-fmt', 'image/jpeg'); await page.selectOption(R + '.fg-size', '0.5');
  const [z] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.click(R + '.fg-many')]); const zf = OUT + 'fg.zip'; await z.saveAs(zf); const zb = readFileSync(zf);
  const names = zb.toString('latin1').match(/clip-vp8-\d{3}-[^\0]*?\.jpg/g) || [];
  check(z.suggestedFilename() === 'clip-vp8-frames.zip' && new Set(names).size === 5, `frame-grabber: ZIP of 5 JPGs every 0.5 s (${new Set(names).size})`);
};
