// #1289 Solutions on a line
export const path = '/learn/two-variable-line/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/two-variable-line/`); await page.waitForSelector('.tv .tv-fig .tv-line');
  const R = '.tv ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.tv-eq')) === '2x + 3y = 12' && (await page.$$(R + '.tv-sol')).length === 7, 'line: example equation with 7 whole solutions');
  check((await txt('.tv-int')).includes('(6, 0)') && (await txt('.tv-int')).includes('(0, 4)') && (await txt('.tv-form')).includes('y = −2/3x + 4'), 'line: crossings and rearranged form');
  check((await txt('.tv-table')).includes('16/3') && (await txt('.tv-table')).includes('8/3'), 'line: table of fractions');
  await page.click(R + '.tv-test'); await page.waitForTimeout(100);
  check((await txt('.tv-last')).includes('= 12 = 12, so it is a solution') && (await page.$$(R + '.tv-ok')).length === 1, 'line: (1.5, 3) is a solution');
  // Tap grid point (2, 3): not a solution.
  const vp = page.viewportSize(); await page.setViewportSize({ width: 1280, height: 1600 });
  await page.locator(R + '.tv-fig').scrollIntoViewIfNeeded();
  const b = await page.locator(R + '.tv-fig').boundingBox(), k = b.width / 340;
  await page.mouse.click(b.x + (170 + 2 * 16) * k, b.y + (170 - 3 * 16) * k); await page.waitForTimeout(100);
  check((await txt('.tv-last')).includes('(2, 3)') && (await txt('.tv-last')).includes('13 ≠ 12') && (await page.$$(R + '.tv-no')).length === 1, 'line: tap (2, 3) is not a solution');
  await page.mouse.click(b.x + (170 + 3 * 16) * k, b.y + (170 - 2 * 16) * k); await page.waitForTimeout(100);
  check((await page.$$(R + '.tv-ok')).length === 2, 'line: tap (3, 2) is a solution');
  await page.setViewportSize(vp);
  await page.click(R + '.tv-clear'); await page.waitForTimeout(100);
  check((await page.$$(R + '.tv-ok, ' + R + '.tv-no')).length === 0, 'line: clear dots');
  await page.click(R + '.tv-pre[data-p="1,0,4"]'); await page.waitForTimeout(100);
  check((await txt('.tv-eq')) === 'x = 4' && (await txt('.tv-int')).includes('parallel to the y-axis') && (await page.$$(R + '.tv-sol')).length === 21, 'line: x = 4 vertical');
  await page.click(R + '.tv-pre[data-p="0,1,-3"]'); await page.waitForTimeout(100);
  check((await txt('.tv-eq')) === 'y = −3' && (await txt('.tv-int')).includes('parallel to the x-axis'), 'line: y = −3 horizontal');
  await page.click(R + '.tv-pre[data-p="2,-1,0"]'); await page.waitForTimeout(100);
  check((await txt('.tv-eq')) === '2x − y = 0' && (await txt('.tv-whole')).includes('(0, 0)'), 'line: y = 2x through the origin');
  await page.click(R + '.tv-pre[data-p="1,1,10"]'); await page.waitForTimeout(100);
  check((await txt('.tv-eq')) === 'x + y = 10' && (await page.$$(R + '.tv-sol')).length === 11, 'line: x + y = 10');
  await page.fill(R + '.tv-a', '0'); await page.fill(R + '.tv-b', '0'); await page.fill(R + '.tv-c', '5'); await page.waitForTimeout(100);
  check((await txt('.tv-int')).includes('no point is a solution'), 'line: 0 = 5 has no solutions');
  await page.fill(R + '.tv-c', '0'); await page.waitForTimeout(100);
  check((await txt('.tv-int')).includes('every point is a solution'), 'line: 0 = 0');
  await page.fill(R + '.tv-a', '2.5'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.tv-err'), 'line: decimal a message');
  await page.fill(R + '.tv-a', '4'); await page.fill(R + '.tv-b', '6'); await page.fill(R + '.tv-c', '24'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.tv-err') && (await txt('.tv-int')).includes('(6, 0)'), 'line: 4x + 6y = 24 is the same line');
  await page.fill(R + '.tv-px', '30'); await page.click(R + '.tv-test'); await page.waitForTimeout(100);
  check((await txt('.tv-last')).includes('between −10 and 10'), 'line: point off the grid message');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = /(?:y|x|k) = (−?-?\d+)\.$/.exec(w.trim());
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace('−', '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `line: quiz ${i} (${w})`);
  }
};
