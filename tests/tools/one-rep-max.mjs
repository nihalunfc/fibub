// #T914 One-rep max
export const path = '/everyday/one-rep-max/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/one-rep-max/`); await page.waitForTimeout(300);
  const R = '.rm ';
  const t = (c) => page.textContent(R + c);
  check((await t('.rm-ep')) === '116.7 kg', `1rm: 100 kg x 5 Epley 116.7 (${await t('.rm-ep')})`);
  check((await t('.rm-br')) === '112.5 kg', `1rm: Brzycki 112.5 (${await t('.rm-br')})`);
  const row = await t('tr[data-p="90"]');
  check(row.includes('102.5 kg') && row.endsWith('3'), `1rm: 90% row 102.5 kg, about 3 reps (${row})`);
  check((await t('.rm-warn')) === '', '1rm: no warning at 5 reps');
  await page.fill(R + '[data-k="r"]', '15'); await page.waitForTimeout(100);
  check((await t('.rm-warn')).includes('less reliable'), '1rm: more than 12 reps warns');
  await page.fill(R + '[data-k="r"]', '5'); await page.selectOption(R + '[data-k="u"]', 'lb'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="w"]')) === '220.5' && (await t('.rm-ep')).startsWith('257.'), `1rm: switch to lb converts 100 kg to 220.5 lb (${await t('.rm-ep')})`);
  // more options: all formulas, reps for a weight, plates, bar follows the unit
  await page.goto(`${BASE}/everyday/one-rep-max/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.locator(R + '.rm-all tbody tr').count()) === 7 && (await t('tr[data-f="Lombardi"]')).includes('117.5 kg') && (await t('tr[data-f="O\'Connor"]')).includes('112.5 kg'), 'one-rep max: 7 formulas, Lombardi 117.5, OConnor 112.5');
  check((await t('.rm-tr')).includes('90.5 kg for 8 reps'), `one-rep max: 8 reps from the 114.6 kg average -> 90.5 kg (${await t('.rm-tr')})`);
  check((await t('.rm-plates')).includes('1 × 25 + 1 × 15'), `one-rep max: 100 kg on a 20 kg bar -> 25 + 15 each side (${await t('.rm-plates')})`);
  await page.fill(R + '[data-k="load"]', '102.5'); await page.waitForTimeout(100);
  check((await t('.rm-plates')).includes('1 × 1.25'), 'one-rep max: 102.5 kg needs a 1.25 plate');
  await page.fill(R + '[data-k="load"]', '10'); await page.waitForTimeout(100);
  check((await t('.rm-plates')).includes('lighter than the empty bar'), 'one-rep max: load below the bar gives a message');
  await page.fill(R + '[data-k="load"]', ''); await page.selectOption(R + '[data-k="u"]', 'lb'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="bar"]')) === '45', 'one-rep max: lb switches the bar to 45');
};
