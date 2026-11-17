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
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/coord-triangle/`); await page.waitForTimeout(600);
  {
  const S = '.ct-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const pick = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  await pre(0); check((await ans()) === 'ABC is a scalene, right-angled triangle (right angle at A), with area 6 square units and perimeter 12.' && (await work()).includes('= ½ × 12 = 6'), `coord solve: right triangle (${await ans()})`);
  await fill('C', '9, 1'); check((await ans()).startsWith('The three points are collinear') && (await ans()).includes('B lies between'), `coord solve: collinear (${await ans()})`);
  await fill('C', '5'); check((await ans()).includes('needs two numbers'), `coord solve: one number (${await ans()})`);
  await pre(1); check((await ans()) === 'ABC is an isosceles, acute triangle, with area 6 square units and perimeter 11.21.' && (await work()).includes('BC = √((2 − 4)² + (3 − 0)²) = √13 = 3.6056'), `coord solve: isosceles (${await ans()})`);
  await pre(2); check((await ans()) === 'AB = 6.3246 (2√10) and the midpoint is (−1, 2).' && (await work()).includes('y = (1/3)x + 7/3'), `coord solve: distance and line (${await ans()})`);
  await fill('B', '2, 7'); check((await work()).includes('slope is not defined') && (await ans()).startsWith('AB = 4'), `coord solve: vertical line (${await ans()})`);
  await fill('B', '2, 3'); check((await ans()).includes('same point'), `coord solve: same point (${await ans()})`);
  await pre(3); check((await ans()) === 'The point dividing AB internally in the ratio 2 : 3 is (1, 3).', `coord solve: section (${await ans()})`);
  await pick('kind', 'ex'); await fill('m', '3'); await fill('n', '2'); check((await ans()) === 'The point dividing AB externally in the ratio 3 : 2 is (14, −23).', `coord solve: external (${await ans()})`);
  await fill('n', '3'); check((await ans()).includes('1 : 1'), `coord solve: external 1:1 (${await ans()})`);
  await pre(4); check((await ans()) === 'The x-axis cuts AB at (3, 0), dividing it internally in the ratio 1 : 2.', `coord solve: x-axis (${await ans()})`);
  await pick('which', 'y'); check((await ans()) === 'The y-axis cuts AB at (0, −9), dividing it externally in the ratio 2 : 5.', `coord solve: y-axis (${await ans()})`);
  }
};
