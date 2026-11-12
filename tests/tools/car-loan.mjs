// #1745 Car loan
export const path = '/vehicles/car-loan/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/car-loan/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.cr .cr-big'), rows = () => page.textContent('.cr .cr-rows');
  const set = async (k, v) => { await page.fill(`.cr [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // 30,000 + tax 8% of 25,000 (2,000) + 500 fees - 5,000 trade - 2,000 down = 25,500 at 6% for 60 months
  check((await big()).startsWith('492.99 a month'), `car-loan: 25,500 at 6% 60 months = 492.99 (${await big()})`);
  check((await rows()).includes('25,500.00') && (await rows()).includes('2,000.00'), 'car-loan: tax on price minus trade-in, loan 25,500');
  await page.uncheck('.cr [data-k="net"]'); await page.waitForTimeout(100);
  check((await rows()).includes('2,400.00'), 'car-loan: tax on full price = 2,400');
  await page.check('.cr [data-k="net"]'); await set('balloon', '30');
  check((await rows()).includes('Balloon due') && parseFloat(await big()) < 492, 'car-loan: a balloon lowers the payment');
  await set('balloon', '0'); await set('rate', '0'); await set('months', '51');
  check((await big()).startsWith('500.00 a month'), `car-loan: 0% rate = loan / months (${await big()})`);
};
