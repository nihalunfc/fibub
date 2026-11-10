// #T874 Roof calculator
export const path = '/everyday/roof-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/roof-calculator/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.rf ${s}`)).trim();
  check((await page.inputValue('.rf [data-p="deg"]')) === '26.57' && (await page.inputValue('.rf [data-p="pct"]')) === '50' && (await t('.rf-factor')).includes('1.118'), 'roof-calculator: 6:12 = 26.57°, 50%, factor 1.118');
  check((await t('.rf-plan')).startsWith('42 × 32 ft = 1,344') && (await t('.rf-area')).includes('= 1,502.6 sq ft'), 'roof-calculator: 32 x 42 ft x 1.118 = 1502.6 sq ft');
  check((await t('.rf-sq')) === '15.03 squares' && (await t('.rf-sqw')).startsWith('16.53 squares'), 'roof-calculator: 15.03 squares, 16.53 with 10% waste');
  check((await t('.rf-bundles')).startsWith('50 bundles'), 'roof-calculator: 50 bundles');
  await page.fill('.rf [data-p="deg"]', '45');
  check((await page.inputValue('.rf [data-p="x"]')) === '12' && (await page.inputValue('.rf [data-p="pct"]')) === '100', 'roof-calculator: 45° = 12:12 = 100%');
};
