// #1371 inequality shader (maths checked in tests/sci-tools/inequality-shader.mjs)
export const path = '/learn/inequality-shader/';
export default async ({ page, check, BASE }) => {
  const R = '.ins ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/inequality-shader/`); await page.waitForTimeout(400);
  check((await t('.in-title')) === 'Solution: x ≤ 2', `ineq: opening example (${await t('.in-title')})`);
  { const f = await t('.in-facts'); check(f.includes('(−∞, 2]') && f.includes('−10, −9'), `ineq: interval (${f})`); }
  check((await t('.in-steps')).includes('turns round'), 'ineq: sign flip step');
  await page.selectOption(R + '.in-op', '>');
  check((await t('.in-facts')).includes('(−∞, 2)'), 'ineq: strict sign opens the bracket');
  await page.fill(R + '.in-a', '0');
  check((await t('.in-title')).includes('every real x'), `ineq: a = 0 (${await t('.in-title')})`);
  await page.fill(R + '.in-a', 'x');
  check(await page.isVisible(R + '.in-err'), 'ineq: bad number message');
  await page.fill(R + '.in-a', '-2');
  await page.click(R + '.in-mode button[data-m="dbl"]');
  { const f = await t('.in-facts'); check(f.includes('[−2, 3)') && f.includes('−2, −1, 0, 1, 2'), `ineq: double (${f})`); }
  await page.selectOption(R + '.in-op1', '>=');
  check((await t('.in-err')).includes('same way'), 'ineq: mixed signs message');
  await page.selectOption(R + '.in-op1', '<=');
  await page.click(R + '.in-mode button[data-m="two"]');
  check((await t('.in-facts')).includes('(2, 4)'), `ineq: corner of two half-planes (${await t('.in-facts')})`);
  await page.check(R + '.in-row[data-i="2"] .in-on');
  await page.fill(R + '.in-row[data-i="1"] .in-ta', '0'); await page.fill(R + '.in-row[data-i="1"] .in-tb', '1'); await page.selectOption(R + '.in-row[data-i="1"] .in-top', '>=');
  { const f = await t('.in-facts'); check(f.includes('(0, 0)') && f.includes('(0, 6)') && f.includes('(6, 0)'), `ineq: triangle corners (${f})`); }
  const box = await page.locator(R + '.in-fig').boundingBox();
  await page.locator(R + '.in-fig').click({ position: { x: box.width * 0.9, y: box.height * 0.1 } });
  check((await t('.in-facts')).includes('fails row 1'), `ineq: tap test point (${await t('.in-facts')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.in-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 60) n++; return n; });
  check(px > 200, `ineq: graph drawn (${px} px)`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'ineq: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'ineq: quiz answer');
};
