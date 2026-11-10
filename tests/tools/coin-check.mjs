// #1603 Coin check
export const path = '/collecting/coin-check/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/coin-check/`); await page.waitForTimeout(300);
  check((await page.textContent('.cc .cc-w')).includes('-1.98%'), `coin-check: Morgan 26.20 g is -1.98% (${await page.textContent('.cc .cc-w')})`);
  check((await page.textContent('.cc .cc-w')).includes('Outside allowance'), 'coin-check: weight outside 1% is flagged');
  check((await page.textContent('.cc .cc-d')).includes('Within allowance'), 'coin-check: 38.10 mm is within allowance');
  await page.fill('.cc .cc-tw', '3'); await page.waitForTimeout(100);
  check((await page.textContent('.cc .cc-w')).includes('Within allowance'), 'coin-check: widening the weight allowance clears the flag');
  await page.fill('.cc .cc-md', '39'); await page.waitForTimeout(100);
  check((await page.textContent('.cc .cc-d')).includes('+2.36%'), `coin-check: 39 mm is +2.36% (${await page.textContent('.cc .cc-d')})`);
  await page.selectOption('.cc .cc-preset', '5'); await page.waitForTimeout(100);
  check((await page.textContent('.cc .cc-w')).includes('7.988'), 'coin-check: choosing the sovereign loads its weight');
};
