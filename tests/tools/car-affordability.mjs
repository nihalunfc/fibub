// #T896 Car affordability
export const path = '/money/car-affordability/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/car-affordability/`); await page.waitForTimeout(400);
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
};
