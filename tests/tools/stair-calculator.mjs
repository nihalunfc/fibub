// #T873 Stair calculator
export const path = '/everyday/stair-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/stair-calculator/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.st ${s}`)).trim();
  check((await t('.st-risers')).startsWith('15 of 7.2 in') && (await t('.st-treads')).startsWith('14 of 10 in'), 'stair-calculator: 108 in rise, 7.5 target gives 15 risers of 7.2 in and 14 treads');
  check((await t('.st-run')).startsWith('140 in') && (await t('.st-str')).startsWith('176.82 in'), 'stair-calculator: run 140 in, stringer 176.82 in');
  check((await t('.st-ang')).startsWith('35.8°'), 'stair-calculator: angle atan(7.2/10) = 35.8°');
  await page.fill('.st [data-k="rise"]', '96'); await page.fill('.st [data-k="target"]', '8');
  check((await t('.st-checks')).includes('Check: Riser 8 in: over the 7.75 in limit'), 'stair-calculator: 8 in riser flagged over the limit');
  await page.click('.st-units [data-u="m"]');
  check((await t('.st-checks')).includes('196 mm'), 'stair-calculator: metric limits');
  // New options: all start from the reset example
  await page.click('.st-units [data-u="i"]'); await page.click('.st .st-reset'); await page.waitForTimeout(80);
  check((await t('.st-buy')).startsWith('Shopping list: 15 risers, 14 treads') && (await t('.st-buy')).includes('4 stringers'), 'stair-calculator: shopping list 15 risers, 14 treads, 4 stringers at 36 in wide, 16 in spacing');
  check((await page.getAttribute('.st .st-svg polyline', 'points')).trim().split(' ').length === 30, 'stair-calculator: side view has 30 points for 15 risers');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.locator('.st .st-tbl tbody tr').count()) === 15 && (await page.textContent('.st .st-tbl tbody tr:last-child')).includes('108 in'), 'stair-calculator: step table has 15 rows ending at 108 in');
  // Feet and inches typed the way people say them
  await page.fill('.st [data-k="rise"]', "9' 6\""); await page.fill('.st [data-k="target"]', '7');
  check((await t('.st-risers')).startsWith('17 of 6.71 in'), 'stair-calculator: 9 ft 6 in rise, 7 in target -> 17 risers of 6.71 in');
  await page.fill('.st [data-k="rise"]', '9 ft'); await page.fill('.st [data-k="target"]', '7 1/2');
  check((await t('.st-risers')).startsWith('15 of 7.2 in'), 'stair-calculator: 9 ft and 7 1/2 in read as 108 and 7.5');
  // Slider moves the target; typing a target moves the slider
  await page.$eval('.st [data-k="tslide"]', (e) => { e.value = '8'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await page.inputValue('.st [data-k="target"]')) === '8' && (await t('.st-risers')).startsWith('14 of 7.71 in'), 'stair-calculator: slider 8 in -> target 8, 14 risers of 7.71 in');
  await page.fill('.st [data-k="target"]', '7');
  check((await page.inputValue('.st [data-k="tslide"]')) === '7', 'stair-calculator: typed target moves the slider');
  // Forced number of risers
  await page.fill('.st [data-k="target"]', '7.5'); await page.fill('.st [data-k="count"]', '12');
  check((await t('.st-risers')).startsWith('12 of 9 in') && (await t('.st-checks')).includes('Check: Riser 9 in: over'), 'stair-calculator: 12 risers forced -> 9 in, flagged over the limit');
  await page.fill('.st [data-k="count"]', '0');
  check((await t('.st-checks')).includes('whole number from 1 to 200'), 'stair-calculator: 0 risers gives a message');
  await page.fill('.st [data-k="count"]', ''); await page.fill('.st [data-k="rise"]', 'abc');
  check((await t('.st-checks')).includes('more than 0') && !(await page.textContent('.st')).includes('NaN'), 'stair-calculator: unreadable rise gives a message, no NaN');
  await page.click('.st .st-reset'); await page.waitForTimeout(80);
  await page.fill('.st [data-k="width"]', '48');
  check((await t('.st-buy')).includes('4 stringers'), 'stair-calculator: 48 in wide still 4 stringers (48 / 16 = 3 gaps)');
  await page.fill('.st [data-k="width"]', '60');
  check((await t('.st-buy')).includes('5 stringers'), 'stair-calculator: 60 in wide -> 5 stringers');
};
