// #T871 Concrete calculator
export const path = '/everyday/concrete-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/concrete-calculator/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.cc ${s}`)).trim();
  check((await t('.cc-vol')).startsWith('0.9 m³'), 'concrete-calculator: 3 x 3 m x 100 mm slab is 0.9 m³');
  check((await t('.cc-total')).startsWith('0.99 m³'), 'concrete-calculator: +10% is 0.99 m³');
  await page.click('.cc-shape [data-s="hole"]');
  check((await t('.cc-each')).startsWith('0.0565 m³') && (await t('.cc-vol')).startsWith('0.565 m³'), 'concrete-calculator: 10 post holes 300 x 900 mm with 100 mm post, 0.0565 m³ each');
  await page.click('.cc-units [data-u="i"]');
  await page.click('.cc-shape [data-s="slab"]');
  await page.fill('.cc [data-k="l"]', '27'); await page.fill('.cc [data-k="w"]', '1'); await page.fill('.cc [data-k="t"]', '12');
  await page.fill('.cc [data-x="waste"]', '0');
  check((await t('.cc-big')) === '1 yd³' && (await t('.cc-bags')).startsWith('45 bags of 80 lb'), 'concrete-calculator: 1 yd³ is 45 bags of 80 lb');
  await page.click('.cc .cc-clear');
  check((await t('.cc-note')) === 'Type the sizes above.', 'concrete-calculator: Clear empties the sizes');
  // More options: price comparison and sketch.
  await page.goto(`${BASE}/everyday/concrete-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.locator('.cc .cc-sk svg').count()) === 1, 'concrete-calculator: slab sketch shown');
  await page.fill('.cc [data-x="bagp"]', '6'); await page.fill('.cc [data-x="readyp"]', '150');
  check((await t('.cc-bags')).startsWith('83 bags'), `concrete-calculator: 0.99 m³ / 0.012 = 82.5 -> 83 bags (${await t('.cc-bags')})`);
  check((await t('.cc-cost')).startsWith('Bags 498.00 (83 × 6.00); ready-mix 148.50 (0.99 m³ × 150.00). Ready-mix is cheaper'), `concrete-calculator: 83 x 6 = 498 against 0.99 x 150 = 148.50 (${await t('.cc-cost')})`);
  await page.fill('.cc [data-x="minload"]', '4');
  check((await t('.cc-cost')).includes('ready-mix 600.00') && (await t('.cc-cost')).includes('Bags are cheaper'), 'concrete-calculator: 4 m³ minimum load makes ready-mix 600.00 and bags cheaper');
  await page.click('.cc-shape [data-s="steps"]'); await page.click('.cc-shape [data-s="hole"]');
  check((await page.locator('.cc .cc-sk svg').count()) === 1, 'concrete-calculator: hole sketch shown');
  await page.click('.cc-shape [data-s="steps"]');
  check((await page.locator('.cc .cc-sk svg').count()) === 1, 'concrete-calculator: steps sketch shown');
  await page.click('.cc-units [data-u="i"]'); await page.click('.cc-shape [data-s="slab"]');
  await page.fill('.cc [data-k="l"]', '27'); await page.fill('.cc [data-k="w"]', '1'); await page.fill('.cc [data-k="t"]', '12');
  await page.fill('.cc [data-x="waste"]', '0'); await page.fill('.cc [data-x="bagp"]', '10'); await page.fill('.cc [data-x="readyp"]', '100'); await page.fill('.cc [data-x="minload"]', '');
  check((await t('.cc-cost')).startsWith('Bags 450.00 (45 × 10.00); ready-mix 100.00 (1 yd³ × 100.00). Ready-mix is cheaper'), `concrete-calculator: imperial 45 x 10 = 450 against 1 yd³ x 100 (${await t('.cc-cost')})`);
  await page.fill('.cc [data-x="bagp"]', ''); await page.fill('.cc [data-x="readyp"]', '');
  check((await t('.cc-cost')) === '–', 'concrete-calculator: no prices shows a dash');
};
