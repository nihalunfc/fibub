// #T918 Sleep calculator
export const path = '/everyday/sleep-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/sleep-calculator/`); await page.waitForTimeout(300);
  const R = '.sc ';
  const at = (n) => page.textContent(R + `li[data-c="${n}"] b`);
  check((await at(6)) === '21:45' && (await at(5)) === '23:15' && (await at(4)) === '00:45', `sleep: wake 07:00 -> 21:45, 23:15, 00:45 (${await at(6)}, ${await at(5)}, ${await at(4)})`);
  await page.selectOption(R + '.sc-clock', '12'); await page.waitForTimeout(100);
  check((await at(6)) === '9:45 PM' && (await at(4)) === '12:45 AM', `sleep: 12-hour display (${await at(6)}, ${await at(4)})`);
  await page.click(R + '.sc-tabs [data-m="bed"]'); await page.selectOption(R + '.sc-clock', '24'); await page.waitForTimeout(100);
  check((await at(5)) === '06:45', `sleep: bed 23:00 -> wake 06:45 after 5 cycles (${await at(5)})`);
  await page.click(R + '.sc-tabs [data-m="now"]'); await page.waitForTimeout(100);
  check((await page.locator(R + '.sc-list li').count()) === 3 && await page.isHidden(R + '.sc-time'), 'sleep: now mode shows 3 wake times');
  // more options: age, exact hours
  await page.goto(`${BASE}/everyday/sleep-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption(R + '[data-k="age"]', 'adult'); await page.waitForTimeout(100);
  check((await page.locator(R + '.sc-list li').count()) === 2 && (await at(6)) === '21:45' && (await at(5)) === '23:15', 'sleep: adult age shows the 6 and 5 cycle rows');
  check((await page.textContent(R + '.sc-age-say')).includes('7 to 9') && (await page.locator(R + 'tr[data-a="adult"].me').count()) === 1, 'sleep: age note and table row highlight');
  await page.selectOption(R + '[data-k="age"]', 'inf'); await page.waitForTimeout(100);
  check((await page.locator(R + '.sc-list li').count()) === 3 && (await at(8)) === '18:45', `sleep: infant shows 8, 9, 10 cycles (${await at(8)})`);
  await page.selectOption(R + '[data-k="age"]', ''); await page.fill(R + '[data-k="hours"]', '8'); await page.waitForTimeout(100);
  check((await page.textContent(R + 'li[data-c="exact"] b')) === '22:45', `sleep: exactly 8 hours before 07:00 with 15 min to fall asleep -> 22:45 (${await page.textContent(R + 'li[data-c="exact"] b')})`);
};
