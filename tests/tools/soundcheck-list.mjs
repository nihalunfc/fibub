// #T1031 Soundcheck list
export const path = '/everyday/soundcheck-list/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/soundcheck-list/`); await page.waitForTimeout(300);
  const out = async () => (await page.textContent('.sl .sl-out')).trim();
  check((await out()) === '0 of 28 done (0%)', 'soundcheck-list: 4+4+5+3+5+3+4 = 28 items (' + (await out()) + ')');
  for (let i = 0; i < 8; i++) await page.locator('.sl .sl-it input[type=checkbox]').nth(i).check();
  check((await out()) === '8 of 28 done (29%)', 'soundcheck-list: 8 ticked = 29% (' + (await out()) + ')');
  await page.locator('.sl .sl-add').first().click();
  check((await out()) === '8 of 29 done (28%)', 'soundcheck-list: added item changes total (' + (await out()) + ')');
  await page.locator('.sl .sl-x').first().click();
  check((await out()).includes('of 28'), 'soundcheck-list: remove drops an item');
  await page.click('.sl .sl-reset');
  check((await out()) === '0 of 28 done (0%)', 'soundcheck-list: reset');
  check(!(await page.isChecked('.sl [data-k="save"]')), 'soundcheck-list: save box unticked');
};
