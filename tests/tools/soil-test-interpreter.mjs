// #382 soil test interpreter
export const path = '/science/soil-test-interpreter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const big = () => page.textContent('.sti .st-big'), facts = () => page.textContent('.sti .st-facts');
  check((await big()) === 'Spread 3.63 t/ha of your lime (1.62 tons/acre)', `soil: example lime from base saturation (${await big()})`);
  { const f = await facts(); check(f.includes('2,928 kg/ha') && f.includes('3 cmol(+)/kg in 1,950 t/ha') && f.includes('80.75 %') && f.includes('29.00 t for 8 ha'), 'soil: lime facts'); }
  await page.fill('.sti .st-mo', '10'); await page.waitForTimeout(100);
  check((await big()).startsWith('Spread 4.03 t/ha'), 'soil: moisture adds weight');
  await page.fill('.sti .st-mo', '0'); await page.fill('.sti .st-d', '20'); await page.waitForTimeout(100);
  check((await big()).startsWith('Spread 4.83 t/ha'), 'soil: deeper layer needs more lime');
  await page.fill('.sti .st-bs0', '85'); await page.waitForTimeout(100);
  check((await big()).startsWith('No lime needed: base saturation'), 'soil: already above target base saturation');
  await page.selectOption('.sti .st-m', 'buffer'); await page.fill('.sti .st-d', '15'); await page.waitForTimeout(100);
  check(await page.isVisible('.sti .st-buf') && await page.isHidden('.sti .st-cec') && (await facts()).includes('2,196 kg/ha'), 'soil: buffer capacity method');
  await page.selectOption('.sti .st-m', 'factor'); await page.fill('.sti .st-d', '20'); await page.waitForTimeout(100);
  check(await page.isHidden('.sti .st-bd') && (await facts()).includes('2,400 kg/ha') && (await big()).startsWith('Spread 2.97 t/ha'), 'soil: lime factor scaled to depth');
  await page.fill('.sti .st-ph0', '7'); await page.waitForTimeout(100);
  check((await big()) === 'No lime needed: the pH is already at or above the target', 'soil: pH above target');
  await page.fill('.sti .st-ph0', 'abc'); await page.waitForTimeout(100);
  check((await page.textContent('.sti .st-err')).includes('soil pH now') && (await big()) === '', 'soil: bad pH message');
  await page.fill('.sti .st-ph0', '5.6'); await page.fill('.sti .st-cce', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.sti .st-err')).includes('CCE'), 'soil: bad CCE message');
  await page.fill('.sti .st-cce', '95'); await page.waitForTimeout(100);
  // Nutrients.
  check((await page.textContent('.sti .st-rbig')) === '3 of 6 in range; low: Phosphorus (P), Magnesium (Mg), Organic matter', 'soil: example nutrient ratings');
  check((await page.textContent('.sti .st-tab')).includes('Low, 60 % of the bottom') && await page.isVisible('.sti .st-fig'), 'soil: rating table and picture');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sti .st-csv')]); const f = OUT + 'soil.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0] === 'nutrient,result,unit,range_bottom,range_top,rating' && rows[1] === 'Phosphorus (P),12,mg/kg,20,40,low', 'soil: ratings CSV'); }
  await page.fill('.sti .st-r', 'Boron\t3.5\t0.5\t2\tmg/kg'); await page.waitForTimeout(100);
  check((await page.textContent('.sti .st-rbig')) === '0 of 1 in range; high: Boron' && (await page.textContent('.sti .st-tab')).includes('175 % of the top'), 'soil: typed tab-separated row, high');
  await page.fill('.sti .st-r', 'Boron, 3.5, 2, 0.5'); await page.waitForTimeout(100);
  check((await page.textContent('.sti .st-rerr')).includes('bottom first') && await page.isHidden('.sti .st-rout'), 'soil: range written top first');
  await page.click('.sti .st-ex'); await page.waitForTimeout(100);
  check((await page.textContent('.sti .st-rbig')).startsWith('3 of 6'), 'soil: example button');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sti .dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'soil: Word report'); }
};
