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
  await page.selectOption('.ac [data-k="sun"]', '0'); await page.fill('.ac [data-k="ppl"]', '3');
  check((await t('ac-need')) === 'About 7,600 BTU/h', 'ac-size-calculator: 3 people +600 -> 7,600');
};
