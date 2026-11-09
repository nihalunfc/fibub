// #653 retaining wall stability (maths checked against Python in tests/sci-tools/retaining-wall-check.mjs)
export const path = '/science/retaining-wall-check/';
export default async ({ page, check, BASE }) => {
  const R = '.rwc ';
  await page.goto(`${BASE}/science/retaining-wall-check/`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.rw-big')) === 'Sliding 1.58, overturning 3.86, max bearing 78.1 kPa', `retwall: example (${await page.textContent(R + '.rw-big')})`);
  check((await page.textContent(R + '.rw-pills')) === 'Sliding: OKOverturning: OKBearing: OKMiddle third: OK', `retwall: pills (${await page.textContent(R + '.rw-pills')})`);
  { const f = await page.textContent(R + '.rw-facts'); check(f.includes('K = 0.3073') && f.includes('322.2 ÷ 83.57') && f.includes('78.09 / 53.11 kPa') && f.includes('0.0952 m') && f.includes('Earth 44.25 kN') && f.includes('Surcharge 12.29 kN'), `retwall: facts (${f})`); }
  check((await page.$$(R + '.rw-tab tbody tr')).length === 7 && await page.isVisible(R + '.rw-fig'), 'retwall: force table and drawing');
  // Water and uplift.
  await page.fill(R + '.rw-hw', '2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rw-big')).startsWith('Sliding 1.08, overturning 2.19') && (await page.textContent(R + '.rw-pills')).includes('Sliding: not OK'), `retwall: water lowers sliding (${await page.textContent(R + '.rw-big')})`);
  await page.locator(R + '.rw-up').scrollIntoViewIfNeeded(); await page.click(R + '.rw-up'); await page.waitForTimeout(100);
  check(!(await page.textContent(R + '.rw-tab')).includes('Uplift'), 'retwall: uplift off');
  await page.fill(R + '.rw-hw', '0');
  // Coulomb with a slope.
  await page.selectOption(R + '.rw-m', 'coulomb'); await page.fill(R + '.rw-beta', '10'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.rw-d') && (await page.textContent(R + '.rw-facts')).includes('K = 0.3126') && (await page.textContent(R + '.rw-facts')).includes('thrust at 20°'), 'retwall: Coulomb with sloping backfill');
  await page.fill(R + '.rw-Df', '1'); await page.locator(R + '.rw-pp').scrollIntoViewIfNeeded(); await page.click(R + '.rw-pp'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rw-facts')).includes('+ passive'), 'retwall: passive resistance counted');
  // Gravity example.
  await page.selectOption(R + '.rw-m', 'rankine'); await page.fill(R + '.rw-beta', '0'); await page.fill(R + '.rw-Df', '0'); await page.click(R + '.rw-pp');
  await page.selectOption(R + '.rw-ex', 'grav'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.rw-heel')) === '0' && (await page.textContent(R + '.rw-big')) === 'Sliding 1.26, overturning 2.85, max bearing 64 kPa', `retwall: gravity example (${await page.textContent(R + '.rw-big')})`);
  await page.selectOption(R + '.rw-ex', 'cant'); await page.fill(R + '.rw-toe', '0.3'); await page.fill(R + '.rw-heel', '0.4'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rw-big')).startsWith('The wall overturns') && (await page.textContent(R + '.rw-pills')).includes('Bearing: not OK'), 'retwall: tipping wall explained');
  await page.fill(R + '.rw-heel', '1.0'); await page.fill(R + '.rw-toe', '0.6'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rw-facts')).includes('of the 2 m base is in contact') && (await page.textContent(R + '.rw-pills')).includes('Middle third: not OK'), 'retwall: partial contact');
  await page.fill(R + '.rw-beta', '40'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rw-err')).includes('less than φ') && await page.isHidden(R + '.rw-out'), 'retwall: slope too steep message');
  await page.fill(R + '.rw-beta', '0'); await page.fill(R + '.rw-tbo', '0.1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rw-err')).includes('at least as thick'), 'retwall: stem message');
  await page.fill(R + '.rw-tbo', '0.4'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'retaining-wall.pdf', 'retwall: PDF report'); }
};
