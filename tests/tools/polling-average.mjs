export const path = '/science/polling-average/';
export default async ({ page, check, BASE, readFileSync, writeFileSync, OUT }) => {
  await page.goto(BASE + path);
  const big = () => page.textContent('.pa-big');
  check(/Party B leads Party A by 2\.7 points \(± 2\.0\)/.test(await big()), `polls: example lead (${await big()})`);
  const facts = await page.textContent('.pa-facts');
  check(/34\.0 % ± 1\.1/.test(facts) && /36\.7 % ± 1\.2/.test(facts) && /12 polls/.test(facts) && /5\.4/.test(facts), 'polls: averages and effective polls');
  const rows = await page.$$eval('.pa-polls tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check(rows.length === 12 && rows[11][3] === '± 3.0' && rows[11][8] === '+5.0' && rows[11][9] === '± 5.0', `polls: last poll MoE and lead MoE (${rows[11].join(' ')})`);
  check((await page.locator('.pa-polls td.pa-sig').count()) === 2 && /2 of 12 polls/.test(await page.textContent('.pa-note')), 'polls: leads outside MoE marked');
  check(await page.$eval('.pa-fig', (c) => c.width > 0), 'polls: chart drawn');
  // Options.
  await page.selectOption('.pa-cl', '99'); await page.waitForTimeout(300);
  check(/\(± 2\.7\)/.test(await big()), `polls: 99 % widens the lead margin (${await big()})`);
  await page.selectOption('.pa-cl', '95');
  await page.fill('.pa-deff', '2'); await page.waitForTimeout(400);
  check(/\(± 2\.9\)/.test(await big()), `polls: design effect 2 (${await big()})`);
  await page.fill('.pa-deff', '1');
  await page.selectOption('.pa-w', 'equal'); await page.fill('.pa-hl', '0'); await page.waitForTimeout(400);
  check(/Party A leads Party B by 0\.5 points/.test(await big()), `polls: equal weights, no fading = plain means (${await big()})`);
  await page.selectOption('.pa-w', 'n'); await page.fill('.pa-hl', '14');
  await page.fill('.pa-at', '2026-02-10'); await page.waitForTimeout(400);
  check(/Party A leads Party B/.test(await big()) && /2026-02-10 \(6 polls\)/.test(await page.textContent('.pa-facts')), `polls: average on an earlier date (${await big()})`);
  await page.fill('.pa-at', '2026-03-24');
  await page.selectOption('.pa-tr', 'ewma'); await page.waitForTimeout(300);
  check(/weighted average worked out on each day/.test(await page.textContent('.pa-note')), 'polls: exponential trend');
  await page.selectOption('.pa-tr', 'loess'); await page.fill('.pa-span', '0.9'); await page.waitForTimeout(400);
  check(/nearest 90 %/.test(await page.textContent('.pa-note')), 'polls: LOESS span');
  await page.selectOption('.pa-x', '2'); await page.selectOption('.pa-y', '3'); await page.waitForTimeout(300);
  check(/Party C leads Others/.test(await big()), 'polls: choose the lead parties');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.pa-csv')]);
  const txt = readFileSync(await dl.path(), 'utf8');
  check(dl.suggestedFilename() === 'polling-average.csv' && /^Date,Party A trend %/.test(txt) && /2026-03-24,/.test(txt), 'polls: CSV download');
  const [png] = await Promise.all([page.waitForEvent('download'), page.click('.pa .dl button[data-f="png"]')]);
  check(png.suggestedFilename() === 'polling-average.png', 'polls: image download');
  // File open.
  const f = OUT + 'polls.csv';
  writeFileSync(f, 'Date,n,Yes,No\n2026-05-01,1000,52,48\n2026-05-08,1200,50,50\n2026-05-15,900,49,51\n');
  await page.setInputFiles('.pa .dfb-in', f); await page.waitForTimeout(500);
  check(/Yes|No/.test(await big()), `polls: CSV file opened (${await big()})`);
  // Bad input.
  await page.fill('.pa-in', 'Date,Party A\n2026-01-01,40'); await page.waitForTimeout(400);
  check(/sample size/.test(await page.textContent('.pa-err')), 'polls: missing n column');
  await page.fill('.pa-in', 'Date,n,A\n2026-02-30,500,40'); await page.waitForTimeout(400);
  check(/not a date/.test(await page.textContent('.pa-err')), 'polls: bad date');
};
