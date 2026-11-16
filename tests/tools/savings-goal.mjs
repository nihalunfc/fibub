// #1732 Savings goal
export const path = '/money/savings-goal/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/savings-goal/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.sg [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await page.selectOption('.sg [data-k="cur"]', 'USD');
  await set('target', '12000'); await set('start', '0'); await set('rate', '0'); await set('months', '24');
  check((await page.textContent('.sg .sg-r1')).includes('500.00'), 'savings-goal: 12,000 in 24 months at 0% = 500 a month');
  await set('rate', '4');
  const withInt = parseFloat((await page.textContent('.sg .sg-r1')).replace(/[^\d.]/g, ''));
  check(withInt < 500 && withInt > 470, 'savings-goal: interest lowers the monthly amount');
  await page.selectOption('.sg [data-k="mode"]', 'time'); await set('rate', '0'); await set('monthly', '1000');
  check((await page.textContent('.sg .sg-r1')).trim() === '1 year', 'savings-goal: 1,000 a month takes 1 year');
  await page.selectOption('.sg [data-k="kind"]', 'emergency'); await set('ess', '2000'); await set('mcover', '6');
  check((await page.textContent('.sg .sg-note')).includes('12,000'), 'savings-goal: emergency fund target = 6 x 2,000');
  await set('monthly', '0');
  check(await page.isVisible('.sg .sg-err'), 'savings-goal: no saving and no interest shows a message');

  // new options: sliders, what-if table, year by year, deposit timing, inflation, bad input
  await page.selectOption('.sg [data-k="kind"]', 'amount'); await page.selectOption('.sg [data-k="mode"]', 'monthly');
  await set('target', '12000'); await set('start', '0'); await set('rate', '0'); await set('months', '24');
  check((await page.$$('.sg .sg-iftab tbody tr')).length === 6 && (await page.textContent('.sg .sg-iftab tr.cur')).includes('500.00'), 'savings-goal: what-if table lists six amounts and marks yours');
  const rows = await page.$$eval('.sg .sg-iftab tbody tr', (r) => r.map((x) => x.textContent));
  check(rows[5].includes('1,000.00') && rows[5].includes('1 year'), `savings-goal: saving double takes 1 year (${rows[5]})`);
  check((await page.$$('.sg .sg-ytab tbody tr')).length === 2, 'savings-goal: year-by-year table has one row per year');
  await page.fill('.sg [data-k="monthsr"]', '12'); await page.dispatchEvent('.sg [data-k="monthsr"]', 'input'); await page.waitForTimeout(100);
  check((await page.inputValue('.sg [data-k="months"]')) === '12' && (await page.textContent('.sg .sg-r1')).includes('1,000.00'), 'savings-goal: months slider sets the months and updates the answer');
  await set('months', '24'); await set('rate', '6');
  const endM = parseFloat((await page.textContent('.sg .sg-r1')).replace(/[^\d.]/g, ''));
  await page.selectOption('.sg [data-k="due"]', 'start'); await page.waitForTimeout(100);
  const startM = parseFloat((await page.textContent('.sg .sg-r1')).replace(/[^\d.]/g, ''));
  check(startM < endM && startM > endM * 0.99, `savings-goal: depositing at the start needs a little less (${startM} < ${endM})`);
  await page.selectOption('.sg [data-k="due"]', 'end'); await set('rate', '0');
  await set('infl', '3');
  check(/today's money/.test(await page.textContent('.sg .sg-note')) && parseFloat((await page.textContent('.sg .sg-r1')).replace(/[^\d.]/g, '')) > 500, 'savings-goal: inflation raises the monthly amount');
  await set('infl', '0'); await set('target', '');
  check(!/NaN/.test(await page.textContent('.sg')) && await page.isVisible('.sg .sg-err'), 'savings-goal: blank target shows a friendly message');
  // saving in another currency: 12,000 in 24 months at 0%, 1 unit costs 2 of mine
  await set('target', '12000'); await set('start', '0'); await set('rate', '0'); await set('months', '24');
  await page.selectOption('.sg [data-k="fxcur"]', 'USD'); await set('fxrate', '2'); await set('fxdrift', '0');
  check((await page.textContent('.sg .sg-fxout')).includes('1,000.00'), 'savings-goal: flat rate 2 = 500 x 2 = 1,000 a month in my currency (' + (await page.textContent('.sg .sg-fxout')) + ')');
  await set('fxdrift', '5');
  const fx = await page.textContent('.sg .sg-fxout');
  check(fx.includes('1,051.72') && fx.includes('adds') && fx.includes('1,241.28'), 'savings-goal: rate rising 5% a year needs 1,051.72 a month, adds 1,241.28 over 2 years (' + fx + ')');
};
