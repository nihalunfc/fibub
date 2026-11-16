// #T895 Car affordability
export const path = '/vehicles/car-affordability/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/car-affordability/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.ca .ca-big'), rows = () => page.textContent('.ca .ca-rows');
  const set = async (k, v) => { await page.fill(`.ca [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // 6,000 x 10% = 600, minus 150 running = 450 payment; 7% over 48 months -> loan 18,792.09; with 20% down price 23,490.11
  check((await rows()).includes('450.00'), 'car-affordability: payment 450.00');
  check((await rows()).includes('18,792.09'), `car-affordability: loan 18,792.09`);
  check((await big()).includes('23,490.11'), `car-affordability: max price about 23,490 (${await big()})`);
  await page.selectOption('.ca [data-k="per"]', '1'); await set('inc', '72000');
  check((await big()).includes('23,490.11'), 'car-affordability: yearly income of 72,000 gives the same answer');
  await set('down', '0');
  check((await big()).includes('18,792.09'), 'car-affordability: no down payment, price = loan');
  await set('run', '700');
  check((await big()).includes('No room'), 'car-affordability: running costs over budget shows no room');
  await set('run', '150'); await set('rate', '0'); await set('months', '48');
  check((await rows()).includes('21,600.00'), 'car-affordability: 0% rate, 450 x 48 = 21,600');
  // more options: loan-length table, sales tax, a car you are looking at
  await set('down', '20'); await set('rate', '7');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const tab = () => page.textContent('.ca .ca-tab tbody');
  check((await page.locator('.ca .ca-tab tbody tr').count()) === 5, 'car-affordability: table lists 36 to 84 months');
  check((await tab()).includes('18,217.39') && (await tab()).includes('37,269.72'), `car-affordability: 36 months 18,217.39 and 84 months 37,269.72 (${await tab()})`);
  await set('months', '60');
  check((await page.locator('.ca .ca-tab tbody tr.cur').textContent()).includes('28,407.37'), 'car-affordability: current term row highlighted (60 months 28,407.37)');
  await set('months', '48');
  await set('tax', '10');
  check((await big()).includes('21,354.65 before 10% tax'), `car-affordability: sales tax 10% shows the price before tax (${await big()})`);
  await set('tax', '0');
  await set('cprice', '30000');
  // 30,000 with 20% down: loan 24,000 at 7% over 48 months -> 574.71 a month, 724.71 with 150 running = 12.1% of 6,000
  const look = () => page.textContent('.ca .ca-look');
  check((await look()).includes('574.71') && (await look()).includes('12.1%') && (await look()).includes('over your budget'), `car-affordability: a 30,000 car is over budget (${await look()})`);
  await set('cprice', '20000');
  check((await look()).includes('fits your budget'), 'car-affordability: a 20,000 car fits');
  await set('cprice', '');
  check((await look()) === '', 'car-affordability: blank car price shows nothing');
};

