// #T916 Calorie calculator
export const path = '/everyday/calorie-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/calorie-calculator/`); await page.waitForTimeout(300);
  const R = '.cc ';
  const t = (c) => page.textContent(R + c);
  check((await t('.cc-bmr')) === '1,780 kcal', `calorie: male 30 y 80 kg 180 cm BMR 1,780 (${await t('.cc-bmr')})`);
  check((await t('.cc-tdee')) === '2,759 kcal', `calorie: x1.55 = 2,759 (${await t('.cc-tdee')})`);
  const row = await t('tr[data-m="Carbs"]');
  check((await t('tr[data-m="Protein"]')).includes('128 g') && row.includes('355 g'), `calorie: macros protein 128 g, carbs 355 g (${row})`);
  await page.selectOption(R + '[data-k="goal"]', '-0.5'); await page.waitForTimeout(100);
  check((await t('.cc-goal')) === '2,209 kcal', `calorie: lose 0.5 kg/week -> 2,209 (${await t('.cc-goal')})`);
  await page.selectOption(R + '[data-k="goal"]', '0');
  await page.selectOption(R + '[data-k="sex"]', 'f'); await page.fill(R + '[data-k="wt"]', '60'); await page.fill(R + '[data-k="ht"]', '165'); await page.waitForTimeout(100);
  check((await t('.cc-bmr')) === '1,320 kcal', `calorie: female 30 y 60 kg 165 cm -> 1,320 (${await t('.cc-bmr')})`);
  await page.selectOption(R + '[data-k="act"]', '1.2'); await page.selectOption(R + '[data-k="goal"]', '-0.5'); await page.waitForTimeout(100);
  check((await t('.cc-warn')).includes('below 1,200'), `calorie: target under the floor warns (${await t('.cc-goal')})`);
};
