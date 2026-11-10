// #T888 Home contents inventory for insurance
export const path = '/money/home-inventory/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/home-inventory/`); await page.waitForTimeout(300);
  const txt = async (c) => page.textContent(`.hi ${c}`);
  await page.selectOption('.hi [data-k="cur"]', 'USD');
  const repl = page.locator('.hi .hi-row [data-f="repl"]');
  await repl.nth(0).fill('1000'); await repl.nth(1).fill('500'); await page.fill('.hi [data-k="si"]', '1000'); await page.waitForTimeout(100);
  check((await txt('.hi-s-rep')).includes('1,500'), 'home-inventory: total 1,500 (' + (await txt('.hi-s-rep')) + ')');
  check((await txt('.hi-s-gap')).includes('500'), 'home-inventory: shortfall 500 (' + (await txt('.hi-s-gap')) + ')');
  await page.click('.hi .hi-add'); await page.waitForTimeout(100);
  check((await page.$$('.hi .hi-row')).length === 3, 'home-inventory: add makes a third row');
  await page.locator('.hi .hi-row [data-f="item"]').nth(0).fill('Sofa-test'); await page.waitForTimeout(100);
  await page.reload(); await page.waitForTimeout(300);
  check((await page.$$('.hi .hi-row')).length === 2 && (await page.inputValue('.hi .hi-row [data-f="item"]')) !== 'Sofa-test', 'home-inventory: reloading without the box ticked keeps nothing');
  await page.check('.hi .hi-keepbox'); await page.locator('.hi .hi-row [data-f="item"]').nth(0).fill('Sofa-test'); await page.waitForTimeout(100);
  await page.reload(); await page.waitForTimeout(300);
  check((await page.inputValue('.hi .hi-row [data-f="item"]')) === 'Sofa-test', 'home-inventory: ticked box keeps the list');
  await page.click('.hi .hi-clear'); await page.reload(); await page.waitForTimeout(300);
  check((await page.inputValue('.hi .hi-row [data-f="item"]')) !== 'Sofa-test', 'home-inventory: Clear removes the saved list');
};
