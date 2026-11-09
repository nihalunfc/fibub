// #305 distance sampling
export const path = '/science/distance-sampling/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (s) => page.textContent('.dsm ' + s);
  const wait = () => page.waitForTimeout(700);
  await page.goto(`${BASE}/science/distance-sampling/`); await wait();
  check((await T('.ds-big')) === 'D = 128.9 per km² (95 % CI 91.54 to 181.5)', 'distance: line example density');
  { const f = await T('.ds-facts'); check(f.includes('1.289') && f.includes('19.4 m') && f.includes('0.388') && f.includes('5 per km') && f.includes('12.7 %') && f.includes('11.7 df') && f.includes('1 beyond'), 'distance: line example facts'); }
  { const t = await T('.ds-tab'); check(t.includes('416.96') && t.includes('422.47') && t.includes('5.51') && t.includes('105.3'), 'distance: models compared'); }
  check(await page.isVisible('.dsm .ds-fig'), 'distance: detection function chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dsm .ds-csv')]); const f = OUT + 'ds.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.includes('Density per km2,128.89') && t.includes('Model,Half-normal') && t.includes('Hazard-rate,'), 'distance: CSV'); }
  await page.selectOption('.dsm .ds-key', 'hr'); await wait();
  check((await T('.ds-big')).startsWith('D = 105.3 per km²') && (await T('.ds-facts')).includes('shape b = 4.046'), 'distance: hazard-rate chosen');
  await page.selectOption('.dsm .ds-key', 'hn'); await page.selectOption('.dsm .ds-conf', '0.9'); await wait();
  check((await T('.ds-big')).startsWith('D = 128.9 per km² (90 % CI'), 'distance: half-normal and 90 % CI');
  await page.selectOption('.dsm .ds-conf', '0.95'); await page.selectOption('.dsm .ds-key', 'best');
  await page.fill('.dsm .ds-eff', '12'); await wait();
  check((await T('.ds-facts')).includes('(Poisson)') && (await T('.ds-big')).startsWith('D = 128.9'), 'distance: one total length uses Poisson variance');
  await page.fill('.dsm .ds-eff', 'L1\t2.0\nL2\t1.5'); await wait();
  check((await T('.ds-err')).includes('Line "L3" has detections but no length'), 'distance: missing line length message');
  await page.fill('.dsm .ds-eff', 'line\tlength (km)\nL1\t2.0\nL2\t1.5\nL3\t2.5\nL4\t1.8\nL5\t2.2\nL6\t2.0');
  await page.fill('.dsm .ds-w', ''); await wait();
  check((await T('.ds-facts')).includes('all within w = 55.4 m'), 'distance: blank truncation uses the farthest detection');
  await page.fill('.dsm .ds-w', '0.5'); await wait();
  check((await T('.ds-err')).includes('Raise the truncation distance') && await page.isHidden('.dsm .ds-out'), 'distance: too few within w message');
  await page.fill('.dsm .ds-w', '50'); await page.fill('.dsm .ds-data', '5\n-3\n8'); await wait();
  check((await T('.ds-err')).includes('cannot be negative'), 'distance: negative distance message');
  await page.fill('.dsm .ds-data', ''); await page.locator('.dsm button[data-m=point]').scrollIntoViewIfNeeded(); await page.click('.dsm button[data-m=point]'); await wait();
  check((await T('.ds-big')) === 'D = 703.8 per km² (95 % CI 273.2 to 1813)', 'distance: point example density');
  { const f = await T('.ds-facts'); const t = await T('.ds-tab'); check(f.includes('31.3 m') && f.includes('2.167 per point') && t.includes('447.2') && t.includes('1.06'), 'distance: point example facts and models'); }
  await page.fill('.dsm .ds-k', '5'); await wait();
  check((await T('.ds-err')).includes('name 11 points, more than the 5'), 'distance: too few points message');
  await page.fill('.dsm .ds-k', '12'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dsm .dl [data-f=docx]')]); check((await d.suggestedFilename()) === 'distance-sampling.docx', 'distance: Word report'); }
};
