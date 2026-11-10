// #T875 Gravel calculator
export const path = '/everyday/gravel-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/gravel-calculator/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.gc .${s}`)).trim();
  check((await t('gc-area')) === 'Area: 10 m²' && (await t('gc-vol')).startsWith('0.75 m³ · 0.981 yd³'), 'gravel-calculator: 5 x 2 m at 75 mm = 0.75 m3');
  check((await t('gc-wt')).startsWith('Weight: 1.2 t') && (await t('gc-bags')) === '48 bags of 25 kg', 'gravel-calculator: gravel 1.6 t/m3 -> 1.2 t, 48 bags of 25 kg');
  await page.selectOption('.gc [data-k="units"]', 'ft');
  const d = page.locator('.gc .gc-d');
  await d.nth(0).fill('9'); await d.nth(1).fill('9'); await page.fill('.gc [data-k="depth"]', '4');
  await page.selectOption('.gc [data-k="mat"]', { index: 4 }); await page.selectOption('.gc [data-k="bag"]', 'cf:3');
  check((await t('gc-vol')).includes('1 yd³ · 27 ft³') && (await t('gc-bags')) === '9 bags of 3 cu ft', 'gravel-calculator: 1 yd3 of mulch = 9 bags of 3 cu ft');
  await page.click('.gc .gc-add'); await page.selectOption('.gc .gc-a:nth-child(2) .gc-shape', 'circle'); await d.nth(2).fill('2');
  check((await t('gc-area')) === 'Area: 84.14 sq ft', 'gravel-calculator: adds a 2 ft circle (81 + 3.14 sq ft)');
};
