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
  // more options: formula choice, goal weight, meals, one-line answer
  await page.goto(`${BASE}/everyday/calorie-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await t('.cc-big')) === 'About 2,759 kcal a day to keep your weight.', `calorie: plain answer line (${await t('.cc-big')})`);
  check((await t('tr[data-meal="Breakfast"]')).includes('690') && (await t('tr[data-meal="Lunch"]')).includes('828'), 'calorie: meals 25% = 690, 30% = 828 kcal');
  await page.selectOption(R + '[data-k="eq"]', 'hb'); await page.waitForTimeout(100);
  check((await t('.cc-bmr')) === '1,854 kcal' && (await t('.cc-tdee')) === '2,873 kcal', `calorie: Harris-Benedict male 30 y 80 kg 180 cm -> 1,854 / 2,873 (${await t('.cc-bmr')})`);
  await page.selectOption(R + '[data-k="eq"]', 'km'); await page.waitForTimeout(100);
  check((await t('.cc-bmr')) === '1,752 kcal' && (await t('.cc-tdee')) === '2,716 kcal', `calorie: Katch-McArdle 80 kg 20% fat -> 1,752 / 2,716 (${await t('.cc-bmr')})`);
  await page.selectOption(R + '[data-k="eq"]', 'mj'); await page.selectOption(R + '[data-k="goal"]', '-0.5'); await page.fill(R + '[data-k="gw"]', '72'); await page.waitForTimeout(100);
  check((await t('.cc-weeks')).includes('About 16 weeks'), `calorie: 80 -> 72 kg at 0.5 kg a week = 16 weeks (${await t('.cc-weeks')})`);
  await page.selectOption(R + '[data-k="goal"]', '0.25'); await page.waitForTimeout(100);
  check((await t('.cc-weeks')).includes('Pick a goal'), 'calorie: gaining while the goal weight is lower gives a hint, not NaN');
};
