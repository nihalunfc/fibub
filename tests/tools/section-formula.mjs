// #1160 Distance and section formula
export const path = '/learn/section-formula/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/section-formula/`); await page.waitForSelector('.sf .sf-hA');
  const R = '.sf ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.sf-d')).endsWith('= √225 = 15') && (await txt('.sf-p')).includes('= (2, 2).') && (await txt('.sf-p')).includes('= 2.') && (await txt('.sf-mid')).endsWith('(0, 0.5)'), 'section: example distance 15, P (2, 2), M (0, 0.5)');
  check((await txt('.sf-x')).includes('4 : 5'), `section: x axis ratio 4 : 5 (${await txt('.sf-x')})`);
  await page.fill(R + '.sf-m', '1'); await page.waitForTimeout(100);
  check((await txt('.sf-p')).includes('= (0, 0.5).'), 'section: 1 : 1 is the midpoint');
  await page.check(R + '.sf-ext'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sf-err'), 'section: external with m = n message');
  await page.fill(R + '.sf-m', '2'); await page.waitForTimeout(100);
  check((await txt('.sf-p')).includes('externally') && (await txt('.sf-p')).includes('= (18, 14).') && await page.isHidden(R + '.sf-err'), `section: external 2 : 1 gives (18, 14)`);
  await page.uncheck(R + '.sf-ext');
  await page.check(R + '.sf-tri'); await page.waitForTimeout(100);
  check((await txt('.sf-g')).includes('(1.667, −1.667)') && (await txt('.sf-area')).endsWith('= 61.5') && (await page.$$(R + '.sf-med')).length === 3, 'section: centroid and area 61.5');
  // Drag B to (4, 2): A(−6, −4), B(4, 2): distance √136.
  const fig = page.locator(R + '.sf-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded();
  const P = async (x, y) => { const b = await fig.boundingBox(); const k = b.width / 340; return [b.x + (10 + ((x + 10) / 20) * 320) * k, b.y + (330 - ((y + 10) / 20) * 320) * k]; };
  { const [sx, sy] = await P(6, 5), [ex, ey] = await P(4, 2);
    await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(ex, ey, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await txt('.sf-pts')).startsWith('A = (−6, −4), B = (4, 2)') && (await txt('.sf-d')).includes('√136'), `section: drag B to (4, 2) (${await txt('.sf-pts')})`); }
  // Drag C onto the line AB: (−1, −1) is on it, so the area is 0.
  { const [sx, sy] = await P(5, -6), [ex, ey] = await P(-1, -1);
    await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(ex, ey, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await txt('.sf-area')).includes('collinear'), `section: collinear points have area 0 (${await txt('.sf-area')})`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'section: four questions');
  for (const [i, re] of [[1, /= (\d+)\.$/], [2, /= \((\S+), (\S+)\)\.$/], [3, /= \((\S+), (\S+)\)\.$/], [4, /= \((\S+), (\S+)\)\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m.slice(1).join(', ').replace(/−/g, '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `section: quiz ${i} (${w})`);
  }
};
