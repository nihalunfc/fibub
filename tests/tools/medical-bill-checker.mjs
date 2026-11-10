// #T908 Medical bill checker
export const path = '/money/medical-bill-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/medical-bill-checker/`); await page.waitForTimeout(400);
  await page.click('.mb .mb-ex'); await page.waitForTimeout(200);
  check((await page.locator('.mb .mb-rows tbody tr').count()) === 5, 'bill: 5 lines read');
  const items = await page.locator('.mb .mb-flags li').allTextContents();
  check(items.length === 3, `bill: 3 flags (${items.length})`);
  const letter = await page.inputValue('.mb .mb-letter');
  check(letter.includes('Room and board') && letter.includes('Blood panel') && letter.includes('Dressing pack'), 'bill: letter names flagged lines');
  await page.fill('.mb .mb-total', '1000'); await page.waitForTimeout(150);
  check((await page.locator('.mb .mb-flags li').count()) === 4, 'bill: total mismatch adds a flag');
  await page.click('.mb .mb-clear');
  check(await page.isHidden('.mb .mb-out'), 'bill: clear');
};
