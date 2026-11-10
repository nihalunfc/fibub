// #1602 Collection catalogue
export const path = '/collecting/collection-catalogue/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/collection-catalogue/`); await page.waitForTimeout(400);
  check(await page.isVisible('.cc .cc-empty'), 'catalogue: starts empty');
  await page.click('.cc .cc-example'); await page.waitForTimeout(100);
  check((await page.locator('.cc .cc-tab tbody tr').count()) === 4, 'catalogue: example adds 4 items');
  check((await page.textContent('.cc .cc-count')).startsWith('6'), 'catalogue: counts quantities (6 pieces)');
  check(/675/.test(await page.textContent('.cc .cc-cost')) && /746/.test(await page.textContent('.cc .cc-value')), 'catalogue: totals paid 675 and value 746');
  check(/\d/.test(await page.textContent('.cc .cc-melt')), 'catalogue: shows a melt value');
  await page.fill('.cc .cc-search', 'sovereign');
  check((await page.locator('.cc .cc-tab tbody tr').count()) === 1, 'catalogue: search filters');
  await page.fill('.cc .cc-search', '');
  await page.fill('.cc input[name=name]', 'Test coin'); await page.fill('.cc input[name=cost]', '25'); await page.click('.cc .cc-save');
  check((await page.locator('.cc .cc-tab tbody tr').count()) === 5 && /700/.test(await page.textContent('.cc .cc-cost')), 'catalogue: adding an item updates totals');
  await page.click('.cc tr:has-text("Test coin") button[data-act=del]');
  check((await page.locator('.cc .cc-tab tbody tr').count()) === 4, 'catalogue: delete removes a row');
  check(await page.evaluate(() => !localStorage.getItem('fibub-collection-v1')), 'catalogue: nothing kept unless ticked');
  await page.check('.cc .cc-remember');
  check(await page.evaluate(() => JSON.parse(localStorage.getItem('fibub-collection-v1') || '{}').items?.length === 4), 'catalogue: ticking keeps the list');
  await page.uncheck('.cc .cc-remember');
  check(await page.evaluate(() => !localStorage.getItem('fibub-collection-v1')), 'catalogue: unticking deletes it');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cc .cc-csv')]);
  check(d.suggestedFilename() === 'my-collection.csv', 'catalogue: CSV download');
};
