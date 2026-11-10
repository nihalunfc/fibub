// #1279 Ferris wheel height
export const path = '/learn/ferris-wheel/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ferris-wheel/`); await page.waitForSelector('.fw9 .fw9-seat');
  const R = '.fw9 ', txt = (s) => page.textContent(R + s);
  check((await txt('.fw9-big')) === 'Height 7 m after turning 60°', 'ferris: 60° gives 7 m');
  check((await txt('.fw9-turns')).includes('Less than one full turn') && (await txt('.fw9-turns')).includes('10 s'), 'ferris: under one turn, 10 s');
  check((await txt('.fw9-when')).includes('120° and 240°') && (await txt('.fw9-when')).includes('33.3 %'), 'ferris: 17 m at 120° and 240°, a third of the turn');
  await page.fill(R + '.fw9-a', '450'); await page.waitForTimeout(100);
  check((await txt('.fw9-big')) === 'Height 12 m after turning 450°' && (await txt('.fw9-turns')).includes('1 full turn + 90°') && (await txt('.fw9-turns')).includes('75 s'), 'ferris: 450° is a turn + 90°');
  await page.click(R + '.fw9-lvl button[data-l="11"]'); await page.waitForTimeout(100);
  check((await txt('.fw9-out')).includes('h = H − r cos θ = 12 − 10 × cos 450°') && (await txt('.fw9-out')).includes('rad'), 'ferris: class 11 formula');
  await page.click(R + '.fw9-reset'); await page.waitForTimeout(100);
  check((await txt('.fw9-big')).startsWith('Height 2 m'), 'ferris: bottom is 2 m');
  await page.click(R + '.fw9-step[data-d="90"]'); await page.click(R + '.fw9-step[data-d="90"]'); await page.waitForTimeout(100);
  check((await txt('.fw9-big')) === 'Height 22 m after turning 180°', 'ferris: steps to the top');
  // Drag the seat from the top round to the right side (about 90°).
  const vp = page.viewportSize(); await page.setViewportSize({ width: 1280, height: 1600 }); await page.locator(R + '.fw9-wheel').scrollIntoViewIfNeeded();
  const b2 = await page.locator(R + '.fw9-wheel').boundingBox(), s = b2.width / 340;
  const seat = await page.locator(R + '.fw9-seat').boundingBox();
  await page.mouse.move(seat.x + seat.width / 2, seat.y + seat.height / 2); await page.mouse.down();
  await page.mouse.move(b2.x + 180 * s, b2.y + 60 * s, { steps: 6 }); await page.mouse.move(b2.x + 210 * s, b2.y + 133 * s, { steps: 6 }); await page.mouse.up();
  const a = Number(await page.inputValue(R + '.fw9-a'));
  await page.setViewportSize(vp);
  check(a > 60 && a < 120, `ferris: dragging the seat turns the wheel (${a}°)`);
  await page.click(R + '.fw9-pre[data-p="60,5,1800"]'); await page.fill(R + '.fw9-a', '180'); await page.waitForTimeout(100);
  check((await txt('.fw9-big')) === 'Height 125 m after turning 180°' && (await txt('.fw9-turns')).includes('900 s'), 'ferris: giant wheel');
  await page.fill(R + '.fw9-h', '200'); await page.waitForTimeout(100);
  check((await txt('.fw9-when')).includes('never gets that high'), 'ferris: too high');
  await page.fill(R + '.fw9-h', '1'); await page.waitForTimeout(100);
  check((await txt('.fw9-when')).includes('always higher'), 'ferris: too low');
  await page.fill(R + '.fw9-r', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.fw9-err'), 'ferris: radius 0 message');
  await page.fill(R + '.fw9-r', '10'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.fw9-err'), 'ferris: message clears');
  await page.click(R + '.fw9-play'); await page.waitForTimeout(400); await page.click(R + '.fw9-play');
  check(Number(await page.inputValue(R + '.fw9-a')) > 180 && (await txt('.fw9-play')) === 'Play', 'ferris: play turns the wheel and pauses');
  check((await page.$$(R + '.sm-q')).length === 4, 'ferris: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const ans = w.match(/−?\d+(?:\.\d+)?/g).at(-1).replace('−', '-');
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, ans); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `ferris: quiz ${i} (${w})`);
  }
};
