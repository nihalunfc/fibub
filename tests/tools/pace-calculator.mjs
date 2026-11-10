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
};
