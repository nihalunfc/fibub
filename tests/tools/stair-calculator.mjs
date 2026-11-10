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
};
