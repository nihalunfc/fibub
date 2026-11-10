// #1279 Ferris wheel height
export const path = '/learn/ferris-wheel/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ferris-wheel/`); await page.waitForSelector('.fw .fw-seat');
  const R = '.fw ', txt = (s) => page.textContent(R + s);
  check((await txt('.fw-big')) === 'Height 2 m after 0 min', 'ferris: starts at the bottom, 2 m');
  await page.fill(R + '.fw-n', '2'); await page.waitForTimeout(80);
  check((await txt('.fw-big')).startsWith('Height 22 m') && (await txt('.fw-steps')).includes('= 90°'), 'ferris: quarter turn is 22 m');
  await page.fill(R + '.fw-n', String(8 / 3)); await page.waitForTimeout(80);
  check((await txt('.fw-big')).startsWith('Height 32 m'), 'ferris: 120° is 32 m');
  check((await txt('.fw-above')).includes('33.3% of each turn = 2.67 min, from 2.67 to 5.33 min'), 'ferris: time above 32 m');
  { const rows = await page.locator(R + '.fw-tab tbody tr').allTextContents(); check(rows.length === 13 && rows[1] === '30°0.674.68' && rows[6] === '180°442', `ferris: table (${rows[1]}, ${rows[6]})`); }
  await page.click(R + '.fw-lvl button[data-l="11"]'); await page.waitForTimeout(80);
  check((await txt('.fw-steps')).includes('ω = 2π ÷ T = 2π ÷ 8 = 0.7854') && (await txt('.fw-steps')).includes('sin(ωt − π/2)') && (await txt('.fw-tab')).includes('π/6'), 'ferris: Class 11 view');
  await page.click(R + '.fw-lvl button[data-l="9"]');
  await page.fill(R + '.fw-g', '22'); await page.waitForTimeout(80);
  check((await txt('.fw-above')).includes('50% of each turn = 4 min'), 'ferris: above the hub half the time');
  await page.fill(R + '.fw-g', '50'); await page.waitForTimeout(80);
  check((await txt('.fw-above')).includes('never gets above'), 'ferris: never above 50 m');
  await page.fill(R + '.fw-h', '10'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.fw-err') && (await txt('.fw-err')).includes('at least as high as the radius'), 'ferris: hub too low message');
  await page.fill(R + '.fw-h', '22'); await page.fill(R + '.fw-n', '0'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.fw-err'), 'ferris: message clears');
  // Drag the seat from the bottom to the right-hand side: a quarter turn anticlockwise.
  await page.setViewportSize({ width: 1280, height: 1400 });
  const fig = page.locator(R + '.fw-fig'); await fig.scrollIntoViewIfNeeded();
  {
    const s = await page.locator(R + '.fw-fig .fw-seat').boundingBox(), f = await fig.boundingBox();
    const hub = await page.evaluate(() => { const c = document.querySelectorAll('.fw .fw-fig circle')[1]; return [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))]; });
    const sc = f.width / 340, hx = f.x + hub[0] * sc, hy = f.y + hub[1] * sc, rr = s.y + s.height / 2 - hy;
    await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2); await page.mouse.down();
    await page.mouse.move(hx + rr * 0.7, hy + rr * 0.7, { steps: 5 }); await page.mouse.move(hx + rr, hy, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
    const t = Number(await page.inputValue(R + '.fw-n')); check(Math.abs(t - 2) < 0.15, `ferris: dragging the seat a quarter turn sets t ≈ 2 (${t})`);
  }
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.locator(R + '.fw-play').scrollIntoViewIfNeeded();
  await page.click(R + '.fw-play'); await page.waitForTimeout(400); await page.click(R + '.fw-play');
  check(Number(await page.inputValue(R + '.fw-n')) > 2 && (await txt('.fw-play')) === 'Play', 'ferris: play moves the seat and pauses');
  await page.click(R + '.fw-zero'); check((await txt('.fw-big')) === 'Height 2 m after 0 min', 'ferris: back to the bottom');
  check((await page.$$(R + '.sm-q')).length === 4, 'ferris: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = /(-?[\d.]+) (m|min)\.( The|$)/.exec(w.replace(/−\s?/g, '-'));
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `ferris: quiz ${i} (${w})`);
  }
};
