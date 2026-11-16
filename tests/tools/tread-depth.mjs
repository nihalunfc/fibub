// #T942 Tread depth
export const path = '/vehicles/tread-depth/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/tread-depth/`); await page.waitForTimeout(300);
  const t = (s) => page.textContent(`.td ${s}`);
  const set = async (k, v) => { await page.fill(`.td [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const pick = async (k, v) => { await page.selectOption(`.td [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await set('depth', '1.2');
  check((await t('.td-pill')) === 'Replace', `tread-depth: 1.2 mm UK car -> Replace (${await t('.td-pill')})`);
  await set('depth', '2.5');
  check((await t('.td-pill')) === 'Close to limit', 'tread-depth: 2.5 mm -> Close to limit');
  await set('depth', '5');
  check((await t('.td-pill')) === 'Legal', 'tread-depth: 5 mm -> Legal');
  await pick('region', 'usa');
  check((await page.inputValue('.td [data-k="unit"]')) === '32', 'tread-depth: USA switches to 32nds');
  await set('depth', '5');
  check((await t('.td-pill')) === 'Legal', 'tread-depth: 5/32 US -> Legal');
  await set('depth', '2');
  check((await t('.td-pill')) === 'Close to limit', 'tread-depth: exactly 2/32 US is at the limit, not below it');
  await set('depth', '1');
  check((await t('.td-pill')) === 'Replace', 'tread-depth: 1/32 US -> Replace');
  await pick('region', 'uk'); await pick('veh', 'motorcycle'); await set('depth', '1.2');
  check((await t('.td-pill')) === 'Close to limit', 'tread-depth: UK motorcycle 1.2 mm is above its 1 mm limit');
  await page.goto(`${BASE}/vehicles/tread-depth/?c=usa`); await page.waitForTimeout(300);
  check((await page.inputValue('.td [data-k="unit"]')) === '32' || (await page.inputValue('.td [data-k="region"]')) === 'usa', 'tread-depth: ?c=usa opens in USA mode');
  await page.goto(`${BASE}/vehicles/tread-depth/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach(d => d.open = true));
  await set('din', '2'); await set('dmid', '4'); await set('dout', '4');
  check((await t('.td-pill')) === 'Close to limit' && (await t('.td-extra')).includes('inner edge'), `tread-depth: inner edge worn, lowest 2 mm counts (${await t('.td-extra')})`);
  await set('dnew', '8'); await set('ddist', '30000'); // (8 - 2) / 30,000 = 0.0002 mm/km; (2 - 1.6) / 0.0002 = 2,000 km
  check((await t('.td-extra')).includes('2 mm every 10,000 km') && (await t('.td-extra')).includes('About 2,000 km'), `tread-depth: life left (${await t('.td-extra')})`);
};
