// #1153 Trig ratio explorer
export const path = '/learn/trig-ratios/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/trig-ratios/`); await page.waitForSelector('.tr .tr-h');
  const R = '.tr ';
  const txt = (s) => page.textContent(R + s);
  const val = async (k) => page.textContent(`${R}.tr-tab tr[data-k="${k}"] td:last-child`);
  check((await val('sin')) === '0.5' && (await val('cos')) === '0.866' && (await val('tan')) === '0.5774' && (await val('cosec')) === '2', 'trig: 30° ratios');
  check((await txt('.tr-quad')).includes('opposite = 2.5') && (await txt('.tr-quad')).includes('adjacent = 4.33'), 'trig: sides at r = 5');
  check((await page.$$eval(R + '.tr-ex .on', (e) => e.length)) === 7, 'trig: 30° column highlighted');
  check((await txt('.tr-id')).includes('0.25 + 0.75 = 1') && (await txt('.tr-id')).includes('sin 60° = 0.866 = cos θ'), 'trig: identities at 30°');
  // Size does not change the ratio.
  await page.fill(R + '.tr-r', '10'); await page.waitForTimeout(100);
  check((await val('sin')) === '0.5' && (await txt('.tr-quad')).includes('opposite = 5,'), 'trig: r = 10 keeps sin 30° = 0.5');
  // Special angles.
  await page.click(R + '.tr-special button[data-a="90"]'); await page.waitForTimeout(100);
  check((await val('tan')) === 'not defined' && (await val('sin')) === '1' && (await txt('.tr-id')).includes('not defined here, because cos θ = 0'), 'trig: 90° tan undefined');
  await page.click(R + '.tr-special button[data-a="45"]'); await page.waitForTimeout(100);
  check((await val('tan')) === '1' && (await val('sin')) === (await val('cos')), 'trig: 45° sin = cos, tan 1');
  await page.click(R + '.tr-special button[data-a="0"]'); await page.waitForTimeout(100);
  check((await val('cot')) === 'not defined' && (await val('cos')) === '1', 'trig: 0° cot undefined');
  // Class 10 clamps typed angles; Class 11 full circle.
  await page.fill(R + '.tr-t', '150'); await page.waitForTimeout(100);
  check((await page.$eval(R + '.tr-fig text', (e) => e.textContent)) !== null && (await val('sin')) === '1', 'trig: Class 10 clamps 150° to 90°');
  await page.click(R + '.tr-level button[data-l="11"]'); await page.waitForTimeout(100);
  await page.fill(R + '.tr-t', '150'); await page.waitForTimeout(100);
  check((await val('cos')) === '−0.866' && (await val('sin')) === '0.5' && (await txt('.tr-quad')).includes('Quadrant II: sin and cosec positive'), 'trig: 150° in quadrant II');
  await page.fill(R + '.tr-t', '240'); await page.waitForTimeout(100);
  check((await txt('.tr-quad')).includes('Quadrant III: tan and cot') && (await val('tan')) === '1.7321', 'trig: 240° in quadrant III');
  // Drag the point to straight up in Class 11 → 90°.
  const fig = page.locator(R + '.tr-fig'); await fig.scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.tr-h').boundingBox(); const b = await fig.boundingBox(); const k = b.width / 340;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + 170 * k, b.y + 30 * k, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.tr-t')) === '90', `trig: drag to the top gives 90° (${await page.inputValue(R + '.tr-t')})`); }
  await page.click(R + '.tr-level button[data-l="10"]'); await page.waitForTimeout(100);
  // Drag in Class 10 to about 60°.
  { const h = await page.locator(R + '.tr-h').boundingBox(); const b = await fig.boundingBox(); const k = b.width / 340;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + (40 + 130) * k, b.y + (300 - 225.17) * k, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.tr-t')) === '60' && (await val('cos')) === '0.5', `trig: drag to 60° in Class 10 (${await page.inputValue(R + '.tr-t')})`); }
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'trig: four questions');
  await page.click(R + '.sm-q:nth-child(1) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(1) .sm-qwork'); const m = / = (\d+)\/(\d+) ≈/.exec(w); await page.fill(R + '.sm-q:nth-child(1) .sm-qin', `${m[1]}/${m[2]}`); await page.click(R + '.sm-q:nth-child(1) .sm-qcheck');
    check((await txt('.sm-q:nth-child(1) .sm-qres')) === 'Right!', `trig: fraction answer accepted (${m[1]}/${m[2]})`); }
  await page.click(R + '.sm-q:nth-child(3) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(3) .sm-qwork'); const m = /= (\d+)\.$/.exec(w); await page.fill(R + '.sm-q:nth-child(3) .sm-qin', m[1]); await page.click(R + '.sm-q:nth-child(3) .sm-qcheck');
    check((await txt('.sm-q:nth-child(3) .sm-qres')) === 'Right!', 'trig: complementary angle accepted'); }
  await page.fill(R + '.sm-q:nth-child(2) .sm-qin', '7'); await page.click(R + '.sm-q:nth-child(2) .sm-qcheck');
  check((await txt('.sm-q:nth-child(2) .sm-qres')).includes('Not quite'), 'trig: wrong answer');
};
