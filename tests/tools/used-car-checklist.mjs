// #T911 Used car checklist
export const path = '/money/used-car-checklist/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/used-car-checklist/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.uc .uc-big'), flags = () => page.textContent('.uc .uc-flags');
  check((await big()).includes('Nothing checked'), 'used-car-checklist: starts with nothing checked');
  const n0 = await page.locator('.uc .uc-item').count();
  // find a red-flag item (flood signs) and two plain ones
  const rfIdx = await page.evaluate(() => [...document.querySelectorAll('.uc .uc-item')].findIndex((e) => e.textContent.includes('RED FLAG') && e.textContent.includes('damp smell')));
  const mark = async (i, v) => { await page.check(`.uc [data-i="${i}"] input[value="${v}"]`); };
  await mark(rfIdx, 'problem'); await mark(0, 'ok'); await mark(4, 'problem'); await mark(5, 'problem');
  await page.waitForTimeout(100);
  check((await big()).includes('Score 25% OK') && (await big()).includes('3 problems'), `used-car-checklist: 1 OK 3 problems = 25% (${await big()})`);
  check((await flags()).includes('Flood signs'), 'used-car-checklist: red flag listed');
  await page.selectOption('.uc .uc-veh', 'truck'); await page.waitForTimeout(100);
  check((await page.locator('.uc .uc-item').count()) !== n0 && (await big()).includes('Nothing checked'), 'used-car-checklist: truck set replaces the list');
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('.uc .uc-pdf')]);
  check(!!dl, 'used-car-checklist: PDF downloads');
};
