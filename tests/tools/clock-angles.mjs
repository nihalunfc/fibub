// #1285 Clock hand angles
export const path = '/learn/clock-angles/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/clock-angles/`); await page.waitForSelector('.ck .ck-knob');
  const R = '.ck ', txt = (s) => page.textContent(R + s);
  check((await txt('.ck-big')) === '3:30: the hands are 75° apart', 'clock: 3:30 is 75°');
  check((await txt('.ck-out')).includes('= 105° from 12') && (await txt('.ck-out')).includes('|30 × 3 − 5.5 × 30| = 75°'), 'clock: working shows 105° and the shortcut');
  check((await txt('.ck-when')).includes('22 times') && (await txt('.ck-when')).includes('12:16 and 22 s') && (await txt('.ck-when')).includes('44 times'), 'clock: right angles 22 times');
  await page.click(R + '.ck-pre[data-t="9,45"]'); await page.waitForTimeout(100);
  check((await txt('.ck-big')) === '9:45: the hands are 22.5° apart' && (await txt('.ck-sub')).includes('337.5°'), 'clock: 9:45 is 22.5°, reflex 337.5°');
  await page.click(R + '.ck-pre[data-t="6,0"]'); await page.waitForTimeout(100);
  check((await txt('.ck-sub')).includes('straight line'), 'clock: 6:00 straight');
  await page.fill(R + '.ck-want', '0'); await page.waitForTimeout(100);
  check((await txt('.ck-when')).includes('11 times') && (await txt('.ck-when')).includes('next one after 6:00 is 6:32 and 44 s'), 'clock: overlaps 11 times; next after 6:00');
  await page.click(R + '.ck-next'); await page.waitForTimeout(100);
  check((await txt('.ck-big')).includes('0° apart'), 'clock: jumps to the overlap');
  await page.click(R + '.ck-pre[data-t="2,20"]'); await page.click(R + '.ck-step[data-d="60"]'); await page.click(R + '.ck-step[data-d="-5"]'); await page.waitForTimeout(100);
  check((await txt('.ck-big')).startsWith('3:15:') && (await txt('.ck-big')).includes('7.5°'), 'clock: steps to 3:15, 7.5°');
  await page.fill(R + '.ck-h', '15'); await page.fill(R + '.ck-m', '0'); await page.waitForTimeout(100);
  check((await txt('.ck-big')).startsWith('3:00') && (await txt('.ck-big')).includes('90°'), 'clock: 15:00 is 3:00');
  await page.fill(R + '.ck-m', '75'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ck-err'), 'clock: 75 minutes rejected');
  await page.fill(R + '.ck-m', '0'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.ck-err'), 'clock: message clears');
  await page.fill(R + '.ck-want', '200'); await page.waitForTimeout(100);
  check((await txt('.ck-when')).startsWith('Type an angle'), 'clock: 200° rejected');
  // Drag the minute hand from 12 to 3 (a quarter turn): 3:00 → 3:15.
  const vp = page.viewportSize(); await page.setViewportSize({ width: 1280, height: 1600 });
  const face = page.locator(R + '.ck-face'); await face.scrollIntoViewIfNeeded();
  const b = await face.boundingBox(), k = b.width / 300;
  await page.mouse.move(b.x + 150 * k, b.y + 30 * k); await page.mouse.down();
  await page.mouse.move(b.x + 230 * k, b.y + 60 * k, { steps: 5 }); await page.mouse.move(b.x + 270 * k, b.y + 150 * k, { steps: 5 }); await page.mouse.up();
  await page.setViewportSize(vp);
  check((await txt('.ck-big')).startsWith('3:15:'), `clock: dragging the minute hand (${await txt('.ck-big')})`);
  check((await page.$$(R + '.sm-q')).length === 4, 'clock: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, w.match(/\d+(?:\.\d+)?/g).at(-1)); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `clock: quiz ${i} (${w})`);
  }
};
