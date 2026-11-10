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
};
