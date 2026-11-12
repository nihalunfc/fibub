// #T946 Octane guide
export const path = '/vehicles/octane-guide/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/octane-guide/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.og [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  check((await page.inputValue('.og [data-k="aki"]')) === '91', 'octane-guide: 95 RON -> 91 AKI');
  await set('aki', '87');
  check((await page.inputValue('.og [data-k="ron"]')) === '91', 'octane-guide: 87 AKI -> 91 RON');
  await page.selectOption('.og [data-k="c"]', 'canada');
  await set('man', '91');
  const b = await page.textContent('.og [data-o="buy"]');
  check(b.includes('87 AKI'), `octane-guide: manual 91 RON in Canada -> 87 (${b})`);
  await page.goto(`${BASE}/vehicles/octane-guide/?c=usa`); await page.waitForTimeout(300);
  check((await page.inputValue('.og [data-k="c"]')) === 'usa', 'octane-guide: ?c=usa presets the country');
};
