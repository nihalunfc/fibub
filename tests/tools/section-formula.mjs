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
  // Solve with your numbers (typed).
  { const K = (k) => `${R}[data-k="${k}"]`, ans = () => txt('.sf-ans'), work = () => txt('.sf-work');
    check((await ans()).includes('ratio 1 : 2 at P = (4, 0)'), `section solve: default 1 : 2 gives (4, 0) (${await ans()})`);
    await page.selectOption(K('mode'), 'ext'); await page.fill(K('m'), '3'); await page.fill(K('n'), '1');
    check((await ans()).includes('externally') && (await ans()).includes('P = (11, 10.5)'), `section solve: external 3 : 1 gives (11, 10.5) (${await ans()})`);
    await page.fill(K('n'), '3');
    check(await page.isVisible(R + '.sf-serr') && (await txt('.sf-serr')).includes('different') && (await ans()) === '', 'section solve: external m = n message');
    await page.fill(K('m'), '-1'); check((await txt('.sf-serr')).includes('above 0'), 'section solve: negative m message');
    await page.selectOption(K('preset'), '1'); check((await ans()).includes('M = (1, 3)') && (await page.inputValue(K('mode'))) === 'mid', `section solve: midpoint preset (${await ans()})`);
    await page.selectOption(K('preset'), '2'); check((await ans()).includes('is 10') && (await work()).includes('√100 = 10'), `section solve: distance preset (${await ans()})`);
    await page.selectOption(K('unit'), 'cm'); check((await ans()).includes('10 cm'), 'section solve: unit shown');
    await page.selectOption(K('preset'), '3'); check((await ans()).includes('internally in the ratio 2 : 7'), `section solve: ratio preset (${await ans()})`);
    await page.fill(K('py'), '5'); check((await txt('.sf-serr')).includes('not on the line'), 'section solve: P off the line');
    await page.fill(K('py'), '22'); await page.fill(K('px'), '-9'); check((await ans()).includes('externally in the ratio 2 : 5'), `section solve: outside point is external (${await ans()})`);
    await page.selectOption(K('preset'), '4'); check((await ans()).includes('ratio 1 : 2 at (3, 0)'), `section solve: x axis cut (${await ans()})`);
    await page.selectOption(K('axis'), 'y'); check((await ans()).includes('externally') && (await ans()).includes('2 : 5'), `section solve: y axis cut externally 2 : 5 (${await ans()})`);
    await page.selectOption(K('preset'), '5'); check((await ans()).includes('G = (4, 4)') && (await ans()).includes('area = 18'), `section solve: triangle preset (${await ans()})`);
    check((await work()).includes('6.7082'), 'section solve: side lengths');
    await page.fill(K('ax'), ''); check((await txt('.sf-serr')).includes('x of A') && (await ans()) === '', 'section solve: blank gives a message');
    await page.fill(K('ax'), '1/2'); await page.fill(K('ay'), '0.5'); await page.selectOption(K('mode'), 'mid'); await page.fill(K('bx'), '3/2'); await page.fill(K('by'), '1.5');
    check((await ans()).includes('M = (1, 1)'), `section solve: fractions and decimals (${await ans()})`);
  }
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'section: four questions');
  for (const [i, re] of [[1, /= (\d+)\.$/], [2, /= \((\S+), (\S+)\)\.$/], [3, /= \((\S+), (\S+)\)\.$/], [4, /= \((\S+), (\S+)\)\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m.slice(1).join(', ').replace(/−/g, '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `section: quiz ${i} (${w})`);
  }
};
