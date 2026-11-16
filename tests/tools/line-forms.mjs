// #1378 Line forms converter
export const path = '/learn/line-forms/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/line-forms/`); await page.waitForSelector('.lf .lf-hA');
  const R = '.lf ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.lf-m')).includes('= 2/3') && (await txt('.lf-m')).includes('33.69°'), 'lines: slope 2/3, 33.69°');
  check((await txt('.lf-ps')).includes('y + 1 = (2/3)(x + 4)') && (await txt('.lf-si')).includes('y = (2/3)x + 5/3'), `lines: point-slope and slope-intercept (${await txt('.lf-si')})`);
  check((await txt('.lf-ic')).includes('x/(−5/2) + y/(5/3) = 1'), `lines: intercept form (${await txt('.lf-ic')})`);
  check((await txt('.lf-g')).includes('2x − 3y + 5 = 0') && (await txt('.lf-nf')).includes('123.69°') && (await txt('.lf-nf')).includes('= 1.3868'), 'lines: general and normal form');
  check(await page.isHidden(R + '.lf-extra'), 'lines: extra card hidden');
  await page.check(R + '.lf-more'); await page.waitForTimeout(100);
  check((await txt('.lf-l2')).includes('x + 2y − 6 = 0') && (await txt('.lf-ang')).includes('60.26°') && (await txt('.lf-meet')).includes('(1.143, 2.429)'), `angle: 60.26° and meeting point (${await txt('.lf-ang')})`);
  check((await txt('.lf-dist')).includes('= 8.3205') && (await page.$$(R + '.lf-perp')).length === 1, 'distance: 8.3205 with perpendicular drawn');
  const fig = page.locator(R + '.lf-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded();
  const P = async (x, y) => { const b = await fig.boundingBox(); const k = b.width / 340; return [b.x + (10 + ((x + 10) / 20) * 320) * k, b.y + (330 - ((y + 10) / 20) * 320) * k]; };
  const drag = async (a, b) => { const [sx, sy] = await P(...a), [ex, ey] = await P(...b); await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(ex, ey, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150); };
  await drag([6, 0], [0, 10]); // CD: (−6, 6) → (0, 10), slope 2/3: parallel to AB
  check((await txt('.lf-ang')).includes('parallel') && (await txt('.lf-meet')).includes('parallel lines'), `angle: parallel lines (${await txt('.lf-meet')})`);
  await drag([0, 10], [-4, 3]); // CD: (−6, 6) → (−4, 3), slope −3/2: perpendicular
  check((await txt('.lf-ang')).includes('perpendicular'), `angle: perpendicular lines (${await txt('.lf-ang')})`);
  await drag([5, -5], [-1, 1]); // P onto AB? 2(−1) − 3(1) + 5 = 0
  check((await txt('.lf-dist')).includes('P is on the line'), 'distance: P on the line');
  await drag([2, 3], [-4, 5]); // B above A: vertical line x = −4
  check((await txt('.lf-m')).includes('undefined') && (await txt('.lf-eq')).includes('x = −4') && (await txt('.lf-ic')).includes('vertical'), 'lines: vertical line');
  await drag([-4, 5], [2, -1]); // B to (2, −1): horizontal y = −1
  check((await txt('.lf-ic')).includes('horizontal') && (await txt('.lf-g')).includes('y + 1 = 0'), `lines: horizontal line (${await txt('.lf-g')})`);
  await drag([2, -1], [-4, -1]);
  check((await page.$$(R + '.lf-same')).length === 1, 'lines: same point message');
  await page.setViewportSize({ width: 1280, height: 720 });
  // Find the equation of my line (typed numbers).
  { const K = (k) => `${R}[data-k="${k}"]`, ans = () => txt('.lf-ans'), rows = () => txt('.lf-srows'), pre = (i) => page.selectOption(K('preset'), String(i));
    await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => { d.open = true; }));
    check((await ans()) === 'The line is y = 2x − 1, or 2x − y − 1 = 0.' && (await txt('.lf-work')).includes('(11 − 3)/(6 − 2) = 8/4 = 2'), `lines solve: two points (${await ans()})`);
    check((await rows()).includes('x/(1/2) + y/(−1) = 1') && (await rows()).includes('63.43°'), 'lines solve: intercept form and angle');
    await page.fill(K('qx'), '1'); await page.fill(K('qy'), '5');
    check((await txt('.lf-sdist')).includes('= 4/2.2361 = 1.7889'), `lines solve: distance from a point (${await txt('.lf-sdist')})`);
    await page.fill(K('A2'), '1'); await page.fill(K('B2'), '2'); await page.fill(K('C2'), '-3');
    check((await txt('.lf-sang')).includes('perpendicular') && (await txt('.lf-sang')).includes('(1, 1)'), `lines solve: perpendicular lines meet at (1, 1) (${await txt('.lf-sang')})`);
    await page.fill(K('A2'), '4'); await page.fill(K('B2'), '-2'); await page.fill(K('C2'), '-7');
    check((await txt('.lf-sang')).includes('parallel') && (await txt('.lf-sang')).includes('1.118'), `lines solve: parallel lines distance (${await txt('.lf-sang')})`);
    await page.fill(K('A2'), '2'); await page.fill(K('B2'), '-1'); await page.fill(K('C2'), '-1');
    check((await txt('.lf-sang')).includes('same line'), 'lines solve: same line');
    await page.fill(K('A2'), '1'); await page.fill(K('B2'), '1'); await page.fill(K('C2'), '0');
    check((await txt('.lf-sang')).includes('71.57°') && (await txt('.lf-sang')).includes('(1/3, −1/3)'), `lines solve: angle between 2x − y − 1 = 0 and x + y = 0 (${await txt('.lf-sang')})`);
    await pre(1); check((await ans()) === 'The line is y = (3/2)x + 11/2, or 3x − 2y + 11 = 0.' && (await txt('.lf-work')).includes('y − 4 = (3/2)(x + 1)'), `lines solve: point and slope (${await ans()})`);
    await pre(2); check((await ans()) === 'The line is y = −2x + 5, or 2x + y − 5 = 0.', `lines solve: slope and y-intercept (${await ans()})`);
    await pre(3); check((await ans()) === 'The line is y = (4/3)x − 4, or 4x − 3y − 12 = 0.' && (await txt('.lf-work')).includes('a b = −12'), `lines solve: intercepts (${await ans()})`);
    await pre(4); check((await ans()) === 'The line is y = 3x − 5, or 3x − y − 5 = 0.' && (await txt('.lf-work')).includes('k = −(A x₁ + B y₁) = −(3×2 + (−1)×1) = −5'), `lines solve: parallel (${await ans()})`);
    await pre(5); check((await ans()) === 'The line is y = (−1/3)x + 5/3, or x + 3y − 5 = 0.', `lines solve: perpendicular (${await ans()})`);
    await pre(6); check((await ans()).includes('3x − 4y + 12 = 0') && (await rows()).includes('x/(−4) + y/3 = 1') && (await rows()).includes('36.87°'), `lines solve: every form of 3x − 4y + 12 = 0`);
    await pre(0); await page.fill(K('x2'), '2'); await page.fill(K('y2'), '3'); check((await txt('.lf-serr')).includes('same'), 'lines solve: same two points message');
    await page.fill(K('x1'), '2'); await page.fill(K('x2'), '2'); await page.fill(K('y2'), '7'); check((await ans()) === 'The line is x = 2, or x − 2 = 0.' && (await txt('.lf-work')).includes('line is vertical'), `lines solve: vertical (${await ans()})`);
    await page.selectOption(K('mode'), 'ic'); await page.fill(K('ia'), '0'); check((await txt('.lf-serr')).includes('Both intercepts'), 'lines solve: zero intercept message');
    await page.selectOption(K('mode'), 'par'); await page.fill(K('A'), '0'); await page.fill(K('B'), '0'); check((await txt('.lf-serr')).includes('cannot both be 0'), 'lines solve: A = B = 0 message');
    await page.fill(K('A'), ''); check((await txt('.lf-serr')).includes('Type a number for A') && (await ans()) === '', 'lines solve: blank message');
  }
  check((await page.$$(R + '.sm-q')).length === 5, 'lines: five questions');
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= (\S+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/−/g, '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `lines: quiz ${i} (${w})`);
  }
};
