// #T907 Load profit
export const path = '/money/load-profit/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/load-profit/`); await page.waitForTimeout(300);
  const out = () => page.textContent('.lp .lp-out'), rows = () => page.textContent('.lp .lp-rows');
  const set = async (k, v) => { await page.fill(`.lp [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // 2,000 - 1,000 mi x 1.50 = 500; 2,000 / 1,000 = 2.00 per total mile; 2 days = 250 a day
  check((await out()).startsWith('Accept: profit 500.00'), `load-profit: profit 500 (${await out()})`);
  check((await rows()).includes('2.00') && (await rows()).includes('250.00'), 'load-profit: 2.00 per total mile, 250 a day');
  await set('minday', '300');
  check((await out()).startsWith('Decline') && (await page.textContent('.lp .lp-warn')).includes('per day'), 'load-profit: minimum profit a day declines');
  await set('minday', '0'); await set('minmile', '2.5');
  check((await out()).startsWith('Decline') && (await page.textContent('.lp .lp-warn')).includes('per total mile'), 'load-profit: minimum rate per total mile declines');
  await set('minmile', '0'); await page.selectOption('.lp [data-k="mode"]', 'mile'); await set('rate', '2.5'); // 2.5 x 800 = 2,000
  check((await out()).startsWith('Accept: profit 500.00'), 'load-profit: per loaded mile rate gives the same money');
  await set('dead', '0'); await set('tolls', '100'); await set('det', '50');
  check((await out()).startsWith('Accept: profit 750.00'), `load-profit: no empty miles, tolls 100, detention 50 (${await out()})`); // 2,050 - 1,200 - 100
  await set('rate', '1'); 
  check((await out()).startsWith('Decline: profit -'), 'load-profit: a losing load is declined');
};
