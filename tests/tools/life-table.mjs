export const path = '/science/life-table/';
export default async ({ page, check, BASE, readFileSync, writeFileSync, OUT }) => {
  await page.goto(BASE + path);
  const big = () => page.textContent('.lt-big');
  const cells = () => page.$$eval('.lt-tab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check((await big()) === 'Life expectancy at birth: 79.37 years', `lifetable: e0 (${await big()})`);
  const facts = await page.textContent('.lt-facts');
  check(/86\.7 %/.test(facts) && /18\.90 years/.test(facts) && /5\.17 per 1,000/.test(facts) && /0\.068/.test(facts), 'lifetable: e65, survival to 65, 1q0, a0');
  let c = await cells();
  check(c.length === 19 && c[1][3] === '1.514' && c[18][5] === '42193' && c[18][4] === '1.000000' && c[18][9] === '6.39' && c[18][1] === '∞', `lifetable: rows (${c[18].join(' ')})`);
  // nax options.
  await page.selectOption('.lt-ax', 'mid'); await page.waitForTimeout(300);
  check((await big()) === 'Life expectancy at birth: 79.37 years' && (await cells())[0][3] === '0.500', 'lifetable: half-interval nax');
  await page.selectOption('.lt-ax', 'ak'); await page.waitForTimeout(300);
  check((await cells())[0][3] === (0.14903 - 2.05527 * 27 / 5200).toFixed(3), 'lifetable: Andreev-Kingkade a0');
  await page.selectOption('.lt-sex', 'male'); await page.waitForTimeout(300);
  check((await cells())[0][3] === (0.14929 - 1.99545 * 27 / 5200).toFixed(3), 'lifetable: male a0');
  await page.selectOption('.lt-ax', 'given'); await page.waitForTimeout(300);
  check(/ax/.test(await page.textContent('.lt-err')), 'lifetable: asks for an ax column');
  await page.selectOption('.lt-ax', 'cd'); await page.selectOption('.lt-sex', 'female');
  await page.fill('.lt-radix', '1000'); await page.waitForTimeout(400);
  check((await cells())[18][5] === '422', 'lifetable: radix');
  await page.fill('.lt-radix', '100000');
  // Charts.
  for (const b of ['mx', 'ex', 'lx']) { await page.click(`.lt-ch button[data-c="${b}"]`); await page.waitForTimeout(150); }
  check(await page.waitForFunction(() => { const cv = document.querySelector('.lt-fig'); return cv && cv.width > 0 && /Survivors/.test(cv.getAttribute('aria-label') || ''); }, null, { timeout: 10000 }).then(() => true, () => false), 'lifetable: chart switches');
  // Rates per 1,000 in an Mx column, complete table.
  const lines = ['Age\tMx'];
  for (let a = 0; a <= 100; a++) lines.push(`${a === 100 ? '100+' : a}\t${((a === 0 ? 0.004 : 0.0004 + 0.00003 * Math.exp(0.1 * a)) * 1000).toFixed(12)}`);
  await page.fill('.lt-in', lines.join('\n')); await page.selectOption('.lt-per', '1000'); await page.selectOption('.lt-ax', 'ak'); await page.selectOption('.lt-sex', 'male'); await page.waitForTimeout(400);
  check((await big()) === 'Life expectancy at birth: 74.43 years' && /Complete/.test(await page.textContent('.lt-facts')), `lifetable: complete table from Mx per 1,000 (${await big()})`);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.lt-csv')]);
  const txt = readFileSync(await dl.path(), 'utf8');
  check(dl.suggestedFilename() === 'life-table.csv' && txt.trim().split('\n').length === 102 && /^Age,n,nMx/.test(txt), 'lifetable: CSV download');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.lt .dl button[data-f="pdf"]')]);
  check(pdf.suggestedFilename() === 'life-table.pdf', 'lifetable: PDF download');
  // File with an ax column.
  const f = OUT + 'lt.csv';
  writeFileSync(f, 'Age,Deaths,Population,ax\n0,10,1000,0.1\n1,5,4000,2\n5,50,500,0\n');
  await page.selectOption('.lt-per', '1');
  await page.setInputFiles('.lt .dfb-in', f); await page.selectOption('.lt-ax', 'given'); await page.waitForTimeout(500);
  c = await cells();
  check(c.length === 3 && c[0][3] === '0.100' && c[1][3] === '2.000', 'lifetable: file with ax column');
  // Bad input.
  await page.fill('.lt-in', 'Age\tDeaths\tPopulation\n0\t5\t0\n1\t3\t100'); await page.waitForTimeout(400);
  check(/population/.test(await page.textContent('.lt-err')), 'lifetable: zero population refused');
  await page.fill('.lt-in', 'Age\tFoo\n0\t1\n5\t2'); await page.waitForTimeout(400);
  check(/Deaths and Population/.test(await page.textContent('.lt-err')), 'lifetable: unknown columns explained');
};
