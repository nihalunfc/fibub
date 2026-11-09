// #471 Bland-Altman agreement plot
export const path = '/science/bland-altman/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/bland-altman/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.bla .bla-big'), facts = () => page.textContent('.bla .bla-facts');
  check((await page.textContent('.bla .bla-med')).includes('not medical advice'), 'bland-altman: medical notice near the top');
  check((await big()) === 'Bias 0.4433 mmol/L, limits −0.8129 to 1.700 mmol/L', `bland-altman: example bias and limits (${await big()})`);
  { const f = await facts(); check(f.includes('0.4433 mmol/L95 % CI 0.2040 to 0.6827 mmol/L') && f.includes('−0.8129 mmol/L95 % CI −1.324 to −0.4863 mmol/L') && f.includes('1.700 mmol/L95 % CI 1.373 to 2.210 mmol/L'), 'bland-altman: exact intervals as scipy'); }
  { const f = await facts(); check(f.includes('0.982595 % CI 0.9656 to 0.9911') && f.includes('p = 0.0542') && f.includes('0 of 30'), 'bland-altman: CCC, proportional bias and outside count'); }
  check((await page.textContent('.bla .bla-read')).includes('Meter A reads 0.443 mmol/L higher than Lab analyser B'), 'bland-altman: plain reading uses the method names');
  check(await page.isVisible('.bla .bla-fig'), 'bland-altman: plot drawn');
  await page.selectOption('.bla .bla-ci', 'approx'); await page.waitForTimeout(150);
  check((await facts()).includes('1.286 to 2.113 mmol/L'), 'bland-altman: approximate intervals (Bland-Altman 1999)');
  await page.selectOption('.bla .bla-ci', 'exact');
  await page.selectOption('.bla .bla-scale', 'percent'); await page.waitForTimeout(150);
  check((await big()).startsWith('Bias 3.449 %') && (await facts()).includes('14.73 %95 % CI 11.80 to 19.32 %'), `bland-altman: percentage scale (${await big()})`);
  await page.selectOption('.bla .bla-scale', 'ratio'); await page.waitForTimeout(150);
  check((await big()).startsWith('Mean ratio 1.035, limits 0.9246 to 1.159'), `bland-altman: ratio scale back-transformed (${await big()})`);
  await page.selectOption('.bla .bla-scale', 'diff');
  await page.selectOption('.bla .bla-x', 'b'); await page.selectOption('.bla .bla-conf', '0.9'); await page.waitForTimeout(150);
  check((await facts()).includes('90 % CI'), 'bland-altman: 90 % intervals and plot against B');
  await page.selectOption('.bla .bla-x', 'mean'); await page.selectOption('.bla .bla-conf', '0.95');
  await page.selectOption('.bla .bla-loa', '0.9'); await page.waitForTimeout(150);
  check((await facts()).includes('Upper limit (90 %)'), 'bland-altman: 90 % limits of agreement');
  await page.selectOption('.bla .bla-loa', '0.95');
  await page.locator('.bla .bla-reg').scrollIntoViewIfNeeded(); await page.click('.bla .bla-reg'); await page.waitForTimeout(150);
  check(!(await page.isChecked('.bla .bla-reg')) && await page.isVisible('.bla .bla-fig'), 'bland-altman: regression line can be hidden');
  await page.locator('.bla .bla-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bla .bla-csv')]); const f = OUT + 'ba.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t[0] === 'pair,Meter A,Lab analyser B,mean,A-B,outside limits' && t[1].startsWith('1,9.5,10.3,9.9,-0.8') && t.some((l) => l.startsWith("Lin's CCC,0.98250534")), 'bland-altman: CSV of pairs and statistics'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bla .bla-png')]); const f = OUT + 'ba.png'; await d.saveAs(f); const b = readFileSync(f); check(b.length > 5000 && b[1] === 0x50, 'bland-altman: plot PNG'); }
  await page.locator('.bla .dl button[data-f=pdf]').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bla .dl button[data-f=pdf]')]); const f = OUT + 'ba.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'bland-altman: PDF report'); }
  await page.fill('.bla .bla-data', 'ID\tA\tB\nx1\t5\t5.2\nx2\t6\t6.1\nx3\t7\t6.8\nx4\t8\t\nx5\t9\t9.4'); await page.waitForTimeout(500);
  check((await facts()).includes('41 incomplete line left out'), 'bland-altman: ID column skipped and incomplete line left out');
  await page.fill('.bla .bla-data', '1\n2\n3'); await page.waitForTimeout(500);
  check((await page.textContent('.bla .bla-err')).includes('two columns') && await page.isHidden('.bla .bla-out'), 'bland-altman: one column message');
  await page.fill('.bla .bla-data', '1\t2\n2\t3'); await page.waitForTimeout(500);
  check((await page.textContent('.bla .bla-err')).includes('at least 3'), 'bland-altman: too few pairs message');
  await page.fill('.bla .bla-data', '1\t2\n-2\t3\n4\t5'); await page.selectOption('.bla .bla-scale', 'ratio'); await page.waitForTimeout(300);
  check((await page.textContent('.bla .bla-err')).includes('above zero'), 'bland-altman: ratio scale needs positive results');
};
