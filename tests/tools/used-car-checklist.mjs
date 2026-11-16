// #T910 Used car checklist
export const path = '/vehicles/used-car-checklist/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/used-car-checklist/`); await page.waitForTimeout(300);
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
  // more options: plain answer, repair costs and an offer, filter
  await page.goto(`${BASE}/vehicles/used-car-checklist/`); await page.waitForTimeout(300);
  const say = () => page.textContent('.uc .uc-say'), offer = () => page.textContent('.uc .uc-offer');
  check((await say()).includes('Mark each item'), 'used-car-checklist: starts with a prompt');
  check(await page.locator('.uc .uc-cost:visible').count() === 0, 'used-car-checklist: repair boxes hidden until Problem');
  await page.check('.uc [data-i="4"] input[value="problem"]'); await page.check('.uc [data-i="5"] input[value="problem"]'); await page.waitForTimeout(80);
  check(await page.locator('.uc .uc-cost:visible').count() === 2, 'used-car-checklist: a repair box shows for each Problem');
  await page.fill('.uc [data-cost="4"]', '500'); await page.fill('.uc [data-cost="5"]', '250'); await page.fill('.uc .uc-ask', '8000'); await page.waitForTimeout(80);
  check((await offer()).includes('Repairs you listed: 750') && (await offer()).includes('offer at most 7,250'), `used-car-checklist: 8,000 - 750 = 7,250 (${await offer()})`);
  await page.fill('.uc .uc-ask', '700'); await page.waitForTimeout(80);
  check((await offer()).includes('probably not worth buying'), 'used-car-checklist: repairs over the price warned');
  await page.selectOption('.uc .uc-show', 'problem'); await page.waitForTimeout(80);
  check(await page.locator('.uc .uc-item:visible').count() === 2, 'used-car-checklist: filter shows only the 2 problems');
  await page.selectOption('.uc .uc-show', 'open'); await page.waitForTimeout(80);
  check(await page.locator('.uc .uc-item:visible').count() === (await page.locator('.uc .uc-item').count()) - 2, 'used-car-checklist: filter hides the marked ones');
  await page.selectOption('.uc .uc-show', 'all');
  await page.check('.uc [data-i="0"] input[value="ok"]');
  const rfIdx2 = await page.evaluate(() => [...document.querySelectorAll('.uc .uc-item')].findIndex((e) => e.textContent.includes('RED FLAG')));
  await page.check(`.uc [data-i="${rfIdx2}"] input[value="problem"]`); await page.waitForTimeout(80);
  check((await say()).includes('Red flag found'), `used-car-checklist: red flag verdict (${await say()})`);
};
