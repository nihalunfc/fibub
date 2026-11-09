// #317 allometry calculator
export const path = '/science/allometry-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.alm ';
  const big = () => page.textContent(R + '.alm-big'), facts = () => page.textContent(R + '.alm-facts'), pred = () => page.textContent(R + '.alm-pred');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await big()) === 'Y = 3.532 × M^0.7415', `allometry: example fit (${await big()})`);
  { const f = await facts(); check(f.includes('0.7415 ± 0.017') && f.includes('0.7036 to 0.7794') && f.includes('3.237 to 3.854') && f.includes('0.9935') && f.includes('t = −0.489, p = 0.63') && f.includes('inside the 95 % limits'), `allometry: limits and test (${f})`); }
  check((await pred()).startsWith('At 50 kg: Y = 64.24 (95 % limits for the line 54.40 to 75.85; for one new species 44.57 to 92.58)'), `allometry: prediction (${await pred()})`);
  check(await page.isVisible(R + '.alm-fig'), 'allometry: chart');
  await page.fill(R + '.alm-b0', '0.6667'); await page.waitForTimeout(300);
  check((await facts()).includes('outside the 95 % limits'), 'allometry: 2/3 is outside');
  await page.selectOption(R + '.alm-conf', '0.99'); await page.waitForTimeout(300);
  check((await facts()).includes('99 % limits'), 'allometry: 99 % limits');
  await page.fill(R + '.alm-at', '500'); await page.waitForTimeout(300);
  check((await pred()).includes('extrapolation'), 'allometry: extrapolation warning');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.alm-csv')]); const f = OUT + 'allo.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); const rows = t.trim().split('\n');
    check(rows[0] === 'name,mass,y,fitted_y,log10_residual' && rows[1].startsWith('Species A,0.048,0.314,') && /\nb,0\.741494\d\d/.test(t) && t.includes('confidence,0.99'), 'allometry: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'allometry: Word report'); }
  // Scaling laws panel.
  check((await page.textContent(R + '.alm-lout')) === 'Y = 3.4 × 70^0.75 = 82.28 W', `allometry: Kleiber law (${await page.textContent(R + '.alm-lout')})`);
  await page.selectOption(R + '.alm-law', '240|-0.25|beats/min'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.alm-lout')).endsWith('= 82.97 beats/min') && (await page.textContent(R + '.alm-ltab')).includes('1000'), 'allometry: heart rate law');
  await page.fill(R + '.alm-la', '2'); await page.fill(R + '.alm-lb', '1'); await page.fill(R + '.alm-lm', '3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.alm-lout')) === 'Y = 2 × 3^1 = 6 beats/min', 'allometry: edited coefficient');
  await page.fill(R + '.alm-lm', '-1'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.alm-lerr'), 'allometry: bad mass message');
  // Two columns without names, and bad input.
  await page.fill(R + '.alm-data', '1\t2\n10\t3.556558820077845\n100\t6.324555320336759\n1000\t11.246826503806982'); await page.waitForTimeout(300);
  check((await big()) === 'Y = 2 × M^0.25', `allometry: two plain columns (${await big()})`);
  await page.fill(R + '.alm-data', 'a\t1\t2\nb\t0\t3\nc\t4\t5'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.alm-err')).includes('above zero') && await page.isHidden(R + '.alm-out'), 'allometry: zero mass message');
  await page.fill(R + '.alm-data', '1\t2\n3\t4'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.alm-err')).includes('at least 3'), 'allometry: too few points message');
};
