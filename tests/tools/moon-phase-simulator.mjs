// #1227 Moon phase simulator
export const path = '/learn/moon-phase-simulator/';
export default async ({ page, check, BASE }) => {
  const R = '.mp ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForSelector(R + '.mp-top .mp-handle');
  check((await t('.mp-name')) === 'Waxing crescent' && (await t('.mp-lit')).includes('17%') && (await t('.mp-tithi')).includes('Tithi 5 of 30: Shukla paksha Panchami') && (await t('.mp-rise')).includes('09:15') && (await t('.mp-rise')).includes('21:15'), 'moon: opening 4-day crescent');
  check((await page.$$(R + '.mp-sel')).length === 1 && (await page.$$(R + '.mp-sky .mp-moonlit')).length >= 8, 'moon: sky view and phase strip');
  await page.click(R + '.mp-go[data-t="180"]'); await page.waitForTimeout(100);
  check((await t('.mp-name')) === 'Full moon' && (await t('.mp-lit')).includes('100%') && (await t('.mp-tithi')).includes('Purnima') && (await t('.mp-rise')).includes('18:00'), 'moon: full moon');
  await page.click(R + '.mp-next'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.mp-a')) === '15.76' && (await t('.mp-name')) === 'Waning gibbous' && (await t('.mp-tithi')).includes('Krishna'), 'moon: +1 day wanes');
  await page.click(R + '.mp-go[data-t="90"]'); await page.waitForTimeout(100);
  check((await t('.mp-name')) === 'First quarter' && (await t('.mp-lit')).includes('50%'), 'moon: first quarter half lit');
  // Drag the Moon from first quarter (bottom of the orbit) to the right side (full).
  await page.locator(R + '.mp-top').scrollIntoViewIfNeeded();
  const box = await page.locator(R + '.mp-top').boundingBox(), sx = box.width / 340, sy = box.height / 290;
  await page.mouse.move(box.x + 170 * sx, box.y + 255 * sy); await page.mouse.down();
  await page.mouse.move(box.x + 250 * sx, box.y + 230 * sy, { steps: 4 }); await page.mouse.move(box.x + 275 * sx, box.y + 150 * sy, { steps: 4 }); await page.mouse.up();
  await page.waitForTimeout(100);
  check((await t('.mp-name')) === 'Full moon', `moon: drag to the far side gives full moon (${await page.inputValue(R + '.mp-a')})`);
  check(await page.isHidden(R + '.mp-k'), 'moon: formula hidden at Class 8');
  await page.click(R + '.mp-level [data-v="9"]'); await page.fill(R + '.mp-a', '7.4'); await page.waitForTimeout(100);
  check((await t('.mp-k')).includes('0.50') && (await t('.mp-sid')).includes('27.32'), 'moon: Class 9 to 12 formula and months');
  const before = await page.$eval(R + '.mp-sky g path', (e) => e.parentNode.getAttribute('transform'));
  await page.click(R + '.mp-hemi [data-v="s"]'); await page.waitForTimeout(100);
  const after = await page.$eval(R + '.mp-sky g path', (e) => e.parentNode.getAttribute('transform'));
  check(!before.includes('scale') && after.includes('scale(-1 1)'), 'moon: south flips the face');
  await page.fill(R + '.mp-date', '2026-11-09'); await page.click(R + '.mp-use'); await page.waitForTimeout(100);
  check((await t('.mp-dout')).includes('mean age 29 days, new moon') && (await t('.mp-name')) === 'New moon', 'moon: 9 Nov 2026 is new moon');
  await page.fill(R + '.mp-date', '2025-03-14'); await page.click(R + '.mp-use'); await page.waitForTimeout(100);
  check((await t('.mp-name')) === 'Full moon', 'moon: 14 Mar 2025 full moon');
  await page.click(R + '.mp-today'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.mp-date')).length === 10 && (await t('.mp-dout')).includes('mean age'), 'moon: today');
  await page.fill(R + '.mp-date', ''); await page.click(R + '.mp-use'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.mp-err'), 'moon: no date message');
  check((await page.$$(R + '.sm-q')).length === 5, 'moon: five questions');
  const res = [/= ([\d.]+) days\.$/, /, so (\d+)% is lit/, /tithi (\d+) \(/, /= (\d+) minutes later/, /= ([\d.]+) days\.$/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `moon: quiz ${i} (${w})`);
  }
};
