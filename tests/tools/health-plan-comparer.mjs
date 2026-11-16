// #T827 Health plan cost comparer
export const path = '/money/health-plan-comparer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/health-plan-comparer/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.hp [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.hp ${c}`);
  await set('s1', '10,000'); await page.waitForTimeout(100);
  const rows = await page.$$eval('.hp .hp-body tr', (r) => r.map((x) => x.textContent));
  check(rows[1].includes('6,900') && rows[1].includes('7,800'), 'health-plan-comparer: at 10,000 plan A totals 6,900 and plan B 7,800 (' + rows[1] + ')');
  check(rows[1].includes('(lowest)') && rows[1].indexOf('(lowest)') < rows[1].indexOf('7,800'), 'health-plan-comparer: cheapest plan is marked');
  check((await txt('.hp-be')).includes('5,500'), 'health-plan-comparer: break-even at 5,500 (' + (await txt('.hp-be')) + ')');
  await page.selectOption('.hp [data-k="n"]', '3'); await page.waitForTimeout(100);
  check((await page.$$('.hp .hp-head th')).length === 4, 'health-plan-comparer: a third plan adds a column');
  await page.selectOption('.hp [data-k="region"]', 'IN'); await page.waitForTimeout(100);
  check((await txt('.hp-l-share')).includes('Co-pay'), 'health-plan-comparer: India labels say co-pay');
  await set('max', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.hp .hp-err'), 'health-plan-comparer: a chart limit of 0 shows a message');
  await page.reload(); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await txt('.hp-pick')).includes('costs least'), 'health-plan-comparer: one-line pick shown');
  check((await txt('.hp-body')).includes('Worst possible year'), 'health-plan-comparer: worst-year row shown');
  await set('w0', '50'); await set('w1', '50'); await set('w2', '0'); await page.waitForTimeout(100);
  check((await txt('.hp-body')).includes('Average year'), 'health-plan-comparer: average-year row appears once chances are typed');
};
