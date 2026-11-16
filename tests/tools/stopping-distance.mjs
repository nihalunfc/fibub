// #T897 Stopping distance
export const path = '/vehicles/stopping-distance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/stopping-distance/`); await page.waitForTimeout(300);
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
  // New options: slider, reaction presets, speed table, +10, obstacle what-if
  await page.selectOption('.sd [data-k="unit"]', 'kmh'); await set('speed', '100'); await set('react', '1.5');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.inputValue('.sd [data-k="speedr"]')) === '100', 'stopping-distance: slider follows the typed speed');
  await page.evaluate(() => { const s = document.querySelector('.sd [data-k="speedr"]'); s.value = '120'; s.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(80);
  // 120 km/h: 50.0 + 80.9 = 130.9
  check((await page.inputValue('.sd [data-k="speed"]')) === '120' && (await big()).includes('130.9'), `stopping-distance: slider sets speed 120 = 130.9 m (${await big()})`);
  await page.click('.sd [data-react="2.5"]'); await page.waitForTimeout(80);
  check((await page.inputValue('.sd [data-k="react"]')) === '2.5' && (await rows()).includes('83.3 m'), 'stopping-distance: reaction preset 2.5 s = 83.3 m');
  await page.click('.sd [data-react="1.5"]'); await set('speed', '100');
  const tab = await page.$$eval('.sd-tab tbody tr', (r) => r.map((x) => x.textContent));
  check(tab.length === 7 && tab.some((t) => t === '100 km/h41.7 m56.2 m97.9 m') && tab.some((t) => t === '120 km/h50.0 m80.9 m130.9 m'), `stopping-distance: speed table (${JSON.stringify(tab)})`);
  check((await page.textContent('.sd .sd-more10')).includes('adds 16.0 m: 113.8 m in all'), `stopping-distance: +10 km/h line (${await page.textContent('.sd .sd-more10')})`);
  await set('obs', '70');
  check((await page.textContent('.sd .sd-hit')).includes('hit it at about 70.4 km/h'), `stopping-distance: obstacle at 70 m (${await page.textContent('.sd .sd-hit')})`);
  await set('obs', '120');
  check((await page.textContent('.sd .sd-hit')).includes('stop in time: 22.1 m to spare'), `stopping-distance: obstacle at 120 m (${await page.textContent('.sd .sd-hit')})`);
  await set('speed', '0');
  check(!(await page.textContent('.sd')).includes('NaN') && (await page.textContent('.sd .sd-warn')).length > 5, 'stopping-distance: zero speed, friendly message');
};
