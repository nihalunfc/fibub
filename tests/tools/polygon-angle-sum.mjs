// #1238 Polygon angle sum by triangles
export const path = '/learn/polygon-angle-sum/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/polygon-angle-sum/`); await page.waitForSelector('.pa .pa-fig .sm-handle');
  const R = '.pa ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.pa-big')) === '5 sides: 3 triangles, 540°', 'polygon: pentagon 540°');
  check((await txt('.pa-f1')) === 'Angles: 108° + 108° + 108° + 108° + 108° = 540°' && (await txt('.pa-f3')).includes('108°'), 'polygon: regular pentagon angles');
  check((await page.$$(R + '.pa-diag')).length === 2 && (await page.$$(R + '.pa-fig polygon')).length === 4, 'polygon: 3 triangles, 2 cutting lines');
  // Drag a corner.
  const box = await page.locator(R + '.pa-fig .sm-handle').nth(2).boundingBox();
  await page.$eval(R + '.pa-fig', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  const b2 = await page.locator(R + '.pa-fig .sm-handle').nth(2).boundingBox();
  await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2); await page.mouse.down();
  await page.mouse.move(b2.x + b2.width / 2 + 25, b2.y + b2.height / 2 + 15, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
  const moved = await page.locator(R + '.pa-fig .sm-handle').nth(2).boundingBox();
  check(box && Math.abs(moved.x - b2.x) > 10 && (await txt('.pa-f1')).endsWith('= 540°') && !(await txt('.pa-f1')).startsWith('Angles: 108° + 108° + 108°'), 'polygon: dragging changes angles, sum stays 540°');
  await page.click(R + '.pa-dent'); await page.waitForTimeout(100);
  check((await txt('.pa-f3')).includes('concave') && (await txt('.pa-f1')).endsWith('= 540°'), 'polygon: dent gives a reflex angle, sum stays');
  await page.check(R + '.pa-ext'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pa-f4') && (await txt('.pa-f4')).includes('= 360°') && (await txt('.pa-f4')).includes('negative') && (await page.$$(R + '.pa-e')).length === 5, 'polygon: exterior angles add to 360°');
  await page.fill(R + '.pa-n', '8'); await page.waitForTimeout(100);
  check((await txt('.pa-big')) === '8 sides: 6 triangles, 1080°' && (await txt('.pa-f3')).includes('135°') && (await page.inputValue(R + '.pa-nr')) === '8', 'polygon: octagon 1080°, 135° each');
  await page.click(R + '.pa-rnd'); await page.waitForTimeout(100);
  check((await txt('.pa-f1')).endsWith('= 1080°') && (await txt('.pa-f4')).includes('= 360°'), 'polygon: random shape still 1080° and 360°');
  await page.uncheck(R + '.pa-ext'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.pa-f4') && (await page.$$(R + '.pa-e')).length === 0, 'polygon: exterior angles off');
  await page.fill(R + '.pa-n', '3'); await page.waitForTimeout(100);
  check((await txt('.pa-big')) === '3 sides: 1 triangle, 180°' && (await page.$$(R + '.pa-diag')).length === 0, 'polygon: triangle 180°');
  await page.fill(R + '.pa-n', '12'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pa-err'), 'polygon: too many sides message');
  await page.fill(R + '.pa-n', '4'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.pa-err') && (await txt('.pa-big')).endsWith('360°'), 'polygon: back to 4 sides');
  // Cross two sides: drag corner 0 (top) to below the bottom.
  await page.$eval(R + '.pa-fig', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  await page.setViewportSize({ width: 1280, height: 1100 }); await page.$eval(R + '.pa-fig', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  const h0 = await page.locator(R + '.pa-fig .sm-handle').nth(0).boundingBox();
  const to = await page.$eval(R + '.pa-fig', (s) => { const p = new DOMPoint(255, 285).matrixTransform(s.getScreenCTM()); return { x: p.x, y: p.y }; });
  await page.mouse.move(h0.x + h0.width / 2, h0.y + h0.height / 2); await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pa-err') && (await txt('.pa-big')) === 'Not a simple polygon', 'polygon: crossing sides are flagged ' + JSON.stringify([h0, to, await page.$$eval(R + '.pa-fig .sm-handle', (h) => h.map((c) => c.getAttribute('cx') + ',' + c.getAttribute('cy')))]));
  await page.click(R + '.pa-reg'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.pa-err'), 'polygon: make it regular fixes it');
  check((await page.$$(R + '.pa-tab tr')).length === 9, 'polygon: table 3 to 10 sides');
  check((await page.$$(R + '.sm-q')).length === 5, 'polygon: five questions');
  const res = [/= (\d+)°\.$/, /= ([\d.]+)°\.$/, /= (\d+)°\./, /= (\d+)\.$/, /= ([\d.]+)°\.$/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `polygon: quiz question ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/polygon-angle-sum/`); await page.waitForTimeout(600);
  {
  const S = '.pa-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const sel = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const is = async (want, label) => check((await ans()) === want, `polygon solve: ${label} (${await ans()})`);
  const has = async (want, label) => check((await ans()).includes(want), `polygon solve: ${label} (${await ans()})`);
  const wk = async (want, label) => check((await work()).includes(want), `polygon solve working: ${label}`);
  await pre(0); await is('The octagon (8 sides) has an angle sum of 1080°. If it is regular, each angle is 135°.', 'octagon'); await wk('8 × 5 ÷ 2 = 20', 'diagonals'); await wk('360° ÷ 8 = 45°', 'exterior');
  await pre(1); await is('The polygon has 15 sides.', 'interior 156'); await wk('360° ÷ 24° = 15', 'interior working');
  await pre(2); await is('The polygon has 15 sides.', 'exterior 24');
  await pre(3); await is('The polygon has 11 sides.', 'sum 1620'); await wk('1620° ÷ 180° = 9', 'sum working');
  await pre(4); await is('The missing angle is 105°.', 'hexagon missing'); await wk('720° − 615° = 105°', 'missing working');
  await pre(5); await is('A decagon (10 sides) has 35 diagonals.', 'decagon diagonals');
  await pre(0); await fill('n', '2'); await has('at least 3 sides', 'n of 2');
  await fill('n', '3'); await is('The triangle (3 sides) has an angle sum of 180°. If it is regular, each angle is 60°.', 'triangle');
  await pre(1); await fill('a', '100'); await has('4.5 sides', 'no regular polygon with 100°');
  await fill('a', '200'); await has('less than 180°', 'angle over 180');
  await sel('a-unit', 'radians'); await fill('a', '2.0944'); await is('The polygon has 6 sides (hexagon).', 'radians');
  await pre(2); await fill('a', '7'); await has('not a whole number', 'exterior 7');
  await pre(3); await fill('a', '1000'); await has('multiple of 180°', 'bad angle sum');
  await pre(4); await fill('known', '300 300 300 300 300'); await has('already more than', 'known angles too big');
  await fill('known', '90 100'); await is('Each of the other 4 angles is 132.5°.', 'equal remaining angles');
  }
};
