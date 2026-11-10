// #1749 Trip splitter
export const path = '/money/trip-splitter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/trip-splitter/`); await page.waitForTimeout(400);
  const R = '.ts ';
  const bals = () => page.$$eval(R + '.ts-bal td[data-b]', (a) => a.map((x) => x.textContent));
  const pays = () => page.$$eval(R + '.ts-pay li', (a) => a.map((x) => x.textContent));
  let b = await bals();
  check(b.join('|') === '+50.00|-10.00|-40.00', `trip-splitter: balances (${b})`);
  let p = await pays();
  check(p.length === 2 && p[0].includes('Cy pays Ana 40.00') && p[1].includes('Ben pays Ana 10.00'), `trip-splitter: two transfers settle 3 people (${p})`);
  // Cy skips the taxi: taxi for Ana and Ben only
  await page.uncheck(R + '.ts-e:nth-child(2) .ts-for input[data-i="2"]'); await page.waitForTimeout(100);
  b = await bals();
  check(b.join('|') === '+45.00|-15.00|-30.00', `trip-splitter: taxi shared by two (${b})`);
  check((await pays()).length <= 2, 'trip-splitter: at most people-1 transfers');
  // odd cents add up
  await page.fill(R + '.ts-e:nth-child(1) [data-f="amount"]', '100'); await page.waitForTimeout(100);
  b = await bals();
  const sum = b.reduce((a, x) => a + Math.round(parseFloat(x.replace(/,/g, '')) * 100), 0);
  check(sum === 0, `trip-splitter: balances add up to zero (${b})`);
  check(await page.evaluate(() => localStorage.getItem('fibub-trip-splitter-v1')) === null, 'trip-splitter: nothing saved while unticked');
  await page.check(R + '.ts-remember'); await page.waitForTimeout(100);
  check(await page.evaluate(() => !!localStorage.getItem('fibub-trip-splitter-v1')), 'trip-splitter: saved when ticked');
  await page.click(R + '.ts-clear'); await page.waitForTimeout(100);
  check(await page.evaluate(() => localStorage.getItem('fibub-trip-splitter-v1')) === null, 'trip-splitter: Clear removes it');
};
