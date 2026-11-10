// #T897 Stopping distance
export const path = '/money/stopping-distance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/stopping-distance/`); await page.waitForTimeout(300);
  const rows = () => page.textContent('.sd .sd-rows'), big = () => page.textContent('.sd .sd-big');
  const set = async (k, v) => { await page.fill(`.sd [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  // 100 km/h = 27.78 m/s; 1.5 s -> 41.7 m; 27.78^2 / (2 * 0.7 * 9.81) = 56.2 m; total 97.9 m
  check((await rows()).includes('41.7 m') && (await rows()).includes('56.2 m') && (await big()).includes('97.9'), `stopping-distance: 100 km/h dry = 41.7 + 56.2 = 97.9 (${await big()})`);
  await page.selectOption('.sd [data-k="road"]', '0.1'); await page.waitForTimeout(80);
  check(parseFloat((await big()).replace('Total ', '')) > 400, 'stopping-distance: ice is much longer');
  await page.selectOption('.sd [data-k="road"]', '0.7'); await page.selectOption('.sd [data-k="veh"]', 'truck'); await page.waitForTimeout(80);
  check((await rows()).includes('55.6 m'), 'stopping-distance: truck adds 0.5 s lag (2.0 s = 55.6 m)');
  await page.selectOption('.sd [data-k="veh"]', 'car'); await set('slope', '10');
  check((await rows()).includes('45.0 m') || parseFloat((await rows()).match(/Braking distance([\d.]+)/)?.[1]) < 56, 'stopping-distance: uphill shortens braking');
  await set('slope', '0'); await page.selectOption('.sd [data-k="unit"]', 'mph'); await set('speed', '62.1371'); 
  check((await big()).includes('97.9'), `stopping-distance: mph converts (${await big()})`);
  check((await page.$$('.sd-svg rect')).length === 2, 'stopping-distance: bar diagram drawn');
};
