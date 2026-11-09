// #203 Mendelian chi-square test
export const path = '/science/mendelian-chi-square/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.mcs ';
  await page.goto(`${BASE}/science/mendelian-chi-square/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.mc-big'), facts = () => page.textContent(R + '.mc-facts'), err = () => page.textContent(R + '.mc-err');
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(500); };
  check((await big()) === 'χ² = 0.301, df = 3, p = 0.960: consistent with 9:3:3:1', `mendel: example (${await big()})`);
  { const f = await facts(); check(f.includes('p = 0.955') && f.includes('multinomial') && f.includes('7.81') && f.includes('A_bb') && f.includes('69 %'), 'mendel: example facts and exact test'); }
  { const t = await page.textContent(R + '.mc-tab'); check(t.includes('292.5') && t.includes('97.5') && t.includes('Total'), 'mendel: class table'); }
  check(await page.isVisible(R + '.mc-fig'), 'mendel: bar chart');
  await page.selectOption(R + '.mc-preset', '15:1'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.mc-ratio')) === '15:1' && (await page.inputValue(R + '.mc-names')) === 'any dominant, aabb', 'mendel: preset fills ratio and names');
  check((await err()).includes('has 2 classes but you typed 4'), 'mendel: count mismatch message');
  await set('.mc-obs', '70 10');
  check((await big()) === 'χ² = 5.33, df = 1, p = 0.0209: does not fit 15:1' && (await facts()).includes('p = 0.0330') && (await facts()).includes('binomial'), `mendel: 15:1 with binomial exact test (${await big()})`);
  await page.selectOption(R + '.mc-alpha', '0.01'); await page.waitForTimeout(400);
  check((await big()).endsWith('consistent with 15:1') && (await facts()).includes('6.63'), 'mendel: significance level 0.01');
  await page.selectOption(R + '.mc-alpha', '0.05');
  await set('.mc-ratio', '2:1');
  check((await page.inputValue(R + '.mc-preset')) === 'custom' && (await big()).includes('2:1'), 'mendel: custom ratio');
  for (const [id, n] of [['3:1', 2], ['1:2:1', 3], ['1:1', 2], ['1:1:1:1', 4], ['9:3:4', 3], ['12:3:1', 3], ['9:7', 2]]) {
    await page.selectOption(R + '.mc-preset', id); await page.waitForTimeout(150);
    await set('.mc-obs', Array.from({ length: n }, (_, i) => 10 + 3 * i).join(', '));
    check((await big()).includes(`df = ${n - 1}`), `mendel: preset ${id}`);
  }
  await page.selectOption(R + '.mc-preset', '9:3:3:1'); await page.waitForTimeout(150);
  await set('.mc-obs', '5, 1, 2, 0');
  check((await page.textContent(R + '.mc-note')).includes('4 classes have an expected count below 5') && (await facts()).includes('p = 1.00'), 'mendel: small expected count warning');
  await page.locator(R + '.mc-exact').scrollIntoViewIfNeeded(); await page.click(R + '.mc-exact'); await page.waitForTimeout(400);
  check((await facts()).includes('Exact testnot run'), 'mendel: exact test off');
  await page.click(R + '.mc-exact'); await set('.mc-obs', '400, 300, 200, 100');
  check((await facts()).includes('too many outcomes'), 'mendel: exact test skipped for huge samples');
  await set('.mc-obs', '290, 102, 95, 33');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mc-csv')]); const f = OUT + 'mendel.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 6 && rows[0].startsWith('Class,Ratio,Observed,Expected') && rows[2].startsWith('A_bb,3,102,97.5,4.5,0.208,69 %'), `mendel: CSV (${rows[2]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'mendel.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'mendel: PDF report'); }
  await set('.mc-obs', '290, 102.5, 95, 33');
  check((await err()).includes('whole numbers') && await page.isHidden(R + '.mc-out'), 'mendel: decimal count message');
  await set('.mc-obs', '290, 102, 95, 33'); await set('.mc-ratio', '9:0:3:1');
  check((await err()).includes('positive numbers'), 'mendel: bad ratio message');
  await set('.mc-ratio', '9:3:3:1');
  check(await page.isHidden(R + '.mc-err'), 'mendel: recovers');
};
