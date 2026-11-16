// #1745 Car loan
export const path = '/vehicles/car-loan/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/car-loan/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ await page.waitForTimeout(400);
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
  // length chips, other lengths, working, extra payments, affordability, bad input
  await set('rate', '6'); await set('months', '60');
  await page.click('.cr [data-term="72"]'); await page.waitForTimeout(100);
  check((await page.inputValue('.cr [data-k="months"]')) === '72' && (await big()).startsWith('422.'), `car-loan: 6-year chip sets 72 months (${await big()})`);
  check((await page.$$('.cr .cr-terms tbody tr')).length === 5 && (await page.textContent('.cr .cr-terms tr.cur')).includes('6 years'), 'car-loan: table compares 3 to 7 year loans and marks yours');
  check((await page.textContent('.cr .cr-work')).includes('25,500.00 borrowed'), 'car-loan: shows the working for the loan amount');
  await page.evaluate(() => { document.querySelector('.cr .cr-more').open = true; });
  await set('extra', '100');
  check(/saves [\d,.]+ in interest and clears the loan \d/.test(await page.textContent('.cr .cr-extra')), `car-loan: extra monthly payment shows interest and time saved (${await page.textContent('.cr .cr-extra')})`);
  await set('afford', '400');
  const aff = await page.textContent('.cr .cr-aff');
  const top = parseFloat(aff.match(/up to about ([\d,.]+)/)[1].replace(/,/g, ''));
  check(top > 20000 && top < 30000, `car-loan: 400 a month at 72 months affords a price under 30,000 (${aff})`);
  await set('price', '');
  check(!/NaN/.test(await page.textContent('.cr')) && (await page.textContent('.cr .cr-warn')).includes('price'), 'car-loan: blank price gives a friendly message');
};
