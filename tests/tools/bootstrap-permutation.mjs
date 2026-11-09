// #562 bootstrap and permutation test tool
export const path = '/science/bootstrap-permutation/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const P = '.bp ';
  const txt = (c) => page.textContent(P + c);
  const wait = () => page.waitForTimeout(900);
  await page.goto(`${BASE}/science/bootstrap-permutation/`); await page.waitForTimeout(1200);
  check((await txt('.bp-big')) === '3.178, 95 % BCa CI 1.935 to 4.681', `boot: example difference in means (${await txt('.bp-big')})`);
  { const f = await txt('.bp-facts'); check(f.includes('1.867 to 4.58') && f.includes('0.6986') && f.includes('9,999, 12345'), 'boot: percentile interval, SE and seed'); }
  check((await txt('.bp-pfacts')).includes('0.0006') && (await txt('.bp-pfacts')).includes('random (Monte Carlo)') && await page.isVisible(P + '.bp-pfig') && await page.isVisible(P + '.bp-fig'), 'boot: permutation test and both histograms');
  check((await txt('.bp-say')).includes('give evidence that the groups differ'), 'boot: plain-English reading');
  // Same seed repeats; a new seed changes the interval slightly.
  await page.fill(P + '.bp-seed', '777'); await wait();
  const other = await txt('.bp-big');
  await page.fill(P + '.bp-seed', '12345'); await wait();
  check(other !== (await txt('.bp-big')) && (await txt('.bp-big')) === '3.178, 95 % BCa CI 1.935 to 4.681', 'boot: seed changes and restores the result');
  await page.click(P + '.bp-new'); await wait();
  check((await page.inputValue(P + '.bp-seed')) !== '12345', 'boot: new random seed button');
  await page.fill(P + '.bp-seed', '12345');
  await page.selectOption(P + '.bp-conf', '0.9'); await wait();
  check((await txt('.bp-big')).includes('90 % BCa CI'), 'boot: confidence level');
  await page.selectOption(P + '.bp-conf', '0.95');
  await page.selectOption(P + '.bp-alt', 'greater'); await wait();
  check((await txt('.bp-pfacts')).includes('greater'), 'boot: one-sided permutation test');
  await page.selectOption(P + '.bp-alt', 'off'); await wait();
  check(await page.isHidden(P + '.bp-perm'), 'boot: permutation test can be turned off');
  await page.selectOption(P + '.bp-alt', 'two-sided');
  await page.selectOption(P + '.bp-stat', 'diff-median'); await wait();
  check((await txt('.bp-h')).startsWith('Difference in medians'), 'boot: difference in medians');
  // CSV downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.bp-csv')]); const f = OUT + 'bp.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('quantity,value') && t.includes('BCa interval') && t.includes('permutation p-value'), 'boot: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.bp-dcsv')]); const f = OUT + 'bpd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'bootstrap,permutation_null' && rows.length === 10000, 'boot: resampled values CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl button[data-f=docx]')]); check(d.suggestedFilename() === 'bootstrap.docx', 'boot: Word report'); }
  // One sample: median of the commute example.
  await page.selectOption(P + '.bp-stat', 'median'); await wait();
  check((await txt('.bp-big')) === '18.5, 95 % BCa CI 15 to 25' && await page.isHidden(P + '.bp-altl') && await page.isHidden(P + '.bp-perm'), `boot: one-sample median (${await txt('.bp-big')})`);
  await page.selectOption(P + '.bp-stat', 'sd'); await wait();
  check((await txt('.bp-h')).startsWith('Standard deviation'), 'boot: standard deviation');
  await page.selectOption(P + '.bp-stat', 'mean'); await wait();
  check((await txt('.bp-h')).startsWith('Mean of Commute'), 'boot: mean');
  // Pairs.
  await page.selectOption(P + '.bp-stat', 'pearson'); await wait();
  check((await txt('.bp-big')) === '0.9629, 95 % BCa CI 0.8734 to 0.9905' && (await txt('.bp-pfacts')).includes('0.0002'), `boot: Pearson correlation (${await txt('.bp-big')})`);
  await page.selectOption(P + '.bp-stat', 'spearman'); await wait();
  check((await txt('.bp-h')).startsWith('Spearman'), 'boot: Spearman correlation');
  await page.selectOption(P + '.bp-stat', 'paired-mean'); await wait();
  check((await txt('.bp-pfacts')).includes('signs of the differences flipped'), 'boot: paired mean difference with sign flips');
  // Exact permutation test with small groups.
  await page.selectOption(P + '.bp-stat', 'diff-mean'); await page.fill(P + '.bp-data', 'A\tB\n3.1\t5.2\n4.5\t6.1\n2.8\t4.9\n5.0\t5.8\n4.1\t6.4\n3.7\t'); await wait();
  check((await txt('.bp-pfacts')).includes('462 (all of them: exact)') && (await txt('.bp-pfacts')).includes('0.008658'), 'boot: exact permutation test, as scipy');
  check((await txt('.bp-say')).includes('fewer than 10 values'), 'boot: small-sample warning');
  // Bad input.
  await page.fill(P + '.bp-b', '50'); await wait();
  check((await txt('.bp-err')).includes('from 100 to 200,000'), 'boot: resamples out of range');
  await page.fill(P + '.bp-b', '9999'); await page.fill(P + '.bp-data', 'A\tB\n1\tx'); await wait();
  check((await txt('.bp-err')).includes('"x" in row 1 of B is not a number') && await page.isHidden(P + '.bp-out'), 'boot: bad number message');
  await page.fill(P + '.bp-data', 'A\n1\n2\n3'); await wait();
  check((await txt('.bp-err')).includes('Paste two groups'), 'boot: one column for two groups');
  writeFileSync(OUT + 'bp-in.csv', 'x,y\n1,2\n2,4.1\n3,5.9\n4,8.2\n5,9.9\n6,12.1\n7,13.8\n8,16.3\n');
  await page.selectOption(P + '.bp-stat', 'pearson');
  await page.setInputFiles(P + '.dfb-in', OUT + 'bp-in.csv'); await wait();
  check((await txt('.dfb-note')).includes('Opened bp-in.csv') && (await txt('.bp-big')).startsWith('0.99'), 'boot: opens a CSV file');
};
