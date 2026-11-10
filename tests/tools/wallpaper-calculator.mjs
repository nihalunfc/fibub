// #T869 Wallpaper calculator
export const path = '/everyday/wallpaper-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/wallpaper-calculator/`); await page.waitForTimeout(300);
  const R = '.wpc ';
  const big = () => page.textContent(R + '.wpc-big');
  const lines = () => page.textContent(R + '.wpc-lines');
  const set = async (key, v) => { await page.fill(R + `[data-k="${key}"]`, v); await page.waitForTimeout(100); };
  check((await big()) === '7 rolls', `wallpaper: 14 m x 2.5 m, 0.53 x 10.05 roll -> 7 rolls (${await big()})`);
  check((await lines()).includes('27 strips') && (await lines()).includes('gives 4 strips'), 'wallpaper: 27 strips, 4 per roll');
  await set('rep', '64');
  check((await big()) === '9 rolls' && (await lines()).includes('gives 3 strips'), `wallpaper: 64 cm repeat -> 3 per roll, 9 rolls (${await big()})`);
  await page.selectOption(R + '[data-k="match"]', 'd'); await page.waitForTimeout(100);
  check((await lines()).includes('2.88 m'), 'wallpaper: half-drop adds half a repeat (2.88 m strips)');
  await page.selectOption(R + '[data-k="units"]', 'ft'); await page.waitForTimeout(150);
  check((await big()) === '7 rolls' && (await lines()).includes('26 strips'), `wallpaper: imperial example 44 ft x 8 ft -> 26 strips, 7 rolls (${await big()})`);
};
