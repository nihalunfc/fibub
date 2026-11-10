// #1610 Coin counter
export const path = '/collecting/coin-counter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/coin-counter/`); await page.waitForTimeout(300);
  const n = async () => await page.textContent('.cc .cc-weigh tr[data-i="0"] .cc-n');
  check((await n()).startsWith('240'), `coin-counter: 1250 g of 5 g coins in a 50 g jar = 240 (${await n()})`);
  check((await page.textContent('.cc .cc-out')).includes('60.00'), `coin-counter: 240 x 0.25 = 60.00 (${await page.textContent('.cc .cc-out')})`);
  await page.fill('.cc .cc-weigh tr[data-i="0"] input[data-k=tare]', '0'); await page.waitForTimeout(50);
  check((await n()).startsWith('250'), 'coin-counter: container weight changes the count');
  await page.fill('.cc .cc-weigh tr[data-i="0"] input[data-k=total]', '1204'); await page.waitForTimeout(50);
  check((await n()).startsWith('241'), `coin-counter: 1204 / 5 = 240.8 rounds to 241 (${await n()})`);
  check(await page.isVisible('.cc .cc-warn') === false, 'coin-counter: no warning when close to a whole number');
  await page.fill('.cc .cc-weigh tr[data-i="0"] input[data-k=total]', '1202.5'); await page.waitForTimeout(50);
  check(await page.isVisible('.cc .cc-warn'), 'coin-counter: warns when far from a whole number (240.5)');
  await page.selectOption('.cc .cc-preset', 'uk'); await page.waitForTimeout(50);
  check((await page.inputValue('.cc .cc-sym')) === '£' && (await page.locator('.cc .cc-weigh tbody tr').count()) === 8, 'coin-counter: UK preset sets the symbol and eight coins');
  await page.click('.cc .cc-m[data-mode=hand]'); await page.waitForTimeout(50);
  await page.fill('.cc .cc-hand tr[data-i="6"] input[data-k=qty]', '3'); await page.waitForTimeout(50);
  check((await page.textContent('.cc .cc-out')).includes('£3.00'), `coin-counter: 3 x £1 by hand = £3.00 (${await page.textContent('.cc .cc-out')})`);
};
