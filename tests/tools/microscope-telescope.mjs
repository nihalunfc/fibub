// #1006 Microscope and telescope
export const path = '/learn/microscope-telescope/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.mst ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.mst-big'), facts = () => page.textContent(R + '.mst-facts'), formula = () => page.textContent(R + '.mst-formula');
  const set = (c, v) => page.$eval(R + c, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  const inked = () => page.evaluate(() => { const c = document.querySelector('.mst-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; });
  check((await big()) === 'Total magnification −70×', `scope: microscope example (${await big()})`);
  { const f = await facts(); check(f.includes('1.07 cm') && f.includes('15 cm') && f.includes('−14×') && f.includes('5×'), `scope: microscope steps ${f}`); }
  check((await formula()).includes('M = m_o × m_e = −70') && (await inked()) > 500, 'scope: working and drawing');
  await page.locator(R + '.mst-fig').screenshot({ path: OUT + 'scope-micro.png' });
  await page.click(R + '.mst-mode [data-m=near]'); await page.waitForTimeout(100);
  check((await big()) === 'Total magnification −89×', `scope: microscope near point (${await big()})`);
  await page.locator(R + '.mst-fig').screenshot({ path: OUT + 'scope-micro-near.png' });
  await set('.mst-L', 8); await page.waitForTimeout(100);
  check((await big()) === 'Total magnification −17×', `scope: short tube (${await big()})`);
  await set('.mst-fo', 3); await set('.mst-fe', 10); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.mst-err') && (await page.textContent(R + '.mst-err')).includes('too close') && await page.isHidden(R + '.mst-out'), 'scope: lenses too close message');
  await set('.mst-fo', 1); await set('.mst-fe', 5); await set('.mst-L', 20); await page.click(R + '.mst-mode [data-m=relaxed]'); await page.waitForTimeout(100);
  check((await big()) === 'Total magnification −70×' && await page.isHidden(R + '.mst-err'), 'scope: back to the example');
  await page.click(R + '.mst-inst [data-k=simple]'); await page.waitForTimeout(100);
  check((await big()) === 'Magnification 5×' && await page.isVisible(R + '.mst-f') && await page.isHidden(R + '.mst-fo'), `scope: magnifying glass (${await big()})`);
  await page.click(R + '.mst-mode [data-m=near]'); await page.waitForTimeout(100);
  check((await big()) === 'Magnification 6×' && (await facts()).includes('4.17 cm'), 'scope: magnifier near point');
  await page.locator(R + '.mst-fig').screenshot({ path: OUT + 'scope-simple.png' });
  await set('.mst-f', 10); await page.waitForTimeout(100);
  check((await big()) === 'Magnification 3.5×', 'scope: magnifier f 10 cm');
  await page.click(R + '.mst-inst [data-k=tele]'); await page.click(R + '.mst-mode [data-m=relaxed]'); await page.waitForTimeout(100);
  check((await big()) === 'Magnification −20×, tube 105 cm long' && await page.isHidden(R + '.mst-L') && (await page.inputValue(R + '.mst-fo')) === '100', `scope: telescope (${await big()})`);
  await page.locator(R + '.mst-fig').screenshot({ path: OUT + 'scope-tele.png' });
  await page.click(R + '.mst-mode [data-m=near]'); await page.waitForTimeout(100);
  check((await big()) === 'Magnification −24×, tube 104 cm long', `scope: telescope near point (${await big()})`);
  await set('.mst-fo', 150); await set('.mst-fe', 2.5); await page.click(R + '.mst-mode [data-m=relaxed]'); await page.waitForTimeout(100);
  check((await big()) === 'Magnification −60×, tube 153 cm long', `scope: bigger telescope (${await big()})`);
  await page.click(R + '.mst-inst [data-k=micro]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.mst-fo')) === '1', 'scope: microscope range restored');
  check((await page.$$(R + '.mst-quiz .sq-q')).length === 4, 'scope: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'scope: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `scope: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
