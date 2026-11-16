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
  // New options (fresh page: manual says 91 RON)
  await page.goto(`${BASE}/vehicles/octane-guide/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const v = () => page.textContent('.og [data-o="verdict"]');
  await page.selectOption('.og [data-k="us"]', 'aki'); await set('use', '87');
  // 87 AKI = 91 RON: same as the manual
  check((await v()).startsWith('Fine'), `octane-guide: 87 AKI meets a 91 RON manual (${await v()})`);
  await set('use', '85');
  // 85 AKI = 89 RON: below 91
  check((await v()).startsWith('Not advised') && (await page.textContent('.og [data-o="vwhy"]')).includes('knock'), `octane-guide: 85 AKI is too low (${await v()})`);
  await page.selectOption('.og [data-k="us"]', 'ron'); await set('use', '98');
  check((await v()).includes('paying for nothing'), `octane-guide: 98 RON is more than needed (${await v()})`);
  await set('ex', '8'); await set('ky', '12000'); await set('mi', '15');
  // 12,000 / 15 = 800 litres x 8 = 6,400
  check((await page.textContent('.og [data-o="yr"]')).startsWith('About 6,400 a year extra (800 litres'), `octane-guide: yearly extra (${await page.textContent('.og [data-o="yr"]')})`);
  await set('mi', '0');
  check((await page.textContent('.og [data-o="yr"]')).startsWith('Type the extra') && !(await page.textContent('.og')).includes('NaN'), 'octane-guide: zero mileage, friendly message');
};
