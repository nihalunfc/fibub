// #411 Luminescence age calculator
export const path = '/science/luminescence-age-calculator/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  const P = '.lum ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await page.textContent(P + '.lu-big')) === '21.81 ± 1.4 ka', 'lum: example age');
  check((await page.textContent(P + '.lu-desum')).startsWith('CAM 44.48 ± 1.11 Gy from 24 aliquots, overdispersion 10.2 % ± 2.1 %') && (await page.textContent(P + '.lu-desum')).includes('1 row without two numbers'), 'lum: CAM summary');
  { const f = await page.textContent(P + '.lu-facts'); check(f.includes('Dose rate2.040 ± 0.12 Gy/ka') && f.includes('Beta1.13 ± 0.075 Gy/ka (55 %)') && f.includes('Gamma0.764 ± 0.044 Gy/ka') && !f.includes('Alpha'), `lum: dose-rate parts`); }
  check((await page.textContent(P + '.lu-btab tr:nth-child(2)')).startsWith('Water content15 %5 %57.2 %'), 'lum: water dominates the budget');
  check(await page.isVisible(P + '.lu-defig'), 'lum: aliquot figure');
  await page.selectOption(P + '.lu-agg', 'wm'); await page.waitForTimeout(150);
  check((await page.textContent(P + '.lu-desum')).includes('Weighted mean 43.70 ± 0.553 Gy from 24 aliquots, MSWD 3.34: the spread is larger'), 'lum: weighted mean');
  await page.selectOption(P + '.lu-agg', 'mean'); await page.waitForTimeout(150);
  check((await page.textContent(P + '.lu-desum')).startsWith('Mean '), 'lum: arithmetic mean');
  await page.selectOption(P + '.lu-agg', 'cam');
  // Alpha with an a-value.
  await page.fill(P + '.lu-v-aValue', '0.08'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.lu-facts')).includes('Alpha') && (await page.textContent(P + '.lu-big')) !== '21.81 ± 1.4 ka', 'lum: a-value adds alpha');
  await page.fill(P + '.lu-v-aValue', '0');
  // Change a factor and the water k.
  await page.fill(P + '.lu-f-Kg', '0.3'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.lu-facts')).includes('Gamma0.816'), 'lum: edit a conversion factor');
  await page.fill(P + '.lu-f-Kg', '0.25');
  await page.click(P + '.lu-wd summary'); await page.fill(P + '.lu-kwb', '1.25'); await page.fill(P + '.lu-v-water', '0'); await page.fill(P + '.lu-u-water', '0'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.lu-facts')).includes('Beta1.34 ±'), 'lum: no water, no correction');
  await page.fill(P + '.lu-v-water', '15'); await page.fill(P + '.lu-u-water', '5');
  // One value, and dose-rate parts.
  await page.selectOption(P + '.lu-demode', 'one'); await page.selectOption(P + '.lu-drmode', 'parts'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.lu-big')) === '14.60 ± 1.1 ka' && await page.isHidden(P + '.lu-defig') && await page.isHidden(P + '.lu-v-K'), 'lum: one De and dose-rate parts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.lu-csv')]); const f = OUT + 'lu.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'quantity,value,uncertainty,unit,share_of_age_variance' && r[1].startsWith('age,14.5998,1.13598') && r.some((l) => l.startsWith('water,0.15,0.05,fraction of dry mass')), 'lum: summary CSV'); }
  // Bad input.
  await page.fill(P + '.lu-de', '-3'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.lu-err')).includes('above 0 Gy') && await page.isHidden(P + '.lu-out'), 'lum: negative De message');
  await page.fill(P + '.lu-de', '30'); await page.fill(P + '.lu-u-beta', 'x'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.lu-err')).includes('Beta (dry): give an uncertainty'), 'lum: bad uncertainty message');
  await page.fill(P + '.lu-u-beta', '0.07');
  await page.selectOption(P + '.lu-demode', 'aliq');
  await page.fill(P + '.lu-in', 'A1\t10\t0\nA2\t11\t1\n'); await page.waitForTimeout(400);
  check((await page.textContent(P + '.lu-err')).includes('needs an uncertainty above 0'), 'lum: zero aliquot uncertainty message');
  writeFileSync(OUT + 'ali.csv', 'name,De,err\nx,20,1\ny,22,1.2\nz,21,1.1\n');
  await page.setInputFiles(P + '.dfb-in', OUT + 'ali.csv'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.lu-desum')).includes('from 3 aliquots'), 'lum: open an aliquot file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=pdf]')]); const f = OUT + 'lu.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 5).toString() === '%PDF-', 'lum: PDF report'); }
};
