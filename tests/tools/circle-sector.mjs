// #1161 Circle sectors and tangents
export const path = '/learn/circle-sector/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/circle-sector/`); await page.waitForSelector('.cs .cs-h');
  const R = '.cs ';
  const txt = (s) => page.textContent(R + s);
  { const o = await txt('.cs-out'); check(o.includes('= 231 cm²') && o.includes('= 22 cm') && o.includes('= 64 cm') && o.includes('= 40.04 cm²'), 'circle: example r 21, 60°, π = 22/7'); }
  await page.click(R + '.cs-pi button[data-p="3.14"]'); await page.waitForTimeout(100);
  check((await txt('.cs-out')).includes('= 230.79 cm²'), 'circle: π = 3.14 gives 230.79');
  await page.click(R + '.cs-pi button[data-p="pi"]'); await page.waitForTimeout(100);
  check((await txt('.cs-out')).includes('= 230.91 cm²'), 'circle: exact π gives 230.91');
  await page.click(R + '.cs-pi button[data-p="22/7"]');
  await page.fill(R + '.cs-t', '90'); await page.fill(R + '.cs-r', '14'); await page.waitForTimeout(100);
  check((await txt('.cs-out')).includes('= 154 cm²') && (await txt('.cs-out')).includes('= 22 cm'), 'circle: quarter of r 14 is 154 cm²');
  await page.click(R + '.cs-shade button[data-s="segment"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.cs-seg')).length === 1 && (await txt('.cs-out')).includes('154 − 98 = 56 cm²'), 'circle: segment of 90° is 56 cm²');
  await page.fill(R + '.cs-t', '370'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.cs-err'), 'circle: over 360° message');
  await page.fill(R + '.cs-t', '60'); await page.fill(R + '.cs-r', '21'); await page.waitForTimeout(100);
  // Drag the arc point to the top (90°).
  const fig = page.locator(R + '.cs-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.cs-h').boundingBox(), b = await fig.boundingBox(), k = b.width / 340;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 170 * k, b.y + 30 * k, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.cs-t')) === '90', `circle: drag to the top gives 90° (${await page.inputValue(R + '.cs-t')})`); }
  // Tangents: P starts 180 px from O with radius 70 px: OP = 10.29 cm.
  { const t = await txt('.cs-tout'); check(t.includes('OP = 10.29 cm') && t.includes('PT₁ = PT₂ = 9.48 cm') && (await page.$$(R + '.cs-tl')).length === 2, `circle: tangents from P (${t.slice(0, 160)})`); }
  const tan = page.locator(R + '.cs-tan'); await tan.scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.cs-hp').boundingBox(), b = await tan.boundingBox(), k = b.width / 340;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(b.x + (110 + 87.5) * k, b.y + 130 * k, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    const t = await txt('.cs-tout'); check(t.includes('OP = 5 cm') && t.includes('= 3 cm'), `circle: P 5 cm away gives tangent 3 cm (${t.slice(0, 140)})`); }
  { const h = await page.locator(R + '.cs-hp').boundingBox(), b = await tan.boundingBox(), k = b.width / 340;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 130 * k, b.y + 130 * k, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await txt('.cs-tout')).includes('inside the circle') && (await page.$$(R + '.cs-tl')).length === 0, 'circle: P inside, no tangents'); }
  await page.setViewportSize({ width: 1280, height: 720 });
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'circle: four questions');
  for (const [i, re] of [[1, /= (\S+) cm²\.$/], [2, /= (\S+) cm\.$/], [3, /= (\d+) cm\.$/], [4, /= (\d+)°\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `circle: quiz ${i} (${w})`);
  }
};
