// #T925 Image compare
export const path = '/everyday/image-compare/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/image-compare/`); await page.waitForTimeout(400);
  const R = '.ic ';
  const big = () => page.textContent(R + '.ic-big');
  const px = (x, y) => page.evaluate(([x, y]) => Array.from(document.querySelector('.ic-canvas').getContext('2d').getImageData(x, y, 1, 1).data), [x, y]);
  // Example: 200 x 150 scenes that differ in one 10 x 10 square at (120,110).
  await page.fill(R + '[data-k="pos"]', '50'); await page.waitForTimeout(80);
  const right = await px(125, 115);
  await page.fill(R + '[data-k="pos"]', '70'); await page.waitForTimeout(80);
  const left = await px(125, 115);
  check(right[2] === 0x73 && left[2] !== 0x73, `image-compare: slider moves the line (B ${right} then A ${left})`);
  await page.click(R + '.ic-tabs [data-m="diff"]'); await page.waitForTimeout(150);
  check((await big()) === '0.333% of pixels changed', `image-compare: example 100 of 30,000 px -> 0.333% (${await big()})`);
  const png = async (w, h, sq) => Buffer.from((await page.evaluate(([w, h, sq]) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); if (sq) { g.fillStyle = '#000000'; g.fillRect(20, 20, 10, 10); }
    return c.toDataURL('image/png');
  }, [w, h, sq])).split(',')[1], 'base64');
  await page.setInputFiles(R + '[data-k="a"]', { name: 'a.png', mimeType: 'image/png', buffer: await png(300, 200, false) });
  await page.setInputFiles(R + '[data-k="b"]', { name: 'b.png', mimeType: 'image/png', buffer: await png(300, 200, true) });
  await page.waitForTimeout(400);
  check((await big()) === '0.167% of pixels changed', `image-compare: 300x200 with a 10x10 change -> 100/60000 (${await big()})`);
  await page.setInputFiles(R + '[data-k="b"]', { name: 'b.png', mimeType: 'image/png', buffer: await png(150, 100, false) });
  await page.waitForTimeout(400);
  check((await page.textContent(R + '.ic-note')).includes('fitted to A') && (await big()) === '0.000% of pixels changed', `image-compare: different sizes are fitted (${await big()})`);
  await page.click(R + '.ic-tabs [data-m="overlay"]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '[data-k="op"]') && (await big()) === '', 'image-compare: overlay shows opacity control');
};
