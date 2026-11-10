// #1273 Linear function explorer
export const path = '/learn/linear-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/linear-explorer/`); await page.waitForSelector('.le .le-hc');
  const R = '.le ', txt = (s) => page.textContent(R + s);
  check((await txt('.le-eq')) === 'p(x) = 2x − 3', 'linear: starts with p(x) = 2x − 3');
  const st = await txt('.le-steps');
  check(st.includes('= 4 ÷ 2 = 2') && st.includes('(0, −3)') && st.includes('x = 3 ÷ 2 = 1.5 (3/2)'), `linear: steps for the example (${st})`);
  check((await txt('.le-fig')).includes('zero x = 1.5') && (await txt('.le-fig')).includes('rise 4'), 'linear: zero and slope triangle drawn');
  check((await txt('.le-tab')).replace(/\s/g, '').includes('p(x)−7−5−3−113'), 'linear: table of values');
  await page.click(R + '.le-lvl button[data-l="11"]');
  const s11 = await txt('.le-steps');
  check((await txt('.le-eq')) === 'y = 2x − 3' && s11.includes('63.43°') && s11.includes('x/1.5 + y/−3 = 1') && s11.includes('General form: 2x − y − 3 = 0'), `linear: Class 11 forms (${s11})`);
  await page.fill(R + '.le-m', '0'); await page.waitForTimeout(80);
  check((await txt('.le-steps')).includes('no zero') && (await txt('.le-eq')) === 'y = −3', 'linear: flat line has no zero');
  await page.fill(R + '.le-m', '-1'); await page.fill(R + '.le-c', '4'); await page.waitForTimeout(80);
  check((await txt('.le-eq')) === 'y = −x + 4' && (await txt('.le-steps')).includes('135°') && (await txt('.le-steps')).includes('= 4. The line meets'), 'linear: y = −x + 4');
  // Drag the c handle down by 2 units and the m handle.
  await page.setViewportSize({ width: 1280, height: 1600 });
  const fig = page.locator(R + '.le-fig'); await fig.scrollIntoViewIfNeeded();
  const b = await fig.boundingBox(), k = b.width / 340, unit = (300 / 16) * k;
  { const h = await page.locator(R + '.le-hc').boundingBox(); await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2 + 2 * unit, { steps: 5 }); await page.mouse.up(); }
  check(Number(await page.inputValue(R + '.le-c')) === 2, `linear: drag c handle to 2 (${await page.inputValue(R + '.le-c')})`);
  { const h = await page.locator(R + '.le-hm').boundingBox(); await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2 - 4 * unit, { steps: 5 }); await page.mouse.up(); }
  check(Number(await page.inputValue(R + '.le-m')) === 1, `linear: drag the turning handle up 4 over run 2 makes m = 1 (${await page.inputValue(R + '.le-m')})`);
  await page.setViewportSize({ width: 1280, height: 720 });
  check((await page.$$(R + '.sm-q')).length === 4, 'linear: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= ([−-]?[\d./]+)\.?$/.exec(wk.replace(/\. The.*$/, ''));
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace('−', '-').replace(/\.$/, '') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `linear: quiz ${i} (${wk})`);
  }
};
