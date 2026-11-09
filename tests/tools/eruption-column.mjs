// #886 eruption column height and mass eruption rate
export const path = '/science/eruption-column/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/eruption-column/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent('.erc ' + c);
  check((await t('.ec-big')) === '15 km column: 1.07 × 10⁷ kg/s (power law), 3.68 × 10⁶ kg/s (plume theory)', 'eruption: example height to rate');
  { const f = await t('.ec-facts'); check(f.includes('4.28 × 10³ m³/s') && f.includes('neutral buoyancy at 11.4 km') && f.includes('1.45 × 10⁸ m⁴/s³') && f.includes('C = 1.366') && f.includes('16.5 km') && f.includes('4.62 × 10⁷ m³ DRE') && f.includes('0.0462 km³'), 'eruption: example facts'); }
  check(await page.isVisible('.erc .ec-fig'), 'eruption: chart');
  await page.selectOption('.erc .ec-mode', 'Q'); await page.waitForTimeout(100);
  check((await t('.ec-big')) === '1 × 10⁷ kg/s: 14.8 km (power law), 19.3 km (plume theory) above the vent' && await page.isHidden('.erc .ec-H'), 'eruption: rate to height');
  await page.fill('.erc .ec-a', '1.67'); await page.fill('.erc .ec-b', '0.259'); await page.waitForTimeout(100);
  check((await t('.ec-facts')).includes('H = 1.67 · V^0.259'), 'eruption: edited power law');
  await page.fill('.erc .ec-al', '0.4'); await page.waitForTimeout(100);
  check((await t('.ec-big')).includes('9.63 km (plume theory)'), 'eruption: α four times larger halves the plume height');
  await page.fill('.erc .ec-hr', '0'); await page.fill('.erc .ec-rb', ''); await page.waitForTimeout(100);
  check((await t('.ec-facts')).includes('in 0 h') && !(await t('.ec-facts')).includes('bulk'), 'eruption: zero duration, no bulk density');
  await page.fill('.erc .ec-Q', 'lots'); await page.waitForTimeout(100);
  check((await t('.ec-err')).includes('mass eruption rate') && await page.isHidden('.erc .ec-out'), 'eruption: bad rate message');
  await page.fill('.erc .ec-Q', '2e8'); await page.fill('.erc .ec-N', '0'); await page.waitForTimeout(100);
  check((await t('.ec-err')).includes('plume theory'), 'eruption: bad plume value message');
  await page.fill('.erc .ec-N', '0.01'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.erc .ec-csv')]); const f = OUT + 'ec.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 62 && rows[0] === 'mass_eruption_rate_kg_s,height_power_law_km,height_plume_theory_km', 'eruption: curve CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.erc .ec-out > .dl:last-child [data-f=pdf]')]); const f = OUT + 'ec.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'eruption: PDF report'); }
};
