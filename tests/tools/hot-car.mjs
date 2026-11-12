// #T945 Hot car
export const path = '/vehicles/hot-car/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/hot-car/`); await page.waitForTimeout(300);
  const big = async () => parseFloat((await page.textContent('.hc [data-o="big"]')).match(/About (-?\d+)/)[1]);
  // 30 C, 30 min, sun, shut: 30 + 24 * (1 - e^(-30/22)) = 47.9
  const a = await big();
  check(Math.abs(a - 49) <= 2, `hot-car: 30 C, 30 min, sun -> about 49 (${a})`);
  await page.selectOption('.hc [data-k="sun"]', 'shade');
  const b = await big();
  check(b < a && Math.abs(b - 39) <= 2, `hot-car: shade is cooler (${b})`);
  await page.selectOption('.hc [data-k="sun"]', 'sun');
  await page.selectOption('.hc [data-k="win"]', 'cracked');
  check((await big()) < a, 'hot-car: cracked windows lower it only slightly');
  await page.selectOption('.hc [data-k="win"]', 'shut');
  await page.selectOption('.hc [data-k="unit"]', 'f');
  check((await page.inputValue('.hc [data-k="out"]')) === '86' && Math.abs((await big()) - 118) <= 3, 'hot-car: Fahrenheit converts 30 C to 86 F');
  check((await page.$$('.hc-chart polyline')).length === 1, 'hot-car: chart drawn');
  check((await page.textContent('.hc')).includes('Never leave a child'), 'hot-car: safety message shown');
  await page.goto(`${BASE}/vehicles/hot-car/?c=usa`); await page.waitForTimeout(300);
  check((await page.inputValue('.hc [data-k="unit"]')) === 'f', 'hot-car: ?c=usa opens in Fahrenheit');
};
