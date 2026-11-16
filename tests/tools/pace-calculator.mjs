// #T913 Pace calculator
export const path = '/everyday/pace-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/pace-calculator/`); await page.waitForTimeout(300);
  const R = '.pz ';
  const big = () => page.textContent(R + '.pz-big');
  const cell = (race, i) => page.textContent(R + `.pz-pred tr[data-race="${race}"] td:nth-child(${i})`);
  check((await big()).includes('5:00 /km') && (await big()).includes('8:03 /mi'), `pace: 10 km in 50:00 -> 5:00/km, 8:03/mi (${await big()})`);
  check((await cell('Half marathon', 2)) === '1:50:19', `pace: Riegel half marathon from 10 km 50:00 -> 1:50:19 (${await cell('Half marathon', 2)})`);
  check((await page.$$(R + '.pz-splits tbody tr')).length === 10, 'pace: 10 km gives 10 splits');
  await page.click(R + '.pz-quick [data-d="5"]'); await page.waitForTimeout(100);
  const rows = await page.$$eval(R + '.pz-splits tbody tr', (t) => t.map((r) => r.textContent));
  check(rows.length === 5 && rows[4].includes('50:00') && rows[0].includes('10:00'), `pace: 5 km in 50:00 gives 5 splits of 10:00 (${rows.at(-1)})`);
  await page.selectOption(R + '[data-k="find"]', 'time'); await page.fill(R + '[data-k="dist"]', '42.195'); await page.fill(R + '[data-k="pace"]', '6:00'); await page.waitForTimeout(100);
  check((await big()) === '4:13:10', `pace: marathon at 6:00/km -> 4:13:10 (${await big()})`);
  // more options: pace chart, negative split, 1 mile button
  await page.goto(`${BASE}/everyday/pace-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const chartRow = await page.textContent(R + '.pz-chart tr[data-p="5:00"]');
  check(chartRow.includes('1:45:29') && chartRow.includes('3:30:59') && chartRow.includes('50:00'), `pace: chart row 5:00/km -> 10 km 50:00, half 1:45:29, marathon 3:30:59 (${chartRow})`);
  await page.selectOption(R + '[data-k="plan"]', 'neg'); await page.waitForTimeout(100);
  const sp = await page.$$eval(R + '.pz-splits tbody tr', (t) => t.map((r) => r.textContent));
  check(sp[0].includes('5:05') && sp[5].includes('4:55') && sp[9].includes('50:00'), `pace: negative split 5 s/km: km 1 5:05, km 6 4:55, finish 50:00 (${sp[0]} | ${sp[5]} | ${sp[9]})`);
  await page.selectOption(R + '[data-k="plan"]', 'pos'); await page.waitForTimeout(100);
  const sq = await page.$$eval(R + '.pz-splits tbody tr', (t) => t.map((r) => r.textContent));
  check(sq[0].includes('4:55') && sq[9].includes('50:00'), 'pace: positive split starts faster');
  await page.selectOption(R + '[data-k="plan"]', 'even'); await page.click(R + '.pz-quick [data-d="1.609344"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="dist"]')) === '1.6093', 'pace: 1 mile button fills 1.6093 km');
};
