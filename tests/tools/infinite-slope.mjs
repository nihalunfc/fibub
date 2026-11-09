// #891 infinite slope factor of safety
export const path = '/science/infinite-slope/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/infinite-slope/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent('.ifs ' + c);
  check((await t('.ifs-note')).includes('For study, not a slope stability assessment'), 'infinite slope: study-only notice');
  check((await t('.is-big')) === 'FS = 1.09' && (await t('.is-pill')).includes('stands'), 'infinite slope: example FS');
  { const f = await t('.is-facts'); check(f.includes('34.7°') && f.includes('0.567') && f.includes('2.84 m') && f.includes('1.33 / 0.79'), 'infinite slope: critical angle, m, depth, dry and saturated'); }
  check(await page.isVisible('.ifs .is-f1') && await page.isVisible('.ifs .is-f2'), 'infinite slope: both sensitivity charts');
  await page.selectOption('.ifs .is-w', 'sat'); await page.waitForTimeout(100);
  check((await t('.is-big')) === 'FS = 0.79' && (await page.inputValue('.ifs .is-m')) === '1' && await page.isDisabled('.ifs .is-m') && (await t('.is-pill')).includes('slides'), 'infinite slope: saturated');
  await page.selectOption('.ifs .is-w', 'dry'); await page.waitForTimeout(100);
  check((await t('.is-big')) === 'FS = 1.33', 'infinite slope: dry');
  await page.fill('.ifs .is-c', '0'); await page.fill('.ifs .is-cr', '0'); await page.fill('.ifs .is-b', '25'); await page.waitForTimeout(100);
  { const f = await t('.is-facts'); check((await t('.is-big')) === 'FS = 1.34' && f.includes('32.0°') && f.includes('does not apply'), 'infinite slope: cohesionless dry FS = tan φ / tan β, critical angle = φ'); }
  await page.selectOption('.ifs .is-w', 'part'); await page.fill('.ifs .is-m', '0.5'); await page.fill('.ifs .is-c', '3'); await page.fill('.ifs .is-cr', '2'); await page.fill('.ifs .is-b', '32'); await page.waitForTimeout(100);
  check((await t('.is-big')) === 'FS = 1.04', 'infinite slope: partly saturated m = 0.5');
  await page.selectOption('.ifs .is-zm', 'n'); await page.waitForTimeout(100);
  check((await t('.is-zl')).includes('square to the slope') && (await t('.is-big')) === 'FS = 0.99', 'infinite slope: depth square to the slope');
  await page.fill('.ifs .is-m', '1.5'); await page.waitForTimeout(100);
  check((await t('.is-err')).includes('m is from 0') && await page.isHidden('.ifs .is-out'), 'infinite slope: bad m message');
  await page.fill('.ifs .is-m', '0.4'); await page.selectOption('.ifs .is-zm', 'v'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ifs .is-csv')]); const f = OUT + 'is.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 86 && rows[0].startsWith('slope_deg,FS_m0') && rows[32].startsWith('32,1.3272'), 'infinite slope: FS table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ifs .is-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'is.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'infinite slope: Word report'); }
};
