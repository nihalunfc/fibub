// #1272 Coordinate treasure hunt
export const path = '/learn/coordinate-hunt/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/coordinate-hunt/`); await page.waitForSelector('.ch .ch-fig line', { state: 'attached' });
  const R = '.ch ', txt = (s) => page.textContent(R + s);
  await page.setViewportSize({ width: 1280, height: 1600 });
  const tap = async (x, y, N = 6) => {
    const fig = page.locator(R + '.ch-fig'); await fig.scrollIntoViewIfNeeded(); const b = await fig.boundingBox(), k = b.width / 340;
    await page.mouse.click(b.x + (20 + ((x + N) / (2 * N)) * 300) * k, b.y + (320 - ((y + N) / (2 * N)) * 300) * k);
  };
  const pt = (s) => { const m = /\((−?\d+), (−?\d+)\)/.exec(s); return [Number(m[1].replace('−', '-')), Number(m[2].replace('−', '-'))]; };
  // Plot it: tap the asked point.
  let [x, y] = pt(await txt('.ch-ask')); await tap(x, y);
  check((await txt('.ch-out')).startsWith('Right!'), `coord: plot ${x}, ${y} by tapping (${await txt('.ch-out')})`);
  await page.click(R + '.ch-next'); [x, y] = pt(await txt('.ch-ask'));
  await tap(x === 6 ? 5 : x + 1, y);
  check((await txt('.ch-out')).startsWith('Not quite.') && (await txt('.ch-score')) === '1 of 2 right this visit.', 'coord: a wrong tap is explained and scored');
  // Read it: type the point, then a swapped one.
  await page.click(R + '.ch-mode button[data-m="read"]');
  const P = await page.evaluate(() => { const c = document.querySelector('.ch .ch-fig .sm-handle'); return [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))]; });
  const rx = Math.round(((P[0] - 20) / 300) * 12 - 6), ry = Math.round(((320 - P[1]) / 300) * 12 - 6);
  await page.fill(R + '.ch-in', `(${rx}, ${ry})`); await page.click(R + '.ch-go');
  check((await txt('.ch-out')).startsWith('Right!') && (await txt('.ch-out')).includes('signs'), `coord: read (${rx}, ${ry})`);
  // Treasure hunt: guess, read the distance, and find it by checking the circle.
  await page.click(R + '.ch-mode button[data-m="hunt"]');
  await page.fill(R + '.ch-in', '0, 0'); await page.click(R + '.ch-go');
  let o = await txt('.ch-out');
  if (!o.startsWith('Found')) {
    const sq = Number(/√(\d+)/.exec(o)[1]); check(o.includes('units away') && (await page.$$(R + '.ch-ring')).length === 1, `coord: hunt clue (${o})`);
    const cands = []; for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) if (a * a + b * b === sq) cands.push([a, b]);
    for (const [a, b] of cands) { await page.fill(R + '.ch-in', `${a}, ${b}`); await page.click(R + '.ch-go'); o = await txt('.ch-out'); if (o.startsWith('Found')) break; }
  }
  check(o.startsWith('Found it') && (await txt('.ch-fig')).includes('💎'), `coord: treasure found (${o})`);
  // Ships: fire everywhere until all sunk.
  await page.click(R + '.ch-mode button[data-m="ships"]');
  await page.fill(R + '.ch-in', '9, 9'); await page.click(R + '.ch-go'); check((await txt('.ch-out')).startsWith('Off the grid'), 'coord: ships off the grid');
  await tap(0, 0, 5); await tap(0, 0, 5); check((await txt('.ch-out')).startsWith('Already fired'), 'coord: ships same point twice');
  let hits = 0, sunk = 0;
  for (let a = -5; a <= 5 && !(await txt('.ch-out')).startsWith('All ships'); a++) for (let b = -5; b <= 5; b++) {
    if (a === 0 && b === 0) continue;
    await page.fill(R + '.ch-in', `${a}, ${b}`); await page.click(R + '.ch-go');
    const t = await txt('.ch-out'); if (t.startsWith('Hit')) hits++; if (t.includes('sunk!')) sunk++;
    if (t.startsWith('All ships')) break;
  }
  check((await txt('.ch-out')).startsWith('All ships sunk') && (await txt('.ch-score')).includes('Hits: 9 of 9') && (await page.$$(R + '.ch-ship')).length === 3, `coord: all ships sunk (${hits} hits, ${sunk} sunk messages)`);
  await page.click(R + '.ch-next'); await page.click(R + '.ch-give'); check((await page.$$(R + '.ch-ship')).length === 3, 'coord: give up shows the ships');
  await page.setViewportSize({ width: 1280, height: 720 });
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'coord: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const ans = i === 1 ? String({ I: 1, II: 2, III: 3, IV: 4 }[/Quadrant (I+V?|IV)/.exec(wk)[1]]) : i === 2 ? /= (\d+)\.$/.exec(wk)[1] : /\((−?\d+), (−?\d+)\)/.exec(wk).slice(1, 3).join(', ').replaceAll('−', '-');
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, ans); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `coord: quiz ${i} (${wk})`);
  }
};
