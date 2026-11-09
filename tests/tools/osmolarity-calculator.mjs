// #344 osmolarity calculator
export const path = '/science/osmolarity-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.osm ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/osmolarity-calculator/`); await page.waitForTimeout(500);
  check((await t('.os-big')) === '386.4 mOsm/L: hyperosmotic, isotonic', 'osmolarity: example result');
  { const f = await t('.os-facts'); check(f.includes('286.4 mOsm/L') && f.includes('996.5 kPa') && f.includes('9.835 atm') && f.includes('7475 mmHg') && f.includes('738.7 kPa'), 'osmolarity: example facts'); }
  check((await t('.os-tab')).includes('154') && (await t('.os-tab')).includes('74.1 %'), 'osmolarity: example table');
  check((await page.textContent('main')).includes('not for clinical use'), 'osmolarity: study note');
  const row = (n) => `${R}.os-row:nth-child(${n}) `;
  await page.locator(row(2) + '.os-p').scrollIntoViewIfNeeded(); await page.click(row(2) + '.os-p'); await page.waitForTimeout(150);
  check((await t('.os-big')) === '386.4 mOsm/L: hyperosmotic, hypertonic', 'osmolarity: urea counted towards tonicity');
  await page.locator(R + '.os-rm').nth(1).scrollIntoViewIfNeeded(); await page.locator(R + '.os-rm').nth(1).click(); await page.waitForTimeout(150);
  check((await t('.os-big')) === '286.4 mOsm/L: iso-osmotic, isotonic', 'osmolarity: remove a solute');
  await page.fill(row(1) + '.os-phi', '1'); await page.waitForTimeout(150);
  check((await t('.os-big')).startsWith('308 mOsm/L: hyperosmotic'), 'osmolarity: ideal φ');
  await page.fill(R + '.os-tol', '20'); await page.waitForTimeout(150);
  check((await t('.os-big')).includes('iso-osmotic'), 'osmolarity: tolerance');
  await page.fill(R + '.os-ref', '400'); await page.waitForTimeout(150);
  check((await t('.os-big')).includes('hypotonic') && (await t('.os-facts')).includes('swell'), 'osmolarity: hypotonic against a higher reference');
  await page.fill(R + '.os-ref', '290'); await page.fill(R + '.os-tol', '10');
  await page.selectOption(row(1) + '.os-s', 'glucose'); await page.fill(row(1) + '.os-a', '5'); await page.waitForTimeout(150);
  check((await t('.os-big')).startsWith('277.5 mOsm/L: hypo-osmotic'), 'osmolarity: 5 % glucose');
  await page.selectOption(row(1) + '.os-u', 'mgdL'); await page.fill(row(1) + '.os-a', '90'); await page.waitForTimeout(150);
  check((await t('.os-big')).startsWith('4.996 mOsm/L'), 'osmolarity: mg/dL');
  await page.click(R + '.os-add'); await page.waitForTimeout(100);
  await page.selectOption(row(2) + '.os-s', 'other'); await page.fill(row(2) + '.os-n', 'Sugar X'); await page.fill(row(2) + '.os-mm', '200'); await page.fill(row(2) + '.os-i', '1'); await page.selectOption(row(2) + '.os-u', 'gL'); await page.fill(row(2) + '.os-a', '20'); await page.waitForTimeout(150);
  check((await t('.os-tab')).includes('Sugar X') && (await t('.os-big')).startsWith('105 mOsm/L'), 'osmolarity: own solute by molar mass');
  await page.selectOption(row(2) + '.os-u', 'M'); await page.fill(row(2) + '.os-a', '0.1'); await page.waitForTimeout(150);
  check((await t('.os-big')).startsWith('105 mOsm/L'), 'osmolarity: mol/L');
  await page.fill(R + '.os-T', '25'); await page.waitForTimeout(150);
  check((await t('.os-facts')).includes('at 25 °C'), 'osmolarity: temperature');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.os-csv')]); const f = OUT + 'osm.csv'; await d.saveAs(f); const c = readFileSync(f, 'utf8'); check(c.startsWith('Solute,Amount,Unit') && c.includes('Sugar X,0.1,mol/L') && c.includes('Glucose,90,mg/dL,180.156'), 'osmolarity: CSV download'); }
  await page.fill(row(2) + '.os-mm', ''); await page.selectOption(row(2) + '.os-u', 'gL'); await page.waitForTimeout(150);
  check((await t('.os-err')).includes('molar mass of Sugar X') && await page.isHidden(R + '.os-out'), 'osmolarity: missing molar mass message');
  await page.fill(row(2) + '.os-mm', '200'); await page.fill(row(1) + '.os-i', '0'); await page.waitForTimeout(150);
  check((await t('.os-err')).includes('from 1 to 10'), 'osmolarity: bad i message');
};
