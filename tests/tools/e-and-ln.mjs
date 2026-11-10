// #1468 eˣ and ln x (maths checked against mpmath in tests/sci-tools/e-and-ln.mjs)
export const path = '/learn/e-and-ln/';
export default async ({ page, check, BASE }) => {
  const R = '.eln ';
  const t = (s) => page.textContent(R + s);
  const set = (sel, v) => page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/e-and-ln/`); await page.waitForTimeout(500);
  check((await t('.el-formula')).endsWith('At x = 1: 2 × 0.6931 = 1.3863'), `e: 2ˣ at 1 (${await t('.el-formula')})`);
  check((await t('.el-facts')).includes('Slope ÷ height0.6931= ln 2'), `e: ratio ln 2 (${await t('.el-facts')})`);
  await set('.el-x', -1);
  { const f = await t('.el-facts'); check(f.includes('Height aˣ at P0.5') && f.includes('Slope at P0.3466') && f.includes('0.6931'), `e: ratio same at x = −1 (${f})`); }
  check(await page.isHidden(R + '.el-flag'), 'e: no flag for base 2');
  await page.waitForTimeout(200);
  const px = await page.evaluate(() => { const c = document.querySelector('.el-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i] < 100 && g[i + 1] < 140 && g[i + 2] > 140) n++; return n; });
  check(px > 30, `e: rise drawn in blue (${px} px)`);
  await page.click(R + '.el-find'); await page.waitForTimeout(2000);
  check(Math.abs(+(await page.inputValue(R + '.el-a')) - Math.E) < 0.002 && await page.isVisible(R + '.el-flag') && (await t('.el-flag')).includes('e = 2.71828'), `e: Find e lands on e (${await page.inputValue(R + '.el-a')})`);
  check(/Slope ÷ height(1|0\.9999)=/.test(await t('.el-facts')), `e: ratio 1 at e (${await t('.el-facts')})`);
  // Drag P.
  await page.$eval(R + '.el-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const b = await (await page.$(R + '.el-fig')).boundingBox();
  await page.mouse.move(b.x + b.width * 0.8, b.y + b.height * 0.5); await page.mouse.down(); await page.mouse.move(b.x + b.width * 0.82, b.y + b.height * 0.5); await page.mouse.up();
  check(+(await page.inputValue(R + '.el-x')) > 1, `e: drag moves P (${await page.inputValue(R + '.el-x')})`);
  // Class 11 level.
  await page.click(R + '.el-lv button[data-lv="11"]');
  check(await page.isHidden(R + '.el-c12') && (await t('.el-formula')).includes('With h = 0.001'), 'e: Class 11 view');
  await page.click(R + '.el-lv button[data-lv="12"]');
  check(await page.isVisible(R + '.el-c12'), 'e: Class 12 mirror card');
  // Interest.
  await set('.el-n', 0);
  check((await t('.el-big')) === '(1 + 1/1)^1 = 2.000000', `e: n = 1 (${await t('.el-big')})`);
  await set('.el-n', 600);
  check((await t('.el-big')).endsWith('= 2.718280'), `e: n = a million (${await t('.el-big')})`);
  { const tb = await t('.el-tab tbody'); check(tb.includes('2.613035') && tb.includes('2.714567'), `e: interest table (${tb})`); }
  check((await t('.el-series')).includes('2.7182818'), 'e: series line');
  // Mirror.
  await set('.el-t', 2);
  { const f = await t('.el-mfacts'); check(f.includes('Slope of ln x there0.5') && f.includes('Slope of eˣ there2'), `e: mirror slopes (${f})`); }
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'e: five quiz questions');
  const ans = await page.$eval(R + '.smq-q:nth-child(1) .smq-work p', (e) => e.textContent.match(/slope is (\d+)\./)[1]);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', ans); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', `e: quiz answer accepted (${ans})`);
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(1)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')).startsWith('Not quite'), 'e: wrong choice caught');
};
