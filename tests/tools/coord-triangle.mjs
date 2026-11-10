// #1317 Triangle type from coordinates
export const path = '/learn/coord-triangle/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/coord-triangle/`); await page.waitForSelector('.ct .ct-h2');
  const R = '.ct ', txt = (s) => page.textContent(R + s);
  const set = async (i, v) => { await page.fill(`${R}.ct-in[data-i="${i}"]`, v); await page.waitForTimeout(80); };
  { const v = await txt('.ct-verdict'), o = await txt('.ct-out');
    check(v.includes('Scalene and right-angled') && v.includes('at A'), `coord: example verdict (${v})`);
    check(o.includes('so AB = 4') && o.includes('so BC = 5') && o.includes('so CA = 3') && o.includes('= 6 square units') && o.includes('converse of Pythagoras'), 'coord: example working'); }
  await set(2, '9, 1');
  check((await txt('.ct-verdict')).includes('Collinear') && (await txt('.ct-verdict')).includes('B is between') && (await page.$$(R + '.ct-col')).length === 3, 'coord: collinear with B between');
  await set(0, '0, 0'); await set(1, '2, 0'); await set(2, '1, √3');
  check((await txt('.ct-verdict')).startsWith('Equilateral and acute'), `coord: equilateral with √3 (${await txt('.ct-verdict')})`);
  check((await page.$$(R + '.ct-eq')).length === 3, 'coord: three equal sides marked');
  await set(2, '1, 1.732');
  check((await txt('.ct-verdict')).startsWith('Isosceles'), 'coord: 1.732 is only isosceles');
  await set(0, '0, 0'); await set(1, '6, 0'); await set(2, '1, 1');
  check((await txt('.ct-verdict')).includes('obtuse angle at C'), 'coord: obtuse at C');
  await set(1, '1, 1');
  check((await txt('.ct-verdict')).includes('same point'), 'coord: repeated point');
  await set(1, 'x');
  check(await page.isVisible(R + '.ct-err'), 'coord: bad point message');
  await set(0, '1, 1'); await set(1, '5, 1'); await set(2, '1, 4');
  check(await page.isHidden(R + '.ct-err'), 'coord: message clears');
  await page.click(R + '.ct-lvl button[data-l="11"]'); await page.waitForTimeout(80);
  { const o = await txt('.ct-out'); check(o.includes('Slopes: AB = 0, BC = −0.75, CA = undefined (vertical)') && o.includes('one is horizontal and the other vertical'), `coord: class 11 slopes (${o.slice(-200)})`); }
  // Drag C from (1, 4) to (5, 4): a right angle moves to B.
  const fig = page.locator(R + '.ct-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.ct-h2').boundingBox(), b = await fig.boundingBox(), k = b.width / 340;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(b.x + (170 + 5 * 25) * k, b.y + (170 - 4 * 25) * k, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.ct-in[data-i="2"]')) === '5, 4' && (await txt('.ct-verdict')).includes('right angle at B'), `coord: drag C to (5, 4) (${await page.inputValue(R + '.ct-in[data-i="2"]')})`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  check((await page.$$(R + '.sm-q')).length === 4, 'coord: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = i === 2 ? /= ([−\d.]+)\. \(Or/.exec(w) : i === 4 ? /x = ([−\d.]+);/.exec(w) : /= ([\d.]+)(?:,| square|\.$)/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `coord: quiz ${i} (${w})`);
  }
};
