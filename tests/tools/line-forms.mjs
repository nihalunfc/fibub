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
  check((await page.$$(R + '.sm-q')).length === 5, 'lines: five questions');
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= (\S+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/−/g, '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `lines: quiz ${i} (${w})`);
  }
};
