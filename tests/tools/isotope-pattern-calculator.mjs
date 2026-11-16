// #isotope pattern calculator: resolving power presets and slider, table threshold, mass defect
export const path = '/science/isotope-pattern-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.ipc ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await t('.ipc-big')) === '[M+H]⁺: m/z 286.1438', 'isotope: morphine example');
  check((await t('.ipc-facts')).includes('286 and 0.1438 u'), 'isotope: nominal mass and mass defect');
  const before = await t('.ipc-fig-note');
  await page.selectOption(R + '.ipc-rp', '140000'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.ipc-res')) === '140000' && (await t('.ipc-fig-note')) !== before, 'isotope: Orbitrap preset sets the resolving power');
  await page.evaluate(() => { const r = document.querySelector('.ipc .ipc-rs'); r.value = '3'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.ipc-res')) === '1000' && (await page.inputValue(R + '.ipc-rp')) === '', 'isotope: slider sets 1,000 and clears the preset');
  await page.fill(R + '.ipc-res', '30000'); await page.waitForTimeout(150);
  check(Math.abs(Number(await page.inputValue(R + '.ipc-rs')) - Math.log10(30000)) < 0.01, 'isotope: typed power moves the slider');
  const n0 = await page.locator(R + '.ipc-tab tbody tr').count();
  await page.fill(R + '.ipc-min', '50'); await page.waitForTimeout(150);
  check(n0 > 1 && (await page.locator(R + '.ipc-tab tbody tr').count()) === 1, 'isotope: threshold hides small peaks');
  await page.fill(R + '.ipc-res', '-5'); await page.waitForTimeout(150);
  check(!(await t('.ipc-fig-note')).includes('NaN'), 'isotope: bad resolving power has no NaN');
};
