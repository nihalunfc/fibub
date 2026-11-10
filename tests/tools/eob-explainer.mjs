// #T882 Explanation of benefits (EOB) checker
export const path = '/money/eob-explainer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/eob-explainer/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.eob [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.eob ${c}`);
  await page.selectOption('.eob .eob-cur', 'USD');
  await set('ded', '500'); await set('met', '0'); await set('coins', '20'); await set('copay', '0'); await set('oop', '0');
  await page.fill('.eob-rows tr:first-child [data-c="2"]', '1000'); await page.fill('.eob-rows tr:first-child [data-c="3"]', '400'); await page.fill('.eob-rows tr:first-child [data-c="4"]', '600');
  await page.waitForTimeout(100);
  check((await txt('.eob-s-owe')).includes('600.00') && (await txt('.eob-body')).includes('400.00'), 'eob-explainer: owe 600, plan pays 400 (' + (await txt('.eob-s-owe')) + ')');
  check((await txt('.eob-s-bad')) === '0', 'eob-explainer: a matching EOB is not flagged');
  await page.fill('.eob-rows tr:first-child [data-c="4"]', '700'); await page.waitForTimeout(100);
  check((await txt('.eob-s-bad')) === '1' && (await txt('.eob-body')).includes('Differs'), 'eob-explainer: EOB owe 700 is flagged');
  await page.click('.eob .eob-add'); await page.waitForTimeout(100);
  check((await page.$$('.eob .eob-rows tr')).length === 2, 'eob-explainer: add a line');
  await page.fill('.eob-rows tr:nth-child(2) [data-c="2"]', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.eob .eob-err'), 'eob-explainer: allowed 0 shows a message');
};
