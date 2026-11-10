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
};
