// Shift scheduler: fairness check and print button
export const path = '/everyday/shift-scheduler/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/shift-scheduler/`); await page.waitForTimeout(400);
  await page.click('.shs .sh-fill'); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelectorAll('.shs details').forEach((d) => (d.open = true)));
  const rows = await page.$$('.shs .sh-fair-t tbody tr');
  check(rows.length > 0, 'shift-scheduler: fairness table has a row per person');
  check((await page.textContent('.shs .sh-fair-line')).includes('hours each'), 'shift-scheduler: fairness line');
  check(await page.isVisible('.shs .sh-print'), 'shift-scheduler: print button');
};
