// #1379 3D point plotter
export const path = '/learn/points-3d/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/points-3d/`); await page.waitForSelector('.p3 .p3-dotP');
  const R = '.p3 ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.p3-oct')).includes('octant IV') && (await txt('.p3-oct')).includes('octant II.'), 'points: P in IV, Q in II');
  check((await txt('.p3-d')).endsWith('= √36 = 6') && (await txt('.p3-o')).includes('√29 = 5.3852'), 'points: PQ = 6, OP = √29');
  check((await page.$$(R + '.p3-boxl')).length === 18, 'points: coordinate boxes drawn');
  await page.uncheck(R + '.p3-box'); await page.waitForTimeout(100);
  check((await page.$$(R + '.p3-boxl')).length === 0, 'points: boxes off');
  await page.fill(R + '.p3-z', '-4'); await page.waitForTimeout(100);
  check((await txt('.p3-oct')).includes('octant VIII'), 'points: flipping z sends IV to VIII');
  await page.fill(R + '.p3-z', '0'); await page.waitForTimeout(100);
  check((await txt('.p3-oct')).includes('lies on the xy plane'), 'points: on the xy plane');
  await page.fill(R + '.p3-y', '0'); await page.waitForTimeout(100);
  check((await txt('.p3-oct')).includes('lies on the x axis'), 'points: on the x axis');
  await page.fill(R + '.p3-y', '-2'); await page.fill(R + '.p3-z', '4');
  await page.click(R + '.p3-who [data-p=Q]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.p3-x')) === '-1' && (await page.inputValue(R + '.p3-z')) === '2', 'points: switching to Q loads its numbers');
  await page.fill(R + '.p3-x', '-3'); await page.waitForTimeout(100);
  check((await txt('.p3-pts')).includes('Q = (−3, 2, 2)') && (await txt('.p3-d')).includes('√56'), 'points: Q moved, distance √56');
  await page.fill(R + '.p3-x', '-1');
  await page.check(R + '.p3-sec'); await page.waitForTimeout(100);
  check((await txt('.p3-r')).includes('(1, 0, 3), the midpoint') && (await txt('.p3-r')).includes('PR = 3, RQ = 3'), 'section: midpoint (1, 0, 3)');
  await page.fill(R + '.p3-m', '3'); await page.waitForTimeout(100);
  check((await txt('.p3-r')).includes('(0, 1, 2.5)') && (await txt('.p3-r')).includes('ratio 3.'), `section: 3 : 1 (${await txt('.p3-r')})`);
  // Views and turning.
  const pos = async () => page.$eval(R + '.p3-dotP', (e) => [e.getAttribute('cx'), e.getAttribute('cy')].map((v) => Math.round(Number(v))).join());
  const before = await pos();
  await page.click(R + '.p3-view [data-v=top]'); await page.waitForTimeout(100);
  const top = await pos();
  check(top !== before && top === `${170 - 2 * 20},${165 + 3 * 20}`, `points: top view puts P at y right, x down (${top})`);
  const fig = page.locator(R + '.p3-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded(); const b = await fig.boundingBox();
  await page.mouse.move(b.x + b.width * 0.3, b.y + b.height * 0.6); await page.mouse.down(); await page.mouse.move(b.x + b.width * 0.7, b.y + b.height * 0.6, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
  await page.setViewportSize({ width: 1280, height: 720 });
  check((await pos()) !== top, 'points: dragging turns the view');
  check((await page.$$(R + '.sm-q')).length === 4, 'points: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /that is (\d)\.$/.exec(w) || /.*= \(?([^()]*?)\)?\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/−/g, '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `points: quiz ${i} (${w})`);
  }
};
