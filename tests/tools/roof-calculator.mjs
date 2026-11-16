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
  await page.fill('.rf [data-p="x"]', '6'); await page.waitForTimeout(100);
  // Rafter, ridge, edges (6:12 gable, 42 x 32 ft with overhang): run 16 ft, rafter 16 x 1.118 = 17.89 ft
  check((await t('.rf-raf')).startsWith('17.89 ft') && (await t('.rf-rh')).startsWith('8 ft') && (await t('.rf-rl')).startsWith('42 ft'), 'roof-calculator: rafter 17.89 ft, ridge height 8 ft, ridge 42 ft');
  check((await t('.rf-eaves')) === '84 ft' && (await t('.rf-rakes')) === '35.78 ft', 'roof-calculator: gable eaves 84 ft, rakes 35.78 ft');
  check((await page.getAttribute('.rf .rf-svg polygon', 'points')).split(' ').length === 3, 'roof-calculator: side view drawn');
  await page.selectOption('.rf [data-k="shape"]', 'hip');
  check((await t('.rf-rl')).startsWith('10 ft') && (await t('.rf-eaves')) === '148 ft' && (await t('.rf-area')).includes('= 1,502.6 sq ft'), 'roof-calculator: hip ridge 10 ft, eaves 148 ft, same area');
  await page.selectOption('.rf [data-k="shape"]', 'shed');
  check((await t('.rf-rh')).startsWith('16 ft') && (await t('.rf-raf')).startsWith('35.78 ft'), 'roof-calculator: shed rafter 35.78 ft, high edge 16 ft');
  await page.selectOption('.rf [data-k="shape"]', 'gable');
  // Presets and slider keep the three boxes in step
  await page.click('.rf [data-preset="4"]');
  check((await page.inputValue('.rf [data-p="deg"]')) === '18.43' && (await page.inputValue('.rf [data-p="pct"]')) === '33.33' && (await page.inputValue('.rf [data-k="slider"]')) === '4', 'roof-calculator: 4:12 chip = 18.43 deg, 33.33%, slider 4');
  await page.$eval('.rf [data-k="slider"]', (e) => { e.value = '12'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await page.inputValue('.rf [data-p="x"]')) === '12' && (await page.inputValue('.rf [data-p="deg"]')) === '45', 'roof-calculator: slider 12 gives 12:12 = 45 deg');
  await page.click('.rf [data-preset="6"]');
  // More options: extra area and price
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.rf [data-k="price"]', '38');
  check((await t('.rf-cost')) === '50 × 38 = 1,900', 'roof-calculator: 50 bundles x 38 = 1,900');
  await page.fill('.rf [data-k="extra"]', '100');
  check((await t('.rf-area')).includes('= 1,602.6 sq ft') && (await t('.rf-bundles')).startsWith('53 bundles'), 'roof-calculator: 100 sq ft extra -> 1,602.6 sq ft, 53 bundles');
  await page.fill('.rf [data-k="extra"]', '');
  // Pitch note and friendly messages
  await page.click('.rf [data-preset="3"]');
  check((await t('.rf-pnote')).includes('low pitch'), 'roof-calculator: 3:12 gets the low-pitch note');
  await page.fill('.rf [data-p="deg"]', '95');
  check((await t('.rf-note')).includes('Type a pitch') && !(await page.textContent('.rf')).includes('NaN'), 'roof-calculator: 95 degrees gives a message, no NaN');
  await page.fill('.rf [data-p="x"]', '6'); await page.fill('.rf [data-k="w"]', '0');
  check((await t('.rf-note')).includes('more than 0'), 'roof-calculator: zero width gives a message');
};
