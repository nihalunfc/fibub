// #T876 AC size
export const path = '/everyday/ac-size-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/ac-size-calculator/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.ac .${s}`)).trim();
  check((await t('ac-band')).includes('250 to 300 sq ft → 7,000') && (await t('ac-need')) === 'About 7,000 BTU/h', 'ac-size-calculator: 300 sq ft -> 7,000 BTU/h (ENERGY STAR band)');
  check((await t('ac-conv')) === '= 2.05 kW · 0.58 tons of cooling' && (await t('ac-unit')).includes('8,000 BTU/h'), 'ac-size-calculator: 2.05 kW, 0.58 tons, next unit 8,000');
  check((await t('ac-heat')).includes('about 2.79 kW'), 'ac-size-calculator: heating 27.9 m2 x 100 W/m2 = 2.79 kW');
  await page.selectOption('.ac [data-k="sun"]', '10');
  check((await t('ac-need')) === 'About 7,700 BTU/h', 'ac-size-calculator: very sunny +10% -> 7,700');
  await page.selectOption('.ac [data-k="sun"]', '0');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.ac [data-k="ppl"]', '3');
  check((await t('ac-need')) === 'About 7,600 BTU/h', 'ac-size-calculator: 3 people +600 -> 7,600');
  // Next smaller and larger sizes, the size chips and the chart table
  await page.fill('.ac [data-k="ppl"]', '2');
  check((await t('ac-unit')).includes('8,000 BTU/h (the size below, 6,000, is 14% short)'), 'ac-size-calculator: 7,000 -> next 8,000, 6,000 below is 14% short');
  check((await page.locator('.ac .ac-sizes li.pick').textContent()) === '8,000' && (await page.locator('.ac .ac-sizes li.lt').count()) === 2, 'ac-size-calculator: chip 8,000 picked, 5,000 and 6,000 struck out');
  check((await page.textContent('.ac .ac-tbl tr.now')).includes('250 to 300 sq ft') && (await page.locator('.ac .ac-tbl tbody tr').count()) === 14, 'ac-size-calculator: chart row for 300 sq ft highlighted, 14 rows');
  // Length x width fills the area: 15 x 20 = 300 -> 12 x 25 = 300; 10 x 15 = 150 -> 6,000? 150 is in the first band (up to 150): 5,000
  await page.fill('.ac [data-k="len"]', '10'); await page.fill('.ac [data-k="wid"]', '15');
  check((await page.inputValue('.ac [data-k="area"]')) === '150' && (await t('ac-need')) === 'About 5,000 BTU/h', 'ac-size-calculator: 10 x 15 ft = 150 sq ft -> 5,000 BTU/h');
  // Running cost: 5,000 BTU/h at EER 10 = 500 W; 8 h = 4 kWh a day; at 0.20 = 0.80 a day, 24 a month
  await page.fill('.ac [data-k="price"]', '0.2');
  check((await t('ac-cost')).includes('8,000') === false && (await t('ac-cost')).includes('0.5 kW') && (await t('ac-cost')).includes('4 kWh a day') && (await t('ac-cost')).includes('0.8 a day or 24 a month'), 'ac-size-calculator: running cost 0.5 kW, 4 kWh, 0.8 a day, 24 a month');
  await page.fill('.ac [data-k="eer"]', '0');
  check((await t('ac-cost')).includes('efficiency (EER) above 0'), 'ac-size-calculator: EER 0 gives a message');
  await page.fill('.ac [data-k="area"]', '-5');
  check((await t('ac-say')).includes('more than 0') && !(await page.textContent('.ac')).includes('NaN'), 'ac-size-calculator: negative area gives a message, no NaN');
};
